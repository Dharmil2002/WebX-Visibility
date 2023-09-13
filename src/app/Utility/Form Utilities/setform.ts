import { AbstractControl } from '@angular/forms';

/**
 * Sets the value of a form control.
 * @param control The form control to set the value for.
 * @param value The value to set.
 */
export function setControlValue(control: AbstractControl, value: any): void {
  if (control) {
    control.setValue(value);
  }
}
