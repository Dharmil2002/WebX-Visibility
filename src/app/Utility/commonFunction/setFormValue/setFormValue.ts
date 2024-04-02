import { AbstractControl, UntypedFormGroup } from "@angular/forms";

export function setFormControlValue(control: AbstractControl, ...values: any[]): void {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        control.setValue(value);
        break;
      }
    }
  }
/**
 * Gets form control value or default if not found.
 * @param form The FormGroup.
 * @param controlName Name of control.
 * @param defaultValue Default value (optional, default="").
 * @returns Control value or default.
 */
export function getValueOrDefault(form: UntypedFormGroup, controlName: string, defaultValue: any = ""): any {
  return form.controls[controlName] ? form.controls[controlName].value : defaultValue;
}

/**
 * Sets form control value or default if not found.
 * @param form The FormGroup.
 * @param controlName Name of control.
 * @param value Value to set.
 */
// Function to clear validators and update validity for form controls
export function clearValidatorsAndUpdate(form, elements) {
  elements.forEach(element => {
    const control = form.controls[element.name];
    if (control) { // Ensure the control exists before attempting to modify it
      control.clearValidators();
      control.updateValueAndValidity();
    }
  });
}