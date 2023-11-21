import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountBankControls } from "src/assets/FormControls/Account/account-bank-controls";
import { AccountTdsControls } from "src/assets/FormControls/Account/account-tds-controls";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-bank",
  templateUrl: "./add-bank.component.html",
})
export class AddBankComponent implements OnInit {
  breadScrums = [
    {
      title: "Bank Master",
      items: ["Home"],
      active: "Account",
    },
  ];
  isUpdate: any = false;
  jsonControlArray: any;
  BankForm: any;
  UpdateData: any;
  FormTitle: string = "Add Bank";
  BanknameCode: any;
  BanknameStatus: any;
  ApplicationLocationsCode: any;
  ApplicationLocationsStatus: any;
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      console.log("this.UpdateData", this.UpdateData);
      this.isUpdate = true;
      this.FormTitle = "Edit TDS";
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
  }

  initializeFormControl() {
    const BankFormControls = new AccountBankControls(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray = BankFormControls.getAccountBankArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.BankForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "Bankname") {
        // Set category-related variables
        this.BanknameCode = data.name;
        this.BanknameStatus = data.additionalData.showNameAndValue;
        this.getBanknameDropdown();
      }
      if (data.name === "ApplicationLocations") {
        // Set category-related variables
        this.ApplicationLocationsCode = data.name;
        this.ApplicationLocationsStatus = data.additionalData.showNameAndValue;
        this.getApplicationLocationsDropdown();
      }
    });
  }

  async getBanknameDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "BNK", activeFlag: true },
    };
    const res = await this.masterService
      .masterPost("generic/get", Body)
      .toPromise();

    if (res.success && res.data.length > 0) {
      const Banknamedata = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      if (this.isUpdate) {
        const element = Banknamedata.find(
          (x) => x.name == this.UpdateData.Bankname
        );
        this.BankForm.controls["Bankname"].setValue(element);
      }

      this.filter.Filter(
        this.jsonControlArray,
        this.BankForm,
        Banknamedata,
        this.BanknameCode,
        this.BanknameStatus
      );
    }
  }

  async getApplicationLocationsDropdown() {
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
      this.filter.Filter(
        this.jsonControlArray,
        this.BankForm,
        LocationsData,
        this.ApplicationLocationsCode,
        this.ApplicationLocationsStatus
      );
      // is Update
      if (this.isUpdate) {
        const Locetion = this.UpdateData.ApplicationLocations;
        const selectedData = LocationsData.filter((x) =>
          Locetion.includes(x.value)
        );
        this.BankForm.controls["LocationsDrop"].setValue(selectedData);
      }
    }
  }

  async save() {
    const commonBody = {
      Bankname: this.BankForm.value.Bankname.name,
      Accountnumber: this.BankForm.value.Accountnumber,
      IFSCcode: this.BankForm.value.IFSCcode,
      MICRcode: this.BankForm.value.MICRcode,
      SWIFTcode: this.BankForm.value.SWIFTcode,
      ApplicationLocations: this.BankForm.value.LocationsDrop.map(
        (x) => x.value
      ),
    };
    if (this.isUpdate) {
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "Bank_detail",
        filter: { Bankcode: this.UpdateData.Bankcode },
        update: commonBody,
      };
      await this.handleRequest(req);
    } else {
      const tabledata = await this.masterService
        .masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "Bank_detail",
          filter: {},
        })
        .toPromise();
      const body = {
        Bankcode:
          tabledata.data.length === 0
            ? 1
            : tabledata.data[tabledata.data.length - 1].Bankcode + 1,
        entryBy: localStorage.getItem("UserName"),
        entryDate: new Date(),
        companyCode: this.CompanyCode,
        ...commonBody,
      };
      const req = {
        companyCode: this.CompanyCode,
        collectionName: "Bank_detail",
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
      this.Route.navigateByUrl("/Masters/AccountMaster/ListBank");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/ListBank");
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
