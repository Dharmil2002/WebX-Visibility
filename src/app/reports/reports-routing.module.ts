import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CnwGstRegisterComponent } from './cnw-gst-register/cnw-gst-register.component';
import {CnwGstRegisterComponent} from 'src/app/Reports/cnw-gst-register/cnw-gst-register.component';
import { JobQueryPageComponent } from 'src/app/Reports/job-report/job-query-page/job-query-page.component';

const routes: Routes = [
  { path: "job-query", component: JobQueryPageComponent },
  { path: "cnote-GST-register", component: CnwGstRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


