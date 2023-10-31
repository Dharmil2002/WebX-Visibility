import { Component, OnInit, ViewChild } from "@angular/core";
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
import { customerFromApi } from "../prq-entry-page/prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorDetails } from "../job-entry-page/job-entry-utility";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { financialYear, formatDate } from "src/app/Utility/date/date-utils";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { MatDialog } from "@angular/material/dialog";
import { getVehicleStatusFromApi } from "../assign-vehicle-page/assgine-vehicle-utility";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { AddFleetMasterComponent } from "src/app/Masters/fleet-master/add-fleet-master/add-fleet-master.component";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { PrqService } from "../../Utility/module/operation/prq/prq.service";

@Component({
  selector: "app-consignment-entry-form",
  templateUrl: "./consignment-entry-form.component.html",
})

/*Please organize the code in order of priority, with the code that is used first placed at the top.*/
export class ConsignmentEntryFormComponent implements OnInit {
  consignmentTableForm: UntypedFormGroup;
  containerTableForm: UntypedFormGroup;
  FreightTableForm: UntypedFormGroup;
  invoiceTableForm: UntypedFormGroup;
  ewayBillTableForm: UntypedFormGroup;
  tableData: any = [];
  invoiceData: any = [];
  tableLoadIn: boolean = true;
  backPath: string;
  tableData1: any;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  jsonControlArray: any;
  // TableStyle1 = "width:82%"
  ewayBillButton: string = "Next";
  ConsignmentFormControls: ConsignmentControl;
  FreightFromControl: FreightControl;
  breadscrums = [
    {
      title: "Eway Bill",
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
  userName = localStorage.getItem("UserName");
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
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialName: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actualWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    chargedWeight: {
      Title: "Charged Weight (Kg)",
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
  ewayBill = true;
  linkArray = [];
  jsonInvoiceDetail: any;
  loadIn: boolean;
  isUpdate: boolean;
  vendorDetail: any;
  jsonControlArrayConsignor: any;
  jsonControlArrayConsignee: any;
  jsonEwayBill: any;
  contFlag: boolean;
  previewResult: any;
  vehicleNo: any;
  vehicleNoStatus: any;
  destination: any;
  destinationStatus: any;
  packagingType: any;
  allformControl: any[];
  vehileList: any;
  marketVendor: boolean;
  /*Below Compotent is used for market vehicle*/
  @ViewChild(AddFleetMasterComponent) addFleetMaster: AddFleetMasterComponent;
  /*in constructor inilization of all the services which required in this type script*/
  constructor(
    private fb: UntypedFormBuilder,
    private _NavigationService: NavigationService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private vehicleStatusService: VehicleStatusService,
    private route: Router,
    private operationService: OperationService,
    public xlsxutils: xlsxutilityService,
    private matDialog: MatDialog,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private prqService: PrqService,
    private consigmentUtility: ConsigmentUtility
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
        this.ewayBill = false;
      } else {
        this.prqData = navigationState;
        this.prqFlag = true;
        this.ewayBill = false;
        this.breadscrums[0].title = "Consignment Entry";
      }
    }
    this.initializeFormControl();
    this.getGeneralmasterData();
  }

  ngOnInit(): void {
    this.bindDataFromDropdown();
    this.isTableLoad = false;
    this.backPath = "/dashboard/Index?tab=6";
  }

  /*Here the function which is used for the bind staticDropdown Value*/
  async getGeneralmasterData() {
    const packagingType: AutoComplete[] =
      await this.generalService.getGeneralMasterData("PKGS");
    // Find the form control with the name 'packaging_type'
    const packagingTypeControl = this.allformControl.find(
      (x) => x.name === "packaging_type"
    );
    if (packagingTypeControl) {
      packagingTypeControl.value = packagingType;
    }
  }
  /* End*/
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
    this.allformControl = [
      ...this.jsonControlArrayBasic,
      ...this.jsonControlArrayConsignor,
      ...this.jsonControlArrayConsignee,
    ];
    this.jsonControlArray = this.FreightFromControl.getFreightControlControls();

    this.jsonContainerDetail =
      this.ConsignmentFormControls.getContainerDetail();
    this.jsonInvoiceDetail = this.ConsignmentFormControls.getInvoiceDetail();
    this.jsonEwayBill = this.ConsignmentFormControls.getEwayBillDetail();
    // Build the form group using formGroupBuilder function and the values of accordionData

    this.consignmentTableForm = formGroupBuilder(this.fb, [
      this.allformControl,
    ]);
    this.FreightTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.containerTableForm = formGroupBuilder(this.fb, [
      this.jsonContainerDetail,
    ]);
    this.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonInvoiceDetail]);
    this.ewayBillTableForm = formGroupBuilder(this.fb, [this.jsonEwayBill]);
    this.commonDropDownMapping();
    this.consignmentTableForm.controls["payType"].setValue("TBB");
    this.consignmentTableForm.controls["transMode"].setValue("Road");

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
    let billingParty = this.billingParty.find(
      (x) => x.name === this.prqData?.billingParty
    );
    let vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.prqData.prqNo
    );

    this.setFormValue(this.consignmentTableForm, "fromCity", this.prqData, true, "fromCity", "fromCity");
    this.setFormValue(this.consignmentTableForm, "toCity", this.prqData, true, "toCity", "toCity");
    await this.getLocBasedOnCity();
    this.setFormValue(this.consignmentTableForm, "billingParty", billingParty);
    this.setFormValue(this.consignmentTableForm, "payType", this.prqData?.payType);
    this.setFormValue(this.consignmentTableForm, "docketDate", this.prqData?.pickupDate);
    this.setFormValue(this.consignmentTableForm, "transMode", "Road");
    this.setFormValue(this.consignmentTableForm, "pAddress", this.prqData?.pAddress);
    this.setFormValue(this.consignmentTableForm, "ccbp", true);
    this.setFormValue(this.consignmentTableForm, "vendorType", vehicleDetail?.vendorType, false, "", "");
   await  this.vendorFieldChanged()
    if (vehicleDetail?.vendorType == "Market") {
      this.setFormValue(this.consignmentTableForm, "vendorName", vehicleDetail.vendor);
    } else {
      this.setFormValue(this.consignmentTableForm, "vendorName", vehicleDetail, true, "vendor", "vendor");
    }
    this.setFormValue(this.consignmentTableForm, "vehicleNo", this.prqData?.vehicleNo);

    this.getLocBasedOnCity();
    this.onAutoBillingBased("true");
  }

  setFormValue(
    formGroup: UntypedFormGroup,
    controlId: string,
    value: any,
    isNameValue: boolean = false,
    valueField: string = "",
    nameField: string = "",
    callback: () => void = () => { }
  ) {
    if (isNameValue) {
      formGroup.controls[controlId].setValue({
        name: value[nameField] ?? "",
        value: value[valueField] ?? "",
      });
    } else {
      formGroup.controls[controlId].setValue(value);
    }
    callback();
  }

  async bindDataFromDropdown() {
    const resCust = await customerFromApi(this.masterService);
    this.billingParty = resCust;
    const vehileList = await getVehicleStatusFromApi(
      this.companyCode,
      this.operationService
    );
    this.vehileList = vehileList;
    const vehFieldMap = vehileList.map((x) => {
      return { name: x.vehNo, value: x.vehNo };
    });
    const resContainerType =
      await this.consigmentUtility.containorConsigmentDetail();
    this.containerTypeList = resContainerType;
    const vendorDetail = await getVendorDetails(this.masterService);
    this.vendorDetail = vendorDetail;
    const prqNo = await this.prqService.getPrqDetailFromApi();
    this.prqNoDetail = prqNo.allPrqDetail;
    const prqDetail = prqNo.allPrqDetail.map((x) => ({
      name: x.prqNo,
      value: x.prqNo,
    }));

    this.filter.Filter(this.jsonControlArrayBasic, this.consignmentTableForm, resCust, this.customer, this.customerStatus );
    this.filter.Filter(this.jsonControlArrayConsignor, this.consignmentTableForm, resCust, this.consignorName, this.consignorNameStatus );
    this.filter.Filter(this.jsonControlArrayConsignee, this.consignmentTableForm, resCust, this.consigneeName, this.consigneeNameStatus );
    this.filter.Filter(this.jsonControlArrayBasic, this.consignmentTableForm, vendorDetail, this.vendorName, this.vendorNameStatus );
    this.filter.Filter(this.jsonControlArrayBasic, this.consignmentTableForm, prqDetail, this.prqNo, this.prqNoStatus );
    this.filter.Filter(this.jsonControlArrayBasic, this.consignmentTableForm, vehFieldMap, this.vehicleNo, this.vehicleNoStatus );
    if (this.prqData.transMode == "trailer") {
      this.consignmentTableForm.controls["cd"].setValue(true);
      this.contFlag = true;
      this.containerDetail();
    }    
    this.prqFlag && this.prqDetail();
    this.isUpdate && this.autofillDropDown();
  }

  /* below function was the call when */
  async getLocBasedOnCity() {
    const destinationMapping = await this.locationService.locationFromApi({
      locCity: this.consignmentTableForm.get("toCity")?.value?.value.toUpperCase(),
    });
    this.filter.Filter(this.jsonControlArrayBasic, this.consignmentTableForm, destinationMapping, this.destination, this.destinationStatus );
  }

  cancel() {
    this._NavigationService.navigateTotab("docket", "dashboard/Index");
  }
  //#endregion

  async commonDropDownMapping() {
    
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
      { name: "vendorName", target: "vendorName" },
      { name: "vehicleNo", target: "vehicleNo" },
      { name: "prqNo", target: "prqNo" },
      { name: "destination", target: "destination" },
    ];
    const containerMapping = [
      { name: "containerType", target: "containerType" },
    ];
    const consignor = [{ name: "consignorName", target: "consignorName" }];
    const consignee = [{ name: "consigneeName", target: "consigneeName" }];
    mapControlArray(this.jsonControlArrayBasic, docketMappings);
    mapControlArray(this.jsonControlArrayConsignor, consignor);
    mapControlArray(this.jsonControlArrayConsignee, consignee);
    mapControlArray(this.jsonContainerDetail, containerMapping); // Map docket control array
    const destinationMapping = await this.locationService.locationFromApi({
      locCode: this.branchCode,
    });
    const city = {
      name: destinationMapping[0].city,
      value: destinationMapping[0].city,
    };
   //this.setFormValue(this.consignmentTableForm, "fromCity", this.prqData, true, "fromCity", "fromCity");
    this.consignmentTableForm.controls["fromCity"].setValue(city);
    
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
        this.prqData?.contactNo ||
        this.consignmentTableForm.controls["billingParty"].value?.mobile ||
        ""
      );
      this.consignmentTableForm.controls["cncontactNumber"].setValue(
        this.prqData?.contactNo ||
        this.consignmentTableForm.controls["billingParty"].value?.mobile ||
        ""
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
  /*this function is for the add multiple containor*/
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
  /*End*/
  /*this function*/
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
    if (await this.calculateValidation()) {
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
    const vendorName = this.consignmentTableForm.get("vendorName");
    const vehicleNo = this.consignmentTableForm.get("vehicleNo");
    vendorName.setValue("");
    vehicleNo.setValue("");
    this.jsonControlArrayBasic.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "Market" ? "text" : "dropdown";
      }
      if (x.name === "vehicleNo") {
        x.type = vendorType === "Market" ? "text" : "dropdown";
      }
    });
    if (vendorType !== "Market") {
      const vendorDetail = this.vendorDetail.filter(
        (x) => x.type.toLowerCase() == vendorType.toLowerCase()
      );
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.consignmentTableForm,
        vendorDetail,
        this.vendorName,
        this.vendorNameStatus
      );
      const vehFieldMap = this.vehileList
        .filter((x) => x.vendorType.toLowerCase() == vendorType.toLowerCase())
        .map((x) => {
          return { name: x.vehNo, value: x.vehNo };
        });
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.consignmentTableForm,
        vehFieldMap,
        this.vehicleNo,
        this.vehicleNoStatus
      );
      vendorName.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      vendorName.updateValueAndValidity();
      vehicleNo.setValidators(autocompleteObjectValidator());
      vehicleNo.updateValueAndValidity();
    } else {
      vehicleNo.clearValidators();
      vendorName.setValidators(Validators.required);
      vendorName.updateValueAndValidity();
      vehicleNo.updateValueAndValidity();
      this.marketVendor = true;
    }
  }
  /*Below function is only call those time when user can come to only edit a
   docket not for prq or etc etc*/
  autofillDropDown() {
    const { vendorType, vendorName } = this.docketDetail;
    const vendor =
      vendorType !== "Market"
        ? this.vendorDetail.find((x) => x.name === vendorName)
        : vendorName;
    this.consignmentTableForm.controls["vendorName"].setValue(vendor);
    this.consignmentTableForm.controls["vendorType"].setValue(vendorType);
    this.vendorFieldChanged();
    const fromCity = {
      name: this.docketDetail.fromCity,
      value: this.docketDetail.fromCity,
    };

    this.consignmentTableForm.controls["fromCity"].setValue(fromCity);
    const vehicleNo = {
      name: this.docketDetail?.vehicleNo || "",
      value: this.docketDetail?.vehicleNo || "",
    };
    this.consignmentTableForm.controls["vehicleNo"].setValue(vehicleNo);
    const toCity = {
      name: this.docketDetail.toCity,
      value: this.docketDetail.toCity,
    };

    const destination = {
      name: this.docketDetail.destination,
      value: this.docketDetail.destination,
    };

    this.consignmentTableForm.controls["destination"].setValue(destination);
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
    const prqNo = {
      name: this.docketDetail.prqNo,
      value: this.docketDetail.prqNo,
    };

    this.consignmentTableForm.controls["risk"].setValue(this.docketDetail.risk);
    this.consignmentTableForm.controls["vendorType"].setValue(
      this.docketDetail.vendorType
    );

    this.consignmentTableForm.controls["prqNo"].setValue(prqNo);
    this.consignmentTableForm.controls["consignorName"].setValue(consignorName);
    this.consignmentTableForm.controls["consigneeName"].setValue(consigneeName);
    this.consignmentTableForm.controls["billingParty"].setValue(billingParty);
    this.consignmentTableForm.controls["payType"].setValue(
      this.docketDetail.payType
    );
    this.consignmentTableForm.controls["transMode"].setValue(
      this.docketDetail.transMode
    );
    this.FreightTableForm.controls["freightRatetype"].setValue(
      this.docketDetail.freightRatetype
    );
    this.consignmentTableForm.controls["packaging_type"].setValue(
      this.docketDetail.packaging_type
    );
    this.consignmentTableForm.controls["weight_in"].setValue(
      this.docketDetail.weight_in
    );
    this.consignmentTableForm.controls["cargo_type"].setValue(
      this.docketDetail.cargo_type
    );
    this.consignmentTableForm.controls["delivery_type"].setValue(
      this.docketDetail.delivery_type
    );
    this.consignmentTableForm.controls["issuing_from"].setValue(
      this.docketDetail.issuing_from
    );
    this.bindTableData();
  }

  bindTableData() {
    if (this.docketDetail.invoiceDetails.length > 0) {
      this.tableLoadIn = true;
      this.loadIn = true;
      const invoiceDetail = this.docketDetail.invoiceDetails.map((x, index) => {
        if (x) {
          if (Object.values(x).every((value) => !value)) {
            return null; // If all properties of x are empty, return null
          }
          // You can use 'x' and 'index' here
          x.id = index + 1;
          x.actions = ["Edit", "Remove"];
          return x;
        }
        return x; // Return the original element if no modification is needed
      });
      const allEmpty = invoiceDetail.every((x) => !x);
      if (!allEmpty) {
        this.invoiceData = invoiceDetail;
        this.tableLoadIn = false;
      }
      this.loadIn = false;
    }
    const fieldsToFromRemove = [
      "id",
      "actions",
      "invoice",
      "Download_Icon",
      "id",
    ];
    const containerDetail = removeFieldsFromArray(
      this.docketDetail.containerDetail,
      fieldsToFromRemove
    );

    if (containerDetail > 0) {
      this.tableLoad = true;
      this.isLoad = true;
      const containerDetail = this.docketDetail.containerDetail.map(
        (x, index) => {
          if (x) {
            if (Object.values(x).every((value) => !value)) {
              return null; // If all properties of x are empty, return null
            }
            // Modify 'x' if needed
            // For example, you can add the index to the element
            x.id = index + 1;
            x.actions = ["Edit", "Remove"];
            return x;
          }
          return x; // Return the original element if no modification is needed
        }
      );
      const allNull = containerDetail.every((x) => x === null);
      if (!allNull) {
        this.containerDetail();
        this.tableData = containerDetail;
        this.tableLoad = false;
      }

      this.isLoad = false;
    }
  }
  /*region Save*/
  flagEwayBill() {
    this.ewayBill = false;
    this.breadscrums[0].title = "Consignment Entry";
  }

  containerDetail() {
    
    const cd = this.consignmentTableForm.controls["cd"].value;
    if (cd) {
      this.contFlag = true;
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (x.name === "freightRatetype") {
          x.value.push({
            value: "C",
            name: "Per Container",
          });
        }
        return x;
      });

      this.filter.Filter(
        this.jsonContainerDetail,
        this.containerTableForm,
        this.containerTypeList,
        this.containerType,
        this.containerTypeStatus
      );
    } else {
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (x.name === "freightRatetype") {
          // Use filter to remove the object with value: "C" and name: "Per Container"
          x.value = x.value.filter(
            (item) => !(item.value === "C" && item.name === "Per Container")
          );
        }
        return x;
      });

      this.contFlag = false;
    }
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
    const vehNo =
      this.consignmentTableForm.value.vehicleNo?.value ||
      this.consignmentTableForm.value.vehicleNo;
    const controlNames = ["transMode", "payType", "vendorType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    const fieldsToRemove = ["id", "actions", "invoice"];
    const fieldsToFromRemove = [
      "id",
      "actions",
      "invoice",
      "Download_Icon",
      "id",
    ];
    const invoiceList = removeFieldsFromArray(this.invoiceData, fieldsToRemove);
    const containerlist = removeFieldsFromArray(this.tableData, fieldsToRemove);
    const invoiceFromData = removeFieldsFromArray(
      [this.invoiceTableForm.value],
      fieldsToFromRemove
    );
    const containerFromData = removeFieldsFromArray(
      [this.containerTableForm.value],
      fieldsToFromRemove
    );
    let invoiceDetails = {
      invoiceDetails:
        this.invoiceData.length > 0 ? invoiceList : invoiceFromData,
    };
    let containerDetail = {
      containerDetail:
        this.tableData.length > 0 ? containerlist : containerFromData,
    };
    const controltabNames = [
      "containerCapacity",
      "containerType",
      "freightRatetype",
      "payType",
      "transMode",
      "vendorType",
      "weight_in",
      "cargo_type",
      "delivery_type",
      "issuing_from",
    ];

    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });


    var resetData = [
      { name: "fromCity", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value.fromCity?.name },
      { name: "destination", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value.destination?.value || this.consignmentTableForm.value?.destination || "" },
      { name: "vendorName", findIn: this.consignmentTableForm, value: vendorType === "Market" ? vendorName : vendorName?.name || "" },
      { name: "vehicleNo", findIn: this.consignmentTableForm, value: vehNo },
      { name: "toCity", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value.toCity?.name || "" },
      { name: "billingParty", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value?.billingParty.name || "" },
      { name: "consignorName", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value?.consignorName.name || "" },
      { name: "consigneeName", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value?.consigneeName.name || "" },
      { name: "prqNo", findIn: this.consignmentTableForm, value: this.consignmentTableForm.value?.prqNo.value || "" },
    ];

    resetData.forEach((d) => {
      d.findIn.controls[d.name].setValue(d.value);
    })

    if (!this.isUpdate) {
      let id = {
        isComplete: 1,
        unloading: 0,
        lsNo: "",
        mfNo: "",
        entryBy: this.userName,
        entryDate: new Date(),
        unloadloc: "",
      };

      let docketDetails = {
        ...this.consignmentTableForm.value,
        ...this.FreightTableForm.value,
        ...invoiceDetails,
        ...containerDetail,
        ...id,
      };
      const party =
        this.consignmentTableForm.controls["billingParty"]?.value || "";
      let reqBody = {
        companyCode: this.companyCode,
        collectionName: "docket_temp",
        docType: "CN",
        branch: localStorage.getItem("Branch"),
        finYear: financialYear,
        data: docketDetails,
        party: party.toUpperCase(),
      };
      if (this.prqFlag) {
        const prqData = {
          prqId: this.consignmentTableForm.value?.prqNo || "",
          dktNo: this.consignmentTableForm.controls["docketNumber"].value,
        };
        await this.consigmentUtility.updatePrq(prqData, "3");
      }
      this.operationService
        .operationMongoPost("operation/docket/create", reqBody)
        .subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: "success",
              title: "Booked Successfully",
              text: "DocketNo: " + res.data.ops[0].docketNumber,
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                // Redirect to the desired page after the success message is confirmed.
                this._NavigationService.navigateTotab(
                  "docket",
                  "dashboard/Index"
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
            this._NavigationService.navigateTotab("docket", "dashboard/Index");
          }
        });
      }
    }
  }
  /*End Save*/
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
              this.containerTableForm.controls["Company_file"].setValue("");
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

  calculateFreight() {
    const freightRateType =
      this.FreightTableForm.controls["freightRatetype"].value;
    const freightRate =
      this.FreightTableForm.controls["freight_rate"]?.value || 0;
    let rateTypeMap = {};
    if (typeof freightRateType === "string") {
      rateTypeMap = {
        F: 1.0,
        P: this.getInvoiceAggValue("noofPkts"),
        W: this.getInvoiceAggValue("chargedWeight"),
        T: this.getInvoiceAggValue("chargedWeight") / 1000,
        C: this.tableData.length > 0 ? this.tableData.length : 1,
      };
    }
    const mfactor = rateTypeMap[freightRateType] || 1;
    let total = parseFloat(freightRate) * parseFloat(mfactor);
    this.FreightTableForm.controls["freight_amount"]?.setValue(total);
    this.FreightTableForm.get("grossAmount")?.setValue(
      (parseFloat(this.FreightTableForm.get("freight_amount")?.value) || 0) +
      (parseFloat(this.FreightTableForm.get("otherAmount")?.value) || 0)
    );
    this.FreightTableForm.get("totalAmount")?.setValue(
      (parseFloat(this.FreightTableForm.get("grossAmount")?.value) || 0) +
      (parseFloat(this.FreightTableForm.get("gstChargedAmount")?.value) || 0)
    );
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
          x.actions = ["Edit", "Remove"];
          return x;
        }
        return x; // Return the original element if no modification is needed
      });
      // Filter out the null values if necessary
      const filteredContainerDetail = containerDetail.filter((x) => x !== null);
      this.tableData = filteredContainerDetail;
      this.tableLoad = false;
      this.isLoad = false;
    }
  }
  /*getConsignor*/
  getConsignor() {
    const mobile =
      this.consignmentTableForm.controls["consignorName"].value?.mobile || "";
    this.consignmentTableForm.controls["ccontactNumber"].setValue(mobile);
  }
  /*End*/
  /*getConsignee*/
  getConsignee() {
    const mobile =
      this.consignmentTableForm.controls["consigneeName"].value?.mobile || "";
    this.consignmentTableForm.controls["cncontactNumber"].setValue(mobile);
  }
  /*End*/
  //validation for the Actual weight not greater then actual weight
  calculateValidation() {
    const chargedWeight = parseFloat(
      this.invoiceTableForm.controls["chargedWeight"]?.value || 0
    );
    const actualWeight = parseFloat(
      this.invoiceTableForm.controls["actualWeight"]?.value || 0
    );
    if (actualWeight > chargedWeight) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Actual weight cannot be greater than Charge weight.",
      });
      return false;
    }
    return true;
  }
  /*pincode based city*/
  async getPincodeDetail(event) {
    const cityMapping =
      event.field.name == "fromCity" ? this.fromCityStatus : this.toCityStatus;
    this.pinCodeService.getCity(
      this.consignmentTableForm,
      this.jsonControlArrayBasic,
      event.field.name,
      cityMapping
    );
  }
  /*end*/


  /*end*/
  getInvoiceAggValue(fielName) {
    if (this.invoiceData.length > 0) {
      return this.invoiceData.reduce(
        (acc, amount) => parseFloat(acc) + parseFloat(amount[fielName]),
        0
      );
    } else if (this.invoiceTableForm.value) {
      return parseFloat(this.invoiceTableForm.controls[fielName].value);
    }
    return 0;
  }
}
