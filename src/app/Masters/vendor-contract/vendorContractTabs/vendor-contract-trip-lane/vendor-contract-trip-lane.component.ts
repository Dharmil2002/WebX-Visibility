import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { TripLaneBased } from 'src/assets/FormControls/VendorContractControls/add-trip-lane-based';

@Component({
  selector: 'app-vendor-contract-trip-lane',
  templateUrl: './vendor-contract-trip-lane.component.html'
})
export class VendorContractTripLaneComponent implements OnInit {
  @Input() contractData: any;

  ContractTripLaneBasedControls: TripLaneBased;
  jsonControlArrayTripLaneBased: any;
  TripLaneBasedForm: UntypedFormGroup;
  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";
  CurrentAccessList: any;

  constructor(private fb: UntypedFormBuilder,) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    const data = changes.contractData?.currentValue
    this.initializeFormControl(data);
  }

  initializeFormControl(data) {
    this.ContractTripLaneBasedControls = new TripLaneBased(data);
    this.jsonControlArrayTripLaneBased = this.ContractTripLaneBasedControls.getTripLaneBasedArrayControls();
    this.TripLaneBasedForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayTripLaneBased,
    ]);
    console.log(this.jsonControlArrayTripLaneBased);
    


  }
//#region functionCallHandler
functionCallHandler($event) {
  let field = $event.field; // the actual formControl instance
  let functionName = $event.functionName; // name of the function , we have to call
  try {
    this[functionName]($event);
  } catch (error) {
    // we have to handle , if function not exists.
    console.log("failed", error);
  }
}
//#endregion
}