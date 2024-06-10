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
        ...(data.DocNo != "" ? { nTNO: { D$eq: data.DocNo } }:
        {D$and: [
          { nTDT: { D$gte: data.startValue } }, 
          { nTDT: { D$lte: data.endValue } }, 
          ...(data.Individual =="Y" ? [{ eNTLOC : { D$in : data.Branch } }] : [{}]),
          ...(data.DocStatus.value != "All" 
            ? [{ sTSNM: { D$eq: data.DocStatus.name } }] : []
          ),
          ...(data.vendData && data.vendData.length > 0
            ? [{ D$expr: { D$in: ["$pARTY.cD", data.vendData.map(v => v.vCD)] } }]
            : []),
        ]}
        ),
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
    
      return {
        data: res,
        grid: res.data.grid
      };
  
    }
}
