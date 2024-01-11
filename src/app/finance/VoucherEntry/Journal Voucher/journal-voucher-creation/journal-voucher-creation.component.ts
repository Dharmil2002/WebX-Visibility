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
import { DebitVoucherDataRequestModel, DebitVoucherRequestModel } from 'src/app/Models/Finance/Finance';
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

  debitVoucherRequestModel = new DebitVoucherRequestModel();
  debitVoucherDataRequestModel = new DebitVoucherDataRequestModel();
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
    console.log(this.JournalVoucherSummaryForm.value);
    console.log(this.tableData);

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



          this.debitVoucherRequestModel.companyCode = this.storage.companyCode;
          this.debitVoucherRequestModel.docType = "VR";
          this.debitVoucherRequestModel.branch = this.storage.branch;
          this.debitVoucherRequestModel.finYear = financialYear;

          this.debitVoucherDataRequestModel.voucherNo = "";
          this.debitVoucherDataRequestModel.transType = "Journal Voucher";
          this.debitVoucherDataRequestModel.transDate = new Date();
          this.debitVoucherDataRequestModel.docType = "VR";
          this.debitVoucherDataRequestModel.branch = this.storage.branch;
          this.debitVoucherDataRequestModel.finYear = financialYear;

          this.debitVoucherDataRequestModel.accLocation = this.storage.branch;
          this.debitVoucherDataRequestModel.preperedFor = this.JournalVoucherSummaryForm.value.Preparedfor;
          this.debitVoucherDataRequestModel.partyCode = this.JournalVoucherSummaryForm.value.PartyName?.value;
          this.debitVoucherDataRequestModel.partyName = this.JournalVoucherSummaryForm.value.PartyName?.name;
          this.debitVoucherDataRequestModel.partyState = ""
          this.debitVoucherDataRequestModel.entryBy = this.storage.userName;
          this.debitVoucherDataRequestModel.entryDate = new Date();
          this.debitVoucherDataRequestModel.panNo = this.JournalVoucherSummaryForm.get("PANnumber").value;

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

          this.debitVoucherDataRequestModel.paymentAmt = this.totalCredit;
          this.debitVoucherDataRequestModel.netPayable = this.totalCredit;
          this.debitVoucherDataRequestModel.roundOff = 0;
          this.debitVoucherDataRequestModel.voucherCanceled = false;

          this.debitVoucherDataRequestModel.paymentMode = undefined;
          this.debitVoucherDataRequestModel.refNo = undefined;
          this.debitVoucherDataRequestModel.accountName = undefined;
          this.debitVoucherDataRequestModel.date = undefined;
          this.debitVoucherDataRequestModel.scanSupportingDocument = "";
          this.debitVoucherDataRequestModel.paymentAmount = this.totalCredit;

          this.debitVoucherDataRequestModel.mANNUM = this.JournalVoucherSummaryForm.get("ManualNumber").value;
          this.debitVoucherDataRequestModel.mREFNUM = this.JournalVoucherSummaryForm.get("ReferenceNumber").value;

          const companyCode = this.storage.companyCode;
          const CurrentBranchCode = this.storage.branch;
          var VoucherlineitemList = this.tableData.map(function (item) {
            return {
              companyCode: companyCode,
              voucherNo: "",
              transType: "Journal Voucher",
              transDate: new Date(),
              finYear: financialYear,
              branch: CurrentBranchCode,
              accCode: item.LedgerHdn,
              accName: item.Ledger,
              sacCode: "",
              sacName: "",
              debit: parseFloat(item.DebitAmount).toFixed(2),
              credit: parseFloat(item.CreditAmount).toFixed(2),
              GSTRate: 0,
              GSTAmount: 0,
              Total: parseFloat(item.DebitAmount).toFixed(2),
              TDSApplicable: false,
              narration: item.Narration ?? ""
            };
          });


          this.debitVoucherRequestModel.details = VoucherlineitemList;
          this.debitVoucherRequestModel.data = this.debitVoucherDataRequestModel;
          this.debitVoucherRequestModel.debitAgainstDocumentList = [];

          firstValueFrom(this.voucherServicesService
            .FinancePost("fin/account/voucherentry", this.debitVoucherRequestModel)).then((res: any) => {
              if (res.success) {
                Swal.fire({
                  icon: "success",
                  title: "Jornal Voucher Created Successfully",
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
