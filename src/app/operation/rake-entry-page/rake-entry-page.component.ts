import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from "src/app/Masters/processUtility";
import { RakeEntryControl } from "src/assets/FormControls/rake-entry";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { addRakeEntry, genericGet, vendorDetailFromApi } from "./rate-utility";
import { debug } from "console";

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
    advancedLocationStatus:boolean;
    balanceLocation:string;
    displayedColumns:any
    balanceLocationStatus:boolean;
    breadScrums = [
        {
            title: "Rake Entry",
            items: ["Home"],
            active: "Rake Entry",
        },
    ];
    jobDetail: any;

    ngOnInit(): void {
        this.initializeFormControl();
        this.bindDropDown();
        this.getCity();
        this.vendorDetail();
        this.getLocation();
    }

    constructor(private fb: UntypedFormBuilder, private Route: Router, private routeActive: ActivatedRoute, private masterService: MasterService,
        private filter: FilterUtils) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data;
        }
        this.displayedColumns = {
            srNo: {
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
        this.loadTempData(this.jobDetail,"job");
    }

    loadTempData(jobDetail,field) {
        this.tableData = [
            {
                srNo: true, // Serial number
                [field+'No']:typeof(jobDetail)==="string"?"": jobDetail?.jobNo || "",
                [field+'Date']:typeof(jobDetail)==="string"?"": jobDetail?.jobDate || "",
                noOfPkts:typeof(jobDetail)==="string"?"": jobDetail?.pkgs || 0,
                weight: typeof(jobDetail)==="string"?"":jobDetail?.weight || 0,
                fromCity: typeof(jobDetail)==="string"?"":jobDetail?.fromToCity.split("-")[0] || "",
                toCity: typeof(jobDetail)==="string"?"":jobDetail?.fromToCity.split("-")[1] || "",
                billingParty:typeof(jobDetail)==="string"?"": jobDetail?.billingParty||""
            }
        ]
    }

    //Checked Dropdown Option - Cn Wise / Job Wise
    display($event) {

        const generateControl = $event?.eventArgs.value || $event;
        if (generateControl === 'CN') {
            // this.displayedColumns.CNNO =  this.displayedColumns.jobNo;  // Creating a new property
            // delete  this.displayedColumns.jobNo;  // Deleting the old property
            // displayedColumns.CNNO.name = "CNNO";  // Changing the name property
            const keyMapping = {
                jobNo: "CNNO",
                jobDate:"CNDate"
                // ... define other mappings
            };
            Object.keys(this.displayedColumns).reduce((acc, key) => {
                const newKey = keyMapping[key] || key;
                acc[newKey] = this.displayedColumns[key];
                if (newKey === "CNNO") {
                    acc[newKey].name = "CN No";
                  
                }
                if (newKey ==="CNDate") {
                    acc[newKey].name = "CN Date";
                   this.loadTempData("","CN") // Update the name property
                }
                
                return acc;
            }, {});
           // this.loadTempData("");
            this.show = true;
        }
        if (generateControl === 'JOB') {
            const keyMapping = {
                CNNO: "jobNo",
                CNDate:"jobDate"
                // ... define other mappings
            };
            Object.keys(this.displayedColumns).reduce((acc, key) => {
                const newKey = keyMapping[key] || key;
                acc[newKey] = this.displayedColumns[key];
                if (newKey === "jobNo") {
                    acc[newKey].name = "Job No"; // Update the name property
                }
                if (newKey ==="jobDate") {
                    acc[newKey].name = "Job Date"; // Update the name property
                    this.loadTempData(this.jobDetail,"job")
                }
                return acc;
            }, {});
            this.show = false;
        }
        console.log(this.displayedColumns);
         
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
    cancel() {
        this.goBack(8)
    }
    goBack(tabIndex: number): void {
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
        let data=this.rakeEntryTableForm.controls['viaControlHandler'].value.map((x)=>x.name);
        this.rakeEntryTableForm.controls['via'].setValue(data);
        this.rakeEntryTableForm.removeControl('viaControlHandler');
        this.tableData = this.tableData.map(({ srNo, ...rest }) => rest);
        let docDetail = {
            containorDetail: this.tableData,
          };
          let jobDetail = {
            ...this.rakeEntryTableForm.value,
            ...docDetail,
          };
        const res= await addRakeEntry(jobDetail,this.masterService)
      if(res){
        Swal.fire({
            icon: "success",
            title: "Generated Successfully",
            text: "Rake No: " + rake,
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.goBack(8);
            }
        });
    }
    }
    async getLocation(){
        const location = await genericGet(this.masterService,"location_detail");
        const locList=location.map((x)=>{return{name:x.locCode,value:x.locCode}});
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
}