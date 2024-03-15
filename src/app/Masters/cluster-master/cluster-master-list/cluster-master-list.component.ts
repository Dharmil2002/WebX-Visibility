import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
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
      "eNTDT": "Created Date",
      "clusterCode": "Cluster Code",
      "clusterName": "Cluster Name",
      "pincode": "Pincode",
      "activeFlag": "Active Status",
      "actions": "Actions"
    }
  headerForCsv = {
    // "srNo": "Sr No.",
    "eNTDT": "Created Date",
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
  //#region to get clusterList
  async getClusterDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "cluster_detail"
    };

    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));

    if (res && res.data) {
      // Sort the data based on entryDate in descending order
      const sortedData = res.data.sort((a, b) => b._id.localeCompare(a._id));
      // Generate srno for each object in the array
      const dataWithSrno = sortedData.map((obj) => {
        // Check and format the "pincode" column if it exists
        const formattedPincode = obj.pincode && Array.isArray(obj.pincode) ? obj.pincode.join(', ') : obj.pincode;

        return {
          ...obj,
          eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : '',
          pincode: formattedPincode
        }
      })
      this.csv = dataWithSrno;
      this.tableLoad = false;
    };
  }
  //#endregion
  //#region to manage flag 
  async IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.eNTDT;
    delete det.pincode;
    det['mODDT'] = new Date()
    det['mODBY'] = localStorage.getItem("UserName")
    det['mODLOC'] = localStorage.getItem("Branch")
    let req = {
      companyCode: this.companyCode,
      collectionName: "cluster_detail",
      filter: { _id: id },
      update: det
    };
    const res = await firstValueFrom(this.masterService.masterPut('generic/update', req))
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
  //#endregion
}