import { UntypedFormBuilder, Validators } from "@angular/forms";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
import { autocompleteObjectValidator } from "../Validation/AutoComplateValidation";

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
                    validators.push(autocompleteObjectValidator())
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