import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';

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

export function patternValidator(pattern: string | RegExp, errorMessage: string): ValidatorFn {
  let patternRegex: RegExp;

  // Convert pattern string to RegExp object if it's a string
  if (typeof pattern === 'string') {
    patternRegex = new RegExp(pattern);
  } else {
    patternRegex = pattern;
  }

  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && !patternRegex.test(control.value)) {
      return { 'pattern': { value: control.value, message: errorMessage } };
    }
    return null;
  };
}
