import { FormControls } from 'src/app/Models/FormControl/formcontrol';

export class AdviceAcknowledgeControl {
  AdviceAcknowledgeFilter: FormControls[];
  constructor(FormValues: any) {
    this.AdviceAcknowledgeFilter = [
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


    ];

  }
  getFilterFormControls() {
    return this.AdviceAcknowledgeFilter;
  }

}
