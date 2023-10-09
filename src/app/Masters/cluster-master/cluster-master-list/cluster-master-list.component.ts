import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cluster-master-list',
  templateUrl: './cluster-master-list.component.html',
})
export class ClusterMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  columnHeader =
    {
      // "srNo": "Sr No.",
      "entryDate": "Created Date",
      "clusterCode": "Cluster Code",
      "clusterName": "Cluster Name",
      "pincode": "Pincode",
      "activeFlag": "Active Status",
      "actions": "Actions"
    }
  headerForCsv = {
    // "srNo": "Sr No.",
    "entryDate": "Created Date",
    "clusterCode": "Cluster Code",
    "clusterName": "Cluster Name",
    "pincode": "Pincode",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Cluster Master",
      items: ["Home"],
      active: "Cluster Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  addAndEditPath: string;
  tableData: any;
  csvFileName: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/ClusterMaster/AddClusterMaster";
  }
  ngOnInit(): void {
    this.csvFileName = "Cluster Master";
    this.getClusterDetails();
  }
  getClusterDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "cluster_detail"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
           // Sort the data based on entryDate in descending order
           const sortedData = res.data.sort((a, b) => {
            return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
          });
          // Generate srno for each object in the array
          const dataWithSrno = sortedData.map((obj, index) => {
            return {
              ...obj,
              // srNo: index + 1
            };
          });
          const latestUpdatedDate = sortedData.length > 0 ? sortedData[0].entryDate : null;
          this.csv = dataWithSrno
          this.tableLoad = false;
        }
      }
    })
  }
  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "cluster_detail",
      filter: { _id: id },
      update: det
    };
    this.masterService.masterPut('generic/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.getClusterDetails();
        }
      }
    });
  }
}
