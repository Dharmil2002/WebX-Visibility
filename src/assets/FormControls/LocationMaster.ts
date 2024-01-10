import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { LocationMaster } from "src/app/core/models/Masters/LocationMaster";

export class LocationControl {
  LocationDetailControl: FormControls[];
  OtherDetailsControls: FormControls[];

  constructor(LocationTable: LocationMaster, isUpdate: boolean, isChecked: boolean) {
    (this.LocationDetailControl = [
      {
        name: "locCode",
        label: "Location Code",
        placeholder: "Enter Location Code",
        type: "text",
        value: LocationTable.locCode,
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Location Code is required",
          },
          {
            name: "pattern",
            message:
              "Please Enter A-Z Char Or 0-9 with no Space and Location Code should be limited to 5 characters",
            pattern: "^[.a-zA-Z0-9,-]{0,5}$",
          },
        ],
        functions: {
          onChange: "checkLocCode",
        },
      },
      {
        name: "locName",
        label: "Location Name",
        placeholder: "Enter Location Name",
        type: "text",
        value: LocationTable.locName,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text of length 3 to 25 characters",
            pattern: "^[a-zA-Z ]{3,25}$",
          },
        ],
        functions: {
          onChange: "checkLocName",
        },
      },
      {
        name: "locLevel",
        label: "Location Hierarchy",
        placeholder: "Select location Hierarchy",
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
            name: "required",
            message: " ",
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
          onOptionSelect: "setReportLevelData",
        },
      },
      {
        name: "reportLevel",
        label: "Reporting To",
        placeholder: "Select Reporting To",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable:false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "required",
            message: " ",
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
          onModel: "setReporting"
        },
      },
      {
        name: "reportLoc",
        label: "Reporting Location",
        placeholder: "Select Reporting Location",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable:false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "required",
            message: " ",
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
          onModel: "getReportLocation",
        },
      },

      {
        name: "locPincode",
        label: "Pincode",
        placeholder: "Enter Pincode",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "required",
            message: " ",
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
          onModel: "getPincodeData",
          onOptionSelect: "setStateCityData",
        },
      },
      {
        name: "locRegion",
        label: "Zone",
        placeholder: "Select zone",
        type: "text",
        value: LocationTable.locRegion,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "Zone is required",
        },],
        additionalData: {
          showNameAndValue: false,
        },

      },
      {
        name: "locCountry",
        label: "Country",
        placeholder: "Select Country",
        type: "text",
        value: LocationTable.locCountry,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "Country is required",
        },],
        additionalData: {
          showNameAndValue: false,
        }
      },

      {
        name: "locCity",
        label: "City",
        placeholder: "Select City",
        type: "text",
        value: LocationTable.locCity,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "City is required",
        },],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "locState",
        label: "State",
        placeholder: "Select State",
        type: "text",
        value: LocationTable.locState,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "State is required",
        },],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "getStateDetails",
        },
      },      
      {
        name: "locAddr",
        label: "Address",
        placeholder: "Enter Location Address",
        type: "text",
        value: LocationTable.locAddr,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location Address is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Address of length 4 to 100",
            pattern: "^.{4,100}$",
          },
        ],
      },
      // {
      //   name: "locTimeZone",
      //   label: "TimeZone",
      //   placeholder: "Select TimeZone",
      //   type: "dropdown",
      //   value: LocationTable.locTimeZone,
      //   filterOptions: "",
      //   autocomplete: "",
      //   displaywith: "",
      //   generatecontrol: true,
      //   disable: true,
      //   Validations: [
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "required",
      //       message: " ",
      //     },
      //     {
      //       name: "invalidAutocomplete",
      //       message: "Choose proper value",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: false,
      //   },
      // },
      {
        name: "ownership",
        label: "Location Ownership",
        placeholder: "Select Location Ownership",
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
            name: "required",
            message: " ",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "Latitude",
        label: "Latitude ,Longitude",
        placeholder: "Enter Latitude , Longitude",
        type: "text",
        value:
          //LocationTable.Latitude,
          LocationTable.Latitude +
          "," +
          LocationTable.Longitude,
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Latitude , Longitude are required ",
        }],
        functions: {
          onClick: "showMap",
          onModel:"latLongValidator"
        },
      },
      {
        name: "mappedPincode",
        label: "Mapped Area",
        placeholder: "Mapped Area",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: isChecked,
          support: "pincodeHandler",
          showNameAndValue: false,

        },
        functions: {
          onToggleAll: 'toggleSelectAll',
          onModel: 'getMappedPincode',
          onSelect: "setSelectedPincodeData",
          onClick: "resetPinCode",
        },
        generatecontrol: true,
        disable: false,
      },

      {
        name: 'mappedPinCode',
        label: 'Mapped Area - Pin Code',
        placeholder: 'Mapped Area - Pin Code',
        type: 'text',
        value: LocationTable.mappedPinCode,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: true,
        disable: true

      },
      {
        name: 'mappedCity',
        label: 'Mapped Area - City',
        placeholder: 'Mapped Area - City',
        type: 'text',
        value: LocationTable.mappedCity,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: true,
        disable: true

      },
      {
        name: 'mappedState',
        label: 'Mapped Area - State',
        placeholder: 'Mapped Area - State',
        type: 'text',
        value: LocationTable.mappedState,
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: true,
        disable: true

      },
      {
        name: 'gstNumber',
        label: 'GST Number',
        placeholder: 'Enter GST Number',
        type: 'text',
        value: LocationTable.gstNumber,
        Validations: [
          {
            name: "pattern",
            pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
            message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
          }
        ],
        functions: {
          onChange: "validateState",
        },
        generatecontrol: true, disable: false
      },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: LocationTable.activeFlag,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "Longitude",
        label: "Latitude , Longitude",
        placeholder: "Select Latitude , Longitude",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
        functions: {
          onChange: "RenderMap",
        },
      },
      {
        name: 'pincodeHandler',
        label: 'Pay Basis',
        placeholder: 'Pay Basis',
        type: '',
        value: '',
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: "companyCode",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "locStateId",
        label: "State",
        placeholder: "Select State",
        type: "text",
        value: LocationTable.locStateId,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: true,
        Validations: []
      },
    ])
  }
  getFormControlsLocation() {
    return this.LocationDetailControl;
  }
}
