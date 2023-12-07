import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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

  columnHeader =
    {
      // "srNo": "Sr No",
      "updatedDate": "Created Date",
      "addressCode": "Address Code",
      "manualCode": "Manual Code",
      "cityName": "City Name",
      "address": "Address",
      "activeFlag": "Active Flag",
      "actions": "Actions",
    }
  staticField = [
    "updatedDate",
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


  async getAddressDetails() {
    try {
      const req = {
        "companyCode": this.companyCode,
        "filter": {},
        "collectionName": "address_detail"
      };
      const res: any = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      if (res && res.data) {
        const data = res.data;
        // Sort the data based on updatedDate in descending order
        const dataWithDate = data.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
        // Extract the updatedDate from the first element (latest record)
        const latestUpdatedDate = dataWithDate.length > 0 ? dataWithDate[0].updatedDate : null;
        // Use latestUpdatedDate as needed
        this.csv = dataWithDate;
        this.tableData = dataWithDate;
      }
      this.tableLoad = false;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching address details:", error);
    }
  }

  async isActiveFuntion(det) {
    try {
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
      const res: any = await firstValueFrom(this.masterService.masterPut('generic/update', req))
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
    } catch (error) {
      // Handle errors here
      console.error("Error updating address details:", error);
    }
  }
}
