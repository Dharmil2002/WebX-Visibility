import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DrsReportControl {
     drsReportControlArray: FormControls[];
     constructor() {
          this.drsReportControlArray = [
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
                    type: 'dropdown', 
                    value: '', 
                    filterOptions: "", 
                    autocomplete: "", 
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         showNameAndValue: false,
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'DocumentStatus',
                    label: 'Document Status ',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                        { value: 1, name: "Generated"},
                        { value: 2, name: "Update" },      
                        { value: 3, name: "Cancelled" },
                       // { value: 4, name: "Closed" },
                        { value: 5, name: "All" },
                    ],
                    Validations: [],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'ReportType',
                    label: ' ',
                    placeholder: '',
                    type: 'radiobutton',
                    value: [
                        { value: "Individual", name: "Individual" },
                        { value: "CUmulative", name: "CUmulative" }
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
                    name: 'DocumentNo',
                    label: "Document No",
                    placeholder: "Please Enter Document No comma(,) separated",
                    type: 'text',
                    value: [],
                    generatecontrol: true,
                    disable: false,
                    Validations: []
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
                    Validations: [],
               }
          ]
     }
     getCustInvRegFormControls() {
        return this.drsReportControlArray;
      }
}