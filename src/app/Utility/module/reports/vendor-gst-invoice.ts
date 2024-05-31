import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import moment from "moment";
import { StateService } from "../masters/state/state.service";
@Injectable({
    providedIn: "root",
})
export class VendorGSTInvoiceService {
    constructor(
        private masterServices: MasterService,
        private storage: StorageService,
        private objStateService: StateService
    ) { }

    async getvendorGstRegisterReportDetail(data, docNo) {
        const vendorNames = data.vendrnm ? data.vendrnm.map(x => x.vCD) || [] : [];
        // Check if the array contains only empty strings
        const isEmptyDocNo = docNo.every(value => value === "");
        let matchQuery
        if (isEmptyDocNo) {

            matchQuery = {
                'D$and': [
                    { bDT: { 'D$gte': data.startValue } }, // Convert start date to ISO format
                    { bDT: { 'D$lte': data.endValue } }, // Bill date less than or equal to end date       
                    ...(data.stateData.length > 0 ? [{ 'sT': { 'D$in': data.stateData } }] : []), // State names condition
                    ...(data.vendrnm.length > 0 ? [{ 'D$expr': { 'D$in': ['$vND.cD', vendorNames] } }] : []), // State names condition
                    ...(data.sacData.length > 0 ? [{ 'D$expr': { 'D$in': ['$gST.sAC', data.sacData] } }] : []), // State names condition              
                ],
            };
        }
        // Add docNo condition if docNoArray is present
        if (!isEmptyDocNo) {
            matchQuery = {
                'docNo': { 'D$in': docNo }
            };
        }

        const reqBody = {
            companyCode: this.storage.companyCode,
            reportName: "VendorWiseGSTInvoiceRegister",
            filters: {
                filter: {
                    ...matchQuery,
                }
            }
        }
        const states = await this.objStateService.getState();
        const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBody));
        console.log(res.data.data);
        const details = res.data.data.map((item) => ({
            ...item,
            blDt: item.blDt ? moment(item.blDt).format("DD MMM YYYY") : "",
            vBlDt: item.vBlDt ? moment(item.vBlDt).format("DD MMM YYYY") : "",
            vGSTSts: item.vGSTSts ? "Registered" : "UnRegistered",
            blFromSt: states.find(a => a.value == item.blFromSt)?.name || item.blFromSt,
            blTSt: states.find(a => a.value == item.blTSt)?.name || item.blTSt,
            bLTP: "Transaction Bill",
            TCSRate: 0,
            TCSAmount: 0,
            bLAMT: item.ntPybl - (item.pdAmnt + item.dbtNtAmt),
            nRTN: Array.isArray(item.nRTN) ? item.nRTN.join(", ") : item.nRTN,
            dNtNo: Array.isArray(item.dNtNo) ? item.dNtNo.join(", ") : item.dNtNo,
            dNtDt: Array.isArray(item.dNtDt) ? item.dNtDt.map(dt => moment(dt).format("DD MMM YYYY")).join(", ") : moment(item.dNtDt).format("DD MMM YYYY"),
            dbNtBrc: Array.isArray(item.dbNtBrc) ? item.dbNtBrc.join(", ") : item.dbNtBrc
        }));

        return {
            data: details,
            grid: res.data.grid
        };;
    }
}

