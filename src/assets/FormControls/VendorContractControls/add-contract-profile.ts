import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddContractProfile {
  AddContractProfileArray: FormControls[];
  constructor(vendorInformationData) {
    this.AddContractProfileArray = [
      {
        name: "vendor",
        label: "Vendor",
        placeholder: "Vendor",
        type: 'dropdown',
        value: "",
        Validations: [
          {
            name: "required",
            message: "Vendor is required"
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
          showNameAndValue: true
        },
        functions: {
          onOptionSelect: 'setManager',
          // onModel: "",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "contractID",
        label: "Contract Code",
        placeholder: "Contract Code",
        type: "text",
        value: vendorInformationData.contractID,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "contractID is required"
          },],
      },
      {
        name: "contractScan",
        label: "Upload Contract Scan",
        placeholder: "Upload Contract Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "contractScan is required"
          },],
        functions: {
          onChange: "onFileSelected",
        },
        additionalData: {
          isFileSelected: true
        },
      },

      {
        name: "vendorManager",
        label: "Vendor Manager",
        placeholder: "Vendor Manager",
        type: "text",
        value: vendorInformationData.vendorManager,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "vendor Manager is required"
          },],
      },
      {
        name: "contractStartDate",
        label: "Start Date",
        placeholder: " Start Date",
        type: "date",
        value: vendorInformationData.contractStartDate,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Start Date is required"
          },],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "expiryDate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: vendorInformationData.expiryDate,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Expiry Date is required"
          },],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "pendingDays",
        label: "Pending days",
        placeholder: "Pending days",
        type: "number",
        value: vendorInformationData.pendingDays,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pending days is required"
          },],
      },
    ];
  }
  getAddContractProfileArrayControls() {
    return this.AddContractProfileArray;
  }
}