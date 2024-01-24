import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountTdsControls } from "src/assets/FormControls/Account/account-tds-controls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-tds",
  templateUrl: "./add-tds.component.html",
})
export class AddTdsComponent implements OnInit {
  breadScrums = [
    {
      title: "TDS Master",
      items: ["Home"],
      active: "Account",
    },
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  UpdateData: any;
  isUpdate: boolean = false;
  FormTitle: string = "Add TDS";
  jsonControlArray: any;
  TdsForm: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.FormTitle = "Edit TDS";
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    const AccountFormControls = new AccountTdsControls(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray = AccountFormControls.getAccountTdsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.TdsForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    const Thresholdlimit = this.TdsForm.get("Thresholdlimit");
    Thresholdlimit.setValidators([Validators.pattern(/^[0-9]{1,100}$/)]);
    Thresholdlimit.updateValueAndValidity();
  }

  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.TdsForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "tds_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const tdslist = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );

      // Check if data exists for the given filter criteria
      if (tdslist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });

        // Reset the input field
        this.TdsForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(
        `An error occurred while fetching ${fieldName} details:`,
        error
      );
    }
  }

  async CheckTDSSection() {
    await this.checkValueExists("TDSsection", "TDS Section");
  }
  async CheckPaymentType() {
    await this.checkValueExists("PaymentType", "Nature of Payment");
    if (this.TdsForm.value.PaymentType.toLowerCase() == "purchase") {
      const Thresholdlimit = this.TdsForm.get("Thresholdlimit");
      Thresholdlimit.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{1,100}$/),
      ]);
      Thresholdlimit.updateValueAndValidity();
    } else {
      const Thresholdlimit = this.TdsForm.get("Thresholdlimit");
      Thresholdlimit.setValidators([Validators.pattern(/^[0-9]{1,100}$/)]);
      Thresholdlimit.updateValueAndValidity();
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

  async save() {
    const commonBody = {
      PaymentType: this.TdsForm.value.PaymentType,
      RateForHUF: this.TdsForm.value.RateForHUF,
      Thresholdlimit: this.TdsForm.value.Thresholdlimit,
      RateForOthers: this.TdsForm.value.RateForOthers,
      RateForITR: parseInt(this.TdsForm.value.RateForITR) || 0,
      RateForWithoutITR: parseInt(this.TdsForm.value.RateForWithoutITR) || 0,
      LowRate: parseInt(this.TdsForm.value.LowRate) || 0,
      HighRate: parseInt(this.TdsForm.value.HighRate) || 0,
      isActive: this.TdsForm.value.isActive,
    };
    if (this.isUpdate) {
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "tds_detail",
        filter: { TDScode: this.UpdateData.TDScode },
        update: commonBody,
      };
      await this.handleRequest(req);
    } else {
      const tabledata = await firstValueFrom(
        this.masterService.masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "tds_detail",
          filter: {},
        })
      );
      const index =
        parseInt(
          tabledata.data.length === 0
            ? 0
            : tabledata.data[tabledata.data.length - 1].TDScode
        ) + 1;
      // const Tdscode=`TDS${index < 9 ? "00" : index > 9 && index < 99 ? "0" : ""}${index}`
      const body = {
        _id: index,
        TDScode: index,
        TDSsection: this.TdsForm.value.TDSsection,
        eNTBY: localStorage.getItem("UserName"),
        eNTDT: new Date(),
        companyCode: this.CompanyCode,
        ...commonBody,
      };
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "tds_detail",
        data: body,
      };
      await this.handleRequest(req);
    }
  }

  async handleRequest(req: any) {
    const res = this.isUpdate
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );

    if (res.success) {
      this.Route.navigateByUrl("/Masters/AccountMaster/ListTds");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/ListTds");
  }
}
