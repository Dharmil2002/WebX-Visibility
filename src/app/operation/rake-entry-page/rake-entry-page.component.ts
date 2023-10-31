import { Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from "src/app/Masters/processUtility";
import { RakeEntryControl } from "src/assets/FormControls/rake-entry";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Router } from "@angular/router";
import { addRakeEntry, filterDocketDetail, genericGet, vendorDetailFromApi } from "./rate-utility";
import Swal from "sweetalert2";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { JobEntryService } from "src/app/Utility/module/operation/job-entry/job-entry-service";
import { RakeEntryModel } from "src/app/Models/rake-entry/rake-entry";
import { RakeEntryService } from "src/app/Utility/module/operation/rake-entry/rake-entry-service";
import { formatDate } from "src/app/Utility/date/date-utils";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";

@Component({
    selector: 'app-rake-entry-page',
    templateUrl: './rake-entry-page.component.html',
    providers: [FilterUtils],
})
export class RakeEntryPageComponent implements OnInit {
    /*below code for tableData*/
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    METADATA = {
        checkBoxRequired: true,
        noColumnSort: ["checkBoxRequired"],
    };
    FormTitle = 'Prq List'
    dynamicControls = {
        add: true,
        edit: true,
        csv: false,
    };
    isLoad: boolean = false;
    menuItemflag: boolean = true;
    addAndEditPath: string;
    containerJsonArray: any;
    linkArray = [];
    boxData: { count: number; title: string; class: string; }[];
    /*End*/
    jsonControlArray: any;
    rakeEntryFormControl: RakeEntryControl;
    rakeEntryTableForm: UntypedFormGroup;
    rakeContainerTableForm: UntypedFormGroup;
    tableData: any = [];
    tableData1: any = [];
    type: any;
    show = false;
    apiShow = false;
    actionObject = {
        addRow: false,
        submit: false,
        search: false,
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
    cnNo:any;
    cnNoStatus:boolean;
    jobNo:any;
    jobNoStatus:boolean;
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
    vendorData: any;
    allContainer: any;
    allJobs: any;

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
        private filter: FilterUtils,
        private definition: RakeEntryModel,
        private rakeEntryService: RakeEntryService,
        private docketService:DocketService,
        private jobEntryService:JobEntryService
    ) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data;
        }


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
            destination: { variable: 'destination', status: 'destinationStatus' }
        };
        processProperties.call(this, this.jsonControlArray, jobPropertiesMapping);
        const containorPropertiesMapping=
        {
            cnNo: { variable: 'cnNo', status: 'cnNoStatus' },
            jobNo: { variable: 'jobNo', status: 'jobNoStatus' }
        }
        processProperties.call(this,this.allContainer, containorPropertiesMapping);
    }

    initializeFormControl() {
        // Create cityLocationFormControl instance to get form controls for different sections
        this.rakeEntryFormControl = new RakeEntryControl();
        // Get form controls for city Location Details section
        this.jsonControlArray = this.rakeEntryFormControl.getRakeEntryFormControls();
        this.containerJsonArray = this.rakeEntryFormControl.getRakeContainerDetail();
        this.allContainer = this.containerJsonArray;
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.rakeEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
        this.rakeContainerTableForm = formGroupBuilder(this.fb, [this.containerJsonArray]);
        this.show = false;
        this.containerJsonArray = this.allContainer.filter((x) => x.name != "cnNo" && x.name != "cnDate")
        this.rakeEntryTableForm.controls['documentType'].setValue('JOB');
        this.definition.columnHeader = this.definition.columnHeader;
        const jobDetail=this.jobDetail?[this.jobDetail]:[]
        this.loadTempData(jobDetail);

    }

    async loadTempData(jobDetail) {
        this.tableData = [];
        const jobList = jobDetail?await this.rakeEntryService.processRakeListJob(jobDetail):[];
        this.tableData = jobList;
        this.tableLoad = false;
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
        const docketDetail = await this.docketService.getDocket();
        const docketFilter = await filterDocketDetail(docketDetail);
        const jobDetail=await this.jobEntryService.getJobDetail();
        this.allJobs=jobDetail;
        this.allCn =docketFilter;
        this.cnDetail = docketFilter
        this.cityMapping()
       
    }

    cancel() {
        this.goBack('Job')
    }

    goBack(tabIndex: string): void {
        this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
    }

    async vendorDetail() {
        const resDetail = await vendorDetailFromApi(this.masterService);
        const vendorData = resDetail.map((x) => { return { value: x.vendorCode, name: x.vendorName, type: x.vendorType } });
        this.vendorData = vendorData;
        this.filter.Filter(
            this.jsonControlArray,
            this.rakeEntryTableForm,
            vendorData,
            this.vendor,
            this.vendorStatus
        );
    }
    
    async save() {
        let fieldsToFromRemove = [];
        let containorDetail = {}
        let jobs = []
        let cnote=[]
        if (this.tableData.length > 0) {
            const controlsToRemove = [
                'cnNo',
                'cnDate',
                'noOfPkg',
                'weight',
                'fCity',
                'tCity',
                'billingParty',
                'jobNo',
                'jobDate'
              ];
              
              controlsToRemove.forEach(control => {
                this.rakeEntryTableForm.removeControl(control);
              });
    
            if (Array.isArray(this.tableData)) {
              this.tableData.forEach((item) => {
                if (item.hasOwnProperty('jobNo') && item.jobDate) {
                  item.jobDate = item.jobDateUtc;
                  fieldsToFromRemove = ["actions", "type", "jobDateDateUtc"]
                  jobs.push(item.jobNo);
                }
                else if (item.hasOwnProperty('cnNo') && item.cnDate) {
                    item.cnDate = item.cnDateUtc;
                    fieldsToFromRemove = ["id", "actions", "cnDate"],
                    cnote.push(item.cnNo);
                  }
              });
          }
        
    
        }
        else if (this.rakeEntryTableForm.value.cnNo) {
          const cnDetail = {
            cnNo: this.rakeEntryTableForm.value.cnNo.value,
            cnDate: this.rakeEntryTableForm.value?.cnDateUtc || new Date(),
            noOfPkg: this.rakeEntryTableForm.value.noOfPkg,
            weight: this.rakeEntryTableForm.value.weight
          }
          this.tableData.push(cnDetail);
          cnote = this.tableData.map((x) => x.cnNo);
        }
        else if (this.rakeEntryTableForm.value.jobNo) {
          const containerDetail = {
            jobNo: this.rakeEntryTableForm.value.jobNo.value,
            jobDate: this.rakeEntryTableForm.value?.jobDateDateUtc || new Date(),
            weight: this.rakeEntryTableForm.value.weight,
            fCity: this.rakeEntryTableForm.value.fCity,
            tCity: this.rakeEntryTableForm.value.tCity,
            billingParty: this.rakeEntryTableForm.value.billingParty,
          }
          this.tableData.push(containerDetail);
        }
        containorDetail =  this.tableData
        // Create a new array without the 'srNo' property
        // Assign the modified array back to 'this.tableData'
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
        const containorList = fieldsToFromRemove.length > 0 ? removeFieldsFromArray(containorDetail, fieldsToFromRemove) : [];
        let docDetail = {
            containorDetail: containorList,
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
        this.rakeContainerTableForm.reset();
        this.tableData=[];
        if (this.rakeEntryTableForm.value.documentType !== "JOB") {
            this.containerJsonArray = this.allContainer.filter((x) => x.name != "jobNo" && x.name != "jobDate")
            this.definition.columnHeader = this.definition.cnoteHeader;
            const cnValues=this.allCn.map((x)=>{return {name:x.cnNo,value:x.cnNo,extraData:x} });
            this.filter.Filter(
                this.containerJsonArray,
                this.rakeContainerTableForm,
                cnValues,
                this.cnNo,
                this.cnNoStatus
            ); 

        }
        else {
            this.containerJsonArray = this.allContainer.filter((x) => x.name != "cnNo" && x.name != "cnDate");
            this.definition.columnHeader = this.definition.jobHeader;
            const jobValues=this.allJobs.map((x)=>{return {name:x.jobId,value:x.jobId,extraData:x} });
            this.tableData=this.jobDetail?[this.jobDetail]:[];
            this.filter.Filter(
                this.containerJsonArray,
                this.rakeContainerTableForm,
                jobValues,
                this.jobNo,
                this.jobNoStatus
            ); 

        }
    }
    vendorFieldChanged() {

        const rakeControl = this.rakeEntryTableForm.get('vendorName');
        const vendorType = this.rakeEntryTableForm.value.vendorType;
        this.jsonControlArray.forEach((x) => {
            if (x.name === "vendorName") {
                x.type = vendorType === "Market" ? "text" : "dropdown";
            }
        });
        if (vendorType !== 'Market') {
            const vendorDetail = this.vendorData.filter((x) => x.type.toLowerCase() == vendorType.toLowerCase());
            this.filter.Filter(
                this.jsonControlArray,
                this.rakeEntryTableForm,
                vendorDetail,
                this.vendor,
                this.vendorStatus
            );
            rakeControl.setValidators([Validators.required, autocompleteObjectValidator()]);
            rakeControl.updateValueAndValidity();
        }
        else {
            const rakeControl = this.rakeEntryTableForm.get('vendorName');
            rakeControl.setValidators(Validators.required);
            rakeControl.updateValueAndValidity();
        }
        
    }

/*below the function for Cnote details*/
  getCnoteDetails(){
    
    const dktDetail=this.rakeContainerTableForm.controls['cnNo'].value;
    this.rakeContainerTableForm.controls['cnDate'].setValue(dktDetail.extraData.docketDate);
    this.rakeContainerTableForm.controls['noOfPkg'].setValue(dktDetail.extraData.noOfPkg);
    this.rakeContainerTableForm.controls['weight'].setValue(dktDetail.extraData.weight);
    this.rakeContainerTableForm.controls['fCity'].setValue(dktDetail.extraData.fCity);
    this.rakeContainerTableForm.controls['tCity'].setValue(dktDetail.extraData.tCity);
    this.rakeContainerTableForm.controls['billingParty'].setValue(dktDetail.extraData.billingParty);
  }
  /*end*/
  getJobDetails(){
    
    const jobDetail=this.rakeContainerTableForm.controls['jobNo'].value;
    this.rakeContainerTableForm.controls['jobDate'].setValue(jobDetail.extraData.jobDate);
    this.rakeContainerTableForm.controls['noOfPkg'].setValue(jobDetail.extraData.noOfpkg);
    this.rakeContainerTableForm.controls['weight'].setValue(jobDetail.extraData.loadedWeight);
    this.rakeContainerTableForm.controls['fCity'].setValue(jobDetail.extraData.fromCity);
    this.rakeContainerTableForm.controls['tCity'].setValue(jobDetail.extraData.toCity);
    this.rakeContainerTableForm.controls['billingParty'].setValue(jobDetail.extraData.billingParty);
  }
  /*THC*/
   async addContainor() {
    const docType=this.rakeEntryTableForm.controls['documentType'].value;
    const mappend=docType=="JOB"?"job":"cn";
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.cnNo === this.rakeContainerTableForm.value.cnNo
      );
      if (exist) {
        this.rakeContainerTableForm.controls["cnNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering CNNO Number.",
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false;
      }
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
        [`${mappend}No`]:this.rakeContainerTableForm.controls[`${mappend}No`].value?.value,
        [`${mappend}Date`]:formatDate(this.rakeContainerTableForm.controls[`${mappend}Date`].value, "dd-MM-yy HH:mm"),
        noOfPkg:this.rakeContainerTableForm.controls['noOfPkg'].value,
        weight:this.rakeContainerTableForm.controls['weight'].value,
        fCity:this.rakeContainerTableForm.controls['fCity'].value,
        tCity:this.rakeContainerTableForm.controls['tCity'].value,
        billingParty :this.rakeContainerTableForm.controls['billingParty'].value,
        [`${mappend}DateUtc`]:this.rakeContainerTableForm.controls[`${mappend}Date`].value,
        type:mappend,
        actions: ["Edit", "Remove"]
    };
    this.tableData.push(json);
    this.isLoad = false;
    this.tableLoad = false;
    const fieldsToClear = [
        `${mappend}No`,
        `${mappend}Date`,
        'noOfPkg',
        'weight',
        'tCity',
        'fCity',
        'billingParty'
      ];
      fieldsToClear.forEach(field => {
        this.rakeContainerTableForm.controls[field].setValue("");
      });
      

  }
  /*End*/
  handleMenuItemClick(data) {
    this.fillRakeUpdate(data)
}
 fillRakeUpdate(data: any) {
    const mapping=data.data.type;
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter(x => x[`${mapping}No`] !== data.data[`${mapping}No`]);
    } else {
      this.rakeContainerTableForm.controls[`${mapping}No`].setValue(
        { name:  data.data[`${mapping}No`], value:  data.data[`${mapping}No`] } || ""
      );
      this.rakeContainerTableForm.controls[`${mapping}Date`].setValue(
        data.data?.[`${mapping}DateUtc`] || new Date()
      );
      this.rakeContainerTableForm.controls["noOfPkg"].setValue(
        data.data?.noOfPkg || ""
      );
      this.rakeContainerTableForm.controls["weight"].setValue(
        data.data?.weight || ""
      );
      this.rakeContainerTableForm.controls["fCity"].setValue(
        data.data?.fCity || ""
      );
      this.rakeContainerTableForm.controls["tCity"].setValue(
        data.data?.tCity || ""
      );
      this.rakeContainerTableForm.controls["billingParty"].setValue(
        data.data?.billingParty || ""
      );
      this.tableData = this.tableData.filter(x => x[`${mapping}No`] !== data.data[`${mapping}No`]);;

    }
  }
}