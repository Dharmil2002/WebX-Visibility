import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { financialYear, formatDate } from 'src/app/Utility/date/date-utils';
import { BillingInfo, PackageInfo } from 'src/app/core/models/finance/update.shipmet';
import {ReqJsonBilling} from 'src/app/core/models/finance/billing.model';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XAxisComponent } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  constructor(
    private storage: StorageService,
    private operationService: OperationService
  ) { }

  async getInvoice(shipment: string[]) {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets",
        filter: {"docNo": { "D$in": shipment }, "fSTS": 0}
      };
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));
    return  res.data;
  }

  async filterShipment(shipments) {
    
    const filterShipmentList = [];
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "location_detail",
      filter: {},
    };

    for (const element of shipments) {
      req.filter = { locCode: element?.oRGN };

      try {
        let locDetails = await firstValueFrom(this.operationService.operationPost('generic/get', req));
        const shipment = {
          shipment: element?.docNo || "",
          bookingdate: formatDate(element?.dKTDT || "", 'dd-MM-yy HH:mm'),
          location: element?.oRGN || "",
          state: locDetails.data[0].locState || "", // Assuming locState is the state you want to assign
          vehicleNo: element?.vEHNO || "",
          amount: element?.gROAMT || "",
          gst: element?.gSTAMT || "",
          gstChrgAmt: element?.gSTCHAMT || "",
          total: element.tOTAMT,
          noOfpkg: element?.tOTPKG || 0,
          weight: element?.tOTWT || 0,
          actions: ["Approve", "Hold", "Edit"],
          extraData: element,
        };

        filterShipmentList.push(shipment);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    }

    // Now filterShipmentList contains all the processed shipments
    return filterShipmentList;
  }

  getInvoiceDetail(shipment) {
    
    const stateInvoiceMap = new Map();
    for (const element of shipment) {
      // Create or update the state-wise invoice details
      const stateName = element?.state || "";
      if (!stateInvoiceMap.has(stateName)) {
        stateInvoiceMap.set(stateName, {
          stateName,
          cnoteCount: 1,
          countSelected: 0,
          subTotalAmount: element.amount,
          gstCharged: element.gst,
          totalBillingAmount: parseFloat(element.amount) + parseFloat(element.gst),
          extraData: [element],
        });
      } else {
        const stateInvoice = stateInvoiceMap.get(stateName);
        stateInvoice.cnoteCount += 1;
        stateInvoice.subTotalAmount += element.amount;
        stateInvoice.gstCharged += element.gst;
        stateInvoice.totalBillingAmount += parseFloat(element.amount) + parseFloat(element.gst);
        stateInvoice.extraData.push(element); // Add the element to the extraData array
      }
    }
    // Convert the map values to an array
    const result = Array.from(stateInvoiceMap.values());
    return result;
  }
  /*Below function call while bill No is generated*/
  async addBillDetails(data,bill) {
    const customerName = (data?.customerName?.[0] || "").split('-')[1]?.trim() || "";
    const customerCode= (data?.customerName?.[0] || "").split('-')[0]?.trim() || "";
    const billData = {
      "_id": `${this.storage.companyCode}-${data?.invoiceNo}` || "",
      "cID": this.storage.companyCode,
      "companyCode": this.storage.companyCode,
      "bUSVRT": "FTL", //From Session
      "bILLNO": data?.invoiceNo,
      "bGNDT": data?.invoiceDate || new Date(),
      "bDUEDT": data?.dueDate || new Date(),
      "bLOC": this.storage.branch,
      "pAYBAS": data?.pAYBAS||"",
      "bSTS": 1,
      "bSTSNM": "Generated",
      "bSTSDT": new Date(),
      "eXMT": data?.gstExempted || false,
      "eXMTRES": data?.ExemptionReason || false,
      "gEN": {
        "lOC": this.storage.branch,
        "cT": "",
        "sT": "",
        "gSTIN": data?.cGstin || false,
      },
      "sUB": {
        "lOC": "",
        "tO": "",
        "tOMOB": "",
        "dTM": ""
      },
      "cOL": {
        "aMT": 0.00,
        "bALAMT": 0.00
      },
      "cUST": {
        "cD":customerCode,
        "nM":customerName||"",
        "tEL": "",
        "aDD": "",
        "eML": "",
        "cT": "",
        "sT": "",
        "gSTIN": ""
      },
      "gST": {
        "tYP": data?.gstType || "", // SGST, UTGST, IGST
        "rATE": data?.gstRate || "",
        "iGST": data?.IGST || 0.00,
        "cGST": data?.IGST || 0.00,
        "sGST": data?.sGST || 0.00,
        "aMT": data?.GST || 0.00
      },
      "sUPDOC": "",
      "pRODID": 1, //From Product Master
      "dKTCNT": data?.shipmentCount || 0.00,
      "CURR": "INR",
      "dKTTOT": data?.shipmentTotal || 0.00,
      "gROSSAMT": data?.shipmentTotal || 0.00,
      "aDDCHRG": 0.00,
      "rOUNOFFAMT": 0.00,
      "aMT": data?.shipmentTotal || 0.00,
      "cNL": false,
      "cNLDT": "",
      "cNBY": "",
      "cNRES": "",
      "custDetails":bill,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName,
      "mODDT": new Date(),
      "mODLOC": this.storage.branch,
      "mODBY": this.storage.userName
    }
    const req = {
      companyCode: this.storage.companyCode,
      docType: "BILL",
      branch: this.storage.branch,
      finYear: financialYear,
      party:customerName.toUpperCase(),
      collectionName: "Cust_bills_headers",
      data: billData,
    };
    const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/create", req));
    return res.data.ops[0].docNo

  }

  async addNestedBillShipment(data: BillingInfo[], billNo: string = '') {
    
    let jsonBillingList = [];

    await Promise.all(
      data.map(async (element) => {
        const jsonBilling = {
          "_id": `${this.storage.companyCode}-${element.extraData?.extraData?.dKTNO}`,
          "bILLNO": billNo,
          "dKTNO": element.extraData?.extraData?.dKTNO || "",
          "oRGN": element.extraData?.extraData?.oRG || "",
          "rSDSTCD": "",
          "dKTDT": element.extraData?.extraData.dktDt || "",
          "cHRGWT": element.extraData?.extraData.dktDt || "",
          "dKTAMT": element.extraData?.extraData.sUBT || "",
          "dKTTOT": element.extraData?.extraData.dkTTOT || "",
          "sUBTOT": element?.subTotalAmount || 0.00,
          "gSTTOT": element?.extraData?.extraData.gSTAMT || 0.00,
          "gSTRT": element?.extraData?.extraData.gSTCHRG || 0.00,
          "tOTAMT": element?.totalBillingAmount || 0.00,
          "pAMT": element?.totalBillingAmount || 0.00,
          "fCHRG": element?.extraData?.extraData.fRATE || 0.00,
          "fLSCHRG": 0.00,
          "sGST": 0.00,
          "sGSTRT": 0.00,
          "cGST": 0.00,
          "cGSTRT": 0.00,
          "iGST": 0.00,
          "iGSTRT": 0.00,
          "eNTDT": new Date(),
          "eNTLOC": this.storage.branch,
          "eNTBY": this.storage.userName,
          "mODDT": "",
          "mODLOC": "",
          "mODBY": "",
        };
        // Start the API call and wait for its response
         await this.updateShipments(element.extraData?.extraData?.dKTNO);
        // Include the result in the jsonBillingList
        jsonBillingList.push(jsonBilling);
      })
    );

    const reqbody = {
      companyCode: this.storage.companyCode,
      collectionName: 'Cust_bills_details',
      data: jsonBillingList,
    };

    await firstValueFrom(this.operationService.operationMongoPost('generic/create', reqbody));

    return true;
  }
  /*End*/
  /*below function is for update the billing data*/
  async updateBillingInvoice(data) {
    debugger
    const reqbody = {
      companyCode: this.storage.companyCode,
      collectionName: "dockets",
      filter: { dKTNO: data.dktNo },
      update: data.dockets
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqbody));
    const reqFin = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_fin_det",
      filter: { dKTNO: data.dktNo },
      update:data.finance
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update",reqFin));
    return true
    /*End*/
  }
  /*End*/
  /*below code add is for update Update shipment indivisualy*/
  async updateShipments(shipment: string) {
    const data={ bILED: true ,mODDT:new Date(),mODLOC:this.storage.branch,mODBY:this.storage.userName}
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "dockets_bill_details",
      filter: { "dKTNO": shipment },
      update: data
    };
    // Perform an asynchronous operation to fetch data from the operation service
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqBody));
    return true;
  }
  /*End*/
  /*below code is for getting a list of invoice for invoice managed*/
   async getinvoiceDetailBill(data){
    const req={
      companyCode: this.storage.companyCode,
      startdate:data.startDate,
      enddate:data.endDate,
      customerName:data.customerName,
      locationNames:data.locationNames
    }
    const res =await firstValueFrom(this.operationService.operationPost("finance/bill/cust/getInvoiceDetails",req));
    return res.data;
   }
  /*End*/
  groupAndCalculateMetrics(data: any[]): any[] {
    const groupedData = {};

    data.forEach((item) => {
      const customer = item.pNM;

      if (!groupedData[customer]) {
        groupedData[customer] = {
          customer,
          invoiceGenerate: 0,
          invoiceValue: 0,
          pendingSubmission: 0,
          pendingSubValue: 0,
          pendingCollection: 0,
          pendingCollValue: 0,
        };
      }

      if (item.bILED) {
        groupedData[customer].invoiceGenerate++;
        groupedData[customer].invoiceValue += item.dkTTOT;
      }

      if (!item.iSSUB) {
        groupedData[customer].pendingSubmission++;
        groupedData[customer].pendingSubValue += item.dkTTOT;
      }

      if (item.iSSUB && !item.iSCOL) {
        groupedData[customer].pendingCollection++;
        groupedData[customer].pendingCollValue += item.dkTTOT;
      }
    });

    return Object.values(groupedData);
  }
/**
 * Asynchronously fetches pending billing details based on the provided parameters.
 * @param {Object} data - The input data object containing startdate, enddate, and customer.
 * @returns {Promise<any>} - A Promise that resolves to the pending billing details.
 */
async  getPendingDetails(startdate, enddate, customer): Promise<any> {
  try {
    // Construct the request object with necessary parameters
    const req = {
      companyCode: this.storage.companyCode,
      startdate,
      enddate,
      customerNames: customer
    };
    // Perform an asynchronous operation to get pending billing details
    const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/getCustomerDetails", req));
    // Return the data from the response
    return res.data;
  } catch (error) {
    // Handle errors that may occur during the asynchronous operation
    SwalerrorMessage("error", "Error", "There was an issue retrieving data. Please check your input and try again.", true);
    // Re-throw the error to propagate it or handle it as needed
    throw error;
  }
}
/*
*below the function is for the getting collection invoice details using Billno
*/
async getCollectionInvoiceDetails(billNo: string[]) {
  const req = {
    companyCode: this.storage.companyCode,
    collectionName: "Cust_bills_headers",
    filter: { "bILLNO": { "D$in": billNo }, "bSTS": 3}
  };
  const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
  const filterData = res.data.map((element) => {
    element.collected=element.cOL.aMT;
    element.deductions=element.cOL.bALAMT;
    element.bDUEDT=formatDate(element.bDUEDT,'dd-MM-yy hh:mm');
    element.bGNDT=formatDate(element.bGNDT,'dd-MM-yy hh:mm');
    element.collectionAmount=parseFloat(element.aMT)-parseFloat(element.cOL.aMT);
    element.pendingAmount=parseFloat(element.aMT)-parseFloat(element.cOL.aMT);
    return element;

  });
  return filterData;
}
/*End*/
/*get Charges are come from product Charged master*/
async getCharges(prodType: string) {
  const req = {
    companyCode: this.storage.companyCode,
    collectionName: "product_charges_detail",
    filter: { "ProductName": prodType }
  };
  const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
  return res.data;
}
/*end*/
/*get Charges are come from product Charged master*/
async getContractCharges(filter={}) {
  const req = {
    companyCode: this.storage.companyCode,
    collectionName: "charges",
    filter:filter
  };
  const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
  return res.data;
}
/*end*/
/*Below function is for getting billing data*/
async getBillingData(custCode) {
  
  const req={
    companyCode: this.storage.companyCode,
    collectionName:"Cust_bills_headers",
    filter:{
      bLOC:this.storage.branch,
      bSTS:{D$in:[1,2]},
      D$expr: {
        D$eq: [
           "$cUST.cD",custCode
         ]
       },
    }
  }
  const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
  return res.data;
}
async filterData(data: any) {
  // Assuming formatDate is defined somewhere
  const status=[1,2];
  const filteredData = data.filter((x)=>status.includes(x.bSTS)).map((x) => {
    x.bGNDT = formatDate(x.bGNDT, 'dd-MM-yy hh:mm');
    x.customerName = `${x.cUST.cD}:${x.cUST.nM}`;
    x.status = x.bSTSNM;
    x.pendingAmt=x.cOL.bALAMT;
    x.actions =x.bSTS==1? ['Approve Bill','Cancel Bill']:['Submission Bill'];
    return x;
  });

  // Assuming you want to return the filtered data
  return filteredData;
}
async updateInvoiceStatus(filter,data){
  debugger
  const req ={
    companyCode:this.storage.companyCode,
    collectionName:"Cust_bills_headers",
    filter:filter,
    update:data
  }
  const res= await firstValueFrom(this.operationService.operationMongoPut("generic/update",req));
  return res
}
/*end */
}
