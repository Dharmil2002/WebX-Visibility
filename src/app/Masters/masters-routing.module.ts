import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { DktComponentComponent } from '../components/dkt-component/dkt-component.component';
import { EwaybillConfigComponent } from './ewaybill-config/ewaybill-config.component';
import { EwayBillDetailsComponent } from './eway-bill-details/eway-bill-details.component';

const routes: Routes = [
  {path:'Docket/Create',component:CNoteGenerationComponent},
  {path:'Docket/Ewaybill-Config',component:EwaybillConfigComponent},
  {path:'Docket/Ewaybill',component:EwayBillDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


