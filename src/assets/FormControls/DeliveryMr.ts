import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DeliveryMrGeneration {
    deliveryMrControlArray: FormControls[];
    deliveryMrDetailsControlArray: FormControls[];
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
                Validations: [],
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
                Validations: []
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
                Validations: []
            },
            {
                name: 'ContactNumber',
                label: 'Contact Number ',
                placeholder: 'Contact Number ',
                type: "mobile-number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'ConsignmentNoteNumber',
                label: 'Consignment Note Number',
                placeholder: 'Enter Consignment Note Number',
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: []
            }
        ]
        this.deliveryMrDetailsControlArray = [
            {
                name: 'consignmentNoteNumber',
                label: 'Consignment Note Number',
                placeholder: 'Consignment Note Number',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: "PayBasis",
                label: "PayBasis",
                placeholder: "PayBasis",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                //   {
                //     name: "required",
                //     message: "PayBasis is required"
                //   },
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
            // {
            //     name: 'payBasis',
            //     label: 'PayBasis',
            //     placeholder: 'PayBasis',
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
            {
                name: 'subTotal',
                label: 'SubTotal(₹)',
                placeholder: 'SubTotal',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'newSubTotal',
                label: 'newSubTotal(₹)',
                placeholder: 'newSubTotal',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'rateDifference',
                label: 'Rate Difference(₹)',
                placeholder: 'Rate Difference',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'doorDelivery',
                label: 'Door Delivery(₹)',
                placeholder: 'Door Delivery',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'demmurage',
                label: 'Demmurage(₹)',
                placeholder: 'Demmurage',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'loadingCharge',
                label: 'Loading Charge(₹)',
                placeholder: 'Loading Charge',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'unLoadingCharge',
                label: 'UnLoading Charge(₹)',
                placeholder: 'UnLoading Charge',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'forclipCharge',
                label: 'Forclip Charge(₹)',
                placeholder: 'Forclip Charge',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'gatepassCharge',
                label: 'Gatepass Charge(₹)',
                placeholder: 'Gatepass Charge',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'otherCharge',
                label: 'Other Charge(₹)',
                placeholder: 'Other Charge',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
            {
                name: 'totalAmount',
                label: 'TotalAmount(₹)',
                placeholder: 'TotalAmount',
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter only positive numbers with up to two decimal places",
                    pattern: '^\\d+(\\.\\d{1,2})?$'
                }]
            },
        ]
    }
    getDeliveryMrControls() {
        return this.deliveryMrControlArray;
    }
    getDeliveryMrDetailsControls() {
        return this.deliveryMrDetailsControlArray;
    }

}