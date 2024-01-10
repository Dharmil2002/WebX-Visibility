import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";

export class CustomerGroupControl {
  customerGroupControlArray: FormControls[];
  constructor(customerGroupTable: CustomerGroupMaster, isUpdate: boolean) {
    this.customerGroupControlArray = [
      {
        name: 'groupCode', label: "Group Code",
        placeholder: "",
        type: 'text',
        value: isUpdate?customerGroupTable.groupCode:"System Generated",
        generatecontrol: true, disable: true,
        Validations: [],
        functions: {},
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
            message: "Please Enter only text of length 3 to 100 characters",
            pattern: '^[a-zA-Z 0-9]{3,100}$',
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
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: isUpdate ? customerGroupTable.activeFlag : false,
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Active Flag is required",
          },
        ],
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
      },
      {
        name: "companyCode",
        label: "Company Code",
        placeholder: "Company Code",
        type: "",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ]
  }
  getFormControls() {
    return this.customerGroupControlArray;
  }

}
