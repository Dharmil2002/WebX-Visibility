import { FormControls } from "src/app/Models/FormControl/formcontrol";
const today = new Date();
today.setHours(23, 59, 59, 999); // Set the time to the end of the day
let maxDate = today;
const lastToday = new Date(); // Get the current date and time
const yesterday = new Date(today); // Create a new date object with the current date and time
yesterday.setDate(lastToday.getDate() - 1); // Set the date to one day before
// Set the time to the end of the day (23:59:59:999)
yesterday.setHours(23, 59, 59, 999);
let minDate = yesterday; // Now, maxDate holds the date for yesterday at the end of the day

export class marketVehicleControls {
  private marketVehicle: FormControls[];
  constructor(
  ) {
    this.marketVehicle = [
      {
        name: 'vehicelNo', label: "Vehicle Number", placeholder: "Vehicle Number", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        functions: {
          onChange: "onVehicleNoChange"
        },
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
        label: "Vehicle Capacity(MT)",
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
            message: "Vehicle Capacity is required",
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
          {
            "name": "pattern",
            "pattern": "^[0-9]{10}$",
            "message": "Please enter a valid 10-digit mobile number"
          }
        ],
      },
      {
        name: 'driver', label: "Driver Name", placeholder: "Driver Name", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver Name is required",
          },
        ],
      },
      {
        name: 'venPan', label: "Vendor Pan No", placeholder: "Vendor Pan No", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Vendor Pan No is required",
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
              "Please Enter alphanumeric License No",
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
        name: 'dmobileNo', label: "Driver Mobile No", placeholder: "Driver", type:'mobile-number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver is required",
          },
          {
            "name": "pattern",
            "pattern": "^[0-9]{10}$",
            "message": "Please enter a valid 10-digit mobile number"
          }
        ],
      },
      {
        name: 'ETA', label: "ETA", placeholder: "ETA", type: 'datetimerpicker',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
        additionalData: {
          maxDate:maxDate,
          minDate:minDate
        },
      },
      {
        name: 'insuranceExpiryDate', label: "Insurance Expiry Date", placeholder: "Enter Insurance Expiry Date",
        type: 'date', value:"", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Insurance Expiry Date is required"
          },
        ],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
        }
      },

      {
        name: 'fitnessValidityDate', label: "Fitness Validity Date", placeholder: "", type: 'date',
        value: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Fitness Validity Date is required"
          },
        ],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
        }
      },
      {
        name: 'engineNo', label: "Engine Number", placeholder: "Engine Number", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
      },
      {
        name: 'chasisNo', label: "Chassis Number", placeholder: "Chassis Number", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
      },
      {
        name: 'vehContAmt', label: "Vehicle Contract Amount", placeholder: "Vehicle Contract Amount", type: 'number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
        functions:{
          onChange: "calculateContractAmount"
        }
      },
      {
        name: 'margAMT', label: "Margin Amount", placeholder: "Margin Amount", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
        Validations: [
        ],
      },
      {
        name: 'roadPrt', label: "Road Permit", placeholder: "Road Permit", type: 'date',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
        additionalData: {
          minDate: new Date()
        },
      },
      {
        name:'uploadSupport',label: "Upload Supporting",placeholder: "Road Permit", type: 'file',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        functions: {
          onChange: 'getFilePod'
      },
      additionalData: {
        isFileSelected: true
      },
        Validations: [
        ],
      },
      {
        name: 'vendCode',
        label: 'vendCode',
        placeholder: 'vendCode',
        type: '',
        value: "8888",
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'vendTypeCode',
        label: 'vendTypeCode',
        placeholder: 'vendTypeCode',
        type: '',
        value: "4",
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'companyCode', label: "Company Code", placeholder: "Company Code", type: '',
        value: localStorage.getItem("companyCode"), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
        Validations: [
        ],
      },
      {
        name: '_id', label: "_id", placeholder: "_id", type: '',
        value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
        Validations: [
        ],
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