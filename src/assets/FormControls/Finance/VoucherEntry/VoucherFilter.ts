import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class voucherFilterControl {
    voucherFilterArray: FormControls[];
    constructor(FormValues) {
        this.voucherFilterArray = [
            {
                name: "StartDate",
                label: "Date Range",
                placeholder: "Select Date",
                type: "daterangpicker",
                value: FormValues?.startdate,
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
                name: "VoucherNo",
                label: "Voucher Number",
                placeholder: "",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [],
           },
           {
            name: "VoucherType",
            label: "Voucher Type",
            placeholder: "Voucher Type",
            type: "Staticdropdown",
            value:[
              {value:"",name:"All"},
              {value:"DebitVoucher",name:"Debit Voucher"},
              {value:"CreditVoucher",name:"Credit Voucher"},
              {value:"JournalVoucher",name:"Journal Voucher"}
              ],
            generatecontrol: true,
            disable: false,
            Validations: [],
          },
            {
                name: "EndDate",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: FormValues?.enddate,
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


    getVoucherFilterArrayControls() {
        return this.voucherFilterArray;
    }
}