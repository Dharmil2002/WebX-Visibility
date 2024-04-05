import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { fi } from "date-fns/locale";

@Injectable({
  providedIn: "root",
})
export class DCRService {
  constructor(
    private operation: OperationService,
    private storage: StorageService,
    private masterServices: MasterService
  ) {}
  async getDCR(filter = {}) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "dcr_header",
      filter: filter,
    };
    const res = await firstValueFrom(
      this.operation.operationMongoPost("generic/get", req)
    );
    return res.data;
  }
  async fetchData(
    masterService,
    collectionName,
    filterCondition,
    nameKey,
    valueKey
  ) {
    try {
      const companyCode = parseInt(localStorage.getItem("companyCode"));
      const req = { companyCode, collectionName };
      const res = await masterService
        .masterPost("generic/get", req)
        .toPromise();
      if (res && res.data) {
        return res.data.filter(filterCondition).map((x) => ({
          name: x[nameKey],
          value: x[valueKey],
        }));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return [];
  }

  async CustomerDetail(masterService) {
    return this.fetchData(
      masterService,
      "customer_detail",
      () => true,
      "customerName",
      "customerCode"
    );
  }
  async userDetail(masterService) {
    return this.fetchData(
      masterService,
      "user_master",
      (x) => x.userType === "Employee",
      "name",
      "userId"
    );
  }
  async vendorDetail(masterService) {
    return this.fetchData(
      masterService,
      "vendor_detail",
      (x) => x.vendorType === 3,
      "vendorName",
      "vendorCode"
    );
  }
  async LocationDetail(masterService) {
    return this.fetchData(
      masterService,
      "location_detail",
      () => true,
      "locCode",
      "locName"
    );
  }

  async getDCRregisterReportDetail(
    start: Date,
    end: Date,
    cust: string[] = [],
    loc: string[] = [],
    emp: string[] = [],
    busiAss: string[] = [],
    sts: Number = null,
    oBOOK: string = "",
    series: string = ""
  ) {
    let bookCodes: string[] = [];
    if (oBOOK && oBOOK.length > 0) {
      bookCodes = oBOOK.split(",").map((s) => s.trim());
    }

    let matchQuery = {};
    if (bookCodes.length > 0) {
      matchQuery["D$and"] = [{ bOOK: { D$in: bookCodes } }];
    } else if (series && series.length > 0) {
      const numericPartMatch = series.match(/\d+$/);
      if (!numericPartMatch) {
        return;
      }
      const numericPart = numericPartMatch[0];
      const prefix: string = series.replace(numericPart, "");

      matchQuery["D$and"] = [
        {
          fROM: { D$regex: `^${prefix}`, D$options: "i" },
        },
        { D$expr: { D$eq: [{ D$strLenCP: "$fROM" }, series.length] } },
        {
          D$or: [
            { fROM: { D$lte: series }, tO: { D$gte: series } }, // Check if the value is within any range
            { fROM: series }, // Check if the value is the same as the 'from' value of any range
            { tO: series }, // Check if the value is the same as the 'to' value of any range
          ],
        },
      ];
    } else {
      let allocate = [
        ...(cust.length > 0 ? [{ aLOCD: { D$in: cust } }] : []),
        ...(loc.length > 0 ? [{ aLOCD: { D$in: loc } }] : []),
      ];
      let assign = [
        ...(emp.length > 0 ? [{ aSNCD: { D$in: emp } }] : []),
        ...(busiAss.length > 0 ? [{ aSNCD: { D$in: busiAss } }] : []),
      ];

      matchQuery["D$and"] = [
        { eNTDT: { D$gte: start } },
        { eNTDT: { D$lte: end } },
        ...(sts ? [{ sTS: sts }] : []),
        ...(allocate.length > 0 ? [{ D$or: allocate }] : []),
        ...(assign.length > 0 ? [{ D$or: assign }] : []),
      ];
    }

    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "dcr_header",
      filters: [
        {
          D$match: matchQuery,
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/query", reqBody)
    );
    return res.data;
  }
  isBetweenRange(input, fromValue, toValue) {
    const startValue = parseInt(fromValue.slice(2)); // Extract numeric part from "BK1000001"
    const endValue = parseInt(toValue.slice(2)); // Extract numeric part from "BK1000050"
    const inputValue = parseInt(input.slice(2)); // Extract numeric part from input

    return inputValue >= startValue && inputValue <= endValue;
  }
}
