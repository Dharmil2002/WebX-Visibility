import { Injectable } from "@angular/core";
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
          if (data.status === "1") {
               statusArray = [{ 'activeFlag': { 'D$eq': true } }];
          } else if (data.status === "2") {
               statusArray = [{ 'activeFlag': { 'D$eq': false } }];
          } 
          // else if (data.status === "3") {
          //      statusArray = [{ 'D$in': ['vehicleStat.status', "In-Transit"] }];
          // } else if (data.status === "4") {
          //      statusArray = [{ 'D$in': ['vehicleStat.status', "Available"] }];
          // }
          const orConditions = [
               ...(data.status === "1" || data.status === "2" ? statusArray : []),
               ...(data.driverNm.length > 0 ? [{ D$expr: { D$in: ["$driverName", data.driverNm] } }] : []),
               ...(data.vehicle.length > 0 ? [{ D$expr: { D$in: ["$vehicleNo", data.vehicle] } }] : [])
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
                         ...(data.status ? (data.status === "3" ? { ASSstatus: {D$in:["In-Transit","In Transit"] }} : data.status === "4" ? { ASSstatus: "Available" } : {}) : {}),
                         ...(data.driverLoc.length>0 ? (data.driverLoc? { controllBranch:{D$in:data.driverLoc}} : {}) : {})
                    }
               }
          }

          const res = await firstValueFrom(
               this.masterServices.masterMongoPost("generic/getReportData", reqBody)
          );

          const details = res.data.data.map((item) => ({
               ...item,
               registrationDt: item.registrationDt ? moment(item.registrationDt).format("DD MMM YY HH:MM") : "",
               birthDt: item.birthDt ? moment(item.birthDt).format("DD MMM YY HH:MM") : "",
               licenseValidate: item.licenseValidate ? moment(item.licenseValidate).format("DD MMM YY HH:MM") : "",
               lasterUpdateDt: item.lasterUpdateDt ? moment(item.lasterUpdateDt).format("DD MMM YY HH:MM") : "",
          }));

          return {
               data: details,
               grid: res.data.grid
          };
     }
}