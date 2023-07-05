import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { customerModel } from "src/app/core/models/Masters/customerMaster";
export class customerControl {
    customerControlArray: FormControls[];
    billKycControlArray: FormControls[];
    constructor(customerTable: customerModel, isUpdate: boolean,
    ) {
        this.customerControlArray = [

            {
                name: 'groupCode', label: 'Group Code', placeholder: 'Group Code', type: 'dropdown',
                value: customerTable?.groupCode, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Group Code is required"
                    // },
                ],
                additionalData: {
                    showNameAndValue: true
                }
            },

            {
                name: 'customerCode', label: 'Customer Code', placeholder: 'Customer Code', type: 'text',
                value: customerTable?.customerCode, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Code is required"
                    // },
                ],
                
            },

            {
                name: 'customerName', label: 'Customer Name', placeholder: 'Customer Name', type: 'text',
                value: customerTable?.customerName, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Name is required"
                    // },
                ],
                
            },
            {
                name: 'customerPassword', label: 'Customer Password', placeholder: 'Customer Password', type: 'text',
                value: customerTable?.customerPassword, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Password is required"
                    // },
                ],
                
            },
            {
                name: 'customerAbbreviation', label: 'Customer Abbreviation', placeholder: 'Customer Abbreviation', type: 'text',
                value: customerTable?.customerAbbreviation, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Abbreviation is required"
                    // },
                ],
                additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'industry', label: 'Industry', placeholder: 'Industry', type: 'dropdown',
                value: customerTable?.industry, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Industry is required"
                    // },
                ],
                additionalData: {
                    showNameAndValue: true
                }
            },

            {
                name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: customerTable?.activeFlag, generatecontrol: true, disable: false,
                Validations: [],
               
            },
            {
                name: 'mobileService', label: 'Mobile Service', placeholder: '', type: 'toggle', value: customerTable?.mobileService, generatecontrol: true, disable: false,
                Validations: [],
                
            },
            {
                name: 'mobile', label: 'Mobile Number', placeholder: 'Mobile Number', type: 'text',
                value: customerTable?.mobile, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Password is required"
                    // },
                ],
                
            },

            {
                name: 'ownership', label: 'Type of Ownership', placeholder: 'Group Code', type: 'dropdown',
                value: customerTable?.ownership, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Type of Ownership is required"
                    // },
                ], 
                additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'customerControllingLocation', label: 'Customer Controlling Locations', placeholder: 'Group Code', type: 'multiselect',
                value: customerTable?.customerControllingLocation, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer Controlling Locations is required"
                    // },
                ],
                additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'customerLocation', label: 'Customer location', placeholder: 'Group Code', type: 'multiselect',
                value: customerTable?.customerLocation, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Customer location is required"
                    // },
                ], additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'nonOda', label: 'Customer Non-ODA Locations', placeholder: 'Group Code', type: 'multiselect',
                value: customerTable?.nonOda, generatecontrol: true, disable: false,
                Validations: [], 
                additionalData: {
                    showNameAndValue: true
                }
            },

            {
                name: 'telephone', label: "Telephone Number", placeholder: "Contact Number", type: 'text',
                value: customerTable?.telephone, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "pattern",
                    //     message: "Please enter 6 to 15 digit mobile number",
                    //     pattern: "^[0-9]{6,15}$",
                    // },
                    // {
                    //     name: "required"
                    // }
                ],
                
            },
            {
                name: 'email', label: 'Email', placeholder: 'Email', type: 'text',
                value: customerTable?.email, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Email is required"
                    // }
                ],
              
            },

            {
                name: 'website', label: 'Website', placeholder: 'Website', type: 'text',
                value: customerTable?.website, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Website is required"
                    // }
                ],
            },
            {
                name: 'partyType', label: 'Party Type', placeholder: 'Party Type', type: 'text',
                value: customerTable?.partyType, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Party Type is required"
                    // }
                ],
                
            },
            
        ],
            this.billKycControlArray = [
                {
                    name: 'gstNumber', label: 'GST Number', placeholder: 'GST Number ', type: 'text',
                    value: customerTable?.gstNumber, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'custBillName', label: 'Customer Billing Name', placeholder: 'Customer Billing Name', type: 'text',
                    value: customerTable?.custBillName, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'billAddress', label: 'Billing Address', placeholder: 'Billing Address', type: 'text',
                    value: customerTable?.billAddress, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'billCity', label: 'Billing City', placeholder: 'Billing City', type: 'text',
                    value: customerTable?.billCity, generatecontrol: true, disable: false,
                    Validations: [],
                   
                },

                {
                    name: 'billPincode', label: 'Billing Pincode', placeholder: 'Billing Pincode', type: 'text',
                    value: customerTable?.billPincode, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'sameAddres', label: 'Billing address same as customer address', placeholder: '', type: 'toggle', value: customerTable?.sameAddres, generatecontrol: true, disable: false,
                    Validations: [],
                   
                },
                {
                    name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', type: 'text', 
                    value: customerTable?.bankName, generatecontrol: true, disable: false,
                    Validations: [],
                },

                {
                    name: 'branch', label: 'Branch', placeholder: 'Branch', type: 'text', 
                    value: customerTable?.branch, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'bankAcct', label: 'Bank Account Number', placeholder: 'Bank Account Number', type: 'text', 
                    value: customerTable?.bankAcct, generatecontrol: true, disable: false,
                    Validations: [],
                },

                {
                    name: 'payBasis', label: "Pay basis", placeholder: "Pay basis", type: 'dropdown', value: customerTable?.payBasis,
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'serviceOpted', label: "Service Opted For", placeholder: "Service Opted For", type: 'dropdown', value: customerTable?.serviceOpted,
                    generatecontrol: true,
                    disable: false,
                    Validations: [ ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'consignorSite', label: 'Consignor Site Code Mandatory', placeholder: '', type: 'toggle', value: customerTable?.consignorSite, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },
                {
                    name: 'consigneeSite', label: 'Consignee Site Code Mandatory', placeholder: '', type: 'toggle', value: customerTable?.consigneeSite, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },
                {
                    name: 'pan', label: 'PAN Number', placeholder: 'PAN Number', type: 'text', 
                    value: customerTable?.pan, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'address', label: 'Addresss', placeholder: 'Address', type: 'text', 
                    value: customerTable?.address, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },

                {
                    name: 'city', label: 'City', placeholder: 'City', type: 'text', 
                    value: customerTable?.city, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },
                {
                    name: 'state', label: 'State', placeholder: 'State', type: 'text', 
                    value: customerTable?.state, generatecontrol: true, disable: false,
                    Validations: [],
                   
                },

                {
                    name: 'pincode', label: 'Pincode', placeholder: 'Pincode', type: 'text', 
                    value: customerTable?.pincode, generatecontrol: true, disable: false,
                    Validations: [],
                    
                },
            ]

    }

    getFormControlsC() {
        return this.customerControlArray;
    }

    getFormControlB() {
        return this.billKycControlArray;
    }
}