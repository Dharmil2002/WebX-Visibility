import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSummaryBillComponent } from './invoice-summary-bill/invoice-summary-bill.component';
import { AddManualVoucherComponent } from './manual voucher/add-manual-voucher/add-manual-voucher.component';
import { DebitVoucherComponent } from './credit-debit-voucher/credit-debit-voucher.component';
import { DashboardComponent } from './Vendor Payment/dashboard/dashboard.component';
import { ThcPaymentsComponent } from './Vendor Payment/thc-payments/thc-payments.component';
import { InvoiceCollectionComponent } from './invoice-collection/invoice-collection.component';
import { DeductionsComponent } from './deductions/deductions.component';
import { AdvancePaymentsComponent } from './Vendor Payment/advance-payments/advance-payments.component';
import { BalancePaymentComponent } from './Vendor Payment/balance-payment/balance-payment.component';
import { VendorBillPaymentComponent } from './Vendor Bills/vendor-bill-payment/vendor-bill-payment.component';

const routes: Routes = [
  { path: 'InvoiceSummaryBill', component: InvoiceSummaryBillComponent },
  { path: 'AddManualVouchar', component: AddManualVoucherComponent },
  { path: 'DebitVoucher', component: DebitVoucherComponent },
  { path: 'VendorPayment/Dashboard', component: DashboardComponent },
  { path: 'VendorPayment/THC-Payment', component: ThcPaymentsComponent },
  { path: 'VendorPayment/AdvancePayment', component: AdvancePaymentsComponent },
  { path: 'VendorPayment/BalancePayment', component: BalancePaymentComponent },
  { path: 'VendorPayment/VendorBillPayment', component: VendorBillPaymentComponent },
  { path: 'InvoiceCollection', component: InvoiceCollectionComponent },
  { path: 'Deductions', component: DeductionsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
