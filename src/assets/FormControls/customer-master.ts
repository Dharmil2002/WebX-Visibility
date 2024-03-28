import { FormControls } from "src/app/Models/FormControl/formcontrol";
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
        functions: {
          onModel: "getcustomerGroup",
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
        name: 'customerLocations',
        label: 'Customer Locations',
        placeholder: 'Search and select Customer Locations',
        type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
        Validations: [
        ],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "customerLocationsDrop",
          showNameAndValue: false,
          Validations: [{
            name: "",
            message: ""
          }]
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true, disable: false
      },
      {
        name: "Customer_Emails",
        label: "Customer E-mails",
        placeholder: "Customer E-mails",
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
        name: "customer_mobile",
        label: "Customer Mobile No",
        placeholder: "Customer Mobile No",
        type: "mobile-number",
        value: isUpdate ? customerTable.customer_mobile : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Mobile No is required",
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
          // {
          //   name: "required",
          //   message: "ERP code is required",
          // },
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
        name: "TANNumber",
        label: "TAN Number",
        placeholder: "TAN Number",
        type: "text",
        value: isUpdate ? customerTable.TANNumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "TAN Number is required",
          },
          // {
          //   name: "pattern",
          //   message: "Please Enter alphanumeric ERP code of length 4 to 100",
          //   pattern: "^[a-zA-Z0-9]{4,100}$",
          // },
        ],
      },

      {
        name: "PANnumber",
        label: "PAN No",
        placeholder: "PAN No",
        type: "government-id",
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

      {
        name: "uplodPANcard",
        label: "Uplod PAN Card",
        placeholder: "",
        type: "file",
        value: isUpdate ? customerTable.uplodPANcard : "",
        Validations: [],
        additionalData: {
          multiple: true,
          isFileSelected: true
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
              "Please Enter alphanumeric Registered Address of length 4 to 500",
            pattern: "^.{4,500}$",
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
          // {
          //   name: "required",
          //   message: "MSME Number is required",
          // },
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

      {
        name: "MSMEscan",
        label: "MSME scan",
        placeholder: "",
        type: "file",
        value: isUpdate ? customerTable.MSMEscan : "",
        Validations: [],
        additionalData: {
          isFileSelected: true
        },
        functions: {
          onChange: "selectedFileMSMEScan",
        },
        generatecontrol: true,
        disable: false,
      },

      {
        name: "BlackListed",
        label: "Black Listed",
        placeholder: "",
        type: "toggle",
        // value: isUpdate ? customerTable.BlackListed == "Y" ? true : false : false,
        value: isUpdate ? customerTable.BlackListed : false,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Black Listed is required",
          },
        ],
      },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: isUpdate ? customerTable.activeFlag : false,
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Active Flag is required",
          },
        ],
      },
      {
        name: 'customerLocationsDrop',
        label: 'Customer Locations',
        placeholder: 'Select CustomerLocations',
        type: '',
        value: '',
        Validations: [],
        generatecontrol: false, disable: false
      },
    ];

    this.GSTKycControlArray = [
      {
        name: "gstNo",
        label: "GST Number",
        placeholder: "GST Number",
        type: "government-id",
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
