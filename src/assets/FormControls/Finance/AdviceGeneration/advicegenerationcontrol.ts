import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdviceGenerationControl {
  AdviceGenerationArray: FormControls[];
  AdviceGenerationPaymentArray: FormControls[];
  constructor(FormValues: any, Type: any) {
    this.AdviceGenerationArray = [
      {
        name: 'AdviceType', label: '', placeholder: '', type: 'radiobutton',
        value: [{ value: 'D', name: 'Debit Advice', "checked": true },
        { value: 'C', name: 'Credit Advice' }],
        Validations: [],
        generatecontrol: true,
        disable: Type == "Acknowledge" ? true : false,
      },
      {
        name: "adviceDate",
        label: "Advice Date",
        placeholder: "select Advice Date",
        type: "date",
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.aDDT : new Date(),
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
        Validations: [],
      },
      {
        name: "raisedonBranch",
        label: "Raised on Branch",
        placeholder: "Select Raised on Branch",
        type: "dropdown",
        value: Type == "Modify" || Type === "View" ? FormValues?.rBRANCH : "",
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
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
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.rEASION : "",
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
        Validations: [

        ],
        functions: {

        },
      },
      {
        name: "applicableAmount",
        label: "Applicable Amount (₹)",
        placeholder: "Enter Applicable Amount ",
        type: "number",
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.aMT : "",
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
        Validations: [
          {
            name: "required",
            message: "Applicable Amount is required",
          },
        ],
        functions: {
        },
      },
      {
        name: "advicegenerationLoc",
        label: "Advice Generation Location",
        placeholder: "Advice Generation Location",
        type: "text",
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.eNTLOC : localStorage.getItem("Branch"),
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
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
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
        Validations: [
          {
            name: "required",
            message: "Payment Mode is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "OnPaymentModeChange"
        },
      },

      {
        name: "ChequeOrRefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.cHEQREF : "",
        generatecontrol: true,
        disable: Type == "Acknowledge" ? true : false,
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
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.aCNM : "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: Type == "Acknowledge" ? true : false,
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
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.aCNM : "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: Type == "Acknowledge" ? true : false,
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
      {
        name: "Date",
        label: "Date",
        placeholder: "Date",
        type: "date",
        value: Type === "Modify" || Type === "Acknowledge" || Type === "View" ? FormValues?.eNTDT : "",
        generatecontrol: true,
        disable: Type == "Acknowledge" || Type === "View" ? true : false,
        Validations: [],
        additionalData: {

        },
      },
      {
        name: "Depositedin",
        label: "Deposited in",
        placeholder: "Deposited in",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: Type == "Acknowledge" || Type === "View" ? true : false,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Deposited is required"
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
        name: "Depositedon",
        label: "Deposited on",
        placeholder: "Deposited on",
        type: "date",
        value: Type === "View" ? FormValues?.dDT : "",
        generatecontrol: Type == "Acknowledge" || Type === "View" ? true : false,
        disable: false,
        Validations: [],
        additionalData: {

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
