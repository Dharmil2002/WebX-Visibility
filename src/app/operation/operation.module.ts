import { NgModule } from "@angular/core";
import { SnackBarUtilityService } from "../Utility/SnackBarUtility.service";
import { CommonModule, DatePipe } from "@angular/common";
import { OperationRoutingModule } from "./operation-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableExporterModule } from "mat-table-exporter";
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { ComponentsModule } from "../shared/components/components.module";
import { SharedModule } from "../shared/shared.module";
import { CreateLoadingSheetComponent } from './create-loading-sheet/create-loading-sheet.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LodingSheetGenerateSuccessComponent } from './loding-sheet-generate-success/loding-sheet-generate-success.component';
import { DepartVehicleComponent } from "./depart-vehicle/depart-vehicle/depart-vehicle.component";
import { ManifestGeneratedComponent } from "./manifest-generated/manifest-generated/manifest-generated.component";
import { RunsheetGeneratedComponent } from "./runsheet-generated/runsheet-generated/runsheet-generated.component";
import { UpdateLoadingSheetComponent } from "./update-loading-sheet/update-loading-sheet.component";
import { CreateRunSheetComponent } from './create-run-sheet/create-run-sheet.component';
import { UpdateRunSheetComponent } from './update-run-sheet/update-run-sheet.component';
import { VehicleLoadingComponent } from "./vehicle-loading/vehicle-loading.component";
import { ViewPrintComponent } from './view-print/view-print.component';
import { VehicleUpdateUploadComponent } from "./vehicle-update-upload/vehicle-update-upload.component";
import { OperationService } from "../core/service/operations/operation.service";
import { NavigationService } from "../Utility/commonFunction/route/route";
import { QuickBookingComponent } from './quick-booking/quick-booking.component';
import { DocketTrackingComponent } from './docket-tracking/docket-tracking.component';
import { PrqEntryPageComponent } from "./prq-entry-page/prq-entry-page.component";
import { JobEntryPageComponent } from './job-entry-page/job-entry-page.component';
import { AssignVehiclePageComponent } from './assign-vehicle-page/assign-vehicle-page.component';
import { RakeEntryPageComponent } from './rake-entry-page/rake-entry-page.component';
import { ChaEntryPageComponent } from './cha-entry-page/cha-entry-page.component';
import { HandedOverComponent } from './handed-over/handed-over.component';
import { ChaDetailComponent } from './cha-detail/cha-detail.component';
import { CustomerBillDetailsComponent } from './customer-bill-details/customer-bill-details.component';
import { VendorBillDetailsComponent } from './vendor-bill-details/vendor-bill-details.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { AssignVehiclePageMethods } from "./assign-vehicle-page/assgine-vehicle-utility";
import { RakeDetailComponent } from './rake-detail/rake-detail.component';
import { UnbilledPrqComponent } from './unbilled-prq/unbilled-prq.component';
import { ErrorHandingComponent } from './error-handing/error-handing.component';
import { utilityService } from "../Utility/utility.service";
import { ErrorHandlingViewComponent } from './error-handing/error-handling-view/error-handling-view.component';
import { PrqListComponent } from './prq-entry-page/prq-list/prq-list.component';
import { ConsignmentEntryFormComponent } from './consignment-entry-form/consignment-entry-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AddMarketVehicleComponent } from './add-market-vehicle/add-market-vehicle.component';
import { FilterUtils } from "../Utility/dropdownFilter";
import { FilterBillingComponent } from './pending-billing/filter-billing/filter-billing.component';
import { ThcGenerationComponent } from './thc-generation/thc-generation.component';
import { ThcViewComponent } from './thc-summary/thc-view/thc-view.component';
// import { THCViewComponent } from './ViewPrint/thc-view/thc-view.component';
// import { WESTERNCARRIERSComponent } from './ViewPrint/westerncarriers/westerncarriers.component';
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { MastersModule } from "../Masters/masters.module";
// import { PrqViewComponent } from './ViewPrint/prq-view/prq-view.component';
import { NgxPrintModule } from "ngx-print";
import { ShipmentEditComponent } from './shipment-edit/shipment-edit.component';
import { CommonViewPrintComponent } from './ViewPrint/common-view-print/common-view-print.component';
import { ShipmentEditBillingComponent } from "./pending-billing/shipment-edit-billing/shipment-edit-billing.component";
import { UpdateShipmentAmountComponent } from "./pending-billing/update-shipment-amount/update-shipment-amount.component";
import { BillSubmissionComponent } from "./pending-billing/bill-approval/submission/bill-submission/bill-submission.component";
import { BillApprovalComponent } from "./pending-billing/bill-approval/bill-approval.component";
import { JobViewPrintComponent } from './job-view-print/job-view-print.component';
import { HandedOverUploadComponent } from './handed-over/handed-over-upload/handed-over-upload.component';
import { ConsignmentOperationComponent } from './consignment-operation/consignment-operation.component';
import { ConsignmentFilterComponent } from './consignment-filter/consignment-filter.component';
import { UpdateDeliveryComponent } from './update-delivery/update-delivery.component';
import { DocketFiltersComponent } from "./thc-generation/filters/docket-filters/docket-filters.component";
import { UpdateDeliveryModalComponent } from "./update-delivery/update-delivery-modal/update-delivery-modal.component";
import { QueryPageComponent } from './consignmentTracking/query-page/query-page.component';
import { TrackingPageComponent } from './consignmentTracking/tracking-page/tracking-page.component';
import { ViewTrackingPopupComponent } from './consignmentTracking/view-tracking-popup/view-tracking-popup.component';

@NgModule({
  declarations: [
    VehicleLoadingComponent,
    UpdateRunSheetComponent,
    CreateRunSheetComponent,
    UpdateLoadingSheetComponent,
    RunsheetGeneratedComponent,
    ManifestGeneratedComponent,
    DepartVehicleComponent,
    LodingSheetGenerateSuccessComponent,
    CreateLoadingSheetComponent,
    ViewPrintComponent,
    VehicleUpdateUploadComponent,
    QuickBookingComponent,
    DocketTrackingComponent,
    PrqEntryPageComponent,
    JobEntryPageComponent,
    AssignVehiclePageComponent,
    RakeEntryPageComponent,
    ChaEntryPageComponent,
    HandedOverComponent,
    ChaDetailComponent,
    CustomerBillDetailsComponent,
    VendorBillDetailsComponent,
    VoucherDetailsComponent,
    RakeDetailComponent,
    UnbilledPrqComponent,
    ErrorHandingComponent,
    ErrorHandlingViewComponent,
    PrqListComponent,
    ConsignmentEntryFormComponent,
    AddMarketVehicleComponent,
    FilterBillingComponent,
    ThcGenerationComponent,
    ThcViewComponent,
    // THCViewComponent,
    // WESTERNCARRIERSComponent,
    // PrqViewComponent,
    ShipmentEditComponent,
    CommonViewPrintComponent,
    ShipmentEditBillingComponent,
    UpdateShipmentAmountComponent,
    BillSubmissionComponent,
    BillApprovalComponent,
    JobViewPrintComponent,
    HandedOverUploadComponent,
    ConsignmentOperationComponent,
    ConsignmentFilterComponent,
    UpdateDeliveryComponent,
    DocketFiltersComponent,
    UpdateDeliveryModalComponent,
    QueryPageComponent,
    TrackingPageComponent,
    ViewTrackingPopupComponent    
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
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
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MastersModule,
    NgxPrintModule
  ],
  providers: [SnackBarUtilityService,PinCodeService,utilityService, OperationService, NavigationService, DatePipe, MatDialogModule, AssignVehiclePageMethods,FilterUtils],
  exports: []
})
export class OperationModule { }
