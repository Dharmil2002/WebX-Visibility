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
export async function prqDetail(operationService) {
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "prq_detail",
        filter: {}
    };

    // Perform an asynchronous operation to fetch data from the operation service
    const result = await operationService.operationMongoPost("generic/get", reqBody).toPromise();

    // Filter out entries with empty or falsy values in the 'prqNo' property
    const filteredData = result.data
        .filter(x => x.prqNo); // This filters out entries where 'prqNo' is falsy

    // Map the filtered data to the desired format
    const mappedData = filteredData.map(x => ({ name: x.prqNo.toString(), value: x.prqNo.toString()}));

    return mappedData;
}

export async function thcGeneration(operationService,data){

     // Define the request body with companyCode, collectionName, and an empty filter
     const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "thc_detail",
        data: data
    };
    // Perform an asynchronous operation to fetch data from the operation service
    const result = await operationService.operationMongoPost("generic/create", reqBody).toPromise();
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
