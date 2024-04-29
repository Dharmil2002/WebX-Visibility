import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import {
  DriversFromApi, GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi, GetSingleCustomerDetailsFromApi,
  GetSingleVendorDetailsFromApi, GetsachsnFromApi, UsersFromApi, customerFromApi, vendorFromApi
} from './generalbillAPIUtitlity';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { StoreKeys } from 'src/app/config/myconstants';
import { AddGeneralBillDetailComponent } from '../Modals/add-general-bill-detail/add-general-bill-detail.component';
import { VendorGeneralBillControl } from 'src/assets/FormControls/Finance/VendorPayment/VendorGeneralBillcontrol';
import { firstValueFrom } from 'rxjs';
import { GetStateListFromAPI } from 'src/app/finance/Vendor Payment/VendorPaymentAPIUtitlity';
@Component({
  selector: 'app-general-bill-detail',
  templateUrl: './general-bill-detail.component.html',
})
export class GeneralBillDetailComponent implements OnInit {
  companyCode: number | null
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  breadScrums = [
    {
      title: "Vendor General Bill Generation",
      items: ["Finance"],
      active: "Vendor General Bill Generation",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-2";
  VendorBillControl: VendorGeneralBillControl;

  VendorBillForm: UntypedFormGroup;
  jsonControlVendorBillArray: any;

  VendorBillDocumentForm: UntypedFormGroup;
  jsonControlVendorBillDocumentArray: any;

  VendorBalanceTaxationTDSFilterForm: UntypedFormGroup;
  jsonControlVendorBalanceTaxationTDSFilterArray: any;
  AlljsonControlVendorBalanceTaxationTDSFilterArray: any;

  VendorBalanceTaxationGSTFilterForm: UntypedFormGroup;
  jsonControlVendorBalanceTaxationGSTFilterArray: any;
  AlljsonControlVendorBalanceTaxationGSTFilterArray: any;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Ledger', 'SACCode', 'Amount', 'GSTRate', 'GSTAmount', 'Total', 'Document', 'Narration']

  columnHeader =
    {
      Ledger: {
        Title: "Ledger",
        class: "matcolumnfirst",
        Style: "min-width:150px",
      },
      SACCode: {
        Title: "SACCode",
        class: "matcolumncenter",
        Style: "min-width:250px;max-width:250px",
      },
      Document: {
        Title: "Document No",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },
      Amount: {
        Title: "Amount ₹",
        class: "matcolumncenter",
        Style: "max-width:120px",
      },
      GSTRate: {
        Title: "GST Rate %",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },
      GSTAmount: {
        Title: "GST Amount ₹",
        class: "matcolumncenter",
        Style: "max-width:120px",
      },
      Total: {
        Title: "Total ₹",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },

      Narration: {
        Title: "Narration",
        class: "matcolumncenter",
        Style: "min-width:170px",
      },
      actionsItems: {
        Title: "Action",
        class: "matcolumnleft",
        Style: "max-width:100px",
      }
    }
  AccountsBanksList: any;
  tableData: any = [];
  DebitAgainstDocumentList: any = [];
  SACCodeList: any = [];
  LoadVoucherDetails = true;

  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };
  imageData: any;
  PartyNameList: any;
  AllStateList: any;
  StateList: any;
  AccountGroupList: any;
  AllLocationsList: any;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    private matDialog: MatDialog,
    private objImageHandling: ImageHandling,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,

  ) {
    this.companyCode = this.storage.companyCode;
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.BindDataFromApi();
    this.getTDSSectionDropdown()
    this.CalculatePaymentAmount()
    this.getSACcodeDropdown()
  }
  initializeFormControl() {
    const Request = {
      VendorName: "WESTERN CARRIER LIMITED",
      VendorCode: "V0015",
      VendorPan: "AABCT1234C",
    }
    this.VendorBillControl = new VendorGeneralBillControl(Request);
    this.jsonControlVendorBillArray = this.VendorBillControl.getVendorBillSummaryArrayControls();
    this.VendorBillForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillArray]);

    this.jsonControlVendorBillDocumentArray = this.VendorBillControl.getVendorBillDocumentArrayControls();
    this.VendorBillDocumentForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillDocumentArray]);

    this.jsonControlVendorBalanceTaxationTDSFilterArray = this.VendorBillControl.getVendorBalanceTaxationTDSArrayControls();
    this.AlljsonControlVendorBalanceTaxationTDSFilterArray = this.jsonControlVendorBalanceTaxationTDSFilterArray;
    this.VendorBalanceTaxationTDSFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalanceTaxationTDSFilterArray]);

    this.AlljsonControlVendorBalanceTaxationGSTFilterArray = this.VendorBillControl.getVendorBalanceTaxationGSTArrayControls();
    this.jsonControlVendorBalanceTaxationGSTFilterArray = this.AlljsonControlVendorBalanceTaxationGSTFilterArray;
    this.VendorBalanceTaxationGSTFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalanceTaxationGSTFilterArray]);
  }
  async BindDataFromApi() {

    const DocumentsList = [
      {
        value: "DRS",
        name: "Delivery Run Sheet",
      },
      {
        value: "THC",
        name: "THC",
      },
      {
        value: "TS",
        name: "Trip Sheet",
      },
      {
        value: "OTR",
        name: "Other",
      },

    ];
    this.filter.Filter(
      this.jsonControlVendorBillDocumentArray,
      this.VendorBillDocumentForm,
      DocumentsList,
      "DocumentSelection",
      false
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService)
    this.BindLedger();
    const resState = await GetStateListFromAPI(this.masterService);
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map((x) => ({
        value: x.ST, name: x.STNM
      }))
      .filter((x) => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
      this.VendorBalanceTaxationGSTFilterForm,
      this.StateList,
      "Billbookingstate",
      false
    );
    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
      this.VendorBalanceTaxationGSTFilterForm,
      this.StateList,
      "Vendorbillstate",
      false
    );
  }
  async BindLedger() {
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_detail",
      filter: {
        // pARTNM: BindLedger,
        // MainCategoryName: ["ASSET", "EXPENSE"],
        //   AccountingLocations: this.VendorBillForm.value.Accountinglocation?.name
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }



  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {

      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.AddBillDetails(LedgerDetails)
    }
  }

  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  async AddBills() {
    this.AddBillDetails('')
  }

  // Add a new item to the table
  AddBillDetails(event) {

    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      SACCode: this.SACCodeList,
      DocumentType: this.VendorBillDocumentForm.value.DocumentSelection.value,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(AddGeneralBillDetailComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          Ledger: result?.Ledger,
          LedgerHdn: result?.LedgerHdn,
          SACCode: result?.SACCode,
          SACCodeHdn: result?.SACCodeHdn,
          Document: request.DocumentType == "OTR" ? result?.Document : result?.Document.value,
          DocumentType: request.DocumentType,
          Amount: result?.Amount,
          GSTRate: result?.GSTRate,
          GSTAmount: result?.GSTAmount,
          Total: result?.Total,
          Narration: result?.Narration,
          SubCategoryName: result?.SubCategoryName,
          actions: ['Edit', 'Remove']
        }
        console.log(json)
        this.tableData.push(json);
        this.LoadVoucherDetails = true;

      }
      this.LoadVoucherDetails = true;
      this.CalculatePaymentAmount()
    });
  }
  toggleTDSExempted() {
    const TDSExemptedValue =
      this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted;

    if (TDSExemptedValue) {

      this.jsonControlVendorBalanceTaxationTDSFilterArray =
        this.AlljsonControlVendorBalanceTaxationTDSFilterArray.filter(
          (x) => x.name == "TDSExempted"
        );
      const TDSSection =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    } else {
      this.jsonControlVendorBalanceTaxationTDSFilterArray =
        this.AlljsonControlVendorBalanceTaxationTDSFilterArray;
      const TDSSection =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValidators([Validators.required]);
      TDSAmount.updateValueAndValidity();
      this.getTDSSectionDropdown();

    }
  }
  async getTDSSectionDropdown() {
    let Accountinglocation = this.storage.branch;
    let responseFromAPITDS = await GetAccountDetailFromApi(
      this.masterService,
      "TDS",
      Accountinglocation
    );
    //this.TDSdata = responseFromAPITDS;
    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationTDSFilterArray,
      this.VendorBalanceTaxationTDSFilterForm,
      responseFromAPITDS,
      "TDSSection",
      false
    );
  }
  TDSSectionFieldChanged() {
    if (this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value) {
      const TDSrate = this.VendorBalanceTaxationTDSFilterForm.value.TDSSection?.rOTHER || 0
      const TotalTHCamount = this.tableData.reduce((sum, x) => sum + parseFloat(x.Amount), 0);
      const TDSamount = ((TDSrate * TotalTHCamount) / 100 || 0).toFixed(2);
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSRate"].setValue(TDSrate);
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSAmount"].setValue(TDSamount);
      this.CalculatePaymentAmount();
    }
  }
  CalculatePaymentAmount() {
    const Amount = this.tableData.reduce((sum, x) => sum + parseFloat(x.Amount), 0);

    let TDSAmount = parseFloat(this.VendorBalanceTaxationTDSFilterForm.controls.TDSAmount.value) || 0;
    let GSTAmount = parseFloat(this.VendorBalanceTaxationGSTFilterForm.controls.GSTAmount.value) || 0;


    const CalculatedSumWithTDS = Amount - parseFloat(TDSAmount.toFixed(2));;
    const CalculatedSum = CalculatedSumWithTDS + parseFloat(GSTAmount.toFixed(2));;
    const formattedCalculatedSum = CalculatedSum.toFixed(2);

    this.VendorBillDocumentForm.get("TotalAmount").setValue(formattedCalculatedSum);
    this.VendorBillDocumentForm.get("BalancePending").setValue(formattedCalculatedSum);

  }
  async getSACcodeDropdown() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "sachsn_master",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      const SacCodeList = res.data.map((x) => {
        return {
          ...x,
          name: x.SNM,
          value: x.SID,
        };
      });
      this.filter.Filter(
        this.jsonControlVendorBalanceTaxationGSTFilterArray,
        this.VendorBalanceTaxationGSTFilterForm,
        SacCodeList,
        "GSTSACcode",
        false
      );
    }
  }
  StateChange() {
    const formValues = this.VendorBalanceTaxationGSTFilterForm.value;
    const Billbookingstate = formValues.Billbookingstate;
    const Vendorbillstate = formValues.Vendorbillstate;
    const SACcode = formValues.GSTSACcode;

    if (Billbookingstate && Vendorbillstate && SACcode) {
      const IsStateTypeUT =
        this.AllStateList.find(
          (item) => item.STNM === Vendorbillstate.name
        ).ISUT == true;
      const GSTAmount = this.tableData
        .filter((item) => item.isSelected)
        .reduce((acc, curr) => acc + parseFloat(curr["THCamount"]), 0);
      const GSTdata = { GSTAmount, GSTRate: SACcode.GSTRT };

      if (!IsStateTypeUT && Billbookingstate.name == Vendorbillstate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("IGST");

      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (
        !IsStateTypeUT &&
        Billbookingstate.name != Vendorbillstate.name
      ) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("CGST/SGST");
      }
    }
  }
  ShowOrHideBasedOnSameOrDifferentState(Check, GSTdata) {
    const filterFunctions = {
      UT: (x) => x.name !== "IGSTRate" && x.name !== "SGSTRate",
      SAME: (x) => x.name !== "IGSTRate" && x.name !== "UGSTRate",
      DIFF: (x) =>
        x.name !== "SGSTRate" && x.name !== "UGSTRate" && x.name !== "CGSTRate",
    };

    const GSTinputType = ["SGSTRate", "UGSTRate", "CGSTRate", "IGSTRate"];

    this.jsonControlVendorBalanceTaxationGSTFilterArray =
      this.AlljsonControlVendorBalanceTaxationGSTFilterArray.filter(
        filterFunctions[Check]
      );

    const GSTinput = this.jsonControlVendorBalanceTaxationGSTFilterArray
      .filter((item) => GSTinputType.includes(item.name))
      .map((item) => item.name);

    const GSTCalculateAmount = (
      (GSTdata.GSTAmount * GSTdata.GSTRate) /
      (100 * GSTinput.length)
    ).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.VendorBalanceTaxationGSTFilterForm.get(rateKey).setValue(
        GSTCalculateRate
      );
      this.VendorBalanceTaxationGSTFilterForm.get(amountKey).setValue(
        GSTCalculateAmount
      );
    };
    GSTinput.forEach((x) => calculateValues(x, x.substring(0, 4) + "Amount"));

    this.VendorBalanceTaxationGSTFilterForm.get("TotalGSTRate").setValue(
      (+GSTCalculateRate * GSTinput.length).toFixed(2)
    );
    this.VendorBalanceTaxationGSTFilterForm.get("GSTAmount").setValue(
      (+GSTCalculateAmount * GSTinput.length).toFixed(2)
    );
    this.CalculatePaymentAmount();
  }


  //#endregion
}
