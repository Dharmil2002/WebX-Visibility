import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { CityLocationMappingControl } from "src/assets/FormControls/city-location-master";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from "sweetalert2";

@Component({
    selector: 'app-city-location-master',
    templateUrl: './city-to-location-mapping.component.html'
})

export class CityLocationMappingMaster implements OnInit {
    tableData: any = [];
    tableLoad = false;
    tableData1: any = [];
    data: [] | any;
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    cityLocationTableForm: any;
    isUpdate: any;
    cityLocationFormControl: CityLocationMappingControl;
    jsonControlArray: any;
    show = false;
    apiShow = false;
    generateControl: any;
    cityList: any;
    cityStatus: any;
    locationList: any;
    locationStatus: any;
    CityLocationArray: any;
    filteredData: any;
    type: any;

    // Breadcrumbs
    breadScrums = [
        {
            title: "City to Location Mapping",
            items: ["Masters"],
            active: "City to Location Mapping",
        },
    ];

    actionObject = {
        addRow: true,
        submit: true,
        search: true
    };

    constructor(private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) {
    }

    // Displayed columns location City configuration
    locationCityDisplayedColumns = {
        srNo: {
            name: "Sr No",
            key: "index",
            style: "",
        },
        location: {
            name: "Location",
            key: "inputString",
            readonly: true,
            style: "",
        },
        city: {
            name: "City",
            key: "multipleDropdown",
            option: [],
            style: ""
        },
        isActive: {
            name: "Active",
            key: "toggle",
            style: "min-width:100px;",
            Headerstyle: { 'min-width': '10px' },
        },
        action: {
            name: "Action",
            key: "Action",
            style: "",
        }
    };

    //Displayed columns City location configuration
    cityLocationDisplayedColumns = {
        srNo: {
            name: "Sr No",
            key: "index",
            style: "",
        },
        city: {
            name: "City",
            key: "inputString",
            readonly: true,
            style: "",
        },
        location: {
            name: "Location",
            key: "multipleDropdown",
            option: [],
            style: "",
        },
        isActive: {
            name: "Active",
            key: "toggle",
            style: "min-width:100px;",
            Headerstyle: { 'min-width': '10px' }
        },
        action: {
            name: "Action",
            key: "Action",
            style: "",
        }
    };

    intializeFormControl() {
        // Create cityLocationFormControl instance to get form controls for different sections
        this.cityLocationFormControl = new CityLocationMappingControl(this.isUpdate);
        // Get form controls for city Location Details section
        this.jsonControlArray = this.cityLocationFormControl.getCityLocationFormControls();
        const propertyMap = {
            'city': { list: 'cityList', status: 'cityStatus' },
            'location': { list: 'locationList', status: 'locationStatus' },
        };
        this.jsonControlArray.forEach(data => {
            const property = propertyMap[data.name];
            if (property) {
                this[property.list] = data.name;
                this[property.status] = data.additionalData.showNameAndValue;
            }
        });
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.cityLocationTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
        this.cityLocationTableForm.controls["mappingMode"].setValue('L');
        this.show = false;
        this.loadTempData('');
    }

    ngOnInit(): void {
        this.intializeFormControl();
        this.locationCityDropdownData();
    }

    // Load temporary data
    loadTempData(det) {
        this.type = this.cityLocationTableForm.value.mappingMode;
        if (this.type == "C") {
            this.tableData = det || [];
            if (this.tableData.length === 0) {
                this.addCity();
            }
        }
        else {
            this.tableData1 = det || [];
            if (this.tableData1.length === 0) {
                this.addLocation();
            }
        }
    }

    // Add a new item to the table
    addCity() {
        const city = this.cityLocationTableForm.value?.city.name || ""
        const addObj = {
            srNo: 0,
            city: city,
            location: [],
            active: "",
            action: ""
        };
        this.tableData.splice(0, 0, addObj);
    }

    // Add a new item to the table
    addLocation() {
        const location = this.cityLocationTableForm.value?.location.name || ""
        const addObj = {
            srNo: 0,
            location: location,
            city: [],
            active: "",
            action: ""
        };
        this.tableData1.splice(0, 0, addObj);
    }

    //DropDown of Form Control 
    async locationCityDropdownData() {
        const locationReq = {
            companyCode: this.companyCode,
            collectionName: "location_detail",
            filter: {}
        };
        const cityReq = {
            companyCode: this.companyCode,
            collectionName: "city_detail",
            filter: {}
        };
        try {
            const [locationRes, cityRes] = await Promise.all([
                this.masterService.masterPost("generic/get", locationReq).toPromise(),
                this.masterService.masterPost("generic/get", cityReq).toPromise()
            ]);

            const locationList = locationRes.data;
            const cityList = cityRes.data;

            const locations = locationList
                .filter(element => element.locName != null && element.locName !== '')
                .map(element => ({
                    name: String(element.locName),
                    value: String(element.locCode)
                }));

            const cities = cityList
                .filter(element => element.cityName != null && element.cityName !== '')
                .map(element => ({
                    name: String(element.cityName),
                    value: String(element.cityName)
                }));

            this.filter.Filter(this.jsonControlArray, this.cityLocationTableForm, locations, this.locationList, this.locationStatus);
            this.filter.Filter(this.jsonControlArray, this.cityLocationTableForm, cities, this.cityList, this.cityStatus);

            this.cityLocationDisplayedColumns.location.option = locations;
            this.locationCityDisplayedColumns.city.option = cities;
            this.apiShow = true;
        } catch (error) {
            this.SwalMessage(error + 'Incorrect API');
        }
    }


    //get City and Location data City Wise From Dropdown
    async getCityAndLocationDetails() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "city_location_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise();
        if (res && res.data) {
            this.data = res.data;
            const cityFilterData = this.cityLocationTableForm.value.city.name;
            // Filter the data based on the Location value
            const filteredData = this.data.filter(item => item._id === cityFilterData);
            if (filteredData.length > 0) {
                const items = filteredData[0].items; // Assuming there's only one item with the matching ID
                // Map the items to location and city
                const updatedItems = items.map(item => {
                    return {
                        city: item.city,
                        location: item.location,
                        isActive: item.active
                    };
                });
                this.tableLoad = true;
                // Load the updated data using the loadTempData function
                this.loadTempData(updatedItems);
            }
            else {
                const city = this.cityLocationTableForm.value.city.name;
                this.tableLoad = true;
                this.loadTempData([{ city, location: 'Your Location' }]);
            }
        }

    }

    //get Location and City on Location Wise Form Dropdown
    async getLocationAndCityDetails() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "location_city_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
        if (res && res.data) {
            this.data = res.data;
            const locationFilterData = this.cityLocationTableForm.value.location.name;
            // Filter the data based on the Location value
            const filteredData = this.data.filter(item => item._id === locationFilterData);
            if (filteredData.length > 0) {
                const items = filteredData[0].items; // Assuming there's only one item with the matching ID
                // Map the items to city and location
                const mappedLocations = items.map(item => {
                    return {
                        city: item.city,
                        location: item.location,
                        isActive: item.active
                    };
                });
                this.tableLoad = true;
                // Load the mapped data using the loadTempData function
                this.loadTempData(mappedLocations);
            } else {
                // If no match is found, still store your location
                const location = this.cityLocationTableForm.value.location.name;
                this.tableLoad = true;
                this.loadTempData([{ city: 'Your City', location }]);
            }
        }
    }

    saveData() {
        this.type = this.cityLocationTableForm.value.mappingMode;
        if (this.type == "C") {
            this.saveCityLocationData();
        }
        else {
            this.saveLocationCityData();
        }
    }

    async saveCityLocationData() {
        let hasDuplicate = false; // Flag to track duplicates
        let locations = new Set();
        this.tableData.forEach(element => {
            const locationArray = element?.location || [];
            if (locationArray.length === 0) {
                this.SwalMessage('Location not found');
                hasDuplicate = true;
            } else {
                locationArray.forEach(location => {
                    if (location !== null && location !== '') {
                        if (!locations.has(location)) {
                            locations.add(location);
                        } else {
                            this.SwalMessage('Duplicate entry found');
                            hasDuplicate = true;
                        }
                    } else {
                        this.SwalMessage('Enter location');
                        hasDuplicate = true;
                    }
                });
            }
        });
        if (!hasDuplicate) {
            let transformedDataArray = [];  // Creating an array to store the transformed data objects
            this.tableData.forEach((element) => {
                let transformedData = {
                    city: this.cityLocationTableForm.value.city.name,
                    location: element?.location,
                    active: element.isActive,
                    entryBy: this.cityLocationTableForm.value.entryBy,
                    entryDate: this.cityLocationTableForm.value.entryDate
                };
                transformedDataArray.push(transformedData);  // Push the transformed data object to the array
            });
            let req = {
                companyCode: this.companyCode,
                collectionName: "city_location_detail",
                data: {
                    _id: this.tableData[0]?.city, // Assuming all elements have the same location
                    items: transformedDataArray,
                }
            };
            const res = await this.masterService.masterPost("generic/create", req).toPromise();
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
        } else {
           // this.SwalMessage('Enter city');
            hasDuplicate = true;
        }

    }

    async saveLocationCityData() {
        let hasDuplicate = false; // Flag to track duplicates
        let cities = new Set();

        this.tableData1.forEach(element => {
            const cityArray = element?.city || []; // Get the city array from the element
            if (cityArray.length === 0) {
                this.SwalMessage('City not found');
                hasDuplicate = true;
            } else {
                cityArray.forEach(city => {
                    if (city !== null && city !== '') {
                        if (!cities.has(city)) {
                            cities.add(city);
                        } else {
                            this.SwalMessage('Duplicate entry found');
                            hasDuplicate = true;
                        }
                    } else {
                        this.SwalMessage('Enter city');
                        hasDuplicate = true;
                    }
                });
            }
        });
        if (!hasDuplicate) {
            let transformedDataArray = [];  // Creating an array to store the transformed data objects
            this.tableData1.forEach((element) => {
                let transformedData = {
                    city: element?.city,
                    location: element?.location,
                    active: element.isActive,
                    entryBy: this.cityLocationTableForm.value.entryBy,
                    entryDate: this.cityLocationTableForm.value.entryDate
                };
                transformedDataArray.push(transformedData);  // Push the transformed data object to the array
            });
            let req = {
                companyCode: this.companyCode,
                collectionName: "location_city_detail",
                data: {
                    _id: this.tableData1[0]?.location, // Assuming all elements have the same location
                    items: transformedDataArray,
                }
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
                window.location.reload();
            }

        } else {
           // this.SwalMessage('Enter Location');
            hasDuplicate = true;
        }
    }

    async delete(event, tableData) {
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
                            message: "Data has been deleted !",
                        };
                    } else {
                        console.log("Request", request);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this[tableData].splice(index, 1);
                    swalWithBootstrapButtons.fire("Deleted!", "Your data has been deleted successfully", "success");
                    event.callback(true);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire("Cancelled", "Your item is safe :)", "error");
                    event.callback(false);
                } else {
                    swalWithBootstrapButtons.fire("Not Deleted!", "Your data remains safe", "info");
                    event.callback(false);
                }
            });

        return true;
    }

    //Checked Radio Button - CityLocation / LocationCity
    display($event) {
        const generateControl = $event?.eventArgs.value || $event;
        if (generateControl === 'C') {
            this.jsonControlArray.forEach(data => {
                if (data.name == 'city' || data.name == 'location') {
                    data.generatecontrol = !data.generatecontrol;
                }
                this.show = true;
            });
        }
        if (generateControl === 'L') {
            this.jsonControlArray.forEach(data => {
                if (data.name == 'city' || data.name == 'location') {
                    data.generatecontrol = !data.generatecontrol;
                }
                this.show = false;
            });
        }
        this.loadTempData('');
    }

    SwalMessage(message) {
        Swal.fire({
            title: message,//'Incorrect API',
            toast: true,
            icon: "error",
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonText: "Yes"
        });
    }

    // Handle function calls
    functionCallHandler($event) {
        let functionName = $event.functionName;     // name of the function , we have to call
        try {
            this[functionName]($event);
        } catch (error) {
            console.log("failed");
        }
    }
}
