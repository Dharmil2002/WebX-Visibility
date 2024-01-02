import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { ConsignmentControl, FreightControl, } from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorsForAutoComplete } from "../job-entry-page/job-entry-utility";
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
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { PrqService } from "../../Utility/module/operation/prq/prq.service";
import { StorageService } from "src/app/core/service/storage.service";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { DocketEntryModel } from 'src/app/Models/Docket/docket.model';
import { firstValueFrom } from "rxjs";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import moment from "moment";

@Component({
  selector: "app-consignment-entry-form",
  templateUrl: "./consignment-entry-form.component.html",
})

/*Please organize the code in order of priority, with the code that is used first placed at the top.*/
export class ConsignmentEntryFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  breadscrums = [
    {
      title: "Eway Bill",
      items: ["Operation"],
      active: "ConsignmentForm",
    },
  ];

  expanded = false
  backPath: string;

  isSubmit: boolean = false;
  isUpdate: boolean;
  loadIn: boolean;
  isLoad: boolean = false;
  tableLoadIn: boolean = true;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  menuItemflag: boolean = true;
  contFlag: boolean;
  marketVendor: boolean;
  ccbp: boolean = true;
  addFlag: boolean = true;
  ewayBill: boolean = true;
  prqFlag: boolean;

  jsonControlArray: any;
  jsonInvoiceDetail: any;
  jsonControlArrayConsignor: any;
  jsonControlArrayConsignee: any;
  jsonEwayBill: any;
  jsonControlArrayBasic: any;
  jsonContainerDetail: any;

  packagingTypes: AutoComplete[];
  paymentBases: AutoComplete[];
  movementTypes: AutoComplete[];
  vendorTypes: AutoComplete[];
  deliveryTypes: AutoComplete[];
  rateTypes: AutoComplete[];
  wtUnits: AutoComplete[];
  riskTypes: AutoComplete[];
  issueFrom: AutoComplete[];
  products: AutoComplete[];

  linkArray = [];

  /*in constructor inilization of all the services which required in this type script*/
  constructor(
    private fb: UntypedFormBuilder,
    private navService: NavigationService,
    private model: DocketEntryModel,
    private masterService: MasterService,
    private customerService: CustomerService,
    private filter: FilterUtils,
    private vehicleStatusService: VehicleStatusService,
    private route: Router,
    private operationService: OperationService,
    public xlsxUtils: xlsxutilityService,
    private matDialog: MatDialog,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private prqService: PrqService,
    private consigmentUtility: ConsigmentUtility,
    private storage: StorageService,
    private docketService: DocketService
  ) {
    super();
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.model.docketDetail = new DocketDetail({});
    if (navigationState != null) {

      this.isUpdate =
        navigationState.hasOwnProperty("actions") &&
        navigationState.actions[0] === "Edit Docket";
      if (this.isUpdate) {
        this.model.docketDetail = navigationState;
        this.breadscrums[0].title = "Consignment Edit";
        this.ewayBill = false;
      } else {
        this.model.prqData = navigationState;
        this.prqFlag = true;
        this.ewayBill = false;
        this.breadscrums[0].title = "Consignment Entry";
      }
    }
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getGeneralmasterData().then(() => {
      this.bindDataFromDropdown();
      this.isTableLoad = false;
    });
    this.backPath = "/dashboard/Index?tab=6";
  }

  /*Here the function which is used for the bind staticDropdown Value*/
  async getGeneralmasterData() {
    this.packagingTypes = await this.generalService.getGeneralMasterData("PKGS");
    this.paymentBases = await this.generalService.getGeneralMasterData("PAYTYP");
    this.movementTypes = await this.generalService.getGeneralMasterData("MOVTYP");
    this.vendorTypes = await this.generalService.getGeneralMasterData("VENDTYPE");
    this.deliveryTypes = await this.generalService.getGeneralMasterData("DELTYP");
    this.rateTypes = await this.generalService.getGeneralMasterData("RTTYP");
    this.wtUnits = await this.generalService.getGeneralMasterData("WTUNIT");
    this.riskTypes = await this.generalService.getGeneralMasterData("RISKTYP");
    this.issueFrom = await this.generalService.getGeneralMasterData("ISSFRM");
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");

    // Find the form control with the name 'packaging_type'
    this.setGeneralMasterData(this.model.allformControl, this.packagingTypes, "packaging_type");
    this.setGeneralMasterData(this.model.allformControl, this.paymentBases, "payType");
    this.setGeneralMasterData(this.model.allformControl, this.movementTypes, "movementType");
    this.setGeneralMasterData(this.model.allformControl, this.products, "transMode");
    this.setGeneralMasterData(this.model.allformControl, this.vendorTypes, "vendorType");
    this.setGeneralMasterData(this.model.allformControl, this.deliveryTypes, "delivery_type");
    this.setGeneralMasterData(this.model.allformControl, this.wtUnits, "weight_in");
    this.setGeneralMasterData(this.model.allformControl, this.riskTypes, "risk");
    this.setGeneralMasterData(this.model.allformControl, this.issueFrom, "issuing_from");
    const rateType= this.rateTypes.filter((x) => x.value != "RTTYP-0007");
    this.setGeneralMasterData(this.jsonControlArray,rateType, "freightRatetype");

  }

  setGeneralMasterData(controls: any[], data: AutoComplete[], controlName: string) {
    const control = controls.find((x) => x.name === controlName);
    if (control) {
      control.value = data;
    }
  }

  /* End*/
  //#region initializeFormControl
  async initializeFormControl() {
    const docketDetails = await this.docketService.docketObjectMapping(this.model.docketDetail)
    // Create LocationFormControls instance to get form controls for different sections
    this.model.ConsignmentFormControls = new ConsignmentControl(docketDetails);
    this.model.FreightFromControl = new FreightControl(docketDetails);

    // Get form controls for Driver Details section
    this.jsonControlArrayBasic =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "Basic"
      );
    this.jsonControlArrayConsignor =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignor"
      );
    this.jsonControlArrayConsignee =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignee"
      );
    this.model.allformControl = [
      ...this.jsonControlArrayBasic,
      ...this.jsonControlArrayConsignor,
      ...this.jsonControlArrayConsignee,
    ];
    this.jsonControlArray = this.model.FreightFromControl.getFreightControlControls();
    this.jsonContainerDetail = this.model.ConsignmentFormControls.getContainerDetail();
    this.jsonInvoiceDetail = this.model.ConsignmentFormControls.getInvoiceDetail();
    this.jsonEwayBill = this.model.ConsignmentFormControls.getEwayBillDetail();
    /*market vechile form group*/
    this.model.jsonMarketVehicle = this.model.ConsignmentFormControls.getMarketVehicle();
    /*End*/
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.model.consignmentTableForm = formGroupBuilder(this.fb, [
      this.model.allformControl,
    ]);
    this.model.FreightTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.model.containerTableForm = formGroupBuilder(this.fb, [
      this.jsonContainerDetail,
    ]);
    this.model.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonInvoiceDetail]);
    this.model.ewayBillTableForm = formGroupBuilder(this.fb, [this.jsonEwayBill]);
    this.commonDropDownMapping();
    this.model.consignmentTableForm.controls["payType"].setValue("P02");
    this.model.consignmentTableForm.controls["transMode"].setValue("P1");

    const filteredMode = this.model.movementType.find(item => item.name == this.storage.mode).value
    this.model.consignmentTableForm.controls["movementType"].setValue(filteredMode);

    if (this.model.prqData) {
      this.model.consignmentTableForm.controls["prqNo"].setValue({
        name: this.model.prqData.prqNo,
        value: this.model.prqData?.prqNo,
      });
    }
  }
  //#endregion
  getContainerType(event) {
    const containerType = this.model.containerTableForm.controls["containerType"].value.value;
    const containerCapacity = this.model.containerTypeList.find(
      (x) => x.name.trim() === containerType.trim()
    );
    this.model.containerTableForm.controls["containerCapacity"].setValue(
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

    let billingParty = { name: this.model.prqData?.billingParty, value: this.model.prqData?.billingPartyCode };
    //await this.customerService.getCustomerByCodeOrName(undefined, this.model.prqData?.billingParty);

    let vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.model.prqData.prqNo
    );

    let vehType = this.vendorTypes.find(f => f.name == vehicleDetail?.vendorType);

    this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.setFormValue(this.model.consignmentTableForm, "toCity", this.model.prqData, true, "toCity", "toCity");
    await this.getLocBasedOnCity();
    this.setFormValue(this.model.consignmentTableForm, "billingParty", billingParty);
    this.setFormValue(this.model.consignmentTableForm, "payType", this.model.prqData?.payTypeCode);
    this.setFormValue(this.model.consignmentTableForm, "docketDate", this.model.prqData?.pickupDate);
    this.setFormValue(this.model.consignmentTableForm, "transMode", "P1");
    this.setFormValue(this.model.consignmentTableForm, "pAddress", this.model.prqData?.pAddress);
    this.setFormValue(this.model.consignmentTableForm, "cnebp", false);
    this.setFormValue(this.model.consignmentTableForm, "cnbp", true);

    this.setFormValue(this.model.consignmentTableForm, "vendorType", vehType.value, false, "", "");

    // Done By Harikesh 
    const autoBillingConfigs = [
      { name: "cnbp", checked: true },
      { name: "cnebp", checked: false }
    ];

    autoBillingConfigs.forEach(config => {
      const autoBillingData = {
        eventArgs: { checked: config.checked },
        field: { name: config.name }
      };
      this.onAutoBillingBased(autoBillingData);
    });

    await this.vendorFieldChanged()

    if (vehType.value == "4") {
      this.setFormValue(this.model.consignmentTableForm, "vendorName", vehicleDetail.vendor);
      this.setFormValue(this.model.consignmentTableForm, "vehicleNo", this.model.prqData?.vehicleNo, false);
    }
    else {
      let vendors = await getVendorsForAutoComplete(this.masterService, vehicleDetail.vendor, parseInt(vehType.value));
      const vendor = vendors[0];
      this.setFormValue(this.model.consignmentTableForm, "vendorName", vendor);
      this.model.consignmentTableForm.controls['vehicleNo'].setValue({ name: this.model.prqData?.vEHNO || "", value: this.model.prqData?.vEHNO || "" });

      //this.setFormValue(this.model.consignmentTableForm, "vendorName", vehicleDetail, true, "vendor", "vendor");
      //this.setFormValue(this.model.consignmentTableForm, "vehicleNo", this.model.prqData?.vehicleNo, true,"vehicleNo","vehicleNo");
    }

    if (this.model.prqData.carrierTypeCode == "3") {
      this.model.containerTableForm.controls["containerType"].setValue({ name: this.model.prqData?.typeContainer || "", value: this.model.prqData?.typeContainerCode || "" });
      this.model.containerTableForm.controls["containerCapacity"].setValue(this.model.prqData?.size || 0);
    }
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

    const vehicleList = await getVehicleStatusFromApi(
      this.storage.companyCode,
      this.operationService
    );
    /* reasone for diffreacial the both vehicle list and all vehicle is  for all 
    vehicle are for the market vehicle autofield details agaist prq */
    this.model.allVehicle = vehicleList;
    this.model.vehicleList = vehicleList;
    const vehFieldMap = this.model.vehicleList.map((x) => {
      return {
        name: x.vehNo,
        value: x.vehNo
      };
    });
    /* end */
    const resContainerType =
      await this.consigmentUtility.containorConsigmentDetail();
    this.model.containerTypeList = resContainerType;

    this.filter.Filter(this.jsonControlArrayBasic, this.model.consignmentTableForm, vehFieldMap, this.model.vehicleNo, this.model.vehicleNoStatus);

    if (this.prqFlag && this.model.prqData.carrierTypeCode == "3") {
      this.model.consignmentTableForm.controls["cd"].setValue(true);
      this.contFlag = true;
      this.containerDetail();
    }
    this.isUpdate && this.autofillDropDown();
    this.prqFlag && await this.prqDetail();

  }

  async getPrqDetails() {

    const prqNo = await this.prqService.getPrqForBooking(
      this.storage.branch,
      this.model.consignmentTableForm.value.billingParty.value,
      this.model.consignmentTableForm.get("payType")?.value
    );
    this.model.prqNoDetail = prqNo.allPrqDetail;

    const prqDetail = prqNo.allPrqDetail.map((x) => ({
      name: x.prqNo,
      value: x.prqNo,
    }));

    this.filter.Filter(this.jsonControlArrayBasic, this.model.consignmentTableForm, prqDetail, this.model.prqNo, this.model.prqNoStatus);
  }

  /* below function was the call when */
  async getLocBasedOnCity() {

    const destinationMapping = await this.locationService.locationFromApi({
      locCity: this.model.consignmentTableForm.get("toCity")?.value?.value.toUpperCase(),
    });
    this.filter.Filter(this.model.allformControl, this.model.consignmentTableForm, destinationMapping, this.model.destination, this.model.destinationStatus);
  }

  cancel() {
    this.navService.navigateTotab("docket", "dashboard/Index");
  }
  //#endregion

  async commonDropDownMapping() {

    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this.model[mapping.target] = data.name; // Set the target property with the value of the name property
          this.model[`${mapping.target}Status`] =
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
      locCode: this.storage.branch,
    });
    const city = {
      name: destinationMapping[0].city,
      value: destinationMapping[0].city,
    };
    //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.model.consignmentTableForm.controls["fromCity"].setValue(city);

    // mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    // mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    //mapControlArray(this.contractControlArray, destinationMapping);
  }
  /*below function is fire when vendor Name is select*/
  getVehicleFilter() {

    const vehicleList = this.model.vehicleList.filter((x) => x.vendor == this.model.consignmentTableForm.value.vendorName.name).map((x) => {
      return { name: x.vehNo, value: x.vehNo };
    });
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.model.consignmentTableForm,
      vehicleList,
      this.model.vehicleNo,
      this.model.vehicleNoStatus
    );
  }
  /*End*/
  onAutoBillingBased(event) {
    const fieldConsignorName = 'consignorName';
    const fieldConsigneeName = 'consigneeName';
    const fieldContactNumber = 'ccontactNumber';
    const fieldConsigneeContactNumber = 'cncontactNumber';
    const fieldBillingParty = 'billingParty';
    const { field: { name: fieldName }, eventArgs: { checked } } = event;
    const { contactNo } = this.model.prqData || {};
    const billingPartyValue = this.model.consignmentTableForm.controls[fieldBillingParty].value;
    const mobile = billingPartyValue?.mobile || '';

    const updateForm = (nameField, contactField, billingPartyName) => {
      this.model.consignmentTableForm.controls[nameField].setValue(billingPartyName);
      this.model.consignmentTableForm.controls[contactField].setValue(contactNo || mobile);
    };

    if (checked) {
      switch (fieldName) {
        case 'cnbp':
          updateForm(fieldConsignorName, fieldContactNumber, billingPartyValue);
          this.expanded = true
          break;
        case 'cnebp':
          updateForm(fieldConsigneeName, fieldConsigneeContactNumber, billingPartyValue);
          break;
        default:
        // Handle other cases or throw an error
      }
    } else {
      // done by harikesh 
      switch (fieldName) {
        case 'cnbp':
          [fieldConsignorName, fieldContactNumber]
            .forEach(field => this.model.consignmentTableForm.controls[field].setValue(''));
          this.expanded = false
          break;
        case 'cnebp':
          [fieldConsigneeName, fieldConsigneeContactNumber]
            .forEach(field => this.model.consignmentTableForm.controls[field].setValue(''));
          break;
        default:
        // Handle other cases or throw an error
      }

    }
  }

  prqSelection() {

    this.model.prqData = this.model.prqNoDetail.find(
      (x) => x.prqNo == this.model.consignmentTableForm.controls["prqNo"].value.value
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
  async addData(event) {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.model.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.containerNumber === this.model.containerTableForm.value.containerNumber
      );
      if (exist) {
        this.model.containerTableForm.controls["containerNumber"].setValue("");
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
    if (typeof this.model.containerTableForm.value.containerType === "string") {
      this.model.containerTableForm.controls["containerType"].setValue("");
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
      containerNumber: this.model.containerTableForm.value.containerNumber,
      containerType: this.model.containerTableForm.value.containerType.value,
      containerCapacity: this.model.containerTableForm.value.containerCapacity,
      isEmpty: this.model.containerTableForm.value.isEmpty ? "Y" : "N",
      invoice: false,
      actions: ["Edit", "Remove"],
    };
    this.model.tableData.push(json);
    Object.keys(this.model.containerTableForm.controls).forEach((key) => {
      this.model.containerTableForm.get(key).clearValidators();
      this.model.containerTableForm.get(key).updateValueAndValidity();
    });

    this.model.containerTableForm.controls["containerNumber"].setValue("");
    this.model.containerTableForm.controls["containerType"].setValue("");
    this.model.containerTableForm.controls["containerCapacity"].setValue("");
    this.model.containerTableForm.controls["isEmpty"].setValue(false);
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.model.containerTableForm.controls).forEach((key) => {
      this.model.containerTableForm.get(key).setValidators(Validators.required);
    });
    this.model.containerTableForm.updateValueAndValidity();
  }
  /*End*/
  /*this function*/
  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.model.tableData = this.model.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const excludedKeys = ['Download_Icon', 'Company_file', 'isEmpty'];
      const atLeastOneValuePresent = Object.keys(this.model.containerTableForm.controls)
        .filter(key => !excludedKeys.includes(key)) // Filter out excluded keys
        .some(key => {
          const control = this.model.containerTableForm.get(key);
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
            this.fillContainerDetails(data)
          }
        });
      }
      else {
        this.fillContainerDetails(data)
      }
    }
  }

  async addInvoiceData(event) {
    if (await this.calculateValidation()) {
      const invoice = this.model.invoiceData;
      if (invoice.length > 0) {
        const exist = invoice.find(
          (x) => x.invoiceNo === this.model.invoiceTableForm.value.invoiceNo
        );
        if (exist) {
          this.model.invoiceTableForm.controls["invoiceNo"].setValue("");
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
        ewayBillNo: this.model.invoiceTableForm.value.ewayBillNo,
        expiryDate: this.model.invoiceTableForm.value.expiryDate
          ? formatDate(this.model.invoiceTableForm.value.expiryDate, "dd-MM-yy HH:mm")
          : formatDate(new Date().toUTCString(), "dd-MM-yy HH:mm"),
        invoiceNo: this.model.invoiceTableForm.value.invoiceNo,
        invoiceAmount: this.model.invoiceTableForm.value.invoiceAmount,
        noofPkts: this.model.invoiceTableForm.value.noofPkts,
        materialName: this.model.invoiceTableForm.value.materialName,
        actualWeight: this.model.invoiceTableForm.value.actualWeight,
        chargedWeight: this.model.invoiceTableForm.value.chargedWeight,
        invoice: true,
        expiryDateO: this.model.invoiceTableForm.value.expiryDate,
        actions: ["Edit", "Remove"],
      };
      this.model.invoiceData.push(json);
      this.model.invoiceTableForm.reset();
      this.tableLoadIn = false;
      this.loadIn = false;
    }
  }

  fillInvoice(data: any) {
    if (data.label.label === "Remove") {
      this.model.invoiceData = this.model.invoiceData.filter((x) => x.id !== data.data.id);
    } else {
      const atLeastOneValuePresent = Object.keys(this.model.invoiceTableForm.controls)
        .some(key => {
          const control = this.model.invoiceTableForm.get(key);
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

  vendorFieldChanged() {

    const vendorType = this.model.consignmentTableForm.value.vendorType !== undefined
      ? this.model.consignmentTableForm.value.vendorType
      : '4';
    const vendorName = this.model.consignmentTableForm.get("vendorName");
    const vehicleNo = this.model.consignmentTableForm.get("vehicleNo");

    this.jsonControlArrayBasic.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
      if (x.name === "vehicleNo") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
    });
    if (vendorType !== "4") {
      // const vendorDetail = this.model.vendorDetail.filter(
      //   (x) => x.type.toLowerCase() == vendorType.toLowerCase()
      // );
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.model.consignmentTableForm,
        [],
        this.model.vendorName,
        this.model.vendorNameStatus
      );
      const vehFieldMap = this.model.vehicleList
        .filter((x) => x.vendorTypeCode == vendorType)
        .map((x) => {
          return { name: x.vehNo, value: x.vehNo };
        });
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.model.consignmentTableForm,
        vehFieldMap,
        this.model.vehicleNo,
        this.model.vehicleNoStatus
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
      // if(this.prqFlag&&this.marketVendor){
      //  const vehDetail:vehicleMarket=this.model.allVehicle.find((x)=>x.vehNo==this.model.prqData.vehicleNo); 
      //   this.marketVehicleTableForm.controls['vehNo'].setValue("")
      // }
    }
    vendorName.setValue("");
    vehicleNo.setValue("");
  }
  /*Below function is only call those time when user can come to only edit a
   docket not for prq or etc etc*/
  async autofillDropDown() {

    const docketDetails = await this.docketService.docketObjectMapping(this.model.docketDetail);
    this.model.docketDetail.invoiceDetails = await this.docketService.getDocketByDocNO(docketDetails.docketNumber, "docket_invoices");
    this.model.docketDetail.containerDetail = await this.docketService.getDocketByDocNO(docketDetails.docketNumber, "docket_containers");

    const { controls } = this.model.consignmentTableForm;

    // Helper function to set form control values.
    const setControlValue = (controlName, value) => {
      controls[controlName].setValue(value);
    };
    if (!docketDetails) {
      return false
    }
    // Set vendor details.
    const vendor = docketDetails.vendorType != "4" ? { name: docketDetails.vendorName, value: docketDetails.vendorCode } : docketDetails.vendorName;
    setControlValue("vendorType", docketDetails.vendorType.toString());
    // Trigger vendor field change actions.
    this.vendorFieldChanged();
    setControlValue("vendorName", vendor);
    // Set city details.
    setControlValue("fromCity", { name: docketDetails.fromCity, value: docketDetails.fromCity });
    setControlValue("toCity", { name: docketDetails.toCity, value: docketDetails.toCity });
    setControlValue("destination", { name: docketDetails.destination, value: docketDetails.destination });
    // Set vehicle number.
    setControlValue("vehicleNo", { name: docketDetails.vehicleNo || "", value: docketDetails.vehicleNo || "" });
    // Find and set parties.
    const billingPartyObj = { name: docketDetails.billingPartyName, value: docketDetails.billingParty };
    const consignorNameObj = { name: docketDetails.consignorName, value: docketDetails.consignorCode };
    const consigneeNameObj = { name: docketDetails.consigneeName, value: docketDetails.consigneeCode };
    setControlValue("billingParty", billingPartyObj);
    setControlValue("consignorName", consignorNameObj);
    setControlValue("consigneeName", consigneeNameObj);
    // Set various details.
    setControlValue("risk", docketDetails.risk);
    setControlValue("prqNo", { name: docketDetails.prqNo, value: docketDetails.prqNo });
    setControlValue("payType", docketDetails.payType);
    setControlValue("transMode", docketDetails.transMode);
    setControlValue("packaging_type", docketDetails.packaging_type);
    setControlValue("weight_in", docketDetails.weight_in);
    setControlValue("delivery_type", docketDetails.delivery_type);
    setControlValue("issuing_from", docketDetails.issuing_from);

    // Set Freight Table Form details.
    this.model.FreightTableForm.controls["freightRatetype"].setValue(docketDetails.freightRatetype);

    // Bind table data after form update.
    this.bindTableData();
  }
  bindTableData() {

    if (this.model.docketDetail.invoiceDetails.length > 0) {
      this.tableLoadIn = true;
      this.loadIn = true;
      const invoiceDetail = this.model.docketDetail.invoiceDetails.map((x, index) => {
        if (!x || Object.values(x).every((value) => value === null || value === undefined || value === undefined)) {
          return null; // If x is null or all properties of x are null or undefined, return null
        }
        if (!x.iNVNO) {
          return null;
        }
        // You can use 'x' and 'index' here
        x.id = index + 1;
        x.ewayBillNo = `${x.eWBNO}`;
        x.expiryDate = x.eXPDT
          ? formatDate(x.eXPDT, "dd-MM-yy HH:mm")
          : formatDate(new Date().toUTCString(), "dd-MM-yy HH:mm");
        x.invoiceNo = x.iNVNO;
        x.invoiceAmount = x.iNVAMT;
        x.noofPkts = x.pKGS;
        x.materialName = x.mTNM;
        x.actualWeight = x.aCTWT;
        x.chargedWeight = x.cHRWT;
        x.invoice = true;
        x.expiryDateO = x.eXPDT;
        x.actions = ["Edit", "Remove"];

        return x;
      });

      this.model.invoiceData = invoiceDetail.filter((x) => x !== null);
      this.tableLoadIn = this.model.invoiceData.length > 0;
      this.loadIn = false;
      const allEmpty = invoiceDetail.every((x) => !x);
      if (!allEmpty) {
        this.model.invoiceData = invoiceDetail;
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
      this.model.docketDetail.containerDetail,
      fieldsToFromRemove
    );

    if (containerDetail.length > 0) {
      this.contFlag = true;
      this.tableLoad = true;
      this.isLoad = true;
      this.model.consignmentTableForm.controls["cd"].setValue(true);
      const containerDetail = this.model.docketDetail.containerDetail.map(
        (x, index) => {
          if (x) {
            if (Object.values(x).every((value) => !value)) {
              return null; // If all properties of x are empty, return null
            }
            if (!x.cNID) {
              return null;
            }
            // Modify 'x' if needed
            // For example, you can add the index to the element
            x.id = index + 1;
            x.containerNumber = x.cNID;
            x.containerCapacity = x.cNCPT;
            x.containerType = x.cNTYPN;
            x.isEmpty = x.isEMPT;
            x.invoice = false;
            x.actions = ["Edit", "Remove"];
            return x;
          }
          return x; // Return the original element if no modification is needed
        }
      );
      const allNull = containerDetail.every((x) => x === null);
      if (!allNull) {
        this.containerDetail();
        this.model.tableData = containerDetail;
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

    const cd = this.model.consignmentTableForm.controls["cd"].value;
    if (cd) {
      this.contFlag = true;
      this.setGeneralMasterData(this.jsonControlArray,this.rateTypes, "freightRatetype");
      this.filter.Filter(
        this.jsonContainerDetail,
        this.model.containerTableForm,
        this.model.containerTypeList,
        this.model.containerType,
        this.model.containerTypeStatus
      );
    } else {
      const rateType= this.rateTypes.filter((x) => x.value != "RTTYP-0007");
      this.setGeneralMasterData(this.jsonControlArray,rateType, "freightRatetype");
      this.contFlag = false;
    }
  }

  async save() {

    this.isSubmit = true;
    // Remove all form errors
    const tabcontrols = this.model.consignmentTableForm;
    clearValidatorsAndValidate(tabcontrols);
    const contractcontrols = this.model.consignmentTableForm;
    clearValidatorsAndValidate(contractcontrols);
    /*End*/
    const vendorType = this.model.consignmentTableForm.value.vendorType;
    const vendorName = this.model.consignmentTableForm.value.vendorName;
    const vehNo = this.model.consignmentTableForm.value.vehicleNo?.value ||
      this.model.consignmentTableForm.value.vehicleNo;

    const controlNames = ["transMode", "payType", "vendorType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.model.consignmentTableForm.value[controlName])) {
        this.model.consignmentTableForm.controls[controlName].setValue("");
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
    const invoiceList = removeFieldsFromArray(this.model.invoiceData, fieldsToRemove);
    const containerlist = removeFieldsFromArray(this.model.tableData, fieldsToRemove);
    const invoiceFromData = removeFieldsFromArray(
      [this.model.invoiceTableForm.value],
      fieldsToFromRemove
    );
    const containerFromData = removeFieldsFromArray(
      [this.model.containerTableForm.value],
      fieldsToFromRemove
    );
    let invoiceDetails = {
      invoiceDetails:
        this.model.invoiceData.length > 0 ? invoiceList : invoiceFromData,
    };
    const container = containerFromData.value?.containerNumber || "";
    let containerDetail = {
      containerDetail: this.model.tableData.length > 0
        ? containerlist
        : container ? containerFromData.value : []
    };

    const controltabNames = [
      "containerCapacity",
      "containerType",
      "freightRatetype",
      "payType",
      "transMode",
      "vendorType",
      "weight_in",
      "delivery_type",
      "issuing_from",
    ];

    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.model.consignmentTableForm.value[controlName])) {
        this.model.consignmentTableForm.controls[controlName].setValue("");
      }
    });


    let resetData = [
      { name: "fromCity", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value.fromCity?.name },
      { name: "toCity", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value.toCity?.name || "" },
      { name: "destination", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value.destination?.value || this.model.consignmentTableForm.value?.destination || "" },
      //{ name: "vendorName", findIn: this.model.consignmentTableForm, value: vendorType === "Market" ? vendorName : vendorName?.name || "" },
      { name: "vehicleNo", findIn: this.model.consignmentTableForm, value: vehNo },
      //{ name: "billingParty", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.billingParty.name || "" },
      //{ name: "consignorName", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.consignorName.name || "" },
      //{ name: "consigneeName", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.consigneeName.name || "" },
      { name: "prqNo", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.prqNo.value || "" },
    ];

    resetData.forEach((d) => {
      d.findIn.controls[d.name].setValue(d.value);
    })

    if (!this.isUpdate) {
      let id = {
        isComplete: 1,
      };

      let docketDetails = {
        ...this.model.consignmentTableForm.value,
        ...this.model.FreightTableForm.value,
        ...invoiceDetails,
        ...containerDetail,
        ...id,
      };
      const bParty = this.model.consignmentTableForm.value.billingParty;
      const cSGE = this.model.consignmentTableForm.value.consigneeName;
      const cSGN = this.model.consignmentTableForm.value.consignorName;
      docketDetails["billingParty"] = bParty?.value;
      docketDetails["billingPartyName"] = bParty?.name;
      docketDetails["consignorCode"] = cSGN?.value;
      docketDetails["consignorName"] = cSGN?.name;
      docketDetails["consigneeCode"] = cSGE?.value;
      docketDetails["consigneeName"] = cSGE?.name;
      docketDetails["vendorCode"] = vendorType === "4" ? "8888" : vendorName?.value || "";
      docketDetails["vendorName"] = vendorType === "4" ? vendorName : vendorName?.name || "";
      let tHour = parseInt(this.model.consignmentTableForm.controls['tran_hour'].value, 0);
      let tDay = parseInt(this.model.consignmentTableForm.controls['tran_day'].value, 0);
      docketDetails["tran_hour"] = (tDay * 24) + tHour;
      docketDetails["tran_day"] = 0;
      docketDetails["cURR"] = 'INR';
      delete docketDetails.tran_day;
      const controlNames =
        [
          {
            dataArray: 'A',
            controls: [
              { controlName: 'payType', name: 'payTypeName', value: 'payType' },
              { controlName: 'transMode', name: 'transModeName', value: 'transMode' },
              { controlName: 'movementType', name: 'movementTypeNM', value: 'movementType' },
              { controlName: 'vendorType', name: 'vendorTypeName', value: 'vendorType' },
              { controlName: 'packaging_type', name: 'packaging_type_Name', value: 'packaging_type' },
              { controlName: 'risk', name: 'riskName', value: 'risk' },
              { controlName: 'delivery_type', name: 'delivery_type_Name', value: 'delivery_type' },
              { controlName: 'issuing_from', name: 'issuing_from_Name', value: 'issuing_from' }
            ]
          },
          {
            dataArray: 'F',
            controls: [{ controlName: 'freightRatetype', name: 'freightRatetypeName', value: 'freightRatetype' }]
          }
        ];

      controlNames.forEach((g) => {
        const data = (g.dataArray === "F" ? this.jsonControlArray : this.model.allformControl);
        const formGrop = (g.dataArray === "F" ? this.model.FreightTableForm : this.model.consignmentTableForm);
        g.controls.forEach((c) => {
          let ctrl = formGrop.controls[c.controlName];
          if (ctrl && ctrl.value) {
            docketDetails[c.value] = ctrl.value;
            let cData = data.find(f => f.name == c.controlName).value.find(f => f.value == ctrl.value);
            if (cData) {
              docketDetails[c.name] = cData.name;
            }
          }
        });
      });

      const Pkg = invoiceDetails ? invoiceDetails.invoiceDetails.reduce((a, c) => a + (parseInt(c.noofPkts) || 0), 0) : 0;
      const Wt = invoiceDetails ? invoiceDetails.invoiceDetails.reduce((a, c) => a + (parseFloat(c.actualWeight) || 0), 0) : 0;
      const CWt = invoiceDetails ? invoiceDetails.invoiceDetails.reduce((a, c) => a + (parseFloat(c.chargedWeight) || 0), 0) : 0;

      docketDetails["pKGS"] = Pkg;
      const WtKg = Wt * 1000; // Convert Wt to kg (tons to kg)
      const CWtKg = CWt * 1000; // Convert CWt to kg (tons to kg)
      docketDetails["aCTWT"] = WtKg;
      docketDetails["cHRWT"] = CWtKg;
      docketDetails["cFTWT"] = 0;
      docketDetails["vOL"] = 0;
      docketDetails["volume_in"] = 'FT';
      docketDetails["oSTS"] = 1;
      docketDetails["oSTSN"] = 'Booked';
      docketDetails["fSTS"] = 0;
      docketDetails["fSTSN"] = 'Pending';
      docketDetails["status"] = `Booked at ${docketDetails['origin']} on ${moment(docketDetails['docketDate']).format('DD MMM YY HH:mm:ss')}`;
      docketDetails["cONTRACT"] = '';
      docketDetails["eNTDT"] = new Date();
      docketDetails["eNTLOC"] = this.storage.branch;
      docketDetails["eNTBY"] = this.storage.userName;

      let invDet = [];
      let contDet = [];
      invoiceDetails.invoiceDetails.forEach(i => {
        invDet.push({
          cID: this.storage.companyCode,
          //dKTNO:  //To be set from service
          iNVNO: i.invoiceNo,
          iNVAMT: i.invoiceAmount,
          cURR: 'INR',
          eWBNO: i.ewayBillNo,
          eXPDT: i.expiryDateO,
          pKGS: (parseInt(i.noofPkts) || 0),
          mTNM: i.materialName,
          aCTWT: (parseFloat(i.actualWeight) || 0),
          cFTWT: 0,
          cHRWT: (parseFloat(i.chargedWeight) || 0),
          vOL: {
            uNIT: "FT",
            l: 0.000,
            b: 0.000,
            h: 0.000,
            cU: 0.00
          },
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName
        });
      });

      containerDetail.containerDetail.forEach(i => {
        let container = this.model.containerTypeList.find(f => f.name.trim() == i.containerType.trim());
        contDet.push({
          cID: this.storage.companyCode,
          //dKTNO:  //To be set from service
          cNID: i.containerNumber,
          cNTYP: container?.value || i.containerType,
          cNTYPN: container?.name || "",
          cNCPT: parseInt(i.containerCapacity),
          isEMPT: i.isEmpty,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName
        });
      });

      docketDetails["invoiceDetails"] = invDet;
      docketDetails["containerDetail"] = contDet;
      let docketFin = {
        _id: "",
        cID: this.storage.companyCode,
        dKTNO: "",
        pCD: bParty?.value,
        pNM: bParty?.name,
        bLOC: this.storage.branch,
        cURR: "INR",
        fRTAMT: this.model.FreightTableForm.controls["freight_amount"].value,
        oTHAMT: this.model.FreightTableForm.controls["otherAmount"].value,
        gROAMT: this.model.FreightTableForm.controls["grossAmount"].value,
        rCM: this.model.FreightTableForm.controls["rcm"].value,
        gSTAMT: this.model.FreightTableForm.controls["gstAmount"].value,
        gSTCHAMT: this.model.FreightTableForm.controls["gstChargedAmount"].value,
        cHG: "",
        tOTAMT: this.model.FreightTableForm.controls['totalAmount'].value,
        sTS: 0,
        sTSNM: "Booked",
        sTSTM: new Date(),
        isBILLED: false,
        bILLNO: "",
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName,
        mODDT: "",
        mODLOC: "",
        mODBY: ""
      }
      docketDetails["docketFin"] = docketFin;
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets",
        docType: "CN",
        branch: this.storage.branch,
        finYear: financialYear,
        data: docketDetails,
        party: docketDetails["billingPartyName"],
      };
      if (this.prqFlag) {
        const prqData = {
          prqId: this.model.consignmentTableForm.value?.prqNo || "",
          dktNo: this.model.consignmentTableForm.controls["docketNumber"].value,
        };
        const update = {
          sTS: "3",
          sTSNM: "Ready For THC"
        }
        await this.consigmentUtility.updatePrq(prqData, update);
      }
      firstValueFrom(this.operationService.operationMongoPost("operation/docket/create", reqBody))
        .then((res: any) => {
          Swal.fire({
            icon: "success",
            title: "Booked Successfully",
            text: "DocketNo: " + res.data,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page after the success message is confirmed.
              this.navService.navigateTotab(
                "docket",
                "dashboard/Index"
              );
            }
          });
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Something went wrong! ${err.message}`,
            showConfirmButton: true,
          });
        });
    } else {

      vendorName
      let docketDetails = {
        ...this.model.consignmentTableForm.value,
        ...this.model.FreightTableForm.value,
        ...invoiceDetails,
        ...containerDetail
      };
      const jsonControl = [
        ...this.jsonControlArrayBasic,
        ...this.jsonControlArrayConsignor,
        ...this.jsonControlArrayConsignee,
        ... this.jsonControlArray,
      ]
      let invDet = [];
      let contDet = [];
      invoiceDetails.invoiceDetails.forEach(i => {
        invDet.push({
          _id: `${this.storage.companyCode}-${docketDetails.docketNumber}-${i.invoiceNo}`,
          cID: this.storage.companyCode,
          dKTNO: docketDetails.docketNumber,  //To be set from service
          iNVNO: i.invoiceNo,
          iNVAMT: i.invoiceAmount,
          cURR: 'INR',
          eWBNO: i.ewayBillNo,
          eXPDT: i.expiryDateO,
          pKGS: (parseInt(i.noofPkts) || 0),
          mTNM: i.materialName,
          aCTWT: (parseFloat(i.actualWeight) || 0),
          cFTWT: 0,
          cHRWT: (parseFloat(i.chargedWeight) || 0),
          vOL: {
            uNIT: "FT",
            l: 0.000,
            b: 0.000,
            h: 0.000,
            cU: 0.00
          },
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName
        });
      });

      containerDetail.containerDetail.forEach(i => {
        let container = this.model.containerTypeList.find(f => f.name.trim() == i.containerType.trim());
        contDet.push({
          _id: `${this.storage.companyCode}-${docketDetails.docketNumber}-${i.containerNumber}`,
          cID: this.storage.companyCode,
          dKTNO: docketDetails.docketNumber,
          cNID: i.containerNumber,
          cNTYP: container?.value || i.containerType,
          cNTYPN: container?.name || "",
          cNCPT: parseInt(i.containerCapacity),
          isEMPT: i.isEmpty,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName
        });
      });

      const reverseDocketObjectMapping = await this.docketService.reverseDocketObjectMapping(docketDetails, jsonControl);

      const filter = { "dKTNO": reverseDocketObjectMapping.docNo }
      await Promise.all([
        this.docketService.updateDocket(reverseDocketObjectMapping, reverseDocketObjectMapping.docNo),
        this.docketService.updateManyDockets(invDet, filter, "docket_invoices"),
        this.docketService.updateManyDockets(contDet, filter, "docket_containers"),
        this.docketService.addEventData(docketDetails),
        this.docketService.updateOperationData(docketDetails)
      ]);

      Swal.fire({
        icon: "success",
        title: "Docket Update Successfully",
        text: "DocketNo: " + this.model.consignmentTableForm.controls["docketNumber"].value,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.navService.navigateTotab("docket", "dashboard/Index");
        }
      });

    }
  }
  async addDocketNestedtDetail(dkt, invoiceDetails) {

    // Assuming invoiceDetails might be null or an empty array
    const totalPkg = invoiceDetails ? invoiceDetails.invoiceDetails.reduce((accumulator, currentValue) => accumulator + (parseInt(currentValue.noofPkts) || 0), 0) : 0;
    const totalWt = invoiceDetails ? invoiceDetails.invoiceDetails.reduce((accumulator, currentValue) => accumulator + (parseFloat(currentValue.actualWeight) || 0), 0) : 0;

    const data = {
      "_id": `${this.storage.companyCode}-${dkt}-0`,
      "cID": this.storage.companyCode,
      "dKTNO": dkt,
      "sFX": 0,
      "cLOC": this.storage.branch,
      "cNO": "",
      "nLoc": "",
      "tId": "",
      "tOTWT": parseFloat(totalWt) * 1000,/*temporary calucation*/
      "tOTPKG": totalPkg,
      "vEHNO": "",
      "aRRTM": "",
      "aRRPKG": "",
      "aRRWT": "",
      "dTime": "",
      "dPKG": "",
      "dWT": "",
      "sTS": "",
      "sTSTM": "",
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName,
      "eNTDT": new Date(),
      "mODDT": "",
      "mODLOC": "",
      "mODBY": ""
    }
    await this.docketService.addDktDetail(data);
    Swal.fire({
      icon: "success",
      title: "Booked Successfully",
      text: "DocketNo: " + dkt,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the desired page after the success message is confirmed.
        this.navService.navigateTotab(
          "docket",
          "dashboard/Index"
        );
      }
    });
  }
  /*End Save*/
  public selectedFile(event) {

    let fileList: FileList = event.eventArgs;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then((jsonData) => {
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
                TakeFromList: this.model.containerTypeList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
        ];

        let rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        rPromise.then(response => {
          this.OpenPreview(response);
          this.model.containerTableForm.controls["Company_file"].setValue("");
        })
          .catch(error => {
            console.error("Validation error:", error);
            // Handle errors here
          });
      });
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
        this.model.previewResult = result;
        this.containorCsvDetail();
      }
    });
  }

  calculateFreight() {
    const freightRateType =
      this.model.FreightTableForm.controls["freightRatetype"].value;
    const freightRate =
      this.model.FreightTableForm.controls["freight_rate"]?.value || 0;
    let rateTypeMap = {};
    if (typeof freightRateType === "string") {
      rateTypeMap = {
        'RTTYP-0001': 1.0,
        'RTTYP-0006': this.getInvoiceAggValue("noofPkts"),
        'RTTYP-0005': this.getInvoiceAggValue("chargedWeight") * 1000,
        'RTTYP-0002': this.getInvoiceAggValue("chargedWeight"),
        'RTTYP-0007': this.model.tableData.length > 0 ? this.model.tableData.length : 1,
      };
    }
    const mfactor = rateTypeMap[freightRateType] || 1;
    let total = parseFloat(freightRate) * parseFloat(mfactor);
    this.model.FreightTableForm.controls["freight_amount"]?.setValue(total);
    this.model.FreightTableForm.get("grossAmount")?.setValue(
      (parseFloat(this.model.FreightTableForm.get("freight_amount")?.value) || 0) +
      (parseFloat(this.model.FreightTableForm.get("otherAmount")?.value) || 0)
    );
    this.model.FreightTableForm.get("totalAmount")?.setValue(
      (parseFloat(this.model.FreightTableForm.get("grossAmount")?.value) || 0) +
      (parseFloat(this.model.FreightTableForm.get("gstChargedAmount")?.value) || 0)
    );
  }

  containorCsvDetail() {
    if (this.model.previewResult.length > 0) {
      this.tableLoad = true;
      this.isLoad = true;
      let containerNo = [];

      const containerDetail = this.model.previewResult.map((x, index) => {
        if (x) {
          const detail = containerNo.includes(x.containerNumber);
          const match = this.model.containerTypeList.find(
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
          if (!x.isEmpty) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `IsEmpty is Required`,
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
      this.model.tableData = filteredContainerDetail;
      this.tableLoad = false;
      this.isLoad = false;
    }
  }
  /*getConsignor*/
  getConsignor() {
    const mobile =
      this.model.consignmentTableForm.controls["consignorName"].value?.mobile || "";
    this.model.consignmentTableForm.controls["ccontactNumber"].setValue(mobile);
  }
  /*End*/
  /*getConsignee*/
  getConsignee() {
    const mobile =
      this.model.consignmentTableForm.controls["consigneeName"].value?.mobile || "";
    this.model.consignmentTableForm.controls["cncontactNumber"].setValue(mobile);
  }
  /*End*/
  //validation for the Actual weight not greater then actual weight
  calculateValidation() {
    const chargedWeight = parseFloat(
      this.model.invoiceTableForm.controls["chargedWeight"]?.value || 0
    );
    const actualWeight = parseFloat(
      this.model.invoiceTableForm.controls["actualWeight"]?.value || 0
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
    const cityMapping = event.field.name == "fromCity" ? this.model.fromCityStatus : this.model.toCityStatus;
    await this.pinCodeService.getCity(
      this.model.consignmentTableForm,
      this.jsonControlArrayBasic,
      event.field.name,
      cityMapping
    );
  }
  /*end*/

  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(this.model.consignmentTableForm, this.model.allformControl, event.field.name, this.model.customerStatus);
  }

  async getVendors(event) {
    if (event.eventArgs.length >= 3) {
      const vendorType = this.model.consignmentTableForm.controls["vendorType"].value;
      if (vendorType && vendorType !== "") {
        let vendors = await getVendorsForAutoComplete(this.masterService, event.eventArgs, parseInt(vendorType));
        this.filter.Filter(this.jsonControlArrayBasic, this.model.consignmentTableForm, vendors, this.model.vendorName, this.model.vendorNameStatus);
      }
    }
  }

  /*end*/
  getInvoiceAggValue(fielName) {
    if (this.model.invoiceData.length > 0) {
      return this.model.invoiceData.reduce(
        (acc, amount) => parseFloat(acc) + parseFloat(amount[fielName]),
        0
      );
    } else if (this.model.invoiceTableForm.value) {
      return parseFloat(this.model.invoiceTableForm.controls[fielName].value);
    }
    return 0;
  }
  /*AutoFiill Invoice data*/
  fillInvoiceDetails(data) {
    // Define a mapping of form control names to their respective keys in the incoming data
    const formFields = {
      ewayBillNo: "ewayBillNo",
      expiryDate: "expiryDateO",
      invoiceNo: "invoiceNo",
      invoiceAmount: "invoiceAmount",
      noofPkts: "noofPkts",
      materialName: "materialName",
      actualWeight: "actualWeight",
      chargedWeight: "chargedWeight"
    };

    // Loop through the defined form fields and set their values from the incoming data
    Object.keys(formFields).forEach(field => {
      // Set form control value to the data property if available, otherwise set it to an empty string
      this.model.invoiceTableForm.controls[field].setValue(data.data?.[formFields[field]] || "");
    });

    // Filter the invoiceData to exclude the entry with the provided data ID
    this.model.invoiceData = this.model.invoiceData.filter(x => x.id !== data.data.id);
  }
  /*End*/
  /* AutoFill Containor Details */
  fillContainerDetails(data) {
    const container = this.model.containerTypeList.find(
      (x) => x.name.trim() === data.data?.containerType.trim()
    );
    this.model.containerTableForm.controls["containerNumber"].setValue(
      data.data?.containerNumber || ""
    );
    this.model.containerTableForm.controls["containerCapacity"].setValue(
      data.data?.containerCapacity || ""
    );
    this.model.containerTableForm.controls["containerType"].setValue(container);
    this.model.containerTableForm.controls["isEmpty"].setValue(data.data.isEmpty == "Y" ? true : false);
    this.model.tableData = this.model.tableData.filter((x) => x.id !== data.data.id);
  }
  /* End */
  ngOnDestroy(): void {
    // Destroy form values
    this.model.invoiceTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.ewayBillTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.consignmentTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.FreightTableForm.reset();
    this.model.FreightTableForm.reset();
    // Destroy variable values
    this.model.invoiceData = [];
    this.model.tableData = [];
  }
}