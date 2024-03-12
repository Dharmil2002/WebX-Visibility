import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { ChequeRegisterService } from 'src/app/Utility/module/reports/cheque-register.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { exportAsExcelFile } from 'src/app/Utility/module/reports/vendor-gst-invoice';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GetAccountDetailFromApi } from 'src/app/finance/Debit Voucher/debitvoucherAPIUtitlity';
import { ChequeRegister } from 'src/assets/FormControls/Reports/Cheque-Register/cheque-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cheque-register',
  templateUrl: './cheque-register.component.html'
})
export class ChequeRegisterComponent implements OnInit {
  ChequeRegisterFormControls: ChequeRegister;
  jsonControlArray: any;
  breadScrums = [
    {
      title: "Cheque Register Report",
      items: ["Report"],
      active: "Cheque Register Report",
    },
  ];
  chequeRegisterForm: UntypedFormGroup;
  protected _onDestroy = new Subject<void>();
  CSVHeader = {
    ChequeNo: "Cheque No",
    ChequeDate: "Cheque Date",
    ChequeEntryDate: "Cheque Entry Date",
    Amount: "Amount",
    IssuedFromBank: "Issued From Bank",
    IssuedToVendor: "Issued To Vendor/Party",
    IssuedAtLocation: "Issued At Location",
    TransactionDocumentNo: "Transaction Document No",
    TransactionDocumentDate: "Transaction Document Date",
    TransactionType: "Transaction Type",
    ChequeStatus: "Cheque Status",
    OnAccount: "On Account",
    UsedAmount: "Used Amount",
    EnteredBy: "Entered By"
  }
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private vendorService: VendorService,
    private locationService: LocationService,
    private storage: StorageService,
    private customerService: CustomerService,
    private snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private chequeRegisterService: ChequeRegisterService
  ) { }


  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.chequeRegisterForm.controls["start"].setValue(lastweek);
    this.chequeRegisterForm.controls["end"].setValue(now);
    this.getDropdownlist();
  }
  //#region to initialize form control
  initializeFormControl() {
    const controls = new ChequeRegister();
    this.jsonControlArray = controls.chequeRegisterControlArray;

    // Build the form using formGroupBuilder
    this.chequeRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  //#region to export data in csv file
  save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        console.log(this.chequeRegisterForm.value);

        let ReportingBranches = [];
        if (this.chequeRegisterForm.value.Individual == "N") {
          ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.chequeRegisterForm.value.branch.name);
          ReportingBranches.push(this.chequeRegisterForm.value.branch.name);
        } else {
          ReportingBranches.push(this.chequeRegisterForm.value.branch.name);
        }

        const startDate = new Date(this.chequeRegisterForm.controls.start.value);
        const endDate = new Date(this.chequeRegisterForm.controls.end.value);

        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();

        const DateType = this.chequeRegisterForm.value.DateType;

        const ChequeType = this.chequeRegisterForm.value.ChequeType;

        const DisplayOnAccount = this.chequeRegisterForm.controls.DisplayOnAccount.value;

        const docummentNo = this.chequeRegisterForm.value.ChequeNo;

        // Check if a comma is present in docNo
        const docNoArray = docummentNo.includes(',') ? docummentNo.split(',') : [docummentNo];

        const customer = Array.isArray(this.chequeRegisterForm.value.custnmcdHandler)
          ? this.chequeRegisterForm.value.custnmcdHandler.map(x => x.value)
          : [];

        const vendor = Array.isArray(this.chequeRegisterForm.value.vendorHandler)
          ? this.chequeRegisterForm.value.vendorHandler.map(x => x.value)
          : [];

        const bank = Array.isArray(this.chequeRegisterForm.value.issuingBankHandler)
          ? this.chequeRegisterForm.value.issuingBankHandler.map(x => x.value)
          : [];

        const branch = ReportingBranches;

        // Amount Search Range
        const Amt = this.chequeRegisterForm.controls.ChequeAmountRange.value.split("-") || 0;
        const startAmt = Amt[0] || '';
        const endAmt = Amt[1] || '';
        console.log(`startAmt=${this.chequeRegisterForm.controls.ChequeAmountRange.value}`, endAmt);

        //  Check if endAmt is less than startAmt
        if (endAmt < startAmt) {
          Swal.fire({
            icon: "error",
            title: "Invalid Amount Range",
            text: "End Amount cannot be less than Start Amount",
            showConfirmButton: true,
          });
          return; // Stop execution further
        }
        const optionalRequest = { docNoArray, startAmt, endAmt }
        const reqBody = { startValue, endValue, branch, bank, customer, vendor, DateType, ChequeType }
        console.log(reqBody);

        const data = await this.chequeRegisterService.getChequeRegister(reqBody, optionalRequest)
        console.log(data);

        if (data.length === 0) {
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 1000);

          if (data) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        // Export the record to Excel
        exportAsExcelFile(data, `Cheque_Register_Report-${timeString}`, this.CSVHeader);

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Cheque Register Report Generating Please Wait..!");
  }
  //#endregion
  //#region to get dropdown data
  async getDropdownlist() {
    try {
      // Fetch bank list asynchronously
      const bankList = await GetAccountDetailFromApi(this.masterService, "BANK", '');

      // Filter issuing bank dropdown
      this.filter.Filter(this.jsonControlArray, this.chequeRegisterForm, bankList, "issuingBank", false);

      // Fetch vendor list asynchronously
      const vendorList = (await this.vendorService.getVendorDetail(""))
        .filter(x => x.isActive)
        .map(x => ({ name: x.vendorName, value: x.vendorCode }));

      // Filter vendor dropdown
      this.filter.Filter(this.jsonControlArray, this.chequeRegisterForm, vendorList, "vendor", true);

      // Fetch branch list asynchronously
      const branchList = await this.locationService.locationFromApi();

      // Find the login branch from the list
      const loginBranch = branchList.find(x => x.name === this.storage.branch);

      // Set the login branch in the form controls
      this.chequeRegisterForm.controls["branch"].setValue(loginBranch);
      this.chequeRegisterForm.controls["Individual"].setValue("Y");

      // Filter branch dropdown
      this.filter.Filter(this.jsonControlArray, this.chequeRegisterForm, branchList, "branch", false);

      // Fetch customer list asynchronously
      const customerList = await this.customerService.customerFromApi();

      // Filter customer dropdown
      this.filter.Filter(this.jsonControlArray, this.chequeRegisterForm, customerList, "customer", true);
    } catch (error) {
      // Handle errors appropriately (e.g., log or show an error message)
      console.error("Error in getDropdownlist:", error);
    }
  }
  //#endregion
  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.chequeRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
}
