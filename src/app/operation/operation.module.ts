import { NgModule } from "@angular/core";
import { SnackBarUtilityService } from "../Utility/SnackBarUtility.service";
import { CommonModule, DatePipe } from "@angular/common";
import { OperationRoutingModule } from "./operation-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableExporterModule } from "mat-table-exporter";
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { ComponentsModule } from "../shared/components/components.module";
import { SharedModule } from "../shared/shared.module";
import { CreateLoadingSheetComponent } from './create-loading-sheet/create-loading-sheet.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LodingSheetGenerateSuccessComponent } from './loding-sheet-generate-success/loding-sheet-generate-success.component';
import { DepartVehicleComponent } from "./depart-vehicle/depart-vehicle/depart-vehicle.component";
import { ManifestGeneratedComponent } from "./manifest-generated/manifest-generated/manifest-generated.component";
import { RunsheetGeneratedComponent } from "./runsheet-generated/runsheet-generated/runsheet-generated.component";
import { UpdateLoadingSheetComponent } from "./update-loading-sheet/update-loading-sheet.component";
import { CreateRunSheetComponent } from './create-run-sheet/create-run-sheet.component';
import { UpdateRunSheetComponent } from './update-run-sheet/update-run-sheet.component';
import { VehicleLoadingComponent } from "./vehicle-loading/vehicle-loading.component";
import { ViewPrintComponent } from './view-print/view-print.component';
import { VehicleUpdateUploadComponent } from "./vehicle-update-upload/vehicle-update-upload.component";
import { OperationService } from "../core/service/operations/operation.service";
import { NavigationService } from "../Utility/commonFunction/route/route";
@NgModule({
  declarations: [
    VehicleLoadingComponent,
    UpdateRunSheetComponent,
    CreateRunSheetComponent,
    UpdateLoadingSheetComponent,
    RunsheetGeneratedComponent,
    ManifestGeneratedComponent,
    DepartVehicleComponent,
    LodingSheetGenerateSuccessComponent,
    CreateLoadingSheetComponent,
    ViewPrintComponent,
    VehicleUpdateUploadComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    ComponentsModule,
    SharedModule,
    MatPaginatorModule,
    CdkTableModule,
    MatTableModule,
    MatSortModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    SharedComponentsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [SnackBarUtilityService,OperationService,NavigationService,DatePipe,MatDialogModule ],
  exports: []
})
export class OperationModule { }
