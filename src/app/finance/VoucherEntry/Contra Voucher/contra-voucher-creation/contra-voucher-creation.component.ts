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
} from "src/app/finance/credit-debit-voucher/debitvoucherAPIUtitlity";
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
        const responseFromAPIBank = await GetBankDetailFromApi(
          this.masterService,
          this.storage.branch
        );
        this.filter.Filter(
          this.jsonControlContraVoucherPaymentArray,
          this.ContraVoucherPaymentForm,
          responseFromAPIBank,
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
    const FromDebitAmount =
      this.ContraVoucherPaymentForm.get("FromDebitAmount").value || 0;
    const FromCreditAmount =
      this.ContraVoucherPaymentForm.get("FromCreditAmount").value || 0;
    const ToDebitAmount =
      this.ContraVoucherPaymentForm.get("ToDebitAmount").value || 0;
    const ToCreditAmount =
      this.ContraVoucherPaymentForm.get("ToCreditAmount").value || 0;

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
          const totalPaymentAmount =
            parseFloat(FromCreditAmount) + parseFloat(FromDebitAmount);

          this.VoucherRequestModel.companyCode = this.storage.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch = this.storage.branch;
          this.VoucherRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.voucherNo = "";
          this.VoucherDataRequestModel.transType = "Contra Voucher";
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

          this.VoucherDataRequestModel.GrossAmount = parseFloat(
            totalPaymentAmount.toFixed(2)
          );
          this.VoucherDataRequestModel.netPayable = parseFloat(
            totalPaymentAmount.toFixed(2)
          );
          this.VoucherDataRequestModel.roundOff = 0;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode = undefined;
          this.VoucherDataRequestModel.refNo = undefined;
          this.VoucherDataRequestModel.accountName = undefined;
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
              transType: "Contra Voucher",
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode:
                this.ContraVoucherPaymentForm.value.FromAccountCode?.value,
              accName:
                this.ContraVoucherPaymentForm.value.FromAccountCode?.name,
              sacCode: "",
              sacName: "",
              debit: parseFloat(FromDebitAmount).toFixed(2),
              credit: parseFloat(FromCreditAmount).toFixed(2),
              GSTRate: 0,
              GSTAmount: 0,
              Total: parseFloat(FromDebitAmount).toFixed(2) + parseFloat(FromCreditAmount).toFixed(2),
              TDSApplicable: false,
              narration: "",
              PaymentMode: this.ContraVoucherPaymentForm.value.FromPaymentMode,
            },
            {
              companyCode: companyCode,
              voucherNo: "",
              transType: "Contra Voucher",
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: this.ContraVoucherPaymentForm.value.ToAccountCode?.value,
              accName: this.ContraVoucherPaymentForm.value.ToAccountCode?.name,
              sacCode: "",
              sacName: "",
              debit: ToDebitAmount,
              credit: ToCreditAmount,
              GSTRate: 0,
              GSTAmount: 0,
              Total: ToDebitAmount + ToCreditAmount,
              TDSApplicable: false,
              narration: "",
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
                Swal.fire({
                  icon: "success",
                  title: "Contra Voucher Created Successfully",
                  text: "Voucher No: " + res?.data?.mainData?.ops[0].vNO,
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.hideLoading();
                    setTimeout(() => {
                      Swal.close();
                    }, 2000);
                    this.navigationService.navigateTotab(
                      "Voucher",
                      "dashboard/Index"
                    );
                  }
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
