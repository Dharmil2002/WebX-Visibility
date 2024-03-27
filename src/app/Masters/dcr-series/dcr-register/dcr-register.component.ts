import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { DcrRegisterControl } from "src/assets/FormControls/dcr-register-Controls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { timeString } from "src/app/Utility/date/date-utils";

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
  allColumnFilter:any;
  filterColumn: boolean = true;
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
    "Book Code" : "bOOK",
    "Series From" : "fROM",
    "Series To" : "tO",
    "Total pages" : "pAGES",
    "PagesUsed" : "uSED",
    "Pages Voided" : "vOID",
    "Allotted to" : "aLOTONM",
    "Customer name" : "aLOTONM",
    "Branch code" : "aLOCD",
    "Name of branch" : "aLONM",
    "Assigned to" : "aSNTONM",
    "Name" : "aSNNM",
    "DCR Added date" : "eNTDT",
    "Added by" : "eNTBY",
    "Added at location" : "eNTLOC",
    "Assignment date" : "eNTDT",
    "Assigned by" : "mODBY",
    "Assigned at location" : "mODLOC",
    "Reallocated" : "rALLOCA",
    "Reallocation date" : "rALLDT",
    "Reallocated by" : "rALLBY",
    "Reallocation location" : "rALLOC",
  }
  //#endregion

  //#region  columnHeader
    columnHeader = {
      bOOK: {
        Title: "Book Code",
        class: "matcolumncenter",
        Style: "min-width:200px",
      },
      fROM: {
        Title: "Series From",
        class: "matcolumncenter",
        Style: "min-width:120px",
      },
      tO: {
        Title: "Series To",
        class: "matcolumncenter",
        Style: "min-width:350px",
      },
      pAGES: {
        Title: "Total pages",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      uSED: {
        Title: "PagesUsed",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      vOID: {
        Title: "Pages Voided",
        class: "matcolumncenter",
        Style: "min-width:180px",
      },
      aLOTONM: {
        Title: "Allotted to",
        class: "matcolumncenter",
        Style: "min-width:145px",
      },
      aCUSTNM: {
        Title: "Customer name",
        class: "matcolumncenter",
        Style: "min-width:130px",
      },
      aLOCD: {
        Title: "Branch code",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      aLONM: {
        Title: "Name of branch",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      aSNTONM: {
        Title: "Assigned to",
        class: "matcolumncenter",
        Style: "max-width:70px",
      },
      aSNNM: {
        Title: "Name",
        class: "matcolumncenter",
        Style: "min-width:150px",
      },
      eNTDT: {
        Title: "DCR Added date",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      eNTBY: {
        Title: "Added by",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      eNTLOC: {
        Title: "Added at location",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      mODDT: {
        Title: "Assignment date",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      mODBY: {
        Title: "Assigned by",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      mODLOC: {
        Title: "Assigned at location",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      rALLOCA: {
        Title: "Reallocated",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      rALLDT: {
        Title: "Reallocation date",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      rALLBY: {
        Title: "Reallocated by",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
      rALLOC: {
        Title: "Reallocation location",
        class: "matcolumncenter",
        Style: "max-width:150px",
      },
    };
    //#endregion

  //#region staticField
  staticField = [
    "bOOK",
    "fROM",
    "tO",
    "pAGES",
    "uSED",
    "vOID",
    "aLOTONM",
    "aLOTONM",
    "aLOCD",
    "aLONM",
    "aSNTONM",
    "aSNNM",
    "eNTDT",
    "eNTBY",
    "eNTLOC",
    "eNTDT",
    "mODBY",
    "mODLOC",
    "rALLOCA",
    "rALLDT",
    "rALLBY",
    "rALLOC",
  ];
  //#endregion

  //#region CSV Header
  CSVHeader = {

  }
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    private dcrService: DCRService,
    private masterService: MasterService,
    private filter: FilterUtils
  ) {
    this.allColumnFilter = this.columnHeader;
  }


  ngOnInit(): void {
    this.initializeFormControl();
    this.csvFileName = `DCR-Register-Report-${timeString}.csv`;
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
  async save() {
    

    const startValue = new Date(this.dCRRegisterTableForm.controls.start.value);
    const endValue = new Date(this.dCRRegisterTableForm.controls.end.value);
    let data = await this.dcrService.getDCRregisterReportDetail(startValue,endValue);
  }
  //#endregion
}
