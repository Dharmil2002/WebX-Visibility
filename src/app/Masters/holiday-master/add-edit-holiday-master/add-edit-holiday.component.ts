import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { Subject, take, takeUntil } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Holiday } from "src/app/core/models/Masters/holiday-master";
import { HolidayControl } from "src/assets/FormControls/holiday-master";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-holiday-master',
  templateUrl: './add-edit-holiday.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // set the locale
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
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
  dialogData = "a";
  protected _onDestroy = new Subject<void>();
  data: any;
  dateWiseData: any;
  tableLoad: boolean;
  isUpdate = false;
  highestID: number = 0;
  action: string;
  daynamecntrl: any;
  dayvalue: any;
  AddFormDayWise: {};

  breadscrums = [
    {
      title: "Add Holiday",
      items: ["Home"],
      active: "Add Holiday",
    },
  ];


  constructor(public dialogRef: MatDialogRef<AddEditHolidayComponent>, private fb: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public item: any,
    private filter: FilterUtils, private route: Router, private masterService: MasterService, private datePipe: DatePipe) {
    super();
    if (item?._id) {
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

  //get All holiday details in Table
  async getHolidayDayDetails() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "holiday_detail",
      filter: {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise();
    if (res) {
      this.dayWiseData=res;
      this.bindDaysData();
    }
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
        // Set DivisioncontrolHandler-related variables
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

  //pop up for By Day and By Date
  ShowAndHideDateWise() {
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

  //Binding Days here
  bindDaysData() {
    if (this.dayWiseData) {
      const dayNameArray = this.dayWiseData.data
      .filter(holiday => holiday.type === 'DAY')
      .map(holiday => holiday.days);
      const filter =
        this.holidayMasterControls.days.filter((element) =>
          dayNameArray[0].includes(element.value)
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

  //check Holdiday exist on Date OR Day Wise
  save() {

    if (!this.isUpdate) {
      if (this.holidayMasterForm.controls.dateType.value === "DATE")
        this.CheckHolidayExists();
      else
        this.SaveDayWise();
    }
    else {
      this.editDateWise();
    }
  }

  async editDateWise() {
    const id = this.holidayEditData.Id;
    let req = {
      companyCode: this.companyCode,
      collectionName: "holiday_detail",
      filter: {
        _id: id,
      },
      update: {
        holidayDate: this.datePipe.transform(this.holidayDateWiseForm.controls.holidayDate.value, 'yyyy-MM-dd'),
        holidayNote: this.holidayDateWiseForm.value.holidayNote,
        isActive: this.holidayDateWiseForm.value.isActive,
        _id: this.holidayEditData.Id,
        entryBy: this.holidayDateWiseForm.value.entryBy,
        entryDate: this.holidayDateWiseForm.value.entryDate
      }
    };
    const res = await this.masterService.masterPut("generic/update", req).toPromise()
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: "Holiday Details updated successfully",
        showConfirmButton: true,
      });
    }
    this.dialogRef.close();
  }

  async SaveDayWise() {
    const ControllerDays = [];
    this.holidayDayWiseForm.value.daysControllerHandler.forEach((element) => {
      ControllerDays.push(element.value);
    });
    let req = {
      companyCode: this.companyCode,
      collectionName: "holiday_detail",
      filter: {
        // _id: this.holidayEditData.Id,
      },
      update: {
        holidayDate: '',
        days: ControllerDays,
        type: "DAY",
        holidayNote: '',
        isActive: '',
        entryBy: localStorage.getItem('Username'),
        entryDate: new Date().toISOString(),
      }
    };
    const res = await this.masterService.masterPut("generic/update", req).toPromise()
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

  async CheckHolidayExists() {
    const holiDayDate = this.datePipe.transform(this.holidayDateWiseForm.controls.holidayDate.value, 'yyyy-MM-dd');
    const holidayNote = this.holidayDateWiseForm.value.holidayNote;

    if (holiDayDate && holidayNote) {
      // Both holidayDate and holidayNote properties are present
      let req = {
        companyCode: this.companyCode,
        collectionName: "holiday_detail",
        filter: {}
      };
      this.masterService.masterPost('generic/get', req).subscribe({
        next: (res: any) => {
          const count = res.data.filter(item => item.holidayDate === holiDayDate)
          if (count.length > 0) {
            this.swalMessage('Holiday already exists for the given date');
          }
          else {
            this.SaveDateWise();
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

  async SaveDateWise() {
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
      collectionName: "holiday_detail",
      data: {
        _id: newID,
        holidayDate: holidayDateData,
        days: todayDayName,
        type: "DATE",
        holidayNote: holidayNote,
        isActive: this.holidayDateWiseForm.controls.isActive.value,
        entryBy: localStorage.getItem('Username'),
        entryDate: new Date().toISOString(),
      }
    };
    const res = await this.masterService.masterPost("generic/create", req).toPromise();
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

  // Function to generate ID based on prefix [calculated in the previous step], highestID, and digits
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
