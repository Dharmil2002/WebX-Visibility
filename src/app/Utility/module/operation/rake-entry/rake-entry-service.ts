import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";

@Injectable({
  providedIn: "root",
})
export class RakeEntryService {

  constructor(
  ) { }
  async processRakeListJob(rakeList) {
    return rakeList.map((x) => {
      x.cnNo = x.hasOwnProperty("cnNo") ? x.cnNo : "",
      x.cnDate = x.hasOwnProperty("cnDate") ? x.cnDate : "",
      x.jobNo = x.hasOwnProperty("jobNo") ? x.jobNo : "",
      x.jobDate = x.hasOwnProperty("jobDate") ? x.jobDate : "",
      x.noOfPkg = x?.pkgs || "";
      x.fCity = x?.fromToCity.split("-")[0] || "";
      x.tCity = x?.fromToCity.split("-")[1] || "";
      x.weight = x?.weight || 0;
      x.billingParty = x?.billingParty || "";
      x.actions = ["Edit", "Remove"]
      return x;
    }).filter((x) => x !== null);
  }
}