import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DocketTrackingControl {
    private DocketTrackingControl: FormControls[];
    constructor() {
      this.DocketTrackingControl=[
        {
            name: 'docketNo',
            label: 'Docket No',
            placeholder: '',
            type: 'text',
            value:'',
            Validations: [],
            generatecontrol: true,
            disable: false
        }
    ]
    }
    getDepartVehicleFormControls() {
        return this.DocketTrackingControl;
    }
}