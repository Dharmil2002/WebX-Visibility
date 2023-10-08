import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import {
  ConsignmentControl,
  FreightControl,
} from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import {
  containerFromApi,
  customerFromApi,
} from "../prq-entry-page/prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorDetails } from "../job-entry-page/job-entry-utility";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { pendingbilling } from "../pending-billing/pending-billing-utlity";
import { containorConsigmentDetail, updatePrq } from "./consigment-utlity";
import { formatDate } from "src/app/Utility/date/date-utils";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";

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
  TableStyle = "width:82%;";
  // TableStyle1 = "width:82%"
  ConsignmentFormControls: ConsignmentControl;
  FreightFromControl: FreightControl;
  breadscrums = [
    {
      title: "Consignment Entry",
      items: ["Operation"],
      active: "ConsignmentForm",
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
  docketDetail: DocketDetail;
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
    },
  };
  /*End*/
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
    },
  };
  /*End*/
  staticFieldInvoice = [
    "ewayBillNo",
    "expiryDate",
    "invoiceNo",
    "invoiceAmount",
    "noofPkts",
    "materialName",
    "actualWeight",
    "chargedWeight",
  ];
  staticField = ["containerNumber", "containerType", "containerCapacity"];
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
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
  containerTypeList: any;
  //#endregion
  branchCode = localStorage.getItem("Branch");
  addFlag = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  linkArray = [];
  jsonInvoiceDetail: any;
  loadIn: boolean;
  isUpdate: boolean;
  vendorDetail: any;
  jsonControlArrayConsignor: import("d:/velocityDocket/velocity-docket/src/app/Models/FormControl/formcontrol").FormControls[];
  jsonControlArrayConsignee: import("d:/velocityDocket/velocity-docket/src/app/Models/FormControl/formcontrol").FormControls[];

  constructor(
    private fb: UntypedFormBuilder,
    private _NavigationService: NavigationService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private vehicleStatusService: VehicleStatusService,
    private route: Router,
    private operationService: OperationService
  ) {
    const navigationState =
      this.route.getCurrentNavigation()?.extras?.state?.data;
    this.docketDetail = new DocketDetail({});
    if (navigationState != null) {
      this.isUpdate =
        navigationState.hasOwnProperty("actions") &&
        navigationState.actions[0] === "Edit Docket";
      if (this.isUpdate) {
        this.docketDetail = navigationState;
        this.breadscrums[0].title = "Consignment Edit";
      } else {
        this.prqData = navigationState;
        this.prqFlag = true;
      }
    }
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.bindDataFromDropdown();
    this.isTableLoad = false;
  }
  //#region initializeFormControl
  async initializeFormControl() {
    // Create LocationFormControls instance to get form controls for different sections
    this.ConsignmentFormControls = new ConsignmentControl(this.docketDetail);
    this.FreightFromControl = new FreightControl(this.docketDetail);

    // Get form controls for Driver Details section
    this.jsonControlArrayBasic =
      this.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "Basic"
      );
    this.jsonControlArrayConsignor =
      this.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignor"
      );
    this.jsonControlArrayConsignee =
      this.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignee"
      );
    const formControl = [
      ...this.jsonControlArrayBasic,
      ...this.jsonControlArrayConsignor,
      ...this.jsonControlArrayConsignee,
    ];
    this.jsonControlArray = this.FreightFromControl.getFreightControlControls();

    this.jsonContainerDetail =
      this.ConsignmentFormControls.getContainerDetail();
    this.jsonInvoiceDetail = this.ConsignmentFormControls.getInvoiceDetail();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.consignmentTableForm = formGroupBuilder(this.fb, [formControl]);
    this.FreightTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.containerTableForm = formGroupBuilder(this.fb, [
      this.jsonContainerDetail,
    ]);
    this.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonInvoiceDetail]);
    this.commonDropDownMapping();
    if (this.prqData) {
      this.consignmentTableForm.controls["prqNo"].setValue({
        name: this.prqData.prqNo,
        value: this.prqData?.prqNo,
      });
    }
  }
  //#endregion
  getContainerType(event) {
    const containerType =
      this.containerTableForm.controls["containerType"].value.value;
    const containerCapacity = this.containerTypeList.find(
      (x) => x.name.trim() === containerType.trim()
    );
    this.containerTableForm.controls["containerCapacity"].setValue(
      containerCapacity.loadCapacity
    );
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

  async prqDetail() {
    const fromCity = {
      name: this.prqData?.fromCity || "",
      value: this.prqData?.fromCity || "",
    };
    const toCity = {
      name: this.prqData?.toCity || "",
      value: this.prqData?.toCity || "",
    };
    let vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.prqData.prqNo
    );
    const billingParty = this.billingParty.find(
      (x) => x.name === this.prqData?.billingParty
    );
    this.consignmentTableForm.controls["billingParty"].setValue(billingParty);
    this.consignmentTableForm.controls["fromCity"].setValue(fromCity);
    this.consignmentTableForm.controls["toCity"].setValue(toCity);
    this.consignmentTableForm.controls["payType"].setValue(
      this.prqData?.payType
    );
    this.consignmentTableForm.controls["docketDate"].setValue(
      this.prqData?.pickupDate
    );
    this.consignmentTableForm.controls["transMode"].setValue("Road");
    this.consignmentTableForm.controls["pAddress"].setValue(
      this.prqData?.pAddress
    );
    this.consignmentTableForm.controls["containerSize"].setValue(
      this.prqData?.containerSize
    );
    this.consignmentTableForm.controls["ccbp"].setValue(true);
    this.consignmentTableForm.controls["vehicleNo"].setValue(
      this.prqData?.vehicleNo
    );
    this.consignmentTableForm.controls["vendorType"].setValue(
      vehicleDetail?.vendorType
    );
    this.consignmentTableForm.controls["vendorName"].setValue(
      vehicleDetail?.vendor
    );

    this.vendorFieldChanged();
    this.getLocBasedOnCity();
    this.onAutoBillingBased("true");
  }

  async bindDataFromDropdown() {
    const resCust = await customerFromApi(this.masterService);
    this.billingParty = resCust;
    const cityDetail = await getCity(this.companyCode, this.masterService);
    const resContainer = await containerFromApi(this.masterService);
    const resContainerType = await containorConsigmentDetail(
      this.operationService
    );
    this.containerTypeList = resContainerType;
    const vendorDetail = await getVendorDetails(this.masterService);
    this.vendorDetail = vendorDetail;
    const prqNo = await pendingbilling(this.masterService);
    this.prqNoDetail = prqNo;
    const prqDetail = prqNo.map((x) => ({ name: x.prqNo, value: x.prqNo }));
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
      this.jsonControlArrayConsignor,
      this.consignmentTableForm,
      resCust,
      this.consignorName,
      this.consignorNameStatus
    );

    this.filter.Filter(
      this.jsonControlArrayConsignee,
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
      prqDetail,
      this.prqNo,
      this.prqNoStatus
    );

    this.filter.Filter(
      this.jsonContainerDetail,
      this.containerTableForm,
      this.containerTypeList,
      this.containerType,
      this.containerTypeStatus
    );
    this.prqFlag && this.prqDetail();
    this.isUpdate && this.autofillDropDown();
  }

  async getLocBasedOnCity() {
    const toCity =
      this.prqData?.toCity ??
      this.consignmentTableForm.get("toCity")?.value?.value ??
      "";
    const fromCity =
      this.prqData?.fromCity ??
      this.consignmentTableForm.get("fromCity")?.value?.value ??
      "";

    this.consignmentTableForm.controls["destination"].setValue(toCity);
    this.consignmentTableForm.controls["origin"].setValue(fromCity);
    // this.locationService.setCityLocationInForm(this.consignmentTableForm.get('destination'), toCity, location);
    //this.locationService.setCityLocationInForm(this.consignmentTableForm.get('origin'), fromCity, location);
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
      { name: "consigneeName", target: "consigneeName" },
      { name: "vendorName", target: "vendorName" },
      { name: "prqNo", target: "prqNo" },
    ];
    const consignor = [{ name: "consignorName", target: "consignorName" }];
    const consignee = [{ name: "consigneeName", target: "consigneeName" }];
    const containerMapping = [
      { name: "containerType", target: "containerType" },
    ];
    mapControlArray(this.jsonControlArrayBasic, docketMappings);
    mapControlArray(this.jsonContainerDetail, containerMapping);
    mapControlArray(this.jsonControlArrayConsignor, consignor);
    mapControlArray(this.jsonControlArrayConsignee, consignee);
    // Map docket control array
    // mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    // mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    //mapControlArray(this.contractControlArray, destinationMapping);
  }

  onAutoBillingBased(event) {
    const checked = typeof event === "string" ? event : event.eventArgs.checked;
    if (checked) {
      const billingParty =
        this.consignmentTableForm.controls["billingParty"].value;
      this.consignmentTableForm.controls["ccontactNumber"].setValue(
        this.prqData?.contactNo || ""
      );
      this.consignmentTableForm.controls["cncontactNumber"].setValue(
        this.prqData?.contactNo || ""
      );
      this.consignmentTableForm.controls["consignorName"].setValue(
        billingParty
      );
      this.consignmentTableForm.controls["consigneeName"].setValue(
        billingParty
      );
    } else {
      this.consignmentTableForm.controls["ccontactNumber"].setValue("");
      this.consignmentTableForm.controls["cncontactNumber"].setValue("");
      this.consignmentTableForm.controls["consignorName"].setValue("");
      this.consignmentTableForm.controls["consigneeName"].setValue("");
    }
  }

  prqSelection() {
    this.prqData = this.prqNoDetail.find(
      (x) => x.prqNo === this.consignmentTableForm.controls["prqNo"].value.value
    );
    this.prqDetail();
  }

  handleMenuItemClick(data) {
    if (data.data.invoice) {
      this.fillInvoice(data);
    } else {
      this.fillContainer(data);
    }
  }

  async addData() {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.containerNumber === this.containerTableForm.value.containerNumber
      );
      if (exist) {
        this.containerTableForm.controls["containerNumber"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering Container Number.",
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false;
      }
    }
    if (typeof this.containerTableForm.value.containerType === "string") {
      this.containerTableForm.controls["containerType"].setValue("");
      Swal.fire({
        icon: "info", // Use the "info" icon for informational messages
        title: "Information",
        text: "Please Select Proper value.",
        showConfirmButton: true,
      });
      this.isLoad = false;
      this.tableLoad = false;
      return false;
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
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    Object.keys(this.containerTableForm.controls).forEach((key) => {
      this.containerTableForm.get(key).clearValidators();
      this.containerTableForm.get(key).updateValueAndValidity();
    });

    this.containerTableForm.controls["containerNumber"].setValue("");
    this.containerTableForm.controls["containerType"].setValue("");
    this.containerTableForm.controls["containerCapacity"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.containerTableForm.controls).forEach((key) => {
      this.containerTableForm.get(key).setValidators(Validators.required);
    });
    this.consignmentTableForm.updateValueAndValidity();
  }

  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const container = this.containerTypeList.find(
        (x) => x.name.trim() === data.data?.containerType.trim()
      );
      this.containerTableForm.controls["containerNumber"].setValue(
        data.data?.containerNumber || ""
      );
      this.containerTableForm.controls["containerCapacity"].setValue(
        data.data?.containerCapacity || ""
      );
      this.containerTableForm.controls["containerType"].setValue(container);
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

  async addInvoiceData() {
    const invoice = this.invoiceData;
    if (invoice.length > 0) {
      const exist = invoice.find(
        (x) => x.invoiceNo === this.invoiceTableForm.value.invoiceNo
      );
      if (exist) {
        this.invoiceTableForm.controls["invoiceNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid entering duplicate Invoice.",
          showConfirmButton: true,
        });
        return false;
      }
    }
    this.tableLoadIn = true;
    this.loadIn = true;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: invoice.length + 1,
      ewayBillNo: this.invoiceTableForm.value.ewayBillNo,
      expiryDate: this.invoiceTableForm.value.expiryDate
        ? formatDate(this.invoiceTableForm.value.expiryDate, "dd-MM-yy HH:mm")
        : formatDate(new Date().toUTCString(), "dd-MM-yy HH:mm"),
      invoiceNo: this.invoiceTableForm.value.invoiceNo,
      invoiceAmount: this.invoiceTableForm.value.invoiceAmount,
      noofPkts: this.invoiceTableForm.value.noofPkts,
      materialName: this.invoiceTableForm.value.materialName,
      actualWeight: this.invoiceTableForm.value.actualWeight,
      chargedWeight: this.invoiceTableForm.value.chargedWeight,
      invoice: true,
      expiryDateO: this.invoiceTableForm.value.expiryDate,
      actions: ["Edit", "Remove"],
    };
    this.invoiceData.push(json);
    this.invoiceTableForm.reset();
    this.tableLoadIn = false;
    this.loadIn = false;
  }

  fillInvoice(data: any) {
    if (data.label.label === "Remove") {
      this.invoiceData = this.invoiceData.filter((x) => x.id !== data.data.id);
    } else {
      this.invoiceTableForm.controls["ewayBillNo"].setValue(
        data.data?.ewayBillNo || ""
      );
      this.invoiceTableForm.controls["expiryDate"].setValue(
        data.data?.expiryDateO || new Date()
      );
      this.invoiceTableForm.controls["invoiceNo"].setValue(
        data.data?.invoiceNo || ""
      );
      this.invoiceTableForm.controls["invoiceAmount"].setValue(
        data.data?.invoiceAmount || ""
      );
      this.invoiceTableForm.controls["noofPkts"].setValue(
        data.data?.noofPkts || ""
      );
      this.invoiceTableForm.controls["materialName"].setValue(
        data.data?.materialName || ""
      );
      this.invoiceTableForm.controls["actualWeight"].setValue(
        data.data?.actualWeight || ""
      );
      this.invoiceTableForm.controls["chargedWeight"].setValue(
        data.data?.chargedWeight || ""
      );
      this.invoiceData = this.invoiceData.filter((x) => x.id !== data.data.id);
    }
  }

  vendorFieldChanged() {
    const vendorType = this.consignmentTableForm.value.vendorType;

    this.jsonControlArrayBasic.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "Market" ? "text" : "dropdown";
      }
    });
  }

  autofillDropDown() {
    const fromCity = {
      name: this.docketDetail.fromCity,
      value: this.docketDetail.fromCity,
    };
    this.consignmentTableForm.controls["fromCity"].setValue(fromCity);
    const toCity = {
      name: this.docketDetail.toCity,
      value: this.docketDetail.toCity,
    };

    this.consignmentTableForm.controls["toCity"].setValue(toCity);
    const billingParty = this.billingParty.find(
      (x) => x.name == this.docketDetail.billingParty
    );
    const consignorName = this.billingParty.find(
      (x) => x.name == this.docketDetail.consignorName
    );
    const consigneeName = this.billingParty.find(
      (x) => x.name == this.docketDetail.consigneeName
    );
    const containerTypeList = this.containerTypeList.find(
      (x) => x.name == this.docketDetail.containerSize
    );
    const prqNo = {
      name: this.docketDetail.prqNo,
      value: this.docketDetail.prqNo,
    };
    this.consignmentTableForm.controls["vendorType"].setValue(
      this.docketDetail.vendorType
    );
    if (this.docketDetail.vendorType === "Market") {
      this.consignmentTableForm.controls["vendorName"].setValue(
        this.docketDetail.vendorName
      );
      this.vendorFieldChanged();
    } else {
      const vendorName = this.vendorDetail.find(
        (x) => x.name == this.vendorDetail.vendorName
      );
      this.consignmentTableForm.controls["vendorName"].setValue(vendorName);
    }

    this.consignmentTableForm.controls["prqNo"].setValue(prqNo);
    this.consignmentTableForm.controls["consignorName"].setValue(consignorName);
    this.consignmentTableForm.controls["consigneeName"].setValue(consigneeName);
    this.consignmentTableForm.controls["billingParty"].setValue(billingParty);
    this.consignmentTableForm.controls["containerSize"].setValue(
      containerTypeList
    );
    this.consignmentTableForm.controls["payType"].setValue(
      this.docketDetail.payType
    );
    this.consignmentTableForm.controls["transMode"].setValue(
      this.docketDetail.transMode
    );
    this.FreightTableForm.controls["freightRatetype"].setValue(
      this.docketDetail.freightRatetype
    );
    this.bindTableData();
  }

  bindTableData() {
    if (this.docketDetail.invoiceDetails.length > 0) {
      this.tableLoadIn = true;
      this.loadIn = true;
      const invoiceDetail = this.docketDetail.invoiceDetails.map((x, index) => {
        if (x) {
          // You can use 'x' and 'index' here
          x.id = index + 1;
          x.actions = ["Edit", "Remove"];
          return x;
        }
        return x; // Return the original element if no modification is needed
      });
      this.invoiceData = invoiceDetail;
      this.tableLoadIn = false;
      this.loadIn = false;
    }
    if (this.docketDetail.containerDetail.length > 0) {
      this.tableLoad = true;
      this.isLoad = true;
      const containerDetail = this.docketDetail.containerDetail.map(
        (x, index) => {
          if (x) {
            // Modify 'x' if needed
            // For example, you can add the index to the element
            x.id = index + 1;
            x.actions = ["Edit", "Remove"];
            return x;
          }
          return x; // Return the original element if no modification is needed
        }
      );
      this.tableData = containerDetail;
      this.tableLoad = false;
      this.isLoad = false;
    }
  }
  /*region Save*/

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
    const controlNames = [
      "containerSize",
      "transMode",
      "payType",
      "vendorType",
    ];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    const fieldsToRemove = ["id", "actions", "invoice"];
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
    if (!this.isUpdate) {
      let id = {
        isComplete: 1,
        unloading: 0,
        lsNo: "",
        mfNo: "",
        entryBy: this.userName,
        entryDate: new Date().toISOString(),
        unloadloc: "",
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
        docType: "CN",
        branch: localStorage.getItem("Branch"),
        finYear: "2223",
        data: docketDetails,
      };
      if (this.prqFlag) {
        const prqData = {
          prqId: this.consignmentTableForm.value?.prqNo || "",
          dktNo: this.consignmentTableForm.controls["docketNumber"].value,
        };
        await updatePrq(this.operationService, prqData, "3");
      }
      this.operationService
        .operationMongoPost("operation/docket/create", reqBody)
        .subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: "success",
              title: "Booked Successfully",
              text:
                "DocketNo: " +
                this.consignmentTableForm.controls["docketNumber"].value,
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                // Redirect to the desired page after the success message is confirmed.
                this._NavigationService.navigateTotab(
                  "PRQ",
                  "dashboard/GlobeDashboardPage"
                );
              }
            });
          },
        });
    } else {
      let docketDetails = {
        ...this.consignmentTableForm.value,
        ...this.FreightTableForm.value,
        ...invoiceDetails,
        ...containerDetail,
      };
      let reqBody = {
        companyCode: this.companyCode,
        collectionName: "docket_temp",
        filter: {
          docketNumber:
            this.consignmentTableForm.controls["docketNumber"].value,
        },
        update: docketDetails,
      };
      const res = await this.operationService
        .operationMongoPut("generic/update", reqBody)
        .toPromise();
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Docket Update Successfully",
          text:
            "DocketNo: " +
            this.consignmentTableForm.controls["docketNumber"].value,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the desired page after the success message is confirmed.
            this._NavigationService.navigateTotab(
              "PRQ",
              "dashboard/GlobeDashboardPage"
            );
          }
        });
      }
    }
  }
  /*End Save*/
}
