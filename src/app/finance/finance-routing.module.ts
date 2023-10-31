import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSummaryBillComponent } from './invoice-summary-bill/invoice-summary-bill.component';
import { AddManualVoucherComponent } from './manual voucher/add-manual-voucher/add-manual-voucher.component';
import { DebitVoucherComponent } from './credit-debit-voucher/credit-debit-voucher.component';

const routes: Routes = [
  { path: 'InvoiceSummaryBill', component: InvoiceSummaryBillComponent },
  { path: 'AddManualVouchar', component: AddManualVoucherComponent },
  { path: 'DebitVoucher', component: DebitVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
