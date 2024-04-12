import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
import { BaseControl } from "./base-control";
import * as StorageService from "src/app/core/service/storage.service";
import { StoreKeys } from "src/app/config/myconstants";
export class ConsignmentLtl extends BaseControl {
    private docketFields: FormControls[];
    private invoiceDetail: FormControls[];
    private freightDetails:FormControls[];
    private otherCharges:FormControls[];
    constructor(public generalService: GeneralService) {
        super(generalService, "LTL", ["ConsignmentLtl"]);
        this.docketFields = [
            {
                name: "docketNumber",
                label: `${DocCalledAs.Docket} No`,
                placeholder: `${DocCalledAs.Docket} No`,
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {
                    change: "DocketValidation",
                },
                additionalData:{
                    metaData: "Basic"
                }
            },
            {
                name: "docketDate",
                label: `${DocCalledAs.Docket} Date`,
                placeholder: `${DocCalledAs.Docket} Date`,
                type: "datetimerpicker",
                value: new Date(),
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: `${DocCalledAs.Docket} Date required`,
                    },
                ],
                functions: {
                    onDate: "changeInvoice"
                },
                additionalData: {
                    minDate: new Date(),
                    metaData: "Basic"
                }
            },
            {
                name: "prqNo",
                label: "Prq No",
                placeholder: "Prq NO",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                      name: "invalidAutocompleteObject",
                      message: "Choose proper value",
                    },
                    {
                      name: "autocomplete",
                    },
                  ],
                functions: {
                    onModel: "getPrqDetail",
                    onOptionSelect: 'prqSelection'
                  },
              additionalData:{
                     showNameAndValue: false,
                    metaData: "Basic"
                }
            },
            {
                name: "payType",
                label: "Payment Type",
                placeholder: "Payment Type",
                type: "Staticdropdown",
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Payment Type is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                },
            },
            {
                name: "billingParty",
                label: "Billing Party",
                placeholder: "Billing Party",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                functions: {
                    onModel: "getCustomer",
                },
                Validations: [
                    {
                        name: "required",
                        message: "Billing Party is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                additionalData: {
                    metaData: "Basic",
                    showNameAndValue: true,
                },
            },
            {
                name: "origin",
                label: "Origin",
                placeholder: "Origin",
                type: "text",
                value: StorageService.getItem(StoreKeys.Branch),
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
            },
            {
                name: "fromCity",
                label: "From City",
                placeholder: "From City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "From City is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                functions: {
                    onModel: "getPincodeDetail",
                    onOptionSelect: 'getPinCodeBasedOnCity'
                },
                additionalData: {
                    metaData: "Basic",
                    showNameAndValue: true,
                },
            },
       
            {
                name: "toCity",
                label: "To City",
                placeholder: "To City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "To City is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                functions: {
                    onModel: "getPincodeDetail",
                    onOptionSelect: 'getPinCodeBasedOnCity'
                },
                additionalData: {
                    metaData: "Basic",
                    showNameAndValue: true,
                },
            },
            {
                name: "destination",
                label: "Destination",
                placeholder: "Destination",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Destination is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                functions: {
                    onModel: "destionationDropDown"
                },
                additionalData: {
                    metaData: "Basic",
                    showNameAndValue: false,
                },
            },
            {
                name: "transMode",
                label: "Transport Mode",
                placeholder: "Transport Mode",
                type: "Staticdropdown",
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                functions: {
                    onSelection: "disableSize"
                },
                Validations: [
                    {
                        name: "required",
                        message: "Transport Mode is required",
                    }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                },
            },
            {
                name: 'pkgsType', label: 'Packaging Type', placeholder: 'Packaging Type', type: 'Staticdropdown',
                value: [], Validations: [], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "Basic",
                },
            },
            {
                name: 'risk', label: 'Risk', placeholder: 'Risk', type: 'Staticdropdown',
                value: [],   Validations: [
                    {
                        name: "required",
                        message: "Risk is required",
                    }], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "Basic",
                },
            },
            {
                name: 'delivery_type', label: 'Delivery Type', placeholder: 'Delivery Type', type: 'Staticdropdown',
                value: []
                , Validations: [], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "Basic",
                }
            },
            {
                name: 'spIns', label: 'Special Instructions', placeholder: 'Special Instructions', type: 'text',
                value: "", Validations: [], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "Basic"
                }
            },
            {
                name: 'contract', label: '', placeholder: '', type: '',
                value: "", Validations: [], generatecontrol: false, disable: false,
                additionalData: {
                    metaData: "Basic"
                }
            },
            {
                name: "cnbp",
                label: "Consignor same as Billing Party",
                placeholder: "",
                type: "toggle",
                value: false,
                generatecontrol: true,
                disable: false,
                functions: { onChange: "onAutoBillingBased" },
                Validations: [],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "custom"
                }
            },
          
            {
                name: "cnebp",
                label: "Consignee same as Billing Party",
                placeholder: "",
                type: "toggle",
                value: false,
                generatecontrol: true,
                disable: false,
                functions: { onChange: "onAutoBillingBased" },
                Validations: [],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "custom"
                }
            },
            {
                name: "f_vol",
                label: "Volumetric",
                placeholder: "Volumetric",
                type: "toggle",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                functions: { onChange: "getVolControls" },
                Validations: [
                ],
                additionalData: {
                    metaData: "custom"
                }
            },
            {
                name: "cnWinCsgn",
                label: "walk in",
                placeholder: "",
                type: "toggle",
                value: false,
                generatecontrol: false,
                disable: false,
                functions: { },
                Validations: [],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "custom"
                }
            },
            {
                name: "cnWinCsgne",
                label: "walk in",
                placeholder: "",
                type: "toggle",
                value: false,
                generatecontrol: false,
                disable: false,
                functions: {  },
                Validations: [],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "custom"
                }
            },
          , {
                name: 'consignorName', label: "Consignor Name",
                placeholder: "Consignor Name & Code",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Consignor Name is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                functions: {
                    onModel: "getCustomer",
                    onOptionSelect: 'getConsignor'
                },
                additionalData: {
                    showNameAndValue: true,
                    metaData: "consignor",
                },
                
            },
            {
                name: 'ccontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'mobile-number',
                value: "", Validations: [  {
                    name: "required",
                    message: "Contact Number is required",
                }], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "consignor",
                }
            },
            {
                name: 'calternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'mobile-number',
                value: "", Validations: [], generatecontrol: true,
                disable: false,
                additionalData: {
                    metaData: "consignor",
                }
            },
            {
                name: "cnoAddress",
                label: "Consignor Address",
                placeholder: "Consignor Address",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Consignor Address is required",
                    }
                ],
                functions: {
                },
                additionalData: {
                    metaData: "consignor",
                },
            },
            {
                name: "cnogst",
                label: "Consignor GST Number",
                placeholder: "Consignor GST Number",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
                        message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
                    },
                    {
                        name: "required",
                        message: "Consignor GST Number is required",
                    }
                ],
                functions: {
                },
                additionalData: {
                    metaData: "consignor",
                },
            },
            {
                name: "consigneeName",
                label: "Consignee Name",
                placeholder: "Consignee Name",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Consignee Name is required",
                    },
                    { name: "autocomplete" },
                    { name: "invalidAutocompleteObject", message: "Choose proper value" }
                ],
                functions: {
                    onModel: "getCustomer",
                    onOptionSelect: 'getConsignee'
                },
                additionalData: {
                    showNameAndValue: true,
                    metaData: "consignee",
                },
            },
            {
                name: 'cncontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'mobile-number',
                value: "", Validations: [ {
                    name: "required",
                    message: "Contact Number is required",
                },], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "consignee"
                }
            },
            {
                name: 'cnalternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'mobile-number',
                value: "", Validations: [], generatecontrol: true, disable: false,
                additionalData: {
                    metaData: "consignee"
                }
            },
            {
                name: "cneAddress",
                label: "Consignee Address",
                placeholder: "Consignee Address",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Consignee Address is required",
                    }
                ],
                functions: {
                },
                additionalData: {
                    metaData: "consignee"
                },
            },
            {
                name: "cnegst",
                label: "Consignee GST Number",
                placeholder: "Consignee GST Number",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
                        message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
                    },
                    {
                        name: "required",
                        message: "Consignee GST Number",
                    }
                ],
                functions: {
                },
                additionalData: {
                    metaData: "consignee",
                },
            }
        ];
        this.invoiceDetail = [
            {
                name: "ewayBillNo",
                label: "Eway Bill No",
                placeholder: "Eway Bill No",
                type: "mobile-number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                maxlength: 12,
                Validations: [],
                functions:{
                 
                },
                additionalData: {
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "billDate",
                label: "Eway Bill Date",
                placeholder: "Eway Bill Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "expiryDate",
                label: "Eway Bill Expiry Date",
                placeholder: "Eway Bill Expiry Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "invoiceNo",
                label: "Invoice No",
                placeholder: "Invoice No",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Invoice No is required",
                }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                functions:{
                    "onChange":"checkInvoiceExist"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "invoiceDate",
                label: "Invoice Date",
                placeholder: "Invoice Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Eway Bill Date is required",
                }],
                additionalData: {
                    maxDate: new Date(),
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "cftRatio",
                label: "CFT Ratio",
                placeholder: "CFT Ratio",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "CFT Ratio is required",
                }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "volumetric"
                },
                functions:{
                    "onChange":"calucateCft"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "length",
                label: "Length",
                placeholder: "Length",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Length is required",
                }],
                functions:{
                    "onChange":"calucateCft"
                },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "volumetric"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "breadth",
                label: "Breadth",
                placeholder: "Breadth",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "breadth is required",
                }],
                functions:{
                    "onChange":"calucateCft"
                },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "volumetric"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "height",
                label: "Height",
                placeholder: "Height",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "breadth is required",
                }],
                functions:{
                    "onChange":"calucateCft"
                },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "volumetric"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "invoiceAmount",
                label: "Invoice Amount (₹)",
                placeholder: "Invoice Amount",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Invoice Amount is required",
                }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                functions: {
                    onModel: "preventNegative"
                  },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "cubWT",
                label: "Cubic Weight",
                placeholder: "Cubic Weight",
                type: "number",
                value: "0.00",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                functions: {
                    onModel: "preventNegative"
                  },
                generatecontrol: true,
                disable: true,
            },
            {
                name: "cft",
                label: "CFT Total",
                placeholder: "CFT Total",
                type: "text",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "volumetric"
                },
                functions: {
                    onModel: ""
                  },
                generatecontrol: true,
                disable: true
            },
            {
                name: "noOfPackage",
                label: "No Of Package",
                placeholder: "No Of Package",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "No of Package is required",
                }],
                functions: {
                    keypress: "integerOnly",
                    onChange:"calucateCft"
                  },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            
            {
                name: "materialName",
                label: "Material Name",
                placeholder: "Material Name",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "actualWeight",
                label: "Actual Weight (Kg)",
                placeholder: "Actual Weight (Kg)",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Actual Weight is required",
                }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                functions: {
                    onModel: "preventNegative"
                  },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "chargedWeight",
                label: "Charged Weight (Kg)",
                placeholder: "Charged Weight (Kg)",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "required",
                    message: "Charged Weight is required",
                }],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                functions: {
                    onModel: "preventNegative"
                  },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "materialDensity",
                label: "Material Density",
                placeholder: "Material Density",
                type: "Staticdropdown",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                value:[
                    {name:"Solid",value:"Solid"},
                    {name:"Bulky",value:"Bulky"},
                    {name:"Normal",value:"Normal"}
                ],
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "invoiceDetail"
                },
                generatecontrol: true,
                disable: false,
            }
        ]
        this.freightDetails = [
            {
                name: 'freight_rate', label: 'Freight Rate (₹)', placeholder: 'Freight Rate', type: 'mobile-number',
                value: "", Validations: [{
                    name: "required",
                    message: "Freight Rate is required",
                }
                ],
                additionalData: {
                    metaData: "freightDetails"
                },
                functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'freightRatetype', label: 'Freight Rate type', placeholder: 'Freight Rate type', type: 'Staticdropdown',
                value: [], Validations: [],
                functions: {
                    onSelection: "calculateFreight"
                },
                additionalData: {
                    metaData: "freightDetails"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'freight_amount', label: 'Frieght Amount (₹)', placeholder: 'Freight Amount', type: 'mobile-number',
                value: "", Validations: [{
                    name: "required",
                    message: " Freight Amount is required",
                }
                ],
                functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                },
                additionalData: {
                    metaData: "freightDetails"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'otherAmount', label: 'Other Amount (₹)', placeholder: 'Other Amount', type: 'mobile-number',
                value: 0.00, Validations: [], generatecontrol: true, functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                },
                additionalData: {
                    metaData: "freightDetails"
                },
                 disable: false
            },
            {
                name: 'grossAmount', label: 'Gross Amount(₹)', placeholder: 'Gross Amount', type: 'mobile-number',
                value: 0.00, Validations: [], generatecontrol: true, disable: true,
                additionalData: {
                    metaData: "freightDetails"
                },
                functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                },
            },
            {
                name: "rcm",
                label: "RCM",
                placeholder: "RCM",
                type: "Staticdropdown",
                value: [
                    {name:"Yes",value:"Y"},
                    {name:"No",value:"N"}
                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                functions: {
                },
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "freightDetails"
                },
            },
            {
                name: 'gstAmount', label: 'GST Amount (₹)', placeholder: 'GST Amount', type: 'mobile-number',
                value:0.00, Validations: [],  
                functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                },
                additionalData: {
                    metaData: "freightDetails"
                },generatecontrol: true, disable: false
            },
            {
                name: 'gstChargedAmount', label: 'GST Charged Amount (₹)', placeholder: 'GST Charged Amount', type: 'mobile-number',
                value:0.00, Validations: [],
                additionalData: {
                    metaData: "freightDetails"
                }, generatecontrol: true, disable: false,
                functions: {
                    onModel: "preventNegative",
                    onChange: "calculateFreight"
                }
            },
            {
                name:'totAmt',label:'Grand Total Amount(₹)', placeholder: 'Grand Total Amount', type: 'number',
                value:0.00, Validations: [],
                additionalData: {
                    metaData: "freightDetails"
                }, generatecontrol: true, disable: true
            }
        ]
        this.otherCharges = [
            {
                name: 'cust_ref_no', label: 'Customer Ref No.', placeholder: 'Customer Ref No.', type: 'text',
                value: "", Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'orderNo', label: 'Order No./PO No.', placeholder: 'Customer Ref No.', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'invoiceAttech', label: 'Invoice Attachment', placeholder: 'Invoice Attachment', type: 'file',
                value: "", 
                Validations: [],
                additionalData:{
                    isFileSelected:false
                },
                functions: {
                    onChange: 'getFileInvoice',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'policyNo', label: 'Policy No.', placeholder: 'Policy No.', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'supplyPlant', label: 'Supply Plant', placeholder: 'Supply Plant', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'policyDate', label: 'Policy Date', placeholder: 'Policy Date', type: 'date',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            
            {
                name: 'invoiceCompany', label: 'Insurance Company', placeholder: 'Insurance Company', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'busAssociate', label: 'Business Associates', placeholder: 'Business Associates', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: true
            },
            {
                name: 'remarks', label: 'Remarks', placeholder: 'Remarks', type: 'text',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'local', label: 'Local GCN', placeholder: 'Local GCN', type: 'toggle',
                value: "", 
                Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'cod', label: 'COD', placeholder: 'COD', type: 'toggle',
                value: "", Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'dod', label: 'DOD', placeholder: 'DOD', type: 'toggle',
                value: "", Validations: [],
                additionalData: {
                },
                functions: {
                },
                generatecontrol: true, disable: false
            },
        ]
    }
    getInvoiceDetail() {
        return this.invoiceDetail
    }
    getFreightDetail() {
        return this.freightDetails
    }
    getDocketFieldControls() {
        return this.docketFields;
    }
    getOtherDetails() {
        return this.otherCharges
    }
}