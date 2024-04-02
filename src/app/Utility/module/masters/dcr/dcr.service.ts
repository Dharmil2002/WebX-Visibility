import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { MasterService } from "src/app/core/service/Masters/master.service";

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
  //   async getDCRregisterReportDetail( ) {
  //     debugger
  //     // const startValue = start;
  //     // const endValue = end;
  //     const reqBody = {
  //         companyCode: this.storage.companyCode,
  //         collectionName: "dcr_header",
  //         filter: {
  //             cID: this.storage.companyCode,
  //         }
  //     }
  //     const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
  //     reqBody.collectionName = "dcr_history"
  //     const resjobdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
  //     // reqBody.collectionName = "dcr_history"

  //     let jobList = [];
  //     jobList = { ...res.data,...resjobdetails.data};

  //     // res.data.map((element) => {
  //     //     const docketsDet = resdockets.data ? resdockets.data.filter((entry) => entry.jOBNO === element?.jID) : null;
  //     //     const docketsDetVen = resdockets.data ? resdockets.data.find((entry) => entry.jOBNO === element?.jID) : null;
  //     //     const jobchallansDet = resjobchallans.data ? resjobchallans.data.filter((entry) => entry.jID === element?.jID) : null;
  //     //     const chaheaderDet = reschaheader.data ? reschaheader.data.find((entry) => entry.jID === element?.jID) : null;
  //     //     const chaDet = reschadetails.data ? reschadetails.data.find((entry) => entry.cHAID === chaheaderDet?.cHAID) : null;
  //     //     const docOpsDet = resdocketops.data ? resdocketops.data.find((entry) => entry.dKTNO === docketsDetVen?.dKTNO) : null;
  //     //     const vendorBillDet = resvendBill.data ? resvendBill.data.find((entry) => entry.tRIPNO === docOpsDet?.tHC) : null;
  //     //     const custBillDet = rescustBill.data ? rescustBill.data.find((entry) => entry.cUST.nM === docketsDetVen?.bPARTYNM) : null;

  //     //     const containerNumbers = jobchallansDet ? jobchallansDet.map(entry => entry.cNNO).join(', ') : "";
  //     //     const docketsNumbers = docketsDet ? docketsDet.map(entry => entry.dKTNO).join(', ') : "";
  //     //     const actualweight = docketsDet ? docketsDet.map(entry => entry.aCTWT).join(', ') : "";
  //     //     const docketDates = docketsDet ? docketsDet.map(entry => entry.dKTDT).join(', ') : "";
  //     //     const JobMode = docketsDet ? docketsDet.map(entry => entry.mODNM).join(', ') : "";
  //     //     const charWeight = docketsDet ? docketsDet.map(entry => entry.cHRWT).join(', ') : "";
  //     //     // let jobData = {
  //     //     //     "jobNo": element?.jID || '',
  //     //     //     "jobDate": formatDocketDate(element?.jDT || new Date()),
  //     //     //     "cNoteNumber": docketsNumbers,
  //     //     //     "cNoteDate": formatDocketDate(docketDates ? docketDates.split(', ')[0] : new Date()),
  //     //     //     "containerNumber": containerNumbers,
  //     //     //     "billingParty": element?.bPARTYNM || '',
  //     //     //     "bookingFrom": element?.fCT || "",
  //     //     //     "toCity": element?.tCT || "",
  //     //     //     "pkgs": element?.pKGS || "",
  //     //     //     "weight": actualweight,
  //     //     //     "jobMode": element?.tMODENM || "",
  //     //     //     "noof20ftStd": jobchallansDet ? countContainers(jobchallansDet, "20 ft Standard") : 0,
  //     //     //     "noof40ftStd": jobchallansDet ? countContainers(jobchallansDet, "40 ft Standard") : 0,
  //     //     //     "noof45ftHC": jobchallansDet ? countContainers(jobchallansDet, "45 ft High Cube") : 0,
  //     //     //     "noof20ftRf": jobchallansDet ? countContainers(jobchallansDet, "20 ft Reefer") : 0,
  //     //     //     "noof40ftRf": jobchallansDet ? countContainers(jobchallansDet, "40 ft Reefer") : 0,
  //     //     //     "noof40ftHCR": jobchallansDet ? countContainers(jobchallansDet, "40 ft High Cube Reefer") : 0,
  //     //     //     "noof20ftOT": jobchallansDet ? countContainers(jobchallansDet, "20 ft Open Top") : 0,
  //     //     //     "noof40ftOT": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Open Top") : 0,
  //     //     //     "noof20ftFR": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Flat Rack") : 0,
  //     //     //     "noof40ftFR": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Flat Rack") : 0,
  //     //     //     "noof20ftPf": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Platform") : 0,
  //     //     //     "noof40ftPf": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Platform") : 0,
  //     //     //     "noof20ftTk": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Tank") : 0,
  //     //     //     "noof20ftSO": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Side Open") : 0,
  //     //     //     "noof40ftSO": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Side Open") : 0,
  //     //     //     "noof20ftI": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Insulated") : 0,
  //     //     //     "noof20ftH": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Hardtop") : 0,
  //     //     //     "noof40ftH": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Hardtop") : 0,
  //     //     //     "noof20ftV": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Ventilated") : 0,
  //     //     //     "noof20ftT": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Tunnel") : 0,
  //     //     //     "noof40ftT": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Tunnel") : 0,
  //     //     //     "noofBul": jobchallansDet > 0 ? countContainers(jobchallansDet, "Bulktainers") : 0,
  //     //     //     "noofSB": jobchallansDet > 0 ? countContainers(jobchallansDet, "Swap Bodies") : 0,
  //     //     //     "totalNoofcontainer": jobchallansDet ? jobchallansDet.length : 0,
  //     //     //     "jobType": JobMode,
  //     //     //     "chargWt": charWeight,
  //     //     //     "DespatchQty": '0',
  //     //     //     "despatchWt": '0',
  //     //     //     "poNumber": element?.pONO || "",
  //     //     //     "totalChaAmt": chaDet?.tOTAMT || '0.00',
  //     //     //     "voucherAmt": '0.00',
  //     //     //     "vendorBillAmt": vendorBillDet?.tHCAMT || '0.00',
  //     //     //     "customerBillAmt": custBillDet?.aMT || '0.00',
  //     //     //     "status": element?.sTSNM || '',
  //     //     //     "jobLocation": element?.lOC || "",
  //     //     // }
  //     //     // Push the modified job data to the array
  //     //     // jobList.push(jobData)
  //     // });
  //     return jobList
  // }
  async getDCRregisterReportDetail(start, end) {
    debugger;
    let matchQuery = {
      D$and: [
        { eNTDT: { D$gte: start } }, // Convert start date to ISO format
        { eNTDT: { D$lte: end } }, // Bill date less than or equal to end date
        {
          D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
        },
      ],
    };

    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "dcr_header",
      filters: [
        {
          D$match: matchQuery,
        },
        {
          D$project: {
            bOOK: "$bOOK",
            fROM: "$fROM",
            tO: "$tO",
            pAGES: "$pAGES",
            uSED: "$uSED",
            vOID: "$vOID",
            aLOTONM: "$aLOTONM",
            aCUSTNM : "$aCUSTNM",
            aLOCD: "$aLOCD",
            aLONM: "$aLONM",
            aSNTONM: "$aSNTONM",
            aSNNM: "$aSNNM",
            eNTDT: "$eNTDT",
            eNTBY: "$eNTBY",
            eNTLOC: "$eNTLOC",
            mODDT: "$mODDT",
            mODBY: "$mODBY",
            mODLOC: "$mODLOC",
            rALLDT : "$rALLDT",
            rALLOCA : "$rALLOCA",
            rALLBY : "$rALLBY",
            rALLOC : "$rALLOC",
          }
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/query", reqBody)
    );
    return res.data;
  }
}

export function convertToCSV(
  data: any[],
  excludedColumns: string[] = [],
  headerMapping: Record<string, string>
): string {
  const escapeCommas = (value: any): string => {
    // Check if value is null or undefined before calling toString
    if (value == null) {
      return "";
    }

    // If the value contains a comma, wrap it in double quotes
    const strValue = value.toString();
    return strValue.includes(",") ? `"${strValue}"` : strValue;
  };

  // Map the original column names to the desired header names
  const header =
    Object.keys(data[0])
      .filter((column) => !excludedColumns.includes(column))
      .map((column) => escapeCommas(headerMapping[column] || column))
      .join(",") + "\n";

  // Filter out excluded columns from rows
  const rows = data.map((row) => {
    const filteredRow = Object.entries(row)
      .filter(([key]) => !excludedColumns.includes(key))
      .map(([key, value]) => escapeCommas(value))
      .join(",");
    return filteredRow + "\n";
  });

  return header + rows.join("");
}
