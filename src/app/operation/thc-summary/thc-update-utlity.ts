import Swal from "sweetalert2";

export async function showConfirmationDialogThc(data,operationService) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        const res=  await updateThcStatus(data,operationService);
        return res
    }
      
}   
async function updateThcStatus(data,operationService) {

    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "thc_detail",
        "filter": {_id:data.tripId},
        "update":data
    }
    const res = await operationService.operationMongoPut("generic/update", reqBody).toPromise();
    return res
}
