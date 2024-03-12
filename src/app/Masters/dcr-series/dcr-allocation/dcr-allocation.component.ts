import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomerDetail, userDetail, vendorDetail } from "./dcr-apiUtility";
import { Router } from "@angular/router";
import { DcrAllocationForm } from "src/assets/FormControls/dcr_allocation_controls";
import { DCRModel } from "src/app/core/models/dcrallocation";

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
  submit = 'Save';
  breadScrums = [
    {
      title: "DCR Allocation",
      items: ["DCR"],
      active: "DCR Allocation",
    },
  ];
  originalJsonControlCustomerArray: any;
  valuechanged:boolean=false
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private route: Router,
  ) {

    this.DCRTable = new DCRModel();
    this.initializeFormControl();
  }
  initializeFormControl() {
    const DCRFormControls = new DcrAllocationForm(this.DCRTable);
    this.jsonControlCustomerArray = DCRFormControls.getControls();
    this.DCRTableForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerArray,
    ]);
  }

  ngOnInit(): void {
    this.originalJsonControlCustomerArray = [...this.jsonControlCustomerArray];
    this.DCRTableForm["controls"].AllocateTo.setValue("Location");
    this.handleChange();
    this.backPath = "/Masters/DocumentControlRegister/AddDCR";
  }
  async handleChange() {
    const value = this.DCRTableForm.get("AllocateTo").value;
    let filterFunction;
    switch (value) {
      case "Location":
        filterFunction = (x) => x.name !== "customer";
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
        break;
      case "Customer":
        filterFunction = (x) =>
          x.name !== "location" &&
          x.name !== "assignTo" &&
          x.name !== "name" &&
          x.name !== "noOfPages";
        let req1 = {
          companyCode: this.companyCode,
          collectionName: "customer_detail",
          filter: {},
        };
        this.masterService.masterPost("generic/get", req1).subscribe({
          next: (res: any) => {
            if (res) {
              const customerdetails = res.data.map((x ) => {
                return {
                  name: x.customerCode,
                  value: x.customerName,
                };
              });
              this.filter.Filter(
                this.jsonControlCustomerArray,
                this.DCRTableForm,
                customerdetails,
                "customer",
                true
              );
            }
          },
        });
        break;
    }
    this.jsonControlCustomerArray =
    this.originalJsonControlCustomerArray.filter(filterFunction);
   }
  async handleAssignChange() {
    const value = this.DCRTableForm.get("assignTo").value;
    switch (value) {
      case "Employee":
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
      case "BA":
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
      case "Customer":
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

  async save(){

  }

  cancel() {
    this.route.navigateByUrl("/Masters/DocumentControlRegister/AddDCR");
  }
}
