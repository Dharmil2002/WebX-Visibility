import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, firstValueFrom, forkJoin, mergeMap, throwError } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';
import moment from 'moment';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { stateFromApi } from 'src/app/operation/pending-billing/filter-billing/filter-utlity';
import { locationFromApi } from 'src/app/operation/prq-entry-page/prq-utitlity';
import { CustomerBillStatus } from 'src/app/Models/docStatus';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { VendorBillEntry } from 'src/app/Models/Finance/VendorPayment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherInstanceType, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';

@Component({
  selector: 'app-set-opening-balance-vendor-wise',
  templateUrl: './set-opening-balance-vendor-wise.component.html',
})
export class SetOpeningBalanceVendorWiseComponent implements OnInit {
  breadscrums = [
    {
      title: "Upload Vendor Wise Opening Balance",
      items: ["FA Masters"],
      active: "Upload Vendor Wise Opening Balance",
    },
  ];
  fileUploadForm: UntypedFormGroup;
  BranchCode: any;
  VendorList: any;
  locationDropDown: any;
  AccountList: any;
  TDSAccountList: any;
  CompanyMastersData: any;
  SachsnList: any[];
  tableLoad = false;
  columnHeader = {
    BillNo: {
      Title: "Bill No",
      class: "matcolumnleft",
      Style: "min-width:25%",
    },
    VoucherNo: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "min-width:25%",
    },

    Status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:75%",
    },
  }
  staticField = ['BillNo', 'VoucherNo', 'Status',]
  tableData: any[]
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  constructor(
    private fb: UntypedFormBuilder,
    private xlsxUtils: xlsxutilityService,
    private storage: StorageService,
    private masterService: MasterService,
    private dialog: MatDialog,
    private objVendorService: VendorService,
    private operationService: OperationService,
    private router: Router,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService
  ) {
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
  }

  ngOnInit(): void {
  }

  async fetchVendorsData(VendorCodeList) {
    const result = this.objVendorService.getVendors({
      companyCode: this.storage.companyCode,
      vendorCode: { D$in: VendorCodeList },
      isActive: true
    })
    return result;
  }

  async AccountDataBasedOnAccountCode(AccountCodeChunks) {
    const result = this.getAccountData({
      cID: this.storage.companyCode,
      aCCD: { D$in: AccountCodeChunks }
    }, { _id: 0, aCCD: 1, aCNM: 1, mRPNM: 1 })

    return result;
  }
  async AccountDataForTDS(AccountName) {
    const result = this.getAccountData({
      cID: this.storage.companyCode,
      cATNM: AccountName
    }, { _id: 0, aCCD: 1, aCNM: 1 })

    return result;
  }
  async GetCompanmyMastersData() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "customers_gst_details",
      filter: { companyCode: this.storage.companyCode },
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body))
    if (res.success && res.data.length > 0) {

      res.data.map((element) => {
        element.StateName = element.stateNM.toUpperCase();
        element.gstInNumber = element.gstInNumber;
      });
      return res.data;
    }
    return [];
  }
  async getAccountData(filter, project = null): Promise<any | null> {

    let filters = [];
    filters.push({
      D$match: filter
    });

    if (project) {
      filters.push({ 'D$project': project });
    }

    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'account_detail',
      filters: filters
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));
    return res?.data || [];
  }

  async fetchAllSacHsnData(SacCode) {
    const result = this.getSacHsnData({
      SHCD: { D$in: SacCode }
    }, { _id: 0, SHCD: 1, SNM: 1 });
    return result;
  }

  async getSacHsnData(filter, project = null): Promise<any | null> {

    let filters = [];
    filters.push({
      D$match: filter
    });

    if (project) {
      filters.push({ 'D$project': project });
    }

    const reqBody = {
      collectionName: 'sachsn_master',
      filters: filters
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));
    return res?.data || [];
  }


  async fetchAllData(customerChunks) {
    // Define a function to chunk the array into smaller arrays of specified size
    function chunkArray(array, chunkSize) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, chunkSize + i));
      }
      return chunks;
    }
    // Chunk the customer chunks into arrays of 50
    const chunks = chunkArray(customerChunks, 50);

    // Map over each chunk to create promises for fetching customer data
    const promises = chunks.map(chunk =>
      this.objVendorService.getVendors({
        companyCode: this.storage.companyCode,
        // Pass each chunk as a filter for customerCode and StateofSupply
        $or: chunk.map(customer => ({
          customerCode: customer.CustomerCode,
          state: customer.StateofSupply
        }))
        ,
        activeFlag: true
      }, { _id: 0, customerCode: 1, customerName: 1 })
    );

    // Wait for all promises to resolve
    const result = await Promise.all(promises);

    // Flatten the result array to get a single array of customer data
    return result.flat();
  }


  //#region to select file
  selectedFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];
    if (file) {
      this.xlsxUtils.readFile(file).then(async (jsonData) => {

        // Locations Data
        this.locationDropDown = await locationFromApi(this.masterService);
        const locationValue = this.locationDropDown.map((x) => x.name);
        const locationName = this.locationDropDown.map((x) => x.value);
        const mergelocations = [...locationValue, ...locationName];

        // Vendors Data
        const VendorItems = [...new Set(jsonData.map((x) => x.VendorCode.trim().toUpperCase()))];
        this.VendorList = await this.fetchVendorsData(VendorItems);

        // Debit Accounts Data And TDS
        const DebitAccount = [...new Set(jsonData.map((x) => x.DebitAccount.trim().toUpperCase()))];
        this.AccountList = await this.AccountDataBasedOnAccountCode(DebitAccount);
        this.TDSAccountList = await this.AccountDataForTDS("TDS");


        // SAC Code Data
        const SACCode = [...new Set(jsonData.map((x) => x.SACCode))];
        this.SachsnList = await this.fetchAllSacHsnData(SACCode);

        // Company Masters Data
        this.CompanyMastersData = await this.GetCompanmyMastersData();

        const validationRules = [
          {
            ItemsName: "ManualBillNo",
            Validations: [{ Required: true }, { Type: "text" }],
          },
          {
            ItemsName: "BillDate",
            Validations: [{ Required: true }, { Type: "date" }, { Date: true }],
          },
          {
            ItemsName: "DueDate",
            Validations: [{ Required: true }, { Type: "date" }, { Date: true }],
          },
          {
            ItemsName: "VendorCode",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.VendorList.map((x) => {
                return x.vendorCode;
              }),
            }
            ]
          },
          {
            ItemsName: "AgreementNo",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "PaymentBranch",
            Validations: [{ Required: true }, { TakeFromList: mergelocations }],
          },
          {
            ItemsName: "BillingBranch",
            Validations: [{ Required: true }, { TakeFromList: mergelocations }],
          },
          {
            ItemsName: "Narration",
            Validations: [{ Required: true }, { Type: "text" }],
          },
          {
            ItemsName: "DebitAccount",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.AccountList.map((x) => {
                return x.aCCD;
              }),
            }
            ]
          },
          {
            ItemsName: "Amount",
            Validations: [{ Required: true }, { Numeric: true }, { MinValue: 1 }],
          },
          {
            ItemsName: "GSTApplicable",
            Validations: [{ Required: true }, { Type: "text" }, { YN: true }],
          },
          {
            ItemsName: "GSTRate",
            Validations: [{ Required: true }, { Numeric: true }],
          },
          {
            ItemsName: "RCM",
            Validations: [{ Required: true }, { Type: "text" }, { YN: true }],
          },
          {
            ItemsName: "SACCode",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.SachsnList.map((x) => {
                return x.SHCD;
              }),
            }
            ]
          },
          {
            ItemsName: "StateofSupply",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.VendorList.map((x) => {
                return x.vendorState;
              }),
            }
            ]
          },
          {
            ItemsName: "StateOfBilling",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.CompanyMastersData.map((x) => {
                return x.StateName;
              }),
            }
            ]
          },
          {
            ItemsName: "VendorGSTNO",
            Validations: [{ Required: true }, { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" },
            {
              TakeFromArrayList: this.VendorList.map((x) => {
                return x.otherdetails[0].gstNumber;
              }),
            }
            ]
          },
          {
            ItemsName: "CompanyGSTNo",
            Validations: [{ Required: true }, { Pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" },
            {
              TakeFromArrayList: this.CompanyMastersData.map((x) => {
                return x.gstInNumber;
              }),
            }],
          },
          {
            ItemsName: "TDSRate",
            Validations: [{ Required: true }, { Numeric: true }],
          },
          {
            ItemsName: "TDSLedger",
            Validations: [{ Required: true },
            {
              TakeFromArrayList: this.TDSAccountList.map((x) => {
                return x.aCCD;
              }),
            }
            ]
          },

        ];

        const rPromise = firstValueFrom(this.xlsxUtils.validateData(jsonData, validationRules));

        rPromise.then(async response => {
          response.forEach((element) => {
            if (element.DebitAccount == "LIA001001") {
              element.error.push("Debit Account Should Not Be LIA001001 Account");
            }
          });

          // Filter out objects with errors
          const objectsWithoutErrors = response.filter(obj => obj.error == null || obj.error.length === 0);
          const objectsWithErrors = response.filter(obj => obj.error != null);

          const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];
          this.OpenPreview(sortedValidatedData);
        });

      });
    }
  }


  OpenPreview(results) {
    const dialogRef = this.dialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.BookVendorBill(result)
      }
    });
  }



  //#region to download template file
  Download(): void {
    let link = document.createElement("a");
    link.download = "VendorWiseOpeningBalanceUploadFormate";
    link.href = "assets/Download/VendorWiseOpeningBalanceUploadFormate.xlsx";
    link.click();
  }


  cancel(tabIndex: string): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  BookVendorBill(jsonData) {
    if (jsonData.length === 0) {
      this.snackBarUtilityService.ShowCommonSwal("info", "Please Add Atleast One Record in Upload File");
      return;
    }

    this.snackBarUtilityService.commonToast(async () => {
      try {
        const Response = [];
        for (let i = 0; i < jsonData.length; i++) {
          const data = jsonData[i];
          const BillResult = await firstValueFrom(this.createVendorBillRequest(data));
          const VoucherResult = await firstValueFrom(this.createJournalRequest(data, BillResult?.data.data.ops[0].docNo));
          const ResultObject = {
            BillNo: BillResult?.data.data.ops[0].docNo,
            VoucherNo: VoucherResult.data.ops[0].vNO,
            Status: "Success"
          };
          Response.push(ResultObject);
        }
        Swal.hideLoading();
        Swal.close();
        this.DisplayResult(Response);

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error);
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 2000);
      }
    }, "Opening Balance Voucher Generating..!");
  }

  DisplayResult(Response) {
    this.tableData = Response;
    this.tableLoad = true;
  }
  createVendorBillRequest(data: any): Observable<any> {
    // Get Vendors Details Based on Vendpor Code
    const VendorDetails = this.VendorList.find((x) => x.vendorCode === data.VendorCode);
    const TDSExempted = parseFloat(data.TDSRate) === 0 ? true : false;
    const TDSAmount = TDSExempted ? 0 : (parseFloat(data.Amount) * parseFloat(data.TDSRate)) / 100;
    const TDSLedger = this.TDSAccountList.find((x) => x.aCCD === data.TDSLedger);

    const SACCode = this.SachsnList.find((x) => x.SHCD === data.SACCode);

    const isSameState = data.StateofSupply.replace(/\s+/g, '').toUpperCase() === data.StateOfBilling.replace(/\s+/g, '').toUpperCase();
    const gstRate = parseFloat(data.GSTRate) || 0.00;
    const amount = parseFloat(data.Amount) || 0.00;
    const gstApplicable = data.GSTApplicable === "Y";
    const gstAmount = gstApplicable ? (amount * gstRate) / 100 : 0.00;

    // Calculate Total Amount
    const totalAmount = (amount + gstAmount) - TDSAmount;


    const vendorBillEntry: VendorBillEntry = {
      companyCode: this.storage.companyCode,
      docType: "VB",
      branch: this.storage.branch,
      finYear: financialYear,
      data: {
        cID: this.storage.companyCode,
        docNo: "",
        bDT: new Date(),
        tMOD: "",
        lOC: VendorDetails?.vendorCity,
        sT: data.StateofSupply,
        gSTIN: data.VendorGSTNO,
        tHCAMT: totalAmount,
        aDVAMT: 0,
        bALAMT: totalAmount,
        rOUNOFFAMT: 0,
        bALPBAMT: totalAmount,
        bSTAT: 1,
        bSTATNM: "Awaiting Approval",
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName,
        vND: {
          cD: VendorDetails?.vendorCode,
          nM: VendorDetails?.vendorName,
          pAN: VendorDetails?.panNo,
          aDD: VendorDetails?.vendorAddress,
          mOB: VendorDetails?.vendorPhoneNo ? VendorDetails?.vendorPhoneNo.toString() : "",
          eML: VendorDetails?.emailId,
          gSTREG: VendorDetails?.gstNumber,
          sT: VendorDetails?.vendorState,
          gSTIN: VendorDetails?.gstNumber,
        },
        tDS: {
          eXMT: TDSExempted,
          sEC: !TDSExempted ? TDSLedger.aCCD : "",
          sECD: !TDSExempted ? TDSLedger.aCNM : "",
          rATE: !TDSExempted ? parseFloat(data.TDSRate) : 0,
          aMT: !TDSExempted ? TDSAmount : 0,
        },
        gST: {
          sAC: SACCode?.SHCD || "",
          sACNM: SACCode?.SNM || "",
          tYP: gstApplicable ? (isSameState ? "CGST,SGST" : "IGST") : "",
          rATE: gstRate || 0,
          iGRT: gstApplicable ? (isSameState ? 0 : gstRate) : 0,
          cGRT: gstApplicable ? (isSameState ? gstRate / 2 : 0) : 0,
          sGRT: gstApplicable ? (isSameState ? gstRate / 2 : 0) : 0,
          uGRT: 0,
          uGST: 0,
          iGST: gstApplicable ? (isSameState ? 0.00 : gstAmount) : 0.00,
          cGST: gstApplicable ? (isSameState ? gstAmount / 2 : 0.00) : 0.00,
          sGST: gstApplicable ? (isSameState ? gstAmount / 2 : 0.00) : 0.00,
          aMT: gstAmount,
        },
      },
      BillDetails: []
    };
    return this.voucherServicesService.FinancePost("finance/bill/vendor/create", vendorBillEntry).pipe(
      catchError((error) => {
        console.error('Error occurred while creating voucher:', error);
        return throwError(error);
      }),
    );
  }
  createJournalRequest(data: any, BillNo): Observable<any> {
    // Get Vendors Details Based on Vendpor Code
    const VendorDetails = this.VendorList.find((x) => x.vendorCode === data.VendorCode);
    const TDSExempted = parseFloat(data.TDSRate) === 0 ? true : false;
    const TDSAmount = TDSExempted ? 0 : (parseFloat(data.Amount) * parseFloat(data.TDSRate)) / 100;
    const TDSLedger = this.TDSAccountList.find((x) => x.aCCD === data.TDSLedger);

    const isSameState = data.StateofSupply.replace(/\s+/g, '').toUpperCase() === data.StateOfBilling.replace(/\s+/g, '').toUpperCase();
    const gstRate = parseFloat(data.GSTRate) || 0.00;
    const amount = parseFloat(data.Amount) || 0.00;
    const gstApplicable = data.GSTApplicable === "Y";
    const gstAmount = gstApplicable ? (amount * gstRate) / 100 : 0.00;

    // Calculate Total Amount
    const totalAmount = (amount + gstAmount) - TDSAmount;

    const voucherRequest = {
      companyCode: this.storage.companyCode,
      docType: "VR",
      branch: data.BillingBranch,
      finYear: financialYear,
      details: [],
      debitAgainstDocumentList: [],
      data: {
        transCode: VoucherInstanceType.VendorOpeningBalance,
        transType: VoucherInstanceType[VoucherInstanceType.VendorOpeningBalance],
        voucherCode: VoucherType.JournalVoucher,
        voucherType: VoucherType[VoucherType.JournalVoucher],
        transDate: new Date(),
        docType: "VR",
        branch: this.storage.branch,
        finYear: financialYear,
        accLocation: this.storage.branch,
        preperedFor: "Vendor",
        partyCode: VendorDetails.vendorCode,
        partyName: VendorDetails.vendorName,
        partyState: VendorDetails.vendorState,
        entryBy: this.storage.userName,
        entryDate: new Date(),
        panNo: VendorDetails.panNo,
        tdsSectionCode: TDSLedger.aCCD,
        tdsSectionName: TDSLedger.aCNM,
        tdsRate: parseFloat(data.TDSRate) || 0,
        tdsAmount: TDSAmount,
        tdsAtlineitem: false,
        tcsSectionCode: undefined,
        tcsSectionName: undefined,
        tcsRate: 0,
        tcsAmount: 0,
        IGST: gstApplicable ? (isSameState ? 0.00 : gstAmount) : 0.00,
        SGST: gstApplicable ? (isSameState ? gstAmount / 2 : 0.00) : 0.00,
        CGST: gstApplicable ? (isSameState ? gstAmount / 2 : 0.00) : 0.00,
        UGST: 0,
        GSTTotal: gstAmount,
        GrossAmount: totalAmount,
        netPayable: totalAmount,
        roundOff: 0,
        voucherCanceled: false,
        paymentMode: "",
        refNo: "",
        accountName: "",
        accountCode: "",
        date: "",
        scanSupportingDocument: "",
        transactionNumber: BillNo,
        mANNUM: data?.ManualBillNo,
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.GetJournalVoucherLedgers(data, BillNo);
    voucherRequest.details = voucherlineItems;

    // Validate debit and credit amounts
    if (voucherlineItems.reduce((acc, item) => acc + parseFloat(item.debit), 0) != voucherlineItems.reduce((acc, item) => acc + parseFloat(item.credit), 0)) {
      this.snackBarUtilityService.ShowCommonSwal("error", "Debit and Credit Amount Should be Equal");
      // Return an observable with an error
      return;
    }

    // Create and return an observable representing the HTTP request
    return this.voucherServicesService.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        let reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.VendorOpeningBalance,
          transType: VoucherInstanceType[VoucherInstanceType.VendorOpeningBalance],
          voucherCode: VoucherType.JournalVoucher,
          voucherType: VoucherType[VoucherType.JournalVoucher],
          docType: "Voucher",
          partyType: "Vendor",
          docNo: data.THC,
          partyCode: "" + VendorDetails.vendorCode || "",
          partyName: VendorDetails.vendorName || "",
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

        return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }
  GetJournalVoucherLedgers(data, BillNo) {
    const createVoucher = (
      accCode,
      accName,
      accCategory,
      debit,
      credit,
      RefNo,
      BillNo,
      sacCode = "",
      sacName = ""
    ) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.VendorOpeningBalance,
      transType: VoucherInstanceType[VoucherInstanceType.VendorOpeningBalance],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacCode,
      sacName: sacName,
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Vendor Bill Generated For : ${RefNo}  Against Bill No : ${BillNo}`,
    });

    const Result = [];
    //const DocumentList

    // Push Debit Account Data
    const AccountData = this.AccountList.find((x) => x.aCCD == data.DebitAccount);
    Result.push(createVoucher(AccountData.aCCD, AccountData.aCNM, AccountData.mRPNM, parseFloat(data.Amount), 0, data.ManualBillNo, BillNo));

    //#region Push TDS Sectiond Data
    if (+data.TDSRate != 0) {
      // calculate TDS Amount
      const TDSAmount = (parseFloat(data.TDSRate) / 100) * parseFloat(data.Amount);
      if (TDSAmount > 0) {
        // Get TDS Section Code and Name
        const TDSLedger = this.TDSAccountList.find((x) => x.aCCD == data.TDSLedger);
        if (TDSLedger) {
          Result.push(createVoucher(TDSLedger.aCCD, TDSLedger.aCNM, "LIABILITY", 0, TDSAmount, data.ManualBillNo, BillNo));
        }
      }
    }
    //#endregion

    //#region Push GST Data when GST Applicable
    if (data.GSTApplicable === "Y") {
      // Calculate GST Amount
      const GSTAmount = (parseFloat(data.GSTRate) / 100) * parseFloat(data.Amount);
      if (GSTAmount > 0) {
        // Get GST Section Code and Name
        const GSTLedger = this.AccountList.find((x) => x.aCCD == data.DebitAccount);
        if (GSTLedger) {
          const isSameState = data.StateofSupply.replace(/\s+/g, '').toUpperCase() === data.StateOfBilling.replace(/\s+/g, '').toUpperCase();
          if (isSameState) {
            Result.push(createVoucher(ledgerInfo["CGST"].LeadgerCode, ledgerInfo["CGST"].LeadgerName, ledgerInfo["CGST"].LeadgerCategory,
              GSTAmount / 2, 0, data.ManualBillNo, BillNo, GSTLedger.aCCD, GSTLedger.aCNM));
            Result.push(createVoucher(
              ledgerInfo["SGST"].LeadgerCode, ledgerInfo["SGST"].LeadgerName, ledgerInfo["SGST"].LeadgerCategory,
              GSTAmount / 2, 0, data.ManualBillNo, BillNo, GSTLedger.aCCD, GSTLedger.aCNM
            ));
          } else {
            Result.push(createVoucher(ledgerInfo["IGST"].LeadgerCode, ledgerInfo["IGST"].LeadgerName,
              ledgerInfo["IGST"].LeadgerCategory,
              GSTAmount, 0, data.ManualBillNo, BillNo, GSTLedger.aCCD, GSTLedger.aCNM));
          }
        }
      }
    }

    const TotalDebit = Result.reduce((a, b) => a + parseFloat(b.debit), 0);
    const TotalCredit = Result.reduce((a, b) => a + parseFloat(b.credit), 0);

    let difference = TotalDebit - TotalCredit;

    Result.push(
      createVoucher(
        ledgerInfo["LIA001001"].LeadgerCode,
        ledgerInfo["LIA001001"].LeadgerName,
        ledgerInfo["LIA001001"].LeadgerCategory,
        difference > 0 ? 0 : Math.abs(difference),
        difference < 0 ? 0 : Math.abs(difference),
        data.ManualBillNo,
        BillNo
      )
    );

    return Result;
  }
}
