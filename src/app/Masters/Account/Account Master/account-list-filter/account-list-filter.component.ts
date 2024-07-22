import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { firstValueFrom, Subject, take, takeUntil } from "rxjs";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { GenericActions, StoreKeys } from "src/app/config/myconstants";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
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
  protected _onDestroy = new Subject<void>();
  jsonControlAccountQueryArray: any;
  AccountQueryForm: any;
  GroupCodeCode: any;
  GroupCodeStatus: any;
  MainCategoryCode: any;
  MainCategoryStatus: any;
  TableData: any;
  TableLoad = false;
  CompanyCode = 0;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<AccountListFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.CompanyCode = this.storageService.companyCode;
  }

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
      filter: { codeType: "MCT", activeFlag: true },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      const MainCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
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
      filter: { cATNM: Value },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      const GroupCodeType = res.data
        .map((x) => {
          return {
            name: x.gRPNM,
            value: x.gRPCD,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name in ascending order

      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        GroupCodeType,
        this.GroupCodeCode,
        this.GroupCodeStatus
      );
    }
  }

  async getAccountDropdown() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: 'account_detail',
      filters: [
        {
          D$match: {
            cID: this.CompanyCode,
            gRPCD: this.AccountQueryForm.value.GroupCode.value
          }
        },
        {
          D$project: {
            LeadgerCode: "$aCCD",
            LeadgerName: "$aCNM",
          }
        }
      ]
    };

    const res = await firstValueFrom(this.masterService.masterPost(GenericActions.Query, req));
    if (res.success && res.data.length > 0) {
      const AccountList = res.data.map((x) => {
        return {
          name: x.LeadgerName,
          value: x.LeadgerCode,
        };
      });
      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        AccountList,
        "AccountCode",
        false
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
    let Body: any = {};
    // Add values to the AccountCode array if provided
    if (this.AccountQueryForm.value.AccountCodeDropdown.length > 0) {
      Body.aCCD = {
        D$in: this.AccountQueryForm.value.AccountCodeDropdown.map((x) => x.value)
      };
    }

    // Add other properties as needed
    if (this.AccountQueryForm.value.GroupCode?.value) {
      Body.gRPCD = this.AccountQueryForm.value.GroupCode.value;
    }
    if (this.AccountQueryForm.value.MainCategory?.value) {
      Body.mATCD = this.AccountQueryForm.value.MainCategory.value;
    }

    this.dialogRef.close({ event: true, data: Body });
  }


  cancel() {
    this.dialogRef.close({ event: false, data: "" });
  }
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlAccountQueryArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlAccountQueryArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.AccountQueryForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

}
