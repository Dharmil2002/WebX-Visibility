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
        value: "",
        Validations: [
          {
            name: "required",
            message: "Required",
          },
          {
            name: "pattern",
            message: "Please Enter only alpha numeric length 2 to 10 Ex:- A1",
            pattern: "^[a-zA-Z]{1,5}[0-9]{1,5}$",
          },
        ],
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "handleProductId",
        },
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
          // onOptionSelect: "handleProductId",
        },
      },
    ];

    this.ChargesControlsArray = [
      {
        name: "ChargesCode",
        label: "Charges Code",
        placeholder: "Charges Code",
        type: "text",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Required Charges Code",
          },
          {
            name: "pattern",
            message: "Please Enter only alpha numeric length 2 to 10 Ex:- A1",
            pattern: "^[a-zA-Z]{1,5}[0-9]{1,5}$",
          },
        ],
        generatecontrol: true,
        disable:isUpdate?true:false,
        functions: {
          onChange: "handleChargesCode",
        },
      },
      {
        name: "SelectCharges",
        label: "Select Charges",
        placeholder: "Select Charges",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
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
      },
      {
        name: "Add_Deduct",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          { value: "+", name: "Add", checked: true },
          { value: "-", name: "Deduct" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
    ];

    this.ServicesControlsArray = [
      {
        name: "ServicesCode",
        label: "Services Code",
        placeholder: "Services Code",
        type: "text",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Required Services Code",
          },
          {
            name: "pattern",
            message: "Please Enter only alpha numeric length 2 to 10 Ex:- A1",
            pattern: "^[a-zA-Z]{1,5}[0-9]{1,5}$",
          },
        ],
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "handleServicesCode",
        },
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
          onOptionSelect:"handleServicesName"
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
