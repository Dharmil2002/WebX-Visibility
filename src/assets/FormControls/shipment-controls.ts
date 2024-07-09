import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ShipmentEditControls {
    private shipmentEditControlArray: FormControls[];
    constructor() {
        this.shipmentEditControlArray = [
            {
                name: 'noofPkts',
                label: 'Package',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Package  is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "getValidate",
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'actualWeight',
                label: 'Actual Weight(Kg)',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Weight is Required"
                    }
                ],
                functions: {
                    onChange: "getValidate"
                },
                additionalData: {
                    require: true
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'ctWeight',
                label: 'Charge Weight(Kg)',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Weight is Required"
                    }
                ],
                functions: {
                    onChange: "getValidate"
                },
                additionalData: {
                    require: true
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'shortPkts',
                label: 'Is Short Package',
                placeholder: '',
                type: 'toggle',
                value: false,
                functions: {
                    onChange: "toggleChanges"
                },
                additionalData: {
                    require: true,
                    name: "Short Package"
                },
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'extraPkts',
                label: 'Is Extra Package',
                placeholder: '',
                type: 'toggle',
                value: false,
                functions: {
                    onChange: "toggleChanges"
                },
                additionalData: {
                    require: true,
                    name: "Extra Package"
                },
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'pilferagePkts',
                label: 'Is Pilferage Package',
                placeholder: '',
                type: 'toggle',
                functions: {
                    onChange: "toggleChanges"
                },
                additionalData: {
                    require: true,
                    name: "Pilferage Package"
                },
                value: false,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'DamagePkts',
                label: 'Is Damage Package',
                placeholder: '',
                type: 'toggle',
                functions: {
                    onChange: "toggleChanges"
                },
                additionalData: {
                    require: true,
                    name: "Damage Package"
                },
                value: false,
                Validations: [],
                generatecontrol: true, disable: false
            },
            //demange
            {
                name: 'demagePkgs',
                label: 'Damage Package',
                placeholder: '',
                type: 'number',
                additionalData: {
                    require: false,
                    name: "Damage Package"
                },
                functions: {
                    onChange: "getPkgsCheck",
                },
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'demageReason',
                label: 'Demage Reason',
                placeholder: '',
                type: 'dropdown',
                value: "",
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                functions: {
                    onOptionSelect: ""
                },
                additionalData: {
                    showNameAndValue: false,
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'demageUpload',
                label: 'Demage  File Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                ],
                functions: {
                    onChange: "getFilePod"
                },
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'demageRemarks',
                label: 'Demage  Remarks',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            /*End*/
            //Pilferage 
            {
                name: 'pilferagePkgs',
                label: 'Pilferage Package',
                placeholder: '',
                type:  'number',
                additionalData: {
                    require: false,
                    name: "Pilferage Package"
                },
                functions: {
                    onChange: "getPkgsCheck",
                },
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'pilferageReason',
                label: 'Pilferage Reason',
                placeholder: '',
                type: 'dropdown',
                value: "",
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                functions: {
                    onOptionSelect: ""
                },
                additionalData: {
                    showNameAndValue: false,
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'pilferageUpload',
                label: 'Pilferage File Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                ],
                functions: {
                    onChange: "getFilePod"
                },
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'pilferageRemarks',
                label: 'Pilferage Remarks',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            /*End*/
            //Shorteage
            {
                name: 'shortPkgs',
                label: 'Short Package',
                placeholder: '',
                type:'number',
                additionalData: {
                    require: false,
                    name: "Short Package"
                },
                functions: {
                    onChange: "getPkgsCheck",
                },
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'shortReason',
                label: 'Short Reason',
                placeholder: '',
                type: 'dropdown',
                value: "",
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                functions: {
                    onOptionSelect: ""
                },
                additionalData: {
                    showNameAndValue: false,
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'shortUpload',
                label: 'Short File Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                ],
                functions: {
                    onChange: "getFilePod"
                },
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'shortRemarks',
                label: 'Short Remarks',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
            /*End*/
            {
                name: 'shipment',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                additionalData: {
                    require: true
                },
                generatecontrol: false, disable: false
            },
            {
                name: 'suffix',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                additionalData: {
                    require: true
                },
                generatecontrol: false, disable: false
            }
        ];
    }
    getShipmentFormControls() {
        return this.shipmentEditControlArray;
    }

}