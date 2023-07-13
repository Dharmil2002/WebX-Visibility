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
  constructor(private fb: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.intializeFormControls();
  }
  intializeFormControls() {
    this.dcrSplitFormControls = new DCRControl();
    this.jsonControlArray = this.dcrSplitFormControls.getDcrDetailsFormControls();
    this.jsonControlArray.forEach(data => {

    });
    this.dcrSplitForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
}
