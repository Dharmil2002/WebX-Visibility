import { CommonModule, DatePipe } from "@angular/common";
import { ComponentsModule } from "../shared/components/components.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { GaugeModule } from "angular-gauge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgModule } from "@angular/core";

import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxGaugeModule } from "ngx-gauge";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "./../shared/shared.module";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { CdkTableModule } from "@angular/cdk/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadPlanningComponent } from './load-planning/load-planning.component';
import { DocketDashboardComponent } from './docket-dashboard/docket-dashboard.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { MatTabsModule } from "@angular/material/tabs";
import { DashboardCountPageComponent } from './tabs/dashboard-count-page/dashboard-count-page.component';
import { ArrivalDashboardPageComponent } from './tabs/arrival-dashboard-page/arrival-dashboard-page.component';
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { SnackBarUtilityService } from "../Utility/SnackBarUtility.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MarkArrivalComponent } from './ActionPages/mark-arrival/mark-arrival.component';
import { UpdateStockComponent } from './ActionPages/update-stock/update-stock.component';
import { DepartureDashboardPageComponent } from "./tabs/departure-dashboard-page/departure-dashboard-page.component";
import { LoadingSheetViewComponent } from "../operation/loading-sheet-view/loading-sheet-view.component";
import { utilityService } from "../Utility/utility.service";
import { PickupDeliveryPlannerComponent } from './tabs/pickup-delivery-planner/pickup-delivery-planner.component';
import { PickupDelPageComponent } from './tabs/pickup-del-page/pickup-del-page.component';
import { ManageRunsheetComponent } from './tabs/manage-runsheet/manage-runsheet.component';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StocksComponent } from './stocks/stocks.component';
import { PodCodDashboardPageComponent } from './tabs/pod-cod-dashboard-page/pod-cod-dashboard-page.component';
import { PrqSummaryPageComponent } from './tabs/prq-summary-page/prq-summary-page.component';
import { JobSummaryPageComponent } from './tabs/job-summary-page/job-summary-page.component';
import { RakeUpdateComponent } from "../operation/rake-update/rake-update.component";

@NgModule({
  declarations: [
    LoadPlanningComponent,
    DocketDashboardComponent,
    DashboardPageComponent,
    DashboardCountPageComponent,
    ArrivalDashboardPageComponent, DepartureDashboardPageComponent,
    MarkArrivalComponent,
    UpdateStockComponent,
    LoadingSheetViewComponent,
    PickupDeliveryPlannerComponent,
    PickupDelPageComponent,
    ManageRunsheetComponent,
    StocksComponent,
    PodCodDashboardPageComponent,
    PrqSummaryPageComponent,
    JobSummaryPageComponent,
    RakeUpdateComponent

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    chartjsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    NgxChartsModule,
    NgxGaugeModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    GaugeModule.forRoot(),
    ComponentsModule,
    SharedModule,
    MatPaginatorModule,
    CdkTableModule,
    MatTableModule,
    MatSortModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    SharedComponentsModule,
    MatDialogModule
  ],
  providers: [SnackBarUtilityService, DatePipe, utilityService, FilterUtils]
})
export class DashboardModule { }
