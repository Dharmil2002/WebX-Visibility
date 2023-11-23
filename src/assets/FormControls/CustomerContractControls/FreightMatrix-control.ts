import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractFreightMatrixControl {
  private ContractFreightMatrixControlArray: FormControls[];
  constructor( UpdateData ,isUpdate) {
    this.ContractFreightMatrixControlArray = [

      {
        name: "From",
        label: "From",
        placeholder: "From",
        type: "dropdown",
        value: isUpdate?{
          name:UpdateData.from,
          value:UpdateData.fromType,
        }: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {},
        functions: {

          onModel: 'SetOptions',
          onSelect: "setSelectedOptions"
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
        value: isUpdate?{
          name:UpdateData.to,
          value:UpdateData.toType,
        }: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "ToHandler",
          showNameAndValue: false,

        },
        functions: {

          onModel: 'SetOptions',
          onSelect: "setSelectedOptions"
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
        value:"",
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
        label: "Rate",
        placeholder: "Rate",
        type: "text",
        value: isUpdate?UpdateData.rT:"",
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
    ];
  }
  getContractFreightMatrixControlControls(CurrentAccess: string[]) {
    // this.ContractFreightMatrixControlArray = this.ContractFreightMatrixControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractFreightMatrixControlArray;
  }
}
