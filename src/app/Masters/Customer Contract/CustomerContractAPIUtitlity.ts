import { filter } from "rxjs/operators";
export async function customerFromApi(masterService) {
  const branch = localStorage.getItem("Branch");
  const reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "customer_detail",
    filter: {},
  };
  try {
    const res = await masterService
      .masterMongoPost("generic/get", reqBody)
      .toPromise();
    const result =
      res?.data
        .filter((x) => x.customerLocations.includes(branch))
        .map((x) => ({
          value: x.customerCode,
          name: x.customerName,
          pinCode: x.PinCode,
          mobile: x.customer_mobile,
        })) ?? null;
    return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}
export async function PayBasisdetailFromApi(masterService, filterType?) {
  const reqBody = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "General_master",
    filter: { codeType: filterType, activeFlag: true },
  };
  try {
    const PayBasisResponse = await masterService
      .masterPost("generic/get", reqBody)
      .toPromise();

    // Use the correct filter condition with a return statement
    const data = PayBasisResponse.data.filter((x) => {
      return x.codeType === filterType;
    });
    const dataList = data.map((x) => {
      return { value: x.codeId, name: x.codeDesc };
    });
    return dataList;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

export async function productdetailFromApi(masterService) {
  let req = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "product_detail",
    filter: {},
  };
  const res = await masterService.masterPost("generic/get", req).toPromise();
  if (res) {
    const data = res?.data
      .map((x) => ({
        value: x.ProductID,
        name: x.ProductName,
      }))
      .filter((x) => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
    return data;
  }
}
export async function GetContractListFromApi(masterService) {
  let req = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "cust_contract",
    filter: {},
  };
  const res = await masterService.masterPost("generic/get", req).toPromise();
  if (res) {
    const data = res?.data
      .filter((x) => x != null)
      .sort((a, b) => a.cONID.localeCompare(b.value))
      .map((item) => ({
        ...item,
        status: "Active", // You need to replace this with your actual status calculation logic
      }));

    return data;
  }
}

export async function GetContractBasedOnCustomerAndProductListFromApi(masterService, CustomerId?, ProductId?, payBasis?) {
  let filter = {};
  if (CustomerId) {
    filter["cUSTID"] = CustomerId;
  }
  if (ProductId) {
    filter["pID"] = ProductId;
  }
  if (payBasis) {
    filter["pBAS"] = payBasis;
  }

  let req = {
    companyCode: localStorage.getItem("companyCode"),
    collectionName: "cust_contract",
    filter: filter,
  };

  const res = await masterService.masterPost("generic/get", req).toPromise();
  if (res) {
    const data = res?.data
      .filter((x) => x != null)
      .sort((a, b) => a.cONID.localeCompare(b.value)).map((item) => ({
        ...item,
        status: "Active", // You need to replace this with your actual status calculation logic
      }));

    return data;
  }
}
//#region to check duplicates in bulk upload
/**
 * Checks for duplicates in an array of objects based on specified keys.
 * If a duplicate is found, the error message is pushed to the "error" array.
 * @param {Array} data - The array of objects to check for duplicates.
 * @param {string} tableData - The array of objects containing reference data for comparison.
 * @param {string} tblfromKey - The key representing the 'Route' property in each object of tableData.
 * @param {string} tblcapacityKey - The key representing the 'Capacity' property in each object of tableData.
 * @param {string} flRouteKey - The key representing the 'Route' property in each object of data.
 * @param {string} flCapacityKey - The key representing the 'Capacity' property in each object of data.
 * @returns {Array} sortedValidatedData - The array of objects with duplicates flagged in the 'error' property.
 */
export async function checkForDuplicatesInFreightUpload(data, tableData, flfromKey, fltoKey,
  flcapacityKey, tblfromKey, tbltoKey, tblcapacityKey) {

  // Set default values for keys
  flcapacityKey = flcapacityKey || '';
  // Set to store unique combinations of Route and Capacity from tableData
  const uniqueEntries = new Set();

  // Extract values from tableData using provided keys and create unique key
  tableData.forEach(tableEntry => {
    const key = `${tableEntry[tblfromKey]}-${tableEntry[tbltoKey]}-${tableEntry[tblcapacityKey]}-${tableEntry['vFDT']}-${tableEntry['vEDT']}`;
    uniqueEntries.add(key);
  });

  // Filter out data with errors
  const dataWithoutErrors = data.filter(entry => !entry.error);

  // Iterate through each object in the array
  dataWithoutErrors.forEach(entry => {
    // Initialize entry.error as an array if it's null
    entry.error = entry.error || [];

    // Create a key based on the specified Route, Capacity, FromDate, and EndDate keys
    const key = `${entry[flfromKey]}-${entry[fltoKey]}-${entry[flcapacityKey]}-${entry['ValidFromDate']}-${entry['ValidToDate']}`;

    // Check if the key is already in the set (duplicate entry)
    if (uniqueEntries.has(key)) {
      // Push an error message to the 'error' array
      entry.error.push(`Duplicate entry`);
    } else {
      // Add the key to the set if it's not a duplicate
      uniqueEntries.add(key);
    }

    // Check if the from date and end date exist between records
    dataWithoutErrors.forEach(otherEntry => {
      if (
        otherEntry !== entry && // Ensure we're not comparing the same entry
        otherEntry['ValidFromDate'] <= entry['ValidToDate'] && // Check if other entry's from date is before or equal to this entry's end date
        otherEntry['ValidToDate'] >= entry['ValidFromDate'] // Check if other entry's end date is after or equal to this entry's from date
      ) {
        entry.error.push(`Conflict with another entry`);
      }
    });
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
