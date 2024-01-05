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
            // {
            //     name: 'NameofConsignee',
            //     label: 'Name of Consignee',
            //     placeholder: 'Name of Consignee',
            //     type: 'text',
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: []
            // },
            {
                name: 'NoofDocket',
                label: 'No of Docket ',
                placeholder: 'No of Docket ',
                type: 'Staticdropdown',
                value: [
                    { value: "Single", name: "Single" },
                    { value: "Multiple", name: "Multiple" },
                ],
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "No of Docket is required",
                },],

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
            // {
            //     name: 'consignmentNoteNumber',
            //     label: 'Consignment Note Number',
            //     placeholder: 'Consignment Note Number',
            //     type: 'government-id',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "Consignment Note Number is required",
            //         },
            //         // {
            //         //     name: "pattern",
            //         //     message: "Please Enter only positive numbers with up to two decimal places",
            //         //     pattern: '^\\d+(\\.\\d{1,2})?$'
            //         // }
            //     ]
            // },
            // // {
            // //     name: "PayBasis",
            // //     label: "PayBasis",
            // //     placeholder: "PayBasis",
            // //     type: "dropdown",
            // //     value: "",
            // //     filterOptions: "",
            // //     displaywith: "",
            // //     generatecontrol: true,
            // //     disable: false,
            // //     Validations: [
            // //         {
            // //             name: "required",
            // //             message: "PayBasis is required"
            // //         },
            // //         {
            // //             name: "invalidAutocompleteObject",
            // //             message: "Choose proper value",
            // //         },
            // //         {
            // //             name: "autocomplete",
            // //         },
            // //     ],
            // //     additionalData: {
            // //         showNameAndValue: false,
            // //         //metaData: "Basic"
            // //     },
            // //     functions: {
            // //         onOptionSelect: "PayBasisFieldChanged"
            // //     },
            // // },
            // {
            //     name: 'payBasis',
            //     label: 'PayBasis',
            //     placeholder: 'PayBasis',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //     //     {
            //     //     name: "pattern",
            //     //     message: "Please Enter only positive numbers with up to two decimal places",
            //     //     pattern: '^\\d+(\\.\\d{1,2})?$'
            //     // }
            // ]
            // },
            // {
            //     name: 'subTotal',
            //     label: 'SubTotal(₹)',
            //     placeholder: 'SubTotal',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "SubTotal is required",
            //         },
            //         {
            //             name: "pattern",
            //             message: "Please Enter only positive numbers with up to two decimal places",
            //             pattern: '^\\d+(\\.\\d{1,2})?$'
            //         }
            //     ]
            // },
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
            },
            // {
            //     name: 'rateDifference',
            //     label: 'Rate Difference(₹)',
            //     placeholder: 'Rate Difference',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Rate Difference is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'doorDelivery',
            //     label: 'Door Delivery(₹)',
            //     placeholder: 'Door Delivery',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Door Delivery is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'demmurage',
            //     label: 'Demmurage(₹)',
            //     placeholder: 'Demmurage',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Demmurage is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'loadingCharge',
            //     label: 'Loading Charge(₹)',
            //     placeholder: 'Loading Charge',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Loading Charge is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'unLoadingCharge',
            //     label: 'UnLoading Charge(₹)',
            //     placeholder: 'UnLoading Charge',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Unloading charge is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'forclipCharge',
            //     label: 'Forclip Charge(₹)',
            //     placeholder: 'Forclip Charge',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "ForClip Charge is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'gatepassCharge',
            //     label: 'Gatepass Charge(₹)',
            //     placeholder: 'Gatepass Charge',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Gatepass Charge is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
            // {
            //     name: 'otherCharge',
            //     label: 'Other Charge(₹)',
            //     placeholder: 'Other Charge',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "required",
            //         message: "Other Charge is required",
            //     }, {
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }],
            //     functions: {
            //         onChange: "getTotal"
            //     },
            // },
            // {
            //     name: 'totalAmount',
            //     label: 'TotalAmount(₹)',
            //     placeholder: 'TotalAmount',
            //     type: 'text',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [{
            //         name: "pattern",
            //         message: "Please Enter only positive numbers with up to two decimal places",
            //         pattern: '^\\d+(\\.\\d{1,2})?$'
            //     }]
            // },
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
                        name: "invalidAutocompleteObject",
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
                        name: "invalidAutocompleteObject",
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
                value: '',
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
                        name: "invalidAutocompleteObject",
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
                name: "StateofSupply",
                label: "State of Supply",
                placeholder: "State of Supply",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "PlaceofSupply",
                label: "Place of Supply",
                placeholder: "Place of Supply",
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
                        name: "invalidAutocompleteObject",
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
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: [
                    //     {
                    //     name: "required",
                    //     message: "Billing Party is required"
                    // },
                ]
            },
            {
                name: "GSTRate",
                label: "GST Rate",
                placeholder: "GST Rate",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: [
                    //     {
                    //     name: "required",
                    //     message: "Billing Party is required"
                    // },
                ]
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
                        name: "invalidAutocompleteObject",
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
                name: "TDSRate",
                label: "TDS Rate",
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
                ]
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
                name: "GSTCharged",
                label: "GST Charged",
                placeholder: "GST Charged",
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
                    //     {
                    //     name: "required",
                    //     message: "Billing Party is required"
                    // },
                ]
            },
            {
                name: "PartiallyCollected ",
                label: "Partially Collected ",
                placeholder: "Partially Collected ",
                type: "checkbox",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: "RoundOff ",
                label: "Round Off",
                placeholder: "Round Off",
                type: "checkbox",
                value: '',
                generatecontrol: true,
                disable: false,
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