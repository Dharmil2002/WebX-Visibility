import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { AddManualVoucharControl } from 'src/assets/FormControls/add-manual-vouchar-control';

@Component({
  selector: 'app-add-manual-voucher',
  templateUrl: './add-manual-voucher.component.html',
})
export class AddManualVoucherComponent implements OnInit {

  breadScrums = [
    {
      title: "Add Manual Voucher",
      items: ["Manual Voucher"],
      active: "Add Manual Voucher",
    },
  ];
  jsonControlArray: any;
 manualVoucharTableForm: UntypedFormGroup;
  manualVoucharFormControls: AddManualVoucharControl;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.manualVoucharFormControls = new AddManualVoucharControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.manualVoucharFormControls.getManualVoucharArrayControls();
    // Build the form group using formGroupBuilder function
    this.manualVoucharTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  save(){

  }
  cancel(){

  }
}
