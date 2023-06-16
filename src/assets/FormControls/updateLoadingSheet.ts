import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class UpdateloadingControl {
    private updateloadingSheetControlArray: FormControls[];
    private ScanControlArray: FormControls[];
    constructor() {
        this.updateloadingSheetControlArray = [
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }, {
                name: 'Route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "tripID",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'ArrivalLocation',
                label: 'Arrival Location',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Unoadingsheet",
                label: "Unoading sheet",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Leg',
                label: 'Leg',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Scan',
                label: 'Scan',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
        ];
        this.ScanControlArray = [
            {
                name: 'Shipment',
                label: 'Package ID',
                placeholder: 'Enter Package ID to scan',
                type: 'text',
                value: '',
                Validations: [],
                functions: {
                    onChange: 'GetShipmentDet',
                },
                generatecontrol: true,
                disable: false
            }]
    }
    getupdatelsFormControls() {
        return this.updateloadingSheetControlArray;
    }
    getScanFormControls() {
        return this.ScanControlArray;

    }
}