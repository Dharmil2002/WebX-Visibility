import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountMasterControls } from "src/assets/FormControls/AccountMasterControls";
import Swal from "sweetalert2";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-account-group",
  templateUrl: "./account-group.component.html",
})
export class AccountGroupComponent implements OnInit {
  isTableLode = true;
  showTable = true;
  linkArray = [];
  menuItems = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    gRPCD: {
      Title: "Account Group Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    cATNM: {
      Title: "Category",
      class: "matcolumncenter",
      Style: "min-width:25%",
    },
    pGNM: {
      Title: "Perent Group Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    gRPNM: {
      Title: "Group Name",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    EditAction:{
      type:'iconClick',
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:15%",
      functionName:'EditFunction',
      iconName:'edit'
    }
  };
  staticField = [
    "SrNo",
    "gRPNM",
    "pGNM",
    "cATNM",
    "gRPCD",
  ];
  TableData: any = [];
  jsonControlAccountGroupArray:FormControls[];
  AccountGroupForm: any;
  CategoryCodeCode: string;
  CategoryCodeStatus: any;
  GroupCodeTypeCode: string;
  GroupCodeTypeStatus: any;
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  GroupCodeTableData: any;
  SelectAccountCategory: any;
  SelectAccountCategoryData: any;
  isUpdate: boolean = false;
  updateData: any;
  FirstUpdate: boolean = false;
  FormTitle = 'Add Account Group'
  EventButton = {
    functionName:'AddNew',
    name: "Add Account Group",
    iconName:'add'
  }
  BalanceSheetCode: string;
  BalanceSheetStatus: any;
  constructor(
    public dialogRef: MatDialogRef<AccountGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.getCategoryCode();
  }

  async getTableData() {
    this.isTableLode = false;
    if (this.SelectAccountCategory) {
      const Body = {
        companyCode: this.CompanyCode,
        collectionName: "account_group_detail",
        filter: { cATCD: this.SelectAccountCategory.value },
      };
      const res = await firstValueFrom(this.masterService
        .masterPost("generic/get", Body));

      if (res.success) {
        this.TableData = res.data.map((x, index) => {
          return {
            ...x,
            SrNo: index + 1,
          };
        });
      }
    }
    this.isTableLode = true;
  }

  EditFunction(event){
    this.isUpdate = true
    this.updateData = event.data
    this.FormTitle = 'Edit Account Group'
    this.showTable = !this.showTable;
    this.initializeFormControl();
    this.bindDropdown();
  }

  AddNew() {
    this.showTable = !this.showTable;
    this.initializeFormControl();
    this.bindDropdown();
  }

  cancel() {
    this.isUpdate = false
    this.FirstUpdate = false
    this.showTable = !this.showTable;
    this.getTableData();
  }

  initializeFormControl() {
    const AccountFormControls = new AccountMasterControls(this.isUpdate);
    this.jsonControlAccountGroupArray =
      AccountFormControls.getAccountGroupAddArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountGroupForm = formGroupBuilder(this.fb, [
      this.jsonControlAccountGroupArray,
    ]);
    if (this.isUpdate) {
      this.AccountGroupForm.controls["GroupName"].setValue(this.updateData.gRPNM);
      this.AccountGroupForm.controls["GroupCode"].setValue(this.updateData.gRPCD);
    }
  }

  bindDropdown() {
    this.jsonControlAccountGroupArray.forEach((data) => {
      if (data.name === "CategoryCode") {
        // Set category-related variables
        this.CategoryCodeCode = data.name;
        this.CategoryCodeStatus = data.additionalData.showNameAndValue;
        this.getCategoryCodeDropdown();
      }
      if (data.name === "GroupCodeType") {
        // Set category-related variables
        this.GroupCodeTypeCode = data.name;
        this.GroupCodeTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "BalanceSheet") {
        this.BalanceSheetCode = data.name;
        this.BalanceSheetStatus = data.additionalData.showNameAndValue;
        this.getBalanceSheetcategoryDropdown();
      }
    });
  }

  async getCategoryCode() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body))
    if (res.success && res.data.length > 0) {
      this.SelectAccountCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
    }
  }

  async getBalanceSheetcategoryDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "BLC", activeFlag: true },
    };
    const res = await  firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      const BalanceSheetcategory = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = BalanceSheetcategory.find(
          (x) => x.name == this.updateData.bCATNM
        );
        this.AccountGroupForm.controls["BalanceSheet"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlAccountGroupArray,
        this.AccountGroupForm,
        BalanceSheetcategory,
        this.BalanceSheetCode,
        this.BalanceSheetStatus
      );
    }
  }

  async getCategoryCodeDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      const CategoryCodeData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = CategoryCodeData.find(
          (x) => x.value == this.updateData.cATCD
        );
        this.AccountGroupForm.controls["CategoryCode"].setValue(element);
        this.getGroupCodeTypeDropdown()
      }
      this.filter.Filter(
        this.jsonControlAccountGroupArray,
        this.AccountGroupForm,
        CategoryCodeData,
        this.CategoryCodeCode,
        this.CategoryCodeStatus
      );
    }
  }

  async getGroupCodeTypeDropdown() {
    this.AccountGroupForm.controls["GroupCodeType"].setValue("");
    const Value = this.AccountGroupForm.value.CategoryCode.value;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: { cATCD: Value },
    };

    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      this.GroupCodeTableData = res.data;
      const GroupCodeType = res.data.map((x) => {
        return {
          name: x.gRPNM,
          value: x.gRPCD,
          level:x.gLEVEL
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = GroupCodeType.find(
          (x) => x.name == this.updateData.pGNM
        );
        this.AccountGroupForm.controls["GroupCodeType"].setValue(element);
        this.FirstUpdate = true
      }
      this.filter.Filter(
        this.jsonControlAccountGroupArray,
        this.AccountGroupForm,
        GroupCodeType,
        this.GroupCodeTypeCode,
        this.GroupCodeTypeStatus
      );
    }
  }

  GetGroupName(event){
    const filterData = this.GroupCodeTableData.filter((x)=> x.gRPNM == this.AccountGroupForm.value.gRPNM)
    if(this.isUpdate && this.AccountGroupForm.value.gRPNM != this.updateData.gRPNM ){
      if(filterData.length > 0){
        this.AccountGroupForm.controls["GroupName"].setValue("");
      }
    }
    if(!this.isUpdate && filterData.length > 0){
      this.AccountGroupForm.controls["GroupName"].setValue("");
    }
  }

  async save() {
    if(this.isUpdate){
      const Body = {
        gRPNM: this.AccountGroupForm.value.GroupName,
        pGCD: this.AccountGroupForm.value.GroupCodeType.value,
        pGNM: this.AccountGroupForm.value.GroupCodeType.name,
        gLEVEL:`${parseInt(this.AccountGroupForm.value.GroupCodeType.level)+1}`,
        mODDT: new Date(),
        mODLOC: this.storage.branch,
        mODBY: this.storage.userName,
      };

      const req = {
        companyCode: this.CompanyCode,
        collectionName: "account_group_detail",
        filter: { gRPCD: this.updateData.gRPCD },
        update: Body,
      };
      const res = await firstValueFrom(this.masterService
        .masterPut("generic/update", req));
      if (res.success) {
        this.cancel();
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
      }
    }else{
      const index = parseInt(
        this.GroupCodeTableData[
          this.GroupCodeTableData.length - 1
        ].gRPCD.substring(3)
      )+1;
      const groupcode = `${this.AccountGroupForm.value.CategoryCode.name.substr(0, 3)}${
        index < 9 ? "00" : index > 9 && index < 99 ? "0" : ""
      }${index}`;
      const Body = {
        _id:`${this.CompanyCode}-${groupcode}`,
        cID: this.CompanyCode,
        gRPCD:groupcode,
        gRPNM: this.AccountGroupForm.value.GroupName,
        pGCD: this.AccountGroupForm.value.GroupCodeType?.value || "",
        pGNM: this.AccountGroupForm.value.GroupCodeType?.name || "",
        gLEVEL: parseInt(this.AccountGroupForm.value.GroupCodeType.level)+ 1 || 0,
        cATNM: this.AccountGroupForm.value.CategoryCode.name,
        cATCD: this.AccountGroupForm.value.CategoryCode.value,
        bCATNM:this.AccountGroupForm.value.BalanceSheet.name,
        bCATCD:this.AccountGroupForm.value.BalanceSheet.value,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName,
        mODDT: new Date(),
        mODLOC: this.storage.branch,
        mODBY: this.storage.userName,
      };
      let req = {
        companyCode: this.CompanyCode,
        collectionName: "account_group_detail",
        data: Body,
      };
      const res = await firstValueFrom(this.masterService
        .masterPost("generic/create", req));
      if (res.success) {
        this.cancel();
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
      }
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

  close() {
    this.dialogRef.close();
  }

  sortAccountCategory() {
    this.getTableData();
  }
}
