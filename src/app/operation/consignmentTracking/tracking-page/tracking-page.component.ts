import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ViewTrackingPopupComponent } from "../view-tracking-popup/view-tracking-popup.component";
import { Observable, firstValueFrom } from "rxjs";
import { PipeLine } from "./tracking-query";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

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
  Mode = localStorage.getItem("Mode");
  range = new FormGroup({
    StartDate: new FormControl<Date | null>(null),
    EndDate: new FormControl<Date | null>(null),
  });
  QueryData: any;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  trakingData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  TableData: any;
  isTableLode: boolean = false;
  constructor(
    private Route: Router,
    private masterService: MasterService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.QueryData", this.QueryData);
      if (this.QueryData.Docket) {
        this.getTrackingDocket({
          D$match: {
            dKTNO: this.QueryData.Docket,
          },
        });
      } else if (this.QueryData.start && this.QueryData.end) {
        this.getTrackingDocket({
          D$match: {
            D$and: [
              {
                eNTDT: {
                  D$gte: this.QueryData.start,
                },
              },
              {
                eNTDT: {
                  D$lte: this.QueryData.end,
                },
              },
            ],
          },
        });
      } else {
        this.Route.navigate(["Operation/ConsignmentFilter"]);
      }
    }
    else {
      this.Route.navigateByUrl("Operation/ConsignmentQuery");
    }
  }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    // Connect the paginator to the data source.
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }
  ngOnDestroy() {
    // Disconnect the data source when the component is destroyed.
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  async getTrackingDocket(QueryFilter) {
    console.log("this.Mode", this.Mode);

    const req = {
      companyCode: 10065,
      collectionName: "docket_ops_det_ltl",
      filters: [{ ...QueryFilter }, ...PipeLine],
    };

    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/query", req)
    );
    if (res.success) {
      console.log("res", res);
      this.TableData = res.data;
      this.isTableLode = true;
      this.dataSource = new MatTableDataSource<any>(this.TableData);
      this.ngOnInit();
    }
  }

  ExportFunction() {
    console.log("range", this.range);
  }
  ViewFunction(eventData) {
    const dialogRef = this.dialog.open(ViewTrackingPopupComponent, {
      data: eventData?.DocketTrackingData,
      width: "1200px",
      height:"100%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
}
