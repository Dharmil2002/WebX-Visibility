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
import { CreditDebitVoucherComponent } from './credit-debit-voucher/credit-debit-voucher.component';
import { FilterUtils } from "../Utility/dropdownFilter";
import { VoucherServicesService } from '../core/service/Finance/voucher-services.service';

@NgModule({
    declarations: [
        InvoiceSummaryBillComponent,
        AddManualVoucherComponent,
        CreditDebitVoucherComponent
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
    providers: [SnackBarUtilityService, utilityService, OperationService,
        NavigationService, DatePipe, MatDialogModule,
        AssignVehiclePageMethods, FilterUtils, VoucherServicesService],
})
export class FinanceModule { }
