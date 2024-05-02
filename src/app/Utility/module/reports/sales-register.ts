import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
// export class SalesRegisterService {
//      constructor(
//           private masterServices: MasterService,
//           private storage: StorageService
//      ) { }

//      async getsalesRegisterReportDetail(start, end) {
//           const startValue = start;
//           const endValue = end;
//           const reqBody = {
//                companyCode: this.storage.companyCode,
//                collectionName: "dockets",
//                filter: {
//                     cID: this.storage.companyCode,
//                     "D$and": [
//                          {
//                               "dKTDT": {
//                                    "D$gte": startValue
//                               }
//                          },
//                          {
//                               "dKTDT": {
//                                    "D$lte": endValue
//                               }
//                          }
//                     ]
//                }
//           }
//           const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "cust_contract"
//           const rescuscontract = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "cha_details"
//           const reschadetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "job_details"
//           const resjobdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "job_header"
//           const resjobheaderdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "cust_bill_details"
//           const rescustbilldetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "docket_invoices"
//           const resdocketinvdet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "docket_fin_det"
//           const resdocfin = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "cust_bill_headers"
//           const rescustbillheader = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "docket_ops_det"
//           const resdockops = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "thc_summary"
//           const resthcsummary = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           reqBody.collectionName = "customer_detail"
//           const rescustomerdet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
//           let docketCharges = [];
//           resdocfin.data.forEach(element => {
//                if (element.cHG.length > 0) {
//                     element.cHG.forEach(chg => {
//                          const docketCharge = {
//                               dKTNO: element?.dKTNO || "",
//                               [chg.cHGNM]: chg?.aMT || 0.00
//                          }
//                          docketCharges.push(docketCharge);
//                     });
//                }
//           });
//           let salesList = [];
//           res.data.map((element) => {
//                const relevantCharges = docketCharges.filter(charge => charge.dKTNO === element?.dKTNO);
//                const custcontractDet = rescuscontract.data ? rescuscontract.data.find((entry) => entry.cUSTID === element?.bPARTY) : null;
//                const chadetailsDet = reschadetails.data ? reschadetails.data.find((entry) => entry.cUSTID === element?.bPARTY) : null;
//                const jobdetailsDet = resjobdetails.data ? resjobdetails.data.find((entry) => entry.dKTNO === element?.dKTNO) : null;
//                const jobheaderdet = resjobheaderdetails.data ? resjobheaderdetails.data.find((entry) => entry.jID === jobdetailsDet?.jID) : null;
//                const custbilldet = rescustbilldetails.data ? rescustbilldetails.data.find((entry) => entry.dKTNO === element?.docNo) : null;
//                const docketinvdet = resdocketinvdet.data ? resdocketinvdet.data.find((entry) => entry.dKTNO === element?.docNo) : null;
//                const custbillheaderdet = rescustbillheader.data ? rescustbillheader.data.find((entry) => entry.bILLNO === custbilldet?.bILLNO) : null;
//                const dockopsdet = resdockops.data ? resdockops.data.find((entry) => entry.dKTNO === element?.dKTNO) : null;
//                const thcsummarydet = resthcsummary.data ? resthcsummary.data.find((entry) => entry.docNo === dockopsdet?.tHC) : null;
//                const ConsignorToFind = element?.cSGNNM;
//                const customerdet = rescustomerdet.data && ConsignorToFind
//                     ? rescustomerdet.data.find((entry) => entry.customerName === ConsignorToFind)
//                     : null;
//                const ConsigneeToFind = element?.cSGNNM;
//                const customerConsigneedet = rescustomerdet.data && ConsigneeToFind
//                     ? rescustomerdet.data.find((entry) => entry.customerName === ConsigneeToFind)
//                     : null;
//                let contID = 0;
//                let constParty = 0;
//                let cHAID = 0;
//                let chaAmt = 0;
//                let seriveType = 0;
//                let container = 0;
//                let transportedBy = 0;
//                // let billAt = 0;
//                let invNo = 0;
//                let invDt = 0;
//                let gstRate = 0;
//                let tripsheetNo = 0;
//                let thcDt = 0;
//                let custEmail = 0;
//                let custAdd = 0;
//                let pincode = 0;
//                let city = 0;
//                let Consigneecity = 0;
//                let Consigneepincode = 0;
//                let email = 0;
//                let Consigneeemail = 0;
//                let tele = 0;
//                let RegisteredAddress = 0;
//                let Consigneegst = 0;
//                let gst = 0;
//                let jDT = 0;
//                let jobtype = 0;
//                let portofDis = 0;
//                if (custcontractDet) {
//                     contID = custcontractDet.cONID
//                     constParty = custcontractDet.cUSTNM
//                }

//                if (chadetailsDet) {
//                     cHAID = chadetailsDet.cHAID
//                     chaAmt = chadetailsDet.tOTAMT
//                }
//                if (jobheaderdet) {
//                     seriveType = jobheaderdet.eTYPNM
//                     container = jobheaderdet.cNTS
//                     transportedBy = jobheaderdet.tBYNM
//                     jDT = jobheaderdet.jDT
//                     jobtype = jobheaderdet.jTYPNM
//                }
//                // if (custbilldet) {
//                //      billAt = custbilldet.eNTLOC
//                // }
//                if (docketinvdet) {
//                     invNo = docketinvdet.iNVNO
//                     invDt = docketinvdet.eNTDT
//                }
//                if (custbillheaderdet) {
//                     gstRate = custbillheaderdet.gST.rATE
//                     custEmail = custbillheaderdet.cUST.eML
//                     custAdd = custbillheaderdet.cUST.aDD
//                     tele = custbillheaderdet.tEL
//                }
//                if (thcsummarydet) {
//                     tripsheetNo = thcsummarydet.docNo
//                     thcDt = thcsummarydet.eNTDT
//                }
//                if (customerdet) {
//                     pincode = customerdet.PinCode
//                     city = customerdet.city
//                     email = customerdet.Customer_Emails
//                     gst = customerdet.GSTdetails[0].gstNo
//                }
//                if (customerConsigneedet) {
//                     Consigneepincode = customerConsigneedet.PinCode
//                     Consigneecity = customerConsigneedet.city
//                     Consigneeemail = customerConsigneedet.Customer_Emails
//                     RegisteredAddress = customerConsigneedet.RegisteredAddress
//                     Consigneegst = customerConsigneedet.GSTdetails[0].gstNo
//                }
//                let salesData = {
//                     "cNOTENO": element?.docNo || '',
//                     "cNOTEDT": element?.dKTDT ? new Date(element.dKTDT).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
//                     "tIME": element.dKTDT ? new Date(element.dKTDT).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
//                     "eDD": element.dKTDT ? (() => {
//                          const cNOTEDate = new Date(element.dKTDT);
//                          cNOTEDate.setDate(cNOTEDate.getDate() + 1);
//                          return cNOTEDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
//                     })() : "",
//                     "bOOGBRANCH": element?.eNTLOC || '',
//                     "lOADTY": "FTL",
//                     "dELIVERYBRANCH": element?.dEST || '',
//                     "lASTEDITBY": element?.eNTBY || '',
//                     "cNOTEDITDT": formatDocketDate(element?.eNTDT || ''),
//                     "pAYTY": element?.pAYTYPNM || '',
//                     "bUSTY": 'FTL',
//                     "pROD": element?.tRNMODNM || '',
//                     "cONTID": contID || '',
//                     "cONTPARTY": constParty || '',
//                     "sERTY": "FTL",
//                     "vEHNO": element?.vEHNO || '',
//                     "bACODE": '',
//                     "eEDD": "",
//                     "eEDDREASON": "",
//                     "cUSTREFNO": '',
//                     "rEMA": '',
//                     "bILLAT": element?.eNTLOC || '',
//                     "pINCODE": pincode || '',
//                     "pINCODECAT": '',
//                     "pINCODEAREA": '',
//                     "fROMZONE": '',
//                     "tOZONE": '',
//                     "oDA": '',
//                     "TruckRequestDate": '',
//                     "TRFromZone": '',
//                     "TRToZone": '',
//                     "TRFromCenter": '',
//                     "TRToCenter": '',
//                     "TRFromState": '',
//                     "TRToState": '',
//                     "dRIVERNM": '',
//                     "tRUCKREQNO": '',
//                     "lOACALCNOTE": '',
//                     "bILLPARTYNM": `${element?.bPARTY || ''} - ${element?.bPARTYNM || ''}`,
//                     "mOVTY": element?.mODNM || '',
//                     "tRANMODE": element?.tRNMODNM || '',
//                     "sTAT": element?.oSTSN || '',
//                     "fROMCITY": element?.fCT || '',
//                     "tOCITY": element?.tCT || "",
//                     "VendorName": element?.vNDNM || '',
//                     "VendorCode": element?.vNDCD || '',
//                     "SpecialInstruction": '',
//                     "FRRate": element?.fRTRT || '',
//                     "FRTType": element?.fRTRTYN || '',
//                     "NoofPkgs": element?.pKGS || '',
//                     "SubTotal": element?.tOTAMT || '',
//                     "ActualWeight": element?.aCTWT || '',
//                     "CubicWeight": '0.00',
//                     "ChargedPkgsNo": '0',
//                     "ChargedkM": '0',
//                     "InvoiceNo": invNo || '',
//                     "InvoiceDate": formatDocketDate(invDt || ''),
//                     "DeclaredValue": '0.00',
//                     "Length": '0.00',
//                     "Breadth": '0.00',
//                     "Height": '0.00',
//                     "FreightCharge": '0.00',
//                     "OtherCharges": '0.00',
//                     "Greentax": '0.00',
//                     "DropCharges": '0.00',
//                     "DocumentCharges": '0.00',
//                     "WarehouseCharges": '0.00',
//                     "Deduction": '0',
//                     "HolidayServiceCharges": '0.00',
//                     "FOVCharges": '0.00',
//                     "DODharges": '0.00',
//                     "appointchar": '0.00',
//                     "ODACharges": '0.00',
//                     "FuelSurchargeCharges": '0.00',
//                     "MultipickupCharges": '0.00',
//                     "UnloadingCharges": '0.00',
//                     "MultideliveryCharges": '0.00',
//                     "LoadingCharges": '0.00',
//                     "GSTRate": gstRate || '',
//                     "DOD": '',
//                     "DACC": '',
//                     "Deferment": '',
//                     "PolicyNoDate": '',
//                     "WeightType": '',
//                     "DefaultCarRate": '',
//                     "FuePerRate": '',
//                     "ContractId": contID || '',
//                     "ArriveDate": '',
//                     "NextLocation": '',
//                     "StockUpdateDate": '',
//                     "ADD": '',
//                     "PickupDelivery": '',
//                     "SourceCNote": '',
//                     "Caption": '',
//                     "BookingType": 'CN',
//                     "SalesPersonBookingName": '',
//                     "SalesPersonClosingName": '',
//                     "ReturnCNote": '',
//                     "PermitApplicable": '',
//                     "PermitRecievedAt": '',
//                     "DocketTemperature": '',
//                     "Temperature": '',
//                     "Temp2": '',
//                     "Temp3": '',
//                     "TemperatureinCentigrate": '',
//                     "OperationVehicleNo": '',
//                     "TripSheetNo": tripsheetNo || '',
//                     "TripSheetStartDate": '',
//                     "TripSheetEndDate": '',
//                     "ThcDate": formatDocketDate(thcDt || ''),
//                     "AsBillingParty": element?.bPARTYNM || '',
//                     "ConsignorEMail": custEmail || '',
//                     "ConsignorAddressCode": custAdd || '',
//                     "ConsignorAddress": custAdd || '',
//                     "ConsignorCityPincode": `${city || ''} - ${pincode || ''}`,
//                     "ICNo": '',
//                     "RackNo": '',
//                     "GroupNonGroup": '',
//                     "AppointmentID": '',
//                     "Industry": '',
//                     "GSTCharge": element?.gSTAMT || 0.00,
//                     "VATRate": '',
//                     "VATAmount": '',
//                     "DocketTotal": '',
//                     "CalamityCessRate": '',
//                     "CalamityCessAmount": '',
//                     "AdvanceAmount": '',
//                     "AdvanceRemark": '',
//                     "DPHRate": '',
//                     "DPHAmount": '',
//                     "DPHAmout": '',
//                     "DiscRate": '',
//                     "DiscAmount": '',
//                     "CNoteCancelledBy": '',
//                     "CNoteCancelledDate": '',
//                     "Cancelled": '',
//                     "DONo": '',
//                     "PoNumber": '',
//                     "PoDate": '',
//                     "FuelRateType": '',
//                     "FOVRateType": '',
//                     "CFTRatio": '',
//                     "TotalCFT": '',
//                     "ServiceOptedFor": '',
//                     "FSCChargeRate": '',
//                     "FOV": '',
//                     "Multidelivery": '',
//                     "Multipickup": '',
//                     "SealNo": '',
//                     "JobNo": element?.jOBNO || '',
//                     "ContainerNo": '',
//                     "ContainerCapacity": '',
//                     "ContainerType": '',
//                     "BOENo": '',
//                     "Contents": '',
//                     "BatchNo": '',
//                     "PartNo": '',
//                     "PartDescription": '',
//                     "PartQuntity": '',
//                     "ChargedWeight": element?.cHRWT || '',
//                     "PackagingType": element?.pKGTY || '',
//                     "GSTAmount": element?.gSTAMT || '',
//                     "RiskType": element?.rSKTYN || '',
//                     "EntryDate": formatDocketDate(element?.eNTDT || ''),
//                     "EntryBy": element?.eNTBY || '',
//                     "ConsignorId": element?.cSGNCD || '',
//                     "ConsignorName": element?.cSGNNM || '',
//                     "ConsignorMobileNo": element?.cSGNPH || '',
//                     "ConsigneeId": element?.cSGECD || '',
//                     "ConsigneeName": element?.cSGENM || '',
//                     "ConsigneeMobileNo": element?.cSGEPH || '',
//                     "JobNumber": element?.jOBNO || '',
//                     "Weight": element?.wTIN || '',
//                     "origin": element?.oRGN || '',
//                     "destin": element?.dEST || '',
//                     "booktp": element?.dELTYN || "",
//                     "NoofPkts": element?.pKGS || '',
//                     "CurrentLocation": element?.oRGN || '',
//                     "BillingParty": element?.bPARTY || '',
//                     "ConsignorTelephoneNo": element?.cSGNPH || '',
//                     "ConsignorGST": gst || '',
//                     "ConsigneeAddressCode": RegisteredAddress || '',
//                     "ConsigneeAddress": RegisteredAddress || '',
//                     "ConsigneeCityPincode": `${Consigneecity || ''} - ${Consigneepincode || ''}`,
//                     "ConsigneeEMail": Consigneeemail,
//                     "ConsigneeTelephoneNo": element?.cSGEPH || '',
//                     "ConsigneeGST": Consigneegst || '',
//                     "JobDate": formatDocketDate(jDT || ''),
//                     "JobType": jobtype || '',
//                     "PortofDischarge": '',
//                     "DestinationCountry": "",
//                     "VehicleSize": "",
//                     "TransportedBy": transportedBy || '',
//                     "NoofContainer": container || '0',
//                     "ExportType ": seriveType || '',
//                     "CHANumber": cHAID || '',
//                     "CHAAmount": chaAmt || "0.00",
//                }

//                const loadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Loading"));
//                const UnloadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Unloading"));

//                if (loadingCharge) {
//                     salesData.LoadingCharges = loadingCharge.Loading !== undefined ? Number(loadingCharge.Loading).toFixed(2) : "0.00";
//                     salesData.UnloadingCharges = UnloadingCharge.Unloading !== undefined ? Number(UnloadingCharge.Unloading).toFixed(2) : "0.00";
//                }
//                salesList.push(salesData)
//           })
//           return salesList
//      }
// }

export class SalesRegisterService {

     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getsalesRegisterReportDetail(start, end, loct, toloc, payment, bookingtype, cnote, customer, mode) {
          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const location = toloc ? toloc.map(x => x.locCD) || [] : [];
          const paymentBasis = payment ? payment.map(x => x.payNm) || [] : [];
          const bookingType = bookingtype ? bookingtype.map(x => x.bkNm) || [] : [];
          const cust = customer ? customer.map(x => x.custCD) || [] : [];
          const transitMode = mode ? mode.map(x => x.mdCD) || [] : [];
          let matchQuery = {
               'D$and': [
                    { dKTDT: { 'D$gte': start } }, // Convert start date to ISO format
                    { dKTDT: { 'D$lte': end } }, // Bill date less than or equal to end date      
                    {
                         'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                    },
                    ...(loc.length > 0 ? [{ D$expr: { D$in: ["$oRGN", loc] } }] : []), // Location code condition
                    ...(location.length > 0 ? [{ D$expr: { D$in: ["$dEST", location] } }] : []), // Location code condition
                    ...(paymentBasis.length > 0 ? [{ D$expr: { D$in: ["$pAYTYPNM", paymentBasis] } }] : []), // Location code condition
                    ...(bookingType.length > 0 ? [{ D$expr: { D$in: ["$dELTYN", bookingType] } }] : []), // Location code condition
                    ...(cnote != "" ? [{ dKTNO: { 'D$eq': cnote } }] : []),
                    ...(cust.length > 0 ? [{ D$expr: { D$in: ["$bPARTY", cust] } }] : []), // Location code condition
                    ...(transitMode.length > 0 ? [{ D$expr: { D$in: ["$tRNMOD", transitMode] } }] : []), // Location code condition
               ]
          };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filters:
                    [
                         {
                              D$match: matchQuery,
                         },
                         {
                              D$lookup: {
                                   from: "cust_contract",
                                   localField: "bPARTY",
                                   foreignField: "cUSTID",
                                   as: "cust_contract"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$custcontract",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "customer_detail",
                                   localField: "bPARTY",
                                   foreignField: "customerCode",
                                   as: "customer_detail"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$customer_detail",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "docket_invoices",
                                   localField: "dKTNO",
                                   foreignField: "dKTNO",
                                   as: "docket_invoices"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$docket_invoices",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "docket_ops_det",
                                   localField: "dKTNO",
                                   foreignField: "dKTNO",
                                   as: "docket_ops_det"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$docket_ops_det",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "thc_summary",
                                   localField: "docket_ops_det.tHC",
                                   foreignField: "docNo",
                                   as: "thc_summary"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$thc_summary",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "customer_detail",
                                   localField: "cSGNCD",
                                   foreignField: "customerCode",
                                   as: "consignor_detail",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$consignor_detail",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "customer_detail",
                                   localField: "cSGECD",
                                   foreignField: "customerCode",
                                   as: "consignee_detail",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$consignee_detail",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "job_details",
                                   localField: "dKTNO",
                                   foreignField: "dKTNO",
                                   as: "job_details",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$job_details",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "job_header",
                                   localField: "job_details.jID",
                                   foreignField: "jID",
                                   as: "job_header",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$job_header",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "cha_headers",
                                   localField: "job_details.jID",
                                   foreignField: "jID",
                                   as: "cha_headers",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$cha_headers",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "cha_details",
                                   localField: "cha_headers.cHAID",
                                   foreignField: "cHAID",
                                   as: "cha_details",
                              },
                         },
                         {
                              D$unwind: {
                                   path: "$cha_details",
                                   preserveNullAndEmptyArrays: true,
                              },
                         },
                         {
                              D$lookup: {
                                   from: "docket_fin_det",
                                   localField: "dKTNO",
                                   foreignField: "dKTNO",
                                   as: "docket_fin_det"
                              }
                         },
                         {
                              D$unwind: {
                                   path: "$docket_fin_det",
                                   preserveNullAndEmptyArrays: true
                              }
                         },
                         // {
                         //      D$addFields: {
                         //           charge: {
                         //                D$map: {
                         //                     input: "$docket_fin_det.cHG",
                         //                     as: "item",
                         //                     in: "$$item"
                         //                },
                         //           },
                         //      },
                         // },    
                         {
                              "D$addFields": {
                                   "charge": {
                                        "D$cond": {
                                             "if": { "$isArray": "$docket_fin_det.cHG" },
                                             "then": "$docket_fin_det.cHG",
                                             "else": []
                                        }
                                   }
                              }
                         },
                         {
                              D$project: {
                                   cNOTENO: {
                                        D$ifNull: ["$dKTNO", ""],
                                   },
                                   cNOTEDT: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d",
                                             date: "$dKTDT",
                                        },
                                   },
                                   tIME: {
                                        D$dateToString: {
                                             format: "%H:%M:%S",
                                             date: "$dKTDT",
                                        },
                                   },
                                   eDD: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d",
                                             date: {
                                                  D$add: [
                                                       { D$toDate: "$dKTDT" },
                                                       86400000,
                                                  ],
                                             },
                                        },
                                   },
                                   bOOGBRANCH: {
                                        D$ifNull: ["$oRGN", ""],
                                   },
                                   dELIVERYBRANCH: {
                                        D$ifNull: ["$dEST", ""],
                                   },
                                   pAYTY: {
                                        D$ifNull: ["$pAYTYPNM", ""],
                                   },
                                   bUSTY: {
                                        D$ifNull: ["FTL", ""],
                                   },
                                   pROD: {
                                        D$ifNull: ["$tRNMODNM", ""],
                                   },
                                   cONTID: {
                                        D$reduce: {
                                             input: "$cust_contract.cONID",
                                             initialValue: "",
                                             in: {
                                                  D$concat: [
                                                       "$$value",
                                                       {
                                                            D$cond: [
                                                                 {
                                                                      D$eq: ["$$value", ""],
                                                                 },
                                                                 "",
                                                                 ", ",
                                                            ],
                                                       },
                                                       "$$this",
                                                  ],
                                             },
                                        },
                                   },
                                   cONTPARTY: {
                                        D$reduce: {
                                             input: "$cust_contract.cUSTNM",
                                             initialValue: "",
                                             in: {
                                                  D$concat: [
                                                       "$$value",
                                                       {
                                                            D$cond: [
                                                                 {
                                                                      D$eq: ["$$value", ""],
                                                                 },
                                                                 "",
                                                                 ", ",
                                                            ],
                                                       },
                                                       "$$this",
                                                  ],
                                             },
                                        },
                                   },
                                   sERTY: {
                                        D$ifNull: ["FTL", ""],
                                   },
                                   vEHNO: {
                                        D$ifNull: ["$vEHNO", ""],
                                   },
                                   bILLPARTYNM: {
                                        D$ifNull: ["$bPARTYNM", ""],
                                   },
                                   bACODE: {
                                        D$ifNull: ["", ""],
                                   },
                                   eEDD: {
                                        D$ifNull: ["", ""],
                                   },
                                   eEDDREASON: {
                                        D$ifNull: ["", ""],
                                   },
                                   lASTEDITBY: {
                                        D$ifNull: ["$eNTBY", ""],
                                   },
                                   cNOTEDITDT: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d %H:%M:%S",
                                             date: "$eNTDT",
                                        },
                                   },
                                   cUSTREFNO: {
                                        D$ifNull: ["", ""],
                                   },
                                   mOVTY: {
                                        D$ifNull: ["$mODNM", ""],
                                   },
                                   tRANMODE: {
                                        D$ifNull: ["$tRNMODNM", ""],
                                   },
                                   sTAT: {
                                        D$ifNull: ["$oSTSN", ""],
                                   },
                                   lOADTY: {
                                        D$ifNull: ["", ""],
                                   },
                                   rEMA: {
                                        D$ifNull: ["", ""],
                                   },
                                   bILLAT: {
                                        D$ifNull: ["$eNTLOC", ""],
                                   },
                                   pINCODE: {
                                        D$ifNull: ["$customer_detail.PinCode", ""],
                                   },
                                   pINCODECAT: {
                                        D$ifNull: ["", ""],
                                   },
                                   pINCODEAREA: {
                                        D$ifNull: ["", ""],
                                   },
                                   lOACALCNOTE: {
                                        D$ifNull: ["", ""],
                                   },
                                   fROMZONE: {
                                        D$ifNull: ["", ""],
                                   },
                                   tOZONE: {
                                        D$ifNull: ["", ""],
                                   },
                                   oDA: {
                                        D$ifNull: ["", ""],
                                   },
                                   fROMCITY: {
                                        D$ifNull: ["$fCT", ""],
                                   },
                                   tOCITY: {
                                        D$ifNull: ["$tCT", ""],
                                   },
                                   dRIVERNM: {
                                        D$ifNull: ["", ""],
                                   },
                                   tRUCKREQNO: {
                                        D$ifNull: ["", ""],
                                   },
                                   TruckRequestDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRFromZone: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRToZone: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRFromCenter: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRToCenter: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRFromState: {
                                        D$ifNull: ["", ""],
                                   },
                                   TRToState: {
                                        D$ifNull: ["", ""],
                                   },
                                   VendorName: {
                                        D$ifNull: ["$vNDNM", ""],
                                   },
                                   VendorCode: {
                                        D$ifNull: ["$vNDCD", ""],
                                   },
                                   NoofPkgs: {
                                        D$ifNull: ["$pKGS", ""],
                                   },
                                   ActualWeight: {
                                        D$ifNull: ["$aCTWT", ""],
                                   },
                                   ChargedWeight: {
                                        D$ifNull: ["$cHRWT", ""],
                                   },
                                   SpecialInstruction: {
                                        D$ifNull: ["", ""],
                                   },
                                   PackagingType: {
                                        D$ifNull: ["$pKGTY", ""],
                                   },
                                   CubicWeight: {
                                        D$ifNull: ["", ""],
                                   },
                                   ChargedPkgsNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   ChargedkM: {
                                        D$ifNull: ["", ""],
                                   },
                                   InvoiceNo: {
                                        D$ifNull: ["$docket_invoices.iNVNO", ""],
                                   },
                                   InvoiceDate: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d %H:%M:%S",
                                             date: "$docket_invoices.eNTDT",
                                        },
                                   },
                                   DeclaredValue: {
                                        D$ifNull: ["", ""],
                                   },
                                   Length: {
                                        D$ifNull: ["", ""],
                                   },
                                   Breadth: {
                                        D$ifNull: ["", ""],
                                   },
                                   Height: {
                                        D$ifNull: ["", ""],
                                   },
                                   Contents: {
                                        D$ifNull: ["", ""],
                                   },
                                   BatchNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   PartNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   PartDescription: {
                                        D$ifNull: ["", ""],
                                   },
                                   PartQuntity: {
                                        D$ifNull: ["", ""],
                                   },
                                   FRRate: {
                                        D$ifNull: ["$fRTRT", ""],
                                   },
                                   FRTType: {
                                        D$ifNull: ["$fRTRTYN", ""],
                                   },
                                   // FreightCharge: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // OtherCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // Greentax: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // DropCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // DocumentCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // WarehouseCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   Deduction: {
                                        D$ifNull: ["", ""],
                                   },
                                   // HolidayServiceCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // FOVCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // DODharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // appointchar: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // ODACharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // FuelSurchargeCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // MultipickupCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // UnloadingCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // MultideliveryCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   // LoadingCharges: {
                                   //      D$ifNull: ["", ""],
                                   // },
                                   SubTotal: {
                                        D$ifNull: ["$tOTAMT", ""],
                                   },
                                   GSTRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   GSTAmount: {
                                        D$ifNull: ["$gSTAMT", ""],
                                   },
                                   // GSTCharge: {
                                   //      D$ifNull: ["$gSTAMT", ""],
                                   // },
                                   VATRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   VATAmount: {
                                        D$ifNull: ["", ""],
                                   },
                                   DocketTotal: {
                                        D$ifNull: ["", ""],
                                   },
                                   CalamityCessRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   CalamityCessAmount: {
                                        D$ifNull: ["", ""],
                                   },
                                   AdvanceAmount: {
                                        D$ifNull: ["", ""],
                                   },
                                   AdvanceRemark: {
                                        D$ifNull: ["", ""],
                                   },
                                   DPHRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   DPHAmount: {
                                        D$ifNull: ["", ""],
                                   },
                                   DPHAmout: {
                                        D$ifNull: ["", ""],
                                   },
                                   DiscRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   DiscAmount: {
                                        D$ifNull: ["", ""],
                                   },
                                   CNoteCancelledBy: {
                                        D$ifNull: ["", ""],
                                   },
                                   CNoteCancelledDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   Cancelled: {
                                        D$ifNull: ["", ""],
                                   },
                                   DONo: {
                                        D$ifNull: ["", ""],
                                   },
                                   SealNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   JobNo: {
                                        D$ifNull: ["$jOBNO", ""],
                                   },
                                   ContainerNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   ContainerCapacity: {
                                        D$ifNull: ["", ""],
                                   },
                                   ContainerType: {
                                        D$ifNull: ["", ""],
                                   },
                                   BOENo: {
                                        D$ifNull: ["", ""],
                                   },
                                   PoNumber: {
                                        D$ifNull: ["", ""],
                                   },
                                   PoDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   FuelRateType: {
                                        D$ifNull: ["", ""],
                                   },
                                   FOVRateType: {
                                        D$ifNull: ["", ""],
                                   },
                                   CFTRatio: {
                                        D$ifNull: ["", ""],
                                   },
                                   TotalCFT: {
                                        D$ifNull: ["", ""],
                                   },
                                   ServiceOptedFor: {
                                        D$ifNull: ["", ""],
                                   },
                                   FSCChargeRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   FOV: {
                                        D$ifNull: ["", ""],
                                   },
                                   Multidelivery: {
                                        D$ifNull: ["", ""],
                                   },
                                   Multipickup: {
                                        D$ifNull: ["", ""],
                                   },
                                   RiskType: {
                                        D$ifNull: ["", ""],
                                   },
                                   DOD: {
                                        D$ifNull: ["", ""],
                                   },
                                   DACC: {
                                        D$ifNull: ["", ""],
                                   },
                                   Deferment: {
                                        D$ifNull: ["", ""],
                                   },
                                   PolicyNoDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   WeightType: {
                                        D$ifNull: ["", ""],
                                   },
                                   DefaultCarRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   FuePerRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   ContractId: {
                                        D$ifNull: ["", ""],
                                   },
                                   ArriveDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   CurrentLocation: {
                                        D$ifNull: ["", ""],
                                   },
                                   NextLocation: {
                                        D$ifNull: ["", ""],
                                   },
                                   StockUpdateDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   ADD: {
                                        D$ifNull: ["", ""],
                                   },
                                   PickupDelivery: {
                                        D$ifNull: ["", ""],
                                   },
                                   SourceCNote: {
                                        D$ifNull: ["", ""],
                                   },
                                   Caption: {
                                        D$ifNull: ["", ""],
                                   },
                                   EntryDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   BookingType: {
                                        D$ifNull: ["", ""],
                                   },
                                   SalesPersonBookingName: {
                                        D$ifNull: ["", ""],
                                   },
                                   SalesPersonClosingName: {
                                        D$ifNull: ["", ""],
                                   },
                                   EntryBy: {
                                        D$ifNull: ["", ""],
                                   },
                                   ICNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   RackNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   GroupNonGroup: {
                                        D$ifNull: ["", ""],
                                   },
                                   AppointmentID: {
                                        D$ifNull: ["", ""],
                                   },
                                   Industry: {
                                        D$ifNull: ["", ""],
                                   },
                                   ReturnCNote: {
                                        D$ifNull: ["", ""],
                                   },
                                   PermitApplicable: {
                                        D$ifNull: ["", ""],
                                   },
                                   PermitRecievedAt: {
                                        D$ifNull: ["", ""],
                                   },
                                   DocketTemperature: {
                                        D$ifNull: ["", ""],
                                   },
                                   Temperature: {
                                        D$ifNull: ["", ""],
                                   },
                                   Temp2: {
                                        D$ifNull: ["", ""],
                                   },
                                   Temp3: {
                                        D$ifNull: ["", ""],
                                   },
                                   TemperatureinCentigrate: {
                                        D$ifNull: ["", ""],
                                   },
                                   OperationVehicleNo: {
                                        D$ifNull: ["", ""],
                                   },
                                   TripSheetNo: {
                                        D$ifNull: ["$thc_summary.docNo", ""],
                                   },
                                   TripSheetStartDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   TripSheetEndDate: {
                                        D$ifNull: ["", ""],
                                   },
                                   ThcDate: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d %H:%M:%S",
                                             date: "$thc_summary.tHCDT",
                                        },
                                   },
                                   AsBillingParty: {
                                        D$ifNull: ["$bPARTYNM", ""],
                                   },
                                   ConsignorId: {
                                        D$ifNull: ["$consignor_detail.customerCode", ""],
                                   },
                                   ConsignorName: {
                                        D$ifNull: ["$consignor_detail.customerName", ""],
                                   },
                                   ConsignorAddressCode: {
                                        D$ifNull: ["", ""],
                                   },
                                   ConsignorAddress: {
                                        D$ifNull: ["$consignor_detail.RegisteredAddress", ""],
                                   },
                                   ConsignorCityPincode: {
                                        D$concat: [
                                             { D$toString: "$consignor_detail.PinCode" },
                                             " - ",
                                             "$consignor_detail.city"
                                        ]
                                   },
                                   ConsignorEMail: {
                                        D$ifNull: ["$consignor_detail.Customer_Emails", ""],
                                   },
                                   ConsignorMobileNo: {
                                        D$ifNull: ["$consignor_detail.customer_mobile", ""],
                                   },
                                   ConsignorTelephoneNo: {
                                        D$ifNull: ["$consignor_detail.customer_mobile", ""],
                                   },
                                   ConsignorGST: {
                                        D$ifNull: ["$consignor_detail.GSTdetails.gstNo", ""],
                                   },
                                   ConsigneeId: {
                                        D$ifNull: ["$consignee_detail.customerCode", ""],
                                   },
                                   ConsigneeName: {
                                        D$ifNull: ["$consignee_detail.customerName", ""],
                                   },
                                   ConsigneeAddressCode: {
                                        D$ifNull: ["", ""],
                                   },
                                   ConsigneeAddress: {
                                        D$ifNull: ["$consignee_detail.RegisteredAddress", ""],
                                   },
                                   ConsigneeCityPincode: {
                                        D$concat: [
                                             { D$toString: "$consignee_detail.PinCode" },
                                             " - ",
                                             "$consignee_detail.city"
                                        ]
                                   },
                                   ConsigneeEMail: {
                                        D$ifNull: ["$consignee_detail.Customer_Emails", ""],
                                   },
                                   ConsigneeMobileNo: {
                                        D$ifNull: ["$consignee_detail.customer_mobile", ""],
                                   },
                                   ConsigneeTelephoneNo: {
                                        D$ifNull: ["$consignee_detail.customer_mobile", ""],
                                   },
                                   ConsigneeGST: {
                                        D$ifNull: ["$consignor_detail.GSTdetails.gstNo", ""],
                                   },
                                   JobNumber: {
                                        D$ifNull: ["$job_header.jID", ""],
                                   },
                                   JobDate: {
                                        D$dateToString: {
                                             format: "%Y-%m-%d %H:%M:%S",
                                             date: "$job_header.jDT",
                                        },
                                   },
                                   JobType: {
                                        D$ifNull: ["$job_header.jTYPNM", ""],
                                   },
                                   BillingParty: {
                                        D$ifNull: ["$bPARTYNM", ""],
                                   },
                                   PortofDischarge: {
                                        D$ifNull: ["$job_header.tCT", ""],
                                   },
                                   DestinationCountry: {
                                        D$ifNull: ["$job_header.dESTCN", ""],
                                   },
                                   NoofPkts: {
                                        D$ifNull: ["$job_header.pKGS", ""],
                                   },
                                   VehicleSize: {
                                        D$ifNull: ["", ""],
                                   },
                                   Weight: {
                                        D$ifNull: ["$job_header.wT", ""],
                                   },
                                   TransportedBy: {
                                        D$ifNull: ["$job_header.tBYNM", ""],
                                   },
                                   NoofContainer: {
                                        D$ifNull: ["$job_header.cNTS", ""],
                                   },
                                   ExportType: {
                                        D$ifNull: ["$job_header.eTYPNM", ""],
                                   },
                                   CHANumber: {
                                        D$ifNull: ["$cha_details.cHAID", ""],
                                   },
                                   CHAAmount: {
                                        D$ifNull: ["$cha_details.tOTAMT", ""],
                                   },
                                   chargeList: "$charge"
                              }
                         }
                    ]
          };
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          console.log(res, "res");
          return res.data;
     }

}