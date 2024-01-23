import { FormControls } from 'src/app/core/models/FormControl/formcontrol';

export class VoucherControlControl {
  VoucherArray: FormControls[];

  constructor(FormValues) {
    this.VoucherArray = [

      {
        name: "VoucherType",
        label: "Select Voucher Type",
        placeholder: "Select Voucher Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Voucher Type is required"
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
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "VoucherTypeFieldChanged"
        },
      },
    ]

  }
  getVoucherArrayControls() {
    return this.VoucherArray;
  }
}
