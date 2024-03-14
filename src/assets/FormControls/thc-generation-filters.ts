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
                name: "FromCity",
                label: "From City",
                placeholder: "From City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [                 
                  {
                    name: "autocomplete"
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
                  onModel: "getCity",
                },
              },
              {
                name: "ToCity",
                label: "To City",
                placeholder: "To City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [                  
                  {
                    name: "autocomplete"
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
                  onModel: "getCity",
                },
              },     
              {
                name: "StockCity",
                label: "Stock City",
                placeholder: "Stock City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [                 
                  {
                    name: "autocomplete"
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
                  onModel: "getCity",
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