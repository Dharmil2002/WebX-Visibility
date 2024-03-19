import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ViewTrackingPopupComponent } from "../view-tracking-popup/view-tracking-popup.component";

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
  // StartDate:any
  // EndDate:any
  range = new FormGroup({
    StartDate: new FormControl<Date | null>(null),
    EndDate: new FormControl<Date | null>(null),
  });
  QueryData: any;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  constructor(
    private Route: Router,
    private masterService: MasterService,
    public dialog: MatDialog
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.QueryData", this.QueryData);
    }
    // else {
    //   this.Route.navigateByUrl("Operation/ConsignmentQuery");
    // }
  }

  ngOnInit(): void {}

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
