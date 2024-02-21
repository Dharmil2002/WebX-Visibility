import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export class UpdateShipmentsControl {
  private editShipment: FormControls[];
  editDetail: any[];
  constructor(storage, shipmentDetails) {
    this.editShipment = [
      {
        name: "customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value: `${shipmentDetails?.extraData.bPARTY}:${shipmentDetails?.extraData.bPARTYNM}` || "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "origin",
        label: "Location",
        placeholder: "Location",
        type: "text",
        value: shipmentDetails?.location || "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "shipment",
        label: "Shipment ",
        placeholder: "Shipment ",
        type: "text",
        value: shipmentDetails?.extraData.docNo || "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
        },
      },
      {
        name: "State",
        label: "State",
        placeholder: "State",
        type: "text",
        value: shipmentDetails?.state || "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        additionalData: {
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {

        },
      },
      {
        name: "bookingDate",
        label: "Booking date",
        placeholder: "Booking date",
        type: "text",
        value: formatDocketDate(shipmentDetails?.extraData.dKTDT || new Date()),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          isFileSelected: true
        },
        functions: {}
      },
      {
        name: "vehicleNo",
        label: "Vehicle No.",
        placeholder: "Vehicle No.",
        type: "text",
        value: shipmentDetails?.extraData?.vEHNO || "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "location",
        label: "Edit location",
        placeholder: "Edit location",
        type: "text",
        value: localStorage.getItem("Branch"),
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
        },
        functions: {
        },
      },
      {
        name: "datetime",
        label: "Date and time",
        placeholder: "Expiry Date",
        type: "text",
        value: formatDocketDate(new Date().toISOString()),
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          // minDate: new Date(), // Set the minimum date to the current date
          //maxDate: new Date(((new Date()).getFullYear() + 20), 11, 31) // Allow selection of dates in the current year and future years

        },
        functions: {
          onDate: "",
        },
      },
      {
        name: "editBy",
        label: "Edited by",
        placeholder: "Edited by",
        type: "text",
        value: storage.userName,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "gst",
        label: "gst",
        placeholder: "gst",
        type: "text",
        value: shipmentDetails?.extraData?.gSTAMT || 0,
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "gROAMT",
        label: "gROAMT",
        placeholder: "gROAMT",
        type: "text",
        value: shipmentDetails?.extraData?.gROAMT || 0.00,
        generatecontrol: false,
        disable: true,
        Validations: [],
      }

    ];
    this.editDetail = [
      {
        id: 1,
        name: "or",
        label: "Entered Value",
        placeholder: "Entered Value",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 2,
        name: "or",
        label: "Edit Value",
        placeholder: "Edit Value",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 3,
        name: "eNoOfPackage",
        label: "Number of packages",
        placeholder: "Number of packages",
        type: "text",
        value: shipmentDetails?.extraData.pKGS || 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 4,
        name: "eDNoOfPackage",
        label: "Number of packages",
        placeholder: shipmentDetails?.extraData.pKGS || 0,
        type: "text",
        value: shipmentDetails?.extraData.pKGS || 0,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        id: 5,
        name: "eWeight",
        label: "Weight(Kg)",
        placeholder: shipmentDetails?.extraData.cHRWT || 0,
        type: "text",
        value: shipmentDetails?.extraData.cHRWT || 0,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        id: 6,
        name: "eDWeight",
        label: "Weight(Kg)",
        placeholder: shipmentDetails?.extraData.cHRWT || 0,
        type: "text",
        value: shipmentDetails?.extraData.cHRWT || 0,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        id: 7,
        name: "eFreightType",
        label: "Freight Rate Type",
        placeholder: "Freight Rate  Type",
        type: "text",
        value: shipmentDetails?.extraData.fRTRTYN || 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 8,
        name: "eDFreightType",
        label: "Freight Rate Type",
        placeholder: "Freight Rate  Type",
        type: "text",
        value: shipmentDetails?.extraData.fRTRTYN || 0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        id: 9,
        name: "eRate",
        label: "Freight Rate(₹)",
        placeholder: "Freight Rate(₹)",
        type: "text",
        value: shipmentDetails?.extraData.fRTRT || "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        id: 10,
        name: "eDRate",
        label: "Freight Rate(₹)",
        placeholder: "Freight Rate(₹)",
        type: "text",
        value: shipmentDetails?.extraData.fRTRT || "",
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "calucatedData"
        },
        Validations: [],
      },

      {
        id: 11,
        name: "eFreight",
        label: "Freight Amount(₹)",
        placeholder: shipmentDetails?.extraData.fRTAMT || "",
        type: "text",
        value: shipmentDetails?.extraData.fRTAMT || "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 12,
        name: "eDFreight",
        label: "Freight Amount(₹)",
        placeholder: "Freight Amount(₹)",
        type: "text",
        value: shipmentDetails?.extraData.fRTAMT || "",
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "calucatedData"
        },
        Validations: [],
      },
      {
        id: 13,
        name: "eInvoiceAmt",
        label: "Invoice Amount(₹)",
        placeholder: "Invoice Amount(₹)",
        type: "text",
        value: shipmentDetails?.extraData.tOTAMT || "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        id: 14,
        name: "eDInvoiceAmt",
        label: "Invoice Amount(₹)",
        placeholder: "Invoice Amount(₹)",
        type: "text",
        value: shipmentDetails?.extraData.tOTAMT || "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        id: 101,
        name: "entered",
        label: "Sub Total(₹)",
        placeholder: "Discount(₹)",
        type: "text",
        value: parseFloat(shipmentDetails?.extraData.fRTAMT || 0),
        generatecontrol: true,
        disable: true,
        Validations: []
      },
      {
        id: 102,
        name: "edited",
        label: "Sub Total(₹)",
        placeholder: "Edited Total(₹)",
        type: "text",
        value: parseFloat(shipmentDetails?.extraData.fRTAMT || 0),
        generatecontrol: true,
        disable: true,
        Validations: []
      }

    ]

  }
  getShipmentControls() {
    return this.editShipment;
  }
  getEditDocket() {
    return this.editDetail
  }
}
