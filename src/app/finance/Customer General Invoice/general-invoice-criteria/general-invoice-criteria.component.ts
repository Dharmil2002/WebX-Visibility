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
import { GetAccountDetailFromApi, GetsachsnFromApi } from "../../Vendor Bills/VendorGeneralBill/general-bill-detail/generalbillAPIUtitlity";
import { GetStateListFromAPI } from "../../Vendor Payment/VendorPaymentAPIUtitlity";
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

  CustomerGeneralInvoiceTaxationTDSFilterForm: UntypedFormGroup;
  jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray: any;
  AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray: any;

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
  Request = {
    CustomerName: "",
    CustomerCode: "",
    CustomerPan: "",
  };
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
    private objImageHandling: ImageHandling,
    private storage: StorageService,
    private encryptionService: EncryptionService,
    public snackBarUtilityService: SnackBarUtilityService
  ) {
    this.companyCode = this.storage.companyCode;
    this.ActiveRouter.queryParams.subscribe((params) => {
      const encryptedData = params["data"];
      const decryptedData = this.encryptionService.decrypt(encryptedData);
      const Response = JSON.parse(decryptedData);
      this.Request.CustomerCode = Response.CustomerName.value;
      this.Request.CustomerName = Response.CustomerName.name;
      this.Request.CustomerPan = Response.CustomerPANNumber;
    });
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
    this.getTDSSectionDropdown();
    this.CalculatePaymentAmount();
    this.GetCustomerInformation();
  }
  initializeFormControl() {
    this.CustomerGeneralInvoiceControl = new CustomerGeneralInvoiceControl(this.Request);
    this.jsonControlCustomerGeneralInvoiceArray =
      this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceSummaryArrayControls();
    this.CustomerGeneralInvoiceForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerGeneralInvoiceArray,
    ]);


    this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
      this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceTaxationTDSArrayControls();
    this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
      this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray;
    this.CustomerGeneralInvoiceTaxationTDSFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray,
    ]);

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

  async GetCustomerInformation() {
    const companyCode = this.storage.companyCode;
    const filter = { CustomerCode: this.Request.CustomerCode };
    const req = { companyCode, collectionName: "Customer_detail", filter };
    const res: any = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );

    if (res.success && res.data.length != 0) {
      this.CustomerDetails = res.data[0];

      // if (this.CustomerDetails?.otherdetails) {
      //   this.CustomerGeneralInvoiceTaxationGSTFilterForm.controls.CustomerGSTRegistered.setValue(
      //     true
      //   );
      //   this.CustomerGeneralInvoiceTaxationGSTFilterForm.controls.GSTNumber.setValue(
      //     this.CustomerDetails?.otherdetails[0]?.gstNumber
      //   );
      //   const getValue = this.StateList.find(
      //     (item) => item.name == this.CustomerDetails?.otherdetails[0]?.gstState
      //   );
      //   console.log("getValue", getValue);
      //   this.CustomerGeneralInvoiceTaxationGSTFilterForm.controls.Billbookingstate.setValue(
      //     getValue || ""
      //   );
      // }
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
  toggleTDSExempted() {
    const TDSExemptedValue =
      this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted;

    if (TDSExemptedValue) {
      this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
        this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray.filter(
          (x) => x.name == "TDSExempted"
        );
      const TDSSection = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    } else {
      this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray =
        this.AlljsonControlCustomerGeneralInvoiceTaxationTDSFilterArray;
      const TDSSection = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      const TDSRate = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount = this.CustomerGeneralInvoiceTaxationTDSFilterForm.get("TDSAmount");
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
      this.jsonControlCustomerGeneralInvoiceTaxationTDSFilterArray,
      this.CustomerGeneralInvoiceTaxationTDSFilterForm,
      responseFromAPITDS,
      "TDSSection",
      false
    );
  }
  TDSSectionFieldChanged() {
    if (this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.value) {
      const TDSrate =
        this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection?.rOTHER || 0;
      const TotalTHCamount = this.tableData.reduce(
        (sum, x) => sum + parseFloat(x.Amount),
        0
      );
      const TDSamount = ((TDSrate * TotalTHCamount) / 100 || 0).toFixed(2);
      this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls["TDSRate"].setValue(
        TDSrate
      );
      this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls["TDSAmount"].setValue(
        TDSamount
      );
      this.CalculatePaymentAmount();
    }
  }
  CalculatePaymentAmount() {
    const Total = this.tableData.reduce(
      (sum, x) => sum + parseFloat(x.Amount),
      0
    );

    let TDSAmount =
      parseFloat(
        this.CustomerGeneralInvoiceTaxationTDSFilterForm.controls.TDSAmount.value
      ) || 0;
    let GSTAmount =
      parseFloat(
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.controls.GSTAmount.value
      ) || 0;

    const CalculatedSumWithTDS = Total - parseFloat(TDSAmount.toFixed(2));
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
  // Step 2 Create Customer Bill in vend_bill_summary Collection And vend_bill_det collection and update thc_summary
  BookCustomerGeneralInvoice() {
    if (this.tableData.length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Add Atleast One Data in Table"
      );
    } else {
      const PaymentAmount = this.TotalAmountList.find((x) => x.title == "Balance Pending").count;
      const NetPayable = this.TotalAmountList.find((x) => x.title == "Total Amount").count;
    }
  }
  //#endregion
  //setep 3 Creating voucher_trans And voucher_trans_details And voucher_trans_document collection
  SubmitJournalVoucherData(BillNo) {
    this.snackBarUtilityService.commonToast(() => {
      try {
        const PaymentAmount = parseFloat(this.TotalAmountList.find((x) => x.title == "Balance Pending").count);
        const NetPayable = parseFloat(this.TotalAmountList.find((x) => x.title == "Total Amount").count);

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode =
          VoucherInstanceType.BalancePayment;
        this.VoucherDataRequestModel.transType =
          VoucherInstanceType[VoucherInstanceType.BalancePayment];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType =
          VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation =
          this.tableData[0].OthersData?.cLOC || this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        this.VoucherDataRequestModel.partyCode =
          this.tableData[0].OthersData?.vND?.cD || "";
        this.VoucherDataRequestModel.partyName =
          this.tableData[0].OthersData?.vND?.nM || "";
        this.VoucherDataRequestModel.partyState =
          this.CustomerDetails?.CustomerState;
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = this.CustomerDetails?.panNo;
        this.VoucherDataRequestModel.tdsSectionCode = !this
          .CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted
          ? this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.value
          : "";
        this.VoucherDataRequestModel.tdsSectionName = !this
          .CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted
          ? this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.name
          : "";
        this.VoucherDataRequestModel.tdsRate = !this
          .CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted
          ? +this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSRate
          : 0;
        this.VoucherDataRequestModel.tdsAmount = !this
          .CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted
          ? +this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSAmount
          : 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined;
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST =
          parseFloat(this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.IGSTAmount) ||
          0;
        this.VoucherDataRequestModel.SGST =
          parseFloat(this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.SGSTAmount) ||
          0;
        this.VoucherDataRequestModel.CGST =
          parseFloat(this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CGSTAmount) ||
          0;
        this.VoucherDataRequestModel.UGST =
          parseFloat(this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.UGSTAmount) ||
          0;
        this.VoucherDataRequestModel.GSTTotal =
          parseFloat(this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = 0;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        const SelectedData = this.tableData;
        const voucherlineItems = this.GetJournalVoucherLedgers(BillNo);

        this.VoucherRequestModel.details = voucherlineItems;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];
        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel))
          .then((res: any) => {
            if (res.success) {
              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.tableData[0].OthersData?.cLOC || this.storage.branch,
                transCode: VoucherInstanceType.BalancePayment,
                transType:
                  VoucherInstanceType[VoucherInstanceType.BalancePayment],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                docType: "Voucher",
                partyType: "Customer",
                docNo: BillNo,
                partyCode: "" + this.tableData[0].OthersData?.vND?.cD || "",
                partyName: this.tableData[0].OthersData?.vND?.nM || "",
                entryBy: this.storage.userName,
                entryDate: Date(),
                debit: voucherlineItems
                  .filter((item) => item.credit == 0)
                  .map(function (item) {
                    return {
                      accCode: item.accCode,
                      accName: item.accName,
                      accCategory: item.accCategory,
                      amount: item.debit,
                      narration: item.narration ?? "",
                    };
                  }),
                credit: voucherlineItems
                  .filter((item) => item.debit == 0)
                  .map(function (item) {
                    return {
                      accCode: item.accCode,
                      accName: item.accName,
                      accCategory: item.accCategory,
                      amount: item.credit,
                      narration: item.narration ?? "",
                    };
                  }),
              };
              firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then((res: any) => {
                if (res.success) {
                  Swal.fire({
                    icon: "success",
                    title: "Voucher And Bill Generated Successfully",
                    text:
                      "Bill No: " + BillNo + " Voucher No: " + reqBody.voucherNo,
                    showConfirmButton: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.hideLoading();
                      setTimeout(() => {
                        Swal.close();
                        // Move to Back Page
                        this.router.navigateByUrl("/Finance/CustomerGeneralInvoiceGeneration/Criteria", {
                          state: [],
                        });
                      }, 1000);
                    }
                  });
                } else {
                  // Delete Vouchers Data When Posting Failed
                  this.voucherServicesService.DeleteVoucherAndVoucherDetails(res?.data?.mainData?.ops[0].vNO);
                  this.snackBarUtilityService.ShowCommonSwal(
                    "error",
                    "Fail To Do Account Posting..!"
                  );
                }
              });
            }
            else {
              this.voucherServicesService.DeleteVoucherAndVoucherDetails(res?.data?.mainData?.ops[0].vNO);
              this.snackBarUtilityService.ShowCommonSwal("error", res.message);
              Swal.hideLoading();
              setTimeout(() => {
                Swal.close();
              }, 1000);
            }
          })
          .catch((error) => {
            this.snackBarUtilityService.ShowCommonSwal("error", error);
          })
          .finally(() => { });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "Fail To Submit Data..!"
        );
      }
    }, "Customer Bill Voucher Generating..!");
  }
  GetJournalVoucherLedgers(BillNo) {
    const createVoucher = (
      accCode,
      accName,
      accCategory,
      debit,
      credit,
      THC,
      BillNo,
      sacCode = "",
      sacName = ""
    ) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BalancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacCode,
      sacName: sacName,
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill Generated For : ${THC}  Against Bill No : ${BillNo}`,
    });

    const Result = [];
    const DocumentList = this.tableData.map((x) => x.Document).toString();

    //#region Push TDS Sectiond Data
    if (!this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted) {
      if (+this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSAmount != 0) {
        Result.push(createVoucher(
          this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.value,
          this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSSection.name,
          "LIABILITY",
          0,
          +this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSAmount,
          DocumentList,
          BillNo
        ));
      }
    }
    //#endregion

    //#region Push GST Data
    if (this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.GSTAmount != 0) {
      if (this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.IGSTAmount != 0) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002004"].LeadgerCode,
            ledgerInfo["LIA002004"].LeadgerName,
            ledgerInfo["LIA002004"].LeadgerCategory,
            +this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.IGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      } else if (
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CGSTAmount != 0 &&
        this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.SGSTAmount != 0
      ) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002003"].LeadgerCode,
            ledgerInfo["LIA002003"].LeadgerName,
            ledgerInfo["LIA002003"].LeadgerCategory,
            +this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
        Result.push(
          createVoucher(
            ledgerInfo["LIA002001"].LeadgerCode,
            ledgerInfo["LIA002001"].LeadgerName,
            ledgerInfo["LIA002001"].LeadgerCategory,
            +this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.SGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      } else if (this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.UGSTAmount != 0) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002002"].LeadgerCode,
            ledgerInfo["LIA002002"].LeadgerName,
            ledgerInfo["LIA002002"].LeadgerCategory,
            +this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.UGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.CustomerGeneralInvoiceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      }
    }
    //#endregion
    //#region Push Transaction Data

    // Step 1: Group By Ledger
    const LedgerGroup = this.tableData.reduce((acc, item) => {
      if (!acc[item.LedgerHdn]) {
        acc[item.LedgerHdn] = [];
      }
      acc[item.LedgerHdn].push(item);
      return acc;
    }, {});

    // Step 2: Create Ledger Info
    const LedgerInfo = Object.keys(LedgerGroup).map((key) => {
      return {
        LeadgerCode: LedgerGroup[key][0].LedgerHdn,
        LeadgerName: LedgerGroup[key][0].Ledger,
        LeadgerCategory: "EXPENSE",
        Amount: LedgerGroup[key].reduce((acc, item) => acc + parseFloat(item.Amount), 0),
      };
    });

    // Step 3: Create Voucher Data
    LedgerInfo.forEach((item) => {
      Result.push(
        createVoucher(
          item.LeadgerCode,
          item.LeadgerName,
          item.LeadgerCategory,
          0,
          item.Amount,
          DocumentList,
          BillNo
        )
      );
    });
    //#endregion

    const TotalDebit = Result.reduce((a, b) => a + parseFloat(b.debit), 0);
    const TotalCredit = Result.reduce((a, b) => a + parseFloat(b.credit), 0);

    let difference = TotalDebit - TotalCredit;

    Result.push(
      createVoucher(
        ledgerInfo["LIA001002"].LeadgerCode,
        ledgerInfo["LIA001002"].LeadgerName,
        ledgerInfo["LIA001002"].LeadgerCategory,
        difference > 0 ? 0 : Math.abs(difference),
        difference < 0 ? 0 : Math.abs(difference),
        DocumentList,
        BillNo
      )
    );

    return Result;
  }
  //#endregion Disbale Button Based On Form Validity
  isFormValid() {
    let isValid = this.CustomerGeneralInvoiceForm.valid && this.tableData.length > 0;

    if (!this.CustomerGeneralInvoiceTaxationTDSFilterForm.value.TDSExempted) {
      isValid = isValid && this.CustomerGeneralInvoiceTaxationTDSFilterForm.valid;
    }
    if (this.CustomerGeneralInvoiceTaxationGSTFilterForm.value.CustomerGSTRegistered) {
      isValid = isValid && this.CustomerGeneralInvoiceTaxationGSTFilterForm.valid;
    }

    return isValid;
  }
}
