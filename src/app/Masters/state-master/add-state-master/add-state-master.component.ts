import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { StateMaster } from "src/app/core/models/Masters/State Master/StateMaster";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from "sweetalert2";
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
        this.getCountryList();
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private route: Router, private fb: UntypedFormBuilder,
        private filter: FilterUtils,
        private masterService: MasterService
    ) {
        const extrasState = this.route.getCurrentNavigation()?.extras?.state;
        if (extrasState) {
            this.data = extrasState.data;
            this.countryCode = this.data.country;
            this.action = 'edit';
            this.isUpdate = true;
            this.stateTabledata = this.data;
            this.breadScrums = [{
                title: "State Master",
                items: ["Home"],
                active: "Edit State",
            }];
        } else {
            this.action = "Add";
            this.isUpdate = false;
            this.breadScrums = [{
                title: "State Master",
                items: ["Home"],
                active: "Add State",
            }];
            this.stateTabledata = new StateMaster({});
        }
        this.initializeFormControl();
        if (this.isUpdate) {
            this.stateTableForm.controls["stateType"].setValue(this.stateTabledata.stateType);
        }
    }
    initializeFormControl() {
        // Create StateFormControls instance to get form controls for different sections
        this.stateFormControls = new StateControl(this.stateTabledata, this.isUpdate);
        // Get form controls for State Details section
        this.jsonControlStateArray = this.stateFormControls.getFormControls();
        this.jsonControlStateArray.forEach(data => {
            switch (data.name) {
                case 'country':
                    this.country = data.name;
                    this.countryStatus = data.additionalData.showNameAndValue;
                    break;
                //we can add more cases here if needed
                default:
                    //handle other cases if needed
                    break;
            }
        });
        this.stateTableForm = formGroupBuilder(this.fb, [this.jsonControlStateArray]);
    }

    getCountryList() {
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

    async dataExist() {
        if (!this.isUpdate) {
            let req = {
                "companyCode": this.companyCode,
                "collectionName": "state_detail",
                "filter": {}
            };
            const res = await this.masterService.masterPost("generic/get", req).toPromise()
            // Check if the stateName || stateAlias ||  gstWiseStateCode already exists in this.data
            const stateExists = res.data.some((state) => state.stateName === this.stateTableForm.value.stateName
                || state.stateAlias === this.stateTableForm.value.stateAlias || state.gstWiseStateCode == this.stateTableForm.value.gstWiseStateCode);
            if (stateExists) {
                // Show the popup indicating that the state already exists
                Swal.fire({
                    title: 'Data exists! Please try with another',
                    toast: true,
                    icon: "error",
                    showCloseButton: false,
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonText: "OK"
                });
                this.stateTableForm.controls["stateName"].reset();
                this.stateTableForm.controls["stateAlias"].reset();
                this.stateTableForm.controls["gstWiseStateCode"].reset();
            }
        }
    }

    async save() {
        this.stateTableForm.controls["country"].setValue(this.stateTableForm.value.country.name);
        this.stateTableForm.controls["activeflag"].setValue(this.stateTableForm.value.activeflag == true ? "Y" : "N");

        if (this.isUpdate) {
            // Remove the "id" field from the form controls
            this.stateTableForm.removeControl("id");

            let req = {
                companyCode: this.companyCode,
                collectionName: "state_detail",
                filter: {
                    _id: this.data._id,
                },
                update: this.stateTableForm.value
            };
            const res = await this.masterService.masterPut("generic/update", req).toPromise()
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

        } else {
            this.stateTableForm.controls["stateCode"].setValue(this.stateTableForm.value.stateAlias);
            this.stateTableForm.controls["_id"].setValue(this.stateTableForm.value.stateAlias);

            let req = {
                companyCode: this.companyCode,
                collectionName: "state_detail",
                data: this.stateTableForm.value
            };
            const res = await this.masterService.masterPost("generic/create", req).toPromise()
            if (res) {
                // Display success message
                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                });
                //this.route.navigateByUrl('/Masters/StateMaster/StateMasterView');
                window.location.reload();
            }
        }
    }

    cancel() {
        this.route.navigateByUrl('/Masters/StateMaster/StateMasterView');
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