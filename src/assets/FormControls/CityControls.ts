import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { CityMaster } from "src/app/core/models/Masters/City Master/City Master";

export class CityControl {
  CityControlArray: FormControls[];
  constructor(CityTable: CityMaster, IsUpdate: boolean) {
    this.CityControlArray = [
      {
        name: 'cityId',
        label: 'City Code',
        placeholder: 'City Code',
        type: 'text',
        value: IsUpdate ? CityTable.srNo : "System Generated",
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: true,
        disable: true
      },

      {
        name: 'cityName', label: "City Name", placeholder: "Enter City Name", type: 'text', value: CityTable.cityName,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "City Name is required"
          },
          {
            name: "pattern",
            message: "Please Enter only text",
            pattern: '^[a-zA-Z ]*$'
          }
        ]
      },

      {
        name: 'state', label: "State", placeholder: "Select State", type: 'dropdown',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "State is required.."
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: false
        }
      },

      {
        name: 'zone', label: "Zone", placeholder: "Select Zone", type: 'dropdown',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Zone is required.."
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          }
        ],
        additionalData: {
          showNameAndValue: false
        }
      },

      {
        name: 'isActive', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: CityTable.isActive, generatecontrol: true, disable: false,
        Validations: []
      },

      { name: 'CompanyCode', label: 'Company Code', placeholder: 'Company Code', type: 'text', value: parseInt(localStorage.getItem("CompanyCode")), Validations: [], filterOptions: '', autocomplete: '', displaywith: '', generatecontrol: false, disable: true },
      { name: 'stateId', label: 'StateId', placeholder: 'StateId', type: 'text', value: IsUpdate ? CityTable.stateId : "", Validations: [], filterOptions: '', autocomplete: '', displaywith: '', generatecontrol: false, disable: true },
      { name: 'zoneId', label: 'ZoneId', placeholder: 'ZoneId', type: 'text', value: '', Validations: [], filterOptions: '', autocomplete: '', displaywith: '', generatecontrol: false, disable: true },
      { name: 'EntryBy', label: 'EntryBy', placeholder: 'EntryBy', type: 'text', value: '', Validations: [], filterOptions: '', autocomplete: '', displaywith: '', generatecontrol: false, disable: true },
      { name: 'isUpdate', label: 'IsUpdate', placeholder: 'IsUpdate', type: 'text', value: false, Validations: [], filterOptions: '', autocomplete: '', displaywith: '', generatecontrol: false, disable: true },
    ]
  }

  getFormControls() {
    return this.CityControlArray;
  }
}