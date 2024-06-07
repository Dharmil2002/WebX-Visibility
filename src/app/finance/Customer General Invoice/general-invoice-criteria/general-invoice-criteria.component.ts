import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";

import {
  VoucherDataRequestModel,
  VoucherInstanceType,
  VoucherRequestModel,
  VoucherType,
  ledgerInfo,
} from "src/app/Models/Finance/Finance";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { StorageService } from "src/app/core/service/storage.service";
import { StoreKeys } from "src/app/config/myconstants";
import { firstValueFrom } from "rxjs";
import { EncryptionService } from "src/app/core/service/encryptionService.service";
import { financialYear } from "src/app/Utility/date/date-utils";
import { AddGeneralInvoiceDetailComponent } from "../Modals/add-general-invoice-detail/add-general-invoice-detail.component";
import { CustomerGeneralInvoiceControl } from "src/assets/FormControls/Finance/InvoiceCollection/CustomerGeneralInvoicecontrol";
import { GetAccountDetailFromApi, GetsachsnFromApi, customerFromApi } from "../../Vendor Bills/VendorGeneralBill/general-bill-detail/generalbillAPIUtitlity";
import { GetStateListFromAPI } from "../../Vendor Payment/VendorPaymentAPIUtitlity";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { CustomerBillStatus } from "src/app/Models/docStatus";
import { OperationService } from "src/app/core/service/operations/operation.service";
@Component({
  selector: 'app-general-invoice-criteria',
  templateUrl: './general-invoice-criteria.component.html'
})
export class GeneralInvoiceCriteriaComponent implements OnInit {
  companyCode: number | null;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  breadScrums = [
    {
      title: "Customer Bill Generation - General",
      items: ["Finance"],
      active: "Customer Bill Generation - General",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-2";
  CustomerGeneralInvoiceControl: CustomerGeneralInvoiceControl;

  CustomerGeneralInvoiceForm: UntypedFormGroup;
  jsonControlCustomerGeneralInvoiceArray: any;

  // CustomerGeneralInvoiceTaxationTDSFilterForm: UntypedFormGroup;
  // jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray: any;
  // AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray: any;

  CustomerGeneralInvoiceTaxationGSTFilterForm: UntypedFormGroup;
  jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray: any;
  AlljsonControlCustomerGeneralInvoiceTaxationGSTFilterArray: any;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  staticField = [
    "LedgerInfo",
    "Amount",
    "GSTRate",
    "GSTAmount",
    "Total",
    "Document",
    "Narration",
  ];

  columnHeader = {
    LedgerInfo: {
      Title: "Ledger",
      class: "matcolumnfirst",
      Style: "min-width:150px",
    },
    Document: {
      Title: "Document No",
      class: "matcolumncenter",
      Style: "max-width:150px",
      datatype: "string"
    },
    Amount: {
      Title: "Amount ₹",
      class: "matcolumncenter",
      Style: "max-width:120px",
    },
    Narration: {
      Title: "Narration",
      class: "matcolumncenter",
      Style: "min-width:170px;max-width:170px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:50px",
    },
  };
  AccountsBanksList: any;
  tableData: any = [];
  DebitAgainstDocumentList: any = [];
  SACCodeList: any = [];
  LoadVoucherDetails = true;

  actionObject = {
    addRow: true,
    submit: true,
    search: true,
  };
  imageData: any;
  PartyNameList: any;
  AllStateList: any;
  StateList: any;
  AccountGroupList: any;
  AllLocationsList: any;

  CustomerDetails;
  TotalAmountList: { count: any; title: string; class: string }[];
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private ActiveRouter: ActivatedRoute,
    private filter: FilterUtils,
    private masterService: MasterService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    private matDialog: MatDialog,
    private customerService: CustomerService,
    private storage: StorageService,
    private operationService: OperationService,
    public snackBarUtilityService: SnackBarUtilityService
  ) {
    this.companyCode = this.storage.companyCode;
    this.TotalAmountList = [
      {
        count: "0.00",
        title: "Total Amount",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Balance Pending",
        class: `color-Success-light`,
      },
    ];
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.BindDataFromApi();
    //  this.getTDSSectionDropdown();
    this.CalculatePaymentAmount();
  }
  initializeFormControl() {
    this.CustomerGeneralInvoiceControl = new CustomerGeneralInvoiceControl(null);
    this.jsonControlCustomerGeneralInvoiceArray =
      this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceSummaryArrayControls();
    this.CustomerGeneralInvoiceForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerGeneralInvoiceArray,
    ]);


    // this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
    //   this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceTaxationTDSArrayControls();
    // this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
    //   this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray;
    // this.CustomerGeneralInvoiceTaxationTDSFilterForm = formGroupBuilder(this.fb, [
    //   this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray,
    // ]);

    this.AlljsonControlCustomerGeneralInvoiceTaxationGSTFilterArray =
      this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceTaxationGSTArrayControls();
    this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray =
      this.AlljsonControlCustomerGeneralInvoiceTaxationGSTFilterArray;
    this.CustomerGeneralInvoiceTaxationGSTFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray,
    ]);
  }
  async BindDataFromApi() {
    const DocumentsList = [
      {
        value: "DRS",
        name: "Delivery Run Sheet",
      },
      {
        value: "THCLTL",
        name: "THC LTL",
      },
      {
        value: "THCFTL",
        name: "THC FTL",
      },
      {
        value: "GCNFTL",
        name: "GCN FTL",
      },
      {
        value: "GCNLTL",
        name: "GCN LTL",
      },
      {
        value: "OTR",
        name: "Other",
      },
    ];
    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceArray,
      this.CustomerGeneralInvoiceForm,
      DocumentsList,
      "DocumentType",
      false
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService);
    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray,
      this.CustomerGeneralInvoiceTaxationGSTFilterForm,
      this.SACCodeList,
      "GSTSACcode",
      false
    );
    const responseFromAPI = await customerFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceArray,
      this.CustomerGeneralInvoiceForm,
      responseFromAPI,
      "CustomerName",
      false
    );

    this.BindLedger();
    this.getStateDropdown();
  }
  async BindLedger() {
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_detail",
      filter: {},
    };
    const resaccount_group = await this.masterService
      .masterPost("generic/get", account_groupReqBody)
      .toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map((x) => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter((x) => x != null)
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
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const LedgerDetails = this.tableData.find((x) => x.id == data.data.id);
      this.AddBillDetails(LedgerDetails);
    }
  }

  cancel(tabIndex: string): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  async AddBills() {
    this.AddBillDetails("");
  }

  // Add a new item to the table
  AddBillDetails(event) {
    const EditableId = event?.id;
    const request = {
      LedgerList: this.AccountGroupList,
      DocumentType: this.CustomerGeneralInvoiceForm.value.DocumentType.value,
      Details: event,
      CustomerDetails: this.CustomerDetails,
    };
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(AddGeneralInvoiceDetailComponent, {
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
          LedgerInfo: result?.LedgerHdn + ":" + result?.Ledger,
          Ledger: result?.Ledger,
          LedgerHdn: result?.LedgerHdn,
          Document: request.DocumentType == "OTR" ? result?.Document : result?.Document.value,
          DocumentType: request.DocumentType,
          Amount: result?.Amount,
          Narration: result?.Narration,
          SubCategoryName: result?.SubCategoryName,
          actions: ["Edit", "Remove"],
        };
        console.log(json);
        this.tableData.push(json);
        this.LoadVoucherDetails = true;
      }
      this.LoadVoucherDetails = true;
      this.CalculatePaymentAmount();
    });
  }
  // toggleTDSExempted() {
  //   const TDSExemptedValue =
  //     this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted;

  //   if (TDSExemptedValue) {
  //     this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
  //       this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray.filter(
  //         (x) => x.name == "TDSExempted"
  //       );
  //     const TDSSection = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSSection");
  //     TDSSection.setValue("");
  //     TDSSection.clearValidators();
  //     const TDSRate = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSRate");
  //     TDSRate.setValue("");
  //     TDSRate.clearValidators();
  //     const TDSAmount = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSAmount");
  //     TDSAmount.setValue("");
  //     TDSAmount.clearValidators();
  //     TDSAmount.updateValueAndValidity();
  //   } else {
  //     this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
  //       this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray;
  //     const TDSSection = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSSection");
  //     TDSSection.setValidators([
  //       Validators.required,
  //       autocompleteObjectValidator(),
  //     ]);
  //     const TDSRate = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSRate");
  //     TDSRate.setValidators([Validators.required]);
  //     const TDSAmount = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSAmount");
  //     TDSAmount.setValidators([Validators.required]);
  //     TDSAmount.updateValueAndValidity();
  //     this.getTDSSectionDropdown();
  //   }
  // }
  // async getTDSSectionDropdown() {
  //   let Accountinglocation = this.storage.branch;
  //   let responseFromAPITDS = await GetAccountDetailFromApi(
  //     this.masterService,
  //     "TDS",
  //     Accountinglocation
  //   );
  //   //this.TDSdata = responseFromAPITDS;
  //   this.filter.Filter(
  //     this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray,
  //     this.CustomerGeneralInvoiceTaxationTDSFilterForm,
  //     responseFromAPITDS,
  //     "TDSSection",
  //     false
  //   );
  // }
  // TDSSectionFieldChanged() {
  //   if (this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.value) {
  //     const TDSrate =
  //       this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection?.rOTHER || 0;
  //     const TotalTHCamount = this.tableData.reduce(
  //       (sum, x) => sum + parseFloat(x.Amount),
  //       0
  //     );
  //     const TDSamount = ((TDSrate * TotalTHCamount) / 100 || 0).toFixed(2);
  //     this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls["TDSRate"].setValue(
  //       TDSrate
  //     );
  //     this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls["TDSAmount"].setValue(
  //       TDSamount
  //     );
  //     this.CalculatePaymentAmount();
  //   }
  // }
  CalculatePaymentAmount() {
    const Total = this.tableData.reduce(
      (sum, x) => sum + parseFloat(x.Amount),
      0
    );

    // let TDSAmount =
    //   parseFloat(
    //     this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls.TDSAmount.value
    //   ) || 0;
    let GSTAmount =
      parseFloat(
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.controls.GSTAmount.value
      ) || 0;

    const CalculatedSumWithTDS = Total //- parseFloat(TDSAmount.toFixed(2));
    const CalculatedSum =
      CalculatedSumWithTDS + parseFloat(GSTAmount.toFixed(2));
    const formattedCalculatedSum = CalculatedSum.toFixed(2);

    this.TotalAmountList.forEach((x) => {
      if (x.title == "Balance Pending") {
        x.count = formattedCalculatedSum;
      }
      if (x.title == "Total Amount") {
        x.count = formattedCalculatedSum
      }
    });
  }

  StateChange() {
    const formValues = this.CustomerGeneralInvoiceTaxationGSTFilterForm.value;
    const Billbookingstate = formValues.Billbookingstate;
    const CustomerGeneralInvoicestate = formValues.CustomerGeneralInvoicestate;
    const SACcode = formValues.GSTSACcode;

    if (Billbookingstate && CustomerGeneralInvoicestate && SACcode) {
      const IsStateTypeUT =
        this.AllStateList.find((item) => item.STNM === CustomerGeneralInvoicestate.name)
          .ISUT == true;
      const GSTAmount = this.TotalAmountList.find((x) => x.title == "Total Amount").count;
      const GSTdata = { GSTAmount, GSTRate: SACcode.GSTRT };

      if (!IsStateTypeUT && Billbookingstate.name == CustomerGeneralInvoicestate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTdata);
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTdata);
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (
        !IsStateTypeUT &&
        Billbookingstate.name != CustomerGeneralInvoicestate.name
      ) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTdata);
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTType").setValue(
          "CGST/SGST"
        );
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

    this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray = this.AlljsonControlCustomerGeneralInvoiceTaxationGSTFilterArray.filter(filterFunctions[Check]);
    const GSTinput = this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray.filter((item) => GSTinputType.includes(item.name)).map((item) => item.name);

    const GSTCalculateAmount = ((GSTdata.GSTAmount * GSTdata.GSTRate) / (100 * GSTinput.length)).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.CustomerGeneralInvoiceTaxationGSTFilterForm.get(rateKey).setValue(GSTCalculateRate);
      this.CustomerGeneralInvoiceTaxationGSTFilterForm.get(amountKey).setValue(GSTCalculateAmount);
    };

    GSTinput.forEach((x) => calculateValues(x, x.substring(0, 4) + "Amount"));

    this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("TotalGSTRate").setValue((+GSTCalculateRate * GSTinput.length).toFixed(2));
    this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTAmount").setValue((+GSTCalculateAmount * GSTinput.length).toFixed(2));
    this.CalculatePaymentAmount();
  }
  toggleCustomerGSTRegistered() {
    const CustomerGSTRegistered =
      this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CustomerGSTRegistered;

    if (CustomerGSTRegistered) {
      // this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray = this.AlljsonControlCustomerGeneralInvoiceTaxationGSTFilterArray;

      const GSTSACcode = this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate =
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      Billbookingstate.updateValueAndValidity();

      const CustomerGeneralInvoicestate =
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("CustomerGeneralInvoicestate");
      CustomerGeneralInvoicestate.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      CustomerGeneralInvoicestate.updateValueAndValidity();

      this.getStateDropdown();
    } else {
      const GSTSACcode = this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValue("");
      GSTSACcode.clearValidators();
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate =
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValue("");
      Billbookingstate.clearValidators();
      Billbookingstate.updateValueAndValidity();

      const CustomerGeneralInvoicestate =
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.get("CustomerGeneralInvoicestate");
      CustomerGeneralInvoicestate.setValue("");
      CustomerGeneralInvoicestate.clearValidators();
      CustomerGeneralInvoicestate.updateValueAndValidity();
    }
  }
  async getStateDropdown() {
    const resState = await GetStateListFromAPI(this.masterService);
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map((x) => ({
        value: x.ST,
        name: x.STNM,
      }))
      .filter((x) => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray,
      this.CustomerGeneralInvoiceTaxationGSTFilterForm,
      this.StateList,
      "Billbookingstate",
      false
    );
    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceTaxationGSTFilterArray,
      this.CustomerGeneralInvoiceTaxationGSTFilterForm,
      this.StateList,
      "CustomerGeneralInvoicestate",
      false
    );
  }
  //#endregion


  //#endregion Disbale Button Based On Form Validity
  isFormValid() {
    let isValid = this.CustomerGeneralInvoiceForm.valid && this.tableData.length > 0;

    // if (!this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted) {
    //   isValid = isValid && this.CustomerGeneralInvoiceTaxationTDSFilterForm.valid;
    // }
    if (this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CustomerGSTRegistered) {
      isValid = isValid && this.CustomerGeneralInvoiceTaxationGSTFilterForm.valid;
    }

    return isValid;
  }
  async PartyNameFieldChanged(event) {
    this.CustomerDetails = event.eventArgs.option.value.details;
  }
  async BookCustomerGeneralInvoice() {

    if (this.tableData.length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Add Atleast One Data in Table"
      );
    } else {
      const customerName = this.CustomerDetails.customerName;
      const customerCode = this.CustomerDetails.customerCode;
      const custList = await this.customerService.customerFromFilter({ customerCode: customerCode }, false);
      const custGroup = await this.customerService.customerGroupFilter(custList[0]?.customerGroup);

      let jsonBillingList = [];


      this.tableData.forEach((element) => {
        let jsonBilling = {
          _id: "",
          bILLNO: "",
          dKTNO: element?.Document || "",
          cID: this.storage.companyCode,
          oRGN: "",
          dEST: "",
          dKTDT: "",
          cHRGWT: "",
          dKTAMT: element?.Amount || 0.00,
          dKTTOT: element?.Amount || 0.00,
          sUBTOT: element?.Amount || 0.00,
          gSTTOT: 0.00,
          gSTRT: 0.00,
          tOTAMT: element?.Amount || 0.00,
          fCHRG: 0.00,
          sGST: 0,
          sGSTRT: 0,
          cGST: 0,
          cGSTRT: 0,
          uTGST: 0,
          uTGSTRT: 0,
          iGST: 0,
          iGSTRT: 0,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch || "",
          eNTBY: this.storage?.userName || "",
        }
        jsonBillingList.push(jsonBilling);
      });
      const billData = {
        "_id": `${this.storage.companyCode}` || "",
        "cID": this.storage.companyCode,
        "companyCode": this.storage.companyCode,
        "dOCTYP": "General",
        "dOCCD": "G",
        "bUSVRT": "",
        "bILLNO": "",
        "bGNDT": this.CustomerGeneralInvoiceForm.value.CustomerBillDate || new Date(),
        "bDUEDT": this.CustomerGeneralInvoiceForm.value.DueDate || new Date(),
        "bLOC": this.storage.branch,
        "pAYBAS": "",
        "tRNMODE": "",
        "bSTS": CustomerBillStatus.Generated,
        "bSTSNM": CustomerBillStatus[CustomerBillStatus.Generated],
        "bSTSDT": new Date(),
        "eXMT": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CustomerGSTRegistered || false,
        "eXMTRES": "",
        "gEN": {
          "lOC": this.storage.branch,
          "cT": "",
          "sT": "",
          "gSTIN": "",
        },
        "sUB": {
          "lOC": "",
          "tO": "",
          "tOMOB": "",
          "dTM": "",
          "dOC": ""
        },
        "cOL": {
          "lOC": "",
          "aMT": 0.00,
          "bALAMT": this.TotalAmountList.find((x) => x.title == "Balance Pending").count || 0.00,
        },
        "cUST": {
          "cD": customerCode,
          "nM": customerName,
          "tEL": this.CustomerDetails?.customer_mobile || "",
          "aDD": this.CustomerDetails?.RegisteredAddress || "",
          "eML": this.CustomerDetails?.Customer_Emails || "",
          "cT": this.CustomerDetails?.city || "",
          "sT": this.CustomerDetails?.state || "",
          "gSTIN": this.CustomerDetails?.GSTdetails ? this.CustomerDetails?.GSTdetails?.[0]?.gstNo : "",
          "cGCD": custGroup?.groupCode || "",
          "cGNM": custGroup?.groupName || "",
        },
        "gST": {
          "tYP": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.GSTType || "",
          "rATE": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.TotalGSTRate || 0.00,
          "iGST": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.IGSTAmount || 0.00,
          "cGST": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CGSTAmount || 0.00,
          "uTGST": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.UGSTAmount || 0.00,
          "sGST": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.SGSTAmount || 0.00,
          "aMT": this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.GSTAmount || 0.00,
        },
        "sUPDOC": "",
        "pRODID": 1,
        "dKTCNT": this.tableData.length || 0,
        "CURR": "INR",
        "dKTTOT": this.TotalAmountList.find((x) => x.title == "Total Amount").count || 0.00,
        "gROSSAMT": this.TotalAmountList.find((x) => x.title == "Total Amount").count || 0.00,
        "rOUNOFFAMT": 0.00,
        "aMT": this.TotalAmountList.find((x) => x.title == "Total Amount").count || 0.00,
        "custDetails": jsonBillingList,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName,
      }
      console.log(billData)
      const req = {
        companyCode: this.storage.companyCode,
        docType: "BILL",
        branch: this.storage.branch,
        finYear: financialYear,
        party: customerName.toUpperCase(),
        collectionName: "cust_bill_headers",
        data: billData
      };
      const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/create", req));
      //  return res.data.ops[0].docNo
      if (res.data.ops[0].docNo) {
        //const update = await UpdateDetail(this.masterService, this.invoiceTableForm.value);
        Swal.fire({
          icon: "success",
          title: "Successfully Generated",
          text: `Invoice Successfully Generated Invoice number is ${res.data.ops[0].docNo}`,
          showConfirmButton: true,
        });
        this.cancel('Billing​');
      }

    }
  }
}
