import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { vendorTdsPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorTdsPaymentControl';
import { GetBankDetailFromApi } from '../../Debit Voucher/debitvoucherAPIUtitlity';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi, GetSingleVendorDetailsFromApi } from '../VendorPaymentAPIUtitlity';
import Swal from 'sweetalert2';
import { ThcPaymentFilterComponent } from '../Modal/thc-payment-filter/thc-payment-filter.component';
import { TDSDetDataRequestModel, TDSHdrDataRequestModel, TDSRequestModel } from 'src/app/Models/Finance/VendorTDSPayment';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';

@Component({
  selector: 'app-vendorwise-tdspayments',
  templateUrl: './vendorwise-tdspayments.component.html',
})
export class VendorwiseTdspaymentsComponent implements OnInit {
  tableData: any[] = [];
  isTableLode = false;
  menuItems = [];
  linkArray = [];
  isFormLode = false;
  TDSRequestModel = new TDSRequestModel();
  TDSHdrDataRequestModel = new TDSHdrDataRequestModel();
  TDSDetDataRequestModel = new TDSDetDataRequestModel();
  tdsDetDataRequestList: any = [];
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();

  breadScrums = [
    {
      title: "Tds Payments",
      items: ["Home"],
      active: "Tds Payments",
    },
  ];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    docNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    bDT: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    bALAMT: {
      Title: "Bill Amount ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    rATE: {
      Title: "TDS Rate",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    tdsaMT: {
      Title: "TDS Amount⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    tdssection: {
      Title: "TDS Section",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
  };

  staticField = ["docNo", "bDT", "bALAMT", "tdsaMT", "rATE", "tdssection"];

  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tdsPaymentData: any;
  DataResponseHeader: any;
  TotalAmountList: { count: string; title: string; class: string; }[];
  vendorTdsPaymentControl: vendorTdsPaymentControl;
  jsonPaymentSummaryArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;
  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonControlPaymentHeaderFilterArray: any;
  PaymentHeaderFilterForm: UntypedFormGroup;
  PaymentData: { Vendor: string } = { Vendor: '' };
  VendorDetails;
  disableCheckboxes = false;
  RequestData = {
    vendorList: [

    ],
    vendorListWithKeys: [],
    StartDate: new Date(),
    EndDate: new Date()
  }
  totalamount: any;
  totalTdsamount: any;
  voucherno: any;

  constructor(private filter: FilterUtils,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private route: Router,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private matDialog: MatDialog,
    private storage: StorageService, private changeDetectorRef: ChangeDetectorRef,
    private controlPanel: ControlPanelService,
    private navigationService: NavigationService,) {
    this.tdsPaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (this.tdsPaymentData) {
      this.PaymentData = {
        Vendor: this.tdsPaymentData.vendorCode // Set the vendor name here
      };
      this.GettdsPaymentList(this.tdsPaymentData.vendorCd);
    }
  }

  ngOnInit(): void {
    // this.GettdsPaymentList()
    this.GetVendorInformation();
    this.TotalAmountList = [
      {
        count: "00",
        title: "Total Bill Amount",
        class: `color-Success-light`,
      },
      {
        count: "00",
        title: "Total TDS Amount",
        class: `color-Success-light`,
      },
    ];

    this.vendorTdsPaymentControl = new vendorTdsPaymentControl();
    this.jsonPaymentSummaryArray =
      this.vendorTdsPaymentControl.getPaymentSummaryControl();
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonPaymentSummaryArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonPaymentSummaryArray,
    ]);
    this.jsonPaymentSummaryArray = this.jsonPaymentSummaryArray.slice(0, 1);
    this.isFormLode = true;

    this.jsonControlPaymentHeaderFilterArray =
      this.vendorTdsPaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentHeaderFilterArray,
    ]);
  }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }

  selectCheckBox($event) {
    const selectedData = this.tableData.filter((x) => x.isSelected);

    if (selectedData.length > 0) {
      const firstValue = selectedData[0].tDS.sEC;
      const isValid = selectedData.every(item => item.tDS.sEC === firstValue);

      if (!isValid) {
        this.tableData.forEach(item => {
          if (item.isSelected && item.tDS.sEC !== firstValue) {
            item.isSelected = false;
          }
        });

        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'You can select Same TDS Section',
          showConfirmButton: true,
        });
        console.log(this.tableData)
        this.isTableLode = false;
        this.changeDetectorRef?.detectChanges();
        this.isTableLode = true;
        return;
      }
    }

    const totalTAmount = selectedData.reduce(
      (total, item) => total + parseInt(item.bALAMT),
      0
    );
    const totalTds = selectedData.reduce(
      (total, item) => total + parseInt(item.tdsaMT),
      0
    );

    this.TotalAmountList.forEach((x) => {

      if (x.title === "Total Bill Amount") {
        x.count = totalTAmount.toFixed(2);
        this.totalamount = totalTAmount.toFixed(2);
      }
      if (x.title === "Total TDS Amount") {
        x.count = totalTds.toFixed(2);
        this.totalTdsamount = totalTds.toFixed(2);
      }
    });
  }


  // Function to calculate financial year start and end dates
  getFinancialYearDates() {
    const today = new Date();
    const year = today.getFullYear();
    let financialYearStartDate;
    let financialYearEndDate;

    if (today.getMonth() >= 3) { // April (3) to December (11)
      financialYearStartDate = new Date(Date.UTC(year, 3, 1)).toISOString(); // April 1st of the current year
      financialYearEndDate = new Date(Date.UTC(year + 1, 2, 31, 23, 59, 59)).toISOString(); // March 31st of the next year
    } else { // January (0) to March (2)
      financialYearStartDate = new Date(Date.UTC(year - 1, 3, 1)).toISOString(); // April 1st of the previous year
      financialYearEndDate = new Date(Date.UTC(year, 2, 31, 23, 59, 59)).toISOString(); // March 31st of the current year
    }

    return { financialYearStartDate, financialYearEndDate };
  }

  async GettdsPaymentList(vendorCode) {
    const { financialYearStartDate, financialYearEndDate } = this.getFinancialYearDates();
    this.isTableLode = false;
    const BodyDataHeader = {
      companyCode: this.storage.companyCode,
      collectionName: "vend_bill_summary",
      filter: {
        "D$expr": {
          "D$and": [
            // Check if bALAMT is greater than 0
            { "D$gt": ["$tDS.aMT", 0] },
            // Check if Value is defined before checking cUST.cD
            { "D$eq": ["$vND.cD", vendorCode] },
            // Cancel Flag Check 
            {
              "D$or": [
                { "D$eq": ["$tDSPAID", false] },
                { "D$eq": [{ "D$ifNull": ["$tDSPAID", false] }, false] }
              ]
            },
            { "D$ne": ["$bSTAT", 7] },
            // Check if bDT is greater than financialYearStartDate
            { "D$gt": ["$bDT", financialYearStartDate] },
            // // Check if bDT is less than financialYearEndDate
            { "D$lt": ["$bDT", financialYearEndDate] }
          ] // Remove undefined elements from the array
        }
      }
    };

    this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));

    this.tableData = this.DataResponseHeader.data.map((x) => {
      return {
        ...x,
        isSelected: false,
        rATE: x.tDS.rATE,
        tdsaMT: x.tDS.aMT,
        tdssection: x.tDS.sEC + ':' + x.tDS.sECD  // Assign the selected field
      };
    });
    console.log(this.tableData)
    this.isTableLode = true;
    // this.selectCheckBox()

  }

  async GetVendorInformation() {
    this.VendorDetails = await GetSingleVendorDetailsFromApi(
      this.masterService,
      this.tdsPaymentData?.vendorCd
    );
    //Set Existing Vendor Data 
    this.PaymentHeaderFilterForm.get("VendorPANNumber").setValue(
      this.tdsPaymentData?.vendPanno
    );
  }


  RedirectToTDSPayment() {
    this.route.navigate(["/Finance/VendorPayment/TDS-Payment"]);
  }

  // Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
    const Accountinglocation =
      this.PaymentSummaryFilterForm.value.BalancePaymentlocation?.name;
    switch (PaymentMode) {
      case "Cheque":
        filterFunction = (x) => x.name !== "CashAccount";
        break;
      case "Cash":
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank";
        break;
      case "RTGS/UTR":
        filterFunction = (x) => x.name !== "CashAccount";
        break;
    }

    this.jsonPaymentSummaryArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);

    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)

        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.PaymentSummaryFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH", Accountinglocation);
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.PaymentSummaryFilterForm.get("Bank");
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        break;
    }
  }
  async Submit() {
    if (this.tableData.filter(x => x.isSelected).length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Select Atleast One Bill"
      );
    }
    else {
      // this.snackBarUtilityService.commonToast(async () => {
        try {

          this.TDSRequestModel.companyCode = this.storage.companyCode;
          this.TDSRequestModel.docType = "TPS";
          this.TDSRequestModel.branch = this.storage.branch;
          this.TDSRequestModel.finYear = financialYear;

          //Header data 
          this.TDSHdrDataRequestModel._id = "";
          this.TDSHdrDataRequestModel.cID = this.storage.companyCode; // assuming cID is a number, assign 0 for empty
          this.TDSHdrDataRequestModel.tPSNO = "";
          this.TDSHdrDataRequestModel.tPSDATE = new Date();
          this.TDSHdrDataRequestModel.mANUALNO = "";
          this.TDSHdrDataRequestModel.docNo = "";
          this.TDSHdrDataRequestModel.fINYEAR = financialYear;
          this.TDSHdrDataRequestModel.aMT = this.totalTdsamount;
          this.TDSHdrDataRequestModel.lOC = this.storage.branch;
          this.TDSHdrDataRequestModel.tDSChallanNo = this.PaymentSummaryFilterForm.value.TDSChallanNo;
          this.TDSHdrDataRequestModel.vND = {
            cD: this.tableData[0].vND.cD,
            nM: this.tableData[0].vND.nM,
            pAN: this.tableData[0].vND.pAN,
            aDD: this.tableData[0].vND.aDD,
            mOB: this.tableData[0].vND.mOB,
            eML: this.tableData[0].vND.eML,
            sT: this.tableData[0].vND.sT,
          },
            this.TDSHdrDataRequestModel.pAY = {
              mOD: this.PaymentSummaryFilterForm.value.PaymentMode,
              bANK: (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cheque' || this.PaymentSummaryFilterForm.value.PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank?.name : "",
              bANKCD: (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cheque' || this.PaymentSummaryFilterForm.value.PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank?.value.toString() : "",
              aCCD: (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cash') ? this.PaymentSummaryFilterForm.value.CashAccount?.name : "",
              aCNM: (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cash') ? this.PaymentSummaryFilterForm.value.CashAccount?.value : "",
              dTM: this.PaymentSummaryFilterForm.value?.Date || new Date(),
              cREFNO: (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cheque' || this.PaymentSummaryFilterForm.value.PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.ChequeOrRefNo : "",
            };
          this.TDSHdrDataRequestModel.sTS = 1;
          this.TDSHdrDataRequestModel.sTSNM = "Generated";
          this.TDSHdrDataRequestModel.sTSBY = this.storage.loginName;
          this.TDSHdrDataRequestModel.sTSDT = new Date();
          this.TDSHdrDataRequestModel.vNO = "";
          this.TDSHdrDataRequestModel.eNTDT = new Date();
          this.TDSHdrDataRequestModel.eNTLOC = this.storage.branch;
          this.TDSHdrDataRequestModel.eNTBY = this.storage.loginName;

          //Details data
          this.tdsDetDataRequestList = [];
          this.tableData.forEach(tdsData => {
            if (tdsData.isSelected) {
              // Check if the current tdsData is selected
              let tdsDetDataRequestModel = {
                _id: "",
                cID: this.storage.companyCode,
                tPSNO: "",
                tPSDATE: new Date(),
                docNo: "",
                bILLNO: tdsData.docNo,
                bGNDT: tdsData.bGNDT,
                bDOCTYP: tdsData.dOCTYP,
                vND: {
                  cD: tdsData.vND.cD,
                  nM: tdsData.vND.nM,
                  pAN: tdsData.vND.pAN,
                  aDD: tdsData.vND.aDD,
                  mOB: tdsData.vND.mOB,
                  eML: tdsData.vND.eML,
                  sT: tdsData.vND.sT,
                },
                tDS: {
                  eXMT: tdsData.tDS.cD,
                  sEC: tdsData.tDS.sEC,
                  sECD: tdsData.tDS.sECD,
                  rATE: tdsData.tDS.rATE,
                  aMT: tdsData.tDS.aMT,
                },
                bALAMT: tdsData.bALAMT,
                lOC: this.storage.branch,
                eNTDT: new Date(),
                eNTLOC: this.storage.branch,
                eNTBY: this.storage.loginName,
              };
              // Add the initialized model to the list
              this.tdsDetDataRequestList.push(tdsDetDataRequestModel);
            }
          });

          this.TDSRequestModel.data =
            this.TDSHdrDataRequestModel;
          this.TDSRequestModel.Headerdata = this.TDSHdrDataRequestModel;
          this.TDSRequestModel.Detailsdata = this.tdsDetDataRequestList;
          firstValueFrom(
            this.voucherServicesService.FinancePost(
              "fin/account/TdsPaySlipEntry",
              this.TDSRequestModel
            )
          )
            .then((res: any) => {
              if (res.success) {
                this.approval(this.tableData, res?.data?.mainData);
              }
            })
            .catch((error) => {
              this.snackBarUtilityService.ShowCommonSwal("error", error);
            })
            .finally(() => { });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error.message);
        }
      // }, "TDS Payment Slip Generating..!");
    }
  }

  // Approval Tds Payment 
  async approval(Data, Tpsno) {
    const firstSelectedRecord = Data.find(tdsData => tdsData.isSelected);

    this.snackBarUtilityService.commonToast(() => {
    try {
      const PaymentAmount = parseFloat(this.totalTdsamount);
      const NetPayable = parseFloat(this.totalTdsamount);
      this.VoucherRequestModel.companyCode = this.storage.companyCode;
      this.VoucherRequestModel.docType = "VR";
      this.VoucherRequestModel.branch = this.storage.branch;
      this.VoucherRequestModel.finYear = financialYear;

      this.VoucherDataRequestModel.voucherNo = "";
      this.VoucherDataRequestModel.transCode = VoucherInstanceType.TdsPaymentSlipApproval;
      this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.TdsPaymentSlipApproval];
      this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
      this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

      this.VoucherDataRequestModel.transDate = new Date();
      this.VoucherDataRequestModel.docType = "VR";
      this.VoucherDataRequestModel.branch = this.storage.branch;
      this.VoucherDataRequestModel.finYear = financialYear;

      this.VoucherDataRequestModel.accLocation = this.storage.branch;
      this.VoucherDataRequestModel.preperedFor = "Vendor";
      this.VoucherDataRequestModel.partyCode = firstSelectedRecord.vND.cD || "";
      this.VoucherDataRequestModel.partyName = firstSelectedRecord.vND.nM || "";
      this.VoucherDataRequestModel.partyState = "";
      this.VoucherDataRequestModel.entryBy = this.storage.userName;
      this.VoucherDataRequestModel.entryDate = new Date();
      this.VoucherDataRequestModel.panNo = firstSelectedRecord.vND.pAN || "";
      this.VoucherDataRequestModel.tdsSectionCode = firstSelectedRecord.tDS.sEC || "";
      this.VoucherDataRequestModel.tdsSectionName = firstSelectedRecord.tDS.sECD || "";
      this.VoucherDataRequestModel.tdsRate = 0;
      this.VoucherDataRequestModel.tdsAmount = 0;
      this.VoucherDataRequestModel.tdsAtlineitem = false;
      this.VoucherDataRequestModel.tcsSectionCode = undefined;
      this.VoucherDataRequestModel.tcsSectionName = undefined
      this.VoucherDataRequestModel.tcsRate = 0;
      this.VoucherDataRequestModel.tcsAmount = 0;

      this.VoucherDataRequestModel.IGST = 0;
      this.VoucherDataRequestModel.SGST = 0;
      this.VoucherDataRequestModel.CGST = 0;
      this.VoucherDataRequestModel.UGST = 0;
      this.VoucherDataRequestModel.GSTTotal = 0;

      this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
      this.VoucherDataRequestModel.netPayable = NetPayable;
      this.VoucherDataRequestModel.roundOff = 0;
      this.VoucherDataRequestModel.voucherCanceled = false;

      this.VoucherDataRequestModel.paymentMode = this.PaymentSummaryFilterForm.value.PaymentMode;
      this.VoucherDataRequestModel.refNo = "";
      this.VoucherDataRequestModel.accountName =
        (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cheque' || this.PaymentSummaryFilterForm.value.PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank?.name : this.PaymentSummaryFilterForm.value.CashAccount?.name;
      this.VoucherDataRequestModel.accountCode =
        (this.PaymentSummaryFilterForm.value.PaymentMode === 'Cheque' || this.PaymentSummaryFilterForm.value.PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank?.value.toString() : this.PaymentSummaryFilterForm.value.CashAccount?.value;

      this.VoucherDataRequestModel.date = ""
      this.VoucherDataRequestModel.scanSupportingDocument = "";
      this.VoucherDataRequestModel.transactionNumber = Tpsno || "";

      const voucherlineItems = this.GetVouchersLedgers(this.VoucherDataRequestModel);

      this.VoucherRequestModel.details = voucherlineItems;
      this.VoucherRequestModel.data = this.VoucherDataRequestModel;
      this.VoucherRequestModel.debitAgainstDocumentList = [];
      firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
        let reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.TdsPaymentSlipApproval,
          transType: VoucherInstanceType[VoucherInstanceType.TdsPaymentSlipApproval],
          voucherCode: VoucherType.JournalVoucher,
          voucherType: VoucherType[VoucherType.JournalVoucher],
          docType: "Voucher",
          partyType: "Vendor",
          docNo: Tpsno,
          partyCode: "" + firstSelectedRecord.vND.cD || "",
          partyName: firstSelectedRecord.vND.nM || "",
          entryBy: this.storage.userName,
          entryDate: Date(),
          debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.debit,
              "narration": item.narration ?? ""
            };
          }),
          credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.credit,
              "narration": item.narration ?? ""
            };
          }),
        };

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then(async (res: any) => {
          if (res) {
            const req = {
              companyCode: this.storage.companyCode,
              collectionName: "tps_header",
              filter: { docNo: Tpsno },
              update: {
                sTS: 2,
                sTSNM: "Approved",
                sTSDT: new Date(),
                sTSBY: this.storage.loginName,
                vNO: reqBody.voucherNo
              },
            };
            this.voucherno = reqBody.voucherNo
            const res = await firstValueFrom(
              this.masterService.masterPut("generic/update", req))
            if (res) {
              this.tableData.forEach(noteData => {
                if (noteData.isSelected) {
                  // Check if the current noteData is selected
                  const req = {
                    companyCode: this.storage.companyCode,
                    collectionName: "vend_bill_summary",
                    filter: { docNo: noteData.docNo },
                    update: {
                      tDSPAID: true,
                    },
                  };
                  const res = firstValueFrom(
                    this.masterService.masterPut("generic/update", req))
                  if (res) {
                  }
                }
              });
              Swal.fire({
                icon: "success",
                title: "TDS Payment slip Created Successfully",
                html: "THC Number is " + Tpsno + "<br>Voucher Number is " + reqBody.voucherNo,
                showConfirmButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Pending Bill Aginst Update Tds Payment Done
                  Swal.hideLoading();
                  setTimeout(() => {
                    Swal.close();
                  }, 2000);
                  this.route.navigate(["Finance/VendorPayment/Dashboard"]);
                }
              });
            }
            // this.route.navigate(["Finance/VendorPayment/Dashboard"]);
          } else {
            this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Do Account Posting..!");
          }
        });
      }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
        .finally(() => {
        });

    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal(
        "error",
        "Fail To Submit Data..!"
      );
    }
     }, "Tds Payment Voucher Generating..!");

  }


  GetVouchersLedgers(data) {
    const TotalAmount = this.totalamount;
    const createVoucher = (accCode, accName, accCategory, debit, credit) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.TdsPaymentSlipApproval,
      transType: VoucherInstanceType[VoucherInstanceType.TdsPaymentSlipApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: "",
      sacName: "",
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,//credit,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When vendor Bill booked vide  :${this.VoucherDataRequestModel.transactionNumber}`,
    });

    const response = [
      createVoucher(this.VoucherDataRequestModel.tdsSectionCode, this.VoucherDataRequestModel.tdsSectionName, "LIABILITY", TotalAmount, 0),
      createVoucher(this.VoucherDataRequestModel.accountName, this.VoucherDataRequestModel.accountCode, "LIABILITY", 0, TotalAmount),
    ];

    return response;
  }

}
