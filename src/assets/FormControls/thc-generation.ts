import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class thcControl {
    private thcControlArray: FormControls[];
    constructor(update:boolean,view:boolean) {
        this.thcControlArray =
         [
            {
                name: "tripId",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: 'System Generated',
                Validations: [],
                generatecontrol: true, disable:view?view:true
            },
            {
                name: 'route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable:view?view: true
                
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
                disable: view?view:update
            },
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: ''
                },
                disable:view?view: true
            },
            {
                name: "VendorType",
                label: "Vendor Type",
                placeholder: "VehicleType",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable:view?view: true,
                Validations: [
                ],
                functions: { },
                additionalData: {}
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                placeholder: "Vendor Name",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: view?view:update,
                Validations: [
                ],
                functions: { },
                additionalData: {}
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
                disable: view?view:update,
                Validations: [
                ],
                functions: { },
                additionalData: {}
            },
            {
                name: 'driverName',
                label: 'Driver Name',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: ''
                },
                disable:view?view: update
            },
            {
                name: 'driverMno',
                label: 'Driver Mobile No',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: ''
                },
                disable:view?view: update
            },
            {
                name: 'driverLno',
                label: 'Driver License No',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: ''
                },
                disable:view?view: update
            },
            {
                name: 'driverLexd',
                label: 'Driver License Expiry Date',
                placeholder: '',
                type: 'date',
                value: '',
                Validations: [],
                generatecontrol: true,
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: ''
                },
                disable:view?view: update
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
                disable:view?view: true
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
                name: 'contAmt',
                label: 'Contract Amount(Rs)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                functions:{
                    onModelChange:'onCalculateTotal'
                },
                generatecontrol: true,
                disable: view?view:update
            },
            {
                name: 'advAmt',
                label: 'Advance Amount(Rs)',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                functions:{
                    onModelChange:'onCalculateTotal'
                },
                generatecontrol: true,
                disable: view?view:update
            },
              {
                name: 'balAmt',
                label: 'Balance Amount(Rs)',
                placeholder: '',
                type: 'text',
                value:'',
                functions:{
                    onModelChange:'onCalculateTotal'
                },
                Validations: [],
                generatecontrol: true,
                disable:view?view: update
            },
            {
                name: 'advPdAt',
                label: 'Advance Paid At',
                placeholder: '',
                type: 'dropdown',
                value:'',
                additionalData: {
                    showNameAndValue: true
                },
                Validations: [],
                generatecontrol: true,
                disable:view?view: update
            },
            {
                name: 'balAmtAt',
                label: 'Balance Paid At',
                placeholder: '',
                type: 'dropdown',
                value:'',
                additionalData: {
                    showNameAndValue: true
                },
                Validations: [],
                generatecontrol: true,
                disable:view?view: update
            },
            {
                name: 'overload',
                label: 'Overload',
                placeholder: '',
                type: 'toggle',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable:view?view: true
            },
            {
                name: 'arrivalTime',
                label: 'Arrival Time',
                placeholder: '',
                type: 'time',
                value: '',
                Validations: [],
                generatecontrol: update, disable:view?view: update
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
                disable: view?view:false
            },
            {
                name: 'remarks',
                label: 'Remarks',
                placeholder: '',
                type: 'textarea',
                value: '',
                Validations: [],
                generatecontrol: update, disable: view?view:false
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