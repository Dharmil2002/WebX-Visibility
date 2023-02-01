import { NgModule } from "@angular/core";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../shared.module";
import { CustomeDatePickerComponent } from './custome-date-picker/custome-date-picker.component';
import { CustomRangePanelComponent } from './custome-date-picker/custom-range-panel/custom-range-panel.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { NgxMaskModule } from "ngx-mask";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { from } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { DatePickerComponent } from './date-picker/date-picker.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMaskModule.forRoot(),
  MatButtonToggleModule,
  MatFormFieldModule,
  MatSlideToggleModule,
];
@NgModule({
  declarations: [FileUploadComponent, BreadcrumbComponent, CustomeDatePickerComponent, CustomRangePanelComponent, DatePickerComponent],
  imports: [SharedModule,materialModules],
  exports: [FileUploadComponent, BreadcrumbComponent,materialModules,DatePickerComponent],
})
export class ComponentsModule {}
