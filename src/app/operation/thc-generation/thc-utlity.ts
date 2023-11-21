export async function getShipment(operationService, vehicle=false) {
    // Define the request body with companyCode, collectionName, and an empty filter
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "docket_temp",
        filter: {}
    };

    // Perform an asynchronous operation to fetch data from the operation service
    const result = await operationService.operationMongoPost("generic/get", reqBody).toPromise();

    // If the 'vehicle' flag is true, map the 'result' array to a new format
    // and return it; otherwise, return the 'result' array as is
    return vehicle ? result.data.map(x => ({ name: x.vehicleNo, value: x.vehicleNo })) : result.data;
}
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