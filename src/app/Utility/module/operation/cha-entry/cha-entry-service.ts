import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Collections, GenericActions, OperationActions } from "src/app/config/myconstants";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Injectable({
    providedIn: "root",
})
export class ChaService {
    constructor(
        private operation: OperationService,
        private storage: StorageService
    ) {
    }
    async addChaEntry(data) {
        try {
            const chaHeader = {
                _id: "",
                cID:this.storage.companyCode,
                docNo: "",
                jID: data?.jobNo || "",
                jTYP: data?.jobType || "",
                jTYPNM: data?.jobTypeName || "",
                cHAID: "",
                dOCTYP: data?.documentType || "",
                dOCTYNM: data?.documentTypeName || "",
                bPARTY: data?.billingParty.value || "",
                bPARTYNM: data?.billingParty.name || "",
                tRNSBY: data?.transportedBy || "",
                eNTDT: new Date(),
                eNTLOC: this.storage.branch,
                eNTBY: this.storage.userName
            }
            let chaDetailList = [];
            data.modifiedTableData.forEach(element => {
                let jsonCha = {
                    _id: "",
                    cID:this.storage.companyCode,
                    cHAID: "",
                    dOCCD: element?.docCode,
                    dOCNM: element?.dOCNM,
                    cLRCHRG: element?.clrChrg,
                    gSTRT: element?.gstRate,
                    gSTAMT: element?.gstAmt,
                    tOTAMT: element?.totalAmt,
                    eNTDT: new Date(),
                    eNTLOC: this.storage.branch,
                    eNTBY: this.storage.userName,
                }
                chaDetailList.push(jsonCha);
            });
            const chaDetails = {
                chaHeader: chaHeader,
                chaDetails: chaDetailList
            }
            const thisYear = new Date().getFullYear();
            const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
            const req = {
                companyCode: this.storage.companyCode,
                collectionName: Collections.chaHeaders,
                docType: "CHA",
                branch:this.storage.branch,
                finYear: financialYear,
                data:chaDetails,
                party:data?.billingParty.name.toUpperCase()
            }
            const res = await firstValueFrom(this.operation.operationPost(OperationActions.createCha, req));
            return res
        }
        catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again.',
            });
        }
    }
}