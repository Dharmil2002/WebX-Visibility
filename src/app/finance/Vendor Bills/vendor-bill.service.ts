import { Injectable } from '@angular/core';
import moment from 'moment';
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
      const responseArray = await firstValueFrom(this.masterService.masterPost('finance/getVendorBillList', filter));
  
      // Map each response object to the desired format
      const tableDataArray = responseArray.map(res => ({
        vendor: `${res.vND.cD} : ${res.vND.nM}`,
        _id: res._id,
        billType: "Transaction Bill",
        billNo: res.docNo,
        Date: this.formatDate(res.bDT),
        billAmount: res.bALAMT,
        pendingAmount: res.bALPBAMT,
        Status: res.bSTATNM,
        vPan:res.vND.pAN,
        actions: [
          'Approve Bill',
          'Bill Payment',
          'Hold Payment',
          'Unhold Payment',
          'Cancel Bill',
          'Modify'
      ]
      }));
  
     // console.log(tableDataArray);
      return tableDataArray;
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
    //console.log(billDetail);
    return data;
  }
// Helper function to format the date using moment
 formatDate(dateString) {
  let dt = new Date(dateString);
  return moment(dt).format("DD/MM/YYYY");
}
}
