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
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { VendorService } from "src/app/Utility/module/masters/vendor-master/vendor.service";
import { DcrAllocationForm } from "src/assets/FormControls/dcr_allocation_controls";
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
    this.isSeriesValid();
  }
  //#endregion

  //#region isSeriesExists()
  async isSeriesValid() {
    const splitFrom = this.DCRTableForm.value.from;
    const splitTo = this.DCRTableForm.value.to;

    try {
      this.splitSeries = splitSeries(
        this.DCRTable.fROM,
        this.DCRTable.tO,
        splitFrom,
        splitTo
      );
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
  //#endregion

  //#region handleChange
  async handleChange() {
    const jsonControlCustomerArray = this.jsonControlCustomerArray;
    const value = this.DCRTableForm.get("AllocateTo").value;
    let filterFunction;
    //  const name =["AllocateTo","location","assignTo","noOfPages","name","from","to"]
    switch (value) {
      case "L":
        filterFunction = (x) =>
          x.name === "AllocateTo" ||
          x.name === "allocation" ||
          x.name === "assignTo" ||
          x.name === "noOfPages" ||
          x.name === "name" ||
          x.name === "from" ||
          x.name === "to";
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
              "allocation",
              true
            );
          }
        this.jsonControlCustomerArray.forEach((element) => {
          if (element.name == "allocation") {
            element.label = "Location";
          }
        });
        } catch (error) {
          console.error("Error fetching location details:", error);
          // Handle errors here
        }
        break;
      case "C":
        filterFunction = (x) =>
          // x.name !== "location" && x.name !== "noOfPages"
          x.name !== "assignTo" && x.name !== "name";
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
              "allocation",
              true
            );
            this.jsonControlCustomerArray.forEach((element) => {
              if (element.name == "allocation") {
                element.label = "Customer";
              }
            });
          }
        } catch (error) {
          console.error("Error fetching customer details:", error);
          // Handle errors here
        }
        // this.clearControlValidators(this.DCRTableForm.get("location"));
        this.clearControlValidators(this.DCRTableForm.get("assignTo"));
        this.clearControlValidators(this.DCRTableForm.get("name"));
        // this.clearControlValidators(this.DCRTableForm.get("noOfPages"));
        //this.resetForm();
        break;
    }
    this.jsonControlCustomerArray =
      this.originalJsonControlCustomerArray.filter(filterFunction);
  }
  //#endregion
  async  getAlloction($event){
    const event=$event
  }
  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(
      this.DCRTableForm,
      this.jsonControlCustomerArray,
      event.field.name,
      true
    );
  }

  /*here i  created a Function for the destination*/
  async getLocations(event) {
    if (this.DCRTableForm.controls.allocation.value.length > 2) {
      const destinationMapping = await this.locationService.locationFromApi({
        locCode: {
          D$regex: `^${this.DCRTableForm.controls.allocation.value}`,
          D$options: "i",
        },
      });
      this.jsonControlCustomerArray.forEach((element) => {
        if (element.name == "allocation") {
          element.label = "Location";
        }
      });
      this.filter.Filter(
        this.jsonControlCustomerArray,
        this.DCRTableForm,
        destinationMapping,
        "allocation",
        true
      );
    }
  }

  // async getCustomer(event) {
  //   await this.customerService.getCustomerForAutoComplete(
  //     this.DCRTableForm,
  //     this.jsonControlCustomerArray,
  //     event.field.name,
  //     true
  //   );

  //   // Add the functionality from getLocations
  //   if (event.field.name === "allocation" && this.DCRTableForm.controls.allocation.value.length > 2) {
  //     const destinationMapping = await this.locationService.locationFromApi({
  //       locCode: {
  //         D$regex: `^${this.DCRTableForm.controls.allocation.value}`,
  //         D$options: "i",
  //       },
  //     });

  //     // Update label to "Location" for the element with name "allocation"
  //     this.jsonControlCustomerArray.forEach((element) => {
  //       if (element.name === "allocation") {
  //         element.label = "Location";
  //       }
  //     });

  //     // Update label to "Customer" for the element with name "allocation"
  //     this.jsonControlCustomerArray.forEach((element) => {
  //       if (element.name === "allocation") {
  //         element.label = "Customer";
  //       }
  //     });

  //     // Apply the filter
  //     this.filter.Filter(
  //       this.jsonControlCustomerArray,
  //       this.DCRTableForm,
  //       destinationMapping,
  //       "allocation",
  //       true
  //     );
  //   }
  // }

  //#region handleAssignChange
  async handleAssignChange() {
    const value = this.DCRTableForm.get("assignTo").value;
    switch (value) {
      case "E":
        this.DCRTableForm.controls["name"].setValue("");
        const userdetais = await this.dcrService.userDetail(this.masterService);
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
        const vendordetails = await this.dcrService.vendorDetail(this.masterService);
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
        const customerdetails = await this.dcrService.CustomerDetail(this.masterService);
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
    const formData = this.DCRTableForm.value;
    const aLOCTONM = this.allocateTo.find(
      (x) => x.value == formData?.AllocateTo
    );

    const aSNTO = this.assignTo.find((x) => x.value == formData?.assignTo);

    const splitFrom = formData.from;
    const splitTo = formData.to;

    let seriesData: any[] = [];

    //Check Series is split or not
    this.splitSeries.forEach((m) => {
      var ns = { ...this.DCRTable };

      if (m.to != ns.tO || m.from != ns.fROM) {
        //Series is splitted
        ns.fROM = m.from;
        ns.tO = m.to;
        ns.pAGES = m.itemCount;
        ns.oBOOK = ns.bOOK;
      }

      if (m.from == splitFrom) {
        ns.aLOTO = this.DCRTableForm.value?.AllocateTo || ""; //L: Location, C: Customer
        ns.aLOTONM = aLOCTONM?.name || "";
        ns.aLOCD = this.DCRTableForm.value?.allocation?.value || "";
        ns.aLONM = this.DCRTableForm.value?.allocation?.name || "";
        ns.aSNTO = aSNTO?.value || "";
        ns.aSNTONM = aSNTO?.name || ""; //E: Location, B: BA, C: Customer
        ns.aSNCD = this.DCRTableForm.value?.name?.value || "";
        ns.aSNNM = this.DCRTableForm.value?.name?.name || "";
        ns.sTS = ns.aSNTO == "" ? DcrEvents.Allocated : DcrEvents.Assigned;
        ns.sTSN =
          ns.aSNTO == ""
            ? DcrEvents[DcrEvents.Allocated]
            : DcrEvents[DcrEvents.Assigned];

        if (this.DCRTable.fROM == m.from) {
          ns.mODBY = this.storage.userName;
          ns.mODDT = new Date();
          ns.mODLOC = this.storage.branch;
        }
      } else {
        //New Series from book

        if (this.DCRTable.fROM == m.from) {
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
      }
      delete ns.action;
      seriesData.push(ns);
    });

    seriesData.forEach(async (s, i) => {
      if (s.fROM != this.DCRTable.fROM) {
        const bookNo = this.bookData.length - 1 + (i + 1);
        s.bOOK = `${s.bOOK}-${bookNo}`;
        s._id = `${s.cID}-${s.tYP}-${s.bOOK}`;
      }

      if (s.bOOK == this.DCRTable.bOOK) {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_header",
          filter: { _id: s._id },
          update: s,
        };
        const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
            didClose: () => {
              // This function will be called when the modal is fully closed and destroyed
              this.route.navigateByUrl(
                "/Masters/DCRManagement"
              );
            }
          });
        }

        const isSplit =
          s.fROM != this.DCRTable.fROM || s.tO != this.DCRTable.tO;
        const isStatusChanged = s.sTS != this.DCRTable.sTS;

        let history = this.getHistoryDate(s, true, isSplit, isStatusChanged);
         let reqhistory = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_history",
          data: history,
        };
        await firstValueFrom(this.masterService.masterPost("generic/create", reqhistory));
      } else {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_header",
          data: s,
        };

        const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
            didClose: () => {
              // This function will be called when the modal is fully closed and destroyed
              this.route.navigateByUrl(
                "/Masters/DCRManagement"
              );
            }
          });
        }
        let history = this.getHistoryDate(s, false, false, true);
        let reqhistory = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "dcr_history",
          data: history,
        };
        await firstValueFrom(this.masterService.masterPost("generic/create", reqhistory));
      }
    });
    this.DCRTableForm.reset();
  }

  //#endregion

  //#region getHistoryDate
  getHistoryDate(
    dcr,
    singleStatus = false,
    isSplit = false,
    isStatusChanged = false
  ) {
    const tm = moment().format("YYDDMM-HHmmss");
    const history = [];

    const commonProps = {
      _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${dcr.sTS}-${tm}`,
      cID: dcr.cID,
      tYP: dcr.tYP,
      bOOK: dcr.bOOK,
      oBOOK: dcr.oBOOK,
      fROM: dcr?.fROM || "",
      tO: dcr?.tO || "",
      pAGES: dcr?.pAGES || 0,
      eNTBY: this.storage.userName,
      eNTDT: moment(tm, "YYDDMM-HHmmss").toDate(),
      eNTLOC: this.storage.branch,
    };

    if (isSplit) {
      const slp = {
        ...commonProps,
        _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Splitted}-${moment(
          tm,
          "YYDDMM-HHmmss"
        )
          .add(-1, "seconds")
          .format("YYDDMM-HHmmss")}`,
        sTS: DcrEvents.Splitted,
        sTSN: DcrEvents[DcrEvents.Splitted],
        eNTDT: moment(tm, "YYDDMM-HHmmss").add(-1, "seconds").toDate(),
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
        if (isStatusChanged) history.push(hAdd);
        break;
      case DcrEvents.Allocated:
        const hAdd1 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Added}-${moment(
            tm,
            "YYDDMM-HHmmss"
          )
            .add(-1, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Added,
          sTSN: DcrEvents[DcrEvents.Added],
          eNTDT: moment(tm, "YYDDMM-HHmmss").add(-1, "seconds").toDate(),
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
        if (isStatusChanged) history.push(hAlo);
        break;
      case DcrEvents.Assigned:
        const hAdd2 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${DcrEvents.Added}-${moment(
            tm,
            "YYDDMM-HHmmss"
          )
            .add(-2, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Added,
          sTSN: DcrEvents[DcrEvents.Added],
          eNTDT: moment(tm, "YYDDMM-HHmmss").add(-2, "seconds").toDate(),
        };
        if (!singleStatus) history.push(hAdd2);

        const hAlo1 = {
          ...commonProps,
          _id: `${dcr.cID}-${dcr.tYP}-${dcr.bOOK}-${
            DcrEvents.Allocated
          }-${moment(tm, "YYDDMM-HHmmss")
            .add(-1, "seconds")
            .format("YYDDMM-HHmmss")}`,
          sTS: DcrEvents.Allocated,
          sTSN: DcrEvents[DcrEvents.Allocated],
          aLOTO: dcr.aLOTO,
          aLOTONM: dcr.aLOTONM,
          aLOCD: dcr.aLOCD,
          aLONM: dcr.aLONM,
          eNTDT: moment(tm, "YYDDMM-HHmmss").add(-1, "seconds").toDate(),
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
        if (isStatusChanged) history.push(hAsgn);
        break;
    }
    return history;
  }
  //#endregion

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
