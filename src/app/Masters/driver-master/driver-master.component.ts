import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
    // "srNo": "Sr No",
    "updatedDate": "Created Date",
    'manualDriverCode': 'Driver Code',
    'driverName': 'Driver Name',
    'licenseNo': 'License No',
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    // "srNo": "Sr No",
    'manualDriverCode': 'Driver Code',
    'driverName': 'Driver Name',
    'licenseNo': 'License No',
    "activeFlag": "Active Status",
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
    csv: true
  }
  addAndEditPath: string;
  csvFileName: string;
  tableData: any;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }

  ngOnInit(): void {
    this.csvFileName = "Driver Details";
    this.getDriverDetails();
  }

  async getDriverDetails() {
    try {
      const req = {
        "companyCode": this.companyCode,
        "filter": {},
        "collectionName": "driver_detail"
      };
      const res: any = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      if (res && res.data) {
        const data = res.data;
        // Sort the data based on updatedDate in descending order
        const dataWithDate = data.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
        // Extract the updatedDate from the first element (latest record)
        const latestUpdatedDate = dataWithDate.length > 0 ? dataWithDate[0].updatedDate : null;
        // Use latestUpdatedDate as needed
        this.csv = dataWithDate;
        this.tableData = dataWithDate;
      }
      this.tableLoad = false;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching driver details:", error);
    }
  }

  async IsActiveFuntion(det) {
    try {
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
      const res: any = await firstValueFrom(this.masterService.masterPut('generic/update', req))
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
    } catch (error) {
      // Handle errors here
      console.error("Error updating driver details:", error);
    }
  }
}
