import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class disPatchControl {
    private disPatchFormFields: FormControls[];
    constructor() {
        this.disPatchFormFields =
            [     
                {
                    name: "vehiclelistcontrolHandler",
                    label: "vehiclelist",
                    placeholder: "vehiclelist",
                    type: "select",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Field is required.."
                        }
                    ],
                  functions: {
                    onChange: 'getVehicleData'
                    },
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "vehicle",
                        showNameAndValue: false
                    }
                },
                {
                    name: "AddWeightHandler",
                    label: "Add Weight",
                    placeholder: "Add Weight",
                    type: "multiselect",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: "required",
                        }
                        , {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        }
                        , {
                            name: "autocomplete",
                        }
                    ],
                    functions: {
                        onToggleAll: 'toggleSelectAll',
                        onChange: 'AddCostData'
                    },
                    additionalData: {
                        showNameAndValue: true,
                        isIndeterminate: false,
                        isChecked: false,
                        support: "AddWeight",
                    }
                },

                {
                    name: 'FreightCost', label: 'Freight Cost', placeholder: 'Freight Cost', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    }

                },
                {
                    name: 'Status', label: 'Status', placeholder: 'Status', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }

                },
                {
                    name: 'ScheduleArrival', label: 'Schedule Arrival/Reprting Time', placeholder: 'Schedule Arrival/Reprting Time', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }

                },
                {
                    name: 'VehicleCapacity', label: 'Vehicle Capacity', placeholder: 'Vehicle Capacity', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'LoadedCapacity', label: 'Loaded Capacity', placeholder: 'Loaded Capacity', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'FreeSpaceAvailable', label: 'Free Space Available', placeholder: 'Free Space Available', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'ScheduleDeparture', label: 'Schedule Departure', placeholder: 'Schedule Departure', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'ActualDeparture', label: 'Actual Departure', placeholder: 'Actual Departure', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'ActualArrival', label: 'Actual Arrival', placeholder: 'Actual Arrival', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'VendorName', label: 'Vendor Name', placeholder: 'Vendor Name', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                {
                    name: 'DriverName', label: 'Driver Name', placeholder: 'Driver Name', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    }
                    ,
                    additionalData:{
                        isVehicle:'true'
                    }

                },
                {
                    name: 'DriverMb', label: 'Driver Mb', placeholder: 'Driver Mb', type: 'text', value:'',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    functions: {
                        onKeyUp: '',
                    },
                    additionalData:{
                        isVehicle:'true'
                    }


                },
                
         
                //   ---------------Add support Controllers at last -----------------------
                {
                    name: "AddWeight", label: "", placeholder: "Add Weight", type: "", value: "", filterOptions: "", autocomplete: "", generatecontrol: false, disable: true, Validations: [
                        {
                            name: 'required',
                        }
                    ]
                },
                {
                    name: "vehicle", label: "", placeholder: "vehicle", type: "", value: "", filterOptions: "", autocomplete: "", generatecontrol: false, disable: true,
                    functions: {
                        onChange: 'getVehicleData'
                        },
                    Validations: [
                        {
                            name: "required",
                        }

                    ],
                    
                }
                
            ]

    }

    getFormControls() {
        return this.disPatchFormFields;
    }

}