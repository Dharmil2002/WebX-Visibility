import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddContractProfile {
  AddContractProfileArray: FormControls[];
  AddNewVendorContractArray: FormControls[];
  constructor(vendorInformationData) {
    this.AddContractProfileArray = [
      {
        name: "vendor",
        label: "Vendor",
        placeholder: "Vendor",
        type: 'text',
        value: vendorInformationData.vNID + ":" + vendorInformationData.vNNM,
        Validations: [
          {
            name: "required",
            message: "Vendor is required"
          },

        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "CNID",
        label: "Contract Code",
        placeholder: "Contract Code",
        type: "text",
        value: vendorInformationData.cNID,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "contractID is required"
          }],
      },
      {
        name: "cNSCN",
        label: "Upload Contract Scan",
        placeholder: "Upload Contract Scan",
        type: "file",
        value: vendorInformationData.cNSCN,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Contract Scan is required"
          },
        ],
        functions: {
          onChange: "onFileSelected",
        },
        additionalData: {
          isFileSelected: true
        },
      },
      {
        name: "vNMGR",
        label: "Vendor Manager",
        placeholder: "Vendor Manager",
        type: "text",
        value: vendorInformationData.vNMGR,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "vendor Manager is required"
          },],
      },
      {
        name: "cNSDT",
        label: "Start Date",
        placeholder: " Start Date",
        type: "date",
        value: vendorInformationData.cNSDT,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Start Date is required"
          },],
        additionalData: {
          minDate: new Date(),
        },
        functions: {
          onDate: 'onContractStartDateChanged',
        }
      },
      {
        name: "eNDDT",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: vendorInformationData.eNDDT,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Expiry Date is required"
          },],
        additionalData: {
          minDate: new Date(),
        },
        functions: {
          onDate: 'onContractStartDateChanged',
        }
      },
      {
        name: "pNDYS",
        label: "Pending days",
        placeholder: "Pending days",
        type: "number",
        value: vendorInformationData.pNDYS,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Pending days is required"
          },],
      },
      {
        name: 'mODDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: "mODBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];
    this.AddNewVendorContractArray = [
      {
        name: "CNID",
        label: "ContractID",
        placeholder: "ContractID",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "VNID",
        label: "Vendor",
        placeholder: "Vendor",
        type: 'dropdown',
        value: "",
        Validations: [
          {
            name: "required",
            message: "Vendor is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true
        },
        functions: {
          onOptionSelect: 'getTableData',
        },
        generatecontrol: true,
        disable: false,
      },

      {
        name: "PDTID",
        label: "Product",
        placeholder: "Product",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Product is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: 'getTableData',
        },
      },
      {
        name: "CNSDT",
        label: "Contract Start Date",
        placeholder: "Contract Start Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Start Date is required",
        },],
        additionalData: {
          minDate: new Date(),
        },
        functions: {
          onDate: "onContractStartDateChanged",
        },

      },
      {
        name: "ENDDT",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Expiry Date is required"
          },],
        additionalData: {
          minDate: new Date(),
        },
        functions: {
          onDate: "onContractStartDateChanged",
        },
      },
      // {
      //   name: 'ACTV',
      //   label: 'Active Flag',
      //   placeholder: 'Active Flag',
      //   type: 'toggle', value: false, Validations: [],
      //   generatecontrol: false, disable: false
      // },
      {
        name: '_id',
        label: 'id',
        placeholder: 'id',
        type: '',
        value: '',
        Validations: [],
        generatecontrol: false, disable: false
      },

      {
        name: 'EDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },

      {
        name: "ENBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "CID",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];
  }
  getAddContractProfileArrayControls() {
    return this.AddContractProfileArray;
  }
  getAddnewVendorContractControls() {
    return this.AddNewVendorContractArray;
  }
}