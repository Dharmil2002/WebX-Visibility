import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { GeneralMaster } from "src/app/Models/general-master/general-master";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    constructor(private masterService: MasterService) { }
/**
 * Asynchronously fetches general master data based on the provided codeType.
 *
 * @param codeType - The codeType for which to retrieve general master data.
 * @returns A Promise that resolves to an array of AutoComplete objects.
 */
async getGeneralMasterData(codeType): Promise<AutoComplete[]> {
    
    // Construct the request body with the companyCode, collectionName, and filter.
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "General_master",
        filter: { codeType: codeType, activeFlag: true }
    };

    // Send a POST request to the masterService to retrieve data and await the response.
    const res =  await firstValueFrom(this.masterService.masterPost("generic/get", reqBody));

    // Cast the response to an array of GeneralMaster objects and assign it to resGen.
    const resGen: GeneralMaster[] = res.data;

    // Map the GeneralMaster objects to AutoComplete objects and return the strongly typed result.
    return resGen.map((x) => { return { name: x.codeDesc, value: x.codeId } });
}

async getDataForAutoComplete(containerName, filter, nameField, valueField ): Promise<AutoComplete[]> {
    // Construct the request body with the companyCode, collectionName, and filter.
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: containerName,
        filter: filter
    };

    // Send a POST request to the masterService to retrieve data and await the response.
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", reqBody));

    // Map the GeneralMaster objects to AutoComplete objects and return the strongly typed result.
    return res.data.map((x) => { return { name: x[nameField], value: x[valueField] } });
}
/*here below the function for the repelica of above function beacuase above the function is return the AutoComplate and i want AutoComplateCommon*/
async getDataForMultiAutoComplete(containerName, filter, nameField, valueField ): Promise<AutoComplateCommon[]> {
    // Construct the request body with the companyCode, collectionName, and filter.
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: containerName,
        filter: filter
    };

    // Send a POST request to the masterService to retrieve data and await the response.
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", reqBody));

    // Map the GeneralMaster objects to AutoComplete objects and return the strongly typed result.
    return res.data.map((x) => { return { name: x[nameField], value: x[valueField] } });
}
/*End*/

async getData(containerName, filter) {
    // Construct the request body with the companyCode, collectionName, and filter.
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: containerName,
        filter: filter
    };

    // Send a POST request to the masterService to retrieve data and await the response.
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", reqBody));

    // Map the GeneralMaster objects to AutoComplete objects and return the strongly typed result.
    return res.data;
}
}
