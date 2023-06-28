import { UntypedFormGroup } from "@angular/forms";
import { debug } from "console";
import { map, startWith } from "rxjs";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";

export class FilterUtils {
  /**
   * Filter function to set filter options for a specific field.
   * @param jsonControlArray - The array of form controls.
   * @param formControl - The form control group.
   * @param dropdownOption - The dropdown options for the field.
   * @param fieldName - The name of the field.
   * @param showNameAndValue - A boolean indicating whether to show name and value in the dropdown.
   */
  Filter(
    jsonControlArray: any[],
    formControl: UntypedFormGroup,
    dropdownOption: AutoComplateCommon[],
    fieldName: string,
    showNameAndValue: boolean
  ): void {
    // Find the index of the field in the jsonControlArray
    let index = jsonControlArray.findIndex((obj) => obj.name === fieldName);

    // Set filterOptions for the field based on formControl value changes
    jsonControlArray[index].filterOptions = formControl.controls[fieldName].valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) =>
        name
          ? showNameAndValue
            ? this._filterWithNameValue(name, dropdownOption)
            : this._filterWithName(name, dropdownOption)
          : dropdownOption.slice()
      )
    );
  }

  /**
   * Filter function to filter dropdown options based on name and value.
   * @param name - The name used for filtering.
   * @param dropdownOption - The dropdown options to filter.
   * @returns The filtered dropdown options.
   */
  private _filterWithNameValue(name: string, dropdownOption: AutoComplateCommon[]): AutoComplateCommon[] {
    const filterValue = name.toLowerCase();
    const filteredDropdown = dropdownOption.filter((option) =>
      filterValue.includes(':')
        ? option.name.toLowerCase().indexOf(filterValue.split(':')[1]) === 0
        : option.name.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredDropdown;
  }

  /**
   * Filter function to filter dropdown options based on name.
   * @param name - The name used for filtering.
   * @param dropdownOption - The dropdown options to filter.
   * @returns The filtered dropdown options.
   */
  private _filterWithName(name: string, dropdownOption: AutoComplateCommon[]): AutoComplateCommon[] {
    const filterValue = name.toLowerCase();
    const filteredDropdown = dropdownOption.filter((option) =>
      option.name.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredDropdown;
  }
}