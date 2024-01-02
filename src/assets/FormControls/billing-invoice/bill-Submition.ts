import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class SubmitionControl {
    private submission: FormControls[];
    constructor() {
        this.submission = [
            {
                name: "submitDate",
                label: "Submission Date",
                placeholder: "",
                type: "datetimerpicker",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Submission Date is required",
                    },
                ],
                functions: {
                },
                additionalData: {
                    minDate: new Date()
                },
            },
            {
                name: "submissionTo",
                label: "Submission To",
                placeholder: "Submission TO",
                type: "text",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Submission Date is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
                functions: {

                },
            },
            {
                name: "mobile",
                label: "Mobile No",
                placeholder: "Mobile No",
                type: "mobile-number",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Submission Date is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
                functions: {

                },
            },
            {
                name: 'Upload',
                label: 'Submission Document',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Submission Date is required",
                    },
                ],
                additionalData: {
                    multiple: true,
                    isFileSelected: true
                  },
                functions: {
                    onChange: 'GetFileList',
                },
                generatecontrol: true,
                disable: false
            }
        ];

    }
    getSubmitFormControls() {
        return this.submission;
    }
}