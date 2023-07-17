import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { map } from 'rxjs/operators';
import { utilityService } from 'src/app/Utility/utility.service';
@Component({
  selector: 'app-split-dcr',
  templateUrl: './split-dcr.component.html'
})
export class SplitDcrComponent implements OnInit {
  dcrSplitForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrSplitFormControls: DCRControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "Split DCR",
      items: ["Document Control"],
      active: "Split DCR",
    },
  ];
  data: any;
  docType: any;
  docTypeStatus: any;
  docData: any;
  locationData: any;
  allocationCat: any;
  newLocation: any;
  newLocationStatus: any;
  newCategory: any;
  newCategoryStatus: any;
  constructor(private service: utilityService, private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      debugger
      this.data = this.route.getCurrentNavigation()?.extras.state.data;
      console.log(this.data);
    }
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
  }
  intializeFormControls() {
    this.dcrSplitFormControls = new DCRControl();
    this.jsonControlArray = this.dcrSplitFormControls.getSplitDcrFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'documentType') {
        this.docType = data.name;
        this.docTypeStatus = data.additionalData.showNameAndValue;
      }
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
    this.dcrSplitForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.dcrSplitForm.get('bookCode').setValue(this.data?.bookCode);
    this.dcrSplitForm.get('seriesFrom').setValue(this.data?.docSrFrom);
    this.dcrSplitForm.get('totalLeaf').setValue(this.data?.totLeaf);
  }
  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  // Assuming 'filter' is an instance of the 'Filter' class

  bindDropdown() {
    this.masterService.getJsonFileDetails('dropDownUrl').pipe(
      map((res) => {
        // Process document type dropdown
        this.docData = res.documentTypeDropDown;
        const selectedDocumentType = this.docData.find(x => x.value === this.data?.docType);
        this.dcrSplitForm.get('documentType').setValue(selectedDocumentType);

        // Process location dropdown
        this.locationData = res.locationList.map(item => ({
          name: item.locDesc,
          value: item.locId,
        }));

        // Process allocation category dropdown
        this.allocationCat = res.allocationCategory;
      })
    ).subscribe(() => {
      this.filterDropdown(this.docData, this.docType, this.docTypeStatus);
      this.filterDropdown(this.locationData, this.newLocation, this.newLocationStatus);
      this.filterDropdown(this.allocationCat, this.newCategory, this.newCategoryStatus);
    });
  }
  filterDropdown(data, control, status) {
    this.filter.Filter(this.jsonControlArray, this.dcrSplitForm, data, control, status);
  }
  getSeriesValidation() {
    const seriesFromValue = this.dcrSplitForm.get('seriesFrom').value;
    const seriesToValue = this.dcrSplitForm.get('seriesTo').value;

    // Extract the numeric parts from the seriesFrom and seriesTo values
    const fromNumericPart = parseInt(seriesFromValue.match(/\d+$/)[0], 10);
    const toNumericPart = parseInt(seriesToValue.match(/\d+$/)[0], 10);

    if (fromNumericPart >= toNumericPart) {
      // Display an alert if the condition is not met
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Series To value should be greater than Series From value.",
        showConfirmButton: true,
      });
    } else {
      // Calculate the difference and set the totalLeaf value
      const difference = toNumericPart - fromNumericPart;
      this.dcrSplitForm.get('totalLeaf').setValue(difference);

      console.log(seriesFromValue);
      console.log(seriesToValue);
      console.log(difference);

      // ... Additional logic here ...
    }
  }
  cancel() {
    this.route.navigateByUrl("/Masters/DocumentControlRegister/TrackDCR");
  }
  save() {
    this.service.exportData(this.dcrSplitForm.value);
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: "Series split successfull...",
      showConfirmButton: true,
    });
    this.route.navigateByUrl("/Masters/DocumentControlRegister/TrackDCR");
  }
}
