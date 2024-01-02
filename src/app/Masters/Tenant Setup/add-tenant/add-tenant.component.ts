import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { TenantModel } from "src/app/core/models/Masters/Tenant Master/tenant-mater";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { TenantControl } from "src/assets/FormControls/tenantControl";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-tenant",
  templateUrl: "./add-tenant.component.html",
})
export class AddTenantComponent implements OnInit {
  submit = "Save";
  // breadScrums = [{}];
  backPath: string;
  tenantTableForm: UntypedFormGroup;
  jsonControlTenantArray: any;
  TenantFormControls: TenantControl;
  countryList: any;
  isUpdate = false;
  updateCountry: any;
  TenantTab: TenantModel;
  // breadScrums = [
  //   {
  //     title: "Tenant Master",
  //     items: ["Master"],
  //     active: "Tenant Master",
  //   },
  // ];
  country: any;
  countryStatus: any;
  imageData: any = {};
  companyCode: number;
  action: string;
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: true;
    toggle: boolean;
  }[];
  cOUNTRY: any;
  cOUNTRYStatus: any;
  allData: {
    companyData: any;
    timezoneData: any;
    currencyData: any;
  };
  companyDet: any;
  companyData: any;
  tIMEZONE: any;
  tIMEZONEStatus: any;
  timezoneDet: any;
  timezoneData: any;
  cURRENCY: any;
  cURRENCYStatus: any;
  currencyDet: any;
  currencyData: any;
  FileData: any;

  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private route: Router,
    private objImageHandling: ImageHandling,
    private sessionService: SessionService,
    private matDialog: MatDialog,
  ) {
    this.companyCode = this.sessionService.getCompanyCode();
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.TenantTab = route.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.imageData = {
        lOGO: this.TenantTab.lOGO,
      };
      this.submit = "Modify";
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Master",
          items: ["Masters"],
          active: "Modify Tenant",
          generatecontrol: true,
          toggle: this.TenantTab.activeFlag,
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Tenant Master",
          items: ["Masters"],
          active: "Add Tenant",
          generatecontrol: true,
          toggle: false,
        },
      ];
      this.TenantTab = new TenantModel({});
    }
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getAllMastersData();
    this.backPath = "/Masters/TenantMaster/TenantMasterList";
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.TenantFormControls = new TenantControl(this.TenantTab);
    // Get form controls for Driver Details section
    this.jsonControlTenantArray =
      this.TenantFormControls.getFormControlsTenant();
    this.jsonControlTenantArray.forEach((data) => {
      if (data.name === "cOUNTRY") {
        // Set category-related variables
        this.cOUNTRY = data.name;
        this.cOUNTRYStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "tIMEZONE") {
        // Set category-related variables
        this.tIMEZONE = data.name;
        this.tIMEZONEStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "cURRENCY") {
        // Set category-related variables
        this.cURRENCY = data.name;
        this.cURRENCYStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.tenantTableForm = formGroupBuilder(this.fb, [
      this.jsonControlTenantArray,
    ]);
  }

  async getAllMastersData() {
    try {
      const companyReq = {
        companyCode: this.companyCode,
        collectionName: "timezones",
        filter: {},
      };
      const timezoneReq = {
        companyCode: this.companyCode,
        collectionName: "timezones",
        filter: {},
      };
      const currencyReq = {
        companyCode: this.companyCode,
        collectionName: "currencies",
        filter: {},
      };
      const companyRes = await this.masterService
        .masterPost("generic/get", companyReq)
        .toPromise();
      const timezoneRes = await this.masterService
        .masterPost("generic/get", timezoneReq)
        .toPromise();
      const currencyRes = await this.masterService
        .masterPost("generic/get", currencyReq)
        .toPromise();
        console.log("currencyRes", currencyRes);
      const mergedData = {
        companyData: companyRes?.data,
        timezoneData: timezoneRes?.data,
        currencyData: currencyRes?.data,
      };
      this.allData = mergedData;
      const companyDet = mergedData.companyData.map((element) => ({
        name: element.CN,
        value: element.CNC,
      }));
      const timezoneDet = mergedData.timezoneData.map((element) => ({
        name: element.TZD,
        value: element.TZD,
      }));
      const currencyDet = mergedData.currencyData.map((element) => ({
        name: element.CURR,
        value: element.CURRS,
      }));
      console.log("currencyDet", currencyDet);
      this.companyDet = companyDet;
      this.timezoneDet = timezoneDet;
      this.currencyDet = currencyDet;
      this.filter.Filter(
        this.jsonControlTenantArray,
        this.tenantTableForm,
        companyDet,
        this.cOUNTRY,
        this.cOUNTRYStatus
      );
      this.filter.Filter(
        this.jsonControlTenantArray,
        this.tenantTableForm,
        timezoneDet,
        this.tIMEZONE,
        this.tIMEZONEStatus
      );
      this.filter.Filter(
        this.jsonControlTenantArray,
        this.tenantTableForm,
        currencyDet,
        this.cURRENCY,
        this.cURRENCYStatus
      );
      this.autofillDropdown();
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }

  autofillDropdown() {
    if (this.isUpdate) {
      this.companyData = this.companyDet.find(
        (x) => x.name == this.TenantTab.cOUNTRY
      );
      this.tenantTableForm.controls.cOUNTRY.setValue(this.companyData);

      this.timezoneData = this.timezoneDet.find(
        (x) => x.name == this.TenantTab.tIMEZONE
      );
      this.tenantTableForm.controls.tIMEZONE.setValue(this.timezoneData);

      this.currencyData = this.currencyDet.find(
        (x) => x.name == this.TenantTab.cURRENCY
      );
      this.tenantTableForm.controls.cURRENCY.setValue(this.currencyData);
    }
  }

  async save() {
    const controls = this.tenantTableForm;
    const formValue = this.tenantTableForm.value;
    // const imageControlNames = ["lOGO", "cOUNTRY", "tIMEZONE", "cURRENCY"];
    const controlNames = ["cOUNTRY","cURRENCY","tIMEZONE"];
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.tenantTableForm.controls[controlName].setValue(controlValue);
    });

    const file = this.objImageHandling.getFileByKey("lOGO", this.imageData);
    let data = {...this.tenantTableForm.value , lOGO:file};

    if (this.isUpdate) {
      let id = this.TenantTab._id;
      // Remove the "id" field from the form controls
      delete data._id;
      delete data.eNTDT;
      delete data.eNTBY;
      delete data.eNTLOC;
      let req = {
        companyCode: this.companyCode,
        collectionName: "tenants_detail",
        filter: { _id: id },
        update: data,
      };
      //API FOR UPDATE
      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/TenantMaster/TenantMasterList");
      }
    } else {
      const randomNumber = this.tenantTableForm.value.cOMCODE;
      data._id = randomNumber;
      delete data.mODBY;
      delete data.mODDT;
      delete data.mODLOC;
      //API FOR ADD
      let req = {
        companyCode: this.companyCode,
        collectionName: "tenants_detail",
        data: data,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
      console.log("res", res);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
         this.route.navigateByUrl("/Masters/TenantMaster/TenantMasterList");
      }
    }
  }

  async selectFileLogoPhoto(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "lOGO",
      this.tenantTableForm,
      this.imageData,
      "Tenant",
      "Master",
      this.jsonControlTenantArray,
      allowedFormats
    );
  }

  openImageDialog(control) {
    console.log('control' , control)
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    console.log('file' ,file)
    this.matDialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }

  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.tenantTableForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "tenants_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const tenantlist = await firstValueFrom (this.masterService.masterPost("generic/get", req));

      // Check if data exists for the given filter criteria
      if (tenantlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK"
        });

        // Reset the input field
        this.tenantTableForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }
  async CheckBrand() {
    await this.checkValueExists("bRANDLABEL", "Brand/ White label");
  }
  async CheckCompany() {
    await this.checkValueExists("cOMCODE", "Company/ Tenant code");
  }

  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.value === name);
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.tenantTableForm.controls["activeFlag"].setValue(event);
    // console.log("Toggle value :", event);
  }

  cancel() {
    this.route.navigateByUrl("/Masters/TenantMaster/TenantMasterList");
  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
}
