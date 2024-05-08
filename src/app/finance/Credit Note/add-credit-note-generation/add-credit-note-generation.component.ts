import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditnoteGenerationControls } from 'src/assets/FormControls/creditnote-entry';
import { customerFromApi } from '../../Debit Voucher/debitvoucherAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { name } from '@azure/msal-angular/packageMetadata';
import { validateHeaderName } from 'http';
import Swal from 'sweetalert2';
import { CNTDetDataRequestModel, CNTHdrDataRequestModel, CreditNoteRequestModel, VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { Console, debug } from 'console';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-credit-note-generation',
  templateUrl: './add-credit-note-generation.component.html'
})
export class AddCreditNoteGenerationComponent implements OnInit {
  iSShow: boolean = true;
  creditnote: boolean;
  updatecreditnote: boolean = true;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  CreditNoteRequestModel = new CreditNoteRequestModel();
  CNTHdrDataRequestModel = new CNTHdrDataRequestModel();
  CNTDetDataRequestModel = new CNTDetDataRequestModel();
  CreditnoteGenerationFormControls: CreditnoteGenerationControls;
  CreditnoteGenerationTableForm: UntypedFormGroup;
  CreditnoteGenerationFormTableForm: UntypedFormGroup;
  creditnotedetailTableForm: UntypedFormGroup;
  CreditnoteGenerationjsonControlArray: any;
  CreditnoteGenerationFormjsonControlArray: any;
  creditnotedetailjsonControlArray: any;
  backPath: string;
  GstAmount: number;
  Gstrate: number;
  IgstRate: number;
  CgstRate: number;
  SgstRate: number;
  breadScrums = [
    {
      title: "Credit Note Entry",
      items: ["Finance"],
      active: "Credit Note Entry",
    },
  ];
  hsnDataResponse: any;
  hsnSacDataResponse: any;
  hsnReasonDataResponse: any;
  InvoiceNumber: any;
  InvoiceNumberCode: any;
  InvoiceNumberCodeStatus: any;
  hsnInvoiceDataResponse: any;
  SACCode: any;
  SACCodeCodeStatus: any;
  ReasonCode: any;
  ReasonCodeStatus: any;
  LedgerCode: any;
  LedgerCodeStatus: any;
  action: string;
  isUpdate: number;
  hdninvoiceno: any;
  hdncreditno: any;
  hsnCreditDataResponse: any;
  ledgervalue: any;
  reasonvalue: any;
  DataResponseHeader: any;
  DataResponseDetails: any;
  tableData: any;
  CGSTAmt: number;
  hdncnamt: any;
  InvoiceDataResponse: any;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils, private storage: StorageService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private navigationService: NavigationService,
    private route: Router,) {
    const extrasState = this.route.getCurrentNavigation()?.extras?.state;
    this.isUpdate = 0;
    this.action = extrasState ? "edit" : "add";
    if (this.action == "edit") {
      if (extrasState.data.label.label == "Modify") {
        this.isUpdate = 1;
        this.updatecreditnote = false;
        this.hdninvoiceno = extrasState.data.data.docNo;
        this.hdncreditno = extrasState.data.data.nTNO;
      }
      if (extrasState.data.label.label == "Approve") {
        this.isUpdate = 2;
        this.updatecreditnote = false;
        this.hdninvoiceno = extrasState.data.data.docNo;
        this.hdncreditno = extrasState.data.data.nTNO;
      }
      if (extrasState.data.label.label == "Cancel") {
        this.isUpdate = 3;
        this.updatecreditnote = false;
        this.hdninvoiceno = extrasState.data.data.docNo;
        this.hdncreditno = extrasState.data.data.nTNO;
        this.hdncnamt = extrasState.data.data.aMT;
      }
    }
  }

  ngOnInit(): void {
    this.InitializeFormControl();
    this.bindDropdown();
    this.cancel();
    this.approval();
  }
  async Dataform() {
    this.creditnote = true;
    this.creditnote = true;

    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filter: { bILLNO: this.CreditnoteGenerationTableForm.value.InvoiceNumber.value },
    };

    this.hsnInvoiceDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    this.CreditnoteGenerationFormTableForm.controls["InvoiceDate"].setValue(this.hsnInvoiceDataResponse?.data[0].bGNDT || "");
    this.CreditnoteGenerationFormTableForm.controls["InvoiceDate"].setValue(
      this.hsnInvoiceDataResponse?.data[0]?.bGNDT
        ? `${new Date(this.hsnInvoiceDataResponse.data[0].bGNDT).getDate()}-${new Date(this.hsnInvoiceDataResponse.data[0].bGNDT).toLocaleString('default', { month: 'short' })}-${new Date(this.hsnInvoiceDataResponse.data[0].bGNDT).getFullYear().toString().slice(-2)}`
        : ""
    );
    this.CreditnoteGenerationFormTableForm.controls["InvoiceBranch"].setValue(this.hsnInvoiceDataResponse?.data[0].bLOC || "");
    this.CreditnoteGenerationFormTableForm.controls["GSTRate"].setValue(this.hsnInvoiceDataResponse?.data[0].gST.rATE || "");
    this.CreditnoteGenerationFormTableForm.controls["InvoiceAmt"].setValue(this.hsnInvoiceDataResponse?.data[0].aMT || "");
    this.CreditnoteGenerationFormTableForm.controls["InvoiceType"].setValue(this.hsnInvoiceDataResponse?.data[0].bUSVRT || "");
    this.CreditnoteGenerationFormTableForm.controls["GSTType"].setValue(this.hsnInvoiceDataResponse?.data[0].gST.tYP || "");
    this.CreditnoteGenerationFormTableForm.controls["PendingAmt"].setValue(this.hsnInvoiceDataResponse?.data[0].cOL.bALAMT || "");
    this.CreditnoteGenerationFormTableForm.controls["InvoiceStatus"].setValue(this.hsnInvoiceDataResponse?.data[0].bSTSNM || "");
    this.CreditnoteGenerationFormTableForm.controls["SACCode"].setValue(this.CreditnoteGenerationFormTableForm.value.sacCode);

    this.creditnotedetailTableForm.controls["CreditNoteAmt"].setValue(this.hsnInvoiceDataResponse?.data[0].cOL.bALAMT || "");
    this.AddCrAmount();
    this.SacCodeBind();
  }
  InitializeFormControl() {
    this.CreditnoteGenerationFormControls = new CreditnoteGenerationControls();
    // Get form controls for job Entry form section
    this.CreditnoteGenerationjsonControlArray = this.CreditnoteGenerationFormControls.getCreditnoteGenerationControls();
    // Build the form group using formGroupBuilder function
    this.CreditnoteGenerationTableForm = formGroupBuilder(this.fb, [this.CreditnoteGenerationjsonControlArray]);

    this.CreditnoteGenerationFormjsonControlArray = this.CreditnoteGenerationFormControls.getCreditnoteGenerationFromControls();
    // Build the form group using formGroupBuilder function
    this.CreditnoteGenerationFormTableForm = formGroupBuilder(this.fb, [this.CreditnoteGenerationFormjsonControlArray]);

    this.creditnotedetailjsonControlArray = this.CreditnoteGenerationFormControls.getcreditnotedetailControls();
    // Build the form group using formGroupBuilder function
    this.creditnotedetailTableForm = formGroupBuilder(this.fb, [this.creditnotedetailjsonControlArray]);
    if (this.isUpdate == 1) {
      this.CreditnoteGenerationTableForm.controls["InvoiceNumber"].setValue(this.hdninvoiceno);
      this.Dataform()
      this.update();
    }
    this.Getcustomer();
    this.PreparedforFieldChanged(event);
    this.SacCodeBind();
    this.ReasonBind();
    this.LedgerBind();

  }

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  // Customer DropDown Binding
  async Getcustomer() {
    let responseFromAPI = [];
    responseFromAPI = await customerFromApi(this.masterService)
    this.filter.Filter(
      this.CreditnoteGenerationjsonControlArray,
      this.CreditnoteGenerationTableForm,
      responseFromAPI,
      "CustomerName",
      false
    );
  }

  bindDropdown() {
    this.CreditnoteGenerationjsonControlArray.forEach((data) => {
      if (data.name === "InvoiceNumber") {
        // Set category-related variables
        this.InvoiceNumberCode = data.name;
        this.InvoiceNumberCodeStatus = data.additionalData.showNameAndValue;
      }

      if (data.name === "SACCode") {
        // Set category-related variables
        this.SACCode = data.name;
        this.SACCodeCodeStatus = data.additionalData.showNameAndValue;
      }
    });

    this.creditnotedetailjsonControlArray.forEach((data) => {
      if (data.name === "Reason") {
        // Set category-related variables
        this.ReasonCode = data.name;
        this.ReasonCodeStatus = data.additionalData.showNameAndValue;
      }

      if (data.name === "Ledgeraccount") {
        // Set category-related variables
        this.LedgerCode = data.name;
        this.LedgerCodeStatus = data.additionalData.showNameAndValue;
      }

    });

  }

  // On Customer Change DropDown Binding
  async PreparedforFieldChanged(event) {
    const Value = this.CreditnoteGenerationTableForm.value.CustomerName.value
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filter: {
        'D$expr': {
          'D$and': [
            // Check if Value is defined before checking cUST.cD
            Value !== undefined && { 'D$eq': ['$cUST.cD', Value] },
            // Check if bALAMT is greater than 0
            { 'D$gt': ['$cOL.bALAMT', 0] }
          ].filter(Boolean) // Remove undefined elements from the array
        }
      }
    };


    this.hsnDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnDataResponse.data.map(x => ({ name: x.bILLNO, value: x.bILLNO }));
    // Call the 'Filter' function with the filtered 'vendor' array and other parameters
    this.filter.Filter(
      this.CreditnoteGenerationjsonControlArray,
      this.CreditnoteGenerationTableForm,
      hsnData,
      this.InvoiceNumberCode,
      this.InvoiceNumberCodeStatus
    );

  }

  async InvoiceNumberChange(event) {
    this.creditnote = false;
    this.creditnote = false;
    this.CreditnoteGenerationTableForm.reset();
  }

  async SacCodeBind() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "sachsn_master",
      filter: { _id: "SAC-996511" },
    };

    this.hsnSacDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnSacDataResponse.data.map(x => ({ name: x.SNM, value: x.SHCD }));
    this.filter.Filter(
      this.CreditnoteGenerationFormjsonControlArray,
      this.CreditnoteGenerationFormTableForm,
      hsnData,
      "SACCode",
      true
    );

    this.CreditnoteGenerationFormTableForm.controls["SACCode"].setValue(hsnData[0]);
  }

  async ReasonBind() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "General_master",
      filter: { codeType: "CNTREMARK" },
    };

    this.hsnReasonDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnReasonDataResponse.data.map(x => ({ name: x.codeDesc, value: x.codeId }));

    if (this.isUpdate == 1) {
      const element = hsnData.find(
        (x) => x.value == this.reasonvalue
      );
      this.creditnotedetailTableForm.controls["Reason"].setValue(element);
    }
    this.filter.Filter(
      this.creditnotedetailjsonControlArray,
      this.creditnotedetailTableForm,
      hsnData,
      "Reason",
      true
    );
  }

  async LedgerBind() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "account_detail",
      filter: { mRPNM: "INCOME" },
    };

    this.hsnSacDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const hsnData = this.hsnSacDataResponse.data.map(x => ({ name: x.aCNM, value: x.aCCD }));

    if (this.isUpdate == 1) {
      const element = hsnData.find(
        (x) => x.value == this.ledgervalue
      );
      this.creditnotedetailTableForm.controls["Ledgeraccount"].setValue(element);
    }

    this.filter.Filter(
      this.creditnotedetailjsonControlArray,
      this.creditnotedetailTableForm,
      hsnData,
      "Ledgeraccount",
      true
    );

  }

  // Gst Calculation Logic
  AddCrAmount() {
    const PendingAmount = this.CreditnoteGenerationFormTableForm.get("PendingAmt").value;
    const CreditnoteAmount = this.creditnotedetailTableForm.get("CreditNoteAmt").value;
    const Gsttype = this.CreditnoteGenerationFormTableForm.get("GSTType").value;
    this.Gstrate = this.CreditnoteGenerationFormTableForm.get("GSTRate").value;

    if (PendingAmount < CreditnoteAmount) {
      // If billingParty is not the same for all elements, show an informative message
      Swal.fire({
        icon: "info",
        title: "Credit Note Amount Not Greater Than Pending Amount!!!",
        showConfirmButton: true,
      });
      this.creditnotedetailTableForm.controls.CreditNoteAmt.reset();
      // Return or handle accordingly
      return;
    }

    if (Gsttype == "SGST" || Gsttype == "CGST") {
      var TaxableAmt = (CreditnoteAmount) / (1 + (this.Gstrate / 100));
      this.GstAmount = parseFloat(((TaxableAmt * (this.Gstrate / 100))).toFixed(2));
      this.SgstRate = (this.Gstrate / 2);
      this.CgstRate = (this.Gstrate / 2);
      this.IgstRate = 0;
      this.creditnotedetailTableForm.controls["SGSTAmt"].setValue(parseFloat(((TaxableAmt * (this.Gstrate / 100)) / 2).toFixed(2)));
      this.creditnotedetailTableForm.controls["IGSTAmt"].setValue(parseFloat(((TaxableAmt * (this.Gstrate / 100)) / 2).toFixed(2)));
      this.creditnotedetailTableForm.controls["TaxableAmt"].setValue(parseFloat(TaxableAmt.toFixed(2)));
      this.creditnotedetailTableForm.controls["CreditNoteAmt"].setValue(parseFloat(CreditnoteAmount));
    }

    if (Gsttype == "IGST") {
      var TaxableAmt = (CreditnoteAmount) / (1 + (this.Gstrate / 100));
      this.GstAmount = parseFloat(((TaxableAmt * (this.Gstrate / 100))).toFixed(2));
      this.SgstRate = 0;
      this.CgstRate = 0;
      this.IgstRate = this.Gstrate;
      this.creditnotedetailTableForm.controls["SGSTAmt"].setValue(0);
      this.creditnotedetailTableForm.controls["IGSTAmt"].setValue(parseFloat(((TaxableAmt * (this.Gstrate / 100))).toFixed(2)));
      this.creditnotedetailTableForm.controls["TaxableAmt"].setValue(parseFloat(TaxableAmt.toFixed(2)));
      this.creditnotedetailTableForm.controls["CreditNoteAmt"].setValue(parseFloat(CreditnoteAmount));
    }

  }

  // Submit Credit Note
  async save() {
    if (this.isUpdate == 0) {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          this.CreditNoteRequestModel.companyCode = this.storage.companyCode;
          this.CreditNoteRequestModel.docType = "CDNT";
          this.CreditNoteRequestModel.branch = this.storage.branch;
          this.CreditNoteRequestModel.finYear = financialYear;

          //Header data 
          this.CNTHdrDataRequestModel._id = "";
          this.CNTHdrDataRequestModel.cID = this.storage.companyCode; // assuming cID is a number, assign 0 for empty
          this.CNTHdrDataRequestModel.docNo = this.CreditnoteGenerationTableForm.value.InvoiceNumber?.value;
          this.CNTHdrDataRequestModel.tYP = "C";
          this.CNTHdrDataRequestModel.nTNO = "";
          this.CNTHdrDataRequestModel.nTDT = new Date();
          this.CNTHdrDataRequestModel.lOC = this.storage.branch;
          this.CNTHdrDataRequestModel.pARTY = { cD: this.hsnInvoiceDataResponse.data[0].cUST.cD, nM: this.hsnInvoiceDataResponse.data[0].cUST.nM }; // assigning empty objects for PARTY and GST
          this.CNTHdrDataRequestModel.gST = { aMT: this.GstAmount }; // assuming gST is an object with property aMT, assign 0 for empty
          this.CNTHdrDataRequestModel.tXBLAMT = this.creditnotedetailTableForm.value.TaxableAmt;
          this.CNTHdrDataRequestModel.aMT = this.creditnotedetailTableForm.value.CreditNoteAmt;
          this.CNTHdrDataRequestModel.nTRESCD = this.creditnotedetailTableForm.value.Reason?.value;
          this.CNTHdrDataRequestModel.nTRESNM = this.creditnotedetailTableForm.value.Reason?.name;
          this.CNTHdrDataRequestModel.aCCD = this.creditnotedetailTableForm.value.Ledgeraccount?.value;
          this.CNTHdrDataRequestModel.aCNM = this.creditnotedetailTableForm.value.Ledgeraccount?.name;
          this.CNTHdrDataRequestModel.sTS = 1;
          this.CNTHdrDataRequestModel.sTSNM = "Generated";
          this.CNTHdrDataRequestModel.sTSBY = this.storage.loginName;
          this.CNTHdrDataRequestModel.sTSDT = new Date();
          this.CNTHdrDataRequestModel.vNO = "";
          this.CNTHdrDataRequestModel.cNL = false; // assuming cNL is a boolean, assign false for empty
          this.CNTHdrDataRequestModel.cNLDT = null;
          this.CNTHdrDataRequestModel.cNLBY = "";
          this.CNTHdrDataRequestModel.cNLRES = "";
          this.CNTHdrDataRequestModel.eNTDT = new Date();
          this.CNTHdrDataRequestModel.eNTLOC = this.storage.branch;
          this.CNTHdrDataRequestModel.eNTBY = "";
          this.CNTHdrDataRequestModel.mODDT = null;
          this.CNTHdrDataRequestModel.mODLOC = "";
          this.CNTHdrDataRequestModel.mODBY = "";

          //Detasils data
          this.CNTDetDataRequestModel._id = "";
          this.CNTDetDataRequestModel.cID = 0;
          this.CNTDetDataRequestModel.docNo = this.CreditnoteGenerationTableForm.value.InvoiceNumber?.value;
          this.CNTDetDataRequestModel.tYP = "C";
          this.CNTDetDataRequestModel.nTNO = "";
          this.CNTDetDataRequestModel.nTDT = new Date();
          this.CNTDetDataRequestModel.lOC = this.storage.branch;
          this.CNTDetDataRequestModel.bILLNO = this.CreditnoteGenerationTableForm.value.InvoiceNumber?.value;
          this.CNTDetDataRequestModel.bGNDT = this.hsnInvoiceDataResponse.data[0].bGNDT;
          this.CNTDetDataRequestModel.pARTY = {
            cD: this.hsnInvoiceDataResponse.data[0].cUST.cD,
            nM: this.hsnInvoiceDataResponse.data[0].cUST.nM,
            tEL: this.hsnInvoiceDataResponse.data[0].cUST.tEL,
            aDD: this.hsnInvoiceDataResponse.data[0].cUST.aDD,
            eML: this.hsnInvoiceDataResponse.data[0].cUST.eML,
            cT: this.hsnInvoiceDataResponse.data[0].cUST.cT,
            sT: this.hsnInvoiceDataResponse.data[0].cUST.sT,
            gSTIN: this.hsnInvoiceDataResponse.data[0].cUST.gSTIN,
          };
          this.CNTDetDataRequestModel.bAMT = 0;
          this.CNTDetDataRequestModel.bALAMT = this.CreditnoteGenerationFormTableForm.value.PendingAmt;
          this.CNTDetDataRequestModel.tXBLAMT = this.creditnotedetailTableForm.value.TaxableAmt;
          this.CNTDetDataRequestModel.aMT = this.creditnotedetailTableForm.value.CreditNoteAmt;
          this.CNTDetDataRequestModel.eXMT = this.hsnInvoiceDataResponse.data[0].eXMT;
          this.CNTDetDataRequestModel.eXMTRES = this.hsnInvoiceDataResponse.data[0].eXMTRES;
          this.CNTDetDataRequestModel.gST = {
            hSCD: this.CreditnoteGenerationFormTableForm.value.SACCode?.value,
            hSNM: this.CreditnoteGenerationFormTableForm.value.SACCode?.name,
            tYP: this.hsnInvoiceDataResponse.data[0].gST.tYP,
            rATE: this.hsnInvoiceDataResponse.data[0].gST.rATE,
            iGRT: this.IgstRate,
            cGRT: this.CgstRate,
            sGRT: this.SgstRate,
            iGST: this.creditnotedetailTableForm.value.IGSTAmt,
            cGST: this.creditnotedetailTableForm.value.SGSTAmt > 0 ? this.creditnotedetailTableForm.value.IGSTAmt : 0,
            sGST: this.creditnotedetailTableForm.value.SGSTAmt,
            aMT: this.GstAmount
          };
          this.CNTDetDataRequestModel.eNTDT = new Date();
          this.CNTDetDataRequestModel.eNTLOC = this.storage.branch;
          this.CNTDetDataRequestModel.eNTBY = this.storage.loginName;
          this.CNTDetDataRequestModel.mODDT = null;
          this.CNTDetDataRequestModel.mODLOC = "";
          this.CNTDetDataRequestModel.mODBY = "";
          this.CreditNoteRequestModel.data =
            this.CNTHdrDataRequestModel;
          this.CreditNoteRequestModel.Headerdata = this.CNTHdrDataRequestModel;
          this.CreditNoteRequestModel.Detailsdata = this.CNTDetDataRequestModel;

          console.log(this.CreditNoteRequestModel);

          firstValueFrom(
            this.voucherServicesService.FinancePost(
              "fin/account/CreditNoteEntry",
              this.CreditNoteRequestModel
            )
          )
            .then((res: any) => {
              if (res.success) {
                Swal.fire({
                  icon: "success",
                  title: "Credit Note Created Successfully",
                  text: "Credit Note No: " + res?.data?.mainData + "Customer Name:" + res?.data?.details.ops[0].pARTY.cD + ":" + res?.data?.details.ops[0].pARTY.nM,
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.hideLoading();
                    setTimeout(() => {
                      Swal.close();
                    }, 2000);
                    this.navigationService.navigateTotab("creditNoteManagement", "dashboard/Index");
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
      }, "Credit Note Generating..!");
    } else {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_header",
        filter: { nTNO: this.hdncreditno },
        update: {
          gST: {
            aMT: this.GstAmount
          },
          tXBLAMT: this.creditnotedetailTableForm.value.TaxableAmt,
          aMT: this.creditnotedetailTableForm.value.CreditNoteAmt,
          nTRESCD: this.creditnotedetailTableForm.value.Reason?.value,
          nTRESNM: this.creditnotedetailTableForm.value.Reason?.name,
          aCCD: this.creditnotedetailTableForm.value.Ledgeraccount?.value,
          aCNM: this.creditnotedetailTableForm.value.Ledgeraccount?.name,
          mODDT: new Date(),
          mODLOC: this.storage.branch,
          mODBY: this.storage.loginName,
        },

      };

      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req))
      if (res.success) {
        //this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
        Swal.fire({
          icon: "success",
          title: "Successful Updated",
          text: res.message,
          showConfirmButton: true,
        });
        this.navigationService.navigateTotab("creditNoteManagement", "dashboard/Index");
      }

    }

  }

  // Update Credit Note
  async update() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_header",
      filter: { nTNO: this.hdncreditno },
    };
    this.hsnCreditDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    this.creditnotedetailTableForm.controls["CreditNoteAmt"].setValue(this.hsnCreditDataResponse.data[0].aMT);
    this.creditnotedetailTableForm.controls["TaxableAmt"].setValue(this.hsnCreditDataResponse.data[0].tXBLAMT);
    this.ledgervalue = this.hsnCreditDataResponse.data[0].aCCD;
    this.reasonvalue = this.hsnCreditDataResponse.data[0].nTRESCD;
  }

  // Cancel Credit Note
  async cancel() {
    if (this.isUpdate == 3) {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_header",
        filter: { nTNO: this.hdncreditno },
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
          collectionName: "cust_bill_headers",
          filter: { bILLNO: this.hdninvoiceno },
        };
    
        this.InvoiceDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Bodys));

        const Body = {
          companyCode: this.storage.companyCode,
          collectionName: "cust_bill_headers",
          filter: { bILLNO: this.hdninvoiceno },
          update: {
            cOL:{
              aMT: this.InvoiceDataResponse?.data[0].cOL.aMT  - this.hdncnamt,
              bALAMT:this.InvoiceDataResponse?.data[0].cOL.bALAMT + this.hdncnamt
            }
          }
        };

        const res = await firstValueFrom(
          this.masterService.masterPut("generic/update", Body))

        //this.Route.navigateByUrl("/Masters/AccountMaster/AccountMasterList");
        Swal.fire({
          icon: "success",
          title: "Successful Rejected",
          text: res.message,
          showConfirmButton: true,
        });
        this.navigationService.navigateTotab("creditNoteManagement", "dashboard/Index");
      }
    }
  }

  // Approval Credit Note
  async approval() {
    if (this.isUpdate == 2) {
      const BodyDataHeader = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_header",
        filter: { nTNO: this.hdncreditno },
      };
      this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));

      const BodyDataDetails = {
        companyCode: this.storage.companyCode,
        collectionName: "cd_note_details",
        filter: { nTNO: this.hdncreditno },
      };
      this.DataResponseDetails = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataDetails));
      console.log(this.DataResponseDetails)

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
          this.VoucherDataRequestModel.transCode = VoucherInstanceType.CreditNoteApproval;
          this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.CreditNoteApproval];
          this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
          this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

          this.VoucherDataRequestModel.transDate = new Date();
          this.VoucherDataRequestModel.docType = "VR";
          this.VoucherDataRequestModel.branch = this.storage.branch;
          this.VoucherDataRequestModel.finYear = financialYear;

          this.VoucherDataRequestModel.accLocation = this.DataResponseHeader.data[0].lOC;
          this.VoucherDataRequestModel.preperedFor = "Customer";
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
          console.log(this.VoucherRequestModel);
          firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
            let reqBody = {
              companyCode: this.storage.companyCode,
              voucherNo: res?.data?.mainData?.ops[0].vNO,
              transDate: Date(),
              finYear: financialYear,
              branch: this.DataResponseHeader.data[0].lOC,
              transCode: VoucherInstanceType.CreditNoteApproval,
              transType: VoucherInstanceType[VoucherInstanceType.CreditNoteApproval],
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
            console.log(reqBody);
            firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then(async (res: any) => {
              if (res) {
                const req = {
                  companyCode: this.storage.companyCode,
                  collectionName: "cd_note_header",
                  filter: { nTNO: this.hdncreditno },
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
                      this.navigationService.navigateTotab("creditNoteManagement", "dashboard/Index");
                    }, 1000);
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

  GetVouchersLedgers(data) {
    const TotalAmount = this.DataResponseHeader.data[0].aMT;
    const TXBLAMTAmount = this.DataResponseHeader.data[0].tXBLAMT;

    const createVoucher = (accCode, accName, accCategory, debit, credit) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.CreditNoteApproval,
      transType: VoucherInstanceType[VoucherInstanceType.CreditNoteApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
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
      narration: `When Credit Note is Generated :${this.DataResponseHeader.data[0].nTNO}`,
    });

    const response = [
      createVoucher(ledgerInfo['Billed debtors'].LeadgerCode, ledgerInfo['Billed debtors'].LeadgerName, ledgerInfo['Billed debtors'].LeadgerCategory, 0, TotalAmount),
      createVoucher(this.DataResponseHeader.data[0].aCCD, this.DataResponseHeader.data[0].aCNM, ledgerInfo['Freight income'].LeadgerCategory, TXBLAMTAmount, 0),
    ];

    if (this.DataResponseDetails.data[0].gST.cGST > 0) {
      response.push(createVoucher(ledgerInfo['CGST'].LeadgerCode, ledgerInfo['CGST'].LeadgerName, ledgerInfo['CGST'].LeadgerCategory, this.DataResponseDetails.data[0].gST.cGST, 0));
    }

    if (this.DataResponseDetails.data[0].gST.iGST > 0) {
      response.push(createVoucher(ledgerInfo['IGST'].LeadgerCode, ledgerInfo['IGST'].LeadgerName, ledgerInfo['IGST'].LeadgerCategory, this.DataResponseDetails.data[0].gST.iGST, 0));
    }

    if (this.DataResponseDetails.data[0].gST.sGRT > 0) {
      response.push(createVoucher(ledgerInfo['SGST'].LeadgerCode, ledgerInfo['SGST'].LeadgerName, ledgerInfo['SGST'].LeadgerCategory, this.DataResponseDetails.data[0].gST.sGRT, 0));
    }


    return response;
  }
}
