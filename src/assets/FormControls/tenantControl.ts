import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { TenantModel } from "src/app/core/models/Masters/Tenant Master/tenant-mater";

export class TenantControl {
  TenantControlArray: FormControls[];
  constructor(TenantTab:TenantModel) {
    this.TenantControlArray = [
      {
        name: "bRANDLABEL",
        label: "Brand/ White label",
        placeholder: "Enter Brand/ White label",
        type: "text",
        value: TenantTab?.bRANDLABEL,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Brand/ White label is required",
          }
        ],
        functions: {
          onChange: "CheckBrand",
        },
      },
      {
        name: "cOMCODE",
        label: "Company/ Tenant code",
        placeholder: "Enter Brand/ White label",
        type: "text",
        value: TenantTab?.cOMCODE,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Company/ Tenant code is required",
          },
        ],
        functions: {
          onChange: "CheckCompany",
        },
      },
      {
        name: "cOMNM",
        label: "Company Name",
        placeholder: "Entry Company Name",
        type: "text",
        value: TenantTab?.cOMNM,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Company Name is required",
          }
        ],
        additionalData: {},
      },
      {
        name: "cOUNTRY",
        label: "Country",
        placeholder: "Country",
        type: "dropdown",
        value: TenantTab.cOUNTRY,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Country is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "sHORTCODE",
        label: "Short Code",
        placeholder: "Entry Short Code",
        type: "text",
        value: TenantTab?.sHORTCODE,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Short Code is required",
          },
        ],
        additionalData: {},
      },
      {
        name: "bRANCHCODE",
        label: "Default Branch Code",
        placeholder: "Enter Default branch code",
        type: "text",
        value: TenantTab?.bRANCHCODE,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Default Branch Code is required",
          },
        ],
        additionalData: {},
      },
      {
        name: "tIMEZONE",
        label: "Time Zone",
        placeholder: "Select Time Zone",
        type: "dropdown",
        value: TenantTab.tIMEZONE,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Time Zone is required",
          }
        ],
        additionalData: {},
      },
      {
        name: "cURRENCY",
        label: "Currency",
        placeholder: "Currency",
        type: "dropdown",
        value: TenantTab.cURRENCY,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Currency is required",
          }
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "lOGO",
        label: "Logo",
        placeholder: "",
        type: "file",
        value: TenantTab?.lOGO,
        Validations: [
          {
            name: "required",
            message: "lOGO is required",
          },
        ],
        additionalData: {
          multiple: true,
          isFileSelected: true,
        },
        functions: {
          onChange: "selectFileLogoPhoto",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "pUNCHLINE",
        label: "Punch Line",
        placeholder: "Enter Punch Line",
        type: "text",
        value: TenantTab?.pUNCHLINE,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Punch Line is required",
          }
        ],
        additionalData: {},
      },
      {
        name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: TenantTab?.activeFlag, generatecontrol: false, disable: false,
        Validations: []
    },
    {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: TenantTab._id,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
    },
    {
        name: 'cID',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: localStorage.getItem("companyCode"), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
    },
    {
        name: "eNTBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
    },
    {
        name: 'eNTDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
    },
    {
        name: 'eNTLOC',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: localStorage.getItem("Branch"), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
    },
    {
        name: 'mODDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
    },
    {
        name: "mODBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
    },
    {
        name: 'mODLOC',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: localStorage.getItem("Branch"), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
    },
    ];
  }
  getFormControlsTenant() {
    return this.TenantControlArray;
  }
}
