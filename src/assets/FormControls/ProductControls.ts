import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ProductControls {
  private isCompanyProductControlsArray: FormControls[];
  private ChargesControlsArray: FormControls[];
  private ServicesControlsArray: FormControls[];
  constructor(isUpdate) {
    this.isCompanyProductControlsArray = [
      {
        name: "ProductID",
        label: "Product ID",
        placeholder: "Product ID",
        type: "text",
        value: "System Generated",
        Validations: [],
        generatecontrol: true,
        disable: true,
        functions: {},
      },
      {
        name: "ProductName",
        label: "Product Name",
        placeholder: "Product Name",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Product Name is required",
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
          onOptionSelect: "handleProductId",
        },
      },
    ];

    this.ChargesControlsArray = [
      {
        name: "ChargesCode",
        label: "Charges Code",
        placeholder: "Charges Code",
        type: "text",
        value: "System Generated",
        Validations: [],
        generatecontrol: true,
        disable: true,
        functions: {},
      },
      {
        name: "SelectCharges",
        label: "Select Charges",
        placeholder: "Select Charges",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: isUpdate,
        Validations: [
          {
            name: "required",
            message: "Select Charges is required",
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
          onOptionSelect: "handleSelectCharges",
        },
      },
      {
        name: "ChargesBehaviour",
        label: "Charges Behaviour",
        placeholder: "Charges Behaviour",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charges Behaviour is required",
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
        functions: {},
      },
      {
        name: "chargeApplicable",
        label: "Charge Applicable On",
        placeholder: "Select Charge Applicable",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          support: "chargeApplicableHandler",
          showNameAndValue: true,
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "cAPTION",
        label: "Charge Caption",
        placeholder: "Charge Caption",
        type: "text",
        value: '',
        Validations: [{
          name: "required",
          message: "Charge Caption is required",
        },],
        generatecontrol: true,
        disable: false,
      },
      // {
      //   name: "Ledger",
      //   label: "Account",
      //   placeholder: "Account",
      //   type: "dropdown",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "invalidAutocomplete",
      //       message: "Choose proper value",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: true,
      //   },
      //   functions: {},
      // },

      {
        name: "Ledger",
        label: "Account",
        placeholder: "Account",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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
        functions: {},
      },

      {
        name: "Variability",
        label: "Variability:",
        placeholder: "Variability:",
        type: "radiobutton",
        value: [
          { value: "N", name: "No", checked: true },
          { value: "Y", name: "Yes" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "OnChangeVariability",
        },
      },
      {
        name: "VariabilityOn",
        label: "Charge Variability",
        placeholder: "Select Charge Variability",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          support: "VariabilityOnHandler",
          showNameAndValue: false,
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "Add_Deduct",
        label: "Add/Deduct",
        placeholder: "Add/Deduct",
        type: "radiobutton",
        value: [
          { value: "+", name: "Add", checked: true },
          { value: "-", name: "Deduct" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },

      {
        name: "isActive",
        label: "Active Flag",
        placeholder: "Active Flag",
        type: "toggle",
        value: false,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "iSChargeMandatory",
        label: "Charge Mandatory",
        placeholder: "Charge Mandatory",
        type: "toggle",
        value: false,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "chargeApplicableHandler",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        Validations: [{
          name: "required",
          message: "Charge Applicable On is required",
        }],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "VariabilityOnHandler",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];

    this.ServicesControlsArray = [
      {
        name: "ServicesCode",
        label: "Services Code",
        placeholder: "Services Code",
        type: "text",
        value: "System Generated",
        Validations: [],
        generatecontrol: true,
        disable: true,
        functions: {},
      },
      {
        name: "ServicesName",
        label: "Services Name",
        placeholder: "Services Name",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Services Name is required",
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
          onOptionSelect: "handleServicesName"
        },
      },
      {
        name: "multiServicesType",
        label: "Multi Services Type",
        placeholder: "Multi Services Type",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "ServicesType",
          showNameAndValue: false,
          Validations: [
            {
              name: "",
              message: "",
            },
          ],
        },
      },
      {
        name: "ServicesType",
        label: "Services Type",
        placeholder: "Services Type",
        type: "",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Multi Division Access is Required...!",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        generatecontrol: false,
        disable: false,
      },
    ];
  }
  getisCompanyProductControlsArray() {
    return this.isCompanyProductControlsArray;
  }
  getChargesControlsArray(isUpdate) {
    return this.ChargesControlsArray;
  }
  getServicesControlsArray() {
    return this.ServicesControlsArray;
  }
}
