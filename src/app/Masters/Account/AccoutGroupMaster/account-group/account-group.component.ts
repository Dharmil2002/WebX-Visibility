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
   
    GroupCode: {
      Title: "Account Group Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    CategoryCode: {
      Title: "Category",
      class: "matcolumncenter",
      Style: "min-width:25%",
    },
    GroupCodeType: {
      Title: "Perent Group Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    GroupName: {
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
    "GroupName",
    "GroupCodeType",
    "CategoryCode",
    "GroupCode",
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
  constructor(
    public dialogRef: MatDialogRef<AccountGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
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
        filter: { CategoryCode: this.SelectAccountCategory.name },
      };
      const res = await this.masterService
        .masterPost("generic/get", Body)
        .toPromise();

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

  Cancle() {
    this.isUpdate = false
    this.FirstUpdate = false
    this.showTable = !this.showTable;
    this.getTableData();
  }

  initializeFormControl() {
    const AccountFormControls = new AccountMasterControls();
    this.jsonControlAccountGroupArray =
      AccountFormControls.getAccountGroupAddArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AccountGroupForm = formGroupBuilder(this.fb, [
      this.jsonControlAccountGroupArray,
    ]);
    if (this.isUpdate) {
      this.AccountGroupForm.controls["GroupName"].setValue(this.updateData.GroupName);
      this.AccountGroupForm.controls["GroupCode"].setValue(this.updateData.GroupCode);
    }
  }

  bindDropdown() {
    this.jsonControlAccountGroupArray.forEach((data) => {
      if (data.name === "CategoryCode") {
        // Set category-related variables
        if(this.isUpdate){
          data.disable = true
        }
        this.CategoryCodeCode = data.name;
        this.CategoryCodeStatus = data.additionalData.showNameAndValue;
        this.getCategoryCodeDropdown();
      }
      if (data.name === "GroupCodeType") {
        // Set category-related variables
        this.GroupCodeTypeCode = data.name;
        this.GroupCodeTypeStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  async getCategoryCode() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "ACT", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      this.SelectAccountCategoryData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
    }
  }

  async getCategoryCodeDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "ACT", activeFlag: true },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const CategoryCodeData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = CategoryCodeData.find(
          (x) => x.name == this.updateData.CategoryCode
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
    const Value = this.AccountGroupForm.value.CategoryCode.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_group_detail",
      filter: { CategoryCode: Value },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();

    if (res.success && res.data.length > 0) {
      this.GroupCodeTableData = res.data;
      const GroupCodeType = res.data.map((x) => {
        return {
          name: x.GroupName,
          value: x.GroupCode,
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = GroupCodeType.find(
          (x) => x.name == this.updateData.GroupCodeType
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
      // this.GetGroupName()
    }
  }

  GetGroupName(event){
    const filterData = this.GroupCodeTableData.filter((x)=> x.GroupName == this.AccountGroupForm.value.GroupName)
    if(this.isUpdate && this.AccountGroupForm.value.GroupName != this.updateData.GroupName ){
      if(filterData.length > 0){
        this.AccountGroupForm.controls["GroupName"].setValue("");
      }
    }
    if(!this.isUpdate && filterData.length > 0){
      this.AccountGroupForm.controls["GroupName"].setValue("");
    }
  }

  async Save() {

    if(this.isUpdate){
      const Body = {
        GroupName: this.AccountGroupForm.value.GroupName,
        GroupCodeType: this.AccountGroupForm.value.GroupCodeType.name,
      };

      const req = {
        companyCode: this.CompanyCode,
        collectionName: "account_group_detail",
        filter: { GroupCode: this.updateData.GroupCode },
        update: Body,
      };
      const res = await this.masterService
        .masterPut("generic/update", req)
        .toPromise();
      if (res.success) {
        this.Cancle();
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
        ].GroupCode.substring(3)
      );
      const Body = {
        GroupCode:this.AccountGroupForm.value.CategoryCode.name.substr(0, 3)+
          (index < 9 ? "00" : index > 9 && index < 99 ? "0" : "") +
          (index + 1),
        GroupName: this.AccountGroupForm.value.GroupName,
        GroupCodeType: this.AccountGroupForm.value.GroupCodeType.name,
        CategoryCode: this.AccountGroupForm.value.CategoryCode.name,
        companyCode: this.CompanyCode,
        updatedDate: new Date(),
        updatedBy: localStorage.getItem("UserName"),
      };
      let req = {
        companyCode: this.CompanyCode,
        collectionName: "account_group_detail",
        data: Body,
      };
      const res = await this.masterService
        .masterPost("generic/create", req)
        .toPromise();
      if (res.success) {
        this.Cancle();
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
