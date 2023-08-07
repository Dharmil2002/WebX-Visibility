import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export function clearValidatorsAndValidate(control: AbstractControl) {
    if (control instanceof FormControl) {
        control.clearValidators();
        control.updateValueAndValidity();
    } else if (control instanceof FormGroup || control instanceof FormArray) {
        for (const key in control.controls) {
            if (control.controls.hasOwnProperty(key)) {
                const nestedControl = control.controls[key];
                clearValidatorsAndValidate(nestedControl);
            }
        }
    }
}