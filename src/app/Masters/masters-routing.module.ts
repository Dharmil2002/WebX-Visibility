import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { DktComponentComponent } from '../components/dkt-component/dkt-component.component';
import { EwaybillConfigComponent } from './ewaybill-config/ewaybill-config.component';
import { EwayBillDetailsComponent } from './eway-bill-details/eway-bill-details.component';
import { EwayBillDocketBookingComponent } from './eway-bill-docket-booking/eway-bill-docket-booking.component';
import { LoadingsheetComponent } from './loadingsheet/loadingsheet.component';

const routes: Routes = [
  {path:'Docket/Create',component:CNoteGenerationComponent},
  {path:'Docket/Ewaybill-Config',component:EwaybillConfigComponent},
  {path:'Docket/Ewaybill',component:EwayBillDetailsComponent},
  {path:'Docket/EwayBillDocketBooking',component:EwayBillDocketBookingComponent},
  {path:'Docket/LoadingSheet',component:LoadingsheetComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


