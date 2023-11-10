import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewPrintConfigurationRoutingModule } from './view-print-configuration-routing.module';
import { ViewPrintTemplateComponent } from './view-print-template/view-print-template.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxPrintModule } from 'ngx-print';
import { MastersModule } from '../Masters/masters.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    ViewPrintTemplateComponent,
  ],
  imports: [
    CommonModule,
    ViewPrintConfigurationRoutingModule,
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
    MatSnackBarModule,
    MatSlideToggleModule,
    MastersModule,
    NgxPrintModule,
    AngularEditorModule
  ]
})
export class ViewPrintConfigurationModule { }
