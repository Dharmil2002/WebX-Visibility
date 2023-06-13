import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LoadPlanningComponent } from "./load-planning/load-planning.component";
import { DocketDashboardComponent } from './docket-dashboard/docket-dashboard.component';
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { PickupDeliveryPlannerComponent } from "./tabs/pickup-delivery-planner/pickup-delivery-planner.component";
import { ManageRunsheetComponent } from "./tabs/manage-runsheet/manage-runsheet.component";
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
  },
  {
    path:"GlobeDashboardPage",
    component:DashboardPageComponent
  },
  {
    path:"DeliveryPlanner",
    component:PickupDeliveryPlannerComponent
  },
  {
    path:"ManageRunsheet",
    component:ManageRunsheetComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
