import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
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
    // "srNo": "Sr No",
    "updatedDate": "Created Date",
    "customerGroup": "Customer Group",
    "customerCode": "Customer Code",
    "customerName": "Customer Name",
    "activeFlag": "Active Status",
    "actions": "Actions"
  };

  headerForCsv = {
    // "srNo": "Sr No",
    "customerGroup": "Customer Group",
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
    csv: true
  }

  addAndEditPath: string;
  tableData: any;
  csvFileName: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CustomerMaster/AddCustomerMaster";
  }

  ngOnInit(): void {
    this.csvFileName = "Customer Details";
    this.getCustomerDetails();
  }

  // getCustomerDetails() {
  //   let req = {
  //     "companyCode": this.companyCode,
  //     "filter": {},
  //     "collectionName": "customer_detail"
  //   }
  //   this.masterService.masterPost('generic/get', req).subscribe({
  //     next: (res: any) => {
  //       if (res) {
  //         debugger
  //         // Generate srno for each object in the array
  //         const dataWithSrno = res.data.map((obj, index) => {
  //           return {
  //             ...obj,
  //             srNo: index + 1,
  //             activeFlag:obj.activeFlag == 'Y'?true:false
  //           };
  //         });
  //         this.csv = dataWithSrno
  //         this.tableData = dataWithSrno;
  //         this.tableLoad = false;
  //       }
  //     }
  //   })
  // }

  getCustomerDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "customer_detail"
    };

    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {

          // Sort the data based on updatedDate in descending order
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
          });

          // Generate srno for each object in the array
          const dataWithSrno = sortedData.map((obj, index) => {
            return {
              ...obj,
              // srNo: index + 1,
              activeFlag: obj.activeFlag === 'Y',
            };
          });

          // Extract the updatedDate from the first element (latest record)
          const latestUpdatedDate = sortedData.length > 0 ? sortedData[0].updatedDate : null;

          // Use latestUpdatedDate as needed
          console.log('Latest Updated Date:', latestUpdatedDate);

          this.csv = dataWithSrno;
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    });
  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    // delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customer_detail",
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
          this.getCustomerDetails();
        }
      }
    });
  }
}
