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
  { path: "CityMaster/AddCity", component: AddCityMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


