import Swal from "sweetalert2";

export async function showConfirmationDialogThc(data, tripId, operationService, podDetails, vehicleNo) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        const res = await updateThcStatus(data, tripId, operationService, podDetails, vehicleNo);
        return res
    }

}
async function updateThcStatus(data, tripId, operationService, podDetails, vehicleNo) {
    const updatePromises = podDetails.map(async (element) => {
        const reqBody = {
            "companyCode": localStorage.getItem('companyCode'),
            "collectionName": "docket_ops_det",
            "filter": {
                dKTNO: element.docNo, tId: tripId
            },
            "update": {
                "sTS": 2,
                "sTSNM": "delivered",
                "rMRK": element.remarks,
                "pOD": element.pod,
                "aRVTM": element.arrivalTime,
                "rBY": element.receiveBy,
                "aRRDT": data.aRR.aCTDT,
                "aRRPKG": element.pKGS,
                "aRRWT": element.aCTWT,
                "vEHNO": vehicleNo,
                "cLOC": localStorage.getItem('Branch'),
            }
        };
        const reqBodyDocketEvent = {
            "companyCode": localStorage.getItem('companyCode'),
            "collectionName": "docket_events",
            "data": {
                "_id": `${localStorage.getItem('companyCode')}-${element.docNo}-0-EVN0004-${element.arrivalTime}`,
                "cID": localStorage.getItem('companyCode'),
                "dKTNO": element.docNo,
                "sFX": 0,
                "cNO": null,
                "lOC": localStorage.getItem('Branch'),
                "eVNID": "EVN0004",
                "eVNDES": "Delivered",
                "eVNDT": new Date(),
                "eVNSRC": "Docket Delivered",
                "nLOC": null,
                "dOCTY": "",
                "dOCNO": "",
                "eTA": null,
                "sTS": 4,
                "sTSNM": "Delivered",
                "oPSTS": "Docket Delivered - Delivered On " + localStorage.getItem('Branch'),
                "eNTDT": new Date(),
                "eNTLOC": localStorage.getItem('Branch'),
                "eNTBY": localStorage.getItem('UserName'),
            }
        };
        await operationService.operationMongoPost("generic/create", reqBodyDocketEvent).toPromise();
        return operationService.operationMongoPut("generic/update", reqBody).toPromise();
    });
    // Wait for all pod updates to complete
    await Promise.all(updatePromises);

    const thcReqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "thc_summary",
        "filter": { docNo: tripId },
        "update": data
    };

    // Update THC summary
    const thcResult = await operationService.operationMongoPut("generic/update", thcReqBody).toPromise();

    return thcResult;
}
