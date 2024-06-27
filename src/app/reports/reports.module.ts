import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTableModule } from '@angular/material/table';
import { jsonDataServiceService } from '../core/service/Utility/json-data-service.service';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from '../Utility/SnackBarUtility.service';
import { utilityService } from '../Utility/utility.service';
import { SessionService } from '../core/service/session.service';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EncryptionService } from '../core/service/encryptionService.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { JobQueryPageComponent } from './job-report/job-query-page/job-query-page.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CnwGstRegisterComponent } from './cnw-gst-register/cnw-gst-register.component';
import { CnoteBillMrReportComponent } from './cnote-bill-mr-report/cnote-bill-mr-report.component';
import { SalesRegisterAdvancedComponent } from './sales-register-advanced/sales-register-advanced.component';
import { VendorWiseGstInvoiceRegisterComponent } from './vendor-wise-gst-invoice-register/vendor-wise-gst-invoice-register.component';
import { CustomerWiseGstInvoiceComponent } from './customer-wise-gst-invoice/customer-wise-gst-invoice.component';
import { UnbillRegisterComponent } from './unbill-register/unbill-register.component';
import { CustomerOutstandingReportComponent } from './customer-outstanding-report/customer-outstanding-report.component';
import { VendorOutstandingReportComponent } from './vendor-outstanding-report/vendor-outstanding-report.component';
import { GeneralLedgerReportComponent } from './general-ledger-report/general-ledger-report.component';
import { PrqRegisterReportComponent } from './prq-register-report/prq-register-report.component';
import { VoucherRegisterReportComponent } from './voucher-register-report/voucher-register-report.component';
import { ChequeRegisterComponent } from './cheque-register/cheque-register.component';
import { CashBankBookReportComponent } from './cash-bank-book-report/cash-bank-book-report.component';
import { ProfitAndLossCriteriaComponent } from './Account Report/Components/ProfitAndLoss/profit-and-loss-criteria/profit-and-loss-criteria.component';
import { ProfitAndLossViewComponent } from './Account Report/Components/ProfitAndLoss/profit-and-loss-view/profit-and-loss-view.component';
import { ProfitAndLossViewDetailsComponent } from './Account Report/Components/ProfitAndLoss/profit-and-loss-view-details/profit-and-loss-view-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlTowerDashboardComponent } from './control-tower-dashboard/control-tower-dashboard.component';
import { TrialBalanceCriteriaComponent } from './Account Report/Components/TrialBalance/trial-balance-criteria/trial-balance-criteria.component';
import { TrialBalanceViewComponent } from './Account Report/Components/TrialBalance/trial-balance-view/trial-balance-view.component';
import { TrialBalanceViewDetailsComponent } from './Account Report/Components/TrialBalance/trial-balance-view-details/trial-balance-view-details.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { DcrRegisterComponent } from './dcr-register/dcr-register.component';
import { BalanceSheetViewComponent } from './Account Report/Components/BalanceSheet/balance-sheet-view/balance-sheet-view.component';
import { BalanceSheetCriteriaComponent } from './Account Report/Components/BalanceSheet/balance-sheet-criteria/balance-sheet-criteria.component';
import { MRRegisterReportComponent } from './mr-register-report/mrregister-report.component';
import { CustomerInvoiceRegisterComponent } from './customer-invoice-register/customer-invoice-register.component';
import { VolumetricShipmentRegisterComponent } from './volumetric-shipment-register/volumetric-shipment-register.component';
import { ThcRegisterReportComponent } from './thc-register-report/thc-register-report.component';
import { DrsRegisterComponent } from './drs-register/drs-register.component';
import { ManifestRegisterReportComponent } from './manifest-register-report/manifest-register-report.component';
import { LoadingsheetRegisterComponent } from './loadingsheet-register/loadingsheet-register.component';
import { GenerateTdsRegisterReportComponent } from './generate-tds-register-report/generate-tds-register-report.component';
import { GenericReportViewComponent } from './generic-report-view/generic-report-view.component';
import { CreditNoteRegisterReportComponent } from './credit-note-register-report/credit-note-register-report.component';
import { DebitNoteRegisterReportComponent } from './debit-note-register-report/debit-note-register-report.component';
import { BalanceSheetViewDetailsComponent } from './Account Report/Components/BalanceSheet/balance-sheet-view-details/balance-sheet-view-details.component';
import { ProfitAndLossViewDetailsVouchersListComponent } from './Account Report/Components/ProfitAndLoss/profit-and-loss-view-details-vouchers-list/profit-and-loss-view-details-vouchers-list.component';
import { AdviceRegisterComponent } from './advice-register/advice-register.component';
import { ToPayPaidButNotCollectedRegisterReportComponent } from './to-pay-paid-but-not-collected-register-report/to-pay-paid-but-not-collected-register-report.component';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatIconModule,
    NgbModule,
    MatTreeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule, SharedComponentsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatStepperModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    TableVirtualScrollModule,
    ScrollingModule,
    MatSidenavModule,
    NgIf
  ],

  declarations: [
    PrqRegisterReportComponent,
    JobQueryPageComponent,
    CnwGstRegisterComponent,
    CnoteBillMrReportComponent,
    SalesRegisterAdvancedComponent,
    VendorWiseGstInvoiceRegisterComponent,
    CustomerWiseGstInvoiceComponent,
    UnbillRegisterComponent,
    CustomerOutstandingReportComponent,
    VendorOutstandingReportComponent,
    GeneralLedgerReportComponent,
    VoucherRegisterReportComponent,
    ChequeRegisterComponent,
    CashBankBookReportComponent,
    ProfitAndLossCriteriaComponent,
    ProfitAndLossViewComponent,
    ProfitAndLossViewDetailsComponent,
    DashboardComponent,
    ControlTowerDashboardComponent,
    TrialBalanceCriteriaComponent,
    TrialBalanceViewComponent,
    TrialBalanceViewDetailsComponent,
    StockReportComponent,
    DcrRegisterComponent,
    BalanceSheetViewComponent,
    BalanceSheetCriteriaComponent,
    MRRegisterReportComponent,
    CustomerInvoiceRegisterComponent,
    VolumetricShipmentRegisterComponent,
    ThcRegisterReportComponent,
    DrsRegisterComponent,
    ManifestRegisterReportComponent,
    LoadingsheetRegisterComponent,
    GenerateTdsRegisterReportComponent,
    GenericReportViewComponent,
    CreditNoteRegisterReportComponent,
    DebitNoteRegisterReportComponent,
    BalanceSheetViewDetailsComponent,
    ProfitAndLossViewDetailsVouchersListComponent,
    AdviceRegisterComponent,
    ToPayPaidButNotCollectedRegisterReportComponent,
  ],
  exports: [],

  providers: [
    DatePipe, 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, 
    { provide: MAT_DIALOG_DATA, useValue: {} }, 
    jsonDataServiceService, 
    FilterUtils, 
    SnackBarUtilityService, 
    utilityService, 
    SessionService, 
    EncryptionService
  ]
})

export class ReportsModule { }
