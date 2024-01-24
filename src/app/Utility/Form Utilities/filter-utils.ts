import { UntypedFormGroup } from "@angular/forms";

// filter-utils.ts
export function filterAndUnique<T>(
  data: T[],
  filterFunction: (item: T) => boolean,
  mapFunction: (item: T) => { name: string, value: string }
): { name: string, value: string }[] {
  const seenItems = {};
  return data
    .filter(filterFunction)
    .filter((item: T) => {
      const key = item.toString().toLowerCase();
      const alreadySeen = seenItems[key];
      seenItems[key] = true;
      return !alreadySeen;
    })
    .map(mapFunction);
}
/*Below function is for check the form group is empty or not*/
export function isEmptyForm(Form: UntypedFormGroup): boolean {
  return Object.keys(Form.value).every(key => {
    // Check if the property is empty. This can be adjusted based on how you define "empty" (e.g., consider whitespace, null, undefined)
    let value = Form.value[key];
    return value == null || value === '';
  });
}
/*End*/
// Below function is for check the form group is empty or not for async method
export async function isEmptyFormValue(Form: UntypedFormGroup): Promise<boolean> {
  // Add 'await' before any asynchronous operation inside the function, if necessary
  return Object.keys(Form.value).every(key => {
    // Check if the property is empty. This can be adjusted based on how you define "empty" (e.g., consider whitespace, null, undefined)
    let value = Form.value[key];
    return value == null || value === '';
  });
}
// End
