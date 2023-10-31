import { Component, HostListener, OnInit } from "@angular/core";
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
import { getCity } from "../quick-booking/quick-utility";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { getShipment } from "../thc-generation/thc-utlity";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { JobEntryService } from "src/app/Utility/module/operation/job-entry/job-entry-service";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { debug } from "console";
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
  billingPartyStatus: any;
  fleetSize: any;
  fleetSizeStatus: any;
  jobLocation: any;
  jobLocationStatus: any;
  transportMode: any;
  transportModeStatus: any;
  fromCity: any;
  tableData: any = [];
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  jobFormControls: JobControl;
  isUpdate: boolean;
  jsonControlArray: any;
  jobEntryTableForm: UntypedFormGroup;
  cityData: any;
  vendorNameCode: string;
  vendorNameStatus: boolean;
  cnoteNo: string;
  cnoteNoStatus: boolean;
  backPath: string;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  /*Here i declare the json array which is used to displayed on job detail*/
  /*Invoice Detail*/
  columnJobDetail: any;
  columnContainorDetail = {
    contNo: {
      Title: "Container No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    contType: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    noOfpkg: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    loadedWeight: {
      Title: "Loaded Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  columnCnoteDetail = {
    cnoteNo: {
      Title: "Cnote No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    cnoteDate: {
      Title: "Cnote Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    noOfpkg: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    loadedWeight: {
      Title: "Loaded Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  orgBranch: string = localStorage.getItem("Branch");
  staticField = ["contNo", "contType", "cnoteNo", "cnoteDate", "noOfpkg", "loadedWeight"];
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
  isLoad: boolean;
  vendors: any;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private operationService: OperationService,
    private filter: FilterUtils,
    private locationService: LocationService,
    private pinCodeService: PinCodeService,
    private jobEntryService: JobEntryService,
    private docketService: DocketService,
    private consigmentUtility: ConsigmentUtility
  ) {

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
      fleetSize: { variable: 'fleetSize', status: 'fleetSizeStatus' },
      jobLocation: { variable: 'jobLocation', status: 'jobLocationStatus' },
      transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
      fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      vendorName: { variable: 'vendorNameCode', status: 'vendorNameStatus' },
      toCity: { variable: 'toCity', status: 'toCityStatus' },
      cnoteNo: { variable: 'cnoteNo', status: 'cnoteNoStatus' },
      containerType: { variable: 'containerType', status: 'containerTypeStatus' }
    };
    processProperties.call(this, this.allformControl, jobPropertiesMapping);
  }

  initializeFormControl() {
    this.jobFormControls = new JobControl();
    // Get form controls for job Entry form section
    this.jsonJobFormControls = this.jobFormControls.getJobFormControls().filter(
      (x) => x.additionalData && x.additionalData.metaData === "jobControls"
    );

    this.jsonFormTableControls = this.jobFormControls.getJobFormControls().filter(
      (x) => x.additionalData && x.additionalData.metaData === "jobTableControls"
    );
    this.allformControl = [
      ...this.jsonJobFormControls,
      ...this.jsonFormTableControls,
    ];
    // Build the form group using formGroupBuilder function
    this.jobEntryTableForm = formGroupBuilder(this.fb, [this.allformControl]);
    this.jobEntryTableForm.controls['transportedBy'].setValue('E');
    this.jobEntryTableForm.controls['transportMode'].setValue('Road')

  }

  async getDropDownDetail() {

    // Fetch city details, customer list, and vendor details concurrently
    const [resCust, vendorList] = await Promise.all([
      customerFromApi(this.masterService),
      getVendorDetails(this.masterService)
    ]);

    // Define a helper function to filter the docket control array
    const filterDocketControlArray = (details, statusProperty, filterProperty) => {
      this.filter.Filter(
        this.allformControl,
        this.jobEntryTableForm,
        details,
        filterProperty,
        statusProperty
      );
    };

    // Use the helper function to filter based on different details
    filterDocketControlArray(resCust, this.billingPartyStatus, this.billingParty);
    //filterDocketControlArray(cityDetail, this.fromCityStatus, this.fromCity);
    const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode })
    const city = {
      name: destinationMapping[0].city,
      value: destinationMapping[0].city
    }
    this.jobEntryTableForm.controls['fromCity'].setValue(city);
    //filterDocketControlArray(cityDetail, this.toCityStatus, this.toCity);
    this.vendors = vendorList;
    filterDocketControlArray(vendorList, this.vendorNameStatus, this.vendorNameCode);
    this.getShipmentDetail();
  }

  // Load temporary data
  loadTempData() {

  }
  // Add a new item to the table
  addItem() {
    // Insert the new object at the beginning of the tableData array
  }
  /*get form city from pincode Master*/
  /*pincode based city*/
  async getPincodeDetail(event) {
    const cityMapping = event.field.name == 'fromCity' ? this.fromCityStatus : this.toCityStatus;
    this.pinCodeService.getCity(this.jobEntryTableForm, this.allformControl, event.field.name, cityMapping);
  }
  /*end*/
  async getShipmentDetail() {
    
    const shipmentList = await getShipment(this.operationService);
    const tableData = await this.jobEntryService.processShipmentListJob(shipmentList, this.orgBranch);
    this.docketData = tableData.filter((x) => x.jobNo == "");
    this.getDockeContainorDetail();
    this.tranPortChanged();
  }


  /*below method is called when tranportMode changed*/
  tranPortChanged() {
    
    const transportedBy = this.jobEntryTableForm.value.transportedBy;
    const transportMode = this.jobEntryTableForm.value.transportMode;

    this.jobEntryTableForm.controls['vendorName'].setValue("");

    switch (transportedBy) {
      case "I":
        const vendorAtteched = this.vendors.filter((x) => x.type == "Attached");
        this.filter.Filter(
          this.allformControl,
          this.jobEntryTableForm,
          vendorAtteched,
          this.vendorNameCode,
          this.vendorNameStatus
        );

        if (transportMode == "Rail") {
          this.columnJobDetail = this.columnContainorDetail;
          this.jsonFormTableControls = this.jobFormControls.getJobFormControls().filter(
            (x) => x.additionalData && x.additionalData.metaData === "jobTableControls"
          ).filter((x) => x.name != "cnoteNo" && x.name != "cnoteDate");
          this.filter.Filter(
            this.allformControl,
            this.jobEntryTableForm,
            this.containerTypeList,
            this.containerType,
            this.containerTypeStatus
          );
        }
        break;

      case "E":
        if (transportMode == "Road") {
          this.columnJobDetail = this.columnCnoteDetail;
          this.jsonFormTableControls = this.jobFormControls.getJobFormControls().filter(
            (x) => x.additionalData && x.additionalData.metaData === "jobTableControls"
          ).filter((x) => x.name != "contNo" && x.name != "containerType");
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
            this.allformControl,
            this.jobEntryTableForm,
            transformedData,
            this.cnoteNo,
            this.cnoteNoStatus
          );
        }

        this.jobEntryTableForm.controls['vendorName'].setValue("");
        const vendorsOwn = this.vendors.filter((x) => x.type == "Own");
        this.filter.Filter(
          this.allformControl,
          this.jobEntryTableForm,
          vendorsOwn,
          this.vendorNameCode,
          this.vendorNameStatus
        );
        break;

      default:
      // Handle other cases if needed
    }
  }
  /*End*/

  async getDockeContainorDetail() {
    const resContainerType = await this.consigmentUtility.containorConsigmentDetail();
    this.containerTypeList = resContainerType;
    //const docketDetail=this.dock
  }
  /*below the function called when user select docket no*/
  fillDocketDetail(event) {
    const docketDetail = event.eventArgs.option.value;
    this.jobEntryTableForm.controls['cnoteDate'].setValue(docketDetail?.cnoteDate || "");
    this.jobEntryTableForm.controls['noOfpkg'].setValue(docketDetail?.noOfpkg || "");
    this.jobEntryTableForm.controls['loadedWeight'].setValue(docketDetail?.loadedWeight || "")
    this.jobEntryTableForm.controls['toCity'].setValue({ name: docketDetail?.toCity || "", value: docketDetail?.toCity || "" })
  }
  /*below function is called when the add new data was clicked*/
  async addDetail() {
    const formData = this.columnJobDetail;
    if (formData.hasOwnProperty("cnoteNo")) {
      this.addCnoteDetail();
    }
    else {
      this.addContainor();
    }
    /*this function is for the add multiple containor*/
  }
  async addContainor() {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData ? this.tableData : [];
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.contNo === this.jobEntryTableForm.value.contNo
      );
      if (exist) {
        this.jobEntryTableForm.controls["contNo"].setValue("");
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
      contNo: this.jobEntryTableForm.value.contNo,
      contType: this.jobEntryTableForm.value.containerType.value,
      noOfpkg: this.jobEntryTableForm.value.noOfpkg,
      loadedWeight: this.jobEntryTableForm.value.loadedWeight,
      cnote: false,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    Object.keys(this.jobEntryTableForm.controls).forEach((key) => {
      this.jobEntryTableForm.get(key).clearValidators();
      this.jobEntryTableForm.get(key).updateValueAndValidity();
    });

    this.jobEntryTableForm.controls["contNo"].setValue("");
    this.jobEntryTableForm.controls["containerType"].setValue("");
    this.jobEntryTableForm.controls["noOfpkg"].setValue("");
    this.jobEntryTableForm.controls["loadedWeight"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.jobEntryTableForm.controls).forEach((key) => {
      this.jobEntryTableForm.get(key).setValidators(Validators.required);
    });
    this.jobEntryTableForm.updateValueAndValidity();
  }

  /*End*/
  async addCnoteDetail() {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData ? this.tableData : [];
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.cnoteNo === this.jobEntryTableForm.value.cnoteNo.value
      );
      if (exist) {
        this.jobEntryTableForm.controls["cnoteNo"].setValue("");
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
      cnoteNo: this.jobEntryTableForm.value.cnoteNo.value,
      cnoteDate: formatDocketDate(this.jobEntryTableForm.value?.cnoteDate || new Date()),
      dktDt: this.jobEntryTableForm.value?.cnoteDate || new Date(),
      noOfpkg: this.jobEntryTableForm.value.noOfpkg,
      loadedWeight: this.jobEntryTableForm.value.loadedWeight,
      cnote: true,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    Object.keys(this.jobEntryTableForm.controls).forEach((key) => {
      this.jobEntryTableForm.get(key).clearValidators();
      this.jobEntryTableForm.get(key).updateValueAndValidity();
    });

    this.jobEntryTableForm.controls["cnoteNo"].setValue("");
    this.jobEntryTableForm.controls["cnoteDate"].setValue("");
    this.jobEntryTableForm.controls["noOfpkg"].setValue("");
    this.jobEntryTableForm.controls["loadedWeight"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.jobEntryTableForm.controls).forEach((key) => {
      this.jobEntryTableForm.get(key).setValidators(Validators.required);
    });
    this.jobEntryTableForm.updateValueAndValidity();
  }

  handleMenuItemClick(data) {
    if (data.data.cnote) {
      this.fillInvoice(data);
    } else {
      this.fillContainer(data);
    }
  }

  fillInvoice(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      this.jobEntryTableForm.controls["cnoteNo"].setValue(
        { name: data.data?.cnoteNo, value: data.data?.cnoteNo } || ""
      );
      this.jobEntryTableForm.controls["cnoteDate"].setValue(
        data.data?.dktDt || new Date()
      );
      this.jobEntryTableForm.controls["noOfpkg"].setValue(
        data.data?.noOfpkg || ""
      );
      this.jobEntryTableForm.controls["loadedWeight"].setValue(
        data.data?.loadedWeight || ""
      );

      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      this.jobEntryTableForm.controls["contNo"].setValue(
        data.data?.contNo || ""
      );
      this.jobEntryTableForm.controls["containerType"].setValue(
        { name: data.data?.contType, value: data.data?.contType }
      );
      this.jobEntryTableForm.controls["noOfpkg"].setValue(
        data.data?.noOfpkg || ""
      );
      this.jobEntryTableForm.controls["loadedWeight"].setValue(
        data.data?.loadedWeight || ""
      );

      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  async save() {

    let fieldsToFromRemove = [];
    const tabcontrols = this.jobEntryTableForm;
    let containorDetail = {}
    let docket = []
    if (this.tableData.length > 0) {
      this.jobEntryTableForm.removeControl('contNo');
      this.jobEntryTableForm.removeControl('containerType')
      this.jobEntryTableForm.removeControl('cnoteNo')
      this.jobEntryTableForm.removeControl('cnoteDate')
      this.jobEntryTableForm.removeControl('noOfpkg')
      this.jobEntryTableForm.removeControl('loadedWeight')

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
    else if (this.jobEntryTableForm.value.cnoteNo) {
      const docketDetail = {
        cnoteNo: this.jobEntryTableForm.value.cnoteNo.value,
        cnoteDate: this.jobEntryTableForm.value?.cnoteDate || new Date(),
        noOfpkg: this.jobEntryTableForm.value.noOfpkg,
        loadedWeight: this.jobEntryTableForm.value.loadedWeight,
      }
      this.tableData.push(docketDetail);
      docket = this.tableData.map((x) => x.docketNumber);
    }
    else if (this.jobEntryTableForm.value.contNo) {
      const containerDetail = {
        contNo: this.jobEntryTableForm.value.contNo,
        contType: this.jobEntryTableForm.value?.containerType.value,
        noOfpkg: this.jobEntryTableForm.value.noOfpkg,
        loadedWeight: this.jobEntryTableForm.value.loadedWeight,
      }
      this.tableData.push(containerDetail);
    }
    containorDetail = {
      containorDetail: this.tableData,
    };
    clearValidatorsAndValidate(tabcontrols);
    // Create a new array without the 'srNo' property
    let modifiedTableData = this.tableData.map(({ srNo, ...rest }) => rest);
    // Assign the modified array back to 'this.tableData'
    this.tableData = modifiedTableData;
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const location = localStorage.getItem("Branch"); // Replace with your dynamic value
    //  const dynamicNumber = Math.floor(jobIndex * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = getNextNumber();
    const blParty = this.jobEntryTableForm.controls['billingParty'].value?.name || "";
    const jobType = this.jobEntryTableForm.controls['jobType'].value == "I" ? "IM" : "EX";
    //  let jeNo = `JE/${dynamicValue}/${financialYear}/${paddedNumber}`;
    let jeNo = `${location.substring(0, 3)}${blParty.substring(0, 3)}${jobType}${financialYear}${paddedNumber}`;
    this.jobEntryTableForm.controls['_id'].setValue(jeNo.toUpperCase());
    this.jobEntryTableForm.controls['jobId'].setValue(jeNo.toUpperCase());
    this.jobEntryTableForm.controls['billingParty'].setValue(this.jobEntryTableForm.controls['billingParty'].value.name);
    this.jobEntryTableForm.controls['vendorName'].setValue(this.jobEntryTableForm.controls['vendorName'].value.name);
    this.jobEntryTableForm.controls['fromCity'].setValue(this.jobEntryTableForm.controls['fromCity'].value.value);
    this.jobEntryTableForm.controls['toCity'].setValue(this.jobEntryTableForm.controls['toCity'].value.value);
    const containorList = fieldsToFromRemove.length > 0 ? removeFieldsFromArray(containorDetail, fieldsToFromRemove) : [];
    let jobDetail = {
      ...this.jobEntryTableForm.value,
      ...containorList,
    };
 
    const res = await addJobDetail(jobDetail, this.masterService,financialYear);
    if (res) {
      if (docket.length <= 0) {
        Swal.fire({
          icon: "success",
          title: "Generated Successfuly",
          text: "Job Entry No: " + res.toUpperCase(),
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack('Job')
          }
        });

      }
      else {
        for (const element of docket) {
          await this.docketService.updateDocket(element, { "jobNo": res.toUpperCase() });
        }
        Swal.fire({
          icon: "success",
          title: "Generated Successfuly",
          text: "Job Entry No: " +  res.toUpperCase(),
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack('Job')
          }
        });
      }
    }
  }

  cancel() {
    this.goBack('Job')
  }
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }

  getDocketBasedOnCity() {
      
      if(this.jobEntryTableForm.value.transportedBy=="E"&& this.jobEntryTableForm.value.transportMode=="Road"){
        const toCity = this.jobEntryTableForm.value.toCity?this.jobEntryTableForm.value.toCity.value.trim():"";
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
}
