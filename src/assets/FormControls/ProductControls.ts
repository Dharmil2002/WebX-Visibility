import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ProductControls {
  private isCompanyProductControlsArray: FormControls[];
  private ChargesControlsArray: FormControls[];
  private ServicesControlsArray: FormControls[];
  private ProductControlsArray: FormControls[];
  private ShardChargesControlsArray: FormControls[];
  private ShardServicesControlsArray: FormControls[];


  constructor() {
    this.isCompanyProductControlsArray = [
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
      {
        name: "ProductID",
        label: "Product ID",
        placeholder: "System Genreted",
        type: "text",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
    ];

    this.ProductControlsArray = [
      {
        name: "ProductID",
        label: "Product ID",
        placeholder: "System Genrated",
        type: "text",
        value: "System Genrated",
        Validations: [{
          name: "required",
          message: "Required",
        },],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "ProductName",
        label: "Product Name",
        placeholder: "Product Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Product Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 20 characters",
            pattern: "^[a-zA-Z ]{3,20}$",
          },
        ],
        functions: {},
      },
      // {
      //   name: "ProductID",
      //   label: "Product ID",
      //   placeholder: "System Genreted",
      //   type: "text",
      //   value: "",
      //   Validations: [{
      //     name: "required",
      //     message: "Required",
      //   },],
      //   generatecontrol: true,
      //   disable: true,
      // },
    ];

    this.ChargesControlsArray = [
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
        functions: {},
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

    this.ShardChargesControlsArray = [
      {
        name: "ChargeID",
        label: "Charges ID",
        placeholder: "System Genrated",
        type: "text",
        value: "System Genrated",
        Validations: [{
          name: "required",
          message: "Required",
        },],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "ChargeName",
        label: "Charges Name",
        placeholder: "Charges Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Select Charges is required",
          },
        ],
        functions: {},
      },
      {
        name: "ChargesType",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          { value: "V", name: "Vendor", checked: true },
          { value: "C", name: "Customer" },
          { value: "B", name: "Both" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "ChargesBehavior",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          { value: "+", name: "Add (+)", checked: true },
          { value: "-", name: "Deduct (-)" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
    ];

    this.ServicesControlsArray = [
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
        functions: {},
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
    this.ShardServicesControlsArray = [
      {
        name: "ServicesID",
        label: "Services ID",
        placeholder: "System Genrated",
        type: "text",
        value: "System Genreted",
        Validations: [{
          name: "required",
          message: "Required",
        },],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "ServicesName",
        label: "Services Name",
        placeholder: "Services Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Select Services is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onChange: "handleServicesName",
        },
      },
      
    ];
  }
  getProductControlsArray(event) {
    if (event) {
      return this.isCompanyProductControlsArray;
    } else {
      return this.ProductControlsArray;
    }
  }

  getChargesControlsArray() {
    return this.ChargesControlsArray;
  }
  getServicesControlsArray() {
    return this.ServicesControlsArray;
  }
  getShardChargesControlsArray() {
    return this.ShardChargesControlsArray;
  }
  getShardServicesControlsArray() {
    return this.ShardServicesControlsArray;
  }
}
