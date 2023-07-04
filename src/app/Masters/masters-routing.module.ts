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
import { AddCityMasterComponent } from './City Master/add-city-master/add-city-master.component';
import { CityMasterListComponent } from './City Master/city-master-list/city-master-list.component';
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
// import { AddVendorMasterComponent } from './Vendor Master/add-vendor-master/add-vendor-master.component';
// import { VendorMasterListComponent } from './Vendor Master/vendor-master-list/vendor-master-list.component';

const routes: Routes = [
  { path: 'Docket/Create', component: CNoteGenerationComponent },
  { path: 'Docket/Ewaybill-Config', component: EwaybillConfigComponent },
  { path: 'Docket/Ewaybill', component: EwayBillDetailsComponent },
  { path: 'Docket/EwayBillDocketBooking', component: EwayBillDocketBookingComponent },
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
  { path: "CompanyMaster/AddCompany", component: AddCompanyComponent },
  { path: "CustomerMaster/CustomerMasterList", component: CustomerMasterListComponent },
  { path: "CustomerMaster/AddCustomerMaster", component: CustomerMasterAddComponent },
  { path: "CompanyMaster/AddCompany", component: AddCompanyComponent, },
  { path: "DocumentControlRegister/AddDCR", component: AddDcrSeriesComponent, },
  // { path: 'VendorMaster/VendorMasterList', component: VendorMasterListComponent },
  // { path: 'VendorMaster/AddVendorMaster', component: AddVendorMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


