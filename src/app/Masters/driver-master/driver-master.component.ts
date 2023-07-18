import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
})
export class DriverMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode")); 
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
      "srNo": "Sr No",
      'manualDriverCode': 'Driver Code',
      'driverName': 'Driver Name',
      'licenseNo': 'License No',
      'validityDate': 'Validity Date',
      "activeFlag": "Active Status",
      "actions": "Actions"
  };
  headerForCsv = {
    "SrNo": "Sr No",
    'ManualDriverCode': 'Driver Code',
    'DriverName': 'Driver Name',
    'LicenseNo': 'License No',
    'ValdityDate': 'Validity Date',
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
  cityActiveFlag: any;
  addAndEditPath: string;
  tableData: any;
  constructor(private masterService: MasterService){
      this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }
  ngOnInit(): void {
      //throw new Error("Method not implemented.");
      this.getDriverDetails();
  }
  getDriverDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "driver"
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
