import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';

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

  constructor(private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) { }

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
      this.filter.Filter(
        this.jsonControlArray,
        this.trackDcrForm,
        this.data,
        this.docType,
        this.docTypeStatus,
      );
    });
  }
  track(){
    console.log(this.trackDcrForm.value);
  }
}
