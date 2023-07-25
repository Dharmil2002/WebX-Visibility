import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-customer-group-list',
  templateUrl: './customer-group-list.component.html',
})
export class CustomerGroupListComponent implements OnInit {
  data: [] | any;
  companyCode: any = parseInt(localStorage.getItem("companyCode")); 
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
  tableData: any;
  constructor(private masterService: MasterService) {
  this.addAndEditPath = "/Masters/CustomerGroupMaster/AddCustomerGroupMaster";
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.getCustomerDetails();
  }
  //To get List data for Customer Group MAster
  getCustomerDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "customerGroup_detail"
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