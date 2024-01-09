import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class openingbalanceControls {
    OpeningBalanceArray: FormControls[];

    constructor() {
        this.OpeningBalanceArray = [
            {
                name: "BranchCode",
                label: "Branch Code",
                placeholder: "Branch Code",
                type: "dropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "BranchCode is required",
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
                },
              },
              {
                name: "AccountCategory",
                label: "Account Category",
                placeholder: "Account Category",
                type: "dropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "AccountCategory is required",
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
                  onOptionSelect: "getAccountCodeDropdown",
                },
              },
              {
                name: "AccountCode",
                label: "Account Code",
                placeholder: "Account Code",
                type: "dropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "AccountCode is required",
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
                  showNameAndValue: true,
                },
                functions: {
                  onOptionSelect: "getAccountDescription",
                },
              },
              {
                name: "AccountDescription",
                label: "Account Description ",
                placeholder: "Please Enter Account Description ",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
              },
              {
                name: "DebitAmount",
                label: "Debit Amount",
                placeholder: "Please Enter Debit Amount",
                type: "number",
                value: 0,
                generatecontrol: true,
                disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "DebitAmount is required",
                  },
                ],
              },
              {
                name: "CreditAmount",
                label: "Credit Amount",
                placeholder: "Please Enter Credit Amount",
                type: "number",
                value: 0,
                generatecontrol: true,
                disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "CreditAmount is required",
                  },
                ],
              },
        ]
    }

    getOpeningBalanceArrayControls() {
        return this.OpeningBalanceArray;
    }
}