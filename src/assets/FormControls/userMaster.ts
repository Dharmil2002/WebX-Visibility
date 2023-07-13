import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";

export class UserControl {
  UserControlArray: FormControls[];
  constructor(UserTable: UserMaster, isUpdate: boolean) {
    this.UserControlArray = [
      {
        name: "UserId",
        label: "User ID",
        placeholder: "Enter User ID",
        type: "text",
        value: UserTable.userId,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "User ID is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text and number!",
            pattern: "^[a-zA-Z 0-9]*$",
          },
        ],
        functions: {
          onChange: 'GetUserDetails',
        }
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
            pattern: "^[a-zA-Z]*$",
          },
        ],
      },
      {
        name: "EmpId",
        label: "Intenal ID",
        placeholder: "Enter Intenal ID",
        type: "text",
        value: UserTable.internalID,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Intenal ID is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text and number!",
            pattern: "^[a-zA-Z 0-9]*$",
          },
        ],
      },
      {
        name: "PasswordQues",
        label: "Secret Question",
        placeholder: "Enter Secret Question",
        type: "text",
        value: UserTable.secretQuestion,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Secret Question is required",
          },
        ],
      },
      {
        name: "PasswordAns",
        label: "Secret Answer",
        placeholder: "Enter Secret Answer",
        type: "text",
        value: UserTable.secretAnswer,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Secret Answer is required",
          },
        ],
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: 'Search And Select Gender',
        type: "Staticdropdown",
        value: [
          { value: 'M', name: 'Male' },
          { value: 'F', name: 'Female' }
        ],
        Validations: [
          {
            name: "required",
            message: "Gender is required..",
          },
        ],
        generatecontrol: true,
        disable: false
      },
      {
        name: 'DOB', label: 'Birth date', placeholder: 'Birth date', type: 'date', value: UserTable.dateOfBirth, filterOptions: '', autocomplete: '', displaywith: '',
        generatecontrol: true, disable: false, Validations: [],
        additionalData: {
          maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          minDate: new Date("01 Jan 1900")
        }
      },
      {
        name: "DOJ_ORG",
        label: "Date Of Joining",
        placeholder: "select Date Of Joining",
        type: "date",
        value: UserTable.dateOfJoining,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
          minDate: new Date("01 Jan 1900")
        }
      },
      {
        name: 'BranchCode', label: "Location", placeholder: "Select Location", type: 'dropdown',
        value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Location is required.."
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
        name: 'UserLocations',
        label: 'Multi Locations Access',
        placeholder: 'Multi Locations Access',
        type: 'multiselect',
        value: '',
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "UserLocationscontrolHandler",
          showNameAndValue: true,
          Validations: [{
            name: "",
            message: ""
          }]
        },
        generatecontrol: true, disable: false
      },



      {
        name: 'User_Type', label: "User Status", placeholder: "Select User Status", type: 'dropdown',
        value: UserTable.User_Type, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "User Status is required.."
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
          showNameAndValue: true
        }
      },
      {
        name: 'emptype', label: "User Type", placeholder: "Select User Type", type: 'dropdown',
        value: UserTable.name, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "User Type is required.."
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
          showNameAndValue: true
        }
      },
      {
        name: 'ManagerId', label: "Manager Id", placeholder: "Select Manager Id", type: 'dropdown',
        value: UserTable.managerId, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Manager Id is required.."
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
          showNameAndValue: true
        }
      },
      {
        name: 'CountryCode', label: "Country Code", placeholder: "Country Code", type: 'dropdown',
        value: UserTable.CountryCode, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "Country Code is required.."
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
          showNameAndValue: true
        }
      },
      {
        name: "mobileno",
        label: "Mobile",
        placeholder: "Enter mobileno",
        type: "number",
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
            message: "Please enter 6 to 15 digit mobile number",
            pattern:
              "^[0-9]{6,15}$",
          },
        ],
      },
      {
        name: "EmailId",
        label: "Email ID",
        placeholder: "Enter Email ID",
        type: "text",
        value: UserTable.emailId,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Email is required"
          }
          , {
            name: "email",
            message: "Enter Valid Email ID!",
          }
        ],
        functions: {
          onChange: 'GetEmailDetails',
        }
      },
      {
        name: 'ROLEID', label: "User Role", placeholder: "Select User Role", type: 'dropdown',
        value: UserTable.Role, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
        Validations: [
          {
            name: "required",
            message: "User Role is required.."
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
          showNameAndValue: true
        }
      },
      // {
      //   name: 'DeptId', label: "Department", placeholder: "Select Department", type: 'text',
      //   value:UserTable.deptId, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
      //   Validations: [
      //       // {
      //       //     name: "required",
      //       //     message: "Department is required.."
      //       // },
      //       {
      //           name: "autocomplete",
      //       },
      //       {
      //           name: "invalidAutocomplete",
      //           message: "Choose proper value",
      //       }
      //   ],
      //   additionalData: {
      //       showNameAndValue: true
      //   }
      // },
      {
        name: "resi_addr",
        label: "Residential Address",
        placeholder: "Enter Residential Address",
        type: "text",
        value: UserTable.residentialAddress,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Residential Address is required",
          },
        ],
      },
      {
        name: "DivisioncontrolHandler",
        label: "Multi Division Access",
        placeholder: "Multi Division Access",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [

        ],
        functions: {
          onToggleAll: 'toggleSelectAll'
        },
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "Division",
          showNameAndValue: true,
          Validations: [{
            name: "",
            message: ""
          }]
        }
      },
      {
        name: "Status",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: UserTable.isActive,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },


      {
        name: 'Division',
        label: 'Multi Division Access',
        placeholder: 'Multi Division Access',
        type: '',
        value: '',
        Validations: [
          {
            name: "required",
            message: "Multi Division Access is Required...!",
          }
          , {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          }
          , {
            name: "autocomplete",
          }
        ],
        generatecontrol: false, disable: false
      },
      {
        name: 'DivId',
        label: '',
        placeholder: '',
        type: '',
        value: '',
        Validations: [{
          name: "",
          message: ""
        }],
        generatecontrol: false, disable: false
      },
      {
        name: 'DivDesc',
        label: '',
        placeholder: '',
        type: '',
        value: '',
        Validations: [{
          name: "",
          message: ""
        }],
        generatecontrol: false, disable: false
      },
      {
        name: 'LastUpdatedBy',
        label: 'LastUpdatedBy',
        placeholder: 'LastUpdatedBy',
        type: 'text',
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'CompanyCode',
        label: 'Company Code',
        placeholder: 'Company Code',
        type: 'text',
        value: localStorage.getItem("CompanyCode"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'EntryBy',
        label: 'Entry By',
        placeholder: 'Entry By',
        type: 'text',
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false, disable: false
      },
      {
        name: 'isUpdate',
        label: 'IsUpdate',
        placeholder: 'IsUpdate',
        type: 'text',
        value: false,
        Validations: [],
        generatecontrol: false, disable: false
      },

      //   ---------------Add support Controllers at last -----------------------
      {
        name: "controlHandler",
        label: "",
        placeholder: "Multi Locations Access",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "",
          },
        ],
      },
      {
        name: "UserLocationscontrolHandler",
        label: "Multi Locations Access",
        placeholder: "Multi Locations Access",
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
            message: "Multi Locations Access is Required...!",
          }
          , {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          }
        ],
        functions: {
          onToggleAll: 'toggleSelectAll',
        },
      },
      {
        name: "controlHandler1",
        label: "",
        placeholder: "Multi Locations Access",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "",
          },
          {
            name: "",
          },
        ],
      },
    ];
    if (!isUpdate) {
      let Password = {
        name: "UserPwd",
        label: "Password",
        placeholder: "Enter Password",
        type: "password",
        value: "",
        generatecontrol: isUpdate ? false : true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Password required!",
          },
          {
            name: "pattern",
            message:
              "Please enter password with 8-12 chars, 1 upper/lower case, 1 digit & 1 special char (!@#$%^&*_=+-)",
            pattern:
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$",

          },
        ],
        additionalData: {
          // showPassword: false,
          inputType: "password"
        },

      }
      let ConfirmPassword = {
        name: "confirmpassword",
        label: "Confirm Password",
        placeholder: "Enter Confirm Password",
        type: "password",
        value: "",
        generatecontrol: isUpdate ? false : true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Confirm Password required!",
          },
        ],
        additionalData: {
          // showPassword: false,
          inputType: "password"
        },
        functions: {
          onChange: 'ChangedPassword',
        }
      }
      //this code use for sequence in field and that code in sent to index value pass
      this.UserControlArray.splice(2, 0, Password);
      this.UserControlArray.splice(3, 0, ConfirmPassword);
    }
    // getFormControlsUser() {
    //   return this.UserControlArray;
    // }
  }
  getFormControlsUser() {
    return this.UserControlArray;
  }
}
