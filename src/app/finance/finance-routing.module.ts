import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualVoucherComponent } from './manual-voucher/manual-voucher.component';

const routes: Routes = [
  { path: 'finance/manualvouchar', component: ManualVoucherComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
