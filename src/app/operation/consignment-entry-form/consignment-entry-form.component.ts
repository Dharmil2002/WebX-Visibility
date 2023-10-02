import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { ConsignmentControl, FreightControl } from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import { containerFromApi, customerFromApi } from "../prq-entry-page/prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorDetails } from "../job-entry-page/job-entry-utility";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { pendingbilling } from "../pending-billing/pending-billing-utlity";
import { containorConsigmentDetail, updatePrq } from "./consigment-utlity";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { formatDate } from "src/app/Utility/date/date-utils";
import { trigger } from "@angular/animations";
import { parse } from "date-fns";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";


@Component({
  selector: "app-consignment-entry-form",
  templateUrl: "./consignment-entry-form.component.html",
})

export class ConsignmentEntryFormComponent implements OnInit {

  consignmentTableForm: UntypedFormGroup;
  containerTableForm: UntypedFormGroup;
  FreightTableForm: UntypedFormGroup;
  invoiceTableForm: UntypedFormGroup;
  tableData: any = [];
  invoiceData: any = [];
  tableLoadIn: boolean = true;
  tableData1: any;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  jsonControlArray: any;
  TableStyle = "width:82%;"
  // TableStyle1 = "width:82%"
  ConsignmentFormControls: ConsignmentControl;
  FreightFromControl: FreightControl;
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];
  fromCity: string;
  fromCityStatus: any;
  customer: string;
  customerStatus: any;
  toCity: string;
  toCityStatus: any;
  containerSize: string;
  containerSizeStatus: boolean;
  consignorName: string;
  consignorNameStatus: boolean;
  consigneeName: string;
  consigneeNameStatus: boolean;
  vendorName: string;
  vendorNameStatus: boolean;
  prqNo: string;
  prqNoStatus: boolean;
  containerType: string;
  containerTypeStatus: boolean;
  userName = localStorage.getItem("Username");
  //#region columnHeader
  columnHeader = {
    containerNumber: {
      Title: "Container Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    containerType: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    containerCapacity: {
      Title: "Container Capacity",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  /*Invoice Detail*/
  columnInvoice = {
    ewayBillNo: {
      Title: "Eway Bill No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    expiryDate: {
      Title: "Expiry Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    invoiceAmount: {
      Title: "Invoice Amount",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    noofPkts: {
      Title: "No of Pkts",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialName: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actualWeight: {
      Title: "Actual Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    chargedWeight: {
      Title: "Charged Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  }
  /*End*/
  staticFieldInvoice =
    [
      'ewayBillNo',
      'expiryDate',
      'invoiceNo',
      'invoiceAmount',
      'noofPkts',
      'materialName',
      'actualWeight',
      'chargedWeight'
    ]
  staticField =
    [
      'containerNumber',
      'containerType',
      'containerCapacity'
    ]
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  menuItemflag = true;
  //#endregion

  //#endregion
  jsonControlArrayBasic: any;
  jsonContainerDetail: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  prqFlag: boolean;
  prqData: any;
  billingParty: any;
  prqNoDetail: any[];
  isLoad: boolean = false;
  ContainerType: any;
  //#endregion
  branchCode = localStorage.getItem("Branch");
  addFlag = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  breadScrums = [
    {
      title: "Available Vehicle for Assignment",
      items: ["Home"],
      active: "Vehicle Assign",
    },
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  linkArray = [
  ];
  jsonInvoiceDetail: any;
  loadIn: boolean;

  constructor(
    private fb: UntypedFormBuilder,
    private _NavigationService: NavigationService,
    private masterService: MasterService,
    private pinCodeService:PinCodeService,
    private filter: FilterUtils,
    private route: Router,
    private operationService: OperationService,
    private locationService: LocationService
  ) {

    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.prqData = navigationState
      this.prqFlag = true;

    }
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.bindDataFromDropdown();
    this.isTableLoad = false;
  }
  //#region initializeFormControl
  initializeFormControl() {
    // Create LocationFormControls instance to get form controls for different sections
    this.ConsignmentFormControls = new ConsignmentControl();
    this.FreightFromControl = new FreightControl();

    // Get form controls for Driver Details section
    this.jsonControlArrayBasic = this.ConsignmentFormControls.getConsignmentControlControls();

    this.jsonControlArray = this.FreightFromControl.getFreightControlControls();

    this.jsonContainerDetail = this.ConsignmentFormControls.getContainerDetail();
    this.jsonInvoiceDetail = this.ConsignmentFormControls.getInvoiceDetail();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.consignmentTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayBasic,
    ]);
    this.FreightTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.containerTableForm = formGroupBuilder(this.fb, [this.jsonContainerDetail]);
    this.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonInvoiceDetail]);
    this.commonDropDownMapping();
    if (this.prqData) {
      this.consignmentTableForm.controls['prqNo'].setValue({ name: this.prqData.prqNo, value: this.prqData?.prqNo })
    }
  }
  //#endregion



  //#region  Add a new item to the table

  //#endregion
  getContainerType(event) {
    const containerType = this.containerTableForm.controls['containerType'].value.value;
    const containerCapacity = this.ContainerType.find((x) => x.name.trim() === containerType.trim());
    this.containerTableForm.controls['containerCapacity'].setValue(containerCapacity.loadCapacity)
  }
  //#region functionCallHandler
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  //#region delete function
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
        // color: "#03a9f3",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData1.splice(index, 1);
          this.tableData = this.tableData;
          this.tableData1 = this.tableData1;
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
  //#endregion
  prqDetail() {

    const fromCity = {
      name: this.prqData?.fromCity || "",
      value: this.prqData?.fromCity || ""
    }
    const toCity = {
      name: this.prqData?.toCity || "",
      value: this.prqData?.toCity || ""
    }
    const billingParty = this.billingParty.find((x) => x.name === this.prqData?.billingParty);
    this.consignmentTableForm.controls['billingParty'].setValue(billingParty);
    this.consignmentTableForm.controls['fromCity'].setValue(fromCity);
    this.consignmentTableForm.controls['toCity'].setValue(toCity);
    this.consignmentTableForm.controls['payType'].setValue(this.prqData?.payType);
    this.consignmentTableForm.controls['docketDate'].setValue(this.prqData?.pickupDate);
    this.consignmentTableForm.controls['transMode'].setValue(this.prqData?.transMode);
    this.consignmentTableForm.controls['pAddress'].setValue(this.prqData?.pAddress);
    this.consignmentTableForm.controls['containerSize'].setValue(this.prqData?.containerSize);
    this.consignmentTableForm.controls['ccbp'].setValue(true);
    this.consignmentTableForm.controls['vehicleNo'].setValue(this.prqData?.vehicleNo);
    this.getLocBasedOnCity();
    this.onAutoBillingBased("true");
  }

  async bindDataFromDropdown() {

    const resCust = await customerFromApi(this.masterService);
    this.billingParty = resCust;
    const cityDetail = await getCity(this.companyCode, this.masterService);
    const resContainer = await containerFromApi(this.masterService);
    const resContainerType = await containorConsigmentDetail(this.operationService);
    this.ContainerType = resContainerType;
    // this.displayedColumns1.containerType.option=resContainerType;
    const vendorDetail = await getVendorDetails(this.masterService);
    const prqNo = await pendingbilling(this.masterService);
    //this.displayedColumns1.containerType
    this.prqNoDetail = prqNo;
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      cityDetail,
      this.fromCity,
      this.fromCityStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.customer,
      this.customerStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      cityDetail,
      this.toCity,
      this.toCityStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resContainer,
      this.containerSize,
      this.containerSizeStatus
    );

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.consignorName,
      this.consignorNameStatus
    );

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.consigneeName,
      this.consigneeNameStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      vendorDetail,
      this.vendorName,
      this.vendorNameStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      prqNo.map((x) => { return { name: x.prqNo, value: x.prqNo } }),
      this.prqNo,
      this.prqNoStatus
    );

    this.filter.Filter(
      this.jsonContainerDetail,
      this.containerTableForm,
      this.ContainerType,
      this.containerType,
      this.containerTypeStatus
    );
    this.prqDetail();
  }
  //#region Save Function
  async getLocBasedOnCity() {
    
    const toCity = this.prqData?.toCity;
    const fromCity = this.prqData?.fromCity;
    this.consignmentTableForm.controls['destination'].setValue(toCity);
    this.consignmentTableForm.controls['origin'].setValue(fromCity);
   // this.locationService.setCityLocationInForm(this.consignmentTableForm.get('destination'), toCity, location);
    //this.locationService.setCityLocationInForm(this.consignmentTableForm.get('origin'), fromCity, location);
  }

  async save() {
    // Remove all form errors
    const tabcontrols = this.consignmentTableForm;
    clearValidatorsAndValidate(tabcontrols);
    const contractcontrols = this.consignmentTableForm;
    clearValidatorsAndValidate(contractcontrols);
    /*End*/
    const vendorType = this.consignmentTableForm.value.vendorType;
    const vendorName = this.consignmentTableForm.value.vendorName;
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const controlNames = ["containerSize", "transMode", "payType", "vendorType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    const fieldsToRemove = ['id', 'actions', 'invoice'];
    const invoiceList = removeFieldsFromArray(this.invoiceData, fieldsToRemove);
    const containerlist = removeFieldsFromArray(this.tableData, fieldsToRemove);
    let invoiceDetails = {
      invoiceDetails: invoiceList,
    };
    let containerDetail = {
      containerDetail: containerlist,
    };
    const controltabNames = [
      "containerCapacity",
      "containerSize1",
      "containerSize2",
      "containerType",
    ];

    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    this.consignmentTableForm.controls["fromCity"].setValue(
      this.consignmentTableForm.value.fromCity?.name || ""
    );
    this.consignmentTableForm.controls["containerSize"].setValue(
      this.consignmentTableForm.value.containerSize?.name || ""
    );

    this.consignmentTableForm.controls["vendorName"].setValue(
      vendorType === "Market" ? vendorName : vendorName?.name || ""
    );

    this.consignmentTableForm.controls["toCity"].setValue(
      this.consignmentTableForm.value.toCity?.name || ""
    );
    this.consignmentTableForm.controls["billingParty"].setValue(
      this.consignmentTableForm.value?.billingParty.name || ""
    );
    this.consignmentTableForm.controls["consignorName"].setValue(
      this.consignmentTableForm.value?.consignorName.name || ""
    );
    this.consignmentTableForm.controls["consigneeName"].setValue(
      this.consignmentTableForm.value?.consigneeName.name || ""
    );
    this.consignmentTableForm.controls["prqNo"].setValue(
      this.consignmentTableForm.value?.prqNo.value || ""
    );
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    const dockNo = `CN${dynamicValue}${paddedNumber}`;
    this.consignmentTableForm.controls["docketNumber"].setValue(dockNo);
    let id = {
      _id: dockNo,
      isComplete: 1,
      unloading: 0,
      lsNo: "",
      mfNo: "",
      entryBy: this.userName,
      entryDate: new Date().toISOString(),
      unloadloc: ""
    };
    let docketDetails = {
      ...this.consignmentTableForm.value,
      ...this.FreightTableForm.value,
      ...invoiceDetails,
      ...containerDetail,
      ...id,
    };
    let reqBody = {
      companyCode: this.companyCode,
      collectionName: "docket_temp",
      data: docketDetails,
    };
    if (this.prqFlag) {
      const prqData = {
        prqId: this.consignmentTableForm.value?.prqNo || "",
        dktNo: this.consignmentTableForm.controls["docketNumber"].value

      }
      await updatePrq(this.operationService, prqData, "3")
    }
    this.operationService.operationMongoPost("generic/create", reqBody).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Booked Successfully",
          text: "DocketNo: " + this.consignmentTableForm.controls["docketNumber"].value,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the desired page after the success message is confirmed.
            this._NavigationService.navigateTotab(
              'PRQ',
              "dashboard/GlobeDashboardPage"
            );
          }
        });
      },
    });
  }
  //here the function is calling for add docket Data in docket Tracking.

  //#region cancel Function
  cancel() {
    this._NavigationService.navigateTotab(
      "docket",
      "dashboard/GlobeDashboardPage"
    );
  }
  //#endregion
  commonDropDownMapping() {

    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this[mapping.target] = data.name; // Set the target property with the value of the name property
          this[`${mapping.target}Status`] =
            data.additionalData.showNameAndValue; // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };

    const docketMappings = [
      { name: "fromCity", target: "fromCity" },
      { name: "toCity", target: "toCity" },
      { name: "billingParty", target: "customer" },
      { name: "containerSize", target: "containerSize" },
      { name: "consignorName", target: "consignorName" },
      { name: "consigneeName", target: "consigneeName" },
      { name: "vendorName", target: "vendorName" },
      { name: "prqNo", target: "prqNo" }
    ];
    const containerMapping = [
      { name: "containerType", target: "containerType" }
    ]
    mapControlArray(this.jsonControlArrayBasic, docketMappings);
    mapControlArray(this.jsonContainerDetail, containerMapping);// Map docket control array
    // mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    // mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    //mapControlArray(this.contractControlArray, destinationMapping);
  }
  onAutoBillingBased(event) {
    const checked = typeof (event) === "string" ? event : event.eventArgs.checked
    if (checked) {

      const billingParty = this.consignmentTableForm.controls['billingParty'].value;
      this.consignmentTableForm.controls['ccontactNumber'].setValue(this.prqData?.contactNo || "");
      this.consignmentTableForm.controls['cncontactNumber'].setValue(this.prqData?.contactNo || "");
      this.consignmentTableForm.controls['consignorName'].setValue(billingParty);
      this.consignmentTableForm.controls['consigneeName'].setValue(billingParty);
    }
    else {
      this.consignmentTableForm.controls['ccontactNumber'].setValue("");
      this.consignmentTableForm.controls['cncontactNumber'].setValue("");
      this.consignmentTableForm.controls['consignorName'].setValue("");
      this.consignmentTableForm.controls['consigneeName'].setValue("");
    }
  }
  prqSelection() {
    this.prqData = this.prqNoDetail.find((x) => x.prqId === this.consignmentTableForm.controls['prqNo'].value.value);
    this.prqDetail()
  }

  async addData() {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find((x) => x.containerNumber === this.containerTableForm.value.containerNumber);
      if (exist) {
        this.containerTableForm.controls['containerNumber'].setValue('');
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering Container Number.",
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false

      }
    }

    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      containerNumber: this.containerTableForm.value.containerNumber,
      containerType: this.containerTableForm.value.containerType.value,
      containerCapacity: this.containerTableForm.value.containerCapacity,
      invoice: false,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    this.isLoad = false;
    this.tableLoad = false;
  }

  handleMenuItemClick(data) {

    if (data.data.invoice) {
      this.fillInvoice(data);
    }
    else {
      this.fillContainer(data);
    }

  }

  fillInvoice(data: any) {
    if (data.label.label === 'Remove') {
      this.invoiceData = this.invoiceData.filter((x) => x.id !== data.data.id);
    }
    else {
      this.invoiceTableForm.controls['ewayBillNo'].setValue(data.data?.ewayBillNo || "");
      this.invoiceTableForm.controls['expiryDate'].setValue(data.data?.expiryDateO || new Date());
      this.invoiceTableForm.controls['invoiceNo'].setValue(data.data?.invoiceNo || "");
      this.invoiceTableForm.controls['invoiceAmount'].setValue(data.data?.invoiceAmount || "");
      this.invoiceTableForm.controls['noofPkts'].setValue(data.data?.noofPkts || "");
      this.invoiceTableForm.controls['materialName'].setValue(data.data?.materialName || "");
      this.invoiceTableForm.controls['actualWeight'].setValue(data.data?.actualWeight || "");
      this.invoiceTableForm.controls['chargedWeight'].setValue(data.data?.chargedWeight || "");
      this.invoiceData = this.invoiceData.filter((x) => x.id !== data.data.id);
    }

  }

  fillContainer(data: any) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      const container = this.ContainerType.find((x) => x.name.trim() === data.data?.containerType.trim())
      this.containerTableForm.controls['containerNumber'].setValue(data.data?.containerNumber || "");
      this.containerTableForm.controls['containerCapacity'].setValue(data.data?.containerCapacity || "");
      this.containerTableForm.controls['containerType'].setValue(container);
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

  async addInvoiceData() {

    const invoice = this.invoiceData;
    if (invoice.length > 0) {
      const exist = invoice.find((x) => x.invoiceNo === this.invoiceTableForm.value.invoiceNo);
      if (exist) {
        this.invoiceTableForm.controls['invoiceNo'].setValue('');
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid entering duplicate Invoice.",
          showConfirmButton: true,
        });
        return false
      }
    }
    this.tableLoadIn = true
    this.loadIn = true;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: invoice.length + 1,
      ewayBillNo: this.invoiceTableForm.value.ewayBillNo,
      expiryDate: this.invoiceTableForm.value.expiryDate ? formatDate(this.invoiceTableForm.value.expiryDate, 'dd-MM-yy HH:mm') : formatDate(new Date().toUTCString(), 'dd-MM-yy HH:mm'),
      invoiceNo: this.invoiceTableForm.value.invoiceNo,
      invoiceAmount: this.invoiceTableForm.value.invoiceAmount,
      noofPkts: this.invoiceTableForm.value.noofPkts,
      materialName: this.invoiceTableForm.value.materialName,
      actualWeight: this.invoiceTableForm.value.actualWeight,
      chargedWeight: this.invoiceTableForm.value.chargedWeight,
      invoice: true,
      expiryDateO: this.invoiceTableForm.value.expiryDate,
      actions: ['Edit', 'Remove']
    }
    this.invoiceData.push(json);
    this.tableLoadIn = false;
    this.loadIn = false;
  }

  vendorFieldChanged() {
    const vendorType = this.consignmentTableForm.value.vendorType;

    this.jsonControlArrayBasic.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = (vendorType === "Market") ? "text" : "dropdown";
      }
    });
  }
}
