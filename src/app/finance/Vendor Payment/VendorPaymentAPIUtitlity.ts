import { formatDate } from "src/app/Utility/date/date-utils";

export async function GetTHCListFromApi(masterService, RequestBody) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        branch: localStorage.getItem('Branch'),
        startdate: RequestBody.StartDate,
        enddate: RequestBody.EndDate,
        vendorNames: RequestBody.vendorList,
    }

    try {
        const res = await masterService.masterMongoPost("finance/getVendorTHCList", reqBody).toPromise();
        const SortData = res.sort((a, b) => a.VendorName.localeCompare(b.VendorName));
        const result = SortData.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id?.Vendor,
            THCamount: (x.TotaladvAmt || 0) + (x.TotalcontAmt || 0),
            AdvancePending: x.TotaladvAmt,
            BalanceUnbilled: x.TotalcontAmt,
            data: x.data,
            VendorInfo: x.VendorInfo
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
        collectionName: "thc_summary",
        filter: Filters
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res.data.map((x, index) => ({
            isSelected: false,
            THC: x.docNo,
            GenerationDate: x.eNTDT
                ? formatDate(x.eNTDT, "dd-MM-yy")
                : formatDate(new Date().toUTCString(), "dd-MM-yy"),
            VehicleNumber: x.vEHNO,
            THCamount: x.cONTAMT,
            Advance: x.aDVAMT,
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
export async function GetSingleVendorDetailsFromApi(masterService, vendorCode) {
    try {
        const companyCode = localStorage.getItem('companyCode');
        const filter = { vendorCode: vendorCode };
        const req = { companyCode, collectionName: 'vendor_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();

        if (res && res.data && res.data[0]) {
            return res.data[0];
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
export async function GetStateListFromAPI(masterService) {
    try {
        const companyCode = localStorage.getItem('companyCode');
        const filter = {};
        const req = { companyCode, collectionName: 'state_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();

        return res

    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}