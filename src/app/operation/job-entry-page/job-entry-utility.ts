const branch = localStorage.getItem("Branch");
// This function adds a job detail to a MongoDB collection using a master service.
export async function addJobDetail(jobDetail, masterService, financialYear) {

  // Prepare the request body with company code, collection name, and job detail data.
  let reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "job_detail",
    docType: "JOB",
    branch: localStorage.getItem("Branch"),
    finYear: financialYear,
    data: jobDetail,
    party: jobDetail.billingParty.toUpperCase()
  };
  // Send a POST request to create the job detail in the MongoDB collection.
  const res = await masterService.masterMongoPost("operation/Job/create", reqBody).toPromise();

  // Return the response from the server.
  return res.data.ops[0].jobId;
}

// This function retrieves vendor details from a MongoDB collection using a master service.
export async function getVendorDetails(masterService) {
  // Prepare the request object with company code, collection name, and an empty filter.
  let req = {
    "companyCode": parseInt(localStorage.getItem("companyCode")),
    "collectionName": "vendor_detail",
    "filter": { isActive: true, vendorLocation: { "D$in": [branch] } }
  }
  // Send a POST request to retrieve vendor details from the MongoDB collection.
  const res = await masterService.masterPost("generic/get", req).toPromise()
  if (res) {
    // Filter and map the array to generate 'vendorDetail'
    const vendorDetail = res.data
      .map((obj) => ({
        name: obj?.vendorName || "",
        value: obj?.vendorCode || "",
        type: obj?.vendorType || "",
        mob:obj?.vendorPhoneNo||"",
        panNo:obj?.panNo||"",
        emailId:obj?.emailId||"",
        vendorAdvance:obj?.vendorAdvance||0,
      }));

    return vendorDetail;
  }
}

// This function retrieves vendor details from a MongoDB collection using a master service.
export async function getVendorsForAutoComplete(masterService, vendor, vendorType) {
  // Prepare the request object with company code, collection name, and an empty filter.
  let req = {
    "companyCode": parseInt(localStorage.getItem("companyCode")),
    "collectionName": "vendor_detail",
    "filter": {
      'D$or': [
        { 'vendorName': { 'D$regex': `^${vendor}`, 'D$options': 'i' } },
        { 'vendorCode': { 'D$regex': `^${vendor}`, 'D$options': 'i' } }
      ],
      'vendorLocation': { 'D$elemMatch': { 'D$eq': branch } },
      'isActive': true,
      'vendorType': vendorType
    }
  }
  // Send a POST request to retrieve vendor details from the MongoDB collection.
  const res = await masterService.masterPost("generic/get", req).toPromise()
  if (res) {
    // Filter and map the array to generate 'vendorDetail'
    return res.data
      .map((obj) => ({
        name: obj?.vendorName || "",
        value: obj?.vendorCode || "",
        type: obj?.vendorType || "",
      }));
  }
}

// This function gets the next sequential number, formats it, and updates it in localStorage.
export function getNextNumber() {
  // Get the current number from localStorage
  let currentNum = parseInt(localStorage.getItem('sequenceNumber'));

  // If the number doesn't exist in localStorage, initialize it to 1
  if (!currentNum) {
    currentNum = 1;
  } else {
    currentNum = currentNum + 1;
  }

  // Format the number with leading zeros (e.g., 001, 002, ...)
  const formattedNumber = currentNum.toString().padStart(4, '0');

  // Store the new number in localStorage
  localStorage.setItem('sequenceNumber', currentNum.toString());

  // Return the formatted number
  return formattedNumber;
}
