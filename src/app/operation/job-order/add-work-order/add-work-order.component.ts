import { AfterViewInit, Component, OnInit } from "@angular/core";
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
import { calculateTotalField } from "../../unbilled-prq/unbilled-utlity";
import { DataService } from "src/app/core/service/job-order.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
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
  KPICountData: { count: any; title: string; class: string }[];
  KPICountData2: { count: any; title: string; class: string }[];
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
  constructor(
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private dataService: DataService,
    private operation: OperationService,
    private masterService: MasterService
  ) {
    this.companyCode = this.storage.companyCode;
    this.menuItemData = this.dataService.getMenuItemData();
    if (this.menuItemData) {
      this.WorkOrderModel = new WorkOrderModel(this.menuItemData.data);
    } else {
      this.WorkOrderModel = new WorkOrderModel({});
      this.router.navigateByUrl("Operation/JobOrder");
    }
  }
  ngOnInit(): void {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.WorkOrderModel =
        this.router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.breadscrums[0].active = "Work Order Modify";
      this.breadscrums[0].title = "Work Order Modify";
      this.submit = "Modify";
    }
    this.backPath = "/Operation/JobOrder";
    this.http.get(this.jsonUrl).subscribe((res) => {
      this.data = res;
      let tableArray = this.data["data"];
      this.tableData = tableArray;
      this.tableLoad = false;
    });
    this.initializeFormControl();
    this.getWorkOrdersData();
    this.getJobSubCategorydata();
    this.getUserData()
    this.WorkOrderForm.controls["actualreturndate"].disable();
    this.WorkOrderForm.controls["workshoptype"].setValue("Internal");
    this.checkForWorkshopType();
    this.WorkOrderForm.controls["workshoptype"].valueChanges.subscribe((x) => {
      this.valuechanged = true;
    });
  }
  initializeFormControl() {
    this.WorkOrderFormControls = new WorkOrderFormControls(
      this.WorkOrderModel,
      this.isUpdate
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
      if (data.name === "vendor") {
        this.vendor = data.name;
        this.vendorStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "location") {
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "subcategory") {
        this.jobsubCategory = data.name;
        this.jobsubCategoryStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "handedover") {
        this.handedover = data.name;
        this.handedoverStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "supervisor") {
        this.supervisor = data.name;
        this.supervisorStatus = data.additionalData.showNameAndValue;
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
  CheckForSelectedCategory() {
    this.selectedcategory = this.WorkOrderForm.controls["ordercategory"].value;
    this.resetFormFields();
    if (this.selectedcategory === "Maintenance") {
      this.ServiceDetailsForm.controls["EndDTM"].disable();
      this.SpareDetailsForm.controls["EndDTM"].disable();
    }
  }
  async getUserData() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "user_master",
      filter: { companyCode: this.storage.companyCode },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
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
    }
  }
  async getJobSubCategorydata() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "General_master",
      filter: { companyCode: this.storage.companyCode, codeType: "JOBSCAT" },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
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
    }
  }
  async getVendorData() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filter: { companyCode: this.storage.companyCode },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success && res.data) {
      const data = res.data;
      const vendordata = data.map((x) => {
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
    const value = this.WorkOrderForm.controls["vendor"].value;
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filter: { companyCode: this.storage.companyCode, vendorName: value.name },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success && res.data) {
      const data = res.data;
      const vendordata = data[0];
      const vendorlocation = vendordata.vendorLocation;
      let locreq = {
        companyCode: this.storage.companyCode,
        collectionName: "location_detail",
        filter: { locCode: { D$in: vendorlocation } },
      };
      const locRes = await firstValueFrom(
        this.masterService.masterPost("generic/get", locreq)
      );
      if (locRes.success && locRes.data) {
        const locdata = locRes.data;
        const dropdowndata = locdata.map((x) => {
          return {
            name: x.locCode,
            value: x.locName,
          };
        });
        this.filter.Filter(
          this.jsonControlWorkOrderArray,
          this.WorkOrderForm,
          dropdowndata,
          this.location,
          this.locationStatus
        );
      }
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
    this.SpareDetailsForm.controls["Cost"].patchValue(totalcost);
  }
  CalculateTotalLabourCost() {
    const costvalue = this.LabourDetailsForm.controls["CostH"].value;
    const labourhoursvalue = this.LabourDetailsForm.controls["LabourH"].value;
    const totalLabourCost = costvalue * labourhoursvalue;
    this.LabourDetailsForm.controls["LabourC"].patchValue(totalLabourCost);
  }
  validateCurrentAndNewValues() {
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
            if (newValue === currentValue) {
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
  updateTotalTableValues(
    staticfields: string,
    valueToAdd: number,
    valueToRemove: number,
    operation: "add" | "subtract"
  ) {
    const entry = this.tableData.find(
      (entry) => entry.staticfields === staticfields
    );
    const previousValue = parseFloat(entry?.Ordergeneration) || 0;
    if (operation === "add") {
      entry
        ? (entry.Ordergeneration = (previousValue + valueToAdd).toString())
        : this.tableData.push({
            staticfields,
            Ordergeneration: valueToAdd.toString(),
          });
    } else if (operation === "subtract") {
      entry
        ? (entry.Ordergeneration = (previousValue - valueToRemove).toString())
        : this.tableData.push({
            staticfields,
            Ordergeneration: (-valueToRemove).toString(),
          });
    }
  }
  async addServiceDetails() {
    this.tableLoad = true;
    this.isServiceDetailsLoad = true;
    this.ServiceDetailsForm.controls["EndDTM"].disable();
    const value = this.ServiceDetailsForm.value;
    const newEntry = {
      ...value,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      // EndDTM: moment(value.EndDTM).format("DD-MM-yy HH:mm"),
      actions: ["Edit", "Remove"],
    };
    this.updateTotalTableValues(
      "Labour Hours",
      parseFloat(newEntry.Estimatedhours),
      0,
      "add"
    );
    this.updateTotalTableValues(
      "Labour Cost",
      parseFloat(newEntry.Cost),
      0,
      "add"
    );
    this.updateTotalTableValues("Spare Cost", 0, 0, "add");
    this.tableData1 = [...this.tableData1, newEntry];
    const Estimatedhours = calculateTotalField(
      this.tableData1,
      "Estimatedhours"
    );
    const TotalCost = calculateTotalField(this.tableData1, "Cost");
    this.KPICountData = [
      {
        count: Estimatedhours,
        title: "Total Labour Hours",
        class: `color-Grape-light`,
      },
      {
        count: TotalCost,
        title: "Total Cost",
        class: `color-Grape-light`,
      },
    ];
    this.ServiceDetailsForm.reset({ StartDTM: new Date(), EndDTM: new Date() });
  }

  async addSpareDetails() {
    this.tableLoad = true;
    this.isSpareDetailsLoad = true;
    this.SpareDetailsForm.controls["EndDTM"].disable();
    const value = this.SpareDetailsForm.value;
    const newEntry = {
      ...value,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      // EndDTM: moment(value.EndDTM).format("DD-MM-yy HH:mm"),
      actions: ["Edit", "Remove"],
    };
    this.updateTotalTableValues(
      "Spare Cost",
      parseFloat(newEntry.Cost),
      0,
      "add"
    );
    this.tableData2 = [...this.tableData2, newEntry];
    const TotalCost = calculateTotalField(this.tableData2, "Cost");
    this.KPICountData2 = [
      {
        count: TotalCost,
        title: "Total Spare Cost",
        class: `color-Grape-light`,
      },
    ];
    this.SpareDetailsForm.reset({ StartDTM: new Date(), EndDTM: new Date() });
  }
  async addTyreDetails() {
    this.isTyreDetailsLoad = true;
    const value = this.TyreDetailsForm.value;
    const newEntry = { ...value, actions: ["Edit", "Remove"] };
    this.tableData3 = [...this.tableData3, newEntry];
    this.TyreDetailsForm.reset();
  }
  fillServiceDetails(data) {
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
    this.ServiceDetailsForm.setValue(formValues);
    this.tableData1 = this.tableData1.filter((x) => x.TaskGroup !== TaskGroup);
  }
  fillSpareDetails(data) {
    const {
      StartDTM,
      EndDTM,
      TaskGroup,
      SparePart,
      MaintenanceType,
      Stock,
      Quantity,
      CostOrUnit,
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
      SparePart,
      MaintenanceType,
      Stock,
      Quantity,
      CostOrUnit,
      Cost,
      ApprovedCost,
      Mechanic,
      StartDTM: parsedStartDTM,
      EndDTM: parsedEndDTM,
    };
    this.SpareDetailsForm.setValue(formValues);
    this.tableData2 = this.tableData2.filter((x) => x.TaskGroup !== TaskGroup);
  }
  fillTyreDetails(data) {
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
    this.TyreDetailsForm.setValue(formValues);
    this.tableData3 = this.tableData3.filter((x) => x.CTyreID !== CTyreID);
  }
  handleMenuItemClick(data) {
    if (data.label.label === "Remove" && data.data.Task) {
      const removedEstimatedHours = parseFloat(data.data.Estimatedhours || "0");
      const removedCost = parseFloat(data.data.Cost || "0");
      this.tableData1 = this.tableData1.filter(
        (x) => x.TaskGroup !== data.data.TaskGroup
      );
      this.updateTotalTableValues(
        "Labour Hours",
        0,
        removedEstimatedHours,
        "subtract"
      );
      this.updateTotalTableValues("Labour Cost", 0, removedCost, "subtract");
      this.updateTotalTableValues("Spare Cost", 0, 0, "add"); // Assuming no change for Spare Cost
      const Estimatedhours = calculateTotalField(
        this.tableData1,
        "Estimatedhours"
      );
      const TotalCost = calculateTotalField(this.tableData1, "Cost");
      this.KPICountData = [
        {
          count: Estimatedhours,
          title: "Total Labour Hours",
          class: `color-Grape-light`,
        },
        {
          count: TotalCost,
          title: "Total Cost",
          class: `color-Grape-light`,
        },
      ];
    } else if (data.data.Task) {
      // this block for the edit menu item
      const removedEstimatedHours = parseFloat(data.data.Estimatedhours || "0");
      const removedCost = parseFloat(data.data.Cost || "0");
      this.updateTotalTableValues(
        "Labour Hours",
        0,
        removedEstimatedHours,
        "subtract"
      );
      this.updateTotalTableValues("Labour Cost", 0, removedCost, "subtract");
      this.updateTotalTableValues("Spare Cost", 0, 0, "add"); // Assuming no change for Spare Cost
      this.fillServiceDetails(data);
    }
    if (data.label.label === "Remove" && data.data.SparePart) {
      this.tableData2 = this.tableData2.filter(
        (x) => x.TaskGroup !== data.data.TaskGroup
      );
      const removedCost = parseFloat(data.data.Cost || "0");
      this.updateTotalTableValues("Labour Hours", 0, 0, "add");
      this.updateTotalTableValues("Labour Cost", 0, 0, "add");
      this.updateTotalTableValues("Spare Cost", 0, removedCost, "subtract");
      const TotalCost = calculateTotalField(this.tableData2, "Cost");
      this.KPICountData2 = [
        {
          count: TotalCost,
          title: "Total Cost",
          class: `color-Grape-light`,
        },
      ];
    } else if (data.data.SparePart) {
      const removedCost = parseFloat(data.data.Cost || "0");
      this.updateTotalTableValues("Labour Hours", 0, 0, "add");
      this.updateTotalTableValues("Labour Cost", 0, 0, "add");
      this.updateTotalTableValues("Spare Cost", 0, removedCost, "subtract");
      this.fillSpareDetails(data);
    }
    if (data.label.label === "Remove" && data.data.NTyreID) {
      this.tableData3 = this.tableData3.filter(
        (x) => x.CTyreID !== data.data.CTyreID
      );
    } else if (data.data.CTyreID) {
      this.fillTyreDetails(data);
    }
  }
  async getWorkOrdersData() {
    const requestObject = {
      companyCode: this.storage.companyCode,
      collectionName: "work_order_headers",
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/get", requestObject)
    );
    if (res.success) {
      const data = res.data;
      const lastWorkOrder = data[data.length - 1];
      const lastWorkNo = lastWorkOrder.wORKNO;
      const lastFiveDigits = lastWorkNo.split("/").pop();
      this.counter = parseInt(lastFiveDigits);
    }
  }
  Reset() {
    this.WorkOrderForm.controls["location"].reset();
  }
  resetFormFields() {
    this.ServiceDetailsForm.reset({
      StartDTM: new Date(),
      EndDTM: new Date(),
    });
    this.SpareDetailsForm.reset({
      StartDTM: new Date(),
      EndDTM: new Date(),
    });
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
  async createData(collectionName, data) {
    try {
      const createReq = {
        companyCode: this.companyCode,
        collectionName,
        data,
        filter: { companyCode: this.companyCode },
      };
      const res = await firstValueFrom(
        this.operation.operationPost("generic/create", createReq)
      );
      if (res.success) {
        console.log("data Created");
      }
    } catch (err) {
      console.error(`Error creating data`, err);
    }
  }
  generateMaintenanceData(randomNumber) {
    return {
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
  }
  generateServiceData(randomNumber) {
    return this.tableData1.map((x, i) => ({
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
      aPCST: x.ApprovedCost,
      mECNIC: x.Mechanic,
      sDTM: x.StartDTM,
      eDTM: null,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    }));
  }
  generateSpareData(randomNumber) {
    return this.tableData2.map((x, i) => ({
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
      aPCST: x.ApprovedCost,
      mECNIC: x.Mechanic,
      sDTM: x.StartDTM,
      eDTM: null,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    }));
  }
  generateBatteryData(randomNumber) {
    return {
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
      cOSTPHRS: this.LabourDetailsForm.controls["CostH"].value,
      lBH: this.LabourDetailsForm.controls["LabourH"].value,
      lBCST: this.LabourDetailsForm.controls["LabourC"].value,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      mODBY: null,
      mODDT: null,
      mODLOC: null,
    };
  }
  generateTyreData(randomNumber) {
    return this.tableData3.map((x, i) => ({
      _id: `${this.storage.companyCode}-${randomNumber}-${i + 1}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      wORKNO: randomNumber,
      pSN: x.position,
      cTID: x.CTyreID,
      oNMODL: x.OEMandModel,
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
    }));
  }
  generateLabourData(randomNumber) {
    return {
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
  }
  async processMaintenance(randomNumber) {
    const maintenancedata = this.generateMaintenanceData(randomNumber);
    await this.createData("work_maintenance", maintenancedata);

    const servicedata = this.generateServiceData(randomNumber);
    for (const x of servicedata) {
      await this.createData("work_maintenance_service", x);
    }

    if (this.tableData2.length > 0) {
      const sparedata = this.generateSpareData(randomNumber);
      for (const x of sparedata) {
        await this.createData("work_maintenance_spair", x);
      }
    }
  }
  async processBatteryManagement(randomNumber) {
    const batteryData = this.generateBatteryData(randomNumber);
    await this.createData("work_battery", batteryData);
  }

  async processTyreManagement(randomNumber) {
    const tyreData = this.generateTyreData(randomNumber);
    for (const x of tyreData) {
      await this.createData("work_tyre", x);
    }
    const labourData = this.generateLabourData(randomNumber);
    await this.createData("work_tyre_details", labourData);
  }

  async save() {
    const newNumberString = this.counter + 1;
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
      `0000${newNumberString}`;

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
    const data = {
      _id: `${this.storage.companyCode}-${randomNumber}`,
      cID: this.storage.companyCode,
      jOBNO: this.WorkOrderForm.controls["orderNo"].value,
      docNo: randomNumber,
      wORKNO: randomNumber,
      jDT: this.WorkOrderForm.controls["orderdate"].value,
      cATEGORY: this.WorkOrderForm.controls["ordercategory"].value,
      sCATEGORY: "Accident",
      tYPE: this.WorkOrderForm.controls["workshoptype"].value,
      vEND: null,
      lOC: this.storage.branch,
      sDT: null,
      eRDT: null,
      aRDT: null,
      sKM: this.WorkOrderForm.controls["startKmRead"].value,
      cKM: this.WorkOrderForm.controls["closeKmRead"].value,
      sVCKM: this.WorkOrderForm.controls["ServiceKm"].value,
      hOBY: this.WorkOrderForm.controls["handedover"].value.name,
      sUPV: this.WorkOrderForm.controls["supervisor"].value.name,
      rTRNTO: this.WorkOrderForm.controls["returnto"].value,
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
    }
    const createReq = {
      companyCode: this.companyCode,
      collectionName: "work_order_headers",
      data: data,
      filter: { companyCode: this.companyCode },
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/create", createReq)
    );
    await this.getJobOrderData();
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
  async getJobOrderData() {
    try {
      const JobOrdervalue = this.WorkOrderForm.controls["orderNo"].value;
      const requestObject = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        filter: { jOBNO: JobOrdervalue },
      };

      const res = await firstValueFrom(
        this.operation.operationPost("generic/get", requestObject)
      );
      if (res.success && res.data && res.data.length > 0) {
        await this.updateWorkOrderCount(res.data[0]);
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
        this.operation.operationPut("generic/update", requestObject)
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
