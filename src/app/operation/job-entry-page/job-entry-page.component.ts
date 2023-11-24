import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import { JobControl } from "src/assets/FormControls/job-entry";
import Swal from "sweetalert2";
import { addJobDetail, getNextNumber, getVendorDetails } from "./job-entry-utility";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { customerFromApi } from "../prq-entry-page/prq-utitlity";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { JobEntryService } from "src/app/Utility/module/operation/job-entry/job-entry-service";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { removeFields } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { MatDialog } from "@angular/material/dialog";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { JobSummaryModel } from "src/app/Models/job-model/job.entry";
import { formatDate } from "src/app/Utility/date/date-utils";
import { timeStamp } from "console";


@Component({
  selector: 'app-job-entry-page',
  templateUrl: './job-entry-page.component.html',
  providers: [FilterUtils],
})
export class JobEntryPageComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  branchCode = localStorage.getItem("Branch");
  billingParty: any;
  tableLoad: boolean = true;
  jobTableLoad: boolean = true;
  billingPartyStatus: any;
  fleetSize: any;
  fleetSizeStatus: any;
  jobLocation: any;
  jobLocationStatus: any;
  transportMode: any;
  transportModeStatus: any;
  fromCity: any;
  tableData: any = [];
  TblDataCont: any = [];
  TblChallan: any = [];
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  jobFormControls: JobControl;
  columnChallan: any;
  isUpdate: boolean = false;
  jsonControlArray: any;
  jobEntryTableForm: UntypedFormGroup;
  containorTableForm: UntypedFormGroup;
  blTableForm: UntypedFormGroup;
  cityData: any;
  vendorNameCode: string;
  vendorNameStatus: boolean;
  cnoteNo: string;
  cnoteNoStatus: boolean;
  contFlag: boolean;
  backPath: string;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  /*Here i declare the json array which is used to displayed on job detail*/
  /*Invoice Detail*/
  columnJobDetail: any;
  orgBranch: string = localStorage.getItem("Branch");
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  menuItemflag = true;
  linkArray = [];
  /*Above all are used for the Job table*/
  breadScrums = [
    {
      title: "Job Entry",
      items: ["Home"],
      active: "Job Entry",
    },
  ];
  jsonJobFormControls: FormControls[];
  jsonFormTableControls: FormControls[];
  allformControl: any;
  containerTypeList: any;
  docketData: any;
  containerType: any;
  containerTypeStatus: boolean;
  containerTypeBL: any;
  containerTypeBLStatus: boolean;
  isLoad: boolean;
  isBlLoad: boolean;
  vendors: any;
  previewResult: any;
  jsonFormBlControls: FormControls[];
  allBlControls: FormControls[];
  jsonAllJobControls: FormControls[];
  isImport: boolean = false;
  jobDetails: any;
  custList: any;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private jobEntryService: JobEntryService,
    private docketService: DocketService,
    private consigmentUtility: ConsigmentUtility,
    private thcService: ThcService,
    public xlsxutils: xlsxutilityService,
    private definition: JobSummaryModel,
    private matDialog: MatDialog,
    private route: Router
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data || "";
    if (navigationState) {
      this.jobDetails = navigationState;
      this.isUpdate = true;
    }
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownDetail();
    this.backPath = "/dashboard/Index?tab=6";
  }
  /*when any function call like onchanged,click,ngModel this called below function first*/
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
  /*End*/

  bindDropdown() {

    const jobPropertiesMapping = {
      billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
      jobLocation: { variable: 'jobLocation', status: 'jobLocationStatus' },
      transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
      // fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      vendorName: { variable: 'vendorNameCode', status: 'vendorNameStatus' },
      //    toCity: { variable: 'toCity', status: 'toCityStatus' }

    };
    const containorDetail = {
      cnoteNo: { variable: 'cnoteNo', status: 'cnoteNoStatus' },
      containerType: { variable: 'containerType', status: 'containerTypeStatus' }
    }
    const blDetails = {
      containerType: { variable: 'containerTypeBL', status: 'containerTypeBLStatus' }
    }
    processProperties.call(this, this.jsonJobFormControls, jobPropertiesMapping);
    processProperties.call(this, this.jsonFormTableControls, containorDetail);
    processProperties.call(this, this.jsonFormBlControls, blDetails);
  }

  initializeFormControl() {
    this.jobFormControls = new JobControl();
    // Get form controls for job Entry form section
    this.jsonJobFormControls = this.jobFormControls.getJobFormControls()
    this.jsonAllJobControls = this.jsonJobFormControls;
    this.jsonFormTableControls = this.jobFormControls.getContainorDetails();
    this.jsonFormBlControls = this.jobFormControls.getBlDetail();
    this.allBlControls = this.jsonFormBlControls;
    // Build the form group using formGroupBuilder function
    this.jobEntryTableForm = formGroupBuilder(this.fb, [this.jsonJobFormControls]);
    this.containorTableForm = formGroupBuilder(this.fb, [this.jsonFormTableControls]);
    this.blTableForm = formGroupBuilder(this.fb, [this.jsonFormBlControls]);
    this.jobEntryTableForm.controls['transportedBy'].setValue('O');
    this.jobEntryTableForm.controls['jobType'].setValue('E');
    this.onJobChanged();
    this.jobEntryTableForm.controls['transportMode'].setValue('Road');

  }

  async autoFillJobDetails() {

    this.jobTableLoad = true
    const resJob = await this.jobEntryService.getjobDetailsByJob(this.jobDetails.jobNo);
    let propertiesToSet = [
      "_id",
      "jobId",
      "weight",
      "mobileNo",
      "DestCountry",
      "fromCity",
      "toCity",
      "jobType",
      "noOfPkg",
      "transportedBy",
      "nOOFCONT",
      "transportMode",
      "poNumber",
      "exportType"];
    propertiesToSet.forEach((property) => {
      this.jobEntryTableForm.controls[property].setValue(
        resJob?.[property] || ""
      );

    });
    const vendorName = this.vendors.find((x) => x.name = resJob.vendorName);
    const custName = this.custList.find((x) => x.name == this.jobDetails.billingParty);
    this.jobEntryTableForm.controls['vendorName'].setValue(vendorName);
    this.jobEntryTableForm.controls['billingParty'].setValue(custName);
    this.TblChallan = resJob.blChallan.map((element, index) => {
      const formattedInvDate = element.invDate?formatDate(element.invDate, 'dd-MM-yy HH:mm'):"";
      const formattedSbDt = element.sbDt?formatDate(element.sbDt, 'dd-MM-yy HH:mm'):"";
      const formattedblDate = element.blDate?formatDate(element.blDate, 'dd-MM-yy HH:mm'):"";
      const formattedbeDT = element.beDT?formatDate(element.beDT, 'dd-MM-yy HH:mm'):"";
      element.id = index + 1,
        element.oinvDate = element.invDate,
        element.osb = element.sbDt,
        element.oblDate = element.blDate,
        element.sbDt = formattedSbDt,
        element.blNum=element?.blNum||"",
        element.blDate=formattedblDate,
        element.beDT=formattedbeDT,
        element.invDate = formattedInvDate,
        element.invoice = true,
        element.actions = ["Edit", "Remove"]
      return element
    });

    this.isBlLoad = false;
    this.jobTableLoad = false;

  }
  async getDropDownDetail() {

    // Fetch city details, customer list, and vendor details concurrently
    const [resCust, vendorList] = await Promise.all([
      customerFromApi(this.masterService),
      getVendorDetails(this.masterService)
    ]);

    // Define a helper function to filter the docket control array
    const filterDocketControlArray = (formControls, details, statusProperty, filterProperty, TableForm) => {
      this.filter.Filter(
        formControls,
        TableForm,
        details,
        filterProperty,
        statusProperty
      );
    };

    // Use the helper function to filter based on different details
    filterDocketControlArray(this.jsonJobFormControls, resCust, this.billingPartyStatus, this.billingParty, this.jobEntryTableForm);
    //filterDocketControlArray(cityDetail, this.fromCityStatus, this.fromCity);
    // const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode })
    // const city = {
    //   name: destinationMapping[0].city,
    //   value: destinationMapping[0].city
    // }
    // this.jobEntryTableForm.controls['fromCity'].setValue(city);
    //filterDocketControlArray(cityDetail, this.toCityStatus, this.toCity);
    this.vendors = vendorList;
    this.custList = resCust;
    filterDocketControlArray(this.jsonJobFormControls, vendorList, this.vendorNameStatus, this.vendorNameCode, this.jobEntryTableForm);

    this.getShipmentDetail();
    if (this.isUpdate) { this.autoFillJobDetails() }
  }
  /*get form city from pincode Master*/
  /*pincode based city*/
  // async getPincodeDetail(event) {

  //   const cityMapping = event.field.name == 'fromCity' ? this.fromCityStatus : this.toCityStatus;
  //   this.pinCodeService.getCity(this.jobEntryTableForm, this.jsonJobFormControls, event.field.name, cityMapping);
  // }
  /*end*/
  async getShipmentDetail() {

    const shipmentList = await this.thcService.getShipment();
    const tableData = await this.jobEntryService.processShipmentListJob(shipmentList, this.orgBranch);
    this.docketData = tableData.filter((x) => x.jobNo == "");
    this.getDockeContainorDetail();
    this.tranPortChanged();
  }

  tranPortChanged() {

    const transportedBy = this.jobEntryTableForm.value.transportedBy;
    const transportMode = this.jobEntryTableForm.value.transportMode;
    const jobType = this.jobEntryTableForm.controls['jobType'].value;
    if (!this.isUpdate) {
      this.jobEntryTableForm.controls['vendorName'].setValue("");
    }
    switch (transportedBy) {
      case "T":
        if (jobType == "I") {
          this.isImport = false
          const controls = [
            "invNum",
            "invDate",
            "sbDt",
            "sbNum"
          ]
          this.jsonFormBlControls = this.allBlControls.filter(x => !controls.includes(x.name));
        }
        const vendorAtteched = this.vendors.filter((x) => x.type == "Attached");
        this.filter.Filter(
          this.jsonJobFormControls,
          this.jobEntryTableForm,
          vendorAtteched,
          this.vendorNameCode,
          this.vendorNameStatus
        );
        this.columnChallan = this.definition.columnExport;
        this.jobEntryTableForm.controls['vendorName'].setValue("");
        this.jobEntryTableForm.controls['vendorName'].disable();
        this.jobEntryTableForm.controls['transportMode'].disable();
        const remove = ['exportType'];
        this.jsonJobFormControls = this.jsonAllJobControls.filter((x) => !remove.includes(x.name));
        break;
      case "O":
        this.jobEntryTableForm.controls['vendorName'].enable();
        this.jobEntryTableForm.controls['transportMode'].enable();
        if (transportMode == "Road") {
          this.columnJobDetail = this.definition.columnCnoteDetail;
          // Define the filter criteria as an object
          const filterCriteria = {
            excludeNames: ["contNo", "containerType", "Company_file", "Download_Icon"]
          };
          this.jsonFormTableControls = this.jsonFormTableControls = this.jobFormControls.getContainorDetails()
            .filter(control => !filterCriteria.excludeNames.includes(control.name));
          ;
          if (jobType == "E") {
            this.isImport = false;
          }
          else {
            this.isImport = true;
          }
          const transformedData = this.docketData.map(({ docketNumber, docketDate, loadedWeight, noOfpkg, fromCity, toCity }) => ({
            name: docketNumber,
            value: docketNumber,
            cnoteDate: docketDate,
            loadedWeight,
            noOfpkg,
            fromCity,
            toCity
          }));

          this.filter.Filter(
            this.jsonFormTableControls,
            this.containorTableForm,
            transformedData,
            this.cnoteNo,
            this.cnoteNoStatus
          );
          this.jsonJobFormControls = this.jsonAllJobControls
        }
        if (transportMode == "Rail") {
          this.columnJobDetail = this.definition.columnContainorDetail;
          const filterCriteria = {
            excludeNames: ["cnoteNo", "cnoteDate"]
          };
          this.jsonFormTableControls = this.jsonFormTableControls = this.jobFormControls.getContainorDetails()
            .filter(control => !filterCriteria.excludeNames.includes(control.name));
          ;
          this.filter.Filter(
            this.jsonFormTableControls,
            this.containorTableForm,
            this.containerTypeList,
            this.containerType,
            this.containerTypeStatus
          );

        }
        //this.jobEntryTableForm.controls['vendorName'].setValue("");
        const vendorsOwn = this.vendors.filter((x) => x.type == "Own");
        this.filter.Filter(
          this.jsonJobFormControls,
          this.jobEntryTableForm,
          vendorsOwn,
          this.vendorNameCode,
          this.vendorNameStatus
        );
        break;
      default:
        this.jobEntryTableForm.controls['vendorName'].enable();
        this.jobEntryTableForm.controls['transportMode'].enable();
      // Handle other cases if needed
    }
  }
  /*End*/
  async getDockeContainorDetail() {
    const resContainerType = await this.consigmentUtility.containorConsigmentDetail();
    this.containerTypeList = resContainerType;
    this.filter.Filter(
      this.jsonFormBlControls,
      this.blTableForm,
      this.containerTypeList,
      this.containerTypeBL,
      this.containerTypeBLStatus
    );
    //const docketDetail=this.dock
  }
  /*below the function called when user select docket no*/
  fillDocketDetail(event) {
    const docketDetail = event.eventArgs.option.value;
    this.containorTableForm.controls['cnoteDate'].setValue(docketDetail?.cnoteDate || "");
    this.containorTableForm.controls['noOfpkg'].setValue(docketDetail?.noOfpkg || "");
    this.containorTableForm.controls['loadedWeight'].setValue(docketDetail?.loadedWeight || "")
    this.containorTableForm.controls['toCity'].setValue({ name: docketDetail?.toCity || "", value: docketDetail?.toCity || "" })
  }
  /*below function is called when the add new data was clicked*/
  async addDetail(type: string) {
    const formData = this.columnJobDetail;
    const columnHeader = this.columnChallan;
    // Define a mapping of types to handler functions
    const handlers: { [key: string]: () => void } = {
      cnote: () => formData.hasOwnProperty('cnoteNo') ? this.addCnoteDetail() : this.addContainer(),
      bl: () => columnHeader.hasOwnProperty('invNum') ? this.addInvoiceDetail() : this.addChalanDetails(),
      // ... you can add more handlers for different types here
    };

    // Execute the handler for the given type, if it exists
    const handler = handlers[type];
    if (handler) {
      handler.call(this); // Use call to ensure 'this' refers to the component instance
    }
  }

  async addContainer() {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData ? this.tableData : [];
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.contNo === this.containorTableForm.value.contNo
      );
      if (exist) {
        this.containorTableForm.controls["contNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering contNo.",
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
      id: tableData.length + 1,
      contNo: this.containorTableForm.value.contNo,
      contType: this.containorTableForm.value.containerType.value,
      noOfpkg: this.containorTableForm.value.noOfpkg,
      loadedWeight: this.containorTableForm.value.loadedWeight,
      cnote: false,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    Object.keys(this.containorTableForm.controls).forEach((key) => {
      this.containorTableForm.get(key).clearValidators();
      this.containorTableForm.get(key).updateValueAndValidity();
    });

    this.containorTableForm.controls["contNo"].setValue("");
    this.containorTableForm.controls["containerType"].setValue("");
    this.containorTableForm.controls["noOfpkg"].setValue("");
    this.containorTableForm.controls["loadedWeight"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.containorTableForm.controls).forEach((key) => {
      this.containorTableForm.get(key).setValidators(Validators.required);
    });
    this.containorTableForm.updateValueAndValidity();
  }
  /*End*/
  async addCnoteDetail() {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData ? this.tableData : [];
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.cnoteNo === this.containorTableForm.value.cnoteNo.value
      );
      if (exist) {
        this.containorTableForm.controls["cnoteNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering cnoteNo.",
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
      id: tableData.length + 1,
      cnoteNo: this.containorTableForm.value.cnoteNo.value,
      cnoteDate: formatDocketDate(this.containorTableForm.value?.cnoteDate || new Date()),
      dktDt: this.containorTableForm.value?.cnoteDate || new Date(),
      noOfpkg: this.containorTableForm.value.noOfpkg,
      loadedWeight: this.containorTableForm.value.loadedWeight,
      cnote: true,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    Object.keys(this.containorTableForm.controls).forEach((key) => {
      this.containorTableForm.get(key).clearValidators();
      this.containorTableForm.get(key).updateValueAndValidity();
    });

    this.containorTableForm.controls["cnoteNo"].setValue("");
    this.containorTableForm.controls["cnoteDate"].setValue("");
    this.containorTableForm.controls["noOfpkg"].setValue("");
    this.containorTableForm.controls["loadedWeight"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.containorTableForm.controls).forEach((key) => {
      this.containorTableForm.get(key).setValidators(Validators.required);
    });
    this.containorTableForm.updateValueAndValidity();
  }

  handleMenuItemClick(data) {

    if (data.data.cnote) {
      this.fillDocket(data);
    }
    else if (data.data.invNum) {
      this.fillInvoice(data);
    }
    else if (data.data.contNo) {
      this.fillContainer(data);
    }
    else if (data.data.blNum) {
      this.fillBlChallan(data);
    }
  }

  fillDocket(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const excludedKeys = [
        "Company_file",
        "Download_Icon",
        "contNo",
        "containerType",
        "isUpdate",
        "entryBy",
        "entryDate",
        "status"
      ];
      const atLeastOneValuePresent = Object.keys(this.containorTableForm.controls)
        .filter(key => !excludedKeys.includes(key)) // Filter out excluded keys
        .some(key => {
          const control = this.containorTableForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillDktDetails(data)
          }
        });
      }
      else {
        this.fillDktDetails(data)
      }

    }
  }

  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {

      const excludedKeys = [
        "Company_file",
        "Download_Icon",
        "cnoteNo",
        "cnoteDate",
        "noOfpkg",
        "loadedWeight",
        "isUpdate",
        "entryBy",
        "entryDate",
        "status"
      ];
      const atLeastOneValuePresent = Object.keys(this.containorTableForm.controls)
        .filter(key => !excludedKeys.includes(key)) // Filter out excluded keys
        .some(key => {
          const control = this.containorTableForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });
      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.autoFillContainer(data);
          }
        });
      }
      else {
        this.autoFillContainer(data);
      }
    }
  }

  fillInvoice(data: any) {

    if (data.label.label === "Remove") {
      this.TblChallan = this.TblChallan.filter((x) => x.id !== data.data.id);
    } else {
      const excludedKeys = [
        "blNum",
        "blDate",
        "beNum",
        "beDT",
        "invNum",
        "invDate",
      ]
      const atLeastOneValuePresent = Object.keys(this.blTableForm.controls)
        .filter(key => !excludedKeys.includes(key)) // Filter out excluded keys
        .some(key => {
          const control = this.blTableForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillInvoiceDetails(data)
          }
        });
      }
      else {
        this.fillInvoiceDetails(data)
      }
    }
  }
  /*Below the code Which fill */
  async save() {
    
    this.jobEntryTableForm.controls['vendorName'].enable();
    this.jobEntryTableForm.controls['transportMode'].enable();
    let fieldsToFromRemove = [];
    const tabcontrols = this.jobEntryTableForm;
    let containorDetail = []
    let challlanDetails = []
    let docket = []
    if (this.tableData.length > 0) {
      if (this.tableData.hasOwnProperty('cnoteNo')) {
        if (Array.isArray(this.tableData)) {
          this.tableData.forEach((item) => {
            if (item.hasOwnProperty('cnoteNo') && item.cnoteDate) {
              item.cnoteDate = item.dktDt;
            }
          });
          fieldsToFromRemove = ["id", "actions", "cnote", "dktDt"]
        }
        docket = this.tableData.map((x) => x.docketNumber);
      }
      else {
        fieldsToFromRemove = ["id", "actions", "cnote"]
      }

    }
    else if (this.containorTableForm.value.cnoteNo) {
      const docketDetail = {
        cnoteNo: this.containorTableForm.value.cnoteNo.value,
        cnoteDate: this.containorTableForm.value?.cnoteDate || new Date(),
        noOfpkg: this.containorTableForm.value.noOfpkg,
        loadedWeight: this.containorTableForm.value.loadedWeight,
      }
      this.tableData.push(docketDetail);
      docket = this.tableData.map((x) => x.docketNumber);
    }
    else if (this.containorTableForm.value.contNo) {
      const containerDetail = {
        contNo: this.containorTableForm.value.contNo,
        contType: this.containorTableForm.value?.containerType.value,
        noOfpkg: this.containorTableForm.value.noOfpkg,
        loadedWeight: this.containorTableForm.value.loadedWeight,
      }
      this.tableData.push(containerDetail);
    }
    containorDetail = this.tableData;
      const containerType = this.blTableForm.controls['containerType'].value?.value||"";
      this.blTableForm.controls['containerType'].setValue(containerType);
    if(this.TblChallan.length > 0){
      this.TblChallan = this.TblChallan.map(element => {
        // Check if the properties are not undefined or null before assigning
        element.invDate = element.oinvDate !== undefined && element.oinvDate !== null ? element.oinvDate : "";
        element.blDate = element.oblDate !== undefined && element.oblDate !== null ? element.oblDate : "";
        element.sbDt = element.sbDt !== undefined && element.sbDt !== null ? element.osbDt : "";
        element.beDT = element.obeDT !== undefined && element.obeDT !== null ? element.obeDT : "";
        return element;
      });
      
    }
    challlanDetails = this.TblChallan.length > 0 ? this.TblChallan : [this.blTableForm.value]
    clearValidatorsAndValidate(tabcontrols);
    // Create a new array without the 'srNo' property
    let modifiedTableData = this.tableData.map(({ srNo, ...rest }) => rest);
    // Assign the modified array back to 'this.tableData'
    this.tableData = modifiedTableData;
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const location = localStorage.getItem("Branch"); // Replace with your dynamic value
    //  const dynamicNumber = Math.floor(jobIndex * 10000); // Generate a random number between 0 and 9999
    //  let jeNo = `JE/${dynamicValue}/${financialYear}/${paddedNumber}`;
    this.jobEntryTableForm.controls['billingParty'].setValue(this.jobEntryTableForm.controls['billingParty'].value.name);
    this.jobEntryTableForm.controls['vendorName'].setValue(this.jobEntryTableForm.controls['vendorName'].value.name);
    //this.jobEntryTableForm.controls['fromCity'].setValue(this.jobEntryTableForm.controls['fromCity'].value.value);
    //this.jobEntryTableForm.controls['toCity'].setValue(this.jobEntryTableForm.controls['toCity'].value.value);
    const containorList = removeFields(containorDetail, fieldsToFromRemove);
    const removeField = ['actions', 'osb', 'oinvDate', 'oblDate', 'osbDt', 'invoice', 'id'];
    const modifiedTblChallan = removeFields(challlanDetails, removeField);
    /*below code is for  Data pass  in array Because for the store array in db*/
    const containerDetails = { containorDetails: containorList };
    const chalanDetails = { blChallan: modifiedTblChallan };

    let jobDetail = {
      ...this.jobEntryTableForm.value,
      ...containerDetails,
      ...chalanDetails
    };
    if (this.isUpdate) {
      const jobEntryNo = this.jobDetails.jobNo;
      const res = await this.jobEntryService.updateJobDetails(jobDetail,jobEntryNo);
      if (res) {
        if (docket.length <= 0) {
          this.showSuccessMessage(jobEntryNo,"Job Updated Successfully");
        } else {
          await Promise.all(docket.map((element) => this.updateDocket(element, jobEntryNo)));
          this.showSuccessMessage(jobEntryNo,"Job Updated Successfully");
        }
        this.goBack('Job');
      }
    }
    else {
      const res = await addJobDetail(jobDetail, this.masterService, financialYear);
      if (res) {
        const jobEntryNo = res.toUpperCase();

        if (docket.length <= 0) {
          this.showSuccessMessage(jobEntryNo,"Job Add Successfully");
        } else {
          await Promise.all(docket.map((element) => this.updateDocket(element, jobEntryNo)));
          this.showSuccessMessage(jobEntryNo,"Job Add Successfully");
        }

        this.goBack('Job');
      }
    }
  }

  async updateDocket(element: any, jobEntryNo: string) {
    await this.docketService.updateDocket(element, { "jobNo": jobEntryNo });
  }

  showSuccessMessage(jobEntryNo: string,message) {
    Swal.fire({
      icon: "success",
      title: message,
      text: "Job Entry No: " + jobEntryNo,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.goBack('Job');
      }
    });
  }
  cancel() {
    this.goBack('Job')
  }

  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }

  getDocketBasedOnCity() {

    if (this.jobEntryTableForm.value.transportedBy == "T" && this.jobEntryTableForm.value.transportMode == "Road") {
      const toCity = this.jobEntryTableForm.value.toCity;
      const billingPartyName = this.jobEntryTableForm.value.billingParty.name.toLowerCase();

      const filteredDocketData = this.docketData.filter((docket) => {
        // Check if billingParty has a value and toCity matches
        if (toCity) {
          const toCityMatch = docket.toCity.trim().toLowerCase() === toCity.toLowerCase();
          const billingPartyMatch = docket.billingParty.toLowerCase() === billingPartyName;
          return toCityMatch && billingPartyMatch;
        } else {
          // If billingParty is empty, only check for a matching toCity
          return docket.billingParty.toLowerCase() === billingPartyName;
        }
      });

      if (filteredDocketData.length > 0) {
        const transformedData = filteredDocketData.map(({ docketNumber, docketDate, loadedWeight, noOfpkg, fromCity, toCity }) => ({
          name: docketNumber,
          value: docketNumber,
          cnoteDate: docketDate,
          loadedWeight,
          noOfpkg,
          fromCity,
          toCity
        }));

        this.filter.Filter(
          this.allformControl,
          this.jobEntryTableForm,
          transformedData,
          this.cnoteNo,
          this.cnoteNoStatus
        );
      }
      else {
        // Display an informational message using Swal.fire
        Swal.fire({
          icon: "info",            // Use the "info" icon for informational messages
          title: "Information",     // Set the title of the message
          text: "No docket is available on this route", // Provide the informative text
          showConfirmButton: true   // Show a confirmation button to acknowledge the message
        });
        this.filter.Filter(
          this.allformControl,
          this.jobEntryTableForm,
          [],
          this.cnoteNo,
          this.cnoteNoStatus
        );
      }
    }
  }

  public selectedFile(event) {

    let fileList: FileList = event.eventArgs;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxutils.readFile(file).then((jsonData) => {
        const validationRules = [
          {
            ItemsName: "containerNumber",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "containerType",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.containerTypeList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
        ];
        this.xlsxutils
          .validateDataWithApiCall(jsonData, validationRules)
          .subscribe(
            (response) => {
              this.OpenPreview(response);
              this.containorTableForm.controls["Company_file"].setValue("");
            },
            (error) => {
              console.error("Validation error:", error);
              // Handle errors here
            }
          );
      });
      // this.consignmentTableForm.controls["Company_file"].setValue(
      //   file.name
      // );
    }
  }

  OpenPreview(results) {
    const dialogRef = this.matDialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result != undefined) {
        this.previewResult = result;
        this.containorCsvDetail();
      }
    });
  }

  containorCsvDetail() {
    if (this.previewResult.length > 0) {
      this.tableLoad = true;
      this.isLoad = true;
      let containerNo = [];
      const containerDetail = this.previewResult.map((x, index) => {
        if (x) {
          const detail = containerNo.includes(x.containerNumber);
          const match = this.containerTypeList.find(
            (y) => y.name === x.containerType
          );
          if (match) {
            x.containerCapacity = match?.loadCapacity || "";
          }
          if (detail) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Container Id '${x.containerNumber}' is Already exist`,
            });
            return null; // Returning null to indicate that this element should be removed
          }
          // Modify 'x' if needed
          // For example, you can add the index to the element
          containerNo.push(x.containerNumber);
          x.id = index + 1;
          x.contNo = x.containerNumber;
          x.contType = x.containerType;
          x.noOfpkg = x.NoofPkts;
          x.loadedWeight = x.Weight;
          x.actions = ["Edit", "Remove"];
          return x;
        }
        return x; // Return the original element if no modification is needed
      });
      // Filter out the null values if necessary
      const filteredContainerDetail = containerDetail.filter((x) => x !== null);
      this.tableData = filteredContainerDetail;
      this.columnJobDetail = this.definition.columnContainorDetail;
      this.tableLoad = false;
      this.isLoad = false;
    }
  }

  /*here is block for BL Details Adding*/
  async addInvoiceDetail() {

    this.isBlLoad = true;
    const { invNum, invDate, sbNum, sbDt, pod, cod, containerNum, containerType } = this.blTableForm.value;
    const tableData = this.TblChallan || [];
    if (tableData.some(x => x.invNum === invNum)) {
      this.jobEntryService.alertDuplicateContNo();
      this.jobEntryService.setLoadingState(false, this);
      this.isBlLoad = false
      return false;
    }

    await this.jobEntryService.delay(1000);

    this.TblChallan.push({
      oinvDate: invDate,
      osb: sbDt,
      id: tableData.length + 1,
      invNum,
      invDate: formatDate(invDate, 'dd-MM-yy HH:mm'),
      sbNum,
      sbDt: formatDate(sbDt, 'dd-MM-yy HH:mm'),
      pod,
      cod,
      containerNum,
      containerType: containerType.name,
      invoice: true,
      actions: ["Edit", "Remove"]
    });
    const controls = ['invNum', 'invDate', 'sbNum', 'sbDt', 'pod', 'cod', 'containerNum', 'containerType'];
    controls.forEach((x) => {
      this.blTableForm.controls[x].setValue('');
    })
    const challlan = this.TblChallan
    // this.jobEntryService.resetFormValidators(this.blTableForm);
    this.blTableForm.reset();
    this.isBlLoad = false
    this.jobTableLoad = false;
  }

  async addChalanDetails() {
    this.isBlLoad = true;
    const { blNum, blDate, beNum, beDT, pod, cod } = this.blTableForm.value;
    const tableData = this.TblChallan || [];
    if (tableData.some(x => x.blNum === blNum)) {
      this.jobEntryService.alertDuplicateContNo();
      this.jobEntryService.setLoadingState(false, this);
      this.isBlLoad = false
      return false;
    }
    await this.jobEntryService.delay(1000);
    this.TblChallan.push({
      oblDate: blDate,
      obeDate: beDT,
      id: tableData.length + 1,
      blNum,
      blDate: formatDate(blDate, 'dd-MM-yy HH:mm'),
      beNum,
      beDT: formatDate(beDT, 'dd-MM-yy HH:mm'),
      pod,
      cod,
      invoice: true,
      actions: ["Edit", "Remove"]
    });
    const controls = ['invNum', 'invDate', 'sbNum', 'sbDt', 'pod', 'cod', 'containerNum', 'containerType'];
    controls.forEach((x) => {
      this.blTableForm.controls[x].setValue('');
    })
    // this.jobEntryService.resetFormValidators(this.blTableForm);
    this.blTableForm.reset();
    this.isBlLoad = false
    this.jobTableLoad = false;
  }
  /* End */
  /*on JOB details Changed*/
  onJobChanged() {

    this.TblChallan = [];
    const jobType = this.jobEntryTableForm.controls['jobType'].value;
    const transportedBy = this.jobEntryTableForm.controls['transportedBy'].value;
    if (jobType == 'I') {
      const controls = [
        "invNum",
        "invDate",
        "sbDt",
        "sbNum",
        "containerType",
        "containerNum"
      ]
      this.jsonFormBlControls = this.allBlControls.filter(x => !controls.includes(x.name));
      const dropdownValue = this.jobEntryService.getExportType("import");
      this.isImport = true;
      this.jsonJobFormControls = this.jsonJobFormControls.map((x) => {
        if (x.name === "exportType") {
          return { ...x, value: dropdownValue };
        } else {
          return x;
        }
      });
      this.columnChallan = this.definition.columnImport;

    }
    else {

      const controls = [
        "blNum",
        "blDate",
        "beNum",
        "beDT"
      ]
      this.isImport = false;
      this.jsonFormBlControls = this.allBlControls.filter(x => !controls.includes(x.name));
      const dropdownValue = this.jobEntryService.getExportType("export");
      this.jsonJobFormControls = this.jsonJobFormControls.map((x) => {
        if (x.name === "exportType") {
          return { ...x, value: dropdownValue };
        } else {
          return x;
        }
      });
      this.columnChallan = this.definition.columnExport;
    }
  }
  /*End*/
  /*AutoFill Challan*/
  fillBlChallan(data: any) {

    if (data.label.label === "Remove") {
      this.TblChallan = this.TblChallan.filter((x) => x.id !== data.data.id);
    } else {
      const excludedKeys =
        [
          "invNum",
          "invDate",
          "sbNum",
          "sbDt",
        ]
      const atLeastOneValuePresent = Object.keys(this.blTableForm.controls)
        .filter(key => !excludedKeys.includes(key)) // Filter out excluded keys
        .some(key => {
          const control = this.blTableForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillBillDetails(data)
          }
        });
      }
      else {
        this.fillBillDetails(data)
      }
    }
  }
  /*End*/
  /*AutoFill the value*/
  autoFillContainer(data) {
    this.containorTableForm.controls["contNo"].setValue(
      data.data?.contNo || ""
    );
    this.containorTableForm.controls["containerType"].setValue(
      { name: data.data?.contType, value: data.data?.contType }
    );
    this.containorTableForm.controls["noOfpkg"].setValue(
      data.data?.noOfpkg || ""
    );
    this.containorTableForm.controls["loadedWeight"].setValue(
      data.data?.loadedWeight || ""
    );
    this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
  }
  /**/
  fillDktDetails(data) {
    this.containorTableForm.controls["cnoteNo"].setValue(
      { name: data.data?.cnoteNo, value: data.data?.cnoteNo } || ""
    );
    this.containorTableForm.controls["cnoteDate"].setValue(
      data.data?.dktDt || new Date()
    );
    this.containorTableForm.controls["noOfpkg"].setValue(
      data.data?.noOfpkg || ""
    );
    this.containorTableForm.controls["loadedWeight"].setValue(
      data.data?.loadedWeight || ""
    );
    this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
  }

  fillInvoiceDetails(data) {
    this.blTableForm.controls["invNum"].setValue(
      data.data?.invNum || ""
    );
    this.blTableForm.controls["invDate"].setValue(
      data.data?.oinvDate
    );
    this.blTableForm.controls["sbNum"].setValue(
      data.data?.sbNum || ""
    );
    this.blTableForm.controls["sbDt"].setValue(
      data.data?.osb || ""
    );
    this.blTableForm.controls["pod"].setValue(
      data.data?.pod || ""
    );
    this.blTableForm.controls["cod"].setValue(
      data.data?.cod || ""
    );
    this.blTableForm.controls["containerNum"].setValue(
      data.data?.containerNum || ""
    );
    this.blTableForm.controls["containerType"].setValue(
      { name: data.data?.containerType || "", value: data.data?.containerType }
    );
    this.TblChallan = this.TblChallan.filter((x) => x.id !== data.data.id);
  }
  fillBillDetails(data) {
    this.blTableForm.controls["blNum"].setValue(
      data.data?.blNum || ""
    );
    this.blTableForm.controls["blDate"].setValue(
      data.data?.oblDate
    );
    this.blTableForm.controls["beNum"].setValue(
      data.data?.beNum || ""
    );
    this.blTableForm.controls["beDT"].setValue(
      data.data?.obeDate || ""
    );
    this.blTableForm.controls["pod"].setValue(
      data.data?.pod || ""
    );
    this.blTableForm.controls["cod"].setValue(
      data.data?.cod || ""
    );
    this.blTableForm.controls["containerNum"].setValue(
      data.data?.containerNum || ""
    );
    this.blTableForm.controls["containerType"].setValue(
      { name: data.data?.containerType || "", value: data.data?.containerType }
    );
    this.TblChallan = this.TblChallan.filter((x) => x.id !== data.data.id);
  }
}
