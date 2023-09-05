import { geoDataServices } from "../error-handing/outbox-utility";

// This function adds a job detail to a MongoDB collection using a master service.
export async function addJobDetail(jobDetail, masterService,retryAndDownloadService,geoLocationService) {
    // Prepare the request body with company code, collection name, and job detail data.
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        data: jobDetail
    }
    // Send a POST request to create the job detail in the MongoDB collection.
    const maxRetries = 3;
    try {
        const getlocation = await geoDataServices(geoLocationService);
        const res = await retryAndDownloadService.retryWithDownload(
            masterService,
            "generic/create",
            reqBody,
            maxRetries,
            "JobEntry",
            getlocation
        );
        return res
    } catch (error) {

    }
    // Return the response from the server.
}

// This function retrieves vendor details from a MongoDB collection using a master service.
export async function getVendorDetails(masterService) {
    // Prepare the request object with company code, collection name, and an empty filter.
    let req = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "collectionName": "vendor_detail",
      "filter": {}
    }
    
    // Send a POST request to retrieve vendor details from the MongoDB collection.
    const res = await masterService.masterPost("generic/get", req).toPromise()
    
    if (res) {
      // Generate srno for each object in the array and return a modified array.
      const jobDetail = res.data.map((obj, index) => {
        return {
          name: obj?.vendorName || "",
          value: obj.vendorCode || ""
        };
      });
      
      return jobDetail;
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
