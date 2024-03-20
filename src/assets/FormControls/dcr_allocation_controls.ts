import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DCRModel } from "src/app/core/models/dcrallocation";
export class DcrAllocationForm {
  controls: FormControls[];

  constructor(allocationData?: DCRModel) {
    this.controls = [
      {
        name: "AllocateTo",
        label: "Allocate To",
        placeholder: "Select Allocation Type",
        type: "Staticdropdown",
        value: [
            { value: "L", name: "Location" },
            { value: "C", name: "Customer", },
        ],
        generatecontrol: true,
        disable: false,
        Validations: [
        ],
        // Additional properties like `generatecontrol` and `disable` can be added based on your requirements
        additionalData: {
            showNameAndValue: false,
          },
          functions: {
            onSelection: "handleChange",
        },
    },
      {
        name: "allocation",
        label: "Location",
        placeholder: "select proper options",
        type: "dropdown", // Change to "text" if location is free text input
        value:allocationData?.location, // Set default value
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location is required",
          },
        ],
        // Additional properties can be added.
        additionalData: {
            showNameAndValue: true,
          }
      },
      {
        name: "assignTo",
        label: "Assign To",
        placeholder: "Select Assignee",
        type: "Staticdropdown", // Change to "text" if assignee is free text input
        value: [
          { value: "E", name: "Employee" },
          { value: "B", name: "BA", },
          { value: "C", name: "Customer", },
          ],
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onSelection: "handleAssignChange",
      },
        // Additional properties can be added.
      },
      {
        name: "name",
        label: "Name",
        placeholder: "Name",
        type: "dropdown",
        value: allocationData?.name , // Set default value
        generatecontrol: true,
        disable: false,
        Validations: [],
        // Additional properties can be added.
        additionalData: {
            showNameAndValue: true,
          },
      },
      {
        name: "from",
        label: "From",
        placeholder: "Enter Starting Document Number",
        type: "text",
        value: allocationData?.from ,
        generatecontrol: true,
        disable: false,

        Validations: [
          {
            name: "required",
            message: "From Document is required",
          },
        ],
        functions: {
          onChange: "isSeriesExists",
        },
      },
      {
        name: "noOfPages",
        label: "No. of Pages",
        placeholder: "Enter Number of Pages",
        type: "number",
        value: allocationData?.noOfPages , // Set default value to 0
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Number of Pages is required",
          },
        ],
        functions: {
          onChange: "getSeriesTo",
        },
      },
      {
        name: "to",
        label: "To",
        placeholder: "Enter Ending Document Number",
        type: "text",
        value: allocationData?.to, // Set default value to 0
        generatecontrol: true,
        disable: false,
        functions:{
          onChange:"toGreaterThanFromValidator",
        },
        Validations: [
          {
            name: "required",
            message: "To Document is required",
          },
        ],
        // Additional properties can be added.
      },
    ];
  }

  getControls() {
    return this.controls;
  }
}
