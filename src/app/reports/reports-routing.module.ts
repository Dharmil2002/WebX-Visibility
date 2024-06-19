import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobQueryPageComponent } from './job-report/job-query-page/job-query-page.component';
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
import { BalanceSheetCriteriaComponent } from './Account Report/Components/BalanceSheet/balance-sheet-criteria/balance-sheet-criteria.component';
import { BalanceSheetViewComponent } from './Account Report/Components/BalanceSheet/balance-sheet-view/balance-sheet-view.component';
import { MRRegisterReportComponent } from './mr-register-report/mrregister-report.component';
import { CustomerInvoiceRegisterComponent } from './customer-invoice-register/customer-invoice-register.component';
import { VolumetricShipmentRegisterComponent } from './volumetric-shipment-register/volumetric-shipment-register.component';

import { ThcRegisterReportComponent } from './thc-register-report/thc-register-report.component';
import { DrsRegisterComponent } from './drs-register/drs-register.component';
import { ManifestRegisterReportComponent } from './manifest-register-report/manifest-register-report.component'
import { LoadingsheetRegisterComponent } from './loadingsheet-register/loadingsheet-register.component';
import { GenerateTdsRegisterReportComponent } from './generate-tds-register-report/generate-tds-register-report.component';
import { GenericReportViewComponent } from './generic-report-view/generic-report-view.component';
import { CreditNoteRegisterReportComponent } from './credit-note-register-report/credit-note-register-report.component';
import { DebitNoteRegisterReportComponent } from './debit-note-register-report/debit-note-register-report.component';
import { BalanceSheetViewDetailsComponent } from './Account Report/Components/BalanceSheet/balance-sheet-view-details/balance-sheet-view-details.component';
import { ProfitAndLossViewDetailsVouchersListComponent } from './Account Report/Components/ProfitAndLoss/profit-and-loss-view-details-vouchers-list/profit-and-loss-view-details-vouchers-list.component';
import { AdviceRegisterComponent } from './advice-register/advice-register.component';

const routes: Routes = [
  { path: "Cash-Bank-Book-Report", component: CashBankBookReportComponent },
  { path: "Voucher-Register-report", component: VoucherRegisterReportComponent },
  { path: "PRQ-Register-report", component: PrqRegisterReportComponent },
  { path: "job-query", component: JobQueryPageComponent },
  { path: "cnote-GST-register", component: CnwGstRegisterComponent },
  { path: "cnote-Bill-MR-Report", component: CnoteBillMrReportComponent },
  { path: "sales-register-report", component: SalesRegisterAdvancedComponent },
  { path: "vendor-wise-gst-invoice-register-report", component: VendorWiseGstInvoiceRegisterComponent },
  { path: "customer-wise-gst-invoice-register-report", component: CustomerWiseGstInvoiceComponent },
  { path: "unbilled-register-report", component: UnbillRegisterComponent },
  { path: "customer-outstanding-report", component: CustomerOutstandingReportComponent },
  { path: "vendor-wise-outstanding-report", component: VendorOutstandingReportComponent },
  { path: "General-ledger-report", component: GeneralLedgerReportComponent },
  { path: "Cheque-Register-Report", component: ChequeRegisterComponent },
  { path: "AccountReport/ProfitAndLoss", component: ProfitAndLossCriteriaComponent },
  { path: "AccountReport/ProfitAndLossview", component: ProfitAndLossViewComponent },
  { path: "AccountReport/ProfitAndLossviewdetails", component: ProfitAndLossViewDetailsComponent },
  { path: "AccountReport/ProfitAndLossviewdetailsvouchersList", component: ProfitAndLossViewDetailsVouchersListComponent },
  { path: "Dashboard", component: DashboardComponent },
  { path: "ControlTower", component: ControlTowerDashboardComponent },
  { path: "AccountReport/TrialBalance", component: TrialBalanceCriteriaComponent },
  { path: "AccountReport/TrialBalanceview", component: TrialBalanceViewComponent },
  { path: "AccountReport/TrialBalanceviewdetails", component: TrialBalanceViewDetailsComponent },
  { path: "stock-report", component: StockReportComponent },
  { path: "DCRRegister", component: DcrRegisterComponent },
  { path: "AccountReport/BalanceSheet", component: BalanceSheetCriteriaComponent },
  { path: "AccountReport/BalanceSheetview", component: BalanceSheetViewComponent },
  { path: "AccountReport/BalanceSheetviewdetails", component: BalanceSheetViewDetailsComponent },
  { path: "MR-Register-Report", component: MRRegisterReportComponent },
  { path: "CustomerInvoiceRegister", component: CustomerInvoiceRegisterComponent },
  { path: "Volumetric-Shipment-Register-Report", component: VolumetricShipmentRegisterComponent },
  { path: "THC-Register-report", component: ThcRegisterReportComponent },
  { path: "DRS-Register-report", component: DrsRegisterComponent },
  { path: "manifest-register-report", component: ManifestRegisterReportComponent },
  { path: "LoadingsheetRegister", component: LoadingsheetRegisterComponent },
  { path: "TDSRegister", component: GenerateTdsRegisterReportComponent },
  { path: "generic-report-view", component: GenericReportViewComponent },
  { path: "credit-note-register-report", component: CreditNoteRegisterReportComponent },
  { path: "debit-note-register-report", component: DebitNoteRegisterReportComponent },
  { path: "advice-register-report", component: AdviceRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


