import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class thcControl {
    private thcControlArray: FormControls[];
    constructor(update: boolean, view: boolean,prq:boolean) {

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
                    name: 'route',
                    label: 'Route',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: true, disable: view ? view :  prq?prq:false,
                    additionalData: {
                        metaData: "Basic"
                    }

                },
                {
                    name: 'prqNo',
                    label: 'PRQ NO',
                    placeholder: '',
                    type: 'dropdown',
                    value: '',
                    Validations: [
                    ],
                    generatecontrol: true,
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"

                    },
                    functions: {
                        onOptionSelect: 'getShipmentDetails'
                    },
                    disable: view ? view :  prq?prq:update
                },
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
                        onOptionSelect: 'getVehicleDetail'
                    },
                    disable: view ? view : prq?prq:false
                },
                {
                    name: "vendorType",
                    label: "Vendor Type",
                    placeholder: "Vendor Type",
                    type: view ? 'text' : 'Staticdropdown',
                    value: [
                        { value: "Own", name: "Own" },
                        { value: "Attached", name: "Attached" },
                        { value: "Rail", name: "Rail" },
                        { value: "Market", name: "Market" },
                        { value: "Service Provider", name: "Service Provider" }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view :  prq?prq:false,
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
                    disable: view ? view :  prq?prq:update,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Name  is required",
                        }],
                    functions: {},
                    additionalData: {
                        showNameAndValue: false,
                        metaData: "Basic"
                    }
                },
                {
                    name: "panNo",
                    label: "PAN Number",
                    placeholder: "PAN Number",
                    type: "text",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: view ? view :  prq?prq:update,
                    Validations: [
                        {
                            name: "required",
                            message: "PAN Number  is required",
                        }],
                    functions: {},
                    additionalData: { metaData: "Basic" }
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
                    disable: prq?prq:false,
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
                    name: 'closingBranch',
                    label: 'Closing Branch',
                    placeholder: '',
                    type: 'dropdown',
                    value: '',
                    additionalData: {
                        showNameAndValue: true,
                        metaData: "Basic"
                    },
                    Validations: [{
                        name: "required",
                        message: "Closing Branch  is required",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                    ],
                    generatecontrol: true,
                    disable: view ? view : update
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
                    disable: view ? view :  prq?prq:update
                },
                {
                    name: 'driverMno',
                    label: 'Driver Mobile No',
                    placeholder: '',
                    type: 'number',
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
                    disable: view ? view :  prq?prq:update
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
                    disable: view ? view :  prq?prq:update
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
                    disable: view ? view :  prq?prq:update
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
                    name: 'contAmt',
                    label: 'Vendor Contract  Amount(₹)',
                    placeholder: '',
                    type: 'text',
                    value: '',
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
                    name: 'advAmt',
                    label: 'Advance Amount(₹)',
                    placeholder: '',
                    type: 'text',
                    value: '',
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
                    name: 'balAmt',
                    label: 'Balance Amount(₹)',
                    placeholder: '',
                    type: 'text',
                    value: '',
                    functions: {
                        onChange: 'onCalculateTotal'
                    },
                    Validations: [],
                    generatecontrol: true,
                    additionalData: {
                        metaData: "vehLoad"
                    },
                    disable: view ? view : update
                },
                {
                    name: 'advPdAt',
                    label: 'Advance Paid At',
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
                    name: 'balAmtAt',
                    label: 'Balance Paid At',
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
                }


            ];
    }
    getThcFormControls() {
        return this.thcControlArray;
    }

}