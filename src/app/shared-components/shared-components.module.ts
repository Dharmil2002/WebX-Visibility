import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericAccordionComponent } from './Generic Accordion/generic-accordion.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTreeModule } from '@angular/material/tree';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from "@angular/material/table";
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from '../shared/shared.module';
import { FormComponent } from './FormFields/form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormWithoutAutoCompleteComponent } from './form-without-auto-complete/form-without-auto-complete.component';
import { GenericDashBoardComponent } from './generic-dash-board/generic-dash-board.component';
import { GenericTabbedFormComponent } from './generic-tabbed-form/generic-tabbed-form.component';
import { CommonWrapperComponent } from './wrappers/common-wrapper/table-wrapper.component';
import { ComponentsModule } from '../shared/components/components.module';
import { EditAbleTableComponent } from './edit-able-table/edit-able-table.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatMenuModule } from '@angular/material/menu';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GenericChartDashboardComponent } from './generic-chart-dashboard/generic-chart-dashboard.component';
import { GenericCardComponent } from './generic-card/generic-card.component';
import { DecimaRangeValidatorDirective } from '../core/Directives/decimal-range-validator';
import { MatTabsModule } from '@angular/material/tabs';
import { GenericTableComponent } from './Generic Table/generic-table.component';
import { FilterUtils } from '../Utility/Form Utilities/dropdownFilter';
import { MatRadioModule } from '@angular/material/radio';
import { GenericTableV2Component } from './Generic Table V2/generic-table-v2/generic-table-v2.component';
import { ExpandableTableComponent } from './expandable-table/expandable-table/expandable-table.component';
import { ModifyTableCollumnsComponent } from './modify-table-collumns/modify-table-collumns.component';
import { XlsxPreviewPageComponent } from './xlsx-preview-page/xlsx-preview-page.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GenericViewPrintComponent } from './Generic View Print/generic-view-print.component';
import { LazyloadingeditabletableComponent } from './lazyloadingeditabletable/lazyloadingeditabletable.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ImageHandling } from '../Utility/Form Utilities/imageHandling';
import { NgxPrintModule } from "ngx-print";
import { MatDialogModule } from '@angular/material/dialog';
import { GenericViewTableComponent } from './generic-view-table/generic-view-table.component';
import { GenericCardWithMenuActionsComponent } from './generic-card-with-menu-actions/generic-card-with-menu-actions.component';
import { GenericBulkUploadComponent } from './generic-bulk-upload/generic-bulk-upload.component';
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [GenericAccordionComponent, GenericTableComponent,
    FormComponent, FormWithoutAutoCompleteComponent, GenericDashBoardComponent,
    GenericTabbedFormComponent, CommonWrapperComponent, EditAbleTableComponent, TreeViewComponent, GenericChartDashboardComponent, GenericCardComponent, DecimaRangeValidatorDirective, GenericTableV2Component
    , ExpandableTableComponent, ModifyTableCollumnsComponent, LazyloadingeditabletableComponent, XlsxPreviewPageComponent, GenericViewPrintComponent,
    ImagePreviewComponent,
    GenericViewTableComponent,
    GenericCardWithMenuActionsComponent,
    GenericBulkUploadComponent],

  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    NgApexchartsModule,
    chartjsModule,
    MatSortModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    ComponentsModule,
    MatNativeDateModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    MatTreeModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTabsModule,
    MatRadioModule,
    MatTableExporterModule,
    DragDropModule,
    TableVirtualScrollModule,
    ScrollingModule,
    NgxPrintModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],

    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN' },
    FilterUtils, ImageHandling
  ],

  exports: [GenericAccordionComponent,
    GenericTableComponent,
    FormComponent,
    CommonWrapperComponent,
    GenericDashBoardComponent,
    MatSortModule,
    GenericTabbedFormComponent,
    NgxMatSelectSearchModule,
    FormWithoutAutoCompleteComponent,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    EditAbleTableComponent,
    TreeViewComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMenuModule,
    GenericCardWithMenuActionsComponent,
    GenericChartDashboardComponent,
    GenericCardComponent,
    DecimaRangeValidatorDirective,
    GenericTableV2Component,
    GenericViewPrintComponent,
    LazyloadingeditabletableComponent,
    ImagePreviewComponent,
    GenericBulkUploadComponent
  ],

})
export class SharedComponentsModule { }

