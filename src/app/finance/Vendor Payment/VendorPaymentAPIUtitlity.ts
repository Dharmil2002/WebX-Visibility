import { formatDate } from "src/app/Utility/date/date-utils";

export async function GetTHCListFromApi(masterService, RequestBody) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        startdate: RequestBody.StartDate,
        enddate: RequestBody.EndDate,
        vendorNames: RequestBody.vendorList,
    }

    try {
        const res = await masterService.masterMongoPost("finance/getVendorTHCList", reqBody).toPromise();
        const SortData = res.sort((a, b) => a._id.localeCompare(b._id));
        const result = SortData.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id,
            THCamount: x.THCAmount,
            AdvancePending: x.TotaladvAmt,
            BalanceUnbilled: x.TotalcontAmt,
        })) ?? null;
        return result

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function GetAdvancePaymentListFromApi(masterService, Filters) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "thc_detail",
        filter: Filters
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res.data.map((x, index) => ({
            isSelected: false,
            THC: x.tripId,
            GenerationDate: x.tripDate
                ? formatDate(x.tripDate, "dd-MM-yy")
                : formatDate(new Date().toUTCString(), "dd-MM-yy"),
            VehicleNumber: x.vehicle,
            THCamount: x.contAmt,
            Advance: x.advAmt,
            OthersData: x
        })) ?? null;
        return result

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function GetLocationDetailFromApi(masterService) {
    try {
        const companyCode = localStorage.getItem('companyCode');
        const filter = {};
        const req = { companyCode, collectionName: 'location_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();

        if (res && res.data) {
            return res.data.map(x => ({
                name: x.locCode, value: x.locState
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}

export async function GetAccountDetailFromApi(masterService, AccountCategoryName, AccountingLocations) {
    try {
        const companyCode = localStorage.getItem('companyCode');
        const filter = {
            ActiveFlag: true,
            AccountCategoryName: AccountCategoryName,
            AccountingLocations: AccountingLocations
        };
        const req = { companyCode, collectionName: 'account_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.AccountDescription, value: x.AccountCode, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}