import { AbstractControl } from "@angular/forms";

export function setFormControlValue(control: AbstractControl, ...values: any[]): void {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        control.setValue(value);
        break;
      }
    }
  }
  