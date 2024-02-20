export async function customerFromApi(masterService) {
    const branch = localStorage.getItem("Branch");
    const reqBody = {
        companyCode: parseInt(localStorage.getItem('companyCode')),
        collectionName: "customer_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data.filter((x) => x.customerLocations.includes(branch)).map(x => ({ value: x.customerCode, name: x.customerName, pinCode: x.PinCode, mobile: x.customer_mobile })) ?? null;
        return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function vendorFromApi(masterService) {
    let req = {
        "companyCode": parseInt(localStorage.getItem('companyCode')),
        "collectionName": "vendor_detail",
        "filter": {}
    }
    const res = await masterService.masterPost("generic/get", req).toPromise()
    if (res) {
        const data = res?.data
            .map(x => ({ value: x.vendorCode, name: x.vendorName }))
            .filter(x => x != null)
            .sort((a, b) => a.value.localeCompare(b.value));

        return data
    }
}
export async function UsersFromApi(masterService) {
    const branch = localStorage.getItem("Branch");
    const reqBody = {
        companyCode: parseInt(localStorage.getItem('companyCode')),
        collectionName: "user_master",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data.filter((x) => x.branchCode.includes(branch)).map(x => ({ value: x.userId, name: x.name })) ?? null;
        return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}
export async function DriversFromApi(masterService) {
    const reqBody = {
        companyCode: parseInt(localStorage.getItem('companyCode')),
        collectionName: "driver_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data.map(x => ({ value: x.manualDriverCode, name: x.driverName })) ?? null;
        return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}
export async function GetSingleVendorDetailsFromApi(masterService, vendorCode) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = { vendorCode };
        const req = { companyCode, collectionName: 'vendor_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();

        if (res && res.data && res.data[0].otherdetails) {
            return res.data[0].otherdetails.map(x => ({ name: x.gstState, value: x.gstNumber, othersdetails: res.data[0] }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
export async function GetSingleCustomerDetailsFromApi(masterService, customerCode) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = { customerCode };
        const req = { companyCode, collectionName: 'customer_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();

        if (res && res.data && res.data[0].GSTdetails) {
            return res.data[0].GSTdetails.map(x => ({
                name: x.gstState, value: x.gstNo, othersdetails: res.data[0]
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}

export async function GetLocationDetailFromApi(masterService) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
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

export async function GetsachsnFromApi(masterService) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = {};
        const req = { companyCode, collectionName: 'sachsn_master', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.SNM, value: x.SHCD, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
export async function GetAccountDetailFromApi(masterService, AccountCategoryName, AccountingLocations) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = {
            iSSYS: true,
            cATNM: AccountCategoryName,
            // AccountingLocations: AccountingLocations
        };
        const req = { companyCode, collectionName: 'account_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();
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


export async function GetDocumentsWiseListFromApi(
    masterService,
    collectionName,
    field,
    value,
    fixedfield?,
    fixedvalue?,
    fixedoriginfield?,
    fixedoriginvalue?
) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filters = [
            {
                field: field,
                value: value,
                exactMatch: false,
            },
        ];

        // Check if fixedfield and fixedvalue are provided and not undefined
        if (fixedfield !== undefined && fixedvalue !== undefined) {
            filters.push({
                field: fixedfield,
                value: fixedvalue,
                exactMatch: true,
            });
        }
        // Check if fixedfield and fixedvalue are provided and not undefined
        if (fixedoriginfield !== undefined && fixedoriginvalue !== undefined) {
            filters.push({
                field: fixedoriginfield,
                value: fixedoriginvalue,
                exactMatch: true,
            });
        }

        const req = { companyCode, collectionName: collectionName, filters };
        const res = await masterService.masterPost('generic/getaggregate', req).toPromise();

        if (res && res.data) {
            return res.data.map((x) => ({
                name: x[field],
                value: x[field],
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}

export async function GetBankDetailFromApi(masterService, ApplicationLocations) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = {
            isActive: true,
            ApplicationLocations: ApplicationLocations,
        };
        const req = { companyCode, collectionName: 'Bank_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.Bankname, value: x.
                    Accountnumber, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
