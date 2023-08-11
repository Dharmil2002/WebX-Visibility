
import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";
import { UserControl } from "src/assets/FormControls/userMaster";
import Swal from "sweetalert2";
import { getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";

@Component({
    selector: 'app-add-user-master',
    templateUrl: './add-user-master.component.html'
})

export class AddUserMasterComponent implements OnInit {
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    password: any;
    jsonControlUserArray: any;
    userTableForm: UntypedFormGroup;
    isUpdate = false;
    action: string;
    userTable: UserMaster;
    branchCode: any;
    userType: any;
    userLocations: string[];
    userDetails: any;
    breadScrums = [{}];
    location: any;
    divisionStatus: any;
    locationName: any;
    userLocationStatus: any;
    userRoleStatus: any;
    userRole: any;
    managerIdStatus: any;
    managerId: any;
    userStatus: any;
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
    updateUserStatus: any;
    updateManagerId: any;
    updateRoleId: any;
    userData: any;
    roleIdData: any;
    userStatusData: any;
    managerIdData: any;
    divisionList: any;
    division: any;
    data: any;
    confirmpassword: any;
    lastUsedUserCode: number = 0;
    ngOnInit(): void {
        this.bindDropdown();
        this.getDropDownData();
    }

    constructor(private filter: FilterUtils, private route: Router, private fb: UntypedFormBuilder, private masterService: MasterService
    ) {
        if (this.route.getCurrentNavigation()?.extras?.state != null) {
            this.data = route.getCurrentNavigation().extras.state.data;
            this.isUpdate = true;
            this.action = "edit";
        } else {
            this.action = "Add";
        }
        if (this.action === "edit") {
            this.userTable = this.data;
            this.isUpdate = true;
            this.breadScrums = [
                {
                    title: "User Master",
                    items: ["Master"],
                    active: "Edit User",
                },
            ];
        } else {
            this.breadScrums = [
                {
                    title: "User Master",
                    items: ["Master"],
                    active: "Add User",
                },
            ];
            this.userTable = new UserMaster({});
        }
        this.initializeFormControl();
    }
    bindDropdown() {
        this.jsonControlUserArray.forEach((data) => {
            if (data.name === "branchCode") {
                // Set BranchCode-related variables
                this.location = data.name;
                this.locationStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "userType") {
                // Set emptype-related variables
                this.userType = data.name;
                this.userTypeStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "country") {
                // Set CountryCode-related variables
                this.countryCode = data.name;
                this.countryCodeStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "userStatus") {
                // Set User_Type-related variables
                this.userName = data.name;
                this.userStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "managerId") {
                // Set ManagerId-related variables
                this.managerId = data.name;
                this.managerIdStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "role") {
                // Set ROLEID-related variables
                this.userRole = data.name;
                this.userRoleStatus = data.additionalData.showNameAndValue;
            }

            if (data.name === "multiLocation") {
                // Set UserLocations-related variables
                this.locationName = data.name;
                this.userLocationStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "multiDivisionAccess") {
                // Set DivisioncontrolHandler-related variables
                this.division = data.name;
                this.divisionStatus = data.additionalData.showNameAndValue;
            }
        });
    }
    initializeFormControl() {
        //throw new Error("Method not implemented.");
        this.UserFormControls = new UserControl(this.userTable, this.isUpdate);
        // Get form controls for Driver Details section
        this.jsonControlUserArray = this.UserFormControls.getFormControlsUser();
        // Build the form group using formGroupBuilder function and the values of accordionData
        this.userTableForm = formGroupBuilder(this.fb, [this.jsonControlUserArray]);
    }

    getDropDownData() {
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            const {
                locationData,
                userList,
                userStatus,
                managerId,
                roleId,
                divisionAccess,
                countryData
            } = res;

            this.locationList = locationData;
            this.userData = userList;
            this.userStatusData = userStatus;
            this.managerIdData = managerId;
            this.roleIdData = roleId;
            this.divisionList = divisionAccess;
            this.multiLoc = locationData;
            this.countryList = countryData;

            if (this.isUpdate) {
                this.updateLocation = this.findDropdownItemByName(this.locationList, this.userTable.branchCode);
                this.userTableForm.controls.branchCode.setValue(this.updateLocation);

                this.updateUser = this.findDropdownItemByName(this.userStatusData, this.userTable.userStatus);
                this.userTableForm.controls.userType.setValue(this.updateUser);

                this.updateUserStatus = this.findDropdownItemByName(this.userData, this.userTable.userType);
                this.userTableForm.controls.userStatus.setValue(this.updateUserStatus);

                this.updateManagerId = this.findDropdownItemByName(this.managerIdData, this.userTable.managerId);
                this.userTableForm.controls.managerId.setValue(this.updateManagerId);

                this.updateRoleId = this.findDropdownItemByName(this.roleIdData, this.userTable.role);
                this.userTableForm.controls.role.setValue(this.updateRoleId);

                this.updateCountry = this.findDropdownItemByName(this.countryList, this.userTable.country);
                this.userTableForm.controls.country.setValue(this.updateCountry);

                this.userTableForm.controls['gender'].setValue(this.data.gender);
                // Patches the Div control value of UserTableForm with filter
                this.userTableForm.controls["division"].patchValue(this.divisionList.filter((element) =>
                    this.userTable.multiDivisionAccess.includes(element.name)
                ));

                this.userTableForm.controls["userLocationscontrolHandler"].patchValue(this.locationList.filter((element) =>
                    this.userTable.multiLocation.includes(element.name)
                ));

            }
            const filterParams = [
                [this.jsonControlUserArray, this.managerIdData, this.managerId, this.managerIdStatus],
                [this.jsonControlUserArray, this.userData, this.userType, this.userTypeStatus],
                [this.jsonControlUserArray, this.userStatusData, this.userName, this.userStatus],
                [this.jsonControlUserArray, this.roleIdData, this.userRole, this.userRoleStatus],
                [this.jsonControlUserArray, this.countryList, this.countryCode, this.countryCodeStatus],
                [this.jsonControlUserArray, this.locationList, this.location, this.locationStatus],
                [this.jsonControlUserArray, this.divisionList, this.division, this.divisionStatus],
                [this.jsonControlUserArray, this.locationList, this.locationName, this.userLocationStatus],
            ];
            filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
                this.filter.Filter(jsonControlArray, this.userTableForm, dropdownData, formControl, statusControl);
            });
        });
    }

    findDropdownItemByName(dropdownData, name) {
        return dropdownData.find(item => item.name === name);
    }
    save() {
        this.userTableForm.controls["branchCode"].setValue(this.userTableForm.value.branchCode.name);
        this.userTableForm.controls["managerId"].setValue(this.userTableForm.value.managerId.name);
        this.userTableForm.controls["userStatus"].setValue(this.userTableForm.value.userStatus.name);
        this.userTableForm.controls["userType"].setValue(this.userTableForm.value.userType.name);
        this.userTableForm.controls["country"].setValue(this.userTableForm.value.country.name);
        this.userTableForm.controls["role"].setValue(this.userTableForm.value.role.name);
        //the map function is used to create a new array with only the "name" values (multiDiv & multiLoc)
        const division = this.userTableForm.value.division.map((item: any) => item.name);
        this.userTableForm.controls["multiDivisionAccess"].setValue(division);
        const multiLoc = this.userTableForm.value.userLocationscontrolHandler.map((item: any) => item.name);
        this.userTableForm.controls["multiLocation"].setValue(multiLoc);
        this.userTableForm.controls["isActive"].setValue(this.userTableForm.value.isActive === true ? true : false);

        //remove unwanted controlName
        const controlsToRemove = [
            "confirmpassword",
            "division",
            "CompanyCode",
            "isUpdate",
            "controlHandler",
            "userLocationscontrolHandler"
        ];
        controlsToRemove.forEach(controlName => {
            this.userTableForm.removeControl(controlName);
        });
        //generate unique userId
        const userCode = this.generateUserCode();
        this.userTableForm.controls["userId"].setValue(userCode);

        if (this.isUpdate) {
            // Remove the "id" field from the form controls
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "user_master",
                id: this.data.id,
                updates: this.userTableForm.value
            };
            this.masterService.masterPut('common/update', req).subscribe({
                next: (res: any) => {
                    if (res) {
                        // Display success message
                        Swal.fire({
                            icon: "success",
                            title: "Successful",
                            text: res.message,
                            showConfirmButton: true,
                        });
                        this.route.navigateByUrl('/Masters/UserMaster/UserMasterView');
                    }
                }
            });
        } else {
            const data = this.userTableForm.value; 
            const id = { id: this.userTableForm.controls["userId"].value }; 
            const mergedObject = { ...data,...id }; 
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "user_master",
                data: mergedObject//this.userTableForm.value
            };
            this.masterService.masterPost('common/create', req).subscribe({
                next: (res: any) => {
                    if (res) {
                        // Display success message
                        Swal.fire({
                            icon: "success",
                            title: "Successful",
                            text: res.message,
                            showConfirmButton: true,
                        });
                        this.route.navigateByUrl('/Masters/UserMaster/UserMasterView');
                    }
                }
            });
        }
    }
    cancel() {
        window.history.back();
        //this.Route.navigateByUrl("/Masters/UserMaster/UserMasterView");
    }
    functionCallHandler($event) {
        // console.log("fn handler called" , $event);

        let field = $event.field;                   // the actual formControl instance
        let functionName = $event.functionName;     // name of the function , we have to call

        // function of this name may not exists, hence try..catch 
        try {
            this[functionName]($event);
        } catch (error) {
            // we have to handle , if function not exists.
            console.log("failed");
        }
    }

    //method to generate unique userCode
    generateUserCode(): string {
        // Get the last used user code from localStorage
        const lastUsedCode = parseInt(localStorage.getItem('lastUsedUserCode') || '0', 10);
        // Increment the last used user code by 1 to generate the next one
        const nextUserCode = lastUsedCode + 1;
        // Convert the number to a 4-digit string, padded with leading zeros
        const paddedNumber = nextUserCode.toString().padStart(4, '0');
        // Combine the prefix "USR" with the padded number to form the complete user code
        const userCode = `USR${paddedNumber}`;
        // Update the last used user code in localStorage
        localStorage.setItem('lastUsedUserCode', nextUserCode.toString());
        return userCode;
    }

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
}