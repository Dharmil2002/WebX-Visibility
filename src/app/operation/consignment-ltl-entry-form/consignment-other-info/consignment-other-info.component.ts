import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ConsignmentLtl } from 'src/assets/FormControls/consgiment-ltl-controls';

@Component({
  selector: 'app-consignment-other-info',
  templateUrl: './consignment-other-info.component.html'
})
export class ConsignmentOtherInfoComponent implements OnInit {
  otherInfoForm: UntypedFormGroup;
  otherControls:FormControls[];
  constructor(
    private generalService: GeneralService,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    ) { }

  ngOnInit(): void {
    this.initializeFormControls()
  }
  /*below function is for initalize formcontrols from Json*/
  initializeFormControls(){
    const controls = new ConsignmentLtl(this.generalService);
    this.otherControls = controls.getOtherDetails()
    this.otherInfoForm = formGroupBuilder(this.fb, [this.otherControls]);
  }
  /*End*/
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  save(){
    this.dialogRef.close(this.otherInfoForm.value);
  }
  cancel(){
    this.dialogRef.close(null)
  }
}
