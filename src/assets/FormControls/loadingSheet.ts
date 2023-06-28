import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class loadingControl {
    private loadingSheetControlArray: FormControls[];
    constructor() {
        this.loadingSheetControlArray = [
            {
                name: 'Route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        type: 'regex',
                        value: '^[A-Z0-9]{1,10}$',
                        message: 'Please enter a valid vehicle number.'
                    }
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: "vehicleTypecontrolHandler",
                label: "Vehicle Type",
                placeholder: "VehicleType",
                type: "select",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ],
                functions: {
                    onChange: 'vehicleTypeDataAutofill'
                },
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "vehicleType",
                    showNameAndValue: false
                }
            },
            {
                name: "tripID",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'LoadingLocation',
                label: 'Loading Location',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Expected",
                label: "Expected Departure",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'CapacityKg',
                label: 'Capacity Kg',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'CapacityVolumeCFT',
                label: 'Capacity Volume CFT',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'LoadedKg',
                label: 'Loaded Kg',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'LoadedvolumeCFT',
                label: 'Loaded volume CFT',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'LoadaddedKg',
                label: 'Load added Kg',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'VolumeaddedCFT',
                label: 'Volume added CFT',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'WeightUtilization',
                label: 'Weight Utilization',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'VolumeUtilization',
                label: 'Volume Utilization',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: "vehicleType", label: "", placeholder: "Vehicle Type", type: "", value: "", filterOptions: "", autocomplete: "", generatecontrol: false, disable: true,
                Validations: [
                    {
                        name: "required",
                    }

                ]
                
            },
        ];
    }
    getMarkArrivalsertFormControls() {
        return this.loadingSheetControlArray;
    }

}