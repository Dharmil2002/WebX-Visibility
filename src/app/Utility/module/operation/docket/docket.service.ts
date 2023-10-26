import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";


@Injectable({
    providedIn: "root",
})
export class DocketService {
    vehicleDetail: any;
    // Define a mapping object
    statusMapping = {
        default: {
          status: "Thc Generated",
          actions: [""],
        },
        "0": {
          status: "Booked",
          actions: ["Edit Docket", "Create THC"],
        },
        // Add more status mappings as needed
      };

    constructor(
        private masterService: MasterService,
        private operation: OperationService
    ) { }

    async updateDocket(data,filter) {
        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "docket_temp",
            filter: { "docketNumber": data },
            update: filter
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operation.operationMongoPut("generic/update", reqBody).toPromise();
        return result;
    }

    bindData(dataArray, targetArray) {
        if (dataArray.length > 0) {
            const modifiedData = dataArray.map((x, index) => {
                if (x) {
                    x.id = index;
                    return x;
                }
                return x;
            });
            targetArray = modifiedData;
        }
    }

    /* below the function  was generated for the mapping of data */
    // Define a common service function
    async processShipmentList(shipmentList, orgBranch) {
        return shipmentList.map((x) => {
            if (x.origin === orgBranch) {

                // Assuming x.status is a string (e.g., "0", "1", "2", etc.)
                const statusInfo = this.statusMapping[x.status] || this.statusMapping.default;
                const actualWeights = x.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
                const noofPkts = x.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
                x.actualWeight = actualWeights;
                x.totalPkg = noofPkts;
                x.ftCity = `${x.fromCity}-${x.toCity}`;
                x.invoiceCount = x.invoiceDetails.length || 0;
                x.status = statusInfo.status || "";
                x.actions = statusInfo.actions || ["Rake Update"];
                x.createOn= formatDocketDate(x?.entryDate || new Date())
                return x;
            }
            return null;
        }).filter((x) => x !== null);
    }
    /*End*/
}