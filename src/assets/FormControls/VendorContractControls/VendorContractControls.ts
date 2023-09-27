import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { FormControlCreation } from "src/app/core/models/FormControl/formcontrol";


export class VendorContractControl {
    VendorContractControlArray: FormControlCreation[];
    MovementByControlArray:FormControls[];
    ContractTypeControlArray:FormControls[];
    ChargesControlArray:FormControls[];
    CNoteCityWise:FormControlCreation[];
    CityBasedTypesControlArray: FormControls[];
    MatrixTypeControlArray:FormControls[];
    ServiceMatrixTypeControlArray:FormControls[];
    constructor(ServiceSelectionInfo)
    {
        this.VendorContractControlArray = [
            { name: 'VendorType', label: 'Vendor Type', placeholder: 'Vendor Type', type: 'dropdown', value: '', validation: '', callfunction: 'VendorTypeChange', filterOptions: '', autocomplete: '', displaywith: '', errormessage: 'Please select proper option', errormessageforpattern: '', generatecontrol: true, disable: false },
            { name: 'VendorName', label: 'Vendor Name', placeholder: 'Vendor Name', type: 'dropdown', value: '', validation: 'autocomplete', callfunction: '', filterOptions: '', autocomplete: '', displaywith: '', errormessage: 'Please select proper option', errormessageforpattern: '', generatecontrol: true, disable: false },
        ]
        // if (ServiceSelectionInfo) {
        //     const checkexists = ServiceSelectionInfo.contractType ? ServiceSelectionInfo.contractType.split(",") : ['0'];
        //     this.ContractTypeControlArray = [

        //         {name:'TripCityBased',label: 'Trip City Based (Farthest distance)', placeholder: '1', type: 'checkbox', value: checkexists.includes('1')?true:false, Validations: [], generatecontrol: true, disable: false },
        //         {name:'TripDistanceBased',label: 'Trip Distance Based', placeholder: '3', type: 'checkbox', value: checkexists.includes('3')?true:false, Validations: [], generatecontrol: true, disable: false }

        //     ];
        //     this.CNoteCityWise=[
        //         {name:'CNoteCityWise',label: 'CNote City Wise', placeholder: '2', type: 'checkbox', value: checkexists.includes('2')?true:false, validation: '', callfunction: '', filterOptions: '', autocomplete: '', displaywith: '', errormessage: '', errormessageforpattern: '', generatecontrol: true, disable: false },
        //     ]
        // }
        this.MovementByControlArray = [
            { name: 'MovementBy', label: '', placeholder: 'MovementBy', type: 'radiobutton', value: [{ name: 'Vehicle Capacity', value: '2' }, { name: 'Vehicle Number', value: '3' }], Validations: [], generatecontrol: true, disable: false },
        ]
        this.ChargesControlArray = [
            { name: 'Charges', label: '', placeholder: 'Charges', type: 'radiobutton', value: [{ name: 'Fixed', value: 'F' }, { name: 'Variable', value: 'V' }],Validations: [], generatecontrol: true, disable: false,functions: {
                onChange: 'ShowHideCharges',
            }},
        ]
        this.ServiceMatrixTypeControlArray=[
            { name: 'MatrixTypes', label: 'MatrixTypes', placeholder: 'MatrixTypes', type: 'Staticdropdown', value: [{ name: 'Trip Lane Based : Farthest Distance (From City - To City)', value: '2' }, { name: 'Trip Lane Based : Farthest Distance (Location - Area)', value: '1' },{ name: 'Trip Distance Based : Farthest Distance', value: '3' }], Validations: [], generatecontrol: true, disable: false,functions: {

            }}
        ]

        // City Based Contract
        this.CityBasedTypesControlArray = [
            { name: 'CityBasedTypes', label: '', placeholder: 'CityBasedTypes', type: 'radiobutton', value: [{ name: 'Manual', value: '1' }, { name: 'Upload', value: '2' }], Validations: [], generatecontrol: true, disable: false,functions: {
                onChange: 'SelectManualOrUpload',
            }},
        ]
        this.MatrixTypeControlArray=[
            { name: 'MatrixTypes', label: 'Matrix', placeholder: 'Matrix', type: 'Staticdropdown', value: [{ name: 'From City - To City', value: 'C' }, { name: 'Location - Pincode', value: 'L' }], Validations: [], generatecontrol: true, disable: false,functions: {
                onSelection: 'onMatrixTypeChange',
            }}
        ]
    }
}
