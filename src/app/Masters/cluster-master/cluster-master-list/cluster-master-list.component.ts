import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

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
  // {
  //   "srNo": "Sr No",
  //   "addressCode": "Address Code",
  //   "manualCode": "Manual Code",
  //   "city": "City Name",
  //   "address": "Address",
  //   "activeFlag": "Active Status",
  //   "actions": "Actions"
  // };
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
    this.getAddressDetails();
  }
  getAddressDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "cluster"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
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
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    })
  }
}
