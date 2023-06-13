import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RunSheetControl {
    private RunSheetControlArray: FormControls[];
    constructor() {
        this.RunSheetControlArray = [
            {
                name: 'RunSheetID',
                label: 'Run Sheet ID',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }, {
                name: 'Cluster',
                label: 'Cluster',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "Vehicle",
                label: "Vehicle",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'VehType',
                label: 'Vehicle Type',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Vendor",
                label: "Vendor",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'VenType',
                label: 'Vendor Type',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'CapacityKg',
                label: 'Capacity KG',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'CapVol',
                label: 'Capacity Volume CFT',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'LoadKg',
                label: 'Loaded KG',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'LoadVol',
                label: 'Loaded Volume CFT',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'WeightUti',
                label: 'Weight Utilization',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'VolUti',
                label: 'Volume Utilization',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'Pickup',
                label: 'Pickup',
                placeholder: '',
                type: 'toggle',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'Delivery',
                label: 'Delivery',
                placeholder: '',
                type: 'toggle',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
        ];
    }
    RunSheetFormControls() {
        return this.RunSheetControlArray;
    }

}