import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";
import { PincodeListControl } from "src/assets/FormControls/pincodeMaster";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-pincode-master-list',
    templateUrl: './pincode-master-list.component.html'
})

export class PincodeMasterListComponent implements OnInit {
    tableLoad = true;
    IsUpdate = false;
    pincodeTableForm: UntypedFormGroup;
    addAndEditPath: string;
    jsonControlArray: any;
    pincodeListFormControls: PincodeListControl;
    pincodeTable: PincodeMaster;
    stateStatus: any;
    stateList: any;
    cityStatus: boolean;
    pincatList: string;
    data: [] | any;
    pincatStatus: boolean;
    csvFileName: string;
    stateRes: any;
    csv: any[];
    toggleArray = ["isActive", "serviceable"]
    linkArray = []
    cityList: string;
    city: any;
    pincodeList: any[] = [];

    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    columnHeader =
        {
            "srNo": "Sr No",
            "state": "State",
            "city": "City",
            "pincode": "Pincode",
            "pincodeCategory": "Pincode Category",
            "area": "Area",
            "isActive": "Active",
            "serviceable": "Serviceable/Non-ODA",
            "actions": "Actions"
        }

    headerForCsv = {
        "srNo": "SrNo",
        "state": "State Name",
        "city": "City",
        "area": "Area",
        "pincode": "Pincode",
        "pincodeCategory": "Category",
    }
    //#endregion
    dynamicControls = {
        add: true,
        edit: true,
        csv: true
    }
    breadScrums = [
        {
            title: "Pincode Master",
            items: ["Home"],
            active: "Pincode Master",
        },
    ];
    pincode: any;
    cityRes: any;
    pincodeRes: any;
    isUpdate: any;
    stateData: any;
    cityData: any;


    ngOnInit(): void {
        this.addAndEditPath = "/Masters/PinCodeMaster/AddPinCodeMaster";
        this.csvFileName = "Pincode Details"
        this.getStateData();
        this.getCityList();
        this.getPinocdeList();
    }

    constructor(private operationService: OperationService, public ObjSnackBarUtility: SnackBarUtilityService, private fb: UntypedFormBuilder, private filter: FilterUtils, private masterService: MasterService) {
        this.intializeFormControl()
    }

    intializeFormControl() {
        // Create PincodeFormControls instance to get form controls for different sections
        this.pincodeListFormControls = new PincodeListControl(this.pincodeTable);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pincodeListFormControls.getPincodeListFormControls();
        // Initialize variables
        let stateData, cityData, pincodeData;
        this.jsonControlArray.forEach(data => {
            switch (data.name) {
                case 'state':
                    // Set State-related variables
                    this.stateList = data.name;
                    this.stateStatus = data.additionalData.showNameAndValue;
                    stateData = data;
                    break;
                case 'city':
                    // Set City-related variables
                    this.cityList = data.name;
                    this.cityStatus = data.additionalData.showNameAndValue;
                    cityData = data;
                    break;
                case 'pincode':
                    // Set Pincode category-related variables
                    this.pincatList = data.name;
                    this.pincatStatus = data.additionalData.showNameAndValue;
                    pincodeData = data;
                    break;
                default:
                    break;
            }
        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.pincodeTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
            this.stateData = stateList.find((x) => x.name == this.data.stateName);
            this.pincodeTableForm.controls.stateName.setValue(this.stateData);
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
            this.cityData = cityList.find((x) => x.name == this.data.cityName);
            this.pincodeTableForm.controls.cityName.setValue(this.cityData);
        }
        this.filter.Filter(
            this.jsonControlArray,
            this.pincodeTableForm,
            cityList,
            this.cityList,
            this.cityStatus
        );
    }

    async getPinocdeList() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "pincode_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
        // Assuming the API response contains an array named 'pincodeList'
        const pincode = res.data.map(element => ({
            name: element.pincode,
            value: element._id
        }));
        this.filter.Filter(
            this.jsonControlArray,
            this.pincodeTableForm,
            pincode,
            this.pincatList,
            this.pincatStatus
        );
    }

    functionCallHandler($event) {
        // console.log("fn handler called", $event);
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

    async save() {
        this.stateRes = this.pincodeTableForm.value.state.name; //the name property holds the state name
        this.cityRes = this.pincodeTableForm.value.city.name; //the name property holds the city name
        this.pincodeRes = this.pincodeTableForm.value.pincode.value;

        let req = {
            companyCode: this.companyCode,
            collectionName: "pincode_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
        if (res && res.data && res.data.length > 0 &&
            res.data[0].hasOwnProperty('state') &&
            res.data[0].hasOwnProperty('city')
            || res.data[0].hasOwnProperty('pincode')) {
            // Filter out objects with the specific state and city
            const dataWithSpecificStateAndCity = res.data.filter(obj => obj.state === this.stateRes && obj.city === this.cityRes || obj.pincode === this.pincodeRes);

            if (dataWithSpecificStateAndCity.length > 0) {
                // Generate srno for each object in the filtered array
                const dataWithSrno = dataWithSpecificStateAndCity.map((obj, index) => {
                    return {
                        ...obj,
                        srNo: index + 1
                    };
                });

                this.csv = dataWithSrno;
                this.tableLoad = false;
            } else {
                this.ObjSnackBarUtility.showNotification(
                    'snackbar-danger',
                    'No Data Found...!!!',
                    'bottom',
                    'center'
                );
                // No data found for the selected state and city
                this.csv = []; // Empty the csv array to clear any previous data
                this.tableLoad = false;
            }
        }

    }

    IsActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.srNo;
        let req = {
            companyCode: this.companyCode,
            collectionName: "pincode_detail",
            filter: {
                _id: id,
            },
            update: det
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
                }
            }
        });
    }

}