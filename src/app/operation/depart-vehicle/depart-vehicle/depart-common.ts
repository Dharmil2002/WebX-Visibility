import { FormGroup } from "@angular/forms";

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
        type: "operation",
        collection: "loadingSheet_detail",
        query: {
            vehno: vehicleNo,
            tripId: tripId
        }
    };
    try {
        const res = await operationService.operationPost("common/getOne", reqBody).toPromise();
        return res.data.db.data.loadingSheet_detail;
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
        type: "masters",
        collection: "driver_detail",
        query: {
            vehicleNo: vehicleNo
        }
    };
    try {
        const res = await operationService.operationPost("common/getOne", reqBody).toPromise();
        return res.data.db.data.driver_detail;
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
