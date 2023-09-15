import { RouterModule, Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { DashboardLayoutComponent } from "./layout/app-layout/dashboard-layout/dashboard-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { NgModule } from "@angular/core";
import { Page404Component } from "./authentication/page404/page404.component";

const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      {
        path: "dashboard",
        component: DashboardLayoutComponent,
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "UserMaster",
        loadChildren: () =>
          import("./Masters/masters.module").then((m) => m.MastersModule),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./icons/icons.module").then((m) => m.IconsModule),
      },

      {
        path: "Masters",
        loadChildren: () =>
          import("./Masters/masters.module").then((m) => m.MastersModule),
      },
      {
        path: "Operation",
        loadChildren: () =>
          import("./operation/operation.module").then((m) => m.OperationModule),
      }
      ,{
        path: "Finance",
        loadChildren: () =>
          import("./finance/finance.module").then((m)=>m.FinanceModule),
      },
    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
