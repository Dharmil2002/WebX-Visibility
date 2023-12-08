import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
  providedIn: 'root'
})
export class VendorBillService {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  constructor(private masterService: MasterService) { }
  async getVendorBillList(filter) {
    try {
      // Make the asynchronous call to fetch data
      const res = await firstValueFrom(this.masterService.masterPost('finance/getVendorBillList', filter));

      // Extract relevant data and format the response
      const tableData = {
        vendor: `${res.vND.cD}:${res.vND.nM}`,
        billType: "Transaction Bill",
        billNo: res.docNo,
        date: res.bDT,  // Consider using camelCase for consistency
        billAmount: res.bALAMT,
        pendingAmount: res.bALPBAMT,
        status: res.bSTATNM  // Consider using camelCase for consistency
      };

      console.log(tableData);
      return tableData;
    } catch (error) {
      // Handle errors gracefully
      console.error("Error fetching vendor bill list:", error);
      throw error;  // Rethrow the error to indicate that the operation failed
    }
  }

  async getVendorBillDetails(billNo) {
    let req = {
      "companyCode": this.companyCode,
      "filter": { bILLNO: billNo },
      "collectionName": "vend_bill_det"
    }
    const billDetail = await firstValueFrom(this.masterService
      .masterPost("generic/get", req)
    );
    const data = {
      billNo: billDetail.bILLNO,
      Date: billDetail.eNTDT,
      billAmount: billDetail.bALAMT,
      debitNote: billDetail.aDVAMT,
      paid: billDetail.tHCAMT
    }
    console.log(billDetail);
    return data;
  }

}
