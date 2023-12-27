import Swal from "sweetalert2";

/**
 * Retrieves the list of vendor contracts from the API.
 * @param {MasterService} masterService - The service used to communicate with the API.
 * @returns {Promise<Array>} - A promise that resolves to an array of vendor contracts.
 */
export async function getContractList(masterService, filterFieldName?: string, filterId?: string) {
    try {
        // Prepare request to fetch existing vendor contracts
        const request = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "vendor_contract",
            filter: { [filterFieldName]: filterId }
        };

        // Fetch vendor contract list from the API
        const vendorContractList = await masterService.masterPost("generic/get", request).toPromise();

        if (vendorContractList) {
            // Process the data to filter, sort, and map to the desired format
            const processedData = vendorContractList?.data
                .filter(contract => contract != null)
                .sort((a, b) => b.cNID.localeCompare(a.cNID)) // Sort in descending order based on cNID
                .map(item => ({
                    ...item,
                    status: "Active", // You need to replace this with your actual status calculation logic
                }));

            return processedData;
        }
    } catch (error) {
        // Handle errors appropriately (e.g., log, throw, or return a default value)
        console.error("Error fetching vendor contracts:", error);
        throw error; // Rethrow the error to be handled by the caller or provide a default value
    }
}
//#region to get contract Vendor Product
/**
 * Retrieves contracts based on the provided vendor ID and/or product ID.
 * @param {Object} masterService - The master service for making API calls.
 * @param {string} vendorID - The vendor ID to filter contracts.
 * @param {string} productId - The product ID to filter contracts.
 * @returns {Promise<Array>} - An array of contracts that match the provided filters.
 */
export async function GetContractBasedOnVendorAndProduct(masterService, vendorID?, productId?) {
    // Create a filter object based on the provided vendor ID and/or product ID.
    let filter = {};
    if (vendorID) {
        filter["vNID"] = vendorID;
    }
    if (productId) {
        filter["pDTID"] = productId;
    }

    // Construct the request object with necessary parameters.
    let req = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "vendor_contract",
        filter: filter,
    };

    try {
        // Make an API call to fetch contracts based on the provided filters.
        const res = await masterService.masterPost("generic/get", req).toPromise();

        // Check if the response and data are present.
        if (res && res.data) {
            // Process the data by filtering out null values, sorting, and adding a status.
            const data = res.data
                .filter((x) => x != null)
                .sort((a, b) => a.cNID.localeCompare(b.value))
                .map((item) => ({
                    ...item,
                    status: "Active", // You need to replace this with your actual status calculation logic
                }));

            // Return the processed data.
            return data;
        } else {
            // Log an error if data retrieval fails.
            console.error("Failed to fetch data from the server.");
            // Handle the error or throw an exception.
        }
    } catch (error) {
        // Log an error if an exception occurs during the API call.
        console.error("An error occurred during the API call:", error);
    }
}
//#endregion

//#region to remove Data from table
/**
 * Removes data from a specified collection using the master service.
 *
 * @param {Object} masterService - The master service object that provides data manipulation methods.
 * @param {string} id - The ID of the document to be removed.
 * @param {string} collectionName - The name of the collection from which to remove the document.
 */
export async function removeData(masterService, id, collectionName) {
    // Construct the request object
    const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: collectionName,
        filter: { _id: id },
    };

    try {
        // Make an asynchronous request to remove data using the master service
        const res = await masterService.masterMongoRemove("generic/remove", req).toPromise();
        // console.log(res);
        if (res.success) {
            // Display success message
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.message,
                showConfirmButton: true,
            });
        }
    } catch (error) {
        // Handle errors, log them, or throw further as needed
        console.error('Error removing data:', error);
    }
}

//#endregion 
//#region to check duplicates in bulk upload
/**
 * Checks for duplicates in an array of objects based on specified keys.
 * If a duplicate is found, the error message is pushed to the "error" array.
 * @param {Array} data - The array of objects to check for duplicates.
 * @param {string} tableData - The array of objects containing reference data for comparison.
 * @param {string} tblRouteKey - The key representing the 'Route' property in each object of tableData.
 * @param {string} tblCapacityKey - The key representing the 'Capacity' property in each object of tableData.
 * @param {string} flRouteKey - The key representing the 'Route' property in each object of data.
 * @param {string} flCapacityKey - The key representing the 'Capacity' property in each object of data.
 * @returns {Array} sortedValidatedData - The array of objects with duplicates flagged in the 'error' property.
 */
export async function checkForDuplicatesInBulkUpload(data, tableData, tblRouteKey, tblCapacityKey, flRouteKey, flCapacityKey) {
    // Set to store unique combinations of Route and Capacity from tableData
    const uniqueEntries = new Set();

    // Extract values from tableData using provided keys and create unique key
    tableData.forEach(tableEntry => {
        const key = `${tableEntry[tblRouteKey]}-${tableEntry[tblCapacityKey]}`;
        uniqueEntries.add(key);
    });

    // Filter out data with errors
    const dataWithoutErrors = data.filter(entry => !entry.error);

    // Iterate through each object in the array
    dataWithoutErrors.forEach(entry => {
        // Initialize entry.error as an array if it's null
        entry.error = entry.error || [];

        // Create a key based on the specified Route and Capacity keys
        const key = `${entry[flRouteKey]}-${entry[flCapacityKey]}`;

        // Check if the key is already in the set (duplicate entry)
        if (uniqueEntries.has(key)) {
            // Push an error message to the 'error' array
            entry.error.push(`Duplicate entry for ${key}`);
        } else {
            // Add the key to the set if it's not a duplicate
            uniqueEntries.add(key);
        }
    });

    // Filter out objects with errors
    const objectsWithErrors = data.filter(obj => obj.error.length !== 0);

    // Filter out objects with no errors and set 'error' property to null
    const objectsWithoutErrors = data
        .filter(obj => obj.error.length === 0)
        .map(obj => ({ ...obj, error: null }));

    // Concatenate the two arrays, putting objects without errors first
    const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];

    return sortedValidatedData;
}
//#endregion