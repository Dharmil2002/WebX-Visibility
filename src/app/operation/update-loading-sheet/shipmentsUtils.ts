import { extractUniqueValues } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { runningNumber } from "src/app/Utility/date/date-utils";

// This utility function groups shipments by leg
export function groupShipmentsByLeg(shipingTableData) {
  let groupedData = {};

  shipingTableData.forEach(element => {
    let leg = element.Leg.trim();

    // Check if the leg already exists in the groupedData object
    if (!groupedData.hasOwnProperty(leg)) {
      groupedData[leg] = {
        Leg: leg,
        Shipment: 0,
        Packages: 0,
        WeightKg: 0,
        VolumeCFT: 0
      };
    }

    // Increment the shipment count
    groupedData[leg].Shipment += 1;

    // Calculate Packages, WeightKg, and VolumeCFT for the current leg
    groupedData[leg].Packages += ConvertToNumber(element.Packages)
    groupedData[leg].WeightKg += ConvertToNumber(element.KgWt || 0, 2);
    groupedData[leg].VolumeCFT += ConvertToNumber(element.CftVolume);
  });

  return Object.values(groupedData);
}

/**
* Updates tracking information for a docket.
* @param {string} companyCode - The company code.
* @param {any} operationService - The operation service object for API calls.
* @param {Object} data - The data containing docket information.
* @returns {Promise<any>} - A Promise resolving to the API response.
*/
export async function updateTracking(companyCode, operationService, dktNo,tripId) {
  try {
    const docketDetails = await getDocketFromApiDetail(companyCode, operationService, dktNo);    
    const lastArray = docketDetails.length - 1;
    const dockData = {
      tripId:tripId || '',
      dktNo: docketDetails[lastArray]?.dktNo || '',
      vehNo: docketDetails[lastArray]?.vehNo || '',
      route: docketDetails[lastArray]?.route || '',
      event: "UnLoaded At" + " " + localStorage.getItem("Branch"),
      orgn: docketDetails[lastArray]?.orgn || '',
      loc: localStorage.getItem('Branch') || '',
      dest: docketDetails[lastArray]?.dest || '',
      lsno: docketDetails[lastArray]?.lsNo || '',
      mfno: docketDetails[lastArray]?.mfNo || "",
      unload:true,
      dlSt: '',
      dlTm: '',
      evnCd: '',
      upBy: localStorage.getItem('Username') || '',
      upDt: new Date().toUTCString(),
    };

    const req = {
      companyCode: companyCode,
      collectionName: 'cnote_tracking',
      data: dockData
    };

    const res = await operationService.operationMongoPost('generic/create', req).toPromise();
    return res;

  } catch (error) {
    console.error('Error updating docket status:', error);
    return null;
  }
}

/**
 * Retrieves loading sheet details for a specific docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {string} docketNo - The docket number.
 * @returns {Promise<any>} - A Promise resolving to the docket details.
 */
export async function getDocketFromApiDetail(companyCode, operationService, docketNo) {
  const reqBody = {
    companyCode: companyCode,
    collectionName: 'cnote_tracking',
    filter: {
      dktNo: docketNo
    },
  };

  try {
    const res = await operationService.operationMongoPost('generic/get', reqBody).toPromise();
    const uniqueDktNumbers = extractUniqueValues(res.data, 'dktNo');
    return uniqueDktNumbers
  } catch (error) {
    console.error('Error retrieving docket details:', error);
    throw error; // Rethrow the error for higher-level error handling if needed.
  }
}


/**
* Updates tracking information for a docket.
* @param {string} companyCode - The company code.
* @param {any} operationService - The operation service object for API calls.
* @param {Object} data - The data containing docket information.
* @returns {Promise<any>} - A Promise resolving to the API response.
*/
export async function updateLoadingSheet(companyCode, operationService, lsno, loadedKg, loadedVolumeCft) {
  try {
    const tripDetails = {
      loadedKg: parseFloat(loadedKg) - parseFloat(loadedKg),
      loadedVolumeCft: parseFloat(loadedVolumeCft) - parseFloat(loadedVolumeCft)
    }
    const req = {
      companyCode: companyCode,
      collectionName: 'loadingSheet_detail',
      filter:{ id: lsno},
      update: {
        ...tripDetails,
      }
    };

    const res = await operationService.operationPost('common/create', req).toPromise();
    return res;
  } catch (error) {
    console.error('Error updating docket status:', error);
    return null;
  }
}


/**
 * Retrieves loading sheet details for a specific docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {string} docketNo - The docket number.
 * @returns {Promise<any>} - A Promise resolving to the docket details.
 */
export async function loadingSheetDetails(companyCode, operationService, tripId) {
  const reqBody = {
    companyCode: companyCode,
    collectionName: 'loadingSheet_detail',
    filter: {
      tripId: tripId,
    },
  };

  try {
    const res = await operationService.operationMongoPost('generic/get', reqBody).toPromise();
    return res.data;
  } catch (error) {
    console.error('Error retrieving docket details:', error);
    throw error; // Rethrow the error for higher-level error handling if needed.
  }
}