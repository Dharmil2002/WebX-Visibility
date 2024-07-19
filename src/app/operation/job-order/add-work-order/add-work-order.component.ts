import { Component, OnInit } from "@angular/core";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { StorageService } from "src/app/core/service/storage.service";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import {
  autocompleteValidator,
  formGroupBuilder,
} from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { firstValueFrom } from "rxjs";
import { WorkOrderFormControls } from "src/assets/FormControls/add-work-order-controls";
import { WorkOrderModel } from "src/app/core/models/operations/joborder/add-work-order";
import {
  StaticFields,
  columnHeader,
  TyreDetailsColumnHeader,
  TyreDetailsStaticFields,
  ServiceDetailsColumnHeader,
  ServiceDetailsStaticFields,
  SpareDetailsColumnHeader,
  SpareDetailsStaticFields,
  DynamicControls,
} from "./workorderutility";
import { HttpClient } from "@angular/common/http";
import moment from "moment";
import Swal from "sweetalert2";
import { DataService } from "src/app/core/service/job-order.service";
import { JobOrderService } from "src/app/core/service/jobOrder-service/jobOrder-services.service";
@Component({
  selector: "app-add-work-order",
  templateUrl: "./add-work-order.component.html",
})
export class AddWorkOrderComponent implements OnInit {
  jsonUrl = "../../../assets/data/work-order-table-data.json";
  breadscrums = [
    {
      title: "Add Work Order",
      items: ["Operations"],
      active: "Add Work Order",
    },
  ];
  isUpdate: boolean = false;
  isServiceDetailsLoad: boolean = false;
  isSpareDetailsLoad: boolean = false;
  isTyreDetailsLoad: boolean = false;
  tableLoad: boolean = false;
  submit = "Save";
  companyCode: any;
  tableData: any[] = [];
  tableData1: any[] = [];
  tableData2: any[] = [];
  tableData3: any[] = [];
  selectedcategory: any;
  backPath: string;
  columnHeader = columnHeader;
  TyreDetailsColumnHeader = TyreDetailsColumnHeader;
  ServiceDetailsColumnHeader = ServiceDetailsColumnHeader;
  SpareDetailsColumnHeader = SpareDetailsColumnHeader;
  TyreDetailsStaticFields = TyreDetailsStaticFields;
  ServiceDetailsStaticFields = ServiceDetailsStaticFields;
  SpareDetailsStaticFields = SpareDetailsStaticFields;
  staticFields = StaticFields;
  dynamicControls = DynamicControls;
  WorkOrderFormControls: WorkOrderFormControls;
  WorkOrderForm: UntypedFormGroup;
  ServiceDetailsForm: UntypedFormGroup;
  SpareDetailsForm: UntypedFormGroup;
  BatteryChangeForm: UntypedFormGroup;
  TyreDetailsForm: UntypedFormGroup;
  LabourDetailsForm: UntypedFormGroup;
  WorkOrderModel: WorkOrderModel;
  jsonControlWorkOrderArray: FormControls[];
  jsonControlServiceDetailsArray: FormControls[];
  jsonControlSpareDetailsArray: FormControls[];
  jsonControlBatteryChangeArray: FormControls[];
  jsonControlTyreDetailsArray: FormControls[];
  jsonControlLabourDetailsArray: FormControls[];
  data: Object;
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  menuItemflag = true;
  menuItemData: any;
  counter: number = 0;
  originalJsonControlWorkOrderArray: any;
  vendorStatus: any;
  vendor: string;
  location: string;
  locationStatus: any;
  valuechanged: boolean = false;
  jobsubCategory: string;
  jobsubCategoryStatus: any;
  handedover: string;
  handedoverStatus: any;
  supervisor: string;
  supervisorStatus: any;
  ServiceData: { count: any; title: string; class: string }[];
  SpareData: { count: any; title: string; class: string }[];
  returnto: string;
  returntoStatus: any;
  vendorData: any;
  isClose: boolean = false;
  historyworkOrderData: any;
  historyMaintenaceServiceData: any;
  historyMaintenaceSpareData: any;
  historyTyreDetailsData: any;
  historyTyreManagnmentData: any;
  historyBatteryData: any;
  workorderdata: any;
  workOrderNo: any;
  constructor(
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private dataService: DataService,
    private masterService: MasterService,
    private joborder: JobOrderService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.workorderdata = this.router.getCurrentNavigation().extras.state.data;
      const label = this.workorderdata?.label.label;
      this.breadscrums[0].active =
        label === "Update" ? "Work Order Modify" : "Work Order Close";
      this.breadscrums[0].title =
        label === "Update" ? "Work Order Modify" : "Work Order Close";
      this.isUpdate = label === "Update";
      this.isClose = label !== "Update";
      this.submit = label === "Update" ? "Modify" : "Close";
    }
    this.menuItemData = this.dataService.getMenuItemData();
    if (this.menuItemData) {
      this.WorkOrderModel = new WorkOrderModel(this.menuItemData.data);
    } else {
      this.WorkOrderModel = new WorkOrderModel({});
      this.router.navigateByUrl("Operation/JobOrder");
    }
  }
  ngOnInit(): void {
    this.backPath = "/Operation/JobOrder";
    this.http.get(this.jsonUrl).subscribe((res) => {
      // this.tableLoad=true
      this.data = res;
      let tableArray = this.data["data"];
      this.tableData = tableArray;
      // this.tableLoad = false;
    });
    if (this.isUpdate || this.isClose) {
      this.getWorkOrderRelatedData(
        this.workorderdata?.data?.wORKNO,
        this.workorderdata?.data?.cATEGORY
      );
    }
    this.initializeFormControl();
    this.getWorkOrdersData();
    this.getJobSubCategorydata();
    this.getUserData();
    this.checkForWorkshopType();
    this.handleDisabledProperties();
    this.WorkOrderForm.controls["workshoptype"].valueChanges.subscribe((x) => {
      this.valuechanged = true;
    });
  }
  initializeFormControl() {
    this.WorkOrderFormControls = new WorkOrderFormControls(
      this.WorkOrderModel,
      this.isUpdate,
      this.isClose
    );
    this.jsonControlWorkOrderArray =
      this.WorkOrderFormControls.getWorkOrderFormControls();
    this.jsonControlServiceDetailsArray =
      this.WorkOrderFormControls.getServiceDetailsArrayControls();
    this.jsonControlSpareDetailsArray =
      this.WorkOrderFormControls.getSpareDetailsArrayControls();
    this.jsonControlBatteryChangeArray =
      this.WorkOrderFormControls.getBatteryChangeArrayControls();
    this.jsonControlTyreDetailsArray =
      this.WorkOrderFormControls.getTyreDetailsArrayControls();
    this.jsonControlLabourDetailsArray =
      this.WorkOrderFormControls.getLabourDetailsArrayControls();
    this.jsonControlWorkOrderArray.forEach((data) => {
      switch (data.name) {
        case "vendor":
          this.vendor = data.name;
          this.vendorStatus = data.additionalData.showNameAndValue;
          break;
        case "location":
          this.location = data.name;
          this.locationStatus = data.additionalData.showNameAndValue;
          break;
        case "subcategory":
          this.jobsubCategory = data.name;
          this.jobsubCategoryStatus = data.additionalData.showNameAndValue;
          break;
        case "handedover":
          this.handedover = data.name;
          this.handedoverStatus = data.additionalData.showNameAndValue;
          break;
        case "supervisor":
          this.supervisor = data.name;
          this.supervisorStatus = data.additionalData.showNameAndValue;
          break;
        case "returnto":
          this.returnto = data.name;
          this.returntoStatus = data.additionalData.showNameAndValue;
          break;
        default:
          return;
      }
    });
    this.originalJsonControlWorkOrderArray = [
      ...this.jsonControlWorkOrderArray,
    ];
    this.WorkOrderForm = formGroupBuilder(this.fb, [
      this.jsonControlWorkOrderArray,
    ]);
    this.ServiceDetailsForm = formGroupBuilder(this.fb, [
      this.jsonControlServiceDetailsArray,
    ]);
    this.SpareDetailsForm = formGroupBuilder(this.fb, [
      this.jsonControlSpareDetailsArray,
    ]);
    this.BatteryChangeForm = formGroupBuilder(this.fb, [
      this.jsonControlBatteryChangeArray,
    ]);
    this.TyreDetailsForm = formGroupBuilder(this.fb, [
      this.jsonControlTyreDetailsArray,
    ]);
    this.LabourDetailsForm = formGroupBuilder(this.fb, [
      this.jsonControlLabourDetailsArray,
    ]);
    if (this.isUpdate || this.isClose) {
      this.WorkOrderForm.controls["ordercategory"].patchValue(
        this.menuItemData.data.cATEGORY
      );
      this.WorkOrderForm.controls["workshoptype"].patchValue(
        this.menuItemData.data.tYPE
      );
      this.CheckForSelectedCategory();
      this.ServiceDetailsForm.controls["StartDTM"].setValue("");
    } else {
      // this block will run when isUpdate and isClose is false which means at the time of adding the data
      this.WorkOrderForm.controls["workshoptype"].patchValue("Internal");
    }
  }
  clearControlValidators(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }
  applyValidators(control, validators) {
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }
  toggleEnableFormControls(
    formControls: { [key: string]: string[] },
    shouldEnable: boolean
  ) {
    Object.keys(formControls).forEach((form) => {
      formControls[form].forEach((control) => {
        shouldEnable
          ? this[form].controls[control].enable()
          : this[form].controls[control].disable();
      });
    });
  }
  handleDisabledProperties() {
    const formControls = {
      ServiceDetailsForm: ["EndDTM", "ApprovedCost"],
      SpareDetailsForm: ["EndDTM", "ApprovedCost"],
      WorkOrderForm: [
        "closeKmRead",
        "ServiceKm",
        "actualreturndate",
        "returnto",
      ],
      BatteryChangeForm: ["NSerial", "NOEM", "NModel", "NReason"],
      TyreDetailsForm: ["ChangeReason", "NTyreID", "NOEMandModel"],
    };
    this.toggleEnableFormControls(formControls, this.isClose);
    if (this.isClose) {
      this.WorkOrderForm.controls["orderdate"].disable();
      this.WorkOrderForm.controls["sentdate"].disable();
    }
  }
  setMaintenanceServiceData(data) {
    for (const x of data) {
      this.tableData1.push({
        id: x._id,
        TaskGroup: x.tSGRP,
        Task: x.tASK,
        MaintenanceType: x.mAINTP,
        Estimatedhours: x.eSTHRS,
        Hourlycost: x.hCST,
        Cost: x.cST,
        ApprovedCost: x.aPCST,
        Mechanic: x.mECNIC,
        StartDTM: x.sDTM,
        EndDTM: x.eDTM,
        actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
      });
    }
    this.SetServiceData();
    this.updateTotalTableValues(this.tableData1, this.tableData2);
    this.tableLoad = true;
    this.isServiceDetailsLoad = true;
  }
  setMaintenanceSpareData(data) {
    for (const x of data) {
      this.tableData2.push({
        id: x._id,
        TaskGroup: x.tSGRP,
        SparePart: x.sPRt,
        MaintenanceType: x.mAINTP,
        Stock: x.sTO,
        Quantity: x.qUAN,
        CostOrUnit: x.cST,
        TCost: x.TcST,
        ApprovedCost: x.aPCST,
        Mechanic: x.mECNIC,
        StartDTM: x.sDTM,
        EndDTM: x.eDTM,
        actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
      });
    }
    this.SetSpareData();
    this.updateTotalTableValues(this.tableData1, this.tableData2);
    this.isSpareDetailsLoad = true;
  }
  setbatterydata(data) {
    this.BatteryChangeForm.controls["CSerial"].setValue(data.sRL.cRT);
    this.BatteryChangeForm.controls["COEM"].setValue(data.oEM.cRT);
    this.BatteryChangeForm.controls["CModel"].setValue(data.mDL.cRT);
    this.BatteryChangeForm.controls["CReason"].setValue(data.rESN.cRT);
  }
  setLabourtData(data) {
    this.LabourDetailsForm.controls["Mechanic"].setValue(data.mECNIC);
    this.LabourDetailsForm.controls["CostH"].setValue(data.cSTH);
    this.LabourDetailsForm.controls["LabourH"].setValue(data.lBH);
    this.LabourDetailsForm.controls["LabourC"].setValue(data.lBCST);
  }
  setTyreData(data) {
    for (const x of data) {
      this.tableData3.push({
        id: x._id,
        position: x.pSN,
        CTyreID: x.cTID,
        COEMandModel: x.oNMODL,
        NOEMandModel: x.nONMODL,
        NTyreID: x.nTID,
        Comment: x.cMT ? x.cMT : "",
        ChangeReason: x.cREASON,
        Cost: x.cST,
        actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
      });
    }
    this.isTyreDetailsLoad = true;
  }

  async getWorkOrderRelatedData(workOrderNo, category) {
    this.workOrderNo = workOrderNo;
    const aggregationFilters: any = [
      {
        D$match: {
          wORKNO: workOrderNo,
        },
      },
    ];
    let resultProcessing;
    switch (category) {
      case "Battery management":
        aggregationFilters.push({
          D$lookup: {
            from: "work_battery",
            localField: "wORKNO",
            foreignField: "wORKNO",
            as: "batteryManagementData",
          },
        });
        if (this.isClose) {
          aggregationFilters.push({
            D$project: {
              _id: 0,
              batteryManagementData: "$batteryManagementData",
            },
          });
        }
        resultProcessing = (workOrderData) => {
          if (this.isUpdate) {
            const { batteryManagementData, ...filteredWorkOrderData } =
              workOrderData;
            this.historyworkOrderData = filteredWorkOrderData;
            this.historyBatteryData = batteryManagementData;
          }
          this.setbatterydata(workOrderData.batteryManagementData[0]);
          this.setLabourtData(workOrderData.batteryManagementData[0]);
        };
        break;
      case "Maintenance":
        aggregationFilters.push(
          {
            D$lookup: {
              from: "work_maintenance_service",
              localField: "wORKNO",
              foreignField: "wORKNO",
              as: "maintenanceServiceDetails",
            },
          },
          {
            D$lookup: {
              from: "work_maintenance_spair",
              localField: "wORKNO",
              foreignField: "wORKNO",
              as: "maintenanceSpareParts",
            },
          }
        );
        if (this.isClose) {
          aggregationFilters.push({
            D$project: {
              _id: 0,
              maintenanceServiceDetails: "$maintenanceServiceDetails",
              maintenanceSpareParts: "$maintenanceSpareParts",
            },
          });
        }
        resultProcessing = (workOrderData) => {
          if (this.isUpdate) {
            const {
              maintenanceServiceDetails,
              maintenanceSpareParts,
              ...filteredWorkOrderData
            } = workOrderData;
            this.historyworkOrderData = filteredWorkOrderData;
            this.historyMaintenaceServiceData = maintenanceServiceDetails;
            if (maintenanceSpareParts) {
              this.historyMaintenaceSpareData = maintenanceSpareParts;
            }
          }
          this.setMaintenanceServiceData(
            workOrderData.maintenanceServiceDetails
          );
          if (workOrderData.maintenanceSpareParts.length) {
            this.setMaintenanceSpareData(workOrderData.maintenanceSpareParts);
          }
        };
        break;
      case "Tyre management":
        aggregationFilters.push(
          {
            D$lookup: {
              from: "work_tyre",
              localField: "wORKNO",
              foreignField: "wORKNO",
              as: "tyreManagementData",
            },
          },
          {
            D$lookup: {
              from: "work_tyre_details",
              localField: "wORKNO",
              foreignField: "wORKNO",
              as: "tyreDetails",
            },
          }
        );
        if (this.isClose) {
          aggregationFilters.push({
            D$project: {
              _id: 0,
              tyreManagementData: "$tyreManagementData",
              tyreDetails: "$tyreDetails",
            },
          });
        }
        resultProcessing = (workOrderData) => {
          if (this.isUpdate) {
            const {
              tyreManagementData,
              tyreDetails,
              ...filteredWorkOrderData
            } = workOrderData;
            this.historyworkOrderData = filteredWorkOrderData;
            this.historyTyreDetailsData = tyreDetails;
            this.historyTyreManagnmentData = tyreManagementData;
          }
          this.setTyreData(workOrderData.tyreManagementData);
          this.setLabourtData(workOrderData.tyreDetails[0]);
        };
        break;

      default:
        return;
    }
    const result = await this.joborder.getWorkOrdersWithFilters(
      aggregationFilters
    );
    if (result.length > 0) {
      resultProcessing(result[0]);
    }
  }
  CheckForSelectedCategory() {
    this.selectedcategory = this.WorkOrderForm.controls["ordercategory"].value;
    this.resetFormFields();
    if (this.selectedcategory === "Maintenance") {
      const startDTMvalue = this.WorkOrderForm.controls["orderdate"].value;
      this.ServiceDetailsForm.controls["StartDTM"].patchValue(startDTMvalue);
    }
  }
  async getUserData() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "user_master",
      filters: [
        { D$match: { companyCode: this.storage.companyCode } },
        {
          D$project: {
            userId: 1,
            name: 1,
            _id: 0,
          },
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/query", req)
    );
    if (res.success && res.data) {
      const data = res.data;
      const userdata = data.map((x) => {
        return {
          name: x.name,
          value: x.userId,
        };
      });
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        userdata,
        this.handedover,
        this.handedoverStatus
      );
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        userdata,
        this.supervisor,
        this.supervisorStatus
      );
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        userdata,
        this.returnto,
        this.returntoStatus
      );
    }
  }
  async getJobSubCategorydata() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "General_master",
      filters: [
        {
          D$match: {
            companyCode: this.storage.companyCode,
            codeType: "JOBSCAT",
          },
        },
        {
          D$project: {
            codeDesc: 1,
            _id: 0,
          },
        },
      ],
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/query", req)
    );
    if (res.success && res.data) {
      const data = res.data;
      const JobSubCData = data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeDesc,
        };
      });
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        JobSubCData,
        this.jobsubCategory,
        this.jobsubCategoryStatus
      );
    }
  }
  async checkForWorkshopType() {
    if (this.valuechanged) {
      this.WorkOrderForm.controls["vendor"].reset();
      this.WorkOrderForm.controls["location"].reset();
    }
    const WorkshopTypevalue = this.WorkOrderForm.controls["workshoptype"].value;
    if (WorkshopTypevalue === "Internal") {
      this.jsonControlWorkOrderArray =
        this.originalJsonControlWorkOrderArray.filter(
          (item) => item.name !== "vendor" && item.name !== "location"
        );
      this.clearControlValidators(this.WorkOrderForm.get("vendor"));
      this.clearControlValidators(this.WorkOrderForm.get("location"));
    } else {
      this.jsonControlWorkOrderArray = [
        ...this.originalJsonControlWorkOrderArray,
      ];
      this.applyValidators(this.WorkOrderForm.get("vendor"), [
        Validators.required,
        autocompleteValidator(),
      ]);
      this.applyValidators(this.WorkOrderForm.get("location"), [
        Validators.required,
        autocompleteValidator(),
      ]);
      await this.getVendorData();
      await this.getVendorLocation();
    }
  }
  async getVendorData() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filters: [
        { D$match: { companyCode: this.storage.companyCode } },
        {
          D$project: {
            vendorName: 1,
            vendorCode: 1,
            vendorLocation: 1,
            _id: 0,
          },
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/query", req)
    );
    if (res.success && res.data) {
      this.vendorData = res.data;
      const vendordata = this.vendorData.map((x) => {
        return {
          name: x.vendorName,
          value: x.vendorCode,
        };
      });
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        vendordata,
        this.vendor,
        this.vendorStatus
      );
    }
  }
  async getVendorLocation() {
    if (!this.vendorData) {
      return;
    }
    const value = this.WorkOrderForm.controls["vendor"].value.name;
    const selectedVendor = this.vendorData.find(
      (vendor) => vendor.vendorName === value
    );
    let locreq = {
      companyCode: this.storage.companyCode,
      collectionName: "location_detail",
      filters: [
        {
          D$match: {
            companyCode: this.storage.companyCode,
            locCode: { D$in: selectedVendor.vendorLocation },
          },
        },
        {
          D$project: {
            locCode: 1,
            locName: 1,
            _id: 0,
          },
        },
      ],
    };
    const locRes = await firstValueFrom(
      this.masterService.masterPost("generic/query", locreq)
    );
    if (locRes.success && locRes.data) {
      const res = locRes.data;
      const locdata = res.map((x) => {
        return {
          name: x.locCode,
          value: x.locName,
        };
      });
      this.filter.Filter(
        this.jsonControlWorkOrderArray,
        this.WorkOrderForm,
        locdata,
        this.location,
        this.locationStatus
      );
    }
  }
  CalculateTotalServiceCost() {
    const estimatedhoursvalue =
      this.ServiceDetailsForm.controls["Estimatedhours"].value;
    const hourlycostvalue =
      this.ServiceDetailsForm.controls["Hourlycost"].value;
    const totalcost = estimatedhoursvalue * hourlycostvalue;
    this.ServiceDetailsForm.controls["Cost"].patchValue(totalcost);
  }
  CalculateTotalSpareCost() {
    const quantityvalue = this.SpareDetailsForm.controls["Quantity"].value;
    const Unitvalue = this.SpareDetailsForm.controls["CostOrUnit"].value;
    const totalcost = quantityvalue * Unitvalue;
    this.SpareDetailsForm.controls["TCost"].patchValue(totalcost);
  }
  CalculateTotalLabourCost() {
    const costvalue = this.LabourDetailsForm.controls["CostH"].value;
    const labourhoursvalue = this.LabourDetailsForm.controls["LabourH"].value;
    const totalLabourCost = costvalue * labourhoursvalue;
    this.LabourDetailsForm.controls["LabourC"].patchValue(totalLabourCost);
  }
  CalculateServiceKm() {
    const startkm = this.WorkOrderForm.controls["startKmRead"].value;
    if (this.isClose) {
      const closekm = this.WorkOrderForm.controls["closeKmRead"].value;
      if (closekm <= startkm) {
        // Show error message with SweetAlert
        Swal.fire({
          icon: "error",
          title: "Invalid Kilometer Readings",
          text: "Closing kilometers cannot be less or equal to starting kilometers.",
        }).then(() => {
          this.WorkOrderForm.controls["closeKmRead"].reset();
          this.WorkOrderForm.controls["ServiceKm"].reset();
        });
        return;
      }
      const serviceKm = closekm - startkm;
      this.WorkOrderForm.controls["ServiceKm"].patchValue(serviceKm);
    } else {
      const joborderstartkm = this.menuItemData.data.sKM;
      if (startkm < joborderstartkm) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: `The starting kilometer should be at least ${joborderstartkm}. Please enter a value greater than or equal to ${joborderstartkm}.`,
          confirmButtonText: "OK",
        }).then(() => {
          this.WorkOrderForm.controls["startKmRead"].reset();
        });
      }
    }
  }
  // one single method for checking all current values and new values and if same values  fire valiation.
  validateCurrentAndNewValues() {
    if (!this.isClose) {
      return;
    }
    // Determine which form is currently being processed
    let formValues, formControls;
    if (this.BatteryChangeForm && this.BatteryChangeForm.dirty) {
      formValues = this.BatteryChangeForm.value;
      formControls = this.BatteryChangeForm.controls;
    } else if (this.TyreDetailsForm && this.TyreDetailsForm.dirty) {
      formValues = this.TyreDetailsForm.value;
      formControls = this.TyreDetailsForm.controls;
    }
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        // Check if the key starts with "C" and there's a corresponding "N" key
        if (key.startsWith("C") && formValues[key] !== null) {
          const newKey = "N" + key.substring(1); // Generate the corresponding "N" key
          if (formValues.hasOwnProperty(newKey)) {
            const currentValue = formValues[key];
            const newValue = formValues[newKey];
            // Perform the validation
            if (newValue == currentValue) {
              Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: `The new value should not be the same as the current value.`,
              }).then(() => {
                // Reset the N form control to its previous value
                formControls[newKey].reset();
              });
            }
          }
        }
      }
    }
  }
  async addDetail(type: string) {
    // Define a mapping of types to handler functions
    const handlers: { [key: string]: () => void } = {
      ServiceDetails: () => this.addServiceDetails(),
      SpareDetails: () => this.addSpareDetails(),
      TyreDetails: () => this.addTyreDetails(),
      // ... you can add more handlers for different types here
    };
    // Execute the handler for the given type, if it exists
    const handler = handlers[type];
    if (handler) {
      handler.call(this); // Use call to ensure 'this' refers to the component instance
    }
  }
  updateTotalTableValues(tableData, tableData2 = []) {
    // Calculate total estimated hours and total cost from tableData1 using reduce
    const totalEstimatedHours = tableData.reduce(
      (acc, entry) => acc + (parseFloat(entry.Estimatedhours) || 0),
      0
    );
    const totalCost = tableData.reduce(
      (acc, entry) => acc + (parseFloat(entry.Cost) || 0),
      0
    );
    const totalSpareCost = tableData2.reduce(
      (acc, entry) => acc + (parseFloat(entry.TCost) || 0),
      0
    );
    // Function to update or add static fields in tableData
    const updateStaticField = (field, value) => {
      const entry = this.tableData.find(
        (entry) => entry.staticfields === field
      );
      if (entry) {
        entry.Ordergeneration = value.toString();
      } else {
        this.tableData.push({
          staticfields: field,
          Ordergeneration: value.toString(),
        });
      }
    };
    updateStaticField("Labour Hours", totalEstimatedHours);
    updateStaticField("Labour Cost", totalCost);
    updateStaticField("Spare Cost", totalSpareCost);
  }
  async addServiceDetails() {
    this.tableLoad = true;
    this.isServiceDetailsLoad = true;
    const ServiceDetailTablelength = this.tableData1.length;
    const value = this.ServiceDetailsForm.value;
    const newEntry = {
      ...value,
      id: ServiceDetailTablelength + 1,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      EndDTM: this.isClose ? moment(value.EndDTM).format("DD-MM-yy HH:mm") : "",
      actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
    };
    this.tableData1 = [...this.tableData1, newEntry];
    this.updateTotalTableValues(this.tableData1, this.tableData2);
    this.SetServiceData();
    this.ServiceDetailsForm.reset();
  }

  async addSpareDetails() {
    this.tableLoad = true;
    this.isSpareDetailsLoad = true;
    const value = this.SpareDetailsForm.value;
    const SpareDetailTablelength = this.tableData2.length;
    const newEntry = {
      ...value,
      id: SpareDetailTablelength + 1,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      EndDTM: this.isClose ? moment(value.EndDTM).format("DD-MM-yy HH:mm") : "",
      actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
    };
    this.tableData2 = [...this.tableData2, newEntry];
    this.updateTotalTableValues(this.tableData1, this.tableData2);
    this.SetSpareData();
    this.SpareDetailsForm.reset();
  }
  async addTyreDetails() {
    this.isTyreDetailsLoad = true;
    const value = this.TyreDetailsForm.value;
    const TyreDetailTablelength = this.tableData3.length;
    const newEntry = {
      ...value,
      id: TyreDetailTablelength + 1,
      actions: this.isClose ? ["Edit"] : ["Edit", "Remove"],
    };
    this.tableData3 = [...this.tableData3, newEntry];
    this.TyreDetailsForm.reset();
  }
  fillServiceData(data) {
    const {
      StartDTM,
      EndDTM,
      TaskGroup,
      Task,
      MaintenanceType,
      Estimatedhours,
      Hourlycost,
      Cost,
      ApprovedCost,
      Mechanic,
    } = data.data;
    const parsedStartDTM = StartDTM
      ? moment(StartDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const parsedEndDTM = EndDTM
      ? moment(EndDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const formValues = {
      TaskGroup,
      Task,
      MaintenanceType,
      Estimatedhours,
      Hourlycost,
      Cost,
      ApprovedCost,
      Mechanic,
      StartDTM: parsedStartDTM,
      EndDTM: parsedEndDTM,
    };
    this.ServiceDetailsForm.patchValue(formValues);
    this.tableData1 = this.tableData1.filter((x) => x.id !== data.data.id);
    this.updateTotalTableValues(this.tableData1, this.tableData2);
  }
  fillSpareData(data) {
    const {
      StartDTM,
      EndDTM,
      TaskGroup,
      SparePart,
      MaintenanceType,
      Stock,
      Quantity,
      CostOrUnit,
      TCost,
      ApprovedCost,
      Mechanic,
    } = data.data;
    const parsedStartDTM = StartDTM
      ? moment(StartDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const parsedEndDTM = EndDTM
      ? moment(EndDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const formValues = {
      TaskGroup,
      SparePart,
      MaintenanceType,
      Stock,
      Quantity,
      CostOrUnit,
      TCost,
      ApprovedCost,
      Mechanic,
      StartDTM: parsedStartDTM,
      EndDTM: parsedEndDTM,
    };
    this.SpareDetailsForm.patchValue(formValues);
    this.tableData2 = this.tableData2.filter((x) => x.id !== data.data.id);
    this.updateTotalTableValues(this.tableData1, this.tableData2);
  }
  fillTyreData(data) {
    const {
      position,
      CTyreID,
      COEMandModel,
      NOEMandModel,
      NTyreID,
      ChangeReason,
      Comment,
    } = data.data;
    const formValues = {
      position,
      CTyreID,
      COEMandModel,
      NOEMandModel,
      NTyreID,
      ChangeReason,
      Comment,
    };
    this.TyreDetailsForm.patchValue(formValues);
    this.tableData3 = this.tableData3.filter((x) => x.id !== data.data.id);
  }
  SetServiceData() {
    this.ServiceData = [
      {
        count: this.tableData1.reduce(
          (acc, Estimatedhours) =>
            parseFloat(acc) + parseFloat(Estimatedhours["Estimatedhours"]),
          0
        ),
        title: "Total Labour Hours",
        class: `color-Success-light`,
      },
      {
        count: this.tableData1.reduce(
          (acc, Cost) => parseFloat(acc) + parseFloat(Cost["Cost"]),
          0
        ),
        title: "Total Cost",
        class: `color-Ocean-danger`,
      },
    ];
  }
  SetSpareData() {
    this.SpareData = [
      {
        count: this.tableData2.reduce(
          (acc, Cost) => parseFloat(acc) + parseFloat(Cost["TCost"]),
          0
        ),
        title: "Total Cost",
        class: `color-Success-light`,
      },
    ];
  }
  fillServiceDetails(data) {
    if (data.label.label === "Remove") {
      this.tableData1 = this.tableData1.filter((x) => x.id !== data.data.id);
      this.updateTotalTableValues(this.tableData1, this.tableData2);
    } else {
      const atLeastOneValuePresent = Object.keys(
        this.ServiceDetailsForm.controls
      ).some((key) => {
        const control = this.ServiceDetailsForm.get(key);
        return (
          control &&
          control.value !== null &&
          control.value !== undefined &&
          control.value !== ""
        );
      });
      if (atLeastOneValuePresent) {
        Swal.fire({
          title: "Are you sure?",
          text: "Data is already present and being edited. Are you sure you want to discard the changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillServiceData(data);
          }
        });
      } else {
        this.fillServiceData(data);
      }
    }
    this.SetServiceData();
  }
  fillSpareDetails(data) {
    if (data.label.label === "Remove") {
      this.tableData2 = this.tableData2.filter((x) => x.id !== data.data.id);
      this.updateTotalTableValues(this.tableData1, this.tableData2);
    } else {
      const atLeastOneValuePresent = Object.keys(
        this.SpareDetailsForm.controls
      ).some((key) => {
        const control = this.SpareDetailsForm.get(key);
        return (
          control &&
          control.value !== null &&
          control.value !== undefined &&
          control.value !== ""
        );
      });
      if (atLeastOneValuePresent) {
        Swal.fire({
          title: "Are you sure?",
          text: "Data is already present and being edited. Are you sure you want to discard the changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillSpareData(data);
          }
        });
      } else {
        this.fillSpareData(data);
      }
    }
    this.SetSpareData();
  }
  fillTyreDetails(data) {
    if (data.label.label === "Remove") {
      this.tableData3 = this.tableData3.filter((x) => x.id !== data.data.id);
    } else {
      const atLeastOneValuePresent = Object.keys(
        this.TyreDetailsForm.controls
      ).some((key) => {
        const control = this.TyreDetailsForm.get(key);
        return (
          control &&
          control.value !== null &&
          control.value !== undefined &&
          control.value !== ""
        );
      });
      if (atLeastOneValuePresent) {
        Swal.fire({
          title: "Are you sure?",
          text: "Data is already present and being edited. Are you sure you want to discard the changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillTyreData(data);
          }
        });
      } else {
        this.fillTyreData(data);
      }
    }
  }
  handleMenuItemClick(data) {
    if (data.data.Task) {
      this.fillServiceDetails(data);
    } else if (data.data.SparePart) {
      this.fillSpareDetails(data);
    } else {
      this.fillTyreDetails(data);
    }
  }
  async getWorkOrdersData() {
    const res = await this.joborder.getSingleWorkOrderData({
      cID: this.storage.companyCode,
    });
    if (res) {
      const data = res;
      const lastWorkNo = data.wORKNO;
      const lastFiveDigits = lastWorkNo.split("/").pop();
      this.counter = parseInt(lastFiveDigits, 10); // Convert to integer
    }
  }

  ResetLocationFormField() {
    this.WorkOrderForm.controls["location"].reset();
  }
  resetFormFields() {
    this.ServiceDetailsForm.reset();
    this.SpareDetailsForm.reset();
    this.BatteryChangeForm.reset();
    this.LabourDetailsForm.reset();
    this.TyreDetailsForm.reset();
    this.isServiceDetailsLoad = false;
    this.isSpareDetailsLoad = false;
    this.isTyreDetailsLoad = false;
    this.tableLoad = false;
    this.tableData = [];
    this.tableData1 = [];
    this.tableData2 = [];
    this.tableData3 = [];
  }
  async createData(collectionName, data, isHistory = false) {
    const finalCollectionName = isHistory
      ? `${collectionName}_history`
      : collectionName;
    try {
      const createReq = {
        companyCode: this.storage.companyCode,
        collectionName: finalCollectionName,
        data,
        filter: { cID: this.storage.companyCode },
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", createReq)
      );
      if (res.success) {
        console.log("Data created in collection:", finalCollectionName);
      }
    } catch (err) {
      console.error(
        `Error creating data in collection ${finalCollectionName}`,
        err
      );
    }
  }

  generateMaintenanceData(randomNumber?) {
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      wORKNO: randomNumber,
      sMRY: {
        lBH: {
          gEN: this.tableData[0].Ordergeneration,
          aPV: null,
          aPDT: null,
          aPBY: null,
          cLS: null,
          cLSV: null,
          cLSDT: null,
          cLSBY: null,
        },
        lBC: {
          gEN: this.tableData[1].Ordergeneration,
          aPV: null,
          aPDT: null,
          aPBY: null,
          cLS: null,
          cLSV: null,
          cLSDT: null,
          cLSBY: null,
        },
        sPC: {
          gEN: this.tableData[2].Ordergeneration,
          aPV: null,
          aPDT: null,
          aPBY: null,
          cLS: null,
          cLSV: null,
          cLSDT: null,
          cLSBY: null,
        },
      },
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    };
    if (this.isUpdate || this.isClose) {
      ["_id", "cID", "jOBNO", "wORKNO", "eNTBY", "eNTDT", "eNTLOC"].forEach(
        (key) => delete data[key]
      );
      data.mODBY = this.storage.userName;
      data.mODDT = new Date();
      data.mODLOC = this.storage.branch;
    }
    if (this.isClose) {
      const targets = [data.sMRY.lBH, data.sMRY.lBC, data.sMRY.sPC];
      targets.forEach((target) => {
        target.cLSBY = this.storage.userName;
        target.cLSDT = new Date();
      });
    }
    return data;
  }
  generateServiceData(randomNumber) {
    return this.tableData1.map((x, i) => {
      const data = {
        _id: `${this.storage.companyCode}-${randomNumber}-${i + 1}`,
        cID: this.storage.companyCode,
        jOBNO: this.WorkOrderForm.controls["orderNo"].value,
        wORKNO: randomNumber,
        tSGRP: x.TaskGroup,
        tASK: x.Task,
        mAINTP: x.MaintenanceType,
        eSTHRS: x.Estimatedhours,
        hCST: x.Hourlycost,
        cST: x.Cost,
        aPCST: null,
        mECNIC: x.Mechanic,
        sDTM: x.StartDTM,
        eDTM: null,
        eNTBY: this.storage.userName,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        mODBY: null,
        mODDT: null,
        mODLOC: null,
      };

      if (this.isUpdate || this.isClose) {
        data.mODBY = this.storage.userName;
        data.mODDT = new Date();
        data.mODLOC = this.storage.branch;
      }
      if (this.isClose) {
        data.aPCST = x.ApprovedCost;
        data.eDTM = x.EndDTM;
      }
      return data;
    });
  }
  generateSpareData(randomNumber) {
    return this.tableData2.map((x, i) => {
      const data = {
        _id: `${this.storage.companyCode}-${randomNumber}-${i + 1}`,
        cID: this.storage.companyCode,
        jOBNO: this.WorkOrderForm.controls["orderNo"].value,
        wORKNO: randomNumber,
        tSGRP: x.TaskGroup,
        sPRt: x.SparePart,
        mAINTP: x.MaintenanceType,
        sTO: x.Stock,
        qUAN: x.Quantity,
        cST: x.CostOrUnit,
        TcST: x.TCost,
        aPCST: null,
        mECNIC: x.Mechanic,
        sDTM: x.StartDTM,
        eDTM: null,
        eNTBY: this.storage.userName,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        mODBY: null,
        mODDT: null,
        mODLOC: null,
      };

      if (this.isUpdate || this.isClose) {
        data.mODBY = this.storage.userName;
        data.mODDT = new Date();
        data.mODLOC = this.storage.branch;
      }
      if (this.isClose) {
        data.aPCST = x.ApprovedCost;
        data.eDTM = x.EndDTM;
      }
      return data;
    });
  }
  generateBatteryData(randomNumber?) {
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      wORKNO: randomNumber,
      sRL: {
        cRT: this.BatteryChangeForm.controls["CSerial"].value,
        rPL: null,
      },
      oEM: {
        cRT: this.BatteryChangeForm.controls["COEM"].value,
        rPL: null,
      },
      mDL: {
        cRT: this.BatteryChangeForm.controls["CModel"].value,
        rPL: null,
      },
      rESN: {
        cRT: this.BatteryChangeForm.controls["CReason"].value,
        rPL: null,
      },
      mECNIC: this.LabourDetailsForm.controls["Mechanic"].value,
      cSTH: this.LabourDetailsForm.controls["CostH"].value,
      lBH: this.LabourDetailsForm.controls["LabourH"].value,
      lBCST: this.LabourDetailsForm.controls["LabourC"].value,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    };
    if (this.isUpdate || this.isClose) {
      ["_id", "cID", "jOBNO", "wORKNO", "eNTBY", "eNTDT", "eNTLOC"].forEach(
        (key) => delete data[key]
      );
      data.mODBY = this.storage.userName;
      data.mODDT = new Date();
      data.mODLOC = this.storage.branch;
    }
    if (this.isClose) {
      data.sRL.rPL = this.BatteryChangeForm.controls["NSerial"].value;
      data.oEM.rPL = this.BatteryChangeForm.controls["NOEM"].value;
      data.mDL.rPL = this.BatteryChangeForm.controls["NModel"].value;
      data.rESN.rPL = this.BatteryChangeForm.controls["NReason"].value ?? null;
    }
    return data;
  }
  generateTyreData(randomNumber) {
    return this.tableData3.map((x, i) => {
      const data = {
        _id: `${this.storage.companyCode}-${randomNumber}-${i + 1}`,
        cID: this.storage.companyCode,
        jOBNO: this.WorkOrderForm.controls["orderNo"].value,
        wORKNO: randomNumber,
        pSN: x.position,
        cTID: x.CTyreID,
        oNMODL: x.COEMandModel,
        nTID: null,
        nONMODL: null,
        cREASON: null,
        cMT: null,
        eNTBY: this.storage.userName,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        mODBY: null,
        mODDT: null,
        mODLOC: null,
      };

      if (this.isUpdate || this.isClose) {
        data.mODBY = this.storage.userName;
        data.mODDT = new Date();
        data.mODLOC = this.storage.branch;
      }
      if (this.isClose) {
        (data.nONMODL = x.NOEMandModel),
          (data.nTID = x.NTyreID),
          (data.cREASON = x.ChangeReason);
      }
      return data;
    });
  }
  generateLabourData(randomNumber?) {
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      wORKNO: randomNumber,
      mECNIC: this.LabourDetailsForm.controls["Mechanic"].value,
      cSTH: this.LabourDetailsForm.controls["CostH"].value,
      lBH: this.LabourDetailsForm.controls["LabourH"].value,
      lBCST: this.LabourDetailsForm.controls["LabourC"].value,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    };
    if (this.isUpdate || this.isClose) {
      ["_id", "cID", "jOBNO", "wORKNO", "eNTBY", "eNTDT", "eNTLOC"].forEach(
        (key) => delete data[key]
      );
      data.mODBY = this.storage.userName;
      data.mODDT = new Date();
      data.mODLOC = this.storage.branch;
    }
    return data;
  }
  modifyIds(data: any[]) {
    return data.map((item) => ({
      ...item,
      _id: `${item._id}-${Math.floor(Math.random() * 100000)}`,
    }));
  }
  generateUniqueId(currentId) {
    return `${currentId}-${Math.floor(Math.random() * 100000)}`;
  }

  async processMaintenance(
    randomNumber,
    isHistory = false,
    historyData = null,
    historyServiceData = null,
    historySpareData = null
  ) {
    if (!this.isUpdate && !this.isClose) {
      const maintenanceData = isHistory
        ? historyData
        : this.generateMaintenanceData(randomNumber);
      await this.createData("work_maintenance", maintenanceData, isHistory);
    }
    const serviceData = isHistory
      ? historyServiceData
      : this.generateServiceData(randomNumber);
    for (const item of serviceData) {
      await this.createData("work_maintenance_service", item, isHistory);
    }
    const spareData = isHistory
      ? historySpareData
      : this.generateSpareData(randomNumber);
    if (this.tableData2.length > 0) {
      for (const item of spareData) {
        await this.createData("work_maintenance_spair", item, isHistory);
      }
    }
  }
  async processBatteryManagement(
    randomNumber,
    isHistory = false,
    historyData = null
  ) {
    const batteryData = isHistory
      ? historyData
      : this.generateBatteryData(randomNumber);
    await this.createData("work_battery", batteryData, isHistory);
  }
  async processTyreManagement(
    randomNumber,
    isHistory = false,
    historyTyreData = null,
    historyLabourData = null
  ) {
    const tyreData = isHistory
      ? historyTyreData
      : this.generateTyreData(randomNumber);
    for (const x of tyreData) {
      await this.createData("work_tyre", x, isHistory);
    }
    if ((!this.isUpdate && !this.isClose) || isHistory) {
      const labourData = isHistory
        ? historyLabourData
        : this.generateLabourData(randomNumber);
      await this.createData("work_tyre_details", labourData, isHistory);
    }
  }

  async deleteDocumentsFromCollection(collectionName, filter) {
    const reqbody = {
      companyCode: this.storage.companyCode,
      collectionName: collectionName,
      filter: filter,
    };
    await firstValueFrom(
      this.masterService.masterMongoRemove("generic/removeAll", reqbody)
    );
  }
  async handleHistoryData() {
    this.historyworkOrderData._id = this.generateUniqueId(
      this.historyworkOrderData._id
    );
    await this.createData(
      "work_order_headers",
      this.historyworkOrderData,
      true
    );
    switch (this.selectedcategory) {
      case "Maintenance":
        const servicedata = this.modifyIds(this.historyMaintenaceServiceData);
        const sparedata = this.modifyIds(this.historyMaintenaceSpareData);
        await this.processMaintenance(
          this.workOrderNo,
          true,
          null,
          servicedata,
          sparedata
        );
        break;
      case "Battery management":
        this.historyBatteryData[0]._id = this.generateUniqueId(
          this.historyBatteryData[0]._id
        );
        await this.processBatteryManagement(
          this.workOrderNo,
          true,
          this.historyBatteryData
        );
        break;
      case "Tyre management":
        const tyredata = this.modifyIds(this.historyTyreManagnmentData);
        this.historyTyreDetailsData[0]._id = `${
          this.historyTyreDetailsData[0]._id
        }-${Math.floor(Math.random() * 100000)}`;
        await this.processTyreManagement(
          this.workOrderNo,
          true,
          tyredata,
          this.historyTyreDetailsData
        );
        break;
      default:
        return;
    }
  }
  validateTableData(tables): any {
    const errors = [];
    tables.forEach(({ tableData, tableName }) => {
      // Check if tableData is not empty
      if (tableData && tableData.length > 0) {
        tableData.forEach((data, rowIndex) => {
          const nullKeys = Object.keys(data).filter(
            (key) => data[key] === null
          );
          if (nullKeys.length > 0) {
            const errorText = nullKeys.map((key) => `"${key}"`).join(", ");
            errors.push(
              `Table: ${tableName}, Row: ${rowIndex + 1}, Empty: ${errorText}`
            );
          }
        });
      }
    });
    if (errors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: errors.join("<br/>"), // Join all errors into a single string with line breaks
        icon: "error",
      });
      return true; // Validation failed
    }
    return false; // Validation passed
  }
  checkFormsForValues() {
    const formsToCheck = [
      { form: this.ServiceDetailsForm, name: "Service Details" },
      { form: this.SpareDetailsForm, name: "Spare Details" },
      { form: this.TyreDetailsForm, name: "Tyre Details" },
    ];

    // Track forms with values
    const formsWithValues = formsToCheck
      .filter((formObj) => {
        const form = formObj.form;
        const formName = formObj.name;

        // Check if any control in the form has a value
        const hasValues = Object.keys(form.controls).some((key) => {
          const control = form.get(key);
          return (
            control &&
            control.value !== null &&
            control.value !== undefined &&
            control.value !== ""
          );
        });

        if (hasValues) {
          return formName;
        }
      })
      .map((formObj) => formObj.name);

    // If any form has values, show SweetAlert
    if (formsWithValues.length > 0) {
      const formNamesMessage = formsWithValues
        .map((name) => `"${name}"`)
        .join(", ");

      Swal.fire({
        title: `Form(s) have values`,
        html: `The following form(s) have values:<br>${formNamesMessage}.<br>Please add the values using the "Add New" button before proceeding.`,
        icon: "error",
        confirmButtonText: "Okay",
      });

      return true; // Validation failed
    }

    return false; // Validation passed
  }

  async save() {
    if (this.checkFormsForValues()) {
      return;
    }
    if (this.isClose) {
      if (
        this.validateTableData([
          { tableData: this.tableData1, tableName: "Service Details" },
          { tableData: this.tableData2, tableName: "Spare Details" },
          { tableData: this.tableData3, tableName: "Tyre Details" },
        ])
      ) {
        return;
      }
    }
    this.counter += 1;
    const newNumberString = this.counter.toString().padStart(6, "0");
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const currentYearShort = currentYear.toString().slice(-2);
    const nextYearShort = nextYear.toString().slice(-2);
    const yearSegment = `${currentYearShort}_${nextYearShort}`;
    const randomNumber =
      "WO/" +
      this.storage.branch +
      "/" +
      yearSegment +
      "/" +
      `${newNumberString}`;
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      docNo: randomNumber,
      wORKNO: randomNumber,
      jDT: this.WorkOrderForm.controls["orderdate"].value,
      cATEGORY: this.WorkOrderForm.controls["ordercategory"].value,
      sCATEGORY: this.WorkOrderForm.controls["subcategory"].value.name,
      tYPE: this.WorkOrderForm.controls["workshoptype"].value,
      vEND: null,
      vLOC: null,
      lOC: this.storage.branch,
      sDT: this.WorkOrderForm.controls["sentdate"].value,
      eRDT: this.WorkOrderForm.controls["estimatereturndate"].value,
      aRDT: null,
      sKM: this.WorkOrderForm.controls["startKmRead"].value,
      cKM: null,
      sVCKM: null,
      hOBYD: {
        hOBYNM: this.WorkOrderForm.controls["handedover"].value.name,
        hOBYCD: this.WorkOrderForm.controls["handedover"].value.value,
      },
      sUPVD: {
        sUPVNM: this.WorkOrderForm.controls["supervisor"].value.name,
        sUPCD: this.WorkOrderForm.controls["supervisor"].value.value,
      },
      rTRNTO: null,
      sTATUS: "Generated",
      cLTP: null,
      vEHD: {
        vEHNO: this.WorkOrderForm.controls["vehiclenumber"].value,
        oEM: this.WorkOrderForm.controls["oem"].value,
        mODEL: this.WorkOrderForm.controls["model"].value,
      },
      vEHNO: this.WorkOrderForm.controls["vehiclenumber"].value,
      cL: null,
      cLDT: null,
      cLACDT: null,
      cREMARKS: null,
      cLBY: null,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
      aPBY: null,
      aPDT: null,
      uPBY: null,
      uPDT: null,
      cSBY: null,
      cSDT: null,
    };
    if (this.WorkOrderForm.controls["workshoptype"].value === "External") {
      data.vEND = {
        vCD: this.WorkOrderForm.controls["vendor"].value.value,
        vNM: this.WorkOrderForm.controls["vendor"].value.name,
      };
      data.vLOC = {
        vLOCD: this.WorkOrderForm.controls["location"].value.value,
        vLOCNM: this.WorkOrderForm.controls["location"].value.name,
      };
    }
    if (this.isUpdate || this.isClose) {
      const id = this.WorkOrderModel?._id;
      [
        "_id",
        "cID",
        "jOBNO",
        "docNo",
        "wORKNO",
        "jDT",
        "cATEGORY",
        "eNTBY",
        "eNTDT",
        "eNTLOC",
        "vEHD",
        "vEHNO",
      ].forEach((key) => delete data[key]);
      data.sTATUS = this.isClose ? "Closed" : "Updated";
      data.mODBY = this.storage.userName;
      data.mODDT = new Date();
      data.mODLOC = this.storage.branch;
      if (this.isClose) {
        data.aRDT = this.WorkOrderForm.controls["actualreturndate"].value;
        data.cKM = this.WorkOrderForm.controls["closeKmRead"].value;
        data.sVCKM = this.WorkOrderForm.controls["ServiceKm"].value;
        data.rTRNTO = this.WorkOrderForm.controls["returnto"].value;
        data.cSBY = this.storage.userName;
        data.cSDT = new Date();
      }
      switch (this.selectedcategory) {
        case "Maintenance":
          const maintData = this.generateMaintenanceData();
          await this.joborder.updateWorkOrder(
            "work_maintenance",
            { wORKNO: this.workOrderNo },
            maintData
          );
          await this.deleteDocumentsFromCollection("work_maintenance_service", {
            wORKNO: this.workOrderNo,
          });
          if (
            (this.isUpdate && this.historyMaintenaceSpareData.length) ||
            (this.isClose && this.tableData2.length)
          ) {
            await this.deleteDocumentsFromCollection("work_maintenance_spair", {
              wORKNO: this.workOrderNo,
            });
          }
          await this.processMaintenance(this.workOrderNo);
          break;
        case "Battery management":
          const data = this.generateBatteryData();
          await this.joborder.updateWorkOrder(
            "work_battery",
            { wORKNO: this.workOrderNo },
            data
          );
          break;
        case "Tyre management":
          const labourdata = this.generateLabourData();
          await this.joborder.updateWorkOrder(
            "work_tyre_details",
            { wORKNO: this.workOrderNo },
            labourdata
          );
          await this.deleteDocumentsFromCollection("work_tyre", {
            wORKNO: this.workOrderNo,
          });
          await this.processTyreManagement(this.workOrderNo);
          break;
        default:
          return;
      }
      const res = await this.joborder.updateWorkOrder(
        "work_order_headers",
        { _id: id },
        data
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: this.isClose
            ? "Work Order Closed Successfully"
            : "Record updated Successfully",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl("/Operation/JobOrder");
        });
      }
      if (this.isUpdate) {
        await this.handleHistoryData();
      }
    } else {
      switch (this.selectedcategory) {
        case "Maintenance":
          await this.processMaintenance(randomNumber);
          break;
        case "Battery management":
          await this.processBatteryManagement(randomNumber);
          break;
        case "Tyre management":
          await this.processTyreManagement(randomNumber);
          break;
        default:
          return;
      }
      const createReq = {
        companyCode: this.storage.companyCode,
        collectionName: "work_order_headers",
        data: data,
        filter: { cID: this.storage.companyCode },
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", createReq)
      );
      await this.getJoborderdata();
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Record added Successfully",
          showConfirmButton: true,
        });
        this.router.navigateByUrl("/Operation/JobOrder");
      }
    }
  }
  async getJoborderdata() {
    try {
      const JobOrdervalue = this.WorkOrderForm.controls["orderNo"].value;
      const res = await this.joborder.getJobOrderData({ jOBNO: JobOrdervalue });
      if (res) {
        await this.updateWorkOrderCount(res[0]);
      }
    } catch (error) {
      console.error("Error getting job order data:", error);
    }
  }
  async updateWorkOrderCount(data) {
    try {
      const requestObject = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        filter: { jOBNO: data.jOBNO },
        update: { wCNO: data.wCNO + 1 },
      };
      await firstValueFrom(
        this.masterService.masterPut("generic/update", requestObject)
      );
    } catch (error) {
      console.error("Error updating work order count:", error);
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
  /*below function is called when the add new data was clicked*/
}