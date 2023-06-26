import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { StateMaster } from "src/app/core/models/Masters/State Master/StateMaster";

export class StateControl {
    StateControlArray: FormControls[];
    constructor(StateTabledata: StateMaster, IsUpdate: boolean) {
        this.StateControlArray = [
            {
                name: 'stateCode',
                label: 'State Code',
                placeholder: 'State Code',
                type: 'text',
                value: IsUpdate ? StateTabledata.stateCode : "System Generated",
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },{
                name: 'stateName', label: "State Name", 
                placeholder: "Enter State Name", 
                type: 'text', 
                value: StateTabledata.stateName, 
                generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "State Name is required"
                  },
                  {
                    name: "pattern",
                    message: "Please Enter only text",
                    pattern: '^[a-zA-Z ]*$'
                  }
                ]
            },{
                name: 'stateType',
                label: 'State Type',
                placeholder: 'State Type',
                type: 'Staticdropdown',
                value: [
                  { value: 'ST', name: 'State' },
                  { value: 'UT', name: ' Union Territory' }
                ],
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [
                  {
                    name: "required"
                  }
                ],
                generatecontrol: true,
                disable: false
            },{
                name: 'stateAlias', label: "State Alias", placeholder: "Enter StateAlias", type: 'text', 
                value: StateTabledata.stateAlias, generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "State Code is required"
                  },
                  {
                    name: "pattern",
                    message: "Please Enter only text",
                    pattern: '^[a-zA-Z ]{0,5}$'
                  }
                ],
            },{
                name: 'Country', label: "Country", placeholder: "Select Country", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "Country is required.."
                  },
                  {
                    name: "autocomplete",
                  },
                  {
                    name: "invalidAutocomplete",
                    message: "Choose proper value",
                  }
                ],
                additionalData: {
                  showNameAndValue: false
                }
            },
            {
                name: 'GSTWiseStateCode',
                label: 'GST Wise State Code',
                placeholder: 'State Code',
                type: 'text',
                value: StateTabledata.GSTWiseStateCode,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [{
                    name: "required",
                    message: "GST Wise State Code is required.."
                  }],
                generatecontrol: true,
                disable: false
            },
            {
              name: 'activeflag', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: StateTabledata.isActive, generatecontrol: true, disable: false,
              Validations: []
            }
        ]
    }
    getFormControls() {
        return this.StateControlArray;
    }

}