import { filter } from 'rxjs/operators';
import { PinCodeService } from './../../../Utility/module/masters/pincode/pincode.service';
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { ClusterMaster } from "src/app/core/models/Masters/cluster-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ClusterControl } from "src/assets/FormControls/cluster-master";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import Swal from "sweetalert2";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { de } from 'date-fns/locale';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';

@Component({
  selector: "app-cluster-master-add",
  templateUrl: "./cluster-master-add.component.html",
})
export class ClusterMasterAddComponent implements OnInit {
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: boolean;
    toggle: any;
  }[];
  companyCode: any = 0;
  clusterTabledata: ClusterMaster;
  clusterTableForm: UntypedFormGroup;
  clusterFormControls: ClusterControl;
  //#region Variable Declaration
  jsonControlArray: any;
  pincodeStatus: any;
  backPath: string;
  pincodeList: any;
  action: string;
  isUpdate = false;
  newClusterCode: string;
  data: any;
  submit = "Save";
  clusterTypeStatus: any;
  clusterType: any;
  isSubmit: boolean = false
  //#endregion

  ngOnInit() {
    this.getPincodeData();
    this.backPath = "/Masters/ClusterMaster/ClusterMasterList";
  }
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    public snackBarUtilityService: SnackBarUtilityService,

  ) {
    this.companyCode = this.storage.companyCode;
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.action = "edit";
      this.submit = "Modify";
      this.isUpdate = true;
      this.clusterTabledata = this.data;
    } else {
      this.action = "Add";
      this.clusterTabledata = new ClusterMaster({});
    }
  
    this.breadScrums = [
      {
        title: this.action === "edit" ? "Modify Cluster" : "Add Cluster",
        items: ["Home"],
        active: this.action === "edit" ? "Modify Cluster" : "Add Cluster",
        generatecontrol: true,
        toggle: this.action === "edit" ? this.clusterTabledata.activeFlag : true
      }
    ];


    this.initializeFormControl();
  }
  initializeFormControl() {
    this.clusterTabledata.clusterType = { name: this.clusterTabledata['cLSTYPNM'], value: this.clusterTabledata['cLSTYP'] };
    this.clusterFormControls = new ClusterControl(
      this.clusterTabledata,
      this.isUpdate
    );
    this.jsonControlArray = this.clusterFormControls.getClusterFormControls();
    this.jsonControlArray.forEach((data) => {
      if (data.name === "pincode") {
        // Set Pincode category-related variables
        this.pincodeList = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "clusterType") {
        // Set Pincode category-related variables
        this.clusterType = data.name;
        this.clusterTypeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.clusterTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getdata();

  }
  cancel() {
    this.Route.navigateByUrl("/Masters/ClusterMaster/ClusterMasterList");
  }

  //#region
  async getdata() {
    if (this.isUpdate) {
      const pincode = this.clusterTabledata.pincode.map(m => {
        return { name: m, value: m }
      });
      this.clusterTableForm.controls["pincodeDropdown"].patchValue(
        pincode
      );
    }

    const clusterTypes = await this.generalService.getGeneralMasterData("CLSTYP");
    this.filter.Filter(
      this.jsonControlArray,
      this.clusterTableForm,
      clusterTypes,
      this.clusterType,
      this.clusterTypeStatus
    );
  }
  //#endregion

  //#region Pincode Dropdown
  async getPincodeData() {
    const pincodeValue = this.clusterTableForm.controls["pincode"].value;
    const selectedPincodes = this.clusterTableForm.controls["pincodeDropdown"].value;

    //this.pinCodeService.getPincodes(this.clusterTableForm, )
    if (pincodeValue.length >= 3) {
      let gte = parseInt(`${pincodeValue}00000`.slice(0, 6));
      let lte = parseInt(`${pincodeValue}99999`.slice(0, 6));
      const filter = { PIN: { 'D$gte': gte, 'D$lte': lte } }

      // Prepare the pincodeBody with the companyCode and the determined filter
      const cityBody = {
        companyCode: this.storage.companyCode,
        collectionName: "pincode_master",
        filter,
      };

      // Fetch pincode data from the masterService asynchronously
      const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
      // Extract data from the response
      let codeData = cResponse.data.map((x) => { return { name: `${x.PIN}`, value: `${x.PIN}` } });
      // Filter cityCodeData for partial matches
      if (codeData.length >= 0) {

        if (Array.isArray(selectedPincodes)) {
          codeData = codeData.filter(f => !selectedPincodes.includes(f.value));
          codeData.push(...selectedPincodes);
        }
        this.filter.Filter(
          this.jsonControlArray,
          this.clusterTableForm,
          codeData,
          this.pincodeList,
          this.pincodeStatus
        );
      }
    }
    else {
      this.filter.Filter(
        this.jsonControlArray,
        this.clusterTableForm,
        selectedPincodes,
        this.pincodeList,
        this.pincodeStatus
      );
    }
  }

  //#endregion
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.clusterTableForm.controls["activeFlag"].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#region Save Function
  async save() {

    if (!this.clusterTableForm.valid) {
      this.clusterTableForm.markAllAsTouched();
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
          this.isSubmit = true

          const pincodeDropdown =
            this.clusterTableForm.value.pincodeDropdown == ""
              ? []
              : this.clusterTableForm.value.pincodeDropdown.map(
                (item: any) => item.name
              );
          this.clusterTableForm.controls["pincode"].setValue(pincodeDropdown);
          this.clusterTableForm.removeControl("pincodeDropdown");

          // Clear any errors in the form controls
          Object.values(this.clusterTableForm.controls).forEach((control) =>
            control.setErrors(null)
          );
          let data = this.clusterTableForm.value;
          if (this.isUpdate) {
            let id = this.clusterTableForm.value._id;
            this.clusterTableForm.removeControl("_id");
            data['cLSTYP'] = this.clusterTableForm.value.clusterType.value,
              data['cLSTYPNM'] = this.clusterTableForm.value.clusterType.name,
              data["mODDT"] = new Date();
            data['mODLOC'] = this.storage.branch;
            data['mODBY:'] = this.storage.userName;
            delete data["clusterType"];
            delete data["entryDate"];
            let req = {
              companyCode: this.companyCode,
              collectionName: "cluster_detail",
              filter: { _id: id },
              update: data,
            };

            const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
            if (res) {
              // Display success message
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: res.message,
                showConfirmButton: true,
              });
              this.Route.navigateByUrl(
                "/Masters/ClusterMaster/ClusterMasterList"
              );
            }

          } else {
            // Use the generated code
            this.newClusterCode = await this.getNewClusterCode();
            const body = {
              clusterCode: this.newClusterCode,
              clusterName: this.clusterTableForm.value.clusterName,
              pincode: this.clusterTableForm.value.pincode,
              cLSTYP: this.clusterTableForm.value.clusterType.value,
              cLSTYPNM: this.clusterTableForm.value.clusterType.name,
              activeFlag: this.clusterTableForm.value.activeFlag,
              _id: this.newClusterCode,
              companyCode: this.companyCode,
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName
            };
            let req = {
              companyCode: this.companyCode,
              collectionName: "cluster_detail",
              data: body,
            };
            const res = await firstValueFrom(this.masterService.masterPost("generic/create", req))

            if (res) {
              // Display success message
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: res.message,
                showConfirmButton: true,
              });
              this.Route.navigateByUrl(
                "/Masters/ClusterMaster/ClusterMasterList"
              );
            }
          }
        }
        catch (error) {
          console.error("Error fetching data:", error);
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
        }
      }, "Cluster Adding...");
    }
  }
  //#endregion

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
  protected _onDestroy = new Subject<void>();
  // function handles select All feature of all multiSelect fields of one form.
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.clusterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
  async checkClusterExists() {
    const res = await this.getClusterList()
    if (res) {
      const clusterNameToCheck = this.clusterTableForm.controls.clusterName.value.toLowerCase();
      const count = res.some((item) =>
        item.clusterName.toLowerCase() === clusterNameToCheck);
      if (count) {
        Swal.fire({
          text: `Cluster Name :${this.clusterTableForm.controls.clusterName.value} already exists! Please try with another`,
          icon: 'warning',
          title: 'Warning',
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        this.clusterTableForm.controls["clusterName"].reset();
      }
    }
  }

  //#region to get cluster List
  async getClusterList() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "cluster_detail",
      filter: {},
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    return res.data.sort((a, b) => a._id.localeCompare(b._id));
  }

  async getNewClusterCode() {
    const idReq = {
      companyCode: this.companyCode,
      collectionName: "cluster_detail",
      filter: {
        companyCode: this.companyCode
      },
      sorting: { clusterCode: -1 },
    };

    const idRes = await firstValueFrom(this.masterService.masterPost("generic/findLastOne", idReq));
    const lastId = idRes?.data?.clusterCode ?? `C0000`;
    const clusterCode = nextKeyCode(lastId);
    return clusterCode;
  }
  //#endregion
}
