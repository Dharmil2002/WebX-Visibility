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
                name: 'shortPkgs',
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
            {
                name: 'depsPkgs',
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

                functions: {
                    onChange: "",
                },
                additionalData: {
                    require: false
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'reason',
                label: 'Reason',
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
                name: 'upload',
                label: 'File Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Upload File"
                    }
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
                name: 'remarks',
                label: 'Remarks',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                additionalData: {
                    require: false
                },
                generatecontrol: true, disable: false
            },
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