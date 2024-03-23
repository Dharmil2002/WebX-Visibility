import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
import { BaseControl } from "./base-control";

export class EwayBillControls extends BaseControl {
  private docketFields: FormControls[];
  private consignorFields: FormControls[];
  private consigneeFields: FormControls[];
  private appointmentControlArray: FormControls[];
  private containerControlArray: FormControls[];
  private contractControlArray: FormControls[];
  private totalSummaryControlArray: FormControls[];
  private ewayBillControlArray: FormControls[];
  private EWayDetailControlArray: FormControls[];
  constructor(
    generalService: GeneralService
  ) {
    super(generalService, "LTL", ["EwayBillControls"]);

    this.docketFields = [
      {
        name: "docketNumber",
        label: `${DocCalledAs.Docket} No`,
        placeholder: `${DocCalledAs.Docket} No`,
        type: "text",
        value: "Computerized",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          change: "DocketValidation",
        },
      },
      {
        name: "docketDate",
        label: `${DocCalledAs.Docket} Date`,
        placeholder:`${DocCalledAs.Docket} Date`,
        type: "date",
        value:new Date(),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "C Note Date is required",
          },
        ],
        additionalData: {
          minDate: new Date(),
        }
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
          {
            name: "required",
            message: "From City is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions:{
          onModel:"getCityDetail"
        },
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
          {
            name: "required",
            message: "To City is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions:{
          onModel:"getCityDetail"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
    ];
    this.consignorFields = [
      {
        name: "consignorName",
        label: "Consignor Name",
        placeholder: "Consignor Name",
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
            message: "ConsignorName is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions: {
          onModel: "getCustomer",
          onOptionSelect:"getConsignorDetail"
        },
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "consignorGSTINNO",
        label: "GSTIN NO",
        placeholder: "GSTIN NO",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "consignorCity",
        label: "Consignor City",
        placeholder: "Consignor City",
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
            message: "ConsignorCity is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions:{
          onOptionSelect:"getConsignorDetail",
          onModel:"getCityDetail"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "consignorPinCode",
        label: "Consignor Pincode",
        placeholder: "Consignor Pincode",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        functions:{
          onModel:"getPinCodeDetail"
        },
        Validations: [
          {
            name: "required",
            message: "Consignor Pincode is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "consignorTelephoneNo",
        label: "Consignor TelephoneNo",
        placeholder: "Consignor TelephoneNo",
        type: "mobile-number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Consignor TelephoneNo is required",
          }
        ],
      },
      {
        name: "consignorMobileNo",
        label: "Consignor MobileNo",
        placeholder: "Consignor MobileNo",
        type: "mobile-number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Consignor MobileNo is required",
          },
        ],
      },
      {
        name: "consignorAddress",
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
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
    ];
    this.consigneeFields = [
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
            message: "Consignor Name is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions: {
          onModel: "getCustomer",
          onOptionSelect:"getConsigneeDetail"
        },
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "consigneeGSTINNO",
        label: "GSTIN NO",
        placeholder: "GSTIN NO",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
      },
      {
        name: "consigneeCity",
        label: "Consignee City",
        placeholder: "Consignee City",
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
            message: "Consignee City is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions:{
          onModel:"getCityDetail",
          onOptionSelect:"getConsigneeDetail"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "consigneePinCode",
        label: "Consignee Pincode",
        placeholder: "Consignee Pincode",
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
            message: "Consignee Pincode is required",
          },
          { name: "autocomplete" },
          { name: "invalidAutocompleteObject", message: "Choose proper value" }
        ],
        functions:{
          onModel:"getPinCodeDetail"
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "consigneeTelNo",
        label: "Consignee TelephoneNo",
        placeholder: "Consignee TelephoneNo",
        type: "mobile-number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Consignee TelephoneNo is required",
          },
        ],
      },
      {
        name: "consigneeMobNo",
        label: "Consignee MobileNo",
        placeholder: "Consignee MobileNo",
        type: "mobile-number",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Consignee Mobile No is required",
          },
        ],
      },
      {
        name: "consigneeAddress",
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
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
    ];
    this.appointmentControlArray = [
      {
        name: "appoint",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          { value: "Y", name: "Yes", checked: true },
          { value: "N", name: "No" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "AppointmentDate",
        label: "Appointment Date",
        placeholder: "Appointment Date",
        type: "date",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "NameOfPerson",
        label: "Name Of Person",
        placeholder: "Name Of Person",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "AppointmentContactNumber",
        label: "Contact Number",
        placeholder: "Contact Number",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "AppointmentRemarks",
        label: "Remarks",
        placeholder: "Remarks",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "AppointmentFromTime",
        label: "Appointment From Time",
        placeholder: "Appointment From Time",
        type: "time",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "AppointmentToTime",
        label: "Appointment To Time",
        placeholder: "Appointment To Time",
        type: "time",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ];
    this.containerControlArray = [
      {
        name: "containerNo1",
        label: "Container No. 1",
        placeholder: "Container No. 1",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "containerSize1",
        label: "Size",
        placeholder: "Size",
        type: "Staticdropdown",
        value: [
          {
            value: "20 FT",
            name: "20 FT",
          },
          {
            value: "40 FT",
            name: "40 FT",
          },
          {
            value: "45 FT",
            name: "45 FT",
          },
          {
            value: "C17FT",
            name: "C17FT",
          },
          {
            value: "C13FT",
            name: "C13FT",
          },
          {
            value: "C24FT",
            name: "C24FT",
          },
          {
            value: "C30FT",
            name: "C30FT",
          },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "containerNo2",
        label: "Container No. 2",
        placeholder: "Container No. 2",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "containerSize2",
        label: "Size",
        placeholder: "Size",
        type: "Staticdropdown",
        value: [
          {
            value: "20 FT",
            name: "20 FT",
          },
          {
            value: "40 FT",
            name: "40 FT",
          },
          {
            value: "45 FT",
            name: "45 FT",
          },
          {
            value: "C17FT",
            name: "C17FT",
          },
          {
            value: "C13FT",
            name: "C13FT",
          },
          {
            value: "C24FT",
            name: "C24FT",
          },
          {
            value: "C30FT",
            name: "C30FT",
          },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "containerType",
        label: "Container Type",
        placeholder: "Container Type",
        type: "Staticdropdown",
        value: [
          {
            value: "General Purpose Container",
            name: "General Purpose Container",
          },
          {
            value: "Flat Rack Container",
            name: "Flat Rack Container",
          },
          {
            value: "Open Top Container",
            name: "Open Top Container",
          },
          {
            value: "Double Door Container",
            name: "Double Door Container",
          },
          {
            value: "High Cube Container",
            name: "High Cube Container",
          },
          {
            value: "Open Side Container",
            name: "Open Side Container",
          },
          {
            value: "ISO reefer Container",
            name: "ISO reefer Container",
          },
          {
            value: "Half Hight Container",
            name: "Half Hight Container",
          },
          {
            value: "Tank Container",
            name: "Tank Container",
          },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "containerCapacity",
        label: "Container Capacity",
        placeholder: "Container Capacity",
        type: "Staticdropdown",
        value: [
          {
            value: "25000 Kg",
            name: "25000 Kg",
          },
          {
            value: "27600 Kg",
            name: "27600 Kg",
          },
          {
            value: "25000 Kg",
            name: "25000 Kg",
          },
          {
            value: "27600 Kg",
            name: "27600 Kg",
          },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "bookingNo",
        label: "Booking No",
        placeholder: "Booking No",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "sealNo",
        label: "Seal No",
        placeholder: "Seal No",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "shippingLine",
        label: "Shipping Line",
        placeholder: "Shipping Line",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "jobOrderNo",
        label: "Job Order No",
        placeholder: "Job Order No",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "port",
        label: "Port",
        placeholder: "Port",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "jobOrderNoTwo",
        label: "Job Order No 2",
        placeholder: "Job Order No 2",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "deoNo",
        label: "DEO No.",
        placeholder: "DEO No.",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
    this.contractControlArray = [
      {
        name: "orgLoc",
        label: "Booking Branch",
        placeholder: "Booking Branch",
        type: "text",
        value: localStorage.getItem("Branch"),
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
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
        functions:{
          onModel:"destionationDropDown"
        },
        additionalData: {
          showNameAndValue: false,
        },
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
        },
      },
      {
        name: "svcType",
        label: "Service Type",
        placeholder: "Service Type",
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
            message: "Service Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "local",
        label: "Local",
        placeholder: "Local",
        type: "toggle",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "oda",
        label: "ODA",
        placeholder: "ODA",
        type: "toggle",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "rskty",
        label: "Risk Type",
        placeholder: "Risk Type",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "pkgsType",
        label: "Packaging Type",
        placeholder: "Packaging Type",
        type: "Staticdropdown",
        value: [],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "tranType",
        label: "Product",
        placeholder: "Product",
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
            message: "Product is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
    ];
    this.totalSummaryControlArray = [
      {
        name: "cft_ratio",
        label: "CFT Ratio",
        placeholder: "CFT Ratio",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions:{
          onChange:"calculateInvoiceTotal"
        }
      },
      {
        name: "cft_tot",
        label: "CFT Total",
        placeholder: "CFT Total",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "actualwt",
        label: "Actual Weight",
        placeholder: "Actual Weight",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "chrgwt",
        label: "Charged Weight",
        placeholder: "Charged Weight",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charged Weight is required",
          },
        ],
      },
      {
        name: "edd",
        label: "EDD",
        placeholder: "EDD",
        type: "date",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
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
        Validations: [
        ],
      },
      {
        name: "totalDeclaredValue",
        label: "Total Declared Value",
        placeholder: "Total Declared Value",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "totalChargedNoOfpkg",
        label: "Charged No of Pkg.",
        placeholder: "Charged No of Pkg.",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "totalPartQuantity",
        label: "Total Part Quantity",
        placeholder: "Total Part Quantity",
        type: "text",
        value: 0,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
    this.ewayBillControlArray = [
      {
        name: "ewbNo",
        label: "EWB Number",
        placeholder: "EWB Number",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",

            message: "Please Enter only numeric length 12.",

            pattern: "^[0-9]{12}$",

          }

        ],
      },
      {
        name: "ewbDate",
        label: "EWB Date",
        placeholder: "EWB Date",
        type: "date",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "isMultipleEWB",
        label: "Multiple EWB",
        placeholder: "Multiple EWB",
        type: "toggle",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "ewbExprired",
        label: "EWB Expired Date",
        placeholder: "EWB Expired Date",
        type: "date",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];

    this.EWayDetailControlArray = [
      {
        name: "INVNO",
        label: "Invoice No",
        placeholder: "Invoice No",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "INVDT",
        label: "Invoice Date",
        placeholder: "",
        type: "date",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "LENGTH",
        label: "Length (FT)",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "BREADTH",
        label: "Breadth (FT)",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "HEIGHT",
        label: "Height (FT)",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "DECLVAL",
        label: "Declared Value",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "NO_PKGS",
        label: "Pkgs",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "CUB_WT",
        label: "Weight",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "ACT_WT",
        label: "Actual Weight (KG)",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: []
      },
      {
        name: "Invoice_Product",
        label: "Product",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "HSN_CODE",
        label: "HSN Code",
        placeholder: "",
        type: "text",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

    ];
  }

  getDocketFieldControls() {
    return this.docketFields;
  }
  getConsignorFieldControls() {
    return this.consignorFields;
  }
  getConsigneeFieldControls() {
    return this.consigneeFields;
  }
  getAppointmentFieldControls() {
    return this.appointmentControlArray;
  }
  getContainerFieldControls() {
    return this.containerControlArray;
  }
  getEwayBillFormControls() {
    return this.EWayDetailControlArray;
  }
  getContractFieldControls() {
    return this.contractControlArray;
  }
  getTotalSummaryFieldControls() {
    return this.totalSummaryControlArray;
  }
  getEwayBillFieldControls() {
    return this.ewayBillControlArray;;
  }
}
