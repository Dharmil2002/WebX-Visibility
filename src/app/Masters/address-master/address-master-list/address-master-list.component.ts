import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { AddressMasterUploadComponent } from '../address-master-upload/address-master-upload.component';
import { MatDialog } from '@angular/material/dialog';

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
  companyCode: any = 0;
  uploadComponent = AddressMasterUploadComponent
  linkArray = []
  columnHeader = {
    addressCode: {
      Title: "Address Code",
      class: "matcolumnleft",
      Style: "max-width:150px",
      sticky: true,
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
    eNTDT: {
      Title: "Created Date",
      class: "matcolumnleft",
      Style: "max-width:150px",
      // datatype: "datetime",
    },
    activeFlag: {
      type: "Activetoggle",
      Title: "Active",
      class: "matcolumncenter",
      Style: "max-width:100px",
      functionName: "ActiveFunction",
    },
    actions: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:100px",
      stickyEnd: true,
    },
  };
  staticField = [
    "eNTDT",
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
  constructor(private masterService: MasterService, private storage: StorageService,private dialog: MatDialog) {
    this.companyCode = this.storage.companyCode;
    this.addAndEditPath = "/Masters/AddressMaster/AddAddressMaster";
  }
  ngOnInit(): void {
    this.getAddressDetails();
  }
  getAddressDetails() {
    const request = {
      companyCode: this.companyCode,
      collectionName: "address_detail",
      filter: {}
    };
    this.masterService.masterPost('generic/get', request).subscribe({
      next: (response: any) => {
        if (response) {
          // Sort the data by updatedDate in descending order (most recent first)
          const sortedData = response.data.sort((a, b) => {
            return new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime();
          });
          // Generate srno for each object in the array and format the eNTDT
          const dataWithFormattedDate = sortedData.map((item, index) => {
            const formattedDate = moment(item.eNTDT).format("DD-MM-YYYY HH:mm");
            return {
              ...item,
              eNTDT: formattedDate,
            };
          });
          // Extract the updatedDate from the first element (latest record)
          const latestUpdatedDate = sortedData.length > 0 ? sortedData[0].eNTDT : null;
          this.csv = dataWithFormattedDate;
          this.tableLoad = false;
        }
      }
    });
  }

  async ActiveFunction(event) {
    const Body = {
      activeFlag:event.data.activeFlag
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "address_detail",
      filter: { _id: event.data._id },
      update: Body,
    };
    const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
    if(res.success){
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

    //#region to call upload function
    upload() {
      const dialogRef = this.dialog.open(this.uploadComponent, {
        width: "800px",
        height: "500px",
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getAddressDetails();
      });
    }
    //#endregion
}
