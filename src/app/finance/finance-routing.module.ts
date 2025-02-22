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
import { AddCreditNoteGenerationComponent } from './Credit Note/add-credit-note-generation/add-credit-note-generation.component';
import { GeneralBillCriteriaComponent } from './Vendor Bills/VendorGeneralBill/general-bill-criteria/general-bill-criteria.component';
import { GeneralBillDetailComponent } from './Vendor Bills/VendorGeneralBill/general-bill-detail/general-bill-detail.component';
import { GeneralInvoiceCriteriaComponent } from './Customer General Invoice/general-invoice-criteria/general-invoice-criteria.component';
import { GenerateDebitNoteComponent } from './Debit-Note/generate-debit-note/generate-debit-note/generate-debit-note.component';
import { ApproveDebitNoteComponent } from './Debit-Note/approve-debit-note/approve-debit-note/approve-debit-note.component';
import { DebitNoteDetailsComponent } from './Debit-Note/debit-note-details/debit-note-details/debit-note-details.component';
import { SetOpeningBalanceVendorWiseComponent } from './FA Masters/Components/set-opening-balance-vendor-wise/set-opening-balance-vendor-wise.component';
import { POServiceComponent } from './po-service/po-service.component';
import { TdsPaymentsComponent } from './Vendor Payment/tds-payments/tds-payments.component';
import { VendorwiseTdspaymentsComponent } from './Vendor Payment/vendorwise-tdspayments/vendorwise-tdspayments.component';

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
  { path: 'CreditNote', component: AddCreditNoteGenerationComponent },
  { path: 'VendorBillGeneration/Criteria', component: GeneralBillCriteriaComponent },
  { path: 'VendorBillGeneration/Details', component: GeneralBillDetailComponent },
  { path: 'CustomerInvoiceGeneral/Criteria', component: GeneralInvoiceCriteriaComponent },
  { path: 'DebitNote/GenerateDebitNote', component: GenerateDebitNoteComponent },
  { path: 'DebitNote/ApproveDebitNote', component: ApproveDebitNoteComponent },
  { path: 'DebitNote/DebitNoteDetails', component: DebitNoteDetailsComponent },
  { path: 'FAMasters/SetOpeningBalanceVendorWise', component: SetOpeningBalanceVendorWiseComponent },
  { path: 'POService', component: POServiceComponent },
  { path: 'VendorPayment/TDS-Payment', component: TdsPaymentsComponent },
  { path: 'VendorPayment/Vendor-TdsPayment', component: VendorwiseTdspaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
