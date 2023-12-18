import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { VehicleStatusService } from "../vehicleStatus/vehicle.service";
import { updatePrqStatus } from "src/app/operation/prq-entry-page/prq-utitlity";
@Injectable({
  providedIn: "root",
})
export class AssignedVehicleService {
  constructor(
    private vehicleStatusService: VehicleStatusService,
  ) {
  }
  async showVehicleConfirmationDialog(prqDetail, masterService, goBack, tabIndex, dialogRef, item, market) {
    
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
      // added by harikesh
      prqDetail.vendorName = item.vendor;
      prqDetail.vendorType = item.vendorType;

      let updateData = {
          cID: prqDetail.cID || localStorage.getItem('companyCode'),
          pRQNO: prqDetail.prqNo || prqDetail.pRQNO,
          sTS: "2",
          sTSNM: "Awaiting For Docket",
          vEHNO: item.vehNo,
          vENDTY: item.vendorTypeCode || ( item.vendorType == "Market" ? "4" : undefined ),
          vENDTYNM: item.vendorType,
          vNDCD: item.vendorCode || ( item.vendorType == "Market" ? "8888" : undefined ),
          vNDNM: item.vendor,
      }

      delete prqDetail.actions
      const res = await updatePrqStatus(updateData, masterService);
      const result = await this.vehicleStatusService.SaveVehicleData(item, prqDetail);
      if (res && result) {
        const confirmationResult = await Swal.fire({
          icon: "success",
          title: "Assignment Success",
          text: "The vehicle has been successfully assigned.",
          confirmButtonText: "OK",
        });

        if (confirmationResult.isConfirmed) {
          goBack(tabIndex);
          dialogRef.close();
        }
        else{
          goBack(tabIndex);
          dialogRef.close();
        }
       
      }
    }
    
  }

}
