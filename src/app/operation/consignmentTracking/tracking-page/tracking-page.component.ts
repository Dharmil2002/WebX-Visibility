import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomeDatePickerComponent } from "src/app/shared/components/custome-date-picker/custome-date-picker.component";
import { ViewTrackingPopupComponent } from "../view-tracking-popup/view-tracking-popup.component";
import { Observable, firstValueFrom } from "rxjs";
import {
  GetTrakingDataPipeLine,
  formArray,
  headerForCsv,
} from "./tracking-query";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { CustomFilterPipe } from "src/app/Utility/Custom Pipe/FilterPipe";
import moment from "moment";
import { CsvDataServiceService } from "src/app/core/service/Utility/csv-data-service.service";
import Swal from "sweetalert2";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { StorageService } from "src/app/core/service/storage.service";
import { UserMasterService } from "src/app/Utility/module/masters/user-master/user-master-service";

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
  Mode = "";
  QueryData: any;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  CompanyCode = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  TableData: any;
  isTableLode: boolean = false;
  daterangedisabled: boolean = true;
  selectedIndex = 0;
  TotalDocket: number = 0;
  BookedDocket: number = 0;
  InTransitDocket: number = 0;
  OFDDocket: number = 0;
  DeliveredDocket: number = 0;
  CountCard = [
    {
      title: "Total Results",
      count: 0,
      Color: "rgb(123, 140, 161)",
      groupId: 0,
      _id: 0,
    },
    {
      title: "Booked",
      count: 0,
      Color: "#ff8e11",
      groupId: 1
    },
    {
      title: "InTransit",
      count: 0,
      Color: "#6777ef",
      groupId: 2
    },
    {
      title: "In Stock",
      count: 0,
      Color: "#5783c7",
      groupId: 3
    },
    {
      title: "OFD",
      count: 0,
      Color: "lightseagreen",
      groupId: 4
    },
    {
      title: "Delivered",
      count: 0,
      Color: "#4caf50",
      groupId: 5
    },
  ];
  headerForCsv = headerForCsv;
  formData = formArray;
  Form: any;
  searchText: any;
  csvFileName: any;
  csvHeaders: {};
  DocCalledAs: any;
  trackingData: any[] = [];
  constructor(
    private Route: Router,
    private masterService: MasterService,
    public dialog: MatDialog,
    private userMasterService: UserMasterService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    private controlPanel: ControlPanelService,
    private storage: StorageService
  ) {
    this.CompanyCode = this.storage.companyCode;
    this.Mode = this.storage.mode;
    this.DocCalledAs = this.controlPanel.DocCalledAs;
    this.breadscrums = [
      {
        title: `Tracking`,
        items: ["Home"],
        active: `${this.DocCalledAs.Docket} Tracking`,
      },
    ];
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;
      if (this.QueryData.Docket) {
        const Query = {
          D$match: {
            dKTNO: { D$in: this.QueryData.Docket },
          },
        };
        this.getTrackingDocket(Query).then(() => {
          this.GetCardData();
        });
      } else if (this.QueryData.start && this.QueryData.end) {
        const Query = {
          D$match: {
            D$and: [
              {
                dKTDT: {
                  D$gte: this.QueryData.start,
                },
              },
              {
                dKTDT: {
                  D$lte: this.QueryData.end,
                },
              },
            ],
          },
        };
        this.getTrackingDocket(Query).then(() => {
          this.GetCardData();
        });
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

  async GetCardData() {
    this.CountCard.forEach((t) => {
      if (t.groupId == 0) {
        t.count = this.trackingData?.length || 0;
      } else {
        t.count = this.trackingData?.filter((x) => x.GroupId == t.groupId)?.length || 0;
      }
    });
  }

  async getTrackingDocket(QueryFilter) {
    const PipeLine = GetTrakingDataPipeLine();
    const req = {
      companyCode: this.CompanyCode,
      collectionName:
        this.Mode == "FTL" ? "dockets" : "dockets_ltl",
      filters: [{ ...QueryFilter }, ...PipeLine],
    };

    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/query", req)
    );
    if (res.success) {
      let userIds = [];
      if (res.data && res.data.length) {
        this.trackingData = res.data;
        
        // userIds = [ ...userIds,  ...res.data.map(m => m.eNTBY), ...res.data.map(m => m.mODBY) ];
        // userIds = [...new Set(userIds)];

        // const getUser = await this.userMasterService.getUserName({ companyCode: this.storage.companyCode, userId: { "D$in": userIds } })
        // this.trackingData = res.data;
        // if (getUser && getUser.data && getUser.data.length > 0) {
        //   this.trackingData.forEach(x => {
        //     x.DocketTrackingData.forEach(element => {
        //       element.eNTBY = `${element.eNTBY}:${getUser.data.find(z => z.userId == element.eNTBY)?.name || ""}`;
        //     });
        //   })
        // }

        this.trackingData.forEach((x) => {
          x["GroupColor"] = this.CountCard.find((t) => t.groupId == x.GroupId)?.Color;
        });

        this.trackingData = this.trackingData.sort(
          (a, b) => new Date(b.sTSTM).getTime() - new Date(a.sTSTM).getTime()
        );
        this.TableData = this.trackingData;
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
  ViewFunction(eventData) {
    const dialogRef = this.dialog.open(ViewTrackingPopupComponent, {
      data: { TrackingList: [], DokNo: eventData.dKTNO, Sfx: eventData.sFX },
      minWidth: "90%",
      height: "95%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  SearchData(searchText) {
    const filterPipe = new CustomFilterPipe();
    const filteredArr = filterPipe.transform(this.TableData, searchText);
    this.dataSource = new MatTableDataSource<any>(filteredArr);
    this.ngOnInit();
  }
  SetCountCard(item, index) {
    this.selectedIndex = index;
    if (item.title == "Total Results") {
      this.dataSource = new MatTableDataSource<any>(this.TableData);
      this.ngOnInit();
    } else {
      this.dataSource = new MatTableDataSource<any>(
        this.TableData.filter((x) =>
          item.groupId == x.GroupId || item.groupId == 0
        )
      );
      this.ngOnInit();
    }
  }
  OpenDocketView(DockNo) {
    const req = {
      DocNo: DockNo,
      templateName: "DKT",
      PartyField: "",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
    window.open(url, "", "width=1000,height=800");
  }

  ExportFunction() {
    const csvData = this.TableData.map((x) => {
      return {
        [this.DocCalledAs.Docket]: x.dKTNO,        
        Suffix: x.sFX,
        ["Booking Date"]: moment(new Date(x.dKTDT)).format("DD MMM YY"),
        EDD: moment(new Date(x.sTSTM)).format("DD MMM YY"),        
        ATD: x.ATD ? moment(new Date(x.ATD)).format("DD MMM YY") : "",
        Status: x.oPSSTS,
        ["Transit Mode"]: ( x.TransitMode && x.TransitMode.length > 0) ? x.TransitMode.join(" / ") : "",
        EWBNo: x.eWBNO || "",
        Valid: x.eXPDT ? moment(new Date(x.eXPDT)).format("DD MMM YY") : "",
        Movement: x.oRGN && x.dEST ? `${x.oRGN} -> ${x.dEST}` : "",
        Consignor: x.Consignor,
        Consignee: x.Consignee,
        Packages: x.pKGS,
        Weight: x.aCTWT
      };
    });
    this.ExportToCsv(csvData);
  }

  ExportToCsv(jsonCsv) {
    if(jsonCsv && jsonCsv.length > 0) {
    this.csvFileName = this.QueryData.Docket
      ? `DocTracking ${this.QueryData.Docket}`
      : `DocTracking ${moment(new Date(this.QueryData.start)).format(
        "DD_MM_YYYY"
      )} To ${moment(new Date(this.QueryData.end)).format("DD_MM_YYYY")}`;

      const header = {};
      Object.keys(jsonCsv[0]).map(k => {
        header[k] = k;
      });
      const formattedData = [ header, ...jsonCsv];      
      CsvDataServiceService.exportToCsv(this.csvFileName, formattedData);
    }
  }
}
