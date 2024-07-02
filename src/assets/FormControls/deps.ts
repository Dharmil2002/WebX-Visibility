import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DepsUpdateControls {
    private depsControlArray: FormControls[];
    constructor() {
        this.depsControlArray = [
            {
                name: 'dEPSNO',
                label: 'Deps Ticket No',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Package  is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "getValidate",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'dEPSDT',
                label: 'Deps Date',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Deps Date  is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'dKTNO',
                label: 'GCN NO',//Here need to add dktName Status
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "GCN NO is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'pKGS',
                label: 'No of Pkts',//Here need to add dktName Status
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "No of Pkts is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'dEPSCREAT',
                label: 'DEPS Created At',//Here need to add dktName Status
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "DEPS Created At is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'dEPSCREBY',
                label: 'DEPS Created by',//Here need to add dktName Status
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'dEPSRes',
                label: 'DEPS Reason',//Here need to add dktName Status
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'uPLOAD',
                label: 'Upload Image',//Here need to add dktName Status
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Upload Image is Required"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "getFilePod",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'sPKGS',
                label: 'No of Short Pkts',//Here need to add dktName Status
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Enter  No of Short Pkts"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'nOEPKGS',
                label: 'No of Extra Pkts',//Here need to add dktName Status
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Enter  No of Extra Pkts"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'nOPPKGS',
                label: 'No of Pilferage Pkts',//Here need to add dktName Status
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Enter  No of Pilferage Pkts"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'nODPKGS',
                label: 'No of Damage Pkts',//Here need to add dktName Status
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Enter  No of Damage Pkts"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'rMK',
                label: 'Remarks',//Here need to add dktName Status
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Please Enter Remarks"
                    }
                ],
                additionalData: {
                    require: true
                },
                functions: {
                    onChange: "",
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'suffix',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                additionalData: {
                  require: true
                },
                generatecontrol: false, disable: false
              }
         
        ];
    }
    getDepsControlsData() {
        return this.depsControlArray;
    }

}