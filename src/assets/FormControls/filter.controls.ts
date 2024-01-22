import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class FilterControl {
  filterControlArray: FormControls[];
  constructor() {
    this.filterControlArray = [
      {
        name: "start",
        label: "SelectDateRange",
        placeholder: "Select Date",
        type: "daterangpicker",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
            support: "end",
        },
    }, 
      {
        name: 'bookLoc',
        label: 'Booking Location',
        placeholder: 'Booking Location',
        type: 'multiselect',
        value: '',
        Validations: [],
        functions: {
          onToggleAll: 'toggleSelectAll'
        },
        additionalData: {

          isIndeterminate: false,
          isChecked: false,
          support: "userLocationscontrolHandler",
          showNameAndValue: false,
          Validations: [{
            name: "",
            message: ""
          }]
        },
        generatecontrol: true, disable: false
      },
      {
        name: 'state',
        label: 'State',
        placeholder: 'Select State',
        type: 'multiselect',
        value: '',
        Validations: [],
        functions: {
          onToggleAll: 'toggleSelectAll',
          onSelect: "bookLocation"
        },
        additionalData: {

          isIndeterminate: false,
          isChecked: false,
          support: "stateControlHandler",
          showNameAndValue: false,
          Validations: [{
            name: "",
            message: ""
          }]
        },
        generatecontrol: true, disable: false
      },
      
      {
        name: 'customer', label: "Customer", placeholder: "Select Customer", type: 'multiselect',
        value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
        ],
        functions: {
          onToggleAll: 'toggleSelectAll',
        },
        additionalData: {
          showNameAndValue: false,
          isIndeterminate: false,
          isChecked: false,
          support: "customerControlHandler",
          Validations: [{
            name: "",
            message: ""
          }]
        }
      },
      //   ---------------Add support Controllers at last -----------------------
      {
        name: "controlHandler",
        label: "",
        placeholder: "Multi Locations Access",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "",
          },
        ],
      },
      {
        name: "userLocationscontrolHandler",
        label: "Multi Locations Access",
        placeholder: "Multi Locations Access",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          }
        ],

      },
      {
        name: "stateControlHandler",
        label: "State",
        placeholder: "State",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          }
        ],

      },
      {
        name: "customerControlHandler",
        label: "Customer",
        placeholder: "Customer",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          }
        ],

      },
      {
        name: "end",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: "",
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
    ];

  }
  getFormControls() {
    return this.filterControlArray;
  }
}
