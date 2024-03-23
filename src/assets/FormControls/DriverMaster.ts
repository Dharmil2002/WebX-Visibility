import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DriverMaster } from "src/app/core/models/Masters/Driver";

export class DriverControls {
  private DriverDetailsControl: FormControls[];
  constructor(DriverTable: DriverMaster, isUpdate: boolean) {
    this.DriverDetailsControl = [
      {
        name: "manualDriverCode",
        label: "Manual Driver Code",
        placeholder: "Manual Driver Code",
        type: "text",
        value: isUpdate ? DriverTable.manualDriverCode : "System Generated",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "driverName",
        label: "Driver Name",
        placeholder: "Enter Driver Name",
        type: "text",
        value: DriverTable.driverName,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 200 characters",
            pattern: "^[a-zA-Z -/]{3,200}$"
          },
        ],
        functions: {
          onChange: "checkDriverNameExist",
        },
      },
      {
        name: "driverPhoto",
        label: "Driver Photo",
        placeholder: "",
        type: "file",
        value: DriverTable.driverPhoto,
        Validations: [
          {
            name: "required",
            message: "Driver Name is required",
          },
        ],
        additionalData: {
          multiple: true,
          isFileSelected: true
        },
        functions: {
          onChange: 'selectFileDriverPhoto',
      },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "licenseNo",
        label: "License No",
        placeholder: "Enter License No",
        type: "text",
        value: DriverTable.licenseNo,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "License No is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter alphanumeric License No(eg. WG0463555776868)",
            pattern: "^[A-Z]{2}[0-9]{13}$",
          },
        ],
        functions: {
          onChange: "checkLicenseNumberExist",
        },
      },
      {
        name: "valdityDt",
        label: "License Valdity Date",
        placeholder: "",
        type: "date",
        value: DriverTable.valdityDt,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "License Valdity Date is required",
          },
        ],
      },
      {
        name: "licenseScan",
        label: "License Scan",
        placeholder: "",
        type: "file",
        value: DriverTable.licenseScan,
        Validations: [
          {
            name: "required",
            message: "Driver Name is required",
          },
        ],
        additionalData: {
          multiple: true,
          isFileSelected: true
        },
        functions: {
          onChange: "selectedFileLicenseScan",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "country",
        label: "Country Code",
        placeholder: "Country Code",
        type: "dropdown",
        value: DriverTable.country,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Country Code is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "telno",
        label: "Mobile Number",
        placeholder: "Enter Mobile Number",
        type: "mobile-number",
        value: DriverTable.telno,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Contact Number is required",
          },
          {
            name: "pattern",
            message: "Please enter 10 digit Mobile number",
            pattern: "^[0-9]{10,12}$",
          },
        ],
      },
      {
        name: "address",
        label: "Address",
        placeholder: "Enter Permanent Address",
        type: "text",
        value: DriverTable.address,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Address is required",
          },
          {
            name: "pattern",
            message: "Please enter Address of length 5 to 200 characters",
            pattern: "^[a-zA-Z0-9,-/ ]{5,200}$",
          },
        ],
      },
      {
        name: "pincode",
        label: "Pincode",
        placeholder: "Enter Permanent Pincode",
        type: "dropdown",
        value: DriverTable.pincode,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pincode is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onModel: "getPincodeData",
          onOptionSelect: "setStateCityData",
        },
      },
      {
        name: "city",
        label: "City",
        placeholder: "Enter Permanent City",
        type: "text",
        value: DriverTable.city,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "City is required",
          },
        ],
      },
      {
        name: "addressProofDocNo",
        label: "Address Proof Doc No",
        placeholder: "Enter Address Proof Doc No",
        type: "text",
        value: DriverTable.addressProofDocNo,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Address Proof Doc No is required",
          },
          {
            name: "pattern",
            message:
              "Please enter Address Proof Doc No of length 3 to 200 characters",
            pattern: "^[a-zA-Z0-9]{3,200}$",
          },
        ],
      },
      {
        name: "addressProofScan",
        label: "Address Proof Scan",
        placeholder: "Enter Address Proof Scan",
        type: "file",
        value: DriverTable.addressProofScan,
        Validations: [
          {
            name: "required",
            message: "Driver Name is required",
          },
        ],
        additionalData: {
          multiple: true,
          isFileSelected: true
        },
        functions: {
          onChange: "selectedFileAddressProofScan",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vehicleNo",
        label: "Assigned Vehicle No",
        placeholder: "Select Assigned Vehicle No",
        type: "dropdown",
        value: DriverTable.vehicleNo,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "dDob",
        label: "Date of Birth",
        placeholder: "select Date Of Birth",
        type: "date",
        value: DriverTable.dDob,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Date of Birth is required",
          },
        ],
        additionalData: {
          maxDate: new Date(
            new Date().getFullYear() - 18,
            new Date().getMonth(),
            new Date().getDate()
          ),
          minDate: new Date("01 Jan 1900"),
        },
      },
      {
        name: "DOBProofDocNo",
        label: "DOB proof doc no",
        placeholder: "Enter DOB proof doc no",
        type: "text",
        value: DriverTable.DOBProofDocNo,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Address Proof Doc No is required",
          },
          {
            name: "pattern",
            message:
              "Please enter Address Proof Doc No of length 3 to 200 characters",
            pattern: "^[a-zA-Z0-9]{3,200}$",
          },
        ],
      },
      {
        name: "DOBProofScan",
        label: "DOB proof scan",
        placeholder: "Select DOB proof scan",
        type: "file",
        value: DriverTable.DOBProofScan,
        Validations: [
          {
            name: "required",
            message: "DOB proof scan is required",
          },
        ],
        additionalData: {
          multiple: true,
          isFileSelected: true
        },
        functions: {
          onChange: "selectedFileDOBProofScan",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: DriverTable.activeFlag,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: DriverTable._id,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "updateBy",
        label: "Update By",
        placeholder: "Update By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "isUpdate",
        label: "IsUpdate",
        placeholder: "IsUpdate",
        type: "text",
        value: false,
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "companyCode",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "entryBy",
        label: "Entry By",
        placeholder: "Entry By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      // {
      //   name: 'updatedDate',
      //   label: ' ',
      //   placeholder: ' ',
      //   type: 'date',
      //   value: new Date(), // Set the value to the current date
      //   filterOptions: '',
      //   autocomplete: '',
      //   displaywith: '',
      //   Validations: [],
      //   generatecontrol: false,
      //   disable: false
      // },
    ];
  }
  getFormControlsD() {
    return this.DriverDetailsControl;
  }
}
