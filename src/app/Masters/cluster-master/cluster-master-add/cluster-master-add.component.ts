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
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
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

  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.action = "edit";
      this.submit = "Modify";
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.clusterTabledata = this.data;
      this.breadScrums = [
        {
          title: "Modify Cluster",
          items: ["Home"],
          active: "Modify Cluster",
          generatecontrol: true,
          toggle: this.data.activeFlag,
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Cluster",
          items: ["Home"],
          active: "Add Cluster",
          generatecontrol: true,
          toggle: false,
        },
      ];
      this.clusterTabledata = new ClusterMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
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
    });
    this.clusterTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.Route.navigateByUrl("/Masters/ClusterMaster/ClusterMasterList");
  }
  //#region Pincode Dropdown
  async getPincodeData() {
    const pincodeValue = this.clusterTableForm.controls["pincode"].value;

    if (pincodeValue !== null && pincodeValue !== "") {
      let req = {
        companyCode: this.companyCode,
        collectionName: "pincode_master",
        filter: {},
      };
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req))
      // Assuming the API response contains an array named 'pincodeList'
      const pincodeList = res.data.map((element) => ({
        name: element.PIN.toString(),
        value: element.PIN.toString(),
      }));
      let filteredPincodeList = [];
      if (Array.isArray(pincodeValue)) {
        filteredPincodeList = pincodeList.filter((item) =>
          pincodeValue.toString().includes(item.name.toString())
        );
      } else if (
        typeof pincodeValue === "string" &&
        pincodeValue.length >= 2
      ) {
        filteredPincodeList = pincodeList.filter((item) =>
          item.name.toString().includes(pincodeValue)
        );
      }
      let pincodedata = [];

      if (this.isUpdate) {
        const pincode = this.clusterTabledata.pincode.split(",");
        pincode.forEach((item) => {
          pincodedata.push(
            pincodeList.find(
              (element) => element.name.trim() == item.trim()
            )
          );
        });
        this.clusterTableForm.controls["pincodeDropdown"].patchValue(
          pincodedata
        );
        //console.log(pincodedata);
      }
      const data =
        filteredPincodeList.length > 0 ? filteredPincodeList : pincodedata;

      this.filter.Filter(
        this.jsonControlArray,
        this.clusterTableForm,
        data,
        this.pincodeList,
        this.pincodeStatus
      );

    } else {
      // Handle case when pincodeValue is null or blank
      console.log("Pincode value is null or blank. API call skipped.");
      // You might want to reset or clear some form fields or values here
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
      data["mODDT"] = new Date();
      data['mODLOC'] = this.storage.branch;
      data['mODBY:'] = this.storage.userName;
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

      const sortedClusters = await this.getClusterList();

      if (sortedClusters && sortedClusters.length > 0) {
        const lastUsedCluster = sortedClusters[sortedClusters.length - 1];
        const lastClusterCodeNumber = lastUsedCluster ? parseInt(lastUsedCluster.clusterCode.substring(1)) : 0;

        // Function to generate a new cluster code
        const generateNewClusterCode = (lastCode: number = 0) => {
          const nextClusterCodeNumber = lastCode + 1;
          const paddedNumber = nextClusterCodeNumber.toString().padStart(4, '0');
          return `C${paddedNumber}`;
        };

        // Use the generated code
        this.newClusterCode = generateNewClusterCode(lastClusterCodeNumber);
        const body = {
          clusterCode: this.newClusterCode,
          clusterName: this.clusterTableForm.value.clusterName,
          pincode: this.clusterTableForm.value.pincode,
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
  //#endregion
}