import { AbstractControl, UntypedFormBuilder, ValidatorFn, Validators } from "@angular/forms";
//import { autocompleteValidator } from "../Validation/AutoComplateValidation";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";

// function return a untyped for group 
export function formGroupBuilder(fb: UntypedFormBuilder, arrayOfJsonData: any[]) {
    const group = {}
    arrayOfJsonData.forEach(jsonData => {
        jsonData.forEach(field => {
            const validators = [];
            // initializing validators array.
            for (let error of field.Validations) {

                let errorName = error.name;
                if (errorName == 'required') {
                    validators.push(Validators.required)
                } else if (errorName == 'pattern') {
                    validators.push(Validators.pattern(error.pattern))
                } else if (errorName == 'email') {
                    validators.push(Validators.email)
                }
                else if (errorName == 'autocomplete') {
                    validators.push(autocompleteValidator())
                }
            }
            if (field.type == 'dropdown') {
                if (field.additionalData.showNameAndValue) {
                    field.displaywith = genericDisplayFunctionWithNameValue;
                }
                else {
                    field.displaywith = genericDisplayFunctionWithName;
                }
            }
            // here anything custom , related to field should be added .
            group[field.name] = [field.value, validators];
        });
    });

    return fb.group(group);
}

//generic Display funtion for autocomplete dropdown
export function genericDisplayFunctionWithName(field: AutoComplateCommon) {
    return (field && field.value) ? field.name : "";
}
export function genericDisplayFunctionWithNameValue(field: AutoComplateCommon) {
    return (field && field.value) ? field.value + ":" + field.name : "";
}
  //#region to validate dropdown text 
  export function autocompleteValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (typeof control.value === 'string'&& control.value.length > 0) {
          return { invalidAutocomplete: { value: control.value } };
        }
        return null; /* valid option selected */
    };
  } 
  //#endregion
