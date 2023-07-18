import { FormControls } from "src/app/Models/FormControl/formcontrol";

/* here i create class for the bind controls in formGrop */
export class QuickBookingControls {

    private fieldMapping: FormControls[];
    constructor() {
            this.fieldMapping = [
                {
                    name: 'docketNumber',
                    label: 'CNote No',
                    placeholder: 'CNote No',
                    type: 'text',
                    value: 'Computerized',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'docketDate',
                    label: 'C Note Date',
                    placeholder: 'C Note Date',
                    type: 'date',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'C Note Date is required'
                        }
                    ]
                },
                {
                    name: 'payType',
                    label: 'Payment Type',
                    placeholder: 'Payment Type',
                    type: 'Staticdropdown',
                    value: [
                        { value: 'PAID', name: 'PAID' },
                        { value: 'TBB', name: 'TBB' },
                        { value: 'TO PAY', name: 'TO PAY' },
                        { value: 'FOC', name: 'FOC' }
                    ],
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Payment Type is required'
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'billingParty',
                    label: 'Billing Party',
                    placeholder: 'Billing Party',
                    type: 'dropdown',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Billing Party is required'
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'orgLoc',
                    label: 'Origin',
                    placeholder: 'orgLoc',
                    type: 'text',
                    value: localStorage.getItem("Branch"),
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'fromCity',
                    label: 'From City',
                    placeholder: 'From City',
                    type: 'dropdown',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'From City is required'
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'destination',
                    label: 'Destination',
                    placeholder: 'Destination',
                    type: 'dropdown',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Destination is required'
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'toCity',
                    label: 'To City',
                    placeholder: 'To City',
                    type: 'dropdown',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'To City is required'
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'vehNo',
                    label: 'Vehicle No',
                    placeholder: 'Vehicle No',
                    type: 'dropdown',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'totalChargedNoOfpkg',
                    label: 'Charged No of Packages',
                    placeholder: 'Charged No of Packages',
                    type: 'text',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Charged No of Packages is required'
                        }
                    ],
                    functions: {
                        change: ''
                    }
                },
                {
                    name: 'actualwt',
                    label: 'Actual Weight',
                    placeholder: 'Actual Weight',
                    type: 'text',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Actual Weight is required'
                        }
                    ],
                    functions: {
                        change: ''
                    }
                },
                {
                    name: 'chrgwt',
                    label: 'Charged Weight',
                    placeholder: 'Charged Weight',
                    type: 'text',
                    value: '',
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: 'required',
                            message: 'Charged Weight is required'
                        }
                    ],
                    functions: {
                        change: ''
                    }
                }
            ];


        }
    getDocketFieldControls() {
        return this.fieldMapping;
    }
}