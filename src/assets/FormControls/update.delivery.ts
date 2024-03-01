import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class UpdateShipmentDeliveryControl {
    private updateDeliveryControlArray: FormControls[];
    constructor() {
        this.updateDeliveryControlArray = [
            {
                name: 'dKTNO',
                label: 'Docket No',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
             {
                name: 'DTTM',
                label: 'Date And Time',
                placeholder: '',
                type: 'datetimerpicker',
                value: '',
                Validations: [{
                    name: "required",
                    message: "'Date And Time is required"
                }],
                generatecontrol: true, disable: false
            },
            {
                name: 'pod',
                label: 'POD',
                placeholder: '',
                type:'file',
                value: '',
                Validations: [],
                additionalData:{
                    isFileSelected:false
                },
                functions: {
                    onChange: 'getFilePod',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'bookedPkgs',
                label: 'Booked Pkgs',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'arrivedPkgs',
                label: 'Arrived Pkgs',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'deliveryPkgs',
                label: 'Delivery Pkgs',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [],
                functions:{
                    onChange:"deliveryPkgsChange"
                },
                generatecontrol: true, disable: false
            },
            {
                name: "cODDODCharges",
                label: "COD/DOD Charges",
                placeholder: '',
                type:"text",
                value:'0.00',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'codDodPaid',
                label: 'COD/DOD Paid',
                placeholder: '',
                type: 'text',
                value:'0.00',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'deliveryPartial',
                label: 'Delivery Or Partial Reason',
                placeholder: '',
                type: 'dropdown',
                value: '',
                Validations: [],
                additionalData:{
                    showNameAndValue:false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'remarks',
                label: 'Remarks',
                placeholder: '',
                type:'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'ltReason',
                label: 'Late Reason',
                placeholder: '',
                type: 'dropdown',
                value: '',
                Validations: [],
                additionalData:{
                    showNameAndValue:false
                },
                generatecontrol: true, disable: false
            },
            {
                name: "startKm",
                label: "Start Km",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [{
                    name: "required",
                    message: "Start Km is required"
                }],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'person',
                label: 'Person Name',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Departure Time is required"
                }],
                generatecontrol: true,
                disable: false
            },
        ];
    }
    getupdaterunsheetFormControls() {
        return this.updateDeliveryControlArray;
    }

}
