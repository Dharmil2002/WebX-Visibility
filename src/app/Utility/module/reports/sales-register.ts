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

     async getsalesRegisterReportDetail(start, end, loct, toloc, payment, bookingtype, cnote, customer, mode, flowType, status) {
          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const location = toloc ? toloc.map(x => x.locCD) || [] : [];
          const paymentBasis = payment ? payment.map(x => x.payNm) || [] : [];
          const bookingType = bookingtype ? bookingtype.map(x => x.bkNm) || [] : [];
          const cust = customer ? customer.map(x => x.custCD) || [] : [];
          const transitMode = mode ? mode.map(x => x.mdCD) || [] : [];
          const flowTypeMatch=flowType === "O"?[2]:flowType=="I"?[3,4]:undefined;
          let stsFin=
          status=="true"?
          ["$docket_fin_det.isBILLED",true]
          :status=="false"?["$docket_fin_det.isBILLED",false]:"";
          let stsOps= status==3?
          ["$docket_ops_det.sTS",3]
          :status==5?["$docket_ops_det.sTS",5]:"";
          let locFlow=flowType=="I"?["$docket_ops_det.dEST",this.storage.branch]:["$docket_ops_det.oRGN",this.storage.branch]
          let matchflowType = {}
          if (flowTypeMatch) {
               matchflowType = {
                    D$expr: {
                         "D$and": [
                         {D$in: ["$docket_ops_det.sTS", flowTypeMatch]},
                         {D$eq:locFlow}
                         ]
                    }
               }
          }
          let matchFin={}
          let matchOps={}
          if(stsFin){
               matchFin = {
                    D$expr: {
                         D$eq:stsFin
                    }
               } 
          }
          if(stsOps){
               matchOps = {
                    D$expr: {
                         D$eq:stsOps
                    }
               } 
          }
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
                   // ...(flowType === "O" ? [{ 'D$expr': { 'D$in': ["$dEST", location.length > 0 ? location : []] } }] :
                   //      (flowType === "I" ? [{ 'D$expr': { 'D$in': ["$oRGN", loc.length > 0 ? loc : []] } }] : [])),
               //...(status === "true" ? [{ D$expr: { D$in: ["$docket_fin_det.isBILLED" ,"isBILLED", status] } }] : []),
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
                              D$match:matchflowType,
                         },
                                 {
                              D$match:matchOps,
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
                         {
                            D$match:matchFin
                         },
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
                                   FreightCharge: {
                                        D$ifNull: ["", ""],
                                   },
                                   OtherCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   Greentax: {
                                        D$ifNull: ["", ""],
                                   },
                                   DropCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   DocumentCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   WarehouseCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   Deduction: {
                                        D$ifNull: ["", ""],
                                   },
                                   HolidayServiceCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   FOVCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   DODharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   appointchar: {
                                        D$ifNull: ["", ""],
                                   },
                                   ODACharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   FuelSurchargeCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   MultipickupCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   UnloadingCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   MultideliveryCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   LoadingCharges: {
                                        D$ifNull: ["", ""],
                                   },
                                   SubTotal: {
                                        D$ifNull: ["$tOTAMT", ""],
                                   },
                                   GSTRate: {
                                        D$ifNull: ["", ""],
                                   },
                                   GSTAmount: {
                                        D$ifNull: ["$gSTAMT", ""],
                                   },
                                   GSTCharge: {
                                        D$ifNull: ["$gSTAMT", ""],
                                   },
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
          return res.data;
     }

}

