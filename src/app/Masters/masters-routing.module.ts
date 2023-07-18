import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { EwaybillConfigComponent } from './ewaybill-config/ewaybill-config.component';
import { EwayBillDetailsComponent } from './eway-bill-details/eway-bill-details.component';
import { EwayBillDocketBookingComponent } from './eway-bill-docket-booking/eway-bill-docket-booking.component';
import { LoadingsheetComponent } from './loadingsheet/loadingsheet.component';
import { LoadingSheetDetailsComponent } from './loading-sheet-details/loading-sheet-details.component';
import { DispatchVehicleComponent } from './dispatch-vehicle/dispatch-vehicle.component';
import { ManifestGenerationComponent } from './manifest-generation/manifest-generation.component';
import { CompanygstmasterListComponent } from './Company GST Master/companygstmaster-list/companygstmaster-list.component';
import { AddStateMasterComponent } from './state-master/add-state-master/add-state-master.component';
import { StateMasterListComponent } from './state-master/state-master-list/state-master-list.component';
import { DriverMasterComponent } from './driver-master/driver-master.component';
import { AddDriverMasterComponent } from './driver-master/add-driver-master/add-driver-master.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { AddLocationMasterComponent } from './location-master/add-location-master/add-location-master.component';
import { AddCompanyComponent } from './Company Setup Master/add-company/add-company.component';
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
import { CityMasterListComponent } from './city-master/city-master-list/city-master-list.component';
import { AddCityMasterComponent } from './city-master/add-city-master/add-city-master.component';
import { AddVehicleMasterComponent } from './vehicle-master/add-vehicle-master/add-vehicle-master.component';
import { VehicleMasterListComponent } from './vehicle-master/vehicle-master-list/vehicle-master-list.component';
import { DcrDetailPageComponent } from './dcr-series/dcr-detail-page/dcr-detail-page.component';
import { SplitDcrComponent } from './dcr-series/split-dcr/split-dcr.component';
import { RouteMasterLocationWiseComponent } from './route-master-location-wise/route-master-location-wise-list/route-master-location-wise.component';
import { EwayBillDocketBookingV2Component } from './eway-bill-docket-booking-v2/eway-bill-docket-booking-v2t';
import { AddVendorMasterComponent } from './vendor-master/add-vendor-master/add-vendor-master.component';
import { VendorMasterListComponent } from './vendor-master/vendor-master-list/vendor-master-list.component';
import { RouteMasterLocationAddComponent } from './route-master-location-wise/route-master-location-add/route-master-location-add.component';

const routes: Routes = [
  { path: 'Docket/Create', component: CNoteGenerationComponent },
  { path: 'Docket/Ewaybill-Config', component: EwaybillConfigComponent },
  { path: 'Docket/Ewaybill', component: EwayBillDetailsComponent },
  { path: 'Docket/EwayBillDocketBooking', component: EwayBillDocketBookingComponent },
  { path: 'Docket/EwayBillDocketBookingV2', component: EwayBillDocketBookingV2Component },
  { path: 'Docket/LoadingSheet', component: LoadingsheetComponent },
  { path: 'Docket/LoadingSheetDetails', component: LoadingSheetDetailsComponent },
  { path: 'Docket/DispatchVehicle', component: DispatchVehicleComponent },
  { path: 'Docket/ManifestGeneration', component: ManifestGenerationComponent },
  { path: 'CompanyGSTMaster/CompanyGSTMasterList', component: CompanygstmasterListComponent },
  { path: "StateMaster/StateMasterView", component: StateMasterListComponent },
  { path: "StateMaster/AddState", component: AddStateMasterComponent },
  { path: "CityMaster/CityMasterView", component: CityMasterListComponent },
  { path: "CityMaster/AddCity", component: AddCityMasterComponent },
  { path: "DriverMaster/DriverMasterList", component: DriverMasterComponent },
  { path: "DriverMaster/AddDriverMaster", component: AddDriverMasterComponent },
  { path: "LocationMaster/LocationMasterList", component: LocationMasterComponent },
  { path: "LocationMaster/AddLocationMaster", component: AddLocationMasterComponent },
  { path: "CompanyMaster/AddCompany", component: AddCompanyComponent },
  { path: "CustomerMaster/CustomerMasterList", component: CustomerMasterListComponent },
  { path: "CustomerMaster/AddCustomerMaster", component: CustomerMasterAddComponent },
  { path: "DocumentControlRegister/AddDCR", component: AddDcrSeriesComponent },
  { path: "CustomerGroupMaster/CustomerGroupMasterList", component: CustomerGroupListComponent, },
  { path: "CustomerGroupMaster/AddCustomerGroupMaster", component: CustomerGroupAddComponent, },
  { path: "DocumentControlRegister/TrackDCR", component: TrackDcrSeriesComponent },
  { path: "DocumentControlRegister/DCRDetail", component: DcrDetailPageComponent },
  { path: "DocumentControlRegister/SplitDCR", component: SplitDcrComponent },
  { path: "VehicleTypeMaster/VehicleTypeMasterList", component: VehicletypeMasterListComponent },
  { path: "VehicleTypeMaster/AddVehicleTypeMaster", component: AddVehicletypeMasterComponent },
  { path: "PinCodeMaster/PinCodeMasterList", component: PincodeMasterListComponent },
  { path: "PinCodeMaster/AddPinCodeMaster", component: AddPinCodeMasterComponent },
  { path: "VehicleMaster/VehicleMasterList", component: VehicleMasterListComponent },
  { path: "VehicleMaster/AddVehicle", component: AddVehicleMasterComponent },
  { path: "RouteLocationWise/RouteList", component: RouteMasterLocationWiseComponent },
  { path: "RouteLocationWise/RouteAdd", component: RouteMasterLocationAddComponent },
  { path: "UserMaster/UserMasterView", component: UserMasterListComponent },
  { path: "UserMaster/AddUser", component: AddUserMasterComponent },
  { path: "VendorMaster/VendorMasterList", component: VendorMasterListComponent },
  { path: "VendorMaster/AddVendorMaster", component: AddVendorMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


