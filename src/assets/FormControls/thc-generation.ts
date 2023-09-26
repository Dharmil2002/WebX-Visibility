import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class thcControl {
    private thcControlArray: FormControls[];
    constructor() {
        this.thcControlArray =
         [
            {
                name: 'route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
                
            },
            {
                name: 'prqNo',
                label: 'PRQ NO',
                placeholder: '',
                type: 'dropdown',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'getShipmentDetails'
                },
                disable: false
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
                    onOptionSelect: ''
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
                name: "tripId",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: 'System Generated',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'capacity',
                label: 'capacity(In Tons)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'loadedKg',
                label: 'Loaded Kg',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'loadaddedKg',
                label: 'Load added Kg',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'weightUtilization',
                label: 'Weight Utilization (%)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'docket',
                label: '',
                placeholder: '',
                type: '',
                value:'',
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: 'status',
                label: '',
                placeholder: '',
                type: '',
                value:'1',
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: 'companyCode',
                label: '',
                placeholder: '',
                type: '',
                value:localStorage.getItem("companyCode"),
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: 'updateBy',
                label: '',
                placeholder: '',
                type: '',
                value:localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: 'updateDate',
                label: '',
                placeholder: '',
                type: '',
                value:new Date(),
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: '',
                value:'',
                Validations: [],
                generatecontrol: false,
                disable: true
            }
           
           
        ];
    }
    getThcFormControls() {
        return this.thcControlArray;
    }

}