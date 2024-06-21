import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
// import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { VendorBalancePaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorbalancepaymentcontrol";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { GetAccountDetailFromApi } from "../../VendorPaymentAPIUtitlity";
import { GetBankDetailFromApi } from "src/app/finance/Debit Voucher/debitvoucherAPIUtitlity";

@Component({
  selector: "app-blance-payment-popup",
  templateUrl: "./blance-payment-popup.component.html",
})
export class BlancePaymentPopupComponent implements OnInit {
  vendorBalancePaymentControl: any;
  jsonControlVendorBalancePaymentFilterArray: any;
  VendorBalancePaymentFilterForm: any;
  AlljsonControlVendorBalancePaymentFilterArray: any;
  imageData: any;

  constructor(
    public dialogRef: MatDialogRef<BlancePaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private objImageHandling: ImageHandling,
    private matDialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  save(event) {
    this.dialogRef.close(this.VendorBalancePaymentFilterForm.value);
  }

  initializeFormControl(): void {
    let RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
      Numberofvehiclesregistered: "20",
    };
    this.vendorBalancePaymentControl = new VendorBalancePaymentControl(
      RequestObj
    );
    this.jsonControlVendorBalancePaymentFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationPaymentDetailsArrayControls();
    this.AlljsonControlVendorBalancePaymentFilterArray =
      this.jsonControlVendorBalancePaymentFilterArray;
    this.VendorBalancePaymentFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalancePaymentFilterArray,
    ]);
    this.jsonControlVendorBalancePaymentFilterArray =
      this.jsonControlVendorBalancePaymentFilterArray.slice(0, 1);

    // this.bindDropDwon();
  }

  async OnPaymentModeChange(event) {
    const PaymentMode =
      this.VendorBalancePaymentFilterForm.get("PaymentMode").value;
    let filterFunction;
    switch (PaymentMode) {
      case "Cheque":
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "JournalAccount";
        break;
      case "Cash":
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank" && x.name !== "JournalAccount";
        break;
      case "RTGS/UTR":
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "JournalAccount";
        break;
      case "Journal":
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "Bank" && x.name !== "ChequeOrRefNo";
        break;
    }
    this.jsonControlVendorBalancePaymentFilterArray =
      this.AlljsonControlVendorBalancePaymentFilterArray.filter(filterFunction);
    const Accountinglocation =
      this.VendorBalancePaymentFilterForm.value.Accountinglocation?.name;
    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlVendorBalancePaymentFilterArray,
          this.VendorBalancePaymentFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.VendorBalancePaymentFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo =
          this.VendorBalancePaymentFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const ChequeOrRefDate =
          this.VendorBalancePaymentFilterForm.get("Date");
        ChequeOrRefDate.setValidators([Validators.required]);
        ChequeOrRefDate.updateValueAndValidity();

        const CashAccount =
          this.VendorBalancePaymentFilterForm.get("CashAccount");
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        // Remove Journal Account
        const JournalAccount = this.VendorBalancePaymentFilterForm.get("JournalAccount");
        JournalAccount.setValue("");
        JournalAccount.clearValidators();
        JournalAccount.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonControlVendorBalancePaymentFilterArray,
          this.VendorBalancePaymentFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS =
          this.VendorBalancePaymentFilterForm.get("CashAccount");
        CashAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.VendorBalancePaymentFilterForm.get("Bank");
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS =
          this.VendorBalancePaymentFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        // Remove Journal Account
        const JournalAccounts = this.VendorBalancePaymentFilterForm.get("JournalAccount");
        JournalAccounts.setValue("");
        JournalAccounts.clearValidators();
        JournalAccounts.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        break;
      case "Journal":
        const responseFromAPIJournal = await GetAccountDetailFromApi(
          this.masterService);
        this.filter.Filter(
          this.jsonControlVendorBalancePaymentFilterArray,
          this.VendorBalancePaymentFilterForm,
          responseFromAPIJournal,
          "JournalAccount",
          false
        );

        const JournalAccountS = this.VendorBalancePaymentFilterForm.get("JournalAccount");
        JournalAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        JournalAccountS.updateValueAndValidity();

        const BankSS = this.VendorBalancePaymentFilterForm.get("Bank");
        BankSS.setValue("");
        BankSS.clearValidators();
        BankSS.updateValueAndValidity();

        const ChequeOrRefNoSS =
          this.VendorBalancePaymentFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoSS.setValue("");
        ChequeOrRefNoSS.clearValidators();
        ChequeOrRefNoSS.updateValueAndValidity();

        const CashAccountSS = this.VendorBalancePaymentFilterForm.get("CashAccount");
        CashAccountSS.setValue("");
        CashAccountSS.clearValidators();
        CashAccountSS.updateValueAndValidity();
        break;
    }
  }
  async selectFileScanDocument(data) {
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "ScanSupportingdocument", this.
      VendorBalancePaymentFilterForm, this.imageData, "Voucher", 'Finance', this.jsonControlVendorBalancePaymentFilterArray,
      ["jpg", "png", "jpeg", "pdf"]);

  }
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.matDialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }

  close() {
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close();
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
}
