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
    private operation: OperationService
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
    //   const req = {
    //     companyCode: this.companyCode,
    //     collectionName: "vehicle_status",
    //     filters: [
    //       {
    //         $match: {
    //           "vendorType": "Own"
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: "vehicle_detail",
    //           localField: "vehNo",
    //           foreignField: "vehicleNo",
    //           as: "vehicleData"
    //         }
    //       }
    //   ]
    // }
    const filters = [
      {
        D$match: {
          vendorType: "Own",
        },
      },
      {
        D$lookup: {
          from: "vehicle_detail",
          localField: "vehNo",
          foreignField: "vehicleNo",
          as: "vehicleData",
        },
      },
      {
        D$project: {
          data: "$vehicleData",
        },
      },
    ];
    //   filters: [
    //     {
    //         D$match: matchQuery,
    //     },
    //     {
    //         "D$lookup": {
    //             "from": "dockets",
    //             "let": { "pRQNO": "$pRQNO" },
    //             "pipeline": [
    //                 {
    //                     "D$match": {
    //                         "D$and": [
    //                             { "D$expr": { "D$eq": ["$pRQNO", "$$pRQNO"] } },
    //                             { "cNL": { "D$in": [false, null] } }
    //                         ]
    //                     }
    //                 }
    //             ],
    //             "as": "dockets"
    //         }
    //     },
    //     {
    //         "D$unwind": { "path": "$dockets", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$lookup": {
    //             "from": "mf_details",
    //             "let": { "dKTNO": "$dockets.dKTNO" },
    //             "pipeline": [
    //                 {
    //                     "D$match": {
    //                         "D$and": [
    //                             { "D$expr": { "D$eq": ["$dKTNO", "$$dKTNO"] } },
    //                             { "cNL": { "D$in": [false, null] } }
    //                         ]
    //                     }
    //                 }
    //             ],
    //             "as": "md"
    //         }
    //     },
    //     {
    //         "D$unwind": { "path": "$md", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$lookup": {
    //             "from": "mf_header",
    //             "let": { "mFNO": "$md.mFNO" },
    //             "pipeline": [
    //                 {
    //                     "D$match": {
    //                         "D$and": [
    //                             { "D$expr": { "D$eq": ["$docNo", "$$mFNO"] } },
    //                             { "cNL": { "D$in": [false, null] } }
    //                         ]
    //                     }
    //                 }
    //             ],
    //             "as": "mf"
    //         }
    //     },
    //     {
    //         "D$unwind": { "path": "$mf", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$lookup": {
    //             "from": "thc_summary",
    //             "let": { "tHC": "$mf.tHC" },
    //             "pipeline": [
    //                 {
    //                     "D$match": {
    //                         "D$and": [
    //                             { "D$expr": { "D$eq": ["$docNo", "$$tHC"] } },
    //                             { "cNL": { "D$in": [false, null] } }
    //                         ]
    //                     }
    //                 }
    //             ],
    //             "as": "trips"
    //         }
    //     },
    //     {
    //         "D$unwind": { "path": "$dockets", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$unwind": { "path": "$md", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$unwind": { "path": "$mf", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$unwind": { "path": "$trips", "preserveNullAndEmptyArrays": true }
    //     },
    //     {
    //         "D$project": {
    //             "prqNo": { "D$ifNull": ["$pRQNO", ""] },
    //             "prqDt": { "D$ifNull": ["$pICKDT", ""] },
    //             "PickDtTime": { "D$ifNull": ["$pICKDT", ""] },
    //             "prqStatus": { "D$ifNull": ["$sTSNM", ""] },
    //             "BillParty": { "D$concat": [{ "D$ifNull": ["$bPARTY", ""] }, " - ", { "D$ifNull": ["$bPARTYNM", ""] }] },
    //             "from": { "D$ifNull": ["$fCITY", ""] },
    //             "to": { "D$ifNull": ["$tCITY", ""] },
    //             "carrierType": { "D$ifNull": ["$cARTYPNM", ""] },
    //             "Cap": { "D$ifNull": ["$sIZE", ""] },
    //             "PayMode": { "D$ifNull": ["$pAYTYPNM", ""] },
    //             "PRQRaiseBranch": { "D$ifNull": ["$bRCD", ""] },
    //             "ContractAmt": { "D$ifNull": ["$cONTRAMT", ""] },
    //             "VehNo": { "D$ifNull": ["$vEHNO", ""] },
    //             "VenType": { "D$ifNull": ["$dockets.vENDTYNM", ""] },
    //             // "VenNmCd": { "D$concat": [{ "D$ifNull": ["$dockets.vNDCD", ""] }, " - ", { "D$ifNull": ["$dockets.vNDNM", ""] }] },
    //             "VenCD": { "D$ifNull": ["$dockets.vNDCD", ""] },
    //             "VenNm": { "D$ifNull": ["$dockets.vNDNM", ""] },
    //             "ConsigNoteNo": { "D$ifNull": ["$dockets.dKTNO", ""] },
    //             "ConsigNoteDt": { "D$ifNull": ["$dockets.dKTDT", ""] },
    //             "ConsigNoteTotAmt": { "D$ifNull": ["$dockets.tOTAMT", ""] },
    //             "THCNo": { "D$ifNull": ["$trips.docNo", ""] },
    //             "THCDt": { "D$ifNull": ["$trips.tHCDT", ""] },
    //             "THCAmt": { "D$ifNull": ["$trips.cONTAMT", ""] }
    //         }
    //     }
    // ]
    const res = await this.vehicleService.getVehicleNo(filters, true);
    console.log(res);
    // if(res){
    // const res = await firstValueFrom(
    //   this.vehicleService.getVehicleNo(filters,true)
    // );
    // const data = res?.data;
    // const vehicledata = data.map((x) => {
    //   return {
    //     name: x.vehNo,
    //     value: x.vehNo,
    //   };
    // });
    // this.filter.Filter(
    //   this.jsonControlJobOrderArray,
    //   this.JobOrderForm,
    //   vehicledata,
    //   this.vehicleNo,
    //   this.vehicleNoStatus
    // )
    // {
    //   "$match": {
    //     "vendorType": "Own"
    //   }
    // },
    // {
    //   "$lookup": {
    //     "from": "vehicle_detail",
    //     "localField": "vehNo",
    //     "foreignField": "vehicleNo",
    //     "as": "vehicleData"
    //   }
    // },
  }
  async getVehicleData() {
    const vehicleNovalue = this.JobOrderForm.controls["vehicleNo"].value;
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
      filter: { vEHNO: vehicleNovalue.name },
    };
    const joborderdata = await firstValueFrom(
      this.operation.operationPost("generic/get", request)
    );
    if (joborderdata.success && joborderdata.data.length > 0) {
      // Display an error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `This ${vehicleNovalue.name} Number Vehicle is already  in Maintenance! Please try with another!`,
        showConfirmButton: true,
      });
      this.JobOrderForm.controls["vehicleNo"].setValue("");
      return;
    } else {
      const req = {
        companyCode: this.companyCode,
        filter: { vehicleNo: vehicleNovalue.name },
        collectionName: "vehicle_detail",
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );
      const data = res?.data;
      const vehicledata = data.map((x) => {
        return {
          name: x.vehicleNo,
          value: x.vehicleType,
        };
      });
      if (vehicledata.length > 0) {
        this.VehicleTypeDetail(vehicledata);
      }
    }
  }
  async VehicleTypeDetail(data) {
    const dataObject = Object.fromEntries(
      data.flatMap(({ name, value }) => [
        ["name", name],
        ["value", value],
      ])
    );
    const req = {
      companyCode: this.companyCode,
      collectionName: "vehicleType_detail",
      filter: { vehicleTypeName: dataObject.value },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    const vehicleobject = Object.fromEntries(
      res.data.flatMap(({ oem, oemmodel }) => [
        ["oem", oem],
        ["oemmodel", oemmodel],
      ])
    );
    this.JobOrderForm.controls["oem"].setValue(vehicleobject.oem);
    this.JobOrderForm.controls["model"].setValue(vehicleobject.oemmodel);
  }
  async getJobOrdersData() {
    const requestObject = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/get", requestObject)
    );
    if (res.success) {
      const data = res.data;
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
    const createReq = {
      companyCode: this.companyCode,
      collectionName: "job_order_headers",
      data: data,
      filter: { companyCode: this.companyCode },
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/create", createReq)
    );
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
