import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DeliveryMrGeneration {
    deliveryMrControlArray: FormControls[];
    deliveryMrDetailsControlArray: FormControls[];
    deliveryMrPaymentModeArray: FormControls[];
    deliveryMrBillingArray: FormControls[];
    constructor() {
        this.deliveryMrControlArray = [
            {
                name: 'Deliveredto',
                label: 'Delivered To ',
                placeholder: 'Delivered to ',
                type: 'Staticdropdown',
                value: [
                    { value: "Receiver", name: "Receiver" },
                    { value: "Consignee", name: "Consignee" },
                ],
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Delivered To is required",
                },],
                functions: {
                    onSelection: "hideControl"
                }
            },
            {
                name: 'NameofReceiver',
                label: 'Name of Receiver',
                placeholder: 'Name of Receiver',
                type: 'text',
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Name of Receiver is required",
                },]
            },
            {
                name: 'NameofConsignee',
                label: 'Name of Consignee',
                placeholder: 'Name of Consignee',
                type: 'text',
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Name of Consignee is required",
                },]
            },
            {
                name: 'ContactNumber',
                label: 'Contact Number ',
                placeholder: 'Contact Number ',
                type: "mobile-number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Contact Number is required",
                },
                {
                    name: "pattern",
                    message: "Please enter 10 digit Contact number",
                    pattern: "^[0-9]{10,12}$",
                },]
            },
            {
                name: 'ConsignmentNoteNumber',
                label: 'Consignment Note Number',
                placeholder: 'Enter Consignment Note Number',
                type: 'government-id',
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Consignment Note Number is required",
                },],
                functions: {
                    onChange: "validateConsig"
                }
            }
        ]
        this.deliveryMrDetailsControlArray = [
            {
                name: 'newSubTotal',
                label: 'NewSubTotal(₹)',
                placeholder: 'newSubTotal',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "NewSubTotal is required",
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }
                ]
            }
        ]
        this.deliveryMrPaymentModeArray = [
            {
                name: "PaymentMode",
                label: "Payment Mode",
                placeholder: "Payment Mode",
                type: "Staticdropdown",
                value: [
                    {
                        value: "Cheque",
                        name: "Cheque",
                    },
                    {
                        value: "Cash",
                        name: "Cash",
                    },
                    {
                        value: "RTGS/UTR",
                        name: "RTGS/UTR",
                    },

                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Payment Mode is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                },
                functions: {
                    onSelection: "OnPaymentModeChange"
                },
            },

            {
                name: "ChequeOrRefNo",
                label: "Cheque/Ref No.",
                placeholder: "Cheque/Ref No.",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Cheque/Ref No is required"
                    },
                ],
            },
            {
                name: "Bank",
                label: "Select Bank",
                placeholder: "Select Bank",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Bank is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                },
                functions: {
                    onOptionSelect: "setBankName"
                },
            },

            {
                name: "CashAccount",
                label: "Cash Account",
                placeholder: "Cash Account",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Account is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                },
            },
            {
                name: "Date",
                label: "Date",
                placeholder: "Date",
                type: "date",
                value: new Date(),
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                },
            },

            {
                name: "issuedFromBank",
                label: "Issued from Bank",
                placeholder: "Issued from Bank",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "Issued from Bank is required"
                },]
            },
            {
                name: "OnAccount",
                label: "On Account",
                placeholder: "On Account",
                type: "checkbox",
                value: false,
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: "depositedIntoBank",
                label: "Deposited into Bank",
                placeholder: "Deposited into Bank",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Deposited into Bank is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    //metaData: "Basic"
                },
                functions: {
                    onOptionSelect: "PayBasisFieldChanged"
                },
            },

        ]
        this.deliveryMrBillingArray = [
            {
                name: "BillingParty",
                label: "Billing Party",
                placeholder: "Billing Party",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "Stateofbooking",
                label: "State of Booking",
                placeholder: "State of Booking",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "StateofSupply",
                label: "State of Supply",
                placeholder: "State of Supply",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Place of Supply is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    //metaData: "Basic"
                },

            },
            {
                name: "SACCode",
                label: "SAC Code",
                placeholder: "SAC Code",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "SAC Code is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                },
                functions: {
                    onOptionSelect: "SACCodeFieldChanged"
                },
            },
            {
                name: "GSTRate",
                label: "GST Rate",
                placeholder: "GST Rate",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "GSTAmount",
                label: "GST Amount",
                placeholder: "GST Amount",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "TDSSection",
                label: "TDS Section",
                placeholder: "TDS Section",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Place of Supply is required"
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    //metaData: "Basic"
                },
                functions: {
                    onOptionSelect: "TDSSectionFieldChanged"
                },
            },
            {
                name: "TDSRate",
                label: 'TDS Rate %',
                placeholder: "TDS Rate",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "TDS Rate is required"
                    },
                ],
                functions: {
                    onChange: "calculateTDSAndTotal"
                },
            },
            {
                name: "TDSAmount",
                label: "TDS Amount",
                placeholder: "TDS Amount",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "DeliveryMRNetAmount",
                label: "Delivery MR Net Amount",
                placeholder: "Delivery MR Net Amount",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "CollectionAmount",
                label: "Collection Amount",
                placeholder: "Collection Amount",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Collection Amount is required"
                    },
                ],
                functions: {
                    onChange: "setPartiallyCollected"
                },
            },
            {
                name: "GSTCharged",
                label: "GST Charged",
                placeholder: "GST Charged",
                type: "checkbox",
                value: false,
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "PartiallyCollected",
                label: "Partially Collected ",
                placeholder: "Partially Collected ",
                type: "checkbox",
                value: false,
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "RoundOff",
                label: "Round Off",
                placeholder: "Round Off",
                type: "checkbox",
                value: false,
                generatecontrol: true,
                disable: true,
                Validations: [],
                functions: {
                    onChange: "applyRoundOffIfChecked"
                }
            },
            {
                name: "PartiallyCollectedAmt",
                label: "Round Off",
                placeholder: "Round Off",
                type: "number",
                value: 0,
                generatecontrol: false,
                disable: true,
                Validations: []
            },
            {
                name: "roundOffAmt",
                label: "Round Off",
                placeholder: "Round Off",
                type: "text",
                value: 0,
                generatecontrol: false,
                disable: true,
                Validations: []
            },
        ]
    }
    getDeliveryMrControls() {
        return this.deliveryMrControlArray;
    }
    getDeliveryMrDetailsControls() {
        return this.deliveryMrDetailsControlArray;
    }
    getDeliveryMrPaymentControls() {
        return this.deliveryMrPaymentModeArray;
    }
    getDeliveryMrBillingControls() {
        return this.deliveryMrBillingArray;
    }

}