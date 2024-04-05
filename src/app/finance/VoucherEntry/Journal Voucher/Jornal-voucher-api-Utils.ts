import { StoreKeys } from 'src/app/config/myconstants';
import * as StorageService from 'src/app/core/service/storage.service';

export async function customerFromApi(masterService) {
    const branch = StorageService.getItem(StoreKeys.Branch);
    const reqBody = {
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
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
        "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
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
    const branch = StorageService.getItem(StoreKeys.Branch);
    const reqBody = {
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
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
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
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
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
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
        const companyCode = StorageService.getItem(StoreKeys.CompanyCode);
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