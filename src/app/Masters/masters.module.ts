import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CNoteGenerationComponent } from './cnote-generation/cnote-generation.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EwaybillConfigComponent } from './ewaybill-config/ewaybill-config.component';
import { EwayBillDetailsComponent } from './eway-bill-details/eway-bill-details.component';
import { EwayBillDocketBookingComponent } from './eway-bill-docket-booking/eway-bill-docket-booking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTableModule } from '@angular/material/table';
import { jsonDataServiceService } from '../core/service/Utility/json-data-service.service';
import { LoadingsheetComponent } from './loadingsheet/loadingsheet.component';
import { GridListComponent } from '../components/grid-list/grid-list.component';
import { LoadingSheetDetailsComponent } from './loading-sheet-details/loading-sheet-details.component';
import { LoadingsheetgenerateComponent } from './loadingsheetgenerate/loadingsheetgenerate.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { DispatchVehicleComponent } from './dispatch-vehicle/dispatch-vehicle.component';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { ManifestGenerationComponent } from './manifest-generation/manifest-generation.component';
import { SnackBarUtilityService } from '../Utility/SnackBarUtility.service';
import { CompanygstmasterListComponent } from './Company GST Master/companygstmaster-list/companygstmaster-list.component';
import { CompanygstmasterAddComponent } from './Company GST Master/companygstmaster-add/companygstmaster-add.component';
import { utilityService } from '../Utility/utility.service';
import { AddCityMasterComponent } from './City Master/add-city-master/add-city-master.component';
import { CityMasterListComponent } from './City Master/city-master-list/city-master-list.component';
import { AddStateMasterComponent } from './state-master/add-state-master/add-state-master.component';
import { StateMasterListComponent } from './state-master/state-master-list/state-master-list.component';
import { DriverMasterComponent } from './driver-master/driver-master.component';
import { AddDriverMasterComponent } from './driver-master/add-driver-master/add-driver-master.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { AddCompanyComponent } from './Company Setup Master/add-company/add-company.component';
import { AddLocationMasterComponent } from './location-master/add-location-master/add-location-master.component';
import { CustomerMasterListComponent } from './customer-master/customer-master-list/customer-master-list.component';
import { CustomerMasterAddComponent } from './customer-master/customer-master-add/customer-master-add.component';
// import { VendorMasterListComponent } from './Vendor Master/vendor-master-list/vendor-master-list.component';
// import { AddVendorMasterComponent } from './Vendor Master/add-vendor-master/add-vendor-master.component';
@NgModule({
  imports: [
    CommonModule,
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
    MatToolbarModule, SharedComponentsModule,
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

  declarations: [
    CNoteGenerationComponent,
    EwaybillConfigComponent,
    EwayBillDetailsComponent,
    EwayBillDocketBookingComponent,
    LoadingsheetComponent,
    GridListComponent,
    LoadingSheetDetailsComponent,
    LoadingsheetgenerateComponent,
    DispatchVehicleComponent,
    ManifestGenerationComponent,
    CompanygstmasterListComponent,
    CompanygstmasterAddComponent,
    StateMasterListComponent,
    AddStateMasterComponent,
    CityMasterListComponent,
    AddCityMasterComponent,
    DriverMasterComponent,
    AddDriverMasterComponent,
    LocationMasterComponent,
    AddCompanyComponent,
    AddLocationMasterComponent,
    CustomerMasterListComponent,
    CustomerMasterAddComponent,
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, { provide: MAT_DIALOG_DATA, useValue: {} }, jsonDataServiceService, FilterUtils, SnackBarUtilityService, utilityService]
})

export class MastersModule { }
