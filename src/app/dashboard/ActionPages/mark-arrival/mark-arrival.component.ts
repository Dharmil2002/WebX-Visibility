import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { MarkArrivalControl } from 'src/assets/FormControls/MarkArrival';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service'
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { getSealNumber } from 'src/app/operation/shipment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';

@Component({
  selector: 'app-mark-arrival',
  templateUrl: './mark-arrival.component.html',
})

export class MarkArrivalComponent implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json';
  lateReasonURL = '../../../assets/data/lateReasonDropdown.json';
  MarkArrivalTableForm: UntypedFormGroup;
  MarkArrivalTable: any;
  arrivalData: any;
  departature: any;
  latereason: any;
  companyCode: number=parseInt(localStorage.getItem("companyCode"));
  latereasonlist: any;
  latereasonlistStatus: any;
  sealdet: any;
  uploadedFiles: File[];
  
  constructor(
    private ObjSnackBarUtility: SnackBarUtilityService,
    private filter: FilterUtils,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public item: any, 
    private fb: UntypedFormBuilder, 
    private Route: Router,
    private _operationService: OperationService,
    private CnoteService: CnoteService) {
    
      this.MarkArrivalTable = item;
  }
  jsonControlArray: any;
  IntializeFormControl() {
    const MarkArrivalFormControls = new MarkArrivalControl();
    this.jsonControlArray = MarkArrivalFormControls.getMarkArrivalsertFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'LateReason') {
        // Set Late Reason related variables
        this.latereasonlist = data.name;
        this.latereasonlistStatus = data.additionalData.showNameAndValue;
      }

    });
    this.MarkArrivalTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }

  ngOnInit(): void {
    this.IntializeFormControl();
    this.getReasonList();
    this.MarkArrivalTableForm.controls.Vehicle.setValue(this.MarkArrivalTable.VehicleNo)
    this.MarkArrivalTableForm.controls.ETA.setValue(this.MarkArrivalTable.Expected)
    this.MarkArrivalTableForm.controls.Route.setValue(this.MarkArrivalTable.Route)
    this.MarkArrivalTableForm.controls.TripID.setValue(this.MarkArrivalTable.TripID)
  }


  functionCaller($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  getPreviousData() {
    this.goBack(1)
    this.dialogRef.close("")
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `Vehicle Arrived Successfully`,//
      showConfirmButton: true,
    })
  }

  save() {

    this.MarkArrivalTableForm.controls['LateReason']
    .setValue(
      this.MarkArrivalTableForm.controls['LateReason']?.
      value.name||""
    )

     let tripDetailForm=this.MarkArrivalTableForm.value
     const tripId=this.MarkArrivalTableForm.value?.TripID||"";
     delete tripDetailForm.Vehicle
     delete tripDetailForm.TripID
     delete tripDetailForm.Route
     delete tripDetailForm.ETA
      let tripDetails = {
        tripDetailForm
      }
      const reqBody = {
        "companyCode": this.companyCode,
        "type": "operation",
        "collection": "trip_transaction_history",
        "id":tripId,
        "updates": {
          ...tripDetails.tripDetailForm,
        }
      }
      this._operationService.operationPut("common/update", reqBody).subscribe({
        next: (res: any) => {
          if (res) {
            this.updateTripData()
          }
        }
      })
  }

  updateTripData(){
    let tripDetails = {
      status:"arrival",
    }
   const reqBody = {
        "companyCode": this.companyCode,
        "type": "operation",
        "collection": "trip_detail",
        "id":this.MarkArrivalTable.id,
        "updates": {
          ...tripDetails
        }
      }
      this._operationService.operationPut("common/update", reqBody).subscribe({
        next: (res: any) => {
          if (res) {
            this.getPreviousData();
          }
        }
      })
  }
  cancel() {
    this.goBack(1)
    this.dialogRef.close()
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: this.departature });
  }
  getReasonList() {
    this.http.get(this.lateReasonURL).subscribe(res => {
      this.latereason = res;
      let tableArray = this.latereason.codeList;
      let lateReasonList = [];
      tableArray.forEach(element => {
        let dropdownList = {
          name: element.CodeDesc,
          value: element.CodeId
        }
        lateReasonList.push(dropdownList)
      });

      this.filter.Filter(
        this.jsonControlArray,
        this.MarkArrivalTableForm,
        lateReasonList,
        this.latereasonlist,
        this.latereasonlistStatus,
      );

    });
    try {
   
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }

  checkSealNumber() {
    const isMatchingSeal = this.MarkArrivalTableForm.value.Sealno == this.MarkArrivalTable.SealNo;

    this.MarkArrivalTableForm.controls.SealStatus.setValue(isMatchingSeal ? 'Matching' : 'Not Matching');

    this.jsonControlArray.forEach(data => {
      if (data.name === 'Reason') {
        // Set Late Reason related variables
        data.generatecontrol = !isMatchingSeal;

        if (isMatchingSeal) {
          data.Validations = [];
          this.MarkArrivalTableForm.controls.Reason.clearValidators();
        } else {
          data.Validations = [{
            name: "required",
            message: "Seal Change reason is required"
          }];
          this.MarkArrivalTableForm.controls.Reason.setValidators([Validators.required]);
        }

        this.MarkArrivalTableForm.controls.Reason.updateValueAndValidity();
      }
    });
  }
  GetFileList(data) {
    const files: FileList = data.eventArgs;
    const fileCount: number = files.length;
    const fileList: File[] = [];
    const allowedExtensions: string[] = ['jpeg', 'jpg', 'png'];
    let hasUnsupportedFiles = false;
    const fileNames: string[] = [];

    for (let i = 0; i < fileCount; i++) {
      const file: File = files[i];
      const fileExtension: string = file.name.split('.').pop()?.toLowerCase() || '';

      if (allowedExtensions.includes(fileExtension)) {
        fileList.push(file);
        fileNames.push(file.name); // Save file name
      } else {
        hasUnsupportedFiles = true;
      }
    }

    if (hasUnsupportedFiles) {
      // Display an error message or take appropriate action
      this.ObjSnackBarUtility.showNotification(
        "snackbar-danger",
        "Unsupported file format. Please select PNG, JPEG, or JPG files only.",
        "bottom",
        "center"
      );
    } else {
      this.uploadedFiles = fileList; // Assign the file list to a separate variable
    }
  }


}
