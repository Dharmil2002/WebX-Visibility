import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";
import { PincodeListControl } from "src/assets/FormControls/pincodeMaster";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';


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
    filteredCsv: any[];
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
    

    ngOnInit(): void {
        this.addAndEditPath = "/Masters/PinCodeMaster/AddPinCodeMaster";
        this.csvFileName = "Pincode Details" 
        this.getStateData();
        this.getCityList();
    }

    getStateData() {
        // this.http.get(this.stateURL).subscribe(res => {
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            this.stateRes = res;
            let tableArray = this.stateRes.stateList;
            let state = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.stateDesc,
                    value: element.stateId
                }
                state.push(dropdownList)
            });

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
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            this.city = res;
            let tableArray = this.city.cityList;
            let city = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.cityDesc,
                    value: element.cityId
                }
                city.push(dropdownList)
            });
            this.filter.Filter(
                this.jsonControlArray,
                this.pincodeTableForm,
                city,
                this.cityList,
                this.cityStatus
            );
        });
    }

    constructor(private fb: UntypedFormBuilder, private filter: FilterUtils, private masterService: MasterService) {
        this.intializeFormControl()
    }

    intializeFormControl() {
        //throw new Error("Method not implemented.");
        // Create PincodeFormControls instance to get form controls for different sections
        this.pincodeListFormControls = new PincodeListControl(this.pincodeTable);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pincodeListFormControls.getPincodeListFormControls();
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
            if (data.name === 'pincode') {
                // Set Pincode category-related variables
                this.pincatList = data.name;
                this.pincatStatus = data.additionalData.showNameAndValue;
            }
        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.pincodeTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    }

    functionCallHandler($event) {
        // console.log("fn handler called", $event);
        let field = $event.field;                   // the actual formControl instance
        let functionName = $event.functionName;     // name of the function , we have to call

        // we can add more arguments here, if needed. like as shown
        // $event['fieldName'] = field.name;

        // function of this name may not exists, hence try..catch 
        try {
            this[functionName]($event);
        } catch (error) {
            // we have to handle , if function not exists.
            console.log("failed");
        }
    }

    save() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "pincode"
        }
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                if (res) {
                    // Generate srno for each object in the array
                    const dataWithSrno = res.data.map((obj, index) => {
                        return {
                            ...obj,
                            srNo: index + 1
                        };
                    });
                    this.csv = dataWithSrno;
                    this.tableLoad = false;
                }
            }
        })
    }

}