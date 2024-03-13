import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DocketDashboardComponent } from './docket-dashboard/docket-dashboard.component';
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { PickupDeliveryPlannerComponent } from "./tabs/pickup-delivery-planner/pickup-delivery-planner.component";
import { ManageRunsheetComponent } from "./tabs/manage-runsheet/manage-runsheet.component";
import { StocksComponent } from "./stocks/stocks.component";
import { UpdateStockComponent } from "./ActionPages/update-stock/update-stock.component";
import { JobTrackerComponent } from "./tabs/job-tracker/job-tracker.component";
import { AddDeliveryMrGenerationComponent } from "./tabs/Delivery MR Generation/add-delivery-mr-generation/add-delivery-mr-generation.component";
import { DeliveryMrResponseModalComponent } from "./tabs/Delivery MR Generation/delivery-mr-response-modal/delivery-mr-response-modal.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "DocketDashboard",
    pathMatch: "full",
  },
  {
    path:"DocketDashboard",
    component:DocketDashboardComponent
  },
  {
    path:"Index",
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
  {
    path:"DocketStock",
    component:StocksComponent
  },
  {
    path:"updateStock",
    component:UpdateStockComponent
  },
  {
    path:"JobTracker",
    component:JobTrackerComponent
  },
  {
    path:"DeliveryMrGeneration",
    component:AddDeliveryMrGenerationComponent
  },
  {
    path:"DeliveryMrGeneration/Result",
    component:DeliveryMrResponseModalComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
