import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { openingbalanceControls } from "src/assets/FormControls/Finance/opening balance/openingbalanceControls";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { GetLocationDetailFromApi } from "../Debit Voucher/debitvoucherAPIUtitlity";

@Component({
  selector: "app-opening-balance-ledger",
  templateUrl: "./opening-balance-ledger.component.html",
})
export class OpeningBalanceLedgerComponent implements OnInit {
  breadScrums = [
    {
      title: "opening balance Ledger wise",
      items: ["Home"],
      active: "opening-balance",
    },
  ];
  openingbalanceForm: any;
  jsonControlopeningbalanceArray: any;
  BranchCodeStatus: any;
  BranchCodeCode: any;
  AccountCategoryCode: any;
  AccountCategoryStatus: any;
  AccountCodeCode: any;
  AccountCodeStatus: any;
  CompanyCode: any = parseInt(localStorage.getItem("companyCode"));
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,

  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    const openingbalance = new openingbalanceControls();
    this.jsonControlopeningbalanceArray =
      openingbalance.getOpeningBalanceArrayControls();
    this.openingbalanceForm = formGroupBuilder(this.fb, [
      this.jsonControlopeningbalanceArray,
    ]);
    this.bindDropdown()
  }
  bindDropdown() {
    this.jsonControlopeningbalanceArray.forEach((data) => {
      if (data.name === "BranchCode") {
        // Set BranchCode variables
        this.BranchCodeCode = data.name;
        this.BranchCodeStatus = data.additionalData.showNameAndValue;
        this.getBranchCodeDropdown();
      }
      if (data.name === "AccountCategory") {
        // Set AccountCategory variables
        this.AccountCategoryCode = data.name;
        this.AccountCategoryStatus = data.additionalData.showNameAndValue;
        this.getAccountCategoryDropdown();
      }
      if (data.name === "AccountCode") {
        // Set AccountCode variables
        this.AccountCodeCode = data.name;
        this.AccountCodeStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  async getBranchCodeDropdown() {


    const AllLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlopeningbalanceArray,
      this.openingbalanceForm,
      AllLocationsList,
      this.BranchCodeCode,
      this.BranchCodeStatus
    );

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
      const AcGroupdata = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      this.filter.Filter(
        this.jsonControlopeningbalanceArray,
        this.openingbalanceForm,
        AcGroupdata,
        this.AccountCategoryCode,
        this.AccountCategoryStatus
      );
    }
  }
  async getAccountCodeDropdown() {
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: { cATCD: this.openingbalanceForm.value.AccountCategory.value },
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    console.log('res', res)
    if (res.success && res.data.length > 0) {
      const Acdata = res.data.map((x) => {
        return {
          ...x,
          name: x.aCNM,
          value: x.aCCD,
        };
      });
      this.filter.Filter(
        this.jsonControlopeningbalanceArray,
        this.openingbalanceForm,
        Acdata,
        this.AccountCodeCode,
        this.AccountCodeStatus
      );
    }
  }
  getAccountDescription() {
    this.openingbalanceForm.controls["AccountDescription"].setValue(this.openingbalanceForm.value.AccountCode.aCNM);
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
