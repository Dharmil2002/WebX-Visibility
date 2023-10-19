import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";


export class ConsignmentControl {
  private ConsignmentControlArray: FormControls[];
  private containordetail: FormControls[];
  private invoiceDetail: FormControls[];
  private ewayBillDetail: FormControls[];
  constructor(docketDetail) {
    this.ConsignmentControlArray = [
      {
        name: "docketNumber", label: "Consignment Note No", placeholder: "Consignment Note No", type: "text",
        value: docketDetail.docketNumber, filterOptions: "", autocomplete: "", displaywith: "", Validations: [], generatecontrol: true, disable: true,
        additionalData: {
          metaData: "Basic"
        },
      },
      {
        name: "docketDate",
        label: 'Consignment Note Date',
        placeholder: 'Consignment Note Date',
        type: "datetimerpicker",
        value: docketDetail.docketDate,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pickup Date is required",
          },
        ],
        additionalData: {
          minDate: new Date("01 Jan 2023"),
          maxDate: new Date(),
          metaData: "Basic"
        },
      },
      {
        name: "billingParty",
        label: "Billing Party",
        placeholder: "Billing Party",
        type: "dropdown",
        value: docketDetail.billingParty,
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Billing Party is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic"
        },
      },
      {
        name: "payType",
        label: "Payment Mode",
        placeholder: "Payment Mode",
        type: "Staticdropdown",
        value: [
          {
            value: "PAID",
            name: "PAID",
          },
          {
            value: "TBB",
            name: "TBB",
          },
          {
            value: "TO PAY",
            name: "TO PAY",
          },
          {
            value: "FOC",
            name: "FOC",
          },
        ],
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
        name: "origin",
        label: "Origin",
        placeholder: "Origin",
        type: "text",
        value: localStorage.getItem("Branch"),
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
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        functions: {
          onModel: "",
        },
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
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
        {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
        },
        {
            name: "autocomplete",
        },
        ],
        functions: {
          onModel: "getPincodeDetail",
          onOptionSelect: 'getLocBasedOnCity'
        },
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
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
          }
        ],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
      },
      {
        name: "prqNo",
        label: "Prq No",
        placeholder: "Prq No",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions: {
          onOptionSelect: 'prqSelection'
        },
        Validations: [
        {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
        },
        {
            name: "autocomplete",
        },
        ],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
      },
      {
        name: "transMode",
        label: "Transport Mode",
        placeholder: "Transport Mode",
        type: "Staticdropdown",
        value: [
          { value: "Air", name: "Air" },
          { value: "Road", name: "Road" },
          { value: "Rail", name: "Rail" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions: {
          onSelection: "disableSize"
        },
        Validations: [],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
      },
      {
        name: 'vendorType', label: 'Vendor Type', placeholder: 'Vendor Type', type: "Staticdropdown",

        value: [
          { value: "Own", name: "Own" },
          { value: "Attached", name: "Attached" },
          { value: "Rail", name: "Rail" },
          { value: "Market", name: "Market" },
          { value: "Service Provider", name: "Service Provider" }
        ], Validations: [], functions: {
          onSelection: "vendorFieldChanged"
        },
        additionalData: {
          metaData: "Basic"
        },
        generatecontrol: true, disable: false
      },
      {
        name: 'vendorName', label: 'Vendor Name', placeholder: 'Vendor Name', type: "dropdown",
        value: docketDetail.vendorName,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
          Validations: [  {
            name: "required",
            message: "Vendor Name is required",
          }],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        }
      },
      {
        name: 'pAddress', label: 'Pickup Address', placeholder: 'Pickup Address', type: 'text',
        value: docketDetail.pAddress, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'deliveryAddress', label: 'Delivery Address', placeholder: 'Delivery Address', type: 'text',
        value: docketDetail.deliveryAddress, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic"
        }
      },
      {
        name: 'pr_lr_no', label: 'PR LR No', placeholder: 'Printed LR No ', type: 'text',
        value: docketDetail.pr_lr_no, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'tran_day', label: 'Transit Day', placeholder: 'Transit Day Hour', type: 'dayhour',
        value: docketDetail.tran_day,
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'Transit hour',
          fieldName:"tran_hour"
        },
      },
      {
        name: 'packaging_type', label: 'Packaging Type', placeholder: 'Packaging Type', type: 'Staticdropdown',
        value: [], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'weight_in', label: 'Weight In', placeholder: 'Weight In', type: 'Staticdropdown',
        value: [{ "name": "Tons", "value": "Tons" },
        { "name": "Kgs", "value": "Kgs" },
        { "name": "Fixed", "value": "Fixed" }], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'cargo_type', label: 'Type of Cargo', placeholder: 'Type of Cargo', type: 'Staticdropdown',
        value: [
          { "name": "Volume Cargo", "value": "Volume Cargo" },
          { "name": "Weight Cargo", "value": "Weight Cargo" }
        ], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'gp_ch_del', label: 'GP/CH/Del', placeholder: 'GP/CH/Del', type: 'text',
        value: docketDetail.gp_ch_del, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'risk', label: 'Risk', placeholder: 'Risk', type: 'Staticdropdown',
        value: [
          { "name": "Carrier", "value": "carrier" },
          { "name": " Owner Risk", "value": "owner_risk," }
        ], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'delivery_type', label: 'Delivery Type', placeholder: 'Delivery Type', type: 'Staticdropdown',
        value: [
          { "name": "Godown Pickup - Godown Delivery", "value": "Godown Pickup - Godown Delivery" },
          { "name": "Godown Pickup - Door Delivery", "value": "Godown Pickup - Door Delivery" },
          { "name": "Door Pickup - Godown Delivery", "value": "Door Pickup - Godown Delivery" },
          { "name": "Door Pickup - Door Delivery", "value": "Door Pickup - Door Delivery" }
        ]
        , Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'rake_no', label: 'Rake', placeholder: 'Rake No', type: 'text',
        value: docketDetail.rake_no, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'issuing_from', label: 'Issuing From', placeholder: 'Rake No', type: 'Staticdropdown',
        value: [
          { "name": "None", "value": "None" },
          { "name": "Rail Head", "value": "Rail Head" },
          { "name": "Godown", "value": "Godown" }
        ], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'vehicleNo', label: 'Lorry No', placeholder: 'Lorry No', type: "dropdown",
        value: docketDetail.vehicleNo, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic",
        },
      },
      {
        name: "ccbp",
        label: "consignor and consignee are same as the billing party",
        placeholder: "",
        type: "toggle",
        value: docketDetail.ccbp,
        generatecontrol: true,
        disable: false,
        functions: { onChange: "onAutoBillingBased" },
        Validations: [],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        }
      },
      {
        name: "cd",
        label: "Container Detail",
        placeholder: "",
        type: "toggle",
        value: docketDetail.ccbp,
        generatecontrol: true,
        disable: false,
        functions: { onChange: "containerDetail" },
        Validations: [],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        }
      },
      {
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

        ],
        functions: {
          onOptionSelect: 'getConsignor'
        },
        additionalData: {
          showNameAndValue: true,
          metaData: "consignor",
        },
      },

      {
        name: 'ccontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'mobile-number',
        value: docketDetail.ccontactNumber, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignor",
        }
      },
      {
        name: 'calternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'mobile-number',
        value: docketDetail.calternateContactNo, Validations: [], generatecontrol: true,
        disable: false,
        additionalData: {
          metaData: "consignor",
        }
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

        ],
        functions: {
          onOptionSelect: 'getConsignee'
        },
        additionalData: {
          showNameAndValue: true,
          metaData: "consignee",
        },
      },
      {
        name: 'cncontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'text',
        value: docketDetail.cncontactNumber, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: 'cnalternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'text',
        value: docketDetail.cnalternateContactNo, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: 'companyCode',
        label: 'Company Code',
        placeholder: 'Company Code',
        type: 'text',
        value: localStorage.getItem("companyCode"),
        Validations: [],
        generatecontrol: false, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: 'status',
        label: 'status',
        placeholder: 'status',
        type: '',
        value: 0,
        Validations: [],
        generatecontrol: false, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: 'tran_hour',
        label: '',
        placeholder: '',
        type: '',
        value: docketDetail.tran_hour,
        Validations: [],
        generatecontrol: false, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      }
    ]
    this.containordetail = [
      {
        name: "containerNumber",
        label: "Container No",
        placeholder: "Container No",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Container No is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "containerType",
        label: "Container Type",
        placeholder: "Container Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Container Type is required",
        }],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: 'getContainerType'
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "containerCapacity",
        label: "Container Capacity",
        placeholder: "Container Capacity",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Container Capacity is required",
        }],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "Company_file",
        label: "Select File",
        placeholder: "",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [".xls, .xlsx, .csv"],
        functions: {
          onChange: "selectedFile",
        },
      },
     {
          name: "Download_Icon",
          label: "Dowload Containor Template",
          placeholder: "",
          type: "filelink",
          value: "assets/Download/temp-container.xlsx",
          generatecontrol: true,
          disable: false,
          Validations: [],
          functions: {
          },
        },
    ]
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
        Validations: [{
          name: "required",
          message: "Eway Bill No is required",
        }],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "expiryDate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Expiry Date is required",
        }],
        additionalData: {
          minDate: new Date()
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
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "invoiceAmount",
        label: "Invoice Amount (Rs)",
        placeholder: "Invoice Amount",
        type: "text",
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
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "noofPkts",
        label: "No of Package",
        placeholder: "No of Package",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "No of Package is required",
        }],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "materialName",
        label: "Material Name",
        placeholder: "Material Name",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Material Name is required",
        }],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "actualWeight",
        label: "Actual Weight (Kg)",
        placeholder: "Actual Weight",
        type: "text",
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
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "chargedWeight",
        label: "Charged Weight  (Kg)",
        placeholder: "Charged Weight",
        type: "text",
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
        },
        generatecontrol: true,
        disable: false,
      }
    ]

    this.ewayBillDetail = [
      {
        name: "ewayBillNo",
        label: "Eway Bill No",
        placeholder: "Eway Bill No",
        type: "mobile-number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Eway Bill No is required",
        }],
        generatecontrol: true,
        disable: false,
      }
    ]
  }
  getConsignmentControlControls() {
    return this.ConsignmentControlArray;
  }
  getContainerDetail() {
    return this.containordetail
  }

  getInvoiceDetail() {
    return this.invoiceDetail
  }
  getEwayBillDetail() {
    return this.ewayBillDetail;
  }
}

export class FreightControl {
  private FreightControlArray: FormControls[];
  constructor(docketDetail: DocketDetail) {
    this.FreightControlArray = [
      {
        name: 'freight_rate', label: 'Freight Rate (Rs)', placeholder: 'Freight Rate', type: 'mobile-number',
        value: docketDetail.freight_rate, Validations: [{
          name: "required",
          message: "Freight Rate is required",
        }

        ],
        functions: {
          onModel: "calculateFreight"
        },
        generatecontrol: true, disable: false
      },

      {
        name: 'freightRatetype', label: 'Freight Rate type', placeholder: 'Freight Rate type', type: 'Staticdropdown',
        value: [
          {
            "value": "F",
            "name": "Flat(In RS)"
          },
          {
            "value": "P",
            "name": "Per PKG"
          },
          {
            "value": "T",
            "name": "Per TON"
          },
          {
            "value": "W",
            "name": "Per KG"
          }
        ], Validations: [],
        functions: {
          onSelection: "calculateFreight"
        },
        generatecontrol: true, disable: false
      },
      {
        name: 'freight_amount', label: 'Frieght Amount (Rs)', placeholder: 'Freight Amount', type: 'mobile-number',
        value: docketDetail.freight_amount, Validations: [{
          name: "required",
          message: " Freight Amount is required",
        }
        ],
        functions: {
          onModel: "calculateGross"
        }
        ,
        generatecontrol: true, disable: false
      },
      {
        name: 'otherAmount', label: 'Other Amount (Rs)', placeholder: 'Other Amount', type: 'mobile-number',
        value: docketDetail.otherAmount, Validations: [], generatecontrol: true, functions: {
          onModel: "calculateGross"
        }, disable: false
      },
      {
        name: 'grossAmount', label: 'Gross Amount (Rs)', placeholder: 'Gross Amount', type: 'mobile-number',
        value: docketDetail.grossAmount, Validations: [], generatecontrol: true, disable: true
      },
      {
        name: 'rcm', label: 'RCM', placeholder: 'RCM', type: 'text',
        value: docketDetail.rcm, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstAmount', label: 'GST Amount (Rs)', placeholder: 'GST Amount', type: 'mobile-number',
        value: docketDetail.gstAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstChargedAmount', label: 'GST Charged Amount (Rs)', placeholder: 'GST Charged Amount', type: 'mobile-number',
        value: docketDetail.gstChargedAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'totalAmount', label: 'Total Amount (Rs)', placeholder: 'Total Amount', type: 'mobile-number',
        value: docketDetail.totalAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'companyCode',
        label: 'Company Code',
        placeholder: 'Company Code',
        type: 'text',
        value: localStorage.getItem("companyCode"),
        Validations: [],
        generatecontrol: false, disable: false
      }
    ]
  }
  getFreightControlControls() {
    return this.FreightControlArray;
  }
}

