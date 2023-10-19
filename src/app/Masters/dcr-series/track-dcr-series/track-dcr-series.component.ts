import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-track-dcr-series',
  templateUrl: './track-dcr-series.component.html'
})
export class TrackDcrSeriesComponent implements OnInit {
  trackDcrForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrFormControls: DCRControl;

  // Breadcrumbs
  breadScrums = [
    {
      title: "Track and Manage DCR Series",
      items: ["Document Control"],
      active: "Track and Manage DCR Series",
    },
  ];
  docType: any;
  docTypeStatus: any;
  data: any;

  constructor(private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils, private router: Router) { }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindDropdown();
  }
  intializeFormControls() {
    //throw new Error("Method not implemented.");
    this.dcrFormControls = new DCRControl();
    this.jsonControlArray = this.dcrFormControls.getFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'documentType') {
        this.docType = data.name;
        this.docTypeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.trackDcrForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
  bindDropdown() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.data = res.documentTypeDropDown;
      const Select = this.data.find(x => x.name == this.data[0].name)
      this.trackDcrForm.get('documentType').setValue(Select);
      this.filter.Filter(
        this.jsonControlArray,
        this.trackDcrForm,
        this.data,
        this.docType,
        this.docTypeStatus,
      );
    });
  }
  track(additionalData) {
    if (!this.trackDcrForm.value.documentNumber) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please enter a document number.",
        showConfirmButton: true,
      });
      return; // Stop execution if documentNumber is null or empty
    }
    let req = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "dcr"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          // Step 1: Filter records with seriesFrom = 'CN1234'
          const filteredDataArray = dataWithSrno.filter((item) => item.seriesFrom === this.trackDcrForm.value.documentNumber && item.documentType === this.trackDcrForm.value.documentType.value);
          if (filteredDataArray.length === 0) {
            Swal.fire({
              icon: "warning",
              title: "Alert",
              text: `No matching data found.`,
              showConfirmButton: true,
            });
            return;
          }
          // Step 2: Sort filteredDataArray based on entryDate in ascending order (earliest to latest)
          filteredDataArray.sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

          // Step 3: Get the record with the latest entryDate (first item in sorted array)
          const latestEntryData = filteredDataArray[filteredDataArray.length - 1];

          // Step 4: Get the record with the last entryDate (last item in sorted array)
          const lastEntryData = filteredDataArray[0];

          // Now, you have the data with the latest entryDate in 'latestEntryData' and the data with the last entryDate in 'lastEntryData'.
          const matchingData = {
            "documentType": lastEntryData.documentType,
            "bookCode": lastEntryData.bookCode,
            "seriesFrom": lastEntryData.seriesFrom,
            "seriesTo": latestEntryData.seriesTo,
            "totalLeaf": latestEntryData.totalLeaf,
            "allotTo": latestEntryData.allotTo,
            "allocateTo": latestEntryData.allocateTo,
            "type": latestEntryData.type,
            "status": lastEntryData.status,
            "action": latestEntryData.action,
            "usedLeaves": lastEntryData.usedLeaves,
          }
          this.router.navigate(['Masters/DocumentControlRegister/DCRDetail'], {
            state: {
              data: matchingData, additionalData: additionalData,
            }
          });
        }
      }
    })
  }
}
