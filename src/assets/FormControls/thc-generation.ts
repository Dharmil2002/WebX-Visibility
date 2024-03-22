import { FormControls } from "src/app/Models/FormControl/formcontrol";
const today = new Date();
today.setHours(23, 59, 59, 999); // Set the time to the end of the day
let maxDate = today;
const yesterday = new Date(today); // Create a new date object with the current date and time
yesterday.setDate(today.getDate() - 1); // Set the date to one day before
// Set the time to the end of the day (23:59:59:999)
yesterday.setHours(23, 59, 59, 999);
let minDate = yesterday; // Now, maxDate holds the date for yesterday at the end of the day
export class thcControl {
    private thcControlArray: FormControls[];
    private vehicleDetails: FormControls[];
    private rakeDetails: FormControls[];
    private charges: FormControls[];
    constructor(update: boolean, view: boolean, prq: boolean) {

        this.thcControlArray =
            [
                {
                    name: "tripId",
                    label: "Trip ID",
                    placeholder: '',
                    type: "text",
                    value: 'System Generated',
                    Validations: [],
                    generatecontrol: true, disable: view ? view : true,
                    additionalData: {
                        metaData: "Basic"
                    }
                },
                {
                    name: "tripDate",
                    label: 'Trip Date',
                    placeholder: 'Trip Date',
                    type: "datetimerpicker",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                        {
                            name: "required",
                            message: "Trip Date is required",
                        },
                    ],
                    functions: {
                        onDate: "changeEta"
                    },
                    additionalData: {
                        maxDate: maxDate,
                        metaData: "Basic"
                    },
                },
                {
                    name: 'prqNo',
                    label: 'PRQ NO',
                    placeholder: '',
                    type: 'dropdown',
                    value: '',
                    Validations: [
                        {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "autocomplete",
                        },
                    ],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"

                    },
                    functions: {
                        onOptionSelect: 'getShipmentDetails',
                        onModel: "prqNoChangedEvent",
                    },
                    disable: view ? view : prq ? prq : update
                },
                {
                    name: "fromCity",
                    label: "From City",
                    placeholder: "From City",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: [
                        {
                            name: "required",
                            message: "From City is required",
                        },
                        {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "autocomplete",
                        },
                    ],
                    functions: {
                        onOptionSelect: 'getLocBasedOnCity'
                    },
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    },
                },
                {
                    name: "toCity",
                    label: "To City",
                    placeholder: "To City",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : prq ? prq : update,
                    Validations: [
                        {
                            name: "required",
                            message: "To City is required",
                        },
                        {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "autocomplete",
                        },
                    ],
                    functions: {
                        onModel: "getPincodeDetail",
                        onOptionSelect: 'getLocBasedOnCity'
                    },
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    },
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
                    disable: view ? view : prq ? prq : update,
                    Validations: [{
                        name: "required",
                        message: "Transport Mode is required",
                    }],
                    functions: {
                        onSelection: "transModeChanged"
                    },
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    },
                },
                {
                    name: 'via', label: "Via", placeholder: "Multiselect via", type: view ||update ?'text':'multiselect',
                    value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: view ? view :update?update:false,
                    Validations: [
                    ],
                    functions: {
                        onModel: "getCityDetail",
                        onSelect: "onSelectViaLocation"
                    },
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "viaControlHandler",
                        showNameAndValue: false,
                        metaData: "Basic"

                    },
                },
                {
                    name: 'route',
                    label: 'Route',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: true, disable: true,
                    additionalData: {
                        metaData: "Basic"
                    }

                },

                {
                    name: "vendorType",
                    label: "Vendor Type",
                    placeholder: "Vendor Type",
                    type: 'Staticdropdown',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : prq ? prq : update,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Type  is required",
                        }],
                    functions: {
                        onSelection: "vendorFieldChanged"
                    },
                    additionalData: { metaData: "Basic" }
                },
                {
                    name: "vendorName",
                    label: "Vendor Name",
                    placeholder: "Vendor Name",
                    type: view ? 'text' : 'dropdown',
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : prq ? prq : update,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Name  is required",
                        }],
                    functions: {
                        onOptionSelect: 'vendorBasedVehicle',
                    },
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    }
                },
                {
                    name: "panNo",
                    label: "Vendor PAN Number",
                    placeholder: "Vendor PAN Number",
                    type: "text",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                        {
                            name: "required",
                            message: "PAN Number  is required",
                        },
                        {
                            name: "pattern",
                            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
                            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
                        },],
                    functions: {},
                    additionalData: { metaData: "Basic" }
                },
                {
                    name: "venMobNo",
                    label: "Vendor Mobile Number",
                    placeholder: "Vendor Mobile Number",
                    type: "mobile-number",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Mobile  is required",
                        }
                    ],
                    functions: {},
                    additionalData: { metaData: "Basic" }
                },
                {
                    name: "brokerName",
                    label: "Broker Name",
                    placeholder: "Broker Name",
                    type: "text",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                        {
                            "name": "pattern",
                            "pattern": "^[A-Za-z ]{1,15}$",
                            "message": "Please enter up to 15 alphabetical characters only"
                        }
                    ],
                    functions: {},
                    additionalData: { metaData: "Basic" }
                },
                {
                    name: "brokerMobile",
                    label: "Broker Contact Number",
                    placeholder: "Broker Contact Number",
                    type: "mobile-number",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                    ],
                    functions: {},
                    additionalData: { metaData: "Basic" }
                },

                // {
                //     name: 'closingBranch',
                //     label: 'Closing Branch',
                //     placeholder: '',
                //     type: 'dropdown',
                //     value: '',
                //     additionalData: {
                //         showNameAndValue: true,
                //         metaData: "Basic"
                //     },
                //     Validations: [{
                //         name: "required",
                //         message: "Closing Branch  is required",
                //     },
                //     {
                //         name: "invalidAutocompleteObject",
                //         message: "Choose proper value",
                //     },
                //     {
                //         name: "autocomplete",
                //     },
                //     ],
                //     generatecontrol: true,
                //     disable: view ? view : update
                // },
                {
                    name: 'IsEmpty',
                    label: 'Is Empty',
                    placeholder: '',
                    type: 'toggle',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    disable: false,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    },
                    functions: {
                        onChange: 'onchangeIsEmptyFlag'
                    },
                },
                {
                    name: 'containerwise',
                    label: 'Container Wise',
                    placeholder: '',
                    type: 'toggle',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    disable: false,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    },
                    functions: {
                        onChange: 'onchangecontainerwise'
                    },
                },
                {
                    name: 'tdsUpload',
                    label: 'TDS Declaration',
                    placeholder: '',
                    type: 'file',
                    value: '',
                    Validations: [],
                    additionalData: {
                        multiple: true,
                        metaData: "Basic"
                    },
                    functions: {
                        onChange: 'GetFileList',
                    },
                    generatecontrol: true,
                    disable: view ? view : update ? update : false
                },
                {
                    name: "etaDate",
                    label: 'ETA Date',
                    placeholder: 'ETA Date',
                    type: "datetimerpicker",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update ? update : false,
                    Validations: [
                        {
                            name: "required",
                            message: "ETA Date is required",
                        },
                    ],
                    additionalData: {
                        minDate: maxDate,
                        metaData: "Basic"
                    },
                },
                {
                    name: "viaControlHandler",
                    label: "Multi Via Location",
                    placeholder: "Multi Via Location",
                    type: "",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: false,
                    disable: false,
                    Validations: [

                    ],
                    functions: {
                        onToggleAll: 'toggleSelectAll',
                    },
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    }
                },
                {
                    name: 'driverName',
                    label: 'Driver Name',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [
                        {
                            name: "required",
                            message: "Driver Name  is required",
                        }],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "driver"
                    },
                    functions: {
                        onOptionSelect: ''
                    },
                    disable: view ? view : update ? update : false
                },
                {
                    name: 'driverLno',
                    label: 'Driver License No',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [
                        {
                            name: "required",
                            message: "Driver License No is required"
                        }],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "driver"
                    },
                    functions: {
                        onOptionSelect: ''
                    },
                    disable: view ? view : update ? update : false
                },
                {
                    name: 'driverLexd',
                    label: 'Driver License Expiry Date',
                    placeholder: '',
                    type: 'date',
                    value: '',
                    Validations: [
                        {
                            name: "required",
                            message: "Driver License Expiry Date is required",
                        }],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "driver"
                    },
                    functions: {
                        onOptionSelect: ''
                    },
                    disable: view ? view : update ? update : false
                },
                {
                    name: 'driverMno',
                    label: 'Driver Mobile No',
                    placeholder: '',
                    type: 'mobile-number',
                    value: '',
                    Validations: [
                        {
                            name: "required",
                            message: "Driver Mobile No is required",
                        }],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "driver"
                    },
                    functions: {
                        onOptionSelect: ''
                    },
                    disable: view ? view : update ? update : false
                },
                {
                    name: "ArrivalDate",
                    label: 'Arrival Date',
                    placeholder: 'Arrival Date',
                    type: "datetimerpicker",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view : update,
                    Validations: [
                        {
                            name: "required",
                            message: "Arrival Date is required",
                        },
                    ],
                    additionalData: {
                        minDate: maxDate,
                        metaData: "ArrivalInfo"
                    },
                },
                {
                    name: 'ArrivalSealNo',
                    label: 'Arrival Seal No',
                    placeholder: 'Arrival Seal No',
                    type: 'number',
                    value: "",
                    Validations: [
                        {
                            name: "required",
                            message: "Arrival Seal No is required",
                        },
                    ],
                    additionalData: {
                        metaData: "ArrivalInfo"
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'Arrivalendkm',
                    label: 'Arrival End KM',
                    placeholder: 'Arrival End KM',
                    type: 'number',
                    value: "",
                    Validations: [{
                        name: "required",
                        message: "Arrival End KM is required",
                    },],
                    additionalData: {
                        metaData: "ArrivalInfo"
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'Arrivalremarks',
                    label: 'Arrival Remarks',
                    placeholder: 'Arrival Remarks',
                    type: 'text',
                    value: "",
                    Validations: [{
                        name: "required",
                        message: "Arrival Remarks is required",
                    },],
                    additionalData: {
                        metaData: "ArrivalInfo"
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'ArrivalBy',
                    label: 'Arrival By',
                    placeholder: 'Arrival By',
                    type: 'text',
                    value: localStorage.getItem("UserName"),
                    Validations: [],
                    additionalData: {
                        metaData: "ArrivalInfo"
                    },
                    generatecontrol: true, disable: true
                },
                {
                    name: 'capacity',
                    label: 'Capacity(In Tons)',
                    placeholder: '',
                    type: 'mobile-number',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    additionalData: {
                        metaData: "vehLoad"
                    },
                    disable: true
                },
                {
                    name: 'loadedKg',
                    label: 'Loaded Kg',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    additionalData: {
                        metaData: "vehLoad"
                    },
                    disable: view ? view : true
                },
                {
                    name: 'weightUtilization',
                    label: 'Weight Utilization (%)',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    additionalData: {
                        metaData: "vehLoad"
                    },
                    disable: true
                },

                {
                    name: 'overload',
                    label: 'Overload',
                    placeholder: '',
                    type: 'toggle',
                    value: '',
                    Validations: [],
                    generatecontrol: true,
                    disable: view ? view : true
                },
                {
                    name: 'arrivalTime',
                    label: 'Arrival Time',
                    placeholder: '',
                    type: 'time',
                    value: '',
                    Validations: [],
                    generatecontrol: update, disable: view ? view : update
                },
                {
                    name: 'podUpload',
                    label: 'POD Upload',
                    placeholder: '',
                    type: 'file',
                    value: '',
                    Validations: [],
                    additionalData: {
                        multiple: true
                    },
                    functions: {
                        onChange: 'GetFileList',
                    },
                    generatecontrol: update,
                    disable: view ? view : false
                },
                {
                    name: 'remarks',
                    label: 'Remarks',
                    placeholder: '',
                    type: 'textarea',
                    value: '',
                    Validations: [],
                    generatecontrol: update, disable: view ? view : false
                },
                {
                    name: 'receivedBy',
                    label: 'Received By',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: update, disable: false
                },
                {
                    name: 'docket',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: '',
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'status',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: '1',
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'companyCode',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: localStorage.getItem("companyCode"),
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'updateBy',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: localStorage.getItem("UserName"),
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'branch',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: localStorage.getItem("Branch"),
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'updateDate',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: new Date(),
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'podDetail',
                    label: '',
                    placeholder: '',
                    type: '',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    generatecontrol: false,
                    disable: true
                },
                {
                    name: 'billingParty',
                    label: 'billingParty',
                    placeholder: 'billingParty',
                    type: 'text',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: true
                },
                {
                    name: 'docketNumber',
                    label: 'Docket Number',
                    placeholder: 'Docket Number',
                    type: 'text',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: true
                },
                {
                    name: 'actualWeight',
                    label: 'Actual Weight',
                    placeholder: 'Actual Weight',
                    type: 'number',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: false
                },
                {
                    name: 'noofPkts',
                    label: 'No Of Package',
                    placeholder: 'No Of Package',
                    type: 'number',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: false
                },
                {
                    name: 'pendingPackages',
                    label: 'pending No Of Package',
                    placeholder: 'pending No Of Package',
                    type: 'number',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: false
                }
                , {
                    name: 'pendingActWeight',
                    label: 'pending Actual Weight',
                    placeholder: 'pending Actual Weight',
                    type: 'number',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "shipment_detail"
                    },
                    generatecontrol: true,
                    disable: false
                },
                {
                    name: "vendorCode",
                    label: "Vendor Code",
                    placeholder: "Vendor Code",
                    type: '',
                    value: "8888",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: [],
                    functions: {},
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    }
                },
                // {
                //     name: "insuranceExpiryDate",
                //     label: "insuranceExpiryDate",
                //     placeholder: "insuranceExpiryDate",
                //     type: '',
                //     value: "",
                //     filterOptions: "",
                //     autocomplete: "",
                //     displaywith: "",
                //     generatecontrol: true,
                //     disable: true,
                //     Validations: [],
                //     functions: {},
                //     additionalData: {
                //         showNameAndValue: false,
                //         metaData: "Basic"
                //     }
                // },
                // {
                //     name: "fitnessValidityDate",
                //     label: "fitnessValidityDate",
                //     placeholder: "fitnessValidityDate",
                //     type: '',
                //     value: "",
                //     filterOptions: "",
                //     autocomplete: "",
                //     displaywith: "",
                //     generatecontrol: true,
                //     disable: true,
                //     Validations: [],
                //     functions: {},
                //     additionalData: {
                //         showNameAndValue: false,
                //         metaData: "Basic"
                //     }
                // },
                {
                    name: 'closingBranch',
                    label: 'Closing Branch',
                    placeholder: '',
                    type: '',
                    value: '',
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    Validations: [],
                    generatecontrol: true,
                    disable: true
                },
            ];
        this.vehicleDetails = [
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: view ? 'text' : 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle  is required",
                    }],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
                functions: {
                    onOptionSelect: 'getVehicleDetail',
                },
                disable: view ? view : update ? update : false
            },
            {
                name: "vehSize",
                label: "Vehicle Size (MT)",
                placeholder: "Vehicle Size",
                type: "Staticdropdown",
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: view ? view : update ? update : false,
                functions: {
                    onSelection: "getSize"
                },
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Size is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
            },
            {
                name: "chasisNo",
                label: "Chasis Number",
                placeholder: "Chasis Number",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: view ? view : update ? update : false,
                Validations: [
                    {
                        name: "required",
                        message: "Chasis Number is required",
                    }
                ],
                functions: {},
                additionalData: { metaData: "Basic" }
            },
            {
                name: "engineNo",
                label: "Engine Number",
                placeholder: "Engine Number",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: view ? view : update ? update : false,
                Validations: [
                    {
                        name: "required",
                        message: "Engine Number  is required",
                    }
                ],
                functions: {},
                additionalData: { metaData: "Basic" }
            },
            {
                name: 'inExdt', label: "Insurance Expiry Date", placeholder: "Enter Insurance Expiry Date",
                type: 'date', value: "", generatecontrol: true, disable: view ? view : update ? update : false,
                Validations: [
                    {
                        name: "required",
                        message: "Insurance Expiry Date is required"
                    },
                ],
                additionalData: {
                    minDate: new Date(), // Set the minimum date to the current date
                    maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
                }
            },

            {
                name: 'fitdt', label: "Fitness Validity Date", placeholder: "", type: 'date',
                value: "", generatecontrol: true, disable: view ? view : update ? update : false,
                Validations: [
                    {
                        name: "required",
                        message: "Fitness Validity Date is required"
                    },
                ],
                additionalData: {
                    minDate: new Date(), // Set the minimum date to the current date
                    maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
                }
            },
            {
                name: 'vendCode',
                label: 'vendCode',
                placeholder: 'vendCode',
                type: '',
                value: "",
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'vendor', label: "Vendor Name", placeholder: "Vendor Name", type: '',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
                Validations: [
                ],
            },
            {
                name: 'companyCode', label: "Company Code", placeholder: "Company Code", type: '',
                value: localStorage.getItem("companyCode"), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
                Validations: [
                ],
            },
            {
                name: '_id', label: "_id", placeholder: "_id", type: '',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
                Validations: [
                ],
            },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: 'text',
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryDate',
                label: 'Entry Date',
                placeholder: 'Entry Date',
                type: 'text',
                value: new Date(),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'vehNo',
                label: 'Vehicle No',
                placeholder: 'Vehicle No',
                type: '',
                value: "",
                Validations: [],
                generatecontrol: false, disable: false
            },
        ]
        this.rakeDetails = [
            {
                name: "rakeNumber",
                label: "Rake Number",
                placeholder: "Rake Number",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "Rake Number is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeForm"
                },
            },
            {
                name: 'rakeDate', label: 'Rake Date', placeholder: 'Rake Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
                generatecontrol: true, disable: view ? view : update?update:false, Validations: [{
                    name: "required",
                    message: "Rake Date is required",
                }],
                additionalData: {
                    maxDate: new Date(),
                    metaData: "rakeForm"
                },
            },
            {
                name: "fnrNo",
                label: "FNR No",
                placeholder: "FNR No",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "FNR No is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeForm"
                },
            },
            {
                name: "noOfContrainer",
                label: "No. of Container",
                placeholder: "No. of Container",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "RR No is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeForm"
                },
            },
            {
                name: "rrNo",
                label: "RR No",
                placeholder: "Enter RR No",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "RR No is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeArray"
                },
            },
            {
                name: 'rrDate', label: 'RR Date', placeholder: 'RR Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
                generatecontrol: true, disable: view ? view : update?update:false, Validations: [{
                    name: "required",
                    message: "RR Date is required",
                }],
                additionalData: {
                    maxDate: new Date(),
                    metaData: "rakeArray"
                },
            },
            {
                name: "invNo",
                label: "Invoice No.",
                placeholder: "Invoice No.",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "Invoice No is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeInvoice"
                },
            },
            {
                name: 'invDt', label: 'Invoice Date', placeholder: 'Invoice Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
                generatecontrol: true, disable: view ? view : update?update:false, Validations: [{
                    name: "required",
                    message: "RR Date is required",
                }],
                additionalData: {
                    maxDate: new Date(),
                    metaData: "rakeInvoice"
                },
            },
            {
                name: "invAmt",
                label: "Invoice Amount",
                placeholder: "Invoice Amount",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: view ? view : update?update:false,
                Validations: [
                    {
                        name: "required",
                        message: "Invoice No is required",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "rakeInvoice"
                },
            },
        ]
        this.charges = [{
            name: 'contAmt',
            label: 'Vendor Contract  Amount(₹)',
            placeholder: '',
            type: 'text',
            value: 0,
            Validations: [],
            functions: {
                onChange: 'calucatedCharges'
            },
            generatecontrol: true,
            additionalData: {
                metaData: "vehLoad"
            },
            disable: view ? view : update
        },
        {
            name: 'totAmt',
            label: 'Total Amount(₹)',
            placeholder: '',
            type: 'text',
            value: 0,
            Validations: [],
            functions: {
                onChange: 'onCalculateTotal'
            },
            generatecontrol: true,
            additionalData: {
                metaData: "vehLoad"
            },
            disable: true
        },
        {
            name: 'advAmt',
            label: 'Advance Amount(₹)',
            placeholder: '',
            type: 'text',
            value: 0,
            Validations: [],
            functions: {
                onChange: 'onCalculateTotal'
            },
            generatecontrol: true,
            additionalData: {
                metaData: "vehLoad"
            },
            disable: view ? view : update
        },
        {
            name: 'advPdAt',
            label: 'Advance Payable At',
            placeholder: '',
            type: 'dropdown',
            value: '',
            additionalData: {
                showNameAndValue: true,
                metaData: "vehLoad"
            },
            Validations: [{
                name: "required",
                message: "Advance Paid At  is required",
            }],
            generatecontrol: true,
            disable: view ? view : update
        },
        {
            name: 'balAmt',
            label: 'Balance Amount(₹)',
            placeholder: '',
            type: 'text',
            value: 0,
            functions: {
                onChange: 'onCalculateTotal'
            },
            Validations: [],
            generatecontrol: true,
            additionalData: {
                metaData: "vehLoad"
            },
            disable: true
        },
        {
            name: 'balAmtAt',
            label: 'Balance Payable At',
            placeholder: '',
            type: 'dropdown',
            value: '',
            additionalData: {
                showNameAndValue: true,
                metaData: "vehLoad"
            },
            Validations: [{
                name: "required",
                message: "Balance Paid At is required",
            }],
            generatecontrol: true,
            disable: view ? view : update
        }]
    }
    getThcFormControls() {
        return this.thcControlArray;
    }
    getVehicleDetails() {
        return this.vehicleDetails
    }
    getChargesControls() {
        return this.charges
    }
    getRakeDetailsControls() {
        return this.rakeDetails;
    }
}