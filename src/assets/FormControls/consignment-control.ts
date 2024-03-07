import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";
const today = new Date();
today.setHours(23, 59, 59, 999); // Set the time to the end of the day
let maxDate = today;
const yesterday = new Date(today); // Create a new date object with the current date and time
yesterday.setDate(today.getDate() - 1); // Set the date to one day before
// Set the time to the end of the day (23:59:59:999)
yesterday.setHours(23, 59, 59, 999);
let minDate = yesterday; // Now, maxDate holds the date for yesterday at the end of the day

export class ConsignmentControl {
  private ConsignmentControlArray: FormControls[];
  private containordetail: FormControls[];
  private invoiceDetail: FormControls[];
  private ewayBillDetail: FormControls[];
  private marketVehicle: FormControls[];
  constructor(docketDetail) {
    this.ConsignmentControlArray = [
      {
        name: "docketNumber", label: "Consignment Note No", placeholder: "Consignment Note No", type: "text",
        value: docketDetail?.docketNumber || 'System Generated', filterOptions: "", autocomplete: "", displaywith: "", Validations: [], generatecontrol: true, disable: true,
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
          maxDate: maxDate,
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
        functions: {
          onModel: "getCustomer",
          onOptionSelect: 'getPrqDetails'
        },
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic"
        },
      },
      {
        name: 'movementType', label: 'Cargo Type', placeholder: 'Cargo Type', type: 'Staticdropdown',
        value: [],
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: "payType",
        label: "Payment Mode",
        placeholder: "Payment Mode",
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
        functions: {
          onOptionSelect: 'getPrqDetails'
        },
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
          onModel: "getPincodeDetail",
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
          }, {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
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
        value: [],
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
        value: [], Validations: [], functions: {
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
        Validations: [{
          name: "required",
          message: "Vendor Name is required",
        },
        {
          name: "invalidAutocompleteObject",
          message: "Choose proper value",
        },
        {
          name: "autocomplete",
        }],
        functions: {
          onModel: 'getVendors',
          onOptionSelect: 'getVehicleFilter'
        },
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        }
      },
      {
        name: 'pAddress', label: 'Pickup Address', placeholder: 'Pickup Address', type: 'dropdown',
        value: docketDetail.pAddress, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'deliveryAddress', label: 'Delivery Address', placeholder: 'Delivery Address', type: 'dropdown',
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
          fieldName: "tran_hour"
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
        value: [], Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      // {
      //   name: 'cargo_type', label: 'Type of Cargo', placeholder: 'Type of Cargo', type: 'Staticdropdown',
      //   value: [
      //     { "name": "Volume Cargo", "value": "Volume Cargo" },
      //     { "name": "Weight Cargo", "value": "Weight Cargo" }
      //   ], Validations: [], generatecontrol: true, disable: false,
      //   additionalData: {
      //     metaData: "Basic",
      //   },
      // },
      {
        name: 'gp_ch_del', label: 'GP/CH/Del', placeholder: 'GP/CH/Del', type: 'text',
        value: docketDetail.gp_ch_del, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
        },
      },
      {
        name: 'risk', label: 'Risk', placeholder: 'Risk', type: 'Staticdropdown',
        value: [], Validations: [], generatecontrol: true, disable: false,
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
        },
      },
      // {
      //   name: 'rake_no', label: 'Rake', placeholder: 'Rake No', type: 'text',
      //   value: docketDetail.rake_no, Validations: [], generatecontrol: true, disable: false,
      //   additionalData: {
      //     metaData: "Basic",
      //   },
      // },
      // {
      //   name: 'issuing_from', label: 'Issuing From', placeholder: 'Rake No', type: 'Staticdropdown',
      //   value: [], Validations: [], generatecontrol: true, disable: false,
      //   additionalData: {
      //     metaData: "Basic",
      //   },
      // },
      {
        name: 'vehicleNo', label: 'Lorry No', placeholder: 'Lorry No', type: "dropdown",
        value: docketDetail.vehicleNo,
        Validations: [
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          }], generatecontrol: true, disable: false,
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic",
        },
      },
      {
        name: 'test',
        label: '',
        placeholder: '',
        type: '',
        value: '',
        Validations: [],
        generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic"
        }
      },
      {
        name: "cnbp",
        label: " Consignor same as Billing Party",
        placeholder: "",
        type: "toggle",
        value: docketDetail?.cnbp || false,
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
        name: "cnebp",
        label: "Consignee same as Billing Party",
        placeholder: "",
        type: "toggle",
        value: docketDetail?.cnebp || false,
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
        value: docketDetail?.cd || false,
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
        name: "cnoAddress",
        label: "Consignor Address",
        placeholder: "Consignor Address",
        type: "dropdown",
        value: docketDetail?.cAddress,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [

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
        value: docketDetail?.cgstno,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
            message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
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
        value: docketDetail.cncontactNumber, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: 'cnalternateContactNo', label: 'Alternate Contact No', placeholder: 'Alternate Contact No', type: 'mobile-number',
        value: docketDetail.cnalternateContactNo, Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "consignee"
        }
      },
      {
        name: "cneAddress",
        label: "Consignee Address",
        placeholder: "Consignee Address",
        type: "dropdown",
        value: docketDetail?.cAddress,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [

        ],
        functions: {
        },
        additionalData: {
          metaData: "consignee",
        },
      },
      {
        name: "cnegst",
        label: "Consignee GST Number",
        placeholder: "Consignee GST Number",
        type: "text",
        value: docketDetail?.cgstno,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
            message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
          }
        ],
        functions: {
        },
        additionalData: {
          metaData: "consignee",
        },
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
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [{
          name: "required",
          message: "Container No is required",
        },
        {
          name: "invalidAutocompleteObject",
          message: "Choose proper value",
        },
        {
          name: "autocomplete",
        }],
        generatecontrol: true,
        disable: false,
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: 'OnChnageContainerNumber'
        },
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
        },
        {
          name: "autocomplete",
        },
        {
          name: "invalidAutocompleteObject",
          message: "Choose proper value",
        },
        ],
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
        label: "Dowload Container Template",
        placeholder: "",
        type: "filelink",
        value: "assets/Download/temp-container.xlsx",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
        },
      },
      {
        name: "isEmpty",
        label: "Is Empty",
        placeholder: "Is Empty",
        type: "toggle",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: true,
        disable: false
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
        label: "Invoice Amount (₹)",
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
        label: "Actual Weight (MT)",
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
        label: "Charged Weight  (MT)",
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
    this.marketVehicle = [
      {
        name: "vehicleSize",
        label: "Vehicle Size (MT)",
        placeholder: "Vehicle Size",
        type: "Staticdropdown",
        value: [
          { value: "1", name: "1-MT" },
          { value: "9", name: "9-MT" },
          { value: "16", name: "16-MT" },
          { value: "32", name: "32-MT" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Vehicle Size is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: 'vMobileNo', label: "Vendor Mobile", placeholder: "Vendor Mobile", type: 'mobile-number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Vendor Mobile is required",
          },
        ],
      },
      {
        name: 'driver', label: "Driver", placeholder: "Driver", type: 'text',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver is required",
          },
        ],
      },
      {
        name: 'driverPan', label: "Pan No", placeholder: "Pan No", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
      },
      {
        name: 'lcNo', label: "Driving Licence No", placeholder: "Driving Licence No", type: 'government-id',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driving Licence   is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter alphanumeric License No",
            pattern: "^[A-Z]{2}[0-9]{13}$",
          }
        ],
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
        name: 'dmobileNo', label: "Driver Mobile No", placeholder: "Driver", type: 'mobile-number',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Driver is required",
          },
        ],
      },
      {
        name: 'ETA', label: "ETA", placeholder: "ETA", type: 'datetimerpicker',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "ETA   is required",
          },
        ],
        additionalData: {
          maxDate: maxDate,
          minDate: minDate
        },
      },
      {
        name: 'insuranceExpiryDate', label: "Insurance Expiry Date", placeholder: "Enter Insurance Expiry Date",
        type: 'date', value: "", generatecontrol: true, disable: false,
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
        name: 'fitnessValidityDate', label: "Fitness Validity Date", placeholder: "", type: 'date',
        value: "", generatecontrol: true, disable: false,
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
        name: 'vendCode',
        label: 'vendCode',
        placeholder: 'vendCode',
        type: '',
        value: "8888",
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'vendor', label: "Vendor Name", placeholder: "Vendor Name", type: '',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
        Validations: [
        ],
      },
      {
        name: 'companyCode', label: "Company Code", placeholder: "Company Code", type: '',
        value: localStorage.getItem("companyCode"), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
        Validations: [
        ],
      },
      {
        name: '_id', label: "_id", placeholder: "_id", type: '',
        value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: false, disable: false,
        Validations: [
        ],
      },
      {
        name: 'entryBy',
        label: 'Entry By',
        placeholder: 'Entry By',
        type: 'text',
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'entryDate',
        label: 'Entry Date',
        placeholder: 'Entry Date',
        type: 'text',
        value: new Date(),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'vehNo',
        label: 'Vehicle No',
        placeholder: 'Vehicle No',
        type: '',
        value: "",
        Validations: [],
        generatecontrol: false, disable: false
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
  getMarketVehicle() {
    return this.marketVehicle;
  }
}

export class FreightControl {
  private FreightControlArray: FormControls[];
  constructor(docketDetail: DocketDetail) {
    this.FreightControlArray = [
      {
        name: 'freight_rate', label: 'Freight Rate (₹)', placeholder: 'Freight Rate', type: 'mobile-number',
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
        value: [], Validations: [],
        functions: {
          onSelection: "calculateFreight"
        },
        generatecontrol: true, disable: false
      },
      {
        name: 'freight_amount', label: 'Frieght Amount (₹)', placeholder: 'Freight Amount', type: 'mobile-number',
        value: docketDetail.freight_amount, Validations: [{
          name: "required",
          message: " Freight Amount is required",
        }
        ],
        functions: {
          onChange: "calculateFreight"
        }
        ,
        generatecontrol: true, disable: false
      },
      {
        name: 'otherAmount', label: 'Other Amount (₹)', placeholder: 'Other Amount', type: 'mobile-number',
        value: docketDetail.otherAmount, Validations: [], generatecontrol: true, functions: {
          onChange: "calculateFreight"
        }, disable: false
      },
      {
        name: 'grossAmount', label: 'Gross Amount (₹)', placeholder: 'Gross Amount', type: 'mobile-number',
        value: docketDetail.grossAmount, Validations: [], generatecontrol: true, disable: true,
        functions: {
          onChange: "calculateFreight"
        },
      },
      {
        name: 'rcm', label: 'RCM', placeholder: 'RCM', type: 'text',
        value: docketDetail.rcm, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstAmount', label: 'GST Amount (₹)', placeholder: 'GST Amount', type: 'mobile-number',
        value: docketDetail.gstAmount, Validations: [], generatecontrol: true, disable: false
      },
      {
        name: 'gstChargedAmount', label: 'GST Charged Amount (₹)', placeholder: 'GST Charged Amount', type: 'mobile-number',
        value: docketDetail.gstChargedAmount, Validations: [], generatecontrol: true, disable: false,
        functions: {
          onChange: "calculateFreight"
        }
      },
      {
        name: 'totalAmount', label: 'Total Amount (₹)', placeholder: 'Total Amount', type: 'text',
        value: docketDetail.totalAmount, Validations: [], generatecontrol: true, disable: true
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
        name: "jobNo",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
        functions: {

        }
      },
    ]
  }
  getFreightControlControls() {
    return this.FreightControlArray;
  }
}

