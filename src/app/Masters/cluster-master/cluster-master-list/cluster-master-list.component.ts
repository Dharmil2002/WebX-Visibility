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
      "srNo": "Sr No.",
      "clusterCode": "Cluster Code",
      "clusterName": "Cluster Name",
      "pincode": "Pincode",
      "activeFlag": "Active Status",
      "actions": "Actions"
    }
  headerForCsv = {
    "srNo": "Sr No.",
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
    csv: false
  }
  addAndEditPath: string;
  tableData: any;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/ClusterMaster/AddClusterMaster";
  }
  ngOnInit(): void {
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
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
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
