import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LoadPlanningComponent } from "./load-planning/load-planning.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "LoadPlanning",
    pathMatch: "full",
  },
  {
    path: "LoadPlanning",
    component: LoadPlanningComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
