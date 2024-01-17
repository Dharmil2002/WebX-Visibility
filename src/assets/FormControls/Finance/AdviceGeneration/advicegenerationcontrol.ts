import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdviceGenerationControl {
  AdviceGenerationArray: FormControls[];
  AdviceGenerationPaymentArray: FormControls[];
  constructor(FormValues: any) {
    this.AdviceGenerationArray = [
      {
        name: 'AdviceType', label: '', placeholder: '', type: 'radiobutton',
        value: [{ value: 'D', name: 'Debit Advice', "checked": true }, { value: 'C', name: 'Credit Advice' }],
        Validations: [],
        generatecontrol: true, disable: false
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
        label: "Applicable Amount (₹)",
        placeholder: "Enter Applicable Amount ",
        type: "number",
        value: FormValues?.applicableAmount,
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
        },
      },
      {
        name: "advicegenerationLoc",
        label: "Advice Generation Location",
        placeholder: "Advice Generation Location",
        type: "text",
        value: localStorage.getItem("Branch"),
        generatecontrol: true,
        disable: true,
        Validations: [
        ],
        functions: {
        },
      },


    ];
    this.AdviceGenerationPaymentArray = [

      {
        name: "PaymentMode",
        label: "Payment Mode",
        placeholder: "Payment Mode",
        type: "Staticdropdown",
        value: [
          {
            value: "Cheque",
            name: "Cheque",
          },
          {
            value: "Cash",
            name: "Cash",
          },
          {
            value: "RTGS/UTR",
            name: "RTGS/UTR",
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
            message: "Payment Mode is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          onSelection: "OnPaymentModeChange"
        },
      },

      {
        name: "ChequeOrRefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Cheque/Ref No is required"
          },],
      },
      {
        name: "Bank",
        label: "Select Bank",
        placeholder: "Select Bank",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bank is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic"
        },
      },

      {
        name: "CashAccount",
        label: "Cash Account",
        placeholder: "Cash Account",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic"
        },
      },
      // {
      //   name: "ReceivedFromBank",
      //   label: "Received From Bank",
      //   placeholder: "Received From Bank",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      {
        name: "Date",
        label: "Date",
        placeholder: "Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },

    ];
  }
  getFormControls() {
    return this.AdviceGenerationArray;
  }
  getPaymentFormControls() {
    return this.AdviceGenerationPaymentArray;
  }
}
