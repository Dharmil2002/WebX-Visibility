import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { AddressMaster } from "src/app/core/models/Masters/address-master";

export class AddressControl {
  addressControlArray: FormControls[];
  constructor(addressGroupTable: AddressMaster, isUpdate: boolean) {
    this.addressControlArray = [
      {
        name: "addressCode",
        label: "Address Code",
        placeholder: "For example 000001",
        type: "text",
        value: addressGroupTable.addressCode
          ? addressGroupTable.addressCode
          : "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "manualCode",
        label: "Manual Code",
        placeholder: "For example AD0001",
        type: "text",
        value: addressGroupTable.manualCode,
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Manual Code is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Manual Code of length 4 to 10",
            pattern: "^[a-zA-Z0-9]{4,10}$",
          },
        ],
        functions: {
          onChange: "checkCodeExists",
        },
      },
      {
        name: "phone",
        label: "Phone Number",
        placeholder: "Phone Number",
        type: "number",
        value: addressGroupTable.phone,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please enter 10  digit Phone number",
            pattern: "^[0-9]{10}$",
          },
        ],
      },
      {
        name: "email",
        label: "Email Id",
        placeholder: "Enter Email Id",
        type: "text",
        value: addressGroupTable.email,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Email Id  is required",
          },
          {
            name: "email",
            message: "Enter Valid Email ID!",
          },
        ],
      },
      {
        name: "address",
        label: "Address",
        placeholder: "Enter Address",
        type: "text",
        value: addressGroupTable.address,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "pincode",
        label: "Pincode",
        placeholder: "Select Pincode",
        type: "dropdown",
        value: addressGroupTable.pincode,
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "required",
            message: " ",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        functions: {
          onModel: "getPincodeData",
          onOptionSelect: "setStateCityData",
        },
      },
      {
        name: "cityName",
        label: "City",
        placeholder: "Select City",
        type: "text",
        value: addressGroupTable.cityName,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "stateName",
        label: "State",
        placeholder: "Select State",
        type: "text",
        value: addressGroupTable.stateName,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "customer",
        label: "Customer Name",
        placeholder: "Customer Name",
        type: "multiselect",
        value: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "customerNameDropdown",
          showNameAndValue: true,
          Validations: [
            {
              name: "required",
              message: "Customer Name is Required...!",
            },
          ],
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "customerNameDropdown",
        label: "Customer Name",
        placeholder: "Customer Name",
        type: "",
        value: [],
        Validations: [
          {
            name: "required",
            message: "Customer Name is Required...!",
          },
        ],
        generatecontrol: false,
        disable: false,
      },

      // {
      //     name: "LocationsDrop",
      //     label: "Locations",
      //     placeholder: "Select CustomerLocations",
      //     type: "",
      //     value: [],
      //     Validations: [],
      //     generatecontrol: false,
      //     disable: false,
      //   },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "Active",
        type: "toggle",
        value: addressGroupTable.activeFlag,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: addressGroupTable._id,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "companyCode",
        label: "Company Code",
        placeholder: "Company Code",
        type: "",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      // {
      //   name: "updatedDate",
      //   label: " ",
      //   placeholder: " ",
      //   type: "date",
      //   value: new Date(), // Set the value to the current date
      //   filterOptions: "",
      //   autocomplete: "",
      //   displaywith: "",
      //   Validations: [],
      //   generatecontrol: false,
      //   disable: false,
      // },
    ];
  }
  getFormControls() {
    return this.addressControlArray;
  }
}
