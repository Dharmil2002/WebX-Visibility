import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { SACMaster } from "src/app/core/models/Masters/SAC Master/SAC master";

export class SACControl {
     SACControlArray: FormControls[];
     constructor(SACTable: SACMaster, isUpdate: boolean) {
          this.SACControlArray = [
               {
                    name: 'SID',
                    label: 'Service ID',
                    placeholder: 'Service ID',
                    type: 'text',
                    value: isUpdate ? SACTable.SID : "System Generated",
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: true,
                    disable: true
               },
               {
                    name: "TYP",
                    label: "Service Type",
                    placeholder: "Service Type",
                    type: 'Staticdropdown',
                    value: [
                         { value: "SAC", name: "SAC" },
                         { value: "HSN", name: "HSN" }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: isUpdate ? true : false,
                    Validations: [
                         {
                              name: "required",
                              message: "Service Type  is required",
                         }]
               },
               {
                    name: "SHCD",
                    label: "Service Code",
                    placeholder: "Enter Service Code",
                    type: "number",
                    value: SACTable.SHCD,
                    generatecontrol: true,
                    disable: isUpdate ? true : false,
                    Validations: [
                         {
                              name: "required",
                              message: "Service Code is required",
                         },
                         {
                              name: "pattern",
                              message: "Please Enter 6 digit Service Code",
                              pattern: '^[0-9]{4,6}$'
                         }
                    ],
                    functions: {
                         onChange: "checkCodeExist",
                    }
               },
               {
                    name: 'SNM',
                    label: "Service Name",
                    placeholder: "Enter Service Name",
                    type: 'text',
                    value: SACTable.SNM,
                    generatecontrol: true,
                    disable: isUpdate ? true : false,
                    Validations: [
                         {
                              name: "required",
                              message: "Service Name is required"
                         }
                    ],
                    functions: {
                         onChange: "checkNameExist",
                    }
               },
               {
                    name: 'GSTRT',
                    label: "GST Rate %",
                    placeholder: "Enter GST Rate",
                    type: 'text',
                    value: SACTable.GSTRT,
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: '_id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: SACTable._id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false
               },
          ]
     }

     getFormControls() {
          return this.SACControlArray;
     }
}

export class SACControlList {
     SACControlListArray: FormControls[];
     constructor() {
          this.SACControlListArray = [
               {
                    name: "TYP",
                    label: "Service Type",
                    placeholder: "Service Type",
                    type: 'Staticdropdown',
                    value: [
                         { value: "SAC", name: "SAC" },
                         { value: "HSN", name: "HSN" }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                         {
                              name: "required",
                              message: "Service Type  is required",
                         }]
               },
          ]
     }

     getListFormControls() {
          return this.SACControlListArray;
     }

}