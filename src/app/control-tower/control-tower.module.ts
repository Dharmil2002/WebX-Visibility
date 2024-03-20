
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { NgModule } from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ControlTowerRoutingModule } from "./control-tower-routing.module";
import { THCTrackingComponent } from "./thctracking/thctracking.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { TableVirtualScrollModule } from "ng-table-virtual-scroll";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ComponentsModule } from "../shared/components/components.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [THCTrackingComponent],
  imports: [SharedComponentsModule,
    ControlTowerRoutingModule,
    CommonModule,
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
    ReactiveFormsModule,
    TableVirtualScrollModule,
    ScrollingModule,
    MatSidenavModule,
    NgIf,
  ],
})
export class ControlTowerModule {}
