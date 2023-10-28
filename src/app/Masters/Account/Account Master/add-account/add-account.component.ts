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
      title: "Account Master",
      items: ["Home"],
      active: "Account Master",
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
  AddNewButton = {
    name: "Add Account Group",
    iconName: "add",
    functionName: "addNewAccountGroup",
  };
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  CompanyName: any;
  TableData: any;
  UpdateData: any;
  isUpdate: boolean = false;
  FormTitle = "Add Account";
  protected _onDestroy = new Subject<void>();
  FirstUpdate: boolean = false;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialog: MatDialog
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
    this.GetTableData();
  }

  initializeFormControl() {
    const AccountFormControls = new AccountMasterControls();
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

      if (data.name === "CompanyName") {
        this.getCompanyName();
      }
      if (data.name === "PartySelection") {
        // Set category-related variables
        this.PartySelectionCode = data.name;
        this.PartySelectionStatus = data.additionalData.showNameAndValue;
        this.getPartySelectionDropdown();
      }
    });
  }

  async getCompanyName() {
    if (!this.isUpdate) {
      const Body = {
        companyCode: this.CompanyCode,
        collectionName: "company_master",
        filter: { companyCode: "10065" },
      };

      const res = await this.masterService
        .masterPost("generic/get", Body)
        .toPromise();
      if (res.success) {
        this.CompanyName = res.data[0].company_Name;
        this.AccountForm.controls["CompanyName"].setValue(this.CompanyName);
      }
    } else {
      this.AccountForm.controls["CompanyName"].setValue(
        this.UpdateData.CompanyName
      );
    }
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
          (x) => x.value == this.UpdateData.GroupCodeValue
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
        const Locetion = this.UpdateData.AccountingLocations.split(",");
        const selectedData = LocationsData.filter((x) =>
          Locetion.includes(x.name)
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

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  HandleisBranch(event) {
    const checked = event.eventArgs.checked;
    if (checked == true) {
      this.jsonControlAccountArray = this.AlljsonControlAccountArray.filter(
        (x) => x.name != "Locations"
      );
      this.AccountForm.get("Locations").clearValidators();
      this.AccountForm.updateValueAndValidity();
    } else {
      this.jsonControlAccountArray = this.AlljsonControlAccountArray;
      this.AccountForm.get("Locations").setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      this.AccountForm.updateValueAndValidity();
    }
  }

  addNewAccountGroup() {
    const dialogRef = this.dialog.open(AccountGroupComponent, {
      data: {},
      width: "1000px",
      height: "500px",
      disableClose: true,
    });
  }
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

  async Save() {
    if (this.isUpdate) {
      const body = {
        AccountDescription: this.AccountForm.value.AccountDescription,
        AccountingLocations: this.AccountForm.value.LocationsDrop.map(
          (x) => x.name
        ).join(","),
        MainCategoryName: this.AccountForm.value.MainCategory.name,
        GroupCodeValue: this.AccountForm.value.GroupCode.value,
        GroupCodeName: this.AccountForm.value.GroupCode.Name,
        PartySelection: this.AccountForm.value.PartySelection.name,
        ActiveFlag: this.AccountForm.value.ActiveFlag,
      };
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "account_detail",
        filter: { AccountCode: this.UpdateData.AccountCode },
        update: body,
      };
      const res = await this.masterService
        .masterPut("generic/update", req)
        .toPromise();
      if (res.success) {
        this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
      }
    } else {
      const length = this.TableData.length;
      const index =
        length == 0
          ? 0
          : parseInt(this.TableData[length - 1].AccountCode.substring(2));
      const Body = {
        AccountCode:
          "AC" +
          (index < 9 ? "00" : index > 9 && index < 99 ? "0" : "") +
          (index + 1),
        CompanyName: this.AccountForm.value.CompanyName,
        AccountDescription: this.AccountForm.value.AccountDescription,
        AccountingLocations: this.AccountForm.value.LocationsDrop.map(
          (x) => x.name
        ).join(","),
        MainCategoryName: this.AccountForm.value.MainCategory.name,
        GroupCodeValue: this.AccountForm.value.GroupCode.value,
        GroupCodeName: this.AccountForm.value.GroupCode.Name,
        PartySelection: this.AccountForm.value.PartySelection.name,
        ActiveFlag: this.AccountForm.value.ActiveFlag,
      };
      let req = {
        companyCode: this.CompanyCode,
        collectionName: "account_detail",
        data: Body,
      };
      const res = await this.masterService
        .masterPost("generic/create", req)
        .toPromise();
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
  }

  async getAccountDescription() {
    console.log('ok')
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const FilterData = res.data.filter(x => x.AccountDescription == this.AccountForm.value.AccountDescription.trim());
      if(FilterData.length > 0){
        if(!this.isUpdate){
          this.AccountForm.controls["AccountDescription"].setValue("");
        }else if(this.AccountForm.value.AccountDescription.trim() != this.UpdateData.AccountDescription){
          this.AccountForm.controls["AccountDescription"].setValue("");
        }
      }
    }
  }

  Cancle() {
    this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
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
}
