import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomerDetail, userDetail, vendorDetail } from "./dcr-apiUtility";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { DCRModel } from "src/app/core/models/dcrallocation";
import { firstValueFrom } from "rxjs";
import { DcrEvents } from "src/app/Models/docStatus";
import { StorageService } from "src/app/core/service/storage.service";
import moment from "moment";
import {
  SeriesRange,
  nextKeyCodeByN,
  splitSeries,
} from "src/app/Utility/commonFunction/stringFunctions";
import { DcrAllocationForm } from "src/assets/FormControls/dcr_allocation_controls";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { VendorService } from "src/app/Utility/module/masters/vendor-master/vendor.service";
@Component({
  selector: "app-dcr-allocation",
  templateUrl: "./dcr-allocation.component.html",
})
export class DcrAllocationComponent implements OnInit {
  DCRTableForm: UntypedFormGroup;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  DCRTable: any;
  DCRFormControls: DcrAllocationForm;
  jsonControlCustomerArray: any;
  backPath: string;
  valuechanged: boolean = false;
  submit = "Save";
  originalJsonControlCustomerArray: any;
  bookData: any[] = [];
  allocateTo = [
    { value: "L", name: "Location" },
    { value: "C", name: "Customer" },
  ];
  assignTo = [
    { value: "E", name: "Employee" },
    { value: "B", name: "BA" },
    { value: "C", name: "Customer" },
  ];
  breadScrums = [
    {
      title: "DCR Allocation",
      items: ["DCR"],
      active: "DCR Allocation",
    },
  ];
  splitSeries: SeriesRange[];

  //#region constructor
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private route: Router,
    private storage: StorageService,
    private dcrService: DCRService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private vendorService: VendorService
  ) {
    debugger;
    this.DCRTable = new DCRModel();
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.DCRTable = route.getCurrentNavigation().extras.state.data.columnData;
    }
    this.initializeFormControl();
  }
  //#endregion

  //#region initializeFormControl
  initializeFormControl() {
    const DCRFormControls = new DcrAllocationForm(this.DCRTable);
    this.jsonControlCustomerArray = DCRFormControls.getControls();
    this.DCRTableForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerArray,
    ]);
    this.DCRTableForm.valueChanges.subscribe((value) => {
      this.valuechanged = true;
    });
  }
  //#endregion

  //#region neOnInit
  ngOnInit(): void {
    this.originalJsonControlCustomerArray = [...this.jsonControlCustomerArray];
    this.DCRTableForm["controls"].AllocateTo.setValue("L");
    this.handleChange();
    this.getvalue();
    this.backPath = "/Masters/DCRManagement";
  }
  //#endregion

  //#region getvalue
  getvalue() {
    this.DCRTableForm.controls["from"].setValue(this.DCRTable.fROM);
    this.DCRTableForm.controls["to"].setValue(this.DCRTable.tO);
    this.DCRTableForm.controls["noOfPages"].setValue(this.DCRTable.pAGES);
  }
  //#endregion

  //#region clearControlValidators
  clearControlValidators(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }
  //#endregion

  //#region to set series to.
  getSeriesTo() {
    // Get the 'from' and 'noOfPages' values from the form control
    const { from, noOfPages } = this.DCRTableForm.value;
    const toCode = nextKeyCodeByN(from, parseInt(noOfPages) - 1);
    this.DCRTableForm.controls.to.setValue(toCode);

    // this.isSeriesExists();
    this.isSeriesValid();
  }
  //#endregion

  //#region isSeriesExists()
  // async isSeriesExists(): Promise<boolean> {
  //   const book = this.DCRTable.oBOOK;
  //   const from = this.DCRTableForm.value.from;
  //   const to = this.DCRTableForm.value.to;

  //     // this.DCRTableForm.controls.allocateTo.setValue("");
  //     let filter = {}
  //     if(!to){
  //       filter = {
  //         cID: this.storage.companyCode,
  //         oBOOK: book,
  //         D$or: [
  //           { fROM: { D$lte: from }, tO: { D$gte: to } }, // Check if the value is within any range
  //         ]
  //       };
  //     }
  //     const req = {
  //       companyCode: this.companyCode,
  //       collectionName: "dcr_header",
  //       filter: filter
  //     };
  //     const res = await firstValueFrom(this.masterService.masterPost("generic/getOne", req) );
  //     const foundItem = res?.data || null;
  //     if (!foundItem) {
  //       this.DCRTableForm.controls["from"].setValue("");
  //       this.DCRTableForm.controls["to"].setValue("");
  //       this.DCRTableForm.controls["noOfPages"].setValue("");
  //       let s = from + (to ? " - "+ to : "");
  //       Swal.fire({
  //         title: "error",
  //         text: `Series [${s}] Out of Range book ${foundItem.oBOOK}.! Please try with another.`,
  //         icon: "error",
  //         showConfirmButton: true,
  //       });
  //       return false;
  //     }
  // }
  //#endregion
  async isSeriesValid() {
    debugger;
    const splitFrom = this.DCRTableForm.value.from;
    const splitTo = this.DCRTableForm.value.to;

    try {
      this.splitSeries = splitSeries(
        this.DCRTable.fROM,
        this.DCRTable.tO,
        splitFrom,
        splitTo
      );
      console.log(this.splitSeries);
      this.bookData = await this.dcrService.getDCR({
        cID: this.storage.companyCode,
        tYP: this.DCRTable.tYP,
        oBOOK: this.DCRTable.bOOK,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "An error occurred while processing the request.",
        showConfirmButton: true,
      });
    }
  }

  //#region handleChange
  async handleChange() {
    const value = this.DCRTableForm.get("AllocateTo").value;
    let filterFunction;
    //  const name =["AllocateTo","location","assignTo","noOfPages","name","from","to"]
    switch (value) {
      case "L":
        filterFunction = (x) =>
          x.name === "AllocateTo" ||
          x.name === "location" ||
          x.name === "assignTo" ||
          x.name === "noOfPages" ||
          x.name === "name" ||
          x.name === "from" ||
          x.name === "to";

        this.locationService.locationFromApi();

        let req = {
          companyCode: this.companyCode,
          collectionName: "location_detail",
          filter: {},
        };
        try {
          const res: any = await firstValueFrom(
            this.masterService.masterPost("generic/get", req)
          );
          if (res) {
            const locationdetails = res.data.map((x) => ({
              name: x.locName,
              value: x.locCode,
            }));
            this.filter.Filter(
              this.jsonControlCustomerArray,
              this.DCRTableForm,
              locationdetails,
              "location",
              true
            );
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          // Handle errors here
        }
        this.resetForm();
        break;
      case "C":
        filterFunction = (x) =>
          // x.name !== "location" &&
          x.name !== "assignTo" && x.name !== "name" && x.name !== "noOfPages";
        let req1 = {
          companyCode: this.companyCode,
          collectionName: "customer_detail",
          filter: {},
        };
        try {
          const res: any = await firstValueFrom(
            this.masterService.masterPost("generic/get", req1)
          );
          if (res) {
            const customerdetails = res.data.map((x) => ({
              name: x.customerName,
              value: x.customerCode,
            }));
            this.filter.Filter(
              this.jsonControlCustomerArray,
              this.DCRTableForm,
              customerdetails,
              "location",
              true
            );
          }
        } catch (error) {
          console.error("Error fetching customer details:", error);
          // Handle errors here
        }
        // this.clearControlValidators(this.DCRTableForm.get("location"));
        this.clearControlValidators(this.DCRTableForm.get("assignTo"));
        this.clearControlValidators(this.DCRTableForm.get("name"));
        this.clearControlValidators(this.DCRTableForm.get("noOfPages"));
        this.resetForm();
        break;
    }
    this.jsonControlCustomerArray =
      this.originalJsonControlCustomerArray.filter(filterFunction);
  }
  //#endregion

  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(
      this.DCRTableForm,
      this.jsonControlCustomerArray,
      event.field.name,
      true
    );
  }

  /*here i  created a Function for the destination*/
  // async getLocations(event) {
  //   if (this.DCRTableForm.controls.location.value.length > 2) {
  //     const destinationMapping = await this.locationService.locationFromApi({
  //       locCode: { 'D$regex': `^${this.DCRTableForm.controls.destination.value}`, 'D$options': 'i' },
  //     });
  //     this.filter.Filter(this.jsonControlDocketArray, this.quickDocketTableForm, destinationMapping, this.destination, this.destinationStatus);
  //   }
  // }

  //#region handleAssignChange
  async handleAssignChange() {
    const value = this.DCRTableForm.get("assignTo").value;
    switch (value) {
      case "E":
        this.DCRTableForm.controls["name"].setValue("");
        const userdetais = await userDetail(this.masterService);
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.DCRTableForm,
          userdetais,
          "name",
          true
        );
        break;
      case "B":
        this.DCRTableForm.controls["name"].setValue("");
        const vendordetails = await vendorDetail(this.masterService);
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.DCRTableForm,
          vendordetails,
          "name",
          true
        );
        break;
      case "C":
        this.DCRTableForm.controls["name"].setValue("");
        const customerdetails = await CustomerDetail(this.masterService);
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.DCRTableForm,
          customerdetails,
          "name",
          true
        );
        break;
    }
  }
  //#endregion

  //#region functionCallHandler
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  //#region Save
  async save() {
    if (this.DCRTableForm.get("AllocateTo").value === "L") {
      this.DCRTableForm.controls["location"].setValue(
        this.DCRTableForm.value.location
      );
      this.DCRTableForm.controls["name"].setValue(this.DCRTableForm.value.name);
    }
    if (this.DCRTableForm.get("AllocateTo").value === "C") {
      this.DCRTableForm.controls["name"].setValue(this.DCRTableForm.value.name);
    }

    const aLOCTONM = this.allocateTo.find(
      (x) => x.value == this.DCRTableForm.value?.AllocateTo
    );
    const aLONM = this.assignTo.find(
      (x) => x.value == this.DCRTableForm.value?.assignTo
    );

    const splitFrom = this.DCRTableForm.value.from;
    const splitTo = this.DCRTableForm.value.to;

    let seriesData: any[] = [];

    //Check Series is split or not
    if (this.splitSeries.length > 1) {
      this.splitSeries.forEach((m) => {
        var ns = { ...this.DCRTable };

        if (m.from == splitFrom) {
          ns.aLOTO = this.DCRTableForm.value?.AllocateTo || ""; //L: Location, C: Customer
          ns.aLOTONM = aLOCTONM?.name || "";
          ns.aLOCD = this.DCRTableForm.value?.location.value || "";
          ns.aLONM = this.DCRTableForm.value?.location.name || "";
          ns.aSNTO = this.DCRTableForm.value?.assignTo || "";
          ns.aSNTONM = aLONM?.name || ""; //E: Location, B: BA, C: Customer
          ns.aSNCD = this.DCRTableForm.value?.name.value || "";
          ns.aSNNM = this.DCRTableForm.value?.name.name || "";
          ns.sTS = ns.aSNTO == "" ? DcrEvents.Allocated : DcrEvents.Assigned;
          ns.sTSN =
            ns.aSNTO == ""
              ? DcrEvents[DcrEvents.Allocated]
              : DcrEvents[DcrEvents.Assigned];

          if (m.to != ns.tO) {
            //Series is splitted
            ns.tO = m.to;
            ns.pAGES = m.itemCount;
            ns.oBOOK = ns.bOOK;
          }
          if (this.DCRTable.fROM == m.from) {
            ns.mODBY = this.storage.userName;
            ns.mODDT = new Date();
            ns.mODLOC = this.storage.branch;
          }
        } else {
          //New Series from book

          if (m.to != ns.tO) {
            //Series is splitted
            ns.tO = m.to;
            ns.pAGES = m.itemCount;
            ns.oBOOK = ns.bOOK;
          }

          if (ns.fROM == m.from) {
            ns.mODBY = this.storage.userName;
            ns.mODDT = new Date();
            ns.mODLOC = this.storage.branch;
          } else {
            ns.eNTBY = this.storage.userName;
            ns.eNTDT = new Date();
            ns.eNTLOC = this.storage.branch;

            delete ns.mODBY;
            delete ns.mODDT;
            delete ns.mODLOC;
          }
          seriesData.push(ns);
        }
      });
    }

    seriesData.forEach((s) => {
      if (this.bookData.length > 1 && s.fROM != this.DCRTable.fROM) {
        s.bOOK = `${s.bOOK}-${this.bookData.length - 1}`;
        s._id = `${s.cID}-${s.tYP}-${s.bOOK}`;
      }

      if (s.bOOK == this.DCRTable.bOOK) {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_header",
          filter: { _id: s._id },
          update: s,
        };
        console.log("Update", req);

        const isSplit =
          s.fROM != this.DCRTable.fROM || s.tO != this.DCRTable.tO;
        var history = this.getHistoryDate(s, true, isSplit);
        console.log(history);
      } else {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_header",
          data: s,
        };

        console.log("Add", req);

        var history = this.getHistoryDate(s, false);
        console.log(history);
      }
    });

    // const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
    // if (res) {
    //   const resHis = await firstValueFrom(this.masterService.masterPost("generic/create", reqHis));
    //   // Display success message
    //   Swal.fire({
    //     icon: "success",
    //     title: "Successful",
    //     text: res.message,
    //     showConfirmButton: true,
    //     didClose: () => {
    //       // This function will be called when the modal is fully closed and destroyed
    //       this.route.navigateByUrl(
    //         "/Masters/DCRManagement"
    //       );
    //     }
    //   });
    //}
    this.DCRTableForm.reset();
  }

  //#endregion

  getHistoryDate(dcr, singleStatus = false, isSplit = false) {
    const tm = moment();
    const history = [];

    const commonProps = {
      _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${dcr.sTS}-${tm.format(
        "YYDDMM-HHmmss"
      )}`,
      cID: dcr.cID,
      tYP: dcr.tYP,
      bOOK: dcr.bOOK,
      oBOOK: dcr.oBOOK,
      fROM: dcr?.fROM || "",
      tO: dcr?.tO || "",
      pAGES: dcr?.pAGES || 0,
      eNTBY: this.storage.userName,
      eNTDT: tm,
      eNTLOC: this.storage.branch,
    };

    if (isSplit) {
      const slp = {
        ...commonProps,
        _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Splitted}-${tm
          .add(-1, "seconds")
          .format("YYDDMM-HHmmss")}`,
        sTS: DcrEvents.Splitted,
        sTSN: DcrEvents[DcrEvents.Splitted],
        eNTDT: tm.add(-1, "seconds"),
      };
      history.push(slp);
    }

    switch (dcr.sTS) {
      case DcrEvents.Added:
        const hAdd = {
          ...commonProps,
          sTS: DcrEvents.Added,
          sTSN: DcrEvents[DcrEvents.Added],
        };
        history.push(hAdd);
        break;
      case DcrEvents.Allocated:
        const hAdd1 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Added}-${tm
            .add(-1, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Added,
          sTSN: DcrEvents[DcrEvents.Added],
          eNTDT: tm.add(-1, "seconds"),
        };
        if (!singleStatus) history.push(hAdd1);

        const hAlo = {
          ...commonProps,
          sTS: DcrEvents.Allocated,
          sTSN: DcrEvents[DcrEvents.Allocated],
          aLOTO: dcr.aLOTO,
          aLOTONM: dcr.aLOTONM,
          aLOCD: dcr.aLOCD,
          aLONM: dcr.aLONM,
        };
        history.push(hAlo);
        break;
      case DcrEvents.Assigned:
        const hAdd2 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Added}-${tm
            .add(-2, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Added,
          sTSN: DcrEvents[DcrEvents.Added],
          eNTDT: tm.add(-2, "seconds"),
        };
        if (!singleStatus) history.push(hAdd2);

        const hAlo1 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Allocated}-${tm
            .add(-1, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Allocated,
          sTSN: DcrEvents[DcrEvents.Allocated],
          aLOTO: dcr.aLOTO,
          aLOTONM: dcr.aLOTONM,
          aLOCD: dcr.aLOCD,
          aLONM: dcr.aLONM,
          eNTDT: tm.add(-1, "seconds"),
        };
        if (!singleStatus) history.push(hAlo1);

        const hAsgn = {
          ...commonProps,
          sTS: DcrEvents.Assigned,
          sTSN: DcrEvents[DcrEvents.Assigned],
          aLOTO: dcr.aLOTO,
          aLOTONM: dcr.aLOTONM,
          aLOCD: dcr.aLOCD,
          aLONM: dcr.aLONM,
          aSNTO: dcr.aSNTO,
          aSNTONM: dcr.aSNTONM,
          aSNCD: dcr.aSNCD,
          aSNNM: dcr.aSNNM,
        };
        history.push(hAsgn);
        break;
    }
    return history;
  }

  //#region cancel
  cancel() {
    this.route.navigateByUrl("/Masters/DCRManagement");
  }
  //#endregion

  //#region  toGreaterThanFromValidator
  toGreaterThanFromValidator(event) {
    const from = this.DCRTableForm.value.from
      ? parseInt(this.DCRTableForm.value.from)
      : undefined;
    const to = this.DCRTableForm.value.to
      ? parseInt(this.DCRTableForm.value.to)
      : undefined;
    if (from && to && from > to) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "To document number should be greater than from document number",
        showConfirmButton: true,
      }).then(() => {
        this.DCRTableForm.get("to").reset();
      });
    }
  }
  //#endregion

  //#region resetForm
  resetForm() {
    if (this.valuechanged) {
      const initialAllocateTo = this.DCRTableForm.get("AllocateTo").value;
      this.DCRTableForm.reset();
      this.DCRTableForm.get("AllocateTo").setValue(initialAllocateTo);
      this.valuechanged = false;
    }
  }
  //#endregion
}
