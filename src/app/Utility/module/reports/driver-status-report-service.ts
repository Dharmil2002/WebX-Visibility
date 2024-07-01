import { Injectable } from "@angular/core";
import { debug } from "console";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
     providedIn: "root",
})

export class DriverStatusRegisterService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService,
     ) { }
     async getdriverRegisterReportDetail(data) {
          let statusArray = [];
          if (data.status === "1" && data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length < 1 ) {
               statusArray = [{ 'activeFlag': { 'D$eq': true } }];
          } else if (data.status === "2" && data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length < 1 ) {
               statusArray = [{ 'activeFlag': { 'D$eq': false } }];
          } else if (data.status === "3" && data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length < 1 ) {
               statusArray = [{ 'status': { 'D$eq': "In Transit" } }];
          } else if (data.status === "4" && data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length < 1 ) {
               statusArray = [{ 'status': { 'D$eq': "Available" } }];
          }

          const orConditions = [
               ...(data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length < 1  && data.status === "1" || data.status === "2"  || data.status === "3" || data.status === "4" ? statusArray : []),
               ...(data.driverLoc.length < 1 &&   data.vehicle.length < 1 && data.driverNm.length > 0 ? [{ D$expr: { D$in: ["$driverName", data.driverNm] } }] : []),
               ...(data.driverLoc.length < 1 && data.vehicle.length > 0 ? [{ D$expr: { D$in: ["$vehicleNo", data.vehicle] } }] : [])
          ];

          const matchQuery = {};

          if (orConditions.length > 0) {
               matchQuery["D$or"] = orConditions;
          };

          const reqBody = {
               companyCode: this.storage.companyCode,
               reportName: "DriverStatusRegister",
               filters: {
                    filter: {
                         ...matchQuery,
                    },
                    projectFilters: {
                         // ...(data.status ? (data.status === "3" ? { vehiclestat: { D$in: ["In-Transit", "In Transit"] } } : data.status === "4" ? { vehiclestat: "Available" } : {}) : {}),
                         // ...(data.status
                         //      ? (data.status === "1"
                         //           ? { vehiclestat: true }
                         //           : data.status === "2"
                         //                ? { vehiclestat: false }
                         //                : data.status === "3"
                         //                     ? { vehiclestat: "In-Transit" }
                         //                     : data.status === "4"
                         //                          ? { vehiclestat: "Available" }
                         //                          : {}
                         //      )
                         //      : {}),
                         ...(data.driverLoc.length > 0 ? (data.driverLoc ? { controllBranch: { D$in: data.driverLoc } } : {}) : {})
                    }
               }
          }

          const res = await firstValueFrom(
               this.masterServices.masterMongoPost("generic/getReportData", reqBody)
          );

          const details = res.data.data.map((item) => ({
               ...item,
               registrationDt: item.registrationDt ? moment(item.registrationDt).format("DD-MM-YYYY") : "",
               birthDt: item.birthDt ? moment(item.birthDt).format("DD-MM-YYYY") : "",
               licenseValidate: item.licenseValidate ? moment(item.licenseValidate).format("DD-MM-YYYY") : "",
               lasterUpdateDt: item.lasterUpdateDt ? moment(item.lasterUpdateDt).format("DD-MM-YYYY") : "",
          }));

          return {
               data: details,
               grid: res.data.grid
          };
     }
}