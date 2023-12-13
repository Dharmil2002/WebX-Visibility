import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FinanceRoutingModule } from './finance-routing.module';
import { InvoiceSummaryBillComponent } from './invoice-summary-bill/invoice-summary-bill.component';
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { MastersRoutingModule } from '../Masters/masters-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { SnackBarUtilityService } from '../Utility/SnackBarUtility.service';
import { NavigationService } from '../Utility/commonFunction/route/route';
import { utilityService } from '../Utility/utility.service';
import { OperationService } from '../core/service/operations/operation.service';
import { AssignVehiclePageMethods } from '../operation/assign-vehicle-page/assgine-vehicle-utility';
import { AddManualVoucherComponent } from './manual voucher/add-manual-voucher/add-manual-voucher.component';
import { FilterUtils } from "../Utility/dropdownFilter";
import { VoucherServicesService } from '../core/service/Finance/voucher-services.service';
import { AddVoucherDetailsModalComponent } from './Modals/add-voucher-details-modal/add-voucher-details-modal.component';
import { AddDebitAgainstDocumentModalComponent } from './Modals/add-debit-against-document-modal/add-debit-against-document-modal.component';
import { AddDetailsDebitAgainstDocumentModalComponent } from './Modals/add-details-debit-against-document-modal/add-details-debit-against-document-modal.component';
import { DebitVoucherComponent } from './credit-debit-voucher/credit-debit-voucher.component';
import { DebitVoucherPreviewComponent } from './Modals/debit-voucher-preview/debit-voucher-preview.component';
import { DashboardComponent } from './Vendor Payment/dashboard/dashboard.component';
import { ThcPaymentsComponent } from './Vendor Payment/thc-payments/thc-payments.component';
import { ThcPaymentFilterComponent } from './Vendor Payment/Modal/thc-payment-filter/thc-payment-filter.component';
import { InvoiceCollectionComponent } from './invoice-collection/invoice-collection.component';
import { DeductionsComponent } from './deductions/deductions.component';
import { THCAmountsDetailComponent } from './Vendor Payment/Modal/thcamounts-detail/thcamounts-detail.component';
import { AdvancePaymentsComponent } from './Vendor Payment/advance-payments/advance-payments.component';
import { BalancePaymentComponent } from './Vendor Payment/balance-payment/balance-payment.component';
import { VendorBillPaymentComponent } from './Vendor Bills/vendor-bill-payment/vendor-bill-payment.component';
import { VendorBillListComponent } from './Vendor Bills/vendor-bill-payment/Tabs/vendor-bill-list/vendor-bill-list.component';
import { VendorBillFilterComponent } from './Vendor Bills/vendor-bill-payment/Tabs/vendor-bill-list/vendor-bill-filter/vendor-bill-filter.component';
import { BlancePaymentPopupComponent } from './Vendor Payment/blance-payment-popup/blance-payment-popup.component';
import { VendorBillPaymentDetailsComponent } from './Vendor Bill Payment/vendor-bill-payment-details/vendor-bill-payment-details.component';
import { OnlinePaymentApprovalComponent } from './Vendor Bills/vendor-bill-payment/Tabs/online-payment-approval/online-payment-approval.component';
import { BeneficiaryDetailComponent } from './Vendor Bill Payment/beneficiary-detail/beneficiary-detail.component';
import { DeductionChargesComponent } from './invoice-collection/deduction-charges/deduction-charges.component';

@NgModule({
    declarations: [
        InvoiceSummaryBillComponent,
        AddManualVoucherComponent,
        DebitVoucherComponent,
        AddVoucherDetailsModalComponent,
        AddDebitAgainstDocumentModalComponent,
        AddDetailsDebitAgainstDocumentModalComponent,
        DebitVoucherPreviewComponent,
        DashboardComponent,
        ThcPaymentsComponent,
        ThcPaymentFilterComponent,
        InvoiceCollectionComponent,
        DeductionsComponent,
        THCAmountsDetailComponent,
        AdvancePaymentsComponent,
        BalancePaymentComponent,
        VendorBillPaymentComponent,
        VendorBillListComponent,
        VendorBillFilterComponent,
        BlancePaymentPopupComponent,
        VendorBillPaymentDetailsComponent,
        OnlinePaymentApprovalComponent,
        BeneficiaryDetailComponent,
        DeductionChargesComponent
    ],
    imports: [
        CommonModule,
        FinanceRoutingModule,
        SharedComponentsModule,
        MastersRoutingModule,
        MatIconModule,
        NgbModule,
        MatTreeModule,
        MatDialogModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatCardModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatDialogModule,
        MatSortModule,
        MatToolbarModule,
        MatMenuModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        ComponentsModule,
        SharedModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatStepperModule,
        NgxMaterialTimepickerModule,
        ReactiveFormsModule
    ],
    exports:[
    ],
    providers: [SnackBarUtilityService, utilityService, OperationService,
        NavigationService, DatePipe, MatDialogModule,
        AssignVehiclePageMethods, FilterUtils, VoucherServicesService],
})
export class FinanceModule { }
