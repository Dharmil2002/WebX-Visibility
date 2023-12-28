import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ViewPrintControl {
     private ViewPrintControlArray: FormControls[];
     constructor() {
          this.ViewPrintControlArray = [
               {
                    name: 'vIEWTYPE',
                    label: "View Type",
                    placeholder: "Select View Type",
                    type: 'dropdown',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         showNameAndValue: false,
                    },
                    functions:{
                         onOptionSelect:'getDropDownList'
                    }
               },
               {
                    name: "dOCNO",
                    label: "Doc No",
                    placeholder: "Enter Doc No",
                    type: "text",
                    value:"",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    // additionalData: {
                    //      showNameAndValue: false,
                    // },
                    // functions:{
                    //      onModel:"getDropdownData"
                    // }
               }
          ]
     }
     getFormControlsView() {
          return this.ViewPrintControlArray;
     }
}
