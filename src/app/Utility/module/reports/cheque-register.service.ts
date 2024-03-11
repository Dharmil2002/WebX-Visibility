import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeRegisterService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }

  async getChequeRegister(data, optionalRequest) {

    // Check if the array contains only empty strings
    const isEmptyDocNo = optionalRequest.docNoArray.every(value => value === "");
    let matchQuery
    matchQuery = {
      'D$and': [
        { pMD: { 'D$ne': "Cash" } },
        { tTDT: { 'D$gte': data.startValue } },
        { tTDT: { 'D$lte': data.endValue } },
        ...([{ lOC: { 'D$in': data.branch } }]), //branch condition
        ...(data.customer.length > 0 ? [{ pNAME: { 'D$in': data.customer } }] : []),
        ...(data.vendor.length > 0 ? [{ pNAME: { 'D$in': data.vendor } }] : []),
      ],
    };
    if (!isEmptyDocNo) {
      matchQuery = {
        'D$or': [
          { 'rNO': { 'D$in': optionalRequest.docNoArray } },
          {
            'nNETP': {
              'D$gte': optionalRequest.startAmt,
              'D$lte': optionalRequest.endAmt
            }
          }
        ]
      };
    }
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "voucher_trans",
      filters: [
        {
          D$match: matchQuery
        }
      ]
    };

    const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
   // console.log(res.data);
    return res.data
  }
}
