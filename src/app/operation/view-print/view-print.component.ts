import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { PrqService } from 'src/app/Utility/module/operation/prq/prq.service';
import { AssignedVehicleService } from 'src/app/Utility/module/operation/assgine-vehicle/assigned-vehicle-service';

@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {
  prqDetail: any;

  constructor(private Route: Router,
     private prqService:PrqService,
     private masterService:MasterService,
     private assignedVehicleService:AssignedVehicleService,
    @Inject(MAT_DIALOG_DATA) public item: any, 
    public dialogRef: MatDialogRef<GenericTableComponent>) {
    if (item) {
      this.prqDetail = this.prqService.getAssigneVehicleDetail();
      this.prqDetail.vehicleNo = item?.vehicleNo||item.vehNo;
      const tabIndex = 6; // Adjust the tab index as needed
      this.assignedVehicleService.showVehicleConfirmationDialog(this.prqDetail,this.masterService, this.goBack.bind(this), tabIndex, dialogRef, item,item.isMarket);
      dialogRef.close();
    }
    else {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `View Print is in under development!`,//
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          dialogRef.close();
          // Call your function here 
        }
        else{
          dialogRef.close();
        }
      });
    }

  }

  ngOnInit(): void {

  }
  Close(): void {
    this.goBack('PRQ');
  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
