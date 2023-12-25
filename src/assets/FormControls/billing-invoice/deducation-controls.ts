import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class DeducationControl {
  private editShipment: FormControls[];
  private tdsDetail: FormControls[];
  constructor() {
    this.editShipment = [
      {
        name: "customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "billNO",
        label: "Invoice Number",
        placeholder: "Invoice Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "amt",
        label: "Invoice Amount ",
        placeholder: "Invoice Amount ",
        type: "text",
        value:"",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
        },
      },
      {
        name: "pendingAmt",
        label: "Pending Amount",
        placeholder: "State",
        type: "text",
        value:"",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
          
        },
      },
      
    ];
    this.tdsDetail=[
      {
        name: "tds",
        label: "TDS (-)",
        placeholder: "TDS (-)",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        functions:{
         onChange:"calucatedCharges"
        },
        Validations: [],
      },
      {
        name: "ftDist",
        label: "Freight discount (-)",
        placeholder: "Freight discount (-)",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onChange:"calucatedCharges"
         },
        Validations: [],
      },
      {
        name: "claimsDeduction",
        label: "Claims deduction (-)",
        placeholder: "Claims deduction (-)",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onChange:"calucatedCharges"
         },
        Validations: [],
      },
      {
        name: "otherDeduction",
        label: "Other Deduction (-)",
        placeholder: "Other Deduction (-)",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onChange:"calucatedCharges"
         },
        Validations: [],
      },
      {
        name: "additionalCharges",
        label: "Additional Charges (+)",
        placeholder: "Additional Charges (+)",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onChange:"calucatedCharges"
         },
        Validations: [],
      },
      {
        name: "netDeduction",
        label: "Net Deduction",
        placeholder: "Net Deduction",
        type: "text",
        value: "",
        functions:{
          onChange:"calucatedCharges"
         },
        generatecontrol: true,
        disable: false,
        Validations: [],
      }
    ]

  }
  getShipmentControls() {
    return this.editShipment;
  }
  getTdsControls() {
    return this.tdsDetail
  }
}
