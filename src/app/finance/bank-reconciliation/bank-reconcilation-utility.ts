import { firstValueFrom } from "rxjs";
import { formatDate } from "src/app/Utility/date/date-utils";

export async function getbankreconcilationList(masterService, request) {

    let matchQuery = {
        'D$and': [
            {
                "pMD": { "D$in": ["RTGS/UTR", "Cheque"] },
            },
            {
                "bRC": localStorage.getItem('Branch'),
            }, ...(request.fromDate ? [{ 'tTDT': { 'D$gte': request.fromDate } }] : []), ...(request.toDate ? [{ 'tTDT': { 'D$lt': request.toDate } }] : []),
            ...(request.bank ? [{ 'aNM': request.bank }] : []),
        ],
    };

    // {
    //     "D$match": {
    //         "pMD": { "D$in": ["RTGS/UTR", "Cheque"] },
    //         "bRC": localStorage.getItem('Branch'),
    //             },
    // },
    const RequestBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "voucher_trans",
        "filters": [
            { D$match: matchQuery },

            {
                "D$project": {
                    "_id": 0,
                    "vNO": 1,
                    "tTYPNM": 1,
                    "vTYPNM": 1,
                    "tTDT": 1,
                    "pCODE": 1,
                    "pNAME": 1,
                    "nNETP": 1,
                    "rNO": 1,
                    "aNM": 1,
                    "dT": 1,
                    "nAR": 1
                }
            },
        ]
    }

    try {
        const APIResult: any = await firstValueFrom(masterService.masterMongoPost("generic/query", RequestBody));
        if (APIResult.data) {
            const result = APIResult.data.sort((a, b) => {
                const aValue = a.vNO;
                const bValue = b.vNO;

                return bValue.localeCompare(aValue);
            });

            return result.map((x, index) => ({
                voucherNo: x.vNO,
                chequeNumber: x.rNO,
                voucherDate: formatDate(x.tTDT, "dd-MMM-yy HH:mm a"),
                party: ((x?.pCODE ?? "") && x?.pNAME ? x.pCODE + " - " + x.pNAME : x?.pCODE ?? x?.pNAME ?? ""),
                amount: x.nNETP,
                VoucherType: x.vTYPNM,
                OthersData: x
            })) ?? null;
        }

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}
export async function GetBankDropDown(masterService) {
    try {
        const companyCode = parseInt(localStorage.getItem('companyCode'));
        const filter = {
            companyCode: companyCode,
        };
        const req = { companyCode, collectionName: 'Bank_detail', filter };
        const res = await masterService.masterPost('generic/get', req).toPromise();
        if (res && res.data) {
            return res.data.map(x => ({
                name: x.Bankname, value: x.Accountnumber, ...x
            }));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    return []; // Return an empty array in case of an error or missing data
}