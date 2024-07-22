import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { SalesRegisterService } from './sales-register';
import { DocCalledAs } from 'src/app/shared/constants/docCalledAs';

@Injectable({
  providedIn: 'root'
})
export class MrRegisterService {

  constructor(private masterService: MasterService,
    private storage: StorageService,
    private salesRegisterService: SalesRegisterService) { }

  /**
    * Retrieves MR register data based on the provided filters.
    * @param data - The filter data for the MR register.
    * @param optionalRequest - Optional request parameters for additional filtering.
    * @returns A Promise that resolves to an array of MR register data.
    */

  async getMrRegisterData(data, optionalRequest) {

    // Check if docNoArray exists and is not empty
    const hasMRNO = optionalRequest.docNoArray?.length > 0;
    // Check if CnotenosArray exists and is not empty
    const hasCnoteno = optionalRequest.CnotenosArray?.length > 0;

    // Set isEmptyDocNo based on the conditions
    const isEmptyDocNo = !hasCnoteno && !hasMRNO;

    let matchQuery

    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { eNTDT: { 'D$gte': data.startDate } },
          { eNTDT: { 'D$lte': data.endDate } },
          ...(data.branch ? [{ 'eNTLOC': { 'D$eq': data.branch } }] : []),
          ...(data.customerList.length > 0 ? [{ bILNGPRT: { 'D$in': data.customerList } }] : [])
        ]
      };
    }

    if (!isEmptyDocNo) {
      matchQuery = {
        'D$and': []
      };

      // Condition: rNO in optionalRequest.docNoArray
      if (optionalRequest.docNoArray && optionalRequest.docNoArray.length > 0) {
        matchQuery['D$and'].push({ 'docNo': { 'D$in': optionalRequest.docNoArray } });
      }

      // Condition: details.tOT greater than or equal to optionalRequest.CnotenosArray
      if (optionalRequest.CnotenosArray && optionalRequest.CnotenosArray.length > 0) {
        matchQuery['D$and'].push({ 'gCNNO': { 'D$in': optionalRequest.CnotenosArray } });
      }
    }

    try {
      const reqBody = {
        companyCode: this.storage.companyCode,
        reportName: "MRRegister",
        filters: { filter: { ...matchQuery } }
      };

      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/getReportData", reqBody));
      res.data.grid.columns = this.salesRegisterService.updateColumnHeaders(res.data.grid.columns, DocCalledAs);

      const details = await Promise.all(
        res.data.data.map(async (item) => {
          const userName = await this.salesRegisterService.getUserName(item.eNTBY);
          return {
            ...item,
            eNTBY: userName, // Use the fetched userName here
            mRTP: "Delivery MR",
            Status: "Delivered",
            tDSAmt: item.tDSAmt ? item.tDSAmt.toFixed(2) : 0,
            dLVRMRAMT: item.dLVRMRAMT ? item.dLVRMRAMT.toFixed(2) : 0,
            gSTAMT: item.gSTAMT ? item.gSTAMT.toFixed(2) : 0,
            cLLCTAMT: item.cLLCTAMT ? item.cLLCTAMT.toFixed(2) : 0,
            cHQDT: item.cHQDT ? moment(item.cHQDT).local().format("DD MMM YYYY HH:mm") : "",
            eNTDT: item.eNTDT ? moment(item.eNTDT).local().format("DD MMM YYYY HH:mm") : "",
          };
        })
      );

      return {
        data: details,
        grid: res.data.grid
      };

    } catch (error) {
      console.error('Error fetching MR data:', error);
      return { data: [], grid: null }; // Ensure the structure is always returned
    }
  }
}