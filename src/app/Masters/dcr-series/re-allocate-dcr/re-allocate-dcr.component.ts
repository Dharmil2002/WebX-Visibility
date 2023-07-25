import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
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
  constructor(private service: utilityService, public dialog: MatDialog, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) { }

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
    this.service.exportData(this.dcrReallocateForm.value);
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: "Re-Allocated Data Successfully",
      showConfirmButton: true,
    });
    this.dialog.closeAll();
  }
  closeDialog(): void {
    this.dialog.closeAll();
  }
  getAllMastersData() {
    // Prepare the requests for different collections
    let locationReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "location_detail"
    };

    let userReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "user_master"
    };

    let vendorReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "vendor_detail"
    };

    let customerReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "customer_detail"
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('common/getall', locationReq),
      this.masterService.masterPost('common/getall', userReq),
      this.masterService.masterPost('common/getall', vendorReq),
      this.masterService.masterPost('common/getall', customerReq)
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
