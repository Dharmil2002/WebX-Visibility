import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class THCAmountsControl {
    THCAmountsArray: FormControls[];
    constructor(FormValues) {
        this.THCAmountsArray = [
            {
                name: "or",
                label: "ADD (+)",
                placeholder: "  ",
                type: "or",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ],

            },
            {
                name: "or",
                label: "LESS (-)",
                placeholder: "  ",
                type: "or",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ],

            },
            {
                name: "min",
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
                name: "min",
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
                name: "min",
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
                additionalData: { op: "+", },
            },
            {
                name: "min",
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
                name: "min",
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
                additionalData: { op: "+", },
            },
            {
                name: "min",
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
                name: "min",
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
                additionalData: { op: "+", },
            },
            {
                name: "min",
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
                name: "min",
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
                additionalData: {
                    op: "+",
                },
            },
            {
                name: "min",
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
                additionalData: { op: "-", },
            },
            {
                name: "min",
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
                additionalData: { op: "+", },
            },
        ]
    }
    getTHCDetailsControls() {
        return this.THCAmountsArray;
    }
}