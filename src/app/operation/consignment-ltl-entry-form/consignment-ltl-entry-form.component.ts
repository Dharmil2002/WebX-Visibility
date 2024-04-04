import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { autocompleteValidator, formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { PrqService } from 'src/app/Utility/module/operation/prq/prq.service';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { DocCalledAsModel } from 'src/app/shared/constants/docCalledAs';
import { ConsignmentLtl } from 'src/assets/FormControls/consgiment-ltl-controls';
import { ConsignmentChargesComponent } from './consignment-charges/consignment-charges.component';
import { ConsignmentOtherInfoComponent } from './consignment-other-info/consignment-other-info.component';
import { AddressService } from 'src/app/Utility/module/masters/Address/address.service';
import { VehicleStatusService } from 'src/app/Utility/module/operation/vehicleStatus/vehicle.service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ConsigmentLtlModel } from 'src/app/Models/consigment-ltl/consigment-ltl';

@Component({
  selector: 'app-consignment-ltl-entry-form',
  templateUrl: './consignment-ltl-entry-form.component.html'
})
export class ConsignmentLTLEntryFormComponent implements OnInit {
  breadscrums = [];
  DocCalledAs: DocCalledAsModel;
  quickdocketDetaildata: any;
  prqFlag: boolean;
  quickDocket: boolean;
  backPath: string;
  linkArray = [];
  consigmentControls: ConsignmentLtl;
  allFormControls: FormControls[];
  basicFormControls: FormControls[];
  consigneeControlArray: FormControls[];
  consignorControlArray: FormControls[];
  customeControlArray: FormControls[];
  invoiceControlArray: FormControls[];
  freightControlArray: FormControls[];
  prqNoDetail: any[];
  paymentType: AutoComplete[];
  svcType: AutoComplete[];
  riskType: AutoComplete[];
  pkgsType: AutoComplete[];
  tranType: AutoComplete[];
  consignmentForm: UntypedFormGroup;
  invoiceForm: UntypedFormGroup;
  freightForm: UntypedFormGroup;
  deliveryType: AutoComplete[];
  wtUnits: AutoComplete[];
  pinCodeLoc: any;
  allInvoiceControls: FormControls[];
  tableLoadIn: boolean = true;
  menuItemflag = true;
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  InvoiceDetailsList: { count: any; title: string; class: string }[];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  addNewTitle: string = "Other Freight Charges";
  columnInvoice={}
  staticFieldInvoice = [
    'ewayBillNo',
    'expiryDate',
    'ewayBillDate',
    'invoiceNumber',
    'invDt',
    'cftRation',
    'length',
    'breadth',
    'height',
    'cubWT',
    'noOfPackage',
    'materialName',
    'actualWeight',
    'chargedWeight',
    'invoiceAmount',
    'materialDensity',
  ]

  tableData = [];
  MatButton = {
    functionName: "viewInfo",
    name: "Other Info",
    iconName: "add",
  };
  EventButton = {
    functionName: "AddNewInvoice",
    name: "Add Invoice",
    iconName: "add",
  };
  rateTypes: AutoComplete[];
  prqData: any;
  loadIn: boolean=false;
  constructor(
    private controlPanel: ControlPanelService,
    private prqService: PrqService,
    private consigmentLtlModel:ConsigmentLtlModel,
    private route: Router,
    private generalService: GeneralService,
    private storage: StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private customerService: CustomerService,
    private addressService: AddressService,
    private vehicleStatusService: VehicleStatusService,
    private docketService: DocketService,
    public dialog: MatDialog
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.DocCalledAs = controlPanel.DocCalledAs;

    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Generation`,
        items: ["Masters"],
        active: `${this.DocCalledAs.Docket} Generation`,
      },
    ];

    if (navigationState != null) {
      this.quickdocketDetaildata = navigationState.columnData || navigationState;

      if ('prqNo' in this.quickdocketDetaildata) {
        this.prqFlag = true;
      } else {
        this.quickDocket = true;
      }
    }
    this.consigmentControls = new ConsignmentLtl(this.generalService);

    this.consigmentControls.applyFieldRules(this.storage.companyCode).then(() => {
      this.initializeFormControl();
      this.getDataFromGeneralMaster();
      this.bindQuickdocketData();
    });
  }

  ngOnInit(): void {
    this.backPath = "/dashboard/Index?tab=6";
  }
  /*below function is for intailize the form controls */
  initializeFormControl() {
    this.allFormControls = this.consigmentControls.getDocketFieldControls();
    this.allInvoiceControls = this.consigmentControls.getInvoiceDetail();
    this.basicFormControls = this.allFormControls.filter((control) => control.additionalData.metaData == "Basic");
    this.customeControlArray = this.allFormControls.filter((control) => control.additionalData.metaData == "custom");
    this.consignorControlArray = this.allFormControls.filter((control) => control.additionalData.metaData == "consignor");
    this.consigneeControlArray = this.allFormControls.filter((control) => control.additionalData.metaData == "consignee");
    this.invoiceControlArray = this.allInvoiceControls.filter((control) => control.additionalData.metaData == "invoiceDetail");
    this.freightControlArray = this.consigmentControls.getFreightDetail();
    // Perform common drop-down mapping
    // Build form groups
    this.consignmentForm = formGroupBuilder(this.fb, [this.allFormControls]);
    this.invoiceForm = formGroupBuilder(
      this.fb,
      [this.allInvoiceControls]
    );
    this.freightForm = formGroupBuilder(
      this.fb,
      [this.freightControlArray]
    );
    // Set initial values for the form controls
    this.bindQuickdocketData();
    this.commonDropDownMapping();
    this.getVolControls();
    this.invoiceForm.controls['materialName'].setValue("");
  }
  /*end*/

  // Common drop-down mapping
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
    ];

    const consignorMappings = [
      { name: "consignorName", target: "consignorName" },
      { name: "consignorCity", target: "consignorCity" },
      { name: "consignorPinCode", target: "consignorPinCode" },
    ];

    const consigneeMappings = [
      { name: "consigneeCity", target: "consigneeCity" },
      { name: "consigneeName", target: "consigneeName" },
      { name: "consigneePincode", target: "consigneePincode" },
    ];
    const destinationMapping = [{ name: "destination", target: "destination" }];
    mapControlArray(this.allFormControls, docketMappings); // Map docket control array
    mapControlArray(this.allFormControls, consignorMappings); // Map consignor control array
    mapControlArray(this.allFormControls, consigneeMappings); // Map consignee control array
    mapControlArray(this.allFormControls, destinationMapping);
  }
  //End
  async bindQuickdocketData() {

    if (this.quickDocket) {
      // this.DocketDetails=this.quickdocketDetaildata?.docketsDetails||{};
      // const contract=this.contractForm.value;
      // this.contractForm.controls["payType"].setValue(this.DocketDetails?.pAYTYP || "");
      // this.vehicleNo = this.DocketDetails?.vEHNO;
      // this.contractForm.controls["totalChargedNoOfpkg"].setValue(this.DocketDetails?.pKGS || "");
      // this.contractForm.controls["actualwt"].setValue(this.DocketDetails?.aCTWT || "");
      // this.contractForm.controls["chrgwt"].setValue(this.DocketDetails?.cHRWT || "");
      // this.tabForm.controls["docketNumber"].setValue(this.DocketDetails?.dKTNO || "");
      // this.tabForm.controls["docketDate"].setValue(this.DocketDetails?.dKTDT || "");
      // const billingParties={
      //   name:this.DocketDetails?.bPARTYNM||"",
      //   value:this.DocketDetails?.bPARTY||""
      // }
      // this.tabForm.controls["billingParty"].setValue(billingParties);
      // const fCity={
      //   name:this.DocketDetails?.fCT||"",
      //   value:this.DocketDetails?.fCT||""
      // }
      // this.tabForm.controls["fromCity"].setValue(fCity);
      // const tCity={
      //   name:this.DocketDetails?.tCT||"",
      //   value:this.DocketDetails?.tCT||""
      // }
      // this.tabForm.controls["toCity"].setValue(tCity);
      // const destionation={
      //   name:this.DocketDetails?.dEST||"",
      //   value:this.DocketDetails?.dEST||""
      // }
      // this.contractForm.controls["destination"].setValue(destionation);
      // this.tableData[0].NO_PKGS = this.DocketDetails?.pKGS || "";
      // this.tableData[0].ACT_WT = this.DocketDetails?.aCTWT || "";
    }
    //this.getCity();
    //this.customerDetails();
    //this.destionationDropDown();

  }
  async getDataFromGeneralMaster() {
    this.paymentType = await this.generalService.getGeneralMasterData("PAYTYP");
    this.riskType = await this.generalService.getGeneralMasterData("RSKTYP");
    this.pkgsType = await this.generalService.getGeneralMasterData("PKGS");
    this.deliveryType = await this.generalService.getGeneralMasterData("PKPDL");
    this.wtUnits = await this.generalService.getGeneralMasterData("WTUNIT");
    this.rateTypes = await this.generalService.getGeneralMasterData("RTTYP");
    const rateType = this.rateTypes.filter((x) => x.value != "RTTYP-0007");
    this.tranType = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.allFormControls, this.paymentType, "payType");
    setGeneralMasterData(this.allFormControls, this.riskType, "risk");
    setGeneralMasterData(this.allFormControls, this.pkgsType, "pkgsType");
    setGeneralMasterData(this.allFormControls, this.tranType, "transMode");
    setGeneralMasterData(this.allFormControls, this.wtUnits, "weight_in");
    setGeneralMasterData(this.allFormControls, this.deliveryType, "delivery_type");
    setGeneralMasterData(this.freightControlArray, rateType, "freightRatetype");
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
  /*below function is call when the prq based data we required*/
  async getPrqDetail() {
    const filter = {
      cID: this.storage.companyCode,
      bRCD: this.storage.branch,
      pRQNO: { 'D$regex': `^${this.consignmentForm.controls.prqNo.value}`, 'D$options': 'i' },
    }
    const prqNo = await this.prqService.getPrqDetail(filter);
    this.prqNoDetail = prqNo.tableData;
    const prqDetail = prqNo.allPrqDetail.map((x) => ({
      name: x.pRQNO,
      value: x.pRQNO
    }));

    this.filter.Filter(this.allFormControls, this.consignmentForm, prqDetail, "prqNo", false);
  }
  /*End*/
  /*pincode based city*/
  async getPincodeDetail(event) {
    await this.pinCodeService.getCity(
      this.consignmentForm,
      this.allFormControls,
      event.field.name,
      false
    );
  }
  /*end*/
  /*below is function for the get Pincode Based on city*/
  async getPinCodeBasedOnCity(event) {
    const fieldName = event.field.name == "fromCity" ? "fromPinCode" : "toPinCode"
    const pincode = await this.pinCodeService.pinCodeDetail({ CT: event.eventArgs.option.value.value });
    if (pincode.length > 0) {
      const pincodeMapping = pincode.map((x) => ({
        name: `${x.PIN}`,
        value: `${x.PIN}`
      }));
      this.filter.Filter(this.allFormControls, this.consignmentForm, pincodeMapping, fieldName, false);
    }
  }
  /*End*/
  /*below function is for the get city based on pincode*/
  async getDestinationBasedOnPincode(event) {
    const locations = await this.locationService.locationFromApi({ D$or: [{ locPincode: parseInt(event.eventArgs.option.value.value), mappedPinCode: { D$in: [parseInt(event.eventArgs.option.value.value)] } }] });
    this.filter.Filter(this.allFormControls, this.consignmentForm, locations, "destination", true);
    this.pinCodeLoc = locations;
  }
  /*End*/
  /*here i  created a Function for the destination*/
  async destionationDropDown() {
    if (this.consignmentForm.controls.destination.value.length > 2) {
      const destinationMapping = await this.locationService.locationFromApi({
        locCode: { 'D$regex': `^${this.consignmentForm.controls.destination.value}`, 'D$options': 'i' },
      });
      this.filter.Filter(
        this.allFormControls,
        this.consignmentForm,
        destinationMapping,
        "destination",
        true
      );
    }
  }
  /*End*/
  /*below function is for the get a customer or consignor/consignee */
  async getCustomer(event) {
    const controlMap = new Map([
      ['billingParty', this.allFormControls],
      ['consignorName', this.consignorControlArray],
      ['consigneeName', this.consigneeControlArray]
    ]);
    const { name } = event.field;
    const jsonControls = controlMap.get(name);

    if (!jsonControls) {
      console.error(`Invalid field name: ${name}`);
      return;
    }
    try {
      // Assuming the method returns a value you need
      await this.customerService.getCustomerForAutoComplete(this.consignmentForm, jsonControls, name, false);
      // Handle the response or additional logic here
    } catch (error) {
      // Additional error handling logic here
    }
  }
  /*below function is call when the user click on toggle*/
  async onAutoBillingBased(event) {
    const { name } = event.field;
    const value = this.consignmentForm.controls[name].value;
    const customer = this.consignmentForm.controls["billingParty"].value?.otherdetails || "";
    switch (name) {
      case "cnebp":
        this.consignmentForm.controls["consigneeName"].setValue(value ? { name: customer?.customerName || "", value: customer?.customerCode || "" } : "");
        this.consignmentForm.controls["cncontactNumber"].setValue(value ? customer?.customer_mobile || '' : "");
        this.consignmentForm.controls["cneAddress"].setValue(value ? { name: customer?.RegisteredAddress || "", value: "A888" } : "");
        this.consignmentForm.controls["cnegst"].setValue(value ? customer?.GSTdetails[0].gstNo || "" : "");
        break;
      case "cnbp":
        this.consignmentForm.controls["consignorName"].setValue(value ? { name: customer?.customerName || "", value: customer?.customerCode || "" } : "");
        this.consignmentForm.controls["ccontactNumber"].setValue(value ? customer?.customer_mobile || '' : "");
        this.consignmentForm.controls["calternateContactNo"].setValue("");
        this.consignmentForm.controls["cnoAddress"].setValue(value ? { name: customer?.RegisteredAddress || "", value: "A888" } : "");
        this.consignmentForm.controls["cnogst"].setValue(value ? customer?.GSTdetails[0].gstNo || "" : "");
        break;
    }
  }
  /*End*/
  /*below function is volumetric function*/
  getVolControls() {
    const volumeValue = this.consignmentForm.controls['f_vol'].value;
    const controls=[ 
      "cftRatio",
      "length",
      "breadth",
      "height"
    ]

  if(volumeValue){
    this.columnInvoice=this.consigmentLtlModel.columnVolInvoice;
    controls.forEach(control => {
    this.invoiceForm.controls[control].setValidators([Validators.required]);
    this.invoiceForm.controls[control].updateValueAndValidity();
  });
  }
  else{
    this.columnInvoice=this.consigmentLtlModel.columnInvoice;
    controls.forEach(control => {
      this.invoiceForm.controls[control].clearValidators();
      this.invoiceForm.controls[control].updateValueAndValidity();
    });
  }
    // Use a ternary operator for concise conditional assignment.
    this.invoiceControlArray = volumeValue
      ? this.allInvoiceControls
      : this.allInvoiceControls.filter(control => control.additionalData.metaData === "invoiceDetail");
      
      
  }
  /*End*/
  ViewCharge() {
    let data = this.consignmentForm.value;
    data['paymentTypeName'] = this.paymentType.find((x) => x.value == data.payType).name;
    data['transModeName'] = this.tranType.find((x) => x.value == data.transMode).name;
    const dialogref = this.dialog.open(ConsignmentChargesComponent, {
      width: "100vw",
      height: "100vw",
      maxWidth: "232vw",
      data: data
    });
    dialogref.afterClosed().subscribe((result) => {
    });
  }
  viewInfo() {
    let data = this.consignmentForm.value;
    const dialogref = this.dialog.open(ConsignmentOtherInfoComponent, {
      width: "100vw",
      height: "100vw",
      maxWidth: "232vw",
      data: data
    });
    dialogref.afterClosed().subscribe((result) => {
    });
  }
  /*below function call when Consgine or Consginor would be walkin*/
  walkin(event) {
    const { name } = event.field;
    const value = this.consignmentForm.controls[name].value;

    // Mapping of field names to control names and their related controls array.
    const fieldMappings = {
      cnWinCsgn: { controlName: 'consignorName', controlArray: 'consignorControlArray' },
      cnWinCsgne: { controlName: 'consigneeName', controlArray: 'consignorControlArray' } // Assuming 'consignorControlArray' was a typo and you have a 'consigneeControlArray'.
    };

    const mapping = fieldMappings[name];
    if (mapping) {
      // Update control type
      this[mapping.controlArray].forEach((element) => {
        if (element.name === mapping.controlName) {
          element.type = "text";
        }
      });

      // Update validators based on value
      const control = this.consignmentForm.controls[mapping.controlName];
      if (value) {
        control.clearValidators();
        control.setValue("");
      } else {
        control.setValidators([autocompleteValidator()]);
        control.setValue("");
      }
      control.updateValueAndValidity();
    }
  }
  /*End*/
  async AddressDetails() {
    const billingParty = this.consignmentForm.controls["billingParty"]?.value.value || "";
    const fromCity = this.consignmentForm.controls["fromCity"]?.value.value || "";
    const toCity = this.consignmentForm.controls["toCity"]?.value.value || "";
    const filter = [
      {
        D$match: {
          cityName: fromCity,
          activeFlag: true,
          customer: {
            D$elemMatch: {
              code: billingParty,
            },
          },
        },
      },
    ]
    const picUpres = await this.addressService.getAddress(filter);
    const filterAddress = [
      {
        D$match: {
          cityName: toCity,
          activeFlag: true,
          customer: {
            D$elemMatch: {
              code: billingParty,
            },
          },
        },
      },
    ]
    const address = await this.addressService.getAddress(filterAddress);
    this.filter.Filter(
      this.allFormControls,
      this.consignmentForm,
      picUpres,
      "pAddress",
      false
    );
    this.filter.Filter(
      this.allFormControls,
      this.consignmentForm,
      address,
      "deliveryAddress",
      false
    );
    this.filter.Filter(
      this.allFormControls,
      this.consignmentForm,
      picUpres,
      "cnoAddress",
      false
    );
    this.filter.Filter(
      this.allFormControls,
      this.consignmentForm,
      address,
      "cneAddress",
      false
    );
  }

  prqSelection() {
    this.prqData = this.prqNoDetail.find(
      (x) => x.prqNo == this.consignmentForm.controls["prqNo"].value.value
    );
    this.prqDetail();
  }
  async prqDetail() {
    let billingParty = { name: this.prqData?.billingParty, value: this.prqData?.billingPartyCode };
    //await this.customerService.getCustomerByCodeOrName(undefined, this.prqData?.billingParty);
    this.setFormValue(this.consignmentForm, "fromCity", this.prqData, true, "fromCity", "fromCity");
    this.setFormValue(this.consignmentForm, "toCity", this.prqData, true, "toCity", "toCity");
    this.setFormValue(this.consignmentForm, "billingParty", billingParty);
    this.setFormValue(this.consignmentForm, "payType", this.prqData?.payTypeCode);
    this.setFormValue(this.consignmentForm, "docketDate", this.prqData?.pickupDate);
    this.setFormValue(this.consignmentForm, "cnebp", false);
    this.setFormValue(this.consignmentForm, "cnbp", true);
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
    const prodCode = this.tranType.find((x) => x.name == "Road")?.value || "";
    this.setFormValue(this.consignmentForm, "transMode", prodCode);
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
  /*below the code is for AddNewInvoice*/
  async AddNewInvoice() {
    this.loadIn=true;
    this.tableLoadIn=true;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const invoice = this.invoiceForm.value;
    const req = {
      'ewayBillNo': invoice.ewayBillNo,
      'expiryDate': moment(invoice.expiryDate).format("DD-MM-YYYY HH:MM"),
      'oExpiryDate': invoice.expiryDate,
      'ewayBillDate': moment(invoice.billDate).format("DD-MM-YYYY HH:MM"),
      'oEwayBillDate':invoice.billDate,
      'invoiceNumber': invoice.invoiceNo,
      'oInvDt': invoice.invoiceDate,
      'invDt': moment(invoice.invoiceDate).format("DD-MM-YYYY HH:MM"),
      'cftRation': invoice.cftRatio,
      'length': invoice.length,
      'breadth': invoice.breadth,
      'height': invoice.height,
      'cubWT': invoice.cubWT,
      'noOfPackage': invoice.noOfPackage,
      'materialName': invoice.materialName,
      'actualWeight': invoice.actualWeight,
      'chargedWeight': invoice.chargedWeight,
      "invoiceAmount": invoice.invoiceAmount,
      'materialDensity': invoice.materialDensity,
      'actions': ["Edit", "Remove"]
    }
    this.tableData.push(req);
    this.tableLoadIn = false;
    this.loadIn=false;
    this.SetInvoiceData();
    this.invoiceForm.reset();
  }
  /*below functions for autofill and remove invoice*/
  handleMenuItemClick(data) {
    this.fillInvoice(data);
  }
  fillInvoice(data: any) {

    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const atLeastOneValuePresent = Object.keys(this.invoiceForm.controls)
        .some(key => {
          const control = this.invoiceForm.get(key);
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
    this.SetInvoiceData();
  }
  /*End*/

  /*AutoFiill Invoice data*/
  fillInvoiceDetails(data) {
  
    // Define a mapping of form control names to their respective keys in the incoming data
    const formFields = {
      'ewayBillNo':'ewayBillNo',
      'expiryDate':'oExpiryDate',
      'billDate':'oEwayBillDate',
      'invoiceNo':'invoiceNumber',
      'invoiceDate':'oInvDt',
      'cftRatio':'cftRation',
      'length':'length',
      'breadth':'breadth',
      'height':'height',
      'cubWT':'cubWT',
      'noOfPackage':'noOfPackage',
      'materialName':'materialName',
      'actualWeight':'actualWeight',
      'chargedWeight':'chargedWeight',
      'invoiceAmount':"invoiceAmount",
      'materialDensity':'materialDensity',
      
    };
    // Loop through the defined form fields and set their values from the incoming data
    Object.keys(formFields).forEach(field => {
      // Set form control value to the data property if available, otherwise set it to an empty string
      this.invoiceForm.controls[field].setValue(data.data?.[formFields[field]] || "");
    });
    //this.invoiceForm.controls['materialName'].setValue({ name: data.data['materialName'], value: data.data['materialName'] })
    // Filter the invoiceData to exclude the entry with the provided data ID
    this.tableData = this.tableData.filter(x => x.id !== data.data.id);
  }
  /*End*/
  SetInvoiceData() {
    this.InvoiceDetailsList = [
      {
        count: this.tableData.reduce((acc, invoiceAmount) => parseFloat(acc) + parseFloat(invoiceAmount['invoiceAmount']), 0),
        title: "Invoice Amount",
        class: `color-Ocean-danger`,
      },
      {
        count: this.tableData.reduce((acc, noofPkts) => parseFloat(acc) + parseFloat(noofPkts['noOfPackage']), 0),
        title: "No of Pkts",
        class: `color-Success-light`,
      },
      {
        count: this.tableData.reduce((acc, actualWeight) => parseFloat(acc) + parseFloat(actualWeight['actualWeight']), 0),
        title: "Actual Weight",
        class: `color-Success-light`,
      },
      {
        count: this.tableData.reduce((acc, chargedWeight) => parseFloat(acc) + parseFloat(chargedWeight['chargedWeight']), 0),
        title: "Charged weight",
        class: `color-Success-light`,
      }
    ]
  }
  async save() {
  debugger
    const data = { ...this.consignmentForm.value, ...this.freightForm.value }
    const tableData=this.tableData
    data['payTypeName']= this.paymentType.find((x)=>x.value==data.payType).name;
    data['freightRatetypeNm']= this.paymentType.find((x)=>x.value==data.freightRatetype).name;
    data['pkgsTypeName']= this.pkgsType.find((x)=>x.value==data.pkgsType).name;
    data['rsktyName']= this.riskType.find((x)=>x.value==data.rskty).name;
    data['tranType']= this.tranType.find((x)=>x.value==data.rskty).name;
    data['delivery_typeNm']= this.deliveryType.find((x)=>x.value==data.delivery_type).name;
    const fieldMapping=this.docketService.consgimentFieldMapping(data,tableData);
    console.log(fieldMapping);
  }
}
