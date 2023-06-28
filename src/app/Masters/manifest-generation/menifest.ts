import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class menifestControl {
    private menifestFormFields: FormControls[];
    constructor() {
        this.menifestFormFields = [
            {
                name: "loadingSheetNocontrolHandler",
                label: "Loading Sheet No",
                placeholder: "vehiclelist",
                type: "select",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Field is required.."
                    }
                ],
                functions: {
                    onChange: 'routeDetails'
                },
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "loadingSheetNo",
                    showNameAndValue: false
                }
                ,

            },
            //   ---------------Add support Controllers at last -----------------------
            {
                name: "loadingSheetNo", label: "", placeholder: "loading Sheet No", type: "", value: "", filterOptions: "", autocomplete: "", generatecontrol: false, disable: true, Validations: [
                    {
                        name: 'required',
                    }
                ]
            },
        ]
    }
    getFormControls() {
        return this.menifestFormFields;
    }
}