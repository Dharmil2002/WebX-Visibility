import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from "@angular/router";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";
import { CustomerGroupControl } from "src/assets/FormControls/customer-group-master";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";

@Component({
  selector: 'app-customer-group-add',
  templateUrl: './customer-group-add.component.html',
})
export class CustomerGroupAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any; }[];
  companyCode: any = 0;
  action: string;
  isUpdate = false;
  groupTabledata: CustomerGroupMaster;
  groupTableForm: UntypedFormGroup;
  customerGroupFormControls: CustomerGroupControl;
  jsonControlGroupArray: any;
  backPath: string;
  isSubmit: boolean = false;
  submit = 'Save';
  ngOnInit() {
    this.backPath = "/Masters/CustomerGroupMaster/CustomerGroupMasterList";
  }

  constructor(private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService, private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,

  ) {

    this.companyCode = this.storage.companyCode;
    const extrasState = this.Route.getCurrentNavigation()?.extras?.state;

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.groupTabledata = Route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.submit = 'Modify';
      this.isUpdate = true;
      this.groupTabledata = extrasState.data;
    } else {
      this.action = "Add";
      this.groupTabledata = new CustomerGroupMaster({})
    }
    this.breadScrums = [
      {
        title: this.action === "edit" ? "Modify Customer Group" : "Add Customer Group",
        items: ["Home"],
        active: this.action === "edit" ? "Modify Customer Group" : "Add Customer Group",
        generatecontrol: true,
        toggle: this.action === "edit" ? this.groupTabledata.activeFlag : true
      }
    ];
    this.initializeFormControl();
  }
  initializeFormControl() {
    // Create StateFormControls instance to get form controls for different sections
    this.customerGroupFormControls = new CustomerGroupControl(this.groupTabledata, this.isUpdate);
    // Get form controls for Customer Group Details section
    this.jsonControlGroupArray = this.customerGroupFormControls.getFormControls();
    this.groupTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
  }
  //#region Save Function
  async save() {
    if (!this.groupTableForm.valid || this.isSubmit) {

      this.groupTableForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    else {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          this.isSubmit = true;
          if (this.isUpdate) {
            let id = this.groupTableForm.value._id;
            // Remove the "id" field from the form controls
            this.groupTableForm.removeControl("_id");
            let req = {
              companyCode: this.companyCode,
              collectionName: "customerGroup_detail",
              filter: { _id: id },
              update: this.groupTableForm.value
            };
            this.masterService.masterPut('generic/update', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
                }
              }
            });
          }
          else {
            const tableReq = {
              companyCode: this.companyCode,
              collectionName: "customerGroup_detail",
              filter: { companyCode: this.companyCode }
            }
            const tableRes = await firstValueFrom(this.masterService.masterPost('generic/get', tableReq))
            const tableData = tableRes.data
            const index = tableData.length == 0 ? 0 : parseInt(tableData[tableData.length - 1].groupCode.substring(4));
            const code = `CUGR${(index + 1).toString().padStart(4, '0')}`
            this.groupTableForm.controls["_id"].setValue(`${this.companyCode}-${code}`);
            this.groupTableForm.controls["groupCode"].setValue(code);
            // this.groupTableForm.controls['activeFlag'].setValue(true);

            let req = {
              companyCode: this.companyCode,
              collectionName: "customerGroup_detail",
              data: this.groupTableForm.value
            };
            this.masterService.masterPost('generic/create', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
                }
              }
            });
          }
        }
        catch (error) {
          console.error("Error fetching data:", error);
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
          this.isSubmit = false;
        }
      }, "Customer Group Adding...");
    }
  }
  //#endregion

  //#region Function Call Handler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.groupTableForm.controls['activeFlag'].setValue(event);
    // console.log("Toggle value :", event);
  }
  checkGroupCodeExists() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "customerGroup_detail",
      "filter": {}
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const count = res.data.filter(item => item.groupCode == this.groupTableForm.controls.groupCode.value)
          if (count.length > 0) {
            Swal.fire({
              title: 'Group Code already exists! Please try with another',
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK"
            });
            this.groupTableForm.controls['groupCode'].reset();
          }
        }
      }
    })
  }
}