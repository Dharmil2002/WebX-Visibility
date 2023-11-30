import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class VendorPaymentControl {
  THCPaymentFilterArray: FormControls[];
  constructor(FormValues) {
    this.THCPaymentFilterArray = [
      {
        name: "vendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "vendorNamesupport",
          showNameAndValue: true,
          Validations: [],
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "StartDate",
        label: "SelectDateRange",
        placeholder: "Select Date",
        type: "daterangpicker",
        value: FormValues?.StartDate,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          support: "EndDate",
        },
      },

      {
        name: "vendorNamesupport",
        label: "Vendor",
        placeholder: "Select Vendor",
        type: '',
        value: "",// FormValues?.vendorNameList,
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "EndDate",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: FormValues?.EndDate,
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "Select Data Range",
          },
          {
            name: "required",
            message: "StartDateRange is Required...!",
          },
        ],
      },

    ]
  }


  getTHCPaymentFilterArrayControls() {
    return this.THCPaymentFilterArray;
  }
}
