import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
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
    'locCode': 'Code',
    'locName': 'Name',
    'updateDate': 'Created Date',
    'ownership': 'Ownership',
    'locPincode': 'Pincode',
    'locCity': 'City',
    'reportLoc': 'Report To',
    "activeFlag": "Active",
    "actions": "Actions"
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
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
    this.csvFileName = "Location Details";
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

    const generalResponse = await this.masterService
      .masterPost("generic/get", generalReqBody)
      .toPromise();
    return generalResponse.data
  }
  //#region to get location Details
  async getLocationDetails() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "location_detail"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: async (res: any) => {
        if (res) {
          // Get the ownership descriptions using the getOwnership() function
          const ownershipDescriptions = await this.getOwnership();

          // Modify each object in res.data
          const modifiedData = res.data.map(obj => {
            // Find the matching ownership description
            const ownershipObject = ownershipDescriptions.find(
              (x) => x.codeId === obj.ownership
            );

            // Set the ownership property to the codeDesc if found, or an empty string if not found
            const ownership = ownershipObject ? ownershipObject.codeDesc : '';

            // Convert locCode and locName to uppercase
            const locCode = obj.locCode.toUpperCase();
            const locName = obj.locName.toUpperCase();
            const locCity = obj.locCity.toUpperCase();
            const locPincode = parseInt(obj.locPincode)
            // Create a modified object
            return { ...obj, ownership, locCode, locName, locCity, locPincode };
          });

          // Sort the modified data by updateDate in descending order
          const sortedData = modifiedData.sort((a, b) => {
            const dateA: Date | any = new Date(a.updateDate);
            const dateB: Date | any = new Date(b.updateDate);

            // Compare the date objects
            return dateB - dateA; // Sort in descending order
          });

          // Assign the modified and sorted data back to this.csv
          this.csv = sortedData;
          this.tableLoad = false;
        }
      }
    });
  }
  //#endregion

  IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "location_detail",
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
          this.getLocationDetails();
        }
      }
    });
  }

}