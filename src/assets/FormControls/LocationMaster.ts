import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { LocationMaster } from "src/app/core/models/Masters/LocationMaster";

export class LocationControl {
    LocationDetailControl: FormControls[];
    OtherDetailsControls: FormControls[];

    constructor(LocationTable: LocationMaster, IsUpdate: boolean) 
    {
        this.LocationDetailControl = 
        [
            {
                name: 'Loc_Level', label: "Location Hierarchy", placeholder: "Select location Hierarchy", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onModel: 'LocHierarchyChange',
                }
            },
            {
                name: 'Report_Level', label: "Reporting To", placeholder: "Select Reporting To", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onModel: 'LocReportingToChange',
                }
            },
            {
                name: 'Report_Loc', label: "Reporting Location", placeholder: "Select Reporting Location", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'LocCode', label: 'Location Code', placeholder: 'Enter Location Code', type: 'text', value: LocationTable.locCode, generatecontrol: true, disable: IsUpdate ? true : false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Code is required"
                    }
                    , {
                        name: "pattern",
                        message: "Please Enter A-Z Char Or 0-9 with no Space and Location Code should be limited to 5 characters",
                        pattern: "^[.a-zA-Z0-9,-]{0,5}$",
                    }
                ],
                functions: {
                    onChange: 'GetLocationExist',
                }
            },
            {
                name: 'LocName', label: 'Location Name', placeholder: 'Enter Location Name', type: 'text', value: LocationTable.locName, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Name is required"
                    }
                    , {
                        name: "pattern",
                        message: "Please Enter only text",
                        pattern: '^[a-zA-Z ]*$',
                    }
                ],
                functions:{
                    onChange:'GetLocationName'
                }
            },
            {
                name: 'LocPincode', label: 'Pincode', placeholder: 'Enter Pincode', type: 'number', value: LocationTable.locPincode, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Name is required"
                    }
                    , {
                        name: "pattern",
                        message: "Please enter 6 digit Pincode",
                        pattern: '^[1-9][0-9]{5}$',
                    }
                ]
            },
            {
                name: 'LocState', label: "State", placeholder: "Select State", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                // functions: {
                //     onModel: 'GetAllTimezone',
                // }
            },
            {
                name: 'LocCity', label: "City", placeholder: "Select City", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'LocAddr', label: 'Address', placeholder: 'Enter Location Address', type: 'text', value: LocationTable.locAddr, generatecontrol: true, disable: IsUpdate ? true : false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Address is required"
                    }
                ],

            },
            {
                name: 'LocTelno', label: "Telephone Number", placeholder: "Enter Telephone Number", type: 'number', value: LocationTable.locTelno, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 6 to 15 digit mobile number",
                        pattern: "^[0-9]{6,15}$",
                    },
                    {
                        name: "required",
                        message: "Telephone No is required"
                    }
                ]
            },
           
            {
                name: 'LocEmail', label: "Email", placeholder: "Enter Email Id", type: 'text', value: LocationTable.locEmail, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "email",
                        message: "Enter Valid Email ID!",
                    },
                    {
                        name: "required",
                        message: "Location Address is required"
                    }
                ]
            },
            {
                name: 'LocRegion', label: "Zone", placeholder: "Select zone", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Zone is required"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'TimezoneId', label: "Timezone", placeholder: "Select Timezone", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Zone is required"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false,
                }
            },
            {
                name: 'loc_startdt', label: 'Location Start Date', placeholder: 'Enter Location Start Date', type: 'date', value: LocationTable.loc_startdt, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Start Date is required"
                    },
                ],
                additionalData: {
                    minDate: new Date("01 Jan 1900")
                }
                ,functions: {
                    onDate: 'setLocationEndDate',
                }
            },
            {
                name: 'loc_enddt', label: 'Location End Date', placeholder: 'Enter Location End Date', type: 'date', value: LocationTable.loc_enddt, generatecontrol: true, disable: false,
                Validations: [],
                additionalData: {
                    minDate: ''
                },
            },
            {
                name: 'Ownership', label: "Location Ownership", placeholder: "Select Location Ownership", type: 'select',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                    {
                        name: "required",
                        message: "Location Ownership is required"
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                }
            },
            
            {
                name: 'ActiveFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: LocationTable.isActive, generatecontrol: true, disable: false,
                Validations: []
            },
            
            {
                name: 'UPDTBY', label: 'Update By', placeholder: 'Update By', type: 'text', value: localStorage.getItem("UserName"), filterOptions: '', autocomplete: '', displaywith: '', Validations: [], generatecontrol: false, disable: false
            },
            {
                name: 'CompanyCode', label: 'Company Code', placeholder: 'Company Code', type: 'text', value: localStorage.getItem("CompanyCode"), filterOptions: '', Validations: [], autocomplete: '', displaywith: '', generatecontrol: false, disable: false
            },
	    
        ],
	
	  this.OtherDetailsControls =
            [
                {
                    name: 'LocSTDCode', label: "STD Code", placeholder: "Enter STD Code", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'Locmobile', label: "Mobile No", placeholder: "Enter Mobile Number", type: 'number', value: LocationTable.locmobile, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter 6 to 15 digit mobile number",
                            pattern: "^[0-9]{6,15}$",
                        }
                    ]
                },
                {
                    name: 'ManagerName', label: 'Manager Name', placeholder: 'Enter Manager Name', type: 'text', value: LocationTable.managerName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphabets only ",
                            pattern: "^[.a-z A-Zs,-]+$",
                        }
                    ]
                },
               
                {
                    name: 'LocAlias', label: "Location Alias", placeholder: "Enter Location Alias", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },

                {
                    name: 'LocAlias', label: "ILS Address", placeholder: "Enter ILS Address", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'LocAlias', label: "ILS GST No", placeholder: "Enter ILS GST No", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'LocAlias', label: "ILS FSSAI No", placeholder: "Enter ILS FSSAI No", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'LocAlias', label: "Standard Address", placeholder: "Enter Standard Address", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'LocAlias', label: "Standard GST No", placeholder: "Enter Standard GST No", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
                {
                    name: 'LocAlias', label: "Standard FSSAI No", placeholder: "Enter Standard FSSAI No", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
                    Validations: []        
                  
                },
               

                {
                    name: 'CostCentre', label: "Cost Centre", placeholder: "Enter Cost Centre", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'Computersed', label: 'Computerised', placeholder: '', type: 'toggle', value: LocationTable.isActive, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'Cutoff', label: 'Cutoff Time Flag', placeholder: '', type: 'toggle', value: LocationTable.isActive, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'NextLoc', label: "Default Next Location", placeholder: "Select Default Next Location", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'PrevLoc', label: "Nearest Previous Location", placeholder: "Select Nearest Previous Location", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'ContLoc', label: "Delivery Control Location", placeholder: "Select Delivery Control Location", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'ContLoc', label: "Related Delivery Location", placeholder: "Select Related Delivery Location", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },

                {
                    name: 'Latitude', label: 'Latitude & Longitude', placeholder: 'Enter Latitude & Longitude', type: 'text', value: LocationTable.latitude.toString() + "," + LocationTable.longitude.toString(), generatecontrol: true, disable: false,
                    Validations: [],
                    functions: {
                        onClick: 'showMap',
                    }
                },
                {
                    name: 'Radius', label: 'Radius', placeholder: 'Enter Radius', type: 'text', value: LocationTable.radius, generatecontrol: true, disable: false,
                    Validations: [],
                },
                {
                    name: 'Longitude', label: 'Latitude & Longitude', placeholder: 'Latitude & Longitude', type: 'text', value: '', filterOptions: '', autocomplete: '', displaywith: '', Validations: [], generatecontrol: false, disable: false,
                    functions: {
                        onChange: 'RenderMap',
                    }
                },
            ]
    }
    getFormControlsLocation() {
        return this.LocationDetailControl;
    }
    getFormControlsOther() {
        return this.OtherDetailsControls;
    }
}


















// export class LocationControl {
//     LocationControlArray: FormControls[];
//     constructor(LocationTable: LocationMaster, IsUpdate: boolean) {
//         this.LocationControlArray = [
//             {
//                 name: 'Loc_Level', label: "Location Hierarchy", placeholder: "Select location Hierarchy", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 },
//                 functions: {
//                     onModel: 'LocHierarchyChange',
//                 }
//             },
//             {
//                 name: 'Report_Level', label: "Reporting To", placeholder: "Select Reporting To", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 },
//                 functions: {
//                     onModel: 'LocReportingToChange',
//                 }
//             },
//             {
//                 name: 'Report_Loc', label: "Reporting Location", placeholder: "Select Reporting Location", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 }
//             },
//             {
//                 name: 'LocCode', label: 'Location Code', placeholder: 'Enter Location Code', type: 'text', value: LocationTable.locCode, generatecontrol: true, disable: IsUpdate ? true : false,
//                 Validations: [
//                     {
//                         name: "required",
//                         message: "Location Code is required"
//                     }
//                     , {
//                         name: "pattern",
//                         message: "Please Enter A-Z Char Or 0-9 with no Space and Location Code should be limited to 5 characters",
//                         pattern: "^[.a-zA-Z0-9,-]{0,5}$",
//                     }
//                 ],
//                 functions: {
//                     onChange: 'GetLocationExist',
//                 }
//             },
//             {
//                 name: 'LocName', label: 'Location Name', placeholder: 'Enter Location Name', type: 'text', value: LocationTable.locName, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "required",
//                         message: "Location Name is required"
//                     }
//                     , {
//                         name: "pattern",
//                         message: "Please Enter only text",
//                         pattern: '^[a-zA-Z ]*$',
//                     }
//                 ],
//                 functions:{
//                     onChange:'GetLocationName'
//                 }
//             },
//             {
//                 name: 'LocPincode', label: 'Pincode', placeholder: 'Enter Pincode', type: 'number', value: LocationTable.locPincode, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "required",
//                         message: "Location Name is required"
//                     }
//                     , {
//                         name: "pattern",
//                         message: "Please enter 6 digit Pincode",
//                         pattern: '^[1-9][0-9]{5}$',
//                     }
//                 ]
//             },
//             {
//                 name: 'LocState', label: "State", placeholder: "Select State", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 },
//                 // functions: {
//                 //     onModel: 'GetAllTimezone',
//                 // }
//             },
//             {
//                 name: 'LocCity', label: "City", placeholder: "Select City", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 }
//             },
//             {
//                 name: 'LocAddr', label: 'Location Address', placeholder: 'Enter Location Address', type: 'text', value: LocationTable.locAddr, generatecontrol: true, disable: IsUpdate ? true : false,
//                 Validations: [
//                     {
//                         name: "required",
//                         message: "Location Address is required"
//                     }
//                 ],

//             },
//             {
//                 name: 'Locmobile', label: "Mobile", placeholder: "Enter Mobile Number", type: 'number', value: LocationTable.locmobile, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "pattern",
//                         message: "Please enter 6 to 15 digit mobile number",
//                         pattern: "^[0-9]{6,15}$",
//                     }
//                 ]
//             },
//             {
//                 name: 'LocSTDCode', label: "STD Code", placeholder: "Enter STD Code", type: 'text', value: LocationTable.locSTDCode, generatecontrol: true, disable: false,
//                 Validations: []        
              
//             },
//             {
//                 name: 'LocTelno', label: "Telephone Number", placeholder: "Enter Telephone Number", type: 'number', value: LocationTable.locTelno, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "pattern",
//                         message: "Please enter 6 to 15 digit mobile number",
//                         pattern: "^[0-9]{6,15}$",
//                     }
//                 ]
//             },
//             {
//                 name: 'LocEmail', label: "Email", placeholder: "Enter Email Id", type: 'text', value: LocationTable.locEmail, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "email",
//                         message: "Enter Valid Email ID!",
//                     }
//                 ]
//             },
//             {
//                 name: 'TimezoneId', label: "Timezone", placeholder: "Select Timezone", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false,
//                 }
//             },
//             {
//                 name: 'ManagerName', label: 'Manager Name', placeholder: 'Enter Manager Name', type: 'text', value: LocationTable.managerName, generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "pattern",
//                         message: "Please Enter alphabets only ",
//                         pattern: "^[.a-z A-Zs,-]+$",
//                     }
//                 ]
//             },
//             {
//                 name: 'LocRegion', label: "Zone", placeholder: "Select zone", type: 'select',
//                 value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
//                 Validations: [
//                     {
//                         name: "required",
//                         message: "Zone is required"
//                     },
//                     {
//                         name: "autocomplete",
//                     },
//                     {
//                         name: "invalidAutocomplete",
//                         message: "Choose proper value",
//                     }
//                 ],
//                 additionalData: {
//                     showNameAndValue: false
//                 }
//             },
//             {
//                 name: 'loc_startdt', label: 'Location Start Date', placeholder: 'Enter Location Start Date', type: 'date', value: LocationTable.loc_startdt, generatecontrol: true, disable: false,
//                 Validations: [],
//                 additionalData: {
//                     minDate: new Date("01 Jan 1900")
//                 }
//                 ,functions: {
//                     onDate: 'setLocationEndDate',
//                 }
//             },
//             {
//                 name: 'loc_enddt', label: 'Location End Date', placeholder: 'Enter Location End Date', type: 'date', value: LocationTable.loc_enddt, generatecontrol: true, disable: false,
//                 Validations: [],
//                 additionalData: {
//                     minDate: ''
//                 },
//             },
//             {
//                 name: 'Latitude', label: 'Latitude & Longitude', placeholder: 'Enter Latitude & Longitude', type: 'text', value: LocationTable.latitude.toString() + "," + LocationTable.longitude.toString(), generatecontrol: true, disable: false,
//                 Validations: [],
//                 functions: {
//                     onClick: 'showMap',
//                 }
//             },
//             {
//                 name: 'Radius', label: 'Radius', placeholder: 'Enter Radius', type: 'text', value: LocationTable.radius, generatecontrol: true, disable: false,
//                 Validations: [],
//             },
//             {
//                 name: 'ActiveFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: LocationTable.isActive, generatecontrol: true, disable: false,
//                 Validations: []
//             },
//             {
//                 name: 'Longitude', label: 'Latitude & Longitude', placeholder: 'Latitude & Longitude', type: 'text', value: '', filterOptions: '', autocomplete: '', displaywith: '', Validations: [], generatecontrol: false, disable: false,
//                 functions: {
//                     onChange: 'RenderMap',
//                 }
//             },
//             {
//                 name: 'UPDTBY', label: 'Update By', placeholder: 'Update By', type: 'text', value: localStorage.getItem("UserName"), filterOptions: '', autocomplete: '', displaywith: '', Validations: [], generatecontrol: false, disable: false
//             },
//             {
//                 name: 'CompanyCode', label: 'Company Code', placeholder: 'Company Code', type: 'text', value: localStorage.getItem("CompanyCode"), filterOptions: '', Validations: [], autocomplete: '', displaywith: '', generatecontrol: false, disable: false
//             },
//         ]
//     }
//     getFormControlsLocation() {
//         return this.LocationControlArray;
//     }
// }