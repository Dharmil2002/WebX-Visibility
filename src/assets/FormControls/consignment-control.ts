import { FormControls } from "src/app/Models/FormControl/formcontrol";


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
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Billing Party is required",
          }
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
        value: docketDetail.origin,
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
        ],
        functions: {
          onOptionSelect: 'getLocBasedOnCity'
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
        ],
        functions: {
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
        type: "text",
        value: docketDetail.destination,
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
          { value: "Market", name: "Market" }
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
        Validations: [
        ],
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
        additionalData: {
          showNameAndValue: true,
          metaData: "consignor",
        },
      },

      {
        name: 'ccontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'text',
        value: docketDetail.ccontactNumber, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignor",
        }
      },
      {
        name: 'calternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'text',
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
        name: 'vehicleNo',
        label: 'vehicleNo',
        placeholder: 'vehicleNo',
        type: '',
        value: docketDetail.vehicleNo,
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
      }
    ]
    this.containordetail = [
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
    ]
    this.invoiceDetail = [
      {
        name: "ewayBillNo",
        label: "Eway Bill No",
        placeholder: "Eway Bill No",
        type: "text",
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
        type: "text",
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
      },
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
  constructor(docketDetail) {
    this.FreightControlArray = [
      {
        name: 'freightAmount', label: 'Freight Amount (Rs)', placeholder: 'Freight Amount', type: 'text',
        value: docketDetail.freightAmount, Validations: [{
          name: "required",
          message: "Secret Freight Amount is required",
        }
        ], generatecontrol: true, disable: false
      },
      {
        name: 'freightRatetype', label: 'Freight Rate type', placeholder: 'Freight Rate type', type: 'Staticdropdown',
        value: [
          {
            "value": "B",
            "name": "Per Pcs"
          },
          {
            "value": "D",
            "name": "Per KG Per KM"
          },
          {
            "value": "F",
            "name": "Flat(In RS)"
          },
          {
            "value": "I",
            "name": "% of Invoice Value"
          },
          {
            "value": "K",
            "name": "Per KM"
          },
          {
            "value": "L",
            "name": "Per Liter"
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
          },
          {
            "value": "Y",
            "name": "Per TON Per KM"
          }
        ], Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'otherAmount', label: 'Other Amount (Rs)', placeholder: 'Other Amount', type: 'text',
        value: docketDetail.otherAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'grossAmount', label: 'Gross Amount (Rs)', placeholder: 'Gross Amount', type: 'text',
        value: docketDetail.grossAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'rcm', label: 'RCM', placeholder: 'RCM', type: 'text',
        value: docketDetail.rcm, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstAmount', label: 'GST Amount (Rs)', placeholder: 'GST Amount', type: 'text',
        value: docketDetail.gstAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstChargedAmount', label: 'GST Charged Amount (Rs)', placeholder: 'GST Charged Amount', type: 'text',
        value: docketDetail.gstChargedAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'totalAmount', label: 'Total Amount (Rs)', placeholder: 'Total Amount', type: 'text',
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

