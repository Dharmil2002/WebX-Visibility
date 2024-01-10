import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdviceAcknowledgeControl {
  AdviceAcknowledgeArray: FormControls[];
  constructor() {
    this.AdviceAcknowledgeArray = [
      {
        name: 'brand', label: '', placeholder: '', type: 'radiobutton',
        value: [{ value: 'DA', name: 'Debit Advice', "checked": true }],
        Validations: [],
        generatecontrol: true, disable: false
      },
      {
        name: "adviceNo",
        label: "Advice No",
        placeholder: "Enter Advice No",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            // name: "pattern",
            // message: "Please Enter alphanumeric of length 25!",
            // pattern: "^[a-zA-Z0-9]{0,25}$",
          },
        ],
        functions: {
          //onChange: "CheckERPId",
        },
      },
      {
        name: "adviceDate",
        label: "Advice Date",
        placeholder: "select Advice Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "raisedonBranch",
        label: "Raised on Branch",
        placeholder: "Select Raised on Branch",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Raised on Branch is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "reasonforAdvice",
        label: "Reason for Advice",
        placeholder: "Enter Reason for Advice",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            // name: "pattern",
            // message: "Please Enter alphanumeric of length 25!",
            // pattern: "^[a-zA-Z0-9]{0,25}$",
          },
        ],
        functions: {
          //onChange: "CheckERPId",
        },
      },
      {
        name: "applicableAmount",
        label: "Applicable Amount ",
        placeholder: "Enter Applicable Amount ",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Applicable Amount is required",
          },
          // {
          //   name: "pattern",
          //   message: "Please Enter only text!",
          //   pattern: "^[a-zA-Z ]{0,100}$",
          // },
        ],
        functions: {
          //onChange: "CheckUserName",
        },
      },
      {
        name: "advicegenerationLoc",
        label: "Advice Generation Location",
        placeholder: "Advice Generation Location",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Advice Generation Location is required",
          },
          // {
          //   name: "pattern",
          //   message: "Please Enter only text!",
          //   pattern: "^[a-zA-Z ]{0,100}$",
          // },
        ],
        functions: {
          //onChange: "CheckUserName",
        },
      },
      {
        name: "paymentMode",
        label: "Payment Mode",
        placeholder: "Select Payment Mode",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Payment Mode is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "cashbankAccount",
        label: "Cash/Bank Account",
        placeholder: "Cash/Bank Account",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Cash/Bank Account is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "bankName",
        label: "Bank Name",
        placeholder: "Bank Name",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bank Name is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "chequeNumber",
        label: "Cheque Number",
        placeholder: "Enter Cheque Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          // {
          //   name: "pattern",
          //   message: "Please Enter alphanumeric 250 digit!",
          //   pattern: "^[a-zA-Z 0-9 , ]{0,250}$",
          // },
        ],
      },
      {
        name: "chequeDate",
        label: "Cheque Date",
        placeholder: "select Cheque Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "depositedin",
        label: "Deposited in",
        placeholder: "Deposited in",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Deposited in is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "depositedon",
        label: "Deposited on",
        placeholder: "Enter Deposited on",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            // name: "pattern",
            // message: "Please Enter alphanumeric of length 25!",
            // pattern: "^[a-zA-Z0-9]{0,25}$",
          },
        ],
        functions: {
          //onChange: "CheckERPId",
        },
      },
      {
        name: "isActive",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ];
  }
  getFormControls() {
    return this.AdviceAcknowledgeArray;
  }
}
