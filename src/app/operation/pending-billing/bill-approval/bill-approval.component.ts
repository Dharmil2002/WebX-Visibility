import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { BillSubmissionComponent } from './submission/bill-submission/bill-submission.component';
import { BillApproval } from 'src/app/Models/bill-approval/bill-approval';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { GSTTypeMapping, SACInfo, VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { CustomerBillStatus } from 'src/app/Models/docStatus';

@Component({
  selector: 'app-bill-approval',
  templateUrl: './bill-approval.component.html'
})
export class BillApprovalComponent implements OnInit {
  backPath: string;
  shipments: any;
  tableData: any;
  headerColumn: any;
  navigateExtra: any;
  tableLoad: boolean = true;
  breadScrums = [
    {
      title: "Customer and GST Details",
      items: ["InvoiceCollection"],
      active: "Customer and GST Details",
    },
  ];


  metaData = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(
    private invoiceService: InvoiceServiceService,
    private billApproval: BillApproval,/*this is a model object here so please dont remove bcz this model object is used in html page*/
    public dialog: MatDialog,
    private storage: StorageService,
    private router: Router,
    public snackBarUtilityService: SnackBarUtilityService,
    private voucherServicesService: VoucherServicesService,
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {

      this.navigateExtra = this.router.getCurrentNavigation()?.extras?.state.data.columnData || "";
    }
    this.backPath = "/dashboard/Index?tab=Management​";
  }

  ngOnInit(): void {
    this.getApprovalData();
  }
  async getApprovalData() {
    const customer = this.navigateExtra.billingParty[0].split('-')[0].trim();
    const res = await this.invoiceService.getBillingData(customer);
    const filterData = await this.invoiceService.filterData(res);
    this.tableData = filterData;
    this.tableLoad = false;
  }
  async handleMenuItemClick(data) {

    if (data.label.label == "Approve Bill") {
      const filter = {
        bILLNO: data?.data?.bILLNO
      }
      const status = {
        bSTS: CustomerBillStatus.Approved,
        bSTSNM: CustomerBillStatus[CustomerBillStatus.Approved],
        aPR: {
          loc: this.storage.branch,
          aDT: new Date(),
          aBY: this.storage.userName
        }
      }
      // #region Update Invoice Status when account posting credit and debit in equal amount
      var CreditDebitVouchersList = this.GetVouchersLedgers(data.data);
      var CreditAmount = CreditDebitVouchersList.filter(item => item.credit > 0).map(item => item.credit).reduce((a, b) => a + b, 0);
      var DebitAmount = CreditDebitVouchersList.filter(item => item.debit > 0).map(item => item.debit).reduce((a, b) => a + b, 0);
      if (CreditAmount != DebitAmount) {
        console.log(CreditDebitVouchersList);
        SwalerrorMessage("error", "Error", "Credit and Debit Amount Should be Equal for Account Posting..!", false);
        return;
      }

      const res = await this.invoiceService.updateInvoiceStatus(filter, status);
      if (res) {
        this.AccountPosting(data.data);
      }
    }
    else if (data.label.label == "Cancel Bill") {
      Swal.fire({
        title: 'Reason For Cancel?',
        html: '<input id="swal-input1" class="swal2-input">',
        focusConfirm: false,
        showCancelButton: true, // Add this line to show the cancel button
        cancelButtonText: 'Cancel', // Optional: Customize the cancel button text
        preConfirm: () => {
          return (document.getElementById('swal-input1') as HTMLInputElement).value;
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Handle the input value if the user clicks the confirm button
          const filter = {
            bILLNO: data?.data?.bILLNO
          }
          const status = {
            cNL: true,
            cNLDT: new Date(),
            cNBY: this.storage.userName,
            cNRES: result.value//required cancel reason in popup
          }
          const res = await this.invoiceService.updateInvoiceStatus(filter, status);
          const filteDkt = {
            cID: this.storage.companyCode,
            bILLNO: data.data.bILLNO
          }
          await this.invoiceService.updateDocketStatus(filteDkt);
          if (res) {
            this.getApprovalData();
            SwalerrorMessage("success", "Success", "The invoice has been successfully Cancelled.", true)
          }
          // Your code to handle the input value
        } else if (result.isDismissed) {
          this.getApprovalData();
        }
      });
    }
    else if (data.label.label === "Submission Bill") {
      const dialogref = this.dialog.open(BillSubmissionComponent, {
        width: '100vw',
        height: '100vw',
        maxWidth: '232vw',
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          this.getApprovalData();
          SwalerrorMessage("success", "Success", "The invoice has been successfully Submission.", true)
        }
      });
    }

  }
  // Account Posting When  When Bill Has been Generated/ Finalized	
  async AccountPosting(data) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const TotalAmount = data?.aMT;
        const GstAmount = data?.gST?.aMT;

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BillApproval;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BillApproval];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        this.VoucherDataRequestModel.partyCode = data?.cUST?.cD || "";
        this.VoucherDataRequestModel.partyName = data?.cUST?.nM || "";
        this.VoucherDataRequestModel.partyState = data?.cUST?.sT || "";
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = "";
        this.VoucherDataRequestModel.tdsSectionName = "";
        this.VoucherDataRequestModel.tdsRate = 0;
        this.VoucherDataRequestModel.tdsAmount = 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = "";
        this.VoucherDataRequestModel.tcsSectionName = "";
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = data?.gST?.iGST || 0;
        this.VoucherDataRequestModel.SGST = data?.gST?.sGST || 0;
        this.VoucherDataRequestModel.CGST = data?.gST?.cGST || 0;
        this.VoucherDataRequestModel.UGST = data?.gST?.UTGST || 0;
        this.VoucherDataRequestModel.GSTTotal = GstAmount;

        this.VoucherDataRequestModel.GrossAmount = data?.gROSSAMT || 0;
        this.VoucherDataRequestModel.netPayable = TotalAmount;
        this.VoucherDataRequestModel.roundOff = data?.rOUNOFFAMT;
        this.VoucherDataRequestModel.voucherCanceled = false
        this.VoucherDataRequestModel.transactionNumber = data.bILLNO;
        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        var VoucherlineitemList = this.GetVouchersLedgers(data);

        this.VoucherRequestModel.details = VoucherlineitemList
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {

              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                transCode: VoucherInstanceType.BillApproval,
                transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                docType: "Voucher",
                partyType: "Customer",
                docNo: data.bILLNO,
                partyCode: data?.cUST?.cD || "",
                partyName: data?.cUST?.nM || "",
                entryBy: this.storage.userName,
                entryDate: Date(),
                debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ?? ""
                  };
                }),
                credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ?? ""
                  };
                }),
              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    Swal.fire({
                      icon: "success",
                      title: "Bill Approval Voucher Created",
                      text: "Voucher No: " + reqBody.voucherNo,
                      showConfirmButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.hideLoading();
                        setTimeout(() => {
                          Swal.close();
                        }, 2000);
                        this.getApprovalData();
                        SwalerrorMessage("success", "Success", "The invoice has been successfully approved.", true)
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

            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }


    }, "C-Note Booking Voucher Generating..!");

  }
  GetVouchersLedgers(data) {
    const TotalAmount = data?.aMT;
    const DocketAmount = data?.dKTTOT;
    const GstAmount = data?.gST?.aMT;
    const GstRate = data?.gST?.rATE;

    const createVoucher = (accCode, accName, accCategory, debit, credit, sacInfo = "",) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BillApproval,
      transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacInfo ? SACInfo['996511'].sacCode : "",
      sacName: sacInfo ? SACInfo['996511'].sacName : "",
      debit,
      credit,
      GSTRate: sacInfo ? GstRate : 0,
      GSTAmount: sacInfo ? GstAmount : 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill freight is Generated :${data.bILLNO}`,
    });

    const response = [
      createVoucher(ledgerInfo['AST001002'].LeadgerCode, ledgerInfo['AST001002'].LeadgerName, ledgerInfo['AST001002'].LeadgerCategory, TotalAmount, 0),
    ];
    let LeadgerDetails;
    switch (data?.tRNMODE) {
      case "P1":
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
      case "P2":
        LeadgerDetails = ledgerInfo['INC001004'];
        break;
      case "P3":
        LeadgerDetails = ledgerInfo['INC001002'];
        break;
      case "P4":
        LeadgerDetails = ledgerInfo['INC001001'];
        break;
      default:
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
    }
    // Income Ledger
    if (LeadgerDetails) {
      response.push(createVoucher(LeadgerDetails.LeadgerCode, LeadgerDetails.LeadgerName, LeadgerDetails.LeadgerCategory, 0, DocketAmount));
    }
    if (data?.rOUNOFFAMT > 0) {
      response.push(createVoucher(ledgerInfo['EXP001042'].LeadgerCode, ledgerInfo['EXP001042'].LeadgerName, ledgerInfo['EXP001042'].LeadgerCategory, data?.rOUNOFFAMT, 0));
    }


    const gstTypeMapping = GSTTypeMapping

    const gstType = data?.gST?.tYP;

    const GSTTypeList = gstType.split(',');
    // Check GST Type Contains UTGST then Push CGST
    if (GSTTypeList.includes('UTGST') || GSTTypeList.includes('SGST')) {
      GSTTypeList.push('CGST');
    }

    GSTTypeList.forEach(element => {
      if (gstType && gstTypeMapping[element]) {
        const { accCode, accName, accCategory, prop } = gstTypeMapping[element];
        if (data?.gST?.[prop] > 0) {
          response.push(createVoucher(accCode, accName, accCategory, 0, data?.gST?.[prop], '996511'));
        }
      }
    });
    return response;
  }

}
