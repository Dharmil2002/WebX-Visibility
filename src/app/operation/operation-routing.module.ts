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
import { RakeEntryPageComponent } from "./rake-entry-page/rake-entry-page.component";
import { ChaEntryPageComponent } from "./cha-entry-page/cha-entry-page.component";
import { HandedOverComponent } from "./handed-over/handed-over.component";
import { VendorBillDetailsComponent } from "./vendor-bill-details/vendor-bill-details.component";
import { CustomerBillDetailsComponent } from "./customer-bill-details/customer-bill-details.component";
import { VoucherDetailsComponent } from "./voucher-details/voucher-details.component";
import { ChaDetailComponent } from "./cha-detail/cha-detail.component";
import { UnbilledPrqComponent } from "./unbilled-prq/unbilled-prq.component";
import { ErrorHandingComponent } from "./error-handing/error-handing.component";
import { ConsignmentEntryFormComponent } from "./consignment-entry-form/consignment-entry-form.component";
import { ThcGenerationComponent } from "./thc-generation/thc-generation.component";
// import { THCViewComponent } from "./ViewPrint/thc-view/thc-view.component";
// import { WESTERNCARRIERSComponent } from "./ViewPrint/westerncarriers/westerncarriers.component";
// import { PrqViewComponent } from "./ViewPrint/prq-view/prq-view.component";
import { CommonViewPrintComponent } from "./ViewPrint/common-view-print/common-view-print.component";
import { JobViewPrintComponent } from "./job-view-print/job-view-print.component";
import { ConsignmentOperationComponent } from "./consignment-operation/consignment-operation.component";
import { ConsignmentFilterComponent } from "./consignment-filter/consignment-filter.component";
import { UpdateDeliveryComponent } from "./update-delivery/update-delivery.component";
import { QueryPageComponent } from "./consignmentTracking/query-page/query-page.component";
import { TrackingPageComponent } from "./consignmentTracking/tracking-page/tracking-page.component";
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
    path: "UpdateDelivery",
    component: UpdateDeliveryComponent,
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
  },
  {
    path: "RakeEntry",
    component: RakeEntryPageComponent
  },
  {
    path: "CHAEntry",
    component: ChaEntryPageComponent
  },
  {
    path: "Handover",
    component: HandedOverComponent
  },
  {
    path: "ChaDetail",
    component: ChaDetailComponent
  },
  {
    path: "VoucherDetails",
    component: VoucherDetailsComponent
  },
  {
    path: "VendorBillDetails",
    component: VendorBillDetailsComponent
  },
  {
    path: "CustomerBillDetails",
    component: CustomerBillDetailsComponent
  },
  {
    path: "Unbilled",
    component: UnbilledPrqComponent
  },
  {
    path: "IssueTracker",
    component: ErrorHandingComponent
  },
  {
    path: "ConsignmentEntry",
    component: ConsignmentEntryFormComponent
  },
  {
    path: "thc-create",
    component: ThcGenerationComponent
  },
  // {
  //   path: "thc-view",
  //   component: THCViewComponent
  // },
  // {
  //   path: "westerncarriers-view",
  //   component: WESTERNCARRIERSComponent
  // },
  // {
  //   path: "prq-view",
  //   component: PrqViewComponent
  // },
  {
    path: "view-print",
    component: CommonViewPrintComponent
  },
  {
    path: "jobviewprint",
    component: JobViewPrintComponent
  },
  {
    path: "ConsignmentOperation",
    component: ConsignmentOperationComponent
  },
  {
    path: "ConsignmentFilter",
    component: ConsignmentFilterComponent
  },

  {
    path: "ConsignmentQuery",
    component: QueryPageComponent
  },
  {
    path: "ConsignmentTracking",
    component: TrackingPageComponent
  },
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule { }
