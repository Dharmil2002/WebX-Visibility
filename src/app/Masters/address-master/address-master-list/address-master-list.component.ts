import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address-master-list',
  templateUrl: './address-master-list.component.html',
})
export class AddressMasterListComponent implements OnInit {
  tableData: any[];
  csv: any[];
  menuItemflag: boolean = false;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  columnHeader = {
    srNo: {
      Title: "Sr No",
      class: "matcolumnleft",
      Style: "max-width:90px",
    },
    addressCode: {
      Title: "Address Code",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    manualCode: {
      Title: "Manual Code",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    cityName: {
      Title: "City Name",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    address: {
      Title: "Address",
      class: "matcolumnleft",
      Style: "max-width:480px; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-y: auto; max-height: 3em;",
    },
    activeFlag: {
      Title: "Active Status",
      class: "matcolumnleft",
      Style: "max-width:100px",
    },
    actions: {
      Title: "Active Status",
      class: "matcolumnleft",
      Style: "max-width:100px",
    },
  };
  staticField = [
    "srNo",
    "addressCode",
    "manualCode",
    "cityName",
    "address",
  ];
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/AddressMaster/AddAddressMaster";
  }
  ngOnInit(): void {
    this.getAddressDetails();
  }
  getAddressDetails() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "address_detail",
      "filter": {}
    }
    this.masterService.masterPost('generic/get', req).subscribe({
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
          this.tableLoad = false;
        }
      }
    })
  }

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "address_detail",
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
          this.getAddressDetails();
        }
      }
    });
  }
}
