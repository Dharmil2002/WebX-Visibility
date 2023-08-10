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
import Swal from "sweetalert2";


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
    updateState: any;
    statename: any;
    cityname: any;
    pincatList: any;
    updateCity: any;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    state: any;
    city: any;
    cityRes: any;
    stateRes: any;
    cityData: any;
    stateData: any;

    ngOnInit(): void {
        this.getStateData();
        this.getCityList();
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: Router, private fb: UntypedFormBuilder,
        private filter: FilterUtils, private service: utilityService, private masterService: MasterService) {
        if (this.route.getCurrentNavigation()?.extras?.state?.data != null) {
            this.data = this.route.getCurrentNavigation().extras.state.data;
            this.action = 'edit';
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
            this.action = "Add";
            this.isUpdate = false;
            this.pincodeTable = new PincodeMaster({});
            this.breadScrums = [
                {
                    title: "Pincode Master",
                    items: ["Home"],
                    active: "Add Pincode",
                },
            ];
        }

        this.initializeFormControl();

    }

    initializeFormControl() {
        // Create PincodeFormControls instance to get form controls for different sections
        this.pincodeFormControls = new PincodeControl(this.pincodeTable, this.isUpdate);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pincodeFormControls.getPincodeFormControls();
        this.jsonControlArray.forEach(data => {
            if (data.name === 'state') {
                // Set State-related variables
                this.stateList = data.name;
                this.stateStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === 'city') {
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

    dataExist() {
        let req = {
            companyCode: this.companyCode,
            type: "masters",
            collection: "pincode_detail"
        };
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                // Check if the Pincode already exists in this.data
                const pincodeExists = res.data.some((pincode) => pincode.pincode === this.pincodeTableForm.value.pincode
                   );
                if (pincodeExists) {
                    // Show the popup indicating that the pincode already exists
                    Swal.fire({
                        title: 'Data exists! Please try with another',
                        toast: true,
                        icon: "error",
                        showCloseButton: false,
                        showCancelButton: false,
                        showConfirmButton: true,
                        confirmButtonText: "OK"
                    });
                    this.pincodeTableForm.controls["pincode"].reset();
                    
                }
            },
            error: (err: any) => {
                // Handle error if required
                console.error(err);
            }
        });
    }

    getStateData() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "state_detail"
        };
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                const stateList = res.data.map(element => ({
                    name: element.stateName,
                    value: element.id
                }));
                if (this.isUpdate) {
                    this.stateData = stateList.find((x) => x.name == this.data.state);
                    this.pincodeTableForm.controls.state.setValue(this.stateData);
                }
                this.filter.Filter(
                    this.jsonControlArray,
                    this.pincodeTableForm,
                    stateList,
                    this.stateList,
                    this.stateStatus
                );
            }
        });
    }

    getCityList() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "city_detail"
        };
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                const cityList = res.data.map(element => ({
                    name: element.cityName,
                    value: element.id
                }));
                if (this.isUpdate) {
                    this.cityData = cityList.find((x) => x.name == this.data.city);
                    this.pincodeTableForm.controls.city.setValue(this.cityData);
                }
                this.filter.Filter(
                    this.jsonControlArray,
                    this.pincodeTableForm,
                    cityList,
                    this.cityList,
                    this.cityStatus
                );
            }
        });
    }

    cancel() {
        window.history.back();
      }
    save() {
        this.pincodeTableForm.controls["state"].setValue(this.pincodeTableForm.value.state.name);
        this.pincodeTableForm.controls["city"].setValue(this.pincodeTableForm.value.city.name);
        this.pincodeTableForm.controls["pincodeCategory"].setValue(this.pincodeTableForm.value.pincodeCategory);
        this.pincodeTableForm.controls["isActive"].setValue(this.pincodeTableForm.value.isActive === true ? true : false);
        this.pincodeTableForm.controls["serviceable"].setValue(this.pincodeTableForm.value.serviceable === true ? true : false);
        this.pincodeTableForm.removeControl("isUpdate");
        this.pincodeTableForm.removeControl("companyCode");

        if (this.isUpdate) {
            let id = this.pincodeTableForm.value.id;
            // Remove the "id" field from the form controls
            this.pincodeTableForm.removeControl("id");
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "pincode_detail",
                id: this.data.id,
                updates: this.pincodeTableForm.value
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
                        this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
                    }
                }
            });
        } else {
           // const randomNumber = getShortName(this.pincodeTableForm.value.city);
            this.pincodeTableForm.controls["id"].setValue(this.pincodeTableForm.value.pincode);
            let req = {
                companyCode: this.companyCode,
                type: "masters",
                collection: "pincode_detail",
                data: this.pincodeTableForm.value
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
                        this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
                    }
                }
            });
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