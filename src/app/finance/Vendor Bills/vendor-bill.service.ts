import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VendorBillService {
  companyCode: any = 0;

  constructor(private masterService: MasterService, private storage: StorageService) {
    this.companyCode = this.storage.companyCode;
  }
  async getVendorBillList(filter) {
    try {
      // Make the asynchronous call to fetch data
      const responseArray = await firstValueFrom(this.masterService.masterPost('finance/getVendorBillList', filter));

      // Map each response object to the desired format
      const tableDataArray = responseArray.map((res, index) => ({
        // srno: index + 1, // Add 1 to start the serial number from 1
        vendor: (res && res.vND && res.vND.cD ? `${res.vND.cD} : ${res.vND.nM}` : ''),
        _id: res._id,
        vnCode: res.vND.cD,
        vnName: res.vND.nM,
        billType: "Vendor Bill",
        billNo: res.docNo,
        Date: res.bDT,
        TotalTHCAmount: parseFloat(res.tHCAMT || 0).toFixed(2) || 0,
        PayedAmount: parseFloat(res.bPAIDAMT || 0).toFixed(2) || 0,
        billAmount: parseFloat(res.bALAMT || 0).toFixed(2) || 0,
        pendingAmount: parseFloat(res.bALPBAMT || 0).toFixed(2) || 0,
        paymentAmount: parseFloat(res.bALPBAMT || 0).toFixed(2) || 0,
        Status: res.bSTATNM,
        StatusCode: res.bSTAT,
        vPan: res.vND.pAN,
        Mode: res.tMOD,
        actions:
          [
            // 'Approve Bill',
            // 'Bill Payment',
            // 'Hold Payment',
            // // 'Unhold Payment',
            // 'Cancel Bill',
            // 'Modify'
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

  async getBeneficiaryDetailsFromApi(vendorCode) {
    try {
      // Create filter and req objects using shorthand syntax
      const filter = { beneficiary: vendorCode };
      const req = { companyCode: this.companyCode, collectionName: 'beneficiary_detail', filter };

      // Use await directly in the return statement and handle nested properties with optional chaining
      const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      return res ? res.data[0].otherdetails : []; // Return otherdetails or an empty array if undefined
    } catch (error) {
      // Log errors for debugging purposes
      console.error('An error occurred:', error);
    }

    // Return an empty array in case of an error or missing data
    return [];
  }
  async getVendorsWiseVehicleList(vendorName) {
    try {
      // Create filter and req objects using shorthand syntax
      const filter = { vendorName: vendorName };
      const req = { companyCode: this.companyCode, collectionName: 'vehicle_detail', filter };

      // Use await directly in the return statement and handle nested properties with optional chaining
      const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      return res ? res.data : []; // Return otherdetails or an empty array if undefined
    } catch (error) {
      // Log errors for debugging purposes
      console.error('An error occurred:', error);
    }

    // Return an empty array in case of an error or missing data
    return [];
  }
  // Helper function to format the date using moment
  formatDate(dateString) {
    let dt = new Date(dateString);
    return moment(dt).format("DD MMM YY");
  }
}
