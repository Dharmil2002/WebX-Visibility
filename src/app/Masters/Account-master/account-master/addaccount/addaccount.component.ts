import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountControls } from "src/assets/FormControls/Account/account-controls";
import Swal from "sweetalert2";

@Component({
  selector: "app-addaccount",
  templateUrl: "./addaccount.component.html",
})
export class AddaccountComponent implements OnInit {
  breadScrums = [
    {
      title: "Account Master",
      items: ["Home"],
      active: "Account",
    },
  ];
  isUpdate: any;
  jsonControlArray: any;
  AccountForm: any;
  UpdateData: any;
  FormTitle: string = "Add Account";
  AcGroupCategoryCode: string;
  AcGroupCategoryStatus: any;
  BalanceSheetCode: string;
  BalanceSheetStatus: any;
  AcGroupCode: string;
  AcGroupStatus: any;
  AcLedgerCode: string;
  AcLedgerStatus: any;
  TDSsectionCode: string;
  TDSsectionStatus: any;
  CompanyCode: any = parseInt(localStorage.getItem("companyCode"));
  FirstUpdate: any = false;
  AlljsonControlArray: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.FormTitle = "Edit Account";
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
  }

  initializeFormControl() {
    const BankFormControls = new AccountControls(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray = BankFormControls.getAccountArray();
    this.AlljsonControlArray = BankFormControls.getAccountArray();

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "AcGroupCategory") {
        // Set AcGroupCategory variables
        this.AcGroupCategoryCode = data.name;
        this.AcGroupCategoryStatus = data.additionalData.showNameAndValue;
        this.getAcGroupCategoryDropdown();
      }
      if (data.name === "AcGroup") {
        // Set AcGroup variables
        this.AcGroupCode = data.name;
        this.AcGroupStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "BalanceSheet") {
        // Set BalanceSheet variables
        this.BalanceSheetCode = data.name;
        this.BalanceSheetStatus = data.additionalData.showNameAndValue;
        this.getBalanceSheetDropdown();
      }
      if (data.name === "TDSsection") {
        // Set TDSsection variables
        this.TDSsectionCode = data.name;
        this.TDSsectionStatus = data.additionalData.showNameAndValue;
        this.toggleTDSExempted("")
      }
    });
  }

  toggleTDSExempted(event) {
    const TDSExemptedValue = this.AccountForm.value.isTDSapplicable;
    if (TDSExemptedValue) {
      this.jsonControlArray =
        this.AlljsonControlArray;
      const TDSSection =
        this.AccountForm.get("TDSsection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      TDSSection.updateValueAndValidity();

      this.getTDSsectionDropdown();
    } else {
      this.jsonControlArray =
        this.AlljsonControlArray.filter(
          (x) => x.name != "TDSsection"
        );
      const TDSSection =
        this.AccountForm.get("TDSsection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      TDSSection.updateValueAndValidity();
    }
  }

  async getAcGroupCategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const AcGroupdata = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = AcGroupdata.find(
          (x) => x.name == this.UpdateData.AcGroupCategoryName
        );
        this.AccountForm.controls["AcGroupCategory"].setValue(element);
        this.getAcGroupDropdown();
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.AccountForm,
        AcGroupdata,
        this.AcGroupCategoryCode,
        this.AcGroupCategoryStatus
      );
    }
  }

  async getAcGroupDropdown() {
    this.AccountForm.controls["AcGroup"].setValue("");
    const Value = this.AccountForm.value.AcGroupCategory.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "Acgroup_detail",
      filter: { AcGroupCatName: Value },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const AcGroupdata = res.data.map((x) => {
        return {
          name: x.GroupName,
          value: x.Groupcode,
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = AcGroupdata.find(
          (x) => x.name == this.UpdateData.AcGroupName
        );
        this.AccountForm.controls["AcGroup"].setValue(element);
        this.FirstUpdate = true;
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.AccountForm,
        AcGroupdata,
        this.AcGroupCode,
        this.AcGroupStatus
      );
    }
  }

  async getBalanceSheetDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "ACT", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const BalanceSheetdata = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = BalanceSheetdata.find(
          (x) => x.name == this.UpdateData.BalanceSheetName
        );
        this.AccountForm.controls["BalanceSheet"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.AccountForm,
        BalanceSheetdata,
        this.BalanceSheetCode,
        this.BalanceSheetStatus
      );
    }
  }

  async getTDSsectionDropdown() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "tds_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (res.success) {
      const TDSsectiondata = res.data.map((x) => {
        return {
          name: x.TDSsection,
          value: x.TDScode,
        };
      });

      if (this.isUpdate) {
        const element = TDSsectiondata.find(
          (x) => x.name == this.UpdateData.TDSsection
        );
        this.AccountForm.controls["TDSsection"].setValue(element);
      }

      this.filter.Filter(
        this.jsonControlArray,
        this.AccountForm,
        TDSsectiondata,
        this.TDSsectionCode,
        this.TDSsectionStatus
      );

    }
  }
  async save() {
    const commonBody = {
      AcGroupName: this.AccountForm.value.AcGroup.name,
      AcGroupCode: this.AccountForm.value.AcGroup.value,
      AcGroupCategoryName: this.AccountForm.value.AcGroupCategory.name,
      BalanceSheetName: this.AccountForm.value.BalanceSheet.name,
      AcLedger: this.AccountForm.value.AcLedger,
      isSystemledger: this.AccountForm.value.isSystemledger,
      isTDSapplicable: this.AccountForm.value.isTDSapplicable,
      TDSsection:this.AccountForm.value.isTDSapplicable?this.AccountForm.value.TDSsection.name:"",
    };
    if (this.isUpdate) {
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "accountdetail",
        filter: { AcLedgerCode: this.UpdateData.AcLedgerCode },
        update: commonBody,
      };
      await this.handleRequest(req);
    } else {
      const tabledata = await this.masterService
        .masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "accountdetail",
          filter: {},
        })
        .toPromise();
      const body = {
        AcLedgerCode:
          tabledata.data.length === 0
            ? 1
            : tabledata.data[tabledata.data.length - 1].AcLedgerCode + 1,
        entryBy: localStorage.getItem("UserName"),
        entryDate: new Date(),
        companyCode: this.CompanyCode,
        ...commonBody,
      };
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "accountdetail",
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
      this.Route.navigateByUrl("/Masters/AccountMaster/ListAccount");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/ListAccount");
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
