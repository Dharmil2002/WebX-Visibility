import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-without-auto-complete-webxpress',
  templateUrl: './form-without-auto-complete.component.html',
})
export class FormWithoutAutoCompleteComponent implements OnInit {
  @Input() formData                           // form data
  @Input() form                               // formgroup

  // 'showSaveAndCancelButton'. it should be kept false form when dealing with more than one forms (like in accordion)
  // refer example of accordion for example...at     example/accordion
  // for single forms , this value will be always true 
  @Input() showSaveAndCancelButton : boolean
  @Output() functionCallEmitter = new EventEmitter();

  hasPasswordFields: Boolean

  constructor() { }

  ngOnInit(): void {    
    // console.log(this.formData , "from d for");
    
    for (let item of this.formData) {
      if (item.type == 'password') {
        this.hasPasswordFields = true;
        break;
      }
    }

  }

  // handles functioncall
  functionCalled(context) {
    // console.log(context, "from form components");
    if ((context.functionName !== undefined || context.functionName != null) && context.functionName?.length > 0) {      
      this.functionCallEmitter.emit(context)
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

  // it passes save function call to parent component, where it should be handled.
  save(){
    let context = {};
    context['functionName'] = 'save';
    // console.log("called Save",context);
    this.functionCallEmitter.emit(context)
  }
  // it passes cancel function call to parent component, where it should be handled.
  cancel(){
    let context = {};
    context['functionName'] = 'cancel';
    this.functionCallEmitter.emit(context)
  }


}
