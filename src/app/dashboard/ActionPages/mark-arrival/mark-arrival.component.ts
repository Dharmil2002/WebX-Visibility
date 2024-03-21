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
import { getDocketFromApiDetail,updateTracking } from './mark-arrival-utlity';
import { extractUniqueValues } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { ArrivalVehicleService } from 'src/app/Utility/module/operation/arrival-vehicle/arrival-vehicle.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { HawkeyeUtilityService } from 'src/app/Utility/module/hawkeye/hawkeye-utility.service';

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
  mfList: any[];
  dktList: any[];
  constructor(
    private ObjSnackBarUtility: SnackBarUtilityService,
    private filter: FilterUtils,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog,
    private storage:StorageService,
    private generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private Route: Router,
    private arrivalService:ArrivalVehicleService,
    private _operationService: OperationService,
    private hawkeyeUtilityService: HawkeyeUtilityService) {
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
    this.getManifestDetail();
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
      title: "Arrival",
      text: `Vehicle arrived successfully`,//
      showConfirmButton: true,
    })
  }
  async getManifestDetail() {
    
    const shipment= await this.arrivalService.getThcWiseMeniFest({tHC:this.MarkArrivalTable.TripID,"D$or":[{iSDEL:false},{iSDEL:{D$exists:false}}]});
    this.mfList=shipment
  }
  async save() {
    
    this.MarkArrivalTableForm.controls['LateReason']
      .setValue(
        this.MarkArrivalTableForm.controls['LateReason']?.
          value.name || ""
      )

    let tripDetailForm = this.MarkArrivalTableForm.value
    const res=await this.arrivalService.fieldMappingMarkArrival(this.MarkArrivalTable, tripDetailForm,this.mfList);
    if(res){
      this.updateTripData()
    }
  }

  updateTripData() {
    
    const dktStatus = (this.mfList ?? []).filter(x => x.dEST === (this.storage?.branch ?? "")).length > 0 ? "dktAvail" : "noDkt";
    const next = getNextLocation(this.MarkArrivalTable.Route.split(":")[1].split("-"), this.currentBranch);
    
    let tripStatus, tripDetails,stCode,stName;
    if (dktStatus === "dktAvail") {
      stCode=5,
      stName="Vehicle Arrived"
      tripDetails = {
        sTS: stCode,
        sTSNM: stName
      };
    } else if (dktStatus === "noDkt") {
      tripStatus = next ? "Update Trip" : "close";
        stCode=next?6:7,
        stName="Picked Up"

      tripDetails = {
        sTS: stCode,
        sTSNM: stName,
        ...(next ? {} : {cTM:new Date()})
      };
      if(!next){
        tripDetails.vEHNO="",
        tripDetails.tHC="",
        tripDetails.cLOC= this.MarkArrivalTable.Route.split(":")[1].split("-")[0],
        tripDetails.nXTLOC= ""
        if(stCode==7){
          
          const reqArrivalDeparture={
            action:"TripArrivalDepartureUpdate",
            reqBody:{
              cid:this.companyCode,
              EventType:'A',
              loc:this.currentBranch,
              tripId:this.MarkArrivalTableForm.value?.TripID
            }
          }
          this.hawkeyeUtilityService.pushToCTCommon(reqArrivalDeparture);
        }
      }
      else{
        tripDetails.cLOC=this.storage.branch,
        tripDetails.nXTLOC= next || ""
      }
    }
    if(stCode==5||stCode==6){
      const reqArrivalDeparture={
        action:"TripArrivalDepartureUpdate",
        reqBody:{
          cid:this.companyCode,
          EventType:'A',
          loc:this.currentBranch,
          tripId:this.MarkArrivalTableForm.value?.TripID
        }
      }
      this.hawkeyeUtilityService.pushToCTCommon(reqArrivalDeparture);
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_Route_Schedule",
      "filter": {tHC:this.MarkArrivalTableForm.value?.TripID},
      "update": {
        ...tripDetails
      }
    }
    this._operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: async (res: any) => {
        if (res) {
          if (stCode ==7) {
            //this.getDocketTripWise(tripId);
            // Call the vehicleStatusUpdate function here
            const result = await vehicleStatusUpdate(this.currentBranch, this.companyCode, this.MarkArrivalTable, this._operationService, true);
            Swal.fire({
              icon: "info",
              title: "Trip is close",
              text: "Trip is close at " + this.currentBranch,
              showConfirmButton: true
            });
            this.getPreviousData();
          } else {
             // await this.updateDocket();
              this.getPreviousData();
            //this.getDocketTripWise(tripId);
           
          }
        }
      }
    })
  }

  /*here i write a code becuase of update docket states*/
  async getDocketTripWise(tripId) {
    const detail = await getDocketFromApiDetail(this.companyCode, this._operationService, tripId.trim());
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
  async getReasonList() {
    
   const lateReasonlist = await this.generalService.getGeneralMasterData("LTRES");
      this.filter.Filter(
        this.jsonControlArray,
        this.MarkArrivalTableForm,
        lateReasonlist,
        this.latereasonlist,
        this.latereasonlistStatus,
      );

  }

  async checkSealNumber() {
    let isMatchingSeal=false
    const sealNo=await this.arrivalService.getCheckOnce({
      "_id": `${this.storage.companyCode}-${this.MarkArrivalTable.TripID}-${this.MarkArrivalTable.cLOC}-${this.storage.branch}`,
      "D$expr": {
        "D$eq": [ "$lOAD.sEALNO",this.MarkArrivalTableForm.value.Sealno ] 
      }
    });

    isMatchingSeal= ( sealNo?.lOAD?.sEALNO == this.MarkArrivalTableForm.value.Sealno)
    
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
