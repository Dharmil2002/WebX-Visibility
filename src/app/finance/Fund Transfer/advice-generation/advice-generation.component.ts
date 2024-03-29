import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { AdviceGenerationControl } from "src/assets/FormControls/Finance/AdviceGeneration/advicegenerationcontrol";
import { GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi } from "../../Debit Voucher/debitvoucherAPIUtitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { VendorBillEntry } from "src/app/Models/Finance/VendorPayment";
import { AdviceGeneration } from "src/app/Models/Finance/Advice";
import { StorageService } from "src/app/core/service/storage.service";
import { financialYear } from "src/app/Utility/date/date-utils";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { firstValueFrom } from "rxjs";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import Swal from "sweetalert2";
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType } from "src/app/Models/Finance/Finance";

@Component({
  selector: 'app-advice-generation',
  templateUrl: './advice-generation.component.html',
})
export class AdviceGenerationComponent implements OnInit {

  AdviceTableForm: UntypedFormGroup;
  jsonControlAdviceGenerationArray: any;

  AdvicePaymentForm: UntypedFormGroup;
  jsonControlAdvicePaymentGenerationArray: any;
  AlljsonControlAdvicePaymentGenerationArray: any;
  submit = "Save";
  AdviceFormControls: AdviceGenerationControl;
  breadScrums = [{}];
  isUpdate = false;
  AllLocationsList: any;
  NavigationStateRequest: any;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(private fb: UntypedFormBuilder, private router: Router,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService, private storage: StorageService, private filter: FilterUtils, private route: Router, private masterService: MasterService,) {
    this.NavigationStateRequest = this.route.getCurrentNavigation()?.extras?.state;

    if (this.NavigationStateRequest?.Type === "Modify") {
      this.isUpdate = true;
      this.submit = "Modify";
      this.breadScrums = [
        {
          title: "Advice Modify",
          items: ["Finance"],
          active: "Advice Modify",
        },
      ];
    }
    else if (this.NavigationStateRequest?.Type === "Acknowledge") {
      this.isUpdate = true;
      this.submit = "Acknowledge";
      this.breadScrums = [
        {
          title: "Advice Acknowledge",
          items: ["Finance"],
          active: "Advice Acknowledge",
        },
      ];
    } else if (this.NavigationStateRequest?.Type === "View") {
      this.isUpdate = true;
      this.submit = "View";
      this.breadScrums = [
        {
          title: "View Acknowledge",
          items: ["Finance"],
          active: "View Acknowledge",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Advice Generation",
          items: ["Finance"],
          active: "Advice Generation",
        },
      ];
    }

  }

  ngOnInit(): void {
    this.BindDataFromAPI();
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.AdviceFormControls = new AdviceGenerationControl(this.NavigationStateRequest?.data, this.NavigationStateRequest?.Type);
    this.jsonControlAdviceGenerationArray = this.AdviceFormControls.getFormControls();
    this.AdviceTableForm = formGroupBuilder(this.fb, [this.jsonControlAdviceGenerationArray,]);

    this.jsonControlAdvicePaymentGenerationArray = this.AdviceFormControls.getPaymentFormControls();
    if (this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {

    } else {
      this.jsonControlAdvicePaymentGenerationArray = this.jsonControlAdvicePaymentGenerationArray.filter(x => x.name != "Depositedin");
    }
    this.AlljsonControlAdvicePaymentGenerationArray = this.jsonControlAdvicePaymentGenerationArray
    this.AdvicePaymentForm = formGroupBuilder(this.fb, [this.jsonControlAdvicePaymentGenerationArray,]);
    if (this.NavigationStateRequest?.Type == "Modify" || this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
      this.SetModifyData();
    }

  }
  SetModifyData() {
    this.AdviceTableForm.get('AdviceType').setValue(this.NavigationStateRequest?.data?.aDTYP);
    if (this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
      this.AdviceTableForm.get('AdviceType').disable();
    }

  }
  async BindDataFromAPI() {
    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService)

    this.filter.Filter(
      this.jsonControlAdviceGenerationArray,
      this.AdviceTableForm,
      this.AllLocationsList,
      "raisedonBranch",
      false
    );
    this.filter.Filter(
      this.jsonControlAdvicePaymentGenerationArray,
      this.AdvicePaymentForm,
      PaymentMode,
      "PaymentMode",
      true
    );
    if (this.NavigationStateRequest?.Type == "Modify" || this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
      const raisedonBranch = this.AllLocationsList.find(x => x.name == this.NavigationStateRequest?.data?.rBRANCH)
      this.AdviceTableForm.get('raisedonBranch').setValue(raisedonBranch);
      const PaymentModedata = PaymentMode.find(x => x.name == this.NavigationStateRequest?.data?.pMODE)
      this.AdvicePaymentForm.get('PaymentMode').setValue(PaymentModedata);
      this.OnPaymentModeChange(true);
    }

  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {

    const PaymentMode = this.AdvicePaymentForm.get("PaymentMode").value?.name;
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
    this.jsonControlAdvicePaymentGenerationArray = this.AlljsonControlAdvicePaymentGenerationArray.filter(filterFunction);
    const raisedonBranch = this.AdviceTableForm.value.raisedonBranch?.name
    switch (PaymentMode) {
      case 'Cheque':
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, raisedonBranch)
        this.filter.Filter(
          this.jsonControlAdvicePaymentGenerationArray,
          this.AdvicePaymentForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.AdvicePaymentForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        if (event == true) {
          const SelectedBank = responseFromAPIBank.find(x => x.value == this.NavigationStateRequest?.data?.aCNM)
          Bank.setValue(SelectedBank);
          if (this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
            this.filter.Filter(
              this.jsonControlAdvicePaymentGenerationArray,
              this.AdvicePaymentForm,
              responseFromAPIBank,
              "Depositedin",
              false
            );
            const Depositedin = this.AdvicePaymentForm.get('Depositedin');
            const SelectedBank = responseFromAPIBank.find(x => x.value == this.NavigationStateRequest?.data?.dACCD)
            Depositedin.setValue(SelectedBank);
          }
        }
        const ChequeOrRefNo = this.AdvicePaymentForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const CashAccount = this.AdvicePaymentForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", raisedonBranch)
        this.filter.Filter(
          this.jsonControlAdvicePaymentGenerationArray,
          this.AdvicePaymentForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.AdvicePaymentForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();
        if (event == true) {
          const SelectedCash = responseFromAPICash.find(x => x.value == this.NavigationStateRequest?.data?.aCNM)
          CashAccountS.setValue(SelectedCash);
          if (this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
            this.filter.Filter(
              this.jsonControlAdvicePaymentGenerationArray,
              this.AdvicePaymentForm,
              responseFromAPICash,
              "Depositedin",
              false
            );
            const Depositedin = this.AdvicePaymentForm.get('Depositedin');
            const SelectedBank = responseFromAPICash.find(x => x.value == this.NavigationStateRequest?.data?.dACCD)
            Depositedin.setValue(SelectedBank);
          }
        }
        const BankS = this.AdvicePaymentForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.AdvicePaymentForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        const responseFromAPIBankRTGS = await GetBankDetailFromApi(this.masterService, raisedonBranch)
        this.filter.Filter(
          this.jsonControlAdvicePaymentGenerationArray,
          this.AdvicePaymentForm,
          responseFromAPIBankRTGS,
          "Bank",
          false
        );
        const BankRTGS = this.AdvicePaymentForm.get('Bank');
        BankRTGS.setValidators([Validators.required, autocompleteObjectValidator()]);
        BankRTGS.updateValueAndValidity();

        if (event == true) {
          const SelectedBank = responseFromAPIBankRTGS.find(x => x.value == this.NavigationStateRequest?.data?.aCNM)
          BankRTGS.setValue(SelectedBank);
          if (this.NavigationStateRequest?.Type == "Acknowledge" || this.NavigationStateRequest?.Type == "View") {
            this.filter.Filter(
              this.jsonControlAdvicePaymentGenerationArray,
              this.AdvicePaymentForm,
              responseFromAPIBankRTGS,
              "Depositedin",
              false
            );
            const Depositedin = this.AdvicePaymentForm.get('Depositedin');
            const SelectedBank = responseFromAPIBankRTGS.find(x => x.value == this.NavigationStateRequest?.data?.dACCD)
            Depositedin.setValue(SelectedBank);
          }
        }
        const ChequeOrRefNoRTGS = this.AdvicePaymentForm.get('ChequeOrRefNo');
        ChequeOrRefNoRTGS.setValidators([Validators.required]);
        ChequeOrRefNoRTGS.updateValueAndValidity();

        const CashAccountRTGS = this.AdvicePaymentForm.get('CashAccount');
        CashAccountRTGS.setValue("");
        CashAccountRTGS.clearValidators();
        CashAccountRTGS.updateValueAndValidity();

        break;
    }

  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  async GenerateAdvice(vno) {
    if (this.NavigationStateRequest?.Type == "Acknowledge") {

      let RequestData = this.NavigationStateRequest?.data;
      RequestData.sTCD = 2;
      RequestData.sTNM = "Acknowledge";
      RequestData.dACCD = this.AdvicePaymentForm.value?.Depositedin?.value;
      RequestData.dACNM = this.AdvicePaymentForm.value?.Depositedin?.name;
      RequestData.dDT = this.AdvicePaymentForm.value?.Depositedon;
      RequestData.mODDT = new Date();
      RequestData.mODBY = this.storage.userName;
      RequestData.mODLOC = this.storage.branch;
      const req = {
        companyCode: this.storage.companyCode,
        filter: { _id: RequestData._id },
        collectionName: "advice_details",
        update: RequestData
      }

      const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));
      if (res) {
        Swal.fire({
          icon: "success",
          title: `Advice Acknowledge Successfully`,
          text: "Advice No: " + RequestData.docNo,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.hideLoading();
            setTimeout(() => {
              Swal.close();
              this.router.navigate(['/Finance/FundTransfer/AdviceAcknowledge']);
            }, 1000);
          }
        });
      }

    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          const AccountDetails = this.AdvicePaymentForm.value.PaymentMode?.value == "Cash" ? this.AdvicePaymentForm.value.CashAccount : this.AdvicePaymentForm.value.Bank;
          const AdviceGeneration: AdviceGeneration = {
            companyCode: this.storage.companyCode,
            docType: "ADVICE",
            branch: this.storage.branch,
            finYear: financialYear,
            data: {
              docNo: this.isUpdate ? this.NavigationStateRequest?.data?.docNo : "",
              aDTYP: this.AdviceTableForm.value.AdviceType,
              aDDT: this.AdviceTableForm.value.adviceDate,
              rBRANCH: this.AdviceTableForm.value.raisedonBranch?.name,
              rEASION: this.AdviceTableForm.value.reasonforAdvice,
              aMT: this.AdviceTableForm.value.applicableAmount,
              pMODE: this.AdvicePaymentForm.value.PaymentMode?.value,
              cHEQREF: this.AdvicePaymentForm.value.ChequeOrRefNo,
              aCCD: AccountDetails?.name,
              aCNM: AccountDetails?.value,
              aDT: this.AdvicePaymentForm.value.Date,
              vNO: vno,
              sTCD: 1,
              sTNM: "Generated",
              dACCD: "",
              dACNM: "",
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName,

            }
          }
          if (this.isUpdate) {
            AdviceGeneration.data.mODDT = new Date();
            AdviceGeneration.data.mODBY = this.storage.userName;
            AdviceGeneration.data.mODLOC = this.storage.branch;
          }
          await
            firstValueFrom(this.voucherServicesService
              .FinancePost(`finance/bill/Advice/create`, AdviceGeneration)).then((res: any) => {
                if (res.success) {

                  Swal.fire({
                    icon: "success",
                    title: `Advice ${this.isUpdate ? 'Updated' : 'Generated'} Successfully`,
                    text: `Advice No: ${this.isUpdate ? AdviceGeneration.data.docNo : res?.data.ops[0].docNo}`,
                    showConfirmButton: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.hideLoading();
                      setTimeout(() => {
                        Swal.close();
                        this.router.navigate(['/Finance/FundTransfer/AdviceAcknowledge']);
                      }, 1000);
                    }
                  });

                } else {
                  this.snackBarUtilityService.ShowCommonSwal("error", res?.message);
                }
              }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
              .finally(() => {

              });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error);
        }
      }, "Advice Generating..!");
    }
  }
  AdviceVoucherGeneration() {
    if (!this.isUpdate && this.submit == "Save") {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          const TotalAmount = this.AdviceTableForm.value.applicableAmount;

          this.VoucherRequestModel.companyCode = this.storage.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch = this.AdviceTableForm.value.raisedonBranch?.name
          this.VoucherRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.voucherNo = "";
          this.VoucherDataRequestModel.transCode = VoucherInstanceType.AdviceVoucherCreation;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.AdviceVoucherCreation];
          this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch = this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation =
            this.storage.branch;
          this.VoucherDataRequestModel.preperedFor = "Vendor";
          this.VoucherDataRequestModel.partyCode = "";
          this.VoucherDataRequestModel.partyName = "";
          this.VoucherDataRequestModel.partyState = "";
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
          this.VoucherDataRequestModel.entryDate = new Date();
          this.VoucherDataRequestModel.panNo = "";

          this.VoucherDataRequestModel.tdsSectionCode = undefined
          this.VoucherDataRequestModel.tdsSectionName = undefined
          this.VoucherDataRequestModel.tdsRate = 0;
          this.VoucherDataRequestModel.tdsAmount = 0;
          this.VoucherDataRequestModel.tdsAtlineitem = false;
          this.VoucherDataRequestModel.tcsSectionCode = undefined
          this.VoucherDataRequestModel.tcsSectionName = undefined
          this.VoucherDataRequestModel.tcsRate = 0;
          this.VoucherDataRequestModel.tcsAmount = 0;

          this.VoucherDataRequestModel.IGST = 0;
          this.VoucherDataRequestModel.SGST = 0;
          this.VoucherDataRequestModel.CGST = 0;
          this.VoucherDataRequestModel.UGST = 0;
          this.VoucherDataRequestModel.GSTTotal = 0;

          this.VoucherDataRequestModel.GrossAmount = TotalAmount
          this.VoucherDataRequestModel.netPayable = TotalAmount
          this.VoucherDataRequestModel.roundOff = 0;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode = this.AdvicePaymentForm.value.PaymentMode?.value,
            this.VoucherDataRequestModel.refNo = this.AdvicePaymentForm.value.ChequeOrRefNo,
            this.VoucherDataRequestModel.accountName = this.AdvicePaymentForm.value?.Bank?.name;
          this.VoucherDataRequestModel.accountCode = this.AdvicePaymentForm.value?.Bank.value;
          this.VoucherDataRequestModel.date = this.AdvicePaymentForm.value.Date
          this.VoucherDataRequestModel.scanSupportingDocument = "";

          const companyCode = this.storage.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList = [
            {
              companyCode: companyCode,
              voucherNo: "",
              transCode: VoucherInstanceType.AdviceVoucherCreation,
              transType: VoucherInstanceType[VoucherInstanceType.AdviceVoucherCreation],
              voucherCode: VoucherType.JournalVoucher,
              voucherType: VoucherType[VoucherType.JournalVoucher],
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: "TEST",
              accName: "TEST",
              sacCode: "TEST",
              sacName: "TEST",
              debit: this.AdviceTableForm.value.AdviceType == "D" ? TotalAmount : 0,
              credit: this.AdviceTableForm.value.AdviceType == "C" ? TotalAmount : 0,
              GSTRate: 0,
              GSTAmount: 0,
              Total: TotalAmount,
              TDSApplicable: false,
              narration: "",
            }
          ];



          this.VoucherRequestModel.details = VoucherlineitemList;
          this.VoucherRequestModel.data = this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(this.voucherServicesService
            .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
              if (res.success) {
                this.GenerateAdvice(res?.data?.mainData?.ops[0].vNO)
              }
            }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
            .finally(() => {

            });

        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            error.message
          );
        }
      }, "Advice Voucher Generating..!");
    } else {
      this.GenerateAdvice("");
    }
  }
}
const PaymentMode = [
  {
    value: "Cheque",
    name: "Cheque",
  },
  {
    value: "Cash",
    name: "Cash",
  },
  {
    value: "RTGS/UTR",
    name: "RTGS/UTR",
  },

]