import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobQueryPageComponent } from './job-report/job-query-page/job-query-page.component';
import { CnoteBillMrReportComponent } from './cnote-bill-mr-report/cnote-bill-mr-report.component';
import { CnwGstRegisterComponent } from './cnw-gst-register/cnw-gst-register.component';


const routes: Routes = [
  { path: "job-query", component: JobQueryPageComponent },
  { path: "cnote-GST-register", component: CnwGstRegisterComponent },
  { path: "cnote-Bill-MR-Report", component: CnoteBillMrReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


