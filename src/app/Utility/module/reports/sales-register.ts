import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
@Injectable({
     providedIn: "root",
})

export class SalesRegisterService {

     constructor(
          private masterServices: MasterService,
          private storage: StorageService,
     ) { }

     async getsalesRegisterReportDetail(start, end, loct, toloc, payment, bookingtype, cnote, customer, mode, flowType, status) {

          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const location = toloc ? toloc.map(x => x.locCD) || [] : [];
          const paymentBasis = payment ? payment.map(x => x.payNm) || [] : [];
          const bookingType = bookingtype ? bookingtype.map(x => x.bkNm) || [] : [];
          const cust = customer ? customer.map(x => x.custCD) || [] : [];
          const transitMode = mode ? mode.map(x => x.mdCD) || [] : [];

          // const flowTypeMatch = flowType === "O" ? [2] : flowType == "I" ? [3, 4] : undefined;

          // const stsFin = status == "true" ? ["$isBILLED", true]
          //      : status == "false" ? ["$isBILLED", false] : "";

          // const stsOps = status == 3 ? ["$sTS", 3]
          //      : status == 5 ? ["$sTS", 5] : "";

          // const locFlow = flowType == "I" ? ["$dEST", this.storage.branch] : ["$oRGN", this.storage.branch]

          const filter = {

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
          }


          const reqBodyftl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceFTL",
               filters: {
                    filter: {
                         ...filter,

                    },
                    // joinFilters: [
                    //      {
                    //           "collectionName": "docket_ops_det",
                    //           "filter": {
                    //                ...(flowTypeMatch ? { 'D$in': ["$sTS", flowTypeMatch] } : {}),
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_ops_det",
                    //           "filter": {
                    //                ...(locFlow ? { 'D$eq': locFlow } : {})
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_fin_det",
                    //           "filter": {
                    //                ...(stsFin ? { D$eq: stsFin } : {})
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_fin_det",
                    //           "filter": {
                    //                ...(stsOps ? { D$eq: stsOps } : {})
                    //           }
                    //      },
                    // ]
               }
          }

          const resftl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyftl));
          // console.log(resftl.data);

          const reqBodyltl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceLTL",
               filters: {
                    filter: {
                         ...filter,
                    },
                    // joinFilters: [
                    //      {
                    //           "collectionName": "docket_ops_det_ltl",
                    //           "filter": {
                    //                ...(flowTypeMatch ? { 'D$in': ["$sTS", flowTypeMatch] } : {}),
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_ops_det_ltl",
                    //           "filter": {
                    //                ...(locFlow ? { D$eq: locFlow } : {})
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_fin_det_ltl",
                    //           "filter": {
                    //                ...(stsFin ? { D$eq: stsFin } : {})
                    //           }
                    //      },
                    //      {
                    //           "collectionName": "docket_fin_det_ltl",
                    //           "filter": {
                    //                ...(stsOps ? { D$eq: stsOps } : {})
                    //           }
                    //      }

                    // ]

               }
          }
          const resLtl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyltl));
          // console.log(resLtl.data);

          const data = [...resftl.data.data, ...resLtl.data.data]
          // console.log(data);

          resftl.data.grid.columns = this.updateColumnHeaders(resftl.data.grid.columns, DocCalledAs);
          resLtl.data.grid.columns = this.updateColumnHeaders(resLtl.data.grid.columns, DocCalledAs);

          const details = await Promise.all(
               data.map(async (item) => {
                    const userName = await this.getUserName(item.lEDITBY);
                    // console.log(`UserName for ${item.lEDITBY}:`, userName); // Log the fetched userName
                    return {
                         ...item,
                         dKTDT: item.dKTDT ? moment(item.dKTDT).local().format("DD MMM YYYY HH:mm") : "",
                         eDDDT: item.eDDDT ? moment(item.eDDDT).local().format("DD MMM YYYY HH:mm") : "",
                         lEDITDT: item.lEDITDT ? moment(item.lEDITDT).local().format("DD MMM YYYY HH:mm") : "",
                         tOTAMT: item.tOTAMT ? item.tOTAMT.toFixed(2) : 0,
                         gSTAMT: item.gSTAMT ? item.gSTAMT.toFixed(2) : 0,
                         lEDITBY: userName // Use the fetched userName here
                    };
               })
          );
          return {
               data: details,
               grid: resftl.data.grid || resLtl.data.grid
          };
     }
     //#region to change docketname
     updateColumnHeaders(columns, docCalledAs) {
          return columns.map(column => {
               if (column.header.includes("${docCalledAs.Docket}")) {
                    const docketValue = docCalledAs.Docket; // Fetch the appropriate value dynamically
                    column.header = column.header.replace("${docCalledAs.Docket}", docketValue);
               }
               return column;
          });
     }
     //#endregion
     //#region to get user name as per user Id
     async getUserName(lEDITBY) {
          // Prepare the request  
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "user_master",
               filters: [
                    { D$match: { userId: lEDITBY } },
                    {
                         D$project: {
                              "_id": 0,
                              "name": 1,
                         }
                    }
               ]
          };
          const response = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          // console.log(response.data);

          // Assuming response.data is an array of objects and you need a single name
          const user = response?.data?.[0]?.name;
          return user || "";

     }
     //#endregion
     //#region to set charges dynamically
     addChargesToColumns(data, columns) {

          const existingCharges = new Set();

          // Add predefined columns if they don't already exist
          data.forEach((item) => {
               if (item.cHGLST && Array.isArray(item.cHGLST) && item.cHGLST.length > 0) {
                    item.cHGLST.forEach((charge) => {
                         if (!existingCharges.has(charge.cHGNM)) {
                              columns.push({
                                   header: charge.cHGNM,
                                   field: charge.cHGNM,
                                   width: 200,
                                   type: "number"
                              });
                              existingCharges.add(charge.cHGNM);
                         }
                    });
               }
          });

          return columns;
     }
     //#endregion
     //#region to set charges dynamically
     setCharges(data) {
          const existingCharges = new Set();

          data.forEach((item) => {
               if (item.cHGLST && Array.isArray(item.cHGLST) && item.cHGLST.length > 0) {
                    item.cHGLST.forEach((charge) => {
                         if (!existingCharges.has(charge.cHGNM)) {
                              item[charge.cHGNM] = charge.aMT;
                              existingCharges.add(charge.cHGNM);
                         }
                    });
               }
          });

          return data;
     }
     //#endregion
}