import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralMaster } from "src/app/core/models/Masters/general-master";

export class GeneralMasterControl {
  generalControlArray: FormControls[];
  constructor(generalTable: GeneralMaster, IsUpdate: boolean) {
    this.generalControlArray = [
      {
        name: 'codeId', label: "Code ID",
        placeholder: "",
        type: 'text',
        value: IsUpdate ? generalTable.codeId : "System Generated",
        generatecontrol: true, disable: true,
        Validations: [
          {
            name: "required",
            message: "Group Code is required"
          },
        ]
      },
      {
        name: 'codeDesc', label: "Code Description",
        placeholder: "Enter Code Description",
        type: 'text',
        value: generalTable.codeDesc,
        generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Code Description is required"
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 1 to 50 characters",
            pattern: '^[a-zA-Z0-9 ()\\.\-]{1,50}$',
          }
        ]
      },

      {
        name: 'activeFlag',
        label: 'Active Flag',
        placeholder: 'Active',
        type: 'toggle',
        value: generalTable.activeFlag,
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: '_id',
        label: '',
        placeholder: '',
        type: 'text',
        value: generalTable._id,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: 'codeType',
        label: '',
        placeholder: '',
        type: 'text',
        value: generalTable.codeType,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: 'entryBy',
        label: 'Entry By',
        placeholder: 'Entry By',
        type: 'text',
        value: localStorage.getItem("Username"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'entryDate',
        label: 'Entry Date',
        placeholder: 'Select Entry Date',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
    ]
  }
  getFormControls() {
    return this.generalControlArray;
  }

}