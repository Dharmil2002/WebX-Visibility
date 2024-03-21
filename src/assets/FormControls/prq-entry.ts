import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { prqDetail } from 'src/app/core/models/operations/prq/prq';
// Get the current date


/* here i create class for the bind controls in formGrop */
export class PrqEntryControls {
currentDate = new Date();
   // Calculate the date one month ago
oneMonthAgo = new Date();
afterOneMt= new Date();
oneday: Date;
  private fieldMapping: FormControls[];
  // Constructor for initializing form controls.
  constructor(prqDetail: prqDetail, isUpdate,rules) {
      this.oneMonthAgo.setMonth(this.currentDate.getMonth() - parseInt(rules.prqBackDate));
      this.afterOneMt.setMonth(this.currentDate.getMonth() + parseInt(rules.prqFutureDate));
      this.oneday = new Date(this.currentDate);
      this.oneday.setHours(this.currentDate.getHours() + 1);
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
          onOptionSelect: "bilingChanged",
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
           minDate: isUpdate ? "" :this.oneMonthAgo,
           maxDate: isUpdate ? "" :this.afterOneMt,
          // maxDate: new Date(new Date().getMonth()-1, new Date().getDate()),
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
        Validations: [],
        functions: {
          change: "",
        },
      },
      {
        name: "pADD",
        label: "Pick Up Address",
        placeholder: "Pick Up Address",
        type: "dropdown",
        value:"",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pick Up Address is required",
          }
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          // onOptionSelect: "setContainerSize"
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
        disable: false,
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
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "getAddressDetails",
          onModel: "getFromCityDetail",
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
        type: "dropdown",
        value:"",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PRQ Branch is required",
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
        }
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
        Validations: [
          {
            name: "required",
            message: "Contract Amount(₹) is required",
          },
        ],
      },
      {
        name: "oDRNO",
        label: "Order Number",
        placeholder: "Order Number",
        type: "text",
        value: prqDetail.oDRNO,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:"Please Enter alphanumeric Order Number of length 4 to 25",
            pattern: "^.{4,25}$",
          },
        ],
      },
      {
        name: "oDRDT",
        label: "Order Date & Time",
        placeholder: "Order Date & Time",
        type: "datetimerpicker",
        value: prqDetail.oDRDT,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        additionalData: {
          minDate: isUpdate ? "" : this.oneMonthAgo,
          maxDate: isUpdate ? "" :this.oneday
       },
      },
      {
        name: "oDRBY",
        label: "Order By",
        placeholder: "Order By",
        type: "text",
        value: prqDetail.oDRBY,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only alphabet Order By of length 4 to 100",
            pattern: "^[a-z A-Z]{4,100}$",
          },
        ],
      },
      {
        name: "rMKS",
        label: "Remarks",
        placeholder: "Remarks",
        type: "text",
        value: prqDetail.rMKS,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:"Please Enter alphanumeric Remarks of length 4 to 300",
            pattern: "^.{4,300}$",
          },
        ],
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
