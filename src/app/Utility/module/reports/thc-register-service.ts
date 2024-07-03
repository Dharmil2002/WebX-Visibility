import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
    providedIn: "root",
})

export class thcreportService {
    constructor(
        private masterServices: MasterService,
        private storage: StorageService
    ) { }
    async getthcReportDetail(reqBody) {
        const matchQuery = (isLTL) => ( {
            ...(reqBody.THCArray != "" ? { docNo: { D$in: reqBody.THCArray } }:
            {D$and: [
                { tHCDT: { 'D$gte': reqBody.startValue } }, // Convert start date to ISO format
                { tHCDT: { 'D$lte': reqBody.endValue } }, // prq date less than or equal to end date      
                ...(reqBody.THCArray != "" ? [{ docNo: { D$in: reqBody.THCArray} }] : []), 
                ...(reqBody.Location && reqBody.Location.length > 0 ? [{ cLOC: { 'D$in': reqBody.Location } }] : []),
                ...(reqBody.DocumentStatus == "0" ? [] :isLTL ? reqBody.DocumentStatus == "1" ? [{ oPSST: { 'D$in':["1","2"]}}]: [{ oPSST: { 'D$in':[reqBody.DocumentStatus]}}]
                    : reqBody.DocumentStatus == "4" ? [{ oPSST: { 'D$in':["2"]}}]: [{ oPSST: { 'D$in': [reqBody.DocumentStatus] }}]
                ),
              ]}
              ),
            });
        const buildRequestBody = (isLTL) => ({
                companyCode: this.storage.companyCode,
                reportName: isLTL? "THCRegisterLTL" : "THCRegister",
                filters: {
                  filter: isLTL? matchQuery(true) : matchQuery(false)
                }
        });
        const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody(false)));
        const resLTL = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody(true)));
        const formatDetails = (data, isLTL) => data.map(item => ({
                ...item,
                THCDT: item.THCDT ? moment(item.THCDT).format("DD MMM YY HH:MM") : "",
                THCUpdateDate: item.THCUpdateDate ? moment(item.THCUpdateDate).format("DD MMM YY HH:MM") : "",
                Dateandtime: item.Dateandtime ? moment(item.Dateandtime).format("DD MMM YY HH:MM") : "",
                UnloadedPkg : !isLTL && item.THCStatus === (1) ? 0: item.UnloadedPkg,
                UnloadedWeight : !isLTL && item.THCStatus === (1) ? 0: item.UnloadedWeight,
                TotalGCNUnloded : !isLTL && item.THCStatus === (1) ? 0: item.TotalGCNUnloded,
                THCStatus: item.THCStatus === 1 || (isLTL && item.THCStatus === 2) ? "Generated" :
                           item.THCStatus === 3 ? "Updated" :
                           item.THCStatus === (isLTL ? 4 : 2) ? "Closed" : "Cancelled"
        }));
        const combinedTransportDataArray = [...formatDetails(res.data.data, false), ...formatDetails(resLTL.data.data, true)];
        return {data: combinedTransportDataArray,grid: res.data.grid};
    }
}

