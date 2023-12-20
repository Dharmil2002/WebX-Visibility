import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { prqDetail } from 'src/app/core/models/operations/prq/prq';
/* here i create class for the bind controls in formGrop */
export class PrqEntryControls {
  private fieldMapping: FormControls[];
  // Constructor for initializing form controls.
  constructor(prqDetail: prqDetail, isUpdate) {
    this.fieldMapping = [
      {
        name: "pRQNO",
        label: "Request ID",
        placeholder: "Request ID",
        type: "text",
        value: prqDetail.prqNo,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "bPARTY",
        label: "Billing Party & Code",
        placeholder: "Billing Party",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Billing Party is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        functions: {
          onModel: "getCustomer",
          onOptionSelect: "bilingChanged"
        },
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "pICKDT",
        label: "Pickup Date & Time",
        placeholder: "",
        type: "datetimerpicker",
        value: prqDetail.pickupDate,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pickup Date is required",
          },
        ],
        functions: {
          onDate: 'format'
        },
        additionalData: {
          minDate: isUpdate ? "" : new Date(),
        },
      },
      {
        name: "cARTYP",
        label: "Carrier Type",
        placeholder: "Carrier Type",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions: {
          onSelection: "disableSize"
        },
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "cNTYP",
        label: "Type of Container",
        placeholder: "Type of Container",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          onOptionSelect: "setContainerSize"
        },
      },
      {
        name: "cNTSIZE",
        label: "Container Capacity(Tons)",
        placeholder: "Container Capacity",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "vEHSIZE",
        label: "Truck Capacity",
        placeholder: "Truck Capacity",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onSelection: "setVehicleSize"
        },
      },
      {
        name: "pHNO",
        label: "Contact Number",
        placeholder: "Contact Number",
        type: "mobile-number",
        value: prqDetail.contactNo,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please enter 10 digit mobile number",
            pattern: "^[0-9]{10}$",
          },
          {
            name: "required",
            message: "Contact No is required",
          },
        ],
        functions: {
          change: "",
        },
      },
      {
        name: "pADD",
        label: "Pick Up Address",
        placeholder: "Pick Up Address",
        type: "text",
        value: prqDetail.pAddress,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pick Up Address is required",
          },
        ],
        functions: {
          change: "",
        },
      },
      {
        name: "fCITY",
        label: "From City",
        placeholder: "From City",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "From City is required",
          },
          {
            name: "autocomplete"
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          }
        ],
        functions: {
          onOptionSelect: ''
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "tCITY",
        label: "To City",
        placeholder: "To City",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "To City is required",
          },
          {
            name: "autocomplete"
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onModel: "getPincodeDetail",
          onOptionSelect: ''
        },
      },

      {
        name: "bRCD",
        label: "PRQ Branch",
        placeholder: "PRQ Branch",
        type: "text",
        value: localStorage.getItem('Branch'),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "pAYTYP",
        label: "Payment Mode",
        placeholder: "Payment Mode",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Payment Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "cONTRAMT",
        label: "Contract Amount(₹)",
        placeholder: "Contract Amount",
        type: "number",
        value: prqDetail.contractAmt,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "sIZE",
        label: "Size",
        placeholder: "Size",
        type: "",
        value: prqDetail.size,
        generatecontrol: true,
        disable: false,
        Validations: [],
      }
    ];
  }
  getPrqEntryFieldControls() {
    return this.fieldMapping;
  }
}
