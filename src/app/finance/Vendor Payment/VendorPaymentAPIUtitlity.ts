import moment from "moment";
import { firstValueFrom } from "rxjs";
import { formatDate } from "src/app/Utility/date/date-utils";
import { StoreKeys } from "src/app/config/myconstants";
import * as StorageService from 'src/app/core/service/storage.service';

export async function GetTHCListFromApi(masterService, RequestBody) {
    const reqBody = {
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
        branch: StorageService.getItem(StoreKeys.Branch),
        startdate: RequestBody.StartDate,
        enddate: RequestBody.EndDate,
        vendorNames: RequestBody.vendorListWithKeys,
    }

    try {
        const resAdvance: any[] = await firstValueFrom(masterService.masterMongoPost("finance/vp/getPendingSummary", reqBody));
        const result = resAdvance.sort((a, b) => {
            const aValue = a._id.split(':')[1].trim();
            const bValue = b._id.split(':')[1].trim();

            return aValue.localeCompare(bValue);
        });
        const resAdvanceresult = result.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id || "",
            Mode: x.Mode || "",
            THCamount: (x.tHCAMT || 0).toFixed(2),
            AdvancePending: (x.aDVAMT || 0).toFixed(2),
            BalanceUnbilled: (x.bALAMT || 0).toFixed(2),
            VendorInfo: x.vND,
        })) ?? null;

        return resAdvanceresult

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function GetAdvancePaymentListFromApi(masterService, Filters) {
    try {
        const reqBody = {
            companyCode: StorageService.getItem(StoreKeys.CompanyCode),
            branch: StorageService.getItem(StoreKeys.Branch),
            startdate: Filters.StartDate,
            enddate: Filters.EndDate,
            PaymentType: Filters.PaymentType,
            Mode: Filters.Mode,
            vendorNames: [`${Filters.VendorInfo.cD}:${Filters.VendorInfo.nM}`],
        }

        const res: any[] = await firstValueFrom(masterService.masterMongoPost("finance/vp/getTHCList", reqBody));
        const result = res.map((x, index) => ({
            isSelected: false,
            THC: x.docNo,
            GenerationDate: x.tHCDT ? moment(x.tHCDT).format("DD MMM YYYY") : "",
            VehicleNumber: x.vEHNO,
            THCamount: (x.tOTAMT || 0).toFixed(2),
            THCContraAmount: (x.cONTAMT || 0).toFixed(2),
            Advance: (x.aDVAMT || 0).toFixed(2),
            AdvancePending: (x.aDVPENAMT || 0).toFixed(2),
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
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
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
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
        const filter = {
            iSSYS: true,
            cATNM: AccountCategoryName,
            //AccountingLocations: AccountingLocations
        };
        const req = { companyCode, collectionName: 'account_detail', filter };
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.aCNM, value: x.aCCD, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
export async function GetSingleVendorDetailsFromApi(masterService, vendorCode) {
    try {
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
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
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
        const filter = {};
        const req = { companyCode, collectionName: 'state_master', filter };
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
export async function GetTHCListBasdedOnBillNumberFromApi(masterService, BillNumber, Mode) {
    try {
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
        const filter = { bILLNO: BillNumber };
        const req = { companyCode, collectionName: Mode == 'FTL' ? 'thc_summary' : 'thc_summary_ltl', filter };
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));

        if (res && res.data && res.data[0]) {
            const result = res.data.map((x, index) => ({
                isSelected: false,
                THC: x.docNo,
                GenerationDate: x.tHCDT ? moment(x.tHCDT).format("DD MMM YYYY") : "",
                VehicleNumber: x.vEHNO,
                THCamount: x.tOTAMT,
                THCContraAmount: (x.cONTAMT || 0).toFixed(2),
                Advance: x.aDVAMT,
                AdvancePending: x.aDVPENAMT,
                OthersData: x
            })) ?? null;
            return result
        }
        return []

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function GetSingleVendorBillDetailsFromApi(masterService, bILLNO) {
    try {
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
        const filter = { docNo: bILLNO };
        const req = { companyCode, collectionName: 'vend_bill_summary', filter };
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));

        if (res && res.data && res.data[0]) {
            return res.data[0];
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}