import { RouterModule, Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { DashboardLayoutComponent } from "./layout/app-layout/dashboard-layout/dashboard-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { NgModule } from "@angular/core";
import { Page404Component } from "./authentication/page404/page404.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { MsalGuard } from '@azure/msal-angular';
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,

    // canActivate: [AuthGuard],
    children: [
      // { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      { path: "", redirectTo: "/dashboard/DocketDashboard", pathMatch: "full" },
      {
        path: "dashboard",
        component: DashboardLayoutComponent,
        //canActivate: [MsalGuard],
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "UserMaster",
        //canActivate: [MsalGuard],
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
        //canActivate: [MsalGuard],
        loadChildren: () =>
          import("./Masters/masters.module").then((m) => m.MastersModule),
      },
      {
        path: "Operation",
        //canActivate: [MsalGuard],
        loadChildren: () =>
          import("./operation/operation.module").then((m) => m.OperationModule),
      }
      , {
        path: "Finance",
        //canActivate: [MsalGuard],
        loadChildren: () =>
          import("./finance/finance.module").then((m) => m.FinanceModule),
      },
    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    // //canActivate: [MsalGuard],
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
  {
    // Needed for hash routing
    path: 'error',
    redirectTo: 'dashboard',
  },
  {
    // Needed for hash routing
    path: 'state',
    redirectTo: 'dashboard',
  },
  {
    // Needed for hash routing
    path: 'code',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
