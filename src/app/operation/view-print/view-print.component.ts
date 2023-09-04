import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { showVehicleConfirmationDialog } from '../assign-vehicle-page/assgine-vehicle-utility';

@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {
  prqDetail: any;

  constructor(private Route: Router, private masterService: MasterService, @Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<GenericTableComponent>) {
    if (item) {
      this.prqDetail = this.masterService.getAssigneVehicleDetail();
      this.prqDetail.vehicleNo = item.vehicleNo
      const tabIndex = 6; // Adjust the tab index as needed
      showVehicleConfirmationDialog(this.prqDetail, masterService, this.goBack.bind(this), tabIndex, dialogRef, item);
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
      });
    }

  }

  ngOnInit(): void {

  }
  Close(): void {
    this.goBack(6);
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
