import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class thcGenerationFilterControls {
    private docketFilters: FormControls[];    
    constructor(request: any) {
        
        this.docketFilters = [
            {
                name: "StartDate",
                label: "SelectDateRange",
                placeholder: "Select Date",
                type: "daterangpicker",
                value: request?.sDT,
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                  support: "EndDate",
                },
              },
              {
                name: "EndDate",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: request?.eDT,
                filterOptions: "",
                autocomplete: "",
                generatecontrol: false,
                disable: true,
                Validations: [
                  {
                    name: "Select Data Range",
                  },
                  {
                    name: "required",
                    message: "StartDateRange is Required...!",
                  },
                ],
              },
        ]
    }

    getDocketFilterControls() {
        return this.docketFilters;
    }    
}