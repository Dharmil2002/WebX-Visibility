import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
    providedIn: "root",
})
export class DocketService {
    vehicleDetail: any;
    // Define a mapping object
    statusMapping = {
        default: {
            status: "",
            actions: [""],
        },
        "0": {
            status: "Booked",
            actions: ["Edit Docket"],
        },
        "1": {
            status: "Thc Generated",
            actions: [""],
        },
        "2": {
            status: "Delivered",
            actions: [""],
        }
        // Add more status mappings as needed
    };

    constructor(
        private operation: OperationService,
        private storage:StorageService
    ) { }

    async updateDocket(data, filter) {
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
    
    async updateDocketSuffix(filter,data) {
        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "docket_operation_details",
            filter:filter,
            update: data
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
        const res = shipmentList.map((x) => {
            if (x.origin === orgBranch || (x.destination==orgBranch && x.status=="2")) {

                // Assuming x.status is a string (e.g., "0", "1", "2", etc.)
                const statusInfo = this.statusMapping[x.status] || this.statusMapping.default;
                const actualWeights = x.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
                const noofPkts = x.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
                x.actualWeight = actualWeights;
                x.totalPkg = noofPkts;
                x.ftCity = `${x.fromCity}-${x.toCity}`;
                x.invoiceCount = x.invoiceDetails.length || 0;
                x.status = statusInfo.status || "";
                x.actions = statusInfo.actions;
                x.createOn = formatDocketDate(x?.entryDate || new Date())
                return x;
            }
            return null;
        }).filter((x) => x !== null);
        // Sort the PRQ list by pickupDate in descending order
        const sortedData = res.sort((a, b) => {
            const dateA: Date | any = new Date(a.entryDate);
            const dateB: Date | any = new Date(b.entryDate);

            // Compare the date objects
            return dateB - dateA; // Sort in descending order
        });
        return sortedData
    }
    /*End*/

    async getDocket() {
        const req = {
            "companyCode": localStorage.getItem("companyCode"),
            "filter": {origin:this.storage.branch},
            "collectionName": "docket_temp"
        }

        const res = await this.operation.operationMongoPost('generic/get', req).toPromise();
        return res.data;
    }
    async addDktDetail(data){
        
        const req = {
            "companyCode": localStorage.getItem("companyCode"),
            "collectionName": "docket_operation_details",
            "data":data
        }

        const res = await this.operation.operationMongoPost('generic/create', req).toPromise();
        return res.data;
    }
    async updateSelectedData(selectedData: any[],tripId="") {
        for (const element of selectedData) {
          const data = {
            tOTWT: parseFloat(element.orgTotWeight) - parseFloat(element.totWeight),
            tOTPKG: parseFloat(element.orgNoOfPkg) - parseFloat(element.noOfPkg),
            mODDT:new Date(),
            mODBY: this.storage.userName
          };
    
          const filter = {
            dKTNO: element.docketNumber
          };
    
          await this.updateDocketSuffix(filter, data);
    
          const DktNew = {
            cID: this.storage.companyCode,
            dKTNO: element.docketNumber,
            sFX: parseInt(element.sFX) + 1,
            cLOC: this.storage.branch,
            cNO: '',
            nLoc: '',
            tId: tripId,
            tOTWT: element.totWeight,
            tOTPKG: element.noOfPkg,
            vEHNO: '',
            aRRTM: '',
            aRRPKG: '',
            aRRWT: '',
            dTime: new Date(),
            dPKG: element.noOfPkg,
            dWT: element.totWeight,
            sTS: '',
            sTSTM: '',
            eNTLOC: "",
            eNTBY:this.storage.userName,
            eNTDT: new Date(),
            mODDT:"",
            mODLOC: "",
            mODBY: ""
          };
    
          await this.addDktDetail(DktNew);
        
      }
    }
}