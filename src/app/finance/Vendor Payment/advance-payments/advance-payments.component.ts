import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Subject, firstValueFrom } from "rxjs";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { VendorPaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol";
import { THCAmountsDetailComponent } from "../Modal/thcamounts-detail/thcamounts-detail.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
  GetAccountDetailFromApi,
  GetAdvancePaymentListFromApi,
  GetLocationDetailFromApi,
  GetSingleVendorDetailsFromApi,
} from "../VendorPaymentAPIUtitlity";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import {
  VoucherDataRequestModel,
  VoucherInstanceType,
  VoucherRequestModel,
  VoucherType,
} from "src/app/Models/Finance/Finance";
import { financialYear } from "src/app/Utility/date/date-utils";
import Swal from "sweetalert2";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { VendorBillService } from "../../Vendor Bills/vendor-bill.service";
import { StorageService } from "src/app/core/service/storage.service";
import { VendorsVehicleDetailComponent } from "../Modal/vendors-vehicle-detail/vendors-vehicle-detail.component";
import { BeneficiaryDetailComponent } from "../../Vendor Bills/beneficiary-detail/beneficiary-detail.component";
@Component({
  selector: "app-advance-payments",
  templateUrl: "./advance-payments.component.html",
})
export class AdvancePaymentsComponent implements OnInit {
  breadScrums = [
    {
      title: "Advance Payments",
      items: ["Home"],
      active: "Advance Payments",
    },
  ];
  linkArray = [];
  menuItems = [];

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
    THC: {
      Title: "THC",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "BalanceUnbilledFunction",
    },
    GenerationDate: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    VehicleNumber: {
      Title: "Vehicle No.",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    THCamount: {
      Title: "THC Amount ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "THCAmountFunction",
    },
    Advance: {
      Title: "Advance ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    // AdvancePending: {
    //   Title: "Advance Pending ⟨₹⟩",
    //   class: "matcolumncenter",
    //   Style: "min-width:15%",
    // },
  };
  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["GenerationDate", "VehicleNumber", "Advance"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData;
  AllLocationsList: any;
  isTableLode = false;

  vendorPaymentControl: VendorPaymentControl;
  protected _onDestroy = new Subject<void>();

  PayableSummaryFilterForm: UntypedFormGroup;
  jsonControlPayableSummaryFilterArray: any;

  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonControlPaymentSummaryFilterArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;

  PaymentHeaderFilterForm: UntypedFormGroup;
  jsonControlPaymentHeaderFilterArray: any;

  TotalAmountList: { count: any; title: string; class: string }[];
  PaymentData;
  VendorDetails;

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(
    private filter: FilterUtils,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private route: Router,
    private objVendorBillService: VendorBillService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private matDialog: MatDialog,
    private storage: StorageService,
  ) {
    // Retrieve the passed data from the state

    this.PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;

    if (this.PaymentData) {
      this.GetAdvancePaymentList();
    } else {
      this.RedirectToTHCPayment();
    }
  }
  RedirectToTHCPayment() {
    this.route.navigate(["/Finance/VendorPayment/THC-Payment"]);
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.TotalAmountList = [
      {
        count: "00",
        title: "Total THC Amount",
        class: `color-Success-light`,
      },
      {
        count: "00",
        title: "Total Advance",
        class: `color-Success-light`,
      },
    ];
    this.GetVendorInformation();
    this.SetMastersData();
  }
  async GetVendorInformation() {
    this.VendorDetails = await GetSingleVendorDetailsFromApi(
      this.masterService,
      this.PaymentData?.VendorInfo?.cD
    );
    // Set Existing Vendor Data 

    this.PaymentHeaderFilterForm.get("VendorPANNumber").setValue(
      this.PaymentData?.VendorInfo?.pAN
    );
    this.getVendorsVehicles(false);

  }
  async GetAdvancePaymentList() {
    this.isTableLode = false;
    const Filters = {
      PaymentType: "Advance",
      StartDate: this.PaymentData?.StartDate,
      EndDate: this.PaymentData?.EndDate,
      VendorInfo: this.PaymentData?.VendorInfo,
    };
    const GetAdvancePaymentData = await GetAdvancePaymentListFromApi(
      this.masterService,
      Filters
    );
    this.tableData = GetAdvancePaymentData.map((x) => {
      return {
        isSelected: false,
        ...x,
      };
    });
    this.isTableLode = true;
    this.selectCheckBox()
  }
  async SetMastersData() {
    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService);
    this.filter.Filter(
      this.jsonControlPayableSummaryFilterArray,
      this.PayableSummaryFilterForm,
      this.AllLocationsList,
      "BalancePaymentlocation",
      false
    );

    const paymentstate = this.AllLocationsList.find(
      (item) => item.name == this.storage.branch
    );
    this.PayableSummaryFilterForm.get("BalancePaymentlocation").setValue(
      paymentstate
    );
  }
  initializeFormControl(): void {
    this.vendorPaymentControl = new VendorPaymentControl("");
    this.jsonControlPayableSummaryFilterArray =
      this.vendorPaymentControl.getTPayableSummaryFilterArrayControls();
    this.PayableSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPayableSummaryFilterArray,
    ]);

    this.jsonControlPaymentSummaryFilterArray =
      this.vendorPaymentControl.getTPaymentSummaryFilterArrayControls();
    this.AlljsonControlPaymentSummaryFilterArray =
      this.jsonControlPaymentSummaryFilterArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentSummaryFilterArray,
    ]);
    this.jsonControlPaymentSummaryFilterArray =
      this.jsonControlPaymentSummaryFilterArray.slice(0, 1);

    this.jsonControlPaymentHeaderFilterArray =
      this.vendorPaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentHeaderFilterArray,
    ]);
  }

  AdvancePendingFunction(event) {
    console.log("AdvancePendingFunction", event);
  }

  BalanceUnbilledFunction(event) {
    console.log("BalanceUnbilledFunction", event);
    const templateBody = {
      DocNo: event.data.THC,
      templateName: "THC View-Print",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1500,height=800");
  }

  THCAmountFunction(event) {
    const RequestBody = {
      BillPaymentData: this.PaymentData,
      THCData: event?.data,
      Type: "Advance",
    };
    const dialogRef = this.matDialog.open(THCAmountsDetailComponent, {
      data: RequestBody,
      width: "90%",
      height: "95%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (result.success) {
          this.GetAdvancePaymentList();
        }
      }
    });
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
  selectCheckBox() {
    const selectedData = this.tableData.filter((x) => x.isSelected);

    const totalTHCAmount = selectedData.reduce(
      (total, item) => total + parseInt(item.THCamount),
      0
    );
    const totalAdvance = selectedData.reduce(
      (total, item) => total + parseInt(item.Advance),
      0
    );

    this.TotalAmountList.forEach((x) => {
      if (x.title === "Total THC Amount") {
        x.count = totalTHCAmount.toFixed(2);
      }
      if (x.title === "Total Advance") {
        x.count = totalAdvance.toFixed(2);
      }
    });

    this.PayableSummaryFilterForm.get("TotalTHCAmount").setValue(
      totalTHCAmount.toFixed(2)
    );
    this.PayableSummaryFilterForm.get("AdvanceAmount").setValue(
      totalAdvance.toFixed(2)
    );
    this.PayableSummaryFilterForm.get("BalancePayable").setValue(
      (totalTHCAmount - totalAdvance).toFixed(2)
    );
  }
  // Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
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

    this.jsonControlPaymentSummaryFilterArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation =
      this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name;
    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetAccountDetailFromApi(
          this.masterService,
          "BANK",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
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
          "CASH",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
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
  Submit() {
    if (this.tableData.filter(x => x.isSelected).length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Select Atleast One THC"
      );
    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {

          const GrossAmount = parseFloat(
            this.PayableSummaryFilterForm.get("TotalTHCAmount").value
          );
          const NetPayable = parseFloat(
            this.PayableSummaryFilterForm.get("BalancePayable").value
          );

          this.VoucherRequestModel.companyCode = this.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch =
            this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name;
          this.VoucherRequestModel.finYear = financialYear;

          // this.VoucherDataRequestModel.companyCode = this.companyCode;
          this.VoucherDataRequestModel.voucherNo = "";
          this.VoucherDataRequestModel.transCode = VoucherInstanceType.AdvancePayment;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.AdvancePayment];
          this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch =
            this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation =
            this.storage.branch;
          this.VoucherDataRequestModel.preperedFor = "Vendor";
          this.VoucherDataRequestModel.partyCode = `${this.PaymentData?.VendorInfo?.cD || ""}`;
          this.VoucherDataRequestModel.partyName = this.PaymentData?.VendorInfo?.nM;
          this.VoucherDataRequestModel.partyState =
            this.VendorDetails?.vendorState;
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
          this.VoucherDataRequestModel.entryDate = new Date();
          this.VoucherDataRequestModel.panNo =
            this.PaymentHeaderFilterForm.get("VendorPANNumber").value;

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

          this.VoucherDataRequestModel.GrossAmount = GrossAmount;
          this.VoucherDataRequestModel.netPayable = NetPayable;
          this.VoucherDataRequestModel.roundOff = 0;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode =
            this.PaymentSummaryFilterForm.value.PaymentMode;
          this.VoucherDataRequestModel.refNo =
            this.PaymentSummaryFilterForm.value.ChequeOrRefNo;
          this.VoucherDataRequestModel.accountName =
            this.PaymentSummaryFilterForm.value.Bank.name;
          this.VoucherDataRequestModel.accountCode = this.PaymentSummaryFilterForm.value?.Bank.value;
          this.VoucherDataRequestModel.date =
            this.PaymentSummaryFilterForm.value.Date;
          this.VoucherDataRequestModel.scanSupportingDocument = ""; //this.imageData?.ScanSupportingdocument

          const companyCode = this.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList = this.tableData.map(function (item) {
            return {
              companyCode: companyCode,
              voucherNo: "",
              transCode: VoucherInstanceType.AdvancePayment,
              transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
              voucherCode: VoucherType.JournalVoucher,
              voucherType: VoucherType[VoucherType.JournalVoucher],
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: "TEST",
              accName: "TEST",
              sacCode: "TEST",
              sacName: "TEST",
              debit: parseFloat(item.THCamount).toFixed(2),
              credit: 0,
              GSTRate: 0,
              GSTAmount: 0,
              Total: parseFloat(item.THCamount).toFixed(2),
              TDSApplicable: false,
              narration: "",
            };
          });

          this.VoucherRequestModel.details = VoucherlineitemList;
          this.VoucherRequestModel.data = this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(this.voucherServicesService
            .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
              if (res.success) {
                this.UpdateTHCAmount(res?.data?.mainData?.ops[0].vNO);
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
      }, "Advance Payment Voucher Generating..!");
    }
  }

  UpdateTHCAmount(vno) {
    const isSelectedData = this.tableData.filter((x) => x.isSelected);
    console.log("isSelectedData", isSelectedData);
    isSelectedData.forEach((x) => {
      const UpdateAmount = x?.UpdateAmount
      let commonBody;

      if (UpdateAmount != undefined) {
        commonBody = {
          aDVPENAMT: x.Advance,
          bALAMT: x.THCamount - x.Advance,
          cONTAMT: x.THCamount,
        }
        commonBody["addedCharges"] = this.convertFieldsToNumbers(UpdateAmount.THCAmountsADDForm)
        commonBody["deductedCharges"] = this.convertFieldsToNumbers(UpdateAmount.THCAmountsLESSForm)
      } else {
        commonBody = {
          aDVPENAMT: 0,
          aDVVUCH: [vno],
          mODDT: new Date(),
          mODLOC: this.storage.branch,
          mODBY: this.storage.userName,
        }
      }
      const reqBody = {
        companyCode: this.companyCode,
        collectionName: "thc_summary",
        filter: {
          cID: this.storage.companyCode,
          docNo: x.THC
        },
        update: commonBody,
      };
      firstValueFrom(this.masterService.masterPut('generic/update', reqBody)).then((res: any) => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Voucher Created Successfully And THC Updated Successfully",
            text: "Voucher No: " + vno,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.hideLoading();
              setTimeout(() => {
                Swal.close();
              }, 2000);
              this.RedirectToTHCPayment();
            }
          });
        }
      }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
        .finally(() => {
        });
    })
  }
  convertFieldsToNumbers(formValue) {
    return Object.keys(formValue).reduce((acc, key) => {
      acc[key] = parseFloat(formValue[key]);
      return acc;
    }, {});
  }
  async getBeneficiaryData() {
    try {
      // Fetch beneficiary details from API
      const beneficiaryModalData = await this.objVendorBillService.getBeneficiaryDetailsFromApi(this.PaymentData?.VendorInfo
        ?.cD);

      // Check if beneficiary data is available
      if (beneficiaryModalData.length > 0) {
        // Prepare request object for the dialog
        const request = {
          Details: beneficiaryModalData,
        };


        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.matDialog.open(BeneficiaryDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
        });
      } else {
        // Display a warning if no beneficiary data is available
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please Add Beneficiary Details To View",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error('An error occurred:', error);
    }
  }
  BalancePaymentlocationFieldChanged(event) {
    console.log(event)
    this.OnPaymentModeChange(event);
  }
  async getVendorsVehicles(OpenAble = false) {
    try {
      // Fetch beneficiary details from API
      const VendorWiseVehicleData = await this.objVendorBillService.getVendorsWiseVehicleList(this.PaymentData?.VendorInfo
        ?.nM);
      this.PaymentHeaderFilterForm.get("Numberofvehiclesregistered").setValue(VendorWiseVehicleData.length);

      // Check if beneficiary data is available
      if (VendorWiseVehicleData.length > 0 && OpenAble) {
        // Prepare request object for the dialog
        const request = {
          Details: VendorWiseVehicleData,
        };


        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.matDialog.open(VendorsVehicleDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
        });
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error('An error occurred:', error);
    }
  }
  vehiclesregisteredview(event) {

    this.getVendorsVehicles(true);
  }
}
