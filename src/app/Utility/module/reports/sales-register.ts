import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class SalesRegisterService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getsalesRegisterReportDetail(start, end) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filter: {
                    cID: this.storage.companyCode,
                    "D$and": [
                         {
                              "dKTDT": {
                                   "D$gte": startValue
                              }
                         },
                         {
                              "dKTDT": {
                                   "D$lte": endValue
                              }
                         }
                    ]
               }
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_contract"
          const rescuscontract = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_details"
          const reschadetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "job_details"
          const resjobdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "job_header"
          const resjobheaderdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_details"
          const rescustbilldetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_invoices"
          const resdocketinvdet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_fin_det"
          const resdocfin = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_headers"
          const rescustbillheader = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_ops_det"
          const resdockops = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "thc_summary"
          const resthcsummary = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "customer_detail"
          const rescustomerdet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          let docketCharges = [];
          resdocfin.data.forEach(element => {
               if (element.cHG.length > 0) {
                    element.cHG.forEach(chg => {
                         const docketCharge = {
                              dKTNO: element?.dKTNO || "",
                              [chg.cHGNM]: chg?.aMT || 0.00
                         }
                         docketCharges.push(docketCharge);
                    });
               }
          });
          let salesList = [];
          res.data.map((element) => {
               const relevantCharges = docketCharges.filter(charge => charge.dKTNO === element?.dKTNO);
               const custcontractDet = rescuscontract.data ? rescuscontract.data.find((entry) => entry.cUSTID === element?.bPARTY) : null;
               const chadetailsDet = reschadetails.data ? reschadetails.data.find((entry) => entry.cUSTID === element?.bPARTY) : null;
               const jobdetailsDet = resjobdetails.data ? resjobdetails.data.find((entry) => entry.dKTNO === element?.dKTNO) : null;
               const jobheaderdet = resjobheaderdetails.data ? resjobheaderdetails.data.find((entry) => entry.jID === jobdetailsDet?.jID) : null;
               const custbilldet = rescustbilldetails.data ? rescustbilldetails.data.find((entry) => entry.dKTNO === element?.docNo) : null;
               const docketinvdet = resdocketinvdet.data ? resdocketinvdet.data.find((entry) => entry.dKTNO === element?.docNo) : null;
               const custbillheaderdet = rescustbillheader.data ? rescustbillheader.data.find((entry) => entry.bILLNO === custbilldet?.bILLNO) : null;
               const dockopsdet = resdockops.data ? resdockops.data.find((entry) => entry.dKTNO === element?.dKTNO) : null;
               const thcsummarydet = resthcsummary.data ? resthcsummary.data.find((entry) => entry.docNo === dockopsdet?.tHC) : null;
               const ConsignorToFind = element?.cSGNNM;
               const customerdet = rescustomerdet.data && ConsignorToFind
                    ? rescustomerdet.data.find((entry) => entry.customerName === ConsignorToFind)
                    : null;
               const ConsigneeToFind = element?.cSGNNM;
               const customerConsigneedet = rescustomerdet.data && ConsigneeToFind
                    ? rescustomerdet.data.find((entry) => entry.customerName === ConsigneeToFind)
                    : null;
               let contID = 0;
               let constParty = 0;
               let cHAID = 0;
               let chaAmt = 0;
               let seriveType = 0;
               let container = 0;
               let transportedBy = 0;
               // let billAt = 0;
               let invNo = 0;
               let invDt = 0;
               let gstRate = 0;
               let tripsheetNo = 0;
               let thcDt = 0;
               let custEmail = 0;
               let custAdd = 0;
               let pincode = 0;
               let city = 0;
               let Consigneecity = 0;
               let Consigneepincode = 0;
               let email = 0;
               let Consigneeemail = 0;
               let tele = 0;
               let RegisteredAddress = 0;
               let Consigneegst = 0;
               let gst = 0;
               let jDT = 0;
               let jobtype = 0;
               let portofDis = 0;
               if (custcontractDet) {
                    contID = custcontractDet.cONID
                    constParty = custcontractDet.cUSTNM
               }
               if (chadetailsDet) {
                    cHAID = chadetailsDet.cHAID
                    chaAmt = chadetailsDet.tOTAMT
               }
               if (jobheaderdet) {
                    seriveType = jobheaderdet.eTYPNM
                    container = jobheaderdet.cNTS
                    transportedBy = jobheaderdet.tBYNM
                    jDT = jobheaderdet.jDT
                    jobtype = jobheaderdet.jTYPNM
               }
               // if (custbilldet) {
               //      billAt = custbilldet.eNTLOC
               // }
               if (docketinvdet) {
                    invNo = docketinvdet.iNVNO
                    invDt = docketinvdet.eNTDT
               }
               if (custbillheaderdet) {
                    gstRate = custbillheaderdet.gST.rATE
                    custEmail = custbillheaderdet.cUST.eML
                    custAdd = custbillheaderdet.cUST.aDD
                    tele = custbillheaderdet.tEL
               }
               if (thcsummarydet) {
                    tripsheetNo = thcsummarydet.docNo
                    thcDt = thcsummarydet.eNTDT
               }
               if (customerdet) {
                    pincode = customerdet.PinCode
                    city = customerdet.city
                    email = customerdet.Customer_Emails
                    gst = customerdet.GSTdetails[0].gstNo
               }
               if (customerConsigneedet) {
                    Consigneepincode = customerConsigneedet.PinCode
                    Consigneecity = customerConsigneedet.city
                    Consigneeemail = customerConsigneedet.Customer_Emails
                    RegisteredAddress = customerConsigneedet.RegisteredAddress
                    Consigneegst = customerConsigneedet.GSTdetails[0].gstNo
               }
               let salesData = {
                    "cNOTENO": element?.docNo || '',
                    "cNOTEDT": element?.dKTDT ? new Date(element.dKTDT).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
                    "tIME": element.dKTDT ? new Date(element.dKTDT).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
                    "eDD": element.dKTDT ? (() => {
                         const cNOTEDate = new Date(element.dKTDT);
                         cNOTEDate.setDate(cNOTEDate.getDate() + 1);
                         return cNOTEDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
                    })() : "",
                    "bOOGBRANCH": element?.eNTLOC || '',
                    "lOADTY": "FTL",
                    "dELIVERYBRANCH": element?.dEST || '',
                    "lASTEDITBY": element?.eNTBY || '',
                    "cNOTEDITDT": formatDocketDate(element?.eNTDT || ''),
                    "pAYTY": element?.pAYTYPNM || '',
                    "bUSTY": 'FTL',
                    "pROD": element?.tRNMODNM || '',
                    "cONTID": contID || '',
                    "cONTPARTY": constParty || '',
                    "sERTY": "FTL",
                    "vEHNO": element?.vEHNO || '',
                    "bACODE": '',
                    "eEDD": "",
                    "eEDDREASON": "",
                    "cUSTREFNO": '',
                    "rEMA": '',
                    "bILLAT": element?.eNTLOC || '',
                    "pINCODE": pincode || '',
                    "pINCODECAT": '',
                    "pINCODEAREA": '',
                    "fROMZONE": '',
                    "tOZONE": '',
                    "oDA": '',
                    "TruckRequestDate": '',
                    "TRFromZone": '',
                    "TRToZone": '',
                    "TRFromCenter": '',
                    "TRToCenter": '',
                    "TRFromState": '',
                    "TRToState": '',
                    "dRIVERNM": '',
                    "tRUCKREQNO": '',
                    "lOACALCNOTE": '',
                    "bILLPARTYNM": `${element?.bPARTY || ''} - ${element?.bPARTYNM || ''}`,
                    "mOVTY": element?.mODNM || '',
                    "tRANMODE": element?.tRNMODNM || '',
                    "sTAT": element?.oSTSN || '',
                    "fROMCITY": element?.fCT || '',
                    "tOCITY": element?.tCT || "",
                    "VendorName": element?.vNDNM || '',
                    "VendorCode": element?.vNDCD || '',
                    "SpecialInstruction": '',
                    "FRRate": element?.fRTRT || '',
                    "FRTType": element?.fRTRTYN || '',
                    "NoofPkgs": element?.pKGS || '',
                    "SubTotal": element?.tOTAMT || '',
                    "ActualWeight": element?.aCTWT || '',
                    "CubicWeight": '0.00',
                    "ChargedPkgsNo": '0',
                    "ChargedkM": '0',
                    "InvoiceNo": invNo || '',
                    "InvoiceDate": formatDocketDate(invDt || ''),
                    "Declared Value": '0.00',
                    "Length": '0.00',
                    "Breadth": '0.00',
                    "Height": '0.00',
                    "FreightCharge": '0.00',
                    "OtherCharges": '0.00',
                    "Greentax": '0.00',
                    "DropCharges": '0.00',
                    "Document Charges": '0.00',
                    "WarehouseCharges": '0.00',
                    "Deduction": '0',
                    "HolidayServiceCharges": '0.00',
                    "FOVCharges": '0.00',
                    "COD/DODharges": '0.00',
                    "ChargesntCharges": '0.00',
                    "ODACharges": '0.00',
                    "FuelSurchargeCharges": '0.00',
                    "MultipickupCharges": '0.00',
                    "UnloadingCharges": '0.00',
                    "MultideliveryCharges": '0.00',
                    "LoadingCharges": '0.00',
                    "GSTRate": gstRate || '',
                    "COD/DOD": '',
                    "DACC": '',
                    "Deferment": '',
                    "PolicyNo,Date": '',
                    "WeightType": '',
                    "DefaultCarRate": '',
                    "FuePerRate": '',
                    "ContractId": contID || '',
                    "ArriveDate": '',
                    "NextLocation": '',
                    "StockUpdateDate": '',
                    "ADD": '',
                    "Pickup/Delivery": '',
                    "SourceCNote": '',
                    "Caption": '',
                    "BookingType": 'CN',
                    "SalesPersonBookingName": '',
                    "SalesPersonClosingName": '',
                    "ReturnCNote (RTO)": '',
                    "PermitApplicable": '',
                    "PermitRecieved At": '',
                    "DocketTemperature": '',
                    "Temperature": '',
                    "Temp2": '',
                    "Temp3": '',
                    "TemperatureinCentigrate": '',
                    "OperationVehicleNo": '',
                    "TripSheetNo": tripsheetNo || '',
                    "TripSheetStartDate": '',
                    "TripSheetEndDate": '',
                    "ThcDate": formatDocketDate(thcDt || ''),
                    "AsBillingParty": element?.bPARTYNM || '',
                    "ConsignorE-Mail": custEmail || '',
                    "ConsignorAddressCode": custAdd || '',
                    "ConsignorAddress": custAdd || '',
                    "ConsignorCity-Pincode": `${city || ''} - ${pincode || ''}`,
                    "ICNo": '',
                    "RackNo": '',
                    "GroupNonGroup": '',
                    "AppointmentID": '',
                    "Industry": '',
                    "GSTCharge": element?.gSTAMT || 0.00,
                    "VATRate": '',
                    "VATAmount": '',
                    "DocketTotal": '',
                    "CalamityCessRate": '',
                    "CalamityCessAmount": '',
                    "AdvanceAmount": '',
                    "AdvanceRemark": '',
                    "DPHRate": '',
                    "DPHAmount": '',
                    "DPHAmout": '',
                    "DiscRate": '',
                    "DiscAmount": '',
                    "CNoteCancelledBy": '',
                    "CNoteCancelled Date": '',
                    "Cancelled": '',
                    "DONo": '',
                    "PoNumber": '',
                    "PoDate": '',
                    "FuelRateType": '',
                    "FOVRateType": '',
                    "CFTRatio": '',
                    "TotalCFT": '',
                    "ServiceOptedFor": '',
                    "FSCChargeRate": '',
                    "FOV%": '',
                    "Multidelivery": '',
                    "Multipickup": '',
                    "SealNo": '',
                    "JobNo": element?.jOBNO || '',
                    "ContainerNo": '',
                    "ContainerCapacity": '',
                    "ContainerType": '',
                    "BOENo": '',
                    "Contents": '',
                    "BatchNo": '',
                    "PartNo": '',
                    "PartDescription": '',
                    "PartQuntity": '',
                    "ChargedWeight": element?.cHRWT || '',
                    "PackagingType": element?.pKGTY || '',
                    "GSTAmount": element?.gSTAMT || '',
                    "RiskType": element?.rSKTYN || '',
                    "EntryDate": formatDocketDate(element?.eNTDT || ''),
                    "EntryBy": element?.eNTBY || '',
                    "ConsignorId": element?.cSGNCD || '',
                    "ConsignorName": element?.cSGNNM || '',
                    "ConsignorMobileNo": element?.cSGNPH || '',
                    "ConsigneeId": element?.cSGECD || '',
                    "ConsigneeName": element?.cSGENM || '',
                    "ConsigneeMobileNo": element?.cSGEPH || '',
                    "JobNumber": element?.jOBNO || '',
                    "Weight": element?.wTIN || '',
                    "origin": element?.oRGN || '',
                    "destin": element?.dEST || '',
                    "booktp": element?.dELTYN || "",
                    "NoofPkts": element?.pKGS || '',
                    "CurrentLocation": element?.oRGN || '',
                    "BillingParty": element?.bPARTY || '',
                    "ConsignorTelephoneNo": element?.cSGNPH || '',
                    "ConsignorGST": gst || '',
                    "ConsigneeAddressCode": RegisteredAddress || '',
                    "ConsigneeAddress": RegisteredAddress || '',
                    "ConsigneeCity-Pincode": `${Consigneecity || ''} - ${Consigneepincode || ''}`,
                    "ConsigneeE-Mail": Consigneeemail,
                    "ConsigneeTelephoneNo": element?.cSGEPH || '',
                    "ConsigneeGST": Consigneegst || '',
                    "JobDate ": formatDocketDate(jDT || ''),
                    "JobType ": jobtype || '',
                    "PortofDischarge": '',
                    "DestinationCountry": "",
                    "VehicleSize": "",
                    "TransportedBy": transportedBy || '',
                    "NoofContainer": container || '0',
                    "ExportType ": seriveType || '',
                    "CHANumber": cHAID || '',
                    "CHAAmount": chaAmt || "0.00",
               }

               const loadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Loading"));
               const UnloadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Unloading"));

               if (loadingCharge) {
                    salesData.LoadingCharges = loadingCharge.Loading !== undefined ? Number(loadingCharge.Loading).toFixed(2) : "0.00";
                    salesData.UnloadingCharges = UnloadingCharge.Unloading !== undefined ? Number(UnloadingCharge.Unloading).toFixed(2) : "0.00";
               }
               salesList.push(salesData)
          })
          return salesList
     }
}

export function convertToCSV(data: any[], headers: { [key: string]: string }): string {
     const replaceCommaAndWhitespace = (value: any): string => {
          // Check if value is null or undefined before calling toString
          if (value == null) {
               return '';
          }
          // Replace commas with another character or an empty string
          return value.toString().replace(/,/g, '');
     };

     // Generate header row using custom headers
     const header = '\uFEFF' + Object.keys(headers).map(key => replaceCommaAndWhitespace(headers[key])).join(',') + '\n';

     // Generate data rows using custom headers
     const rows = data.map(row =>
          Object.keys(headers).map(key => replaceCommaAndWhitespace(row[key])).join(',') + '\n'
     );

     return header + rows.join('');
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
     // Get the keys (headers) from the first row of the JSON data.
     const headerKeys = Object.keys(json[0]);
     // Iterate through the header keys and replace the default headers with custom headers.
     for (let i = 0; i < headerKeys.length; i++) {
          const headerKey = headerKeys[i];
          if (headerKey && customHeaders[headerKey]) {
               worksheet[XLSX.utils.encode_col(i) + '1'] = { t: 's', v: customHeaders[headerKey] };
          }
     }
     // Format the headers in the worksheet.
     for (const key in worksheet) {
          if (Object.prototype.hasOwnProperty.call(worksheet, key)) {
               // Check if the key corresponds to a header cell (e.g., A1, B1, etc.).
               const reg = /^[A-Z]+1$/;
               if (reg.test(key)) {
                    // Set the format of the header cells to '0.00'.
                    worksheet[key].z = '0.00';
               }
          }
     }
     // Create a workbook containing the worksheet.
     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}