import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { StoreKeys } from "src/app/config/myconstants";
import { ViewPrint_Template } from "src/app/core/models/viewPrint/viewPrintTemplate";
import * as StorageService from "src/app/core/service/storage.service";

export class QueryControl {
  QueryControlArray: FormControls[];
  constructor(ViewPrintTable: ViewPrint_Template, isUpdate: boolean) {
    this.QueryControlArray = [
      {
        name: "vTYPE",
        label: "View Type",
        placeholder: "Search And Select View Type",
        type: "dropdown",
        value: "",
        Validations: [
          {
            name: "required",
            message: "View Type is required..",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: 'onChangeViewType'
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: '',
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "cID",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(StorageService.getItem(StoreKeys.CompanyCode)),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "eNTBY",
        label: "Entry By",
        placeholder: "Entry By",
        type: "text",
        value: StorageService.getItem(StoreKeys.UserId),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "eNTDT",
        label: "Entry Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "mODBY",
        label: "Update By",
        placeholder: "Update By",
        type: "text",
        value: StorageService.getItem(StoreKeys.UserId),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "mODDT",
        label: "Update Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      }
    ];
  }
  getFormQueryControlArray() {
    return this.QueryControlArray;
  }
}
