import { firstValueFrom } from "rxjs";
import { formatDate } from "src/app/Utility/date/date-utils";

export async function getbankreconcilationList(masterService, request) {

    const RequestBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "voucher_trans",
        "filters": [
            {
                "D$match": {
                    "pMD": { "D$in": ["RTGS/UTR", "Cheque"] },
                    "bRC": localStorage.getItem('Branch'),
                },
            },
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