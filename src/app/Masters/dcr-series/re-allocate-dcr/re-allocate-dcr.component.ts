import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';


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
  constructor(public dialog: MatDialog, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) { }

  ngOnInit(): void {
    this.intializeFormControls();
    this.getDropDownData();
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
      this.locationData = res.locationList.map((item) => {
        item['name'] = item.locDesc;
        item['value'] = item.locId;
        return item;
      });
      this.allocationCat = res.allocationCategory;
      //New Location
      this.filter.Filter(
        this.jsonControlArray,
        this.dcrReallocateForm,
        this.locationData,
        this.newLocation,
        this.newLocationStatus,
      );
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

  }
  closeDialog(): void {
    this.dialog.closeAll();
  }
}
