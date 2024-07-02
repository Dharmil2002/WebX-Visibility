import { Component, OnInit } from "@angular/core";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { StorageService } from "src/app/core/service/storage.service";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { JobOrderFormControls } from "src/assets/FormControls/add-job-order-controls";
import { JobOrderModel } from "src/app/core/models/operations/joborder/add-job-order";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { VehicleService } from "src/app/Utility/module/masters/vehicle-master/vehicle-master-service";
import { JobOrderService } from "src/app/core/service/jobOrder-service/jobOrder-services.service";
@Component({
  selector: "app-add-job-order",
  templateUrl: "./add-job-order.component.html",
})
export class AddJobOrderComponent implements OnInit {
  breadScrums = [
    {
      title: "Add Job Order",
      items: ["Operations"],
      active: "Add Job Order",
    },
  ];
  JobOrderFormControls: JobOrderFormControls;
  jsonControlJobOrderArray: FormControls[];
  JobOrderForm: UntypedFormGroup;
  JobOrderModel: JobOrderModel;
  isUpdate: boolean = false;
  submit = "Save";
  companyCode: any;
  vehicleNo: string;
  vehicleNoStatus: any;
  counter: number = 0;
  constructor(
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private vehicleService: VehicleService,
    private operation: OperationService,
    private joborder:JobOrderService,
  ) {
    this.companyCode = this.storage.companyCode;
    this.JobOrderModel = new JobOrderModel({});
  }
  ngOnInit(): void {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.JobOrderModel = this.router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.breadScrums[0].active = "Job Order Modify";
      this.breadScrums[0].title = "Job Order Modify";
      this.submit = "Modify";
    }
    this.initializeFormControl();
    this.getVehicleStatus();
    this.getJobOrdersData();
  }
  initializeFormControl() {
    this.JobOrderFormControls = new JobOrderFormControls(
      this.JobOrderModel,
      this.isUpdate
    );
    this.jsonControlJobOrderArray =
      this.JobOrderFormControls.getJobOrderFormControls();
    this.jsonControlJobOrderArray.forEach((data) => {
      if (data.name === "vehicleNo") {
        this.vehicleNo = data.name;
        this.vehicleNoStatus = data.additionalData.showNameAndValue;
      }
    });
    this.JobOrderForm = formGroupBuilder(this.fb, [
      this.jsonControlJobOrderArray,
    ]);
  }

  async getVehicleStatus() {
    const filters = [
      {
        D$match: {
          D$and: [{ vendorType: "Own" }, { status: "Available" }],
        },
      },
      {
        D$lookup: {
          from: "vehicle_detail",
          localField: "vehNo",
          foreignField: "vehicleNo",
          as: "vehData",
        },
      },
    ];
    const res = await this.vehicleService.getVehicleNoWithFilters(
      filters,
      false
    );
    const vehicleData = res.map(({ vehNo, vehData }) => ({
      name: vehNo,
      value: vehData[0]?.vehicleType,
    }));
    this.filter.Filter(
      this.jsonControlJobOrderArray,
      this.JobOrderForm,
      vehicleData,
      this.vehicleNo,
      this.vehicleNoStatus
    );
  }
  async getVehicleData() {
    const vehicleNovalue = this.JobOrderForm.controls["vehicleNo"].value;
    const joborderdata=await this.joborder.getJobOrderData({ vEHNO: vehicleNovalue.name })
    if (joborderdata.length > 0) {
      // Display an error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `This ${vehicleNovalue.name} Number Vehicle is already in Maintenance! Please try with another!`,
        showConfirmButton: true,
      });
      this.JobOrderForm.controls["vehicleNo"].setValue("");
      return;
    } else {
      const reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "vehicleType_detail",
        filter: { vehicleTypeName: vehicleNovalue.value },
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/get", reqBody)
      );
      const vehicletypedata = res.data;
      this.JobOrderForm.controls["oem"].setValue(vehicletypedata[0].oem);
      this.JobOrderForm.controls["model"].setValue(vehicletypedata[0].oemmodel);
    }
  }
  async getJobOrdersData() {
    const res=await this.joborder.getJobOrderData({cID:this.storage.companyCode})
    if (res.length > 0) {
      const data = res;
      const lastJobOrder = data[data.length - 1];
      const lastJobNo = lastJobOrder.jOBNO;
      const lastFiveDigits = lastJobNo.split("/").pop();
      this.counter = parseInt(lastFiveDigits);
    }
  }
  async save() {
    const newNumberString = this.counter + 1;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const currentYearShort = currentYear.toString().slice(-2);
    const nextYearShort = nextYear.toString().slice(-2);
    const yearSegment = `${currentYearShort}_${nextYearShort}`;
    const randomNumber =
      "JS/" +
      this.storage.branch +
      "/" +
      yearSegment +
      "/" +
      `0000${newNumberString}`;
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      docNo: randomNumber,
      jOBNO: randomNumber,
      vEHD: {
        vEHNO: this.JobOrderForm.controls["vehicleNo"].value.name,
        oEM: this.JobOrderForm.controls["oem"].value,
        mODEL: this.JobOrderForm.controls["model"].value,
      },
      vEHNO: this.JobOrderForm.controls["vehicleNo"].value.name,
      jDT: this.JobOrderForm.controls["orderdate"].value,
      jCDT: null,
      wNO: 0,
      wCNO: 0,
      sKM: this.JobOrderForm.controls["startKm"].value,
      cKM: 0,
      tCST: 0,
      sTS: "Generated",
      lOC: this.storage.branch,
      cLTP: null,
      cL: null,
      cLDT: null,
      cLACDT: null,
      cRMRK: null,
      cLBY: null,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    };
    const res = await this.joborder.CreateJobOrder(data,{cID:this.storage.companyCode})
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: "Record added Successfully",
        showConfirmButton: true,
      });
      this.router.navigateByUrl("/Operation/JobOrder");
    }
  }
  Reset() {
    if (!this.JobOrderForm.controls["vehicleNo"].value) {
      this.JobOrderForm.controls["oem"].reset();
      this.JobOrderForm.controls["model"].reset();
    }
  }
  cancel() {
    this.router.navigateByUrl("Operation/JobOrder");
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
}
