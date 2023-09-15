import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup } from '@angular/forms';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';


@Component({
  selector: 'app-form-webxpress',
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() formData
  @Input() FieldStyle = ""

  @Input() form!: UntypedFormGroup
  locationIsupdate: boolean;
  minDate: Date;
  maxDate: Date
  @Output() callFunction = new EventEmitter();
  @Input() showSaveAndCancelButton: boolean
  @Input() showSaveButton: boolean
  @Output() functionCallEmitter = new EventEmitter();
  @Input() uploadedFiles;
  selectedValue: any;
  isTouchUIActivated = false;
  // field required for password input.
  showPassword: boolean = false;
  ConfirmshowPassword: boolean = false;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  // ngOnChanges(changes: SimpleChanges) {
  //   this.formData=changes.formData.currentValue
  //   }
  constructor(private rootFormGroup: FormGroupDirective) {
    this.form = this.rootFormGroup.control  // get parent form control

    // some data we want , for date fiels, that are required most of the time.
    this.minDate = new Date("01 Jan 1900");
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  ngOnInit(): void {
  }

  functionCalled(context) {
    // console.log(context , "from form components");
    if ((context.functionName !== undefined || context.functionName != null) && context.functionName?.length > 0) {
      this.callFunction.emit(context)
    }
  }
  togglePasswordInputType(field: any) {
    field.additionalData.showPassword = !field.additionalData.showPassword;
    if (field.additionalData.showPassword) {
      field.additionalData.inputType = "text";
    } else {
      field.additionalData.inputType = "password";
    }

  }
  optionSelected(value: any, formData: any) {
    this.form.get(formData.name)?.setValue(value);
    this.selectedValue = value;
  }
  // it passes save function call to parent component, where it should be handled.
  save() {
    let context = {};
    context['functionName'] = 'save';
    // console.log("called Save",context);
    this.functionCallEmitter.emit(context)
  }
  // it passes cancel function call to parent component, where it should be handled.
  cancel() {
    let context = {};
    context['functionName'] = 'cancel';
    this.functionCallEmitter.emit(context)
  }
}
