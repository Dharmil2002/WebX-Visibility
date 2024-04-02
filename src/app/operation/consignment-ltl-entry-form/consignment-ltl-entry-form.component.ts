import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
  addNewTitle: string = "Other Freight Charges";
  // EventButton = {
  //   functionName: "ViewCharge",
  //   name: "Other Freight Charges",
  //   iconName: "add",
  // };
  MatButton = {
    functionName: "viewInfo",
    name: "Other Info",
    iconName: "add",
  };
  rateTypes: AutoComplete[];
  prqData: any;
  constructor(
    private controlPanel: ControlPanelService,
    private prqService: PrqService,
    private route: Router,
    private generalService: GeneralService,
    private storage: StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private customerService: CustomerService,
    private addressService:AddressService,
    private vehicleStatusService: VehicleStatusService,
    private docketService:DocketService,
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
    const filter= {
      cID:this.storage.companyCode,
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
  getVolControls(event) {
    const volumeValue = this.consignmentForm.controls['f_vol'].value;
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
save(){
  debugger
  const data={...this.consignmentForm.value,...this.invoiceForm.value,...this.freightForm.value}
  console.log(data);
}
}
