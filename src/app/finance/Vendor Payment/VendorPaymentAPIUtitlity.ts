import { firstValueFrom } from "rxjs";
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
        const resAdvance: any[] = await firstValueFrom(masterService.masterMongoPost("finance/vp/getPendingSummary", reqBody));

        const resAdvanceresult = resAdvance.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id || "",
            THCamount: x.tHCAMT || 0,
            AdvancePending: x.aDVAMT || 0,
            BalanceUnbilled: x.bALAMT || 0,
            VendorInfo: x.vND,
        })) ?? null;

        console.log(resAdvanceresult);

        return resAdvanceresult

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function GetAdvancePaymentListFromApi(masterService, Filters) {
    try {
        const reqBody = {
            companyCode: localStorage.getItem('companyCode'),
            branch: localStorage.getItem('Branch'),
            startdate: Filters.StartDate,
            enddate: Filters.EndDate,
            PaymentType: Filters.PaymentType,
            vendorNames: [`${Filters.VendorInfo.cD}:${Filters.VendorInfo.nM}`],
        }

        const res: any[] = await firstValueFrom(masterService.masterMongoPost("finance/vp/getTHCList", reqBody));
        const result = res.map((x, index) => ({
            isSelected: false,
            THC: x.docNo,
            GenerationDate: formatDate(x.tHCDT || new Date().toUTCString(), "dd-MM-yy"),
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
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));

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
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));
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
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));

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
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));

        return res

    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
function mergeJsonLists(list1, list2) {
    // Create a map to store vendors and their details
    const vendorMap = new Map();

    // Function to update the vendor details in the map
    function updateVendorDetails(vendorDetails, isList1) {
        const vendorKey = vendorDetails["Vendor"];
        if (vendorMap.has(vendorKey)) {
            const existingDetails = vendorMap.get(vendorKey);
            if (isList1) {
                existingDetails["AdvancePending"] += vendorDetails["AdvancePending"];
            } else {
                existingDetails["BalanceUnbilled"] += vendorDetails["BalanceUnbilled"];
            }
        } else {
            // Vendor not found, add to the map
            const defaultDetails = {
                "Vendor": vendorKey,
                "AdvancePending": isList1 ? vendorDetails["AdvancePending"] : 0,
                "BalanceUnbilled": isList1 ? 0 : vendorDetails["BalanceUnbilled"],
            };
            vendorMap.set(vendorKey, defaultDetails);
        }
    }

    // Process the first list
    list1.forEach(item => {
        updateVendorDetails(item, true);
    });

    // Process the second list
    list2.forEach(item => {
        updateVendorDetails(item, false);
    });

    // Convert map values to an array
    const mergedList = Array.from(vendorMap.values());

    return mergedList;
}


