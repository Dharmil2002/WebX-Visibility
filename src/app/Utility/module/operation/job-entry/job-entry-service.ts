import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";

@Injectable({
  providedIn: "root",
})
export class JobEntryService {
   
  constructor(
      ) { }
      async processShipmentListJob(shipmentList, orgBranch) {
        return shipmentList.map((x) => {
            if (x.origin === orgBranch) {
                const actualWeights = x.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
                const noofPkts = x.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
                x.cnoteNo = x.docketNumber;
                x.cnoteDate = formatDocketDate(x.docketDate || new Date());
                x.actualWeight = actualWeights;
                x.noOfpkg = noofPkts;
                x.ftCity = `${x.fromCity}-${x.toCity}`;
                x.invoiceAmount = x.totalAmount;
                x.loadedWeight=actualWeights;
                x.invoiceCount = x.invoiceDetails.length || 0;
                x.actions= ["Edit", "Remove"]
                return x;
            }
            return null;
        }).filter((x) => x !== null);
    }
}