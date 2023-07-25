import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import Swal from 'sweetalert2';
import { utilityService } from 'src/app/Utility/utility.service';
import { UntypedFormBuilder, Validators, FormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { PincodeLocationControl } from "src/assets/FormControls/pincodeLocationMapping";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';

@Component({
    selector: 'app-pincode-location-list',
    templateUrl: './pincode-to-location-mapping.component.html'
})

export class PincodeLocationMappingComponent implements OnInit {
    tableData: any = [];
    tableLoad = true;
    stateList: any;
    stateStatus: any;
    pincodeList: any;
    pincodeStatus: any;
    pinLocTableForm: any;
    jsonControlArray: any;
    myForm: FormGroup;
    pinLocListFormControls: any;
    isUpdate: boolean;
    updateState: any;
    stateData: any;
    stateId: any;
    pincodeRes: any;
    data: [] | any;
    csv: any[];
    // Action buttons configuration
    actionObject = {
        addRow: true,
        submit: true,
        search: true
    };
    // Breadcrumbs
    breadScrums = [
        {
            title: "Pinocode to Location Mapping",
            items: ["Masters"],
            active: "Pinocode to Location Mapping",
        },
    ];
    tableDet: boolean;
    filteredData: any;

    constructor(private filter: FilterUtils,
        private masterService: MasterService, private fb: UntypedFormBuilder, private service: utilityService) {
        this.loadTempData('');
    }
    // Displayed columns configuration
    displayedColumns1 = {
        srNo: {
            name: "Sr No",
            key: "index",
            style: "",
        },
        pincode: {
            name: "Pincode",
            key: "Dropdown",
            option: [],
            style: "",
        },
        area: {
            name: "Area",
            key: "Dropdown",
            option: [],
            style: "",
        },
        action: {
            name: "Action",
            key: "Action",
            style: "",
        },
    };

    //Load temporary data
    loadTempData(det) {
        this.tableData = det ? det : [];
        if (this.tableData.length === 0) {
            this.addItem();
        }
    }

    // Add a new item to the table
    addItem() {
        const AddObj = {
            srNo: 0,
            pincode: [],
            area: []
        };
        this.tableData.splice(0, 0, AddObj);
    }

    // Get all dropdown data
    getAllMastersData() {
        // Options for documentType dropdown
        this.displayedColumns1.pincode.option = [
            {
                "name": "395001",
                "value": "395001"
            },
            {
                "name": "121344",
                "value": "121344"
            },
            {
                "name": "226001",
                "value": "3"
            },
            {
                "name": "110033",
                "value": "4"
            },
            {
                "name": "394110",
                "value": "5"
            }
        ];
        // Options for area dropdown
        this.displayedColumns1.area.option = [
            {
                "name": "Mumbai",
                "value": "Mumbai"
            },
            {
                "name": "Dadar",
                "value": 2
            },
            {
                "name": "Lucknow",
                "value": 3
            },
            {
                "name": "Delhi",
                "value": 4
            },
            {
                "name": "MANGROL",
                "value": 5
            }
        ];
    }

    // Delete a row from the table
    async delete(event) {
        const index = event.index;
        const row = event.element;

        const swalWithBootstrapButtons = await Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success msr-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
                showLoaderOnConfirm: true,
                preConfirm: (Remarks) => {
                    var request = {
                        companyCode: localStorage.getItem("CompanyCode"),
                        id: row.id,
                    };
                    if (row.id == 0) {
                        return {
                            isSuccess: true,
                            message: "City has been deleted !",
                        };
                    } else {
                        console.log("Request", request);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {

                if (result.isConfirmed) {
                    this.tableData.splice(index, 1);
                    this.tableData = this.tableData;
                    swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
                    event.callback(true);
                } else if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
                    event.callback(false);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Your item is safe :)",
                        "error"
                    );
                    event.callback(false);
                }
            });

        return true;
    }
    ngOnInit(): void {
        this.intializeFormControl()
        this.getAllMastersData();
        this.getStateData();
        this.getPincodeData();
    }

    intializeFormControl() {
        // Create PincodeFormControls instance to get form controls for different sections
        this.pinLocListFormControls = new PincodeLocationControl(this.isUpdate);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pinLocListFormControls.getPinLocFormControls();
        this.jsonControlArray.forEach(data => {
            if (data.name === 'state') {
                // Set State-related variables
                this.stateList = data.name;
                this.stateStatus = data.additionalData.showNameAndValue;
            }
            if (data.name === 'pincode') {
                // Set Pincode category-related variables
                this.pincodeList = data.name;
                this.pincodeStatus = data.additionalData.showNameAndValue;
            }
        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.pinLocTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    }
    getStateData() {
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
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
            this.filter.Filter(
                this.jsonControlArray,
                this.pinLocTableForm,
                state,
                this.stateList,
                this.stateStatus
            );
        });
    }
    getPincodeData() {
        this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
            this.pincodeRes = res;
            let tableArray = this.pincodeRes.pincodeList;
            let pincode = [];
            tableArray.forEach(element => {
                let dropdownList = {
                    name: element.pincodeDesc,
                    value: element.pincodeId
                }
                pincode.push(dropdownList)
            });
            this.filter.Filter(
                this.jsonControlArray,
                this.pinLocTableForm,
                pincode,
                this.pincodeList,
                this.pincodeStatus
            );
        });
    }

    getList() {
        const formValue = this.pinLocTableForm.value;
        // Fetch data for Pincode
        this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
            this.data = res;
            const areaFilter = this.pinLocTableForm.value.state.name;
            const pincodeFilter = this.pinLocTableForm.value.pincode.name;
            this.filteredData = this.data['pincodeToLoc'].filter((item: any) => {
                const areaMatch = item['area'] === areaFilter;
                const pincodeMatch = item['pincode'] === pincodeFilter;
                //the filtered data includes the items matching both area and pincode when they are both selected
                if (areaFilter && pincodeFilter) {
                    return areaMatch && pincodeMatch;
                   // but also includes the items matching only area or only pincode when only one of them is selected
                } else if (areaFilter) {
                    return areaMatch;
                } else if (pincodeFilter) {
                    return pincodeMatch;
                }
                return false;
            });
            this.tableDet = true;
            this.loadTempData(this.filteredData)
        }
        );
    }

    // Handle function calls
    functionCallHandler($event) {
        let field = $event.field;                   // the actual formControl instance
        let functionName = $event.functionName;     // name of the function , we have to call

        try {
            this[functionName]($event);
        } catch (error) {
            console.log("failed");
        }
    }

    saveData() {
        const pincodeData = this.tableData[0].pincode;
        const areaData = this.tableData[0].area;
        if (pincodeData.length === 0 || areaData.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Data",
                text: "Please fill in all the required fields.",
                showConfirmButton: true,
            });
        } else {
            this.service.exportData(this.tableData);
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Data Downloaded successfully!",
                showConfirmButton: true,
            });
            if (this.addItem) {
                window.location.reload();
            }
        }
    }
}