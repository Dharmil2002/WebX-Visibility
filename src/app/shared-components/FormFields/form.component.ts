import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { FormGroupDirective, UntypedFormGroup } from '@angular/forms';
import {  FormControls } from 'src/app/Models/FormControl/formcontrol';
import { CustomeDatePickerComponent } from '../custome-date-picker/custome-date-picker.component';


@Component({
  selector: 'app-form-webxpress',
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() formItem!: FormControls
  form!: UntypedFormGroup
  locationIsupdate: boolean;
  minDate: Date;
  maxDate: Date
  @Output() callFunction = new EventEmitter();
  selectedValue: any; 
  isTouchUIActivated = false;
  // field required for password input.
  showPassword: boolean = false;
  ConfirmshowPassword: boolean = false;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  ngOnChanges(changes: SimpleChanges) {
    this.formItem=changes.formItem.currentValue

    }
  constructor(private rootFormGroup: FormGroupDirective) {
    this.form = this.rootFormGroup.control  // get parent form control

// some data we want , for date fiels, that are required most of the time.
    this.minDate = new Date("01 Jan 1900");
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  ngOnInit(): void {
  }

  functionCalled(context){   
    // console.log(context , "from form components");
    if( (context.functionName !== undefined || context.functionName != null) && context.functionName?.length > 0){
      this.callFunction.emit(context)
    }
  }
  togglePasswordInputType(field:any) {
   field.additionalData.showPassword = !field.additionalData.showPassword;
   if(field.additionalData.showPassword){
    field.additionalData.inputType = "text";
   }else{
    field.additionalData.inputType = "password";
   }

  }
  optionSelected(value: any, formItem: any) {
    this.form.get(formItem.name)?.setValue(value);
    this.selectedValue = value;
  }

}