import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import * as XLSX from 'xlsx';
import { StateService } from "../masters/state/state.service";
import { prepareReportData } from "../../commonFunction/arrayCommonFunction/arrayCommonFunction";
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
            collectionName: "vend_bill_summary",
            filters: [
                {
                    D$match: matchQuery
                }
            ]
        };

        const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));

        const states = await this.objStateService.getState();
        const reportFile: any = await firstValueFrom(this.masterServices.getJsonFileDetails('vendorGstReport'));

        let reportData: any[] = [];
        reportData = prepareReportData(res.data, reportFile);

        reportData.forEach(f => {
            f["Bill_To_State"] = states.find(a => a.value == f["Bill_To_State"])?.name || f["Bill_To_State"];
            f["Bill_Gen_State"] = states.find(a => a.value == f["Bill_Gen_State"])?.name || f["Bill_Gen_State"];
            f["PartyType"] = f["PartyType"] ? "Registered" : "UnRegistered" || f["PartyType"];
        });
        return reportData;
    }
}

export function convertToCSV(data: any[], headers: { [key: string]: string }): string {
    const replaceCommaAndWhitespace = (value: any): string => {
        // Check if value is null or undefined before calling toString
        if (value == null) {
            return '';
        }
        // Replace commas with another character or an empty string
        return value.toString().replace(/,/g, '');
    };

    // Generate header row using custom headers
    const header = '\uFEFF' + Object.keys(headers).map(key => replaceCommaAndWhitespace(headers[key])).join(',') + '\n';

    // Generate data rows using custom headers
    const rows = data.map(row =>
        Object.keys(headers).map(key => replaceCommaAndWhitespace(row[key])).join(',') + '\n'
    );

    return header + rows.join('');
}

