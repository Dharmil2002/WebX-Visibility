import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { financialYear, formatDate } from 'src/app/Utility/date/date-utils';
import { BillingInfo, PackageInfo } from 'src/app/core/models/finance/update.shipmet';
import { ReqJsonBilling } from 'src/app/core/models/finance/billing.model';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { CustomerService } from '../../masters/customer/customer.service';
import { CustomerBillStatus } from 'src/app/Models/docStatus';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  constructor(
    private storage: StorageService,
    private operationService: OperationService,
    private customerService: CustomerService
  ) { }

  async getInvoice(shipment: string[], status: number = 0) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "dockets",
      filter: { "docNo": { "D$in": shipment }, "fSTS": status }
    };
    const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));
    return res.data;
  }

  async filterShipment(shipments, isShipment: boolean = false) {
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
          gst: isShipment ? element.gSTAMT : 0.00,
          gstChrgAmt: element?.gSTCHAMT || "",
          total: isShipment ? element.gROAMT + element.gSTAMT : element.gROAMT,
          noOfpkg: element?.pKGS || 0.00,
          weight: element?.aCTWT || 0.00,
          isSelected: false,
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

  getInvoiceDetail(shipment, gstRate) {

    const stateInvoiceMap = new Map();
    for (const element of shipment) {
      // Create or update the state-wise invoice details
      const stateName = element?.state || "";
      if (!stateInvoiceMap.has(stateName)) {
        stateInvoiceMap.set(stateName, {
          stateName,
          cnoteCount: 1,
          countSelected: 0,
          subTotalAmount: 0,
          gstCharged: 0,
          gstRate: gstRate,
          extraData: [element],
        });
      } else {
        const stateInvoice = stateInvoiceMap.get(stateName);
        stateInvoice.cnoteCount += 1;
        //  stateInvoice.subTotalAmount += element.amount;
        //stateInvoice.gstCharged += element.gst;
        //stateInvoice.totalBillingAmount += parseFloat(element.amount) + parseFloat(element.gst);
        stateInvoice.extraData.push(element); // Add the element to the extraData array
      }
    }
    // Convert the map values to an array
    const result = Array.from(stateInvoiceMap.values());
    return result;
  }
  /*Below function call while bill No is generated*/
  async addBillDetails(data, bill) {
    const customerName = (data?.customerName?.[0] || "").split('-')[1]?.trim() || "";
    const customerCode = (data?.customerName?.[0] || "").split('-')[0]?.trim() || "";
    const custList = await this.customerService.customerFromFilter({ customerCode: customerCode }, false);
    const custGroup = await this.customerService.customerGroupFilter(custList[0]?.customerGroup);

    let jsonBillingList = [];
    bill.forEach((element) => {
      element?.extraData.filter(item => item.isSelected == true).forEach(nested => {
        const gstType = ['SGST', 'CGST', 'UTGST']
        let jsonBilling = {
          _id: "",
          bILLNO: "",
          dKTNO: nested?.shipment || "",
          cID: this.storage.companyCode,
          oRGN: nested?.extraData?.oRGN || "",
          dEST: nested?.extraData?.dEST || "",
          dKTDT: nested?.extraData?.dKTDT,
          cHRGWT: nested?.extraData.cHRWT,
          dKTAMT: nested?.amount || 0.00,
          dKTTOT: nested?.total || 0.00,
          sUBTOT: nested?.amount || 0.00,
          gSTTOT: data?.gstExempted == false ? nested?.gst : 0.00,
          gSTRT: data?.gstExempted == false ? data.gstRate.replace('%', '') || 0 : 0.00,
          tOTAMT: nested?.total || 0.00,
          //pAMT: 0.00,
          fCHRG: nested.extraData?.fRATE || 0.00,
          //fLSCHRG: 0.00,
          sGST: gstType.includes(data?.gstType) ? parseFloat(element.gstCharged) / 2 : 0,
          sGSTRT: gstType.includes(data?.gstType) ? parseFloat(data.gstRate.replace('%', '') || 0) / 2 : 0,
          cGST: gstType.includes(data?.gstType) ? parseFloat(element.gstCharged) / 2 : 0,
          cGSTRT: gstType.includes(data?.gstType) ? parseFloat(data.gstRate.replace('%', '') || 0) / 2 : 0,
          uTGST: gstType.includes(data?.gstType) ? parseFloat(element.gstCharged) : 0,
          uTGSTRT: gstType.includes(data?.gstType) ? parseFloat(data.gstRate.replace('%', '') || 0) : 0,
          iGST: data?.gstType == "IGST" ? element.gstCharged : 0,
          iGSTRT: data?.gstType == "IGST" ? data.gstRate.replace('%', '') || 0 : 0,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch || "",
          eNTBY: this.storage?.userName || "",
        }
        jsonBillingList.push(jsonBilling);
      });
    })
    const billData = {
      "_id": `${this.storage.companyCode}-${data?.invoiceNo}` || "",
      "cID": this.storage.companyCode,
      "companyCode": this.storage.companyCode,
      "bUSVRT": "FTL", //From Session
      "bILLNO": data?.invoiceNo,
      "bGNDT": data?.invoiceDate || new Date(),
      "bDUEDT": data?.dueDate || new Date(),
      "bLOC": this.storage.branch,
      "pAYBAS": data?.pAYBAS || "",
      "bSTS": CustomerBillStatus.Generated,
      "bSTSNM": CustomerBillStatus[CustomerBillStatus.Generated],
      "bSTSDT": new Date(),
      "eXMT": data?.gstExempted || false,
      "eXMTRES": data?.ExemptionReason || "",
      "gEN": {
        "lOC": this.storage.branch,
        "cT": data?.gstCt || "",
        "sT": data?.gstSt || "",
        "gSTIN": data?.cGstin || "",
      },
      "sUB": {
        "lOC": data?.submissionOffice || "",
        "tO": "",
        "tOMOB": "",
        "dTM": "",
        "dOC": ""
      },
      "cOL": {
        "lOC": data?.collectionOffice || "",
        "aMT": 0.00,
        "bALAMT": data?.finalInvoice || 0.00,
      },
      "cUST": {
        "cD": customerCode,
        "nM": customerName,
        "tEL": custList[0]?.customer_mobile || "",
        "aDD": custList[0]?.RegisteredAddress || "",
        "eML": custList[0]?.Customer_Emails || "",
        "cT": custList[0]?.city || "",
        "sT": custList[0]?.state || "",
        "gSTIN": data?.cGstin || "",
        "cGCD": custGroup?.groupCode || "",
        "cGNM": custGroup?.groupName || "",
      },
      "gST": {
        "tYP": data?.gstType || "", // SGST, UTGST, IGST
        "rATE": data?.gstRate.replace('%', '') || 0,
        "iGST": data?.igst || 0.00,
        "cGST": data?.cgst || 0.00,
        "uTGST": data?.utgst || 0.00,
        "sGST": data?.sgst || 0.00,
        "aMT": data?.gst || 0.00
      },
      "sUPDOC": "",
      "pRODID": 1, //From Product Master
      "dKTCNT": data?.shipmentCount || 0.00,
      "CURR": "INR",
      "dKTTOT": data?.shipmentTotal || 0.00,
      "gROSSAMT": data?.invoiceTotal || 0.00,
      //"aDDCHRG": 0.00,
      "rOUNOFFAMT": data?.roundOff || 0,
      "aMT": data?.finalInvoice || 0.00,
      //"cNL": false,
      //"cNLDT": "",
      //"cNBY": "",
      //"cNRES": "",
      "custDetails": jsonBillingList,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName,
      //"mODDT": new Date(),
      //"mODLOC": this.storage.branch,
      //"mODBY": this.storage.userName
    }

    const req = {
      companyCode: this.storage.companyCode,
      docType: "BILL",
      branch: this.storage.branch,
      finYear: financialYear,
      party: customerName.toUpperCase(),
      collectionName: "cust_bill_headers",
      data: billData
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
      collectionName: 'cust_bill_details',
      data: jsonBillingList,
    };

    await firstValueFrom(this.operationService.operationMongoPost('generic/create', reqbody));

    return true;
  }
  /*End*/
  /*below function is for update the billing data*/
  async updateBillingInvoice(data) {

    const reqbody = {
      companyCode: this.storage.companyCode,
      collectionName: "dockets",
      filter: { docNo: data.dktNo },
      update: data.dockets
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqbody));
    const reqFin = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_fin_det",
      filter: { dKTNO: data.dktNo },
      update: data.finance
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqFin));
    return true
    /*End*/
  }
  /*End*/
  /*below code add is for update Update shipment indivisualy*/
  async updateShipments(shipment: string) {
    const data = { bILED: true, mODDT: new Date(), mODLOC: this.storage.branch, mODBY: this.storage.userName }
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
  async getinvoiceDetailBill(data) {
    const req = {
      companyCode: this.storage.companyCode,
      startdate: data.startDate,
      enddate: data.endDate,
      customerName: data.customerName,
      locationNames: data.locationNames,
      branch: this.storage.branch
    }
    const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/getInvoiceDetails", req));
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
  async getPendingDetails(startdate, enddate, customer): Promise<any> {
    try {
      // Construct the request object with necessary parameters
      const req = {
        companyCode: this.storage.companyCode,
        startdate,
        enddate,
        branch: this.storage.branch,
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
      collectionName: "cust_bill_headers",
      filter: { "bILLNO": { "D$in": billNo }, "bSTS": 3 }
    };
    const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
    const filterData = res.data.map((element) => {
      const CollectedAmount = element.hasOwnProperty('cOL') ? +element.cOL.aMT : 0;
      const PendingAmount = element.hasOwnProperty('cOL') ? +element.cOL.bALAMT : 0;
      element.collected = CollectedAmount;
      element.deductions = element?.bALAMT || 0;
      element.bDUEDT = formatDate(element.bDUEDT, 'dd-MM-yy hh:mm');
      element.bGNDT = formatDate(element.bGNDT, 'dd-MM-yy hh:mm');
      element.collectionAmount = PendingAmount - CollectedAmount || 0;
      element.pendingAmount = PendingAmount
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
  async getContractCharges(filter = {}) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "charges",
      filter: filter
    };
    const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
    return res.data;
  }
  /*end*/
  /*Below function is for getting billing data*/
  async getBillingData(custCode) {

    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filter: {
        bLOC: this.storage.branch,
        bSTS: { D$in: [1, 2] },
        D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
        D$expr: {
          D$eq: [
            "$cUST.cD", custCode
          ]
        },
      }
    }
    const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
    return res.data;
  }
  async filterData(data: any) {
    // Assuming formatDate is defined somewhere
    const status = [1, 2];
    const filteredData = data.filter((x) => status.includes(x.bSTS)).map((x) => {
      x.bGNDT = formatDate(x.bGNDT, 'dd-MM-yy hh:mm');
      x.customerName = `${x.cUST.cD}:${x.cUST.nM}`;
      x.status = x.bSTSNM;
      x.pendingAmt = x.cOL ? x.cOL.bALAMT : 0;
      x.actions = x.bSTS == 1 ? ['Approve Bill', 'Cancel Bill'] : ['Submission Bill'];
      return x;
    });

    // Assuming you want to return the filtered data
    return filteredData;
  }
  async updateInvoiceStatus(filter, data) {

    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filter: filter,
      update: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", req));
    return res
  }
  /*end */
  /*below method for Update docket*/
  async updateDocketStatus(filter) {

    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_fin_det",
      filter: filter,
      update: { isBILLED: false, bILLNO: "" }
    }
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/updateAll", req));
    return res
  }
  /*here the code which is writen for Shipment Approval*/
  async updateShipmentStatus(item) {

    const dKTNO = item;
    const dockets = { fSTS: 1, fSTSN: "Approved" };
    const finance = { sTS: 1, sTSNM: "Approved", sTSTM: new Date() };
    const reqDockets = {
      companyCode: this.storage.companyCode,
      collectionName: "dockets",
      filter: { docNo: dKTNO },
      update: dockets,
    };
    const reqFinance = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_fin_det",
      filter: { dKTNO: dKTNO },
      update: finance,
    };
    await Promise.all([
      firstValueFrom(this.operationService.operationMongoPut("generic/update", reqDockets)),
      firstValueFrom(this.operationService.operationMongoPut("generic/update", reqFinance))
    ]);

    return true;
  }
  /*End*/
  /*Below code is for Confirm a Approval*/
  async confirmApprove(data) {
    const result = await Swal.fire({
      title: "Are you sure you want to Approve a Docket?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await this.handleApprove(data);
    } else {
      Swal.fire('Cancelled', 'Your Approve was cancelled', 'info');
    }
  }
  /*End*/
  async handleApprove(data) {
    const res = await this.updateShipmentStatus(data.data.shipment);
    if (res) {
      Swal.fire('Success!', 'Your Approve was successful!', 'success');
    }
  }
  /*here the function for the collection*/
  async getCollectionJson(formGroup, data, paymentsection) {
    const commonProperties = {
      cID: this.storage.companyCode,
      lOC: this.storage.branch,
      dTM: formGroup?.Date || new Date(),
      mOD: formGroup?.PaymentMode || "",
      bANK: formGroup?.Bank.name || "",
      bY: this.storage.userName,
      tRNO: formGroup?.ChequeOrRefNo || "",
      eNTDT: new Date(),
      eNTLOC: this.storage?.branch || "",
      eNTBY: this.storage?.userName || "",
    };

    const collectedData = data.filter(item => item.isSelected == true).map((item) => ({
      _id: "",
      bILLNO: item?.bILLNO || 0,
      mRNO: "",
      dAMT: item?.deductions || 0,
      aMT: item?.collectionAmount || 0,
      vUCHNO: "",
      ...commonProperties,
    }));
    formGroup.location = this.storage.branch;
    formGroup.collectionTotal = paymentsection.NetPayable;
    const colData = {
      formData: formGroup,
      collectedData: collectedData,
      tabledata: data.filter(item => item.isSelected == true)
    };

    return colData;
  }

  /*End*/
  /*Save CollectionData*/
  async saveCollection(data) {

    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "Cust_bill_collection",
      data: data,
      docType: "MR",
      branch: this.storage.branch,
      finYear: financialYear
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost("finance/bill/cust/addCustomerCollection", req));
    return res;
  }
  /*End*/

}
