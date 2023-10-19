import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-re-allocate-dcr',
  templateUrl: './re-allocate-dcr.component.html'
})
export class ReAllocateDcrComponent implements OnInit {
  dcrReallocateForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrReallocateFormControls: DCRControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "Re-Allocate DCR",
      items: ["Document Control"],
      active: "Re-Allocate DCR",
    },
  ];
  tableLoad: boolean;
  locationData: any;
  newLocation: any;
  newLocationStatus: any;
  allocationCat: any;
  newCategoryStatus: any;
  newCategory: any;
  newPerson: any;
  newPersonStatus: any;
  id: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: Router, public dialog: MatDialog, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) {
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.getDropDownData();
    this.getAllMastersData();
  }
  intializeFormControls() {
    this.dcrReallocateFormControls = new DCRControl();
    this.jsonControlArray = this.dcrReallocateFormControls.getReallocateDcrFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'newLocation') {
        // Set State-related variables
        this.newLocation = data.name;
        this.newLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'newCategory') {
        // Set State-related variables
        this.newCategory = data.name;
        this.newCategoryStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'newPerson') {
        this.newPerson = data.name;
        this.newPersonStatus = data.additionalData.showNameAndValue;
      }
    });
    this.dcrReallocateForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  // Handle function calls
  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.allocationCat = res.allocationCategory;
      //New Allocation Category
      this.filter.Filter(
        this.jsonControlArray,
        this.dcrReallocateForm,
        this.allocationCat,
        this.newCategory,
        this.newCategoryStatus,
      );
      this.tableLoad = false;
    });
  }
  reAlloc() {
    let getReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "dcr"
    }
    this.masterService.masterPost('generic/get', getReq).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const currentBookCode = this.data.bookCode;
          const existingData = res.data.filter((item: any) => item._id.includes(currentBookCode + '-'));
          if (existingData.length > 0) {
            // If bookCode with suffix exists, find the maximum suffix and increment it by 1
            const maxSuffix = existingData.reduce((max: number, item: any) => {
              const suffix = parseInt(item._id.split('-')[1]);
              return isNaN(suffix) ? max : Math.max(max, suffix);
            }, 0);

            const newSuffix = maxSuffix + 1;
            this.id = `${currentBookCode}-${newSuffix}`;
          } else {
            // If no suffix exists, check if currentBookCode already has '-'
            if (currentBookCode.includes('-')) {
              // If currentBookCode already has '-', then just set the id as it is
              this.id = currentBookCode;
            } else {
              // If currentBookCode does not have '-', append '-1' to the id
              this.id = `${currentBookCode}-1`;
            }
          }
          let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "dcr",
            data: {
              "documentType": this.data.documentType,
              "bookCode": this.data.bookCode,
              "seriesFrom": this.data.seriesFrom,
              "seriesTo": this.data.seriesTo,
              "totalLeaf": this.data.totalLeaf,
              "allotTo": this.dcrReallocateForm.value.newLocation.value,
              "type": this.dcrReallocateForm.value.newCategory.value,
              "allocateTo": this.dcrReallocateForm.value.newPerson.value,
              "entryBy": localStorage.getItem("UserName"),
              "entryDate": new Date().toISOString(),
              "_id": this.id,
              "action": "Re-Allocate"
            }
          };
          this.masterService.masterPost('generic/create', req).subscribe({
            next: (res: any) => {
              if (res) {
                // Display success message
                Swal.fire({
                  icon: "success",
                  title: "Successful",
                  text: res.message,
                  showConfirmButton: true,
                });
              }
            }
          });
          this.dialog.closeAll();
          this.route.navigateByUrl("/Masters/DocumentControlRegister/TrackDCR");
        }
      }
    })
  }
  closeDialog(): void {
    this.dialog.closeAll();
  }
  getAllMastersData() {
    // Prepare the requests for different collections
    let locationReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "location_detail"
    };

    let userReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "user_master"
    };

    let vendorReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "vendor_detail"
    };

    let customerReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "customer_detail"
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('generic/get', locationReq),
      this.masterService.masterPost('generic/get', userReq),
      this.masterService.masterPost('generic/get', vendorReq),
      this.masterService.masterPost('generic/get', customerReq)
    ]).pipe(
      map(([locationRes, userRes, vendorRes, customerRes]) => {
        // Combine all the data into a single object
        return {
          locationData: locationRes?.data,
          userData: userRes?.data,
          vendorData: vendorRes?.data,
          customerData: customerRes?.data
        };
      })
    ).subscribe((mergedData) => {
      // Access the merged data here
      const locdet = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode,
        type: 'L'
      }));

      const userdet = mergedData.userData.map(element => ({
        name: element.name,
        value: element.userId,
        type: 'E'
      }));

      const vendordet = mergedData.vendorData.map(element => ({
        name: element.vendorName,
        value: element.vendorCode,
        type: 'B'
      }));

      const custdet = mergedData.customerData.map(element => ({
        name: element.customerName,
        value: element.customerCode,
        type: 'C'
      }));

      // Combine all arrays into one flat array with extra data indicating the sections
      const allData = [
        ...locdet,
        ...userdet,
        ...vendordet,
        ...custdet,
      ];
      const catData = allData.filter(item => item.type === this.dcrReallocateForm.value.newCategory.value);
      this.filterDropdown(catData, this.newPerson, this.newPersonStatus);
      this.filterDropdown(locdet, this.newLocation, this.newLocationStatus);
    });

  }
  filterDropdown(data, control, status) {
    this.filter.Filter(this.jsonControlArray, this.dcrReallocateForm, data, control, status);
  }
}
