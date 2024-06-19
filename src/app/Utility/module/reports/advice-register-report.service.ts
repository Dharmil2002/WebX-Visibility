import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdviceRegisterReportService {

  constructor(private masterService: MasterService,
    private storage: StorageService) { }
  //#region to get advice register report
  async getAdviceRegister(data, optionalRequest) {
    const hasPaymentMode = optionalRequest.PaymentMode !== '' && optionalRequest.PaymentMode !== undefined;
    const hasDocNo = optionalRequest.docNoArray.some(value => value !== '' && value !== undefined);

    const isEmptyDocNo = !hasPaymentMode && !hasDocNo;

    let matchQuery;

    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { aDDT: { 'D$gte': data.startValue } }, // Start date condition
          { aDDT: { 'D$lte': data.endValue } }, // End date condition       
          ...(data.location ? [{ 'rBRANCH': { 'D$in': data.location } }] : []), // Location condition
          ...(data.advicetype ? [{ 'aDTYP': { 'D$in': [data.advicetype] } }] : []), // Advice type condition
          ...(data.Status ? [{ 'sTCD': { 'D$in': [data.Status] } }] : []), // Status condition
        ],
      };
    } else {
      matchQuery = { 'D$and': [] };

      // Condition: docNo in optionalRequest.docNoArray
      if (optionalRequest.docNoArray && optionalRequest.docNoArray.length > 0) {
        matchQuery['D$and'].push({ 'docNo': { 'D$in': optionalRequest.docNoArray } });
      }

      // Condition: pMODE in optionalRequest.PaymentMode
      if (optionalRequest.PaymentMode !== "") {
        matchQuery['D$and'].push({ 'pMODE': { 'D$in': [optionalRequest.PaymentMode] } });
      }
    }

    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "AdviceRegister",
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    };

    const res = await firstValueFrom(this.masterService.masterMongoPost("generic/getReportData", reqBody));
    const details = res.data.data.map((item) => ({
      ...item,
      aDVDT: item.aDVDT ? moment(item.aDVDT).format("DD MMM YY HH:mm") : "",
      aCKDT: item.aCKDT ? moment(item.aCKDT).format("DD MMM YY HH:mm") : "",
      dT: item.dT ? moment(item.dT).format("DD MMM YY HH:mm") : "",
      aMT: item.aMT ? item.aMT.toFixed(2) : 0,
    }));

    return {
      data: details,
      grid: res.data.grid
    };
  }
  //#endregion
}