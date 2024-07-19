import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { JobOrderModel } from "src/app/core/models/operations/joborder/add-job-order";
export class JobOrderFormControls {
  JobOrderArray: FormControls[];
  constructor(JobOrder: JobOrderModel, isClose: boolean) {
    this.JobOrderArray = [
      {
        name: "vehicleNo",
        label: "Vehicle Number",
        placeholder: "Vehicle Number",
        type: "dropdown",
        value: isClose
          ? { name: JobOrder.vehicleNo, value: JobOrder.vehicleNo }
          : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Vehicle Number is required..",
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
        functions: {
          onModel: "Reset",
          onOptionSelect: "getVehicleData",
        },
      },
      {
        name: "oem",
        label: "OEM",
        placeholder: "OEM",
        type: "text",
        value: isClose ? JobOrder?.oem : "",
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
        value: isClose ? JobOrder?.model : "",
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
        value: isClose ? JobOrder?.orderdate : new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [],
        additionalData: {
            // maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
            minDate: new Date()
        }
      },
      {
        name: "closedate",
        label: "Close date",
        placeholder: "Close date",
        type: "datetimerpicker",
        value: isClose ? new Date() : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? false : true,
        Validations: [
          {
            name: "required",
            message: "Close Date is required..",
          },
        ],
        additionalData: {
            // maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
            minDate: new Date()
        }
      },
      {
        name: "workorders",
        label: "Work orders",
        placeholder: "Work orders",
        type: "number",
        value: isClose ? JobOrder?.workorders : 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "startKm",
        label: "Start Km",
        placeholder: "Start Km",
        type: "number",
        value: isClose ? JobOrder?.startKm : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: isClose ? true : false,
        Validations: [
          {
            name: "required",
            message: "Start Km is required..",
          },
        ],
      },
      {
        name: "closeKm",
        label: "Close Km",
        placeholder: "Close Km",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [
        ],
      },
      {
        name: "tCost",
        label: "Total cost",
        placeholder: "Total cost",
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

  getJobOrderFormControls() {
    return this.JobOrderArray;
  }
}
