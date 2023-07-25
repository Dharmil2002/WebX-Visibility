import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { map } from 'rxjs/operators';
import { utilityService } from 'src/app/Utility/utility.service';
import { forkJoin } from 'rxjs';
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
  newPerson: any;
  newPersonStatus: any;
  constructor(private service: utilityService, private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = this.route.getCurrentNavigation()?.extras.state.data;
      console.log(this.data);
    }
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
    this.getAllMastersData();
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
        this.newLocation = data.name;
        this.newLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'newCategory') {
        this.newCategory = data.name;
        this.newCategoryStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'newPerson') {
        this.newPerson = data.name;
        this.newPersonStatus = data.additionalData.showNameAndValue;
      }
    });
    this.dcrSplitForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.dcrSplitForm.patchValue({
      bookCode: this.data?.bookCode,
      seriesFrom: this.data?.seriesFrom,
      totalLeaf: this.data?.totalLeaf,
    });

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
        const selectedDocumentType = this.docData.find(x => x.value === this.data?.documentType);
        this.dcrSplitForm.get('documentType').setValue(selectedDocumentType);

        // Process allocation category dropdown
        this.allocationCat = res.allocationCategory;
      })
    ).subscribe(() => {
      this.filterDropdown(this.docData, this.docType, this.docTypeStatus);
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
    }
  }
  cancel() {
    this.route.navigateByUrl("/Masters/DocumentControlRegister/TrackDCR");
  }
  save() {
    this.dcrSplitForm.controls["documentType"].setValue(this.dcrSplitForm.value.documentType.value);
    this.dcrSplitForm.controls["newLocation"].setValue(this.dcrSplitForm.value.newLocation.value);
    this.dcrSplitForm.controls["newCategory"].setValue(this.dcrSplitForm.value.newCategory.value);
    this.dcrSplitForm.controls["newPerson"].setValue(this.dcrSplitForm.value.newPerson.value);
    this.dcrSplitForm.controls["id"].setValue(this.dcrSplitForm.value.bookCode);
    this.dcrSplitForm.controls["action"].setValue('Split');

    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collection: "dcr",
      data: this.dcrSplitForm.value
    };
    this.masterService.masterPost('common/create', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          window.location.reload();
        }
      }
    });
    this.route.navigateByUrl("/Masters/DocumentControlRegister/TrackDCR");
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
      const catData = allData.filter(item => item.type === this.dcrSplitForm.value.newCategory.value);
      this.filterDropdown(catData, this.newPerson, this.newPersonStatus);
      this.filterDropdown(locdet, this.newLocation, this.newLocationStatus);
    });

  }
}
