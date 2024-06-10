import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { UploadLocationComponent } from './upload-location/upload-location.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
})
export class LocationMasterComponent implements OnInit {
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: any = 0;
  columnHeader = {
    eNTDT: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "max-width: 50%",
    },
    locCode: {
      Title: "Code",
      class: "matcolumnleft",
      Style: "max-width:10%",
    },
    locName: {
      Title: "Name",
      class: "matcolumnleft",
      Style: "max-width:13%",
    },
    ownership: {
      Title: "Ownership",
      class: "matcolumnleft",
      Style: "max-width:12%",
    },
    reportLoc: {
      Title: "Report To",
      class: "matcolumnleft",
      Style: "max-width:10%",
    },
    locCity: {
      Title: "City",
      class: "matcolumnleft",
      Style: "max-width:15%",
    },
    locPincode: {
      Title: "Pincode",
      class: "matcolumnleft",
      Style: "max-width:10%",
    },
    activeFlag: {
      Title: "Active",
      class: "matcolumncenter",
      Style: "max-width:8%",
      type: "Activetoggle",
      functionName: "IsActiveFuntion",
    },
    actions: {
      Title: "Actions",
      class: "matcolumnleft",
      Style: "max-width:8%",
    },
    // 'eNTDT': 'Created Date',
    // 'locCode': 'Code',
    // 'locName': 'Name',
    // 'ownership': 'Ownership',
    // 'reportLoc': 'Report To',
    // 'locCity': 'City',
    // 'locPincode': 'Pincode',
    // "activeFlag": "Active",
    // "actions": "Actions"
  };
  // columnWidths = {
  //   'eNTDT': 'max-width: 50%',
  //   'locCode': 'max-width:10%',
  //   'locName': 'max-width:13%',
  //   'ownership': 'max-width:12%',
  //   'locPincode': 'align-self: center;max-width:10%;',
  //   'locCity': 'max-width:15%',
  //   'reportLoc': 'max-width:10%',
  //   'activeFlag': 'max-width:8%',
  //   'actions': 'max-width:8%'
  // };
  headerForCsv = {
    'locCode': 'Location Code',
    'locName': 'Location Name',
    'locHirarchay': "Location Hirarchay",
    'reportingto': "Reporting to",
    'reportLoc': 'Reporting Location',
    'locPincode': 'Pin Code',
    'locRegion': 'Zone',
    'locCountry': 'Country',
    'locCity': 'City',
    'locState': 'State',
    'locAddr': 'Address',
    'ownership': 'Location Ownership',
    'Latitude': 'Lat',
    'Longitude': 'Log',
    'mappedPinCode': 'Mapped Area-Pin Code',
    'mappedCity': 'Mapped Area - City',
    "mappedState": "Mapped Area State",
    'gstNumber': 'GST Number',
    'eNTBY': "Uploaded By",
    'eNTDT': "Uploaded on"
  }
  staticField=[
    "eNTDT",
    "locCode",
    "locName",
    "ownership",
    "reportLoc",
    "locCity",
    "locPincode",
    ]
  breadScrums = [
    {
      title: "Location Master",
      items: ["Home"],
      active: "Location Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  addAndEditPath: string;
  csvFileName: string;
  centerAlignedData: string[];
  uploadComponent = UploadLocationComponent;
  constructor(
    private masterService: MasterService,
    private storage: StorageService,
    private dialog: MatDialog,
    private objGeneralService: GeneralService
  ) {
    this.companyCode = this.storage.companyCode;
    this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
    this.csvFileName = "Location Details";
    this.centerAlignedData = ["locPincode"]
  }
  ngOnInit(): void {
    this.getLocationDetails();
  }

  //#region to get location Details
  async getLocationDetails() {
    this.tableLoad = true;
    let req = {
      "companyCode": this.companyCode,
      "filter": { companyCode: this.storage.companyCode },
      "collectionName": "location_detail"
    }
    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req))
    if (res && Array.isArray(res.data)) {
      try {
        // Get the ownership descriptions using the getOwnership() function
        const ownershipDescriptions = await this.objGeneralService.getGeneralMasterData("LOC_OWN");
        const hierachylist = await this.objGeneralService.getGeneralMasterData("HRCHY");
        const sortedData = res.data.sort((a, b) => new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime());

        // Modify each object in res.data
        const modifiedData = sortedData.map(obj => {
          // Find the matching ownership description
          const ownershipObject = ownershipDescriptions.find(x => x.value === obj.ownership);
          const LocationHirarchay = hierachylist.find(item => parseInt(item.value) === obj.locLevel);
          const Reportingto = hierachylist.find(item => parseInt(item.value) === obj.reportLevel);
          // Set the ownership property to the codeDesc if found, or an empty string if not found
          const ownership = ownershipObject ? ownershipObject.name : '';

          // Convert locCode and locName to uppercase
          const locCode = obj.locCode;
          const locName = obj.locName.toUpperCase();
          const locCity = obj.locCity.toUpperCase();
          const locPincode = parseInt(obj.locPincode, 10); // Specify the radix for parseInt
          const locHirarchay = LocationHirarchay ? LocationHirarchay.name : '';
          const reportingto = Reportingto ? Reportingto.name : '';
          // Create a modified object
          return {
            ...obj,
            ownership,
            locCode,
            locName,
            locCity,
            locPincode,
            locHirarchay,
            reportingto,
            eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
          };
        });

        // Assign the modified and sorted data back to this.csv
        this.csv = modifiedData;
        // console.log(this.csv);
        this.tableLoad = false;
      } catch (error) {
        console.error("Error processing location data:", error);
        this.tableLoad = false;
      }
    }
  }
  //#endregion

  async IsActiveFuntion(det) {    
    let locCode = det.data.locCode;
    // Remove the "id" field from the form controls
    delete det.data._id;
    delete det.data.eNTDT;
    delete det.data.ownership;
    delete det.data.reportingto;
    delete det.data.locHirarchay;
    det.data['mODDT'] = new Date()
    det.data['mODBY'] = this.storage.userName
    det.data['mODLOC'] = this.storage.branch

    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "location_detail",
      filter: { companyCode: this.companyCode, locCode: locCode },
      update: det.data
    };
    const res = await firstValueFrom(this.masterService.masterPut('generic/update', req))
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getLocationDetails();
    }
  }
  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getLocationDetails();
    });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
}