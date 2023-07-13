import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { PincodeControl } from "src/assets/FormControls/pincodeMaster";

@Component({
    selector: 'app-add-pincode-master',
    templateUrl: './add-pincode-master.component.html'
})

export class AddPinCodeMasterComponent implements OnInit {
    breadScrums: { title: string; items: string[]; active: string; }[];
    action: string;
    isUpdate = false;
    pincodeTable: PincodeMaster;
    pincodeTableForm: UntypedFormGroup;
    stateStatus: any;
    stateList: any;
    cityStatus: boolean;
    cityList: string;
    pincatStatus: boolean;
    jsonControlArray: any;
    pincodeFormControls: PincodeControl;
    State: any;
    City: any;
    updateState: any;
    statename: any;
    cityname: any;
    pincatList: any;
    updateCity: any;

    ngOnInit(): void {
        this.getStateData();
        this.getCityList();
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private route: Router, private fb: UntypedFormBuilder,
        private filter: FilterUtils, private service: utilityService,private masterService: MasterService) {
        if (this.route.getCurrentNavigation()?.extras?.state != null) {
            this.data = route.getCurrentNavigation().extras.state.data;
            this.statename = this.data.stateName;
            this.cityname = this.data.cityname
            this.action = 'edit'
            this.isUpdate = true;
        } else {
            this.action = "Add";
        }
        if (this.action === 'edit') {
            this.isUpdate = true;
            this.pincodeTable = this.data;
            this.breadScrums = [
                {
                    title: "Pincode Master",
                    items: ["Home"],
                    active: "Edit Pincode",
                },
            ];
        } else {
            this.breadScrums = [
                {
                    title: "Pincode Master",
                    items: ["Home"],
                    active: "Add Pincode",
                },
            ];
            this.pincodeTable = new PincodeMaster({});
        }
        this.initializeFormControl();
    }

    initializeFormControl() {
        //throw new Error("Method not implemented.");
        // Create PincodeFormControls instance to get form controls for different sections
        this.pincodeFormControls = new PincodeControl(this.pincodeTable, this.isUpdate);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pincodeFormControls.getPincodeFormControls();
        this.jsonControlArray.forEach(data => {
            if (data.name === 'State') {
                // Set State-related variables
                this.stateList = data.name;
                this.stateStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === 'City') {
                // Set City-related variables
                this.cityList = data.name;
                this.cityStatus = data.additionalData.showNameAndValue;
            }

        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.pincodeTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

        //for set static dropdown
        this.pincodeTableForm.controls["pincodeCategory"].setValue(
            this.pincodeTable.pincodeCategory
        )
    }

    getStateData() {
            this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res =>{
            this.State = res;
            let tableArray = this.State.stateList;
            let state = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.stateDesc,
                    value: element.stateId
                }
                state.push(dropdownList)
            });
            
            if (this.isUpdate) {
                this.updateState = state.find((x) => x.name == this.statename);
                this.pincodeTableForm.controls.State.setValue(this.updateState);
            }

            this.filter.Filter(
                this.jsonControlArray,
                this.pincodeTableForm,
                state,
                this.stateList,
                this.stateStatus
            );
        });
    }
    getCityList() {
            this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res =>{
            this.City = res;
            let tableArray = this.State.cityList;
            let city = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.cityDesc,
                    value: element.cityId
                }
                city.push(dropdownList)
            });
            if (this.isUpdate) {
                this.updateCity = city.find((x) => x.name == this.cityname);
                this.pincodeTableForm.controls.City.setValue(this.updateCity);
            }

            this.filter.Filter(
                this.jsonControlArray,
                this.pincodeTableForm,
                city,
                this.cityList,
                this.cityStatus
            );
        });
    }

    cancel() {
        window.history.back();
    }
    save() {
        this.pincodeTableForm.controls["State"].setValue(this.pincodeTableForm.value.State.value);
        this.pincodeTableForm.controls["City"].setValue(this.pincodeTableForm.value.City.value);
        this.pincodeTableForm.controls["isActive"].setValue(this.pincodeTableForm.value.isActive == true ? "Y" : "N");
        this.pincodeTableForm.controls["serviceable"].setValue(this.pincodeTableForm.value.serviceable == true ? "Y" : "N");
        this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
        this.service.exportData(this.pincodeTableForm.value)
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