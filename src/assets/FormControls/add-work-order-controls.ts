import { FormControl } from "@angular/forms";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { WorkOrderModel } from "src/app/core/models/operations/joborder/add-work-order";
import { workerData } from "worker_threads";
export class WorkOrderFormControls {
  WorkOrderArray: FormControls[];
  ServiceDetailsArray: FormControls[];
  SpareDetailsArray: FormControls[];
  BatteryChangeArray: FormControls[];
  TyreDetailsArray: FormControls[];
  LabourDetailsArray: FormControls[];
  constructor(WorkOrder: WorkOrderModel, IsUpdate: boolean, isClose: boolean) {
    this.WorkOrderArray = [
      {
        name: "vehiclenumber",
        label: "Vehicle Number",
        placeholder: "Vehicle Number",
        type: "text",
        value: WorkOrder?.vehiclenumber,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
        additionalData: {},
      },
      {
        name: "oem",
        label: "OEM",
        placeholder: "OEM",
        type: "text",
        value: WorkOrder?.oem,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        name: "model",
        label: "Model",
        placeholder: "Model",
        type: "text",
        value: WorkOrder?.model,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "orderNo",
        label: "Job Order number",
        placeholder: "Job Order number",
        type: "text",
        value: WorkOrder?.orderNo,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "orderdate",
        label: "Order date",
        placeholder: "Order date",
        type: "datetimerpicker",
        value: WorkOrder?.orderdate,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      // {
      //   name: '',
      //   label: "",
      //   placeholder: "",
      //   type: '',
      //   value: '',
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: []
      // },
      {
        name: "ordercategory",
        label: "Work Order category",
        placeholder: "Work Order category",
        type: "Staticdropdown",
        value: [
          { value: "Maintenance", name: "Maintenance" },
          { value: "Battery management", name: "Battery management" },
          { value: "Tyre management", name: "Tyre management" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose || IsUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Work Order Category is required..",
          },
        ],
        functions: {
          onSelection: "CheckForSelectedCategory",
        },
      },
      {
        name: "subcategory",
        label: "Sub-category",
        placeholder: "Sub-category",
        type: "dropdown",
        value:
          IsUpdate || isClose
            ? { name: WorkOrder?.subcategory, value: WorkOrder?.subcategory }
            : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Sub Category is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
        additionalData: {
          showNameAndValue: false,
        },
      },
      // {
      //   name: '',
      //   label: "",
      //   placeholder: "",
      //   type: '',
      //   value: '',
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: []
      // },
      {
        name: "workshoptype",
        label: "Workshop type",
        placeholder: "Workshop type",
        type: "Staticdropdown",
        value: [
          { name: "Internal", value: "Internal" },
          { name: "External", value: "External" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Workshop Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          onSelection: "checkForWorkshopType",
        },
      },
      {
        name: "vendor",
        label: "Vendor",
        placeholder: "Vendor",
        type: "dropdown",
        value:
          IsUpdate || isClose
            ? { name: WorkOrder?.vendor?.vNM, value: WorkOrder?.vendor?.vCD }
            : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Vendor is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          onOptionSelect: "getVendorLocation",
          onChange: "ResetLocationFormField",
        },
      },
      {
        name: "location",
        label: "Location",
        placeholder: "Location",
        type: "dropdown",
        value:
          IsUpdate || isClose
            ? {
                name: WorkOrder?.location?.vLOCNM,
                value: WorkOrder?.location?.vLOCD,
              }
            : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Location is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "sentdate",
        label: "Sent to workshop date",
        placeholder: "Location",
        type: "datetimerpicker",
        value: IsUpdate || isClose ? WorkOrder?.sentdate : new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "sentdate is required..",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
      },
      {
        name: "estimatereturndate",
        label: "Estimated Return date",
        placeholder: "Estimated Return date",
        type: "date",
        value: IsUpdate || isClose ? WorkOrder?.estimatereturndate : new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Estimate Return Date is required..",
          },
        ],
      },
      {
        name: "actualreturndate",
        label: "Actual Return date",
        placeholder: "Actual Return date",
        type: "datetimerpicker",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Actual Return Date is required..",
          },
        ],
        additionalData: {
          // maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          minDate: new Date(),
        },
      },
      {
        name: "startKmRead",
        label: "Start Km Reading",
        placeholder: "Start Km Reading",
        type: "number",
        value: IsUpdate || isClose ? WorkOrder?.startKmRead : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Start Km Read is required..",
          },
        ],
        functions: {
          onChange: "CalculateServiceKm",
        },
      },
      {
        name: "closeKmRead",
        label: "Close Km reading",
        placeholder: "Close Km reading",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Close Km Read is required..",
          },
        ],
        functions: {
          onChange: "CalculateServiceKm",
        },
      },
      {
        name: "ServiceKm",
        label: "Service Km",
        placeholder: "Service Km",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "handedover",
        label: "Handed over by",
        placeholder: "Handed over by",
        type: "dropdown",
        value:
          IsUpdate || isClose
            ? {
                name: WorkOrder?.handedover?.hOBYNM,
                value: WorkOrder?.handedover?.hOBYCD,
              }
            : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Handed Over by is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "supervisor",
        label: "Supervisor",
        placeholder: "Supervisor",
        type: "dropdown",
        value:
          IsUpdate || isClose
            ? {
                name: WorkOrder?.supervisor.sUPVNM,
                value: WorkOrder?.supervisor.sUPCD,
              }
            : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Supervisor is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: isClose ? true : false,
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "returnto",
        label: "Returned to",
        placeholder: "Returned to",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
          {
            name: "required",
            message: "Return To is required..",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
    ];
    this.ServiceDetailsArray = [
      {
        name: "TaskGroup",
        label: "Task Group",
        placeholder: "Task Group",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Task Group is required..",
          },
        ],
      },
      {
        name: "Task",
        label: "Task",
        placeholder: "Task",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Task is required..",
          },
        ],
      },
      {
        name: "MaintenanceType",
        label: "Maintenance Type",
        placeholder: "Maintenance Type",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Maintenance Type is required..",
          },
        ],
      },
      {
        name: "Estimatedhours",
        label: "Estimated hours",
        placeholder: "Estimated hours",
        type: "number",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Estimated hours is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalServiceCost",
        },
      },
      {
        name: "Hourlycost",
        label: "Hourly cost",
        placeholder: "Hourly cost",
        type: "number",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Hourly Cost is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalServiceCost",
        },
      },
      {
        name: "Cost",
        label: "Cost",
        placeholder: "Cost",
        type: "number",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ApprovedCost",
        label: "Approved Cost",
        placeholder: "Approved Cost",
        type: "number",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Approved Cost is required..",
          },
        ],
      },
      {
        name: "Mechanic",
        label: "Mechanic",
        placeholder: "Mechanic",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Mechanic is required..",
          },
        ],
      },
      {
        name: "StartDTM",
        label: "Start DTM",
        placeholder: "Start DTM",
        type: "datetimerpicker",
        value: "",
        additionalData: {
          //     maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          //     minDate: new Date("01 Jan 1900")
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Star DTM is required..",
          },
        ],
      },
      {
        name: "EndDTM",
        label: "End DTM",
        placeholder: "End DTM",
        type: "datetimerpicker",
        value: "",
        generatecontrol: true,
        disable: isClose ? false : true,
        Validations: [
          {
            name: "required",
            message: "End DTM is required..",
          },
        ],
        additionalData: {
          // maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          minDate: new Date(),
        },
      },
    ];
    this.SpareDetailsArray = [
      {
        name: "TaskGroup",
        label: "Task Group",
        placeholder: "Task Group",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Task Group is required..",
          },
        ],
      },
      {
        name: "SparePart",
        label: "Spare Part",
        placeholder: "Spare Part",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Spare Part is required..",
          },
        ],
      },
      {
        name: "MaintenanceType",
        label: "Maintenance Type",
        placeholder: "Maintenance Type",
        type: "text",
        value: "",
        additionalData: {
          metaData: "",
        },
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Maintenance Type is required..",
          },
        ],
      },
      {
        name: "Stock",
        label: "Stock",
        placeholder: "Stock",
        type: "number",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Stock is required..",
          },
        ],
      },
      {
        name: "Quantity",
        label: "Quantity",
        placeholder: "Quantity",
        type: "number",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Quantity is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalSpareCost",
        },
      },
      {
        name: "CostOrUnit",
        label: "Cost/Unit",
        placeholder: "Cost",
        type: "number",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Cost is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalSpareCost",
        },
      },
      {
        name: "TCost",
        label: "Cost",
        placeholder: "Cost",
        type: "number",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ApprovedCost",
        label: "Approved Cost",
        placeholder: "Approved Cost",
        type: "number",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? false : true,
        Validations: [
          {
            name: "required",
            message: "Approved Cost is required..",
          },
        ],
      },
      {
        name: "Mechanic",
        label: "Mechanic",
        placeholder: "Mechanic",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Mechanic is required..",
          },
        ],
      },
      {
        name: "StartDTM",
        label: "Start DTM",
        placeholder: "Start DTM",
        type: "datetimerpicker",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Star DTM is required..",
          },
        ],
      },
      {
        name: "EndDTM",
        label: "End DTM",
        placeholder: "End DTM",
        type: "datetimerpicker",
        value: "",
        additionalData: {
          // maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          minDate: new Date(),
        },
        generatecontrol: true,
        disable: isClose ? false : true,
        Validations: [
          {
            name: "required",
            message: "END DTM is required..",
          },
        ],
      },
    ];
    this.BatteryChangeArray = [
      {
        name: "CSerial",
        label: "Current Serial No",
        placeholder: "Current Serial No",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Current Serial No  is required..",
          },
        ],
      },
      {
        name: "NSerial",
        label: "New Serial No",
        placeholder: "New Serial No",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "New Serial No  is required..",
          },
        ],
        functions: {
          onChange: "validateCurrentAndNewValues",
        },
      },
      {
        name: "COEM",
        label: "Current OEM No",
        placeholder: "Current Serial No",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Current OEM is required..",
          },
        ],
      },
      {
        name: "NOEM",
        label: "New OEM No",
        placeholder: "New OEM No",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "New OEM No is required..",
          },
        ],
        functions: {
          onChange: "validateCurrentAndNewValues",
        },
      },
      {
        name: "CModel",
        label: "Current Model",
        placeholder: "Current Model",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Current Model is required..",
          },
        ],
      },
      {
        name: "NModel",
        label: "New Model",
        placeholder: "New Model",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "New Model is required..",
          },
        ],
        functions: {
          onChange: "validateCurrentAndNewValues",
        },
      },
      {
        name: "CReason",
        label: "Current Reason",
        placeholder: "Current Reason",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [],
      },
      {
        name: "NReason",
        label: "New Reason",
        placeholder: "New Reason",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
    this.TyreDetailsArray = [
      {
        name: "position",
        label: "Position",
        placeholder: "Position ",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Position  is required..",
          },
        ],
      },
      {
        name: "CTyreID",
        label: "Current Tyre ID",
        placeholder: "Current Tyre ID",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Current Tyre ID  is required..",
          },
        ],
      },
      {
        name: "NTyreID",
        label: "New Tyre ID",
        placeholder: "New Tyre ID",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "New Tyre ID  is required..",
          },
        ],
        functions: {
          onChange: "validateCurrentAndNewValues",
        },
      },
      {
        name: "COEMandModel",
        label: "OEM and Model",
        placeholder: "Current OEM and Model",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "OEM and Model is required..",
          },
        ],
      },
      {
        name: "NOEMandModel",
        label: "OEM and Model",
        placeholder: "New OEM and Model",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "New OEM and Model is required..",
          },
        ],
        functions: {
          onChange: "validateCurrentAndNewValues",
        },
      },
      {
        name: "ChangeReason",
        label: "Change reason",
        placeholder: "Change reason",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Change Reason is required..",
          },
        ],
      },
      {
        name: "Comment",
        label: "Comment",
        placeholder: "Comment",
        type: "textarea",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
    this.LabourDetailsArray = [
      {
        name: "Mechanic",
        label: "Mechanic",
        placeholder: "Mechanic",
        type: "text",
        value: "",
        additionalData: {},
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Mechanic is required..",
          },
        ],
      },
      {
        name: "CostH",
        label: "Cost per hours",
        placeholder: "Cost per hours",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Cost Hour is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalLabourCost",
        },
      },
      {
        name: "LabourH",
        label: "Labour hours",
        placeholder: "Labour hours",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Labour Hour is required..",
          },
        ],
        functions: {
          onChange: "CalculateTotalLabourCost",
        },
      },
      {
        name: "LabourC",
        label: "Labour cost",
        placeholder: "Labour hours",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
  }

  getWorkOrderFormControls() {
    return this.WorkOrderArray;
  }
  getServiceDetailsArrayControls() {
    return this.ServiceDetailsArray;
  }
  getSpareDetailsArrayControls() {
    return this.SpareDetailsArray;
  }
  getBatteryChangeArrayControls() {
    return this.BatteryChangeArray;
  }
  getTyreDetailsArrayControls() {
    return this.TyreDetailsArray;
  }
  getLabourDetailsArrayControls() {
    return this.LabourDetailsArray;
  }
}
