import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { StateMaster } from "src/app/core/models/Masters/State Master/StateMaster";
import { StateControl } from "src/assets/FormControls/StateControl";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-add-state-master',
    templateUrl: './add-state-master.component.html'
})

export class AddStateMasterComponent implements OnInit {
    countryURL = '../../../assets/data/state-countryDropdown.json'
    breadscrums: { title: string; items: string[]; active: string; }[];
    countryCode: any;
    action: string;
    IsUpdate = false;
    StateTabledata: StateMaster;
    StateTableForm: UntypedFormGroup;
    StateFormControls: StateControl;
    jsonControlStateArray: any;
    Country: any;
    CountryStatus: any;
    countrylistStatus: any;
    countrylist: any;
    companyCode: any;
    country: any;
    StateData: any;
    savedData: StateMaster;
    UpdateCountry: any;
    ngOnInit() {
        // throw new Error("Method not implemented.");
        this.getCountryList();
    }


    functionCallHandler($event) {
        debugger
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
        private Route: Router, private fb: UntypedFormBuilder, private http: HttpClient,
        private filter: FilterUtils, private service: utilityService
    ) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            debugger
            this.data = Route.getCurrentNavigation().extras.state.data;
            this.countryCode = this.data.countryName;
            console.log(this.countryCode); //log(this.countryCode);
            this.action = 'edit'
            this.IsUpdate = true;
        } else {
            this.action = "Add";
        }
        if (this.action === 'edit') {
            this.IsUpdate = true;
            this.StateTabledata = this.data;
            this.breadscrums = [
                {
                    title: "State Master",
                    items: ["Home"],
                    active: "Edit State",
                },
            ];
        } else {
            this.breadscrums = [
                {
                    title: "State Master",
                    items: ["Home"],
                    active: "Add State",
                },
            ];
            this.StateTabledata = new StateMaster({});
        }
        this.initializeFormControl();
        this.IsUpdate ? this.StateTableForm.controls["stateType"].setValue(this.StateTabledata.stateType) : "";
    }
    initializeFormControl() {
        // throw new Error("Method not implemented.");
        // Create StateFormControls instance to get form controls for different sections
        this.StateFormControls = new StateControl(this.StateTabledata, this.IsUpdate);
        // Get form controls for State Details section
        this.jsonControlStateArray = this.StateFormControls.getFormControls();
        this.jsonControlStateArray.forEach(data => {
            if (data.name === 'Country') {
                // Set country-related variables
                this.country = data.name;
                this.CountryStatus = data.additionalData.showNameAndValue;
            }
        });
        // Build the form group using formGroupBuilder function and the values of accordionData
        // this.StateTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
        this.StateTableForm = formGroupBuilder(this.fb, [this.jsonControlStateArray]);


    }

    cancel() {
        window.history.back();
        //this.Route.navigateByUrl("/Masters/StateMaster/StateMasterView");
    }

    getCountryList() {
        debugger
        //throw new Error("Method not implemented.");
        this.http.get(this.countryURL).subscribe(res => {
            debugger
            this.Country = res;
            let tableArray = this.Country.countryList;
            let countryList = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.CodeDesc,
                    value: element.CodeId
                }
                countryList.push(dropdownList)
            });
            if (this.IsUpdate) {
                this.UpdateCountry = countryList.find((x) => x.name == this.countryCode);
                this.StateTableForm.controls.Country.setValue(this.UpdateCountry);
            }
            debugger
            this.filter.Filter(
                this.jsonControlStateArray,
                this.StateTableForm,
                countryList,
                this.country,
                this.CountryStatus,
            );

        });

    }

    save() {
        this.StateTableForm.controls["stateName"].setValue(this.StateTableForm.value.stateName);
        this.StateTableForm.controls["stateType"].setValue(this.StateTableForm.value.stateType);
        this.StateTableForm.controls["stateAlias"].setValue(this.StateTableForm.value.stateAlias);
        this.StateTableForm.controls["Country"].setValue(this.StateTableForm.value.Country.value);
        this.StateTableForm.controls["GSTWiseStateCode"].setValue(this.StateTableForm.value.GSTWiseStateCode);
        this.StateTableForm.controls["activeflag"].setValue(this.StateTableForm.value.activeflag == true ? "Y" : "N");
        this.StateTableForm.controls["stateCode"].setValue(this.StateTableForm.value.stateCode);
        console.log(this.StateTableForm.value);

        this.Route.navigateByUrl('/Masters/StateMaster/StateMasterView');
        this.service.exportData(this.StateTableForm.value)
    }
}