import Swal from "sweetalert2";
import { updatePrqStatus } from "../prq-entry-page/prq-utitlity";

export async function showVehicleConfirmationDialog(prqDetail, masterService, goBack, tabIndex,dialogRef) {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        prqDetail.status = "2";
        const res = await updatePrqStatus(prqDetail, masterService);
        if (res) {
            goBack(tabIndex);
        }
    }
    dialogRef.close();

}
