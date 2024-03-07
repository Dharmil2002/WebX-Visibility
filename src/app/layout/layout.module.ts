import { AuthLayoutComponent } from "./app-layout/auth-layout/auth-layout.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbDropdownModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared/shared.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from "./app-layout/main-layout/main-layout.component";
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MatTabsModule,
    SharedModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
})
export class LayoutModule { }
