import { debug } from "console";

   /**
 * Updates tracking information for a docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {Object} data - The data containing docket information.
 * @returns {Promise<any>} - A Promise resolving to the API response.
 */
export async function updateTracking(companyCode, operationService,data,dktNo) {
  
  try {
    const docketDetails = await getDocketFromApiDetail(companyCode, operationService,dktNo);
    const lastArray=docketDetails.length-1;
    const dockData = {
      tripId:docketDetails[lastArray]?.tripId || '',      
      dktNo:dktNo || '',
      vehNo: docketDetails[lastArray]?.vehNo || '',
      route: docketDetails[lastArray]?.route || '',
      event:"Menifest Generated At" +" "+localStorage.getItem('Branch'),
      orgn: docketDetails[lastArray]?.orgn || '',
      loc: localStorage.getItem('Branch') || '',
      dest: docketDetails[lastArray]?.dest || '',
      lsno: docketDetails[lastArray]?.lsNo || '',
      mfno:data?.mfNo||"",
      unload:false,
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
      dktNo: docketNo,
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
