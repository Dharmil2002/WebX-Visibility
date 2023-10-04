import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { customerModel } from "src/app/core/models/Masters/customerMaster";
export class customerControl {
  customerControlArray: FormControls[];
  GSTKycControlArray: FormControls[];
  constructor(customerTable: any, isUpdate: boolean) {
    this.customerControlArray = [
      {
        name: "customerGroup",
        label: "Customer Group",
        placeholder: "Customer Group",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Group is required",
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
        name: "customerName",
        label: "Customer Name",
        placeholder: "Customer Name",
        type: "text",
        value: isUpdate ? customerTable.customerName : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 30 characters",
            pattern: "^[a-zA-Z ]{3,200}$",
          },
        ],
        functions: {
          onChange: "onChangeCustomerName",
        },
      },
      {
        name: "CustomerCategory",
        label: "Customer Category",
        placeholder: "Customer Category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Category is required",
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
        name: "CustomerLocations",
        label: "Customer Locations",
        placeholder: "Customer Locations",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Locations is required",
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
        name: "Customer_Emails",
        label: "Customer e-mails",
        placeholder: "Customer e-mails",
        type: "text",
        value: isUpdate ? customerTable.Customer_Emails : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer e-mails is required",
          },
        ],
        functions: {
          onChange: "onChangeEmail",
        },
      },
      {
        name: "ERPcode",
        label: "ERP code",
        placeholder: "ERP code",
        type: "text",
        value: isUpdate ? customerTable.ERPcode : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "ERP code is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric ERP code of length 4 to 100",
            pattern: "^[a-zA-Z0-9]{4,100}$",
          },
        ],
        functions: {
          onChange: "onChangeERPcode",
        },
      },

      {
        name: "PANnumber",
        label: "PAN No",
        placeholder: "PAN No",
        type: "text",
        value: isUpdate ? customerTable.PANnumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PAN No is required",
          },
          {
            name: "pattern",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          },
        ],
        functions: {
          onChange: "CheckPANNo",
        },
      },
      // {
      //   name: "uplodPANcard",
      //   label: "Uplod PAN Card",
      //   placeholder: "uplod PAN card",
      //   type: "text",
      //   value: isUpdate ? customerTable.uplodPANcard : "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "PAN img is required",
      //     },
      //   ],
      //   functions: {},
      // },

      {
        name: "uplodPANcard",
        label: "Uplod PAN Card",
        placeholder: "",
        type: "file",
        value: isUpdate ? customerTable.uplodPANcard : "",
        Validations: [],
        additionalData: {
          multiple: true,
        },
        functions: {
          onChange: "selectedFilePanCardScan",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "CINnumber",
        label: "CIN number",
        placeholder: "CIN number",
        type: "text",
        value: isUpdate ? customerTable.CINnumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter alphanumeric CIN number of length 4 to 100",
            pattern: "^[a-zA-Z0-9]{4,100}$",
          },
        ],
        functions: {
          onChange: "CheckCINnumber",
        },
      },

      {
        name: "RegisteredAddress",
        label: "Registered Address",
        placeholder: "Registered Address",
        type: "text",
        value: isUpdate ? customerTable.RegisteredAddress : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Registered Address is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter alphanumeric Registered Address of length 4 to 100",
            pattern: "^[a-zA-Z0-9]{4,200}$",
          },
        ],
        functions: {},
      },
      {
        name: "PinCode",
        label: "Pin Code",
        placeholder: "Pin Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pin Code is required",
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
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "onSelectPinCode",
          onModel: "getPinCodeDropdown",
        },
      },
      {
        name: "city",
        label: "City",
        placeholder: "City",
        type: "text",
        value: isUpdate ? customerTable.city : "",
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
        name: "state",
        label: "State",
        placeholder: "State",
        type: "text",
        value: isUpdate ? customerTable.state : "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "state is required",
          },
        ],
      },

      {
        name: "Country",
        label: "Country",
        placeholder: "Country",
        type: "text",
        value: isUpdate ? customerTable.Country : "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Country is required",
          },
        ],
        functions: {},
      },

      {
        name: "MSMENumber",
        label: "MSME Number",
        placeholder: "MSME Number",
        type: "text",
        value: isUpdate ? customerTable.MSMENumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "MSME Number is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric MSME Number of length 4 to 100",
            pattern: "^[a-zA-Z0-9]{4,100}$",
          },
        ],
        functions: {
          onChange: "CheckmsmeNumber",
        },
      },
      // {
      //   name: "MSMEscan",
      //   label: "MSME scan",
      //   placeholder: "MSME scan",
      //   type: "text",
      //   value: isUpdate ? customerTable.MSMEscan : "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "MSME scan is required",
      //     },
      //     // {
      //     //   name: "pattern",
      //     //   message: "Please Enter alphanumeric MSME scan of length 4 to 100",
      //     //   pattern: "^[a-zA-Z0-9]{4,100}$",
      //     // },
      //   ],
      //   functions: {},
      // },

      {
        name: "MSMEscan",
        label: "MSME scan",
        placeholder: "",
        type: "file",
        value: isUpdate ? customerTable.MSMEscan : "",
        Validations: [],
        additionalData: {
          // multiple: true,
        },
        functions: {
          onChange: "selectedFileMSMEScan",
        },
        generatecontrol: true,
        disable: false,
      },

      // {
      //   name: "isPANregistration",
      //   label: "PAN registration",
      //   placeholder: "",
      //   type: "toggle",
      //   value: isUpdate
      //     ? customerTable.isPANregistration == "Y"
      //       ? true
      //       : false
      //     : false,
      //   generatecontrol: true,
      //   disable: true,
      //   Validations: [],
      // },

      // {
      //   name: "MSMEregistered",
      //   label: "MSME registered",
      //   placeholder: "",
      //   type: "toggle",
      //   value: isUpdate
      //     ? customerTable.MSMEregistered == "Y"
      //       ? true
      //       : false
      //     : false,
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "MSME registered is required",
      //     },
      //   ],
      // },
      {
        name: "BlackListed",
        label: "Black Listed",
        placeholder: "",
        type: "toggle",
        value: isUpdate
          ? customerTable.BlackListed == "Y"
            ? true
            : false
          : false,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "MSME Number is required",
          },
        ],
      },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: isUpdate ? customerTable.activeFlag : false,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "MSME Number is required",
          },
        ],
      },
    ];

    this.GSTKycControlArray = [
      {
        name: "gstNo",
        label: "GST Number",
        placeholder: "GST Number",
        type: "text",
        value: isUpdate ? customerTable.GSTNumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST Number is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message: "Please enter a valid GST Number EX. (12ABCDE1234F5Z6)",
          },
        ],
        functions: {
          onChange: "ValidGSTNumber",
        },
      },
      {
        name: "gstState",
        label: "GST State",
        placeholder: "GST State",
        type: "text",
        value: isUpdate ? customerTable.GSTState : "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "GST State is required",
          },
        ],
        functions: {},
      },
      {
        name: "gstPinCode",
        label: "Pin Code",
        placeholder: "GST Pin Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST Pin Code is required",
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
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "onSelectGSTPinCode",
          onModel: "getGSTPinCodeDropdown",
        },
      },
      {
        name: "gstCity",
        label: "City",
        placeholder: "City",
        type: "text",
        value: isUpdate ? customerTable.GSTCity : "",
        generatecontrol: true,
        disable: true,
        Validations: [],
        functions: {},
      },
      {
        name: "gstAddres",
        label: "Address",
        placeholder: "Address",
        type: "text",
        value: isUpdate ? customerTable.Address : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST State is required",
          },
        ],
        functions: {},
      },
    ];
  }

  getFormControls() {
    return this.customerControlArray;
  }

  getGSTFormControl() {
    return this.GSTKycControlArray;
  }
}

// ***** Old Array *****
// {
//   name: "groupCode",
//   label: "Group Code",
//   placeholder: "Group Code",
//   type: "dropdown",
//   value: "",
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Group Code is required",
//     },
//     {
//       name: "invalidAutocompleteObject",
//       message: "Choose proper value",
//     },
//   ],
//   additionalData: {
//     showNameAndValue: true,
//   },
// },

// {
//   name: "customerCode",
//   label: "Customer Code",
//   placeholder: "Customer Code",
//   type: "text",
//   value: customerTable?.customerCode,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Customer Code is required",
//     },
//     {
//       name: "pattern",
//       message:
//         "Please Enter alphanumeric Customer Code of length 4 to 10",
//       pattern: "^[a-zA-Z0-9]{4,10}$",
//     },
//   ],
//   functions: {
//     onModelChange: "dataExist",
//   },
// },

// {
//   name: "customerName",
//   label: "Customer Name",
//   placeholder: "Customer Name",
//   type: "text",
//   value: customerTable?.customerName,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Customer Name is required",
//     },
//     {
//       name: "pattern",
//       message: "Please Enter only text of length 3 to 30 characters",
//       pattern: "^[a-zA-Z ]{3,30}$",
//     },
//   ],
//   functions: {
//     onModelChange: "getCustomerDetails",
//   },
// },
// {
//   name: "customerPassword",
//   label: "Customer Password",
//   placeholder: "Customer Password",
//   type: "password",
//   value: customerTable?.customerPassword,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Customer Password is required",
//     },
//   ],
//   additionalData: {
//     // showPassword: false,
//     inputType: "password",
//   },
// },
// {
//   name: "customerAbbreviation",
//   label: "Customer Abbreviation",
//   placeholder: "Customer Abbreviation",
//   type: "text",
//   value: customerTable?.customerAbbreviation,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Customer Abbreviation is required",
//     },
//     {
//       name: "pattern",
//       message:
//         "Please Enter A-Z Char Or 0-9 with no Space and Customer Abbreviation should be limited to 5 characters",
//       pattern: "^[.a-zA-Z0-9,-]{1,5}$",
//     },
//   ],
// },
// {
//   name: "industry",
//   label: "Industry",
//   placeholder: "Industry",
//   type: "text",
//   value: customerTable?.industry,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter only text of length 3 to 25 characters",
//       pattern: "^[a-zA-Z ]{3,25}$",
//     },
//   ],
//   additionalData: {
//     showNameAndValue: false,
//   },
// },
// {
//   name: "mobile",
//   label: "Mobile Number",
//   placeholder: "Mobile Number",
//   type: "text",
//   value: customerTable?.mobile,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Customer Password is required",
//     },
//     {
//       name: "pattern",
//       message: "Please enter 10 to 12 digit mobile number",
//       pattern: "^[0-9]{10,12}$",
//     },
//   ],
// },

// {
//   name: "ownership",
//   label: "Type of Ownership",
//   placeholder: "Group Code",
//   type: "dropdown",
//   value: "",
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "invalidAutocompleteObject",
//       message: "Choose proper value",
//     },
//   ],
//   additionalData: {
//     showNameAndValue: false,
//   },
// },

// {
//   name: "customerControllingLocation",
//   label: "Customer Controlling Locations",
//   placeholder: "Select Customer Controlling Locations",
//   type: "multiselect",
//   value: "",
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   additionalData: {
//     isIndeterminate: false,
//     isChecked: false,
//     support: "controllingDropdown",
//     showNameAndValue: true,
//     Validations: [
//       {
//         name: "",
//         message: "",
//       },
//     ],
//   },
//   functions: {
//     onToggleAll: "toggleSelectAll",
//   },
//   generatecontrol: true,
//   disable: false,
// },

// {
//   name: "customerLocation",
//   label: "Customer location",
//   placeholder: "Select Customer location",
//   type: "multiselect",
//   value: "",
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   additionalData: {
//     isIndeterminate: false,
//     isChecked: false,
//     support: "locationDropdown",
//     showNameAndValue: true,
//     Validations: [
//       {
//         name: "",
//         message: "",
//       },
//     ],
//   },
//   functions: {
//     onToggleAll: "toggleSelectAll",
//   },
//   generatecontrol: true,
//   disable: false,
// },
// {
//   name: "nonOda",
//   label: "Customer Non-ODA Locations",
//   placeholder: "Select Customer Non-ODA Locations",
//   type: "multiselect",
//   value: "",
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   additionalData: {
//     isIndeterminate: false,
//     isChecked: false,
//     support: "nonOdaDropdown",
//     showNameAndValue: true,
//     Validations: [
//       {
//         name: "",
//         message: "",
//       },
//     ],
//   },
//   functions: {
//     onToggleAll: "toggleSelectAll",
//   },
//   generatecontrol: true,
//   disable: false,
// },

// {
//   name: "telephone",
//   label: "Telephone Number",
//   placeholder: "Contact Number",
//   type: "number",
//   value: customerTable?.telephone,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please enter 8 to 10 digit Telephone number",
//       pattern: "^[0-9]{8,10}$",
//     },
//     {
//       name: "required",
//       message: "Telephone Number is required",
//     },
//   ],
// },
// {
//   name: "email",
//   label: "Email",
//   placeholder: "Email",
//   type: "text",
//   value: customerTable?.email,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "required",
//       message: "Email Id  is required",
//     },
//     {
//       name: "email",
//       message: "Enter Valid Email ID!",
//     },
//   ],
// },

// {
//   name: "website",
//   label: "Website",
//   placeholder: "Website",
//   type: "text",
//   value: customerTable?.website,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     // {
//     //     name: "required",
//     //     message: "Website is required"
//     // }
//   ],
// },
// {
//   name: "partyType",
//   label: "Party Type",
//   placeholder: "Party Type",
//   type: "text",
//   value: customerTable?.partyType,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter only text of length 3 to 25 characters",
//       pattern: "^[a-zA-Z ]{3,25}$",
//     },
//   ],
// },
// {
//   name: "activeFlag",
//   label: "Active Flag",
//   placeholder: "",
//   type: "toggle",
//   value: customerTable?.activeFlag,
//   generatecontrol: true,
//   disable: false,
//   Validations: [],
// },
// {
//   name: "mobileService",
//   label: "Mobile Service",
//   placeholder: "",
//   type: "toggle",
//   value: customerTable?.mobileService,
//   generatecontrol: true,
//   disable: false,
//   Validations: [],
// },
// {
//   name: "controllingDropdown",
//   label: "Customer Controlling Locations",
//   placeholder: "Customer Controlling Locations",
//   type: "",
//   value: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
// {
//   name: "locationDropdown",
//   label: "Customer Locations",
//   placeholder: "Customer Locations",
//   type: "",
//   value: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
// {
//   name: "nonOdaDropdown",
//   label: "Non Oda",
//   placeholder: "Non Oda",
//   type: "",
//   value: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
// ]),
// (this.billKycControlArray = [
// ***** Old Array *****
// {
//   name: "gstNumber",
//   label: "GST Number",
//   placeholder: "GST Number ",
//   type: "text",
//   value: customerTable?.gstNumber,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter alphanumeric GST Number of length 15",
//       pattern: "^[a-zA-Z0-9]{15}$",
//     },
//   ],
// },
// {
//   name: "custBillName",
//   label: "Customer Billing Name",
//   placeholder: "Customer Billing Name",
//   type: "text",
//   value: customerTable?.custBillName,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter only text of length 3 to 30 characters",
//       pattern: "^[a-zA-Z ]{3,30}$",
//     },
//   ],
// },
// {
//   name: "billAddress",
//   label: "Billing Address",
//   placeholder: "Billing Address",
//   type: "text",
//   value: customerTable?.billAddress,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter Billing Address of length 1 TO 250",
//       pattern: "^.{1,250}$",
//     },
//   ],
// },
// {
//   name: "billPincode",
//   label: "Billing Pincode",
//   placeholder: "Select Billing Pincode",
//   type: "dropdown",
//   value: customerTable.billPincode,
//   additionalData: {
//     showNameAndValue: false,
//   },
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "autocomplete",
//     },
//     {
//       name: "invalidAutocompleteObject",
//       message: "Choose proper value",
//     },
//   ],
//   functions: {
//     onModel: "getBillingPincodeData",
//     onOptionSelect: "setCityData",
//   },
// },
// {
//   name: "billCity",
//   label: "Billing City",
//   placeholder: "Billing City",
//   type: "text",
//   value: "",
//   generatecontrol: true,
//   disable: true,
//   Validations: [],
// },
// {
//   name: "bankName",
//   label: "Bank Name",
//   placeholder: "Bank Name",
//   type: "text",
//   value: customerTable?.bankName,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please enter a Bank Name of length 3 to 15 characters",
//       pattern: "^[a-zA-Z ]{3,15}$",
//     },
//   ],
// },
// {
//   name: "branch",
//   label: "Bank Branch",
//   placeholder: "Branch",
//   type: "text",
//   value: customerTable?.branch,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message:
//         "Please enter a Branch Name of length 3 to 15 characters",
//       pattern: "^[a-zA-Z ]{3,15}$",
//     },
//   ],
// },
// {
//   name: "bankAcct",
//   label: "Bank Account Number",
//   placeholder: "Bank Account Number",
//   type: "text",
//   value: customerTable?.bankAcct,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please enter Bank Account Number of length 14 digits",
//       pattern: "^[0-9]{14}$",
//     },
//   ],
// },
// {
//   name: "payBasis",
//   label: "Pay basis",
//   placeholder: "Select Pay basis",
//   type: "multiselect",
//   value: "",
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   additionalData: {
//     isIndeterminate: false,
//     isChecked: false,
//     support: "payBasisDropdown",
//     showNameAndValue: false,
//     Validations: [
//       {
//         name: "",
//         message: "",
//       },
//     ],
//   },
//   functions: {
//     onToggleAll: "toggleSelectAll",
//   },
//   generatecontrol: true,
//   disable: false,
// },
// {
//   name: "serviceOpted",
//   label: "Service Opted Forn",
//   placeholder: "Select Service Opted For",
//   type: "multiselect",
//   value: "",
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   additionalData: {
//     isIndeterminate: false,
//     isChecked: false,
//     support: "serviceOptedDropdown",
//     showNameAndValue: false,
//     Validations: [
//       {
//         name: "",
//         message: "",
//       },
//     ],
//   },
//   functions: {
//     onToggleAll: "toggleSelectAll",
//   },
//   generatecontrol: true,
//   disable: false,
// },
// {
//   name: "pan",
//   label: "PAN Number",
//   placeholder: "PAN Number",
//   type: "text",
//   value: customerTable?.pan,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter alphanumeric PAN Number of length 10",
//       pattern: "^[a-zA-Z0-9]{10}$",
//     },
//   ],
// },
// {
//   name: "address",
//   label: "Addresss",
//   placeholder: "Address",
//   type: "text",
//   value: customerTable?.address,
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "pattern",
//       message: "Please Enter alphanumeric Addresss of length 4 to 100",
//       pattern: "^.{4,100}$",
//     },
//   ],
// },
// {
//   name: "pincode",
//   label: "Pincode",
//   placeholder: "Select Pincode",
//   type: "dropdown",
//   value: customerTable.pincode,
//   additionalData: {
//     showNameAndValue: false,
//   },
//   generatecontrol: true,
//   disable: false,
//   Validations: [
//     {
//       name: "autocomplete",
//     },
//     {
//       name: "invalidAutocompleteObject",
//       message: "Choose proper value",
//     },
//   ],
//   functions: {
//     onModel: "getPincodeData",
//     onOptionSelect: "setStateCityData",
//   },
// },
// {
//   name: "city",
//   label: "City",
//   placeholder: "City",
//   type: "text",
//   value: customerTable?.city,
//   generatecontrol: true,
//   disable: true,
//   Validations: [],
// },
// {
//   name: "state",
//   label: "State",
//   placeholder: "State",
//   type: "text",
//   value: customerTable?.state,
//   generatecontrol: true,
//   disable: true,
//   Validations: [],
// },
// {
//   name: "sameAddres",
//   label: "Billing address same as customer address",
//   placeholder: "",
//   type: "toggle",
//   value: customerTable?.sameAddres,
//   generatecontrol: true,
//   disable: false,
//   Validations: [],
// },
// {
//   name: "consignorSite",
//   label: "Consignor Site Code Mandatory",
//   placeholder: "",
//   type: "toggle",
//   value: customerTable?.consignorSite,
//   generatecontrol: true,
//   disable: false,
//   Validations: [],
// },
// {
//   name: "consigneeSite",
//   label: "Consignee Site Code Mandatory",
//   placeholder: "",
//   type: "toggle",
//   value: customerTable?.consigneeSite,
//   generatecontrol: true,
//   disable: false,
//   Validations: [],
// },
// {
//   name: "_id",
//   label: "",
//   placeholder: "",
//   type: "text",
//   value: customerTable.id,
//   filterOptions: "",
//   autocomplete: "",
//   displaywith: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
// {
//   name: "payBasisDropdown",
//   label: "Pay Basis",
//   placeholder: "Pay Basis",
//   type: "",
//   value: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
// {
//   name: "serviceOptedDropdown",
//   label: "Service Opted",
//   placeholder: "Service Opted",
//   type: "",
//   value: "",
//   Validations: [],
//   generatecontrol: false,
//   disable: false,
// },
