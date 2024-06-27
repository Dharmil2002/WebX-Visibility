import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericActions, StoreKeys } from 'src/app/config/myconstants';
import { environment } from 'src/environments/environment';
import * as StorageService from '../storage.service';
import { MasterService } from '../Masters/master.service';
import { Observable, catchError, firstValueFrom, mergeMap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VoucherServicesService {

  constructor(private http: HttpClient, private masterService: MasterService,
    private storageService: StorageService.StorageService
  ) { }
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
  // Voucher Reverse Accounting Entry
  async VoucherReverseAccountingEntry(voucherId, financialYear, docNo, narration) {
    try {
      const reqBody = {
        companyCode: parseInt(StorageService.getItem(StoreKeys.CompanyCode)),
        collectionName: "voucher_trans",
        filters:
          [
            {
              D$match: {
                vNO: voucherId
              },
            },
            {
              'D$lookup': {
                'from': 'voucher_trans_details',
                'localField': 'vNO',
                'foreignField': 'vNO',
                'as': 'voucher_details'
              }
            }, {
              'D$lookup': {
                'from': 'acc_trans_' + financialYear,
                'localField': 'vNO',
                'foreignField': 'vNO',
                'as': 'voucher_accounting'
              }
            }
          ]
      }

      const res = await firstValueFrom(this.masterService.masterMongoPost(GenericActions.Query, reqBody));
      if (res && res.data) {
        const voucherTrans = res.data;
        if (voucherTrans && voucherTrans.length > 0) {
          const voucher = voucherTrans[0];
          if (voucher.voucher_details && voucher.voucher_details.length > 0) {
            if (voucher.voucher_accounting && voucher.voucher_accounting.length > 0) {
              // Reverse Accounting Entry
              const Result = await firstValueFrom(this.ReverseEntryRequest(voucher, docNo, narration));
              return Result;
            }
            else {
              return { message: "Voucher Accounting Entry Not Found", success: false };
            }
          }
          else {
            return { message: "Voucher Details Not Found", success: false };
          }
        }
        else {
          return { message: "Voucher Not Found", success: false };
        }
      }
      return { message: "An error occurred", success: false };
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  ReverseEntryRequest(data: any, docNo, narration): Observable<any> {
    // Construct the voucher request payload
    const voucherRequest = {
      companyCode: data.cID,
      docType: data.dTYP,
      branch: data.bRC,
      finYear: data.fYEAR,
      details: [],
      debitAgainstDocumentList: [],
      data: {
        transCode: data.tTYP,
        transType: data.tTYPNM,
        voucherCode: data.vTYP,
        voucherType: data.vTYPNM,
        transDate: data.tTDT,
        docType: data.dTYP,
        branch: data.bRC,
        finYear: data.fYEAR,
        accLocation: data.lOC,
        preperedFor: data.pRE,
        partyCode: data.pCODE,
        partyName: data.pNAME,
        partyState: data.pST,
        paymentState: data.bPST,
        entryBy: data.eNTBY,
        entryDate: data.eNTDT,
        panNo: data.pNO,
        tdsSectionCode: data.tDSCD,
        tdsSectionName: data.tDSNM,
        tdsRate: data.tDSR,
        tdsAmount: data.tDSAMT,
        tdsAtlineitem: data.tDSAL,
        tcsSectionCode: data.tCSCD,
        tcsSectionName: data.tCSNM,
        tcsRate: data.tCSR,
        tcsAmount: data.tCSAMT,
        IGST: data.iGST,
        SGST: data.sGST,
        CGST: data.cGST,
        UGST: data.uGST,
        GSTTotal: data.gSTTOT,
        GrossAmount: data.pAYAMT,
        netPayable: data.nNETP,
        roundOff: data.rOFF,
        voucherCanceled: data.vCAN,
        paymentMode: data.pMD,
        refNo: data.rNO,
        accountName: data.aNM,
        accountCode: data.aCD,
        date: data.dT,
        scanSupportingDocument: data.sDoc,
        transactionNumber: docNo || data.vTNO,
        mANNUM: data.mANNUM,
        mREFNUM: data.mREFNUM,
        nAR: data.nAR,
        oNACC: data.oNACC,
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.ReverseVoucherLedgers(data.voucher_details, narration);
    voucherRequest.details = voucherlineItems;

    // Create and return an observable representing the HTTP request
    return this.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        let reqBody = {
          companyCode: data.cID,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: data.tTDT,
          finYear: data.fYEAR,
          branch: data.bRC,
          transCode: data.tTYP,
          transType: data.tTYPNM,
          voucherCode: data.vTYP,
          voucherType: data.vTYPNM,
          docType: data.dTYP,
          partyType: data.pRE,
          docNo: docNo,
          partyCode: data.pCODE,
          partyName: data.pNAME,
          entryBy: this.storageService.userName,
          entryDate: Date(),
          debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.debit,
              "narration": item.narration ?? ""
            };
          }),
          credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.credit,
              "narration": item.narration ?? ""
            };
          }),
        };

        return this.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }
  ReverseVoucherLedgers(voucherDetails: any, narration): any {
    const lineItems = [];
    voucherDetails.forEach((item) => {
      lineItems.push({
        companyCode: item.cID,
        voucherNo: item.vNO,
        transCode: item.tTYP,
        transType: item.tTYPNM,
        voucherCode: item.vTYP,
        voucherType: item.vTYPNM,
        transDate: item.tTDT,
        finYear: item.fYEAR,
        branch: item.bRC,
        accCode: item.aCOD,
        accName: item.aNM,
        accCategory: item.aCCAT,
        sacCode: item.sCOD,
        sacName: item.sNM,
        debit: item.cDAMT,
        credit: item.dBTAMT,
        GSTRate: item.gSTRT,
        GSTAmount: item.gSTAMT,
        Total: item.tOT,
        TDSApplicable: item.tDSAPL,
        narration: narration || item.nAR,
        PaymentMode: item.pMOD,
        eNTDT: item.eNTDT,
        eNTBY: item.eNTBY,
        eNTLOC: item.eNTLOC,
      });
    });
    return lineItems;
  }

}

