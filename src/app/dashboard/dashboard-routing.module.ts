import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LoadPlanningComponent } from "./load-planning/load-planning.component";
import { DocketDashboardComponent } from './docket-dashboard/docket-dashboard.component';
const routes: Routes = [
  {
    path: "",
    redirectTo: "DocketDashboard",
    pathMatch: "full",
  },
  {
    path: "LoadPlanning",
    component: LoadPlanningComponent,
  },
  {
    path:"DocketDashboard",
    component:DocketDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
