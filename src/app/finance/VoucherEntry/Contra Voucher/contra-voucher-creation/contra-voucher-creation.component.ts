import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, from } from 'rxjs';
import { DebitVoucherRequestModel, DebitVoucherDataRequestModel } from 'src/app/Models/Finance/Finance';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GetAccountDetailFromApi, GetBankDetailFromApi } from 'src/app/finance/credit-debit-voucher/debitvoucherAPIUtitlity';
import { ContraVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/ContraVouchercontrol';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contra-voucher-creation',
  templateUrl: './contra-voucher-creation.component.html',
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

  debitVoucherRequestModel = new DebitVoucherRequestModel();
  debitVoucherDataRequestModel = new DebitVoucherDataRequestModel();

  AccountGroupList: any;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private router: Router,
    private storage: StorageService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private filter: FilterUtils,) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.ContraVoucherControl = new ContraVoucherControl("");
    this.jsonControlContraVoucherSummaryArray = this.ContraVoucherControl.getContraVoucherSummaryArrayControls();
    this.ContraVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlContraVoucherSummaryArray]);

    this.jsonControlContraVoucherPaymentArray = this.ContraVoucherControl.getContraVoucherPaymentArrayControls();
    this.ContraVoucherPaymentForm = formGroupBuilder(this.fb, [this.jsonControlContraVoucherPaymentArray]);

  }
  async OnPaymentModeChange(event) {
    const PaymentModeFieldName = event?.field?.name;
    const PaymentMode = event?.eventArgs?.value;
    const FieldName = PaymentModeFieldName == "FromPaymentMode" ? "FromChequeOrRefNo" : "ToChequeOrRefNo";
    const AccountCode = PaymentModeFieldName == "FromPaymentMode" ? "FromAccountCode" : "ToAccountCode";

    const OppositePaymentMode = PaymentModeFieldName == "ToPaymentMode" ? "FromPaymentMode" : "ToPaymentMode";
    const OppositeChequeOrRefNo = PaymentModeFieldName == "ToPaymentMode" ? "FromChequeOrRefNo" : "ToChequeOrRefNo";
    const OppositeAccountCode = PaymentModeFieldName == "ToPaymentMode" ? "FromAccountCode" : "ToAccountCode";
    switch (PaymentMode) {
      case 'Bank':
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, this.storage.branch)
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
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", this.storage.branch)
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
      AccountCode: OppositeAccountCode
    }

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



  Submit() {
    console.log(this.ContraVoucherSummaryForm.value);
    console.log(this.ContraVoucherPaymentForm.value);

    const FromDebitAmount = this.ContraVoucherPaymentForm.get("FromDebitAmount").value;
    const FromCreditAmount = this.ContraVoucherPaymentForm.get("FromCreditAmount").value;
    const ToDebitAmount = this.ContraVoucherPaymentForm.get("ToDebitAmount").value;
    const ToCreditAmount = this.ContraVoucherPaymentForm.get("ToCreditAmount").value;

    if (FromDebitAmount != FromCreditAmount || ToDebitAmount != ToCreditAmount) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Debit and Credit Amount Should be Equal"
      );
    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          const totalPaymentAmount = (
            parseFloat(FromCreditAmount) +
            parseFloat(ToCreditAmount)
          );

          this.debitVoucherRequestModel.companyCode = this.storage.companyCode;
          this.debitVoucherRequestModel.docType = "VR";
          this.debitVoucherRequestModel.branch = this.storage.branch;
          this.debitVoucherRequestModel.finYear = financialYear;

          this.debitVoucherDataRequestModel.voucherNo = "";
          this.debitVoucherDataRequestModel.transType = "Contra Voucher";
          this.debitVoucherDataRequestModel.transDate = new Date();
          this.debitVoucherDataRequestModel.docType = "VR";
          this.debitVoucherDataRequestModel.branch = this.storage.branch;
          this.debitVoucherDataRequestModel.finYear = financialYear;

          this.debitVoucherDataRequestModel.accLocation = this.storage.branch;
          this.debitVoucherDataRequestModel.preperedFor = this.ContraVoucherSummaryForm.value.Preparedfor;
          this.debitVoucherDataRequestModel.partyCode = undefined;
          this.debitVoucherDataRequestModel.partyName = undefined;
          this.debitVoucherDataRequestModel.partyState = undefined;
          this.debitVoucherDataRequestModel.entryBy = this.storage.userName;
          this.debitVoucherDataRequestModel.entryDate = new Date();
          this.debitVoucherDataRequestModel.panNo = undefined

          this.debitVoucherDataRequestModel.tdsSectionCode = undefined
          this.debitVoucherDataRequestModel.tdsSectionName = undefined
          this.debitVoucherDataRequestModel.tdsRate = 0;
          this.debitVoucherDataRequestModel.tdsAmount = 0;
          this.debitVoucherDataRequestModel.tdsAtlineitem = false;
          this.debitVoucherDataRequestModel.tcsSectionCode = undefined
          this.debitVoucherDataRequestModel.tcsSectionName = undefined
          this.debitVoucherDataRequestModel.tcsRate = 0;
          this.debitVoucherDataRequestModel.tcsAmount = 0;

          this.debitVoucherDataRequestModel.IGST = 0;
          this.debitVoucherDataRequestModel.SGST = 0;
          this.debitVoucherDataRequestModel.CGST = 0;
          this.debitVoucherDataRequestModel.UGST = 0;
          this.debitVoucherDataRequestModel.GSTTotal = 0;

          this.debitVoucherDataRequestModel.paymentAmt = parseFloat(totalPaymentAmount.toFixed(2));
          this.debitVoucherDataRequestModel.netPayable = parseFloat(totalPaymentAmount.toFixed(2));
          this.debitVoucherDataRequestModel.roundOff = 0;
          this.debitVoucherDataRequestModel.voucherCanceled = false;

          this.debitVoucherDataRequestModel.paymentMode = undefined;
          this.debitVoucherDataRequestModel.refNo = undefined;
          this.debitVoucherDataRequestModel.accountName = undefined;
          this.debitVoucherDataRequestModel.date = undefined;
          this.debitVoucherDataRequestModel.scanSupportingDocument = "";
          this.debitVoucherDataRequestModel.paymentAmount = parseFloat(totalPaymentAmount.toFixed(2));

          const companyCode = this.storage.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList =
            [{
              companyCode: companyCode,
              voucherNo: "",
              transType: "Contra Voucher",
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: this.ContraVoucherPaymentForm.value.FromAccountCode?.value,
              accName: this.ContraVoucherPaymentForm.value.FromAccountCode?.name,
              sacCode: "",
              sacName: "",
              debit: parseFloat(FromDebitAmount).toFixed(2),
              credit: parseFloat(FromCreditAmount).toFixed(2),
              GSTRate: 0,
              GSTAmount: 0,
              Total: parseFloat(FromDebitAmount).toFixed(2),
              TDSApplicable: false,
              narration: ""
            }, {
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
              Total: ToDebitAmount,
              TDSApplicable: false,
              narration: ""
            }];



          this.debitVoucherRequestModel.details = VoucherlineitemList;
          this.debitVoucherRequestModel.data = this.debitVoucherDataRequestModel;
          this.debitVoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(this.voucherServicesService
            .FinancePost("fin/account/voucherentry", this.debitVoucherRequestModel)).then((res: any) => {
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
                    this.navigationService.navigateTotab("Voucher", "dashboard/Index");
                  }
                });
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
      }, "Contra Voucher Generating..!");
    }
  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
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
