import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CityMaster } from "src/app/core/models/Masters/City Master/City Master";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from "sweetalert2";
import { forkJoin } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CityControl } from "src/assets/FormControls/CityControls";


@Component({
    selector: 'app-add-city-master',
    templateUrl: './add-city-master.component.html'
})

export class AddCityMasterComponent implements OnInit {
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
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
    cityFormControls: CityControl;
    country: any;
    countryCode: any;
    updateCountry: any;
    stateList: any[];
    prevUsedCityCode: number = 0;
    stateName: any;

    constructor(private route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: UntypedFormBuilder, private filter: FilterUtils,private masterService: MasterService,
        ) {
        // Assuming "this.route" and "CityMaster" are already defined and initialized.
        // Extract data from navigation extras, if available
        const extrasState = this.route.getCurrentNavigation()?.extras?.state;
        if (extrasState) {
            this.data = extrasState.data;
            this.isUpdate = true;
            this.action = "edit";
            this.cityTableData = this.data; // Assuming this.data contains cityTableData when editing
            this.breadScrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Edit City",
                },
            ];
        } else {
            this.action = "Add";
            this.breadScrums = [
                {
                    title: "City Master",
                    items: ["Home"],
                    active: "Add City",
                },
            ];
            this.cityTableData = new CityMaster({});
        }
        // You might want to handle the case when "this.data" is not available
        // or does not contain the required properties (stateName, zoneName, etc.).
        // In the current code, there's no handling for such cases, so you might need to add it.
        this.intializeFormControls();
    }

    intializeFormControls() {
        // Initialize CityControl and get form controls
        this.cityFormControls = new CityControl(this.cityTableData, this.isUpdate);
        this.jsonControlCityArray = this.cityFormControls.getFormControls();

        // Set State-related and Zone-related variables
        const stateControl = this.jsonControlCityArray.find(data => data.name === 'state');
        this.state = stateControl.name;
        this.stateStatus = stateControl.additionalData.showNameAndValue;

        const zoneControl = this.jsonControlCityArray.find(data => data.name === 'zone');
        this.zone = zoneControl.name;
        this.zoneStatus = zoneControl.additionalData.showNameAndValue;

        // Build the form group
        this.cityTableForm = formGroupBuilder(this.fb, [this.jsonControlCityArray]);
    }

    ngOnInit(): void {
        this.fetchAndPopulateData();
    }

    cancel() {
        this.route.navigateByUrl('/Masters/CityMaster/CityMasterView');
    }

    async fetchAndPopulateData() {
        const stateReq = {
            companyCode: this.companyCode,
            collectionName: "state_detail",
            filter: {}
        };
        const zoneReq = {
            companyCode: this.companyCode,
            collectionName: "General_master",
            filter: {}
        };
        const [stateRes, zoneRes] = await forkJoin([
            this.masterService.masterPost("generic/get", stateReq).toPromise(),
            this.masterService.masterPost("generic/get", zoneReq).toPromise()
        ]).toPromise();
        const stateList = stateRes.data
            .filter(item => item.activeFlag)
            .map(element => ({ name: element.stateName, value: element.stateName }));

        const zoneList = zoneRes.data
            .filter(item => item.codeType === "ZONE" && item.activeFlag)
            .map(x => ({ name: x.codeDesc, value: x.codeId }));

        if (this.isUpdate) {
            const selectedState = stateList.find(x => x.name === this.cityTableData.state);
            this.cityTableForm.controls.state.setValue(selectedState);

            const selectedZone = zoneList.find(x => x.name === this.cityTableData.zone);
            this.cityTableForm.controls.zone.setValue(selectedZone);
        }
        this.filter.Filter(
            this.jsonControlCityArray,
            this.cityTableForm,
            stateList,
            this.state,
            this.stateStatus
        );
        this.filter.Filter(
            this.jsonControlCityArray,
            this.cityTableForm,
            zoneList,
            this.zone,
            this.zoneStatus
        );
    }

    async save() {
        this.cityTableForm.controls["state"].setValue(this.cityTableForm.value.state.name);
        this.cityTableForm.controls["zone"].setValue(this.cityTableForm.value.zone.name);
        this.cityTableForm.controls["odaFlag"].setValue(this.cityTableForm.value.odaFlag ? "Y" : "N");
        this.cityTableForm.controls["isActive"].setValue(this.cityTableForm.value.isActive === true ? true : false);

        //generate unique _id
        this.cityTableForm.controls["_id"].setValue(this.cityTableForm.value.cityName.name);
        this.cityTableForm.removeControl("CompanyCode");

        // Clear any errors in the form controls
        Object.values(this.cityTableForm.controls).forEach(control => control.setErrors(null));

        if (this.isUpdate) {
            let id = this.cityTableForm.value._id;
            this.cityTableForm.removeControl("_id");

            let req = {
                companyCode: this.companyCode,
                collectionName: "city_detail",
                filter: {
                    _id: this.data._id,
                },
                update: this.cityTableForm.value
            };
            const res = await this.masterService.masterPut("generic/update", req).toPromise()
            if (res) {
                // Display success message
                Swal.fire({
                    icon: "success",
                    title: "edited successfully",
                    text: res.message,
                    showConfirmButton: true,
                });
                this.route.navigateByUrl('/Masters/CityMaster/CityMasterView');
            }
        } else {
            let req = {
                companyCode: this.companyCode,
                collectionName: "city_detail",
                data: this.cityTableForm.value
            };
            const res = await this.masterService.masterPost("generic/create", req).toPromise()
            // Display success message
            Swal.fire({
                icon: "success",
                title: "data added successfully",
                text: res.message,
                showConfirmButton: true,
            });
            window.location.reload();
        }
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