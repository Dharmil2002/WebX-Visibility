import { NgModule } from "@angular/core";
import { CommonModule, DatePipe, NgIf } from "@angular/common";

import { ControlPanelRoutingModule } from "./control-panel-routing.module";
import { GPSRuleComponent } from "./GPSRules/gpsrule/gpsrule.component";
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { MatIconModule } from "@angular/material/icon";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTreeModule } from "@angular/material/tree";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ComponentsModule } from "../shared/components/components.module";
import { SharedModule } from "../shared/shared.module";
import { MatStepperModule } from "@angular/material/stepper";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { TableVirtualScrollModule } from "ng-table-virtual-scroll";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SnackBarUtilityService } from "../Utility/SnackBarUtility.service";
import { utilityService } from "../Utility/utility.service";
import { FilterUtils } from "../Utility/dropdownFilter";
import { AddGpsRuleComponent } from "./GPSRules/add-gps-rule/add-gps-rule.component";

@NgModule({
  declarations: [GPSRuleComponent, AddGpsRuleComponent],
  imports: [
    SharedComponentsModule,
    ControlPanelRoutingModule,
    CommonModule,
    MatIconModule,
    NgbModule,
    MatTreeModule,
    MatDialogModule,
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
    ReactiveFormsModule,
    TableVirtualScrollModule,
    ScrollingModule,
    MatSidenavModule,
    NgIf,
  ],
  providers: [SnackBarUtilityService, DatePipe, utilityService, FilterUtils],
})
export class ControlPanelModule {}
