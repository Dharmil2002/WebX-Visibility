import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountTdsControls } from "src/assets/FormControls/Account/account-tds-controls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import Swal from "sweetalert2";

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
      console.log("this.UpdateData", this.UpdateData);
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
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async hendelsave(body) {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "tds_detail",
      filter: this.isUpdate
        ? { AccountCode: this.UpdateData.AccountCode }
        : undefined,
      update: this.isUpdate ? body : undefined,
      data: this.isUpdate ? undefined : body,
    };

    const res = this.isUpdate
      ? await this.masterService.masterPut("generic/update", req).toPromise()
      : await this.masterService.masterPost("generic/create", req).toPromise();

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

  async save() {
    const commonBody = {
      TDSsection: this.TdsForm.value.TDSSection,
      PaymentType: this.TdsForm.value.PaymentType,
      RateForHUF: this.TdsForm.value.RateForHUF,
      Thresholdlimit: this.TdsForm.value.Thresholdlimit,
      RateForOthers: this.TdsForm.value.RateForOthers,
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
      const tabledata = await this.masterService
        .masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "tds_detail",
          filter: {},
        })
        .toPromise();
      const body = {
        TDScode:
          tabledata.data.length === 0
            ? 1
            : tabledata.data[tabledata.data.length - 1].TDScode + 1,
        entryBy: localStorage.getItem("UserName"),
        entryDate: new Date(),
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
      ? await this.masterService.masterPut("generic/update", req).toPromise()
      : await this.masterService.masterPost("generic/create", req).toPromise();

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
