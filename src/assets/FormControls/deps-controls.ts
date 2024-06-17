import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";

export class DepsControls {
  private DepsArray: FormControls[];
  constructor(
    DocCalledAs: any,
  ) {
    this.DepsArray = [
      {
        name: 'docketNumber',
        label: `${DocCalledAs.Docket} No`,
        placeholder: `${DocCalledAs.Docket} No`,
        type: 'text',
        value: '',
        Validations: [
          {
            name: "required",
            message: `${DocCalledAs.Docket}No required`,
          }
        ],
        functions: {
          onChange: "getDocketDetails",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: false
      },
      {
        name: 'docketDate',
        label: `${DocCalledAs.Docket} Date`,
        placeholder: `${DocCalledAs.Docket} Date`,
        type: 'text',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'paytyp',
        label: `Payment Type`,
        placeholder: `Payment Type`,
        type: 'text',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'billingParty',
        label: `BillingParty`,
        placeholder: `Billing Party`,
        type: 'text',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'oRGN',
        label: `Origin`,
        placeholder: `Origin`,
        type: 'text',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'dEST',
        label: `Destination`,
        placeholder: `Destination`,
        type: 'text',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },

      {
        name: 'aCTWT',
        label: `Actual Weight`,
        placeholder: `Actual Weight`,
        type: 'number',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'cHRWT',
        label: `Charge Weight`,
        placeholder: `Actual Weight`,
        type: 'number',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'bookingPkgs',
        label: `Booking Package`,
        placeholder: `Booking Package`,
        type: 'number',
        value: '',
        Validations: [
        ],
        functions: {
          onChange: "",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: true
      },
      {
        name: 'depsPkgs',
        label: `Extra Package`,
        placeholder: `Extra Package`,
        type: 'number',
        value: '',
        Validations: [
          {
            name: "required",
            message: `Extra Package required`,
          }
        ],
        functions: {
          onChange: "onExtraPkgs",
        },
        additionalData: {
          require: true
        },
        generatecontrol: true,
        disable: false
      },
      {
        name: 'depsType',
        label: '',
        placeholder: '',
        type: '',
        value: 'E',
        Validations: [],
        additionalData: {
          require: true
        },
        generatecontrol: false, disable: false
      },
      {
        name: 'depsTypeName',
        label: '',
        placeholder: '',
        type: '',
        value: 'Excess',
        Validations: [],
        additionalData: {
          require: true
        },
        generatecontrol: false, disable: false
      },
      {
        name: 'shipment',
        label: '',
        placeholder: '',
        type: '',
        value: '',
        Validations: [],
        additionalData: {
          require: true
        },
        generatecontrol: false, disable: false
      },
      {
        name: 'suffix',
        label: '',
        placeholder: '',
        type: '',
        value: '',
        Validations: [],
        additionalData: {
          require: true
        },
        generatecontrol: false, disable: false
      }
    ];
  }
  getDepsControls() {
    return this.DepsArray;
  }

}