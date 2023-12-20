import Swal from "sweetalert2";

export async function showConfirmationDialogThc(data, tripId, operationService, podDetails) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        const res = await updateThcStatus(data, tripId, operationService, podDetails);
        return res
    }

}
async function updateThcStatus(data, tripId, operationService, podDetails) {
    const updatePromises = podDetails.map(async (element) => {
        const reqBody = {
            "companyCode": localStorage.getItem('companyCode'),
            "collectionName": "docket_ops_det",
            "filter": {
                dKTNO: element.docketNumber, tId: tripId
            },
            "update": {
                "rMRK": element.remarks,
                "pOD": element.pod,
                "aRVTM": element.arrivalTime,
                "rBY": element.receiveBy,
            }
        };
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
