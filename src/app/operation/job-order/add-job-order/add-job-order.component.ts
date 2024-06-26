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
  counter: number;
  constructor(
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private operation: OperationService,
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
    this.getVehicleData();
    this.getJobOrdersData()
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
  async getVehicleData() {
    const req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "vehicle_detail",
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    const vehicledata = res?.data;
    const filteredvehicledata = this.getFilteredVehicleDetails(vehicledata);
    this.filter.Filter(
      this.jsonControlJobOrderArray,
      this.JobOrderForm,
      filteredvehicledata,
      this.vehicleNo,
      this.vehicleNoStatus
    );
  }
  getFilteredVehicleDetails(data: any) {
    return data
      .filter((element) => element.isActive)
      .map((element) => ({
        name: element.vehicleNo,
        value: element.vehicleType,
      }));
  }
  Reset(){
    if(!this.JobOrderForm.controls["vehicleNo"].value){
      this.JobOrderForm.controls["oem"].reset()
      this.JobOrderForm.controls["model"].reset()
    }
  }
  async getVehicleTypeDetail(){
    const vehicleNovalue=this.JobOrderForm.controls["vehicleNo"].value;
    console.log(vehicleNovalue);
    const req = {
      companyCode: this.companyCode,
      filter: {vehicleTypeName:vehicleNovalue.value},
      collectionName: "vehicleType_detail",
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    const vehicletypedata = res?.data;
    const vehicleobject = Object.fromEntries(
      vehicletypedata.flatMap(({ oem, oemmodel }) => [
          ['oem', oem], ['oemmodel', oemmodel]
      ])
  ); 
  this.JobOrderForm.controls["oem"].setValue(vehicleobject.oem)
  this.JobOrderForm.controls["model"].setValue(vehicleobject.oemmodel)
  }
  async getJobOrdersData() {
    const requestObject = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/get", requestObject)
    );
    if(res.success){
      const data = res.data;
      const lastJobOrder = data[data.length - 1];
      const lastJobNo = lastJobOrder.jOBNO;
      const lastFiveDigits = lastJobNo.split('/').pop();
      this.counter=parseInt(lastFiveDigits)
    }
  }
  async save() {
    const newNumberString = this.counter + 1;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const currentYearShort = currentYear.toString().slice(-2);
    const nextYearShort = nextYear.toString().slice(-2);
    const yearSegment = `${currentYearShort}_${nextYearShort}`;
    const randomNumber = "JS/" + this.storage.branch + "/" + yearSegment + "/" + `0000${newNumberString}`;
    const data={
      cID:this.storage.companyCode,
      docNo:randomNumber,
      jOBNO:randomNumber,
      vEHD:{
        vEHNO:this.JobOrderForm.controls["vehicleNo"].value.name,
        oEM:this.JobOrderForm.controls["oem"].value,
        mODEL:this.JobOrderForm.controls["model"].value,
      },
      jDT:this.JobOrderForm.controls["orderdate"].value,
      wNO:0,
      tCST:"",
      sTS:"Generated",
      sKM:this.JobOrderForm.controls["startKm"].value,
      lOC:this.storage.branch,
      eNTBY:this.storage.userName,
      eNTDT:new Date(),
      eNTLOC:this.storage.branch,
    }
    const createReq = {
      companyCode: this.companyCode,
      collectionName: "job_order_headers",
      data: data,
      filter:{companyCode: this.companyCode,}
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
