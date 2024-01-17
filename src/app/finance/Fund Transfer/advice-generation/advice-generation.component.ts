import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { AdviceGenerationControl } from "src/assets/FormControls/Finance/AdviceGeneration/advicegenerationcontrol";
import { GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi } from "../../credit-debit-voucher/debitvoucherAPIUtitlity";
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
  action: string;
  breadScrums = [{}];
  isUpdate = false;
  updateData: any;
  AllLocationsList: any;
  constructor(private fb: UntypedFormBuilder, private router: Router,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService, private storage: StorageService, private filter: FilterUtils, private route: Router, private masterService: MasterService,) {
    const extrasState = this.route.getCurrentNavigation()?.extras?.state;
    this.updateData = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.isUpdate = false;
    this.action = extrasState ? "edit" : "add";
    if (this.action === "edit") {
      this.isUpdate = true;
      this.submit = "Modify";
      this.breadScrums = [
        {
          title: "Modify AdviceGeneration",
          items: ["Finance"],
          active: "Modify AdviceGeneration",
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
    this.AdviceFormControls = new AdviceGenerationControl("");
    this.jsonControlAdviceGenerationArray = this.AdviceFormControls.getFormControls();
    this.AdviceTableForm = formGroupBuilder(this.fb, [this.jsonControlAdviceGenerationArray,]);

    this.jsonControlAdvicePaymentGenerationArray = this.AdviceFormControls.getPaymentFormControls();
    this.AlljsonControlAdvicePaymentGenerationArray = this.jsonControlAdvicePaymentGenerationArray
    this.AdvicePaymentForm = formGroupBuilder(this.fb, [this.jsonControlAdvicePaymentGenerationArray,]);

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
  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {

    const PaymentMode = this.AdvicePaymentForm.get("PaymentMode").value;
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

  GenerateAdvice() {



    this.snackBarUtilityService.commonToast(async () => {
      try {
        const AccountDetails = this.AdvicePaymentForm.value.PaymentMode == "Cash" ? this.AdvicePaymentForm.value.CashAccount : this.AdvicePaymentForm.value.Bank;
        const AdviceGeneration: AdviceGeneration = {
          companyCode: this.storage.companyCode,
          docType: "ADVICE",
          branch: this.storage.branch,
          finYear: financialYear,
          data: {
            docNo: this.isUpdate ? this.updateData?.docNo : "",
            aDTYP: this.AdviceTableForm.value.AdviceType,
            aDDT: this.AdviceTableForm.value.adviceDate,
            rBRANCH: this.AdviceTableForm.value.raisedonBranch?.name,
            rEASION: this.AdviceTableForm.value.reasonforAdvice,
            aMT: this.AdviceTableForm.value.applicableAmount,
            pMODE: this.AdvicePaymentForm.value.PaymentMode,
            cHEQREF: this.AdvicePaymentForm.value.ChequeOrRefNo,
            aCCD: AccountDetails?.name,
            aCNM: AccountDetails?.value,
            aDT: this.AdvicePaymentForm.value.Date,
            sTCD: this.isUpdate == true ? 2 : 1,
            sTNM: this.isUpdate == true ? "Acknowledge" : "Generated",
            dACCD: "",
            dACNM: "",
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }
        }
        await
          firstValueFrom(this.voucherServicesService
            .FinancePost(`finance/bill/Advice/create`, AdviceGeneration)).then((res: any) => {
              if (res.success) {

                Swal.fire({
                  icon: "success",
                  title: `Advice ${this.isUpdate ? 'Updated' : 'Generated'} Successfully`,
                  text: "Advice No: " + res?.data.ops[0].docNo,
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.hideLoading();
                    setTimeout(() => {
                      Swal.close();
                      this.router.navigate(['/dashboard/Index'], { queryParams: { tab: 0 }, state: [] });
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
