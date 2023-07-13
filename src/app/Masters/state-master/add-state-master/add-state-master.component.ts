import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { StateMaster } from "src/app/core/models/Masters/State Master/StateMaster";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from "sweetalert2";
import { generateRandomNumber, getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";
import { StateControl } from "src/assets/FormControls/StateControl";


@Component({
    selector: 'app-add-state-master',
    templateUrl: './add-state-master.component.html'
})
export class AddStateMasterComponent implements OnInit {
    breadScrums: { title: string; items: string[]; active: string; }[];
    countryCode: any;
    action: string;
    isUpdate = false;
    stateTabledata: StateMaster;
    stateTableForm: UntypedFormGroup;
    stateFormControls: StateControl;
    jsonControlStateArray: any;
    Country: any;
    countryStatus: any;
    countrylistStatus: any;
    countrylist: any;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    country: any;
    savedData: StateMaster;
    updateCountry: any;
    ngOnInit() {
        // throw new Error("Method not implemented.");
        this.getCountryList();
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
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private route: Router, private fb: UntypedFormBuilder,
        private filter: FilterUtils, private service: utilityService,
        private masterService: MasterService

    ) {
        if (this.route.getCurrentNavigation()?.extras?.state != null) {
            this.data = route.getCurrentNavigation().extras.state.data;
            this.countryCode = this.data.country;
            this.action = 'edit'
            this.isUpdate = true;
        } else {
            this.action = "Add";
        }
        if (this.action === 'edit') {
            this.isUpdate = true;
            this.stateTabledata = this.data;
            this.breadScrums = [
                {
                    title: "State Master",
                    items: ["Home"],
                    active: "Edit State",
                },
            ];
        } else {
            this.breadScrums = [
                {
                    title: "State Master",
                    items: ["Home"],
                    active: "Add State",
                },
            ];
            this.stateTabledata = new StateMaster({});
        }
        this.initializeFormControl();
        this.isUpdate ? this.stateTableForm.controls["stateType"].setValue(this.stateTabledata.stateType) : "";
    }
    initializeFormControl() {
        // throw new Error("Method not implemented.");
        // Create StateFormControls instance to get form controls for different sections
        this.stateFormControls = new StateControl(this.stateTabledata, this.isUpdate);
        // Get form controls for State Details section
        this.jsonControlStateArray = this.stateFormControls.getFormControls();
        this.jsonControlStateArray.forEach(data => {
            if (data.name === 'country') {
                // Set country-related variables
                this.country = data.name;
                this.countryStatus = data.additionalData.showNameAndValue;
            }
        });
        this.stateTableForm = formGroupBuilder(this.fb, [this.jsonControlStateArray]);


    }

    cancel() {
        window.history.back();
        //this.Route.navigateByUrl("/Masters/StateMaster/StateMasterView");
    }

    getCountryList() {
        //throw new Error("Method not implemented.");
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            this.Country = res;
            let tableArray = this.Country.countryList;
            let countryList = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.codeDesc,
                    value: element.codeId
                }
                countryList.push(dropdownList)
            });
            if (this.isUpdate) {
                this.updateCountry = countryList.find((x) => x.name == this.countryCode);
                this.stateTableForm.controls['country'].setValue(this.updateCountry);
            }
            this.filter.Filter(
                this.jsonControlStateArray,
                this.stateTableForm,
                countryList,
                this.country,
                this.countryStatus,
            );

        });

    }

    save() {
        // Set the value of "country" control to its name property
        this.stateTableForm.controls["country"].setValue(this.stateTableForm.value.country.name);
    
        // Convert boolean value of "activeflag" to "Y" or "N"
        this.stateTableForm.controls["activeflag"].setValue(this.stateTableForm.value.activeflag == true ? "Y" : "N");
    
        if (this.isUpdate) {
            let id = this.stateTableForm.value.id;
    
            // Remove the "id" field from the form controls
            this.stateTableForm.removeControl("id");
    
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "state",
                id: id,
                data: this.stateTableForm.value
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
                        this.route.navigateByUrl('/Masters/StateMaster/StateMasterView');
                    }
                }
            });
        } else {
            const randomNumber = getShortName(this.stateTableForm.value.stateName);
            this.stateTableForm.controls["stateCode"].setValue(randomNumber);
            this.stateTableForm.controls["id"].setValue(randomNumber);
    
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "state",
                data: this.stateTableForm.value
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
                        this.route.navigateByUrl('/Masters/StateMaster/StateMasterView');
                    }
                }
            });
        }
    }
    
    
}