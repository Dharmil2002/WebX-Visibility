export async function getShipment(operationService, vehicle) {
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
export async function prqDetail(operationService,dropDown) {
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "prq_detail",
        filter: {}
    };

    // Perform an asynchronous operation to fetch data from the operation service
    const result = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
  if(dropDown){
    // Filter out entries with empty or falsy values in the 'prqNo' property
    const filteredData = result.data
        .filter(x => x.prqNo && x.status !=7); // This filters out entries where 'prqNo' is falsy

    // Map the filtered data to the desired format
    const mappedData = filteredData.map(x => ({ name: x.prqNo.toString(), value: x.prqNo.toString()}));

    return mappedData;
  }
  else{
     return result.data;
  }
}

export async function thcGeneration(operationService,data){

     // Define the request body with companyCode, collectionName, and an empty filter
     const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "thc_detail",
        data: data,
        docType: "TH",
        branch: "MUMB",
        finYear: "2223"
    };
    // Perform an asynchronous operation to fetch data from the operation service
    const result = await operationService.operationMongoPost("operation/thc/create", reqBody).toPromise();
    return result;
}
export async function getThcDetail(operationService){
    
    // Define the request body with companyCode, collectionName, and an empty filter
    const reqBody = {
       companyCode: localStorage.getItem("companyCode"),
       collectionName: "thc_detail",
       filter: {}
   };
   // Perform an asynchronous operation to fetch data from the operation service
   const result = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
   return result;
}
// Define a generic function that calculates the total and updates the form control.
export function calculateTotal(form, controlName1, controlName2, resultControlName) {
    const value1 = parseFloat(form.controls[controlName1].value) || 0;
    const value2 = parseFloat(form.controls[controlName2].value) || 0;
    const total = value1 - value2;
    form.controls[resultControlName].setValue(total);
  }
