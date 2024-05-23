import { Component, OnInit } from "@angular/core";
import { debitNoteGenerationControls } from 'src/assets/FormControls/debitnote-entry';
import { ConsignmentqueryControls } from "src/assets/FormControls/consignment-query";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { UntypedFormBuilder } from "@angular/forms";
import moment from "moment";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { MatDialog } from "@angular/material/dialog";
import { ModifyDebitNoteDetailsComponent } from "../../modify-debit-note-details/modify-debit-note-details/modify-debit-note-details.component";
import { EditOpeningBalanceLedgerWiseComponent } from "src/app/finance/FA Masters/Modals/edit-opening-balance-ledger-wise/edit-opening-balance-ledger-wise.component";
import { StorageService } from "src/app/core/service/storage.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { firstValueFrom } from "rxjs";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { DNTDetDataRequestModel, DNTHdrDataRequestModel, DebitNoteRequestModel } from "src/app/Models/Finance/Finance";
import { financialYear } from "src/app/Utility/date/date-utils";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import Swal from "sweetalert2";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
@Component({
  selector: 'app-debit-note-details',
  templateUrl: './debit-note-details.component.html',

})
export class DebitNoteDetailsComponent implements OnInit {

  DebitNoteDetailsJson: any;
  DebitNoteDetailsForm: any;
  csvFileName: string;
  addAndEditPath: string;
  tableLoad: boolean = true
  DebitNoteRequestModel = new DebitNoteRequestModel();
  DNTHdrDataRequestModel = new DNTHdrDataRequestModel();
  DNTDetDataRequestModel = new DNTDetDataRequestModel();

  menuItems = [{ label: "Modify" }];
  menuItemflag = true;
  linkArray = [{ Row: "Action", Path: "" }];


  toggleArray = [];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };

  breadscrums = [
    {
      title: "Debit Note Generation",
      items: ["Finance"],
      active: "Debit Note Generation",
    },
  ];

  columnHeader = {
    // checkBoxRequired: {
    //   Title: "",
    //   class: "matcolumncenter",
    //   Style: "max-width:80px",
    // },
    docNo: {
      Title: "Bill number​",
      class: "matcolumncenter",
      Style: "max-width: 3  50px",
      datatype: "string",
      sticky: true
    },
    bALAMT: {
      Title: "Bill Amount",
      class: "matcolumnright",
      Style: "max-width: 80px",
    },
    bALPBAMT: {
      Title: "Pending Amount",
      class: "matcolumnright",
      Style: "max-width: 80px",
    },
    gST1: {
      Title: "GST Rate​",
      class: "matcolumnright",
      Style: "max-width: 60px",
    },
    gstTYPE: {
      Title: "GST Type",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    dNAMT: {
      Title: "Debit Note amount",
      class: "matcolumnright",
      Style: "max-width: 80px",
    },
    gstRevlAmt: {
      Title: "GST reversal",
      class: "matcolumnright",
      Style: "max-width: 80px",
    },
    tdsRevlAmt: {
      Title: "TDS reversal",
      class: "matcolumnright",
      Style: "max-width: 80px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:7%",
      stickyEnd: true
    }
  }
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = [

    "docNo",
    "bALAMT",
    "bALPBAMT",
    "gST1",
    "gstTYPE",
    "dNAMT",
    "gstRevlAmt",
    "tdsRevlAmt",
  ]

  DataResponseVenBillHeader: any;
  VendorBillData: any;
  dNoteData: any;
  hdnbillno: any;
  hdnfromdate: any;
  hdntodate: any;
  vendorcode: any;
  vendorname: any;
  TotalAmountList: { count: any; title: string; class: string }[];
  TotalAMOUNT: number;
  TotalGSTAMOUNT: number;
  TotalTDSAMOUNT: number;
  dntDetDataRequestList: any = [];
  hsnDataResponse: any;
  InvoiceNumberCode: any;
  InvoiceNumberCodeStatus: any;
  hsnReasonDataResponse: any;
  isUpdate: number;
  reasonvalue: any;
  hsnSacDataResponse: any;
  ledgervalue: any;


  constructor(
    private fb: UntypedFormBuilder,
    private matDialog: MatDialog,
    private Route: Router, private storage: StorageService, private masterService: MasterService,
    public snackBarUtilityService: SnackBarUtilityService,
    private voucherServicesService: VoucherServicesService,
    private navigationService: NavigationService,
    private filter: FilterUtils,) {
    const extrasState = this.Route.getCurrentNavigation()?.extras?.state;
    this.hdnbillno = extrasState.billNO.value;
    // this.hdnfromdate = extrasState.start;
    // this.hdntodate = extrasState.end;
    // this.vendorcode = extrasState.extrasState
    // this.vendorname = extrasState.vendorname
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.getData();

    this.TotalAmountList = [
      {
        count: "0.00",
        title: "Total Debit Amount",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Total GST Amount",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Total TDS Amopunt",
        class: `color-Success-light`,
      },
    ];
  }

  initializeFormControl() {
    const DebitNoteDetailsFormControls = new debitNoteGenerationControls();
    this.DebitNoteDetailsJson = DebitNoteDetailsFormControls.getdebitNotesDetails();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.DebitNoteDetailsForm = formGroupBuilder(this.fb, [this.DebitNoteDetailsJson,]);
    this.checkbox();
    this.ReasonBind();
    this.LedgerBind();
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async checkbox() {
    //const isSelected = $event.filter((x) => x.isSelected == true);
    let totalAMT = 0, totalSAMT = 0, totalGSTAMT = 0, total = 0;
    // Calculate totals based on table data
    this.dNoteData.forEach(item => {
      //if (item.isSelected) {
        totalAMT += parseFloat(item.dNAMT);
        totalSAMT += parseFloat(item.gstRevlAmt);
        totalGSTAMT += parseFloat(item.tdsRevlAmt);
     // }
    });
    // Update total amounts in the list
    this.TotalAmountList[0].count = totalAMT;
    this.TotalAmountList[1].count = totalSAMT;
    this.TotalAmountList[2].count = totalGSTAMT;
    this.TotalAMOUNT = totalAMT;
    this.TotalGSTAMOUNT = totalSAMT;
    this.TotalTDSAMOUNT =totalGSTAMT;

  }
  async handleMenuItemClick(data) {
    // const EditableId = this.dNoteData[0].billNO;
    const EditableId = data.data?.docNo
    const dialogRef = this.matDialog.open(ModifyDebitNoteDetailsComponent, {
      data: data.data,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          const tableData = this.dNoteData.find(x => x.docNo === EditableId);
          if (tableData) {
            tableData.gstRevlAmt = result.GstRevAmount;
            tableData.dNAMT = result.DebitAmount;
            tableData.tdsRevlAmt = result.TdsRevAmount;

            this.dNoteData.gstRevlAmt = result.GstRevAmount;
            this.dNoteData.dNAMT = result.DebitAmount;
            this.dNoteData.tdsRevlAmt = result.TdsRevAmount;
            this.checkbox() ;
          } else {
            // Handle the case where the object with the specified _id is not found
            console.log("Editable item not found!");
          }
        }
      }
    });
  }

  async getData() {
    const BodyDataHeader = {
      companyCode: this.storage.companyCode,
      collectionName: "vend_bill_summary",
      filter: {
        'D$expr': {
          'D$and': [
            // Check if Value is defined before checking cUST.cD
            this.hdnbillno !== "" && { 'D$eq': ['$docNo', this.hdnbillno] },
            // Check if bALAMT is greater than 0
            { 'D$gt': ['$bALPBAMT', 0] }
              // && { 'D$eq': ['$vND.cD', this.vendorcode] }
            
          ].filter(Boolean) // Remove undefined elements from the array
        }
      }
    };

    this.DataResponseVenBillHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));
    this.DataResponseVenBillHeader.data.forEach(item => {
      item.actions = ["Modify"];
    });

    this.dNoteData = this.DataResponseVenBillHeader.data
      .map((item) => {
        return {
          ...item,
          gST1: item.gST.rATE,
          gstTYPE: item.gST.tYP,
          dNAMT: item.bALPBAMT,
          gstRevlAmt: parseFloat((((item.bALPBAMT) / (1 + (item.gST.rATE / 100)) * (item.gST.rATE / 100))).toFixed(2)),
          tdsRevlAmt: ((item.bALPBAMT - parseFloat((((item.bALPBAMT) / (1 + (item.gST.rATE / 100)) * (item.gST.rATE / 100))).toFixed(2))) * (item.tDS.rATE / 100)).toFixed(2)
        }
      });

    this.DebitNoteDetailsForm.controls["VendorName"]
      .setValue(this.DataResponseVenBillHeader?.data[0].vND.cD + ':' + this.DataResponseVenBillHeader?.data[0].vND.nM);
    this.DebitNoteDetailsForm.controls["DNdate"]
      .setValue(new Date());
    this.checkbox();
  }

  async ReasonBind() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "General_master",
      filter: { codeType: "DNTREMARK" },
    };

    this.hsnReasonDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnReasonDataResponse.data.map(x => ({ name: x.codeDesc, value: x.codeId }));

    if (this.isUpdate == 1) {
      const element = hsnData.find(
        (x) => x.value == this.reasonvalue
      );
      this.DebitNoteDetailsForm.controls["Reason"].setValue(element);
    }
    this.filter.Filter(
      this.DebitNoteDetailsJson,
      this.DebitNoteDetailsForm,
      hsnData,
      "Reason",
      true
    );
  }


  async LedgerBind() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "account_detail",
      filter: { mRPNM: "EXPENSE" },
    };

    this.hsnSacDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnSacDataResponse.data.map(x => ({ name: x.aCNM, value: x.aCCD }));

    if (this.isUpdate == 1) {
      const element = hsnData.find(
        (x) => x.value == this.ledgervalue
      );
      this.DebitNoteDetailsForm.controls["Ledgeraccount"].setValue(element);
    }

    this.filter.Filter(
      this.DebitNoteDetailsJson,
      this.DebitNoteDetailsForm,
      hsnData,
      "Ledgeraccount",
      true
    );

  }
  
    
  updateTotalAmounts() {
    // Initialize total amounts
    let totalAMT = 0, totalSAMT = 0, totalGSTAMT = 0, total = 0;
    // Calculate totals based on table data
    this.dNoteData.forEach(item => {
      totalAMT += (item.dNAMT);
      totalSAMT += (item.gstRevlAmt);
      totalGSTAMT += (item.gstRevlAmt);
      //total += parseFloat(item.Total);
    });

    // Update total amounts in the list
    this.TotalAmountList[0].count = totalAMT.toFixed(2);
    this.TotalAmountList[1].count = totalSAMT.toFixed(2);
    this.TotalAmountList[2].count = totalGSTAMT.toFixed(2);
    this.TotalAmountList[3].count = total.toFixed(2);

  }

  async save() {
    console.log(this.dNoteData)
    debugger
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.DebitNoteRequestModel.companyCode = this.storage.companyCode;
        this.DebitNoteRequestModel.docType = "DBNT";
        this.DebitNoteRequestModel.branch = this.storage.branch;
        this.DebitNoteRequestModel.finYear = financialYear;

        //Header data 
        this.DNTHdrDataRequestModel._id = "";
        this.DNTHdrDataRequestModel.cID = this.storage.companyCode; // assuming cID is a number, assign 0 for empty
        this.DNTHdrDataRequestModel.docNo = "";
        this.DNTHdrDataRequestModel.tYP = "D";
        this.DNTHdrDataRequestModel.nTNO = "";
        this.DNTDetDataRequestModel.bILLNO = this.dNoteData[0].docNo;
        this.DNTHdrDataRequestModel.nTDT = new Date();
        this.DNTHdrDataRequestModel.lOC = this.storage.branch;
        //this.DNTHdrDataRequestModel.pARTY = { cD: this.hsnInvoiceDataResponse.data[0].cUST.cD, nM: this.hsnInvoiceDataResponse.data[0].cUST.nM }; // assigning empty objects for PARTY and GST

        this.DNTHdrDataRequestModel.pARTY = {
          cD: this.dNoteData[0].vND.cD,
          nM: this.dNoteData[0].vND.nM,
          tEL: this.dNoteData[0].vND.mOB
        };
        this.DNTHdrDataRequestModel.gST = { aMT: this.TotalGSTAMOUNT }; // assuming gST is an object with property aMT, assign 0 for empty
        this.DNTHdrDataRequestModel.tXBLAMT = this.TotalAMOUNT - this.TotalGSTAMOUNT;
        this.DNTHdrDataRequestModel.aMT = this.TotalAMOUNT;
        this.DNTHdrDataRequestModel.tdsAMT = this.TotalTDSAMOUNT;
        this.DNTHdrDataRequestModel.nTRESCD = this.DebitNoteDetailsForm.value.Reason?.value;
        this.DNTHdrDataRequestModel.nTRESNM = this.DebitNoteDetailsForm.value.Reason?.name,
        this.DNTHdrDataRequestModel.aCCD = this.DebitNoteDetailsForm.value.Ledgeraccount?.value;
        this.DNTHdrDataRequestModel.aCNM = this.DebitNoteDetailsForm.value.Ledgeraccount?.name;
        this.DNTHdrDataRequestModel.sTS = 1;
        this.DNTHdrDataRequestModel.sTSNM = "Generated";
        this.DNTHdrDataRequestModel.sTSBY = this.storage.loginName;
        this.DNTHdrDataRequestModel.sTSDT = new Date();
        this.DNTHdrDataRequestModel.vNO = "";
        this.DNTHdrDataRequestModel.eNTDT = new Date();
        this.DNTHdrDataRequestModel.eNTLOC = this.storage.branch;
        this.DNTHdrDataRequestModel.eNTBY = this.storage.loginName;


        this.DNTDetDataRequestModel._id = "";
        this.DNTDetDataRequestModel.cID = this.storage.companyCode,
        this.DNTDetDataRequestModel.docNo ="",
        this.DNTDetDataRequestModel.tYP = "D";
        this.DNTDetDataRequestModel.nTNO ="";
        this.DNTDetDataRequestModel.nTDT = new Date();
        this.DNTDetDataRequestModel.bILLNO = this.dNoteData[0].docNo;
        this.DNTDetDataRequestModel.bGNDT = "";
        this.DNTDetDataRequestModel.pARTY = {
          cD: this.dNoteData[0].vND.cD,
          nM: this.dNoteData[0].vND.nM,
          tEL: this.dNoteData[0].vND.mOB
        };
        this.DNTDetDataRequestModel.bAMT= this.dNoteData[0].bALPBAMT - this.dNoteData[0].dNAMT,
        this.DNTDetDataRequestModel.bALAMT= this.dNoteData[0].bALAMT,
        this.DNTDetDataRequestModel.tXBLAMT=this.dNoteData[0].dNAMT - this.dNoteData[0].gstRevlAmt,
        this.DNTDetDataRequestModel.aMT= this.dNoteData[0].dNAMT,
        this.DNTDetDataRequestModel.eXMT= false,
        this.DNTDetDataRequestModel.eXMTRES= "",
        this.DNTDetDataRequestModel.gST= {
          hSCD: this.dNoteData[0].gST.sAC,
          hSNM: this.dNoteData[0].gST.sACNM,
          tYP: this.dNoteData[0].gST.tYP,
          rATE: this.dNoteData[0].gST.rATE,
          iGRT: this.dNoteData[0].gST.iGRT,
          cGRT: this.dNoteData[0].gST.cGRT,
          sGRT: this.dNoteData[0].gST.sGRT,
          iGST: this.dNoteData[0].gST.iGRT > 0 ? this.dNoteData[0].gstRevlAmt : 0,
          cGST: this.dNoteData[0].gST.cGRT > 0 ? this.dNoteData[0].gstRevlAmt / 2 : 0,
          sGST: this.dNoteData[0].gST.sGRT > 0 ? this.dNoteData[0].gstRevlAmt / 2 : 0,
          aMT: this.dNoteData[0].gstRevlAmt
        },
        this.DNTDetDataRequestModel.tDS= {
          aMT: this.dNoteData[0].tDS.aMT,
          eXMT: this.dNoteData[0].tDS.eXMT,
          rATE: this.dNoteData[0].tDS.rATE,
          sEC: this.dNoteData[0].tDS.sEC,
          sECD: this.dNoteData[0].tDS.sECD,

        },
        this.DNTDetDataRequestModel.eNTDT= new Date(),
        this.DNTDetDataRequestModel.eNTLOC= this.storage.branch,
        this.DNTDetDataRequestModel.eNTBY= this.storage.loginName,
        this.DNTDetDataRequestModel.mODDT= null,
        this.DNTDetDataRequestModel.mODLOC= "",
        this.DNTDetDataRequestModel.mODBY= "",
        this.DNTDetDataRequestModel.remark= this.DebitNoteDetailsForm.value.Remarks,

        //Detasils data
        // Assuming this.dNoteData is an array of objects
        // this.dntDetDataRequestList = [];
        // this.dNoteData.forEach(noteData => {
        //   // Check if the current noteData is selected
        //     let DNTDetDataRequestModel = {
        //       _id: "",
        //       cID: this.storage.companyCode,
        //       docNo: noteData.docNo,
        //       tYP: "D",
        //       nTNO: "",
        //       nTDT: new Date(),
        //       lOC: this.storage.branch,
        //       bILLNO: noteData.docNo,
        //       bGNDT: noteData.bDT,
        //       pARTY: {
        //         cD: noteData.vND.cD,
        //         nM: noteData.vND.nM,
        //         tEL: noteData.vND.mOB,
        //       },
        //       bAMT: noteData.bALPBAMT - noteData.dNAMT,
        //       bALAMT: noteData.bALAMT,
        //       tXBLAMT: noteData.dNAMT - noteData.gstRevlAmt,
        //       aMT: noteData.dNAMT,
        //       eXMT: 1,
        //       eXMTRES: "",
        //       gST: {
        //         hSCD: noteData.gST.sAC,
        //         hSNM: noteData.gST.sACNM,
        //         tYP: noteData.gST.tYP,
        //         rATE: noteData.gST.rATE,
        //         iGRT: noteData.gST.iGRT,
        //         cGRT: noteData.gST.cGRT,
        //         sGRT: noteData.gST.sGRT,
        //         iGST: noteData.gST.iGRT > 0 ? noteData.gstRevlAmt : 0,
        //         cGST: noteData.gST.cGRT > 0 ? noteData.gstRevlAmt / 2 : 0,
        //         sGST: noteData.gST.sGRT > 0 ? noteData.gstRevlAmt / 2 : 0,
        //         aMT: noteData.gstRevlAmt
        //       },
        //       tdsAMT:noteData.tdsRevlAmt,
        //       eNTDT: new Date(),
        //       eNTLOC: this.storage.branch,
        //       eNTBY: this.storage.loginName,
        //       mODDT: null,
        //       mODLOC: "",
        //       mODBY: ""
        //    };

        //     // Add the initialized model to the list
        //     this.dntDetDataRequestList.push(DNTDetDataRequestModel);
        //   //}
        // });

        this.DebitNoteRequestModel.data = this.DNTHdrDataRequestModel;
        this.DebitNoteRequestModel.Headerdata = this.DNTHdrDataRequestModel;
        this.DebitNoteRequestModel.Detailsdata = this.DNTDetDataRequestModel;
        firstValueFrom(
          this.voucherServicesService.FinancePost(
            "fin/account/CreditNoteEntry",
            this.DebitNoteRequestModel
          )
        )
          .then((res: any) => {
            if (res.success) {
              this.dNoteData.forEach(noteData => {
                // Check if the current noteData is selected
                  const req = {
                    companyCode: this.storage.companyCode,
                    collectionName: "vend_bill_summary",
                    filter: { docNo:  noteData.docNo },
                    update: {
                      bALPBAMT: noteData.bALPBAMT - noteData.dNAMT,
                    },
                  };
                  const res = firstValueFrom(
                    this.masterService.masterPut("generic/update", req))
              });

              Swal.fire({
                icon: "success",
                title: "Debit Note Created Successfully",
                text: "Debit Note No: " + res?.data?.mainData + "Vendor Name:" + res?.data?.details.ops[0].pARTY.cD + ":" + res?.data?.details.ops[0].pARTY.nM,
                showConfirmButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.hideLoading();
                  setTimeout(() => {
                    Swal.close();
                  }, 2000);
                  this.Route.navigate(["Finance/VendorPayment/Dashboard"])
                }
              });
            }
          })
          .catch((error) => {
            this.snackBarUtilityService.ShowCommonSwal("error", error);
          })
          .finally(() => { });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
    }, "Debit Note Generating..!");

  }

}
