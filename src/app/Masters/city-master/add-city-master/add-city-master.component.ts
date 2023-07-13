import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CityMaster } from "src/app/core/models/Masters/City Master/City Master";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { CityControl } from "src/assets/FormControls/cityControls";
@Component({
    selector: 'app-add-city-master',
    templateUrl: './add-city-master.component.html'
})
export class AddCityMasterComponent implements OnInit {
    //countryURL = '../../../assets/data/state-countryDropdown.json'
    stateDetails: any;
    stateStatus: any;
    zoneStatus: any;
    state: any;
    zone: any;
    cityTableForm: UntypedFormGroup;
    jsonControlCityArray: any;
    cityTableData: CityMaster;
    isUpdate = false;
    action: string;
    breadScrums: { title: string; items: string[]; active: string }[];
    stateId: any;
    zoneId: any;
    retrievedData: string;
    cityFormControls: CityControl;
    country: any;
    countryCode: any;
    updateCountry: any;
    stateList: any[];
    stateData: any;
    zoneData: any;
    constructor(private route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: UntypedFormBuilder, private filter: FilterUtils,
         private service: utilityService,private masterService: MasterService) {
        if (this.route.getCurrentNavigation()?.extras?.state != null) {
            this.data = route.getCurrentNavigation().extras.state.data;
            this.stateId = this.data.stateName;
            this.zoneId = this.data.zoneName;
            this.isUpdate = true;
            this.action = "edit";
        } else {
            this.action = "Add";
        }
        if (this.action === "edit") {
            this.isUpdate = true;
            this.cityTableData = this.data;
            this.stateId = this.cityTableData.stateName;
            this.zoneId = this.cityTableData.zoneName;
            this.breadScrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Edit City",
                },
            ];
        } else {
            this.breadScrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Add City",
                },
            ];
            this.cityTableData = new CityMaster({});
        }
        this.retrievedData = localStorage.getItem("currentUser");
        this.stateDetails = JSON.parse(this.retrievedData);
        this.intializeFormControls();
    }
    intializeFormControls() {
        
        //throw new Error("Method not implemented.");
        this.cityFormControls = new CityControl(this.cityTableData, this.isUpdate);
        this.jsonControlCityArray = this.cityFormControls.getFormControls();
        this.jsonControlCityArray.forEach(data => {
            if (data.name === 'state') {
                // Set State-related variables
                this.state = data.name;
                this.stateStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === 'zone') {
                // Set Zone-related variables
                this.zone = data.name;
                this.zoneStatus = data.additionalData.showNameAndValue;
            }
        });
        this.cityTableForm = formGroupBuilder(this.fb, [this.jsonControlCityArray]);
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.getStateData();
        this.getZoneData();
    }

    cancel() {
        window.history.back();
        //this.Route.navigateByUrl("/Masters/CityMaster/CityMasterView);
    }

    save() {
        this.cityTableForm.controls["state"].setValue(this.cityTableForm.value.state.value);
        this.cityTableForm.controls["zone"].setValue(this.cityTableForm.value.zone.value);
        this.cityTableForm.controls["isActive"].setValue(this.cityTableForm.value.isActive == true ? "Y" : "N");
        this.route.navigateByUrl('/Masters/CityMaster/CityMasterView');
        this.service.exportData(this.cityTableForm.value)
    }
    getZoneData() {
        //throw new Error("Method not implemented.");
            this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res =>{
            //this.http.get(this.countryURL).subscribe(res => {
            this.zoneData = res;
            let tableArray = this.zoneData.zoneList;
            let zone = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.zoneDesc,
                    value: element.zoneId
                }
                zone.push(dropdownList)
            });
            if (this.isUpdate) {
                
                this.updateCountry = zone.find((x) => x.name == this.zoneId);
                this.cityTableForm.controls.zone.setValue(this.updateCountry);
            }
            
            this.filter.Filter(
                this.jsonControlCityArray,
                this.cityTableForm,
                zone,
                this.zone,
                this.zoneStatus,
            );
        });
    }

    getStateData() {
        //this.http.get(this.countryURL).subscribe(res => {
            this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res =>{
            this.stateData = res;
            let tableArray = this.stateData.stateList;
            let state = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.stateDesc,
                    value: element.stateId
                }
                state.push(dropdownList)
            });
            if (this.isUpdate) {
                this.updateCountry = state.find((x) => x.name == this.stateId);
                this.cityTableForm.controls.state.setValue(this.updateCountry);
            }
            this.filter.Filter(
                this.jsonControlCityArray,
                this.cityTableForm,
                state,
                this.state,
                this.stateStatus
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