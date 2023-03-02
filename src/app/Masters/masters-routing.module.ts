import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { DktComponentComponent } from '../components/dkt-component/dkt-component.component';

const routes: Routes = [
  {path:'Docket/Create',component:CNoteGenerationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }


