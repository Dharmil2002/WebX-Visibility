import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class EwayBillControls {
    private docketFields: FormControls[];
    private consignorFields: FormControls[];
    private consigneeFields: FormControls[];
    private appointmentControlArray: FormControls[];
    private containerControlArray: FormControls[];
    private contractControlArray: FormControls[];
    private totalSummaryControlArray: FormControls[];
    private ewayBillControlArray: FormControls[];
    constructor() {
        this.docketFields =
            [
                {
                    name: 'DKTNO', label: 'CNote No', placeholder: 'CNote No', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [
                    ],
                    functions: {
                        change: 'DocketValidation',
                    }

                }
                , {
                    name: "cnoteDate",
                    label: "C Note Date",
                    placeholder: "C Note Date",
                    type: "date",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],

                },
                {
                    name: "billingParty",
                    label: "Billing Party",
                    placeholder: "Billing Party",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: "FromCity",
                    label: "From City",
                    placeholder: "From City",
                    type: "dropdown",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }, functions: {
                        onModel: 'getFromCity',
                    }
                },
                {
                    name: "ToCity",
                    label: "To City",
                    placeholder: "To City",
                    type: "dropdown",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },

            ];
        this.consignorFields =
            [
                {
                    name: 'ConsignorName', label: 'Consignor Name', placeholder: 'Consignor Name', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                }
                ,
                {
                    name: 'ConsignorGSTINNO', label: 'GSTIN NO', placeholder: 'GSTIN NO', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                },
                {
                    name: 'ConsignorCity', label: 'Consignor City', placeholder: 'Consignor City', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'ConsignorPincode', label: 'Consignor Pincode', placeholder: 'Consignor Pincode', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'ConsignorTelNo', label: 'Consignor TelephoneNo', placeholder: 'Consignor TelephoneNo', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
                ,
                {
                    name: 'ConsignorMobNo', label: 'Consignor MobileNo', placeholder: 'Consignor MobileNo', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
                ,
                {
                    name: 'ConsignorAddress', label: 'Consignor Address', placeholder: 'Consignor Address', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
            ];
        this.consigneeFields =
            [
                {
                    name: 'ConsigneeName', label: 'Consignee Name', placeholder: 'Consignee Name', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                }
                ,
                {
                    name: 'ConsigneeGSTINNO', label: 'GSTIN NO', placeholder: 'GSTIN NO', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                },
                {
                    name: 'ConsigneeCity', label: 'Consignee City', placeholder: 'Consignee City', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'ConsigneePincode', label: 'Consignee Pincode', placeholder: 'Consignee Pincode', type: 'dropdown', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'ConsigneeTelNo', label: 'Consignee TelephoneNo', placeholder: 'Consignee TelephoneNo', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
                ,
                {
                    name: 'ConsigneeMobNo', label: 'Consignee MobileNo', placeholder: 'Consignee MobileNo', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
                ,
                {
                    name: 'ConsigneeAddress', label: 'Consignee Address', placeholder: 'Consignee Address', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                }
            ];
        this.appointmentControlArray =
            [
                {
                    name: 'appoint', label: '', placeholder: '', type: 'radiobutton',
                    value: [{ value: 'Y', name: 'Yes', "checked": true }, { value: 'N', name: 'No' }],
                    Validations: [],
                    generatecontrol: true, disable: false
                }
            ];
        this.containerControlArray =
            [
                {
                    name: 'ContainerNo1', label: 'Container No. 1', placeholder: 'Container No. 1', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: "ContainerSize1",
                    label: "Size",
                    placeholder: "Size",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'ContainerNo2', label: 'Container No. 2', placeholder: 'Container No. 2', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: "ContainerSize2",
                    label: "Size",
                    placeholder: "Size",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: "ContainerType",
                    label: "Container Type",
                    placeholder: "Container Type",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: "ContainerCapacity",
                    label: "Container Capacity",
                    placeholder: "Container Capacity",
                    type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'FIELD1', label: 'Booking No', placeholder: 'Booking No', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD2', label: 'Seal No', placeholder: 'Seal No', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD3', label: 'Shipping Line', placeholder: 'Shipping Line', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD4', label: 'Job Order No', placeholder: 'Job Order No', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD5', label: 'Port', placeholder: 'Port', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD6', label: 'Job Order No 2', placeholder: 'Job Order No 2', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'FIELD7', label: 'DEO No.', placeholder: 'DEO No.', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],

                },

            ];
        this.contractControlArray =
            [
                {
                    name: 'OrgLoc', label: 'Booking Branch', placeholder: 'Booking Branch', type: 'text', value: '',
                    filterOptions: '', autocomplete: '',
                    displaywith: '', generatecontrol: true, disable: false,
                    Validations: [],
                },
                {
                    name: 'Destination', label: 'Destination', placeholder: 'Destination', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'PAYTYP', label: 'Payment Type', placeholder: 'Payment Type', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'SVCTYP', label: 'Service Type', placeholder: 'Service Type', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'Local', label: 'Local', placeholder: 'Local', type: "toggle",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                },
                {
                    name: 'ODA', label: 'ODA', placeholder: 'ODA', type: "toggle",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                },
                {
                    name: 'RSKTY', label: 'Risk Type', placeholder: 'Risk Type', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'PKGS', label: 'Packaging Type', placeholder: 'Packaging Type', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], 
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'TRN', label: 'Product', placeholder: 'Product', type: "dropdown",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [], additionalData: {
                        showNameAndValue: true
                    }
                },
            ];
        this.totalSummaryControlArray = [
            {
                name: 'CFT_RATIO', label: 'CFT Ratio', placeholder: 'CFT Ratio', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'CFT_TOT', label: 'CFT Total', placeholder: 'CFT Total', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'CHRGWT', label: 'Charged Weight', placeholder: 'Charged Weight', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'EDD', label: 'EDD', placeholder: 'EDD', type: 'date', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'F_VOL', label: 'Volumetric', placeholder: 'Volumetric', type: "toggle",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: 'TotalDeclaredValue', label: 'Total Declared Value', placeholder: 'Total Declared Value', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'TotalChargedNoofPackages', label: 'Charged No of Pkg.', placeholder: 'Charged No of Pkg.', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: 'TotalPartQuantity', label: 'Total Part Quantity', placeholder: 'Total Part Quantity', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
        ];
        this.ewayBillControlArray = [
            {
                name: 'EWBNO', label: 'EWB Number', placeholder: 'EWB Number', type: 'text', value: '',
                filterOptions: '', autocomplete: '',
                displaywith: '', generatecontrol: true, disable: false,
                Validations: [],
            },
            {
                name: "EWBDATE",
                label: "EWB Date",
                placeholder: "EWB Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: 'IsMultipleEWB', label: 'Multiple EWB', placeholder: 'Multiple EWB', type: "toggle",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "EWBEXPIRED",
                label: "EWB Expired Date",
                placeholder: "EWB Expired Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            }
        ]
    }

    getDocketFieldControls() {
        return this.docketFields;
    }
    getConsignorFieldControls() {
        return this.consignorFields;
    }
    getConsigneeFieldControls() {
        return this.consigneeFields;
    }
    getAppointmentFieldControls() {
        return this.appointmentControlArray;
    }
    getContainerFieldControls() {
        return this.containerControlArray;
    }
    getContractFieldControls() {
        return this.contractControlArray;
    }
    getTotalSummaryFieldControls() {
        return this.totalSummaryControlArray;
    }
    getEwayBillFieldControls() {
        return this.ewayBillControlArray;
    }
}