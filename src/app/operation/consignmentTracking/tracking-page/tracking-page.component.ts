import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ViewTrackingPopupComponent } from "../view-tracking-popup/view-tracking-popup.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-tracking-page",
  templateUrl: "./tracking-page.component.html",
})
export class TrackingPageComponent implements OnInit {
  breadscrums = [
    {
      title: "Tracking Page",
      items: ["Home"],
      active: "Consignment Tracking",
    },
  ];
  Mode = localStorage.getItem("Mode")
  range = new FormGroup({
    StartDate: new FormControl<Date | null>(null),
    EndDate: new FormControl<Date | null>(null),
  });
  QueryData: any;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  CompanyCode = parseInt(localStorage.getItem('companyCode'))
  trakingData = [1,2,3,4,5,6,7,8,9,10]

  constructor(
    private Route: Router,
    private masterService: MasterService,
    public dialog: MatDialog
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.QueryData", this.QueryData);
    }
    else {
      this.Route.navigateByUrl("Operation/ConsignmentQuery");
    }
  }

   ngOnInit(): void {
    // this.getTrackingDocket()
    if (this.QueryData.Docket) {
      this.getTrackingDocket({ dKTNO: this.QueryData.Docket });
    } else if (this.QueryData.start && this.QueryData.end) {
      this.getTrackingDocket({
        eNTDT: {
          D$gte: this.QueryData.start,
          D$lt: this.QueryData.end,
        },
      });
    }else {
      this.Route.navigate(["Operation/ConsignmentFilter"])
    }
    
  }

  async getTrackingDocket(filter){
    console.log('this.Mode' ,this.Mode)

    const req = {
      companyCode: this.CompanyCode,
      collectionName: this.Mode=="FTL"?"dockets":"dockets_ltl",
      filter,
    };
    console.log('req' ,req)

    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    if(res.success){
      console.log('res' ,res)
      // this.TableData = res.data
      // this.isTableLode = true
    }
  }

  ExportFunction() {
    console.log("range", this.range);
  }
  ViewFunction(eventData) {
    const dialogRef = this.dialog.open(ViewTrackingPopupComponent, {
      data: {},
      width: "80%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
}
