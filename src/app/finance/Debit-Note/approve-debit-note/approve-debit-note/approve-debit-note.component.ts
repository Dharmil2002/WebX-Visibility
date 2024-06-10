import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from 'src/app/core/service/generic-services/generic-services';
import { StorageService } from 'src/app/core/service/storage.service';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { FilterBillingComponent } from 'src/app/operation/pending-billing/filter-billing/filter-billing.component';
import { FilterDebitNoteDetailsComponent } from '../../filter-debit-note-details/filter-debit-note-details/filter-debit-note-details.component';
import { filter } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-approve-debit-note',
  templateUrl: './approve-debit-note.component.html',

})
export class ApproveDebitNoteComponent implements OnInit {

  boxData: { count: number; title: string; class: string; }[];
  backPath: string;
  tableData1: any[];
  breadScrums = [
    {
      title: "Debit Note Approval",
      items: ["Finance"],
      active: "Debit Note Approval",
    },
  ];

  tableLoad: boolean = true;// flag , indicates if data is still lodaing or not , used to show loading animation
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  // menuItemflag: boolean = true;
  orgBranch: string = "";
  companyCode: number = 0;
  linkArray = [
    { Row: "pendCol", Path: "Finance/InvoiceCollection" },
    { Row: "penAp", Path: "Finance/bill-approval" },
    { Row: "Action", Path: "" }
  ]
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  range: FormGroup;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  unBillingData: any;
  menuItems = [{ label: "Approve" }, { label: "Reject" }, { label: "Cancel" }];
  menuItemflag = true;

  toggleArray = [];
  columnHeader = {
    pARTY: {
      Title: "Vendor",
      class: "matcolumnleft",
      Style: "max-width: 200px",
    },
    nTNO: {
      Title: "Debit Note​",
      class: "matcolumnleft",
      datatype: "string",
      Style: "max-width: 150px",
    },
    nTDT: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width: 100px",
      // datetype:"date"
    },
    aMT: {
      Title: "Debit Note amount",
      class: "matcolumncenter",
      Style: "max-width: 80px",
      datatype: "currency"
    },
    gstRevlAmt: {
      Title: "GST reversal",
      class: "matcolumnright",
      Style: "max-width: 80px",
      datatype: "currency"
    },
    tdsAMT: {
      Title: "TDS reversal",
      class: "matcolumnright",
      Style: "max-width: 80px",
      datatype: "currency"
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:7%",
      stickyEnd: true
    },


  }
  staticField = [
    "pARTY",
    "nTNO",
    "nTDT",
    "aMT",
    "tdsAMT",
    "gstRevlAmt"
  ]

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  // EventButton = {
  //   functionName: "openFilterDialog",
  //   name: "Filter",
  //   iconName: "filter_alt",
  // };
  BodyRes: any;
  panDNcnt: any;
  sumOfAmt: any;
  DebitNoteDataResponse: any = [];
  DataResponseHeader: any;
  DataResponseDetails: any;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();

  constructor(
    private InvoiceService: InvoiceServiceService,
    private DashboardFilterPage: FormBuilder,
    private storage: StorageService,
    private matDialog: MatDialog,
    private genericService: GenericService,
    private masterService: MasterService,
    private navigationService: NavigationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private voucherServicesService: VoucherServicesService,
    private Route: Router,

  ) {
    this.companyCode = this.storage.companyCode;
    this.orgBranch = this.storage.branch;

    this.range = this.DashboardFilterPage.group({
      start: new FormControl(),  // Create a form control for start date
      end: new FormControl(),    // Create a form control for end date
    });
  }

  ngOnInit(): void {
    // const now = new Date();
    this.getKpiCount();
    this.get(event);

  }

  async get(event) {
    this.tableLoad = true;  // Set tableLoad to true while fetching data
    const dNoteReq = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_header",
      filter: {
        tYP: "D",
        sTS: 1
      }
    };
    const response = await firstValueFrom(this.masterService.masterPost("generic/get", dNoteReq));

    this.tableData1 = response.data.map(item => ({
      ...item,
      pARTY: item.pARTY.cD + ':' + item.pARTY.nM,
      gstRevlAmt: item.gST.aMT
    }));

    this.tableData1.forEach(item => {
      item.actions = ["Reject", "Approve"];

    });
    this.tableData1 = this.tableData1;
    this.tableLoad = false;

  }


  openFilterDialog() {
    const dialogRef = this.matDialog.open(FilterDebitNoteDetailsComponent, {
      width: "60%",
      position: {
        top: "20px",
      },
      disableClose: true,
      data: "",
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result != undefined) {
        this.get(result);
      }
      else {
        this.genericService.clearSharedData();
      }
    });
  }

  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }

  async handleMenuItemClick(data) {
    if (data.label.label == "Reject") {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_header",
        filter: { nTNO: data.data.nTNO },
        update: {
          sTS: 3,
          sTSNM: "Rejected",
          cNL: true,
          cNLDT: new Date(),
          cNLBY: this.storage.loginName,
        },
      };
      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req))
      if (res.success) {

        const Bodys = {
          companyCode: this.storage.companyCode,
          collectionName: "cd_note_details",
          filter: { nTNO: data.data.nTNO },
        };

        this.DebitNoteDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Bodys));
        console.log(this.DebitNoteDataResponse)
        const DebitNoteDataResponse = this.DebitNoteDataResponse.data;
        DebitNoteDataResponse.forEach(noteData => {
          // Check if the current noteData is selected
          const req = {
            companyCode: this.storage.companyCode,
            collectionName: "vend_bill_summary",
            filter: { docNo: noteData.bILLNO },
            update: {
              bALPBAMT: noteData.bAMT + noteData.aMT,
            },
          };
          const res = firstValueFrom(
            this.masterService.masterPut("generic/update", req))
        });

        Swal.fire({
          icon: "success",
          title: "Successful Rejected",
          text: res.message,
          showConfirmButton: true,
        });
        this.Route.navigate(["Finance/VendorPayment/Dashboard"])
      }
    }
    if (data.label.label == "Approve") {

      const BodyDataHeader = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_header",
        filter: { nTNO: data.data.nTNO },
      };
      this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));

      const BodyDataDetails = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_details",
        filter: { nTNO: data.data.nTNO },
      };
      this.DataResponseDetails = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataDetails));

      this.snackBarUtilityService.commonToast(() => {
        try {
          const PaymentAmount = parseFloat(this.DataResponseHeader.data[0].aMT);
          const NetPayable = parseFloat(this.DataResponseHeader.data[0].aMT);
          const RoundOffAmount = 0

          this.VoucherRequestModel.companyCode = this.storage.companyCode;
          this.VoucherRequestModel.docType = "VR";
          this.VoucherRequestModel.branch = this.storage.branch;
          this.VoucherRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.voucherNo = "";
          this.VoucherDataRequestModel.transCode = VoucherInstanceType.DebitNoteApproval;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.DebitNoteApproval];
          this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch = this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation = this.DataResponseHeader.data[0].lOC;
          this.VoucherDataRequestModel.preperedFor = "Vendor";
          this.VoucherDataRequestModel.partyCode = this.DataResponseHeader.data[0].pARTY.cD;
          this.VoucherDataRequestModel.partyName = this.DataResponseHeader.data[0].pARTY.nM || "";
          this.VoucherDataRequestModel.partyState = "";
          this.VoucherDataRequestModel.entryBy = this.storage.userName;
          this.VoucherDataRequestModel.entryDate = new Date();
          this.VoucherDataRequestModel.panNo = "";
          this.VoucherDataRequestModel.tdsSectionCode = "";
          this.VoucherDataRequestModel.tdsSectionName = "";
          this.VoucherDataRequestModel.tdsRate = 0;
          this.VoucherDataRequestModel.tdsAmount = 0;
          this.VoucherDataRequestModel.tdsAtlineitem = false;
          this.VoucherDataRequestModel.tcsSectionCode = undefined;
          this.VoucherDataRequestModel.tcsSectionName = undefined
          this.VoucherDataRequestModel.tcsRate = 0;
          this.VoucherDataRequestModel.tcsAmount = 0;

          this.VoucherDataRequestModel.IGST = parseFloat(this.DataResponseDetails.data[0].iGST) || 0;
          this.VoucherDataRequestModel.SGST = parseFloat(this.DataResponseDetails.data[0].sGST) || 0;
          this.VoucherDataRequestModel.CGST = parseFloat(this.DataResponseDetails.data[0].cGST) || 0;
          this.VoucherDataRequestModel.UGST = 0;
          this.VoucherDataRequestModel.GSTTotal = parseFloat(this.DataResponseHeader.data[0].gST.aMT) || 0;

          this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
          this.VoucherDataRequestModel.netPayable = NetPayable;
          this.VoucherDataRequestModel.roundOff = RoundOffAmount;
          this.VoucherDataRequestModel.voucherCanceled = false;

          this.VoucherDataRequestModel.paymentMode = "";
          this.VoucherDataRequestModel.refNo = "";
          this.VoucherDataRequestModel.accountName = "";
          this.VoucherDataRequestModel.accountCode = "";
          this.VoucherDataRequestModel.date = ""
          this.VoucherDataRequestModel.scanSupportingDocument = "";
          this.VoucherDataRequestModel.transactionNumber = this.DataResponseHeader.data[0].nTNO;

          const voucherlineItems = this.GetVouchersLedgers(this.VoucherDataRequestModel);

          this.VoucherRequestModel.details = voucherlineItems;
          this.VoucherRequestModel.data = this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];
          firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
            let reqBody = {
              companyCode: this.storage.companyCode,
              voucherNo: res?.data?.mainData?.ops[0].vNO,
              transDate: Date(),
              finYear: financialYear,
              branch: this.DataResponseHeader.data[0].lOC,
              transCode: VoucherInstanceType.DebitNoteApproval,
              transType: VoucherInstanceType[VoucherInstanceType.DebitNoteApproval],
              voucherCode: VoucherType.JournalVoucher,
              voucherType: VoucherType[VoucherType.JournalVoucher],
              docType: "Voucher",
              partyType: "Customer",
              docNo: this.DataResponseHeader.data[0].nTNO,
              partyCode: "" + this.DataResponseHeader.data[0].pARTY.cD || "",
              partyName: this.DataResponseHeader.data[0].pARTY.nM || "",
              entryBy: this.storage.userName,
              entryDate: Date(),
              debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
                return {
                  "accCode": item.accCode,
                  "accName": item.accName,
                  "accCategory": item.accCategory,
                  "amount": item.debit,
                  "narration": item.narration ?? ""
                };
              }),
              credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
                return {
                  "accCode": item.accCode,
                  "accName": item.accName,
                  "accCategory": item.accCategory,
                  "amount": item.credit,
                  "narration": item.narration ?? ""
                };
              }),
            };

            firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then(async (res: any) => {
              if (res) {
                const req = {
                  companyCode: this.storage.companyCode,
                  collectionName: "cd_note_header",
                  filter: { nTNO: this.DataResponseHeader.data[0].nTNO },
                  update: {
                    sTS: 2,
                    sTSNM: "Approved",
                    sTSDT: new Date(),
                    sTSBY: this.storage.loginName,
                    vNO: reqBody.voucherNo
                  },
                };
                const res = await firstValueFrom(
                  this.masterService.masterPut("generic/update", req))

                Swal.fire({
                  icon: "success",
                  title: "Voucher Generated Successfully",
                  text: "Vouche Generated Successfully",
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.hideLoading();
                    setTimeout(() => {
                      Swal.close();
                      // this.navigationService.navigateTotab("creditNoteManagement", "dashboard/Index");
                    }, 1000);
                    this.Route.navigate(["/Finance/DebitNote/ApproveDebitNote"])
                  }
                });

              } else {
                this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Do Account Posting..!");
              }
            });
          }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
            .finally(() => {
            });

        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
        }
      }, "Credit Note Voucher Generating..!");

    }
  }

  async getKpiCount() {

    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_header",
      filter: { tYP: "D", sTS: 1 }
    };
    this.BodyRes = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    // console.log(this.BodyRes.data);

    // Pending Debit Note Approval Count 
    this.panDNcnt = this.BodyRes.data
      .filter(item => item.sTS === 1) // Filter out items where sTS is not equal to 1
      .length;
    const panApDNote = this.panDNcnt > 0 ? this.panDNcnt : "0";


    // Pending Debit Note Approval Amount
    this.sumOfAmt = this.BodyRes.data.reduce((total, currentItem) => {
      const amount = currentItem.tXBLAMT !== null && currentItem.tXBLAMT !== undefined ? currentItem.tXBLAMT : 0;
      return total + amount;
    }, 0);
    const panApDnoteCount = this.sumOfAmt > 0 ? this.sumOfAmt.toFixed(2) : "0";


    const createShipDataObject = (
      count: number,
      title: string,
      className: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,

    });
    const DebitNoteBoxData = [

      createShipDataObject(panApDNote, "Pending Approval Count", "bg-c-Bottle-light"),
      createShipDataObject(panApDnoteCount, "Pending Approval Amount", "bg-c-Grape-light"),
    ];
    this.boxData = DebitNoteBoxData


  }

  GetVouchersLedgers(data) {
    const TotalAmount = this.DataResponseHeader.data[0].aMT;
    const TXBLAMTAmount = this.DataResponseHeader.data[0].tdsAMT > 0 ? this.DataResponseHeader.data[0].tXBLAMT - this.DataResponseHeader.data[0].tdsAMT : this.DataResponseHeader.data[0].tXBLAMT;
    const createVoucher = (accCode, accName, accCategory, debit, credit) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.DebitNoteApproval,
      transType: VoucherInstanceType[VoucherInstanceType.DebitNoteApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.DataResponseHeader.data[0].lOC,
      accCode,
      accName,
      accCategory,
      sacCode: "",
      sacName: "",
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,//credit,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Debit Note is Generated :${this.DataResponseHeader.data[0].nTNO}`,
    });

    const response = [

      createVoucher(ledgerInfo['LIA001002'].LeadgerCode, ledgerInfo['LIA001002'].LeadgerName, ledgerInfo['LIA001002'].LeadgerCategory, TotalAmount, 0),
      createVoucher(this.DataResponseHeader.data[0].aCCD, this.DataResponseHeader.data[0].aCNM, "EXPENSE", 0, TXBLAMTAmount),
    ]


    if (this.DataResponseDetails.data[0].gST.cGST > 0) {
      response.push(createVoucher(ledgerInfo['LIA002003'].LeadgerCode, ledgerInfo['LIA002003'].LeadgerName, ledgerInfo['LIA002003'].LeadgerCategory, 0, this.DataResponseDetails.data[0].gST.cGST));
    }

    if (this.DataResponseDetails.data[0].gST.iGST > 0) {
      response.push(createVoucher(ledgerInfo['LIA002004'].LeadgerCode, ledgerInfo['LIA002004'].LeadgerName, ledgerInfo['LIA002004'].LeadgerCategory, 0, this.DataResponseDetails.data[0].gST.iGST));
    }

    if (this.DataResponseDetails.data[0].gST.sGST > 0) {
      response.push(createVoucher(ledgerInfo['LIA002001'].LeadgerCode, ledgerInfo['LIA002001'].LeadgerName, ledgerInfo['LIA002001'].LeadgerCategory, 0, this.DataResponseDetails.data[0].gST.sGST));
    }

    if (this.DataResponseHeader.data[0].tdsAMT > 0) {
      response.push(createVoucher(this.DataResponseDetails.data[0].tDS.sEC, this.DataResponseDetails.data[0].tDS.sECD, "TDS", 0, this.DataResponseHeader.data[0].tdsAMT));
    }

    return response;
  }

}
