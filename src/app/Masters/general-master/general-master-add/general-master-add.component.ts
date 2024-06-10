import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GeneralMaster } from "src/app/core/models/Masters/general-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { GeneralMasterControl } from "src/assets/FormControls/general-master";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import Swal from "sweetalert2";
import { StorageService } from "src/app/core/service/storage.service";
import { SnackBarUtilityService } from "../../../Utility/SnackBarUtility.service";
@Component({
  selector: "app-general-master-add",
  templateUrl: "./general-master-add.component.html",
})
export class GeneralMasterAddComponent implements OnInit {
  breadScrums: any;
  companyCode: any = 0;
  action: string;
  isUpdate = false;
  generalTabledata: any;
  generalTableForm: UntypedFormGroup;
  generalFormControls: GeneralMasterControl;
  jsonControlGroupArray: any;
  newGeneralId: string;
  isSubmit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<GeneralMasterAddComponent>,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarUtilityService: SnackBarUtilityService,
  ) {
    this.companyCode = this.storage.companyCode;
    if (data != null) {
      this.data = data;
      this.isUpdate = this.data.codeId != null ? true : false;
      this.action = this.isUpdate ? "edit" : "Add";
    } else {
      this.action = "Add";
      this.data = new GeneralMaster({});
    }
    this.breadScrums = [
      {
        title: "General Master",
        items: ["Masters"],
        active:
          this.action === "edit" ? "Edit General Master" : "Add General Master",
      },
    ];
    this.initializeFormControl();
  }
  ngOnInit() {}
  initializeFormControl() {
    // Create StateFormControls instance to get form controls for different sections
    this.generalFormControls = new GeneralMasterControl(
      this.data,
      this.isUpdate
    );
    // Get form controls for Customer Group Details section
    this.jsonControlGroupArray = this.generalFormControls.getFormControls();
    this.generalTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGroupArray,
    ]);
  }
  cancel() {
    if (this.isUpdate) {
      this.dialogRef.close(this.generalTableForm);
    } else {
      this.dialogRef.close(this.generalTabledata);
    }
  }
  //#region Save Function
  save() {
    if (!this.generalTableForm.valid || this.isSubmit) {
      this.generalTableForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        timer: 5000,
        timerProgressBar: true,
      });
      return false;
    }
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.isSubmit = true;
        if (this.isUpdate) {
          let id = this.generalTableForm.value._id;
          // Remove the "id" field from the form controls
          this.generalTableForm.removeControl("_id");
          let req = {
            companyCode: this.companyCode,
            collectionName: "General_master",
            filter: { _id: id },
            update: this.generalTableForm.value,
          };
          this.masterService.masterPut("generic/update", req).subscribe({
            next: (res: any) => {
              if (res) {
                // Display success message
                Swal.fire({
                  icon: "success",
                  title: "Successful",
                  text: res.message,
                  showConfirmButton: true,
                });
                this.dialogRef.close(this.generalTableForm);
              }
            },
          });
        } else {
          let req = {
            companyCode: this.storage.companyCode,
            collectionName: "General_master",
            filter: { companyCode: this.storage.companyCode },
          };
          this.masterService.masterPost("generic/get", req).subscribe({
            next: (res: any) => {
              if (res) {
                const lastCodeWithType = res.data
                  .filter((item) => item.codeType === this.generalTabledata)
                  .sort((a, b) => b.codeId.localeCompare(a.codeId))[0];

                const lastGeneralCode = lastCodeWithType
                  ? parseInt(lastCodeWithType.codeId.split("-")[1])
                  : 0;

                function generateGeneralCode(
                  initialCode: number = 0,
                  codeType: string
                ) {
                  const nextGeneralCode = initialCode + 1;
                  const generalNumber = nextGeneralCode
                    .toString()
                    .padStart(4, "0");
                  const generalCode = `${codeType}-${generalNumber}`;
                  return generalCode;
                }
                this.newGeneralId = generateGeneralCode(
                  lastGeneralCode,
                  this.generalTabledata
                );
                this.generalTableForm.controls["_id"].setValue(
                  this.newGeneralId
                );
                this.generalTableForm.controls["codeId"].setValue(
                  this.newGeneralId
                );
                this.generalTableForm.controls["codeType"].setValue(
                  this.generalTabledata
                );
                let req = {
                  companyCode: this.companyCode,
                  collectionName: "General_master",
                  data: this.generalTableForm.value,
                };
                this.masterService.masterPost("generic/create", req).subscribe({
                  next: (res: any) => {
                    if (res) {
                      // Display success message
                      Swal.fire({
                        icon: "success",
                        title: "Successful",
                        text: res.message,
                        showConfirmButton: true,
                      });
                      this.dialogRef.close(this.generalTableForm);
                    }
                  },
                });
              }
            },
          });
        }
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
    }, "Saving General Master ..!");
  }
  //#endregion

  //#region Function Call Handler
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
}
