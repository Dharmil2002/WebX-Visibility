import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from "src/app/Masters/processUtility";
import { RakeEntryControl } from "src/assets/FormControls/rake-entry";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { RakeEntryModel } from "src/app/Models/rake-entry/rake-entry";
import { formatDate } from "src/app/Utility/date/date-utils";
import {getTypeName, setGeneralMasterData} from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { RakeEntryService } from "src/app/Utility/module/operation/rake-entry/rake-entry-service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { getVendorsForAutoComplete } from "../job-entry-page/job-entry-utility";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StorageService } from "src/app/core/service/storage.service";
import { isEmptyFormValue } from "src/app/Utility/Form Utilities/filter-utils";

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
    invDetailsTableForm: UntypedFormGroup;
    tableData: any = [];
    tableData1: any = [];
    tableRakeData: any = [];
    tableInvData: any = [];
    TableStyle = "width:20%"
    type: any;
    show = false;
    apiShow = false;
    rrLoad: boolean = true;
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
    invLoad: boolean = true;
    isInvLoad: boolean;
    shipments: { name: any; value: any; extraData: any; }[];
    vendorTypes: AutoComplete[];
    loadType: AutoComplete[];
    movementType: AutoComplete[];
    docType: AutoComplete[];
    tranMode: AutoComplete[];
    backPath: string;
    ngOnInit(): void {
        this.initializeFormControl();
        this.bindDropDown();
    }

    constructor(
        private fb: UntypedFormBuilder,
        private Route: Router,
        private masterService: MasterService,
        private filter: FilterUtils,
        private definition: RakeEntryModel,
        private docketService: DocketService,
        private rakeService: RakeEntryService,
        private locationService:LocationService,
        private generalService: GeneralService,
        private pinCodeService:PinCodeService,
        private storage:StorageService
    ) {
        if (this.Route.getCurrentNavigation()?.extras?.state != null) {
            this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data;
            this.backPath = "/dashboard/Index?tab=7";
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
        this.jsonInvoiceDetails = this.rakeEntryFormControl.getInvoiceDetails();
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
        this.getGeneralMasterData();
       
    }

    async autoFillJobDetails() {
        if(this.jobDetail){
         const jobType=this.movementType.find(x=>x.name==this.jobDetail.jobType)?.value||"";
         this.rakeEntryTableForm.controls['movementType'].setValue(jobType);
         if (this.jobDetail.jobType == "Export" || (this.jobDetail.jobType == "import" && this.jobDetail.tBYNM == "Third Party")) {
            const dockets=await this.docketService.getDockets({jOBNO:this.jobDetail.jobNo});
            if(dockets){
            const allDkt=dockets.map((x)=>x.docNo);
             const containerDetails= await this.docketService.getDocketDetails({dKTNO: { 'D$in': allDkt }});
             let shipments=[]
             dockets.forEach((x)=>{
             const container=containerDetails.data.filter((y)=>y.dKTNO==x.docNo);
             const json = {
                cnNo:x.docNo,
                cnDate: formatDate(x.dKTDT, "dd-MM-yy HH:mm"),
                contCnt:container.length,
                noOfPkg: x?.pKGS||0,
                weight:x?.aCTWT||0,
                fCity:x?.fCT||0,
                tCity:x?.tCT||0,
                billingParty:x?.bPARTY||0,
                billingPartyCode:x?.bPARTYNM||0,
                cnDateDateUtc:x?.dKTDT||0,
                type: 'cn',
                jsonColumn: this.definition.jsonColumn,
                staticField: ['cNID', 'cNTYP'],
                tableData: container?container:[],
                actions: ["Edit", "Remove"]
            };
            shipments.push(json);
        });
               this.tableData=shipments
                this.isLoad = false;
                this.tableLoad = false;
            }
            // Code to execute if either condition is met
        }
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
    cancel() {
        this.goBack('Job')
    }
    goBack(tabIndex: string): void {
        this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
    }

    /*Below is Docket Function Which is For AutoComplate*/
    async getShipment(event) {
        if (typeof (event.eventArgs) == "string") {
            await this.docketService.getDocketsForAutoComplete(this.rakeContainerTableForm,this.containerJsonArray, event.field.name, this.cnNoStatus);
        }
    }
    /*End*/
    /*Below is the Function for Get City Details*/
    async getCityDetail(event) {
        const { additionalData, type, name } = event.field;
        const cityMapping = additionalData.showNameAndValue;
    
        if (type === 'multiselect') {
            const selectedValues = this.rakeEntryTableForm.controls[name].value;
    
            if (selectedValues.length >= 3) {
                const viaControlHandler = this.rakeEntryTableForm.controls['viaControlHandler'].value;
                const regexPattern = `^${selectedValues}`;
                const cityDetails = await this.pinCodeService.getCityDetails({
                    CT: { 'D$regex': regexPattern, 'D$options': 'i' }
                });
    
                let updatedCities = cityDetails;
                if (viaControlHandler) {
                    const viaControlHandlerValues = viaControlHandler.map(x => x.value);
                    updatedCities = updatedCities.filter(city => !viaControlHandlerValues.includes(city.value));
                    updatedCities.push(...this.rakeEntryTableForm.value.viaControlHandler);
                }
    
                this.rakeEntryTableForm.controls['viaControlHandler'].setValue(viaControlHandler);
                this.filter.Filter(this.jsonControlArray, this.rakeEntryTableForm, updatedCities, name, cityMapping);
            }
        } else {
            this.pinCodeService.getCity(this.rakeEntryTableForm, this.jsonControlArray, name, cityMapping);
        }
    }
    
     /*End*/
    async save() {
        const container=this.rakeContainerTableForm.value;
        const forms = [this.rakeContainerTableForm, this.rakeDetailsTableForm, this.invDetailsTableForm];
        const confirmAndProceed = () => {
            return Swal.fire({
                title: 'Are you sure?',
                text: 'You have unsaved changes in the table. Are you sure you want to continue and discard these changes?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Continue',
                cancelButtonText: 'No, Go Back'
            });
        };
        const newValue=new Set();
        const checkFormsAndProceed = async () => {
            for (const form of forms) {
                const isForm=await isEmptyFormValue(form);
                newValue.add(isForm);
                if (!await isEmptyFormValue(form)) {
                    const result = await confirmAndProceed();
                    if (result.isConfirmed) {
                        this.addRakeDetails();
                        break; // Stop checking other forms if the user confirms
                    } else {
                        return; // Exit the function if the user does not confirm
                    }
                }
            }
        
            // Call addRakeDetails if all forms are empty or after user confirmation
            this.addRakeDetails();
        };
        checkFormsAndProceed();
    }
    async addRakeDetails() {
        let bindData = {
            containerDetail: this.tableData,
            rakeDetail: this.tableRakeData,
            invoiceDetail: this.tableInvData
        };
        const viaCity = this.rakeEntryTableForm.controls['viaControlHandler'].value;
        const cityMap = viaCity ? viaCity.map((x) => x.name) : [];
        this.rakeEntryTableForm.controls['via'].setValue(cityMap);
        this.rakeEntryTableForm.removeControl('viaControlHandler');
        let dataEntry = this.rakeEntryTableForm.value;
        dataEntry['vendorTypeName'] = await getTypeName(dataEntry.vendorType, this.vendorTypes);
        dataEntry['loadTypeName'] =await getTypeName(dataEntry.loadType, this.loadType);
        dataEntry['movementType'] = dataEntry.movementType;
        dataEntry['movementTypeName'] = await getTypeName(dataEntry.movementType, this.movementType);
        dataEntry['documentTypeName'] = dataEntry.documentType;
        dataEntry['documentType'] = await getTypeName(dataEntry.documentType, this.docType,true);
        dataEntry['transportModeName'] = dataEntry.transportMode;
        dataEntry['transportMode'] =await getTypeName(dataEntry.transportMode, this.tranMode,true) ;
        dataEntry['jobNo'] = this.jobDetail?.jobNo||"";
        const allData = {
            ...dataEntry,
            ...bindData,
        }
        let mappedData = await this.rakeService.fieldMapping(allData);
        let res = await this.rakeService.addRakeDetails(mappedData);
        if (res) {
            Swal.fire({
              icon: "success",
              title: "RAKE Generated",
              text: `RAKE No: ${res.data}`,
              showConfirmButton: true,
            });
            this.goBack("Job");
          }
    }


    vendorFieldChanged() {

        const rakeControl = this.rakeEntryTableForm.get('vendorName');
        const vendorType = this.rakeEntryTableForm.value.vendorType;
        this.jsonControlArray.forEach((x) => {
            if (x.name === "vendorName") {
                x.type = vendorType == "4" ? "text" : "dropdown";
            }
        });
        if (vendorType != "4") {
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
    async getCnoteDetails() {
       const containerDetails= await this.docketService.getDocketDetails({dKTNO:this.rakeContainerTableForm.controls['cnNo'].value.value});
        const {docketData} = this.rakeContainerTableForm.controls['cnNo'].value;
        this.rakeContainerTableForm.controls['cnDate'].setValue(docketData?.dKTDT);
        this.rakeContainerTableForm.controls['noOfContainer'].setValue(containerDetails?.data.length||0);
        this.rakeContainerTableForm.controls['noOfPkg'].setValue(docketData?.pKGS||0);
        this.rakeContainerTableForm.controls['weight'].setValue(docketData?.aCTWT||0);
        this.rakeContainerTableForm.controls['fCity'].setValue(docketData?.fCT||"");
        this.rakeContainerTableForm.controls['tCity'].setValue(docketData?.tCT||"");
        this.rakeContainerTableForm.controls['billingParty'].setValue(docketData?.bPARTYNM||"");
        this.rakeContainerTableForm.controls['billingPartyCode'].setValue(docketData?.bPARTY||"");
        this.rakeContainerTableForm.controls['contDtl'].setValue(containerDetails?.data||[]);
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
            contCnt: this.rakeContainerTableForm.controls['noOfContainer']?.value || 0,
            noOfPkg: this.rakeContainerTableForm.controls['noOfPkg'].value,
            weight: this.rakeContainerTableForm.controls['weight'].value,
            fCity: this.rakeContainerTableForm.controls['fCity'].value,
            tCity: this.rakeContainerTableForm.controls['tCity'].value,
            billingParty: this.rakeContainerTableForm.controls['billingParty'].value,
            billingPartyCode: this.rakeContainerTableForm.controls['billingPartyCode'].value,
            cnDateDateUtc: this.rakeContainerTableForm.controls['cnDate'].value,
            type: 'cn',
            jsonColumn: this.definition.jsonColumn,
            staticField: ['cNID', 'cNTYP'],
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
            'billingParty',
            'billingPartyCode',
            'contDtl',
            'noOfContainer'
        ];
        fieldsToClear.forEach(field => {
            this.rakeContainerTableForm.controls[field].setValue("");
        });


    }
    /*End*/
    handleMenuItemClick(data) {
        if (data.data.rrNo) {
            this.fillRakeDetails(data);
        }
        else if (data.data.invNum) {
            this.fillInvoiceDetails(data);
        }
        else {
            this.fillContainersDetails(data)
        }
    }
    fillContainersDetails(data: any) {
        if (data.label.label === "Remove") {
            this.tableData = this.tableData.filter(x => x.cnNo !== data.data.cnNo);
        } else {
            const cnNoToFind = data?.data?.cnNo;
            const dktDetails = {
                name:cnNoToFind,
                value:cnNoToFind
            };
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
            this.rakeContainerTableForm.controls['noOfContainer'].setValue(data.data?.contCnt||0)
            this.tableData = this.tableData.filter(x => x['cnNo'] !== data.data.cnNo);;

        }
    }

    fillRakeDetails(data) {
        this.rrLoad = true;
        if (data.label.label === "Remove") {
            this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);
        } else {
            this.rakeDetailsTableForm.controls['rrNo'].setValue(data.data['rrNo']);
            this.rakeDetailsTableForm.controls['rrDate'].setValue(
                data.data?.orrDate || new Date()
            );

            this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);;
            this.rrLoad = false;
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
    fillInvoiceDetails(data) {
        this.isInvLoad = true;
        if (data.label.label === "Remove") {
            this.tableInvData = this.tableInvData.filter(x => x.invNum !== data.data.invNum);
            this.isInvLoad = false;
        } else {
            this.invDetailsTableForm.controls['invNum'].setValue(data.data.invNum);
            this.invDetailsTableForm.controls['invAmt'].setValue(data.data.invAmt);
            this.invDetailsTableForm.controls['invDate'].setValue(
                data.data?.orrDate || new Date()
            );
            this.tableInvData = this.tableInvData.filter(x => x.invNum !== data.data.invNum);
            this.isInvLoad = false;
        }
    }
    /*here i wanna create a Function for the destination*/
    async getDestLocation(){
    const destinationMapping = await this.locationService.locationFromApi({
         locCode: { 'D$regex': `^${this.rakeEntryTableForm.controls.destination.value}`, 'D$options': 'i' } ,
      });
      this.filter.Filter(this.jsonControlArray, this.rakeEntryTableForm, destinationMapping,this.destination,this.destinationStatus);
    }
      /*End*/
   /*vendorType Changes*/
   async getVendors(event) {
    const formData = this.rakeEntryTableForm.value;
    if (event.eventArgs.length >= 3) {
      const vendorType = this.rakeEntryTableForm.controls["vendorType"].value;
      if (vendorType && vendorType !== "") {
        let vendors = await getVendorsForAutoComplete(this.masterService, event.eventArgs, parseInt(vendorType));
        this.filter.Filter(this.jsonControlArray,this.rakeEntryTableForm,vendors,this.vendor,this.vendorStatus);
      }
    }
  }

   /*End*/
   /*Below is function for get data from General Master*/
    async getGeneralMasterData() {
        this.vendorTypes = await this.generalService.getGeneralMasterData("VENDTYPE");
        setGeneralMasterData(this.jsonControlArray, this.vendorTypes, "vendorType");
        this.loadType = await this.generalService.getGeneralMasterData("LOADTYPE");
        setGeneralMasterData(this.jsonControlArray, this.loadType, "loadType");
        this.movementType = await this.generalService.getGeneralMasterData("MOVTYP");
        this.docType = await this.generalService.getGeneralMasterData("RAKEDOCTYPE");
        setGeneralMasterData(this.jsonControlArray, this.movementType, "movementType");
        this.tranMode = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
        this.autoFillJobDetails();
        
    }
   /*End*/
}