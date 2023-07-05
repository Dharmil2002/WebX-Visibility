import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-customer-group-list',
  templateUrl: './customer-group-list.component.html',
})
export class CustomerGroupListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
    "srNo":"Sr No",
    "groupCode": "Group Code",
    "groupName": "Group Name",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  breadScrums = [
    {
      title: "Customer Group Master",
      items: ["Home"],
      active: "Customer Group Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  constructor(private http: HttpClient,private masterService: MasterService,) {
  this.addAndEditPath = "/Masters/CustomerGroupMaster/AddCustomerGroupMaster";
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