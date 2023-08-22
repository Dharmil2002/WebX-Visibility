import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSheetViewComponent } from "./loading-sheet-view/loading-sheet-view.component";
import { CreateLoadingSheetComponent } from "./create-loading-sheet/create-loading-sheet.component";
import { LodingSheetGenerateSuccessComponent } from "./loding-sheet-generate-success/loding-sheet-generate-success.component";
import { DepartVehicleComponent } from "./depart-vehicle/depart-vehicle/depart-vehicle.component";
import { ManifestGeneratedComponent } from "./manifest-generated/manifest-generated/manifest-generated.component";
import { RunsheetGeneratedComponent } from "./runsheet-generated/runsheet-generated/runsheet-generated.component";
import { UpdateLoadingSheetComponent } from "./update-loading-sheet/update-loading-sheet.component";
import { CreateRunSheetComponent } from "./create-run-sheet/create-run-sheet.component";
import { UpdateRunSheetComponent } from "./update-run-sheet/update-run-sheet.component";
import { VehicleLoadingComponent } from "./vehicle-loading/vehicle-loading.component";
import { ViewPrintComponent } from "./view-print/view-print.component";
import { QuickBookingComponent } from './quick-booking/quick-booking.component';
import { DocketTrackingComponent } from "./docket-tracking/docket-tracking.component";
import { PrqEntryPageComponent } from "./prq-entry-page/prq-entry-page.component";
import { JobEntryPageComponent } from "./job-entry-page/job-entry-page.component";
import { AssignVehiclePageComponent } from "./assign-vehicle-page/assign-vehicle-page.component";
const routes: Routes = [
  {
    path: "LoadingSheetView",
    component: LoadingSheetViewComponent,
  },
  {
    path: "CreateLoadingSheet",
    component: CreateLoadingSheetComponent,
  },
  {
    path: "LodingSheetGenerate",
    component: LodingSheetGenerateSuccessComponent,
  },
  {
    path: "DepartVehicle",
    component: DepartVehicleComponent,
  },
  {
    path: "ManifestGenerated",
    component: ManifestGeneratedComponent,
  },
  {
    path: "RunSheetGenerated",
    component: RunsheetGeneratedComponent,
  },
  {
    path: "UpdateLoadingSheet",
    component: UpdateLoadingSheetComponent,
  },
  {
    path: "CreateRunSheet",
    component: CreateRunSheetComponent,
  },
  {
    path: "UpdateRunSheet",
    component: UpdateRunSheetComponent,
  },
  {
    path: "VehicleLoading",
    component: VehicleLoadingComponent
  },
  {
    path: "ViewPrint",
    component: ViewPrintComponent
  },
  {
    path: "QuickCreateDocket",
    component: QuickBookingComponent
  },
  {
    path: "DocketTracking",
    component: DocketTrackingComponent
  },
  {
    path: "PRQEntry",
    component: PrqEntryPageComponent
  },
  {
    path: "JobEntry",
    component: JobEntryPageComponent
  },
  {
    path: "AssignVehicle",
    component: AssignVehiclePageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule { }
