import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ServiceSelection {
    MatrixTypeControl: FormControls[];
    MovementByControl: FormControls[];

  constructor() {
    this.MatrixTypeControl = [
      {
        name: "MatrixType",
        label: "Matrix Type",
        placeholder: "Matrix Type",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        functions: {},
        additionalData: {
          showNameAndValue: false,
        },
      },
    ];

    this.MovementByControl = [
      {
        name: "MovementBy",
        label: "",
        placeholder: "MovementBy",
        type: "radiobutton",
        value: [
          { name: "Vehicle Capacity", value: "2" },
          { name: "Vehicle Number", value: "3" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      ];
  }
  getMatrixTypeControl() {
    return this.MatrixTypeControl;
  }
  getMovementByControl() {
    return this.MovementByControl;
  }
}
