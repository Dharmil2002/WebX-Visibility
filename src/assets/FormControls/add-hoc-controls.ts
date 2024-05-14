import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddHocControls {
    addHoc: FormControls[];
    constructor() {
        this.addHoc = [
            {
                name: "routeMode",
                label: "Route Mode",
                placeholder: "Route Mode",
                type: "Staticdropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "connectLoc",
                label: "Connecting Location",
                placeholder: "Select location",
                type: "multiselect",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                  isIndeterminate: false,
                  isChecked: false,
                  support: "connectLocationDropdown",
                  showNameAndValue: false,
                  Validations: [{}],
                },
                functions: {
                  onModel: "getLocation",
                  onToggleAll: "toggleSelectAll",
                  onSelect:"connectLocations",
                },
                generatecontrol: true,
                disable: false,
              },
            {
                name: "distance",
                label: "Distance",
                placeholder: "Distance ",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "transitHrs",
                label: "Transit Hrs",
                placeholder: "Route Type",
                type: "datetimerpicker",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "route",
                label: "Route",
                placeholder: "Route",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "connectLocationDropdown",
                label: "Connecting Location",
                placeholder: "Select location",
                type: "",
                value: "",
                Validations: [
                  {
                    name: "required",
                    message: "Connecting Location is Required...!",
                  },
                ],
                generatecontrol: false,
                disable: false,
              },
        ]
    }
}