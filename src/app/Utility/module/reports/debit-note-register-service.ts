import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteRegisterService {
  constructor(private masterService: MasterService,
    private storage: StorageService,) { }
    async GetDebitNoteDetails(data) {
      let matchQuery = {
        ... {tYP:{D$eq:'D'}},
        ...(data.DocNos && data.DocNos.length > 0
          ?  {
            D$or: data.DocNos.map(D => ({
              D$or: [
                { nTNO: { D$in: [D] } },
                { docNo: { D$in: [D] } }
              ]
            }))
          }
          : data.VoucherNos && data.VoucherNos.length > 0
          ? { vNO: { D$in: data.VoucherNos } }
          : {}),
        ...(!((data.DocNos && data.DocNos.length > 0) || (data.VoucherNos && data.VoucherNos.length > 0))
        ?{D$and: [
          { nTDT: { D$gte: data.startValue } }, 
          { nTDT: { D$lte: data.endValue } }, 
          ...(data.Individual =="Y" ? [{ eNTLOC : { D$in : data.Branch } }] : [{}]),
          ...(data.DocStatus.value != "All" 
            ? [{ sTS: { D$eq: data.DocStatus.value } }] : []
          ),
          ...(data.vendData && data.vendData.length > 0
            ? [{ D$expr: { D$in: ["$pARTY.cD", data.vendData.map(v => v.vCD)] } }]
            : []),
        ]}
        : {})
      };
      const reqBody = {
        companyCode: this.storage.companyCode,
        reportName: "DebitNoteRegister",
        filters: {
          filter: {
            ...matchQuery,
          }
        }
      }
      const res = await firstValueFrom(
        this.masterService.masterMongoPost("generic/getReportData", reqBody)
      );
      const details = res.data.data.map((item) => ({
        ...item,
        nTDT: item.nTDT ? moment(item.nTDT).format("DD-MMM-YY") : "",
        bGNDT: item.bGNDT ? moment(item.bGNDT).format("DD-MMM-YY") : "",
        sTSDT: item.sTSDT ? moment(item.sTSDT).format("DD-MMM-YY") : "",
        cNLDT: item.cNLDT ? moment(item.cNLDT).format("DD-MMM-YY") : "",
      }));
      return {
        data: details,
        grid: res.data.grid
      };
  
    }
}
