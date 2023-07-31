import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-address-master-list',
  templateUrl: './address-master-list.component.html',
})
export class AddressMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    "addressCode": "Address Code",
    "manualCode": "Manual Code",
    "cityName": "City Name",
    "address": "Address",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    "addressCode": "Address Code",
    "manualCode": "Manual Code",
    "cityName": "City Name",
    "address": "Address",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Address Master",
      items: ["Home"],
      active: "Address Master",
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
    this.addAndEditPath = "/Masters/AddressMaster/AddAddressMaster";
  }
  ngOnInit(): void {
    this.getAddressDetails();
  }
  getAddressDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "address_detail"
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