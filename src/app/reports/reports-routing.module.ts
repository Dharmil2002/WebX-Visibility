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


const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


