import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractBasicInformationControl {
  private ContractBasicInformationControlArray: FormControls[];
  constructor(BasicInformation) {
    this.ContractBasicInformationControlArray = [
      {
        name: "Customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value: BasicInformation.Customer,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ContractID",
        label: "ContractID",
        placeholder: "ContractID",
        type: "text",
        value: BasicInformation.ContractID,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ContractScan",
        label: "Upload Contract Scan",
        placeholder: "Upload Contract Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "onFileSelected",
        },
      },
      {
        name: "ContractScanView",
        label: "View Contract Scan",
        placeholder: "View Contract Scan",
        type: "filelink",
        value: "test",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Product",
        label: "Product",
        placeholder: "Product",
        type: "Staticdropdown",
        value: [
          {
            value: "Express",
            name: "Express",
          },
          {
            value: "Air",
            name: "Air",
          },
          {
            value: "Rail",
            name: "Rail",
          },
          {
            value: "Road",
            name: "Road",
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
            message: "Product is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "PayBasis",
        label: "Pay Basis",
        placeholder: "Pay Basis",
        type: "Staticdropdown",
        value: [
          {
            value: "All",
            name: "All",
          },
          {
            value: "TBB",
            name: "TBB",
          },
          {
            value: "LTL",
            name: "LTL",
          },
          {
            value: "FTL",
            name: "FTL",
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
            message: "Product is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "AccountManager",
        label: "Account Manager",
        placeholder: "Account Manager",
        type: "text",
        value: BasicInformation.AccountManager,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        name: "ContractStartDate",
        label: "Contract Start Date",
        placeholder: "Contract Start Date",
        type: "date",
        value: BasicInformation.EffectiveDateFrom,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "Expirydate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: BasicInformation.ValidUntil,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "Pendingdays",
        label: "Pending days",
        placeholder: "Pending days",
        type: "text",
        value: BasicInformation.pendingdays,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "CustomerPONo",
        label: "Customer PO No",
        placeholder: "Customer PO No",
        type: "text",
        value: BasicInformation.pendingdays,
        generatecontrol: true,
        disable: false,
        Validations: [],
      }, {
        name: "POValiditydate",
        label: "PO Validity date",
        placeholder: "POValiditydate",
        type: "date",
        value: BasicInformation.ValidUntil,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "ContractPOScan",
        label: "Upload Contract PO Scan",
        placeholder: "Upload Contract PO Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "onFileSelected",
        },
      },
      {
        name: "ContractPOScanView",
        label: "View Contract PO Scan",
        placeholder: "View Contract PO Scan",
        type: "filelink",
        value: "test",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "UpdateHistory",
        label: "View Update History",
        placeholder: "Update History",
        type: "filelink",
        value: "test",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
  }
  getContractBasicInformationControlControls(CurrentAccess: string[]) {
    // this.ContractBasicInformationControlArray = this.ContractBasicInformationControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractBasicInformationControlArray;
  }
}
