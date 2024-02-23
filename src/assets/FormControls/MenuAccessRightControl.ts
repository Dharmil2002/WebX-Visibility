import { FormControls } from "src/app/core/models/FormControl/formcontrol";

export class menuAccesRightControl {
    private menuAccesRightFormFields: FormControls[];
    private menuAccesRightTreeViewFormFields
    constructor(isUpdate: boolean) {
        this.menuAccesRightFormFields =
            [
              {
                name: 'Users',
                label: " Select Role",
                placeholder: "Select Role",
                type: 'dropdown',
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
              }
            ]
    }

    getFormControls() {
        return this.menuAccesRightFormFields;
    }

}
