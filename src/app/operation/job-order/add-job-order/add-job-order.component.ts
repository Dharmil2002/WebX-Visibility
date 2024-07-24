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
  submit = "Save";
  companyCode: any;
  vehicleNo: string;
  vehicleNoStatus: any;
  counter: number = 0;
  isClose: boolean = false;
  closekm: any;
  totalcost: any;
  constructor(
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private vehicleService: VehicleService,
    private joborder: JobOrderService
  ) {
    this.companyCode = this.storage.companyCode;
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data.data;
      this.JobOrderModel = new JobOrderModel(data);
      this.isClose = true;
      this.breadScrums[0].active = "Job Order Close";
      this.breadScrums[0].title = "Job Order Close";
      this.submit = "Close";
    } else {
      this.JobOrderModel = new JobOrderModel({});
    }
  }
  ngOnInit() {
    this.initializeFormControl();
    this.getWorkOrderData(this.JobOrderModel.jobNo);
    this.getVehicleStatus();
    this.getJobOrdersData();
    this.handleDisableProperties();
  }
  initializeFormControl() {
    this.JobOrderFormControls = new JobOrderFormControls(
      this.JobOrderModel,
      this.isClose
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
  async getWorkOrderData(JobNo) {
    if (!this.isClose) {
      return;
    }
    const res = await this.joborder.getWorkOrdersWithFilters([
      {
        D$match: {
          jOBNO: JobNo,
          sTATUS: "Closed",
        },
      },
      {
        D$facet: {
          documentsWithCKM: [
            {
              D$addFields: {
                cKM: { D$max: "$cKM" }, // Ensure cKM is preserved correctly
              },
            },
            {
              D$sort: { cKM: -1 },
            },
            {
              D$limit: 1,
            },
          ],
          maintenanceServiceData: [
            {
              D$lookup: {
                from: "work_maintenance_service",
                localField: "wORKNO",
                foreignField: "wORKNO",
                as: "maintenanceServiceData",
              },
            },
            { D$unwind: "$maintenanceServiceData" },
            { D$replaceRoot: { newRoot: "$maintenanceServiceData" } },
          ],
          maintenanceSpairData: [
            {
              D$lookup: {
                from: "work_maintenance_spair",
                localField: "wORKNO",
                foreignField: "wORKNO",
                as: "maintenanceSpairData",
              },
            },
            { D$unwind: "$maintenanceSpairData" },
            { D$replaceRoot: { newRoot: "$maintenanceSpairData" } },
          ],
          batteryData: [
            {
              D$lookup: {
                from: "work_battery",
                localField: "wORKNO",
                foreignField: "wORKNO",
                as: "batteryData",
              },
            },
            { D$unwind: "$batteryData" },
            { D$replaceRoot: { newRoot: "$batteryData" } },
          ],
          TyreData: [
            {
              D$lookup: {
                from: "work_tyre_details",
                localField: "wORKNO",
                foreignField: "wORKNO",
                as: "TyreData",
              },
            },
            { D$unwind: "$TyreData" },
            { D$replaceRoot: { newRoot: "$TyreData" } },
          ],
        },
      },
      {
        D$project: {
          _id: 0,
          cKM: "$documentsWithCKM.cKM",
          totalCost: {
            D$sum: {
              D$add: [
                { D$sum: "$maintenanceServiceData.aPCST" },
                { D$sum: "$maintenanceSpairData.aPCST" },
                { D$sum: "$batteryData.lBCST" },
                { D$sum: "$TyreData.lBCST" },
              ],
            },
          },
        },
      },
    ]);
    this.closekm = res[0].cKM;
    this.totalcost = res[0].totalCost;
    this.JobOrderForm.controls["closeKm"].patchValue(this.closekm[0]);
    this.JobOrderForm.controls["tCost"].patchValue(this.totalcost);
  }

  handleDisableProperties() {
    if (this.isClose) {
      this.JobOrderForm.controls["orderdate"].disable();
      this.JobOrderForm.controls["closedate"].enable();
    } else {
      this.JobOrderForm.controls["closedate"].disable();
      this.JobOrderForm.controls["orderdate"].enable();
    }
  }
  async getVehicleStatus() {
    if (this.isClose) {
      return;
    }
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
      {
        D$project: {
          _id: 0,
          vehNo: 1,
          vehData: "$vehData.vehicleType",
        },
      },
    ];
    const res = await this.vehicleService.getVehicleNoWithFilters(
      filters,
      false
    );
    const vehicleData = res.map(({ vehNo, vehData }) => ({
      name: vehNo,
      value: vehData ? vehData[0] : "",
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
    if (this.isClose) {
      return;
    }
    const vehicleNovalue = this.JobOrderForm.controls["vehicleNo"].value;
    const joborderdata = await this.joborder.getJobOrderData({
      vEHNO: vehicleNovalue.name,
      sTS: "Generated",
    });
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
      if (!vehicleNovalue.value) {
        return;
      }
      const reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "vehicleType_detail",
        filters: [
          { D$match: { vehicleTypeName: vehicleNovalue.value } },
          {
            D$project: { _id: 0, oem: 1, oemmodel: 1 },
          },
        ],
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/query", reqBody)
      );
      const vehicletypedata = res.data;
      this.JobOrderForm.controls["oem"].setValue(vehicletypedata[0].oem);
      this.JobOrderForm.controls["model"].setValue(vehicletypedata[0].oemmodel);
    }
  }
  async getJobOrdersData() {
    const res = await this.joborder.getSingleJobOrderData({
      cID: this.storage.companyCode,
      lOC: this.storage.branch,
    });
    if (res) {
      const data = res;
      const lastJobNo = data.jOBNO;
      const lastFiveDigits = lastJobNo.split("/").pop();
      this.counter = parseInt(lastFiveDigits, 10); // Convert to integer
    }
  }
  async save() {
    this.counter += 1;
    const newNumberString = this.counter.toString().padStart(6, "0");
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
      `${newNumberString}`;
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
      cSBY: null,
      cSDT: null,
    };
    if (this.isClose) {
      const id = this.JobOrderModel._id;
      ["_id", "eNTBY", "eNTDT", "eNTLOC", "cID", "jOBNO", "docNo"].forEach(
        (key) => delete data[key]
      );
      data.sTS = "Closed";
      data.cKM = this.JobOrderForm.controls["closeKm"].value;
      data.jCDT = this.JobOrderForm.controls["closedate"].value;
      data.wCNO = this.JobOrderForm.controls["workorders"].value;
      data.tCST = this.JobOrderForm.controls["tCost"].value;
      data.cSBY = this.storage.userName;
      data.cSDT = new Date();
      data.mODBY = this.storage.userName;
      data.mODDT = new Date();
      data.mODLOC = this.storage.branch;
      const res = await this.joborder.updateJobOrder({ _id: id }, data);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Job Order Closed Successfully",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl("/Operation/JobOrder");
        });
      }
    } else {
      const res = await this.joborder.CreateJobOrder(data);
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Record added Successfully",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl("/Operation/JobOrder");
        });
      }
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
