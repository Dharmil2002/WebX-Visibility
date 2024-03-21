import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { JournalVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/JournalVouchercontrol';

//import { DriversFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './Jornal-voucher-api-Utils';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DriversFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, UsersFromApi, customerFromApi, vendorFromApi } from '../Jornal-voucher-api-Utils';
import { GetLedgercolumnHeader } from '../jornalvoucherCommonUtitlity';
import { MatDialog } from '@angular/material/dialog';
import { JournalVoucherCreationModalComponent } from '../Modals/journal-voucher-creation-modal/journal-voucher-creation-modal.component';
import { Router } from '@angular/router';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType } from 'src/app/Models/Finance/Finance';
import { firstValueFrom } from 'rxjs';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { StorageService } from 'src/app/core/service/storage.service';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
@Component({
  selector: 'app-journal-voucher-creation',
  templateUrl: './journal-voucher-creation.component.html',
})
export class JournalVoucherCreationComponent implements OnInit {
  breadScrums = [
    {
      title: "Journal Voucher",
      items: ["Finance"],
      active: "Journal Voucher",
    },
  ];
  JournalVoucherControl: JournalVoucherControl;

  JournalVoucherSummaryForm: UntypedFormGroup;
  jsonControlJournalVoucherSummaryArray: any;
  TotalAmountList: { count: any; title: string; class: string }[];
  LoadVoucherDetails = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  totalDebit: number;
  totalCredit: number;
  staticField = ['Ledger', 'DebitAmount', 'CreditAmount', 'Narration']
  columnHeader = GetLedgercolumnHeader()
  tableData: any = [];
  AccountGroupList: any;
  constructor(private fb: UntypedFormBuilder,
    private storage: StorageService,
    private masterService: MasterService,
    private router: Router,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private matDialog: MatDialog,
    private filter: FilterUtils,) { }

  ngOnInit(): void {
    this.initializeFormControl();
    this.SetTotalAmountList()
  }
  SetTotalAmountList() {
    this.totalDebit = this.tableData.reduce((accumulator, currentValue) => {
      const drValue = parseFloat(currentValue['DebitAmount']);
      return isNaN(drValue) ? accumulator : accumulator + drValue;
    }, 0);
    this.totalCredit = this.tableData.reduce((accumulator, currentValue) => {
      const drValue = parseFloat(currentValue['CreditAmount']);
      return isNaN(drValue) ? accumulator : accumulator + drValue;
    }, 0);
    this.TotalAmountList = [
      {
        count: this.totalDebit.toFixed(2),
        title: "Total Debit Amount",
        class: `color-Ocean-danger`,
      },
      {
        count: this.totalCredit.toFixed(2),
        title: "Total Credit Amount",
        class: `color-Success-light`,
      }
    ]
  }
  initializeFormControl() {
    this.JournalVoucherControl = new JournalVoucherControl("");
    this.jsonControlJournalVoucherSummaryArray = this.JournalVoucherControl.getJournalVoucherSummaryArrayControls();
    this.JournalVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlJournalVoucherSummaryArray]);

  }
  async PreparedforFieldChanged(event) {
    const Preparedfor = this.JournalVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.JournalVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    this.JournalVoucherSummaryForm.get("PANnumber").setValue("");
    this.JournalVoucherSummaryForm.get("PANnumber").enable();
    const partyNameControl = this.jsonControlJournalVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
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
    this.BindLedger(Preparedfor);
  }
  async PartyNameFieldChanged(event) {
    const Preparedfor = this.JournalVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.JournalVoucherSummaryForm.value.PartyName
    let responseFromAPI: any;
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await GetSingleVendorDetailsFromApi(this.masterService, PartyName.value)
        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.JournalVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.JournalVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      case 'Customer':
        responseFromAPI = await GetSingleCustomerDetailsFromApi(this.masterService, PartyName.value)

        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.JournalVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.JournalVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      default:

    }
  }

  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      this.SetTotalAmountList()
    }
    else {

      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.addJournalDetails(LedgerDetails)
    }
  }
  AddNewJournals() {
    this.addJournalDetails('')

  }
  async BindLedger(BindLedger) {
    const account_groupReqBody = {
      companyCode: localStorage.getItem('companyCode'),
      collectionName: "account_detail",
      filter: {
        pARTNM: BindLedger,
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  // Add a new item to the table
  addJournalDetails(event) {

    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(JournalVoucherCreationModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          Ledger: result?.Ledger,
          LedgerHdn: result?.LedgerHdn,
          SubLedger: result?.SubLedger,
          DebitAmount: result?.DebitAmount,
          CreditAmount: result?.CreditAmount,
          Narration: result?.Narration,
          actions: ['Edit', 'Remove']
        }
        this.tableData.unshift(json);
        this.LoadVoucherDetails = true;
      }
      this.LoadVoucherDetails = true;
      this.SetTotalAmountList()
    });

  }
  Submit() {
    if (this.totalCredit == 0 && this.totalDebit == 0) {
      this.snackBarUtilityService.ShowCommonSwal("info", "Please Enter Amount for Debit or Credit");
      return;
    }

    if (this.tableData.length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Add Atleast One Journal Voucher Details "
      );
    }
    else if (this.totalCredit != this.totalDebit) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Total Debit Amount and Total Credit Amount Should be Equal"
      );
    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {



          this.VoucherRequestModel.companyCode = this.storage.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch = this.storage.branch;
          this.VoucherRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.voucherNo = "";

          this.VoucherDataRequestModel.transCode = VoucherInstanceType.JournalVoucherCreation;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.JournalVoucherCreation];
          this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch = this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation = this.storage.branch;
          this.VoucherDataRequestModel.preperedFor = this.JournalVoucherSummaryForm.value.Preparedfor;
          this.VoucherDataRequestModel.partyCode = this.JournalVoucherSummaryForm.value.PartyName?.value;
          this.VoucherDataRequestModel.partyName = this.JournalVoucherSummaryForm.value.PartyName?.name;
          this.VoucherDataRequestModel.partyState = ""
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
          this.VoucherDataRequestModel.entryDate = new Date();
          this.VoucherDataRequestModel.panNo = this.JournalVoucherSummaryForm.get("PANnumber").value;

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

          this.VoucherDataRequestModel.GrossAmount = this.totalCredit;
          this.VoucherDataRequestModel.netPayable = this.totalCredit;
          this.VoucherDataRequestModel.roundOff = 0;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode = undefined;
          this.VoucherDataRequestModel.refNo = undefined;
          this.VoucherDataRequestModel.accountName = undefined;
          this.VoucherDataRequestModel.accountCode = undefined;
          this.VoucherDataRequestModel.date = undefined;
          this.VoucherDataRequestModel.scanSupportingDocument = "";

          this.VoucherDataRequestModel.mANNUM = this.JournalVoucherSummaryForm.get("ManualNumber").value;
          this.VoucherDataRequestModel.mREFNUM = this.JournalVoucherSummaryForm.get("ReferenceNumber").value;

          const companyCode = this.storage.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList = this.tableData.map(function (item) {
            return {
              companyCode: companyCode,
              voucherNo: "",
              transCode: VoucherInstanceType.JournalVoucherCreation,
              transType: VoucherInstanceType[VoucherInstanceType.JournalVoucherCreation],
              voucherCode: VoucherType.JournalVoucher,
              voucherType: VoucherType[VoucherType.JournalVoucher],
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: item.LedgerHdn,
              accCategory: item.SubLedger,
              accName: item.Ledger,
              sacCode: "",
              sacName: "",
              debit: parseFloat(item.DebitAmount).toFixed(2),
              credit: parseFloat(item.CreditAmount).toFixed(2),
              GSTRate: 0,
              GSTAmount: 0,
              Total: (parseFloat(item.CreditAmount) + parseFloat(item.DebitAmount)).toFixed(2),
              TDSApplicable: false,
              narration: item.Narration ? item.Narration : item.Ledger,
            };
          });


          this.VoucherRequestModel.details = VoucherlineitemList;
          this.VoucherRequestModel.data = this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(this.voucherServicesService
            .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
              if (res.success) {
                var CreditData = this.tableData.filter(item => item.DebitAmount == 0).map(function (item) {
                  return {
                    "accCode": `${item.LedgerHdn}`,
                    "accCategory": item.SubLedger,
                    "accName": item.Ledger,
                    "amount": item.CreditAmount,
                    "narration": item.Narration ? item.Narration : item.Ledger,
                  };
                })
                var DebitData = this.tableData.filter(item => item.CreditAmount == 0).map(function (item) {
                  return {
                    "accCode": `${item.LedgerHdn}`,
                    "accCategory": item.SubLedger,
                    "accName": item.Ledger,
                    "amount": item.DebitAmount,
                    "narration": item.Narration ? item.Narration : item.Ledger,
                  };
                })
                let reqBody = {
                  companyCode: localStorage.getItem("companyCode"),
                  voucherNo: res?.data?.mainData?.ops[0].vNO,
                  transDate: Date(),
                  finYear: financialYear,
                  branch: localStorage.getItem("Branch"),
                  transCode: VoucherInstanceType.JournalVoucherCreation,
                  transType: VoucherInstanceType[VoucherInstanceType.JournalVoucherCreation],
                  voucherCode: VoucherType.JournalVoucher,
                  voucherType: VoucherType[VoucherType.JournalVoucher],
                  docType: "Voucher",
                  partyType: this.JournalVoucherSummaryForm.value.Preparedfor,
                  docNo: "",
                  partyCode: this.JournalVoucherSummaryForm.value.PartyName?.value ?? "8888",
                  partyName: this.JournalVoucherSummaryForm.value.PartyName?.name ?? this.JournalVoucherSummaryForm.value.PartyName,
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
                        title: "Jornal Voucher Created Successfully",
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
                // Swal.fire({
                //   icon: "success",
                //   title: "Jornal Voucher Created Successfully",
                //   text: "Voucher No: " + res?.data?.mainData?.ops[0].vNO,
                //   showConfirmButton: true,
                // }).then((result) => {
                //   if (result.isConfirmed) {
                //     Swal.hideLoading();
                //     setTimeout(() => {
                //       Swal.close();
                //     }, 2000);
                //     this.navigationService.navigateTotab("Voucher", "dashboard/Index");
                //   }
                // });
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
      }, "Jornal Voucher Generating..!");
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
