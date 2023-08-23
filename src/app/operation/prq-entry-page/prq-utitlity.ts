import Swal from 'sweetalert2';
export async function addPrqData(prqData,masterService){
    const reqBody={
        companyCode:localStorage.getItem('companyCode'),
        collectionName:"prq_detail",
        data:prqData
    }
    const res=await masterService.masterMongoPost("generic/create",reqBody).toPromise();
    return res
}

export async function updatePrqStatus(prqData,masterService) {
    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "prq_detail",
        "filter": {prqId: prqData.prqNo},
        "update": {
          ...prqData,
        }
      }
      const res=masterService.masterMongoPut("generic/update", reqBody).toPromise();
      return res
}


export async function showConfirmationDialog(prqDetail, masterService, goBack, tabIndex) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        prqDetail.status = "1";
        const res = await updatePrqStatus(prqDetail, masterService);
        if (res) {
            goBack(tabIndex);
        }
    }
}
