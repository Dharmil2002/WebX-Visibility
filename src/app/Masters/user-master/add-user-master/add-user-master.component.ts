import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";
import { UserControl } from "src/assets/FormControls/userMaster";
import Swal from "sweetalert2";
import { Subject, take, takeUntil } from "rxjs";

@Component({
  selector: "app-add-user-master",
  templateUrl: "./add-user-master.component.html",
})
export class AddUserMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  password: any;
  jsonControlUserArray: any;
  userTableForm: UntypedFormGroup;
  isUpdate = false;
  protected _onDestroy = new Subject<void>();
  action: string;
  userTable: UserMaster;
  userType: any;
  userLocations: string[];
  userDetails: any;
  breadScrums = [{}];
  location: any;
  divisionStatus: any;
  locationName: any;
  branchCode: any;
  userLocationStatus: any;
  userRoleStatus: any;
  userRole: any;
  userName: any;
  countryCodeStatus: any;
  countryCode: any;
  userTypeStatus: any;
  locationStatus: any;
  UserFormControls: UserControl;
  locationData: any;
  countryData: any;
  updateCountry: any;
  divisionAccess: any;
  multiLoc: any;
  locationList: any;
  userList: any;
  roleId: any;
  countryList: any;
  updateLocation: any;
  updateUser: any;
  updateRoleId: any;
  userData: any;
  roleIdData: any;
  divisionList: any;
  division: any;
  data: any;
  confirmpassword: any;
  userCodeCounter: number = 0;
  previousUserCode: string = "";
  newUserCode: any;
  jsonControlArray: any[];
  submit = 'Save';
  backPath:string;
  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getAllMastersData();
    this.backPath = "/Masters/UserMaster/UserMasterView";
  }

  constructor(
    private filter: FilterUtils,
    private route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    const extrasState = this.route.getCurrentNavigation()?.extras?.state;
    this.isUpdate = false;
    this.action = extrasState ? "edit" : "add";
    if (this.action === "edit") {
      this.userTable = extrasState.data;
      console.log(this.userTable);

      this.isUpdate = true;
      this.submit = 'Modify';
      this.breadScrums = [
        {
          title: "Modify Master",
          items: ["Master"],
          active: "Modify User",
          generatecontrol: true,
          toggle: this.userTable.isActive
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add User",
          items: ["Master"],
          active: "Add User",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.userTable = new UserMaster({});
    }
    this.initializeFormControl();
    //set value on edit
    this.userTableForm.controls["userpassword"].setValue(
      this.userTable.userpassword
    );
    this.userTableForm.controls["gender"].setValue(this.userTable.gender);
    this.userTableForm.controls["confirmpassword"].setValue(
      this.userTable.userpassword
    );
  }

  bindDropdown() {
    const propertyMappings = {
      branchCode: { property: "location", statusProperty: "locationStatus" },
      userType: { property: "userType", statusProperty: "userTypeStatus" },
      country: { property: "countryCode", statusProperty: "countryCodeStatus" },
      // userStatus: { property: "userName", statusProperty: "userStatus" },
      // managerId: { property: "managerId", statusProperty: "managerIdStatus" },
      role: { property: "userRole", statusProperty: "userRoleStatus" },
      multiLocation: {
        property: "locationName",
        statusProperty: "userLocationStatus",
      },
      multiDivisionAccess: {
        property: "division",
        statusProperty: "divisionStatus",
      },
    };

    this.jsonControlUserArray.forEach((data) => {
      const mapping = propertyMappings[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.UserFormControls = new UserControl(this.userTable, this.isUpdate);
    // Get form controls for Driver Details section
    this.jsonControlUserArray = this.UserFormControls.getFormControlsUser();
    // Build the form group using formGroupBuilder function
    this.userTableForm = formGroupBuilder(this.fb, [this.jsonControlUserArray]);
  }

  //JSON data call for Dropdown
  getDropDownData() {
    this.masterService.getJsonFileDetails("dropDownUrl").subscribe((res) => {
      const { divisionAccess, countryList } = res;
      this.divisionList = divisionAccess;
      this.countryList = countryList;

      if (this.isUpdate) {
        this.updateCountry = this.findDropdownItemByName(
          this.countryList,
          this.userTable.country
        );
        this.userTableForm.controls.country.setValue(this.updateCountry);

        // Patches the Div control value of UserTableForm with filter
        this.userTableForm.controls["division"].patchValue(
          this.divisionList.filter((element) =>
            this.userTable.multiDivisionAccess.includes(element.name)
          )
        );
      }
      const filterParams = [
        [
          this.jsonControlUserArray,
          this.countryList,
          this.countryCode,
          this.countryCodeStatus,
        ],
        [
          this.jsonControlUserArray,
          this.divisionList,
          this.division,
          this.divisionStatus,
        ],
      ];
      filterParams.forEach(
        ([jsonControlArray, dropdownData, formControl, statusControl]) => {
          this.filter.Filter(
            jsonControlArray,
            this.userTableForm,
            dropdownData,
            formControl,
            statusControl
          );
        }
      );
    });
  }

  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.value === name);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlUserArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlUserArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.userTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //DropDown Binding from API
  async getAllMastersData() {
    try {
      const locationReq = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: {},
      };
      const generalReqBody = {
        companyCode: this.companyCode,
        collectionName: "General_master",
        filter: {},
      };
      const userReqBody = {
        companyCode: this.companyCode,
        collectionName: "user_master",
        filter: {},
      };
      const locationsResponse = await this.masterService
        .masterPost("generic/get", locationReq)
        .toPromise();
      const userStatusResponse = await this.masterService
        .masterPost("generic/get", generalReqBody)
        .toPromise();
      const managerResponse = await this.masterService
        .masterPost("generic/get", userReqBody)
        .toPromise();
      const locations = locationsResponse.data.map((element) => ({
        name: String(element.locCode),
        value: String(element.locCode),
      }));

      //Code Type = 'EMPST'
      // const userStatusList = userStatusResponse.data
      //   .filter((item) => item.codeType === "EMPST" && item.activeFlag)
      //   .map((x) => {
      //     {
      //       return { name: x.codeDesc, value: x.codeId };
      //     }
      //   });

      const managerList = managerResponse.data.map((element) => ({
        name: String(element.name),
        value: String(element.userId),
      }));

      //Code Type = 'usertyp'
      const userTypeList = userStatusResponse.data
        .filter((item) => item.codeType === "usertyp" && item.activeFlag)
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });

      //Code Type = 'usertyp'
      const userRoleList = userStatusResponse.data
        .filter((item) => item.codeType === "USERROLE" && item.activeFlag)
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });

      if (this.isUpdate) {
        const userLocation = locations.find(
          (x) => x.value === this.userTable.branchCode
        );
        this.userTableForm.controls["branchCode"].setValue(userLocation);

        // const userStatus = userStatusList.find(
        //   (x) => x.name === this.userTable.userStatus
        // );
        // this.userTableForm.controls["userStatus"].setValue(userStatus);

        const userType = userTypeList.find(
          (x) => x.name === this.userTable.userType
        );
        this.userTableForm.controls["userType"].setValue(userType);

        const userRole = userRoleList.find(
          (x) => x.name === this.userTable.role
        );
        this.userTableForm.controls["role"].setValue(userRole);

        // const managerId = managerList.find(
        //   (x) => x.name === this.userTable.managerId
        // );
        // this.userTableForm.controls["managerId"].setValue(managerId);
        this.userTableForm.controls["userLocationscontrolHandler"].patchValue(
          locations.filter((element) =>
            this.userTable.multiLocation.includes(element.value)
          )
        );
      }
      this.filter.Filter(
        this.jsonControlUserArray,
        this.userTableForm,
        locations,
        this.locationName,
        this.userLocationStatus
      );
      this.filter.Filter(
        this.jsonControlUserArray,
        this.userTableForm,
        locations,
        this.location,
        this.locationStatus
      );
      this.filter.Filter(
        this.jsonControlUserArray,
        this.userTableForm,
        userTypeList,
        this.userType,
        this.userTypeStatus
      );
      this.filter.Filter(
        this.jsonControlUserArray,
        this.userTableForm,
        userRoleList,
        this.userRole,
        this.userRoleStatus
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async save() {
    this.userTableForm.controls["branchCode"].setValue(this.userTableForm.value.branchCode.value);
    this.userTableForm.controls["userType"].setValue(
      this.userTableForm.value.userType.name
    );
    this.userTableForm.controls["country"].setValue(
      this.userTableForm.value.country.value
    );
    this.userTableForm.controls["role"].setValue(
      this.userTableForm.value.role.name
    );
    //the map function is used to create a new array with only the "name" values (multiDiv & multiLoc)
    const division = this.userTableForm.value.division.map(
      (item: any) => item.name
    );
    this.userTableForm.controls["multiDivisionAccess"].setValue(division);

    const multiLoc = this.userTableForm.value.userLocationscontrolHandler.map(
      (item: any) => item.value
    );
    this.userTableForm.controls["multiLocation"].setValue(multiLoc);

    // this.userTableForm.controls["isActive"].setValue(
    //   this.userTableForm.value.isActive === true ? true : false
    // );
    //remove unwanted controlName
    const controlsToRemove = [
      "confirmpassword",
      "division",
      "CompanyCode",
      "controlHandler",
      "userLocationscontrolHandler",
    ];

    controlsToRemove.forEach((controlName) => {
      this.userTableForm.removeControl(controlName);
    });
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "user_master",
      filter: {},
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: async (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const lastUserId = res.data[res.data.length - 1];
          const lastUserCode = lastUserId
            ? parseInt(lastUserId.userId.substring(3))
            : 0;
          // Function to generate a new route code
          function generateUserCode(initialCode: number = 0) {
            const nextUserCode = initialCode + 1;
            const userNumber = nextUserCode.toString().padStart(4, "0");
            const userCode = `USR${userNumber}`;
            return userCode;
          }
          if (this.isUpdate) {
            this.newUserCode = this.userTable._id;
          } else {
            this.newUserCode = generateUserCode(lastUserCode);
          }
          //generate unique userId
          this.userTableForm.controls["userId"].setValue(this.newUserCode);
          // Clear any errors in the form controls
          Object.values(this.userTableForm.controls).forEach((control) =>
            control.setErrors(null)
          );
          if (this.isUpdate) {
            // Remove the "id" field from the form controls
            this.userTableForm.removeControl('isUpdate')
            let req = {
              companyCode: this.companyCode,
              collectionName: "user_master",
              filter: {
                _id: this.userTable._id,
              },
              update: this.userTableForm.value,
            };
            const res = await this.masterService
              .masterPut("generic/update", req)
              .toPromise();
            if (res) {
              // Display success message
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Record updated Successfully",
                showConfirmButton: true,
              });
              this.route.navigateByUrl("/Masters/UserMaster/UserMasterView");
            }
          } else {
            const data = this.userTableForm.value;
            const id = { _id: this.userTableForm.controls["userId"].value };
            const mergedObject = { ...data, ...id };
            let req = {
              companyCode: this.companyCode,
              collectionName: "user_master",
              data: mergedObject,
            };
            const res = await this.masterService
              .masterPost("generic/create", req)
              .toPromise();
            if (res) {
              // Display success message
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Record added Successfully",
                showConfirmButton: true,
              });
              this.route.navigateByUrl("/Masters/UserMaster/UserMasterView");
            }
          }
        }
      },
      complete() { },
    });
  }

  cancel() {
    this.route.navigateByUrl("/Masters/UserMaster/UserMasterView");
  }

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  //check Updated Password

  getUpdateChangedPassword() {
    if (this.isUpdate) {
      this.changedPassword();
    }
  }

  //password function for top-up box and check the password in confimpassword filed if correct or not
  changedPassword() {
    this.password = this.userTableForm.get("userpassword").value;
    this.confirmpassword = this.userTableForm.get("confirmpassword").value;
    if (this.password != this.confirmpassword) {
      Swal.fire({
        title: "Password and confirm password did not match",
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      this.userTableForm.controls["confirmpassword"].reset();
    }
  }
  //#region to check if a value already exists in user list
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.userTableForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "user_master",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const userlist = await this.masterService.masterPost("generic/get", req).toPromise();

      // Check if data exists for the given filter criteria
      if (userlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK"
        });

        // Reset the input field
        this.userTableForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }

  // Function to check if ERP Id already exists
  async CheckERPId() {
    await this.checkValueExists("erpId", "ERP Id");
  }

  // Function to check if User Name already exists
  async CheckUserName() {
    await this.checkValueExists("name", "User Name");
  }
  //#endregion

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.userTableForm.controls['isActive'].setValue(event);
    // console.log("Toggle value :", event);
  }
}
