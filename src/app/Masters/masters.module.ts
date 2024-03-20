import { NgModule } from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";
import { MastersRoutingModule } from "./masters-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTreeModule } from "@angular/material/tree";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ComponentsModule } from "../shared/components/components.module";
import { SharedModule } from "../shared/shared.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CNoteGenerationComponent } from "./cnote-generation/cnote-generation.component";
import { MatStepperModule } from "@angular/material/stepper";
import { DatePipe } from "@angular/common";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { EwaybillConfigComponent } from "./ewaybill-config/ewaybill-config.component";
import { EwayBillDetailsComponent } from "./eway-bill-details/eway-bill-details.component";
import { EwayBillDocketBookingComponent } from "./eway-bill-docket-booking/eway-bill-docket-booking.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatTableModule } from "@angular/material/table";
import { jsonDataServiceService } from "../core/service/Utility/json-data-service.service";
import { LoadingsheetComponent } from "./loadingsheet/loadingsheet.component";
import { GridListComponent } from "../components/grid-list/grid-list.component";
import { LoadingSheetDetailsComponent } from "./loading-sheet-details/loading-sheet-details.component";
import { LoadingsheetgenerateComponent } from "./loadingsheetgenerate/loadingsheetgenerate.component";
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { DispatchVehicleComponent } from "./dispatch-vehicle/dispatch-vehicle.component";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { ManifestGenerationComponent } from "./manifest-generation/manifest-generation.component";
import { SnackBarUtilityService } from "../Utility/SnackBarUtility.service";
import { CompanygstmasterListComponent } from "./Company GST Master/companygstmaster-list/companygstmaster-list.component";
import { CompanygstmasterAddComponent } from "./Company GST Master/companygstmaster-add/companygstmaster-add.component";
import { utilityService } from "../Utility/utility.service";
import { AddStateMasterComponent } from "./state-master/add-state-master/add-state-master.component";
import { StateMasterListComponent } from "./state-master/state-master-list/state-master-list.component";
import { DriverMasterComponent } from "./driver-master/driver-master.component";
import { AddDriverMasterComponent } from "./driver-master/add-driver-master/add-driver-master.component";
import { LocationMasterComponent } from "./location-master/location-master.component";
import { AddCompanyComponent } from "./Company Setup Master/add-company/add-company.component";
import { AddLocationMasterComponent } from "./location-master/add-location-master/add-location-master.component";
import { CustomerMasterListComponent } from "./customer-master/customer-master-list/customer-master-list.component";
import { CustomerMasterAddComponent } from "./customer-master/customer-master-add/customer-master-add.component";
import { AddDcrSeriesComponent } from "./dcr-series/add-dcr-series/add-dcr-series.component";
import { TrackDcrSeriesComponent } from "./dcr-series/track-dcr-series/track-dcr-series.component";
import { AddVehicletypeMasterComponent } from "./vehicle-type-master/add-vehicletype-master/add-vehicletype-master.component";
import { VehicletypeMasterListComponent } from "./vehicle-type-master/vehicletype-master-list/vehicletype-master-list.component";
import { CustomerGroupListComponent } from "./customer-group-master/customer-group-list/customer-group-list.component";
import { CustomerGroupAddComponent } from "./customer-group-master/customer-group-add/customer-group-add.component";
import { AddPinCodeMasterComponent } from "./pincode-master/add-pincode-master/add-pincode-master.component";
import { PincodeMasterListComponent } from "./pincode-master/pincode-master-list/pincode-master-list.component";
import { AddUserMasterComponent } from "./user-master/add-user-master/add-user-master.component";
import { UserMasterListComponent } from "./user-master/user-master-list/user-master-list.component";
import { AddCityMasterComponent } from "./city-master/add-city-master/add-city-master.component";
import { CityMasterListComponent } from "./city-master/city-master-list/city-master-list.component";
import { AddVehicleMasterComponent } from "./vehicle-master/add-vehicle-master/add-vehicle-master.component";
import { VehicleMasterListComponent } from "./vehicle-master/vehicle-master-list/vehicle-master-list.component";
import { DcrDetailPageComponent } from "./dcr-series/dcr-detail-page/dcr-detail-page.component";
import { ReAllocateDcrComponent } from "./dcr-series/re-allocate-dcr/re-allocate-dcr.component";
import { SplitDcrComponent } from "./dcr-series/split-dcr/split-dcr.component";
import { EwayBillDocketBookingV2Component } from "./eway-bill-docket-booking-v2/eway-bill-docket-booking-v2t";
import { AddVendorMasterComponent } from "./vendor-master/add-vendor-master/add-vendor-master.component";
import { VendorMasterListComponent } from "./vendor-master/vendor-master-list/vendor-master-list.component";
import { VendorMasterViewComponent } from "./vendor-master/vendor-master-view/vendor-master-view.component";
import { RouteMasterLocationAddComponent } from "./route-master-location-wise/route-master-location-add/route-master-location-add.component";
import { RouteMasterLocationWiseComponent } from "./route-master-location-wise/route-master-location-wise-list/route-master-location-wise.component";
import { AirportMasterListComponent } from "./airport-master/airport-master-list/airport-master-list.component";
import { AirportMasterAddComponent } from "./airport-master/airport-master-add/airport-master-add.component";
import { PincodeLocationMappingComponent } from "./pincode-to-location-mapping-master/pincode-location-list/pincode-to-location-mapping.component";
import { AddressMasterListComponent } from "./address-master/address-master-list/address-master-list.component";
import { AddressMasterAddComponent } from "./address-master/address-master-add/address-master-add.component";
import { ClusterMasterAddComponent } from "./cluster-master/cluster-master-add/cluster-master-add.component";
import { ClusterMasterListComponent } from "./cluster-master/cluster-master-list/cluster-master-list.component";
import { AddRouteScheduleMasterComponent } from "./route-schedule-master/add-route-schedule-master/add-route-schedule-master.component";
import { RouteScheduleMasterListComponent } from "./route-schedule-master/route-schedule-master-list/route-schedule-master-list.component";
import { RouteScheduleDetComponent } from "./route-schedule-master/route-schedule-det/route-schedule-det.component";
import { TripRouteMasterListComponent } from "./trip-route-master/trip-route-master-list/trip-route-master-list.component";
import { TripRouteMasterAddComponent } from "./trip-route-master/trip-route-master-add/trip-route-master-add.component";
import { GeneralMasterListComponent } from "./general-master/general-master-list/general-master-list.component";
import { GeneralMasterAddComponent } from "./general-master/general-master-add/general-master-add.component";
import { GeneralMasterCodeListComponent } from "./general-master/general-master-code-list/general-master-code-list.component";
import { AddVehicleStatusUpdateComponent } from "./vehicle-status-update/add-vehicle-status-update/add-vehicle-status-update.component";
import { VehicleStatusUpdateComponent } from "./vehicle-status-update/vehicle-status-update-list/vehicle-status-update.component";
import { AddEditHolidayComponent } from "./holiday-master/add-edit-holiday-master/add-edit-holiday.component";
import { HolidayMasterComponent } from "./holiday-master/holiday-master-list/holiday-master-list.component";
import { CityLocationMappingMaster } from "./city-location-mapping-master/city-location-master/city-to-location-mapping.component";
import { ContainerMasterListComponent } from "./container-master/container-master-list/container-master-list.component";
import { AddContainerMasterComponent } from "./container-master/add-container-master/add-container-master.component";
import { MenuBidingAccessComponent } from "./menu-biding-access/menu-biding-access.component";
import { FleetMasterListComponent } from "./fleet-master/fleet-master-list/fleet-master-list.component";
import { AddFleetMasterComponent } from "./fleet-master/add-fleet-master/add-fleet-master.component";
import { PinCodeService } from "../Utility/module/masters/pincode/pincode.service";
import { StateService } from "../Utility/module/masters/state/state.service";
import { VirtualLoginComponent } from "../layout/virtual-login/virtual-login.component";
import { CustomerContractBasicInformationComponent } from "./Customer Contract/CustomerContractTabs/customer-contract-basic-information/customer-contract-basic-information.component";
import { CustomerContractServiceSelectionComponent } from "./Customer Contract/CustomerContractTabs/customer-contract-service-selection/customer-contract-service-selection.component";
import { CustomerContractListComponent } from "./Customer Contract/customer-contract-list/customer-contract-list.component";
import { CustomerContractTabsIndexComponent } from "./Customer Contract/customer-contract-tabs-index/customer-contract-tabs-index.component";
import { AddProductComponent } from "./product-master/add-product/add-product.component";
import { ListProductComponent } from "./product-master/list-product/list-product.component";
import { ProductChargesComponent } from "./product-master/product-charges/product-charges.component";
import { ProductServicesComponent } from "./product-master/product-services/product-services.component";
import { SessionService } from "../core/service/session.service";
import { BeneficiaryMasterListComponent } from "./beneficiary-master/beneficiary-master-list/beneficiary-master-list.component";
import { AddBeneficiaryMasterComponent } from "./beneficiary-master/add-beneficiary-master/add-beneficiary-master.component";
import { CustomerContractFreightMatrixComponent } from "./Customer Contract/CustomerContractTabs/customer-contract-freight-matrix/customer-contract-freight-matrix.component";
import { TableVirtualScrollModule } from "ng-table-virtual-scroll";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { EncryptionService } from "../core/service/encryptionService.service";
import { CustomerContractNonFreightChargesComponent } from "./Customer Contract/CustomerContractTabs/customer-contract-non-freight-charges/customer-contract-non-freight-charges.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AccountMasterComponent } from "./Account/Account Master/account-master/account-master.component";
import { AccountListFilterComponent } from './Account/Account Master/account-list-filter/account-list-filter.component';
import { AddAccountComponent } from './Account/Account Master/add-account/add-account.component';
import { AccountGroupComponent } from './Account/AccoutGroupMaster/account-group/account-group.component';
import { BeneficiaryModalComponent } from './beneficiary-master/add-beneficiary-master/beneficiary-modal/beneficiary-modal.component';
import { VendorContractListComponent } from "./vendor-contract/vendor-contract-list/vendor-contract-list.component";
import { VendorIndexComponent } from './vendor-contract/vendor-index/vendor-index.component';
import { VendorContractBasicInformationComponent } from './vendor-contract/vendorContractTabs/vendor-contract-basic-information/vendor-contract-basic-information.component';
import { VendorContractServiceSelectionComponent } from './vendor-contract/vendorContractTabs/vendor-contract-service-selection/vendor-contract-service-selection.component';
import { VendorTERDetailComponent } from './vendor-contract/vendorContractTabs/vendor-terdetail/vendor-terdetail.component';
import { VendorTERModalComponent } from './vendor-contract/vendorContractTabs/vendor-terdetail/vendor-termodal/vendor-termodal.component';
import { SacMasterListComponent } from "./sac-master/sac-master-list/sac-master-list.component";
import { AddSacMasterComponent } from "./sac-master/add-sac-master/add-sac-master.component";
import { VendorLHFTRDetailComponent } from './vendor-contract/vendorContractTabs/vendor-lhftrdetail/vendor-lhftrdetail.component';
import { VendorLHFTRModalComponent } from './vendor-contract/vendorContractTabs/vendor-lhftrdetail/vendor-lhftrmodal/vendor-lhftrmodal.component';
import { VendorLHLDetailComponent } from './vendor-contract/vendorContractTabs/vendor-lhldetail/vendor-lhldetail.component';
import { VendorLHLModalComponent } from './vendor-contract/vendorContractTabs/vendor-lhldetail/vendor-lhlmodal/vendor-lhlmodal.component';
import { VendorLMDDetailComponent } from './vendor-contract/vendorContractTabs/vendor-lmddetail/vendor-lmddetail.component';
import { VendorLMDModalComponent } from './vendor-contract/vendorContractTabs/vendor-lmddetail/vendor-lmdmodal/vendor-lmdmodal.component';
import { VendorBusiAssocDetailComponent } from './vendor-contract/vendorContractTabs/vendor-busi-assoc-detail/vendor-busi-assoc-detail.component';
import { VendorBusiAssocModalComponent } from './vendor-contract/vendorContractTabs/vendor-busi-assoc-detail/vendor-busi-assoc-modal/vendor-busi-assoc-modal.component';
import { AddNewCustomerContractComponent } from './Customer Contract/add-new-customer-contract/add-new-customer-contract.component';
import { AddNewVendorContractComponent } from './vendor-contract/add-new-vendor-contract/add-new-vendor-contract.component';
import { AddTdsComponent } from './Account-master/tds-master/add-tds/add-tds.component';
import { ListTdsComponent } from './Account-master/tds-master/list-tds/list-tds.component';
import { ListBankComponent } from './Account-master/bank-master/list-bank/list-bank.component';
import { AddBankComponent } from './Account-master/bank-master/add-bank/add-bank.component';
import { ListAccountComponent } from './Account-master/account-master/list-account/list-account.component';
import { AddaccountComponent } from './Account-master/account-master/addaccount/addaccount.component';
import { AddGroupComponent } from './Account-master/group-master/add-group/add-group.component';
import { ListGroupComponent } from './Account-master/group-master/list-group/list-group.component';
import { CustomerContractNonFreightChargesPopupComponent } from './Customer Contract/CustomerContractTabs/customer-contract-non-freight-charges-popup/customer-contract-non-freight-charges-popup.component';
import { AddTenantComponent } from './Tenant Setup/add-tenant/add-tenant.component';
import { TenantListComponent } from './Tenant Setup/tenant-list/tenant-list.component';
import { ExpressRouteBulkUploadComponent } from './vendor-contract/vendorContractTabs/vendor-terdetail/express-route-bulk-upload/express-route-bulk-upload.component';
import { FullTruckRouteBulkUploadComponent } from './vendor-contract/vendorContractTabs/vendor-lhftrdetail/full-truck-route-bulk-upload/full-truck-route-bulk-upload.component';
import { LongHaulLaneBulkUploadComponent } from './vendor-contract/vendorContractTabs/vendor-lhldetail/long-haul-lane-bulk-upload/long-haul-lane-bulk-upload.component';
import { LastMileDeliveryBulkUploadComponent } from './vendor-contract/vendorContractTabs/vendor-lmddetail/last-mile-delivery-bulk-upload/last-mile-delivery-bulk-upload.component';
import { BusinessAssociateBulkUploadComponent } from './vendor-contract/vendorContractTabs/vendor-busi-assoc-detail/business-associate-bulk-upload/business-associate-bulk-upload.component';
import { AddContainerComponent } from './Container Master/add-container/add-container.component';
import { ListContainerComponent } from './Container Master/list-container/list-container.component';
import { ViewPrintComponent } from './view-print/view-print.component';
import { ProductListComponent } from './shard-product/product-list/product-list.component';
import { ShardProductChargesComponent } from './shard-product/shard-product-charges/shard-product-charges.component';
import { ShardProductServicesComponent } from './shard-product/shard-product-services/shard-product-services.component';
import { ShardProductAddComponent } from './shard-product/shard-product-add/shard-product-add.component';
import { UploadLocationComponent } from './location-master/upload-location/upload-location.component';
import { ContainerStatusListComponent } from "./container-status-update/container-status-list/container-status-list.component";
import { AddContainerStatusComponent } from "./container-status-update/add-container-status/add-container-status.component";
import { AddressService } from "../Utility/module/masters/Address/address.service";
import { FreightChargeUploadComponent } from './Customer Contract/CustomerContractTabs/customer-contract-freight-matrix/freight-charge-upload/freight-charge-upload.component';
import { MenuAccessRightComponent } from "./Admin/MenuAccessRight/menu-access-right/menu-access-right.component";
import { DcrAllocationComponent } from './dcr-series/dcr-allocation/dcr-allocation.component';
import { DcrManagementComponent } from "./dcr-series/dcr-management/dcr-management.component";
import { ActiveSeriesComponent } from "./dcr-series/active-series/active-series.component";

@NgModule({
  imports: [
    CommonModule,
    MastersRoutingModule,
    MatIconModule,
    NgbModule,
    MatTreeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    SharedComponentsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatStepperModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    TableVirtualScrollModule,
    ScrollingModule,
    MatSidenavModule,
    NgIf,
  ],

  declarations: [
    SacMasterListComponent,
    AddSacMasterComponent,
    VirtualLoginComponent,
    CNoteGenerationComponent,
    EwaybillConfigComponent,
    EwayBillDetailsComponent,
    EwayBillDocketBookingComponent,
    LoadingsheetComponent,
    GridListComponent,
    LoadingSheetDetailsComponent,
    LoadingsheetgenerateComponent,
    DispatchVehicleComponent,
    ManifestGenerationComponent,
    CompanygstmasterListComponent,
    CompanygstmasterAddComponent,
    StateMasterListComponent,
    AddStateMasterComponent,
    CityMasterListComponent,
    AddCityMasterComponent,
    DriverMasterComponent,
    AddDriverMasterComponent,
    LocationMasterComponent,
    AddCompanyComponent,
    AddLocationMasterComponent,
    AddDcrSeriesComponent,
    CustomerMasterListComponent,
    CustomerMasterAddComponent,
    TrackDcrSeriesComponent,
    AddVehicletypeMasterComponent,
    VehicletypeMasterListComponent,
    CustomerGroupListComponent,
    CustomerGroupAddComponent,
    PincodeMasterListComponent,
    AddPinCodeMasterComponent,
    AddVehicleMasterComponent,
    VehicleMasterListComponent,
    DcrDetailPageComponent,
    ReAllocateDcrComponent,
    SplitDcrComponent,
    RouteMasterLocationWiseComponent,
    UserMasterListComponent,
    AddUserMasterComponent,
    EwayBillDocketBookingV2Component,
    VendorMasterListComponent,
    AddVendorMasterComponent,
    VendorMasterViewComponent,
    AirportMasterListComponent,
    AirportMasterAddComponent,
    RouteMasterLocationAddComponent,
    PincodeLocationMappingComponent,
    AddressMasterListComponent,
    AddressMasterAddComponent,
    ClusterMasterAddComponent,
    ClusterMasterListComponent,
    RouteScheduleMasterListComponent,
    AddRouteScheduleMasterComponent,
    RouteScheduleDetComponent,
    TripRouteMasterListComponent,
    TripRouteMasterAddComponent,
    VehicleStatusUpdateComponent,
    GeneralMasterListComponent,
    GeneralMasterAddComponent,
    GeneralMasterCodeListComponent,
    AddVehicleStatusUpdateComponent,
    HolidayMasterComponent,
    AddEditHolidayComponent,
    CityLocationMappingMaster,
    ContainerMasterListComponent,
    MenuBidingAccessComponent,
    AddContainerMasterComponent,
    FleetMasterListComponent,
    AddFleetMasterComponent,
    CustomerContractListComponent,
    CustomerContractTabsIndexComponent,
    CustomerContractBasicInformationComponent,
    CustomerContractServiceSelectionComponent,
    FleetMasterListComponent,
    AddFleetMasterComponent,
    CustomerContractListComponent,
    CustomerContractTabsIndexComponent,
    CustomerContractBasicInformationComponent,
    CustomerContractServiceSelectionComponent,
    BeneficiaryMasterListComponent,
    AddBeneficiaryMasterComponent,
    CustomerContractFreightMatrixComponent,
    ListProductComponent,
    AddProductComponent,
    ProductChargesComponent,
    ProductServicesComponent,
    CustomerContractNonFreightChargesComponent,
    ListProductComponent,
    AddProductComponent,
    ProductChargesComponent,
    ProductServicesComponent,
    AccountMasterComponent,
    AccountListFilterComponent,
    AddAccountComponent,
    AccountGroupComponent,
    BeneficiaryModalComponent,
    VendorContractListComponent,
    VendorIndexComponent,
    VendorContractBasicInformationComponent,
    VendorContractServiceSelectionComponent,
    VendorTERDetailComponent,
    VendorTERModalComponent,
    VendorLHFTRDetailComponent,
    VendorLHFTRModalComponent,
    VendorLHLDetailComponent,
    VendorLHLModalComponent,
    VendorLMDDetailComponent,
    VendorLMDModalComponent,
    VendorBusiAssocDetailComponent,
    VendorBusiAssocModalComponent,
    AddNewCustomerContractComponent,
    AddNewVendorContractComponent,
    AddTdsComponent,
    ListTdsComponent,
    ListBankComponent,
    AddBankComponent,
    ListAccountComponent,
    AddaccountComponent,
    AddGroupComponent,
    ListGroupComponent,
    CustomerContractNonFreightChargesPopupComponent,
    AddTenantComponent,
    TenantListComponent,
    ExpressRouteBulkUploadComponent,
    FullTruckRouteBulkUploadComponent,
    LongHaulLaneBulkUploadComponent,
    LastMileDeliveryBulkUploadComponent,
    BusinessAssociateBulkUploadComponent,
    AddContainerComponent,
    ListContainerComponent,
    ViewPrintComponent,
    ProductListComponent,
    ShardProductChargesComponent,
    ShardProductServicesComponent,
    ShardProductAddComponent,
    UploadLocationComponent,
    ContainerStatusListComponent,
    AddContainerStatusComponent,
    FreightChargeUploadComponent,
    MenuAccessRightComponent,
    DcrAllocationComponent,
    DcrManagementComponent,
    ActiveSeriesComponent
  ],

  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    jsonDataServiceService,
    FilterUtils,
    SnackBarUtilityService,
    utilityService,
    PinCodeService,
    StateService,
    SessionService,
    AddressService,
    EncryptionService,
  ],
})
export class MastersModule {}
