import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericActions, StoreKeys } from 'src/app/config/myconstants';
import { environment } from 'src/environments/environment';
import * as StorageService from '../storage.service';
import { MasterService } from '../Masters/master.service';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VoucherServicesService {

  constructor(private http: HttpClient, private masterService: MasterService) { }
  //here is create for post request//
  FinancePost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }

  async GetAccountDetailFromApi() {
    try {
      const companyCode = parseInt(StorageService.getItem(StoreKeys.CompanyCode));
      const filter = {};
      const req = { companyCode, collectionName: 'account_detail', filter };
      const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      if (res && res.data) {
        return res.data.map((item) => {
          return {
            LeadgerCode: item.aCCD,
            LeadgerName: item.aCNM,
            LeadgerCategory: item.mRPNM
          };
        });
      }
      else {
        return [];
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return [];
  }
  //#endregion Delete Vouchers And Vouchers Details Based on Voucher Id
  async DeleteVoucherAndVoucherDetails(voucherId) {
    try {
      const companyCode = parseInt(StorageService.getItem(StoreKeys.CompanyCode));

      // Delete from Voucher Transaction Details
      const detailsReq = {
        companyCode: companyCode,
        collectionName: 'voucher_trans_details',
        filter: { cID: companyCode, vNO: voucherId }
      };
      const detailsRes = await firstValueFrom(this.masterService.masterMongoRemove("generic/removeAll", detailsReq));

      // Delete from Voucher Transaction
      const transactionReq = {
        companyCode: companyCode,
        collectionName: 'voucher_trans',
        filter: { vNO: voucherId }
      };
      const transactionRes = await firstValueFrom(this.masterService.masterMongoRemove("generic/removeAll", transactionReq));

      if (detailsRes && transactionRes) {
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }
  // Update Voucher Numbers in vend_bill_summary 
  async UpdateVoucherNumbersInVendBillSummary(bILLNO, vNO) {
    try {

      // Retrive vNOLST from vend_bill_summary based on bILLNO and push vNO to vNOLST
      const companyCode = parseInt(StorageService.getItem(StoreKeys.CompanyCode));
      const filter = { docNo: bILLNO };
      const req = { companyCode, collectionName: 'vend_bill_summary', filter };
      const res = await firstValueFrom(this.masterService.masterPost(GenericActions.GetOne, req));
      if (res && res.data) {
        const vendBillSummary = res.data;
        if (vendBillSummary && vendBillSummary.vNOLST) {
          vendBillSummary.vNOLST.push(vNO);
        }
        else {
          vendBillSummary.vNOLST = [vNO];
        }

        // Update vend_bill_summary with new vNOLST
        const updateReq = {
          companyCode: companyCode,
          collectionName: 'vend_bill_summary',
          filter: { docNo: bILLNO },
          update: { vNOLST: vendBillSummary.vNOLST }
        };
        const updateRes = await firstValueFrom(this.masterService.masterPut(GenericActions.Update, updateReq));

        if (updateRes) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }



    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}

