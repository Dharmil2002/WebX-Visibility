/**
 * Maps and transforms input data into a new array with additional properties.
 * @param {Array} data - The input data to be transformed.
 * @param {Object} nestedDetail - Nested details to be included in the transformation.
 * @returns {Array} - The transformed array.
 */
export async function rateDetailMapping(data, nestedDetail) {
    // Destructure nestedDetail if available, otherwise default to empty objects
    const { RakeNo, FromToCity } = nestedDetail || {};
    const detail=data.find((x)=>x.rakeId===RakeNo).containorDetail;
    // Map the input data to a new array with additional properties
    const rakeArray = detail.map((element, index) => ({
      SlNo: index + 1,
      RakeNo: RakeNo || "",            // Rake number from nestedDetail
      FromToCity: FromToCity || "",        // From city from nestedDetail
      Weight: element.weight,          // Weight from the current element
      BillingParty: element.billingParty,  // Billing party from the current element
      CNNo: element.hasOwnProperty('CNNo') ? element.CNNo : "", // Unique CNNo value if present
      JobNo: element.hasOwnProperty('jobNo') ? element.jobNo : "", // Unique jobNo value if present
    }));
  
    return rakeArray;
  }
  