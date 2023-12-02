import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class THCAmountsControl {
    THCAmountsADDArray: FormControls[];
    THCAmountsLESSArray: FormControls[];
    THCAmountsArray: FormControls[];
    constructor(FormValues) {
        this.THCAmountsADDArray = [
            {
                name: "ContractAmount",
                label: "Contract Amount",
                placeholder: "Contract Amount",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                additionalData: { op: "+", }
            },

            {
                name: "Loading",
                label: "Loading",
                placeholder: "Loading ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },

            {
                name: "Unloading",
                label: "Unloading",
                placeholder: "Unloading ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },

            {
                name: "Mamul",
                label: "Mamul",
                placeholder: "Mamul ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },

            {
                name: "Incentive",
                label: "Incentive",
                placeholder: "Incentive ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },

            {
                name: "Handling",
                label: "Handling",
                placeholder: "Handling ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },
            {
                name: "THCTotal",
                label: "THC Total",
                placeholder: "Handling ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },



        ]
        this.THCAmountsLESSArray = [

            {
                name: "Freightdeduction",
                label: "Freight deduction",
                placeholder: "Freight deduction",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                additionalData: { op: "-", }
            },

            {
                name: "Penalty",
                label: "Penalty",
                placeholder: "Penalty ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                additionalData: { op: "-", },
            },

            {
                name: "Claim",
                label: "Claim",
                placeholder: "Claim ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                additionalData: { op: "-", },
            },

            {
                name: "LateArrival",
                label: "Late Arrival",
                placeholder: "Late Arrival ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                additionalData: { op: "-" },
            },


            {
                name: "Detention",
                label: "Detention",
                placeholder: "Detention ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },
        ]

        this.THCAmountsArray = [
            {
                name: "Advance",
                label: "Advance",
                placeholder: "Handling ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },
            {
                name: "AdvanceLocation",
                label: "Advance Location",
                placeholder: "Handling ",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "Balance",
                label: "Balance",
                placeholder: "Handling ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],

            },


            {
                name: "Balancelocation",
                label: "Balance location",
                placeholder: "Handling ",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },



        ]
    }
    getTHCAmountsADDControls() {
        return this.THCAmountsADDArray;
    }
    getTHCAmountsLESSControls() {
        return this.THCAmountsLESSArray;
    }
    getTHCAmountsControls() {
        return this.THCAmountsArray;
    }

}