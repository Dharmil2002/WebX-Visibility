import { FormControls } from "src/app/Models/FormControl/formcontrol";


export class ContractServiceSelectionControl {
  private ContractProductSelectionControlArray: FormControls[];
  private ContractServiceSelectionControlArray: FormControls[];
  private ContractCODDODSelectionControlArray: FormControls[];
  private ContractVolumtericSelectionControlArray: FormControls[];
  private ContractDemurrageSelectionControlArray: FormControls[];
  private ContractInsuranceCarrierRiskSelectionControlArray: FormControls[];
  private ContractInsuranceCustomerRiskSelectionControlArray: FormControls[];
  private ContractCutOfftimeControlArray: FormControls[];
  private ContractYieldProtectionSelectionControlArray: FormControls[];
  private ContractFuelSurchargeSelectionControlArray: FormControls[];

  constructor() {
    this.ContractProductSelectionControlArray = [
      {
        name: "loadType",
        label: "Load Type",
        placeholder: "Load Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Load Type is required",
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
      },
      {
        name: 'rateTypeDetails',
        label: 'Rate Type',
        placeholder: 'Rate Type',
        type: 'multiselect',
        value: '',
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
        ],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "rateTypecontrolHandler",
          showNameAndValue: false,
          Validations: [{
            name: "",
            message: ""
          }]
        },
        functions: {
          onToggleAll: 'toggleSelectAll',
          onSelect: 'onSelectrateTypeProduct'
        },
        generatecontrol: true, disable: false
      },
      //   ---------------Add support Controllers at last -----------------------
      {
        name: 'rateTypecontrolHandler',
        label: 'Rate Type',
        placeholder: 'Rate Type',
        type: '',
        value: '',
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        generatecontrol: false, disable: false
      },


      // {
      //   name: "originRateOption",
      //   label: "Origin Rate ",
      //   placeholder: "Origin Rate ",
      //   type: "dropdown",
      //   value: "",
      //   filterOptions: "",
      //   autocomplete: "",
      //   displaywith: "",
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "Origin Rate is required",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: false,

      //   },
      //   functions: {
      //     onModel: 'SetRateOptions',
      //   },
      //   generatecontrol: true,
      //   disable: true,
      //   accessallowed: true,
      // },
      // {
      //   name: "destinationRateOption",
      //   label: "Destination Rate",
      //   placeholder: "Destination Rate",
      //   type: "dropdown",
      //   value: "",
      //   filterOptions: "",
      //   autocomplete: "",
      //   displaywith: "",
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "estination Rate is required",
      //     },
      //   ],
      //   functions: {
      //     onModel: 'SetRateOptions',
      //   },
      //   additionalData: {

      //     showNameAndValue: false,

      //   },

      //   generatecontrol: true,
      //   disable: true,
      //   accessallowed: true,
      // },

      // {
      //   name: 'originRateOptionHandler',
      //   label: 'Origin Rate option',
      //   placeholder: 'Origin Rate option',
      //   type: '',
      //   value: '',
      //   Validations: [{
      //     name: "required",
      //     message: " ",
      //   }],
      //   generatecontrol: false, disable: false,
      //   accessallowed: true,
      // },
      // {
      //   name: 'destinationRateOptionHandler',
      //   label: 'Destination Rate option',
      //   placeholder: 'Destination Rate option',
      //   type: '',
      //   value: '',
      //   Validations: [{
      //     name: "required",
      //     message: " ",
      //   }],
      //   generatecontrol: false, disable: false,
      //   accessallowed: true,
      // },
    ]

    this.ContractServiceSelectionControlArray = [
      {
        name: "Volumetric",
        label: "Volumetric",
        placeholder: "Volumetric",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },

      // {
      //   name: "ODA",
      //   label: "ODA",
      //   placeholder: "ODA",
      //   type: "toggle",
      //   value: false,
      //   Validations: [],
      //   functions: {
      //     onChange: "OnChangeServiceSelections",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      //   accessallowed: true,
      // },
      // {
      //   name: "DACC",
      //   label: "DACC",
      //   placeholder: "DACC",
      //   type: "toggle",
      //   value: false,
      //   Validations: [],
      //   functions: {
      //     onChange: "OnChangeServiceSelections",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      //   accessallowed: true,
      // },
      {
        name: "fuelSurcharge",
        label: "Fuel Surcharge",
        placeholder: "Fuel Surcharge",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "cutofftime",
        label: "Cut off time",
        placeholder: "Cut off time",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "COD/DOD",
        label: "COD/DOD",
        placeholder: "COD/DOD",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "Demurrage",
        label: "Demurrage",
        placeholder: "Demurrage",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      // {
      //   name: "DPH",
      //   label: "DPH",
      //   placeholder: "DPH",
      //   type: "toggle",
      //   value: false,
      //   Validations: [],
      //   functions: {
      //     onChange: "OnChangeServiceSelections",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      //   accessallowed: true,
      // },
      {
        name: "Insurance",
        label: "Insurance",
        placeholder: "Insurance",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "YieldProtection",
        label: "Yield Protection",
        placeholder: "Yield Protection",
        type: "toggle",
        value: false,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },

    ]
    this.ContractCODDODSelectionControlArray = [
      {
        name: "CODDODRatetype",
        label: "COD/DOD Rate type",
        placeholder: "COD/DOD Rate type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "COD/DOD Rate type is required",
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
      },
      {
        name: "Rate",
        label: "Rate(₹)",
        placeholder: "Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Rate is required"
        }],
        functions: {
          // onChange: 'validateCodDodRates'
        },
      },

      {
        name: "MinCharge",
        label: "Min Charge(₹)",
        placeholder: "Min Charge",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Min Charge is required"
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
      },
      {
        name: "MaxCharge",
        label: "Max Charge(₹)",
        placeholder: "Max Charge",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Max Charge is required"
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
      },

    ]
    this.ContractVolumtericSelectionControlArray = [
      {
        name: "VolumetricUoM",
        label: "Volumetric UoM",
        placeholder: "Volumetric UoM",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "Volumtericcalculation",
        label: "Volumteric calculation",
        placeholder: "Volumteric calculation",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "Volumetricapplied",
        label: "Volumetric applied",
        placeholder: "Volumetric applied",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "Conversionratio",
        label: "Conversion ratio",
        placeholder: "Conversion ratio",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "DRatetype",
        label: "Rate type",
        placeholder: "Rate type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "Demurragerateperday",
        label: "Demurrage rate - per day(₹)",
        placeholder: "Demurrage rate- per day",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "DMinCharge",
        label: "Min Charge(₹)",
        placeholder: "Min Charge",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Min Charge is required"
          },
          {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }
        ],
        functions: {
          onChange: 'validateCodDodRates'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "DMaxCharge",
        label: "Max Charge(₹)",
        placeholder: "Max Charge",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Max Charge is required"
          },
          {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }
        ],
        functions: {
          onChange: 'validateCodDodRates'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ]
    this.ContractInsuranceCarrierRiskSelectionControlArray = [
      {
        name: "InvoiceValueFrom",
        label: "Invoice Value From(₹)",
        placeholder: "Invoice Value From",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Invoice Value From is required",
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "tovalue",
        label: "Invoice Value To(₹)",
        placeholder: "To value",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "To value is required",
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "rateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Rate Type is required",
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
      },
      {
        name: "Rate",
        label: "Rate(₹)",
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
        accessallowed: true,
      },
      {
        name: "IMinCharge",
        label: "Min Charge(₹)",
        placeholder: "Min Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Min Charge is required"
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "IMaxCharge",
        label: "Max Charge(₹)",
        placeholder: "Max Charge",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Max Charge is required"
        },
        {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateCodDodRates'
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      }
    ];
    this.ContractCutOfftimeControlArray = [
      {
        name: "Timeofday",
        label: "Time of day",
        placeholder: "Time of day",
        type: "time",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Time of day is required",
          },
        ],
      },
      {
        name: "AdditionalTransitdays",
        label: "Additional Transit days",
        placeholder: "Additional Transit days",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Additional Transit days is required",
        }],
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
    ];
    this.ContractYieldProtectionSelectionControlArray = [
      {
        name: "MinimumweightKg",
        label: "Minimum weight- Kg",
        placeholder: "Minimum weight- Kg",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "MinimumpackagesNo",
        label: "Minimum packages - No",
        placeholder: "Minimum packages - No",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "MinimumFreightvalueINR",
        label: "Minimum Freight value (₹)",
        placeholder: "Minimum Freight value",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "Yieldtype",
        label: "Yield Type",
        placeholder: "Yield Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "MinimumyieldINR",
        label: "Minimum yield (₹)",
        placeholder: "Minimum yield (₹)",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "CalculateYieldon",
        label: "Calculate Yield on",
        placeholder: "Calculate Yield on",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
    ]
    this.ContractFuelSurchargeSelectionControlArray = [
      {
        name: "FuelType",
        label: "Fuel Type",
        placeholder: "Fuel Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "FRateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
      },
      {
        name: "FRate",
        label: "Rate(₹)",
        placeholder: "Rate",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
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
        name: "FMinCharge",
        label: "Min Charge(₹)",
        placeholder: "Min Charge",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Min Charge is required"
          },
          {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }
        ],
        functions: {
          onChange: 'validateCodDodRates'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "FMaxCharge",
        label: "Max Charge(₹)",
        placeholder: "Max Charge",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Max Charge is required"
          },
          {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }
        ],
        functions: {
          onChange: 'validateCodDodRates'
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ]
  }
  getContractProductSelectionControlControls(CurrentAccess: string[]) {
    this.ContractProductSelectionControlArray = this.ContractProductSelectionControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractProductSelectionControlArray;
  }
  getContractServiceSelectionControlControls(CurrentAccess: string[]) {
    this.ContractServiceSelectionControlArray = this.ContractServiceSelectionControlArray.filter(item => CurrentAccess.includes(item.name))
    const sortedArray = this.ContractServiceSelectionControlArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    return sortedArray;
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

  getContractCutOfftimeControlControls() {
    return this.ContractCutOfftimeControlArray;
  }
  getContractYieldProtectionSelectionControlControls() {
    return this.ContractYieldProtectionSelectionControlArray;
  }
  getContractFuelSurchargeSelectionControlControls() {
    return this.ContractFuelSurchargeSelectionControlArray;
  }

}


