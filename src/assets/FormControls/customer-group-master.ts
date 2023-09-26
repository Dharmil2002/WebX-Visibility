import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";

export class CustomerGroupControl {
  customerGroupControlArray: FormControls[];
  constructor(customerGroupTable: CustomerGroupMaster, isUpdate: boolean) {
    this.customerGroupControlArray = [
      {
        name: 'groupCode', label: "Group Code",
        placeholder: "Enter Group Code",
        type: 'text',
        value: customerGroupTable.groupCode,
        generatecontrol: true, disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Group Code is required"
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Group Code of length 4 to 10",
            pattern: '^[a-zA-Z0-9]{4,10}$',
          }
        ],
        functions: {
          onChange: "checkGroupCodeExists",
        },
      },


      {
        name: 'groupName', label: "Group Name",
        placeholder: "Enter Group Name",
        type: 'text',
        value: customerGroupTable.groupName,
        generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Group Name is required"
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 20 characters",
            pattern: '^[a-zA-Z ]{3,20}$',
          }


        ]
      },
      {
        name: 'groupPassword',
        label: "Group Password",
        placeholder: "Enter Group Password",
        type: 'password',
        value: customerGroupTable.groupPassword,
        generatecontrol: true, disable: false,
        Validations: [],
        additionalData: {
          inputType: "password",
        },
      },
      {
        name: 'activeFlag', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: customerGroupTable.activeFlag, generatecontrol: true, disable: false,
        Validations: []
      },
      {
        name: '_id',
        label: '',
        placeholder: '',
        type: 'text',
        value: customerGroupTable._id,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      }
    ]
  }
  getFormControls() {
    return this.customerGroupControlArray;
  }

}
