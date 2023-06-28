import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CityMaster } from "src/app/core/models/Masters/City Master/City Master";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CityControl } from "src/assets/FormControls/CityControls";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { HttpClient } from '@angular/common/http';
import { utilityService } from 'src/app/Utility/utility.service';



@Component({
    selector: 'app-add-city-master',
    templateUrl: './add-city-master.component.html'
})

export class AddCityMasterComponent implements OnInit {
    countryURL = '../../../assets/data/state-countryDropdown.json'
    stateDetails: any;
    StateStatus: any;
    ZoneStatus: any;
    State: any;
    Zone: any;
    CityTableForm: UntypedFormGroup;
    jsonControlCityArray: any;
    CityTabledata: CityMaster;
    IsUpdate = false;
    action: string;
    breadscrums: { title: string; items: string[]; active: string }[];
    stateId: any;
    zoneId: any;
    retrievedData: string;
    CityFormControls: CityControl;
    Country: any;
    StateBind: any;
    StateList: any;
    countryCode: any;
    UpdateCountry: any;
    state: any;
    stateList: any[];
    zone: any;

    constructor(private Route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: UntypedFormBuilder, private filter: FilterUtils,
        private http: HttpClient,private service: utilityService) {
        //super();
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
             this.data = Route.getCurrentNavigation().extras.state.data;
            this.stateId = this.data.stateName;
            this.zoneId = this.data.zoneName;
            this.IsUpdate = true;
            this.action = "edit";
        } else {
            this.action = "Add";
        }
        if (this.action === "edit") {
            this.IsUpdate = true;
            this.CityTabledata = this.data;
            // this.stateId = this.CityTabledata.stateName;
            // this.zoneId = this.CityTabledata.zoneName;
            this.breadscrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Edit City",
                },
            ];
        } else {
            this.breadscrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Add City",
                },
            ];
            this.CityTabledata = new CityMaster({});
        }
        this.retrievedData = localStorage.getItem("currentUser");
        this.stateDetails = JSON.parse(this.retrievedData);
        this.IntializeFormControls();
    }

    IntializeFormControls() {
        //throw new Error("Method not implemented.");
        this.CityFormControls = new CityControl(this.CityTabledata, this.IsUpdate);
        this.jsonControlCityArray = this.CityFormControls.getFormControls();
        this.jsonControlCityArray.forEach(data => {
            if (data.name === 'State') {
                // Set State-related variables
                this.state = data.name;
                this.StateStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === 'Zone') {
                // Set Zone-related variables
                this.zone = data.name;
                this.ZoneStatus = data.additionalData.showNameAndValue;
            }
        });
        this.CityTableForm = formGroupBuilder(this.fb, [this.jsonControlCityArray]);
    }

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.GetStateData();
        this.GetZoneData();
    }

    cancel() {
        window.history.back();
        //this.Route.navigateByUrl("/Masters/CityMaster/CityMasterView);
    }

    save(){
        this.CityTableForm.controls["cityId"].setValue(this.CityTableForm.value.cityId);
        this.CityTableForm.controls["cityName"].setValue(this.CityTableForm.value.cityName);
        this.CityTableForm.controls["State"].setValue(this.CityTableForm.value.State.value);
        this.CityTableForm.controls["Zone"].setValue(this.CityTableForm.value.Zone.value);
        this.CityTableForm.controls["isActive"].setValue(this.CityTableForm.value.isActive== true ? "Y" : "N");


        this.Route.navigateByUrl('/Masters/CityMaster/CityMasterView');
        this.service.exportData(this.CityTableForm.value)
    }
    GetZoneData() {
        //throw new Error("Method not implemented.");
        
        this.http.get(this.countryURL).subscribe(res => {
            this.Zone = res;
            let tableArray = this.Zone.zoneList;
            let zone = [];
            tableArray.forEach(element => {
                let dropdownList={
                    name : element.ZoneDesc,
                    value: element.ZoneId
                }
                zone.push(dropdownList)
            });
            if (this.IsUpdate) {
                this.UpdateCountry = zone.find((x) => x.name == this.zoneId);
                this.CityTableForm.controls.Zone.setValue(this.UpdateCountry);
            }
            this.filter.Filter(
                this.jsonControlCityArray,
                this.CityTableForm,
                zone,
                this.zone,
                this.ZoneStatus,
            );
        });
    }

    GetStateData() {
        this.http.get(this.countryURL).subscribe(res => {
            this.State = res;
            let tableArray = this.State.stateList;
            let state = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.StateDesc,
                    value: element.StateId
                }
                state.push(dropdownList)
            });
            if (this.IsUpdate) {
                this.UpdateCountry = state.find((x) => x.name == this.stateId);
                this.CityTableForm.controls.State.setValue(this.UpdateCountry);
            }

            this.filter.Filter(
                this.jsonControlCityArray,
                this.CityTableForm,
                state,               
                this.state,
                this.StateStatus
            );
        });
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