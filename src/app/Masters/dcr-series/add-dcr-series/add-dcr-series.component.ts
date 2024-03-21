import { StorageService } from './../../../core/service/storage.service';
import { Component, Input, OnInit } from "@angular/core";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import Swal from "sweetalert2";
import { AddDcrSeriesControl } from "src/assets/FormControls/add-dcr-series";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { processProperties } from "../../processUtility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { getCodesBetween, nextKeyCode, nextKeyCodeByN } from "src/app/Utility/commonFunction/stringFunctions";
import { patternValidator } from "src/app/Utility/Form Utilities/setform";
import moment from 'moment';
import { DcrEvents } from 'src/app/Models/docStatus';

@Component({
  selector: "app-add-dcr-series",
  templateUrl: "./add-dcr-series.component.html",
})
export class AddDcrSeriesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @Input() data: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  // Breadcrumbs
  breadScrums = [
    {
      title: "Add DCR Series",
      items: ["Document Control"],
      active: "Add DCR Series",
    },
  ];

  // Table data
  tableData: any = [];

  tableLoad: boolean;
  addDcrFormControl: AddDcrSeriesControl;
  jsonControlArray: any;
  addDcrTableForm: UntypedFormGroup;
  allotTo: string;
  allotToStatus: boolean;
  allocateTo: string;
  allocateToStatus: boolean;
  businessTypeStatus: boolean;
  businessType: string;

  isUpdate = false;

  businessTypeList: any;
  userList: any;
  locationList: any;
  isLoad: boolean = false;
  vendorList: any;
  customerList: any;
  dcrDetail: any;
  backPath: string;
  dcrRules: any;
  constructor(
    public objSnackBarUtility: SnackBarUtilityService,
    private masterService: MasterService,
    private storage: StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private router: Router
  ) {
    super();
    this.initializeFormControl();
  }

  ngOnInit() {
    this.bindDropdown();
    this.backPath="/Operation/DCRManagement"
  }


  // Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  //#region to Save data
  async saveData() {
    // console.log(this.addDcrTableForm.value);
    const dcr = {
      _id: `${this.companyCode}-${this.addDcrTableForm.value.documentType}-${this.addDcrTableForm.value.bookCode}`,
      cID: this.companyCode,
      tYP: this.addDcrTableForm.value.documentType,
      bOOK: this.addDcrTableForm.value.bookCode,
      oBOOK: this.addDcrTableForm.value.bookCode,
      fROM: this.addDcrTableForm.value.seriesFrom,
      tO: this.addDcrTableForm.value.seriesTo,
      pAGES: this.addDcrTableForm.value.totalLeaf,
      sTS: DcrEvents.Added,
      sTSN: DcrEvents[DcrEvents.Added],
      uSED: 0,
      vOID: 0,
      cN: false,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
    };

    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "dcr_header",
      data: dcr,
    };

    const dcrHistory = {
      _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${moment().format("YYDDMM-HHmmss")}`,
      cID: dcr.cID,
      tYP: dcr.tYP,
      bOOK: dcr.bOOK,
      eVN: DcrEvents.Added,
      eVNNM: DcrEvents[DcrEvents.Added],
      fROM: dcr.fROM,
      tO: dcr.tO,
      eNTBY: dcr.eNTBY,
      eNTDT: dcr.eNTDT,
      eNTLOC: dcr.eNTLOC
    };

    let reqHis = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "dcr_history",
      data: dcrHistory,
    };

    const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
    if (res) {
      const resHis = await firstValueFrom(this.masterService.masterPost("generic/create", reqHis));
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
        didClose: () => {
          // This function will be called when the modal is fully closed and destroyed
          this.router.navigateByUrl(
            "/Operation/DCRManagement"
          );
        }
      });
    }
  }
  //#endregion
  async allocate() {
    this.router.navigateByUrl("/Masters/AddDCR/DCRAllocation");
  }
  //#region  to check unique book code
  async isBookCodeUnique(): Promise<boolean> {
    const bookCode = this.addDcrTableForm.value.bookCode;
    const docType = this.addDcrTableForm.value.documentType;

    // this.addDcrTableForm.controls.allocateTo.setValue("");
    const reqBook = {
      companyCode: this.companyCode,
      collectionName: "dcr_header",
      filter: { cID: this.storage.companyCode, tYP: docType, bOOK:  bookCode},
    };

    const resBook = await firstValueFrom(this.masterService.masterPost("generic/getOne", reqBook) );
    const foundItem = resBook?.data || null;
    if (foundItem && foundItem.bOOK) {
      this.addDcrTableForm.controls["bookCode"].setValue("");
      Swal.fire({
        title: "error",
        text: `Book Code [${bookCode}] already exists! Please try with another.`,
        icon: "error",
        showConfirmButton: true,
      });
      return false;
    }
  }

  async isSeriesExists(): Promise<boolean> {
    const docType = this.addDcrTableForm.value.documentType;
    const seriesFrom = this.addDcrTableForm.value.seriesFrom;
    const seriesTo = this.addDcrTableForm.value.seriesTo;

      // this.addDcrTableForm.controls.allocateTo.setValue("");
      let filter = {}
      if(!seriesTo){
        filter = {
          cID: this.storage.companyCode,
          tYP: docType,
          D$or: [
            { fROM: { D$lte: seriesFrom }, tO: { D$gte: seriesFrom } }, // Check if the value is within any range
            { fROM: seriesFrom }, // Check if the value is the same as the 'from' value of any range
            { tO: seriesFrom }   // Check if the value is the same as the 'to' value of any range
          ]
        };
      }
      else {
        filter = {
          cID: this.storage.companyCode,
          tYP: docType,
          D$or:  [
            { fROM: { D$lte: seriesTo }, tO: { D$gte: seriesFrom } }, // Overlapping ranges
            { fROM: { D$gte: seriesFrom }, tO: { D$lte: seriesTo } }, // Contained ranges
            { fROM: { D$gte: seriesFrom, D$lte: seriesTo } },        // From within range
            { tO: { D$gte: seriesFrom, D$lte: seriesTo } }           // To within range
          ]
        };
      }

      const req = {
        companyCode: this.companyCode,
        collectionName: "dcr_header",
        filter: filter
      };

      const res = await firstValueFrom(this.masterService.masterPost("generic/getOne", req) );
      const foundItem = res?.data || null;
      if (foundItem && foundItem.bOOK) {
        this.addDcrTableForm.controls["seriesFrom"].setValue("");
        this.addDcrTableForm.controls["seriesTo"].setValue("");
        let s = seriesFrom + (seriesTo ? " - "+ seriesTo : "");
        Swal.fire({
          title: "error",
          text: `Series [${s}] exists within a book ${foundItem.bOOK}.! Please try with another.`,
          icon: "error",
          showConfirmButton: true,
        });
        return false;
      }
  }
  //#endregion
  //#region to Initialize form control
  initializeFormControl() {
    this.addDcrFormControl = new AddDcrSeriesControl();
    this.jsonControlArray = this.addDcrFormControl.getAddDcrFormControls();
    this.addDcrTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    // this.addDcrTableForm.controls["documentType"].setValue("dkt");
  }

  //#endregion
  //#region to set series to.
  getSeriesTo() {
    // Get the 'seriesFrom' and 'totalLeaf' values from the form control
    const { seriesFrom, totalLeaf } = this.addDcrTableForm.value;

    const toCode = nextKeyCodeByN(seriesFrom, parseInt(totalLeaf)-1);

    this.addDcrTableForm.controls.seriesTo.setValue(toCode);

    this.isSeriesExists();
  }
  //#endregion

  //#region to bind dropdown
  bindDropdown() {
    const dcrPropertiesMapping = {
      businessType: { variable: "businessType", status: "businessTypeStatus" },
    };
    processProperties.call(this, this.jsonControlArray, dcrPropertiesMapping);
  }
  //#endregion

  //#region to set pattern from json

  async getRules(){
    const documentType = this.addDcrTableForm.value.documentType;
      const req = {
        companyCode: this.companyCode,
        collectionName: "dcr_rules",
        filter: {
          cID: this.companyCode,
          dOCID: this.addDcrTableForm.value.documentType
        },
      };
      const res = await firstValueFrom(this.masterService.masterPost("generic/getOne", req) );
      this.dcrRules = res.data;
  }


  async getPattern() {
    try {
      await this.getRules();

      if (!this.dcrRules || !this.dcrRules.rEQ) {
        console.log("No matching patterns found.");
        return;
      }
      const controlName = "seriesFrom"; // Change this to match your control's name
      const control = this.addDcrTableForm.get(controlName);

      if (control) {
        const customValidations = [
          Validators.required, // Add the required validator with its default error message
          //Validators.pattern(this.dcrRules.rRGXPTRN), // Add the pattern validator with its default error message
          patternValidator(this.dcrRules.rRGXPTRN, this.dcrRules.mSG) // Add the pattern validator with custome error message
        ];

        // Set custom error messages for required and pattern validations
        control.setValidators(customValidations);
        control.updateValueAndValidity(); // Update the control's validity

        // console.log(control);
      } else {
        console.log("Control not found.");
      }
    } catch (error) {
      console.error("Error while fetching regex patterns:", error);
    }
  }
  //#endregion
}
