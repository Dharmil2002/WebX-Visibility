import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GPSRuleComponent } from "./GPSRules/gpsrule/gpsrule.component";
import { AddGpsRuleComponent } from "./GPSRules/add-gps-rule/add-gps-rule.component";

const routes: Routes = [
  { path: "gps-rule", component: GPSRuleComponent },
  { path: "gps-rule/add-gps-rule", component: AddGpsRuleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
