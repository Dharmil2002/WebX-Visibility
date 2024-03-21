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

import { ProfitAndLossCriteriaComponent } from './Account Report/Components/profit-and-loss-criteria/profit-and-loss-criteria.component';
import { ProfitAndLossViewComponent } from './Account Report/Components/profit-and-loss-view/profit-and-loss-view.component';
import { ProfitAndLossViewDetailsComponent } from './Account Report/Components/profit-and-loss-view-details/profit-and-loss-view-details.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlTowerDashboardComponent } from './control-tower-dashboard/control-tower-dashboard.component';


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
  { path: "Dashboard", component: DashboardComponent },
  { path: "ControlTower", component: ControlTowerDashboardComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


