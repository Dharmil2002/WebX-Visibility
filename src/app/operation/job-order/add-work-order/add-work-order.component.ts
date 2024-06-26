import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { StorageService } from "src/app/core/service/storage.service";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
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
@Component({
  selector: "app-add-work-order",
  templateUrl: "./add-work-order.component.html",
})
export class AddWorkOrderComponent implements OnInit, AfterViewInit {
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
  constructor(
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private dataService: DataService
  ) {
    this.companyCode = this.storage.companyCode;
    this.WorkOrderModel = new WorkOrderModel({});
    this.menuItemData = this.dataService.getMenuItemData();    
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
    this.backPath = "/Operation/AddJobOrder";
    this.initializeFormControl();
    this.WorkOrderForm.controls["ordercategory"].valueChanges.subscribe(
      (value) => {
        this.resetFormFields();
      }
    );
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
  ngAfterViewInit(): void {
    this.WorkOrderForm.controls["orderdate"].disable()
    this.http.get(this.jsonUrl).subscribe((res) => {
      this.data = res;
      let tableArray = this.data["data"];
      this.tableData = tableArray;
      this.tableLoad = false;
    });
    if(!this.menuItemData){
      this.router.navigateByUrl("Operation/JobOrder")
    } else{
    const data=this.menuItemData.data
      this.WorkOrderForm.controls["vehiclenumber"].patchValue(data.vEHNO)    
      this.WorkOrderForm.controls["oem"].patchValue(data.vEHD.oEM) 
      this.WorkOrderForm.controls["model"].patchValue(data.vEHD.mODEL) 
      this.WorkOrderForm.controls["orderNo"].patchValue(data.jOBNO) 
      this.WorkOrderForm.controls["orderdate"].patchValue(data.jDT) 
    }
  }

  SelectedCategory() {
    this.selectedcategory = this.WorkOrderForm.controls["ordercategory"].value;
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
  // the below method for showing total labour hours,labour cost and total spare cost
  // updateTableData(
  //   staticFields: string,
  //   valueToAdd: any,
  //   valueToRemove: any,
  //   operation: "add" | "subtract"
  // ) {
  //   const entry = this.tableData.find(
  //     (entry) => entry.staticfields === staticFields
  //   );
  //   if (entry) {
  //     const previousValue = parseFloat(entry.Ordergeneration) || 0;
  //     if (operation === "add") {
  //       entry.Ordergeneration = (previousValue + valueToAdd).toString();
  //     } else if (operation === "subtract") {
  //       entry.Ordergeneration = (previousValue - valueToRemove).toString();
  //     }
  //   } else {
  //     this.tableData.push({
  //       staticfields: staticFields,
  //       Ordergeneration:
  //         operation === "add"
  //           ? valueToAdd.toString()
  //           : (-valueToRemove).toString(),
  //       Approved: "",
  //       WorkClosure: "",
  //       JobOrderApproved: "",
  //     });
  //   }
  // }
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
    const value = this.ServiceDetailsForm.value;
    const newEntry = {
      ...value,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      EndDTM: moment(value.EndDTM).format("DD-MM-yy HH:mm"),
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
    const value = this.SpareDetailsForm.value;
    const newEntry = {
      ...value,
      StartDTM: moment(value.StartDTM).format("DD-MM-yy HH:mm"),
      EndDTM: moment(value.EndDTM).format("DD-MM-yy HH:mm"),
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
  // fillServiceDetails(data) {
  //   const parsedStartDTM = moment(
  //     data.data?.StartDTM,
  //     "DD-MM-yy HH:mm"
  //   ).toDate();
  //   const parsedEndDTM = moment(data.data?.EndDTM, "DD-MM-yy HH:mm").toDate();
  //   this.ServiceDetailsForm.controls["TaskGroup"].setValue(
  //     data.data?.TaskGroup || ""
  //   );
  //   this.ServiceDetailsForm.controls["Task"].setValue(data.data?.Task || "");
  //   this.ServiceDetailsForm.controls["MaintenanceType"].setValue(
  //     data.data?.MaintenanceType || ""
  //   );
  //   this.ServiceDetailsForm.controls["Estimatedhours"].setValue(
  //     data.data?.Estimatedhours || ""
  //   );
  //   this.ServiceDetailsForm.controls["Hourlycost"].setValue(
  //     data.data?.Hourlycost || ""
  //   );
  //   this.ServiceDetailsForm.controls["Cost"].setValue(data.data?.Cost || "");
  //   this.ServiceDetailsForm.controls["ApprovedCost"].setValue(
  //     data.data?.ApprovedCost || ""
  //   );
  //   this.ServiceDetailsForm.controls["Mechanic"].setValue(
  //     data.data?.Mechanic || ""
  //   );
  //   this.ServiceDetailsForm.controls["StartDTM"].setValue(parsedStartDTM || "");
  //   this.ServiceDetailsForm.controls["EndDTM"].setValue(parsedEndDTM || "");
  //   this.tableData1 = this.tableData1.filter(
  //     (x) => x.TaskGroup !== data.data.TaskGroup
  //   );
  // }
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
    } = data.data || {};
    const parsedStartDTM = StartDTM
      ? moment(StartDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const parsedEndDTM = EndDTM
      ? moment(EndDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const formValues = {
      TaskGroup: TaskGroup || "",
      Task: Task || "",
      MaintenanceType: MaintenanceType || "",
      Estimatedhours: Estimatedhours || "",
      Hourlycost: Hourlycost || "",
      Cost: Cost || "",
      ApprovedCost: ApprovedCost || "",
      Mechanic: Mechanic || "",
      StartDTM: parsedStartDTM || "",
      EndDTM: parsedEndDTM || "",
    };
    this.ServiceDetailsForm.setValue(formValues);
    this.tableData1 = this.tableData1.filter((x) => x.TaskGroup !== TaskGroup);
  }
  // fillSpareDetails(data) {
  //   const parsedStartDTM = moment(
  //     data.data?.StartDTM,
  //     "DD-MM-yy HH:mm"
  //   ).toDate();
  //   const parsedEndDTM = moment(data.data?.EndDTM, "DD-MM-yy HH:mm").toDate();
  //   this.SpareDetailsForm.controls["TaskGroup"].setValue(
  //     data.data?.TaskGroup || ""
  //   );
  //   this.SpareDetailsForm.controls["SparePart"].setValue(
  //     data.data?.SparePart || ""
  //   );
  //   this.SpareDetailsForm.controls["MaintenanceType"].setValue(
  //     data.data?.MaintenanceType || ""
  //   );
  //   this.SpareDetailsForm.controls["Stock"].setValue(data.data?.Stock || "");
  //   this.SpareDetailsForm.controls["Quantity"].setValue(
  //     data.data?.Quantity || ""
  //   );
  //   this.SpareDetailsForm.controls["CostOrUnit"].setValue(
  //     data.data?.CostOrUnit || ""
  //   );
  //   this.SpareDetailsForm.controls["Cost"].setValue(data.data?.Cost || "");
  //   this.SpareDetailsForm.controls["ApprovedCost"].setValue(
  //     data.data?.ApprovedCost || ""
  //   );
  //   this.SpareDetailsForm.controls["Mechanic"].setValue(
  //     data.data?.Mechanic || ""
  //   );
  //   this.SpareDetailsForm.controls["StartDTM"].setValue(parsedStartDTM || "");
  //   this.SpareDetailsForm.controls["EndDTM"].setValue(parsedEndDTM || "");
  //   this.tableData2 = this.tableData2.filter(
  //     (x) => x.TaskGroup !== data.data.TaskGroup
  //   );
  // }
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
    } = data.data || {};
    const parsedStartDTM = StartDTM
      ? moment(StartDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const parsedEndDTM = EndDTM
      ? moment(EndDTM, "DD-MM-YY HH:mm").toDate()
      : null;
    const formValues = {
      TaskGroup: TaskGroup || "",
      SparePart: SparePart || "",
      MaintenanceType: MaintenanceType || "",
      Stock: Stock || "",
      Quantity: Quantity || "",
      CostOrUnit: CostOrUnit || "",
      Cost: Cost || "",
      ApprovedCost: ApprovedCost || "",
      Mechanic: Mechanic || "",
      StartDTM: parsedStartDTM || "",
      EndDTM: parsedEndDTM || "",
    };
    this.SpareDetailsForm.setValue(formValues);
    this.tableData2 = this.tableData2.filter((x) => x.TaskGroup !== TaskGroup);
  }
  // fillTyreDetails(data) {
  //   this.TyreDetailsForm.controls["position"].setValue(
  //     data.data.position || ""
  //   );
  //   this.TyreDetailsForm.controls["CTyreID"].setValue(data.data.CTyreID || "");
  //   this.TyreDetailsForm.controls["OEMandModel"].setValue(
  //     data.data.OEMandModel || ""
  //   );
  //   this.TyreDetailsForm.controls["NTyreID"].setValue(data.data.NTyreID || "");
  //   this.TyreDetailsForm.controls["ChangeReason"].setValue(
  //     data.data.ChangeReason || ""
  //   );
  //   this.TyreDetailsForm.controls["Comment"].setValue(data.data.Comment || "");
  //   this.tableData3 = this.tableData3.filter(
  //     (x) => x.NTyreID !== data.data.NTyreID
  //   );
  // }
  fillTyreDetails(data) {
    const { position, CTyreID, OEMandModel, NTyreID, ChangeReason, Comment } =
      data.data || {};
    const formValues = {
      position: position || "",
      CTyreID: CTyreID || "",
      OEMandModel: OEMandModel || "",
      NTyreID: NTyreID || "",
      ChangeReason: ChangeReason || "",
      Comment: Comment || "",
    };
    this.TyreDetailsForm.setValue(formValues);
    this.tableData3 = this.tableData3.filter((x) => x.NTyreID !== NTyreID);
  }
  // handleMenuItemClick(data) {
  //   if (data.label.label === "Remove" && data.data.Task) {
  //     const removedEstimatedHours = parseFloat(data.data.Estimatedhours || "0");
  //     const removedCost = parseFloat(data.data.Cost || "0");
  //     this.tableData1 = this.tableData1.filter(
  //       (x) => x.TaskGroup !== data.data.TaskGroup
  //     );
  //     this.updateTableData(
  //       "Labour Hours",
  //       0,
  //       removedEstimatedHours,
  //       "subtract"
  //     );
  //     this.updateTableData("Labour Cost", 0, removedCost, "subtract");
  //     this.updateTableData("Spare Cost", 0, 0, "add"); // Assuming no change for Spare Cost
  //   } else if (data.data.Task) {
  //     const removedEstimatedHours = parseFloat(data.data.Estimatedhours || "0");
  //     const removedCost = parseFloat(data.data.Cost || "0");
  //     this.updateTableData(
  //       "Labour Hours",
  //       0,
  //       removedEstimatedHours,
  //       "subtract"
  //     );
  //     this.updateTableData("Labour Cost", 0, removedCost, "subtract");
  //     this.updateTableData("Spare Cost", 0, 0, "add"); // Assuming no change for Spare Cost
  //     this.fillServiceDetails(data);
  //   }
  //   if (data.label.label === "Remove" && data.data.SparePart) {
  //     const removedCost = parseFloat(data.data.Cost || "0");
  //     this.tableData2 = this.tableData2.filter(
  //       (x) => x.TaskGroup !== data.data.TaskGroup
  //     );
  //     this.updateTableData("Labour Hours", 0, 0, "add");
  //     this.updateTableData("Labour Cost", 0, 0, "add");
  //     this.updateTableData("Spare Cost", 0, removedCost, "subtract");
  //   } else if (data.data.SparePart) {
  //     const removedCost = parseFloat(data.data.Cost || "0");
  //     this.updateTableData("Labour Hours", 0, 0, "add");
  //     this.updateTableData("Labour Cost", 0, 0, "add");
  //     this.updateTableData("Spare Cost", 0, removedCost, "subtract");
  //     this.fillSpareDetails(data);
  //   }
  //   if (data.label.label === "Remove" && data.data.NTyreID) {
  //     this.tableData3 = this.tableData3.filter(
  //       (x) => x.NTyreID !== data.data.NTyreID
  //     );
  //   } else if (data.data.NTyreID) {
  //     this.fillTyreDetails(data);
  //   }
  // }
  handleMenuItemClick(data) {
    const { label, data: itemData } = data;
    const { Task, SparePart, NTyreID, Estimatedhours, Cost, TaskGroup } =
      itemData;
    const removedEstimatedHours = parseFloat(Estimatedhours || "0");
    const removedCost = parseFloat(Cost || "0");
    if (label.label === "Remove") {
      if (Task) {
        this.tableData1 = this.tableData1.filter(
          (x) => x.TaskGroup !== TaskGroup
        );
        this.updateTotalTableValues(
          "Labour Hours",
          0,
          removedEstimatedHours,
          "subtract"
        );
        this.updateTotalTableValues("Labour Cost", 0, removedCost, "subtract");
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
      }
      if (SparePart) {
        this.tableData2 = this.tableData2.filter(
          (x) => x.TaskGroup !== TaskGroup
        );
        this.updateTotalTableValues("Spare Cost", 0, removedCost, "subtract");
        const TotalCost = calculateTotalField(this.tableData2, "Cost");
        this.KPICountData2 = [
          {
            count: TotalCost,
            title: "Total Cost",
            class: `color-Grape-light`,
          },
        ];
      }
      if (NTyreID) {
        this.tableData3 = this.tableData3.filter((x) => x.NTyreID !== NTyreID);
      }
    } else {
      if (Task) {
        this.updateTotalTableValues(
          "Labour Hours",
          0,
          removedEstimatedHours,
          "subtract"
        );
        this.updateTotalTableValues("Labour Cost", 0, removedCost, "subtract");
        this.fillServiceDetails(data);
      }
      if (SparePart) {
        this.updateTotalTableValues("Spare Cost", 0, removedCost, "subtract");
        this.fillSpareDetails(data);
      }
      if (NTyreID) {
        this.fillTyreDetails(data);
      }
    }
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
  async save() {
    console.log("data saved");
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
