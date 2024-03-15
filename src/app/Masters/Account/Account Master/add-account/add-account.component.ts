import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountMasterControls } from "src/assets/FormControls/AccountMasterControls";
import { AccountGroupComponent } from "../../AccoutGroupMaster/account-group/account-group.component";
import Swal from "sweetalert2";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-add-account",
  templateUrl: "./add-account.component.html",
})
export class AddAccountComponent implements OnInit {
  breadScrums = [
    {
      title: "Ledger Master",
      items: ["Home"],
      active: "Ledger Master",
    },
  ];
  jsonControlAccountArray: any;
  AccountForm: any;
  GroupCodeCode: any;
  GroupCodeStatus: any;
  MainCategoryCode: any;
  MainCategoryStatus: any;
  AccountCategoryCode: any;
  AccountCategoryStatus: any;
  CompanyNameCode: any;
  CompanyNameStatus: any;
  PartySelectionCode: any;
  PartySelectionStatus: any;
  LocationsCode: any;
  LocationsStatus: any;
  AlljsonControlAccountArray: any;
  EventButton = {
    functionName: "addNewAccountGroup",
    name: "Show Account Group",
  };
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  CompanyName: any;
  TableData: any;
  UpdateData: any;
  isUpdate: boolean = false;
  isAccountCategory: boolean = false;
  FormTitle = "Add Ledger";
  protected _onDestroy = new Subject<void>();
  FirstUpdate: boolean = false;
  backPath: string;
  jsonControlAccountCategoryArray: any;
  AccountCategoryForm: any;
  AccountLocationsCode: string;
  AccountLocationsStatus: any;
  AccountCategoryFormTitle: string;
  AlljsonControlAccountCategoryArray: any;
  Ddl_TDS_MappingStatus: any;
  Ddl_TDS_MappingCode: string;
  bankCode: any;
  bankStatus: any;
  tdsStatus: any;
  tdsCode: any;
  BalanceSheetStatus: any;
  BalanceSheetCode: any;
  tdsData: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialog: MatDialog,
    private storage: StorageService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.FormTitle = "Edit Ledger";
      this.backPath = "/Masters/AccountMaster/AccountMasterList";
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
    this.GetTableData();
    this.backPath = "/Masters/AccountMaster/AccountMasterList";
  }

  // --Ledger detail Function--
  async GetTableData() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success) {
      this.TableData = res.data;
    }
  }

  initializeFormControl() {
    const AccountFormControls = new AccountMasterControls(this.isUpdate);
    this.AlljsonControlAccountArray = AccountFormControls.getAccountAddArray();
    this.jsonControlAccountArray = AccountFormControls.getAccountAddArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountForm = formGroupBuilder(this.fb, [
      this.AlljsonControlAccountArray,
    ]);

    if (this.isUpdate) {
      this.AccountForm.controls["AccountDescription"].setValue(
        this.UpdateData.aCNM
      );
      this.AccountForm.controls["AccountCode"].setValue(this.UpdateData.aCCD);
      this.AccountForm.controls["ActiveFlag"].setValue(
        this.UpdateData.iSSYS == 0 ? false : true
      );
      this.AccountForm.controls["isTDSapplicable"].setValue(
        this.UpdateData.isTDS == 0 ? false : true
      );
      this.AccountForm.controls["bSSCH"].setValue(this.UpdateData.bSSCH);
      this.AccountForm.controls["iSTRUEPST"].setValue(
        this.UpdateData.iSTRUEPST
      );
    }
  }

  bindDropdown() {
    this.AlljsonControlAccountArray.forEach((data) => {
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
      if (data.name === "AccountCategory") {
        this.AccountCategoryCode = data.name;
        this.AccountCategoryStatus = data.additionalData.showNameAndValue;
        this.getAccountCategoryDropdown();
      }
      if (data.name === "BalanceSheet") {
        this.BalanceSheetCode = data.name;
        this.BalanceSheetStatus = data.additionalData.showNameAndValue;
        this.getBalanceSheetcategoryDropdown();
      }
      if (data.name === "PartySelection") {
        // Set category-related variables
        this.PartySelectionCode = data.name;
        this.PartySelectionStatus = data.additionalData.showNameAndValue;
        this.getPartySelectionDropdown();
      }
    });
  }

  async getAccountCategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "ACT", activeFlag: true },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const AccountCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = AccountCategoryData.find(
          (x) => x.value == this.UpdateData.cATCD
        );
        this.AccountForm.controls["AccountCategory"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        AccountCategoryData,
        this.AccountCategoryCode,
        this.AccountCategoryStatus
      );
      this.HandlAccountCategory();
    }
  }

  async getBalanceSheetcategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "BLC", activeFlag: true },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const BalanceSheetcategory = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = BalanceSheetcategory.find(
          (x) => x.name == this.UpdateData.bCATNM
        );
        this.AccountForm.controls["BalanceSheet"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        BalanceSheetcategory,
        this.BalanceSheetCode,
        this.BalanceSheetStatus
      );
    }
  }

  async getMainCategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const MainCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = MainCategoryData.find(
          (x) => x.name == this.UpdateData.mRPNM
        );
        this.AccountForm.controls["MainCategory"].setValue(element);
        this.getGroupCodeDropdown();
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        MainCategoryData,
        this.MainCategoryCode,
        this.MainCategoryStatus
      );
    }
  }

  async getGroupCodeDropdown() {
    this.AccountForm.controls["GroupCode"].setValue("");
    const Value = this.AccountForm.value.MainCategory.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: { cATNM: Value },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const GroupCodeData = res.data.map((x) => {
        return {
          name: x.gRPNM,
          value: x.gRPCD,
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = GroupCodeData.find(
          (x) => x.value == this.UpdateData.gRPCD
        );
        this.AccountForm.controls["GroupCode"].setValue(element);
        this.FirstUpdate = true;
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        GroupCodeData,
        this.GroupCodeCode,
        this.GroupCodeStatus
      );
    }
  }

  async getBankDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "Bank_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      let BankData = [];
      res.data.forEach((x) => {
        BankData.push({
          name: x.Bankname,
          value: x.Accountnumber,
        });
      });
      if (this.isUpdate) {
        const bank = this.UpdateData.bANCD;
        const selectedData = BankData.find(
          (x) => x.value == bank || x.name == bank
        );
        this.AccountForm.controls["bank"].setValue(selectedData);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        BankData,
        "bank",
        false
      );
    }
  }
  async getTdsDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "tds_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      let TDSData = [];
      res.data.forEach((x) => {
        TDSData.push({
          name: x.TDSsection,
          value: x.TDScode,
          data: x,
        });
      });
      if (this.isUpdate) {
        const bank = this.UpdateData.tSEC;
        const selectedData = TDSData.find(
          (x) => x.value == bank || x.name == bank
        );
        this.AccountForm.controls["TDSsection"].setValue(selectedData);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        TDSData,
        "TDSsection",
        false
      );
    }
  }
  async getPartySelectionDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "PAR", activeFlag: true },
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const PartySelectionData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = PartySelectionData.find(
          (x) => x.name == this.UpdateData.pARTNM
        );
        this.AccountForm.controls["PartySelection"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        PartySelectionData,
        this.PartySelectionCode,
        this.PartySelectionStatus
      );
    }
  }
  async getAccountDescription() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      const FilterData = res.data.filter(
        (x) =>
          x.AccountDescription ==
          this.AccountForm.value.AccountDescription.trim()
      );
      if (FilterData.length > 0) {
        if (!this.isUpdate) {
          this.AccountForm.controls["AccountDescription"].setValue("");
        } else if (this.AccountForm.value.aCNM.trim() != this.UpdateData.aCNM) {
          this.AccountForm.controls["AccountDescription"].setValue("");
        }
      }
    }
  }

  HandlAccountCategory() {
    if (this.AccountForm.value.AccountCategory.name === "BANK") {
      this.isBankField();
    } else if (this.AccountForm.value.AccountCategory.name === "TDS") {
      this.isTDSField();
    } else {
      this.RemoveField();
    }
  }

  isTDSField() {
    const bankfiled = ["TDSsection", "bank"];
    this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
      (x) => !bankfiled.includes(x.name)
    );
    this.toggleTDSExempted();
    this.AccountForm.get("TDSsection").clearValidators();
    this.AccountForm.get("TDSsection").updateValueAndValidity();
    this.AccountForm.get("TDSsection").setValue("");
    this.AccountForm.get("bank").clearValidators();
    this.AccountForm.get("bank").setValue("");
    this.AccountForm.get("bank").updateValueAndValidity();
  }

  isBankField() {
    const bankfiled = ["TDSsection", "isTDSapplicable"];
    this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
      (x) => !bankfiled.includes(x.name)
    );
    this.AccountForm.get("bank").setValidators([
      Validators.required,
      autocompleteObjectValidator(),
    ]);
    this.AccountForm.get("bank").updateValueAndValidity();
    this.getBankDropdown();
    this.AccountForm.get("TDSsection").clearValidators();
    this.AccountForm.get("TDSsection").updateValueAndValidity();
    this.AccountForm.get("TDSsection").setValue("");
  }

  RemoveField() {
    const tdfield = ["bank", "isTDSapplicable", "TDSsection"];
    this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
      (x) => !tdfield.includes(x.name)
    );
    this.AccountForm.get("TDSsection").clearValidators();
    this.AccountForm.get("TDSsection").updateValueAndValidity();
    this.AccountForm.get("TDSsection").setValue("");
    this.AccountForm.get("bank").clearValidators();
    this.AccountForm.get("bank").setValue("");
    this.AccountForm.get("bank").updateValueAndValidity();
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlAccountArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlAccountArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.AccountForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  addNewAccountGroup() {
    const dialogRef = this.dialog.open(AccountGroupComponent, {
      data: {},
      width: "1000px",
      height: "500px",
      disableClose: true,
    });
  }

  toggleTDSExempted() {
    const TDSExemptedValue = this.AccountForm.value.isTDSapplicable;
    if (TDSExemptedValue) {
      const bankfiled = ["bank"];
      this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
        (x) => !bankfiled.includes(x.name)
      );
      this.AccountForm.get("TDSsection").setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      this.AccountForm.get("TDSsection").updateValueAndValidity();
      this.getTdsDropdown();
    } else {
      const bankfiled = ["TDSsection", "bank"];
      this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
        (x) => !bankfiled.includes(x.name)
      );
      this.AccountForm.get("TDSsection").clearValidators();
      this.AccountForm.get("TDSsection").updateValueAndValidity();
      this.AccountForm.get("TDSsection").setValue("");
    }
  }

  async save() {
    const commonBody = {
      aCNM: this.AccountForm.value.AccountDescription,
      mATCD: this.AccountForm.value.MainCategory.value,
      mRPNM: this.AccountForm.value.MainCategory.name,
      gRPCD: this.AccountForm.value.GroupCode.value,
      gRPNM: this.AccountForm.value.GroupCode.name,
      cATCD: this.AccountForm.value.AccountCategory.value,
      cATNM: this.AccountForm.value.AccountCategory.name,
      bCATCD: this.AccountForm.value.BalanceSheet.value,
      bCATNM: this.AccountForm.value.BalanceSheet.name,
      bANCD: this.AccountForm.value.bank.value || "",
      bANM: this.AccountForm.value.bank.name || "",
      isTDS: this.AccountForm.value.isTDSapplicable,
      bSSCH: this.AccountForm.value.bSSCH,
      iSTRUEPST: this.AccountForm.value.iSTRUEPST,
      tSEC: this.AccountForm.value.isTDSapplicable
        ? this.AccountForm.value.TDSsection?.name || ""
        : "",
      iSSYS: this.AccountForm.value.ActiveFlag,
      pARTNM: this.AccountForm.value.PartySelection.name,
      rHUF: this.AccountForm.value.isTDSapplicable
        ? this.AccountForm.value.TDSsection?.data?.RateForHUF || ""
        : "",
      rOTHER: this.AccountForm.value.isTDSapplicable
        ? this.AccountForm.value.TDSsection?.data?.RateForOthers || ""
        : "",
    };
    if (!this.isUpdate) {
      const index =
        this.TableData.length === 0
          ? 1
          : parseInt(
              this.TableData[this.TableData.length - 1].aCCD.substring(3)
            ) + 1;
      const accountcode = `${this.AccountForm.value.GroupCode.name.substr(
        0,
        3
      )}${index < 9 ? "00" : index > 9 && index < 99 ? "0" : ""}${index}`;

      commonBody["_id"] = `${this.CompanyCode}-${accountcode}`;
      commonBody["aCCD"] = accountcode;
      commonBody["cID"] = this.CompanyCode;
      commonBody["eNTDT"] = new Date();
      commonBody["eNTLOC"] = this.storage.branch;
      commonBody["eNTBY"] = this.storage.userName;
    } else {
      commonBody["mODDT"] = new Date();
      commonBody["mODLOC"] = this.storage.branch;
      commonBody["mODBY"] = this.storage.userName;
    }
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: this.isUpdate ? { aCCD: this.UpdateData.aCCD } : undefined,
      update: this.isUpdate ? commonBody : undefined,
      data: this.isUpdate ? undefined : commonBody,
    };

    const res = this.isUpdate
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );

    if (res.success) {
      this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
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
