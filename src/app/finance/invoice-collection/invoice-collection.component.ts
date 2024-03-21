import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { InvoiceCollectionControl } from 'src/assets/FormControls/Finance/InvoiceCollection/invoice-collection-control';
import { DeductionChargesComponent } from './deduction-charges/deduction-charges.component';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GetAccountDetailFromApi, GetBankDetailFromApi } from '../Debit Voucher/debitvoucherAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoice-collection',
  templateUrl: './invoice-collection.component.html',
})
export class InvoiceCollectionComponent implements OnInit {
  backPath: string;
  breadScrums = [
    {
      title: "Customer and GST Details",
      items: ["InvoiceCollection"],
      active: "Customer and GST Details",
    },
  ];
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  CustomerGSTTableForm: UntypedFormGroup;
  // CollectionSummaryTableForm: UntypedFormGroup;
  jsonControlArray: any;
  // CollectionSummaryjsonControlArray: any;
  invocieCollectionFormControls: InvoiceCollectionControl;
  tableLoad: boolean = true;
  tableData = [];
  menuItems = [];
  linkArray = [{ Row: 'deductions', Path: '', componentDetails: DeductionChargesComponent }];
  menuItemflag = true;
  addFlag = true;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  InvoiceDetailscolumnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    bILLNO: {
      Title: "Invoice number",
      class: "matcolumnfirst",
      Style: "min-width:200px",
    },
    bGNDT: {
      Title: "Invoice date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    bDUEDT: {
      Title: "Due date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    aMT: {
      Title: "Invoice Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collected: {
      Title: "Collected(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    deductions: {
      Title: "Deductions(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collectionAmount: {
      Title: "Collection Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    }
  };
  staticField = [
    "bILLNO",
    "bGNDT",
    "bDUEDT",
    "aMT",
    "collected",
    "collectionAmount",
    "pendingAmount",
  ];
  invoiceDetail: any;
  metaData = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };

  // Added By Harikesh

  DebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationPaymentSummaryArray: any;

  DebitVoucherTaxationPaymentDetailsForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationPaymentDetailsArray: any;
  AlljsonControlDebitVoucherTaxationPaymentDetailsArray: any;

  AccountsBanksList: any;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private invoiceService: InvoiceServiceService,
    private generalService: GeneralService,
    public snackBarUtilityService: SnackBarUtilityService,
    private voucherServicesService: VoucherServicesService,
    private storage: StorageService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {

      this.invoiceDetail = this.router.getCurrentNavigation()?.extras?.state.data.columnData;
      if (this.invoiceDetail.pendCol == 0) {
        this.alertForTheZeroAmt()
      }
    } else {
      this.tab('Management​');
    }

    this.backPath = "/dashboard/Index?tab=Management​";

    this.initializeFormControl();
  }
  alertForTheZeroAmt() {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'No invoice available for collection',
      timer: 2000,
      showCancelButton: false,
      showConfirmButton: false
    });
    this.tab('Management​');
  }

  ngOnInit(): void {
    this.getBilligDetails();
  }

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  initializeFormControl() {
    this.invocieCollectionFormControls = new InvoiceCollectionControl();
    this.jsonControlArray = this.invocieCollectionFormControls.getCustomerGSTArrayControls();
    //this.CollectionSummaryjsonControlArray = this.invocieCollectionFormControls.getCollectionSummaryArrayControls();
    this.CustomerGSTTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    // this.CollectionSummaryTableForm = formGroupBuilder(this.fb, [this.CollectionSummaryjsonControlArray]);
    this.CustomerGSTTableForm.controls['customer'].setValue(this.invoiceDetail?.billingParty || "");

    this.jsonControlDebitVoucherTaxationPaymentSummaryArray = this.invocieCollectionFormControls.getDebitVoucherTaxationPaymentSummaryArrayControls();
    this.DebitVoucherTaxationPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationPaymentSummaryArray]);

    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.invocieCollectionFormControls.getDebitVoucherTaxationPaymentDetailsArrayControls();
    this.AlljsonControlDebitVoucherTaxationPaymentDetailsArray = this.jsonControlDebitVoucherTaxationPaymentDetailsArray
    this.DebitVoucherTaxationPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationPaymentDetailsArray]);
    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.jsonControlDebitVoucherTaxationPaymentDetailsArray.slice(0, 1);


  }
  async getBilligDetails() {
    const result = await this.invoiceService.getCollectionInvoiceDetails(this.invoiceDetail?.bILLNO || "");
    this.tableData = result;
    this.tableLoad = false;
    // this.getDropdown()
  }
  // async getDropdown() {
  //   const mode: AutoComplete[] = await this.generalService.getDataForAutoComplete("General_master", { codeType: "ACT" }, "codeDesc", "codeId");
  //   const bank: AutoComplete[] = await this.generalService.getDataForAutoComplete("General_master", { codeType: "BNK" }, "codeDesc", "codeId");
  //   setGeneralMasterData(this.CollectionSummaryjsonControlArray, mode, "collectionMode");
  //   setGeneralMasterData(this.CollectionSummaryjsonControlArray, bank, "bank");
  // }
  cancel() {
    this.tab('Management​');
  }
  tab(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }

  getCalucationDetails(event) {
    const total = this.tableData.filter(item => item.isSelected == true).reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['collectionAmount']);
    }, 0);

    this.DebitVoucherTaxationPaymentSummaryForm.controls['PaymentAmount'].setValue(Math.abs(total));
    const TotalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  toggleUpDown(event) {
    const totalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const roundedValue = event.isUpDown ? Math.ceil(totalPaymentAmount) : Math.floor(totalPaymentAmount);
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(roundedValue);

  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const PaymentMode = this.DebitVoucherTaxationPaymentDetailsForm.get("PaymentMode").value;
    let filterFunction;
    switch (PaymentMode) {
      case 'Cheque':
        filterFunction = (x) => x.name !== 'CashAccount';

        break;
      case 'Cash':
        filterFunction = (x) => x.name !== 'ChequeOrRefNo' && x.name !== 'Bank';
        break;
      case 'RTGS/UTR':
        filterFunction = (x) => x.name !== 'CashAccount';
        break;
    }
    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.AlljsonControlDebitVoucherTaxationPaymentDetailsArray.filter(filterFunction);
    const Accountinglocation = this.storage.branch;
    switch (PaymentMode) {
      case 'Cheque':
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.DebitVoucherTaxationPaymentDetailsForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo = this.DebitVoucherTaxationPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();



        const CashAccount = this.DebitVoucherTaxationPaymentDetailsForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.DebitVoucherTaxationPaymentDetailsForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.DebitVoucherTaxationPaymentDetailsForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.DebitVoucherTaxationPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }
  close(event) {

    this.tableData.map((x) => {
      if (x.bILLNO == event.billNO) {
        x.deductions = event?.netDeduction ? parseFloat(event?.netDeduction).toFixed(2) : parseFloat(event?.tds).toFixed(2) || 0.00;
        x.collectionAmount = (parseFloat(x?.aMT || 0.00) - parseFloat(x?.deductions || 0.00)).toFixed(2);
      }
    })
  }
  async save() {
    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
    if (NetPayable <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Net payable amount should be greater than 0',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
      return;
    }

    const data = await this.invoiceService.getCollectionJson(this.DebitVoucherTaxationPaymentDetailsForm.value, this.tableData, this.DebitVoucherTaxationPaymentSummaryForm.value);
    const res = await this.invoiceService.saveCollection(data);
    if (res) {
      this.AccountPosting(this.tableData[0], res.ops[0].mRNO)
    }
  }
  // Account Posting When  When Bill Has been Collected	
  async AccountPosting(data, mRNO) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const TotalAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
        const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);

        const GstAmount = data?.gST?.aMT;

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BillCollection,
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BillCollection],
          this.VoucherDataRequestModel.voucherCode = VoucherType.CreditVoucher,
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.CreditVoucher],
          this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        this.VoucherDataRequestModel.partyCode = data?.cUST?.cD || "",
          this.VoucherDataRequestModel.partyName = data?.cUST?.nM || "",
          this.VoucherDataRequestModel.partyState = data?.cUST?.sT || "",
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = "";
        this.VoucherDataRequestModel.tdsSectionName = "";
        this.VoucherDataRequestModel.tdsRate = 0;
        this.VoucherDataRequestModel.tdsAmount = 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = "";
        this.VoucherDataRequestModel.tcsSectionName = "";
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = data?.gST?.iGST || 0;
        this.VoucherDataRequestModel.SGST = data?.gST?.sGST || 0;
        this.VoucherDataRequestModel.CGST = data?.gST?.cGST || 0;
        this.VoucherDataRequestModel.UGST = data?.gST?.UTGST || 0;
        this.VoucherDataRequestModel.GSTTotal = GstAmount;

        this.VoucherDataRequestModel.GrossAmount = data?.gROSSAMT || 0;
        this.VoucherDataRequestModel.netPayable = TotalAmount;
        this.VoucherDataRequestModel.roundOff = +(TotalAmount - PaymentAmount);
        this.VoucherDataRequestModel.voucherCanceled = false
        this.VoucherDataRequestModel.transactionNumber = mRNO,
          this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
         this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        var VoucherlineitemList = this.GetVouchersLedgers(data, mRNO);

        this.VoucherRequestModel.details = VoucherlineitemList
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];
        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {

              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                transCode: VoucherInstanceType.BillCollection,
                transType: VoucherInstanceType[VoucherInstanceType.BillCollection],
                voucherCode: VoucherType.CreditVoucher,
                voucherType: VoucherType[VoucherType.CreditVoucher],
                docType: "Voucher",
                partyType: "Customer",
                docNo: mRNO,
                partyCode: data?.cUST?.cD || "",
                partyName: data?.cUST?.nM || "",
                entryBy: localStorage.getItem("UserName"),
                entryDate: Date(),
                debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ?? ""
                  };
                }),
                credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ?? ""
                  };
                }),
              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    if (res?.success == true) {
                      this.UpdateBillCollection(mRNO, reqBody.voucherNo)
                    }
                  },
                  error: (err: any) => {

                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal("error", "Bad Request");
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });

            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }

    }, "Customer Bill Collection Voucher Generating..!");

  }
  UpdateBillCollection(MrNo, VoucherNo) {

    const updateRequest = { vUCHNO: VoucherNo };
    const reqbillcollection = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_collection",
      filter: { mRNO: MrNo },
      update: updateRequest,
    };
    firstValueFrom(this.masterService.masterPut("generic/update", reqbillcollection)),
      Swal.fire({
        icon: "success",
        title: "Invoice collection Successfully And Voucher Created",
        text: "MR No: " + MrNo + "  Voucher No: " + VoucherNo,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.hideLoading();
          setTimeout(() => {
            this.tab('Management​');
            Swal.close();
          }, 2000);
        }
      });
  }
  GetVouchersLedgers(data, mRNO) {
    const GstAmount = data?.gST?.aMT;
    const GstRate = data?.gST?.rATE;

    const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);

    //const BillNumbersList = this.tableData.filter(item => item.isSelected == true).map(item => item.bILLNO);

    const createVoucher = (accCode, accName, accCategory, debit, credit) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BillCollection,
      transType: VoucherInstanceType[VoucherInstanceType.BillCollection],
      voucherCode: VoucherType.CreditVoucher,
      voucherType: VoucherType[VoucherType.CreditVoucher],
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
      GSTRate: GstRate,
      GSTAmount: GstAmount,//credit,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill freight is Collected : ${mRNO}`,
    });

    const response = [
      createVoucher(ledgerInfo['Billed debtors'].LeadgerCode, ledgerInfo['Billed debtors'].LeadgerName, ledgerInfo['Billed debtors'].LeadgerCategory, 0, NetPayable),
    ];

    const PaymentMode = this.DebitVoucherTaxationPaymentDetailsForm.get("PaymentMode").value;
    if (PaymentMode == "Cash") {
      const CashAccount = this.DebitVoucherTaxationPaymentDetailsForm.get("CashAccount").value;
      response.push(createVoucher(CashAccount.aCNM, CashAccount.aCCD, "ASSET", PaymentAmount, 0));
    }
    if (PaymentMode == "Cheque") {
      const BankDetails = this.DebitVoucherTaxationPaymentDetailsForm.get("Bank").value;
      let Leadgerdata = {
        name: "",
        value: ""
      }
      const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
      if (AccountDetails != undefined) {
        Leadgerdata = {
          name: AccountDetails?.aCNM,
          value: AccountDetails?.aCCD
        }
      }
      response.push(createVoucher(Leadgerdata.value, Leadgerdata.name, "ASSET", PaymentAmount, 0));
    }


    if (PaymentAmount != NetPayable) {
      const Amount = NetPayable - PaymentAmount;
      const isAmountNegative = Amount < 0;
      response.push(createVoucher(ledgerInfo['Round off Amount'].LeadgerCode, ledgerInfo['Round off Amount'].LeadgerName,
        ledgerInfo['Unbilled debtors'].LeadgerCategory, isAmountNegative ? 0 : Amount.toFixed(2), isAmountNegative ? (-Amount).toFixed(2) : 0));

    }

    return response;
  }
}
