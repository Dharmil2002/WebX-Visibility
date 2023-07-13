import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";
import { UserControl } from "src/assets/FormControls/userMaster";


@Component({
    selector: 'app-add-user-master',
    templateUrl: './add-user-master.component.html'
})

export class AddUserMasterComponent implements OnInit {
    jsonControlUserArray: any;
    userTableForm: UntypedFormGroup;
    isUpdate = false;
    action: string;
    userTable: UserMaster;
    branchCode: any;
    retrievedData: string;
    emptype: any;
    userType: any;
    deptId: string;
    userLocations: string[];
    userDetails: any;
    breadScrums = [{}];
    location: any;
    divisionStatus: any;
    locationName: any;
    userLocationStatus: any;
    deptidStatus: any;
    userRoleStatus: any;
    userRole: any;
    manageridStatus: any;
    managerID: any;
    userStatus: any;
    userstatus: any;
    countryCodeStatus: any;
    countryCode: any;
    userTypeStatus: any;
    locationStatus: any;
    UserFormControls: UserControl;
    locationData: any;
    departId: any;
    countryData: any;
    updateCountry: any;
    divisionAccess: any;
    multiLocation: any;
    locationList: any;
    userList: any;
    managerId: any;
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
    ngOnInit(): void {
        this.bindDropdown();
        this.getDropDownData();
    }

    constructor(private service: utilityService, private filter: FilterUtils, private route: Router, private fb: UntypedFormBuilder, private masterService: MasterService
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
            this.userType = this.userTable.userStatus;
            this.emptype = this.userTable.userType;
            this.managerID = this.userTable.managerID;
            this.roleIdData = this.userTable.role;
            this.countryCode = this.userTable.country;
            this.divisionAccess = this.userTable.division;
            this.deptId = this.userTable.department;
            this.userLocations =
                this.userTable.userLocations == null
                    ? [""]
                    : this.userTable.userLocations.split(",");

            this.division =
                this.userTable.divId == null ? [""] : this.userTable.divId.split(",");

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
        this.InitializeFormControl();
        if (this.isUpdate == true) {
            this.userTableForm.removeControl("EntryBy");
            this.userTableForm.removeControl("userPwd");
            this.userTableForm.removeControl("ConfirmPassword");
        } else {
            this.userTableForm.removeControl("UpdateBy");
        }
        this.retrievedData = localStorage.getItem("currentUser");
        this.userDetails = JSON.parse(this.retrievedData);
        this.isUpdate
            ? this.userTableForm.controls.gender.setValue(this.userTable.gender)
            : "";
    }

    bindDropdown() {
        this.jsonControlUserArray.forEach((data) => {
            if (data.name === "BranchCode") {
                // Set BranchCode-related variables
                this.location = data.name;
                this.locationStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "emptype") {
                // Set emptype-related variables
                this.userType = data.name;
                this.userTypeStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "CountryCode") {
                // Set CountryCode-related variables
                this.countryCode = data.name;
                this.countryCodeStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "User_Type") {
                // Set User_Type-related variables
                this.userstatus = data.name;
                this.userStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "ManagerId") {
                // Set ManagerId-related variables
                this.managerId = data.name;
                this.manageridStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "ROLEID") {
                // Set ROLEID-related variables
                this.userRole = data.name;
                this.userRoleStatus = data.additionalData.showNameAndValue;
            }

            if (data.name === "UserLocations") {
                // Set UserLocations-related variables
                this.locationName = data.name;
                this.userLocationStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === "DivisioncontrolHandler") {
                // Set DivisioncontrolHandler-related variables
                this.division = data.name;
                this.divisionStatus = data.additionalData.showNameAndValue;
            }
        });
    }
    InitializeFormControl() {
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
            this.multiLocation = locationData;
            this.countryList = countryData;

            if (this.isUpdate) {
                this.updateLocation = this.findDropdownItemByName(this.locationList, this.userTable.location);
                this.userTableForm.controls.BranchCode.setValue(this.updateLocation);

                this.updateUser = this.findDropdownItemByName(this.userStatusData, this.userTable.userStatus);
                this.userTableForm.controls.emptype.setValue(this.updateUser);

                this.updateUserStatus = this.findDropdownItemByName(this.userData, this.userTable.userType);
                this.userTableForm.controls.User_Type.setValue(this.updateUserStatus);

                this.updateManagerId = this.findDropdownItemByName(this.managerIdData, this.userTable.managerID);
                this.userTableForm.controls.ManagerId.setValue(this.updateManagerId);

                this.updateRoleId = this.findDropdownItemByName(this.roleIdData, this.userTable.role);
                this.userTableForm.controls.ROLEID.setValue(this.updateRoleId);

                this.updateCountry = this.findDropdownItemByName(this.countryList, this.userTable.country);
                this.userTableForm.controls.CountryCode.setValue(this.updateCountry);

                // Patches the Div control value of UserTableForm with filter
                this.userTableForm.controls["Division"].patchValue(this.divisionList.filter((element) =>
                    this.userTable.division.split(',').includes(element.name)
                ));
            }
            const filterParams = [
                [this.jsonControlUserArray, this.managerIdData, this.managerId, this.manageridStatus],
                [this.jsonControlUserArray, this.userData, this.userType, this.userTypeStatus],
                [this.jsonControlUserArray, this.userStatusData, this.userstatus, this.userStatus],
                [this.jsonControlUserArray, this.roleIdData, this.userRole, this.userRoleStatus],
                [this.jsonControlUserArray, this.countryList, this.countryCode, this.countryCodeStatus],
                [this.jsonControlUserArray, this.locationList, this.location, this.locationStatus],
                [this.jsonControlUserArray, this.divisionList, this.division, this.divisionStatus],
                [this.jsonControlUserArray, this.multiLocation, this.locationName, this.userLocationStatus],
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
        const { BranchCode, emptype, UserLocations, User_Type, ManagerId, ROLEID, DivisioncontrolHandler, CountryCode } = this.userTableForm.value;
        const controls = this.userTableForm.controls;

        controls["BranchCode"].setValue(BranchCode);
        controls["emptype"].setValue(emptype);
        controls["UserLocations"].setValue(UserLocations);
        controls["User_Type"].setValue(User_Type);
        controls["ManagerId"].setValue(ManagerId);
        controls["ROLEID"].setValue(ROLEID);
        controls["DivisioncontrolHandler"].setValue(DivisioncontrolHandler);
        controls["CountryCode"].setValue(CountryCode);

        this.route.navigateByUrl('/Masters/UserMaster/UserMasterView');
        this.service.exportData(this.userTableForm.value);

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
}