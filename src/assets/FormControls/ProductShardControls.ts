import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ProductShardControls {
  private ShardProductControlsArray: FormControls[];
  private ShardProductChargesControlsArray: FormControls[];
  private ShardProductServicesControlsArray: FormControls[];



  constructor() {
    this.ShardProductControlsArray = [
      {
        name: "ProductID",
        label: "Product ID",
        placeholder: "ProductID",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {},
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
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onChange: "handleProductName",
        },
      },
    ];

    this.ShardProductChargesControlsArray = [
      {
        name: "ChargesID",
        label: "Charges ID",
        placeholder: "Charges ID",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {},
      },
      {
        name: "ChargesName",
        label: "Charges Name",
        placeholder: "Charges Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charges Name is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onChange: "handleChargesName",
        },
      },
      {
        name: "ChargesType",
        label: "Charges Type:-",
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
        name: "ChargesBooktype",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          { value: "Booking", name: "Booking", checked: true },
          { value: "Delivery", name: "Delivery" },
          { value: "Both", name: "Both" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
    ]

    this.ShardProductServicesControlsArray = [
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
    ]
  }

  getShardProductControlsArray() {
    return this.ShardProductControlsArray;
  }

  getShardProductChargesControlsArray() {
    return this.ShardProductChargesControlsArray;
  }

  getShardProductServicesControlsArray() {
    return this.ShardProductServicesControlsArray;
  }
}
