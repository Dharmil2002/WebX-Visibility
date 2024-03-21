import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { firstValueFrom, from } from "rxjs";
import {
  VoucherRequestModel,
  VoucherDataRequestModel,
  VoucherInstanceType,
  VoucherType,
} from "src/app/Models/Finance/Finance";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { financialYear } from "src/app/Utility/date/date-utils";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import {
  GetAccountDetailFromApi,
  GetBankDetailFromApi,
} from "src/app/finance/Debit Voucher/debitvoucherAPIUtitlity";
import { ContraVoucherControl } from "src/assets/FormControls/Finance/VoucherEntry/ContraVouchercontrol";
import Swal from "sweetalert2";

@Component({
  selector: "app-contra-voucher-creation",
  templateUrl: "./contra-voucher-creation.component.html",
})
export class ContraVoucherCreationComponent implements OnInit {
  breadScrums = [
    {
      title: "Contra Voucher",
      items: ["Finance"],
      active: "Contra Voucher",
    },
  ];
  ContraVoucherControl: ContraVoucherControl;

  ContraVoucherSummaryForm: UntypedFormGroup;
  jsonControlContraVoucherSummaryArray: any;

  ContraVoucherPaymentForm: UntypedFormGroup;
  jsonControlContraVoucherPaymentArray: any;

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  AccountsBanksList: any;
  AccountGroupList: any;
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private router: Router,
    private storage: StorageService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private filter: FilterUtils
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.ContraVoucherControl = new ContraVoucherControl("");
    this.jsonControlContraVoucherSummaryArray =
      this.ContraVoucherControl.getContraVoucherSummaryArrayControls();
    this.ContraVoucherSummaryForm = formGroupBuilder(this.fb, [
      this.jsonControlContraVoucherSummaryArray,
    ]);

    this.jsonControlContraVoucherPaymentArray =
      this.ContraVoucherControl.getContraVoucherPaymentArrayControls();
    this.ContraVoucherPaymentForm = formGroupBuilder(this.fb, [
      this.jsonControlContraVoucherPaymentArray,
    ]);
  }
  async OnPaymentModeChange(event) {
    const PaymentModeFieldName = event?.field?.name;
    const PaymentMode = event?.eventArgs?.value;
    const FieldName =
      PaymentModeFieldName == "FromPaymentMode"
        ? "FromChequeOrRefNo"
        : "ToChequeOrRefNo";
    const AccountCode =
      PaymentModeFieldName == "FromPaymentMode"
        ? "FromAccountCode"
        : "ToAccountCode";

    const OppositePaymentMode =
      PaymentModeFieldName == "ToPaymentMode"
        ? "FromPaymentMode"
        : "ToPaymentMode";
    const OppositeChequeOrRefNo =
      PaymentModeFieldName == "ToPaymentMode"
        ? "FromChequeOrRefNo"
        : "ToChequeOrRefNo";
    const OppositeAccountCode =
      PaymentModeFieldName == "ToPaymentMode"
        ? "FromAccountCode"
        : "ToAccountCode";
    switch (PaymentMode) {
      case "Bank":
        const BanksList = await GetBankDetailFromApi(
          this.masterService,
          this.storage.branch
        );
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", this.storage.branch)
        this.filter.Filter(
          this.jsonControlContraVoucherPaymentArray,
          this.ContraVoucherPaymentForm,
          BanksList,
          AccountCode,
          false
        );

        const ChequeOrRefNo = this.ContraVoucherPaymentForm.get(FieldName);
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH",
          this.storage.branch
        );
        this.filter.Filter(
          this.jsonControlContraVoucherPaymentArray,
          this.ContraVoucherPaymentForm,
          responseFromAPICash,
          AccountCode,
          false
        );

        const Bank = this.ContraVoucherPaymentForm.get(FieldName);
        Bank.setValue("");
        Bank.clearValidators();
        Bank.updateValueAndValidity();

        break;
    }

    const ResetRequest = {
      PaymentMode: OppositePaymentMode,
      ChequeOrRefNo: OppositeChequeOrRefNo,
      AccountCode: OppositeAccountCode,
    };

    this.ResetPaymentData(ResetRequest);
  }

  ResetPaymentData(ResetRequest) {
    const form = this.ContraVoucherPaymentForm;
    const FromPaymentMode = form.get("FromPaymentMode");
    const ToPaymentMode = form.get("ToPaymentMode");

    if (FromPaymentMode.value == ToPaymentMode.value) {
      for (const controlKey in ResetRequest) {
        if (ResetRequest.hasOwnProperty(controlKey)) {
          const controlName = ResetRequest[controlKey];
          const control = form.get(controlName);
          if (control) {
            control.setValue("");
            control.updateValueAndValidity();
          }
        }
      }
    }
  }
  onChangeAmount(event) {
    const fieldName = event?.field?.name;
    const fieldValue = this.ContraVoucherPaymentForm.get(fieldName).value;

    const resetFields = (field1, field2, value, toAmount) => {
      this.ContraVoucherPaymentForm.get(field1).setValue(0);
      this.ContraVoucherPaymentForm.get(field1).updateValueAndValidity();

      this.ContraVoucherPaymentForm.get(field2).setValue(value);
      this.ContraVoucherPaymentForm.get(field2).updateValueAndValidity();

      this.ContraVoucherPaymentForm.get(toAmount).setValue(0);
      this.ContraVoucherPaymentForm.get(toAmount).updateValueAndValidity();
    };

    if (fieldName === "FromDebitAmount") {
      resetFields("FromCreditAmount", "ToCreditAmount", fieldValue, 'ToDebitAmount');
    }

    if (fieldName === "FromCreditAmount") {
      resetFields("FromDebitAmount", "ToDebitAmount", fieldValue, 'ToCreditAmount');
    }
  }

  Submit() {
    const FromDebitAmount = parseFloat(this.ContraVoucherPaymentForm.get("FromDebitAmount").value || 0);
    const FromCreditAmount = parseFloat(this.ContraVoucherPaymentForm.get("FromCreditAmount").value || 0);
    const ToDebitAmount = parseFloat(this.ContraVoucherPaymentForm.get("ToDebitAmount").value || 0);
    const ToCreditAmount = parseFloat(this.ContraVoucherPaymentForm.get("ToCreditAmount").value || 0);

    if (FromDebitAmount == 0 && FromCreditAmount == 0 && ToDebitAmount == 0 && ToCreditAmount == 0) {
      this.snackBarUtilityService.ShowCommonSwal("info", "Please Enter Amount for Debit or Credit");
      return;
    }

    if (
      FromDebitAmount == FromCreditAmount
    ) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Debit and Credit Amount Should be Equal"
      );
    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {

          const form = this.ContraVoucherPaymentForm;

          const setAccountCode = (paymentModeControl, accountCodeControl) => {
            if (paymentModeControl.value === "Bank") {
              const bankDetails: any = form.get(accountCodeControl).value;
              const accountDetails = this.AccountsBanksList.find(item => item.bANCD === bankDetails?.value && item.bANM === bankDetails?.name);

              if (accountDetails) {
                const ledgerData = {
                  name: accountDetails?.aCNM,
                  value: accountDetails?.aCCD,
                  mRPNM: accountDetails?.mRPNM
                };

                form.get(accountCodeControl).setValue(ledgerData);
              } else {
                this.snackBarUtilityService.ShowCommonSwal("error", "Please select a valid Bank that is mapped with the Account Master");
                return false;
              }
            }
            return true;
          };

          if (!setAccountCode(form.get("FromPaymentMode"), "FromAccountCode")) {
            return;
          }

          if (!setAccountCode(form.get("ToPaymentMode"), "ToAccountCode")) {
            return;
          }



          const totalPaymentAmount = FromCreditAmount + FromDebitAmount;

          this.VoucherRequestModel.companyCode = this.storage.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch = this.storage.branch;
          this.VoucherRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.voucherNo = "";
          this.VoucherDataRequestModel.transCode = VoucherInstanceType.ContraVoucherCreation;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.ContraVoucherCreation];
          this.VoucherDataRequestModel.voucherCode = VoucherType.ContraVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.ContraVoucher];
          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch = this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation = this.storage.branch;
          this.VoucherDataRequestModel.preperedFor =
            this.ContraVoucherSummaryForm.value.Preparedfor;
          this.VoucherDataRequestModel.partyCode = undefined;
          this.VoucherDataRequestModel.partyName = undefined;
          this.VoucherDataRequestModel.partyState = undefined;
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
          this.VoucherDataRequestModel.entryDate = new Date();
          this.VoucherDataRequestModel.panNo = undefined;

          this.VoucherDataRequestModel.tdsSectionCode = undefined;
          this.VoucherDataRequestModel.tdsSectionName = undefined;
          this.VoucherDataRequestModel.tdsRate = 0;
          this.VoucherDataRequestModel.tdsAmount = 0;
          this.VoucherDataRequestModel.tdsAtlineitem = false;
          this.VoucherDataRequestModel.tcsSectionCode = undefined;
          this.VoucherDataRequestModel.tcsSectionName = undefined;
          this.VoucherDataRequestModel.tcsRate = 0;
          this.VoucherDataRequestModel.tcsAmount = 0;

          this.VoucherDataRequestModel.IGST = 0;
          this.VoucherDataRequestModel.SGST = 0;
          this.VoucherDataRequestModel.CGST = 0;
          this.VoucherDataRequestModel.UGST = 0;
          this.VoucherDataRequestModel.GSTTotal = 0;

          this.VoucherDataRequestModel.GrossAmount = totalPaymentAmount;
          this.VoucherDataRequestModel.netPayable = totalPaymentAmount;
          this.VoucherDataRequestModel.roundOff = 0;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode = undefined;
          this.VoucherDataRequestModel.refNo = undefined;
          this.VoucherDataRequestModel.accountName = undefined;
          this.VoucherDataRequestModel.accountCode = undefined;
          this.VoucherDataRequestModel.date = undefined;
          this.VoucherDataRequestModel.scanSupportingDocument = "";

          this.VoucherDataRequestModel.mANNUM =
            this.ContraVoucherSummaryForm.get("ManualNumber").value;
          this.VoucherDataRequestModel.mREFNUM =
            this.ContraVoucherSummaryForm.get("ReferenceNumber").value;
          this.VoucherDataRequestModel.nAR =
            this.ContraVoucherSummaryForm.get("Narration").value;

          const companyCode = this.storage.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList = [
            {
              companyCode: companyCode,
              voucherNo: "",
              transCode: VoucherInstanceType.ContraVoucherCreation,
              transType: VoucherInstanceType[VoucherInstanceType.ContraVoucherCreation],
              voucherCode: VoucherType.ContraVoucher,
              voucherType: VoucherType[VoucherType.ContraVoucher],
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode:
                this.ContraVoucherPaymentForm.value.FromAccountCode?.value,
              accName:
                this.ContraVoucherPaymentForm.value.FromAccountCode?.name,
              accCategory: this.ContraVoucherPaymentForm.value.FromAccountCode?.mRPNM,
              sacCode: "",
              sacName: "",
              debit: FromDebitAmount,
              credit: FromCreditAmount,
              GSTRate: 0,
              GSTAmount: 0,
              Total: FromDebitAmount + FromCreditAmount,
              TDSApplicable: false,
              narration: this.ContraVoucherPaymentForm.value.FromAccountCode?.name,
              PaymentMode: this.ContraVoucherPaymentForm.value.FromPaymentMode,
            },
            {
              companyCode: companyCode,
              voucherNo: "",
              transCode: VoucherInstanceType.ContraVoucherCreation,
              transType: VoucherInstanceType[VoucherInstanceType.ContraVoucherCreation],
              voucherCode: VoucherType.ContraVoucher,
              voucherType: VoucherType[VoucherType.ContraVoucher],
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: this.ContraVoucherPaymentForm.value.ToAccountCode?.value,
              accName: this.ContraVoucherPaymentForm.value.ToAccountCode?.name,
              sacCode: "",
              sacName: "",
              accCategory: this.ContraVoucherPaymentForm.value.ToAccountCode?.mRPNM,
              debit: ToDebitAmount,
              credit: ToCreditAmount,
              GSTRate: 0,
              GSTAmount: 0,
              Total: ToDebitAmount + ToCreditAmount,
              TDSApplicable: false,
              narration: this.ContraVoucherPaymentForm.value.ToAccountCode?.name,
              PaymentMode: this.ContraVoucherPaymentForm.value.ToPaymentMode,
            },
          ];

          this.VoucherRequestModel.details = VoucherlineitemList;
          this.VoucherRequestModel.data =
            this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(
            this.voucherServicesService.FinancePost(
              "fin/account/voucherentry",
              this.VoucherRequestModel
            )
          )
            .then((res: any) => {
              if (res.success) {
                var CreditData = VoucherlineitemList.filter(item => item.debit == 0.00).map(function (item) {
                  return {
                    "accCode": `${item.accCode}`,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ? item.narration : item.accName,
                  };
                })
                var DebitData = VoucherlineitemList.filter(item => item.credit == 0.00).map(function (item) {
                  return {
                    "accCode": `${item.accCode}`,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ? item.narration : item.accName,
                  };
                })
                let reqBody = {
                  companyCode: this.storage.companyCode,
                  voucherNo: res?.data?.mainData?.ops[0].vNO,
                  transDate: Date(),
                  finYear: financialYear,
                  branch: this.storage.branch,
                  transCode: VoucherInstanceType.ContraVoucherCreation,
                  transType: VoucherInstanceType[VoucherInstanceType.ContraVoucherCreation],
                  voucherCode: VoucherType.ContraVoucher,
                  voucherType: VoucherType[VoucherType.ContraVoucher],
                  docType: "Voucher",
                  partyType: this.ContraVoucherSummaryForm.value.Preparedfor,
                  docNo: "",
                  partyCode: "",
                  partyName: "",
                  entryBy: this.storage.userName,
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
                        title: "Contra Voucher Created Successfully",
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

              }
            })
            .catch((error) => {
              this.snackBarUtilityService.ShowCommonSwal("error", error);
            })
            .finally(() => { });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error.message);
        }
      }, "Contra Voucher Generating..!");
    }
  }
  cancel(tabIndex: string): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
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
