import { NgModule } from "@angular/core";
import { LoadingSheetViewComponent } from "./loading-sheet-view/loading-sheet-view.component";
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
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { LodingSheetGenerateSuccessComponent } from './loding-sheet-generate-success/loding-sheet-generate-success.component';
@NgModule({
  declarations: [
    CreateLoadingSheetComponent,
    LodingSheetGenerateSuccessComponent
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
  providers: [SnackBarUtilityService, DatePipe, FilterUtils],
  exports: []
})
export class OperationModule { }
