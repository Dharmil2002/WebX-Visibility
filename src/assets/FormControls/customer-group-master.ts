import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";

export class CustomerGroupControl {
    customerGroupControlArray: FormControls[];
    constructor(customerGroupTable: CustomerGroupMaster, IsUpdate: boolean) {
        this.customerGroupControlArray = [
            {
                name: 'groupCode', label: "Group Code", 
                placeholder: "Enter Group Code", 
                type: 'text', 
                value: customerGroupTable.groupCode, 
                generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "State Name is required"
                  },
                ]
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
                    message: "State Name is required"
                  },
                  
                ]
            },
            {
                name: 'groupPassword', label: "Group Password", 
                placeholder: "Enter Group Password", 
                type: 'text', 
                value: customerGroupTable.groupPassword, 
                generatecontrol: true, disable: false,
                Validations: [
                ]
            },
            {
              name: 'activeFlag', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: customerGroupTable.activeFlag, generatecontrol: true, disable: false,
              Validations: []
            },
            {
              name: 'id',
              label: '',
              placeholder: '',
              type: 'text',
              value: customerGroupTable.id,
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