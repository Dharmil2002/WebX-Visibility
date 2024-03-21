import { FormControls } from 'src/app/Models/FormControl/formcontrol';

export class SetOpeningBalanceLedgerWise {
    SetOpeningBalanceLedgerWiseControlArray: FormControls[];
    JournalVoucherDetailsArray: FormControls[];

    constructor(FormValues = null) {
        this.SetOpeningBalanceLedgerWiseControlArray = [
            {
                name: 'branch',
                label: 'Select Branch',
                placeholder: '',
                type: "dropdown",
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                    {
                        name: "required",
                        message: "Branch is required",
                    }, {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                functions: {
                    onOptionSelect: "OnChangeDropDown"
                },
                generatecontrol: true, disable: false
            },

            {
                name: 'category',
                label: 'Select Category',
                placeholder: 'Select Category',
                type: 'dropdown',
                value: '',
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                    {
                        name: "required",
                        message: "Category is required",
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                functions: {
                    onOptionSelect: "OnChangeDropDown"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'aCCONTCD',
                label: 'Select Account Code ',
                placeholder: 'Search & Select Account Code',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "accountHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onOptionSelect: "toggleSelectSingle",
                    onToggleAll: "toggleSelectAll",
                    onModel: 'toggleSelectSingle'
                },
                generatecontrol: true, disable: false
            },



            {
                name: 'accountHandler',
                label: 'accountHandler',
                placeholder: ' ',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },


        ]
        this.JournalVoucherDetailsArray = [
            {
                name: "AccountInfo",
                label: "Account Name",
                placeholder: "Account Name",
                type: "text",
                value: FormValues?.value + ":" + FormValues?.name,
                generatecontrol: true,
                disable: true,
                Validations: [

                ]
            },

            {
                name: "DebitAmount",
                label: "Debit Amount ₹",
                placeholder: "Debit Amount ₹",
                type: "number",
                value: FormValues?.dAMT,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Debit Amount is required!",
                    },
                    {
                        name: "pattern",
                        message: "Please Enter Valid Debit Amount",
                        pattern: '^[^-]+$'
                    },
                ],
                functions: {
                    onChange: "onChangeAmount"
                },

            },
            {
                name: "CreditAmount",
                label: "Credit Amount ₹",
                placeholder: "Credit Amount ₹",
                type: "number",
                value: FormValues?.cAMT,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Debit Amount is required!",
                    },
                    {
                        name: "pattern",
                        message: "Please Enter Valid Debit Amount",
                        pattern: '^[^-]+$'
                    },
                ],
                functions: {
                    onChange: "onChangeAmount"
                },
            },




        ]
    }
    getJournalVoucherDetailsArrayControls() {
        return this.JournalVoucherDetailsArray;
    }
}