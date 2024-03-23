import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class loadingControl {
    private loadingSheetControlArray: FormControls[];
    constructor() {
        this.loadingSheetControlArray =
         [
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
                type: 'dropdown',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'loadVehicleDetails'
                },
                disable: false
            },
            {
                name: "vehicleType",
                label: "Vehicle Type",
                placeholder: "VehicleType",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ],
                functions: { },
                additionalData: {}
            },
            {
                name: "transMode",
                label: "Transport Mode",
                placeholder: "Transport Mode",
                type: "Staticdropdown",
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable:false,
                Validations: [{
                    name: "required",
                    message: "Transport Mode is required",
                }],
                functions: {
                },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
            },
            {
                name: "tripID",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: 'System Generated',
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
                name: 'Capacity',
                label: 'Capacity(In Tons)',
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
                label: 'Weight Utilization (%)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'VolumeUtilization',
                label: 'Volume Utilization (%)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'vehicleTypeCode',
                label: 'Vehicle Type Code',
                placeholder: '',
                type: '',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            }
        ];
    }
    getMarkArrivalsertFormControls() {
        return this.loadingSheetControlArray;
    }

}