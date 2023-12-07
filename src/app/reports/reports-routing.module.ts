import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobQueryPageComponent } from './job-report/job-query-page/job-query-page.component';


const routes: Routes = [
  { path: "job-query", component: JobQueryPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


