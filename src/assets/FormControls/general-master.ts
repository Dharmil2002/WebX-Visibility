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
                value: IsUpdate? generalTable.codeId:"System Generated", 
                generatecontrol: true, disable: true,
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
                ]
            },
            {
                name: 'codeDesc', label: "Code Description", 
                placeholder: "Enter Group Name", 
                type: 'text', 
                value: generalTable.codeDesc, 
                generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "Group Name is required"
                  },
                  {
                    name: "pattern",
                    message: "Please Enter only text of length 3 to 50 characters",
                    pattern: '^[a-zA-Z ]{3,50}$',
                }
                ]
            },
            
            {
              name: 'activeFlag', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: generalTable.activeFlag, generatecontrol: true, disable: false,
              Validations: []
            },
            {
              name: 'id',
              label: '',
              placeholder: '',
              type: 'text',
              value: generalTable.id,
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
        return this.generalControlArray;
    }

}