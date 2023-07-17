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
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
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
  tableData: any;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CustomerMaster/AddCustomerMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getCustomerDetails();
  }
  getCustomerDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "customer"
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
