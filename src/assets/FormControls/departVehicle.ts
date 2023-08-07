import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DepartVehicleControl {
    private DepartVehicleControlArray: FormControls[];
    constructor() {
        this.DepartVehicleControlArray = [
            {
                name: 'VendorType',
                label: 'Vendor Type',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Vendor',
                label: 'Vendor',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Driver",
                label: "Driver",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },

            {
                name: 'DriverMob',
                label: 'Driver Mobile',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: "License",
                label: "License No",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: 'Expiry',
                label: 'Expiry Date',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
        ];
    }
    getDepartVehicleFormControls() {
        return this.DepartVehicleControlArray;
    }

}

export class AdvanceControl {
    private AdvanceControlArray: FormControls[];
    constructor() {
        this.AdvanceControlArray = [
            {
                name: 'ContractAmt',
                label: 'ContractAmount(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },
            {
                name: 'OtherChrge',
                label: 'Other Charges(₹)',
                placeholder: '',
                type: 'number',
                value:0,
                Validations: [],
                generatecontrol: true, disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },
            {
                name: "Loading",
                label: "Loading(₹)",
                placeholder: '',
                type: "number",
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: 'Unloading',
                label: 'Unloading(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: "Enroute",
                label: "Enroute(₹)",
                placeholder: '',
                type: "number",
                value:0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: 'Misc',
                label: 'Misc(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },
            {
                name: 'TotalTripAmt',
                label: 'Total Trip Amount(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: true
            },
        ];
    }
    getAdvanceFormControls() {
        return this.AdvanceControlArray;
    }

}

export class BalanceControl {
    private BalanceControlArray: FormControls[];
    constructor() {
        this.BalanceControlArray = [
            {
                name: 'Advance',
                label: 'Advance(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },
            {
                name: 'PaidByCash',
                label: 'Paid by Cash(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },
            {
                name: "PaidbyBank",
                label: "Paid by Bank/Cheque(₹)",
                placeholder: '',
                type: "number",
                value: 0,
                Validations: [],
                generatecontrol: true, disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: 'PaidbyFuel',
                label: 'Paid by Fuel(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: "PaidbyCard",
                label: "Paid by Card(₹)",
                placeholder: '',
                type: "number",
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: false,
                functions:{
                    onModelChange:'onCalculateTotal'
                }
            },

            {
                name: 'TotalAdv',
                label: 'Total Advance(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'BalanceAmt',
                label: 'Balance Amount(₹)',
                placeholder: '',
                type: 'number',
                value: 0,
                Validations: [],
                generatecontrol: true,
                disable: true
            },
        ];
    }
    getBalanceFormControls() {
        return this.BalanceControlArray;
    }
}
export class DepartureControl {
    private DepartureControlArray: FormControls[];
    constructor() {
        this.DepartureControlArray = [
            {
                name: 'DeptartureTime',
                label: 'Enter Departure Time',
                placeholder: '',
                type: 'date',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'DepartureSeal',
                label: 'Enter Departure Seal',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Seal No is required"
                    },
                    {
                        name: "pattern",
                        message: "Please enter a Seal No. consisting of 1 to 7 alphanumeric characters.",
                        pattern: "^[a-zA-Z 0-9]{1,7}$",
                    }
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: "Cewb",
                label: "CEWB Number",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
        ];
    }
    getDepartureFormControls() {
        return this.DepartureControlArray;
    }
}