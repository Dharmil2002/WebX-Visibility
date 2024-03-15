import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { exportAsExcelFile } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { CnoteBillMRService } from 'src/app/Utility/module/reports/cnote-bill-mr.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { cNoteBillMRControl } from 'src/assets/FormControls/Reports/cnote-bill-mr-report/cnote-bill-mr-report';
// import { cNoteBillMRControl } from 'src/assets/FormControls/cnote-bill-mr-report/cnote-bill-mr-report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cnote-bill-mr-report',
  templateUrl: './cnote-bill-mr-report.component.html'
})
export class CnoteBillMrReportComponent implements OnInit {

  breadScrums = [
    {
      title: "Consignment Note Bill MR Register Report",
      items: ["Home"],
      active: "Consignment Note Bill MR Register Report",
    },
  ];
  cnoteBillMRTableForm: UntypedFormGroup;
  jsoncnoteBillMRFormArray: any;
  cnoteBillMRFormControls: cNoteBillMRControl;
  protected _onDestroy = new Subject<void>();
  originName: any;
  originStatus: any;

  CSVHeader = {
    "mANUALBILLNO": "Manual Bill No",
    "bILLGENAT": "Bill Generate At",
    "bILLDT": "Bill Date",
    "bILSUBAT": "Bill Submision At",
    "bILLSUBDT": "Bill Submision Date",
    "bILLcOLLECTAT": "Bill Collect At",
    "bILLCOLLECTDT": "Bill Collect Date",
    "bILLAMT": "Bill Amount",
    "bILLPENAMT": "Bill Pending Amt",
    "bILLPAR": "Bill Party",
    "bILLST": "Bill Status",
    "bILLNO": "Bill No",
    "mRNO": "MR No",
    "mANUALMRNO": "Manual MR No",
    "mRDT": "MR Date",
    "mRCLOSEDT": "MR Close Date",
    "mRENTRYDT": "MR Entry Date",
    "mRGENAT": "MR Generate At",
    "mRAMT": "MR Amount",
    "mRNETAMT": "MR Net Amount",
    "mRSTAT": "MR Status",
    "dEMCHAR": "Demmurage Charge",
    "cNOTENO": "CNote No",
    "cNOTEDT": "CNote Date",
    "tIME": "Time",
    "eDD": "EDD",
    "bOOKBRANCH": "Booking Branch",
    "dELIBRANCH": "Delivery Branch",
    "pAYTYPE": "Payment Type",
    "bUSTYPE": "Business Type",
    "pROD": "Product",
    "cONID": "Contract ID",
    "cONTPARTY": "Contract party",
    "sERTYPE": "Service Type",
    "vEHNO": "Vehicle No",
    "bILLPARTYNM": "Billing Party Name",
    "bACODE": "BA Code",
    "eEDD": "EEDD",
    "lASTEDITBY": "Last Edit By",
    "cNOTEEDITDT": "CNote Edited Date",
    "cUSTREFNO": "Customer Ref No",
    "mOVTYPE": "Type of Movement",
    "tRANMODE": "Transport Mode",
    "sTAT": "Status",
    "lOADTPE": "Load Type",
    "rEM": "Remark",
    "bILLAT": "Billed At",
    "pINCODE": "Pincode",
    "lOCALCNOTE": "Local C Note",
    "fROMZN": "From Zone",
    "tOZN": "To Zone",
    "oDA": "ODA",
    "fROMCITY": "From City",
    "tOCITY": "To City",
    "dRIVNM": "Driver Name",
    "pKGS": "No of Pkgs",
    "aCTWT": "Actual Weight(KG)",
    "cHARWT": "Charged Weight",
    "sPEINSTRUCT": "Special Instruction",
    "pKGTPE": "Packaging Type",
    "cUBICWT": "Cubic Weight",
    "cHRPKG": "Charged PkgsNo",
    "cHARGKM": "Charged KM",
    "iNVNO": "Invoice No",
    "iNVDT": "Invoice Date",
    "dELVALUE": "Declared Value",
    "lEN": "Length",
    "bRTH": "Breadth",
    "hGT": "Height",
    "cONTENT": "Contents",
    "bATCHNO": "Batch No",
    "pARTNO": "Part No",
    "pARTDESC": "Part Description",
    "pARTQUAN": "Part Quntity",
    "fUELRTTPE": "FuelRateType",
    "fOVRTTPE": "FOV Rate Type",
    "cFTRATIO": "CFT Ratio",
    "tTCFT": "TotalCFT",
    "sEROPTEDFOR": "Service Opted For",
    "fSCCHARRT": "FSC Charge Rate",
    "fOV": "FOV %",
    "mULDELIV": "Multidelivery",
    "mULPICKUP": "Multipickup",
    "rISKTPE": "Risk Type",
    "cOD/DOD": "COD/DOD",
    "dACC": "DACC",
    "dEF": "Deferment",
    "pOLNO": "Policy No",
    "pOLDT": "Policy Date",
    "wTTPE": "Weight Type",
    "dEFAULTCARDRT": "Default Card Rate",
    "fUELPERRT": "Fuel Per Rate",
    "CONID": "Contract Id",
    "sUBTOT": "Sub Total",
    "dOCTOT": "Docket Total",
    "gSTAMT": "GST Amount",
    "fRTRT": "FRT Rate",
    "fRTTPE": "FRT Type",
    "fRIGHTCHAR": "Freight Charge",
    "oTHERCHAR": "Other Charges",
    "gREENTAX": "Green tax",
    "dROPCHAR": "Drop Charges",
    "dOCCHAR": "Document Charges",
    "wARECHAR": "Warehouse Charges",
    "dEDUC": "Deduction",
    "hOLISERVCHAR": "Holiday Service Charges",
    "fOVCHAR": "FOV Charges",
    "cOD/DODCHAR": "COD/DOD Charges",
    "aPPCHAR": "Appointment Charges",
    "oDACHAR": "ODA Charges",
    "fUELCHAR": "FuelSurcharge Charges",
    "mULPICKUPCHAR": "Multipickup Charges",
    "uNLOADCHAR": "Unloading Charges",
    "mULTIDELCHAR": "Multidelivery Charges",
    "lOADCHAR": "Loading Charges",
    "gSTRT": "GST Rate",
    "gSTCHAR": "GST Charge",
    "vATRT": "VAT Rate",
    "vATAMT": "VAT Amount",
    "cALAMITYRT": "Calamity Cess Rate",
    "cALAMITYAMT": "Calamity Cess Amount",
    "aDVAMT": "Advance Amount",
    "aDVREMARK": "Advance Remark",
    "dPHRT": "DPH Rate",
    "dPHAMT": "DPH Amount",
    "dISCRT": "Disc Rate",
    "dISCAMT": "Disc Amount"
  }

  desName: any;
  desStatus: any;
  payName: any;
  payStatus: any;
  movName: any;
  movStatus: any;
  tranName: any;
  tranStatus: any;
  bookingName: any;
  bookingStatus: any;
  custName: any;
  custStatus: any;
  cnoteName: any;
  cnoteStatus: any;
  billAtName: any;
  billAtStatus: any;
  allData: {
    cnoteData: any;
  };
  cnoteDetailList: any;
  cnoteDet: any;

  constructor(
    private storage: StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private cnoteBillMRService: CnoteBillMRService,
    private generalService: GeneralService,
    private customerService: CustomerService,
    private operationService: OperationService,
    private masterServices: MasterService,
    public snackBarUtilityService: SnackBarUtilityService,
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.cnoteBillMRTableForm.controls["start"].setValue(lastweek);
    this.cnoteBillMRTableForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  initializeFormControl() {
    this.cnoteBillMRFormControls = new cNoteBillMRControl();
    this.jsoncnoteBillMRFormArray = this.cnoteBillMRFormControls.cnoteBillMRControlArray;
    this.originName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "origin"
    )?.name;
    this.originStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "origin"
    )?.additionalData.showNameAndValue;
    this.desName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "destination"
    )?.name;
    this.desStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "destination"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.name;
    this.payStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.additionalData.showNameAndValue;
    this.tranName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "tranmode"
    )?.name;
    this.tranStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "tranmode"
    )?.additionalData.showNameAndValue;
    this.movName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "movType"
    )?.name;
    this.movStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "movType"
    )?.additionalData.showNameAndValue;
    this.bookingName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "bookType"
    )?.name;
    this.bookingStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "bookType"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "cust"
    )?.name;
    this.custStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "cust"
    )?.additionalData.showNameAndValue;
    this.cnoteName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "cnote"
    )?.name;
    this.cnoteStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "cnote"
    )?.additionalData.showNameAndValue;
    this.billAtName = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "billAt"
    )?.name;
    this.billAtStatus = this.jsoncnoteBillMRFormArray.find(
      (data) => data.name === "billAt"
    )?.additionalData.showNameAndValue;
    this.cnoteBillMRTableForm = formGroupBuilder(this.fb, [this.jsoncnoteBillMRFormArray]);
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const paymentType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "PAYTYP" }, "codeDesc", "codeId");
    const movemntType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "MOVTYP" }, "codeDesc", "codeId");
    const tranmode: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "tran_mode" }, "codeDesc", "codeId");
    const booking: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "DELTYP" }, "codeDesc", "codeId");
    const customer = await this.customerService.customerFromApi();

    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      locationList,
      this.originName,
      this.originStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      locationList,
      this.billAtName,
      this.billAtStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      locationList,
      this.desName,
      this.desStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      movemntType,
      this.movName,
      this.movStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      tranmode,
      this.tranName,
      this.tranStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      booking,
      this.bookingName,
      this.bookingStatus
    );
    this.filter.Filter(
      this.jsoncnoteBillMRFormArray,
      this.cnoteBillMRTableForm,
      customer,
      this.custName,
      this.custStatus
    );
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const docketNo = this.cnoteBillMRTableForm.value.cnote;
        const docketArray = docketNo ? docketNo.includes(',') ? docketNo.split(',') : [docketNo] : [];
        
        const startValue = new Date(this.cnoteBillMRTableForm.controls.start.value);
        const endValue = new Date(this.cnoteBillMRTableForm.controls.end.value);
        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();
        
        const fromloc = Array.isArray(this.cnoteBillMRTableForm.value.fromlocHandler)
          ? this.cnoteBillMRTableForm.value.fromlocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const toloc = Array.isArray(this.cnoteBillMRTableForm.value.tolocHandler)
          ? this.cnoteBillMRTableForm.value.tolocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const payment = Array.isArray(this.cnoteBillMRTableForm.value.payTypeHandler)
          ? this.cnoteBillMRTableForm.value.payTypeHandler.map(x => { return { payCD: x.value, payNM: x.name }; })
          : [];
        const transitmode = Array.isArray(this.cnoteBillMRTableForm.value.transitHandler)
          ? this.cnoteBillMRTableForm.value.transitHandler.map(x => { return { tranCD: x.value, tranNM: x.name }; })
          : [];
        const businessType = Array.isArray(this.cnoteBillMRTableForm.value.busType) ? '' : this.cnoteBillMRTableForm.value.busType;
        const movType = Array.isArray(this.cnoteBillMRTableForm.value.movTypeHandler)
          ? this.cnoteBillMRTableForm.value.movTypeHandler.map(x => { return { movCD: x.value, movNM: x.name }; })
          : [];
        const bookingType = Array.isArray(this.cnoteBillMRTableForm.value.bookTypeHandler)
          ? this.cnoteBillMRTableForm.value.bookTypeHandler.map(x => { return { bookCD: x.value, bookNM: x.name }; })
          : [];
        const customer = Array.isArray(this.cnoteBillMRTableForm.value.custHandler)
          ? this.cnoteBillMRTableForm.value.custHandler.map(x => { return { custCD: x.value, custNM: x.name }; })
          : [];
        const billAt = Array.isArray(this.cnoteBillMRTableForm.value.billHandler)
          ? this.cnoteBillMRTableForm.value.billHandler.map(x => { return { billCD: x.value, billNM: x.name }; })
          : [];
        const data = await this.cnoteBillMRService.getCNoteBillMRReportDetail(startDate, endDate, fromloc, toloc, payment, transitmode, businessType, movType, bookingType, customer, billAt, docketArray)
        if (data.length === 0) {
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
        exportAsExcelFile(data, `Cnote_Bill_MR_Report-${timeString}`, this.CSVHeader);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Cnote Bill MR Report Generating Please Wait..!");
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsoncnoteBillMRFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsoncnoteBillMRFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.cnoteBillMRTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

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

}
