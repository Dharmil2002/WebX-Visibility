import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { DcrRegisterControl } from "src/assets/FormControls/dcr-register-Controls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { timeString } from "src/app/Utility/date/date-utils";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";

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
  allColumnFilter: any;
  csvFileName: string;
  filterColumn: boolean = true;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
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
    edit: false,
    csv: true,
  };

  //#region headerForCsv
  headerForCsv = {
    bOOK: "Book Code",
    fROM: "Series From",
    tO: "Series To",
    pAGES: "Total pages",
    uSED: "PagesUsed",
    vOID: "Pages Voided",
    aLOTONM: "Allotted to",
    aCUSTNM: "Customer name",
    aLOCD: "Branch code",
    aLONM: "Name of branch",
    aSNTONM: "Assigned to",
    aSNNM: "Name",
    eNTDT: "DCR Added date",
    eNTBY: "Added by",
    eNTLOC: "Added at location",
    mODDT: "Assignment date",
    mODBY: "Assigned by",
    mODLOC: "Assigned at location",
    rALLDT: "Reallocation date",
    rALLOCA: "Reallocated",
    rALLBY: "Reallocated by",
    rALLOC: "Reallocation location",
  };
  //#endregion

  //#region  DetailHeader
  DetailHeader = {
    bOOK: {
      id: 1,
      Title: "Book Code",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    fROM: {
      id: 2,
      Title: "Series From",
      class: "matcolumncenter",
      Style: "min-width:120px",
    },
    tO: {
      id: 3,
      Title: "Series To",
      class: "matcolumncenter",
      Style: "min-width:350px",
    },
    pAGES: {
      id: 4,
      Title: "Total pages",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    uSED: {
      id: 5,
      Title: "PagesUsed",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    vOID: {
      id: 6,
      Title: "Pages Voided",
      class: "matcolumncenter",
      Style: "min-width:180px",
    },
    aLOTONM: {
      id: 7,
      Title: "Allotted to",
      class: "matcolumncenter",
      Style: "min-width:145px",
    },
    aCUSTNM: {
      id: 8,
      Title: "Customer name",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    aLOCD: {
      id: 9,
      Title: "Branch code",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    aLONM: {
      id: 10,
      Title: "Name of branch",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    aSNTONM: {
      id: 11,
      Title: "Assigned to",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    aSNNM: {
      id: 12,
      Title: "Name",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    eNTDT: {
      id: 13,
      Title: "DCR Added date",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    eNTBY: {
      id: 14,
      Title: "Added by",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    eNTLOC: {
      id: 15,
      Title: "Added at location",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    mODDT: {
      id: 16,
      Title: "Assignment date",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    mODBY: {
      id: 17,
      Title: "Assigned by",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    mODLOC: {
      id: 18,
      Title: "Assigned at location",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    rALLOCA: {
      id: 19,
      Title: "Reallocated",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    rALLDT: {
      id: 20,
      Title: "Reallocation date",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    rALLBY: {
      id: 21,
      Title: "Reallocated by",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    rALLOC: {
      id: 22,
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
    "aCUSTNM",
    "aLOCD",
    "aLONM",
    "aSNTONM",
    "aSNNM",
    "eNTDT",
    "eNTBY",
    "eNTLOC",
    "mODDT",
    "mODBY",
    "mODLOC",
    "rALLOCA",
    "rALLDT",
    "rALLBY",
    "rALLOC",
  ];
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    private dcrService: DCRService,
    private masterService: MasterService,
    private filter: FilterUtils,
    public dialog: MatDialog
  ) {
    // this.allColumnFilter = this.CSVHeader;
  }

  ngOnInit(): void {
    this.initializeFormControl();
    const now = moment().endOf("day").toDate();
    const lastweek = moment().add(-10, "days").startOf("day").toDate();

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.dCRRegisterTableForm.controls["start"].setValue(lastweek);
    this.dCRRegisterTableForm.controls["end"].setValue(now);
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
    try {
      const startDate = new Date(
        this.dCRRegisterTableForm.controls.start.value
      );
      const endDate = new Date(this.dCRRegisterTableForm.controls.end.value);
      const startValue = moment(startDate).startOf("day").toDate();
      const endValue = moment(endDate).endOf("day").toDate();
      let data = await this.dcrService.getDCRregisterReportDetail(
        startValue,
        endValue
      );

      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Data Not found",
          text: "No data available for the selected date range.",
        });
      } else {
        this.tableData = data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching data. Please try again later.",
      });
    } finally {
      this.tableLoad = false;
      Swal.hideLoading();
      setTimeout(() => {
        Swal.close();
      }, 1000);
    }
  }
  //#endregion
}
