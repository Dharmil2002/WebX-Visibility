import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { Subject, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Holiday } from "src/app/core/models/Masters/holiday-master";
import { HolidayControl } from "src/assets/FormControls/holiday-master";
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-holiday-master',
  templateUrl: './add-edit-holiday.component.html',
})

export class AddEditHolidayComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  holidayMasterForm: UntypedFormGroup;
  holidayMasterControls: HolidayControl;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  holidayEditData: Holiday;
  addForm: any;
  showDateWise = true;
  showDayWise = false;
  dayNameControl: string;
  dayValue: any;
  addFormDayWise: {};
  holidayDayWiseForm: UntypedFormGroup;
  holidayDateWiseForm: UntypedFormGroup;
  dayWiseData: any;
  addFormDateWise: any;
  protected _onDestroy = new Subject<void>();

  breadscrums = [
    {
      title: "Add Holiday",
      items: ["Home"],
      active: "Add Holiday",
    },
  ];
  isUpdate = false;
  highestID: number = 0;
  action: string;

  constructor(public dialogRef: MatDialogRef<AddEditHolidayComponent>, private fb: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public item: any, private filter: FilterUtils,
    private masterService: MasterService, private datePipe: DatePipe) {
    super();
    if (item?.id) {
      this.isUpdate = true;
      this.holidayEditData = new Holiday(item);
    }
    else {
      this.holidayEditData = new Holiday("")
    }
  }
  ngOnInit(): void {
    this.createHolidayform();
    this.createHolidayDayWise();
    this.createHolidayDateWise();
    this.getHolidayDayDetails();
  }
  getHolidayDayDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "holiday_detail"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.bindDaysData();
        }
      }
    });
  }

  createHolidayform() {
    this.holidayMasterControls = new HolidayControl(this.holidayEditData);
    this.addForm = {
      "holiday-master": this.holidayMasterControls.holidayControlArray
    };
    this.holidayMasterForm = formGroupBuilder(this.fb, Object.values(this.addForm));
    this.holidayMasterForm.controls.dateType.setValue('DATE');
  }

  createHolidayDayWise() {
    this.holidayMasterControls.dayWiseControls.forEach(d => {
      if (d.name === "days") {
        this.dayNameControl = d.name;
        this.dayValue = d.additionalData.showNameAndValue;
      }
    })
    this.addFormDayWise = {}
    this.holidayDayWiseForm = formGroupBuilder(this.fb, [this.holidayMasterControls.dayWiseControls]);
  }

  createHolidayDateWise() {
    this.addFormDateWise = {
      "DateWise": this.holidayMasterControls.dateWiseControls
    }
    this.holidayDateWiseForm = formGroupBuilder(this.fb, Object.values(this.addFormDateWise));
  }

  showAndHideDateWise() {
    const type = this.holidayMasterForm.controls.dateType.value;
    if (type === "DATE") {
      this.showDateWise = true;
      this.showDayWise = false;
    }
    else {
      this.showDateWise = false;
      this.showDayWise = true;
    }
  }

  bindDaysData() {
    if (this.dayWiseData) {
      const dayNameArray = this.dayWiseData.map(dayData => dayData.days);
      const filter =
        this.holidayMasterControls.days.filter((element) =>
          dayNameArray.includes(element.value)
        )
      this.holidayDayWiseForm.controls[
        "daysControllerHandler"
      ].patchValue(filter);
    }
    this.filter.Filter(
      this.holidayMasterControls.dayWiseControls,
      this.holidayDayWiseForm,
      this.holidayMasterControls.days,
      this.dayNameControl,
      this.dayValue
    );
  }

  save() {
    if (!this.isUpdate) {
      if (this.holidayMasterForm.controls.dateType.value === "DATE")
        this.checkHolidayExists();
      else
        this.saveDayWise();
    }
    else {
      this.editDateWise();
    }
  }

  editDateWise() {
    const id = this.holidayEditData.Id;
    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "holiday_detail",
      id: id,
      //updates : this.holidayMasterForm.value
      updates: {
        holidayDate: this.datePipe.transform(this.holidayDateWiseForm.controls.holidayDate.value, 'yyyy-MM-dd'),
        holidayNote: this.holidayDateWiseForm.value.holidayNote,
        isActive: this.holidayDateWiseForm.value.isActive,
        id: this.holidayEditData.Id,
        entryBy: this.holidayDateWiseForm.value.entryBy,
        entryDate: this.holidayDateWiseForm.value.entryDate
      }
    };
    this.masterService.masterPut('common/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Holiday Details updated successfully",
            showConfirmButton: true,
          });
          this.dialogRef.close();
        }
      }
    });
  }

  saveDayWise() {
    const ControllerDays = [];
    this.holidayDayWiseForm.value.daysControllerHandler.forEach((element) => {
      ControllerDays.push(element.value);
    });
    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "holiday_detail",
      data: {
        id: '',
        holidayDate: '',
        days: ControllerDays,
        type: "DAY",
        holidayNote: '',
        isActive: '',
        entryBy: localStorage.getItem('Username'),
        entryDate: new Date().toISOString(),
      }
    };
    this.masterService.masterPut('common/update', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Holiday Details Saved successfully",
            showConfirmButton: true,
          });
          this.dialogRef.close();
        }
      }
    });
  }

  checkHolidayExists() {
    const holidateDate = this.datePipe.transform(this.holidayDateWiseForm.controls.holidayDate.value, 'yyyy-MM-dd');

    if (holidateDate) {
      // Both holidayDate and holidayNote properties are present
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "holiday_detail",
        query: {
          holidayDate: holidateDate
        }
      };
      this.masterService.masterPost('common/getOne', req).subscribe({
        next: (res: any) => {

          if (res.data.db.data.holiday_detail.length > 0) {
            // Holiday already exists for the given date
            this.swalMessage('Holiday already exists for the given date');
          } else {
            // No holiday exists for the given date, proceed to save
            this.saveDateWise();
          }
        },
        error: (err: any) => {
          // Handle error if required
          console.error(err);
        }
      });
    } else {
      // Either holidayDate or holidayNote (or both) properties are missing
      // Show a message to the user using SwalMessage
      this.swalMessage('Please fill up all the mandatory fields');
    }
  }

  saveDateWise() {
    const holidayDateData = moment(this.holidayDateWiseForm.controls.holidayDate.value).endOf('day').format('YYYY-MM-DD');
    const holidayNote = this.holidayDateWiseForm.value.holidayNote;
    // Get the first 2 letters of the holidayNote and convert them to uppercase
    const prefix = holidayNote.substr(0, 2).toUpperCase();
    let newID = this.generateID(prefix, this.highestID, 3);// Generate the new ID with 3 digits (e.g., "RA001", "RA002", etc.)
    this.highestID = parseInt(newID.substr(2), 10); // Update the highestID with the numeric part of the new ID
    // Get today's day name
    const todayDayName = moment(holidayDateData).format('dddd'); // e.g., "Monday", "Tuesday", etc.

    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "holiday_detail",
      data: {
        id: newID,
        holidayDate: holidayDateData,
        days: todayDayName,
        type: "DATE",
        holidayNote: holidayNote,
        isActive: this.holidayDateWiseForm.controls.isActive.value,
        entryBy: localStorage.getItem('Username'),
        entryDate: new Date().toISOString(),
      }
    };
    this.masterService.masterPost('common/create', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Holiday data added successfully",
            text: res.message,
            showConfirmButton: true,
          });
          this.dialogRef.close();
        }
      }
    });
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.holidayMasterControls.dayWiseControls.findIndex(
      (obj) => obj.name === fieldName
    );
    this.holidayMasterControls.dayWiseControls[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.holidayDayWiseForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  // Function to generate ID based on prefix, highestID, and digits
  generateID(prefix, highestID, digits) {
    const numericPart = (highestID + 1).toString().padStart(digits, '0');
    return prefix + numericPart;
  }

  cancel() {
    this.dialogRef.close(this.showDayWise);
  }

  swalMessage(message) {
    Swal.fire({
      title: message,
      toast: true,
      icon: "error",
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      confirmButtonText: "Yes"
    });
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}