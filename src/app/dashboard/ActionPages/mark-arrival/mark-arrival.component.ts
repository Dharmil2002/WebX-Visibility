import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { MarkArrivalControl } from 'src/assets/FormControls/MarkArrival';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getNextLocation } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { vehicleStatusUpdate } from 'src/app/operation/update-loading-sheet/loadingSheetshipment';
import { getDocketFromApiDetail, tripTransactionDetail, updateTracking } from './mark-arrival-utlity';
import { extractUniqueValues } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';

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
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  currentBranch: string = localStorage.getItem("Branch");
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
    private _operationService: OperationService) {
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
          value.name || ""
      )

    let tripDetailForm = this.MarkArrivalTableForm.value
    const tripId = this.MarkArrivalTableForm.value?.TripID || "";
   
    delete tripDetailForm.Vehicle
    delete tripDetailForm.TripID
    delete tripDetailForm.Route
    delete tripDetailForm.ETA
    let tripDetails = {
      tripDetailForm
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_transaction_history",
      "filter":{_id: tripId},
      "update": {
        ...tripDetails.tripDetailForm,
      }
    }
    this._operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.updateTripData(tripId)
        }
      }
    })
  }

  updateTripData(tripId) {

    const dktStatus = this._operationService.getShipmentStatus();
    const next = getNextLocation(this.MarkArrivalTable.Route.split(":")[1].split("-"), this.currentBranch);
    let tripStatus, tripDetails;

    if (dktStatus === "dktAvail") {
      tripStatus = "arrival";
      tripDetails = {
        status: "arrival"
      };
    } else if (dktStatus === "noDkt") {
      tripStatus = next ? "Update Trip" : "close";
      tripDetails = {
        status: tripStatus,
        nextUpComingLoc: "",
        ...(next ? {} : { closeTime: new Date() })
      };
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_detail",
      "filter":{_id: this.MarkArrivalTable.id},
      "update": {
        ...tripDetails
      }
    }
    this._operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: async (res: any) => {
        if (res) {
          if (tripDetails.status==="close") {
            this.getDocketTripWise(tripId);
            // Call the vehicleStatusUpdate function here
            const result = await vehicleStatusUpdate(this.currentBranch, this.companyCode,this.MarkArrivalTable, this._operationService,true);
            Swal.fire({
              icon: "info",
              title: "Trip is close",
              text: "Trip is close at" + this.currentBranch,
              showConfirmButton: true
            });
            this.getPreviousData();
          }else{
            this.getDocketTripWise(tripId);
          }
         

        }
      }
    })
  }
  /*here i write a code becuase of update docket states*/
  async getDocketTripWise(tripId) {
    const detail = await getDocketFromApiDetail(this.companyCode, this._operationService,tripId.trim());
    const uniqueDktNumbers = extractUniqueValues(detail, 'dktNo');
    // Create an array of promises for updateTracking calls
    const updatePromises = uniqueDktNumbers.map(async element => {
        await updateTracking(this.companyCode, this._operationService, element);
    });

    // Wait for all updateTracking promises to resolve
    await Promise.all(updatePromises);

    // Once all promises are resolved, call getPreviousData
    this.getPreviousData();
}

  cancel() {
    this.goBack(2)
    this.dialogRef.close()
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: this.departature });
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

  async checkSealNumber() {
    const tripDetail= await tripTransactionDetail(this.companyCode,this.MarkArrivalTable.TripID,this._operationService)
    const isMatchingSeal = this.MarkArrivalTableForm.value.Sealno == tripDetail[0].DepartureSeal;

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
