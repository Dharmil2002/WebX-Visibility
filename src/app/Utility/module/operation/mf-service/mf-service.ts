import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { DocketEvents, DocketStatus, getEnumName } from "src/app/Models/docStatus";

@Injectable({
    providedIn: "root",
})
export class ManifestService {
    constructor(
        private storage: StorageService,
        private operationService: OperationService
    ) { }
    async getFieldMapping(details, header, formField,pkgs) {
        const lsNo={lSNO:formField?.LoadingSheet||"",rUTCD:formField.route.split(":")[0].trim(),count:parseInt(formField.count)}
        const mfHeader = {
            "_id": "",
            "cID": this.storage.companyCode,
            "mFDT": new Date(),
            "oRGN": formField.Leg?.split("-")[0].trim() || "",
            "dEST": formField.Leg?.split("-")[1].trim() || "",
            "rUTCD": formField.route.split(":")[0].trim() || "",
            "rUTNM": formField.route.split(":")[1].trim() || "",
            "leg": formField?.Leg || 0,
            "dKTS": formField?.Shipments || 0,
            "pKGS": parseInt(formField?.Packages) || 0,
            "wT": ConvertToNumber(header[0]?.WeightKg || 0, 3) || 0,
            "vOL": ConvertToNumber(header[0]?.VolumeCFT || 0, 3) || 0,
            "tHC": formField?.tripId || 0,
            "iSARR": false,
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch,
            "eNTBY": this.storage.userName,
            "docNo": ""
        }

        //collectionName:"mf_details_ltl"
        const envData=[];
        const mfDetails = details.map((element,index) => {
            try {
                const mfJson = {
                    "_id": "",
                    "cID": this.storage.companyCode,
                    "mFNO": "",
                    "dKTNO": element?.Shipment || "",
                    "sFX": element?.Suffix || 0,
                    "oRGN": element?.Origin || "",
                    "dEST": element?.Destination || "",
                    "pKGS": parseInt(element?.Packages) || 0,
                    "vOL": ConvertToNumber(element?.cft, 3) || 0,
                    "wT": ConvertToNumber(element?.weight, 3) || 0,
                    "lDPKG": ConvertToNumber(element?.loaded, 3) || 0,
                    "lDVOL": ConvertToNumber(element?.cft, 3) || 0,
                    "lDWT": ConvertToNumber(element?.weight, 3) || 0,
                    "iSARR": false,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                };
                let evnJson = {
                    _id: ``,
                    cID:this.storage.companyCode,
                    dKTNO:element?.Shipment||"",
                    sFX: element?.Suffix || 0,
                    lOC:this.storage.branch,
                    eVNID: DocketEvents.Menifest_Generation,
                    eVNDES:getEnumName(DocketEvents, DocketEvents.Menifest_Generation)?.replace(/_/g, " "),
                    eVNDT:new Date(),
                    eVNSRC:'Manifest Generated',
                    dOCTY: 'MF',
                    dOCNO: '',
                    sTS:DocketStatus.Loaded,
                    sTSNM:DocketStatus[DocketStatus.Loaded],
                    oPSSTS:``,
                    eNTDT:new Date(),
                    eNTLOC:this.storage.branch,
                    eNTBY:this.storage.userName,
                  };
                envData.push(evnJson);
                return mfJson;
            } catch (error) {
                return null; // Example error handling
            }
        });
        const mfLoadedPackages = pkgs.map((x)=>{
            /*CollectionName:mf_pkgs_details*/
            const mfPkgJson={
                "_id": "",
                "cID":this.storage.companyCode,
                "mFNO": "",
                "dKTNO":x?.dKTNO||"",
                "sFX": x?.sFX||0,
                "pKGSNO":x?.pKGSNO||"",  
                "iSARR": false,
                "eNTDT":new Date(),
                "eNTLOC":this.storage.branch,
                "eNTBY": this.storage.userName
            }
            return mfPkgJson
        })
        
        // Optionally, filter out any nulls if errors occurred
        const filteredMfDetails = mfDetails.filter(detail => detail !== null);
        return { mfHeader, filteredMfDetails,mfLoadedPackages,envData,lsNo}

    }
    async createMfDetails(data){
        const req={
        companyCode: this.storage.companyCode,
        docType: "MF",
        branch: this.storage.branch,
        finYear: financialYear,
        timeZone: this.storage.timeZone,
        data: data
        }
        const res= await firstValueFrom(this.operationService.operationMongoPost("operation/mf/ltl/create",req));
        return res.data;
    }
}
