import { Component, OnInit } from "@angular/core";
import {AbstractControl,UntypedFormBuilder,UntypedFormGroup} from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomerDetail, userDetail, vendorDetail } from "./dcr-apiUtility";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { DcrAllocationForm } from "src/assets/FormControls/dcr_allocation_controls";
import { DCRModel } from "src/app/core/models/dcrallocation";
import { firstValueFrom } from "rxjs";
import { DcrEvents } from "src/app/Models/docStatus";
import { StorageService } from "src/app/core/service/storage.service";
import moment from "moment";
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
  breadScrums = [
    {
      title: "DCR Allocation",
      items: ["DCR"],
      active: "DCR Allocation",
    },
  ];

  //#region constructor
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private route: Router,
    private storage: StorageService
  ) {
    this.DCRTable = new DCRModel();
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
    this.backPath = "/Masters/DCRManagement";
  }
  //#endregion

  //#region clearControlValidators
  clearControlValidators(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }
  //#endregion

  //#region handleChange
  async handleChange() {
    const value = this.DCRTableForm.get("AllocateTo").value;
    let filterFunction;
    switch (value) {
      case "L":
        filterFunction = (x) =>
          x.name === "AllocateTo" ||
          x.name === "location" ||
          x.name === "assignTo" ||
          x.name === "noOfPages" ||
          x.name === "name" ||
          x.name === "from" ||
          x.name === "to" ||
          x.name === "isActive";
        let req = {
          companyCode: this.companyCode,
          collectionName: "location_detail",
          filter: {},
        };
        this.masterService.masterPost("generic/get", req).subscribe({
          next: (res: any) => {
            if (res) {
              const locationdetails = res.data.map((x) => {
                return {
                  name: x.locCode,
                  value: x.locName,
                };
              });
              this.filter.Filter(
                this.jsonControlCustomerArray,
                this.DCRTableForm,
                locationdetails,
                "location",
                true
              );
            }
          },
        });
        // this.clearControlValidators(this.DCRTableForm.get("customer"))
        this.resetForm();
        break;
      case "C":
        // this.DCRTableForm.get("name").setValue("")
        filterFunction = (x) =>
          x.name !== "location" &&
          x.name !== "assignTo" &&
          // x.name !== "name" &&
          x.name !== "noOfPages";
        let req1 = {
          companyCode: this.companyCode,
          collectionName: "customer_detail",
          filter: {},
        };
        this.masterService.masterPost("generic/get", req1).subscribe({
          next: (res: any) => {
            if (res) {
              const customerdetails = res.data.map((x) => {
                return {
                  name: x.customerCode,
                  value: x.customerName,
                };
              });
              this.filter.Filter(
                this.jsonControlCustomerArray,
                this.DCRTableForm,
                customerdetails,
                "name",
                true
              );
            }
          },
        });
        this.clearControlValidators(this.DCRTableForm.get("location"));
        this.clearControlValidators(this.DCRTableForm.get("assignTo"));
        // this.clearControlValidators(this.DCRTableForm.get("name"));
        this.clearControlValidators(this.DCRTableForm.get("noOfPages"));
        this.resetForm();
        break;
    }
    this.jsonControlCustomerArray =
      this.originalJsonControlCustomerArray.filter(filterFunction);
  }
  //#endregion

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
        this.DCRTableForm.value.location.value
      );
      this.DCRTableForm.controls["name"].setValue(
        this.DCRTableForm.value.name.value
      );
    }
    if (this.DCRTableForm.get("AllocateTo").value === "C") {
      this.DCRTableForm.controls["name"].setValue(
        this.DCRTableForm.value.name.value
      );
      delete this.DCRTableForm.value.location;
      delete this.DCRTableForm.value.assignTo;
      delete this.DCRTableForm.value.noOfPages;
    }
    console.log("this.DCRTableForm.value", this.DCRTableForm.value);
    this.DCRTableForm.reset();
    const dcrHistory = {
      _id: `${this.companyCode}-${this.DCRTableForm.value.AllocateTo}-${this.DCRTableForm.value.name.name}-${moment().format("YYDDMM-HHmmss")}`,
      cID: this.companyCode,
      aLOTO: this.DCRTableForm.value.AllocateTo,  //L: Location, C: Customer
      aLOCD: this.DCRTableForm.value.location.name,
      aLONM: this.DCRTableForm.value.location.value,
      aSNTO: this.DCRTableForm.value.assignTo,  //E: Location, B: BA, C: Customer
      aSNCD: this.DCRTableForm.value.name.name,
      aSNNM: this.DCRTableForm.value.name.value, //aSNTO,aLOTO
      fROM: this.DCRTableForm.value.from,
      tO: this.DCRTableForm.value.to,
      pAGES: this.DCRTableForm.value.noOfPages,
      eVN: DcrEvents.Allocated,
      eVNNM: DcrEvents[DcrEvents.Allocated],
      eNTBY:this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch
    };
    console.log("dcrHistory",dcrHistory);

    let reqHis = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "dcr_history",
      data: dcrHistory,
    };

    const res = await firstValueFrom(this.masterService.masterPost("generic/create", reqHis));
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
    this.DCRTableForm.reset()
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
