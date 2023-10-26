import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";

export class UserControl {
  UserControlArray: FormControls[];
  constructor(UserTable: UserMaster, isUpdate: boolean) {
    this.UserControlArray = [
      {
        name: "userId",
        label: "User ID",
        placeholder: "Enter User ID",
        type: "text",
        value: isUpdate ? UserTable.userId : "System Generated", //UserTable.userId,//UserTable.userId,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "User ID is required",
          },
        ],
      },
      {
        name: "erpId",
        label: "ERP id",
        placeholder: "Enter User ERP id",
        type: "text",
        value: UserTable.erpId,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter alphanumeric of length 25!",
            pattern: "^[a-zA-Z0-9]{0,25}$",
          },
        ],
        functions: {
          onChange: "CheckERPId",
        },
      },
      {
        name: "name",
        label: "User Name",
        placeholder: "Enter User Name",
        type: "text",
        value: UserTable.name,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "User Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text!",
            pattern: "^[a-zA-Z ]{0,100}$",
          },
        ],
        functions: {
          onChange: "CheckUserName",
        },
      },
      {
        name: "userpassword",
        label: "Password",
        placeholder: "Enter Password",
        type: "password",
        value: UserTable.userPwd,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Password required!",
          },
          {
            name: "pattern",
            message:
              "Please enter password with 6-15 chars, 1 upper/lower case, 1 digit & 1 special char (!@#$%^&*_=+-)",
            pattern:
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$",
          },
        ],
        additionalData: {
          // showPassword: false,
          inputType: "password",
        },
        functions: {
          onChange: "getUpdateChangedPassword",
        },
      },
      {
        name: "confirmpassword",
        label: "Confirm Password",
        placeholder: "Enter Confirm Password",
        type: "password",
        value: UserTable.userPwd,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Confirm Password required!",
          },
        ],
        additionalData: {
          // showPassword: false,
          inputType: "password",
        },
        functions: {
          onChange: "changedPassword",
        },
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Search And Select Gender",
        type: "Staticdropdown",
        value: [
          { value: "M", name: "Male" },
          { value: "F", name: "Female" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "dateOfBirth",
        label: "Birth date",
        placeholder: "Birth date",
        type: "date",
        value: UserTable.dateOfBirth,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          maxDate: new Date(
            new Date().getFullYear() - 18,
            new Date().getMonth(),
            new Date().getDate()
          ),
          minDate: new Date("01 Jan 1900"),
        },
      },
      // {
      //   name: 'branchCode', label: "Location", placeholder: "Select Location", type: 'dropdown',
      //   value: UserTable.branchCode, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "Location is required.."
      //     },
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "invalidAutocomplete",
      //       message: "Choose proper value",
      //     }
      //   ],
      //   additionalData: {
      //     showNameAndValue: false
      //   }
      // },
      {
        name: "branchCode",
        label: "Location",
        placeholder: "Select Location",
        type: "dropdown",
        value: UserTable.branchCode,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location is required..",
          },
          {
            name: "autocomplete",
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
        name: "multiLocation",
        label: "Multi Locations Access",
        placeholder: "Multi Locations Access",
        type: "multiselect",
        value: "",
        Validations: [],
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "userLocationscontrolHandler",
          showNameAndValue: false,
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
        name: "dateOfJoining",
        label: "Date Of Joining",
        placeholder: "select Date Of Joining",
        type: "date",
        value: UserTable.dateOfJoining,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "residentialAddress",
        label: "Residential Address",
        placeholder: "Enter Residential Address",
        type: "text",
        value: UserTable.residentialAddress,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter alphanumeric 250 digit!",
            pattern: "^[a-zA-Z 0-9 , ]{0,250}$",
          },
        ],
      },
      {
        name: "country",
        label: "Country Code",
        placeholder: "Country Code",
        type: "dropdown",
        value: UserTable.country,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Country Code is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "mobileNo",
        label: "Mobile",
        placeholder: "Enter mobileno",
        type: "mobile-number",
        value: UserTable.mobileNo,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Mobile Number is required!",
          },
          {
            name: "pattern",
            message: "Please enter 10 digit mobile number",
            pattern: "^[0-9]{10}$",
          },
        ],
      },
      {
        name: "emailId",
        label: "Email ID",
        placeholder: "Enter Email ID",
        type: "text",
        value: UserTable.emailId,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Email is required",
          },
          {
            name: "email",
            message: "Enter Valid Email ID!",
          },
        ],
        functions: {
          onChange: "GetEmailDetails",
        },
      },
      {
        name: "userType",
        label: "User Type",
        placeholder: "Select User Type",
        type: "dropdown",
        value: UserTable.userType,
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
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "role",
        label: "User Role",
        placeholder: "Select User Role",
        type: "dropdown",
        value: UserTable.roleId,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "User Role is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "multiDivisionAccess",
        label: "Multi Division Access",
        placeholder: "Multi Division Access",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "division",
          showNameAndValue: false,
          Validations: [
            {
              name: "",
              message: "",
            },
          ],
        },
      },
      {
        name: "isActive",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: UserTable.isActive,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "division",
        label: "Multi Division Access",
        placeholder: "Multi Division Access",
        type: "",
        value: "",
        Validations: [
          {
            name: "required",
            message: "Multi Division Access is Required...!",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "entryBy",
        label: "Entry By",
        placeholder: "Entry By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "updateBy",
        label: "Update By",
        placeholder: "Update By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "isUpdate",
        label: "IsUpdate",
        placeholder: "IsUpdate",
        type: "text",
        value: false,
        Validations: [],
        generatecontrol: false,
        disable: false,
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

      //   ---------------Add support Controllers at last -----------------------
      {
        name: "userLocationscontrolHandler",
        label: "Multi Locations Access",
        placeholder: "Multi Locations Access",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: false,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Multi Locations Access is Required...!",
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
        disable: false,
      },
    ];
  }
  getFormControlsUser() {
    return this.UserControlArray;
  }
}
