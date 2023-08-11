import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
})
export class LocationMasterComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  columnHeader = {
    "srNo": "Sr No",
    'locCode': 'Location Code',
    'locName': 'Location Name',
    'locAddr': 'Location Address',
    'reportLoc': 'Reporting Location',
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    'locCode': 'Location Code',
    'locName': 'Location Name',
    'locAddress': 'Location Address',
    'reportLoc': 'Reporting Location',
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Location Master",
      items: ["Home"],
      active: "Location Master",
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getLocationDetails();
  }
  getLocationDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "location_detail"
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
          console.log(this.csv);
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    })
  }

  IsActiveFuntion(det) {
    let id = det.id;
    // Remove the "id" field from the form controls
    delete det.id;
  //  delete det.srNo;
    let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        type: "masters",
        collection: "location_detail",
        id: id,
        updates: det
    };
    this.masterService.masterPut('common/update', req).subscribe({
        next: (res: any) => {
            if (res) {
                // Display success message
                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                });
            }
        }
    });
}
  
}