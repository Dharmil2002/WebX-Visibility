import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
})
export class LocationMasterComponent implements OnInit {
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  columnHeader = {
    'eNTDT': 'Created Date',
    'locCode': 'Code',
    'locName': 'Name',
    'ownership': 'Ownership',
    'reportLoc': 'Report To',
    'locCity': 'City',
    'locPincode': 'Pincode',
    "activeFlag": "Active",
    "actions": "Actions"
  };
  columnWidths = {
    'eNTDT': 'max-width: 50%',
    'locCode': 'max-width:10%',
    'locName': 'max-width:13%',
    'ownership': 'max-width:12%',
    'locPincode': 'align-self: center;max-width:10%;',
    'locCity': 'max-width:15%',
    'reportLoc': 'max-width:10%',
    'activeFlag': 'max-width:8%',
    'actions': 'max-width:8%'
  };
  headerForCsv = {
    "srNo": "Sr No",
    'locCode': 'Location Code',
    'locName': 'Location Name',
    'locAddress': 'Location Address',
    'reportLoc': 'Reporting Location',
    "activeFlag": "Active Status",
  }
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
  constructor(
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
    this.csvFileName = "Location Details";
    this.centerAlignedData = ["locPincode"]
  }
  ngOnInit(): void {
    this.getOwnership();
    this.getLocationDetails();
  }
  async getOwnership() {
    const generalReqBody = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "General_master",
    };

    const generalResponse = await firstValueFrom(this.masterService.masterPost("generic/get", generalReqBody));
    return generalResponse.data
  }
  //#region to get location Details
  async getLocationDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": { companyCode: this.storage.companyCode },
      "collectionName": "location_detail"
    }
    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req))
    if (res && Array.isArray(res.data)) {
      try {
        // Get the ownership descriptions using the getOwnership() function
        const ownershipDescriptions = await this.getOwnership();
        const sortedData = res.data.sort((a, b) => new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime());

        // Modify each object in res.data
        const modifiedData = sortedData.map(obj => {
          // Find the matching ownership description
          const ownershipObject = ownershipDescriptions.find(x => x.codeId === obj.ownership);

          // Set the ownership property to the codeDesc if found, or an empty string if not found
          const ownership = ownershipObject ? ownershipObject.codeDesc : '';

          // Convert locCode and locName to uppercase
          const locCode = obj.locCode;
          const locName = obj.locName.toUpperCase();
          const locCity = obj.locCity.toUpperCase();
          const locPincode = parseInt(obj.locPincode, 10); // Specify the radix for parseInt

          // Create a modified object
          return {
            ...obj,
            ownership,
            locCode,
            locName,
            locCity,
            locPincode,
            eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
          };
        });

        // Assign the modified and sorted data back to this.csv
        this.csv = modifiedData;
        this.tableLoad = false;
      } catch (error) {
        console.error("Error processing user data:", error);
      }
    }
  }
  //#endregion

  async IsActiveFuntion(det) {
    let locCode = det.locCode;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.eNTDT
    det['mODDT'] = new Date()
    det['mODBY'] = localStorage.getItem("UserName")
    det['mODLOC'] = localStorage.getItem("Branch")
    const ownershipDescriptions = await this.getOwnership();
    const ownershipObject = ownershipDescriptions.find(
      (x) => x.codeDesc === det.ownership
    );
    // Set the ownership property to the codeDesc if found, or an empty string if not found
    const ownership = ownershipObject ? ownershipObject.codeId : '';
    det.ownership = ownership
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "location_detail",
      filter: { companyCode: this.companyCode, locCode: locCode },
      update: det
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
}