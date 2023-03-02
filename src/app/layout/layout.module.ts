import { AuthLayoutComponent } from "./app-layout/auth-layout/auth-layout.component";
import { CommonModule } from "@angular/common";
import { MainLayoutComponent } from "./app-layout/main-layout/main-layout.component";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared/shared.module";
import { DashboardLayoutComponent } from "./app-layout/dashboard-layout/dashboard-layout.component";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MatTabsModule,
    SharedModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    DashboardLayoutComponent
  ],
})
export class LayoutModule {}
