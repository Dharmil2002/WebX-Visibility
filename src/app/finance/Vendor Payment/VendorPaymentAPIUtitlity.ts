import { formatDate } from "src/app/Utility/date/date-utils";

export async function GetTHCListFromApi(masterService, RequestBody) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        branch: localStorage.getItem('Branch'),
        startdate: RequestBody.StartDate,
        PaymentMode: "Advance",
        enddate: RequestBody.EndDate,
        vendorNames: RequestBody.vendorList,
    }

    try {
        const resAdvance = await masterService.masterMongoPost("finance/getVendorTHCList", reqBody).toPromise();
        reqBody.PaymentMode = "Balance";
        const resbalance = await masterService.masterMongoPost("finance/getVendorTHCList", reqBody).toPromise();

        const resAdvanceresult = resAdvance.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id?.Vendor,
            THCamount: x.THCAmount,
            AdvancePending: x.TotalPendingAmount,
            data: x.data,
            VendorInfo: x.VendorInfo
        })) ?? null;

        const resbalanceresult = resbalance.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x._id?.Vendor,
            THCamount: x.THCAmount,
            BalanceUnbilled: x.TotalPendingAmount,
            data: x.data,
            VendorInfo: x.VendorInfo
        })) ?? null;
        console.log(resAdvanceresult)
        console.log(resbalanceresult)

        // Merge the lists
        const mergedList = mergeJsonLists(resAdvanceresult, resbalanceresult);

        // Display the result
        console.log(mergedList);
        return resAdvanceresult

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


