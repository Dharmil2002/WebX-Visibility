
// Define a generic function that calculates the total and updates the form control.
export function calculateTotal(form, controlName1, controlName2, resultControlName) {
    const value1 = parseFloat(form.controls[controlName1].value) || 0;
    const value2 = parseFloat(form.controls[controlName2].value) || 0;
    const total = value1 - value2;
    form.controls[resultControlName].setValue(total);
}

export const vendorTypeList=[
    { value: "Own", name: "Own" },
    { value: "Attached", name: "Attached" },
    { value: "Rail", name: "Rail" },
    { value: "Market", name: "Market" },
    { value: "Service Provider", name: "Service Provider" }
]