import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class CustomerGstControl {
    customerGstControlArray: FormControls[];
    constructor(customerGstTable, isUpdate: boolean) {
        this.customerGstControlArray = [
            {
                name: 'customerName',
                label: 'Customer Name',
                placeholder: 'Search Customer Name',
                type: 'dropdown',
                value: customerGstTable?.customerName ? customerGstTable.customerName : "",
                Validations: [
                    {
                        name: "required",
                        message: "Customer Name is required"
                    }
                ],
                functions: {
                    onModel: "filterCustomerDetails",
                    onOptionSelect: "filterCustomerDetails"
                },
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: isUpdate ? true : false
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: '',
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            },
        ]
    }
    getCustomerGstFormControls() {
        return this.customerGstControlArray;
    }
}