import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ContainerFormControls } from "src/assets/FormControls/container-controls";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-container",
  templateUrl: "./add-container.component.html",
})
export class AddContainerComponent implements OnInit {
  breadscrums = [];
  containerFormControls: any;
  isUpdate = false;
  jsonControlArray: any;
  containerType: any;
  containerTypeStatus: any;
  containerTableForm: any;
  submit: any = "Submit";
  VendorType: any;
  VendorTypeStatus: any;
  VendorName: any;
  VendorNameStatus: any;
  CompanyCode = localStorage.getItem("companyCode");
  UpdateData: any;
  FormTitle: string = "Add Container";
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.FormTitle = "Edit Account";
    }
    this.breadscrums = [
      {
        generatecontrol: true,
        toggle: this.isUpdate ? this.UpdateData.isActive : false,
        title: "Add Container",
        items: ["Master"],
        active: "Add Container",
      },
    ];
  }

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.containerFormControls = new ContainerFormControls(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray =
      this.containerFormControls.getContainerFormControlsArray();
    this.containerTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    this.jsonControlArray.forEach((data) => {
      if (data.name === "containerType") {
        // Set containerType-related variables
        this.containerType = data.name;
        this.containerTypeStatus = data.additionalData.showNameAndValue;
        this.containerTypeDropdwon();
      }
      if (data.name === "VendorType") {
        // Set VendorType-related variables
        this.VendorType = data.name;
        this.VendorTypeStatus = data.additionalData.showNameAndValue;
        this.VendorTypeDropdwon();
      }
      if (data.name === "VendorName") {
        // Set VendorName-related variables
        this.VendorName = data.name;
        this.VendorNameStatus = data.additionalData.showNameAndValue;
        this.VendorNameDropdwon();
      }
    });
  }
  async containerTypeDropdwon() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "container_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      const containerType = res.data?.map((x) => {
        return {
          name: x.containerType,
          value: x.containerCode,
        };
      });
      if (this.isUpdate) {
        const element = containerType.find(
          (x) => x.name == this.UpdateData.cNTYPNM
        );
        this.containerTableForm.controls["containerType"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.containerTableForm,
        containerType,
        this.containerType,
        this.containerTypeStatus
      );
    }
  }
  async VendorTypeDropdwon() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "VENDTYPE", codeDesc: "Own" },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      const VendorTypeData = res.data?.map((x) => {
        return {
          name: x.codeDesc,
          value: x._id,
        };
      });
      this.containerTableForm.controls["VendorType"].setValue(
        VendorTypeData[0]
      );
      this.filter.Filter(
        this.jsonControlArray,
        this.containerTableForm,
        VendorTypeData,
        this.VendorType,
        this.VendorTypeStatus
      );
    }
  }
  async VendorNameDropdwon() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "vendor_detail",
      filter: { vendorTypeName: "Own" },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      const vendorNameData = res.data?.map((x) => {
        return {
          name: x.vendorName,
          value: x.vendorCode,
        };
      });
      if (this.isUpdate) {
        const element = vendorNameData.find(
          (x) => x.value == this.UpdateData.vNCD
        );
        this.containerTableForm.controls["VendorName"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.containerTableForm,
        vendorNameData,
        this.VendorName,
        this.VendorNameStatus
      );
    }
  }

  WeightCalculate(event) {
    const GrossWeight = +this.containerTableForm.value.GrossWeight;
    const TareWeight = +this.containerTableForm.value.TareWeight;
    console.log({
      GrossWeight,
      TareWeight,
    });
    if (GrossWeight >= TareWeight) {
      const NetWeight = GrossWeight - TareWeight;
      this.containerTableForm.controls["NetWeight"].setValue(+NetWeight);
    } else {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Gross weight greater than Tare weight",
        showConfirmButton: true,
      });
      this.containerTableForm.controls["GrossWeight"].setValue(0);
      this.containerTableForm.controls["TareWeight"].setValue(0);
      this.containerTableForm.controls["NetWeight"].setValue(0);
    }
  }

  async save(event) {
    const body = {
      cNTYPNM: this.containerTableForm.value.containerType.name,
      cNTYPCD: this.containerTableForm.value.containerType.value,
      cNNO: this.containerTableForm.value.ContainerNumber,
      vNTYP: this.containerTableForm.value.VendorType.name,
      vNTYPCD: this.containerTableForm.value.VendorType.value,
      vNNM: this.containerTableForm.value.VendorName.name,
      vNCD: this.containerTableForm.value.VendorName.value,
      gRW: +this.containerTableForm.value.GrossWeight,
      tRW: +this.containerTableForm.value.TareWeight,
      nETW: +this.containerTableForm.value.NetWeight,
      aCT: this.containerTableForm.value.isActive,
    };
    if (!this.isUpdate) {
      const tableReq = {
        companyCode: this.CompanyCode,
        collectionName: "container_detail_master",
        filter: {},
        sorting: {cNCD:-1}
      };
      const TableData = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", tableReq)
      );
      const index =
        TableData.data.cNCD
          ? parseInt(TableData.data.cNCD.substring(4)) + 1
          : 1;
      const containercode = `CON-${
        index <= 9 ? "00" : index >= 9 && index <= 99 ? "0" : ""
      }${index}`;
      body["_id"] = `${this.CompanyCode}-${containercode}`;
      body["cNCD"] = containercode;
      body["eNTDT"] = new Date();
      body["eNTLOC"] = this.storage.branch;
      body["eNTBY"] = this.storage.userName;
    } else {
      body["mODDT"] = new Date();
      body["mODLOC"] = this.storage.branch;
      body["mODBY"] = this.storage.userName;
    }
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "container_detail_master",
      filter: this.isUpdate ? { cNCD: this.UpdateData.cNCD } : undefined,
      update: this.isUpdate ? body : undefined,
      data: this.isUpdate ? undefined : body,
    };
    const res = this.isUpdate
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );

    if (res.success) {
      this.Route.navigateByUrl("/Masters/ContainerMaster/ListContainer");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/ContainerMaster/ListContainer");
  }
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.containerTableForm.controls["isActive"].setValue(event);
  }
}
