import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPrintTemplateComponent } from './view-print-template/view-print-template.component';

const routes: Routes = [
  {
    path: "ViewPrintTemplate",
    component: ViewPrintTemplateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewPrintConfigurationRoutingModule { }
