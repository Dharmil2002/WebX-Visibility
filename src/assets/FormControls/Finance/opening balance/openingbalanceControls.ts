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
                  onOptionSelect: "getGroupCodeDropdown",
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
                  onOptionSelect: "getGroupCodeDropdown",
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
                  onOptionSelect: "getGroupCodeDropdown",
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
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
              },
              {
                name: "CreditAmount",
                label: "Credit Amount",
                placeholder: "Please Enter Credit Amount",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
              },
        ]
    }

    getOpeningBalanceArrayControls() {
        return this.OpeningBalanceArray;
    }
}