import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
     providedIn: "root",
})
export class TDSRegisterReportService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }
     async getTDSRegisterDetail(data) {
          const tdsSect = data.tdsSection ? data.tdsSection.map(x => x.CD) || [] : [];
          const custNM = data.custName ? data.custName.map(x => x.CD) || [] : [];
          const isEmptyDocNo = data.docNoArray.every(value => value === "");
          const isEmptyVouNo = data.vouNoArray.every(value => value === "");
          let matchQuery
          if (isEmptyDocNo && isEmptyVouNo) {
               matchQuery = {
                    'D$and': [
                         { eNTDT: { 'D$gte': data.startValue } },
                         { eNTDT: { 'D$lte': data.endValue } },
                         {
                              'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                         },
                         ...([{ bRC: { 'D$in': data.branch } }]),
                         ...(data.fnYear ? [{ 'fYEAR': data.fnYear }] : []),
                         ...(custNM.length > 0 ? [{ 'D$expr': { 'D$in': ['$pCODE', custNM] } }] : []),
                         ...(tdsSect.length > 0 ? [{ 'D$expr': { 'D$in': ['$tDSCD', tdsSect] } }] : [])
                    ]
               };
          }
          if (!isEmptyDocNo) {
               matchQuery = {
                    'vTNO': { 'D$in': data.docNoArray }
               };
          }
          if (!isEmptyVouNo) {
               matchQuery = {
                    'vNO': { 'D$in': data.vouNoArray }
               };
          }
          const reqBody = {
               companyCode: this.storage.companyCode,
               reportName: "TDSRegister",
               filters: {
                    filter: {
                         ...matchQuery,
                    },
                    projectFilters: {
                         ...(data.msme?{msme: true}:{})
                    }
               }
          }
          const res = await firstValueFrom(
               this.masterServices.masterMongoPost("generic/getReportData", reqBody)
          );
          return {
               data: res,
               grid: res.data.grid
          };
     }
}