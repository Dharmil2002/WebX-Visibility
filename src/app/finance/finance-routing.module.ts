import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSummaryBillComponent } from './invoice-summary-bill/invoice-summary-bill.component';

const routes: Routes = [
  { path: 'InvoiceSummaryBill', component: InvoiceSummaryBillComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
