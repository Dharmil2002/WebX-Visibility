import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
@Component({
  selector: 'app-customer-master-list',
  templateUrl: './customer-master-list.component.html',
})
export class CustomerMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    "groupCode": "Group Code",
    "customerCode": "Customer Code",
    "customerName": "Customer Name",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    "groupCode": "Group Code",
    "customerCode": "Customer Code",
    "customerName": "Customer Name",
    "activeFlag": "Active Status",
  }
  breadScrums = [
    {
      title: "Customer Master",
      items: ["Home"],
      active: "Customer Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CustomerMaster/AddCustomerMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getCustomerDetails();
  }
  getCustomerDetails() {
    //throw new Error("Method not implemented."); 
    //Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.data = res;
      this.csv = this.data['customerGroupData']
      //Extract relevant data arrays from the response
      //const tableArray = this.data['tabledata'];
      this.tableLoad = false;
    }
    );
  }
}
