import { FormControls } from "src/app/Models/FormControl/formcontrol";


export class searchControls {
    private fieldMapping: FormControls[];
    constructor(
    ) {
        this.fieldMapping = [ {
            name: "searchDocket",
            label: "Search",
            placeholder: "Search",
            type: "dropdown",
            value: "",
            filterOptions: "",
            autocomplete: "",
            displaywith: "",
            generatecontrol: true,
            disable: false,
            Validations: [
            ],
            functions: {
              onOptionSelect: 'navigate'
            },
            additionalData: {
              showNameAndValue: false,
            },
          }
        ]
    }
    getControls() {
        return this.fieldMapping;
      }
}