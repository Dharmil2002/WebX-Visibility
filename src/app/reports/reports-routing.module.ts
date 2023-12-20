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


const routes: Routes = [
  { path: "job-query", component: JobQueryPageComponent },
  { path: "cnote-GST-register", component: CnwGstRegisterComponent },
  { path: "cnote-Bill-MR-Report", component: CnoteBillMrReportComponent },
  { path: "sales-register-report", component: SalesRegisterAdvancedComponent },
  { path: "vendor-wise-gst-invoice-register-report", component: VendorWiseGstInvoiceRegisterComponent },
  { path: "customer-wise-gst-invoice-register-report", component: CustomerWiseGstInvoiceComponent },
  { path: "unbilled-register-report", component: UnbillRegisterComponent },
  { path: "customer-outstanding-report", component: CustomerOutstandingReportComponent },
  { path: "vendor-wise-outstanding-report", component: VendorOutstandingReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


