import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { firstValueFrom } from 'rxjs';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { ConvertToNumber, isValidNumber, roundToNumber } from 'src/app/Utility/commonFunction/common';
import { ThcmovementDetails } from 'src/app/Models/THC/THCModel';
import { DCRService } from 'src/app/Utility/module/masters/dcr/dcr.service';
import { StoreKeys } from 'src/app/config/myconstants';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';

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
  NonFreightTableForm: UntypedFormGroup;
  prqNoDetail: any[];
  NonFreightjsonControlArray: any;
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
  NonFreightLoaded = false;
  tableLoadIn: boolean = true;
  menuItemflag = true;
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  InvoiceDetailsList: { count: any; title: string; class: string }[];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  isUpdate: boolean = false;
  addNewTitle: string = "Other Freight Charges";
  columnInvoice: any;
  dcrDetail={};
  staticFieldInvoice = [
    'ewayBillNo',
    'expiryDate',
    'ewayBillDate',
    'invoiceNumber',
    'invDt',
    'cftRation',
    "cft",
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
  toggleWinCsgn = {
    functionName: "walkin",
    name:"cnWinCsgn",
    label:"walk in"
  };
  toggleWinCsgne = {
    functionName: "walkin",
    name:"cnWinCsgne",
    label:"walk in"
  };
  rateTypes: AutoComplete[];
  prqData: any;
  loadIn: boolean = false;
  otherInfo: any;
  otherCharges: any = [];
  DocketDetails: any;
  vehicleNo: any;
  isSubmit: boolean = false;
  matrials: AutoComplete[];
  unitsName: string="CM";
  rules: any[]=[];
  alpaNumber: boolean;
  sequence:boolean;
  isBrachCode:boolean;
  fyear:boolean;
  length:number=0;
  mseq: boolean;
  lastDoc:string;
  isManual: boolean;
  constructor(
    private controlPanel: ControlPanelService,
    private _NavigationService: NavigationService,
    private prqService: PrqService,
    private customer: CustomerService,
    private consigmentLtlModel: ConsigmentLtlModel,
    private route: Router,
    private operationService: OperationService,
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
    public dialog: MatDialog,
    private dcrService:DCRService
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.DocCalledAs = controlPanel.DocCalledAs;
    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Entry`,
        items: ["Operations"],
        active: `${this.DocCalledAs.Docket} Entry`,
      },
    ];

    if (navigationState != null) {
      this.quickdocketDetaildata = navigationState.columnData || navigationState;

      if ('prqNo' in this.quickdocketDetaildata) {
        this.prqFlag = true;
      } else {
        this.quickDocket = true;
        this.isUpdate=true
      }
    }
    this.consigmentControls = new ConsignmentLtl(this.generalService);

    this.consigmentControls.applyFieldRules(this.storage.companyCode).then(() => {
      this.initializeFormControl();
      
    });
  }
  changeInvoice() {
    const dktDt = new Date(this.consignmentForm.controls['docketDate'].value);
    this.invoiceControlArray.forEach((x) => {
      if (x.name == "invoiceDate") {
        x.additionalData.maxDate = dktDt;
      }
    })
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
    this.getDataFromGeneralMaster();
    this.bindQuickdocketData();
    this.commonDropDownMapping();
    this.getVolControls();
    if(this.quickDocket){
    this.getRules();
    }
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
      this.DocketDetails = this.quickdocketDetaildata?.docketsDetails || {};
      this.consignmentForm.controls["payType"].setValue(this.DocketDetails?.pAYTYP || "");
      this.vehicleNo = this.DocketDetails?.vEHNO;
      this.consignmentForm.controls["docketNumber"].setValue(this.DocketDetails?.dKTNO || "");
      this.consignmentForm.controls["docketDate"].setValue(this.DocketDetails?.dKTDT || "");
      const billingParties = {
        name: this.DocketDetails?.bPARTYNM || "",
        value: this.DocketDetails?.bPARTY || ""
      }
      this.consignmentForm.controls["billingParty"].setValue(billingParties);
      const destionation = {
        name: this.DocketDetails?.dEST || "",
        value: this.DocketDetails?.dEST || ""
      }
      this.consignmentForm.controls["destination"].setValue(destionation);
      this.invoiceForm.controls["noOfPackage"].setValue(this.DocketDetails?.noOfPackage || "");
      this.invoiceForm.controls["actualWeight"].setValue(this.DocketDetails?.actualWeight || "");
      this.invoiceForm.controls["chargedWeight"].setValue(this.DocketDetails?.chargedWeight || "");
      const destinationMapping = await this.locationService.locationFromApi({
        locCity: {D$in:[this.DocketDetails?.fCT,this.DocketDetails?.tCT]},
      });
      const fromCity = {
        name: destinationMapping.find((x)=>x.city==this.DocketDetails?.fCT)?.pincode,
        value: destinationMapping.find((x)=>x.city==this.DocketDetails?.fCT)?.city,
        ct:destinationMapping.find((x)=>x.city==this.DocketDetails?.fCT)?.city,
        pincode:destinationMapping.find((x)=>x.city==this.DocketDetails?.fCT)?.pincode
      };
      //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
      this.consignmentForm.controls["fromCity"].setValue(fromCity);
      const toCity = {
        name: destinationMapping.find((x)=>x.city==this.DocketDetails?.tCT)?.pincode,
        value: destinationMapping.find((x)=>x.city==this.DocketDetails?.tCT)?.city,
        ct:destinationMapping.find((x)=>x.city==this.DocketDetails?.tCT)?.city,
        pincode:destinationMapping.find((x)=>x.city==this.DocketDetails?.tCT)?.pincode
      };
      //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
      this.consignmentForm.controls["toCity"].setValue(toCity);
    }

  }
  async getDataFromGeneralMaster() {

    this.paymentType = await this.generalService.getGeneralMasterData("PAYTYP");
    this.riskType = await this.generalService.getGeneralMasterData("RSKTYP");
    this.pkgsType = await this.generalService.getGeneralMasterData("PKGS");
    this.deliveryType = await this.generalService.getGeneralMasterData("PKPDL");
    this.rateTypes = await this.generalService.getGeneralMasterData("RTTYP");
    const rateType = this.rateTypes.filter((x) => x.value != "RTTYP-0007");
    this.matrials = await this.generalService.getGeneralMasterData("PROD");
    this.tranType = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.allFormControls, this.paymentType, "payType");
    setGeneralMasterData(this.allFormControls, this.riskType, "risk");
    setGeneralMasterData(this.allFormControls, this.pkgsType, "pkgsType");
    setGeneralMasterData(this.allFormControls, this.tranType, "transMode");
    setGeneralMasterData(this.allFormControls, this.deliveryType, "delivery_type");
    setGeneralMasterData(this.freightControlArray, rateType, "freightRatetype");
    this.filter.Filter(this.invoiceControlArray, this.invoiceForm, this.matrials, "materialName", false);
    this.bindQuickdocketData();
    this.invoiceForm.controls['materialDensity'].setValue("");
    this.consignmentForm.controls['risk'].setValue("");
    this.consignmentForm.controls['pkgsType'].setValue("");
    this.freightForm.controls['freightRatetype'].setValue("");
    this.freightForm.controls['rcm'].setValue("");
    this.consignmentForm.controls['payType'].setValue("");
    this.consignmentForm.controls['transMode'].setValue("");
    this.consignmentForm.controls['payType'].setValue("P02");
    const prodCode = this.tranType.find((x) => x.name == "Road")?.value || "";
    this.consignmentForm.controls["transMode"].setValue(prodCode);
    const destinationMapping = await this.locationService.locationFromApi({
      locCode: this.storage.branch,
    });
    const city = {
      name: destinationMapping[0].pincode,
      value: destinationMapping[0].city,
      ct:destinationMapping[0].city,
      pincode: destinationMapping[0].pincode.toString()
    };
    //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.consignmentForm.controls["fromCity"].setValue(city);


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
      sTS: { D$in: [2, 3] }
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
    const value =this.consignmentForm.controls[event.field.name].value;
    if(typeof(value)=="string"||typeof(value)=="number"){
    if(isValidNumber(value)){
      await this.pinCodeService.getCityPincode(
        this.consignmentForm,
        this.allFormControls,
        event.field.name,
        false,
        false
      );
    }
    else{
      await this.pinCodeService.getCityPincode(
        this.consignmentForm,
        this.allFormControls,
        event.field.name,
        true,
        true
      );
    }
    }
  }
  /*end*/
  /*below is function for the get Pincode Based on city*/

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
      if (name == "consignorName" && this.consignmentForm.controls["cnWinCsgn"].value) {
        await this.customerService.getWalkForAutoComplete(this.consignmentForm, jsonControls, name, false);
        return;
      }
      if (name == "consigneeName" && this.consignmentForm.controls["cnWinCsgne"].value) {
        await this.customerService.getWalkForAutoComplete(this.consignmentForm, jsonControls, name, false);
        return;
      }
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
    let customer = this.consignmentForm.controls["billingParty"].value?.otherdetails || ""
    if (this.consignmentForm.controls['prqNo'].value || this.quickDocket) {
      const test = await this.customerService.customerFromFilter({ customerCode: this.consignmentForm.controls["billingParty"].value.value })
      customer = test[0];
    }
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
    const controls = [
      "cft",
      "cftRatio",
      "length",
      "breadth",
      "height"
    ]

    if (volumeValue) {
      this.invoiceForm.controls['cubWT'].enable();
      this.columnInvoice = this.consigmentLtlModel.columnVolInvoice;
      controls.forEach(control => {
        this.invoiceForm.controls[control].setValidators([Validators.required]);
        this.invoiceForm.controls[control].updateValueAndValidity();
      });
    this.unitChange();
    }
    else {
      this.invoiceForm.controls['cubWT'].disable();
      this.columnInvoice = this.consigmentLtlModel.columnInvoice;
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
  /*Unit Change*/
  unitChange() {
    
    const vol = ['cft', 'cftRatio']
    this.allInvoiceControls.filter((x) => x.additionalData.metaData == "volumetric" && !vol.includes(x.name)).forEach((x) => {
        x.label = `${x.placeholder} (${this.unitsName})`
      })
      this.columnInvoice.height.Title = `${this.consigmentLtlModel.columnVolInvoice.height.lable}(${this.unitsName})`;
      this.columnInvoice.breadth.Title = `${this.consigmentLtlModel.columnVolInvoice.breadth.lable}(${this.unitsName})`;
      this.columnInvoice.length.Title = `${this.consigmentLtlModel.columnVolInvoice.length.lable}(${this.unitsName})`;
  }
  /*End*/
  ViewCharge() {
    let data = this.consignmentForm.value;
    if (typeof (data.transMode) == "object" || !data.transMode) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select the transport type!',
      })
      return;
    }

    data['paymentTypeName'] = this.paymentType.find(x => x.value == data.payType) ? this.paymentType.find(x => x.value == data.payType).name : 'Default Payment Name';
    data['transModeName'] = this.tranType.find(x => x.value == data.transMode) ? this.tranType.find(x => x.value == data.transMode).name : 'Default Transaction Mode Name';
    this.otherCharges=this.otherCharges?this.otherCharges:[];
    if (this.otherCharges.length > 0) {
      data = this.otherCharges
    }
    const dialogref = this.dialog.open(ConsignmentChargesComponent, {
      width: "90vw",
      height: "30vw",
      //maxWidth: "232vw",
      data: data
    });
    dialogref.afterClosed().subscribe((result) => {
      this.otherCharges = result;
      this.calucatedCharges();

    });
  }

  calucatedCharges() {
    let total = 0;
    const chargeMapping = this.otherCharges.map((x) => { return { name: x.cHGNM, operation: x.oPS, aMT: x.aMT } });
    total = chargeMapping.reduce((acc, curr) => {
      if (curr.operation === "+") {
        return acc + parseFloat(curr.aMT);
      } else if (curr.operation === "-") {
        return acc - parseFloat(curr.aMT);
      } else {
        return acc; // In case of an unknown operation
      }
    }, 0);
    this.freightForm.controls['otherAmount'].setValue(total);
    this.calculateFreight();
  }
  viewInfo() {

    let data = this.consignmentForm.value;
    if (this.otherInfo) {
      data = this.otherInfo
    }
    const dialogref = this.dialog.open(ConsignmentOtherInfoComponent, {
      width: "90vw",
      height: "30vw",
      //maxWidth: "50vw",
      data: data
    });
    dialogref.afterClosed().subscribe((result) => {
      this.otherInfo = result;
    });
  }
  /*below function call when Consgine or Consginor would be walkin*/
  walkin(event) {
    const  name  = event.name;
    this.consignmentForm.controls[name].setValue(event.event.checked)
    const value = this.consignmentForm.controls[name].value;
    // Mapping of field names to control names and their related controls array.
    const fieldMappings = {
      cnWinCsgn: { controlName: 'consignorName', controlArray: 'consignorControlArray' },
      cnWinCsgne: { controlName: 'consigneeName', controlArray: 'consignorControlArray' } // Assuming 'consignorControlArray' was a typo and you have a 'consigneeControlArray'.
    };
    const mapping = fieldMappings[name];
    const mappingControls = fieldMappings[name]
    if (mapping) {
      // Update control type
      // Update validators based on value
      const control = this.consignmentForm.controls[mapping.controlName];
      if (value) {
        control.setValidators([Validators.required]);
        control.setValue("");
      } else {
        control.setValidators([Validators.required,autocompleteValidator()]);
        control.setValue("");
      }

      control.updateValueAndValidity();
      const controlMap = new Map([
        ['consignorName', this.consignorControlArray],
        ['consigneeName', this.consigneeControlArray]
      ]);
      const jsonControls = controlMap.get(mapping.controlName);
      jsonControls.forEach(element => {
        this.consignmentForm.controls[element.name].setValue("");
      });
      this.filter.Filter(
        jsonControls,
        this.consignmentForm,
        [],
        mapping.controlName, false
      )

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
   // this.setFormValue(this.consignmentForm, "fromCity", this.prqData, true, "fromCity", "fromCity");
   // this.setFormValue(this.consignmentForm, "toCity", this.prqData, true, "toCity", "toCity");
    this.setFormValue(this.consignmentForm, "billingParty", billingParty);
    this.setFormValue(this.consignmentForm, "payType", this.prqData?.payTypeCode);
    this.setFormValue(this.consignmentForm, "docketDate", this.prqData?.pickupDate);
    this.setFormValue(this.consignmentForm, "cnebp", false);
    this.setFormValue(this.consignmentForm, "cnbp", true);
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
    const destinationMapping = await this.locationService.locationFromApi({
      locCity: {D$in:[this.prqData?.toCity,this.prqData?.fromCity]},
    });
    const fromCity = {
      name: destinationMapping.find((x)=>x.city==this.prqData?.fromCity)?.pincode,
      value: destinationMapping.find((x)=>x.city==this.prqData?.fromCity)?.city,
      ct:destinationMapping.find((x)=>x.city==this.prqData?.fromCity)?.city,
      pincode:destinationMapping.find((x)=>x.city==this.prqData?.fromCity)?.pincode
    };
    //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.consignmentForm.controls["fromCity"].setValue(fromCity);
    const toCity = {
      name: destinationMapping.find((x)=>x.city==this.prqData?.toCity)?.pincode,
      value: destinationMapping.find((x)=>x.city==this.prqData?.toCity)?.city,
      ct:destinationMapping.find((x)=>x.city==this.prqData?.toCity)?.city,
      pincode:destinationMapping.find((x)=>x.city==this.prqData?.toCity)?.pincode
    };
    //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.consignmentForm.controls["toCity"].setValue(toCity);

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
    if (await this.calculateValidation()) {

      if (this.tableData.length > 0) {
        const exist = this.tableData.find(
          (x) => x.invoiceNumber === this.invoiceForm.value.invoiceNo
        );
        if (exist) {
          this.invoiceForm.controls["invoiceNo"].setValue("");
          Swal.fire({
            icon: "info", // Use the "info" icon for informational messages
            title: "Information",
            text: "Please avoid entering duplicate Invoice.",
            showConfirmButton: true,
          });
          return false;
        }
      }
      this.loadIn = true;
      this.tableLoadIn = true;
      const delayDuration = 1000;
      // Create a promise that resolves after the specified delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // Use async/await to introduce the delay
      await delay(delayDuration);
      const invoice = this.invoiceForm.getRawValue();
      const req = {
        'ewayBillNo': invoice.ewayBillNo,
        'expiryDate':invoice.expiryDate? moment(invoice.expiryDate).format("DD-MM-YYYY HH:MM"):"",
        'oExpiryDate': invoice.expiryDate,
        'ewayBillDate':invoice.expiryDate? moment(invoice.billDate).format("DD-MM-YYYY HH:MM"):"",
        'oEwayBillDate': invoice.billDate,
        'invoiceNumber': invoice.invoiceNo,
        'oInvDt': invoice.invoiceDate,
        'invDt': moment(invoice.invoiceDate).format("DD-MM-YYYY HH:MM"),
        'cftRation': invoice.cftRatio,
        'length': invoice.length,
        'breadth': invoice.breadth,
        'height': invoice.height,
        'cubWT': invoice?.cubWT||"",
        'noOfPackage': invoice.noOfPackage,
        'materialName': invoice.materialName?.name||invoice?.materialName||"",
        'actualWeight': invoice.actualWeight,
        'chargedWeight': invoice.chargedWeight,
        "invoiceAmount": invoice.invoiceAmount,
        'materialDensity': invoice.materialDensity,
        'cft': invoice.cft,
        'actions': ["Edit", "Remove"]
      }
      this.tableData.push(req);
      this.tableLoadIn = false;
      this.loadIn = false;
      this.SetInvoiceData();
      this.invoiceForm.reset();
    }
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
      'ewayBillNo': 'ewayBillNo',
      'expiryDate': 'oExpiryDate',
      'billDate': 'oEwayBillDate',
      'invoiceNo': 'invoiceNumber',
      'invoiceDate': 'oInvDt',
      'cftRatio': 'cftRation',
      'length': 'length',
      'breadth': 'breadth',
      'height': 'height',
      'cubWT': 'cubWT',
      'noOfPackage': 'noOfPackage',
      'actualWeight': 'actualWeight',
      'chargedWeight': 'chargedWeight',
      'invoiceAmount': "invoiceAmount",
      'materialDensity': 'materialDensity',
      'cft': 'cft'

    };
    // Loop through the defined form fields and set their values from the incoming data
    Object.keys(formFields).forEach(field => {
      // Set form control value to the data property if available, otherwise set it to an empty string
      this.invoiceForm.controls[field].setValue(data.data?.[formFields[field]] || "");
    });
    this.invoiceForm.controls['materialName'].setValue({name:data.data['materialName'],value:data.data['materialName']})
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
  calculateFreight() {
    const freightRateType =
      this.freightForm.controls["freightRatetype"].value;
    const freightRate =
      this.freightForm.controls["freight_rate"]?.value || 0;
    let rateTypeMap = {};
    if (typeof freightRateType === "string") {
      rateTypeMap = {
        'RTTYP-0001': 1.0,
        'RTTYP-0006': this.getInvoiceAggValue("noOfPackage"),
        'RTTYP-0005': this.getInvoiceAggValue("chargedWeight"),
        'RTTYP-0002': this.getInvoiceAggValue("chargedWeight")/1000,
        'RTTYP-0007': this.tableData.length > 0 ? this.tableData.length : 1,
      };
    }
    let TotalNonFreight = 0;
    const mfactor = rateTypeMap[freightRateType] || 1;
    let total = parseFloat(freightRate) * parseFloat(mfactor);
    this.freightForm.controls["freight_amount"]?.setValue(ConvertToNumber(total, 2));
    this.freightForm.get("grossAmount")?.setValue(ConvertToNumber(
      (parseFloat(this.freightForm.get("freight_amount")?.value) || 0) +
      (parseFloat(this.freightForm.get("otherAmount")?.value) || 0) +
      TotalNonFreight, 2)
    );
    this.freightForm.get("totAmt")?.setValue(ConvertToNumber(
      (parseFloat(this.freightForm.get("grossAmount")?.value) || 0) +
      (parseFloat(this.freightForm.get("gstChargedAmount")?.value) || 0))
    );
    if(this.freightForm.controls['rcm'].value=="Y"){
      this.freightForm.get("totAmt")?.setValue(ConvertToNumber(
        (parseFloat(this.freightForm.get("totAmt")?.value) || 0) -
        (parseFloat(this.freightForm.get("gstChargedAmount")?.value) || 0))
      );
    }
  }
  onRcmChange(){
    if(this.freightForm.controls['rcm'].value=="Y"){
      this.calculateFreight();
    }
    else{
      this.calculateFreight();
    }
  }
  getInvoiceAggValue(fielName) {
    if (this.tableData.length > 0) {
      return this.tableData.reduce(
        (acc, amount) => parseFloat(acc) + parseFloat(amount[fielName]),
        0
      );
    } else if (this.invoiceForm.value) {
      return parseFloat(this.invoiceForm.controls[fielName].value);
    }
    return 0;
  }
  calculateValidation() {

    const chargedWeight = parseFloat(
      this.invoiceForm.controls["chargedWeight"]?.value || 0
    );
    const actualWeight = parseFloat(
      this.invoiceForm.controls["actualWeight"]?.value || 0
    );
    if (actualWeight > chargedWeight) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Actual weight cannot be greater than Charge weight.",
      });
      this.invoiceForm.controls["actualWeight"]?.setValue("")
      return false;
    }
    return true;
  }
  preventNegative(event) {

    // Extract the field value directly using destructuring for cleaner access
    const { name } = event.field;
    const consgimentControls = this.freightControlArray.find((x) => x.name == name);
    let fieldValue: number;
    let formGroup: UntypedFormGroup
    if (consgimentControls) {
      fieldValue = this.freightForm.controls[name].value;
      formGroup = this.freightForm
    }
    else {
      fieldValue = this.invoiceForm.controls[name].value;
      formGroup = this.invoiceForm
    }
    // Use a more direct method to check for negative values
    if (Number(fieldValue) < 0) {
      // Display the error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Negative values are not allowed.'
      });
      // Reset the field value to 0 to prevent negative input
      formGroup.controls[name].setValue(0);
    }
  }
  integerOnly(event): boolean {
    const charCode = event.eventArgs.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.eventArgs.preventDefault();
      return false;
    }
    return true;
  }
  calucateCft() {
    let units = ''
    if(this.consignmentForm.controls['f_vol'].value){
    const length = parseFloat(this.invoiceForm.controls['length']?.value || 0.00);
    const breadth = parseFloat(this.invoiceForm.controls['breadth']?.value || 0.00);
    const height = parseFloat(this.invoiceForm.controls['height']?.value || 0.00);
    const pkg = parseFloat(this.invoiceForm.controls['noOfPackage']?.value || 0.00);
    const cftRatio = parseFloat(this.invoiceForm.controls['cftRatio']?.value || 0.00);
    const cubWt = length * breadth * height / 28316.8466;
    this.invoiceForm.controls['cubWT']?.setValue(cubWt.toFixed(2));
    let cft = 0;
    let chargeWeight = 0;
    switch (this.unitsName) {
      case "CM":
        cft = length * breadth * height * pkg / 28316.8466;
        chargeWeight = cftRatio * cft
        this.invoiceForm.controls['cft'].setValue(cft.toFixed(2))
        break
      case "Inches":
        cft = length * breadth * height * pkg / 1728
        chargeWeight = cftRatio * cft
        this.invoiceForm.controls['cft'].setValue(cft.toFixed(2))
        break
      default:
        cft = length * breadth * height * pkg / 27000
        chargeWeight = cftRatio * cft
        this.invoiceForm.controls['cft'].setValue(cft.toFixed(2))
        break;

    }
  }
  }
  /*below function would be change when the Payment time field as select any value*/
  onPaymentType() {
    const payType = this.consignmentForm.get('payType').value;
    const payTypeNm = this.paymentType.find(x => x.value === payType)?.name;
    switch (payTypeNm) {
      case "TBB":
        this.consignmentForm.get('billingParty').setValidators([Validators.required]);
        break;
      case "PAID":
      case "TO PAY":
      case "FOC":
        this.consignmentForm.get('billingParty').clearValidators();
        break;
    }
    this.consignmentForm.get('billingParty').updateValueAndValidity();
    this.consignmentForm.get('billingParty').setValue("");
  }
  
  /*end*/
  async docketValidation(){
    const res=await this.dcrService.validateSeries(this.consignmentForm.controls['docketNumber'].value);
    if(Object.keys(res).length>0){
      switch(res.aSNTO){
        case "E":
          if(res.aSNNM){
            if(this.storage.userName==res.aSNCD){
             this.validateDcr();
            }
            else{
              this.errorMessage();
            }
           
          }
          else{
            if(res.aLOTO=="L"){
              if(res.aLOCD==this.storage.branch){
                this.validateDcr();
              }
              else{
                this.errorMessage();
              }
            }
          }
          break
        case "B":
          if(res.aSNCD){
            if(this.storage.userName==res.aSNCD){
              this.validateDcr();
            }
            else{
              this.errorMessage();
            }
          }
          break
          case "C":
            debugger
            if(res.aSNTO=="C" && res.aLOCD==this.storage.branch){
              const billingParty=this.consignmentForm.controls['billingParty'].value?.value||"";
              if(billingParty){
                if(res.aSNCD==billingParty){
                  this.validateDcr();
                }
                else{
                  this.errorMessage();
                }
              }
              else{
                this.validateDcr();
                this.consignmentForm.controls['billingParty'].setValue({name:res.aSNNM,value:res.aSNCD})
              }
              
            }
            else{
               this.errorMessage();
            }
            break;

        }
       
    }
    else{
      this.errorMessage();
    }
    this.dcrDetail=res;
    
  }
  /*check Dcr is use or not*/
  async validateDcr(){
    const res=await this.dcrService.getDCRDetail({dOCNO:this.consignmentForm.controls['docketNumber'].value});
   
    if(Object.keys(res).length>0){
     
      Swal.fire({
        icon: 'error',
        title:'DCR No is already used',
        text:'DCR No is already used',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
      });
      this.consignmentForm.controls['docketNumber'].setValue("");
   
    }
    else{
      if(this.mseq){
        const mseq=await this.dcrService.getListDcrNo(this.dcrDetail);
        const nextCode=await nextKeyCode(mseq.dOCNO)
        if(nextCode==this.consignmentForm.controls['docketNumber'].value){
          Swal.fire({
            icon: 'success',
            title:'Valid',
            text:' DCR number has been allocated. You may now proceed',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,
          });
        }
        else{
          Swal.fire({
            icon: 'error',
            title:'The DCR number is out of sequence',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,

          })
          this.consignmentForm.controls['docketNumber'].setValue("");
        }
      }
      else{
        Swal.fire({
          icon: 'success',
          title:'Valid',
          text:' DCR number has been allocated. You may now proceed',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 5000,
          timerProgressBar: true,
        });
      }
     
    }
  
  }
  /*end*/
  async errorMessage(){
    Swal.fire({
      icon: 'error',
      title:'DCR No is not valid',
      text:'DCR No is not valid',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      timer: 5000,
      timerProgressBar: true,
    });
    this.consignmentForm.controls['docketNumber'].setValue("");
  }
  /*get Rules*/
  async getRules(){
    const filter={
      mODULE:"CNOTE"
    }
    const res=await this.controlPanel.getModuleRules(filter);
    if(res.length>0){
      this.rules=res;
      this.checkDocketRules();
    }
    
  }
  /*End*/
   checkDocketRules(){
      this.rules.forEach((x)=>{
        switch(x.rULENM){
          case "STYP":
            const isManual = x.vAL === "C";
            this.allFormControls.forEach(control => {
                if (control.name === "docketNumber") {
                    control.disable = isManual;
                    this.consignmentForm.controls['docketNumber'].setValue(isManual==false?"":"Computerized");
                }
            });
            this.isManual=isManual==false?true:false;
            this.isUpdate=isManual==false?true:false;
            break;
          case "ELOC":
           if(!x.vAL.includes(this.storage.branch)){
            Swal.fire({
              icon: "info", 
              title: "Missing Information",
              text: "this branch is not allowed to create docket.",
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#d33',
              timer: 5000,
              timerProgressBar: true,
            
          });
            this._NavigationService.navigateTotab('DocketStock', "dashboard/Index");
           }
            break;

          case "NTYP":
           this.alpaNumber=x.vAL=="AN";
          break;
          case "SL":
            this.sequence=x.vAL=="S";
            break;
          case "BCD":
            this.isBrachCode=x.vAL=="Y";
            break;
          case "YEAR":
            this.fyear=x.vAL=="F";
            break;
          case "LENGTH":
            this.length=x.vAL;
            break;
          case "MSEQ":
          this.mseq=x.vAL=="Y";
          //  this.mseq=true;
            break;

        }
      })
  }
  async save() {
    if(!this.consignmentForm.valid || !this.freightForm.valid || this.isSubmit){
      this.consignmentForm.markAllAsTouched();
      this.freightForm.markAllAsTouched();
      Swal.fire({
        icon: "error", 
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,
      
    });
     return false;
    }
    if (this.tableData.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please add atleast one invoice.`,
        showConfirmButton: false,
      });
      return false
    }
    this.isSubmit = true;
    const data = { ...this.consignmentForm.value, ...this.freightForm.value }
    const tableData = this.tableData
    data['payTypeName'] = this.paymentType.find(x => x.value == data?.payType)?.name ?? '';
    data['pkgsTypeName'] = this.pkgsType.find(x => x.value == data?.pkgsType)?.name ?? '';
    data['rsktyName'] = this.riskType.find(x => x.value == data?.risk)?.name ?? '';
    data['transModeName'] = this.tranType.find(x => x.value == data?.transMode)?.name ?? '';
    data['delivery_typeNm'] = this.deliveryType.find(x => x.value == data?.delivery_type)?.name ?? '';
    data['freightRatetypeNm'] = this.rateTypes.find(x => x.value == data?.freightRatetype)?.name ?? '';
    const otherData = { otherCharges: this.otherCharges, otherInfo: this.otherInfo }
    const reqDkt = await this.docketService.consgimentFieldMapping(data, tableData, this.isUpdate, otherData);
    let docketDetails = {}
    docketDetails = reqDkt?.docketsDetails || {};
    docketDetails['invoiceDetails'] = reqDkt?.invoiceDetails || [];
    docketDetails['docketFin'] = reqDkt?.docketFin || [];
    const cnWinCsgn = this.consignmentForm.controls['cnWinCsgn'].value;
    const cnWinCsgne = this.consignmentForm.controls['cnWinCsgne'].value;
    if (cnWinCsgn) {
      const data = {
        "cUSTNM": this.consignmentForm.controls['consignorName'].value?.name || this.consignmentForm.controls['consignorName'].value,
        "cUSTPH": this.consignmentForm.controls['ccontactNumber'].value,
        "aLTPH": this.consignmentForm.controls['calternateContactNo'].value,
        "aDD": this.consignmentForm.controls['cnoAddress'].value,
        "gSTNO": this.consignmentForm.controls['cnogst'].value,
      }
      await this.docketService.walkinFieldMapping(data, cnWinCsgn, false)
    }
    if (cnWinCsgne) {
      const data = {
        "cUSTNM": this.consignmentForm.controls['consigneeName'].value?.name || this.consignmentForm.controls['consigneeName'].value,
        "cUSTPH": this.consignmentForm.controls['cncontactNumber'].value,
        "aLTPH": this.consignmentForm.controls['cnalternateContactNo'].value,
        "aDD": this.consignmentForm.controls['cneAddress'].value,
        "gSTNO": this.consignmentForm.controls['cnegst'].value,
      }
      await this.docketService.walkinFieldMapping(data, false, cnWinCsgne)
    }
    //here the function is calling for add docket Data in docket Tracking.
    if (this.quickDocket) {
      delete docketDetails['_id'];
      delete docketDetails['invoiceDetails'];
      delete docketDetails['docketFin'];
      //await addTracking(this.companyCode, this.operationService, docketDetails)
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets_ltl",
        filter: { docNo: this.consignmentForm.controls["docketNumber"].value },
        update: {
          ...reqDkt?.docketsDetails,
        },
      };
      const resUpdate = await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqBody));
      await this.docketService.operationsFieldMapping(reqDkt.docketsDetails, reqDkt.invoiceDetails, reqDkt.docketFin);
      if (resUpdate) {
        this.Addseries(reqDkt.docketsDetails.pKGS);
      }
    }
    else if(this.isManual){
      delete docketDetails['invoiceDetails'];
      delete docketDetails['docketFin'];
      reqDkt.docketsDetails['_id']=`${this.storage.companyCode}-${reqDkt?.docketsDetails.dKTNO}`;
       await this.docketService.addDcrDetails(reqDkt?.docketsDetails,this.dcrDetail);
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets_ltl",
        data: { ...reqDkt?.docketsDetails}
      };
      await this.docketService.operationsFieldMapping(reqDkt.docketsDetails, reqDkt.invoiceDetails, reqDkt.docketFin,this.isManual);
      const res = await firstValueFrom(this.operationService.operationMongoPost("generic/create", reqBody));
      if (res) {
        this.Addseries(reqDkt.docketsDetails.pKGS);
      }
    }
     else {
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets_ltl",
        docType: "CN",
        branch: this.storage.branch,
        finYear: financialYear,
        timeZone: this.storage.timeZone,
        data: docketDetails,
        party: docketDetails["bPARTYNM"],
      };
      const res = await firstValueFrom(this.operationService.operationMongoPost("operation/docket/ltl/create", reqBody));
      if (res) {
        this.consignmentForm.controls["docketNumber"].setValue(res.data);
        await this.Addseries(reqDkt.docketsDetails.pKGS);
      }
    }
  }
  async Addseries(pkgs) {
    if (parseInt(pkgs) > 0) {
      try {
        // Generate the array with required data.
        const resultArray = await this.generateArray(
          this.storage.companyCode,
          this.consignmentForm.controls["docketNumber"].value,
          pkgs
        );

        // Prepare the request body.
        const reqBody = {
          companyCode: this.storage.companyCode,
          collectionName: "docket_pkgs_ltl",
          data: resultArray
        }
        // Make the POST request and wait for the response.
        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/create", reqBody));
        // Check if response is successful.
        if (res) {
          // Display success message.
          await Swal.fire({
            icon: "success",
            title: "Booked Successfully",
            text: "DocketNo: " + this.consignmentForm.controls["docketNumber"].value,
            showConfirmButton: true,
          }).then((result) => {
            // Redirect after the alert is closed, regardless of whether it is confirmed or not.
            this._NavigationService.navigateTotab('DocketStock', "dashboard/Index");
          });
        }

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Book",
          text: "An error occurred: " + error.message,
        });
      }
    }
  }
  async generateArray(companyCode, dockno, pkg) {
    return new Promise((resolve, reject) => {
      const array = Array.from({ length: pkg }, (_, index) => {
        const serialNo = (index + 1).toString().padStart(4, "0");
        const bcSerialNo = `${dockno}-${serialNo}`;
        const bcDockSf = "0";
        return {
          _id: `${companyCode}-${bcSerialNo}`,
          cID: companyCode,
          dKTNO: dockno,
          pKGSNO: bcSerialNo,
          sFX: bcDockSf,
          lOC: this.storage.branch,
          cLOC: this.storage.branch,
          eNTBY: this.storage.userName,
          eNTLOC: this.storage.branch,
          eNTDT: new Date()
        };
      });

      resolve(array);
    });
  }
  /*getConsignor*/
  getConsignor() {
    const payType = this.consignmentForm.get('payType').value;
    const payTypeNm = this.paymentType.find(x => x.value === payType)?.name;
    if (this.consignmentForm.controls['cnWinCsgn'].value) {
      const mobile =
        this.consignmentForm.controls["consignorName"].value?.otherdetails?.cUSTPH || "";
      this.consignmentForm.controls["ccontactNumber"].setValue(mobile);
      const cnogst =
        this.consignmentForm.controls["consignorName"].value?.otherdetails?.gSTNO || "";
      this.consignmentForm.controls["cnogst"].setValue(cnogst);
      const altPhn =
        this.consignmentForm.controls["consignorName"].value?.otherdetails?.aLTPH || "";
      this.consignmentForm.controls["calternateContactNo"].setValue(altPhn);
      this.consignmentForm.controls['cnoAddress'].setValue({ name: this.consignmentForm.controls['consignorName'].value?.otherdetails?.aDD || "", value: "A888" });
    } else {
      const mobile =
        this.consignmentForm.controls["consignorName"].value?.otherdetails?.customer_mobile || "";
      this.consignmentForm.controls["ccontactNumber"].setValue(mobile);
      const cnogst =
        this.consignmentForm.controls["consignorName"].value?.otherdetails?.GSTdetails[0]?.gstNo || "";
      this.consignmentForm.controls["cnogst"].setValue(cnogst);
      this.SetConsignorAndConsigneeAddressDetails(this.consignmentForm.controls["consignorName"].value?.value, "consignor");
    }
    if(payTypeNm=="PAID"){
      this.consignmentForm.controls['billingParty'].setValue(this.consignmentForm.controls['consignorName'].value)
    }
    
  }
  /*End*/
  /*getConsignee*/
  getConsignee() {
    const payType = this.consignmentForm.get('payType').value;
    const payTypeNm = this.paymentType.find(x => x.value === payType)?.name;
    if (this.consignmentForm.controls['cnWinCsgne'].value) {
      const mobile =
        this.consignmentForm.controls["consigneeName"].value?.otherdetails?.cUSTPH || "";
      this.consignmentForm.controls["cncontactNumber"].setValue(mobile);
      const altPhn =
        this.consignmentForm.controls["consigneeName"].value?.otherdetails?.aLTPH || "";
      this.consignmentForm.controls["cnalternateContactNo"].setValue(altPhn);
      const cnogst =
        this.consignmentForm.controls["consigneeName"].value?.otherdetails?.gSTNO || "";
      this.consignmentForm.controls["cnegst"].setValue(cnogst);
      this.consignmentForm.controls['cneAddress'].setValue({ name: this.consignmentForm.controls['consignorName'].value?.otherdetails?.aDD || "", value: "A888" });
    }
    else {
      const mobile =
        this.consignmentForm.controls["consigneeName"].value?.otherdetails?.customer_mobile || "";
      this.consignmentForm.controls["cncontactNumber"].setValue(mobile);
      const cnegst = this.consignmentForm.controls["consigneeName"].value?.otherdetails?.GSTdetails[0]?.gstNo || "";
      this.consignmentForm.controls["cnegst"].setValue(cnegst);
      this.SetConsignorAndConsigneeAddressDetails(this.consignmentForm.controls["consigneeName"].value?.value, "consignee");
    }
    if(payTypeNm=="TO PAY"){
      this.consignmentForm.controls['billingParty'].setValue(this.consignmentForm.controls['consigneeName'].value)
    }
  }
  /*End*/
  async SetConsignorAndConsigneeAddressDetails(CustomerName, customerType) {
    const billingParty = CustomerName
    const fromCity = this.consignmentForm.controls["fromCity"]?.value.value || "";
    const toCity = this.consignmentForm.controls["toCity"]?.value.value || "";

    if (customerType === 'consignor') {
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
      this.filter.Filter(
        this.allFormControls,
        this.consignmentForm,
        picUpres,
        "cnoAddress",
        false
      );
    }
    if (customerType === 'consignee') {
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
        address,
        "cneAddress",
        false
      );
    }
  }
  /*below code is for invoke a contract*/
  InvockedContract() {
    const paymentBasesName = this.paymentType.find(x => x.value == this.consignmentForm.value.payType).name;
    const TransMode = this.tranType.find(x => x.value == this.consignmentForm.value.transMode).name;
    const party=this.docketService.paymentBaseContract[paymentBasesName]
    const partyDt=this.consignmentForm.controls[party].value.value
    const capacity = this.tableData.reduce((a, c) => a + (parseFloat(c.actualWeight) || 0), 0);
    let reqBody =
    {
      "companyCode": this.storage.companyCode,
      "customerCode": partyDt,
      "contractDate": this.consignmentForm.value.docketDate,
      "productName": TransMode,
      "basis": paymentBasesName,
      "from": this.consignmentForm.value.fromCity.value,
      "to": this.consignmentForm.value.toCity.value,
      "capacity": capacity
    }

    firstValueFrom(this.operationService.operationMongoPost("operation/docket/invokecontract", reqBody))
      .then(async (res: any) => {
        if (res.length == 1) {

          this.NonFreightjsonControlArray = await this.GenerateFixedChargesControls(res[0]?.NonFreightChargeMatrixDetails)
          if (res[0]?.NonFreightChargeMatrixDetailsDetails) {
            let actualWeightInTon
            if (this.consignmentForm.value.cd) {
              actualWeightInTon = this.consignmentForm.value.containerCapacity
            } else {
              actualWeightInTon = this.tableData.reduce((a, c) => a + (parseFloat(c.actualWeight) || 0), 0);
            }

            res[0]?.NonFreightChargeMatrixDetailsDetails?.forEach(element => {
              const calculationRatio = this.docketService.RateTypeCalculation.find(x => x.codeId == element.rTYPCD).calculationRatio;
              const actualWeight = actualWeightInTon * calculationRatio;
              const value = Math.min(Math.max(element.mINV, element.rT * actualWeight), element.mAXV);
              this.NonFreightjsonControlArray.push(this.GenerateVariableChargesControls(element, value))
            });
          }

          if (res[0]?.sERVSELEC) {
            res[0]?.sERVSELEC.forEach(element => {
              const ServiceResponse = this.GetServiceWiseCalculatedData(element, res[0]);
              if (ServiceResponse) {
                this.NonFreightjsonControlArray.push(this.GenerateControllsWithNameAndValue(ServiceResponse))
              }

            });
          }

          this.NonFreightLoaded = true

          this.NonFreightTableForm = formGroupBuilder(this.fb, [
            this.NonFreightjsonControlArray
          ]);
          //  this.consignmentTableForm.controls['tran_day'].setValue(res[0].FreightChargeMatrixDetails?.tRDYS||0);
          this.freightForm.controls["freight_rate"].setValue(res[0].FreightChargeMatrixDetails?.rT);
          this.freightForm.controls["freightRatetype"].setValue(res[0].FreightChargeMatrixDetails?.rTYPCD);
          this.calculateFreight();
           this.consignmentForm.controls['contract'].setValue(res[0]?.docNo||"")
          Swal.fire({
            icon: "success",
            title: "Contract Invoked Successfully",
            text: "ContractId: " + res[0].docNo,
            showConfirmButton: false,
          });
        
        } else {
          Swal.fire({
            icon: "info",
            title: "info",
            text: "Contract Invoked Failed",
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! ${err.message}`,
          showConfirmButton: false,
        });
      });
  }
  /*Emd*/
  GenerateFixedChargesControls(data) {
    return data
      .filter((x) => x.cBT === "Fixed")
      .map((x) => ({
        name: x.sCT.replaceAll(/\s/g, ""),
        label: x.sCT,
        placeholder: x.sCT,
        type: "number",
        value: x.nFC,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        functions: {
          //onChange: "OnChangeFixedAmounts",
        },
      }));
  }
  GenerateVariableChargesControls(data, value) {

    return {
      name: data.sCT.replaceAll(/\s/g, ""),
      label: data.sCT,
      placeholder: data.sCT,
      type: "number",
      value: value,
      generatecontrol: true,
      disable: false,
      Validations: [
        {
          name: "pattern",
          message:
            "Please Enter only positive numbers with up to two decimal places",
          pattern: "^\\d+(\\.\\d{1,2})?$",
        },
      ],
      functions: {
        //onChange: "OnChangeFixedAmounts",
      },
    }
  }
  GetServiceWiseCalculatedData(fieldName, data) {
    switch (fieldName) {
      case "COD/DOD":

        let actualWeightInTon
        if (this.consignmentForm.value.cd) {
          actualWeightInTon = this.consignmentForm.value.containerCapacity
        } else {
          actualWeightInTon = this.tableData.reduce((a, c) => a + (parseFloat(c.actualWeight) || 0), 0);
        }
        if (actualWeightInTon) {
          const calculationRatio = this.docketService.RateTypeCalculation.find(x => x.codeId == data.cODDODRTYP).calculationRatio;
          const actualWeight = actualWeightInTon * calculationRatio;

          const value = Math.min(Math.max(data.mIN, data.rT * actualWeight), data.mAX);
          return {
            "functionName": "",
            "value": value,
            "name": "CODDOD",
            "label": "COD/DOD",
            "placeholder": "COD/DOD"
          }
        }

      case "Demurrage":
        break;
      case "fuelSurcharge":
        break;
      case "Insurance":
        if (this.tableData.length > 0) {
          const TotalInvoiceAmount = this.tableData.reduce(
            (acc, amount) => parseFloat(acc) + parseFloat(amount['invoiceAmount']),
            0
          );
          const actualWeightInTon = this.tableData.reduce(
            (acc, noofPkts) => parseFloat(acc) + parseFloat(noofPkts['actualWeight']),
            0
          );


          const Insurance = data.FreightChargeInsuranceDetails.find(x => x.iVFROM <= TotalInvoiceAmount && x.iVTO >= TotalInvoiceAmount);
          if (Insurance) {
            const calculationRatio = this.docketService.RateTypeCalculation.find(x => x.codeId == Insurance.rtType).calculationRatio;
            const actualWeight = actualWeightInTon * calculationRatio;
            const TotalInsuranceValue = Insurance.rT * actualWeight;
            const value = Math.min(Math.max(Insurance.mIN, TotalInsuranceValue), Insurance.mAX);

            return {
              "functionName": "",
              "value": value,
              "name": "Insurance",
              "label": "Insurance",
              "placeholder": "Insurance"
            };
          }
        }
        break;
    }
  }
  /*below function is for the */
  onMaterialDensity(){
      const matDen=this.invoiceForm.controls['materialDensity'].value;
      if(matDen=="Bulky"){
        const oActualWeight=parseFloat(this.invoiceForm.controls['actualWeight'].value)
        const actualWeight=parseFloat(this.invoiceForm.controls['actualWeight'].value)*25/1000;
        const total=oActualWeight+actualWeight;
        this.invoiceForm.controls['chargedWeight'].setValue(total);
      }
  }
  GenerateControllsWithNameAndValue(RequestData) {
    return {
      name: RequestData.name.replaceAll(/\s/g, ""),
      label: RequestData.label,
      placeholder: RequestData.placeholder,

      type: "number",
      value: RequestData.value,
      generatecontrol: true,
      disable: false,
      Validations: [
        {
          name: "pattern",
          message:
            "Please Enter only positive numbers with up to two decimal places",
          pattern: "^\\d+(\\.\\d{1,2})?$",
        },
      ],
      functions: {
        onChange: RequestData.functionName ? RequestData.functionName : undefined,
      },
    }
  }
  async checkInvoiceExist() {

    if (this.invoiceForm.controls['invoiceNo'].value) {
      const res = await this.docketService.checkInvoiceExistLTL({ cID: this.storage.companyCode,iNVNO: this.invoiceForm.controls['invoiceNo'].value });
      if (res) {
        Swal.fire({
          icon: 'info',
          title: 'Invoice number Exists',
          text: `Invoice number ${this.invoiceForm.controls['invoiceNo'].value} already exists.`
        });
        this.invoiceForm.controls['invoiceNo'].setValue("");
      }
      else {
        const existingInvoice = this.tableData.filter((item) => item.invoiceNumber == this.invoiceForm.controls['invoiceNo'].value);
        if (existingInvoice.length > 1) {
          Swal.fire({
            icon: 'info',
            title: 'Invoice number Exists',
            text: `Invoice number  ${this.invoiceForm.controls['invoiceNo'].value} already exists.`
          });
          this.invoiceForm.controls['invoiceNo'].setValue("");

        }
      }
    }
  }
}
