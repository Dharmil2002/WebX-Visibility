import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class VendorBillGenerationControl {
  vendorBillGenerationArray: FormControls[];
  constructor() {
    this.vendorBillGenerationArray = [
      {
        name: "TransactionType",
        label: "Transaction Type",
        placeholder: "Select Transaction Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Transaction Type is required"
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
      },

      {
        name: "VendorName",
        label: "Vendor",
        placeholder: "Select Vendor",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
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
          showNameAndValue: true,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "getVendorDetails",
        },
      },
      {
        name: "VendorPANNumber",
        label: "Vendor PAN Number",
        placeholder: "Vendor PAN Number",
        type: "textwithbutton",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          buttonIcon: "check",
          functionName: 'VendorPANNumberview'
        },
      },
      {
        name: "BeneficiarydetailsView",
        label: "Beneficiary details View",
        placeholder: "",
        type: "button",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          buttonIcon: "book-open"
        },
        functions: {
          onClick: "getBeneficiaryData",
        },
      },
    ]
  }
  getvendorBillGenerationArrayControl() {
    return this.vendorBillGenerationArray;
  }

}