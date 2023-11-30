import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { fleetModel } from "src/app/core/models/Masters/fleetMaster";

export class FleetControls {
    private fleetDetailsControl: FormControls[];
    constructor(FleetTable: fleetModel, isUpdate: boolean) {
        this.fleetDetailsControl = [
            {
                name: 'vehicleNo',
                label: "Vehicle Number",
                placeholder: "Select Vehicle Number",
                type: 'dropdown',
                value: FleetTable.vehicleNo,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Number is required"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: "checkUniqueVehicle",
                },
            },
            {
                name: 'vehicleType',
                label: "Vehicle Type",
                placeholder: "Select Vehicle Type",
                type: 'dropdown',
                value: FleetTable.vehicleType,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Type is required"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
            },
            {
                name: 'RCBookNo', label: "RC Book No", placeholder: "Enter RC Book No", type: 'government-id', value: FleetTable?.RCBookNo,
                filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter a valid RC Book Number (e.g., AB12-34CD-56EF-GH78)",
                        pattern: '^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}',
                    }
                ],
            },
            {
                name: 'registrationNo', label: 'Registration No', placeholder: 'Enter Registration No', type: 'text',
                value: FleetTable?.registrationNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Registration No is required"
                    },
                ],
            },
            {
                name: 'RegistrationDate', label: "Registration Date", placeholder: "", type: 'date',
                value: FleetTable.RegistrationDate, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Registration Date is required"
                    },
                ],
                additionalData: {
                    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    minDate: new Date("01 Jan 1900")
                }
                // additionalData: {
                //     maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
                //     minDate: new Date("01 Jan 1900")
                // }
            },
            {
                name: 'registrationScan', label: "Registration Scan", placeholder: "Enter Registration Scan",
                type: 'file', value: FleetTable.registrationScan, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Registration Scan is required"
                    },
                ],
                functions: {
                    onChange: 'selectedFileregistrationScan',
                },
                additionalData: {
                    isFileSelected: true
                },
            },
            {
                name: 'vehicleInsurancePolicy', label: "Vehicle Insurance Policy", placeholder: "Enter Vehicle Insurance Policy",
                type: 'text', value: FleetTable?.vehicleInsurancePolicy, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Insurance Policy is required"
                    },
                    {
                        // [Prefix]-[Policy Number]-[Suffix]
                        name: "pattern",
                        message: "Please enter a valid Vehicle Insurance Policy (e.g., VH-123456-01)",
                        pattern: "[A-Z]{2}-[0-9]{6}-[0-9]{02}"
                    },
                ],
            },
            {
                name: 'insuranceProvider', label: "Insurance Provider", placeholder: "Enter Insurance Provider",
                type: 'text', value: FleetTable?.insuranceProvider, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Insurance Provider is required"
                    },
                ],
            },
            {
                name: 'insuranceExpiryDate', label: "Insurance Expiry Date", placeholder: "Enter Insurance Expiry Date",
                type: 'date', value: FleetTable.insuranceExpiryDate, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Insurance Expiry Date is required"
                    },
                ],
                additionalData: {
                    minDate: new Date(), // Set the minimum date to the current date
                    maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
                }
            },
            {
                name: 'insuranceScan', label: "Insurance Scan", placeholder: "Enter Insurance Scan", type: 'file',
                value: FleetTable.insuranceScan, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Insurance Scan is required"
                    },
                ],
                functions: {
                    onChange: 'selectedFileinsuranceScan',
                },
                additionalData: {
                    isFileSelected: true
                },
            },
            {
                name: 'fitnessValidityDate', label: "Fitness Validity Date", placeholder: "", type: 'date',
                value: FleetTable.fitnessValidityDate, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Fitness Validity Date is required"
                    },
                ],
                additionalData: {
                    minDate: new Date(), // Set the minimum date to the current date
                    maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years
                }
            },
            {
                name: 'fitnesscertificateScan', label: "Fitness certificate Scan", placeholder: "Enter Fitness certificate Scan",
                type: 'file', value: FleetTable.fitnesscertificateScan, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Fitness certificate Scan is required"
                    },
                ],
                functions: {
                    onChange: 'selectedFilefitnesscertificateScan',
                },
                additionalData: {
                    isFileSelected: true
                },
            },
            {
                name: 'chassisNo', label: "Chassis No", placeholder: "Enter Chassis No", type: 'text',
                value: FleetTable?.chassisNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Chassis No is required"
                    },
                ],
            },
            {
                name: 'engineNo', label: "Engine No", placeholder: "Enter Engine No", type: 'text',
                value: FleetTable?.engineNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Engine No is required"
                    },
                    {
                        // [Manufacturer Code] [Plant Code] [Production Sequence]
                        name: "pattern",
                        message: "Please enter a valid Engine No (e.g., ABC123 456789)",
                        pattern: "[A-Z]{3}[0-9]{3} [0-9]{6}"
                    }
                ],
            },
            {
                name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: FleetTable?.activeFlag, generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: "_id",
                label: "",
                placeholder: "",
                type: "text",
                value: FleetTable._id,
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: 'cID',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: localStorage.getItem("companyCode"), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "eNTBY",
                label: "",
                placeholder: "",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: 'eNTDT',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: 'eNTLOC',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: localStorage.getItem("Branch"), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: 'mODDT',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "mODBY",
                label: "",
                placeholder: "",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: 'mODLOC',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: localStorage.getItem("Branch"), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            
            // {
            //     name: "companyCode",
            //     label: "Company Code",
            //     placeholder: "Company Code",
            //     type: "",
            //     value: parseInt(localStorage.getItem("companyCode")),
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false,
            // },
            // {
            //     name: 'updateDate',
            //     label: ' ',
            //     placeholder: ' ',
            //     type: 'date',
            //     value: new Date(), // Set the value to the current date
            //     filterOptions: '',
            //     autocomplete: '',
            //     displaywith: '',
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false
            // },
            // {
            //     name: "updateBy",
            //     label: "Update By",
            //     placeholder: "Update By",
            //     type: "text",
            //     value: localStorage.getItem("UserName"),
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false,
            // },
            // {
            //     name: "EntryBy",
            //     label: "",
            //     placeholder: "Update By",
            //     type: "text",
            //     value: localStorage.getItem("UserName"),
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false,
            // },
        ]
    }
    getFormControls() {
        return this.fleetDetailsControl;
    }
}
