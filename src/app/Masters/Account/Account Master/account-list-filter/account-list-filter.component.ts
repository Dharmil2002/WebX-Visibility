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
    // Call Account Code Dropdown
    this.getAccountDropdown();
  }

  async GetBalanceCategoryDropdown() {
    const Value = this.AccountQueryForm.value.MainCategory.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filters: [
        {
          D$match: {
            cATNM: Value,
          },
        },
        {
          "D$group": {
            "_id": {
              "bCATCD": "$bCATCD",
              "bCATNM": "$bCATNM"
            }
          }
        },
        {
          D$project: {
            "_id": 0,
            "bCATCD": "$_id.bCATCD",
            "bCATNM": "$_id.bCATNM"
          },
        },
      ],
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/query", Body));
    if (res.success && res.data.length > 0) {
      const GroupCodeType = res.data
        .map((x) => {
          return {
            name: x.bCATNM,
            value: x.bCATCD,
          };
        })
      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        GroupCodeType,
        "BalanceGategory",
        false
      );
    }
    // Call Account Code Dropdown
    this.getAccountDropdown();
  }
  async GetGroupCodeDropdown() {
    const MainCategory = this.AccountQueryForm.value.MainCategory.name;
    const BalanceCategory = this.AccountQueryForm.value.BalanceGategory.value;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: {
        cATNM: MainCategory,
        bCATCD: BalanceCategory
      },
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
        "GroupCode",
        false
      );
    }
    // Call Account Code Dropdown
    this.getAccountDropdown();
  }
  async GetCategoryDropdown() {
    const MainCategory = this.AccountQueryForm.value.MainCategory.name;
    const BalanceCategory = this.AccountQueryForm.value.BalanceGategory.value;
    const GroupCode = this.AccountQueryForm.value.GroupCode.value;

    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: {
        cATNM: MainCategory,
        bCATCD: BalanceCategory,
        gRPCD: GroupCode
      },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      const GroupCodeType = res.data
        .map((x) => {
          return {
            name: x.cATNM,
            value: x.cATCD,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name in ascending order

      this.filter.Filter(
        this.jsonControlAccountQueryArray,
        this.AccountQueryForm,
        GroupCodeType,
        "Category",
        false
      );
    }
    // Call Account Code Dropdown
    this.getAccountDropdown();
  }

  async getAccountDropdown() {
    let match: any = {};
    const MainCategory = this.AccountQueryForm.value.MainCategory.name;
    const BalanceCategory = this.AccountQueryForm.value.BalanceGategory.value;
    const GroupCode = this.AccountQueryForm.value.GroupCode.value;
    const Category = this.AccountQueryForm.value.Category.value;

    if (MainCategory) {
      match.mRPNM = MainCategory;
    }
    if (BalanceCategory) {
      match.bCATCD = BalanceCategory;
    }
    if (GroupCode) {
      match.gRPCD = GroupCode;
    }
    if (Category) {
      match.cATCD = Category;
    }

    const req = {
      companyCode: this.CompanyCode,
      collectionName: 'account_detail',
      filters: [
        {
          D$match: match
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
    if (res.success) {
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
    if (this.AccountQueryForm.value.BalanceGategory?.value) {
      Body.bCATCD = this.AccountQueryForm.value.BalanceGategory.value;
    }
    if (this.AccountQueryForm.value.Category?.value) {
      Body.cATCD = this.AccountQueryForm.value.Category.value;
    }
    if (this.AccountQueryForm.value.GroupCode?.value) {
      Body.gRPCD = this.AccountQueryForm.value.GroupCode.value;
    }
    if (this.AccountQueryForm.value.MainCategory?.value) {
      Body.mATCD = this.AccountQueryForm.value.MainCategory.value;
    }
    Body.iSSYS = this.AccountQueryForm.value.ActiveFlag

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
