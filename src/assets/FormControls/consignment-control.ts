import { FormControls } from "src/app/Models/FormControl/formcontrol";


export class ConsignmentControl {
  private ConsignmentControlArray: FormControls[];
  private containordetail: FormControls[];
  private invoiceDetail: FormControls[];
  constructor() {
    this.ConsignmentControlArray = [
      {
        name: "docketNumber", label: "Consignment Note No", placeholder: "Consignment Note No", type: "text",
        value: "System Generated", filterOptions: "", autocomplete: "", displaywith: "", Validations: [], generatecontrol: true, disable: true,
      },
      {
        name: "docketDate",
        label: 'Consignment Note Date',
        placeholder: 'Consignment Note Date',
        type: "datetimerpicker",
        value: "",
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
          minDate: new Date(),
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
        Validations: [
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: true,
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
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: false,
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
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: false,
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
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: false,
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
        },
      },
      {
        name: "containerSize",
        label: "Container Size",
        placeholder: "Container Size",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: 'containerNumber', label: 'Container Number', placeholder: 'Container Number', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'vendorType', label: 'Vendor Type', placeholder: 'Vendor Type', type: "Staticdropdown",
        value: [
          { value: "Own", name: "Own" },
          { value: "Attached", name: "Attached" },
          { value: "Service Provider", name: "Rail" },
          { value: "Market", name: "Market" }
        ], Validations: [], functions: {
          onSelection: "vendorFieldChanged"
        }, generatecontrol: true, disable: false
      },
      {
        name: 'vendorName', label: 'Vendor Name', placeholder: 'Vendor Name', type: "dropdown",
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
        },
      },
      {
        name: "ccbp",
        label: "consignor and consignee are same as the billing party",
        placeholder: "",
        type: "toggle",
        value: "",
        generatecontrol: true,
        disable: false,
        functions: { onChange: "onAutoBillingBased" },
        Validations: [],
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
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: 'pAddress', label: 'Pickup Address', placeholder: 'Pickup Address', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'ccontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'calternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
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
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: 'deliveryAddress', label: 'Delivery Address', placeholder: 'Delivery Address', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'cncontactNumber', label: 'Contact Number', placeholder: 'Contact Number', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'cnalternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'companyCode',
        label: 'Company Code',
        placeholder: 'Company Code',
        type: 'text',
        value: localStorage.getItem("companyCode"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'vehicleNo',
        label: 'vehicleNo',
        placeholder: 'vehicleNo',
        type: '',
        value: "",
        Validations: [],
        generatecontrol: false, disable: false
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
        Validations: [],
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
        Validations: [],
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
        Validations: [],
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
        Validations: [],
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
        Validations: [],
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
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "invoiceAmount",
        label: "Invoice Amount",
        placeholder: "Invoice Amount",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "noofPkts",
        label: "No of Pkts",
        placeholder: "No of Pkts",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
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
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "actualWeight",
        label: "Actual Weight",
        placeholder: "Actual Weight",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "chargedWeight",
        label: "Charged Weight",
        placeholder: "Charged Weight",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          showNameAndValue: false,
        },
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

}

export class FreightControl {
  private FreightControlArray: FormControls[];
  constructor() {
    this.FreightControlArray = [
      {
        name: 'freightAmount', label: 'Freight Amount', placeholder: 'Freight Amount', type: 'text',
        value: '', Validations: [{
          name: "required",
          message: "Secret Freight Amount is required",
        }
        ], generatecontrol: true, disable: false
      },
      {
        name: 'freightRatetype', label: 'Freight Rate type', placeholder: 'Freight Rate type', type: 'Staticdropdown',
        value:[
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
        name: 'otherAmount', label: 'Other Amount', placeholder: 'Other Amount', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'grossAmount', label: 'Gross Amount', placeholder: 'Gross Amount', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'rcm', label: 'RCM', placeholder: 'RCM', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstAmount', label: 'GST Amount', placeholder: 'GST Amount', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstChargedAmount', label: 'GST Charged Amount', placeholder: 'GST Charged Amount', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'totalAmount', label: 'Total Amount', placeholder: 'Total Amount', type: 'text',
        value: '', Validations: [], generatecontrol: true, disable: false
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
