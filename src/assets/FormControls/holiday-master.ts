import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";

export class HolidayControl {
  holidayControlArray: FormControls[];
  dateWiseControls: FormControls[];
  dayWiseControls: FormControls[];
  days: AutoComplateCommon[];
  constructor(HolidayData) {
    this.holidayControlArray = [
      {
        name: "dateType",
        label: "Date Type",
        placeholder: "Date Type",
        type: "Staticdropdown",
        value: [
          { name: "By Date", value: "DATE" },
          { name: "By Day", value: "DAY" },
        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {},
        functions: {
          onSelection: "ShowAndHideDateWise",
        },
      },
    ];
    this.dateWiseControls = [
      {
        name: "holidayDate",
        label: "Holiday Date",
        placeholder: "Holiday Date",
        type: "date",
        value: HolidayData.holidayDate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "holidayNote",
        label: "Holiday Note",
        placeholder: "Holiday Note",
        type: "text",
        value: HolidayData.holidayNote,
        Validations: [
          {
            name: "required",
            message: "Holiday Note is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "isActive",
        label: "Active Flag",
        placeholder: "Active Flag",
        type: "toggle",
        value: HolidayData.isActive,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "id",
        label: "",
        placeholder: "",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: true,
      },
      {
        name: "entryBy",
        label: "Entry By",
        placeholder: "Entry By",
        type: "",
        value: localStorage.getItem("Username"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "entryDate",
        label: "Entry Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: true,
      },
    ];
    (this.dayWiseControls = [
      {
        name: "days",
        label: "Select Days",
        placeholder: "Select Days",
        type: "multiselect",
        value: "",
        Validations: [],
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "daysControllerHandler",
          showNameAndValue: true,
          Validations: [
            {
              name: "",
              message: "",
            },
          ],
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "daysControllerHandler",
        label: "Select Days",
        placeholder: "Select Days",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "please select days",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: true,
      },
      {
        name: "entryBy",
        label: "Entry By",
        placeholder: "Entry By",
        type: "",
        value: localStorage.getItem("Username"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "entryDate",
        label: "Entry Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: true,
      },
    ]),
      (this.days = [
        { name: "Sunday", value: "Sunday" },
        { name: "Monday", value: "Monday" },
        { name: "Tuesday", value: "Tuesday" },
        { name: "Wednesday", value: "Wednesday" },
        { name: "Thrusday", value: "Thrusday" },
        { name: "Friday", value: "Friday" },
        { name: "Saturday", value: "Saturday" },
      ]);
  }
}
