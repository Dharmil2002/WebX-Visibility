import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ViewTrackingPopupComponent } from "../view-tracking-popup/view-tracking-popup.component";
import { Observable, firstValueFrom } from "rxjs";
import { GetTrakingDataPipeLine } from "./tracking-query";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { CustomFilterPipe } from "src/app/Utility/Custom Pipe/FilterPipe";
import moment from "moment";
import { CsvDataServiceService } from "src/app/core/service/Utility/csv-data-service.service";
import Swal from "sweetalert2";

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
  TotalDocket: number = 0;
  BookedDocket: number = 0;
  InTransitDocket: number = 0;
  OFDDocket: number = 0;
  DeliveredDocket: number = 0;
  headerForCsv = {
    CnoteNo: "Cnote No",
    EDD: "EDD",
    ATD: "ATD",
    Status: "Status",
    docketDate: "Booking Date",
    TransitMode: "Transit Mode",
    EWB: "EWB",
    Valid: "Valid",
    Movement: "Movement",
    Consignor: "Consignor",
    Consignee: "Consignee",
  };
  formData = [
    {
      name: "StartDate",
      label: "SelectDateRange",
      placeholder: "Select Date",
      type: "daterangpicker",
      value: "",
      filterOptions: "",
      autocomplete: "",
      displaywith: "",
      generatecontrol: true,
      disable: true,
      Validations: [],
      additionalData: {
        support: "EndDate",
      },
    },
    {
      name: "EndDate",
      label: "",
      placeholder: "Select Data Range",
      type: "",
      value: "",
      filterOptions: "",
      autocomplete: "",
      generatecontrol: false,
      disable: true,
      Validations: [
        {
          name: "Select Data Range",
        },
        {
          name: "required",
          message: "StartDateRange is Required...!",
        },
      ],
    },
  ];
  Form: any;
  searchText: any;
  csvFileName: any;
  csvHeaders: {};
  constructor(
    private Route: Router,
    private masterService: MasterService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.QueryData", this.QueryData);
      if (this.QueryData.Docket) {
        const Query = {
          D$match: {
            dKTNO: this.QueryData.Docket,
          },
        };
        this.getTrackingDocket(Query);
        this.GetCardData(Query);
      } else if (this.QueryData.start && this.QueryData.end) {
        const Query = {
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
        };
        this.getTrackingDocket(Query);
        this.GetCardData(Query);
      } else {
        this.Route.navigate(["Operation/ConsignmentQuery"]);
      }
    } else {
      this.Route.navigateByUrl("Operation/ConsignmentQuery");
    }
    this.initializeFormControl();
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

  initializeFormControl() {
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.Form = formGroupBuilder(this.fb, [this.formData]);
    this.Form.controls["StartDate"].setValue(
      this.QueryData.start || new Date()
    );
    this.Form.controls["EndDate"].setValue(this.QueryData.end || new Date());
  }

  async GetCardData(QueryFilter) {
    const req = {
      companyCode: this.CompanyCode,
      collectionName:
        this.Mode == "FTL" ? "docket_ops_det" : "docket_ops_det_ltl",
      filters: [
        { ...QueryFilter },
        {
          D$group: {
            _id: "$sTSNM",
            Count: {
              D$sum: 1,
            },
          },
        },
      ],
    };

    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/query", req)
    );
    if (res.success) {
      res.data?.map((x) => {
        if (x._id == "Booked") {
          this.BookedDocket = x.Count;
        } else if (x._id == "InTransit") {
          this.InTransitDocket = x.Count;
        } else if (x._id == "OFD") {
          this.OFDDocket = x.Count;
        } else if (x._id == "Delivered") {
          this.DeliveredDocket = x.Count;
        }
      });
    }
  }

  async getTrackingDocket(QueryFilter) {
    const PipeLine = GetTrakingDataPipeLine();
    const req = {
      companyCode: this.CompanyCode,
      collectionName:
        this.Mode == "FTL" ? "docket_ops_det" : "docket_ops_det_ltl",
      filters: [{ ...QueryFilter }, ...PipeLine],
    };

    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/query", req)
    );
    if (res.success) {
      if (res.data.length) {
        this.TableData = res.data;
        this.TotalDocket = res.data.length;
        this.isTableLode = true;
        this.dataSource = new MatTableDataSource<any>(this.TableData);
        this.ngOnInit();
      } else {
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Docket Not Found!",
          showConfirmButton: true,
        });
        this.Route.navigateByUrl("Operation/ConsignmentQuery");
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Docket Not Found!",
        showConfirmButton: true,
      });
      this.Route.navigateByUrl("Operation/ConsignmentQuery");
    }
  }

  ExportFunction() {
    const csvData = this.TableData.map((x) => {
      return {
        CnoteNo: x.dKTNO,
        EDD: moment(new Date(x.sTSTM)).format("DD-MM-YYYY"),
        ATD: "",
        Status: x.oPSSTS,
        docketDate: moment(new Date(x.docketData.dKTDT)).format("DD-MM-YYYY"),
        TransitMode: x.TransitMode,
        EWB: "",
        Valid: "",
        Movement: x.oRGN && x.dEST ? `${x.oRGN} -> ${x.dEST}` : "",
        Consignor: x.Consignor,
        Consignee: x.Consignee,
      };
    });
    this.ExportToCsv(csvData);
  }
  ViewFunction(eventData) {
    const dialogRef = this.dialog.open(ViewTrackingPopupComponent, {
      data: eventData?.DocketTrackingData,
      width: "1200px",
      height: "100%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  SearchData(searchText) {
    const filterPipe = new CustomFilterPipe();
    const filteredArr = filterPipe.transform(this.TableData, searchText);
    this.dataSource = new MatTableDataSource<any>(filteredArr);
    this.ngOnInit();
  }

  ExportToCsv(jsonCsv) {
    this.csvFileName = this.QueryData.Docket
      ? `DocTracking ${this.QueryData.Docket}`
      : `DocTracking ${moment(new Date(this.QueryData.start)).format(
          "DD_MM_YYYY"
        )} To ${moment(new Date(this.QueryData.end)).format("DD_MM_YYYY")}`;
    const formattedData = [
      Object.values(this.headerForCsv),
      ...jsonCsv.map((row) => {
        return Object.keys(this.headerForCsv).map((col) => {
          let value =
            col.toLowerCase().includes("date") ||
            col.toLowerCase().includes("dob") ||
            col.toLowerCase().includes("dt")
              ? moment(new Date(row[col])).format("DD-MM-YYYY") ===
                "Invalid date"
                ? row[col]
                : moment(new Date(row[col])).format("DD-MM-YYYY")
              : row[col];
          return value;
        });
      }),
    ];
    CsvDataServiceService.exportToCsv(this.csvFileName, formattedData);
  }
}
