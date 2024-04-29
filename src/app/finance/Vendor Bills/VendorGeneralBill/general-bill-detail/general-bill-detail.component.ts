import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { VendorBillEntry } from 'src/app/Models/Finance/VendorPayment';
import { financialYear } from 'src/app/Utility/date/date-utils';
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
        Style: "min-width:170px;max-width:170px",
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
  Request = {
    VendorName: "",
    VendorCode: "",
    VendorPan: "",
  }
  VendorDetails;
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
    public snackBarUtilityService: SnackBarUtilityService,

  ) {
    this.companyCode = this.storage.companyCode;
    this.ActiveRouter.queryParams.subscribe((params) => {
      const encryptedData = params['data'];
      const decryptedData = this.encryptionService.decrypt(encryptedData);
      const Response = JSON.parse(decryptedData)
      this.Request.VendorCode = Response.VendorName.value;
      this.Request.VendorName = Response.VendorName.name;
      this.Request.VendorPan = Response.VendorPANNumber;
    });
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.BindDataFromApi();
    this.getTDSSectionDropdown()
    this.CalculatePaymentAmount()
    this.GetVendorInformation()
  }
  initializeFormControl() {

    this.VendorBillControl = new VendorGeneralBillControl(this.Request);
    this.jsonControlVendorBillArray = this.VendorBillControl.getVendorBillSummaryArrayControls();
    this.VendorBillForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillArray]);

    this.jsonControlVendorBillDocumentArray = this.VendorBillControl.getVendorBillDocumentArrayControls();
    this.VendorBillDocumentForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillDocumentArray]);

    this.jsonControlVendorBillTaxationTDSFilterArray = this.VendorBillControl.getVendorBillTaxationTDSArrayControls();
    this.AlljsonControlVendorBillTaxationTDSFilterArray = this.jsonControlVendorBillTaxationTDSFilterArray;
    this.VendorBillTaxationTDSFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillTaxationTDSFilterArray]);

    this.AlljsonControlVendorBillTaxationGSTFilterArray = this.VendorBillControl.getVendorBillTaxationGSTArrayControls();
    this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray;
    this.VendorBillTaxationGSTFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillTaxationGSTFilterArray]);
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
    this.filter.Filter(
      this.jsonControlVendorBillTaxationGSTFilterArray,
      this.VendorBillTaxationGSTFilterForm,
      this.SACCodeList,
      "GSTSACcode",
      false
    );

    this.BindLedger();
    this.getStateDropdown()

  }
  async BindLedger() {
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_detail",
      filter: {
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
      this.VendorBillTaxationTDSFilterForm.value.TDSExempted;

    if (TDSExemptedValue) {

      this.jsonControlVendorBillTaxationTDSFilterArray =
        this.AlljsonControlVendorBillTaxationTDSFilterArray.filter(
          (x) => x.name == "TDSExempted"
        );
      const TDSSection =
        this.VendorBillTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorBillTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount =
        this.VendorBillTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    } else {
      this.jsonControlVendorBillTaxationTDSFilterArray =
        this.AlljsonControlVendorBillTaxationTDSFilterArray;
      const TDSSection =
        this.VendorBillTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      const TDSRate = this.VendorBillTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount =
        this.VendorBillTaxationTDSFilterForm.get("TDSAmount");
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
      const TDSrate = this.VendorBillTaxationTDSFilterForm.value.TDSSection?.rOTHER || 0
      const TotalTHCamount = this.tableData.reduce((sum, x) => sum + parseFloat(x.Amount), 0);
      const TDSamount = ((TDSrate * TotalTHCamount) / 100 || 0).toFixed(2);
      this.VendorBillTaxationTDSFilterForm.controls["TDSRate"].setValue(TDSrate);
      this.VendorBillTaxationTDSFilterForm.controls["TDSAmount"].setValue(TDSamount);
      this.CalculatePaymentAmount();
    }
  }
  CalculatePaymentAmount() {
    const Amount = this.tableData.reduce((sum, x) => sum + parseFloat(x.Amount), 0);

    let TDSAmount = parseFloat(this.VendorBillTaxationTDSFilterForm.controls.TDSAmount.value) || 0;
    let GSTAmount = parseFloat(this.VendorBillTaxationGSTFilterForm.controls.GSTAmount.value) || 0;


    const CalculatedSumWithTDS = Amount - parseFloat(TDSAmount.toFixed(2));;
    const CalculatedSum = CalculatedSumWithTDS + parseFloat(GSTAmount.toFixed(2));;
    const formattedCalculatedSum = CalculatedSum.toFixed(2);

    this.VendorBillDocumentForm.get("TotalAmount").setValue(formattedCalculatedSum);
    this.VendorBillDocumentForm.get("BillPending").setValue(formattedCalculatedSum);

  }

  StateChange() {
    const formValues = this.VendorBillTaxationGSTFilterForm.value;
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
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue("IGST");

      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTdata);
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (
        !IsStateTypeUT &&
        Billbookingstate.name != Vendorbillstate.name
      ) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTdata);
        this.VendorBillTaxationGSTFilterForm.get("GSTType").setValue("CGST/SGST");
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

    this.jsonControlVendorBillTaxationGSTFilterArray =
      this.AlljsonControlVendorBillTaxationGSTFilterArray.filter(
        filterFunctions[Check]
      );

    const GSTinput = this.jsonControlVendorBillTaxationGSTFilterArray
      .filter((item) => GSTinputType.includes(item.name))
      .map((item) => item.name);

    const GSTCalculateAmount = (
      (GSTdata.GSTAmount * GSTdata.GSTRate) /
      (100 * GSTinput.length)
    ).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.VendorBillTaxationGSTFilterForm.get(rateKey).setValue(
        GSTCalculateRate
      );
      this.VendorBillTaxationGSTFilterForm.get(amountKey).setValue(
        GSTCalculateAmount
      );
    };
    GSTinput.forEach((x) => calculateValues(x, x.substring(0, 4) + "Amount"));

    this.VendorBillTaxationGSTFilterForm.get("TotalGSTRate").setValue(
      (+GSTCalculateRate * GSTinput.length).toFixed(2)
    );
    this.VendorBillTaxationGSTFilterForm.get("GSTAmount").setValue(
      (+GSTCalculateAmount * GSTinput.length).toFixed(2)
    );
    this.CalculatePaymentAmount();
  }
  toggleVendorGSTRegistered() {
    const VendorGSTRegistered =
      this.VendorBillTaxationGSTFilterForm.value.VendorGSTRegistered;

    if (VendorGSTRegistered) {
      // this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray;

      const GSTSACcode = this.VendorBillTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValidators([Validators.required, autocompleteObjectValidator(),]);
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate = this.VendorBillTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
      Billbookingstate.updateValueAndValidity();

      const Vendorbillstate = this.VendorBillTaxationGSTFilterForm.get("Vendorbillstate");
      Vendorbillstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
      Vendorbillstate.updateValueAndValidity();

      this.getStateDropdown();


    } else {
      // this.jsonControlVendorBillTaxationGSTFilterArray = this.AlljsonControlVendorBillTaxationGSTFilterArray.filter((x) => x.name == "VendorGSTRegistered");
      const GSTSACcode = this.VendorBillTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValue("");
      GSTSACcode.clearValidators();
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate = this.VendorBillTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValue("");
      Billbookingstate.clearValidators();
      Billbookingstate.updateValueAndValidity();

      const Vendorbillstate = this.VendorBillTaxationGSTFilterForm.get("Vendorbillstate");
      Vendorbillstate.setValue("");
      Vendorbillstate.clearValidators();
      Vendorbillstate.updateValueAndValidity();
    }
  } async getStateDropdown() {
    const resState = await GetStateListFromAPI(this.masterService);
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map((x) => ({
        value: x.ST, name: x.STNM
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

      const PaymentAmount = parseFloat(this.VendorBillDocumentForm.get("TotalAmount").value);
      const NetPayable = parseFloat(this.VendorBillDocumentForm.get("BillPending").value);
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
              sT: this.VendorBillTaxationGSTFilterForm.controls.Vendorbillstate.value?.value,
              gSTIN: this.VendorBillTaxationGSTFilterForm.controls.VGSTNumber.value,
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
                mOB: this.VendorDetails?.vendorPhoneNo ? this.VendorDetails?.vendorPhoneNo.toString() : "",
                eML: this.VendorDetails?.emailId,
                gSTREG: this.VendorBillTaxationGSTFilterForm.controls.VendorGSTRegistered.value,
                sT: this.VendorBillTaxationGSTFilterForm.controls.Billbookingstate.value?.value,
                gSTIN: this.VendorBillTaxationGSTFilterForm.controls.GSTNumber.value,
              },
              tDS: {
                eXMT: this.VendorBillTaxationTDSFilterForm.value.TDSExempted,
                sEC: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.value : "",
                sECD: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted ? this.VendorBillTaxationTDSFilterForm.value.TDSSection.name : "",
                rATE: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted ? this.VendorBillTaxationTDSFilterForm.value.TDSRate : 0,
                aMT: !this.VendorBillTaxationTDSFilterForm.value.TDSExempted ? this.VendorBillTaxationTDSFilterForm.value.TDSAmount : 0,
              },
              gST: {
                sAC: this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.value ? this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.value.toString() : "",
                sACNM: this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.name ? this.VendorBillTaxationGSTFilterForm.value.GSTSACcode?.name.toString() : "",
                tYP: this.VendorBillTaxationGSTFilterForm.value.GSTType,
                rATE: parseFloat(this.VendorBillTaxationGSTFilterForm.value.TotalGSTRate) || 0,
                iGRT: parseFloat(this.VendorBillTaxationGSTFilterForm.value.IGSTRate) || 0,
                cGRT: parseFloat(this.VendorBillTaxationGSTFilterForm.value.CGSTRate) || 0,
                sGRT: parseFloat(this.VendorBillTaxationGSTFilterForm.value.SGSTRate) || 0,
                uGRT: parseFloat(this.VendorBillTaxationGSTFilterForm.value.UGSTRate) || 0,
                uGST: parseFloat(this.VendorBillTaxationGSTFilterForm.value.UGSTAmount) || 0,
                iGST: parseFloat(this.VendorBillTaxationGSTFilterForm.value.IGSTAmount) || 0,
                cGST: parseFloat(this.VendorBillTaxationGSTFilterForm.value.CGSTAmount) || 0,
                sGST: parseFloat(this.VendorBillTaxationGSTFilterForm.value.SGSTAmount) || 0,
                aMT: parseFloat(this.VendorBillTaxationGSTFilterForm.value.GSTAmount) || 0,
              },
            },
            BillDetails: this.tableData.filter((x) => x.isSelected == true).map((x) => {
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
              }
            })
          };
          console.log(vendorBillEntry)
          return
          await
            firstValueFrom(this.voucherServicesService
              .FinancePost(`finance/bill/vendor/create`, vendorBillEntry)).then((res: any) => {
                console.log(res)
                // this.SubmitJournalVoucherData(res?.data.data.ops[0].docNo)
              }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
              .finally(() => {

              });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error);
        }
      }, "Balance Payment Generating..!");
    }
  }
  //#endregion
}
