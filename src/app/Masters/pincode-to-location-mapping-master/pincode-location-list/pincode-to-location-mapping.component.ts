import { Component, OnInit } from "@angular/core";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { forkJoin, map } from 'rxjs';
import { UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { PincodeLocationControl } from "src/assets/FormControls/pincodeLocationMapping";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";

@Component({
    selector: 'app-pincode-location-list',
    templateUrl: './pincode-to-location-mapping.component.html'
})

export class PincodeLocationMappingComponent implements OnInit {
    tableData: any = [];
    tableLoad = false;
    areaList: any;
    areaStatus: any;
    pincodeList: any;
    pincodeStatus: any;
    pinLocTableForm: any;
    jsonControlArray: any;
    pinLocListFormControls: any;
    isUpdate: boolean;
    data: [] | any;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));

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
    pincodeDataList: any;

    constructor(public ObjSnackBarUtility: SnackBarUtilityService, private filter: FilterUtils, private route: Router,
        private masterService: MasterService, private fb: UntypedFormBuilder) {
        this.loadTempData('');
    }

    ngOnInit(): void {
        this.intializeFormControl();
        this.getData();
    }

    intializeFormControl() {
        // Create PincodeFormControls instance to get form controls for different sections
        this.pinLocListFormControls = new PincodeLocationControl(this.isUpdate);
        // Get form controls for Cluster Details section
        this.jsonControlArray = this.pinLocListFormControls.getPinLocFormControls();

        this.jsonControlArray.forEach(data => {
            switch (data.name) {
                case 'area':
                    // Set State-related variables
                    this.areaList = data.name;
                    this.areaStatus = data.additionalData.showNameAndValue;
                    break;
                case 'pincode':
                    // Set Pincode category-related variables
                    this.pincodeList = data.name;
                    this.pincodeStatus = data.additionalData.showNameAndValue;
                    break;
                default:
                    break;
            }
        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.pinLocTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
            functions: {
                'onOptionSelect': "getAreaData" // Function to be called on change event
            }
        },
        city: {
            name: "Area",
            key: "inputString",
            readonly: false,
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
            city: ""
        };
        this.tableData.splice(0, 0, AddObj);
    }

    getData() {
        const mappingReq = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "pincodeLocation_details"
        };
        const locationReq = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "location_detail"
        };
        const pincodeReq = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "pincode_detail"
        };
        // Use forkJoin to make parallel requests and get all data at once
        forkJoin([
            this.masterService.masterPost('common/getall', mappingReq),
            this.masterService.masterPost('common/getall', locationReq),
            this.masterService.masterPost('common/getall', pincodeReq),
        ]).pipe(
            map(([mappingRes, locationRes, pincodeRes]) => {
                // Combine all the data into a single object
                return {
                    mappingData: mappingRes?.data,
                    locationData: locationRes?.data,
                    pincodeData: pincodeRes?.data,
                };
            })
        ).subscribe((mergedData) => {
            this.data = mergedData.mappingData.filter(item => item.location == this.pinLocTableForm.value.area.name);
            const transformedData = this.transformArrayProperties(this.data);
            this.loadTempData(transformedData);

            const locationList = mergedData.locationData;
            const locations = this.filterData(locationList, 'locName', 'locCode');
            this.filter.Filter(
                this.jsonControlArray,
                this.pinLocTableForm,
                locations,
                this.areaList,
                this.areaStatus
            );

            this.pincodeDataList = mergedData.pincodeData;
            let pincode = this.pincodeDataList
                .filter(element => element.pincode != null && element.pincode !== '')
                .map((element: any) => ({
                    name: parseInt(element.pincode),
                    value: parseInt(element.pincode)
                }));
            this.displayedColumns1.pincode.option = pincode;
            this.filter.Filter(
                this.jsonControlArray,
                this.pinLocTableForm,
                pincode,
                this.pincodeList,
                this.pincodeStatus
            );
            this.tableLoad = true;
        });
    }

    getAreaData($event) {
        var selectedPincode = $event.row.pincode;
        const mappedData = this.pincodeDataList.map((item: any) => ({
            area: item.area,
            pincode: item.pincode
        }));
        // Find the index of the item with the selected pincode in the tableData array
        const indexToUpdate = this.tableData.findIndex((item) => item.pincode == selectedPincode);

        if (indexToUpdate !== -1) {
            // Find matching areas based on the selected pincode
            const matchingAreas = mappedData.filter((item) => item.pincode == selectedPincode);
            // Extract only the "area" property from each object in the array
            const areas = matchingAreas.map((item) => item.area);
            // Update the "area" property of the specific index in the tableData array
            this.tableData[indexToUpdate].city = areas;

            this.tableLoad = true;
        }
    }

    transformArrayProperties(data) {
        const transformedData = [];
        if (data[0] && data[0].pincodeList && data[0].city) {
            const len = Math.max(
                data[0].pincodeList.length,
                data[0].city.length
            );
            for (let i = 0; i < len; i++) {
                transformedData.push({
                    pincode: data[0].pincodeList[i],
                    city: data[0].city[i],
                });
            }
        }
        return transformedData;
    }

    filterData(data, nameKey, valueKey) {
        return data
            .filter(element => element[nameKey] != null && element[nameKey] !== '')
            .map(element => ({
                name: String(element[nameKey]),
                value: String(element[valueKey])
            }));
    }

    mapData(data, property1, property2) {
        return data.map((item: any) => ({
            [property1]: item[property1],
            [property2]: item[property2]?.name || item[property2]
        }));
    }


    saveData() {
        const pincodeSet = new Set();
        let hasDuplicate = false; // Flag to track duplicates

        for (const item of this.tableData) {
            const parsedPincode = parseInt(item.pincode);
            if (pincodeSet.has(parsedPincode)) {
                this.SwalMessage('Duplicate entry found');
                hasDuplicate = true;
                break; // Exit the loop as we found a duplicate
            }
            pincodeSet.add(parsedPincode);
        }

        if (!hasDuplicate) {
            const areaName = this.pinLocTableForm.value.area?.name || '';
            if (!areaName) {
                this.SwalMessage('Select location'); // Display Swal message for empty location
            } else {
                const transformedData = {
                    location: areaName,
                    id: areaName,
                    pincode: this.pinLocTableForm.value.pincode?.value || '',
                    pincodeList: Array.from(pincodeSet),
                    city: this.tableData.flatMap((item) => item.city), // Use flatMap to flatten the nested arrays           
                    entryBy: localStorage.getItem('Username'),
                    entryDate: new Date().toISOString()
                };

                let req = {
                    companyCode: parseInt(localStorage.getItem("companyCode")),
                    type: "masters",
                    collection: "pincodeLocation_details",
                    data: transformedData
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
                            window.location.reload();
                        }
                    }
                });
            }
        }
    }

    SwalMessage(message) {
        Swal.fire({
            title: message,
            toast: true,
            icon: "error",
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonText: "Yes"
        });
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
}