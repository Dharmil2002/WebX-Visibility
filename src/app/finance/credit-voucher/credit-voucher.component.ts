import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditVoucherControl } from 'src/assets/FormControls/Finance/CreditVoucher/creditVoucher';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { StorageService } from 'src/app/core/service/storage.service';
import { AddCreditVoucherDetailsModalComponent } from './add-credit-voucher-details-modal/add-credit-voucher-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';
import { Router } from '@angular/router';
import { DriversFromApi, GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi, UsersFromApi, customerFromApi, vendorFromApi } from '../Debit Voucher/debitvoucherAPIUtitlity';
import { VoucherInstanceType, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { CreditVoucherPreviewComponent } from './credit-voucher-preview/credit-voucher-preview.component';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { CreditVoucherDataRequestModel, CreditVoucherRequestModel } from 'src/app/Models/Finance/CreditVoucher';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
@Component({
  selector: 'app-credit-voucher',
  templateUrl: './credit-voucher.component.html'
})
export class CreditVoucherComponent implements OnInit {
  breadScrums = [
    {
      title: "Credit Voucher",
      items: ["Finance"],
      active: "Credit Voucher",
    },
  ];
  creditVoucherControl: CreditVoucherControl;

  creditVoucherSummaryForm: UntypedFormGroup;
  jsonControlCreditVoucherSummaryArray: any;
  columnHeader = {
    Ledger: {
      Title: "Ledger",
      class: "matcolumnfirst",
      Style: "min-width:200px",
    },
    CreditAmount: {
      Title: "Credit Amount ₹",
      class: "matcolumncenter",
      Style: "max-width:120px",
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
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Ledger', 'CreditAmount', 'Narration']

  tableData: any = [];
  AccountGroupList: any;
  creditVoucherPaymentSummaryForm: UntypedFormGroup;
  jsonControlCreditVoucherPaymentSummaryArray: any;
  DebitVoucherControl: DebitVoucherControl;
  creditVoucherPaymentDetailsForm: UntypedFormGroup;
  jsonControlCreditVoucherPaymentDetailsArray: any;
  AlljsonControlCreditVoucherPaymentDetailsArray: any;
  AccountsBanksList: any;
  LoadVoucherDetails = true;
  creditVoucherRequestModel = new CreditVoucherRequestModel();
  creditVoucherDataRequestModel = new CreditVoucherDataRequestModel();
  creditAgainstDocumentList: any = [];
  constructor(
    private fb: UntypedFormBuilder,
    private voucherServicesService: VoucherServicesService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService,
    private matDialog: MatDialog,
    private navigationService: NavigationService,
    private router: Router,
    private snackBarUtilityService: SnackBarUtilityService,

  ) { }

  ngOnInit(): void {
    this.bindData();
    this.initializeFormControl()
  }
  //#region to initialize form control
  initializeFormControl() {
    this.creditVoucherControl = new CreditVoucherControl("");
    this.jsonControlCreditVoucherSummaryArray = this.creditVoucherControl.getCreditVoucherSummaryArrayControls();
    this.creditVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherSummaryArray]);

    this.DebitVoucherControl = new DebitVoucherControl("");
    this.jsonControlCreditVoucherPaymentSummaryArray = this.DebitVoucherControl.getDebitVoucherTaxationPaymentSummaryArrayControls();

    this.creditVoucherPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherPaymentSummaryArray]);

    this.jsonControlCreditVoucherPaymentSummaryArray = this.jsonControlCreditVoucherPaymentSummaryArray
      .filter(x => x.name != 'Debitagainstdocument')
      .map(x => {
        x.generatecontrol = true;
        return x;
      });
    this.jsonControlCreditVoucherPaymentDetailsArray = this.creditVoucherControl.getCreditVoucherReceiptDetailArrayControls();

    this.AlljsonControlCreditVoucherPaymentDetailsArray = this.jsonControlCreditVoucherPaymentDetailsArray
    this.creditVoucherPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherPaymentDetailsArray]);
    this.jsonControlCreditVoucherPaymentDetailsArray = this.jsonControlCreditVoucherPaymentDetailsArray.slice(0, 1);
  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  //#region to get accounting location data
  async bindData() {

    const allLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlCreditVoucherSummaryArray,
      this.creditVoucherSummaryForm,
      allLocationsList,
      "Accountinglocation",
      false
    );
  }
  //#endregion
  //#region to set party name according to received from data
  async ReceivedfromFieldChanged(event) {
    const Receivedfrom = this.creditVoucherSummaryForm.value.Receivedfrom;
    const PartyName = this.creditVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    const partyNameControl = this.jsonControlCreditVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Receivedfrom) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      default:
        partyNameControl.type = "text";
        PartyName.setValidators(Validators.required);
        PartyName.updateValueAndValidity();

    }
    this.BindLedger(Receivedfrom);
  }
  //#endregion
  //#region to edit table data
  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.addCreditVoucherDetails(LedgerDetails)
    }
  }
  //#endregion
  //#region to add new credit data
  addCreditData() {
    this.addCreditVoucherDetails('')
  }
  //#endregion
  //#region to open modal
  addCreditVoucherDetails(event) {
    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(AddCreditVoucherDetailsModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          Ledger: result?.Ledger,
          CreditAmount: parseFloat(result?.CreditAmount || 0),
          LedgerHdn: result?.LedgerHdn,
          Narration: result?.Narration,
          SubCategoryName: result?.SubCategoryName,
          actions: ['Edit', 'Remove']
        }
        this.tableData.push(json);
        this.LoadVoucherDetails = true;

      }
      this.CalculatePaymentAmount()
      this.LoadVoucherDetails = true;
    });

  }
  //#endregion
  //#region to get ledger data
  async BindLedger(BindLedger) {
    const account_groupReqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "account_detail",
      filter: {
        pARTNM: BindLedger
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  //#endregion
  //#region Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const ReceiptMode = this.creditVoucherPaymentDetailsForm.get("ReceiptMode").value;
    let filterFunction;
    switch (ReceiptMode) {
      case 'Cheque':
        filterFunction = (x) => x.name !== 'CashAccount';

        break;
      case 'Cash':
        filterFunction = (x) => x.name !== 'ChequeOrRefNo' && x.name !== 'DepositBank'
          && x.name !== 'receivedBank' && x.name !== 'DepositDate' && x.name !== 'ChequeDate';
        break;
      case 'RTGS/UTR':
        filterFunction = (x) => x.name !== 'CashAccount';
        break;
    }
    this.jsonControlCreditVoucherPaymentDetailsArray = this.AlljsonControlCreditVoucherPaymentDetailsArray.filter(filterFunction);
    const Accountinglocation = this.creditVoucherSummaryForm.value.Accountinglocation?.name
    switch (ReceiptMode) {
      case 'Cheque':
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlCreditVoucherPaymentDetailsArray,
          this.creditVoucherPaymentDetailsForm,
          responseFromAPIBank,
          "DepositBank",
          false
        );

        const depositBank = this.creditVoucherPaymentDetailsForm.get('DepositBank');
        depositBank.setValidators([Validators.required, autocompleteObjectValidator()]);
        depositBank.updateValueAndValidity();

        const ChequeOrRefNo = this.creditVoucherPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const CashAccount = this.creditVoucherPaymentDetailsForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonControlCreditVoucherPaymentDetailsArray,
          this.creditVoucherPaymentDetailsForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.creditVoucherPaymentDetailsForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const deBank = this.creditVoucherPaymentDetailsForm.get('DepositBank');
        deBank.setValue("");
        deBank.clearValidators();
        deBank.updateValueAndValidity();

        const receivBank = this.creditVoucherPaymentDetailsForm.get('receivedBank');
        receivBank.setValue("");
        receivBank.clearValidators();
        receivBank.updateValueAndValidity();

        const ChequeOrRefNoS = this.creditVoucherPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }
  //#endregion
  //#region to navigate to dashboard
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  //#endregion
  //#region to calculate total credit amt and set in PaymentAmount and NetPayable
  CalculatePaymentAmount() {
    const total = this.tableData.filter(item => item.CreditAmount).reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['CreditAmount']);
    }, 0);

    this.creditVoucherPaymentSummaryForm.get("PaymentAmount").setValue(total.toFixed(2));
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(total.toFixed(2));
  }
  //#endregion
  //#region to get roundoff values
  toggleUpDown(event) {
    const totalPaymentAmount = this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value;
    const roundedValue = event.isUpDown ? Math.ceil(totalPaymentAmount) : Math.floor(totalPaymentAmount);
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(roundedValue);
  }
  //#endregion
  //#region to get round up value
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  //#endregion
  //#region to format credit data
  saveCreditData() {

    const Accountinglocation = this.creditVoucherSummaryForm.value.Accountinglocation?.name
    let FinalListOfCreditVoucher = [];
    // Calculate debit voucher
    console.log(this.tableData);
    var VoucherlineitemList = this.tableData.map(function (item) {

      return {
        "Instance": "Credit voucher",
        "Value": "Voucher line item",
        "Ledgercode": item.LedgerHdn,
        "Ledgername": item.Ledger,
        "SubLedger": item.SubCategoryName,
        "Dr": 0,
        "Cr": parseFloat(item.CreditAmount).toFixed(2),
        "Location": Accountinglocation,
        "Narration": item.Narration
      };
    });
    FinalListOfCreditVoucher = VoucherlineitemList;

    // Calculate Round Off 
    const PaymentAmount = parseFloat(this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value);
    const NetPayable = parseFloat(this.creditVoucherPaymentSummaryForm.get("NetPayable").value);
    if (PaymentAmount != NetPayable) {
      const Amount = NetPayable - PaymentAmount;
      const isAmountNegative = Amount < 0;

      var RoundOffList = {
        "Instance": "Credit voucher",
        "Value": ledgerInfo['Round off Amount'].LeadgerName,
        "Ledgercode": ledgerInfo['Round off Amount'].LeadgerCode,
        "Ledgername": ledgerInfo['Round off Amount'].LeadgerName,
        "SubLedger": "EXPENSE",
        "Dr": isAmountNegative ? (-Amount).toFixed(2) : 0,
        "Cr": isAmountNegative ? 0 : Amount.toFixed(2),
        "Location": Accountinglocation,
        "Narration": ledgerInfo['Round off Amount'].LeadgerName,
      };

      FinalListOfCreditVoucher.push(RoundOffList)
    }

    const PaymentMode = this.creditVoucherPaymentDetailsForm.get("ReceiptMode").value;
    let Leadgerdata;
    switch (PaymentMode) {
      case 'Cheque':

        // Get deposit bank details from the creditVoucherPaymentDetailsForm
        const depositBankValue = this.creditVoucherPaymentDetailsForm.get("DepositBank").value;

        // Find the account details for the deposit bank in the AccountsBanksList
        const depositAccountDetails = this.AccountsBanksList.find(item => item.bANCD === depositBankValue?.value && item.bANM === depositBankValue?.name);

        if (depositAccountDetails != undefined) {
          Leadgerdata = {
            name: depositAccountDetails?.aCNM,
            value: depositAccountDetails?.aCCD
          }
        } else {
          this.snackBarUtilityService.ShowCommonSwal("error", "Please select valid Bank Which is mapped with Account Master")
          return;
        }
        break;
      case 'Cash':
        Leadgerdata = this.creditVoucherPaymentDetailsForm.get("CashAccount").value
        break;
      case 'RTGS/UTR':
        Leadgerdata = this.creditVoucherPaymentDetailsForm.get("DepositBank").value
        break;
    }

    let PayableData = {
      "Instance": "Credit voucher",
      "Value": PaymentMode,
      "Ledgercode": Leadgerdata?.value,
      "Ledgername": Leadgerdata?.name,
      "SubLedger": "BANK",
      "Dr": NetPayable.toFixed(2),
      "Cr": 0,
      "Location": Accountinglocation,
      "Narration": ""
    };
    FinalListOfCreditVoucher.push(PayableData)

    const dialogRef = this.matDialog.open(CreditVoucherPreviewComponent, {
      data: FinalListOfCreditVoucher,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.SubmitRequest(FinalListOfCreditVoucher)
      }
    });
  }

  async SubmitRequest(FinalListOfCreditVoucher) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        console.log(FinalListOfCreditVoucher);

        const companyCode = this.storage.companyCode;
        const Branch = this.storage.branch;

        const PaymentAmount = parseFloat(this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value);
        const NetPayable = parseFloat(this.creditVoucherPaymentSummaryForm.get("NetPayable").value);

        this.creditVoucherRequestModel.companyCode = this.storage.companyCode;
        this.creditVoucherRequestModel.docType = "VR";
        this.creditVoucherRequestModel.branch = this.creditVoucherSummaryForm.value.Accountinglocation?.name
        this.creditVoucherRequestModel.finYear = financialYear

        this.creditVoucherDataRequestModel.voucherNo = "";
        this.creditVoucherDataRequestModel.transCode = VoucherInstanceType.CreditVoucherCreation;
        this.creditVoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.CreditVoucherCreation];
        this.creditVoucherDataRequestModel.voucherCode = VoucherType.CreditVoucher;
        this.creditVoucherDataRequestModel.voucherType = VoucherType[VoucherType.CreditVoucher];
        this.creditVoucherDataRequestModel.transDate = this.creditVoucherSummaryForm.value.TransactionDate
        this.creditVoucherDataRequestModel.docType = "VR";
        this.creditVoucherDataRequestModel.branch = Branch;
        this.creditVoucherDataRequestModel.finYear = financialYear

        this.creditVoucherDataRequestModel.accLocation = this.creditVoucherSummaryForm.value.Accountinglocation?.name;
        this.creditVoucherDataRequestModel.receivedfrom = this.creditVoucherSummaryForm.value.Receivedfrom;
        this.creditVoucherDataRequestModel.partyCode = this.creditVoucherSummaryForm.value.PartyName?.value ?? "8888";
        this.creditVoucherDataRequestModel.partyName = this.creditVoucherSummaryForm.value.PartyName?.name ?? this.creditVoucherSummaryForm.value.PartyName;
        this.creditVoucherDataRequestModel.entryBy = this.creditVoucherSummaryForm.value.Preparedby;
        this.creditVoucherDataRequestModel.entryDate = new Date();
        this.creditVoucherDataRequestModel.netPayable = NetPayable;
        this.creditVoucherDataRequestModel.roundOff = +(NetPayable - PaymentAmount).toFixed(2);
        this.creditVoucherDataRequestModel.voucherCanceled = false

        this.creditVoucherDataRequestModel.paymentMode = this.creditVoucherPaymentDetailsForm.value.ReceiptMode;
        this.creditVoucherDataRequestModel.refNo = this.creditVoucherPaymentDetailsForm.value.ChequeOrRefNo;
        this.creditVoucherDataRequestModel.accountName = this.creditVoucherPaymentDetailsForm.value.DepositBank.name;
        this.creditVoucherDataRequestModel.accountCode = this.creditVoucherPaymentDetailsForm.value.DepositBank.value;
        this.creditVoucherDataRequestModel.date = this.creditVoucherPaymentDetailsForm.value.ChequeDate;

        let Accountdata = FinalListOfCreditVoucher.map(function (item) {
          return {
            "companyCode": localStorage.getItem("companyCode"),
            "voucherNo": "",
            "transCode": VoucherInstanceType.CreditVoucherCreation,
            "transType": VoucherInstanceType[VoucherInstanceType.CreditVoucherCreation],
            "voucherCode": VoucherType.CreditVoucher,
            "voucherType": VoucherType[VoucherType.CreditVoucher],
            "transDate": new Date(),
            "finYear": financialYear,
            "branch": localStorage.getItem("Branch"),
            "accCode": item.Ledgercode,
            "accName": item.Ledgername,
            "accCategory": item.SubLedger,
            "sacCode": "",
            "sacName": "",
            "debit": parseFloat(item.Dr).toFixed(2),
            "credit": parseFloat(item.Cr).toFixed(2),
            "GSTRate": 0,
            "GSTAmount": 0,
            "Total": +(item.Dr - item.Cr).toFixed(2),
            "TDSApplicable": false,
            "narration": item.Narration ?? item.Ledgername,
          };
        });

        var VoucherlineitemList = Accountdata;



        this.creditVoucherRequestModel.details = VoucherlineitemList
        this.creditVoucherRequestModel.data = this.creditVoucherDataRequestModel;
        this.creditVoucherRequestModel.debitAgainstDocumentList = [];

        console.log(this.creditVoucherRequestModel);

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.creditVoucherRequestModel)
          .subscribe({
            next: (res: any) => {
              var CreditData = FinalListOfCreditVoucher.filter(item => item.Dr == "").map(function (item) {
                return {
                  "accCode": `${item.Ledgercode}`,
                  "accName": item.Ledgername,
                  "amount": item.Cr,
                  "accCategory": item.SubLedger,
                  "narration": item.Narration ? item.Narration : item.Ledgername,
                };
              })
              var DebitData = FinalListOfCreditVoucher.filter(item => item.Cr == "").map(function (item) {
                return {
                  "accCode": `${item.Ledgercode}`,
                  "accName": item.Ledgername,
                  "amount": item.Dr,
                  "accCategory": item.SubLedger,
                  "narration": item.Narration ? item.Narration : item.Ledgername,
                };
              })
              let reqBody = {
                companyCode: companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: localStorage.getItem("Branch"),
                transCode: VoucherInstanceType.CreditVoucherCreation,
                transType: VoucherInstanceType[VoucherInstanceType.CreditVoucherCreation],
                voucherCode: VoucherType.CreditVoucher,
                voucherType: VoucherType[VoucherType.CreditVoucher],
                docType: "Voucher",
                partyType: this.creditVoucherSummaryForm.value.Preparedfor,
                docNo: "",
                partyCode: this.creditVoucherSummaryForm.value.PartyName?.value ?? "8888",
                partyName: this.creditVoucherSummaryForm.value.PartyName?.name ?? this.creditVoucherSummaryForm.value.PartyName,
                entryBy: localStorage.getItem("UserName"),
                entryDate: Date(),
                debit: DebitData,
                credit: CreditData,
              };
              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    Swal.fire({
                      icon: "success",
                      title: "Voucher Created Successfully",
                      text: "Voucher No: " + reqBody.voucherNo,
                      showConfirmButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.hideLoading();
                        setTimeout(() => {
                          Swal.close();
                        }, 2000);
                        this.navigationService.navigateTotab("Voucher", "dashboard/Index");
                      }
                    });
                  },
                  error: (err: any) => {

                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal("error", "Bad Request");
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });

              console.log(reqBody);
            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }


    }, "Credit Voucher Generating..!");

  }
  //#endregion
}