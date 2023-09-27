import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EwaybillConfigComponent } from './ewaybill-config/ewaybill-config.component';
import { EwayBillDetailsComponent } from './eway-bill-details/eway-bill-details.component';
import { EwayBillDocketBookingComponent } from './eway-bill-docket-booking/eway-bill-docket-booking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTableModule } from '@angular/material/table';
import { jsonDataServiceService } from '../core/service/Utility/json-data-service.service';
import { LoadingsheetComponent } from './loadingsheet/loadingsheet.component';
import { GridListComponent } from '../components/grid-list/grid-list.component';
import { LoadingSheetDetailsComponent } from './loading-sheet-details/loading-sheet-details.component';
import { LoadingsheetgenerateComponent } from './loadingsheetgenerate/loadingsheetgenerate.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { DispatchVehicleComponent } from './dispatch-vehicle/dispatch-vehicle.component';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { ManifestGenerationComponent } from './manifest-generation/manifest-generation.component';
import { SnackBarUtilityService } from '../Utility/SnackBarUtility.service';
import { CompanygstmasterListComponent } from './Company GST Master/companygstmaster-list/companygstmaster-list.component';
import { CompanygstmasterAddComponent } from './Company GST Master/companygstmaster-add/companygstmaster-add.component';
import { utilityService } from '../Utility/utility.service';
import { AddStateMasterComponent } from './state-master/add-state-master/add-state-master.component';
import { StateMasterListComponent } from './state-master/state-master-list/state-master-list.component';
import { DriverMasterComponent } from './driver-master/driver-master.component';
import { AddDriverMasterComponent } from './driver-master/add-driver-master/add-driver-master.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { AddCompanyComponent } from './Company Setup Master/add-company/add-company.component';
import { AddLocationMasterComponent } from './location-master/add-location-master/add-location-master.component';
import { CustomerMasterListComponent } from './customer-master/customer-master-list/customer-master-list.component';
import { CustomerMasterAddComponent } from './customer-master/customer-master-add/customer-master-add.component';
import { AddDcrSeriesComponent } from './dcr-series/add-dcr-series/add-dcr-series.component';
import { TrackDcrSeriesComponent } from './dcr-series/track-dcr-series/track-dcr-series.component';
import { AddVehicletypeMasterComponent } from './vehicle-type-master/add-vehicletype-master/add-vehicletype-master.component';
import { VehicletypeMasterListComponent } from './vehicle-type-master/vehicletype-master-list/vehicletype-master-list.component';
import { CustomerGroupListComponent } from './customer-group-master/customer-group-list/customer-group-list.component';
import { CustomerGroupAddComponent } from './customer-group-master/customer-group-add/customer-group-add.component';
import { AddPinCodeMasterComponent } from './pincode-master/add-pincode-master/add-pincode-master.component';
import { PincodeMasterListComponent } from './pincode-master/pincode-master-list/pincode-master-list.component';
import { AddUserMasterComponent } from './user-master/add-user-master/add-user-master.component';
import { UserMasterListComponent } from './user-master/user-master-list/user-master-list.component';
import { AddCityMasterComponent } from './city-master/add-city-master/add-city-master.component';
import { CityMasterListComponent } from './city-master/city-master-list/city-master-list.component';
import { AddVehicleMasterComponent } from './vehicle-master/add-vehicle-master/add-vehicle-master.component';
import { VehicleMasterListComponent } from './vehicle-master/vehicle-master-list/vehicle-master-list.component';
import { DcrDetailPageComponent } from './dcr-series/dcr-detail-page/dcr-detail-page.component';
import { ReAllocateDcrComponent } from './dcr-series/re-allocate-dcr/re-allocate-dcr.component';
import { SplitDcrComponent } from './dcr-series/split-dcr/split-dcr.component';
import { EwayBillDocketBookingV2Component } from './eway-bill-docket-booking-v2/eway-bill-docket-booking-v2t';
import { AddVendorMasterComponent } from './vendor-master/add-vendor-master/add-vendor-master.component';
import { VendorMasterListComponent } from './vendor-master/vendor-master-list/vendor-master-list.component';
import { VendorMasterViewComponent } from './vendor-master/vendor-master-view/vendor-master-view.component';
import { RouteMasterLocationAddComponent } from './route-master-location-wise/route-master-location-add/route-master-location-add.component';
import { RouteMasterLocationWiseComponent } from './route-master-location-wise/route-master-location-wise-list/route-master-location-wise.component';
import { AirportMasterListComponent } from './airport-master/airport-master-list/airport-master-list.component';
import { AirportMasterAddComponent } from './airport-master/airport-master-add/airport-master-add.component';
import { PincodeLocationMappingComponent } from './pincode-to-location-mapping-master/pincode-location-list/pincode-to-location-mapping.component';
import { AddressMasterListComponent } from './address-master/address-master-list/address-master-list.component';
import { AddressMasterAddComponent } from './address-master/address-master-add/address-master-add.component';
import { ClusterMasterAddComponent } from './cluster-master/cluster-master-add/cluster-master-add.component';
import { ClusterMasterListComponent } from './cluster-master/cluster-master-list/cluster-master-list.component';
import { AddRouteScheduleMasterComponent } from './route-schedule-master/add-route-schedule-master/add-route-schedule-master.component';
import { RouteScheduleMasterListComponent } from './route-schedule-master/route-schedule-master-list/route-schedule-master-list.component';
import { RouteScheduleDetComponent } from './route-schedule-master/route-schedule-det/route-schedule-det.component';
import { TripRouteMasterListComponent } from './trip-route-master/trip-route-master-list/trip-route-master-list.component';
import { TripRouteMasterAddComponent } from './trip-route-master/trip-route-master-add/trip-route-master-add.component';
import { GeneralMasterListComponent } from './general-master/general-master-list/general-master-list.component';
import { GeneralMasterAddComponent } from './general-master/general-master-add/general-master-add.component';
import { GeneralMasterCodeListComponent } from './general-master/general-master-code-list/general-master-code-list.component';
import { AddVehicleStatusUpdateComponent } from './vehicle-status-update/add-vehicle-status-update/add-vehicle-status-update.component';
import { VehicleStatusUpdateComponent } from './vehicle-status-update/vehicle-status-update-list/vehicle-status-update.component';
import { AddEditHolidayComponent } from './holiday-master/add-edit-holiday-master/add-edit-holiday.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master-list/holiday-master-list.component';
import { CityLocationMappingMaster } from './city-location-mapping-master/city-location-master/city-to-location-mapping.component';
import { ContainerMasterListComponent } from './container-master/container-master-list/container-master-list.component';
import { AddContainerMasterComponent } from './container-master/add-container-master/add-container-master.component';
import { MenuBidingAccessComponent } from './menu-biding-access/menu-biding-access.component';
import { VendorQueryPageComponent } from './Vendor Contract/vendor-query-page/vendor-query-page.component';
import { AddContractProfileComponent } from './Vendor Contract/add-contract-profile/add-contract-profile.component';
import { VendorContractHeaderComponent } from './Vendor Contract/vendor-contract-header/vendor-contract-header.component';
import { BasicInformationComponent } from './Vendor Contract/vendor-tabs/basic-information/basic-information.component';
import { VendorTabsIndexComponent } from './Vendor Contract/vendor-tabs-index/vendor-tabs-index.component';
import { VendorContractListComponent } from './Vendor Contract/vendor-contract-list/vendor-contract-list.component';
import { ServiceSelectionComponent } from './Vendor Contract/vendor-tabs/service-selection/service-selection.component';
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
    MatToolbarModule, SharedComponentsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatStepperModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule

  ],

  declarations: [
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
    AddVehicleStatusUpdateComponent, HolidayMasterComponent,
    AddEditHolidayComponent,CityLocationMappingMaster, ContainerMasterListComponent,MenuBidingAccessComponent, AddContainerMasterComponent,
    VendorQueryPageComponent,
    AddContractProfileComponent,
    VendorContractHeaderComponent,
    BasicInformationComponent,
    VendorTabsIndexComponent,
    VendorContractListComponent,
   ServiceSelectionComponent

  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, { provide: MAT_DIALOG_DATA, useValue: {} }, jsonDataServiceService, FilterUtils, SnackBarUtilityService, utilityService]
})

export class MastersModule { }
