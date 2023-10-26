import { FormControls } from "src/app/Models/FormControl/formcontrol";
const today = new Date();
today.setHours(23, 59, 59, 999); // Set the time to the end of the day
let maxDate = today;
export class marketVehicleControls {
  private marketVehicle: FormControls[];
  constructor(
  ) {
    this.marketVehicle = [
      {
        name: 'vehicelNo', label: "Vehicle Number", placeholder: "Vehicle Number", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Vehicle Number is required",
          },
          {
            name: "pattern",
            message: "Please enter a valid Vehicle Number (e.g., GJ05AK4741)",
            pattern: '^[A-Z][A-Z0-9]+$'
        }
        ],
      },
      {
        name: "vehicleSize",
        label: "Vehicle Size (MT)",
        placeholder: "Vehicle Size",
        type: "text",
        value: [
          // { value: "1", name: "1-MT" },
          // { value: "9", name: "9-MT" },
          // { value: "16", name: "16-MT" },
          // { value: "32", name: "32-MT" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Vehicle Size is required",
          },
        ],
        functions: {
          onSelection: "checkVehicleSize"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: 'vendor', label: "Vendor Name", placeholder: "Vendor Name", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Vehicle Number is required",
          },
        ],
      },
      {
        name: 'vMobileNo', label: "Vendor Mobile", placeholder: "Vendor Mobile", type: 'mobile-number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Vendor Mobile is required",
          },
        ],
      },
      {
        name: 'driver', label: "Driver", placeholder: "Driver", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver is required",
          },
        ],
      },
      {
        name: 'driverPan', label: "Pan No", placeholder: "Pan No", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Pan No is required",
          },
          {
            name: "pattern",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          },
        ],
      },
      {
        name: 'lcNo', label: "Driving Licence No", placeholder: "Driving Licence No", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driving Licence   is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter alphanumeric License No of length 8 (eg. AZ1254871111111)",
            pattern: "^[A-Z]{2}[0-9]{13}$",
          }
        ],
      },
      {
        name: 'lcExpireDate', label: "Driving Licence Expiry Date", placeholder: "Driving Licence Expiry Date", type: 'date',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driving Licence Expiry Date  is required",
          },
        ],
        additionalData: {
          minDate: new Date()
        },
      },
      
      {
        name: 'dmobileNo', label: "Driver Mobile No", placeholder: "Driver", type: 'mobile-number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver is required",
          },
        ],
      },
      {
        name: 'ETA', label: "ETA", placeholder: "ETA", type: 'datetimerpicker',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "ETA   is required",
          },
        ],
        additionalData: {
          maxDate:maxDate
        },
      },
      
      {
        name: 'entryBy',
        label: 'Entry By',
        placeholder: 'Entry By',
        type: 'text',
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'entryDate',
        label: 'Entry Date',
        placeholder: 'Entry Date',
        type: 'text',
        value: new Date().toUTCString(),
        Validations: [],
        generatecontrol: false, disable: false
      },

    ]
  }
  getFormControls() {
    return this.marketVehicle;
  }
}