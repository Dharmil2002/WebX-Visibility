import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class marketVehicleControls {
    private marketVehicle: FormControls[];
    constructor(
    ) {
        this.marketVehicle = [
            {
                name: 'vehicelNo', label: "Vehicle Number", placeholder: "Vehicle Number", type: 'text',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                      name: "required",
                      message: "Vehicle Number is required",
                    },
                  ],
            },
            {
                name: "vehicleSize",
                label: "Vehicle Size",
                placeholder: "Vehicle Size",
                type: "Staticdropdown",
                value: [
                  { value: "1", name: "1-MT" },
                  { value: "9", name: "9-MT" },
                  { value: "16", name: "16-MT" },
                  { value: "32", name: "32-MT" },
                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                      name: "required",
                      message: "Vehicle Size is required",
                    },
                  ],
                functions:{
                    onSelection:"checkVehicleSize"
                },
                additionalData: {
                  showNameAndValue: false,
                },
              },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: 'text',
                value: localStorage.getItem("Username"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryDate',
                label: 'Entry Date',
                placeholder: 'Entry Date',
                type: 'text',
                value: new Date().toUTCString(),
                Validations: [],
                generatecontrol: false, disable: false
            },

        ]
    }
    getFormControls() {
        return this.marketVehicle;
    }
}