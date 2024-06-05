import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { ClusterMasterUploadComponent } from '../cluster-master-upload/cluster-master-upload.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cluster-master-list',
  templateUrl: './cluster-master-list.component.html',
})
export class ClusterMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = 0;
  linkArray = []
  columnHeader =
    {
      // "srNo": "Sr No.",
      "clusterCode": {
        Title: "Cluster Code",
        class: "matcolumncenter",
        Style: "min-width:150px; max-width:150px",
        sticky: true,
      },
      "clusterName": {
        Title: "Cluster Name",
        class: "matcolumncenter",
        Style: "min-width:200px; max-width:200px",
        sticky: true,
      },
      "pincodeDisplay": {
        Title: "Pincode",
        class: "matcolumncenter",
        Style: "max-width:300px; max-width:600px; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-y: auto; max-height: 3em;"
      },
      "activeFlag": {
        type: "Activetoggle",
        Title: "Active",
        class: "matcolumncenter",
        Style: "min-width:80px; max-width:80px",
        functionName: "IsActiveFuntion",
      },
      "eNTDT": {
        Title: "Created Date",
        class: "matcolumncenter",
        Style: "min-width:150px; max-width:150px",
        datatype: "datetime",
      },
      "EditAction": {
        type: "iconClick",
        Title: "",
        class: "matcolumncenter",
        Style: "min-width:80px; max-width:80px;",
        functionName: "EditFunction",
        iconName: "edit",
        stickyEnd: true,
      },
    }
  headerForCsv = {
    // "srNo": "Sr No.",
    "clusterCode": "Cluster Code",
    "clusterName": "Cluster Name",
    "pincodeDisplay": "Pincode",
    "eNTDT": "Created Date",
    "activeFlag": "Active Status",
  }
  staticField = ["clusterCode", "clusterName", "pincodeDisplay", "eNTDT"];

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
  uploadComponent = ClusterMasterUploadComponent
  constructor(
    private route: Router,
    private masterService: MasterService, private storage: StorageService, private dialog: MatDialog) {
    this.companyCode = this.storage.companyCode;
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
          eNTDT: obj.eNTDT,
          pincodeDisplay: formattedPincode
        }
      })
      this.csv = dataWithSrno;
      this.tableLoad = false;
    };
  }
  //#endregion

  AddNew() {
    this.route.navigateByUrl(this.addAndEditPath);
  }

  EditFunction(event) {
    this.route.navigate([this.addAndEditPath], { state: { data: event?.data } });
  }

  //#region to manage flag
  async IsActiveFuntion(det) {
    let id = det.data._id;
    // Remove the "id" field from the form controls
    delete det.data._id;
    delete det.data.eNTDT;
    delete det.data.pincode;
    det['mODDT'] = new Date();
    det['mODBY'] = this.storage.userName;
    det['mODLOC'] = this.storage.branch;
    let req = {
      companyCode: this.companyCode,
      collectionName: "cluster_detail",
      filter: { _id: id },
      update: det.data
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


  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getClusterDetails();
    });
  }
  //#endregion
}
