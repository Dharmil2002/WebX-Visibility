import { StoreKeys } from 'src/app/config/myconstants';
import * as StorageService from 'src/app/core/service/storage.service';

export async function manualvoucharDetail(masterService) {
    const req = {
        companyCode: StorageService.getItem(StoreKeys.CompanyCode),
        collectionName: "voucher_trans",
        filter: {
            bRC: StorageService.getItem(StoreKeys.Branch),
            rEVFLAG: { D$ne: "N" }
        }
    }
    if (StorageService.getItem(StoreKeys.Branch) == 'HQTR') {
        delete req.filter.bRC;
    }
    const res = await masterService.masterPost("generic/get", req).toPromise();
    return res.data; 
}