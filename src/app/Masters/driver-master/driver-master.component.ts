import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
})
export class DriverMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    'manualDriverCode': 'Driver Code',
    'driverName': 'Driver Name',
    'licenseNo': 'License No',
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    "SrNo": "Sr No",
    'ManualDriverCode': 'Driver Code',
    'DriverName': 'Driver Name',
    'LicenseNo': 'License No',
    "ActiveFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Driver Master",
      items: ["Home"],
      active: "Driver Master",
    },
  ];

  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }
  ngOnInit(): void {
    this.getDriverDetails();
  }
  getDriverDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "driver_detail"
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
      collectionName: "driver_detail",
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
          this.getDriverDetails();
        }
      }
    });
  }
}
