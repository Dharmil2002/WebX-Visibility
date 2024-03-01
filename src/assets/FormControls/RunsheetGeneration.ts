import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RunSheetControl {
    private RunSheetControlArray: FormControls[];
    constructor() {
        this.RunSheetControlArray = [
            {
              name: "RunSheetID",
              label: "Run Sheet ID",
              placeholder: "System Generated",
              type: "text",
              value:"System Generated",
              generatecontrol: true,
              disable: true,
              Validations: [
              ]
            },
             {
                name: 'Cluster',
                label: 'Cluster',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Vehicle",
                label: "Vehicle",
                placeholder: '',
                type: "dropdown",
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Vehicle is required",
                  },
                ],
                additionalData: {
                  showNameAndValue: false,
                },
                functions:{
                  onOptionSelect:'getVehicleDetails',
                  onChange:'checkIsMarketVehicle'
                  //"onChange":""
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'VehType',
                label: 'Vehicle Type',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Vehicle Type is required",
                  },
                ],
                generatecontrol: true, disable: true
            },
            {
                name: "Vendor",
                label: "Vendor",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Vendor is required",
                  }
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'VenType',
                label: 'Vendor Type',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Vendor Type is required",
                  }
                ],
                generatecontrol: true,
                disable: true
            }
            ,
            {
                name: 'vendPan',
                label: 'Vendor Pan Number',
                placeholder: '',
                type: 'government-id',
                value: '',
                Validations: [
                    {
                      name: "required",
                      message: "Pan No is required",
                    },
                    {
                      name: "pattern",
                      pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
                      message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
                    },
                  ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'driverNm',
                label: 'Driver Name',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Driver Name is required",
                  }
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'driverMobile',
                label: 'Driver Mobile No',
                placeholder: '',
                type: 'mobile-number',
                value: '',
                Validations: [
                  {
                    name: "required",
                    message: "Driver Mobile No is required",
                  }
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'lsNo',
                label:"Driving Licence No",
                placeholder: '',
                type: 'government-id',
                value: '',
                Validations: [
                    {
                      name: "required",
                      message: "License No  is required",
                    },
                    {
                      name: "pattern",
                      message:
                        "Please Enter alphanumeric License No e.g(AB1234567890123)",
                      pattern: "^[A-Z]{2}[0-9]{13}$",
                    }
                  ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'lcExpireDate', label: "Driving Licence Expiry Date", placeholder: "Driving Licence Expiry Date", type: 'date',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                  {
                    name: "required",
                    message: "Driving Licence Expiry Date  is required",
                  },
                ],
                additionalData: {
                  minDate: new Date()
                },
              },
            {
                name: 'CapacityKg',
                label: 'Capacity KG',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }
            ,
            {
                name: 'CapVol',
                label: 'Capacity Volume CFT',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'LoadKg',
                label: 'Loaded KG',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'LoadVol',
                label: 'Loaded Volume CFT',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            }
            ,
            {
                name: 'WeightUti',
                label: 'Weight Utilization',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'VolUti',
                label: 'Volume Utilization',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
              name: "deliveryType",
              label: "",
              placeholder: "",
              type: "radiobutton",
              value: [
                //  {value: "Pickup ",name: "Pickup"},
                // { value: "Delivery", name: "Delivery", checked: true },
              ],
              Validations: [],
              generatecontrol: true,
              disable: true,
              functions: {
                  // onChange:'SelectAccountCode'
              },
            },
            // {
            //     name: 'Pickup',
            //     label: 'Pickup',
            //     placeholder: '',
            //     type: 'toggle',
            //     value: '',
            //     Validations: [],
            //     generatecontrol: true,
            //     disable: false
            // }
            // ,
            // {
            //     name: 'Delivery',
            //     label: 'Delivery',
            //     placeholder: '',
            //     type: 'toggle',
            //     value: '',
            //     Validations: [],
            //     generatecontrol: true,
            //     disable: false
            // }
        ];
    }
    RunSheetFormControls() {
        return this.RunSheetControlArray;
    }

}
