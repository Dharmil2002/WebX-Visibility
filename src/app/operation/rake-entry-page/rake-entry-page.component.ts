import { Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from "src/app/Masters/processUtility";
import { RakeEntryControl } from "src/assets/FormControls/rake-entry";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Router } from "@angular/router";
import { addRakeEntry, filterDocketDetail, genericGet, vendorDetailFromApi } from "./rate-utility";
import Swal from "sweetalert2";

@Component({
    selector: 'app-rake-entry-page',
    templateUrl: './rake-entry-page.component.html',
    providers: [FilterUtils],
})
export class RakeEntryPageComponent implements OnInit {
    jsonControlArray: any;
    rakeEntryFormControl: RakeEntryControl;
    rakeEntryTableForm: any;
    tableData: any = [];
    tableLoad = false;
    tableData1: any = [];
    type: any;
    show = false;
    apiShow = false;
    actionObject = {
        addRow: false,
        submit: false,
        search: true,
    };
    companyCode = parseInt(localStorage.getItem("companyCode"));
    fromCity: string; //it's used in getCity() for the binding a fromCity
    fromCityStatus: boolean; //it's used in getCity() for binding fromCity
    toCity: string; //it's used in getCity() for binding ToCity
    toCityStatus: boolean; //it's used in getCity() for binding ToCity
    via: string;
    viaStatus: boolean;
    destination: string;
    destinationStatus: boolean;
    vendor: string;
    vendorStatus: boolean;
    advancedLocation: string;
    advancedLocationStatus: boolean;
    balanceLocation: string;
    displayedColumns: any
    balanceLocationStatus: boolean;
    cnDetail: any[];
    breadScrums = [
        {
            title: "Rake Entry",
            items: ["Home"],
            active: "Rake Entry",
        },
    ];
    jobDetail: any;
    allCn: any[];

    ngOnInit(): void {
        this.initializeFormControl();
        this.bindDropDown();
        this.getCity();
        this.vendorDetail();
        this.getLocation();
        this.getDocketDetail()
    }

    constructor(
        private fb: UntypedFormBuilder,
        private Route: Router,
        private masterService: MasterService,
        private filter: FilterUtils) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data;
        }
        this.displayedColumns = {
            isSelect: {
                name: "#",
                key: "checkbox",
                style: "",
            },
            jobNo: {
                name: "Job No",
                key: "input",
                readonly: true,
                style: "",
            },
            jobDate: {
                name: "Job Date",
                key: "input",
                option: [],
                style: ""
            },
            noOfPkts: {
                name: "No Of Pkts",
                key: "input",
                Headerstyle: { 'min-width': '10px' },
            },
            weight: {
                name: "Weight",
                key: "input",
                style: "",
            },
            fromCity: {
                name: "From City",
                key: "input",
                style: "",
            },
            toCity: {
                name: "To City",
                key: "input",
                style: "",
            },
            billingParty: {
                name: "Billing Party",
                key: "input",
                style: "",
            }
        };

    }



    bindDropDown() {
        const jobPropertiesMapping = {
            transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
            billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
            vendorType: { variable: 'vendorType', status: 'vendorTypeStatus' },
            via: { variable: 'via', status: 'viaStatus' },
            vendorName: { variable: 'vendor', status: 'vendorStatus' },
            advancedLocation: { variable: 'advancedLocation', status: 'advancedLocationStatus' },
            balanceLocation: { variable: 'balanceLocation', status: 'balanceLocationStatus' },
            fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
            toCity: { variable: 'toCity', status: 'toCityStatus' },
            destination: { variable: 'destination', status: 'destinationStatus' },
        };
        processProperties.call(this, this.jsonControlArray, jobPropertiesMapping);
    }

    initializeFormControl() {
        // Create cityLocationFormControl instance to get form controls for different sections
        this.rakeEntryFormControl = new RakeEntryControl();
        // Get form controls for city Location Details section
        this.jsonControlArray = this.rakeEntryFormControl.getRakeEntryFormControls();
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.rakeEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
        this.show = false;
        this.rakeEntryTableForm.controls['documentType'].setValue('JOB');
        this.loadTempData([this.jobDetail], "job");
    }

    loadTempData(jobDetail, field) {
        this.tableData = [];

        const isStringField = typeof jobDetail === "string";
        const JobList = jobDetail.map(element => {
            return {
                srNo: true,
                [field + 'No']: isStringField ? "" : element?.[field + 'No'] || "",
                [field + 'Date']: isStringField ? "" : element?.[field + 'Date'] || "",
                noOfPkts: isStringField ? "" : element?.pkgs || 0,
                weight: isStringField ? "" : element?.weight || 0,
                fromCity: isStringField ? "" : element?.fromToCity.split("-")[0] || "",
                toCity: isStringField ? "" : element?.fromToCity.split("-")[1] || "",
                billingParty: isStringField ? "" : element?.billingParty || ""
            };
        });
        this.tableData = JobList;
    }


    display($event) {
        // Get the selected value (either 'CN' or 'JOB')
        const generateControl = typeof ($event) === "object" ? $event.eventArgs.value : $event;

        if (generateControl === 'CN') {
            // Define a mapping for changing keys in the displayedColumns object
            const keyMapping = {
                jobNo: "CNNo",
                jobDate: "CNDate"
                // ... define other mappings if needed
            };

            // Update displayedColumns using the key mapping
            this.displayedColumns = Object.keys(this.displayedColumns).reduce((acc, key) => {
                const newKey = keyMapping[key] || key;
                acc[newKey] = this.displayedColumns[key];

                // Update the name property for specific keys
                if (newKey === "CNNo") {
                    acc[newKey].name = "CNNo";
                }
                if (newKey === "CNDate") {
                    acc[newKey].name = "CNDate";
                }

                return acc;
            }, {});

            // Load CN data and set the show flag
            this.loadTempData(this.cnDetail, "CN");
            this.show = true;
        }

        if (generateControl === 'JOB') {
            // Define a mapping for changing keys back to original values
            const keyMapping = {
                CNNo: "jobNo",
                CNDate: "jobDate"
                // ... define other mappings if needed
            };

            // Update displayedColumns using the key mapping
            this.displayedColumns = Object.keys(this.displayedColumns).reduce((acc, key) => {
                const newKey = keyMapping[key] || key;
                acc[newKey] = this.displayedColumns[key];

                // Update the name property for specific keys
                if (newKey === "jobNo") {
                    acc[newKey].name = "Job No";
                }
                if (newKey === "jobDate") {
                    acc[newKey].name = "Job Date";
                }

                return acc;
            }, {});

            // Load JOB data and set the show flag
            this.loadTempData([this.jobDetail], "job");
            this.show = false;
        }
    }


    functionCallHandler($event) {
        let functionName = $event.functionName;     // name of the function , we have to call
        // function of this name may not exists, hence try..catch 
        try {
            this[functionName]($event);
        } catch (error) {
            // we have to handle , if function not exists.
            console.log("failed");
        }
    }

    async getCity() {
        try {
            const cityDetail = await getCity(this.companyCode, this.masterService);

            if (cityDetail) {
                this.filter.Filter(
                    this.jsonControlArray,
                    this.rakeEntryTableForm,
                    cityDetail,
                    this.fromCity,
                    this.fromCityStatus
                ); // Filter the docket control array based on fromCity details

                this.filter.Filter(
                    this.jsonControlArray,
                    this.rakeEntryTableForm,
                    cityDetail,
                    this.toCity,
                    this.toCityStatus
                );
                this.filter.Filter(
                    this.jsonControlArray,
                    this.rakeEntryTableForm,
                    cityDetail,
                    this.via,
                    this.viaStatus
                ); // Filter the docket control array based on toCity details
            }
        } catch (error) {
            console.error("Error getting city details:", error);
        }
    }

    async getDocketDetail() {
        try {
            const resDetail = await genericGet(this.masterService, "docket");
            const docketFilter = await filterDocketDetail(resDetail.filter((x) => x.orgLoc === localStorage.getItem("Branch")));
            this.allCn = await filterDocketDetail(resDetail);
            this.cnDetail = docketFilter
        } catch (error) {
            // Handle the error appropriately, e.g., logging or throwing it further.
            console.error("Error in getDocketDetail:", error);
            throw error;
        }
    }

    cancel() {
        this.goBack('Job')
    }

    goBack(tabIndex: string): void {
        this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
    }

    async vendorDetail() {
        const resDetail = await vendorDetailFromApi(this.masterService);
        const vendorData = resDetail.map((x) => { return { value: x.vendorCode, name: x.vendorName } });
        this.filter.Filter(
            this.jsonControlArray,
            this.rakeEntryTableForm,
            vendorData,
            this.vendor,
            this.vendorStatus
        );
    }
    async save() {
        // Create a new array without the 'srNo' property
        let modifiedTableData = this.tableData.map(({ srNo, ...rest }) => rest);
        // Assign the modified array back to 'this.tableData'
        this.tableData = modifiedTableData;
        const thisYear = new Date().getFullYear();
        const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
        const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
        const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
        const paddedNumber = dynamicNumber.toString().padStart(4, "0");
        let rake = `Rake/${dynamicValue}/${financialYear}/${paddedNumber}`;
        this.rakeEntryTableForm.controls['_id'].setValue(rake);
        this.rakeEntryTableForm.controls['rakeId'].setValue(rake);
        this.rakeEntryTableForm.controls['vendorName'].setValue(this.rakeEntryTableForm.controls['vendorName']?.value.name || "");
        this.rakeEntryTableForm.controls['fromCity'].setValue(this.rakeEntryTableForm.controls['fromCity']?.value.name || "");
        this.rakeEntryTableForm.controls['toCity'].setValue(this.rakeEntryTableForm.controls['toCity']?.value.name || "");
        this.rakeEntryTableForm.controls['destination'].setValue(this.rakeEntryTableForm.controls['destination']?.value.value);
        this.rakeEntryTableForm.controls['advancedLocation'].setValue(this.rakeEntryTableForm.controls['advancedLocation']?.value.value);
        this.rakeEntryTableForm.controls['balanceLocation'].setValue(this.rakeEntryTableForm.controls['balanceLocation']?.value.value);
        const viaCity = this.rakeEntryTableForm.controls['viaControlHandler'].value;
        const cityMap = viaCity ? viaCity.map((x) => x.name) : [];
        this.rakeEntryTableForm.controls['via'].setValue(cityMap);
        this.rakeEntryTableForm.removeControl('viaControlHandler');
        this.tableData = this.tableData.map(({ srNo, ...rest }) => rest);
        let docDetail = {
            containorDetail: this.tableData.filter((x) => x.isSelect === true),
        };
        let jobDetail = {
            ...this.rakeEntryTableForm.value,
            ...docDetail,
        };
        const res = await addRakeEntry(jobDetail, this.masterService)
        if (res) {
            Swal.fire({
                icon: "success",
                title: "Generated Successfully",
                text: "Rake No: " + rake,
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.goBack('Rake');
                }
            });
        }
    }

    async getLocation() {
        const location = await genericGet(this.masterService, "location_detail");
        const locList = location.map((x) => { return { name: x.locCode, value: x.locCode } });
        this.filter.Filter(
            this.jsonControlArray,
            this.rakeEntryTableForm,
            locList,
            this.advancedLocation,
            this.advancedLocationStatus
        );
        this.filter.Filter(
            this.jsonControlArray,
            this.rakeEntryTableForm,
            locList,
            this.balanceLocation,
            this.balanceLocationStatus
        );
        this.filter.Filter(
            this.jsonControlArray,
            this.rakeEntryTableForm,
            locList,
            this.destination,
            this.destinationStatus
        );
    }

    cityMapping() {
        if (this.rakeEntryTableForm.value.documentType !== "JOB") {
            const fromCityControl = this.rakeEntryTableForm.controls['fromCity'];
            const toCityControl = this.rakeEntryTableForm.controls['toCity'];
            if (fromCityControl.value && toCityControl.value) {
                const city = `${fromCityControl.value.value}-${toCityControl.value.value}`;
                this.cnDetail = this.allCn.filter(x => x.fromToCity === city);
                this.display('CN');
            }
            else{
                this.display('CN');
            }
        }
        else{
            this.display('JOB');
        }
    }
    
}