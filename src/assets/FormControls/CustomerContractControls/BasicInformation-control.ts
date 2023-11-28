import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractBasicInformationControl {
  private ContractBasicInformationControlArray: FormControls[];
  private AddNewCustomerContractControlArray: FormControls[];
  constructor(BasicInformation) {
    this.ContractBasicInformationControlArray = [
      {
        name: "Customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value: BasicInformation.Customer,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ContractID",
        label: "ContractID",
        placeholder: "ContractID",
        type: "text",
        value: BasicInformation.ContractID,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },


      // {
      //   name: "ContractScanView",
      //   label: "View Contract Scan",
      //   placeholder: "View Contract Scan",
      //   type: "filelink",
      //   value: "test",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      {
        name: "Product",
        label: "Product",
        placeholder: "Product",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
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
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "ProductFieldChanged"
        },
      },
      {
        name: "PayBasis",
        label: "PayBasis",
        placeholder: "PayBasis",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PayBasis is required"
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
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "PayBasisFieldChanged"
        },
      },
      {
        name: "ContractScan",
        label: "Upload Contract Scan",
        placeholder: "Upload Contract Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          isFileSelected: true
        },
        functions: {
          onChange: "selectFileContractScan",
        },
      },
      {
        name: "AccountManager",
        label: "Account Manager",
        placeholder: "Account Manager",
        type: "text",
        value: BasicInformation.AccountManager,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "ContractStartDate",
        label: "Contract Start Date",
        placeholder: "Contract Start Date",
        type: "date",
        value: BasicInformation.ContractStartDate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          // minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
        functions: {
          onDate: "onContractStartDateChanged",
        },
      },
      {
        name: "Expirydate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: BasicInformation.Expirydate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
        functions: {
          onDate: "onContractStartDateChanged",
        },
      },
      {
        name: "Pendingdays",
        label: "Pending days",
        placeholder: "Pending days",
        type: "number",
        value: BasicInformation.pendingdays,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "CustomerPONo",
        label: "Customer PO No",
        placeholder: "Customer PO No",
        type: "text",
        value: BasicInformation.CustomerPONo,
        generatecontrol: true,
        disable: false,
        Validations: [],
      }, {
        name: "POValiditydate",
        label: "PO Validity date",
        placeholder: "POValiditydate",
        type: "date",
        value: BasicInformation.ValidUntil,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
      },

      {
        name: "ContractPOScan",
        label: "Upload Contract PO Scan",
        placeholder: "Upload Contract PO Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          isFileSelected: true
        },
        functions: {
          onChange: "selectFileContractPOScan",
        },
      },
      // {
      //   name: "ContractPOScanView",
      //   label: "View Contract PO Scan",
      //   placeholder: "View Contract PO Scan",
      //   type: "filelink",
      //   value: "test",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      // {
      //   name: "UpdateHistory",
      //   label: "View Update History",
      //   placeholder: "Update History",
      //   type: "filelink",
      //   value: "test",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
    ];

    this.AddNewCustomerContractControlArray = [
      {
        name: "ContractID",
        label: "ContractID",
        placeholder: "ContractID",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Customer",
        label: "Customer",
        placeholder: "Customer",
        type: "dropdown",
        value: BasicInformation.Customer,
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: BasicInformation.Customer ?? false,
        Validations: [
          {
            name: "required",
            message: "Customer is required"
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
          showNameAndValue: true,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "GeneralFieldChangedForTableData"
        },
      },
      {
        name: "Product",
        label: "Product",
        placeholder: "Product",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
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
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "GeneralFieldChangedForTableData"
        },
      },
      {
        name: "PayBasis",
        label: "PayBasis",
        placeholder: "PayBasis",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PayBasis is required"
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
          metaData: "Basic"
        },
        // functions: {
        //   onOptionSelect: "GeneralFieldChangedForTableData"
        // },
      },


      {
        name: "ContractStartDate",
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
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
        functions: {
          onDate: "onContractStartDateChanged",
        },

      },
      {
        name: "Expirydate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Expiry Date is required",
        },],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
          maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
        functions: {
          onDate: "onContractStartDateChanged",
        },
      },


    ];
  }
  getContractBasicInformationControlControls(CurrentAccess: string[]) {
    //this.ContractBasicInformationControlArray = this.ContractBasicInformationControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractBasicInformationControlArray;
  }
  getAddNewCustomerContractControlArrayControls() {
    return this.AddNewCustomerContractControlArray;
  }
}
