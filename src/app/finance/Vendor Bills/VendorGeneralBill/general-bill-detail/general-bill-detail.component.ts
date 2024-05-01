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
  DriversFromApi,
  GetAccountDetailFromApi,
  GetBankDetailFromApi,
  GetLocationDetailFromApi,
  GetSingleCustomerDetailsFromApi,
  GetSingleVendorDetailsFromApi,
  GetsachsnFromApi,
  UsersFromApi,
  customerFromApi,
  vendorFromApi,
} from "./generalbillAPIUtitlity";
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
import { AddGeneralBillDetailComponent } from "../Modals/add-general-bill-detail/add-general-bill-detail.component";
import { VendorGeneralBillControl } from "src/assets/FormControls/Finance/VendorPayment/VendorGeneralBillcontrol";
import { firstValueFrom } from "rxjs";
import { GetStateListFromAPI } from "src/app/finance/Vendor Payment/VendorPaymentAPIUtitlity";
import { EncryptionService } from "src/app/core/service/encryptionService.service";
import { VendorBillEntry } from "src/app/Models/Finance/VendorPayment";
import { financialYear } from "src/app/Utility/date/date-utils";
@Component({
  selector: "app-general-bill-detail",
  templateUrl: "./general-bill-detail.component.html",
})
export class GeneralBillDetailComponent implements OnInit {
  companyCode: number | null;
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

  VendorBillTaxationTDSFilterForm: UntypedFormGroup;
  jsonControlVendorBillTaxationTDSFilterArray: any;
  AlljsonControlVendorBillTaxationTDSFilterArray: any;

  VendorBillTaxationGSTFilterForm: UntypedFormGroup;
  jsonControlVendorBillTaxationGSTFilterArray: any;
  AlljsonControlVendorBillTaxationGSTFilterArray: any;

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
    "Ledger",
    "SACCode",
    "Amount",
    "GSTRate",
    "GSTAmount",
    "Total",
    "Document",
    "Narration",
  ];

  columnHeader = {
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
      Style: "min-width:170px;max-width:170px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:100px",
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
    VendorName: "",
    VendorCode: "",
    VendorPan: "",
  };
  VendorDetails;
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
      this.Request.VendorCode = Response.VendorName.value;
      this.Request.VendorName = Response.VendorName.name;
      this.Request.VendorPan = Response.VendorPANNumber;
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
    this.GetVendorInformation();
  }
  initializeFormControl() {
    this.VendorBillControl = new VendorGeneralBillControl(this.Request);
    this.jsonControlVendorBillArray =
      this.VendorBillControl.getVendorBillSummaryArrayControls();
    this.VendorBillForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBillArray,
    ]);


    this.jsonControlVendorBillTaxationTDSFilterArray =
      this.VendorBillControl.getVendorBillTaxationTDSArrayControls();
    this.AlljsonControlVendorBillTaxationTDSFilterArray =
      this.jsonControlVendorBillTaxationTDSFilterArray;
    this.VendorBillTaxationTDSFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBillTaxationTDSFilterArray,
    ]);

    this.AlljsonControlVendorBillTaxationGSTFilterArray =
      this.VendorBillControl.getVendorBillTaxationGSTArrayControls();
    this.jsonControlVendorBillTaxationGSTFilterArray =
      this.AlljsonControlVendorBillTaxationGSTFilterArray;
    this.VendorBillTaxationGSTFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBillTaxationGSTFilterArray,
    ]);
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
      this.jsonControlVendorBillArray,
      this.VendorBillForm,
      DocumentsList,
      "DocumentSelection",
      false
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService);
    this.filter.Filter(
      this.jsonControlVendorBillTaxationGSTFilterArray,
      this.VendorBillTaxationGSTFilterForm,
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

  async GetVendorInformation() {
    const companyCode = this.storage.companyCode;
    const filter = { vendorCode: this.Request.VendorCode };
    const req = { companyCode, collectionName: "vendor_detail", filter };
    const res: any = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );

    if (res.success && res.data.length != 0) {
      this.VendorDetails = res.data[0];

      // if (this.VendorDetails?.otherdetails) {
      //   this.VendorBillTaxationGSTFilterForm.controls.VendorGSTRegistered.setValue(
      //     true
      //   );
      //   this.VendorBillTaxationGSTFilterForm.controls.GSTNumber.setValue(
      //     this.VendorDetails?.otherdetails[0]?.gstNumber
      //   );
      //   const getValue = this.StateList.find(
      //     (item) => item.name == this.VendorDetails?.otherdetails[0]?.gstState
      //   );
      //   console.log("getValue", getValue);
      //   this.VendorBillTaxationGSTFilterForm.controls.Billbookingstate.setValue(
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
      SACCode: this.SACCodeList,
      DocumentType: this.VendorBillForm.value.DocumentSelection.value,
      Details: event,
    };
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
          Document:
            request.DocumentType == "OTR"
              ? result?.Document
              : result?.Document.value,
          DocumentType: request.DocumentType,
          Amount: result?.Amount,
          GSTRate: result?.GSTRate,
          GSTAmount: result?.GSTAmount,
          Total: result?.Total,
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
      this.VendorBillTaxationTDSFilterForm.value.TDSExempted;

    if (TDSExemptedValue) {
      this.jsonControlVendorBillTaxationTDSFilterArray =
        this.AlljsonControlVendorBillTaxationTDSFilterArray.filter(
          (x) => x.name == "TDSExempted"
        );
      const TDSSection = this.VendorBillTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorBillTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount = this.VendorBillTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    } else {
      this.jsonControlVendorBillTaxationTDSFilterArray =
        this.AlljsonControlVendorBillTaxationTDSFilterArray;
      const TDSSection = this.VendorBillTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      const TDSRate = this.VendorBillTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount = this.VendorBillTaxationTDSFilterForm.get("TDSAmount");
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
      this.jsonControlVendorBillTaxationTDSFilterArray,
      this.VendorBillTaxationTDSFilterForm,
      responseFromAPITDS,
      "TDSSection",
      false
    );
  }
  TDSSectionFieldChanged() {
    if (this.VendorBillTaxationTDSFilterForm.value.TDSSection.value) {
      const TDSrate =
        this.VendorBillTaxationTDSFilterForm.value.TDSSection?.rOTHER || 0;
      const TotalTHCamount = this.tableData.reduce(
        (sum, x) => sum + parseFloat(x.Amount),
        0
      );
      const TDSamount = ((TDSrate * TotalTHCamount) / 100 || 0).toFixed(2);
      this.VendorBillTaxationTDSFilterForm.controls["TDSRate"].setValue(
        TDSrate
      );
      this.VendorBillTaxationTDSFilterForm.controls["TDSAmount"].setValue(
        TDSamount
      );
      this.CalculatePaymentAmount();
    }
  }
  CalculatePaymentAmount() {
    const Amount = this.tableData.reduce(
      (sum, x) => sum + parseFloat(x.Amount),
      0
    );

    let TDSAmount =
      parseFloat(
        this.VendorBillTaxationTDSFilterForm.controls.TDSAmount.value
      ) || 0;
    let GSTAmount =
      parseFloat(
        this.VendorBillTaxationGSTFilterForm.controls.GSTAmount.value
      ) || 0;

    const CalculatedSumWithTDS = Amount - parseFloat(TDSAmount.toFixed(2));
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
    const formValues = this.VendorBillTaxationGSTFilterForm.value;
    const Billbookingstate = formValues.Billbookingstate;
    const Vendorbillstate = formValues.Vendorbillstate;
    const SACcode = formValues.GSTSACcode;

    if (Billbookingstate && Vendorbillstate && SACcode) {
      const IsStateTypeUT =
        this.AllStateList.find((item) => item.STNM === Vendorbillstate.name)
          .ISUT == true;
      const GSTAmount = this.tableData.reduce(
        (acc, curr) => acc + parseFloat(curr["GSTAmount"]),
        0
      );
      const GSTdata = { GSTAmount, GSTRate: SACcode.GSTRT };

      if (!IsStateTypeUT && Billbookingstate.name == Vendorbillstate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTdata);
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTdata);
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (
        !IsStateTypeUT &&
        Billbookingstate.name != Vendorbillstate.name
      ) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTdata);
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue(
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

    this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray.filter(filterFunctions[Check]);
    const GSTinput = this.jsonControlVendorBillTaxationGSTFilterArray.filter((item) => GSTinputType.includes(item.name)).map((item) => item.name);

    const GSTCalculateAmount = ((GSTdata.GSTAmount * GSTdata.GSTRate) / (100 * GSTinput.length)).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.VendorBillTaxationGSTFilterForm.get(rateKey).setValue(GSTCalculateRate);
      this.VendorBillTaxationGSTFilterForm.get(amountKey).setValue(GSTCalculateAmount);
    };

    GSTinput.forEach((x) => calculateValues(x, x.substring(0, 4) + "Amount"));

    this.VendorBillTaxationGSTFilterForm.get("TotalGSTRate").setValue((+GSTCalculateRate * GSTinput.length).toFixed(2));
    this.VendorBillTaxationGSTFilterForm.get("GSTAmount").setValue((+GSTCalculateAmount * GSTinput.length).toFixed(2));
    this.CalculatePaymentAmount();
  }
  toggleVendorGSTRegistered() {
    const VendorGSTRegistered =
      this.VendorBillTaxationGSTFilterForm.value.VendorGSTRegistered;

    if (VendorGSTRegistered) {
      // this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray;

      const GSTSACcode = this.VendorBillTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate =
        this.VendorBillTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      Billbookingstate.updateValueAndValidity();

      const Vendorbillstate =
        this.VendorBillTaxationGSTFilterForm.get("Vendorbillstate");
      Vendorbillstate.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      Vendorbillstate.updateValueAndValidity();

      this.getStateDropdown();
    } else {
      // this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray.filter((x) => x.name == "VendorGSTRegistered");
      const GSTSACcode = this.VendorBillTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValue("");
      GSTSACcode.clearValidators();
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate =
        this.VendorBillTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValue("");
      Billbookingstate.clearValidators();
      Billbookingstate.updateValueAndValidity();

      const Vendorbillstate =
        this.VendorBillTaxationGSTFilterForm.get("Vendorbillstate");
      Vendorbillstate.setValue("");
      Vendorbillstate.clearValidators();
      Vendorbillstate.updateValueAndValidity();
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
      this.jsonControlVendorBillTaxationGSTFilterArray,
      this.VendorBillTaxationGSTFilterForm,
      this.StateList,
      "Billbookingstate",
      false
    );
    this.filter.Filter(
      this.jsonControlVendorBillTaxationGSTFilterArray,
      this.VendorBillTaxationGSTFilterForm,
      this.StateList,
      "Vendorbillstate",
      false
    );
  }
  // Step 2 Create Vendor Bill in vend_bill_summary Collection And vend_bill_det collection and update thc_summary
  BookVendorBill() {
    if (this.tableData.length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Add Atleast One Data in Table"
      );
    } else {
      const PaymentAmount = this.TotalAmountList.find(
        (x) => x.title == "Balance Pending"
      ).count;
      const NetPayable = this.TotalAmountList.find(
        (x) => x.title == "Total Amount"
      ).count;
      const RoundOffAmount = NetPayable - PaymentAmount;
      this.snackBarUtilityService.commonToast(async () => {
        try {
          const vendorBillEntry: VendorBillEntry = {
            companyCode: this.companyCode,
            docType: "VB",
            branch: this.storage.branch,
            finYear: financialYear,
            data: {
              cID: this.companyCode,
              docNo: "",
              bDT: new Date(),
              tMOD: "",
              lOC: this.VendorDetails?.vendorCity,
              sT: this.VendorBillTaxationGSTFilterForm.controls.Vendorbillstate
                .value?.value,
              gSTIN:
                this.VendorBillTaxationGSTFilterForm.controls.VGSTNumber.value,
              tHCAMT: PaymentAmount,
              aDVAMT: 0,
              bALAMT: NetPayable,
              rOUNOFFAMT: RoundOffAmount,
              bALPBAMT: NetPayable,
              bSTAT: 1,
              bSTATNM: "Awaiting Approval",
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName,
              vND: {
                cD: this.VendorDetails?.vendorCode,
                nM: this.VendorDetails?.vendorName,
                pAN: this.VendorDetails?.panNo,
                aDD: this.VendorDetails?.vendorAddress,
                mOB: this.VendorDetails?.vendorPhoneNo
                  ? this.VendorDetails?.vendorPhoneNo.toString()
                  : "",
                eML: this.VendorDetails?.emailId,
                gSTREG:
                  this.VendorBillTaxationGSTFilterForm.controls
                    .VendorGSTRegistered.value,
                sT: this.VendorBillTaxationGSTFilterForm.controls
                  .Billbookingstate.value?.value,
                gSTIN:
                  this.VendorBillTaxationGSTFilterForm.controls.GSTNumber.value,
              },
              tDS: {
                eXMT: this.VendorBillTaxationTDSFilterForm.value.TDSExempted,
                sEC: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted
                  ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.value
                  : "",
                sECD: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted
                  ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.name
                  : "",
                rATE: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted
                  ? this.VendorBillTaxationTDSFilterForm.value.TDSRate
                  : 0,
                aMT: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted
                  ? this.VendorBillTaxationTDSFilterForm.value.TDSAmount
                  : 0,
              },
              gST: {
                sAC: this.VendorBillTaxationGSTFilterForm.value.GSTSACcode
                  ?.value
                  ? this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.value.toString()
                  : "",
                sACNM: this.VendorBillTaxationGSTFilterForm.value.GSTSACcode
                  ?.name
                  ? this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.name.toString()
                  : "",
                tYP: this.VendorBillTaxationGSTFilterForm.value.GSTType,
                rATE:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.TotalGSTRate
                  ) || 0,
                iGRT:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.IGSTRate
                  ) || 0,
                cGRT:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.CGSTRate
                  ) || 0,
                sGRT:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.SGSTRate
                  ) || 0,
                uGRT:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.UGSTRate
                  ) || 0,
                uGST:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.UGSTAmount
                  ) || 0,
                iGST:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.IGSTAmount
                  ) || 0,
                cGST:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.CGSTAmount
                  ) || 0,
                sGST:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.SGSTAmount
                  ) || 0,
                aMT:
                  parseFloat(
                    this.VendorBillTaxationGSTFilterForm.value.GSTAmount
                  ) || 0,
              },
            },
            BillDetails: this.tableData
              .filter((x) => x.isSelected == true)
              .map((x) => {
                return {
                  cID: this.companyCode,
                  bILLNO: "",
                  tRIPNO: x.THC,
                  tTYP: "THC",
                  tMOD: "",
                  aDVAMT: x.Advance,
                  bALAMT: x.BalancePending,
                  tHCAMT: x.THCamount,
                  eNTDT: new Date(),
                  eNTLOC: this.storage.branch,
                  eNTBY: this.storage.userName,
                };
              }),
          };
          console.log(vendorBillEntry);
          this.SubmitJournalVoucherData("BILL1234");
          return;
          await firstValueFrom(
            this.voucherServicesService.FinancePost(
              `finance/bill/vendor/create`,
              vendorBillEntry
            )
          )
            .then((res: any) => {
              console.log(res);
              // this.SubmitJournalVoucherData(res?.data.data.ops[0].docNo)
            })
            .catch((error) => {
              this.snackBarUtilityService.ShowCommonSwal("error", error);
            })
            .finally(() => { });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error);
        }
      }, "Balance Payment Generating..!");
    }
  }
  //#endregion
  //setep 3 Creating voucher_trans And voucher_trans_details And voucher_trans_document collection
  SubmitJournalVoucherData(BillNo) {
    this.snackBarUtilityService.commonToast(() => {
      try {
        const PaymentAmount = parseFloat(
          this.TotalAmountList.find((x) => x.title == "Balance Pending")
            .count
        );
        const NetPayable = parseFloat(
          this.TotalAmountList.find((x) => x.title == "Total Amount")
            .count
        );
        const RoundOffAmount = NetPayable - PaymentAmount;

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
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode =
          this.tableData[0].OthersData?.vND?.cD || "";
        this.VoucherDataRequestModel.partyName =
          this.tableData[0].OthersData?.vND?.nM || "";
        this.VoucherDataRequestModel.partyState =
          this.VendorDetails?.vendorState;
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = this.VendorDetails?.panNo;
        this.VoucherDataRequestModel.tdsSectionCode = !this
          .VendorBillTaxationTDSFilterForm.value.TDSExempted
          ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.value
          : "";
        this.VoucherDataRequestModel.tdsSectionName = !this
          .VendorBillTaxationTDSFilterForm.value.TDSExempted
          ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.name
          : "";
        this.VoucherDataRequestModel.tdsRate = !this
          .VendorBillTaxationTDSFilterForm.value.TDSExempted
          ? +this.VendorBillTaxationTDSFilterForm.value.TDSRate
          : 0;
        this.VoucherDataRequestModel.tdsAmount = !this
          .VendorBillTaxationTDSFilterForm.value.TDSExempted
          ? +this.VendorBillTaxationTDSFilterForm.value.TDSAmount
          : 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined;
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST =
          parseFloat(this.VendorBillTaxationGSTFilterForm.value.IGSTAmount) ||
          0;
        this.VoucherDataRequestModel.SGST =
          parseFloat(this.VendorBillTaxationGSTFilterForm.value.SGSTAmount) ||
          0;
        this.VoucherDataRequestModel.CGST =
          parseFloat(this.VendorBillTaxationGSTFilterForm.value.CGSTAmount) ||
          0;
        this.VoucherDataRequestModel.UGST =
          parseFloat(this.VendorBillTaxationGSTFilterForm.value.UGSTAmount) ||
          0;
        this.VoucherDataRequestModel.GSTTotal =
          parseFloat(this.VendorBillTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = RoundOffAmount;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        const SelectedData = this.tableData;
        const voucherlineItems = this.GetJournalVoucherLedgers(
          SelectedData,
          BillNo,
          PaymentAmount,
          NetPayable,
          RoundOffAmount
        );

        this.VoucherRequestModel.details = voucherlineItems;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];
        console.log(this.VoucherRequestModel);
        return;
        firstValueFrom(
          this.voucherServicesService.FinancePost(
            "fin/account/voucherentry",
            this.VoucherRequestModel
          )
        )
          .then((res: any) => {
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
              partyType: "Vendor",
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
            firstValueFrom(
              this.voucherServicesService.FinancePost(
                "fin/account/posting",
                reqBody
              )
            ).then((res: any) => {
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
                      //  this.RedirectToTHCPayment()
                    }, 1000);
                  }
                });
              } else {
                this.snackBarUtilityService.ShowCommonSwal(
                  "error",
                  "Fail To Do Account Posting..!"
                );
              }
            });
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
    }, "Vendor Bill Voucher Generating..!");
  }
  GetJournalVoucherLedgers(
    SelectedData,
    BillNo,
    PaymentAmount,
    NetPayable,
    RoundOffAmount
  ) {
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
      branch: SelectedData.OthersData?.cLOC || this.storage.branch,
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
      narration: `When Vendor Bill Generated For : ${THC}  Against Bill No : ${BillNo}`,
    });

    const Result = [];
    const DocumentList = this.tableData.map((x) => x.Document).toString();

    // Push TDS Sectiond Data
    if (!this.VendorBillTaxationTDSFilterForm.value.TDSExempted) {
      Result.push(
        createVoucher(
          this.VendorBillTaxationTDSFilterForm.value.TDSSection.value,
          this.VendorBillTaxationTDSFilterForm.value.TDSSection.name,
          "LIABILITY",
          0,
          +this.VendorBillTaxationTDSFilterForm.value.TDSAmount,
          DocumentList,
          BillNo
        )
      );
    }
    if (RoundOffAmount != 0) {
      Result.push(
        createVoucher(
          ledgerInfo["EXP001042"].LeadgerCode,
          ledgerInfo["EXP001042"].LeadgerName,
          ledgerInfo["EXP001042"].LeadgerCategory,
          RoundOffAmount > 0 ? RoundOffAmount : 0,
          RoundOffAmount < 0 ? RoundOffAmount : 0,
          DocumentList,
          BillNo
        )
      );
    }
    // Push GST Data
    if (this.VendorBillTaxationGSTFilterForm.value.GSTAmount != 0) {
      if (this.VendorBillTaxationGSTFilterForm.value.IGSTAmount != 0) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002004"].LeadgerCode,
            ledgerInfo["LIA002004"].LeadgerName,
            ledgerInfo["LIA002004"].LeadgerCategory,
            +this.VendorBillTaxationGSTFilterForm.value.IGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      } else if (
        this.VendorBillTaxationGSTFilterForm.value.CGSTAmount != 0 &&
        this.VendorBillTaxationGSTFilterForm.value.SGSTAmount != 0
      ) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002003"].LeadgerCode,
            ledgerInfo["LIA002003"].LeadgerName,
            ledgerInfo["LIA002003"].LeadgerCategory,
            +this.VendorBillTaxationGSTFilterForm.value.CGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
        Result.push(
          createVoucher(
            ledgerInfo["LIA002001"].LeadgerCode,
            ledgerInfo["LIA002001"].LeadgerName,
            ledgerInfo["LIA002001"].LeadgerCategory,
            +this.VendorBillTaxationGSTFilterForm.value.SGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      } else if (this.VendorBillTaxationGSTFilterForm.value.UGSTAmount != 0) {
        Result.push(
          createVoucher(
            ledgerInfo["LIA002002"].LeadgerCode,
            ledgerInfo["LIA002002"].LeadgerName,
            ledgerInfo["LIA002002"].LeadgerCategory,
            +this.VendorBillTaxationGSTFilterForm.value.UGSTAmount,
            0,
            DocumentList,
            BillNo,
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(),
            this.VendorBillTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()
          )
        );
      }
    }
    // });
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
}
