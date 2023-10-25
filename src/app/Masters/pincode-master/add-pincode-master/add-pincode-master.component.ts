import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { PincodeControl } from "src/assets/FormControls/pincodeMaster";
import Swal from "sweetalert2";

@Component({
    selector: 'app-add-pincode-master',
    templateUrl: './add-pincode-master.component.html'
})

export class AddPinCodeMasterComponent implements OnInit {
    breadScrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any;}[];
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
    stateData: any;
    backPath:string;
    submit = 'Save';

    ngOnInit(): void {
        this.getStateData();
        this.getCityList();
        this.backPath = "/Masters/PinCodeMaster/PinCodeMasterList";
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: Router, private fb: UntypedFormBuilder,
         private filter: FilterUtils,  private masterService: MasterService) {
        if (this.route.getCurrentNavigation()?.extras?.state?.data != null) {
            this.data = this.route.getCurrentNavigation().extras.state.data;
            this.action = 'edit';
            this.submit = 'Modify';
            this.isUpdate = true;
            this.pincodeTable = this.data;
            this.breadScrums = [
                {
                    title: "Modify Pincode",
                    items: ["Home"],
                    active: "Modify Pincode",
                    generatecontrol: true,
                    toggle: this.data.isActive
                },
            ];
        } else {
            this.action = "Add";
            this.isUpdate = false;
            this.pincodeTable = new PincodeMaster({});
            this.breadScrums = [
                {
                    title: "Add Pincode",
                    items: ["Home"],
                    active: "Add Pincode",
                    generatecontrol: true,
                    toggle: false
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
            this.pincodeTable.category
        )
    }

    dataExist() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "pincode_detail",
            filter: {}
        };
        this.masterService.masterPost("generic/get", req).subscribe({
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
    onToggleChange(event: boolean) {
      // Handle the toggle change event in the parent component
      this.pincodeTableForm.controls['isActive'].setValue(event);
      // console.log("Toggle value :", event);
    }
    async getStateData() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "state_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise();
        const stateList = res.data.map(element => ({
            name: element.stateName,
            value: element._id
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

    async getCityList() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "city_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise();
        const cityList = res.data.map(element => ({
            name: element.cityName,
            value: element._id
        }));
        if (this.isUpdate) {
            const cityData = cityList.find((x) => x.name.toUpperCase() == this.data.city.toUpperCase());
            this.pincodeTableForm.controls.city.setValue(cityData);
        }
        this.filter.Filter(
            this.jsonControlArray,
            this.pincodeTableForm,
            cityList,
            this.cityList,
            this.cityStatus
        );
    }

    cancel() {
        this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
    }

    async save() {
        this.pincodeTableForm.controls["state"].setValue(this.pincodeTableForm.value.state.name);
        this.pincodeTableForm.controls["city"].setValue(this.pincodeTableForm.value.city.name);
        this.pincodeTableForm.controls["pincodeCategory"].setValue(this.pincodeTableForm.value.pincodeCategory);
        this.pincodeTableForm.controls["isActive"].setValue(this.pincodeTableForm.value.isActive === true ? true : false);
        this.pincodeTableForm.controls["serviceable"].setValue(this.pincodeTableForm.value.serviceable === true ? true : false);
        this.pincodeTableForm.removeControl("isUpdate");
        this.pincodeTableForm.removeControl("companyCode");

        if (this.isUpdate) {
            let id = this.pincodeTableForm.value._id;
            // Remove the "id" field from the form controls
            this.pincodeTableForm.removeControl("_id");
            let req = {
                companyCode: this.companyCode,
                collectionName: "pincode_detail",
                filter: {
                    _id: id,
                },
                update: this.pincodeTableForm.value
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
                this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
            }

        } else {
            this.pincodeTableForm.controls["_id"].setValue(this.pincodeTableForm.value.pincode);
            let req = {
                companyCode: this.companyCode,
                collectionName: "pincode_detail",
                data: this.pincodeTableForm.value
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
                this.route.navigateByUrl('/Masters/PinCodeMaster/PinCodeMasterList');
            }
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
