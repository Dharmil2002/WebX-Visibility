import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountGroupControls } from "src/assets/FormControls/Account/account-group-controls";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
})
export class AddGroupComponent implements OnInit {
  backPath: string;
  UpdateData: any;
  isUpdate: boolean = false;
  FormTitle: string = "Add Account Group";
  jsonControlArray: any;
  GroupForm: any;
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  FirstUpdate = false;
  AcGroupCatCode: any;
  AcGroupCatStatus: any;
  BalanceSheetCode: any;
  BalanceSheetStatus: any;
  submit = 'Save';
  action: string;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.submit = 'Modify';
      this.action = 'edit'
    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Account Group Master",
          items: ["Masters"],
          active: "Modify Account Group Master",
          generatecontrol: true,
          toggle: this.UpdateData.activeFlag
        },
      ];

    } else {
      this.breadScrums = [
        {
          title: "Add Account Group Master",
          items: ["Masters"],
          active: "Add Account Group Master",
          generatecontrol: true,
          toggle: false
        },
      ];
    }
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
    this.backPath = "/Masters/AccountMaster/ListAccountGroup";
  }
  initializeFormControl() {
    const GroupFormControls = new AccountGroupControls(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray = GroupFormControls.getAccountGroupAddArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.GroupForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "AcGroupCat") {
        // Set category-related variables
        this.AcGroupCatCode = data.name;
        this.AcGroupCatStatus = data.additionalData.showNameAndValue;
        this.getAcGroupCatDropdown();
      }
      if (data.name === "BalanceSheet") {
        // Set category-related variables
        this.BalanceSheetCode = data.name;
        this.BalanceSheetStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  async getAcGroupCatDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "MCT", activeFlag: true },
    };
    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const AcGroupCatnamedata = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = AcGroupCatnamedata.find(
          (x) => x.name == this.UpdateData.AcGroupCatName
        );
        this.GroupForm.controls["AcGroupCat"].setValue(element);
        this.getBalanceSheetDropdown();
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.GroupForm,
        AcGroupCatnamedata,
        this.AcGroupCatCode,
        this.AcGroupCatStatus
      );
    }
  }
  async getBalanceSheetDropdown() {
    this.GroupForm.controls["BalanceSheet"].setValue("");
    const Value = this.GroupForm.value.AcGroupCat.name;
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "Acgroup_detail",
      filter: { AcGroupCatName: Value },
    };

    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const BalanceSheetnamedata = res.data.map((x) => {
        return {
          name: x.GroupName,
          value: x.Groupcode,
        };
      });
      if (this.isUpdate && !this.FirstUpdate) {
        const element = BalanceSheetnamedata.find(
          (x) => x.value == this.UpdateData.BalanceSheetCode
        );
        this.GroupForm.controls["BalanceSheet"].setValue(element);
        this.FirstUpdate = true;
      }

      this.filter.Filter(
        this.jsonControlArray,
        this.GroupForm,
        BalanceSheetnamedata,
        this.BalanceSheetCode,
        this.BalanceSheetStatus
      );
    }
  }
  async save() {
    const commonBody = {
      AcGroupCatName: this.GroupForm.value.AcGroupCat.name,
      AcGroupCatCode: this.GroupForm.value.AcGroupCat.value,
      BalanceSheetName: this.GroupForm.value.BalanceSheet.name,
      BalanceSheetCode: this.GroupForm.value.BalanceSheet.value,
      GroupName: this.GroupForm.value.GroupName,
      activeFlag: this.GroupForm.value.activeFlag,
      mODBY: localStorage.getItem("UserName"),
      mODDT: new Date(),
      mODLOC: localStorage.getItem("Branch"),
    };
    if (this.isUpdate) {
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "Acgroup_detail",
        filter: { Groupcode: this.UpdateData.Groupcode },
        update: commonBody,
      };
      await this.handleRequest(req);
    } else {
      const tabledata = await this.masterService
        .masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "Acgroup_detail",
          filter: {},
        })
        .toPromise();
      const body = {
        Groupcode:
          tabledata.data.length === 0
            ? 1
            : tabledata.data[tabledata.data.length - 1].Groupcode + 1,
        cID: this.CompanyCode,
        activeFlag: this.GroupForm.value.activeFlag,
        eNTBY: localStorage.getItem("UserName"),
        eNTDT: new Date(),
        eNTLOC: localStorage.getItem("Branch"),
        ...commonBody,
      };
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "Acgroup_detail",
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
      this.Route.navigateByUrl("/Masters/AccountMaster/ListAccountGroup");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/ListAccountGroup");
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.GroupForm.controls['activeFlag'].setValue(event);
    //console.log("Toggle value :", event);
  }
}
