import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class fileUpload {
    private fileUploadControls: FormControls[];
    constructor() {
        this.fileUploadControls = [
            {
                name: "singleupload", label: "Select File",
                placeholder: "",
                type: "file",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [".xls, .xlsx, .csv"],
                functions: {
                    onChange: "selectedFile",
                },
            }
        ]
    }
    getFieldControls() {
        return this.fileUploadControls;
    }
}