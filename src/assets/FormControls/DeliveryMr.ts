import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DeliveryMrGeneration {
  deliveryMrControlArray: FormControls[];
  deliveryMrDetailsControlArray: FormControls[];
  deliveryMrPaymentModeArray: FormControls[];
  SummaryArray: FormControls[];
  CollectionDetails: FormControls[];
  BookingTimechargesArray: FormControls[];

  constructor() {
    this.deliveryMrControlArray = [
      {
        name: "ConsignmentNoteNumber",
        label: "Consignment Number",
        placeholder: "Enter Consignment Note Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Consignment Note Number is required",
          },
        ],
        functions: {
          onChange: "ValidateDocketNo",
        },
      },

      {
        name: "PayBasis",
        label: "Pay Basis",
        placeholder: "Pay Basis",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Consignor",
        label: "Consignor",
        placeholder: "Consignor",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ConsignorGST",
        label: "Consignor GST No.",
        placeholder: "Consignor GST No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Consignee",
        label: "Consignee",
        placeholder: "Consignee",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ConsigneeGST",
        label: "Consignee GST No.",
        placeholder: "Consignee GST No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "GSTApplicability",
        label: "GST Applicability",
        placeholder: "GST Applicability",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "package",
        label: "Package",
        placeholder: "Package",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "weight",
        label: "Weight",
        placeholder: "Weight",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "chargeweight",
        label: "Charge Weight",
        placeholder: "Charge Weight",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "bookingbranch",
        label: "Booking Branch",
        placeholder: "Booking Branch",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "mrdate",
        label: "MR Date",
        placeholder: "MR Date",
        type: "date",
        value: new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          maxDate: new Date(),
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "receivername",
        label: "Receiver Name",
        placeholder: "Receiver Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Receiver Name is required",
          },
        ],
      },
      {
        name: "mobileno",
        label: "Receiver Mobile no",
        placeholder: "Receiver Mobile no",
        type: "mobile-number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Receiver Mobile Number is required",
          },
        ],
      },
    ];
    this.deliveryMrDetailsControlArray = [
      {
        name: "newSubTotal",
        label: "NewSubTotal(₹)",
        placeholder: "newSubTotal",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "NewSubTotal is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
      },
    ];
    this.deliveryMrPaymentModeArray = [
      {
        name: "PaymentMode",
        label: "Payment Mode",
        placeholder: "Payment Mode",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions: {
          onSelection: "OnPaymentModeChange",
        },
        Validations: [
          {
            name: "required",
            message: "Payment Mode is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        },
      },
      {
        name: "ChequeOrRefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Cheque/Ref No is required",
          },
        ],
      },
      {
        name: "Bank",
        label: "Select Bank",
        placeholder: "Select Bank",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bank is required",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        },
        functions: {
          onOptionSelect: "setBankName",
        },
      },

      {
        name: "CashAccount",
        label: "Cash Account",
        placeholder: "Cash Account",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account is required",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: true,
          metaData: "Basic",
        },
      },
      {
        name: "Date",
        label: "Date",
        placeholder: "Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
    ];
    this.SummaryArray = [
      {
        name: "DocketNewTotal",
        label: "Docket New Total ₹",
        placeholder: "Docket New Total ₹",
        type: "number",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "DocketNewTotal",
        },
      },

      {
        name: "IGST",
        label: "IGST ₹",
        placeholder: "IGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "UGST",
        label: "UGST ₹",
        placeholder: "UGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "SGST",
        label: "SGST ₹",
        placeholder: "SGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Dockettotal",
        label: "Docket Total ₹",
        placeholder: "Docket Total ₹",
        type: "number",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Dockettotal",
        },
      },
      {
        name: "CGST",
        label: "CGST ₹",
        placeholder: "CGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "RoundOffAmount",
        label: "Round Off Amount ₹",
        placeholder: "",
        type: "number",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "RoundedOff",
        label: "Rounded Off ₹",
        placeholder: "",
        type: "number",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
    ];
    this.CollectionDetails = [
      {
        name: "CollectedAmount",
        label: "Collected Amount ₹",
        placeholder: "Collected Amount ₹",
        type: "number",
        value: 0.0,
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "CollectionMRNo",
        label: "Collection MR No",
        placeholder: "Collection MR No",
        type: "text",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "NewCollectionAmount",
        label: "Collection Amount ₹",
        placeholder: "Collection Amount ₹",
        type: "number",
        value: 0.0,
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "PendingAmount",
        label: "Pending Amount ₹",
        placeholder: "Pending Amount ₹",
        type: "number",
        value: 0.0,
        Validations: [],
        generatecontrol: false,
        disable: true,
      },
      // {
      //     name: 'BillingParty',
      //     label: 'Billing Party',
      //     placeholder: 'Billing Party',
      //     type: 'number',
      //     value: 0.00,
      //     Validations: [],
      //     generatecontrol: true,
      //     disable: true,
      // },
    ];
    this.BookingTimechargesArray = [
      {
        name: "or",
        label: "Booking Time charges Amount",
        placeholder: "Booking Time charges Amount",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "Edit Amount",
        placeholder: "Edit Amount",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "Difference Amount",
        placeholder: "Difference Amount",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "OldFreight",
        label: "Freight ₹",
        placeholder: "Freight ₹",
        type: "number",
        value: 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "NewFreight",
        label: "Freight ₹",
        placeholder: "Freight ₹",
        type: "number",
        value: 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "DiffFreight",
        label: "Freight ₹",
        placeholder: "Freight ₹",
        type: "number",
        value: 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
  }
  getDeliveryMrControls() {
    return this.deliveryMrControlArray;
  }
  getDeliveryMrDetailsControls() {
    return this.deliveryMrDetailsControlArray;
  }
  getDeliveryMrPaymentControls() {
    return this.deliveryMrPaymentModeArray;
  }
  getDeliveryMrBillingControls() {
    return this.SummaryArray;
  }
  getBookingTimecharges() {
    return this.BookingTimechargesArray;
  }
  getCollectionDetailsControls() {
    return this.CollectionDetails;
  }
}
