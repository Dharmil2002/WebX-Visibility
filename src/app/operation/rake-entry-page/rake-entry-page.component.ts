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
import { addRakeEntry, vendorDetailFromApi } from "./rate-utility";

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
        this.destionationDropDown();
        this.vendorDetail();
    }

    constructor(private fb: UntypedFormBuilder, private Route: Router, private routeActive: ActivatedRoute, private masterService: MasterService,
        private filter: FilterUtils) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data;
        }

    }

    displayedColumns = {
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
            style: "min-width:100px;",
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
        this.loadTempData(this.jobDetail);
    }

    loadTempData(jobDetail) {
        this.tableData = [
            {
                srNo: true, // Serial number
                jobNo: jobDetail?.jobNo || "",
                jobDate: jobDetail?.jobDate || "",
                noOfPkts: jobDetail?.pkgs || 0,
                weight: jobDetail?.weight || 0,
                fromCity: jobDetail?.fromToCity.split("-")[0] || "",
                toCity: jobDetail?.fromToCity.split("-")[1] || "",
                billingParty: "AAREN FURNITURES PALACE"
            }
        ]
    }

    //Checked Dropdown Option - Cn Wise / Job Wise
    display($event) {
        const generateControl = $event?.eventArgs.value || $event;
        if (generateControl === 'CN') {
            this.show = true;
        }
        if (generateControl === 'JOB') {
            this.show = false;
        }
        //   this.loadTempData('');
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
    //destionation
    destionationDropDown() {

        this.masterService.getJsonFileDetails("destination").subscribe({
            next: (res: any) => {
                if (res) {
                    this.filter.Filter(
                        this.jsonControlArray,
                        this.rakeEntryTableForm,
                        res,
                        this.destination,
                        this.destinationStatus
                    );
                }
            },
        });
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
      //  this.rakeEntryTableForm.controls['destination'].setValue(this.rakeEntryTableForm.controls['destination']?.value.name || "");
        this.rakeEntryTableForm.controls['fromCity'].setValue(this.rakeEntryTableForm.controls['fromCity']?.value.name || "");
        this.rakeEntryTableForm.controls['toCity'].setValue(this.rakeEntryTableForm.controls['toCity']?.value.name || "");
        this.rakeEntryTableForm.controls['destination'].setValue(this.rakeEntryTableForm.controls['destination']?.value.value);
        let data=this.rakeEntryTableForm.controls['viaControlHandler'].value.map((x)=>x.name);
        this.rakeEntryTableForm.controls['via'].setValue(data);
        this.rakeEntryTableForm.removeControl('viaControlHandler');
        let docDetail = {
            containorDetail: this.tableData,
          };
          let jobDetail = {
            ...this.rakeEntryTableForm.value,
            ...docDetail,
          };
        const res= await addRakeEntry(this.rakeEntryTableForm.value,this.masterService)
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
}