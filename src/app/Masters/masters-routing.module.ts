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
import { AirportMasterListComponent } from './airport-master/airport-master-list/airport-master-list.component';
import { AirportMasterAddComponent } from './airport-master/airport-master-add/airport-master-add.component';
import { PincodeLocationMappingComponent } from './pincode-to-location-mapping-master/pincode-location-list/pincode-to-location-mapping.component';
import { AddressMasterAddComponent } from './address-master/address-master-add/address-master-add.component';
import { AddressMasterListComponent } from './address-master/address-master-list/address-master-list.component';
import { ClusterMasterAddComponent } from './cluster-master/cluster-master-add/cluster-master-add.component';
import { ClusterMasterListComponent } from './cluster-master/cluster-master-list/cluster-master-list.component';
import { AddRouteScheduleMasterComponent } from './route-schedule-master/add-route-schedule-master/add-route-schedule-master.component';
import { RouteScheduleMasterListComponent } from './route-schedule-master/route-schedule-master-list/route-schedule-master-list.component';
import { TripRouteMasterListComponent } from './trip-route-master/trip-route-master-list/trip-route-master-list.component';
import { TripRouteMasterAddComponent } from './trip-route-master/trip-route-master-add/trip-route-master-add.component';
import { GeneralMasterListComponent } from './general-master/general-master-list/general-master-list.component';
import { GeneralMasterCodeListComponent } from './general-master/general-master-code-list/general-master-code-list.component';
import { GeneralMasterAddComponent } from './general-master/general-master-add/general-master-add.component';
import { VehicleStatusUpdateComponent } from './vehicle-status-update/vehicle-status-update-list/vehicle-status-update.component';
import { AddVehicleStatusUpdateComponent } from './vehicle-status-update/add-vehicle-status-update/add-vehicle-status-update.component';
import { AddEditHolidayComponent } from './holiday-master/add-edit-holiday-master/add-edit-holiday.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master-list/holiday-master-list.component';
import { CityLocationMappingMaster } from './city-location-mapping-master/city-location-master/city-to-location-mapping.component';
import { CompanygstmasterAddComponent } from './Company GST Master/companygstmaster-add/companygstmaster-add.component';
import { ContainerMasterListComponent } from './container-master/container-master-list/container-master-list.component';
import { AddContainerMasterComponent } from './container-master/add-container-master/add-container-master.component';
import { FleetMasterListComponent } from './fleet-master/fleet-master-list/fleet-master-list.component';
import { AddFleetMasterComponent } from './fleet-master/add-fleet-master/add-fleet-master.component';
import { CustomerContractListComponent } from './Customer Contract/customer-contract-list/customer-contract-list.component';
import { CustomerContractTabsIndexComponent } from './Customer Contract/customer-contract-tabs-index/customer-contract-tabs-index.component';
import { AddBeneficiaryMasterComponent } from './beneficiary-master/add-beneficiary-master/add-beneficiary-master.component';
import { BeneficiaryMasterListComponent } from './beneficiary-master/beneficiary-master-list/beneficiary-master-list.component';
import { ListProductComponent } from './product-master/list-product/list-product.component';
import { ShardProductComponent } from './product-master/shard-product/shard-product.component';
import { AccountMasterComponent } from './Account/Account Master/account-master/account-master.component';
import { AddAccountComponent } from './Account/Account Master/add-account/add-account.component';
import { VendorContractListComponent } from './vendor-contract/vendor-contract-list/vendor-contract-list.component';
import { VendorIndexComponent } from './vendor-contract/vendor-index/vendor-index.component';
import { SacMasterListComponent } from './sac-master/sac-master-list/sac-master-list.component';
import { AddSacMasterComponent } from './sac-master/add-sac-master/add-sac-master.component';
import { AddNewCustomerContractComponent } from './Customer Contract/add-new-customer-contract/add-new-customer-contract.component';


const routes: Routes = [
  { path: "SAC-HSNMaster/SAC-HSNView", component: SacMasterListComponent },
  { path: "SAC-HSNMaster/AddSAC-HSN", component: AddSacMasterComponent },
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
  { path: 'CompanyGSTMaster/AddCompanyGSTMaster', component: CompanygstmasterAddComponent },
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
  { path: "AirportMaster/AirportMasterList", component: AirportMasterListComponent },
  { path: "AirportMaster/AddAirportMaster", component: AirportMasterAddComponent },
  { path: "PincodeLocation/PincodeLocationMapping", component: PincodeLocationMappingComponent },
  { path: "AddressMaster/AddAddressMaster", component: AddressMasterAddComponent },
  { path: "AddressMaster/AddressMasterList", component: AddressMasterListComponent },
  { path: "ClusterMaster/AddClusterMaster", component: ClusterMasterAddComponent },
  { path: "ClusterMaster/ClusterMasterList", component: ClusterMasterListComponent },
  { path: "RouteScheduleMaster/RouteScheduleMasterList", component: RouteScheduleMasterListComponent },
  { path: "RouteScheduleMaster/AddRouteScheduleMaster", component: AddRouteScheduleMasterComponent },
  { path: "TripRouteMaster/TripRouteMasterList", component: TripRouteMasterListComponent },
  { path: "TripRouteMaster/TripRouteMasterAdd", component: TripRouteMasterAddComponent },
  { path: "GeneralMaster/GeneralMasterList", component: GeneralMasterListComponent },
  { path: "GeneralMaster/GeneralMasterCodeList", component: GeneralMasterCodeListComponent },
  { path: "GeneralMaster/AddGeneralMaster", component: GeneralMasterAddComponent },
  { path: "Vehicle/Status", component: VehicleStatusUpdateComponent },
  { path: "Vehicle/Status/Add", component: AddVehicleStatusUpdateComponent },
  { path: "HolidayMaster/HolidayMasterList", component: HolidayMasterComponent },
  { path: "HolidayMaster/AddHolidayMaster", component: AddEditHolidayComponent },
  { path: "CityLocationMapping/CityLocationIndex", component: CityLocationMappingMaster },
  { path: "ContainerMaster/ContainerMasterList", component: ContainerMasterListComponent },
  { path: "ContainerMaster/AddContainerMaster", component: AddContainerMasterComponent },
  { path: 'FleetMaster/FleetMasterList', component: FleetMasterListComponent },
  { path: 'FleetMaster/AddFleetMaster', component: AddFleetMasterComponent },
  { path: 'BeneficiaryMaster/BeneficiaryMasterList', component: BeneficiaryMasterListComponent },
  { path: 'BeneficiaryMaster/AddBeneficiaryMaster', component: AddBeneficiaryMasterComponent },

  // Customer Contract Router
  { path: "CustomerContract/CustomerContractList", component: CustomerContractListComponent },
  { path: "CustomerContract/CustomerIndex", component: CustomerContractTabsIndexComponent },
  { path: "CustomerContract/AddNewCustomerContract", component: AddNewCustomerContractComponent },



  //Product Master Router
  { path: "ProductMaster/ListProduct", component: ListProductComponent },
  { path: "ProductMaster/shardProductList", component: ShardProductComponent },

  //Account Master Router
  { path: "AccountMaster/AccountMasterList", component: AccountMasterComponent },
  { path: "AccountMaster/AddAccountMaster", component: AddAccountComponent },

  //Vendor Contract Router
  { path: "VendorContract/VendorContractList", component: VendorContractListComponent },
  { path: "VendorContract/VendorContractIndex", component: VendorIndexComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


