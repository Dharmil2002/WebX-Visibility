
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UserMaster } from "src/app/core/models/Masters/User Master/user-master";
import { UserControl } from "src/assets/FormControls/userMaster";
import Swal from "sweetalert2";

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
    userType: any;
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
    countryList: any;
    updateLocation: any;
    updateUser: any;
    updateUserStatus: any;
    updateManagerId: any;
    managerIdData: any;
    divisionList: any;
    division: any;
    confirmpassword: any;
    newUserCode: any;
    jsonControlArray: any[];

    ngOnInit(): void {
        this.bindDropdown();
        this.getDropDownData();
        this.getAllMastersData();
    }

    constructor(private filter: FilterUtils, private route: Router, private fb: UntypedFormBuilder, private masterService: MasterService
    ) {
        const extrasState = this.route.getCurrentNavigation()?.extras?.state;
        this.isUpdate = false;
        this.action = extrasState ? "edit" : "add";
        if (this.action === "edit") {
            this.userTable = extrasState.data;
            this.isUpdate = true;
            this.breadScrums = [{
                title: "User Master",
                items: ["Master"],
                active: "Edit User",
            }];
        } else {
            this.breadScrums = [{
                title: "User Master",
                items: ["Master"],
                active: "Add User",
            }];
            this.userTable = new UserMaster({});
        }
        this.initializeFormControl();
        //set value on edit
        this.userTableForm.controls["userpassword"].setValue(this.userTable.userpassword);
        this.userTableForm.controls['gender'].setValue(this.userTable.gender);
        this.userTableForm.controls["confirmpassword"].setValue(this.userTable.userpassword);
    }

    bindDropdown() {
        const propertyMappings = {
            branchCode: { property: 'location', statusProperty: 'locationStatus' },
            userType: { property: 'userType', statusProperty: 'userTypeStatus' },
            country: { property: 'countryCode', statusProperty: 'countryCodeStatus' },
            userStatus: { property: 'userName', statusProperty: 'userStatus' },
            managerId: { property: 'managerId', statusProperty: 'managerIdStatus' },
            role: { property: 'userRole', statusProperty: 'userRoleStatus' },
            multiLocation: { property: 'locationName', statusProperty: 'userLocationStatus' },
            multiDivisionAccess: { property: 'division', statusProperty: 'divisionStatus' },
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
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            const {
                managerId,
                divisionAccess,
                countryData
            } = res;
            this.managerIdData = managerId;
            this.divisionList = divisionAccess;
            this.countryList = countryData;

            if (this.isUpdate) {
                this.updateManagerId = this.findDropdownItemByName(this.managerIdData, this.userTable.managerId);
                this.userTableForm.controls.managerId.setValue(this.updateManagerId);

                this.updateCountry = this.findDropdownItemByName(this.countryList, this.userTable.country);
                this.userTableForm.controls.country.setValue(this.updateCountry);

                // Patches the Div control value of UserTableForm with filter
                this.userTableForm.controls["division"].patchValue(this.divisionList.filter((element) =>
                    this.userTable.multiDivisionAccess.includes(element.name)
                ));
            }
            const filterParams = [
                [this.jsonControlUserArray, this.managerIdData, this.managerId, this.managerIdStatus],
                [this.jsonControlUserArray, this.countryList, this.countryCode, this.countryCodeStatus],
                [this.jsonControlUserArray, this.divisionList, this.division, this.divisionStatus],
            ];
            filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
                this.filter.Filter(jsonControlArray, this.userTableForm, dropdownData, formControl, statusControl);
            });
        });
    }
    findDropdownItemByName(dropdownData, name) {
        return dropdownData.find(item => item.name === name);
    }

    //DropDown Binding from API
    async getAllMastersData() {
        try {
            const locationReq = {
                "companyCode": this.companyCode,
                "type": "masters",
                "collection": "location_detail"
            };
            const generalReqBody = {
                "companyCode": this.companyCode,
                "type": "masters",
                "collection": "General_master"
            }
            const locationsResponse = await this.masterService.masterPost('common/getall', locationReq).toPromise();
            const userStatusResponse = await this.masterService.masterPost('common/getall', generalReqBody).toPromise();

            const locations = locationsResponse.data
                .map(element => ({
                    name: String(element.locName),
                    value: String(element.locCode)
                }));

            //Code Type = 'EMPST'
            const userStatusList = userStatusResponse.data.filter(item => item.codeType === "EMPST" && item.activeFlag).
                map((x) => {
                    { return { name: x.codeDesc, value: x.codeId } }
                });

            //Code Type = 'usertyp'
            const userTypeList = userStatusResponse.data.filter(item => item.codeType === "usertyp" && item.activeFlag).
                map((x) => {
                    { return { name: x.codeDesc, value: x.codeId } }
                });

            //Code Type = 'usertyp'
            const userRoleList = userStatusResponse.data.filter(item => item.codeType === "USERROLE" && item.activeFlag).
                map((x) => {
                    { return { name: x.codeDesc, value: x.codeId } }
                });

            if (this.isUpdate) {
                const userLocation = locations.find((x) => x.name === this.userTable.branchCode);
                this.userTableForm.controls['branchCode'].setValue(userLocation);

                const userStatus = userStatusList.find((x) => x.name === this.userTable.userStatus);
                this.userTableForm.controls['userStatus'].setValue(userStatus);

                const userType = userTypeList.find((x) => x.name === this.userTable.userType);
                this.userTableForm.controls['userType'].setValue(userType);

                const userRole = userRoleList.find((x) => x.name === this.userTable.role);
                this.userTableForm.controls['role'].setValue(userRole);

                this.userTableForm.controls["userLocationscontrolHandler"].patchValue(locations.filter((element) =>
                    this.userTable.multiLocation.includes(element.name)
                ));
            }
            this.filter.Filter(this.jsonControlUserArray, this.userTableForm, locations, this.locationName, this.userLocationStatus);
            this.filter.Filter(this.jsonControlUserArray, this.userTableForm, locations, this.location, this.locationStatus);
            this.filter.Filter(this.jsonControlUserArray, this.userTableForm, userStatusList, this.userName, this.userStatus);
            this.filter.Filter(this.jsonControlUserArray, this.userTableForm, userTypeList, this.userType, this.userTypeStatus);
            this.filter.Filter(this.jsonControlUserArray, this.userTableForm, userRoleList, this.userRole, this.userRoleStatus);

        }
        catch (error) {
            // Handle any errors that occurred during the request
            console.error('Error:', error);
        }
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

        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            "type": "masters",
            "collection": "user_master"
        }
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                if (res) {
                    // Generate srno for each object in the array
                    const lastUserId = res.data[res.data.length - 1];
                    const lastUserCode = lastUserId ? parseInt(lastUserId.userId.substring(3)) : 0;
                    // Function to generate a new route code
                    function generateUserCode(initialCode: number = 0) {
                        const nextUserCode = initialCode + 1;
                        const userNumber = nextUserCode.toString().padStart(4, '0');
                        const userCode = `USR${userNumber}`;
                        return userCode;
                    }
                    if (this.isUpdate) {
                        this.newUserCode = this.userTable.id
                    } else {
                        this.newUserCode = generateUserCode(lastUserCode);
                    }
                    //generate unique userId
                    this.userTableForm.controls["userId"].setValue(this.newUserCode);

                    // Clear any errors in the form controls
                    Object.values(this.userTableForm.controls).forEach(control => control.setErrors(null));

                    if (this.isUpdate) {
                        // Remove the "id" field from the form controls
                        let req = {
                            companyCode: this.companyCode,
                            type: "masters",
                            collection: "user_master",
                            id: this.userTable.id,
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
                            },
                            complete() { },
                        });
                    }
                    else {
                        const data = this.userTableForm.value;
                        const id = { id: this.userTableForm.controls["userId"].value };
                        const mergedObject = { ...data, ...id };
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
                            },
                            complete() { },
                        });
                    }
                }
            },
            complete() { },
        });
    }
    cancel() {
        window.history.back();
    }

    functionCallHandler($event) {
        let functionName = $event.functionName;     // name of the function , we have to call
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
}