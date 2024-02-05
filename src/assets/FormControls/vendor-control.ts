import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { finYear } from "src/app/Utility/date/date-utils";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";

export class VendorControl {
  vendorControlArray: FormControls[];
  vendorOtherInfoArray: FormControls[];
  vendorBankArray: FormControls[];
  MSMEControlArray: FormControls[];
  lowTDSControlArray: FormControls[];
  highTDSControlArray: FormControls[];
  constructor(vendorMasterTable: VendorMaster, isUpdate: boolean) {
    this.vendorControlArray = [
      {
        name: "vendorCode",
        label: "Vendor Code",
        placeholder: "Vendor Code",
        type: "text",
        value: isUpdate ? vendorMasterTable.vendorCode : "System Generated",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "vendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
        type: "text",
        value: vendorMasterTable.vendorName,
        Validations: [
          {
            name: "required",
            message: "Vendor name is required",
          },
          {
            name: "pattern",
            message:
              "Enter Vendor Name with 3 to 150 characters using only text",
            pattern: "^[a-zA-Z0-9 -/]{3,150}$",
          },
        ],
        functions: {
          onChange: "CheckVendorName",
        },
        generatecontrol: true,
        disable: isUpdate ? true : false,
      },
      {
        name: "vendorManager",
        label: "Vendor Manager",
        placeholder: "Vendor Manager",
        type: "text",
        value: vendorMasterTable.vendorManager,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 25 characters",
            pattern: "^[a-zA-Z - a-zA-Z]{3,25}$",
          },
        ],
      },
      {
        name: "vendorType",
        label: "Vendor Type",
        placeholder: "Search Vendor Type",
        type: "dropdown",
        value: isUpdate ? vendorMasterTable.vendorType : "",
        Validations: [
          {
            name: "required",
            message: "Vendor Type is required",
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
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vendorAddress",
        label: "Vendor Address",
        placeholder: "Vendor Address",
        type: "text",
        value: vendorMasterTable.vendorAddress,
        Validations: [
          {
            name: "required",
            message: "Vendor Address is required",
          },
          {
            name: "pattern",
            message: "Please Enter Vendor Address upto 500 characters.",
            pattern: "^.{1,500}$",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vendorLocation",
        label: "Vendor Location",
        placeholder: "Select Vendor location",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "vendorLocationDropdown",
          showNameAndValue: true,
          Validations: [{}],
        },
        functions: {
          onModel: "getVendorLocation",
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vendorPinCode",
        label: "Vendor Pincode",
        placeholder: "Search Pincode",
        type: "dropdown",
        value: vendorMasterTable.vendorPinCode,
        Validations: [
          {
            name: "required",
            message: "Vendor Pincode is required",
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
          showNameAndValue: false,
        },
        functions: {
          onModel: "getPincode",
          onOptionSelect: "setStateCityData",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vendorCity",
        label: "Vendor City",
        placeholder: "Vendor City",
        type: "text",
        value: vendorMasterTable.vendorCity,
        Validations: [
          {
            name: "required",
            message: "Vendor city is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "vendorState",
        label: "Vendor State",
        placeholder: "Vendor State",
        type: "text",
        value: vendorMasterTable.vendorState,
        Validations: [
          {
            name: "required",
            message: "Vendor state is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "vendorCountry",
        label: "Country",
        placeholder: "Country",
        type: "text",
        value: vendorMasterTable.vendorCountry,
        Validations: [
          {
            name: "required",
            message: "Vendor Country is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "vendorPhoneNo",
        label: "Vendor Phone No",
        placeholder: "Vendor Phone No",
        type: "mobile-number",
        value: vendorMasterTable.vendorPhoneNo,
        Validations: [
          {
            name: "required",
            message: "Vendor Phone No is required",
          },
          {
            name: "pattern",
            pattern: "^[0-9]{10}$",
            message: "Please enter a valid 10-digit phone number",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "emailId",
        label: "Vendor E-mails",
        placeholder: "Enter Vendor E-mails",
        type: "text",
        value: vendorMasterTable.emailId,
        Validations: [],
        functions: {
          onChange: "onChangeEmail",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "panNo",
        label: "PAN NO",
        placeholder: "PAN NO",
        type: "government-id",
        value: vendorMasterTable.panNo,
        Validations: [
          {
            name: "required",
            message: "PAN NO is required",
          },
          {
            name: "pattern",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          },
        ],
        functions: {
          onChange: "CheckPANNo",
        },
        generatecontrol: true,
        disable: false,
      },
      // {
      //     name: 'noPANRegistration',
      //     label: 'No PAN registration',
      //     placeholder: ' ',
      //     type: 'toggle',
      //     value: vendorMasterTable.noPANRegistration,
      //     Validations: [],
      //     generatecontrol: true, disable: false
      // },
      {
        name: "panCardScan",
        label: "PAN card scan",
        placeholder: "select PAN card to scan",
        type: "file",
        value: isUpdate ? vendorMasterTable.panCardScan : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PAN card scan is required",
          },
        ],
        functions: {
          onChange: "selectPanCardScan",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
      {
        name: "cinNumber",
        label: "CIN number",
        placeholder: "Enter CIN number",
        type: "text",
        value: vendorMasterTable.cinNumber,
        Validations: [
          {
            name: "pattern",
            pattern: "^[A-Za-z0-9 ]{0,100}$",
            message:
              "Please enter a valid CIN number upto 100 alphanumeric characters",
          },
        ],
        functions: {
          onChange: "CheckCINnumber",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "itrnumber",
        label: "ITR Number",
        placeholder: "ITR Number",
        type: "number",
        value: vendorMasterTable.itrnumber,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "dateofFilling",
        label: "Date of Filling",
        placeholder: "select Date of Filling",
        type: "date",
        value: vendorMasterTable.dateofFilling,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "financialYear",
        label: "Financial year",
        placeholder: "Financial year",
        type: "text",
        value: finYear,
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "vendorAdvance",
        label: "Vendor Advance (In %)",
        placeholder: "Vendor Advance (In %)",
        type: "number",
        value: vendorMasterTable.vendorAdvance,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "isActive",
        label: "Active Flag",
        placeholder: "Active Flag",
        type: "toggle",
        value: vendorMasterTable.isActive,
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "vendorLocationDropdown",
        label: "Vendor Location",
        placeholder: "Select Vendor Location",
        type: "",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Location is Required...!",
          },
        ],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "msmeRegistered",
        label: "MSME Registered",
        placeholder: "MSME Registered",
        type: "toggle",
        value: vendorMasterTable.msmeRegistered,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "isBlackListed",
        label: "Black Listed",
        placeholder: "Active Flag",
        type: "toggle",
        value: vendorMasterTable.isBlackListed,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "isLowRateApplicable",
        label: "Low TDS Rate Applicable",
        placeholder: "Low TDS Rate Applicable",
        type: "toggle",
        value: vendorMasterTable.isLowRateApplicable,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "hTDSRA",
        label: "High TDS Rate Applicable",
        placeholder: "High TDS Rate Applicable",
        type: "toggle",
        value: vendorMasterTable.hTDSRA,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "isGSTregistered",
        label: "GST registered",
        placeholder: "GST registered",
        type: "toggle",
        value: vendorMasterTable.isGSTregistered,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "isBankregistered",
        label: "Bank registered",
        placeholder: "Bank registered",
        type: "toggle",
        value: vendorMasterTable.isBankregistered,
        Validations: [],
        functions: {
          onChange: "OnChangeServiceSelections",
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "companyCode",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: vendorMasterTable._id,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "vendorTypeName",
        label: "Vendor Type",
        placeholder: "Search Vendor Type",
        type: "text",
        value: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "eNTBY",
        label: "Entry By",
        placeholder: "Entry By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];
    this.lowTDSControlArray = [
      {
        name: "effectiveFrom",
        label: "Effective From",
        placeholder: "select Effective From",
        type: "date",
        value: vendorMasterTable.effectiveFrom,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Effective From is required",
          },
        ],
      },
      {
        name: "validUpto",
        label: "Valid Upto",
        placeholder: "select Valid Upto",
        type: "date",
        value: vendorMasterTable.validUpto,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Valid Upto From is required",
          },
        ],
      },
      {
        name: "lowTDSLimit",
        label: "Low TDS Limit",
        placeholder: "Low TDS Limit",
        type: "number",
        value: vendorMasterTable.lowTDSLimit,
        Validations: [
          {
            name: "required",
            message: "Low TDS Limit is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "tdsSection",
        label: "TDS Section",
        placeholder: "Search TDS Section",
        type: "dropdown",
        value: isUpdate ?  {name:vendorMasterTable.tdsSection,value:vendorMasterTable.tdsSectionName} : "",
        Validations: [
          {
            name: "required",
            message: "TDS Section is required",
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
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "uPRC",
        label: "Upload Low Rate Certificate",
        placeholder: "select Upload Low Rate Certificate",
        type: "file",
        value: vendorMasterTable?.uPRC || "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Upload Low Rate Certificate is required",
          },
        ],
        functions: {
          onChange: "selectLowRateCerti",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
    ];
    this.highTDSControlArray = [
      {
        name: "isTDSDeclaration",
        label: "TDS Declaration",
        placeholder: "TDS Declaration",
        type: "toggle",
        value: vendorMasterTable.isTDSDeclaration,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "toggleTDSExempted",
        },
      },
      {
        name: "uTDSD",
        label: "Upload TDS Declaration",
        placeholder: "Upload TDS Declaration",
        type: "file",
        value: vendorMasterTable.uTDSD,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Upload TDS Declaration is required",
          },
        ],
        functions: {
          onChange: "selectTDSDeclaration",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
    ];
    this.MSMEControlArray = [
      {
        name: "msmeNumber",
        label: "MSME Number",
        placeholder: "Enter MSME Number",
        type: "text",
        value: vendorMasterTable.msmeNumber,
        Validations: [
          {
            name: "required",
            message: "MSME Number is required",
          },
          {
            name: "pattern",
            pattern: "^[A-Za-z0-9 ]{0,100}$",
            message:
              "Please enter a valid MSME Number upto 100 alphanumeric characters",
          },
        ],
        functions: {
         // onChange: "CheckmsmeNumber",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "msmeType",
        label: "MSME Type",
        placeholder: "Search MSME Type",
        type: "dropdown",
        value: isUpdate ? {name:vendorMasterTable.msmeTypeName,value:vendorMasterTable.msmeType} : "",
        Validations: [
          {
            name: "required",
            message: "MSME Type is required",
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
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "msmeScan",
        label: "MSME scan",
        placeholder: "select MSME scan",
        type: "file",
        value: vendorMasterTable?.msmeScan || "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "MSME scan is required",
          },
        ],
        functions: {
          onChange: "selectMsmeScan",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
    ];
    this.vendorOtherInfoArray = [
      {
        name: "gstNumber",
        label: "GST Number",
        placeholder: "Enter GST Number",
        type: "government-id",
        value: vendorMasterTable.gstNumber,
        Validations: [
          {
            name: "required",
            message: "GST Number is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message:
              "Enter a valid alphanumeric GST number EX: 01BZAHM6385P6Z2",
          },
        ],
        functions: {
          onChange: "setState",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "gstState",
        label: "GST State",
        placeholder: "GST State",
        type: "text",
        value: vendorMasterTable.gstState,
        Validations: [],

        generatecontrol: true,
        disable: true,
      },
      {
        name: "gstPincode",
        label: "GST Pincode",
        placeholder: "search and Select GST Pincode",
        type: "dropdown",
        value: vendorMasterTable.gstPincode,
        Validations: [
          {
            name: "required",
            message: "GST Pincode is required",
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
          showNameAndValue: false,
        },
        functions: {
          onModel: "getGstPincode",
          onOptionSelect: "setGSTCity",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "gstCity",
        label: "GST City",
        placeholder: "GST City",
        type: "text",
        value: vendorMasterTable.gstCity,
        Validations: [],

        generatecontrol: true,
        disable: true,
      },
      {
        name: "gstAddress",
        label: "GST Address",
        placeholder: "GST Address",
        type: "text",
        value: vendorMasterTable.gstState,
        Validations: [
          {
            name: "required",
            message: "GST Address is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
    ];
    this.vendorBankArray = [
      {
        name: "bankACNumber",
        label: "Bank Account No",
        placeholder: "Enter Bank Account No",
        type: "number",
        value: vendorMasterTable.bankACNumber,
        Validations: [
          {
            name: "required",
            message: "Bank Account No is required",
          },
          {
            name: "pattern",
            message: "Please Enter Numeric length 10 to 15",
            pattern: "^[0-9]{10,15}$",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "ifscCode",
        label: "IFSC Code",
        placeholder: "IFSC Code",
        type: "government-id",
        value: vendorMasterTable.ifscCode,
        Validations: [
          {
            name: "required",
            message: "IFSC Code is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric EX. ABCD1234567",
            pattern: "^[A-Z]{4}[0-9]{7}$",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "bankName",
        label: "Bank Name",
        placeholder: "Bank Name",
        type: "text",
        value: vendorMasterTable.bankName,
        Validations: [
          {
            name: "required",
            message: "Bank Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter Ony Alphabets Character And length 4 to 50",
            pattern: "^[a-z A-Z]{4,50}$",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "bankBrachName",
        label: "Bank Branch Name",
        placeholder: "Bank Branch Name",
        type: "text",
        value: vendorMasterTable.bankBrachName,
        Validations: [
          {
            name: "required",
            message: "Bank Branch Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter Ony Alphabets Character And length 4 to 50",
            pattern: "^[a-z A-Z]{4,50}$",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "city",
        label: "City",
        placeholder: "Search City",
        type: "dropdown",
        value: isUpdate ? {name:vendorMasterTable.city,value:vendorMasterTable.city} : "",
        Validations: [
          {
            name: "required",
            message: "City is required",
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
          onModel: "getCityDetails",
        },
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "upiId",
        label: "UPI Id",
        placeholder: "UPI Id",
        type: "text",
        value: vendorMasterTable.upiId,
        Validations: [
          {
            name: "required",
            message: "UPI Id is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "uploadKYC",
        label: "Upload KYC",
        placeholder: "Upload KYC",
        type: "file",
        value: vendorMasterTable?.uploadKYC || "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Upload KYC is required",
          },
        ],
        functions: {
          onChange: "selectKYC",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
      {
        name: "contactPerson",
        label: "Contact Person",
        placeholder: "Contact Person",
        type: "text",
        value: vendorMasterTable.contactPerson,
        Validations: [
          {
            name: "required",
            message: "Contact Person is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Mobile Number",
        type: "mobile-number",
        value: vendorMasterTable.mobileNumber,
        Validations: [
          {
            name: "required",
            message: "Mobile Number is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "emails",
        label: "E-mail id",
        placeholder: "E-mail id",
        type: "text",
        value: isUpdate ? vendorMasterTable.emails : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "E-mail id is required",
          },
        ],
        functions: {
          onChange: "onChangeEmail",
        },
      },
      {
        name: "uCC",
        label: "Upload Cancelled Cheque",
        placeholder: "Upload Cancelled Cheque",
        type: "file",
        value: vendorMasterTable?.uCC || "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Upload Cancelled Cheque is required",
          },
        ],
        functions: {
          onChange: "selectcancelledCeque",
        },
        additionalData: {
          isFileSelected: true,
        },
      },
    ];
  }
  getVendorFormControls() {
    return this.vendorControlArray;
  }
  getMSMEFormControls() {
    return this.MSMEControlArray;
  }
  getVendorOtherInfoFormControls() {
    return this.vendorOtherInfoArray;
  }
  getVendorBankDetailsControls() {
    return this.vendorBankArray;
  }
  getlowTDSControls() {
    return this.lowTDSControlArray;
  }
  gethighTDSControls() {
    return this.highTDSControlArray;
  }
}
