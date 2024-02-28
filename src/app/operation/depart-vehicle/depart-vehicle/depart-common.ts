import { FormGroup } from "@angular/forms";
import { runningNumber } from "src/app/Utility/date/date-utils";

/**
 * Retrieves loading sheet details for a specific trip and vehicle.
 * @param {number} companyCode - The company code.
 * @param {string} tripId - The ID of the trip.
 * @param {string} vehicleNo - The vehicle number.
 * @param {any} operationService - The operation service object for API calls.
 * @returns {Promise<any>} - A Promise resolving to the loading sheet details.
 */
export async function getLoadingSheetDetail(
    companyCode, tripId, vehicleNo, operationService
) {
    const reqBody = {
        companyCode: companyCode,
        collectionName: "loadingSheet_detail",
        filter: {
            vehno: vehicleNo,
            tripId: tripId
        }
    };
    try {
        const res = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
        return res.data;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}

/**
 * Retrieves driver details for a specific vehicle.
 * @param {number} companyCode - The company code.
 * @param {string} vehicleNo - The vehicle number.
 * @param {any} operationService - The operation service object for API calls.
 * @returns {Promise<any>} - A Promise resolving to the driver details.
 */
export async function getDriverDetail(
    companyCode, vehicleNo, operationService
) {
    const reqBody = {
        companyCode: companyCode,
        collectionName: "driver_detail",
        filter: {
            vehicleNo: vehicleNo
        }
    };
    try {
        const res = await operationService.operationMongoPost("common/get", reqBody).toPromise();
        return res.data;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}
// Calculates the total trip amount based on various charges and sets it in the form.
export function calculateTotal(form: FormGroup): void {
    const controls = form.controls;

    // Get values from form controls, defaulting to 0 if not present
    const otherCharge = parseFloat(controls['OtherChrge'].value) || 0;
    const loading = parseFloat(controls['Loading'].value) || 0;
    const unloading = parseFloat(controls['Unloading'].value) || 0;
    const enroute = parseFloat(controls['Enroute'].value) || 0;
    const misc = parseFloat(controls['Misc'].value) || 0;
    const cntAmt = parseFloat(controls['ContractAmt'].value) || 0;

    // Calculate the total trip amount
    const total = otherCharge + loading + unloading + enroute + misc + cntAmt;

    // Set the calculated total trip amount with 2 decimal places
    controls['TotalTripAmt'].setValue(total.toFixed(2));
}

// Calculates the total advances and sets it in the form.
export function calculateTotalAdvances(form: FormGroup): void {
    const controls = form.controls;

    // Get values from form controls, defaulting to 0 if not present
    const advance = parseFloat(controls['Advance'].value) || 0;
    const paidByCash = parseFloat(controls['PaidByCash'].value) || 0;
    const paidByBank = parseFloat(controls['PaidbyBank'].value) || 0;
    const paidByFuel = parseFloat(controls['PaidbyFuel'].value) || 0;
    const paidByCard = parseFloat(controls['PaidbyCard'].value) || 0;

    // Calculate the total advances
    const totalAdv = advance + paidByCash + paidByBank + paidByFuel + paidByCard;

    // Set the calculated total advances with 2 decimal places
    controls['TotalAdv'].setValue(totalAdv.toFixed(2));
}

// Calculates the balance amount based on total trip amount and total advances, and sets it in the form.
export function calculateBalanceAmount(form: FormGroup, totalTripAmt): void {
    const totalAdv = parseFloat(form.controls['TotalAdv'].value) || 0;

    // Calculate the balance amount
    const balanceAmount = totalTripAmt - totalAdv;

    // Set the calculated balance amount with 2 decimal places
    form.controls['BalanceAmt'].setValue(balanceAmount.toFixed(2));
}

// export async function updateTracking(companyCode, operationService,dktNo,next) {
//     const dockData = {
//       status:"In-Transit",
//       upBy:localStorage.getItem("Username"),
//       upDt:new Date().toUTCString(),
//       evnCd:""
//     }

//     const req = {
//       companyCode: companyCode,
//       type: "operation",
//       collection: "cnote_trackingv4",
//       id: dktNo,
//       updates: {
//         ...dockData
//       }
//     };

//     try {
//       const res: any = await operationService.operationPut("common/update", req).toPromise();
//        return res;
//     } catch (error) {
//       console.error("Error update a docket Status:", error);
//       return null;
//     }
//   }

/**
* Updates tracking information for a docket.
* @param {string} companyCode - The company code.
* @param {any} operationService - The operation service object for API calls.
* @param {Object} data - The data containing docket information.
* @returns {Promise<any>} - A Promise resolving to the API response.
*/
export async function updateTracking(companyCode, operationService, dktNo, next) {
    try {        
        const docketDetails = await getDocketFromApiDetail(companyCode, operationService, dktNo);
        const lastArray = docketDetails.length - 1;
        const dockData = {
            tripId: docketDetails[lastArray]?.tripId || '',
            dktNo: docketDetails[lastArray]?.dktNo || '',
            vehNo: docketDetails[lastArray]?.vehNo || '',
            route: docketDetails[lastArray]?.route || '',
            event: "Departed From"+" "+localStorage.getItem('Branch'),
            orgn: docketDetails[lastArray][lastArray]?.orgn || '',
            loc: localStorage.getItem('Branch') || '',
            dest: docketDetails[lastArray][lastArray]?.dest || '',
            lsno: docketDetails[lastArray]?.lsno || '',
            mfno: docketDetails[lastArray]?.mfno || '',
            unload:false,
            dlSt: '',
            dlTm: '',
            evnCd: '',
            upBy: localStorage.getItem('UserName') || '',
            upDt: new Date(),
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
 * Retrieves docket details from the API using provided parameters.
 *
 * @param {string} companyCode - The company code.
 * @param {object} operationService - The operation service instance.
 * @param {string} docketNo - The docket number to query.
 * @returns {Array} An array of docket details without unload items.
 * @throws {Error} If an error occurs during the retrieval process.
 */
export async function getDocketFromApiDetail(companyCode, operationService, docketNo) {
    // Prepare the request body
    const reqBody = {
        companyCode: companyCode,
        collectionName: 'cnote_tracking',
        filter: {
            dktNo: docketNo,
        },
    };

    try {
        // Retrieve data from the API and filter for valid docket details
        const res = await operationService.operationMongoPost('generic/get', reqBody).toPromise();
        const docketDetails = res.data.filter((x)=>x.unload==false);

        return docketDetails;
    } catch (error) {
        console.error('Error retrieving docket details:', error);
        throw error; // Rethrow the error for higher-level error handling if needed.
    }
}



