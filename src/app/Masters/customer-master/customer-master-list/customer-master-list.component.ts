import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-customer-master-list',
  templateUrl: './customer-master-list.component.html',
})
export class CustomerMasterListComponent implements OnInit {
  jsonUrl = '../../../assets/data/masters-data.json'
  data: [] | any;
  csv: any[];
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["ActiveFlag"]
  linkArray = []
  columnHeader = {
    'GroupCode': 'Group Code',
    'CustomerCode': 'Customer Code',
    'CustomerName': 'Customer Name',
    "ActiveFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    'GroupCode': 'Group Code',
    'CustomerCode': 'Customer Code',
    'CustomerName': 'Customer Name',
    "ActiveFlag": "Active Status"
  }
  breadscrums = [
    {
      title: "Customer Master",
      items: ["Home"],
      active: "Customer Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  addAndEditPath: string;
  constructor(private http: HttpClient) {
    this.addAndEditPath = "/Masters/CustomerMaster/AddCustomerMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getCustomerDetails();
  }
  getCustomerDetails() {
    //throw new Error("Method not implemented."); 
    //Fetch data from the JSON endpoint
    this.http.get(this.jsonUrl).subscribe((res: any) => {
      this.data = res;
      this.csv = this.data['CustomerData']
      //Extract relevant data arrays from the response
      //const tableArray = this.data['tabledata'];
      this.tableload = false;
    }
    );
  }
}
