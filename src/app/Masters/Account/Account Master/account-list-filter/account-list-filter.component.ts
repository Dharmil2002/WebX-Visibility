import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountMasterControls } from "src/assets/FormControls/AccountMasterControls";

@Component({
  selector: "app-account-list-filter",
  templateUrl: "./account-list-filter.component.html",
})
export class AccountListFilterComponent implements OnInit {
  breadScrums = [
    {
      title: "Account Master List",
      items: ["Home"],
      active: "Account Master",
    },
  ];
  jsonControlAccountQueryArray: any;
  AccountQueryForm: any;
  GroupCodeCode: any;
  GroupCodeStatus: any;
  MainCategoryCode: any;
  MainCategoryStatus: any;
  TableData: any;
  TableLoad = false;
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<AccountListFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
  }

  initializeFormControl() {
    const AccountQueryFormControls = new AccountMasterControls(false);
    this.jsonControlAccountQueryArray =
      AccountQueryFormControls.getAccountQureyArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountQueryForm = formGroupBuilder(this.fb, [
      this.jsonControlAccountQueryArray,
    ]);
  }
  bindDropdown() {
    this.jsonControlAccountQueryArray.forEach((data) => {
      if (data.name === "MainCategory") {
        // Set category-related variables
        this.MainCategoryCode = data.name;
        this.MainCategoryStatus = data.additionalData.showNameAndValue;
        this.getMainCategoryDropdown();
      }
      if (data.name === "GroupCode") {
        // Set category-related variables
        this.GroupCodeCode = data.name;
        this.GroupCodeStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  async getMainCategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "ACT", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const MainCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        MainCategoryData,
        this.MainCategoryCode,
        this.MainCategoryStatus
      );
    }
  }

  async getGroupCodeDropdown() {
    const Value = this.AccountQueryForm.value.MainCategory.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: { CategoryCode: Value },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const GroupCodeType = res.data.map((x) => {
        return {
          name: x.GroupName,
          value: x.GroupCode,
        };
      });
      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        GroupCodeType,
        this.GroupCodeCode,
        this.GroupCodeStatus
      );
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

  SelectAccountCode(event) {
    let lable;
    if (event.eventArgs.value == "SystemAccount") {
      lable = "System Account Code";
    } else if (event.eventArgs.value == "CompanyAccount") {
      lable = "Company Account Code";
    }
    this.jsonControlAccountQueryArray.forEach((element) => {
      if (element.name == "AccountCode") {
        element.label = lable;
      }
    });
  }

  save() {
    let Body;
    if (this.AccountQueryForm.value.AccountCode != "") {
      Body = {
        AccountCode: this.AccountQueryForm.value.AccountCode,
      };
    } else if (this.AccountQueryForm.value.GroupCode?.value) {
      Body = {
        SubCategoryCode: this.AccountQueryForm.value.GroupCode.value,
      };
    }else if (this.AccountQueryForm.value.GroupCode?.value){
      Body = {
        MainCategoryCode: this.AccountQueryForm.value.MainCategory.value,
      };
    }else {
      Body = {}
    }
    this.dialogRef.close({ event: true, data: Body });
  }
  cancel() {
    this.dialogRef.close({ event: false, data: "" });
  }
}
