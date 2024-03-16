import { firstValueFrom } from "rxjs";
import { financialYear, formatDate } from "src/app/Utility/date/date-utils";



export async function GetLedgerWiseOpeningBalanceList(masterService, filter) {
    try {
        const companyCode = localStorage.getItem('companyCode');

        const req = {
            companyCode, collectionName: `acc_opening_${financialYear}`, filter
        };
        const res: any = await firstValueFrom(masterService.masterPost('generic/get', req));
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.aCNM, value: x.aCCD, category: x.bCATNM, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}
