import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
import { BaseControl } from "./base-control";

/* here i create class for the bind controls in formGrop */
export class QuickBookingControls extends BaseControl {
  private fieldMapping: FormControls[];
  constructor(
    generalService: GeneralService
  ) {
    super(generalService, "LTL", ["QuickBookingControls"]);
    
    this.fieldMapping = [
      {
        name: "docketNumber",
        label: "CNote No",
        placeholder: "CNote No",
        type: "text",
        value: "Computerized",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "docketDate",
        label: "C Note Date",
        placeholder: "C Note Date",
        type: "date",
        value: new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "C Note Date is required",
          },
        ],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "payType",
        label: "Payment Type",
        placeholder: "Payment Type",
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
        name: "billingParty",
        label: "Billing Party",
        placeholder: "Billing Party",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onModel: "getCustomer"
        },
        Validations: [
          {
            name: "required",
            message: "Billing Party is required",
          },
          {
            name: "autocomplete"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: true,
        }
     
      },
      {
        name: "orgLoc",
        label: "Origin",
        placeholder: "orgLoc",
        type: "text",
        value: localStorage.getItem("Branch"),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "fromCity",
        label: "From City",
        placeholder: "From City",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onModel:"getPincodeDetail"
        },
        Validations: [
          {
            name: "required",
            message: "From City is required",
          },
          {
            name: "autocomplete"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "destination",
        label: "Destination",
        placeholder: "Destination",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions:{
         onModel:"destionationDropDown",
         onOptionSelect: 'toCity'
        },
        Validations: [
          {
            name: "required",
            message: "Destination is required",
          },
          {
            name: "autocomplete"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "toCity",
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
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          }
        ],
        functions:{
          onModel:"getPincodeDetail"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "vehNo",
        label: "Vehicle No",
        placeholder: "Vehicle No",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "totalChargedNoOfpkg",
        label: "Charged No of Packages",
        placeholder: "Charged No of Packages",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charged No of Packages is required",
          },
          {
            name: "pattern",
            message: "Invalid Charged No of Packages",
            pattern: '^[0-9]+$'
          }
        ],
        functions: {
          keypress: "intigerOnly",
        },
      },
      {
        name: "actualwt",
        label: "Actual Weight (Kg)",
        placeholder: "Actual Weight (Kg)",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Actual Weight is required",
          },
        ],
        functions: {
          change: "",
          onModel: "preventNegative"
        },
      },
      {
        name: "chrgwt",
        label: "Charged Weight (Kg)",
        placeholder: "Charged Weight (Kg)",
        type: "number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charged Weight is required",
          },
        ],
        functions: {
          change: "",
          onModel: "preventNegative"
        },
      },
    ];
  }
  getDocketFieldControls() {
    return this.fieldMapping;
  }
}
