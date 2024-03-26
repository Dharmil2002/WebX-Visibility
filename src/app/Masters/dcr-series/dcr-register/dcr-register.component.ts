import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { DcrRegisterControl } from "src/assets/FormControls/dcr-register-Controls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";

@Component({
  selector: "app-dcr-register",
  templateUrl: "./dcr-register.component.html",
})
export class DcrRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "DCR Register",
      items: ["DCR"],
      active: "DCR Register",
    },
  ];
  backPath: string;
  dCRRegisterjsonControlArray: any;
  dCRRegisterTableForm: UntypedFormGroup;
  DcrRegisterFormControl: DcrRegisterControl;
  submit = "Save";
  linkArray = [];
  tableData: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: true,
  };
  csvFileName: string;

  //#region headerForCsv
  headerForCsv = {
    "jobNo": "Job No",
    "jobDate": "Job Date",
    "cNoteNumber": "Consignment Note Number",
    "cNoteDate": "Consignment Note Date",
    "containerNumber": "Container Number",
    "billingParty": "Billing Party",
    "bookingFrom": "Booking From",
    "toCity": "Destination",
    "pkgs": "Pkgs",
    "weight": "Gross Weight",
    "transportMode": "Job Mode",
    "jobType": "Job Type",
    "chargWt": "Charged Weight",
    "DespatchQty": "Despatch Qty",
    "despatchWt": "Despatched Weight",
    "poNumber": "PO Number",
    "totalChaAmt": "CHA Amount",
    "voucherAmt": "Voucher Amount",
    "vendorBillAmt": "Vendor Bill Amount",
    "customerBillAmt": "Customer Bill Amount",
    "status": "Current Status",
    "noof20ftRf": "Swap Bodies",
    "noof40ftRf": "40 ft Reefer",
    "noof40ftHCR": "40 ft High Cube Reefer",
    "noof20ftOT": "20 ft Open Top",
    "noof40ftOT": "40 ft Open Top",
    "noof20ftFR": "20 ft Flat Rack",
    "noof40ftFR": "40 ft Flat Rack",
    "noof20ftPf": "20 ft Platform",
    "noof40ftPf": "40 ft Platform",
    "noof20ftTk": "20 ft Tank",
    "noof20ftSO": "20 ft Side Open",
    "noof40ftSO": "40 ft Side Open",
    "noof20ftI": "20 ft Insulated",
    "noof20ftH": "20 ft Hardtop",
    "noof40ftH": "40 ft Hardtop",
    "noof20ftV": "20 ft Ventilated",
    "noof20ftT": "20 ft Tunnel",
    "noof40ftT": "40 ft Tunnel",
    "noofBul": "Bulktainers",
    "noofSB": "Swap Bodies",
    "noof20ftStd": "20 ft Standard",
    "noof40ftStd": "40 ft Standard",
    "noof40ftHC": "40 ft High Cube",
    "noof45ftHC": "45 ft High Cube",
    "totalNoofcontainer": "Total No of Container",
  }
  //#endregion

  //#region  columnHeader
    columnHeader = {
      jobNo: {
        Title: "Job No",
        class: "matcolumncenter",
        Style: "min-width:200px",
      },
      jobDate: {
        Title: "Job Date",
        class: "matcolumncenter",
        Style: "min-width:120px",
      },
      cNoteNumber: {
        Title: "Consignment Note Number",
        class: "matcolumncenter",
        Style: "min-width:350px",
      },
      cNoteDate: {
        Title: "Consignment Note Date",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      containerNumber: {
        Title: "Container Number",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      billingParty: {
        Title: "Billing Party",
        class: "matcolumncenter",
        Style: "min-width:180px",
      },
      bookingFrom: {
        Title: "Booking From",
        class: "matcolumncenter",
        Style: "min-width:145px",
      },
      toCity: {
        Title: "Destination",
        class: "matcolumncenter",
        Style: "min-width:130px",
      },
      pkgs: {
        Title: "Pkgs",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      weight: {
        Title: "Gross Weight",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      transportMode: {
        Title: "Job Mode",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      noof20ftStd: {
        Title: "No of 20 ft Standard",
        class: "matcolumncenter",
        Style: "min-width:150px",
      },
      noof40ftStd: {
        Title: "No of 40 ft Standard",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftHC: {
        Title: "No of 40 ft High Cube",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof45ftHC: {
        Title: "No of 45 ft High Cube",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftRf: {
        Title: "No of 20 ft Reefer",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftRf: {
        Title: "No of 40 ft Reefer",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftHCR: {
        Title: "No of 40 ft High Cube Reefer",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftOT: {
        Title: "No of 20 ft Open Top",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftOT: {
        Title: "No of 40 ft Open Top",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftFR: {
        Title: "No of 20 ft Flat Rack",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftFR: {
        Title: "No of 40 ft Flat Rack",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftPf: {
        Title: "No of 20 ft Platform",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftPf: {
        Title: "No of 40 ft Platform",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftTk: {
        Title: "No of 20 ft Tank",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftSO: {
        Title: "No of 20 ft Side Open",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftSO: {
        Title: "No of 40 ft Side Open",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftI: {
        Title: "No of 20 ft Insulated",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftH: {
        Title: "No of 20 ft Hardtop",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftH: {
        Title: "No of 40 ft Hardtop",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftV: {
        Title: "No of 20 ft Ventilated",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof20ftT: {
        Title: "No of 20 ft Tunnel",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noof40ftT: {
        Title: "No of 40 ft Tunnel",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noofBul: {
        Title: "No of Bulktainers",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      noofSB: {
        Title: "No of Swap Bodies",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      totalNoofcontainer: {
        Title: "Total No of Container",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      jobType: {
        Title: "Job Type",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      chargWt: {
        Title: "Charged Weight",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },
      DespatchQty: {
        Title: "Despatch Qty",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },
      despatchWt: {
        Title: "Despatched Weight",
        class: "matcolumncenter",
        Style: "max-width:100px",
      },
      poNumber: {
        Title: "PO Number",
        class: "matcolumncenter",
        Style: "max-width:90px",
      },
      totalChaAmt: {
        Title: "CHA Amount",
        class: "matcolumncenter",
        Style: "max-width:90px",
      },
      voucherAmt: {
        Title: "Voucher Amount",
        class: "matcolumncenter",
        Style: "max-width:90px",
      },
      vendorBillAmt: {
        Title: "Vendor Bill Amount",
        class: "matcolumncenter",
        Style: "max-width:90px",
      },
      customerBillAmt: {
        Title: "Customer Bill Amount",
        class: "matcolumncenter",
        Style: "max-width:90px",
      },
      status: {
        Title: "Current Status",
        class: "matcolumncenter",
        Style: "min-width:100px",
      },
    };
    //#endregion

  //#region staticField
  staticField = [
    "noof20ftRf",
    "noof20ftStd",
    "noof40ftStd",
    "noof40ftHC",
    "noof45ftHC",
    "noof40ftRf",
    "noof40ftHCR",
    "noof20ftOT",
    "noof40ftOT",
    "noof20ftFR",
    "noof40ftFR",
    "noof20ftPf",
    "noof40ftPf",
    "noof20ftTk",
    "noof20ftSO",
    "noof40ftSO",
    "noof20ftI",
    "noof20ftH",
    "noof40ftH",
    "noof20ftV",
    "noof20ftT",
    "noof40ftT",
    "noofBul",
    "noofSB",
    "jobNo",
    "jobDate",
    "cNoteNumber",
    "cNoteDate",
    "containerNumber",
    "billingParty",
    "bookingFrom",
    "toCity",
    "pkgs",
    "weight",
    "transportMode",
    "totalNoofcontainer",
    "jobType",
    "chargWt",
    "DespatchQty",
    "despatchWt",
    "poNumber",
    "totalChaAmt",
    "voucherAmt",
    "vendorBillAmt",
    "customerBillAmt",
    "status",
  ];
  //#endregion


  constructor(
    private fb: UntypedFormBuilder,
    private dcrService: DCRService,
    private masterService: MasterService,
    private filter: FilterUtils
  ) {}

  
  ngOnInit(): void {
    this.initializeFormControl();
  }

  //#region to Initialize form control
  initializeFormControl() {
    this.DcrRegisterFormControl = new DcrRegisterControl();
    this.dCRRegisterjsonControlArray =
      this.DcrRegisterFormControl.getDcrRegisterFormControls();
    this.dCRRegisterTableForm = formGroupBuilder(this.fb, [
      this.dCRRegisterjsonControlArray,
    ]);
    this.allDropdown();
    // this.addDcrTableForm.controls["documentType"].setValue("dkt");
  }
  //#endregion

  //#region  Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  //#region allDropdown()
  async allDropdown() {
    this.dCRRegisterTableForm.controls["aEMP"].setValue("");
    const userdetais = await this.dcrService.userDetail(this.masterService);
    this.filter.Filter(
      this.dCRRegisterjsonControlArray,
      this.dCRRegisterTableForm,
      userdetais,
      "aEMP",
      true
    );
    this.dCRRegisterTableForm.controls["aBUSAS"].setValue("");
    const vendordetails = await this.dcrService.vendorDetail(
      this.masterService
    );
    this.filter.Filter(
      this.dCRRegisterjsonControlArray,
      this.dCRRegisterTableForm,
      vendordetails,
      "aBUSAS",
      true
    );
    this.dCRRegisterTableForm.controls["aCUST"].setValue("");
    const customerdetails = await this.dcrService.CustomerDetail(
      this.masterService
    );
    this.filter.Filter(
      this.dCRRegisterjsonControlArray,
      this.dCRRegisterTableForm,
      customerdetails,
      "aCUST",
      true
    );
    this.dCRRegisterTableForm.controls["aLOC"].setValue("");
    const locationDetail = await this.dcrService.LocationDetail(
      this.masterService
    );
    this.filter.Filter(
      this.dCRRegisterjsonControlArray,
      this.dCRRegisterTableForm,
      locationDetail,
      "aLOC",
      true
    );
  }
  //#endregion

  //#region   cancel
  cancel() {}
  //#endregion

  //#region  Save Details
  save() {}
  //#endregion
}
