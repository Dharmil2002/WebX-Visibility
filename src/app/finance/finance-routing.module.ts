import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSummaryBillComponent } from './invoice-summary-bill/invoice-summary-bill.component';
import { AddManualVoucherComponent } from './manual voucher/add-manual-voucher/add-manual-voucher.component';
import { DashboardComponent } from './Vendor Payment/dashboard/dashboard.component';
import { ThcPaymentsComponent } from './Vendor Payment/thc-payments/thc-payments.component';
import { InvoiceCollectionComponent } from './invoice-collection/invoice-collection.component';
import { DeductionsComponent } from './deductions/deductions.component';
import { AdvancePaymentsComponent } from './Vendor Payment/advance-payments/advance-payments.component';
import { BalancePaymentComponent } from './Vendor Payment/balance-payment/balance-payment.component';
import { VendorBillPaymentComponent } from './Vendor Bills/vendor-bill-payment/vendor-bill-payment.component';
import { BillApprovalComponent } from '../operation/pending-billing/bill-approval/bill-approval.component';
import { VendorBillPaymentDetailsComponent } from './Vendor Bills/vendor-bill-payment-details/vendor-bill-payment-details.component';
import { JournalVoucherCreationComponent } from './VoucherEntry/Journal Voucher/journal-voucher-creation/journal-voucher-creation.component';
import { OpeningBalanceLedgerComponent } from './opening-balance-ledger/opening-balance-ledger.component';
import { ContraVoucherCreationComponent } from './VoucherEntry/Contra Voucher/contra-voucher-creation/contra-voucher-creation.component';
import { AdviceAcknowledgeComponent } from './Fund Transfer/advice-acknowledge/advice-acknowledge.component';
import { AdviceGenerationComponent } from './Fund Transfer/advice-generation/advice-generation.component';
import { DebitVoucherComponent } from './Debit Voucher/debit-voucher.component';
import { CreditVoucherComponent } from './credit-voucher/credit-voucher.component';
import { SetOpeningBalanceLedgerWiseComponent } from './FA Masters/Components/set-opening-balance-ledger-wise/set-opening-balance-ledger-wise.component';

const routes: Routes = [
  { path: 'InvoiceSummaryBill', component: InvoiceSummaryBillComponent },
  { path: 'AddManualVouchar', component: AddManualVoucherComponent },
  { path: 'VoucherEntry/DebitVoucher', component: DebitVoucherComponent },
  { path: 'VendorPayment/Dashboard', component: DashboardComponent },
  { path: 'VendorPayment/THC-Payment', component: ThcPaymentsComponent },
  { path: 'VendorPayment/AdvancePayment', component: AdvancePaymentsComponent },
  { path: 'VendorPayment/BalancePayment', component: BalancePaymentComponent },
  { path: 'VendorPayment/VendorBillPayment', component: VendorBillPaymentComponent },
  { path: 'VendorPayment/VendorBillPaymentDetails', component: VendorBillPaymentDetailsComponent },
  { path: 'InvoiceCollection', component: InvoiceCollectionComponent },
  { path: 'Deductions', component: DeductionsComponent },
  { path: "bill-approval", component: BillApprovalComponent },
  { path: 'VoucherEntry/JournalVoucher', component: JournalVoucherCreationComponent },
  { path: "opening-balance", component: OpeningBalanceLedgerComponent },
  { path: 'VoucherEntry/ContraVoucher', component: ContraVoucherCreationComponent },
  { path: 'FundTransfer/AdviceGeneration', component: AdviceGenerationComponent },
  { path: 'FundTransfer/AdviceAcknowledge', component: AdviceAcknowledgeComponent },
  { path: 'VoucherEntry/CreditVoucher', component: CreditVoucherComponent },
  { path: 'FAMasters/SetOpeningBalanceLedgerWise', component: SetOpeningBalanceLedgerWiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
