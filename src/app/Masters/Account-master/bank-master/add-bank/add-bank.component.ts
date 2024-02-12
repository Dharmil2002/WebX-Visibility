import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
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
      title: "Bank Account Master",
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
  protected _onDestroy = new Subject<void>();
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  AccountTypeCode: any;
  AccountTypeStatus: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.UpdateData = this.Route.getCurrentNavigation().extras?.state.data;
      this.isUpdate = true;
      this.FormTitle = "Edit Bank";
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

      if (data.name === "AccountType") {
        // Set category-related variables
        this.AccountTypeCode = data.name;
        this.AccountTypeStatus = data.additionalData.showNameAndValue;
        this.getAccountTypeDropdown();
      }
    });
  }
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.BankForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "Bank_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const userlist = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );

      // Check if data exists for the given filter criteria
      if (userlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });

        // Reset the input field
        this.BankForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(
        `An error occurred while fetching ${fieldName} details:`,
        error
      );
    }
  }
  async CheckAccountnumber() {
    await this.checkValueExists("Accountnumber", "Account number");
  }
  async CheckIFSCcode() {
    await this.checkValueExists("IFSCcode", "IFSC code");
  }
  async CheckMICRcode() {
    await this.checkValueExists("MICRcode", "MICR code");
  }
  async CheckSWIFTcode() {
    await this.checkValueExists("SWIFTcode", "SWIFT code");
  }

  async AccountTypeFunction() {
    if (this.BankForm.value.AccountType.name == "CC") {
      const CreditLimit = this.BankForm.get("CreditLimit");
      CreditLimit.setValidators([Validators.required]);
      CreditLimit.updateValueAndValidity();
    } else {
      const CreditLimit = this.BankForm.get("CreditLimit");
      CreditLimit.clearValidators();
      CreditLimit.updateValueAndValidity();
    }
  }
  async getBanknameDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "General_master",
      filter: { codeType: "BNK", activeFlag: true },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

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

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

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

  getAccountTypeDropdown() {
    const data = [
      {
        name: "Saving",
        value: "1",
      },
      {
        name: "Current",
        value: "2",
      },
      {
        name: "CC",
        value: "3",
      },
      {
        name: "RD",
        value: "4",
      },
      {
        name: "Fixed deposit",
        value: "5",
      },
    ];
    if(this.isUpdate){
      const element = data.find(x => x.name == this.UpdateData.AccountTypeName)
      this.BankForm.controls["AccountType"].setValue(element);
    }
    this.filter.Filter(
      this.jsonControlArray,
      this.BankForm,
      data,
      this.AccountTypeCode,
      this.AccountTypeStatus
    );
    this.AccountTypeFunction()
  }

  async save() {
    const commonBody = {
      Bankname: this.BankForm.value.Bankname.name,
      Accountnumber: this.BankForm.value.Accountnumber,
      IFSCcode: this.BankForm.value.IFSCcode,
      MICRcode: this.BankForm.value.MICRcode,
      SWIFTcode:
        this.BankForm.value.SWIFTcode === 0
          ? ""
          : this.BankForm.value.SWIFTcode,
      ApplicationLocations: this.BankForm.value.LocationsDrop.map(
        (x) => x.value
      ),
      BankAddress:this.BankForm.value.BankAddress,
      AccountTypeName:this.BankForm.value.AccountType.name,
      CreditLimit: parseInt(this.BankForm.value.CreditLimit) || 0,
      isActive:this.BankForm.value.isActive,
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
      const tabledata = await firstValueFrom(
        this.masterService.masterPost("generic/get", {
          companyCode: this.CompanyCode,
          collectionName: "Bank_detail",
          filter: {},
        })
      );
      const index =
        parseInt(
          tabledata.data.length === 0
            ? 0
            : tabledata.data[tabledata.data.length - 1].Bankcode
        ) + 1;
      const bankcode = `BAN${
        index < 9 ? "00" : index > 9 && index < 99 ? "0" : ""
      }${index}`;
      const body = {
        _id: `${this.CompanyCode}-${bankcode}`,
        Bankcode: bankcode,
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
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );

    if (res.success) {
      this.Route.navigateByUrl("/Masters/AccountMaster/BankAccountMasterList");
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  cancel() {
    this.Route.navigateByUrl("/Masters/AccountMaster/BankAccountMasterList");
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.BankForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
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
