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
                label: 'ContractAmount',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'OtherChrge',
                label: 'Other Charges',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Loading",
                label: "Loading",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },

            {
                name: 'Unloading',
                label: 'Unloading',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: "Enroute",
                label: "Enroute",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: 'Misc',
                label: 'Misc',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'TotalTripAmt',
                label: 'Total Trip Amount',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
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
                label: 'Advance',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'PaidByCash',
                label: 'Paid by Cash',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "PaidbyBank",
                label: "Paid by Bank/Cheque",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },

            {
                name: 'PaidbyFuel',
                label: 'Paid by Fuel',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: "PaidbyCard",
                label: "Paid by Card",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: 'TotalAdv',
                label: 'Total Advance',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'BalanceAmt',
                label: 'Balance Amount',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
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
                Validations: [],
                generatecontrol: true, disable: true
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