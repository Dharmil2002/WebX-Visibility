import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class thcReportControl {
     thcReportControlArray: FormControls[];
     constructor() {
          this.thcReportControlArray = [
               {
                    name: "start",
                    label: "Select Date Range",
                    placeholder: "",
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
                    }
               },
               {
                    name: 'Location',
                    label: 'Select Location',
                    placeholder: '',
                    type: "dropdown",
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: false,
                    },
    
                    generatecontrol: true, disable: false
                },
                {
                    name: 'ReportType',
                    label: 'Report Type',
                    placeholder: '',
                    type: 'radiobutton',
                    value: [
                        { value: "I", name: "Individual" },
                        { value: "C", name: "Cumulative" }
                    ],
                    Validations: [],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'DocumentStatus',
                    label: 'Document Status',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                        { value: 1, name: "Generated" },
                        { value: 3, name: "Update" },
                        { value: 4, name: "Closed" },
                        { value: 9, name: "Cancelled" },
                        { value: 0, name: "All" },
                    ],
                    Validations: [],
                    generatecontrol: true, disable: false
                },
                {
                    name: '',
                    label: "",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
                },
                {
                    name: '',
                    label: "",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
                },
                {
                    name: 'OR',
                    label: "",
                    placeholder: "",
                    type: 'OR',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
                },
                {
                    name: '',
                    label: "",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
                },
                {
                    name: '',
                    label: "",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
                },
               {
                    name: "DocumentNo",
                    label: "Document No",
                    placeholder: "",
                    type: "text",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {},
               },
               {
                    name: "end",
                    label: "",
                    placeholder: "Select Date Range",
                    type: "",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    generatecontrol: false,
                    disable: true,
                    Validations: [],
               }
          ]
     }
}