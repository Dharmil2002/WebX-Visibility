import moment from "moment";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractFreightMatrixControl {
  private ContractFreightMatrixControlArray: FormControls[];
  constructor(UpdateData, isUpdate) {
    this.ContractFreightMatrixControlArray = [

      {
        name: "From",
        label: "From",
        placeholder: "From",
        type: "dropdown",
        value: isUpdate ? {
          name: UpdateData.fROM,
          value: UpdateData.fTYPE,
        } : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "From is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {},
        functions: {
          onModel: 'SetOptions',
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "To",
        label: "To",
        placeholder: "To",
        type: "dropdown",
        value: isUpdate ? {
          name: UpdateData.tO,
          value: UpdateData.tTYPE,
        } : "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "To is required",
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
          isIndeterminate: false,
          isChecked: false,
          support: "ToHandler",
          showNameAndValue: false,

        },
        functions: {
          onModel: 'SetOptions',
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
        generatecontrol: true,
        disable: false,
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
        functions: {},
      },
      {
        name: "capacity",
        label: "Capacity",
        placeholder: "Capacity",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Capacity is required",
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
        functions: {},
      },
      {
        name: "Rate",
        label: "Rate (₹)",
        placeholder: "Rate (₹)",
        type: "number",
        value: isUpdate ? UpdateData.rT : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{1,8}(?:\.[0-9]{1,2})?$",
            message: "Please enter a valid Rate EX. (100000.00)",
          },
        ],
      },
      {
        name: "ValidFromDate",
        label: "Valid From Date",
        placeholder: "Valid From Date",
        type: "date",
        value: isUpdate ? moment(UpdateData.vFDT, 'DD-MM-YYYY').toDate() : "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Valid From Date is required",
        },],
        additionalData: {
          minDate: new Date(),
          maxDate: new Date()

        },
        functions: {
          // onDate: "onContractStartDateChanged",
        },
      },
      {
        name: "ValidToDate",
        label: "Valid To Date",
        placeholder: "Valid To Date",
        type: "date",
        value: isUpdate ? moment(UpdateData.vEDT, 'DD-MM-YYYY').toDate() : "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Valid To Date is required",
        },],
        additionalData: {
          minDate: new Date(),
          maxDate: new Date()
        },
        functions: {
          // onDate: "onContractStartDateChanged",
        },
      },
    ];
  }
  getContractFreightMatrixControlControls(CurrentAccess: string[]) {
    // this.ContractFreightMatrixControlArray = this.ContractFreightMatrixControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractFreightMatrixControlArray;
  }
}
