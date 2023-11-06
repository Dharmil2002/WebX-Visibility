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
import { Subject, take, takeUntil } from "rxjs";

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
  jsonControlAccountCategoryArray: any;
  AccountCategoryForm: any;
  AccountLocationsCode: string;
  AccountLocationsStatus: any;
  AccountCategoryFormTitle: string;
  AlljsonControlAccountCategoryArray: any;
  Ddl_TDS_MappingStatus: any;
  Ddl_TDS_MappingCode: string;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialog: MatDialog
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.UpdateData", this.UpdateData);
      this.isUpdate = true;
      this.FormTitle = "Edit Ledger";
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
    this.GetTableData();
  }

  // --Ledger detail Function--
  async GetTableData() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
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
      this.jsonControlAccountArray,
    ]);

    if (this.isUpdate) {
      this.AccountForm.controls["AccountDescription"].setValue(
        this.UpdateData.AccountDescription
      );
      this.AccountForm.controls["AccountCode"].setValue(
        this.UpdateData.AccountCode
      );
      this.AccountForm.controls["ActiveFlag"].setValue(
        this.UpdateData.ActiveFlag
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
      if (data.name === "Locations") {
        // Set category-related variables
        this.LocationsCode = data.name;
        this.LocationsStatus = data.additionalData.showNameAndValue;
        this.getLocationsDropdown();
      }

      if (data.name === "AccountCategory") {
        this.AccountCategoryCode = data.name;
        this.AccountCategoryStatus = data.additionalData.showNameAndValue;
        this.getAccountCategoryDropdown();
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

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const AccountCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = AccountCategoryData.find(
          (x) => x.name == this.UpdateData.AccountCategoryName
        );
        this.AccountForm.controls["AccountCategory"].setValue(element);
        this.HandlAccountCategory();
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        AccountCategoryData,
        this.AccountCategoryCode,
        this.AccountCategoryStatus
      );
    }
  }

  async getMainCategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
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
      if (this.isUpdate) {
        const element = MainCategoryData.find(
          (x) => x.name == this.UpdateData.MainCategoryName
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
      filter: { CategoryCode: Value },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();

    if (res.success && res.data.length > 0) {
      const GroupCodeData = res.data.map((x) => {
        return {
          name: x.GroupName,
          value: x.GroupCode,
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = GroupCodeData.find(
          (x) => x.value == this.UpdateData.SubCategoryCode
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

  async getLocationsDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "location_detail",
      filter: {},
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();

    if (res.success && res.data.length > 0) {
      let LocationsData = [];
      res.data.forEach((x) => {
        LocationsData.push({
          name: x.locName,
          value: x.locCode,
        });
      });
      if (this.isUpdate) {
        const Locetion = this.UpdateData.AccountingLocations;
        const selectedData = LocationsData.filter((x) =>
          Locetion.includes(x.value)
        );
        this.AccountForm.controls["LocationsDrop"].setValue(selectedData);
      }
      this.filter.Filter(
        this.jsonControlAccountArray,
        this.AccountForm,
        LocationsData,
        this.LocationsCode,
        this.LocationsStatus
      );
    }
  }

  async getPartySelectionDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "PAR", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const PartySelectionData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = PartySelectionData.find(
          (x) => x.name == this.UpdateData.PartySelection
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
    console.log("ok");
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const FilterData = res.data.filter(
        (x) =>
          x.AccountDescription ==
          this.AccountForm.value.AccountDescription.trim()
      );
      if (FilterData.length > 0) {
        if (!this.isUpdate) {
          this.AccountForm.controls["AccountDescription"].setValue("");
        } else if (
          this.AccountForm.value.AccountDescription.trim() !=
          this.UpdateData.AccountDescription
        ) {
          this.AccountForm.controls["AccountDescription"].setValue("");
        }
      }
    }
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
  // --End-- //

  // --Handl Account Category Function--
  HandlAccountCategory() {
    this.isAccountCategory = false;
    if (
      ["BANK", "EXPENSE", "TDS", "TCS"].includes(
        this.AccountForm.value.AccountCategory.name
      )
    ) {
      this.initializeAccountCategory();
    }
  }
  initializeAccountCategory() {
    const AccountFormControls = new AccountMasterControls(this.isUpdate);
    this.jsonControlAccountCategoryArray =
      AccountFormControls.getAccountCategoryArray(
        this.AccountForm.value.AccountCategory.name
      );
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountCategoryForm = formGroupBuilder(this.fb, [
      this.jsonControlAccountCategoryArray,
    ]);
    this.bindAccountCategoryDropdown();
  }
  bindAccountCategoryDropdown() {
    const ACdetail = this.isUpdate ? this.UpdateData.ACdetail : "";
    if (
      ["BANK", "EXPENSE", "TDS", "TCS"].includes(
        this.AccountForm.value.AccountCategory.name
      )
    ) {
      if (this.AccountForm.value.AccountCategory.name == "BANK") {
        this.AccountCategoryFormTitle =
          "Provide Location detail for a Bank account";
        this.jsonControlAccountCategoryArray.forEach((data) => {
          if (data.name === "AccountLocations") {
            // Set category-related variables
            this.AccountLocationsCode = data.name;
            this.AccountLocationsStatus = data.additionalData.showNameAndValue;
            this.getAccountLocationsDropdown();
          }
        });
        if (
          this.isUpdate &&
          this.AccountForm.value.AccountCategory.name ==
            this.UpdateData.AccountCategoryName
        ) {
          this.AccountCategoryForm.controls["AccountNumber"].setValue(
            ACdetail.ACno
          );
        }
      } else if (this.AccountForm.value.AccountCategory.name == "EXPENSE") {
        // debugger
        this.AccountCategoryFormTitle = "TDS Applicable Details";
        this.jsonControlAccountCategoryArray.forEach((data) => {
          if (data.name === "Ddl_TDS_Mapping") {
            // Set category-related variables
            this.Ddl_TDS_MappingCode = data.name;
            this.Ddl_TDS_MappingStatus = data.additionalData.showNameAndValue;
            if (
              this.isUpdate &&
              this.AccountForm.value.AccountCategory.name ==
                this.UpdateData.AccountCategoryName
            ) {
              this.AccountCategoryForm.controls["isTDSApplicable"].setValue(
                ACdetail.isTDSApplicable
              );
              this.AccountCategoryForm.controls["isTDSMapping"].setValue(
                ACdetail.isTDSMapping
              );
              data.generatecontrol = !ACdetail.isTDSMapping;
            }
          }
        });
        this.getDdlTDSMappingDropdown();
      } else if (this.AccountForm.value.AccountCategory.name == "TCS") {
        this.AccountCategoryFormTitle = "Provide TCS Details";
        if (
          this.isUpdate &&
          this.AccountForm.value.AccountCategory.name ==
            this.UpdateData.AccountCategoryName
        ) {
          this.AccountCategoryForm.controls["NonCorporateTCS"].setValue(
            ACdetail.NonCorporateTCS
          );
          this.AccountCategoryForm.controls["CorporateTCS"].setValue(
            ACdetail.CorporateTCS
          );
        }
      } else if (this.AccountForm.value.AccountCategory.name == "TDS") {
        this.AccountCategoryFormTitle = "Provide TDS Details";
        if (
          this.isUpdate &&
          this.AccountForm.value.AccountCategory.name ==
            this.UpdateData.AccountCategoryName
        ) {
          this.AccountCategoryForm.controls["NonCorporateTDS"].setValue(
            ACdetail.NonCorporateTDS
          );
          this.AccountCategoryForm.controls["CorporateTDS"].setValue(
            ACdetail.CorporateTDS
          );
        }
      }
    }

    this.isAccountCategory = true;
  }
  HandleisTDSMapping(event) {
    console.log("event", event);
    const checked = event.eventArgs.checked;
    this.jsonControlAccountCategoryArray.forEach((x) => {
      if (x.name == "Ddl_TDS_Mapping") {
        x.generatecontrol = !checked;
      }
    });
    if (checked) {
      this.AccountCategoryForm.get("Ddl_TDS_Mapping").clearValidators();
      this.AccountCategoryForm.updateValueAndValidity();
    } else {
      this.AccountCategoryForm.get("Ddl_TDS_Mapping").setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      this.AccountCategoryForm.updateValueAndValidity();
    }
  }
  async getDdlTDSMappingDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: { AccountCategoryName: "TDS" },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    console.log("res", res);
    if (res.success && res.data.length > 0) {
      let DdlTDSData = [];
      res.data.forEach((x) => {
        DdlTDSData.push({
          name: x.AccountDescription,
          value: x.AccountCode,
        });
      });
      // debugger;
      if (
        this.isUpdate &&
        this.AccountForm.value.AccountCategory.name ==
          this.UpdateData.AccountCategoryName
      ) {
        if (!this.UpdateData.ACdetail.isTDSMapping) {
          const selectedData = DdlTDSData.find(
            (x) => x.value == this.UpdateData.ACdetail.DdlTDSMapping
          );
          console.log('old' , this.AccountCategoryForm.value.Ddl_TDS_Mapping)
          // this.AccountCategoryForm.controls["Ddl_TDS_Mapping"].setValue(selectedData);
          this.AccountCategoryForm.controls["Ddl_TDS_Mapping"].setValue(
            selectedData
          );
          console.log('letest' , this.AccountCategoryForm.value.Ddl_TDS_Mapping)

        } else {
          this.AccountCategoryForm.get("Ddl_TDS_Mapping").clearValidators();
          this.AccountCategoryForm.updateValueAndValidity();
        }
      }
      this.filter.Filter(
        this.jsonControlAccountCategoryArray,
        this.AccountCategoryForm,
        DdlTDSData,
        this.Ddl_TDS_MappingCode,
        this.Ddl_TDS_MappingStatus
      );
    }
  }
  async getAccountLocationsDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "location_detail",
      filter: {},
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();

    if (res.success && res.data.length > 0) {
      let LocationsData = [];
      res.data.forEach((x) => {
        LocationsData.push({
          name: x.locName,
          value: x.locCode,
        });
      });
      if (
        this.isUpdate &&
        this.AccountForm.value.AccountCategory.name ==
          this.UpdateData.AccountCategoryName
      ) {
        const Locetion = this.UpdateData.ACdetail.AccountLocations;
        const selectedData = LocationsData.filter((x) =>
          Locetion.includes(x.value)
        );
        this.AccountCategoryForm.controls["AccountLocationsDrop"].setValue(
          selectedData
        );
      }
      this.filter.Filter(
        this.jsonControlAccountCategoryArray,
        this.AccountCategoryForm,
        LocationsData,
        this.AccountLocationsCode,
        this.AccountLocationsStatus
      );
    }
  }
  toggleSelectAccountLocationsAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlAccountCategoryArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlAccountCategoryArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.AccountCategoryForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  // --End-- //

  // --Additional Function--
  addNewAccountGroup() {
    const dialogRef = this.dialog.open(AccountGroupComponent, {
      data: {},
      width: "1000px",
      height: "500px",
      disableClose: true,
    });
  }

  getAccountCategorydetail() {
    console.log("AccountCategoryForm", this.AccountCategoryForm);
    const AccountCategory = this.AccountForm.value.AccountCategory.name;
    const FormData = this.AccountCategoryForm.value;
    if (AccountCategory == "BANK") {
      return {
        ACno: FormData.AccountNumber,
        AccountLocations:
          FormData.AccountLocationsDrop == ""
            ? []
            : FormData.AccountLocationsDrop.map((x) => x.value),
      };
    } else if (AccountCategory == "EXPENSE") {
      if (FormData.isTDSMapping) {
        return {
          isTDSApplicable: FormData.isTDSApplicable,
          isTDSMapping: FormData.isTDSMapping,
        };
      } else {
        return {
          isTDSApplicable: FormData.isTDSApplicable,
          isTDSMapping: FormData.isTDSMapping,
          DdlTDSMapping: FormData.Ddl_TDS_Mapping.value,
        };
      }
    } else if (AccountCategory == "TCS") {
      return {
        CorporateTCS: parseFloat(FormData.CorporateTCS),
        NonCorporateTCS: parseFloat(FormData.NonCorporateTCS),
      };
    } else if (AccountCategory == "TDS") {
      return {
        CorporateTDS: parseFloat(FormData.CorporateTDS),
        NonCorporateTDS: parseFloat(FormData.NonCorporateTDS),
      };
    } else {
      return {};
    }
  }

  HandleSaveBody() {
    const accountFormValue = this.AccountForm.value;
    const AccountCategory = accountFormValue.AccountCategory.name;

    if (
      ["BANK", "EXPENSE", "TDS", "TCS"].includes(AccountCategory) &&
      !this.AccountCategoryForm.valid
    ) {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Enter Valid Detail",
        showConfirmButton: true,
      });
      return;
    }

    let body = {
      AccountDescription: accountFormValue.AccountDescription,
      AccountingLocations:
        accountFormValue.LocationsDrop === ""
          ? []
          : accountFormValue.LocationsDrop.map((x) => x.value),
      MainCategoryName: accountFormValue.MainCategory.name,
      MainCategoryCode: accountFormValue.MainCategory.value,
      SubCategoryCode: accountFormValue.GroupCode.value,
      SubCategoryName: accountFormValue.GroupCode.name,
      AccountCategoryName: accountFormValue.AccountCategory.name,
      PartySelection: accountFormValue.PartySelection.name,
      ActiveFlag: accountFormValue.ActiveFlag,
      ACdetail: ["BANK", "EXPENSE", "TDS", "TCS"].includes(AccountCategory)
        ? this.getAccountCategorydetail()
        : {},
    };

    if (!this.isUpdate) {
      const length = this.TableData.length;
      const index =
        length === 0
          ? 0
          : parseInt(this.TableData[length - 1].AccountCode.substring(2));
      const padding = index < 9 ? "00" : index < 99 ? "0" : "";
      body["AccountCode"] = `AC${padding}${index + 1}`;
    }
    this.Save(body);
  }

  async Save(body) {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
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
      this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }
  Cancle() {
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
  // --End-- //
}
