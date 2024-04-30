import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdminRuleControl {
  adminRuleArray: FormControls[];
  ComputerizedRuleArray: FormControls[];
  ManageExceptionsArray: FormControls[];
  constructor() {
    this.adminRuleArray = [
      {
        name: "documentType",
        label: "Document Type",
        placeholder: "Search And Select Document Type",
        type: "Staticdropdown",
        value: [
          { value: "CN", name: "CNote" },
          { value: "DMR", name: "Delivery MR" },
          { value: "UBIS", name: "UBI Series" },
        ],
        Validations: [
          {
            name: "required",
            message: "Document Type is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "seriestype",
        label: "Series type",
        placeholder: "Search And Select Series type",
        type: "Staticdropdown",
        value: [
          { value: "MN", name: "Manual" },
          { value: "CP", name: "Computerized" },
          { value: "BT", name: "Both" },
        ],
        Validations: [
          {
            name: "required",
            message: "Series type is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
    ];
    this.ComputerizedRuleArray = [
      {
        name: "numbertype",
        label: "Number type",
        placeholder: "Search And Select Number type",
        type: "Staticdropdown",
        value: [
          { value: "NB", name: "Numeric" },
          { value: "AN", name: "Alpha numeric" },
        ],
        Validations: [
          {
            name: "required",
            message: "Number type is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "sequencelogic",
        label: "Sequence logic",
        placeholder: "Search And Select sequence logic",
        type: "Staticdropdown",
        value: [
          { value: "SQ", name: "Sequential" },
          { value: "RN", name: "Random" },
        ],
        Validations: [
          {
            name: "required",
            message: "Select sequence logic is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "prefix",
        label: "Prefix",
        placeholder: "Prefix",
        type: "text",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Prefix is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "yeartype",
        label: "Year type",
        placeholder: "Search And Select Year type",
        type: "Staticdropdown",
        value: [
          { value: "CL", name: "Calendar" },
          { value: "FN", name: "Financial" },
        ],
        Validations: [
          {
            name: "required",
            message: "Select Year type is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "yearcode",
        label: "Select year code",
        placeholder: "Select year code",
        type: "text",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Select year code is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "Lgthofrunnum",
        label: "Length of running number",
        placeholder: "Length of running number",
        type: "text",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Length of running number is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "Isbranchcode",
        label: "Include branch code",
        placeholder: "",
        type: "toggle",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Isyearcode",
        label: "Inlcude year code",
        placeholder: "",
        type: "toggle",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
    this.ManageExceptionsArray = [
      {
        name: "location",
        label: "Location code",
        placeholder: "Location code",
        type: "multiselect",
        value: "",
        Validations: [],
        functions: {
          onModel: "getlocation",
          onToggleAll: "toggleSelectAll",
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "LocationcodecontrolHandler",
          showNameAndValue: true,
          Validations: [
            {
              name: "",
              message: "",
            },
          ],
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "seriesentrytype",
        label: "Series entry type",
        placeholder: "Search And Select Series entry type",
        type: "Staticdropdown",
        value: [
          { value: "OM", name: "Only Manual" },
          { value: "OC", name: "Only computerized" },
          { value: "BT", name: "Both" },
        ],
        Validations: [
          {
            name: "required",
            message: "Select Series entry type is required",
          },
        ],
        // functions: {
        //   onSelection: "getPattern",
        // },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      //   ---------------Add support Controllers at last -----------------------
      {
        name: "LocationcodecontrolHandler",
        label: "Location code",
        placeholder: "Location code",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location code is Required...!",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
      },
    ];
  }
  getadminRuleFormControls() {
    return this.adminRuleArray;
  }
  getComputerizedRuleFormControls() {
    return this.ComputerizedRuleArray;
  }
  getManageExceptionsFormControls() {
    return this.ManageExceptionsArray;
  }
}
