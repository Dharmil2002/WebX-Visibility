import { FormControls } from "src/app/Models/FormControl/formcontrol";


export class ContractServiceSelectionControl {
  private ContractProductSelectionControlArray: FormControls[];
  private ContractServiceSelectionControlArray: FormControls[];
  private ContractCODDODSelectionControlArray: FormControls[];
  private ContractVolumtericSelectionControlArray: FormControls[];
  private ContractDemurrageSelectionControlArray: FormControls[];
  private ContractInsuranceCarrierRiskSelectionControlArray: FormControls[];
  private ContractInsuranceCustomerRiskSelectionControlArray: FormControls[];

  constructor() {
    this.ContractProductSelectionControlArray = [
      {
        name: "loadType",
        label: "Load Type",
        placeholder: "Load Type",
        type: "Staticdropdown",
        value: [
          {
            value: "LTL",
            name: "LTL",
          },
          {
            value: "FTL",
            name: "FTL",
          },

        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Load Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "rateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "Staticdropdown",
        value: [
          {
            value: "1",
            name: "Per Kg",
          },
          {
            value: "2",
            name: "Per Pkg",
          },

        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },

      {
        name: "originRateOption",
        label: "Origin Rate option",
        placeholder: "Origin Rate option",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "destinationRateOption",
        label: "Destination Rate",
        placeholder: "Destination Rate option",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      }
    ]

    this.ContractServiceSelectionControlArray = [
      {
        name: "Volumetric",
        label: "Volumetric",
        placeholder: "Volumetric",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "ODA",
        label: "ODA",
        placeholder: "ODA",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "DACC",
        label: "DACC",
        placeholder: "DACC",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "fuelSurcharge",
        label: "Fuel Surcharge",
        placeholder: "Fuel Surcharge",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "cutofftime",
        label: "Cut off time",
        placeholder: "Cut off time",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "COD/DOD",
        label: "COD/DOD",
        placeholder: "COD/DOD",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "Demurrage",
        label: "Demurrage",
        placeholder: "Demurrage",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "DPH",
        label: "DPH",
        placeholder: "DPH",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "Insurance",
        label: "Insurance",
        placeholder: "Insurance",
        type: "toggle",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "YieldProtection",
        label: "Yield Protection",
        placeholder: "Yield Protection",
        type: "toggle",
        value: [
          { value: "Y", name: "Carrier", checked: true },
          { value: "N", name: "Customer" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },

    ]
    this.ContractCODDODSelectionControlArray = [
      {
        name: "CODDODRatetype",
        label: "COD/DOD Rate type",
        placeholder: "COD/DOD Rate type",
        type: "Staticdropdown",
        value: [
          {
            value: "PerKG",
            name: "PerKG",
          }
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Load Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "Rate",
        label: "Rate",
        placeholder: "Rate",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "MinCharge",
        label: "Min Charge",
        placeholder: "Min Charge",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "MaxCharge",
        label: "Max Charge",
        placeholder: "Max Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ]
    this.ContractVolumtericSelectionControlArray = [
      {
        name: "VolumetricUoM",
        label: "Volumetric UoM",
        placeholder: "Volumetric UoM",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Volumtericcalculation",
        label: "Volumteric calculation",
        placeholder: "Volumteric calculation",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Volumetricapplied",
        label: "Volumetric applied",
        placeholder: "Volumetric applied",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Conversionratio",
        label: "Conversion ratio",
        placeholder: "Conversion ratio",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ]

    this.ContractDemurrageSelectionControlArray = [
      {
        name: "Freestoragedays",
        label: "Free storage days",
        placeholder: "Free storage days",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Ratetype",
        label: "Rate type",
        placeholder: "Rate type",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Demurragerateperday",
        label: "Demurrage rate - per day",
        placeholder: "Demurrage rate- per day",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "MinCharge",
        label: "Min Charge",
        placeholder: "Min Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "MaxCharge",
        label: "Min Charge",
        placeholder: "Max Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ]
    this.ContractInsuranceCarrierRiskSelectionControlArray = [
      {
        name: "InvoiceValueFrom",
        label: "Invoice Value From",
        placeholder: "Invoice Value From",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "nvoice Value From is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "tovalue",
        label: "To value",
        placeholder: "To value",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "To value is required",
        }],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: 'getContainerType'
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "rateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Rate Type is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "Rate",
        label: "Rate",
        placeholder: "Rate",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Rate is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "MinCharge",
        label: "Min Charge",
        placeholder: "Min Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Min Charge is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "MaxCharge",
        label: "Max Charge",
        placeholder: "Max Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Rate is required",
        }],
        generatecontrol: true,
        disable: false,
      },
    ]
  }
  getContractProductSelectionControlControls() {
    return this.ContractProductSelectionControlArray;
  }
  getContractServiceSelectionControlControls() {
    return this.ContractServiceSelectionControlArray;
  }
  getContractCODDODSelectionControlControls() {
    return this.ContractCODDODSelectionControlArray;
  }
  getContractVolumtericSelectionControlControls() {
    return this.ContractVolumtericSelectionControlArray;
  }
  getContractDemurrageSelectionControlControls() {
    return this.ContractDemurrageSelectionControlArray;
  }
  getContractInsuranceCarrierRiskSelectionControlControls() {
    return this.ContractInsuranceCarrierRiskSelectionControlArray;
  }
  getContractInsuranceCustomerRiskSelectionControlControls() {
    return this.ContractInsuranceCarrierRiskSelectionControlArray;
  }


}


