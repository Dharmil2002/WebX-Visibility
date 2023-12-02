import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-group-list',
  templateUrl: './customer-group-list.component.html',
})
export class CustomerGroupListComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    "groupCode": "Group Code",
    "groupName": "Group Name",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };
  headerForCsv = {
    "groupCode": "Group Code",
    "groupName": "Group Name",
    "activeFlag": "Active Status"
    }
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
    csv: true
  }
  addAndEditPath: string;
  csvFileName: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CustomerGroupMaster/AddCustomerGroupMaster";
  }
  ngOnInit(): void {
    this.csvFileName = "Customer Group Details";
    this.getCustomerDetails();
  }
  //To get List data for Customer Group MAster
  getCustomerDetails() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "customerGroup_detail",
      "filter": {}
    }
    firstValueFrom(this.masterService.masterPost('generic/get', req))
    .then((res: any) => {
      if (res) {
        // Generate srno for each object in the array
        const dataWithSrno = res.data.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1
          };
        });
        this.csv = dataWithSrno
        this.tableLoad = false;
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customerGroup_detail",
      filter: { _id: id },
      update: det
    };
    firstValueFrom(this.masterService.masterPut('generic/update', req))
    .then((res: any) => {
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.getCustomerDetails();
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error updating data:", error);
    });
  }

}
