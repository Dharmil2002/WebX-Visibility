import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from "ngx-perfect-scrollbar";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ClickOutsideModule } from "ng-click-outside";
import { CoreModule } from "./core/core.module";
import { DashboardLayoutComponent } from "./layout/app-layout/dashboard-layout/dashboard-layout.component";
import { ErrorInterceptor } from "./core/interceptor/error.interceptor";
import { HeaderComponent } from "./layout/header/header.component";
import { JwtInterceptor } from "./core/interceptor/jwt.interceptor";
import { JwtModule } from "@auth0/angular-jwt";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { MatSelectModule } from "@angular/material/select";
import { NgModule } from "@angular/core";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { PageLoaderComponent } from "./layout/page-loader/page-loader.component";
import { RightSidebarComponent } from "./layout/right-sidebar/right-sidebar.component";
import { SharedModule } from "./shared/shared.module";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { WINDOW_PROVIDERS } from "./core/service/window.service";
import { environment } from "src/environments/environment";
import { fakeBackendProvider } from "./core/interceptor/fake-backend";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomHttpInterceptor } from "./core/interceptor/errorhandling.interceptor";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    DashboardLayoutComponent
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxMatSelectSearchModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgxDaterangepickerMd.forRoot(),
    NgxSpinnerModule,MatDialogModule,
    ClickOutsideModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    CoreModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (request) => {
          return localStorage.getItem("auth-token");
        },
        disallowedRoutes: [environment.AuthAPIGetway + "RefreshToken"],
      },
    }),
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
