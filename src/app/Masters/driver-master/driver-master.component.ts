import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DriverMasterUploadComponent } from './driver-master-upload/driver-master-upload.component';
@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
})
export class DriverMasterComponent implements OnInit {
  companyCode: any = 0;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  uploadComponent = DriverMasterUploadComponent;
  columnHeader = {
    "eNTDT": "Created Date",
    'manualDriverCode': 'Driver Code',
    'driverName': 'Driver Name',
    'licenseNo': 'License No',
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
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
  constructor(private masterService: MasterService, private storage: StorageService,private dialog: MatDialog) {
    this.companyCode = this.storage.companyCode;
    this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }

  ngOnInit(): void {
    this.getDriverDetails();
    this.csvFileName = "Driver Details";
  }

  async getDriverDetails() {
    const req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "driver_detail"
    };

    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req))
    if (res && res.data) {
      const data = res.data
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.eNTDT).getTime(); // Convert to a number
        const dateB = new Date(b.eNTDT).getTime(); // Convert to a number
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
        return 0; // Handle invalid dates or NaN values
      })
      const dataWithDate = data.map(item => ({
        ...item,
        vendorName: item.vendorName ? item.vendorName : '',
        eNTDT: formatDocketDate(item.eNTDT)
      }));

      this.csv = dataWithDate;
      this.tableData = dataWithDate;
    }

    this.tableLoad = false;

  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    let req = {
      companyCode: this.storage.companyCode,
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

  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getDriverDetails();
    });
  }
}
