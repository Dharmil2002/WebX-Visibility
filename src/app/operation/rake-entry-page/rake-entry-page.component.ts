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
import { RakeEntryModel } from "src/app/Models/rake-entry/rake-entry";
import { formatDate } from "src/app/Utility/date/date-utils";
import { areAllFieldsEmpty, removeFields, removeFieldsFromArray, updateProperty } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { FormControls } from "src/app/Models/FormControl/formcontrol";

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

    dynamicControls = {
        add: false,
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
    rakeDetailsTableForm: UntypedFormGroup;
    invDetailsTableForm:UntypedFormGroup;
    tableData: any = [];
    tableData1: any = [];
    tableRakeData: any = [];
    tableInvData:any=[];
    TableStyle = "width:20%"
    type: any;
    show = false;
    apiShow = false;
    rrLoad:boolean =true;
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
    cnNo: any;
    cnNoStatus: boolean;
    jobNo: any;
    jobNoStatus: boolean;
    isRRLoad: boolean;
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
    jsonRakeDetails: FormControls[];
    width: '800px'
    height: '500px'
    jsonInvoiceDetails: FormControls[];
    invLoad: boolean=true;
    isInvLoad: boolean;
    shipments: { name: any; value: any; extraData: any; }[];
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
        private docketService: DocketService
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
        const containorPropertiesMapping =
        {
            cnNo: { variable: 'cnNo', status: 'cnNoStatus' },
        }
        processProperties.call(this, this.allContainer, containorPropertiesMapping);
    }

    initializeFormControl() {
        // Create cityLocationFormControl instance to get form controls for different sections
        this.rakeEntryFormControl = new RakeEntryControl();
        // Get form controls for city Location Details section
        this.jsonControlArray = this.rakeEntryFormControl.getRakeEntryFormControls();
        this.containerJsonArray = this.rakeEntryFormControl.getRakeContainerDetail();
        this.jsonRakeDetails = this.rakeEntryFormControl.getrakeDetailsControls();
        this.jsonInvoiceDetails=this.rakeEntryFormControl.getInvoiceDetails() ;
        this.allContainer = this.containerJsonArray;
        // Build the form group using formGroupBuilder function and the values of jsonControlArray
        this.rakeEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
        this.rakeContainerTableForm = formGroupBuilder(this.fb, [this.containerJsonArray]);
        this.rakeDetailsTableForm = formGroupBuilder(this.fb, [this.jsonRakeDetails]);
        this.invDetailsTableForm = formGroupBuilder(this.fb, [this.jsonInvoiceDetails]);
        this.show = false;
        this.rakeEntryTableForm.controls['documentType'].setValue('CN');
        this.definition.columnHeader = this.definition.columnHeader;
        //this.loadTempData(jobDetail);

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
        const cnValues = docketFilter.map((x) => { return { name: x.cnNo, value: x.cnNo, extraData: x } });
        this.filter.Filter(
            this.containerJsonArray,
            this.rakeContainerTableForm,
            cnValues,
            this.cnNo,
            this.cnNoStatus
        );
        this.shipments=cnValues;
        this.allCn = docketFilter;
        this.cnDetail = docketFilter

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
        let containorDetail = {};
        let invoiceDetail={};
        let rakeDetails={};
        let jobs = []
        let cnote = []
        if (this.tableData.length > 0) {
            if (Array.isArray(this.tableData)) {
                this.tableData.forEach((item) => {
                 if (item.hasOwnProperty('cnNo') && item.cnDate) {
                        item.cnDate = item.cnDateUtc;
                        fieldsToFromRemove = ["id", "actions","jsonColumn","tableData","fieldsToFromRemove",],
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
        containorDetail = this.tableData
        invoiceDetail = this.tableInvData.length>0?this.tableInvData:[this.invDetailsTableForm.value];
        rakeDetails = this.tableRakeData.length>0?this.tableRakeData:[this.rakeDetailsTableForm.value];
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
        const viaCity = this.rakeEntryTableForm.controls['viaControlHandler'].value;
        const cityMap = viaCity ? viaCity.map((x) => x.name) : [];
        this.rakeEntryTableForm.controls['via'].setValue(cityMap);
        this.rakeEntryTableForm.removeControl('viaControlHandler');
        const containorList =  removeFields(containorDetail, fieldsToFromRemove);
        const updatedinvoiceList = updateProperty(invoiceDetail,'invDate','oinvDate');
        const invoiceList =  removeFields(updatedinvoiceList,['actions','oinvDate']);
        const updatedRakeDetails = updateProperty(rakeDetails,'rrDate','orrDate');
        const rakeDetailsData =  removeFields(updatedRakeDetails,['actions','orrDate']);
        
        let docDetail = {
            containorDetail: containorList,
            invoiceDetails:invoiceList,
            rakeDetails:rakeDetailsData
            
        };
        let jobDetail = {
            ...this.rakeEntryTableForm.value,
            ...docDetail,
        };
        for (const element of cnote) {
            await this.docketService.updateDocket(element, { "rakeId": rake});
          }
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
            this.destination,
            this.destinationStatus
        );
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
    getCnoteDetails() {
        const dktDetail = this.rakeContainerTableForm.controls['cnNo'].value;
        const containerDetails=areAllFieldsEmpty(dktDetail.extraData?.containerDetail);
        this.rakeContainerTableForm.controls['cnDate'].setValue(dktDetail.extraData.docketDate);
        this.rakeContainerTableForm.controls['noOfContainer'].setValue(containerDetails?0:dktDetail.extraData?.containerDetail.length);
        this.rakeContainerTableForm.controls['noOfPkg'].setValue(dktDetail.extraData.noOfPkg);
        this.rakeContainerTableForm.controls['weight'].setValue(dktDetail.extraData.weight);
        this.rakeContainerTableForm.controls['fCity'].setValue(dktDetail.extraData.fCity);
        this.rakeContainerTableForm.controls['tCity'].setValue(dktDetail.extraData.tCity);
        this.rakeContainerTableForm.controls['contDtl'].setValue(containerDetails?['']:dktDetail.extraData?.containerDetail);
        this.rakeContainerTableForm.controls['billingParty'].setValue(dktDetail.extraData.billingParty);
    }
    /*THC*/
    async addContainor() {
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
            cnNo: this.rakeContainerTableForm.controls['cnNo'].value?.value,
            cnDate: formatDate(this.rakeContainerTableForm.controls['cnDate'].value, "dd-MM-yy HH:mm"),
            contCnt: this.rakeContainerTableForm.controls['noOfContainer']?.value||0,
            noOfPkg: this.rakeContainerTableForm.controls['noOfPkg'].value,
            weight: this.rakeContainerTableForm.controls['weight'].value,
            fCity: this.rakeContainerTableForm.controls['fCity'].value,
            tCity: this.rakeContainerTableForm.controls['tCity'].value,
            billingParty: this.rakeContainerTableForm.controls['billingParty'].value,
            cnDateDateUtc: this.rakeContainerTableForm.controls['cnDate'].value,
            type: 'cn',
            jsonColumn:this.definition.jsonColumn,
            staticField:['containerNumber','containerType'],
            tableData: this.rakeContainerTableForm.controls['contDtl']?.value,
            actions: ["Edit", "Remove"]
        };
        this.tableData.push(json);
        this.isLoad = false;
        this.tableLoad = false;
        const fieldsToClear = [
            'cnNo',
            'cnDate',
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
        if(data.data.rrNo){
         this.fillRakeDetails(data);
        }
        else if(data.data.invNum){
            this.fillInvoiceDetails(data);
        }
        else{
            this.fillContainersDetails(data)
        }
    }
    fillContainersDetails(data: any) {
        if (data.label.label === "Remove") {
            this.tableData = this.tableData.filter(x => x.cnNo !== data.data.cnNo);
        } else {
            const cnNoToFind = data?.data?.cnNo;
            const dktDetails = cnNoToFind ? this.shipments.find(x => x.value === cnNoToFind) : '';
            this.rakeContainerTableForm.controls['cnNo'].setValue(
                dktDetails || ""
            );
            this.rakeContainerTableForm.controls['cnDate'].setValue(
                data.data?.cnNoDateUtc || new Date()
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
            this.tableData = this.tableData.filter(x => x['cnNo'] !== data.data.cnNo);;

        }
    }

    fillRakeDetails(data){
        this.rrLoad=true;
        if (data.label.label === "Remove") {
            this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);
        } else {
            this.rakeDetailsTableForm.controls['rrNo'].setValue(data.data['rrNo']);
            this.rakeDetailsTableForm.controls['rrDate'].setValue(
                data.data?.orrDate || new Date()
            );
           
            this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);;
            this.rrLoad=false;
        }
    }
    async addRakeData() {
        this.rrLoad = true;
        this.isRRLoad = true;
        const tableData = this.tableRakeData;
        if (tableData.length > 0) {
            const exist = tableData.find(
                (x) =>
                    x.rrNo === this.rakeDetailsTableForm.value.rrNo
            );
            if (exist) {
                this.rakeDetailsTableForm.controls["rrNo"].setValue("");
                Swal.fire({
                    icon: "info", // Use the "info" icon for informational messages
                    title: "Information",
                    text: "Please avoid duplicate entering RR NO.",
                    showConfirmButton: true,
                });
                this.rrLoad = false;
                this.isRRLoad = false;
                return false;
            }
        }
        const delayDuration = 1000;
        // Create a promise that resolves after the specified delay
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // Use async/await to introduce the delay
        await delay(delayDuration);
        const json = {
            rrNo: this.rakeDetailsTableForm.controls['rrNo'].value,
            rrDate: formatDate(this.rakeDetailsTableForm.controls['rrDate'].value, "dd-MM-yy HH:mm"),
            orrDate: this.rakeDetailsTableForm.controls['rrDate'].value,
            actions: ["Edit", "Remove"]
        };
        this.tableRakeData.push(json);
        this.rrLoad = false;
        this.isRRLoad = false;
        const fieldsToClear = [
            'rrNo',
            'rrDate'
        ];
        fieldsToClear.forEach(field => {
            this.rakeDetailsTableForm.controls[field].setValue("");
        });

    }
    async addInvoiceData() {
        this.invLoad = true;
        this.isInvLoad = true;
        const tableData = this.tableInvData;
        if (tableData.length > 0) {
            const exist = tableData.find(
                (x) =>
                    x.invNum === this.invDetailsTableForm.value.invNum
            );
            if (exist) {
                this.invDetailsTableForm.controls["invNum"].setValue("");
                Swal.fire({
                    icon: "info", // Use the "info" icon for informational messages
                    title: "Information",
                    text: "Please avoid duplicate entering RR NO.",
                    showConfirmButton: true,
                });
                this.invLoad = false;
                this.isInvLoad = false;
                return false;
            }
        }
        const delayDuration = 1000;
        // Create a promise that resolves after the specified delay
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // Use async/await to introduce the delay
        await delay(delayDuration);
        const json = {
            invNum: this.invDetailsTableForm.controls['invNum'].value,
            invDate: formatDate(this.invDetailsTableForm.controls['invDate'].value, "dd-MM-yy HH:mm"),
            invAmt: this.invDetailsTableForm.controls['invAmt'].value,
            oinvDate: this.invDetailsTableForm.controls['invDate'].value,
            actions: ["Edit", "Remove"]
        };
        this.tableInvData.push(json);
        this.invLoad = false;
        this.isInvLoad = false;
        this.invDetailsTableForm.reset();

    }
    fillInvoiceDetails(data){
        this.isInvLoad=true;
        if (data.label.label === "Remove") {
            this.tableInvData = this.tableInvData.filter(x => x.invNum !== data.data.invNum);
            this.isInvLoad=false;
        } else {
            this.invDetailsTableForm.controls['invNum'].setValue(data.data.invNum);
            this.invDetailsTableForm.controls['invAmt'].setValue(data.data.invAmt);
            this.invDetailsTableForm.controls['invDate'].setValue(
                data.data?.orrDate || new Date()
            );
            this.tableInvData = this.tableInvData.filter(x => x.invNum !== data.data.invNum);
            this.isInvLoad=false;
        }
    }
}