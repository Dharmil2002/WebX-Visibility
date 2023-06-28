import { Component, OnInit, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AutoCompleteCity, AutoCompleteCommon as AutoCompleteCommon, Cnote, ContractDetailList, DocketChargeRequest, DocketCharges, DocketOtherChargesCriteria, Dropdown, FOVCharge, FuelCharge, prqVehicleReq, Radio, RequestContractKeys, Rules } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { cnoteMetaData } from './Cnote';
import { roundNumber, WebxConvert } from 'src/app/Utility/commonfunction';
import { ChangeDetectorRef } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DocketChargesEntity, DocketEntity, DocketGstEntity, InvoiceEntity, StateDocumentDetailEntity, ViaCityDetailEntity } from 'src/app/core/models/docketModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cnote-generation',
  templateUrl: './cnote-generation.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],

})
export class CNoteGenerationComponent implements OnInit {
  //intialization of varible 
  isDisabled = true;
  RequestContractKeysDetail = new RequestContractKeys();
  DocketOtherChargesCriteria = new DocketOtherChargesCriteria();
  FuelCharge = new FuelCharge();
  FOVCharge = new FOVCharge();
  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  detail = cnoteMetaData;
  metaCnote: Cnote[];
  InvoiceLevalrule: any;
  CnoteData: Cnote[];
  Rules: Rules[];
  option: any;
  isOpen = false;
  version: number = 1;
  docketallocate = 'Alloted To';
  cnoteAutoComplete: AutoCompleteCommon[];
  Fcity: AutoCompleteCity[];
  DocketEntity = new DocketEntity();
  ConsignorCity: AutoCompleteCity[];
  Tcity: AutoCompleteCity[];
  Vehicno: AutoCompleteCity[];
  Multipickup: AutoCompleteCity[];
  prqVehicleReq: prqVehicleReq[];
  Destination: AutoCompleteCity[];
  pinCodeDetail: AutoCompleteCity[];
  filteredCity: Observable<AutoCompleteCity[]>;
  filteredcharge: Observable<AutoCompleteCity[]>;
  filteredCnoteBilling: Observable<AutoCompleteCommon[]>;
  //---Freight Charges---//
  FreightRate: number;
  FreightCharge: number;
  FreightRateType: any;
  //---End----//
  /*Discount Rate*/
  DiscountRate: number;
  DiscountRateType: string;
  DiscountAmount: number;
  //end//
  /*FOV Rate*/
  FOVRate: number;
  FOVRateType: string;
  FOVCalculated: number;
  FOVCharged: number;
  //end
  /*COD/DOD Charges*/
  CODDODCharged: number;
  CODDODTobeCollected: number;
  CODRateType: string;
  //end
  ///*Other Charges*/
  DocketOtherCharges: DocketCharges[];
  //End//
  //* DACC Charged*//
  DACCCharged: any;
  DACCToBeCollected: any;
  DACCRateType: string;
  //---End----//
  pReqFilter: Observable<prqVehicleReq[]>;
  @ViewChild('closebutton') closebutton;
  displaybarcode: boolean = false;
  countDktNo: number = 0;
  invoke: boolean = false;
  DocketChargeRequest: DocketChargeRequest;
  breadscrums = [
    {
      title: "CNoteGeneration",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ]
  date: Date = new Date();
  formattedDate: string;
  step1Formcontrol: Cnote[];
  step2Formcontrol: Cnote[];
  step3Formcontrol: Cnote[];
  data: any;
  BSTformarray: Cnote[];
  SerialScan: number = 1;
  barcodearray: Cnote[];
  minDate = new Date();
  InvoiceDetails: Cnote[];
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  contractDetail: ContractDetailList[];
  Consignee: Cnote[];
  Consignor: Cnote[];
  ConsigneeCity: any;
  DocumentDetails: Cnote[];
  AppointmentBasedDelivery: Cnote[];
  //Radio button propty
  RadionAppoimentBasedDelivery: Radio[] = [{
    label: "Yes",
    value: "Y",
    name: "IsAppointmentBasedDelivery"
  },
  {
    label: "No",
    value: "N",
    name: "IsAppointmentBasedDelivery"
  }
  ]
  BcSerialTypeRadio: Radio[] = [{
    label: "Serial Scan",
    value: "S",
    name: "SerialScan"
  },
  {
    label: "Each Scan",
    value: "E",
    name: "SerialScan"
  }
  ]
  //end---------------
  AppointmentDetails: Cnote[];
  isappointmentvisble: boolean;
  ContainerDetails: Cnote[];
  ContainerSize: Dropdown[];
  ContainerType: Dropdown[];
  ContainerCapacity: Dropdown[];
  autofillflag: boolean = false;
  BcSerialType: Cnote[];
  BcSeries: Cnote[];
  Consigneeflag: boolean;

  //step3 hidden field which is use to cal
  WeightToConsider: string;
  VolMeasure: string;
  MaxMeasureValue: number;
  MinInvoiceValue: number;
  MaxInvoiceValue: number;
  MinInvoiceValuePerKG: number;
  MaxInvoiceValuePerKG: number;
  DefaultChargeWeight: number;
  MinChargeWeight: number;
  MaxChargeWeight: number;
  //end--------------------------------------
  //hidden field
  TaxControlType: string;
  CcmServicesData: any;
  //end
  //hiddden  field for ContractInvokeDependent
  BasedOn1: string;
  BasedOn2: string;
  UseFrom: string;
  UseTo: string;
  UseTransMode: string;
  UseRateType: string;
  ChargeWeightToHighestDecimal: string;
  ContractDepth: string;
  ProceedDuringEntry: string;
  rowBillingParty: boolean;
  isBillingPartysName: boolean;
  //end
  //HiddenFieldforStep1
  DeliveryZone: string;
  DestDeliveryPinCode: string;
  DestDeliveryArea: string;
  PincodeZoneLocation: string;
  //End
  //otherchargeHiddenField
  MinFreightRate: number;
  hdnDistanceInvoke: number;
  BrimApiRule: string;
  BrimGST: number;
  BrimKFC: number;
  BrimTotalAmount: number;
  BaseCode1: any;
  BaseCode2: any;
  otherCharges: Cnote[];
  contractKeysInvoke: any;
  FOVChargeInvoke: any;
  FOVFlag: any;
  FOVCharges: any;
  IsDocketEdit: string;
  InvokeNewContract: string = "N";
  codCharges: any;
  DaccCharged: any;
  DaccChargedDetail: any;
  chargeList: any;
  chargeValues: any;
  IsFovChargeReadOnly: boolean;
  IsCodDodChargeReadOnly: boolean;
  IsDaccReadOnly: boolean;
  WhoIsParty: any;
  AdvanceGivenTo: {}[];
  AdvancePayMode: { CodeId: string; CodeDesc: string; }[];
  RuleDPHBilling: string;
  DPHBillingReadOnly: string;
  DPHCharge: any;
  DPHRateType: any;
  DPHRate: any;
  DPHAmount: any;
  Distance: any;
  newDocketChanged: boolean = false;
  docketOtherCharge: any[];
  ContractData: any;
  ContractId: any;
  IsDeferment: any;
  FlagCutoffApplied: any;
  FlagHolidayBooked: any;
  FlagHolidayApplied: any;
  mapcityRule: string;
  destionationNestedDate: any;
  isLinear = true;
  ChargeKm: any;
  IsQuickCompletion: string;
  EwayBill: boolean = false;
  EwayBillDetail: any;
  ServiceType: any;
  showOther: boolean = true;
  showOtherContainer: boolean = true;
  showOtherAppointment: boolean = true;

  //End
  constructor(private fb: UntypedFormBuilder, private Route: Router, private cdr: ChangeDetectorRef, private modalService: NgbModal, private dialog: MatDialog, private ICnoteService: CnoteService, @Inject(PLATFORM_ID) private platformId: Object, private datePipe: DatePipe) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.EwayBillDetail = this.Route.getCurrentNavigation()?.extras?.state.Ewddata;
      this.EwayBill = true;
      this.ServiceType = this.Route.getCurrentNavigation()?.extras?.state.ServiceType;
      this.showOtherContainer = true;
      this.showOtherAppointment = true;
    }
    this.GetActiveGeneralMasterCodeListByTenantId()

  }

  ngOnInit(): void {
    this.getDaterules();
    this.getContractDetail();
  }


  // Define a function that creates and returns a FormGroup for step 1 of the form
  step1Formgrop(): UntypedFormGroup {
    const formControls = {}; // Initialize an empty object to hold form controls
    this.step1Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '1'); // Filter the form data to get only the controls for step 1
    // Loop through the step 1 form controls and add them to the form group
    if (this.step1Formcontrol.length > 0) {
      this.step1Formcontrol.forEach(cnote => {
        let validators = []; // Initialize an empty array to hold validators for this control
        if (cnote.Validation === 'Required') { // If the control is required, add a required validator
          validators = [Validators.required];
        }

        // Add the control to the form group, using its default value (or the current date if it is a 'TodayDate' control) and any validators
        formControls[cnote.name] = this.fb.control(cnote.defaultvalue == 'TodayDate' ? new Date() : cnote.defaultvalue, validators);
      });
      // Create and return the FormGroup, using the form controls we just created
      return this.fb.group(formControls)
    }
  }



  //step-2 Formgrop 
  step2Formgrop(): UntypedFormGroup {
    const formControls = {};
    // get all the form controls belonging to step 2
    this.step2Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '2')
    // get all form controls belonging to Consignor section
    this.Consignor = this.CnoteData.filter((x) => x.div == 'Consignor')
    // get all form controls belonging to Consignee section
    this.Consignee = this.CnoteData.filter((x) => x.div == 'Consignee')
    // get all form controls belonging to Document Details section
    // and add dropdown options to RSKTY control
    this.DocumentDetails = this.CnoteData.filter((x) => x.div == 'DocumentDetails').map(item => {
      if (item.name === 'RSKTY') {
        item.dropdown = [{
          "CodeId": "C",
          "CodeDesc": "Carrier's Risk"
        },
        {
          "CodeId": "O",
          "CodeDesc": "Owner's Risk"
        }
        ];
      }
      return item;
    });
    // get all form controls belonging to Appointment Based Delivery section
    this.AppointmentBasedDelivery = this.CnoteData.filter((x) => x.div == 'AppointmentBasedDelivery')
    // get all form controls belonging to Appointment Details section
    this.AppointmentDetails = this.CnoteData.filter((x) => x.div == 'AppointmentDetails');
    // define dropdown options for certain form controls in Container Details section
    const dropdowns = {
      'ContainerSize1': this.ContainerSize,
      'ContainerSize2': this.ContainerSize,
      'ContainerType': this.ContainerType,
      'ContainerCapacity': this.ContainerCapacity
    };
    // get all form controls belonging to Container Details section
    // and add dropdown options to applicable controls
    this.ContainerDetails = this.CnoteData.filter((x) => x.div == 'ContainerDetails').map(item => {
      if (dropdowns.hasOwnProperty(item.name)) {
        item.dropdown = dropdowns[item.name];
      }
      return item;
    });
    // add form controls to the form group
    if (this.step2Formcontrol.length > 0) {
      this.step2Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.Validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control(cnote.defaultvalue, validators);
        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
      return this.fb.group(formControls)
    }
  }


  // Create a typed form group for step 3
  step3Formgrop(): UntypedFormGroup {

    const formControls = {};

    // Get all the form controls that belong to step 3 from CnoteData
    this.step3Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '3')

    // Get all the controls that belong to BcSerialType from CnoteData
    this.BcSerialType = this.CnoteData.filter((x) => x.div == 'BcSerialType')

    // Loop through each control and create form controls with appropriate validators
    if (this.step3Formcontrol.length > 0) {
      this.step3Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.Validation === 'Required') {
          validators = [Validators.required];
        }

        formControls[cnote.name] = this.fb.control(cnote.defaultvalue, validators);

        if (!cnote.enable) {
          formControls[cnote.name].disable();
        }
      });
    }

    // Get all the invoice details from CnoteData
    this.InvoiceDetails = this.CnoteData.filter((x) => x.frmgrp == '3' && x.div == 'InvoiceDetails')

    // Loop through each invoice detail and create form controls with appropriate validators
    if (this.InvoiceDetails.length > 0) {
      const array = {}
      this.InvoiceDetails.forEach(Idetail => {
        let validators = [];
        if (Idetail.Validation === 'Required') {
          validators = [Validators.required];
        }
        array[Idetail.name] = this.fb.control(Idetail.defaultvalue == 'TodayDate' ? new Date().toISOString().slice(0, 10) : Idetail.defaultvalue, validators);

      });

      // Add the array of invoice details form controls to the form group
      formControls['invoiceArray'] = this.fb.array([
        this.fb.group(array)
      ])
    }

    // Get all the controls that belong to BcSeries from CnoteData
    this.BcSeries = this.CnoteData.filter(x => x.frmgrp == '3' && x.div == 'BcSeries')

    // Loop through each BcSeries control and create form controls with appropriate validators
    if (this.BcSeries.length > 0) {
      const array = {}
      this.BcSeries.forEach(BcSeries => {
        let validators = [];
        if (BcSeries.Validation === 'Required') {
          validators = [Validators.required];
        }

        array[BcSeries.name] = this.fb.control('', validators);

      });

      // Add the array of BcSeries form controls to the form group
      formControls['BcSeries'] = this.fb.array([
        this.fb.group(array)
      ])
    }

    // Get all the controls that belong to barcodearray from CnoteData
    this.barcodearray = this.CnoteData.filter((x) => x.div == 'barcodearray')

    // Loop through each barcode control and create form controls with appropriate validators
    if (this.barcodearray.length > 0) {
      const array = {}
      this.barcodearray.forEach(cnote => {
        let validators = [];
        if (cnote.Validation === 'Required') {
          validators = [Validators.required];
        }

        array[cnote.name] = this.fb.control(cnote.defaultvalue, validators);

        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });

      // Add the array of barcode form controls to the form group
      formControls['barcodearray'] = this.fb.array([
        this.fb.group(array)
      ])
    }
    this.otherCharges = this.CnoteData.filter((x) => x.div == 'otherCharges' && x.Class != 'extraOtherCharge' && x.Class != 'CodDodPortion');
    // Return the final form group with all the created form
    return this.fb.group(formControls)
  }

  //start invoiceArray
  addField() {
    const array = {};
    const fields = this.step3.get('invoiceArray') as FormArray;

    // Iterate through the InvoiceDetails array and create a form control for each item
    if (this.InvoiceDetails.length > 0) {
      this.InvoiceDetails.forEach(Idetail => {
        array[Idetail.name] = this.fb.control(Idetail.defaultvalue == 'TodayDate' ? new Date().toISOString().slice(0, 10) : Idetail.defaultvalue);
      });
    }

    // Add the form group to the form array
    fields.push(this.fb.group(array));
  }

  removeField(index: number) {
    const fields = this.step3.get('invoiceArray') as FormArray;

    // Only remove the form group if there are more than one
    if (fields.length > 1) {
      fields.removeAt(index);
    }
  }
  //end



  // start BcSeries
  addBcSeriesField() {
    // create an empty object to store form controls
    const array = {}
    // get the 'BcSeries' form array
    const fields = this.step3.get('BcSeries') as FormArray;
    // check if there are invoice details available
    if (this.InvoiceDetails.length > 0) {
      // create a form control for each invoice detail and add it to the object
      this.InvoiceDetails.forEach(cnote => {
        array[cnote.name] = this.fb.control('');
      });
    }
    // add the form group with the form controls to the 'BcSeries' form array
    fields.push(this.fb.group(array));
  }

  removeBcSeriesField(index: number) {
    // get the 'BcSeries' form array
    const fields = this.step3.get('BcSeries') as FormArray;
    // check if there are more than one form group available
    if (fields.length > 1) {
      // remove the form group at the specified index
      fields.removeAt(index);
    }
  }
  // end




  // Call the appropriate function based on the given function name
  callActionFunction(functionName: string, event: any) {
    switch (functionName) {
      case "billingPartyrules":
        this.getBillingPartyAutoComplete(event);
        break;
      case "billingPartyDisble":
        this.getBillingPartyAutoComplete('PRQ_BILLINGPARTY');
        this.GetConsignorConsigneeRules();
        break;
      case "FromCityaction":
        this.getFromCity();
        this.GetDetailedBasedOnContract();
        this.autofillCustomer();
        this.GetInvoiceConfigurationBasedOnTransMode();
        break;
      case "ToCityAction":
        this.getToCity();
        break;
      case "Destination":
        this.GetDetailedBasedOnLocations();
        this.GetDestinationDataCompanyWise();
        break;
      case "getVehicleNo":
        this.getVehicleNo();
        break;
      case "Prqdetail":
        this.prqVehicle();
        break;
      case "autoFill":
        this.autoFill(event);
        break;
      case "DocketValidation":
        this.DocketValidation();
        break;
      case "GetMultiPickupDeliveryDocket":
        this.GetMultiPickupDeliveryDocket(event);
        break;
      case "ConsignorCity":
        this.getConsignorCity();
        break;
      case "ConsignorPinCode":
        this.getPincodeDetail('ConsignorPinCode');
        break;
      case "ConsigneeCity":
        this.getConsigneeCity();
        break;
      case "ConsigneePinCode":
        this.getPincodeDetail('ConsigneePinCode');
        break;
      case "IsConsignorFromMasterOrWalkin":
        this.isLabelChanged('Consignor', event.checked);
        break;
      case "IsConsigneeFromMasterOrWalkin":
        this.isLabelChanged('Consignee', event.checked);
        break;
      case "displayedAppointment":
        this.displayedAppointment();
        break;
      case "Volumetric":
        this.volumetricChanged();
        break;
      case "BcSerialType":
        this.openModal(event);
        break;
      case "ConsignorChanged":
        this.ConsignorAutoFill();
        break;
      case "ConsigneeDetail":
        this.ConsigneeAutoFill();
        break;
      case "InvoiceCubicWeightCalculation":
        this.InvoiceCubicWeightCalculation(event);
        break;
      case "CalculateRowLevelChargeWeight":
        this.InvoiceCubicWeightCalculation(event);
        break;
      case "ValidateBcSeriesRow":
        this.ValidateBcSeriesRow(event);
        break;
      case "VEHICLE_NO":
        this.Divisionvalue();
        break;
      case "ValidateInvoiceNo":
        this.ValidateInvoiceNo(event);
        break;
      case "codeChanged":
        this.codeChanged();
        break;
      case "DisbledTypeOfmovement":
        this.DisbleTypeOFmovent();
        break;
      case "GetDestination":
        this.GetDestination();
        break;
      case "DestinationAutofill":
        this.toCityAutofill(event);
        this.GetDetailedBasedOnLocations();
        break;
      case "getFromCity":
        this.getFromCity();
        break;
      case "getTocity":
        this.getToCity();
        break;
      default:
        break;
    }
  }



  //ConsignorAutoFill
  ConsignorAutoFill() {
    //set the value of GSTINNO control to the GSTINNumber of CST_NM control if it is not null, otherwise set it to empty string
    this.step2.controls['GSTINNO'].setValue(this.step2.controls['CST_NM'].value == null ? '' : this.step2.controls['CST_NM'].value.GSTINNumber);
    //set the value of CST_ADD control to the CustAddress of CST_NM control
    this.step2.controls['CST_ADD'].setValue(this.step2.controls['CST_NM'].value.CustAddress);
    //set the value of CST_PHONE control to the TelephoneNo of CST_NM control
    this.step2.controls['CST_PHONE'].setValue(this.step2.controls['CST_NM'].value.TelephoneNo);
    //set the value of CST_MOB control to the phoneno of CST_NM control
    this.step2.controls['CST_MOB'].setValue(this.step2.controls['CST_NM'].value.phoneno);
  }
  //end


  // ConsigneeAutoFill function to auto-fill Consignee details
  ConsigneeAutoFill() {
    // Set ConsigneeGSTINNO control value to GSTIN number if it exists, otherwise set it to empty string
    this.step2.controls['ConsigneeGSTINNO'].setValue(this.step2.controls['ConsigneeCST_NM'].value.GSTINNumber == null ? '' : this.step2.controls['ConsigneeCST_NM'].value.GSTINNumber);

    // Set ConsigneeCST_ADD control value to Consignee address
    this.step2.controls['ConsigneeCST_ADD'].setValue(this.step2.controls['ConsigneeCST_NM'].value.CustAddress);

    // Set ConsigneeCST_PHONE control value to Consignee telephone number
    this.step2.controls['ConsigneeCST_PHONE'].setValue(this.step2.controls['ConsigneeCST_NM'].value.TelephoneNo);

    // Set ConsigneeCST_MOB control value to Consignee mobile number
    this.step2.controls['ConsigneeCST_MOB'].setValue(this.step2.controls['ConsigneeCST_NM'].value.phoneno);
  }
  // End of ConsigneeAutoFill function


  // Get all fields and bind
  GetCnotecontrols() {
    this.ICnoteService.getNewCnoteBooking('cnotefields/', parseInt(localStorage.getItem("companyCode"))).subscribe({
      next: (res: any) => {
        if (res) {
          // Push the details array into the response array and filter based on useField property, sort by Seq property
          res.push(...this.detail);
          this.CnoteData = res.filter(obj => obj.useField === 'Y').sort((a, b) => a.Seq - b.Seq);
          // Store the CnoteData array and version number in local storage
          localStorage.setItem('CnoteData', JSON.stringify(this.CnoteData));
          localStorage.setItem('version', this.version.toString());
          if (this.ServiceType) {
            this.CNoteFieldChecked()
          }

          // Initialize the form groups for steps 1, 2, and 3
          this.step1 = this.step1Formgrop();
          this.step2 = this.step2Formgrop();
          this.step3 = this.step3Formgrop();
          // Get the rules for the current company
          this.getRules();
        }
      },
      error: (error) => {
        // Handle error
      }
    });
  }

  //Bind all rules
  getRules() {
    this.ICnoteService.getNewCnoteBooking('services/companyWiseRules/', parseInt(localStorage.getItem("companyCode"))).subscribe({
      next: (res: any) => {
        if (res) {
          // Set the Rules variable to the first element of the response array
          this.Rules = res[0];
          // Get the Invoice Level Contract Invoke rule and check if its default value is "Y"
          this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
          if (this.InvoiceLevalrule.defaultvalue != "Y") {
            // If the default value of the Invoice Level Contract Invoke rule is not "Y",
            // filter out the step3Formcontrol items with div "InvoiceDetails" or dbCodeName "INVOICE_LEVEL_CONTRACT_INVOKE"
            this.step3Formcontrol = this.step3Formcontrol.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName !== 'INVOICE_LEVEL_CONTRACT_INVOKE');
          }
          if (!this.ServiceType) { this.step1.controls['F_ODA'].disable(); }

          // Get the MAP_DLOC_PIN rule and USE_MAPPED_LOCATION_INCITY rule
          let Rules = this.Rules.find((x) => x.code == 'MAP_DLOC_PIN')
          let mapcityRule = this.Rules.find((x) => x.code == `USE_MAPPED_LOCATION_INCITY`)
          this.mapcityRule = mapcityRule.defaultvalue
          if (Rules.defaultvalue == "A") {
            if (mapcityRule.defaultvalue === "Y") {
              // If the default value of MAP_DLOC_PIN is "A" and USE_MAPPED_LOCATION_INCITY is "Y",
              // disable the DELLOC control in step1
              this.step1.controls['DELLOC'].disable();
            }
          }
          else {
            if (mapcityRule.defaultvalue === "Y") {
              // If the default value of MAP_DLOC_PIN is not "A" and USE_MAPPED_LOCATION_INCITY is "Y",
              // disable the DELLOC control in step1
              this.step1.controls['DELLOC'].disable();
            }

            let ALLOWDEFAULTINVNODECLVAL = this.Rules.find(x => x.code == 'ALLOW_DEFAULT_INVNO_DECLVAL');
            if (ALLOWDEFAULTINVNODECLVAL.defaultvalue == 'Y') {
              this.step3.get('invoiceArray').setValue(
                this.step3.value.invoiceArray.map(x => ({ ...x, INVNO: x.INVNO ? x.INVNO : 'NA' }))
              );
            }
            //DKT_TAX_CONTROL_TYPE rule
            this.TaxControlType = this.Rules.find(x => x.code === 'DKT_TAX_CONTROL_TYPE')?.defaultvalue ?? 'N'
            //end
          }

          // Call the volumetricChanged function
          this.volumetricChanged();
          // Call the GetInvoiceConfigurationBasedOnTransMode function
          this.GetInvoiceConfigurationBasedOnTransMode();
          // Call the getDaterules function
          //this.getDaterules();
          //Step1 Basic Detaill
          this.GetDetailedBasedOnCStep1();
          //End
        }
      }
    })
  }
  //E-wayBillDetail
  EwayBillDetailAutoFill() {
    let fromcity = {
      Name: this.EwayBillDetail[1].FromMaster.city || '',
      Value: this.EwayBillDetail[1].FromMaster.city || '',
    }
    let billingparty = {
      Name: this.EwayBillDetail[1].FromMaster.CUSTCD || '',
      Value: this.EwayBillDetail[1].FromMaster.CUSTNM || '',
    }
    let ConsignorPinCode = {
      Name: this.EwayBillDetail[1].FromMaster.city || '',
      Value: this.EwayBillDetail[1].FromMaster.pincode || '',
    }
    this.step1.controls['FCITY'].setValue(fromcity);
    this.step2.controls['ConsignorCity'].setValue(fromcity);
    this.step2.controls['CST_NM'].setValue(billingparty);
    this.step1.controls['PRQ_BILLINGPARTY'].setValue(billingparty);
    this.step2.controls['CST_ADD'].setValue(this.EwayBillDetail[1].FromMaster.CustAddress || '');
    this.step2.controls['ConsignorPinCode'].setValue(ConsignorPinCode);
    this.step2.controls['GSTINNO'].setValue(this.EwayBillDetail?.fromGstin || '');
    let Tocity = {
      Name: this.EwayBillDetail[0].data?.toPlace || '',
      Value: this.EwayBillDetail[0].data?.toPlace || '',
    }
    let Consignee = {
      Name: this.EwayBillDetail[0].data?.toTrdName || '',
      Value: this.EwayBillDetail[0].data?.toTrdName || '',
    }
    let Pincode = {
      Name: this.EwayBillDetail[0].data?.toPlace || '',
      Value: this.EwayBillDetail?.toPincode || '',
    }
    this.step1.controls['TCITY'].setValue(Tocity);
    this.GetDestinationDataCompanyWise()
    this.step2.controls['ConsigneeCity'].setValue(Tocity);
    this.step2.controls['ConsigneeCST_NM'].setValue(Consignee);
    this.step2.controls['ConsigneeCST_ADD'].setValue(this.EwayBillDetail?.toAddr1 || '');
    this.step2.controls['ConsigneePinCode'].setValue(Pincode);
    this.step2.controls['ConsigneeGSTINNO'].setValue(this.EwayBillDetail?.toGstin || '');
    this.step3.controls['TotalDeclaredValue'].setValue(this.EwayBillDetail?.totalValue || 0)
    this.EwayBillDetail?.itemList.forEach(x => {
      const Ewayjson = this.fb.group({
        EWBDATE: [new Date()],
        EWBEXPIRED: [new Date()],
        Invoice_Product: [x.productName],
        NO_PKGS: [x.quantity],
        DECLVAL: [x.taxableAmount],
        HSN_CODE: [x.hsnCode],
        INVDT: [new Date()],
        INVNO: [''],
        ACT_WT: [0],
        EWBNO: [0]
      });
      (this.step3.get('invoiceArray') as FormArray).push(Ewayjson);
    });
    let noofpkg = 0
    this.step3.value.invoiceArray.forEach((d) => {
      noofpkg = d.NO_PKGS + noofpkg
    })
    this.step3.controls['TotalChargedNoofPackages'].setValue(noofpkg);
    let setSVCTYPE = this.step1Formcontrol.find((x) => x.name == 'SVCTYP').dropdown;
    this.step1.controls['SVCTYP'].setValue(setSVCTYPE.find((x) => x.CodeDesc == this.ServiceType).CodeId);
  }
  //End

  // This function fetches the date rules from the backend and sets the minimum date for the date picker based on the rule.
  getDaterules() {
    this.ICnoteService.getNewCnoteBooking('services/getRuleFordate/', parseInt(localStorage.getItem("companyCode"))).subscribe({
      next: (res: any) => {
        let filterfordate = res.find((x) => x.Rule_Y_N == 'Y');
        this.minDate.setDate(this.minDate.getDate() - filterfordate.BackDate_Days);
      }
    });
  }

  autoFill(event) {
    //VehicleAutoFill
    let VehicleNo = {
      Value: event.option.value.VehicleNo,
      Name: event.option.value.VehicleNo,
      Division: ""
    }
    this.step1.controls['VEHICLE_NO'].setValue(VehicleNo);
    //end
    //Billing PartyAuto
    let billingParty = {
      Value: event.option.value.PARTY_CODE,
      Name: event.option.value.PARTYNAME
    }
    this.step1.controls['PRQ_BILLINGPARTY'].setValue(billingParty);
    this.autofillflag = true
    //this.getBillingPartyAutoComplete('PRQ_BILLINGPARTY')
    //end
    //consginer
    let consginer = {
      Value: event.option.value.CSGNCD,
      Name: event.option.value.CSGNNM
    }
    this.step2.controls['CST_NM'].setValue(consginer);
    //
    //address
    this.step2.controls['CST_ADD'].setValue(event.option.value.CSGNADDR);
    //end
    //telephone
    this.step2.controls['CST_PHONE'].setValue(event.option.value.CSGNTeleNo);
    //end
    //FromCity
    let FromCity = {
      Value: event.option.value.FROMCITY,
      Name: event.option.value.FROMCITY,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['FCITY'].setValue(FromCity);
    //end
    //ToCity
    let toCity = {
      Value: event.option.value.TOCITY,
      Name: event.option.value.TOCITY,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['TCITY'].setValue(toCity);
    //end
    //Paybas
    this.step1.controls['PAYTYP'].setValue(event.option.value.Paybas == null ? this.step1.controls['PAYTYP'].value : event.option.value.Paybas);
    //end

    //FTLTYP
    this.step1.controls['SVCTYP'].setValue(event.option.value.FTLValue == null ? this.step1.controls['SVCTYP'].value : event.option.value.FTLValue);
    //end

    //Road
    this.step1.controls['TRN'].setValue(event.option.value.TransModeValue == null ? this.step1.controls['TRN'].value : event.option.value.TransModeValue);
    //end

    //Destination
    this.GetDestinationDataCompanyWise();
    //end

    //PKGS
    this.step1.controls['PKGS'].setValue(event.option.value.pkgsty == null ? this.step1.controls['PKGS'].value : event.option.value.pkgsty)
    //end

    //PICKUPDELIVERY
    this.step1.controls['PKPDL'].setValue(event.option.value.pkp_dly == null ? this.step1.controls['PKPDL'].value : event.option.value.pkp_dly);
    //end

    //PROD
    this.step1.controls['PROD'].setValue(event.option.value.prodcd == null ? this.step1.controls['PROD'].value : event.option.value.prodcd);
    //end
    //ConsigneeCST_NM
    let ConsigneeCST_NM = {
      Name: event.option.value.CSGENM,
      Value: event.option.value.CSGECD,
    }
    this.step2.controls['ConsigneeCST_NM'].setValue(ConsigneeCST_NM);
    //end

    //ConsigneeCST_ADD
    this.step2.controls['ConsigneeCST_ADD'].setValue(event.option.value.CSGEADDR);
    //end
    //ConsigneeCST_PHONE
    this.step2.controls['ConsigneeCST_PHONE'].setValue(event.option.value.CSGETeleNo);
    //end

    //step 3 
    const invoiceArray = this.step3.value.invoiceArray.map(x => ({
      ...x,
      ACT_WT: event.option.value.ATUWT || x.ACT_WT,
      NO_PKGS: event.option.value.PKGSNO || x.NO_PKGS
    }));
    this.step3.get('invoiceArray').setValue(invoiceArray);
    this.cdr.detectChanges();
    this.CalculateInvoiceTotal();
    //

    //call api GetPrqInvoiceList
    this.GetPrqInvoiceList();
    //end

  }


  /**
   * Fetches contract details from API and sets it in component variable.
   */
  getContractDetail() {
    this.ICnoteService.getNewCnoteBooking('services/getContractDetail/', parseInt(localStorage.getItem("companyCode"))).subscribe({
      next: (res: any) => {
        if (res) {
          this.contractDetail = res;
        }
      }
    })
  }


  /**
   * Gets the billing party autocomplete options based on the event and step.
   * @param event The event that triggered the method.
   */
  getBillingPartyAutoComplete(event) {
    let step = 'step' + this.CnoteData.find((x) => x.name == event).frmgrp;
    let control;
    switch (step) {
      case 'step1':
        control = this.step1.get(event).value.Value == undefined ? this.step1.get(event).value : this.step1.get(event).value.Name == null ? '' : this.step1.get(event).value.Name;
        break;
      case 'step2':
        control = this.step2.get(event).value;
        break;
      case 'step3':
        control = this.step3.get(event).value;
        break;
    }

    let rulePartyType = this.Rules.find((x) => x.code == 'PARTY' && x.paybas == this.step1.controls['PAYTYP'].value);
    if (rulePartyType.defaultvalue == "D") {
      this.step1.controls['PRQ_BILLINGPARTY'].disable();

    }
    else {
      this.step1.controls['PRQ_BILLINGPARTY'].enable();
      if (control.length > 3) {
        let bLcode = this.CnoteData.find((x) => x.name == event);
        let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
        let Defalutvalue = this.Rules.find((x) => x.code == 'CUST_HRCHY');
        let CustomerType = event == 'PRQ_BILLINGPARTY' ? 'CP' : event == 'CST_NM' ? 'CN' : 'CE';
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          LocCode: localStorage.getItem("Branch"),
          searchText: control,
          CustHierarchy: Defalutvalue.defaultvalue,
          PayBase: this.step1.controls['PAYTYP'].value,
          BookingDate: this.datePipe.transform(this.step1.controls['DKTDT'].value, 'd MMM y').toUpperCase(),
          CustomerType: rules.defaultvalue == 'Y' ? CustomerType : "",
          ContractParty: event == 'PRQ_BILLINGPARTY' ? 'BillingParty' : event == 'Consignor' ? 'Consignor' : 'Consignee'
        }
        this.ICnoteService.cnoteNewPost('services/billingParty', req).subscribe({
          next: (res: any) => {
            if (res) {
              this.cnoteAutoComplete = res;
              if (this.autofillflag == true) {
                // TODO: Implement autofill
                this.autofillflag = false;
              }
              else {
                this.getFromCity();
                this.getToCity();
              }
              this.getBillingPartyFilter(event);
            }
          }
        })
      }
    }
  }

  // Filter function for billing party autocomplete
  getBillingPartyFilter(event) {
    // Determine which step the billing party control is in
    let step = 'step' + this.CnoteData.find((x) => x.name == event).frmgrp;

    // Set filteredCnoteBilling based on which step the control is in
    switch (step) {
      case 'step1':
        this.filteredCnoteBilling = this.step1.controls[event].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) => Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice())
        );
        break;
      case 'step2':
        this.filteredCnoteBilling = this.step2.controls[event].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) => Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice())
        );
        break;
      case 'step3':
        this.filteredCnoteBilling = this.step3.controls[event].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) => Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice())
        );
        break;
    }
  }


  // Filter function for billing group autocomplete
  _bilingGropFilter(name: string): AutoCompleteCommon[] {
    const filterValue = name.toLowerCase();

    return this.cnoteAutoComplete.filter(
      (option) => option.Name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  // Function to display billing group in the input field
  displayCnotegropFn(Cnotegrop: AutoCompleteCommon): string {
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Value + ":" + Cnotegrop.Name : "";
  }

  //End

  //FromCity

  getFromCity() {

    if (this.step1Formcontrol) {
      // find FCITY control
      const cityFormControl = this.step1Formcontrol.find(control => control.name === 'FCITY');
      // find matching rule based on FCITY control's dbCodeName
      const matchingRule = this.Rules.find(rule => rule.code === cityFormControl.dbCodeName);
      if (this.step1.controls['FCITY'].value.length > 2) {
        const request = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ruleValue: matchingRule.defaultvalue,
          searchText: this.step1.controls['FCITY'].value,
          docketMode: "Yes",
          ContractParty: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || "",
          PaymentType: this.step1.controls['PAYTYP'].value
        };

        this.ICnoteService.cnoteNewPost('services/GetFromCityDetails', request).subscribe({
          next: (response: any) => {
            this.Fcity = response.result;
            this.getCityFilter();
          }
        });
      }
    }



  }
  //end



  // Get the list of destination cities based on the selected values
  getToCity() {
    if (this.step1Formcontrol) {
      // Get the TCITY control from step1Formcontrol and find the corresponding rule
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'TCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      if (this.step1.controls['TCITY'].value.length > 2) {
        // Build the request object with necessary data
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ruleValue: rules.defaultvalue,
          searchText: this.step1.controls['TCITY'].value,
          docketMode: "Yes",
          ContractParty: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || "",
          PaymentType: this.step1.controls['PAYTYP'].value,
          FromCity: this.step1.controls['FCITY'].value == "" ? "" : this.step1.controls['FCITY'].value.Value
        }

        // Call the API to get the list of destination cities
        this.ICnoteService.cnoteNewPost('services/GetToCityDetails', req).subscribe({
          next: (res: any) => {
            // Save the response to the Tcity property and update the city filter
            this.Tcity = res.result;
            this.getCityFilter();
          }
        })
      }
    }
  }



  // Get Destination data company wise
  GetDestinationDataCompanyWise() {
    if (this.mapcityRule == "Y" || this.EwayBill) {
      // Find the BL code from the step1 form control
      //let bLcode = this.step1Formcontrol.find((x) => x.name == 'DELLOC');
      // Find the rules for the BL code
      //let rules = this.Rules.find((x) => x.code.toLowerCase() == bLcode.dbCodeName.toLowerCase());

      // Create a request object with company code and city name
      var req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        City: this.step1.controls['TCITY'].value?.City_code == 0 ? this.step1.controls['TCITY'].value.Value : this.step1.controls['TCITY'].value.City_code || this.step1.controls['TCITY'].value.Value
      }

      // Call the API to get the mapped location from city name
      this.ICnoteService.cnoteNewPost('services/GetMappedLocationFromCityName', req).subscribe({
        next: (res: any) => {
          // Set the Destination property to the response
          this.Destination = res;
          // Get the first destination auto object
          let objDelivaryAuto = this.Destination[0];
          // Set the DELLOC form control value to the destination auto object
          this.step1.controls['DELLOC'].setValue(objDelivaryAuto == undefined ? '' : objDelivaryAuto);
          // Get city filter
          this.getCityFilter();
          // Get detailed based on locations

        }
      })
    }
    else {
      this.GetDestination();
    }
    this.GetDetailedBasedOnLocations();
  }
  // End of GetDestinationDataCompanyWise function


  // Function to retrieve PRQ vehicle request
  prqVehicle() {
    // Check if PRQ value length is greater than 1
    if (this.step1.controls['PRQ'].value.length > 1) {
      // Define request parameters
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        BranchCode: localStorage.getItem("Branch"),
        SearchText: this.step1.controls['PRQ'].value
      };
      // Send POST request to retrieve PRQ vehicle request
      this.ICnoteService.cnoteNewPost('services/prqVehicleReq', req).subscribe({
        next: (res: any) => {
          // Save retrieved PRQ vehicle request
          this.prqVehicleReq = res;
          // Filter PRQ vehicle request for display
          this.prqVehicleFilter();
        }
      })
    }
  }

  // Filters PRQ vehicle based on user input
  prqVehicleFilter() {
    // Create a pipe to listen for changes in the PRQ control
    this.pReqFilter = this.step1.controls["PRQ"].valueChanges.pipe(
      startWith(""), // Start with an empty string
      map((value) => (typeof value === "string" ? value : value.Name)), // Map to the control's value
      map((Name) =>
        // Filter the PRQ vehicles based on user input
        Name ? this._PrqFilter(Name) : this.prqVehicleReq.slice()
      )
    );
  }

  // Helper function to filter PRQ vehicles
  _PrqFilter(prqVehicleReq: string): prqVehicleReq[] {
    const filterValue = prqVehicleReq.toLowerCase();

    // Filter the PRQ vehicles whose PRQ number starts with the user input
    return this.prqVehicleReq.filter(
      (option) => option.PRQNO.toLowerCase().indexOf(filterValue) === 0
    );
  }

  // Display function for PRQ number and vehicle number
  displayPRQNoFn(Cnotegrop: prqVehicleReq): string {
    return Cnotegrop && Cnotegrop.PRQNO ? Cnotegrop.PRQNO + ':' + Cnotegrop.VehicleNo : "";
  }


  getVehicleNo() {
    // Check if the length of VEHICLE_NO value in step1 is greater than 1
    if (this.step1.controls['VEHICLE_NO'].value.length > 1) {
      // Create a request object with required parameters
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        SearchText: this.step1.controls['VEHICLE_NO'].value,
        VendorCode: "",
        VehicleType: "Toll",
        IsCheck: 0
      };
      // Call cnoteNewPost method from ICnoteService with endpoint 'services/GetVehicle' and request object
      this.ICnoteService.cnoteNewPost('services/GetVehicle', req).subscribe(
        // Handle the response from server
        {
          next: (res: any) => {
            // Assign the response to Vehicno property
            this.Vehicno = res;
            // Call getCityFilter() method to update the autocomplete options
            this.getCityFilter();
          }
        }
      );
    }
  }

  //CityApi
  getCityFilter() {
    // Loop through the CnoteData array to set up autocomplete options for each form field
    for (const element of this.CnoteData) {
      const { name } = element;
      let filteredOptions: Observable<AutoCompleteCity[]>;
      let autocomplete = '';

      switch (name) {
        // Set up autocomplete options for the FCITY form field
        case 'FCITY':
          if (this.Fcity) {
            autocomplete = 'autoFCity';
            filteredOptions = this.step1.controls.FCITY.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Fcity) : this.Fcity.slice())
            );
          }
          break;

        // Set up autocomplete options for the TCITY form field
        case 'TCITY':
          if (this.Tcity) {
            autocomplete = 'autoTCity';
            filteredOptions = this.step1.controls.TCITY.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Tcity) : this.Tcity.slice())
            );
          }
          break;

        // Set up autocomplete options for the DELLOC form field
        case 'DELLOC':
          if (this.Destination) {
            autocomplete = 'autoDestination';
            filteredOptions = this.step1.controls.DELLOC.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Destination) : this.Destination.slice())
            );
          }
          break;

        // Set up autocomplete options for the SRCDKT form field
        case 'SRCDKT':
          if (this.Multipickup) {
            autocomplete = 'autoSRCDKT';
            filteredOptions = this.step1.controls.SRCDKT.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Multipickup) : this.Multipickup.slice())
            );
          }
          break;

        // Set up autocomplete options for the VEHICLE_NO form field
        case 'VEHICLE_NO':
          if (this.Vehicno) {
            autocomplete = 'vehicleAutoComplate';
            filteredOptions = this.step1.controls.VEHICLE_NO.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Vehicno) : this.Vehicno.slice())
            );
          }
          break;

        // Set up autocomplete options for the ConsignorCity form field
        case 'ConsignorCity':
          if (this.ConsignorCity) {
            autocomplete = 'ConsignorCityAutoComplate';
            filteredOptions = this.step2.controls.ConsignorCity.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.ConsignorCity) : this.ConsignorCity.slice())
            );
          }
          break;
        // Set up autocomplete options for the ConsignorPinCode form field
        case 'ConsignorPinCode':
          if (this.pinCodeDetail) {
            autocomplete = 'ConsignorCityAutoComplate';
            filteredOptions = this.step2.controls.ConsignorPinCode.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.pinCodeDetail) : this.pinCodeDetail.slice())
            );
          }
          break;
        // Set up autocomplete options for the ConsigneePinCode form field
        case 'ConsigneePinCode':
          if (this.pinCodeDetail) {
            autocomplete = 'ConsignorCityAutoComplate';
            filteredOptions = this.step2.controls.ConsigneePinCode.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.pinCodeDetail) : this.pinCodeDetail.slice())
            );
          }
          break;
        // Set up autocomplete options for the ConsigneeCity form field
        case 'ConsigneeCity':
          if (this.ConsigneeCity) {
            autocomplete = 'ConsigneeCityAutoComplate';
            filteredOptions = this.step2.controls.ConsigneeCity.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.ConsigneeCity) : this.ConsigneeCity.slice())
            );
          }
          break;
        default:
          break;
      }

      element.autocomplete = autocomplete;
      element.filteredOptions = filteredOptions;
    }
  }

  _cityFilter(name: string, City: AutoCompleteCity[]): AutoCompleteCity[] {
    const filterValue = name.toLowerCase();
    return City.filter(
      (option) => option.Name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCitygropFn(Cnotegrop: AutoCompleteCity): string {
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Value : "";
  }
  //End

  //Docket Validation
  DocketValidation() {
    // Create the request object with the necessary parameters
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      DocType: 'DKT',
      DocNo: this.step1.controls['DKTNO'].value,
      LocCode: localStorage.getItem("Branch")
    }

    try {
      // Call the docketValidation service and subscribe to the response
      this.ICnoteService.cnoteNewPost('services/docketValidation', req).subscribe({
        next: (res: any) => {
          // If the service returns success, set the docketallocate value
          if (res.issuccess) {
            this.docketallocate = res.result[0].Alloted_To;
          }
          // Otherwise, display an error message and set the docketallocate value to a default value
          else {
            this.docketallocate = 'Alloted To'
            SwalerrorMessage("error", res.originalError.info.message, "", true);
          }
        }
      })
    }
    // Catch any errors that occur during the service call
    catch (err) {

    }
  }
  //End



  /**
   * Retrieves a list of multi-pickup/delivery dockets based on the selected criteria.
   * @param event - The checkbox event triggering the function.
   */
  GetMultiPickupDeliveryDocket(event) {

    // If the checkbox is checked
    if (event.checked == true) {

      // Prepare the request object with the required parameters
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        DocType: "DKT",
        PayBas: this.step1.controls['PAYTYP'].value,
        BookingDate: this.datePipe.transform(this.step1.controls['DKTDT'].value, 'd MMM y').toUpperCase()
      }

      // Send the request to the server to get the list of dockets
      this.ICnoteService.cnoteNewPost('services/GetMultiPickupDeliveryDocket', req).subscribe({
        next: (res: any) => {

          // If the request was successful
          if (res.issuccess == true) {

            // Extract the dockets from the response and format them as required
            let Detail = res.result
            let multipickArray = []
            Detail.map(x => {
              let Multipickarray = {
                Name: x.DocketNumber,
                Value: x.DocketNumber
              } as AutoCompleteCity
              multipickArray.push(Multipickarray)
            });

            // Update the list of multi-pickup/delivery dockets and update the city filter accordingly
            this.Multipickup = multipickArray;
            this.getCityFilter();
          }
        }
      })
    }
    else {
      // If the checkbox is unchecked, clear the list of dockets and update the city filter
      this.Multipickup = [];
      this.step1.controls['SRCDKT'].setValue('');
      this.getCityFilter();
    }
  }



  //GetDetailedBasedOnLocations
  GetDetailedBasedOnLocations() {
    // Prepare the request payload
    const req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      Destination: this.step1.controls['DELLOC'].value.Value,
      ContractId: this.step1.controls['PRQ_BILLINGPARTY'].value == undefined ? "" : this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId,
      PayBas: this.step1.controls['PAYTYP'].value,
      PartyCode: "",
      Origin: localStorage.getItem("Branch"),
      DestDeliveryPinCode: this.step1.controls['DELLOC'].value.Value == undefined ? "" : this.step1.controls['DELLOC'].value.pincode,
      FromCity: this.step1.controls['FCITY'].value.Value == undefined ? "" : this.step1.controls['FCITY'].value.Value,
      ToCity: this.step1.controls['TCITY'].value.Value == undefined ? "" : this.step1.controls['TCITY'].value.Value
    };

    // Call the API
    this.ICnoteService.cnoteNewPost('services/GetDetailedBasedOnLocations', req).subscribe({
      next: (res: any) => {
        // Get the details from the response
        const ResDetailsBased = res.result[0];

        // Set the F_ODA flag if the destination is out of delivery area
        if (ResDetailsBased.Oda == "Y") {
          this.step1.controls['F_ODA'].setValue(ResDetailsBased.Oda == "Y" ? true : false);
          this.step1.controls['F_ODA'].enable();
          SwalerrorMessage("info", "Currently To City/Pincode Is Out of delivery are so ODA is marked.", "", true);
        }

        // Set the F_LOCAL flag if the from city and to city are the same
        if (ResDetailsBased.LocalBooking == "Y") {
          this.step1.controls['F_LOCAL'].disable();
          this.step1.controls['F_LOCAL'].setValue(ResDetailsBased.LocalBooking == "Y" ? true : false);
          SwalerrorMessage("info", "Currently from city and to city are same so local booking marked.", "", true);
        }
        else {
          this.step1.controls['F_LOCAL'].enable();
          this.step1.controls['F_LOCAL'].setValue(false);
        }
      }
    });
  }

  //ends


  // Fetches the Consignor City based on the entered search text
  getConsignorCity() {
    if (this.step2.controls['ConsignorCity'].value.length > 2) {
      try {
        // Fetches the rules for MAP_DLOC_CITY
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');

        // Creates the request object to be sent to the API endpoint
        let req = {
          searchText: this.step2.controls['ConsignorCity'].value,
          companyCode: parseInt(localStorage.getItem("companyCode")),
          MAP_DLOC_CITY: rules.defaultvalue
        }

        // Makes the API call to fetch the Consignor City
        this.ICnoteService.cnoteNewPost('services/ConsignorCity', req).subscribe({
          next: (res: any) => {
            if (res) {
              this.ConsignorCity = res;
              this.getCityFilter();
            }
            else {
              SwalerrorMessage("error", "No Data Found", "", true);
            }
          }
        })
      }
      catch (err) {
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
    }
  }

  /**
   * Gets the list of Consignee cities based on the search text entered by the user.
   * Uses the API endpoint 'services/consigneeCity'.
   */
  getConsigneeCity() {
    if (this.step2.controls['ConsigneeCity'].value.length > 2) { // Check if the search text entered by the user is at least 3 characters long.
      try {
        // Find the rule with code 'MAP_DLOC_CITY' in the 'Rules' array and get its default value.
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');

        // Prepare the request object.
        let req = {
          searchText: this.step2.controls['ConsigneeCity'].value, // The search text entered by the user.
          companyCode: parseInt(localStorage.getItem("companyCode")), // The company code.
          MAP_DLOC_CITY: rules.defaultvalue // The default value of the 'MAP_DLOC_CITY' rule.
        }

        // Make a POST request to the 'services/consigneeCity' API endpoint with the request object.
        this.ICnoteService.cnoteNewPost('services/consigneeCity', req).subscribe({
          next: (res: any) => {
            // Update the 'ConsigneeCity' array with the result returned by the API.
            this.ConsigneeCity = res.result;
            this.getCityFilter()
          }
        })
      }
      catch (err) {
        // Handle errors here.
      }
    }
  }


  // This function is used to fetch the details of a pincode
  // based on the input provided by the user

  getPincodeDetail(event) {

    // Initialize the control and city variables
    let control;
    let city;

    // Switch case to handle the different scenarios
    switch (event) {
      case 'ConsignorPinCode':
        control = this.step2.get(event).value;
        city = this.step2.get("ConsignorCity").value
        break;
      case 'ConsigneePinCode':
        control = this.step2.get(event).value;
        city = this.step2.get("ConsigneeCity").value
        break;
    }

    // If the user has provided a valid input
    if (control.length > 1) {
      try {
        // Prepare the request object
        let req = {
          searchText: control,
          companyCode: parseInt(localStorage.getItem("companyCode")),
          city: city.Value
        }

        // Make a POST request to fetch the details
        this.ICnoteService.cnoteNewPost('services/getPincode', req).subscribe({
          next: (res: any) => {
            // If the response is not empty
            if (res) {
              this.pinCodeDetail = res;
              this.getCityFilter();
            }
          }
        })
      }
      catch (err) {
        // Handle errors gracefully
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
    }
  }



  // This function updates the label values of the Consignor or Consignee based on the provided event and value
  isLabelChanged(event, value) {
    // Helper function to update the labels array
    const updateLabel = (labels, fromLabel, toLabel) => {
      return labels.map(item => {
        if (item.label === fromLabel) {
          item.label = toLabel;
        }
        return item;
      });
    };

    // Update the labels array of the Consignor if the event is 'Consignor'
    if (event === 'Consignor') {
      // If the value is true, update the 'Walk-In' label to 'From Master'; otherwise, update 'From Master' to 'Walk-In'
      this.Consignor = value ? updateLabel(this.Consignor, 'Walk-In', 'From Master') : updateLabel(this.Consignor, 'From Master', 'Walk-In');
      this.step2Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '2').map(item => {
        if (item.name === 'CST_NM') {
          item.type = value ? 'autodropdown' : 'text',
            item.ActionFunction = value ? 'ConsignorChanged' : '',
            item.Search = value ? 'billingPartyrules' : ''
          //when the event is changed from master to i walk that time the value of Consginor sholud be empty
          if (item.type == 'text') {
            this.step2.controls['CST_NM'].setValue('')
          }
        }
        return item;
      });

    }
    // Update the labels array of the Consignee if the event is 'Consignee'
    else if (event === 'Consignee') {
      // If the value is true, update the 'Walk-In' label to 'From Master'; otherwise, update 'From Master' to 'Walk-In'
      this.Consignee = value ? updateLabel(this.Consignee, 'Walk-In', 'From Master') : updateLabel(this.Consignee, 'From Master', 'Walk-In');
      this.step2Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '2').map(item => {
        if (item.name === 'ConsigneeCST_NM') {
          item.type = value ? 'autodropdown' : 'text',
            item.ActionFunction = value ? 'ConsigneeDetail' : '',
            item.Search = value ? 'billingPartyrules' : ''
          //when the event is changed from master to i walk that time the value of Consignee sholud be empty
          if (item.type == 'text') {
            this.step2.controls['ConsigneeCST_NM'].setValue('')
          }
        }
        return item;
      });

    }
  }

  GetDetailedBasedOnContract() {
    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        DataType: 2,
        PAYBAS: this.step1.controls['PAYTYP'].value,
        CONTRACTID: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || ""
      }
      this.ICnoteService.cnoteNewPost('services/GetDetailedBasedOnContract', req).subscribe({
        next: (res: any) => {
          // Define an array of code types that need dropdown data
          const codeTypes = ['FTLTYP', 'PKPDL', 'SVCTYP', 'TRN'];

          // Iterate over each form control in step1Formcontrol
          this.step1Formcontrol.forEach(item => {
            // If the form control's name is in codeTypes array, update its dropdown property with relevant data from response
            if (codeTypes.includes(item.name)) {
              item.dropdown = res.MASTER.filter(x => x.CodeType === item.name);
            }
          });
          this.ContractData = res.CONTRACT;
          if (this.ContractData) {
            this.ContractId = this.ContractData.CONTRACTID;
            this.step1.controls['TRN'].setValue(this.ContractData.DEFAULTPRODUCTSET);
            this.step1.controls['PKGS'].setValue(this.ContractData.Defaultmodeset);
            this.step3.controls['CODDODCharged'].setValue(this.ContractData?.CODDODCharged || "");
            this.step3.controls['CODDODTobeCollected'].setValue(this.ContractData?.CODDODCharged || "");
            this.step3.controls['F_COD'].setValue(this.ContractData.FlagCODDODEnable == "Y" ? true : false);
            this.step3.controls['Volumetric'].setValue(this.ContractData.FlagVolumetric == "Y" ? true : false)
            this.IsDeferment = this.ContractData.FlagDeferment == "Y" ? true : false;
            this.GetContractInvokeDependent();
            this.volumetricChanged();
            this.codeChanged();

          }
        }
      })
    }
    catch (err) {
      SwalerrorMessage("error", "Please Try Again", "", true);
    }
  }

  //displayedAppointment
  displayedAppointment() {
    this.isappointmentvisble = this.step2.controls['IsAppointmentBasedDelivery'].value == 'Y' ? true : false;
    if (this.isappointmentvisble) {
      this.AppointmentDetails.forEach((x) => {
        this.step2.controls[x.name].setValidators(Validators.required)
        this.step2.controls[x.name].updateValueAndValidity()
      })
    }
    else {
      this.AppointmentDetails.forEach((x) => {
        this.step2.controls[x.name].clearValidators()
        this.step2.controls[x.name].updateValueAndValidity()
      })
    }
  }


  GetActiveGeneralMasterCodeListByTenantId() {
    // Dropdown values to fetch
    let dropdown = ["CNTSIZE", "CONTTYP", "CONTCAP"]

    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ddArray: dropdown
      }

      // Fetch dropdown values using API
      this.ICnoteService.cnoteNewPost('services/GetcommonActiveGeneralMasterCodeListByTenantId', req).subscribe({
        next: (res: any) => {
          // Set ContainerSize, ContainerType, and ContainerCapacity arrays with filtered results
          this.ContainerSize = res.result.filter((x) => x.CodeType == 'CNTSIZE')
          this.ContainerType = res.result.filter((x) => x.CodeType == 'CONTTYP')
          this.ContainerCapacity = res.result.filter((x) => x.CodeType == 'CONTCAP')

          // Check if CnoteData is already present in local storage
          this.data = JSON.parse(localStorage.getItem('CnoteData'));
          if (!this.data) {
            // If not present, get Cnote controls
            this.GetCnotecontrols();
          }
          else {
            // If present, set CnoteData and form groups for step1, step2, and step3
            this.CnoteData = this.data;
            this.CnoteData.sort((a, b) => (a.Seq - b.Seq));
            if (this.ServiceType) {
              this.CNoteFieldChecked()
            }
            this.step1 = this.step1Formgrop();
            this.step2 = this.step2Formgrop();
            this.step3 = this.step3Formgrop();
            this.getRules();
          }
        }
      })
    }
    catch (err) {
      // Handle error
    }
  }



  autofillCustomer() {
    if (this.step1.controls['PAYTYP'].value == "P02" || !this.step2.controls['CST_NM'].value) {
      // Fill Consignor name and value from PRQ_BILLINGPARTY.Name and PRQ_BILLINGPARTY.Value respectively
      let Consignor = {
        Name: this.step1.controls['PRQ_BILLINGPARTY'].value.Name,
        Value: this.step1.controls['PRQ_BILLINGPARTY'].value.Value
      }
      this.step2.controls['CST_NM'].setValue(Consignor)

      // Fill Consignor address from PRQ_BILLINGPARTY.CustAddress
      this.step2.controls['CST_ADD'].setValue(this.step1.controls['PRQ_BILLINGPARTY'].value.CustAddress)

      // Fill telephone number from PRQ_BILLINGPARTY.TelephoneNo
      this.step2.controls['CST_MOB'].setValue(this.step1.controls['PRQ_BILLINGPARTY'].value.phoneno)
      //Fill Mobile No 
      this.step2.controls['CST_PHONE'].setValue(this.step1.controls['PRQ_BILLINGPARTY'].value.TelephoneNo)
      //End

      // Fill GSTIN number from PRQ_BILLINGPARTY.GSTINNumber
      this.step2.controls['GSTINNO'].setValue(this.step1.controls['PRQ_BILLINGPARTY'].value.GSTINNumber)
    }
    else {
      this.step2.controls['CST_NM'].setValue("")

      // Fill Consignor address from PRQ_BILLINGPARTY.CustAddress
      this.step2.controls['CST_ADD'].setValue("")

      // Fill telephone number from PRQ_BILLINGPARTY.TelephoneNo
      this.step2.controls['CST_PHONE'].setValue("")

      // Fill GSTIN number from PRQ_BILLINGPARTY.GSTINNumber
      this.step2.controls['GSTINNO'].setValue("")
      // File Cust MobNo
      this.step2.controls['CST_MOB'].setValue("")
      //Fill Mobile No 
    }
  }


  volumetricChanged() {

    // Check if Volumetric is truthy (not undefined, null, false, 0, etc.)
    if (this.step3.controls['Volumetric'].value) {
      // Find the Invoice Level rule with code 'INVOICE_LEVEL_CONTRACT_INVOKE'
      this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
      if (this.InvoiceLevalrule.defaultvalue != "Y") {
        // If the rule's default value is not 'Y', filter the step3Formcontrol and InvoiceDetails arrays
        this.step3Formcontrol = this.CnoteData.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3' && x.div != 'BcSeries');
        this.InvoiceDetails = this.CnoteData.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
      }
      else {
        // If the rule's default value is 'Y', filter the step3Formcontrol and InvoiceDetails arrays
        this.step3Formcontrol = this.CnoteData.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3' && x.div != 'BcSeries');
        this.InvoiceDetails = this.CnoteData.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
      }
    }
    else {
      // If Volumetric is falsy, remove all elements from step3Formcontrol and InvoiceDetails that have a Class of 'Volumetric'
      this.step3Formcontrol = this.step3Formcontrol.filter(x => x.Class != 'Volumetric')
      this.InvoiceDetails = this.InvoiceDetails.filter(x => x.Class != 'Volumetric');
    }
  }


  openModal(content) {
    // Check if BcSerialType is "E"
    if (this.step3.controls['BcSerialType'].value == "E") {
      // If it is "E", set displaybarcode to true
      this.displaybarcode = true;
      // Open a modal using the content parameter passed to the function
      const modalRef = this.modalService.open(content);

      modalRef.result.then((result) => {
      });
    }
    else {
      // If BcSerialType is not "E", set displaybarcode to false
      this.displaybarcode = false;
    }
  }



  // INVOICE SECTION START 
  /**
   * Calculates invoice cubic weight.
   * @param {any} event - The event object.
   * @returns void
   */
  InvoiceCubicWeightCalculation(event) {
    let cftVolume = 0;
    if (this.step3.controls['Volumetric'].value) {
      // Get package dimensions and calculate volume
      let length = parseInt(event.controls.LENGTH?.value || 0);
      let breadth = parseInt(event.controls.BREADTH?.value || 0);
      let height = parseInt(event.controls.HEIGHT?.value || 0);
      let noOfPackages = parseInt(event.controls.NO_PKGS.value || 0);
      let volume = 0;

      cftVolume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.controls['CFT_RATIO']?.value, 0) * WebxConvert.objectToDecimal(noOfPackages, 0);

      // Calculate volume based on selected unit of measure
      switch (this.VolMeasure) {
        case "INCHES":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.controls['CFT_RATIO']?.value || 0, 0) / 1728;
          break;
        case "CM":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.controls['CFT_RATIO']?.value || 0, 0) / 27000;
          break;
        case "FEET":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.controls['CFT_RATIO']?.value || 0, 0);
          break;
      }

      volume = parseFloat(roundNumber(volume * WebxConvert.objectToDecimal(noOfPackages, 0), 2));

      // Update form control values
      event.controls.CUB_WT.setValue(volume);
      event.controls.cft.setValue(cftVolume)
      event.controls.CUB_WT.updateValueAndValidity();

    }
    else {

    }
    this.CalculateRowLevelChargeWeight(event, true)
  }

  ///CalculateRowLevelChargeWeight() 
  CalculateRowLevelChargeWeight(event, FlagCalculateInvoiceTotal) {
    let cubinWeight = parseFloat(event.controls.CUB_WT?.value || 0);
    let ActualWeight = parseFloat(event.controls.ACT_WT?.value || 0);
    switch (this.WeightToConsider) {
      case "A":
        event.controls.ChargedWeight.setValue(ActualWeight)
        break;
      case "V":
        event.controls.ChargedWeight.setValue(ActualWeight)
        break;
      default:
        event.controls.ChargedWeight.setValue(cubinWeight > ActualWeight ? cubinWeight : ActualWeight)
        break;

    }
    if (FlagCalculateInvoiceTotal) {
      this.CalculateInvoiceTotal();
    }
    if (ActualWeight) {
      this.InvokeInvoice();
    }

  }
  //End

  //CalculateInvoiceTotal
  CalculateInvoiceTotal() {
    let TotalChargedNoofPackages = 0;
    let TotalChargedWeight = 0;
    let TotalDeclaredValue = 0;
    let CftTotal = 0;
    let TotalPartQuantity = 0;

    // let temp = event.controls.ChargedWeight?.value;
    //Invoices.CalculateRowLevelChargeWeight(temp, false, isFromChargwt);
    this.step3.value.invoiceArray.forEach((x) => {
      TotalChargedNoofPackages = TotalChargedNoofPackages + parseFloat(x.NO_PKGS || 0);
      TotalChargedWeight = TotalChargedWeight + parseFloat(x.ChargedWeight || 0);
      TotalDeclaredValue = TotalDeclaredValue + parseFloat(x.DECLVAL || 0);
      if (x.CUB_WT > 0) {
        CftTotal = CftTotal + parseFloat(x.cft)
      }
      if (x.PARTQUANTITY) {
        TotalPartQuantity = TotalPartQuantity + x.PARTQUANTITY;
      }
    })

    this.step3.controls['TotalChargedNoofPackages'].setValue(TotalChargedNoofPackages.toFixed(2));
    this.step3.controls['CHRGWT'].setValue(TotalChargedWeight.toFixed(2));
    this.step3.controls['TotalDeclaredValue'].setValue(TotalDeclaredValue.toFixed(2));
    this.step3.controls['CFT_TOT'].setValue(CftTotal.toFixed(2));
    this.step3.controls['TotalPartQuantity'].setValue(TotalPartQuantity);
    //TotalPartQuantity calucation parts are pending 
    this.GetContractInvokeDependent();
  }
  //End

  addBarcodeField() {

    //this.step3.controls['PROD'].value;
    const array = {}
    const fields = this.step3.get('barcodearray') as FormArray;
    this.barcodearray = this.CnoteData.filter((x) => x.div == 'barcodearray')
    if (this.barcodearray.length > 0) {
      this.barcodearray.forEach(cnote => {
        array[cnote.name] = this.fb.control(cnote.defaultvalue);

      });

    }
    fields.push(this.fb.group(array));
  }
  removeBarcodeField(index: number) {

    if (index != 0) {
      const fields = this.step3.get('barcodearray') as FormArray;
      fields.removeAt(index);
    }
  }
  /**
 * Gets invoice configuration based on the transport mode.
 * @returns void
 */
  GetInvoiceConfigurationBasedOnTransMode() {

    // Create request object
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      contractid: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || "",
      ServiceType: this.step1.controls['SVCTYP'].value,
      TransMode: this.step1.controls['TRN'].value
    };

    // Call API to get invoice configuration
    this.ICnoteService.cnoteNewPost('services/GetInvoiceConfigurationBasedOnTransMode', req).subscribe({
      next: (res: any) => {
        // Update form controls with received invoice details
        let invoiceDetail = res.result;
        this.InvoiceDetails = this.CnoteData.filter((x) => x.frmgrp == '3' && x.div == 'InvoiceDetails').map(item => {
          if (item.Class === 'Volumetric') {
            item.label = invoiceDetail[0].VolRatio ? item.label + '(' + invoiceDetail[0].VolMeasure + ')' : item.label.replace(/\(.+?\)/g, '');
          }
          return item;
        });
        this.InvoiceDetails = this.CnoteData.filter((x) => x.Class != 'Volumetric' && x.div == 'InvoiceDetails')
        this.step3.controls['CFT_RATIO'].setValue(invoiceDetail[0].VolRatio);
        this.WeightToConsider = invoiceDetail[0].WeightToConsider;
        this.MaxMeasureValue = invoiceDetail[0].MaxMeasureValue;
        this.MinInvoiceValue = invoiceDetail[0].MinInvoiceValue;
        this.MaxInvoiceValue = invoiceDetail[0].MaxInvoiceValue;
        this.MinInvoiceValuePerKG = invoiceDetail[0].MinInvoiceValuePerKG;
        this.MaxInvoiceValuePerKG = invoiceDetail[0].MaxInvoiceValuePerKG;
        this.DefaultChargeWeight = invoiceDetail[0].DefaultChargeWeight;
        this.MinChargeWeight = invoiceDetail[0].MinChargeWeight;
        this.MaxChargeWeight = invoiceDetail[0].MaxChargeWeight;
        this.VolMeasure = invoiceDetail[0].VolMeasure;
      }
    });

  }

  //GetPrqInvoiceList
  GetPrqInvoiceList() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      PrqNumber: this.step1.controls['PRQ'].value.PRQNO
    }

    this.ICnoteService.cnoteNewPost('services/GetPrqInvoiceList', req).subscribe(
      {
        next: (res: any) => {
          let prqinvoiceDetail = res.result;
          this.step3.get('invoiceArray').setValue(
            this.step3.value.invoiceArray.map(x => ({ ...x, INVDT: prqinvoiceDetail[0].InvoiceDate ? new Date(prqinvoiceDetail[0].InvoiceDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) }))
          );
          this.step3.controls['Volumetric'].setValue(true);
          this.step3.controls['CHRGWT'].setValue(prqinvoiceDetail[0].ChargedWeight);
          this.volumetricChanged();
        }
      })
  }
  //end
  //ValidateBcSeriesRow
  ValidateBcSeriesRow(event) {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      FROM_SRNO: event.controls.From?.value || 0,
      TO_SRNO: event.controls.To?.value || 0,
      Location: 'MUMB'
    }
    this.ICnoteService.cnoteNewPost('services/ValidateBcSeriesRow', req).subscribe({
      next: (res: any) => {
        if (res.result[0].Flag == 'N') {
          SwalerrorMessage("error", res.result[0].Reason, "", true);
        }
      }
    })
  }
  //end
  //Divisionvalue changed when vehno select
  Divisionvalue() {
    this.step1.controls['DIV'].setValue(this.step1.controls['VEHICLE_NO'].value.Division);
  }
  //end

  //GetCcmServices
  GetCcmServices() {
    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        contractid: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || ''
      }
      this.ICnoteService.cnoteNewPost('services/billingParty', req).subscribe({
        next: (res: any) => {
          this.CcmServicesData = res.result
        }
      })
    }
    catch (err) {
      SwalerrorMessage("error", "something is wrong please try again after some time", "", true)
    }

  }
  //end
  //ValidateInvoiceNo
  ValidateInvoiceNo(event) {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      InvoiceNumber: event.value.INVNO,
      DocketNo: this.step1.controls['DKTNO'].value,
      FinYear: 2023
    }
    this.ICnoteService.cnoteNewPost('services/ValidateInvoiceNo', req).subscribe({
      next: (res: any) => {
        if (res) {
          let docketNoexist = res.result[0].length > 0 ? res.result[0][0].InvoiceNo : '';
          if (docketNoexist) {
            SwalerrorMessage("error", "Invoice no is already exist with another docket.!", "", true)
            event.controls.INVNO.setValue('')
          } else {
            this.CheckDockno(event)
          }
        }
      }
    })
  }
  CheckDockno(event) {
    this.countDktNo = 0;
    this.step3.value.invoiceArray.forEach((x) => {
      if (x.INVNO == event.value.INVNO) {
        if (this.countDktNo > 0) {
          SwalerrorMessage("error", "Duplicate Invoice No.!", "", true);
          event.controls.INVNO.setValue('')
        }
        this.countDktNo = this.countDktNo + 1
      }
    })
  }
  //end

  //InvoiceValidation
  InvoiceValidation(event) {

    let InvoiceValidationRules = {
      InvoiceNo_DateRule: this.Rules.find(x => x.code === "INV_RULE").defaultvalue,
      IsInvoiceNoMandatory: this.step3Formcontrol.find((x) => x.name = 'INVNO').Validation,
      IsInvoiceDateMandatory: this.step3Formcontrol.find((x) => x.name = 'INVDT').Validation,
      IsInvoiceLevelContractInvoke: this.Rules.find(x => x.code === "INVOICE_LEVEL_CONTRACT_INVOKE").defaultvalue,
    }
    switch (InvoiceValidationRules.InvoiceNo_DateRule) {
      case "CMP":/*Company Level*/
        if (InvoiceValidationRules.IsInvoiceNoMandatory && WebxConvert.IsStringNullOrEmpty(event)) {

        }
        break;


    }
    //let CcmServicesData =
  }
  //end
  //GetConsignorConsigneeRules
  GetConsignorConsigneeRules() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      PayBase: this.step1.controls['PAYTYP'].value
    }
    this.ICnoteService.cnoteNewPost('services/GetConsignorConsigneeRules', req).subscribe({
      next: (res: any) => {
        if (res.result[0].ConsignorFromMaster == "N") {
          this.step2.controls['IsConsignorFromMasterOrWalkin'].enable();
          if (res.result[0].ConsignorSelection == "M") {
            this.step2.controls['IsConsignorFromMasterOrWalkin'].setValue(true);
          }
          else {
            this.step2.controls['IsConsignorFromMasterOrWalkin'].setValue(false);
          }
        }
        else {
          this.step2.controls['IsConsignorFromMasterOrWalkin'].disable();
          this.step2.controls['IsConsignorFromMasterOrWalkin'].setValue(true);
        }
        this.isLabelChanged('Consignor', this.step2.controls['IsConsignorFromMasterOrWalkin'].value);

        if (res.result[0].ConsigneeFromMaster == "N") {
          this.step2.controls['IsConsigneeFromMasterOrWalkin'].enable();
          if (res.result[0].ConsigneeSelection == "M") {
            this.step2.controls['IsConsigneeFromMasterOrWalkin'].setValue(true);
          }
          else {
            this.step2.controls['IsConsigneeFromMasterOrWalkin'].setValue(false);
          }
        }
        else {
          this.step2.controls['IsConsigneeFromMasterOrWalkin'].disable();
          this.step2.controls['IsConsigneeFromMasterOrWalkin'].setValue(true);
        }
        this.isLabelChanged('Consignee', this.step2.controls['IsConsigneeFromMasterOrWalkin'].value);
      }
    })
  }
  //End
  //GetContractInvokeDependent
  GetContractInvokeDependent() {
    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ServiceType: this.step1.controls['SVCTYP'].value,
        ContractID: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId || "",
        ChargeType: "BKG",
        PayBase: this.step1.controls['PAYTYP'].value,
      }
      this.ICnoteService.cnoteNewPost("services/GetContractInvokeDependent", req).subscribe({
        next: (res: any) => {
          if (res) {
            this.BasedOn1 = res.result[0]?.BasedOn1 || "";
            this.BasedOn2 = res.result[0]?.BasedOn2 || "";
            this.UseFrom = res.result[0]?.UseFrom || "";
            this.UseTo = res.result[0]?.UseTo || "";
            this.UseTransMode = res.result[0]?.UseTransMode || "";
            this.UseRateType = res.result[0]?.UseRateType || "";
            this.ChargeWeightToHighestDecimal = res.result[0]?.ChargeWeightToHighestDecimal || "";
            this.ContractDepth = res.result[0]?.ContractDepth || "";
            this.ProceedDuringEntry = res.result[0]?.ProceedDuringEntry || "";
            this.SetBaseCodeValues();
          }
        }
      })
    }
    catch (err) {
      SwalerrorMessage("error", "Something is Wrong Please Try again Later", "", true);
    }
  }
  SetBaseCodeValues() {
    switch (this.BasedOn1) {
      case "SVCTYP":
        this.BaseCode1 = this.step1.controls['SVCTYP'].value
        break;
      case "BUT":
        this.BaseCode1 = this.step1.controls['BUT'].value;
        break;
      case "NONE":
        this.BaseCode1 = "NONE";
        break;
    }
    switch (this.BasedOn2) {
      case "PROD":
        this.BaseCode2 = this.step1.controls['PROD'].value;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.controls['PKGS'].value;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.controls['PKGS'].value;
        break;
      case "NONE":
        this.BaseCode2 = "NONE";
        break;
    }
    this.CalucateEdd();
  }
  //end

  //SetBillingParty
  SetBillingParty() {
    let WHO_IS_PARTY = this.Rules.find(x => x.code == 'WHO_IS_PARTY' && x.paybas == this.step1.controls['PAYTYP'].value);
    this.rowBillingParty = true;
    switch (WHO_IS_PARTY.defaultvalue) {
      case "1":
        if (!WebxConvert.IsObjectNullOrEmpty(this.step1.controls['PRQ_BILLINGPARTY'].value)) {
          this.step3.controls['BillingPartys_3'].setValue(true);
        }
        else {
          this.step3.controls['BillingPartys_4'].setValue(true);
        }
        break;
      case "3":
        this.step3.controls['BillingPartys_1'].setValue(true);
        this.rowBillingParty = false;
        break;
      case "4":
        this.step3.controls['BillingPartys_2'].setValue(true);
        this.rowBillingParty = false;
        break;
      case "5":
        if (!WebxConvert.IsStringNullOrEmpty(this.step1.controls['PRQ_BILLINGPARTY'].value)) {
          this.step3.controls['BillingPartys_3'].setValue(true);
          this.rowBillingParty = false;
        }
        else {
          this.step3.controls['BillingPartys_4'].setValue(true);
        }
        break;
      default:
        break;
    }
    this.BillingPartyChange(this.step1.controls['BillingPartys_3'].value)
  }
  BillingPartyChange(billingParty) {
    if (billingParty) {
      this.isBillingPartysName = true
    }
    else {
      this.isBillingPartysName = false;
    }

  }
  InvokeInvoice() {

    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      contractid: this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId,
      FromCity: this.step1.controls['FCITY'].value.Value,
      ToCity: this.step1.controls['TCITY'].value.Value,
      Origin: localStorage.getItem("Branch"),
      Destination: this.step1.controls['DELLOC'].value.Value,
      TransMode: this.step1.controls['TRN'].value
    }
    this.ICnoteService.cnoteNewPost('services/GetDistanceFromContract', req).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.Distance = res.result[0];
          //this.ChargeKm= this.Distance ;
        }
      }

    })
    let FoundContract = "";
    let MinFreightBase = "";
    let MinFreightType = "";
    let MinFreightBaseRate = "";
    let FreightCharge = 0;
    let ruleContractType = this.Rules.find((x) => x.code == this.step1.controls['PAYTYP'].value + 'CONTRACT' && x.paybas == this.step1.controls['PAYTYP'].value);;
    let ruleProceed = this.Rules.find((x) => x.code == this.step1.controls['PAYTYP'].value + 'PROCEED' && x.paybas == this.step1.controls['PAYTYP'].value);
    this.Invoiceinit()
    if (ruleContractType.defaultvalue == "C") {
      if (this.RequestContractKeysDetail.ContractKeys.ContractID != this.RequestContractKeysDetail.ContractKeys.PayBase + "8888" && this.RequestContractKeysDetail.ContractKeys.ContractID) {
        this.ICnoteService.cnoteNewPost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
          next: (res: any) => {
            if (res) {
              this.contractKeysInvoke = res.result.root;
              this.FreightDetail()

            }
          }
        })
      }
      else {
        if (ruleProceed.defaultvalue == "S" || ruleProceed.defaultvalue == "T") {
          let Status = "NIL_CONTRACT";
          let Description = "Contract ID is NIL in Customer Wise Contract. Can't Enter ";
        }
        else {
          this.RequestContractKeysDetail.ContractKeys.ContractID = this.RequestContractKeysDetail.ContractKeys.PayBase + "8888";
          this.ICnoteService.cnoteNewPost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
            next: (res: any) => {
              if (res) {
                this.contractKeysInvoke = res.result.root;
                this.FreightDetail()
              }
            }
          })


          FoundContract = "D"
        }
      }
      FoundContract = "C";
    }
    else if (ruleContractType.defaultvalue == "CD") {
      if (this.RequestContractKeysDetail.ContractKeys.ContractID != this.RequestContractKeysDetail.ContractKeys.PayBase + "8888" && this.RequestContractKeysDetail.ContractKeys.ContractID) {
        FoundContract = "C";
      }
      if (FreightCharge == 0 || this.FreightRate == 0) {
        this.RequestContractKeysDetail.ContractKeys.ContractID = this.RequestContractKeysDetail.ContractKeys.PayBase + "8888";
        this.ICnoteService.cnoteNewPost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
          next: (res: any) => {
            if (res) {
              this.contractKeysInvoke = res.result.root;
              this.FreightDetail()
            }
          }
        })
        FoundContract = "D";
      }
    }
    else if (ruleContractType.defaultvalue == "D") {
      this.RequestContractKeysDetail.ContractKeys.ContractID = this.RequestContractKeysDetail.ContractKeys.PayBase + "8888";

      this.ICnoteService.cnoteNewPost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
        next: (res: any) => {
          if (res) {
            this.contractKeysInvoke = res.result.root;
            this.FreightDetail()
          }
        }
      })
      FoundContract = "D";
    }
    else if (ruleContractType.defaultvalue == "W") {
      FoundContract = "W";
    }
    this.BrimApiRuleDetail();
  }
  BrimApiRuleDetail() {
    this.BrimApiRule = this.Rules.find((x) => x.code == 'BRIM_API').defaultvalue;
    if (this.BrimApiRule == "Y" && this.step1.controls['PAYTYP'].value) {
      this.DocketChargeRequest.CHANNEL_TYPE_ID = "5";
      this.DocketChargeRequest.PAY_BASIS = "PAID";
      this.DocketChargeRequest.CUSTOMER_ID = "";
      this.DocketChargeRequest.BOOKING_DATE = this.step1.controls['DKTDT'].value;
      this.DocketChargeRequest.BOOKING_TIME = this.step1.controls['DKTDT'].value;
      this.DocketChargeRequest.SERVICE = "EXPRESS";
      this.DocketChargeRequest.BOOKING_TYPE = "FORWARD";
      this.DocketChargeRequest.CHARGE_WEIGHT = this.step3.controls['CHRGWT'].value;
      this.DocketChargeRequest.NO_OF_PIECES = this.step3.controls['NO_PKGS'].value;
      this.DocketChargeRequest.FOD_AMOUNT = 0;
      this.DocketChargeRequest.COD_AMOUNT = 0;
      this.DocketChargeRequest.CONSIGNER_GSTNUMBER = this.step2.controls['GSTINNO'].value;
      this.DocketChargeRequest.CONSIGNEE_GSTNUMBER = this.step2.controls['ConsigneeGSTINNO'].value;
      this.DocketChargeRequest.INSURED = this.step2.controls['RSKTY'].value == "C" ? "Y" : this.step2.controls['RSKTY'].value == "0" ? "Y" : "N";
      this.DocketChargeRequest.INSURED_BY = this.step2.controls['RSKTY'].value == "C" ? "Carrier" : this.step2.controls['RSKTY'].value == "0" ? "Owner" : "";
      this.DocketChargeRequest.BRNCH_OFF = "LKO";
      this.DocketChargeRequest.INV_VALUE = this.step3.controls['DECLVAL'].value;
      this.DocketChargeRequest.DEST_PINCODE = "500002";
      this.DocketChargeRequest.APP_BOOKING = "NON APP";
      this.DocketChargeRequest.SBU = "LTL";
      this.DocketChargeRequest.DEST_BRANCH = "HYD";
      this.DocketChargeRequest.DOCUMENT_CODE = "2";
      this.DocketChargeRequest.VAS_PROD_CODE = 1 == 1 ? "COD" : 1 == 1 ? "FOD" : " ";
      this.DocketChargeRequest.CONSGMNT_STATUS = "BOOKED";
      let PayBaseText = this.step1Formcontrol.find((x) => x.name == 'PAYTYP').dropdown.find((x) => x.CodeId == this.step1.controls['PAYTYP'].value).CodeDesc;
      if (PayBaseText == "PAID" || PayBaseText == "TOPAY") {
        this.DocketChargeRequest.RATE_CUST_CODE = "";
      }
      else {
        this.DocketChargeRequest.RATE_CUST_CODE = "";
      }
      //BHIMAPI IS PENDING 
    }
    if (this.BrimApiRule == "N" || this.step1.controls['PAYTYP'].value) {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        contractid: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId,
        transmode: this.step1.controls['TRN'].value,
        dockdt: this.step1.controls['DKTDT'].value,
        ContractKeys: this.RequestContractKeysDetail.ContractKeys
      }
      this.ICnoteService.cnoteNewPost('services/GetFuelCharge', req).subscribe({
        next: (res: any) => {
          if (res) {
            //----------------------------FuelSurcharge---------------------------------//
            this.FuelCharge.FuelRateType = res.result[0][0]?.fuelsurchrgbas || '';
            this.FuelCharge.FuelRate = res.result[0][0]?.fuelsurchrg || '';
            this.FuelCharge.MinFuleCharge = res.result[0][0]?.MinFuleCharge || '';
            this.FuelCharge.MaxFuelCharge = res.result[0][0]?.MaxFuelCharge || '';
            this.FuelCharge.FuelRateMethod = res.result[0][0]?.FuelRateMethod || '';
            this.FuelCharge.AbsoluteRate = res.result[0][0]?.AbsoluteRate || '';
            this.FuelCharge.ThresHold = res.result[0][0]?.ThresHold || '';
            this.FuelCharge.FreightChargePercentage = res.result[0][0]?.FreightChargePercentage || '';
            //---------------------------End--------------------------------------------//
            //----------------------------RevisionRate---------------------------------//
            this.FuelCharge.RevisionRate = res.result[1][0]?.RevisionRate || '';
            //----------------------------End------------------------------------------//
            //----------------------------------FUEL-----------------------------------//
            this.FuelCharge.Distance = res.result[2][0]?.Distance || '';
            this.FuelCharge.AvgSpeed = res.result[2][0]?.AvgSpeed || '';
            this.FuelCharge.FromCityFuelPrice = res.result[2][0].FromCityFuelPrice || '';
            this.FuelCharge.ToCityFuelPrice = res.result[2][0].ToCityFuelPrice || '';
            //---------------------------End--------------------------------------------//

          };
        }
      })
      let reqFOVChargeCriteria = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        contractid: this.step1.controls['PRQ_BILLINGPARTY'].value?.ContractId,
        basedon: this.Rules.find(x => x.code == 'CHRG_RULE').defaultvalue,
        basecode: this.BaseCode1,
        DeclareValue: this.step3.controls['TotalDeclaredValue'].value,
        RiskType: this.step2.controls['RSKTY'].value,
        ServiceType: this.step1.controls['SVCTYP'].value
      }

      this.ICnoteService.cnoteNewPost('services/GetFOVCharge', reqFOVChargeCriteria).subscribe({
        next: (res: any) => {
          if (res) {
            this.FOVFlag = res.result[0];
            this.FOVCharges = res.result[1];
            if (this.FOVFlag) {
              this.FOVCharge.FlagFOV = this.FOVFlag[0]?.activeflag || "";
            }
            this.FOVCharge.FOVRate = this.FOVCharges[0]?.fovrate || 0;
            this.FOVCharge.FOVCharged = this.FOVCharges[0]?.fovcharge || 0;
            this.FOVCharge.FOVRateType = this.FOVCharges[0]?.ratetype || "F";
            this.step3.controls['FOVRate'].setValue(this.FOVCharges[0]?.fovrate);
            this.step3.controls['FOVCharged'].setValue(this.FOVCharges[0]?.fovcharge);
            this.step3.controls['FOVCalculated'].setValue(this.FOVCharges[0]?.fovcharge)

          }
        }
      })
      let reqCod = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        CODCriteria: "<root><ContractID>" + this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId + "</ContractID><InvoiceAmount>" + this.step3.controls['TotalDeclaredValue'].value + "</InvoiceAmount></root>"
      }
      this.ICnoteService.cnoteNewPost('services/GetCodeDodCharges', reqCod).subscribe({
        next: (res: any) => {
          if (res) {
            this.codCharges = res.result[0];
          }
        }
      })
      let reqDacc = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        DACCCriteria: "<root><ContractID>" + this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId + "</ContractID><InvoiceAmount>" + this.step3.controls['TotalDeclaredValue'].value + "</InvoiceAmount></root>",
        DACCCharged: 0,
        DACCRateType: ""
      }
      this.ICnoteService.cnoteNewPost('services/GetDaccCharges', reqDacc).subscribe({
        next: (res: any) => {
          if (res) {
            this.DaccChargedDetail = res.result[0];
          }
        }
      })
      if (this.IsDocketEdit == "Y") {

      }
      if (this.IsDocketEdit == "Y" && this.InvokeNewContract == "N") {

      }
      else {


        /*FOV Rate*/
        this.FOVRate = this.FOVCharge.FOVRate;
        this.FOVRateType = this.FOVCharge.FOVRateType;
        this.FOVCalculated = this.FOVCharge.FOVCharged;
        this.FOVCharged = this.FOVCharge.FOVCharged;
        /*End*/

        /*COD/DOD Charges*/
        this.CODDODCharged = this.codCharges?.CODCharged || 0;
        this.CODDODTobeCollected = this.codCharges?.CODCharged || 0;
        this.CODRateType = this.codCharges?.CODRateType || '';
        /*End*/
        /*DACC Charges*/
        this.DACCCharged = this.DaccChargedDetail?.DACCCharged || 0;
        this.DACCToBeCollected = "";
        this.DACCRateType = this.DaccChargedDetail?.DACCRateType || 0;
        /*End*/
        const formattedChargeRule = `${this.Rules.find(x => x.code == 'CHRG_RULE').defaultvalue}, ${this.BaseCode1},%`;
        let reqDocketchargeList = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          chargerule: formattedChargeRule,
          paybas: this.step1.controls['PAYTYP'].value,
          basedon: this.Rules.find(x => x.code == 'CHRG_RULE').defaultvalue,
          basecode: this.BaseCode1
        }
        this.ICnoteService.cnoteNewPost('services/GetDocketchargeList', reqDocketchargeList).subscribe({
          next: (res: any) => {
            this.chargeList = res.ResultchargeList;
          }
        })
        let reqchargeValues = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ContractKeys: this.RequestContractKeysDetail.ContractKeys
        }

        this.ICnoteService.cnoteNewPost('services/GetDocketchargeValues', reqchargeValues).subscribe({
          next: (res: any) => {
            this.chargeValues = res.result;
            this.chargeList.forEach(element => {
              let charge = this.chargeValues.find(x => x.chargecode == element.chargecode);
              if (charge != null) {
                element.ChargeValue = charge.Charge;
                return element;
              }
              else {
                element.ChargeValue = 0;
                return element;
              }
            });
            if (!this.step3Formcontrol.find(x => x.Class == 'DocketotherCharges')) {
              let NewControls = []
              let seq = 89;
              this.chargeList.forEach((x) => {
                seq = seq + 1
                let newCharge = {
                  Seq: seq,
                  label: x.chargename,
                  name: x.chargecode,
                  type: "text",
                  dropdown: [],
                  ActionFunction: "",
                  Validation: "",
                  frmgrp: "3",
                  display: true,
                  enable: false,
                  defaultvalue: x.ChargeValue,
                  dbCodeName: "",
                  autocomplete: "",
                  Search: "",
                  div: "otherCharges",
                  useField: "Y",
                  Class: "DocketotherCharges",
                  filteredOptions: this.filteredcharge
                };
                this.step3Formcontrol.push(newCharge);
                NewControls.push(newCharge);
              });
              for (const control of NewControls) {
                this.step3.addControl(control.name, new FormControl(control.defaultvalue));
              }

              this.docketOtherCharge = this.step3Formcontrol.filter((x) => x.Class == 'DocketotherCharges' || x.Class == 'extraOtherCharge').sort((a, b) => a.Seq - b.Seq);
              this.newDocketChanged = true;
              //  const formControls = {};
              // this.step3Formcontrol.forEach(cnote => {
              //   let validators = [];
              //   if (cnote.Validation === 'Required') {
              //     validators = [Validators.required];
              //   }

              //   formControls[cnote.name] = this.fb.control(cnote.defaultvalue, validators);

              //   // if(cnote.disable=='true'){
              //   //   formControls[cnote.name].disable();
              //   // }
              //   return this.fb.group(formControls)
              // });
            }
          }

        })
        let dropdown = ["RATETYPE", "FovRateTyp"]
        let reqratetype = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ddArray: dropdown
        }
        this.ICnoteService.cnoteNewPost('services/GetcommonActiveGeneralMasterCodeListByTenantId', reqratetype).subscribe({
          next: (res: any) => {
            if (res) {
              let RateType = res.result.filter((x) => x.CodeType == 'RATETYPE');
              let FovRateTyp = res.result.filter((x) => x.CodeType == 'FovRateTyp');
              this.step3Formcontrol.map((x) => {
                if (x.name == 'FreightRateType') {
                  x.dropdown = RateType;
                }
              })
            }
          }
        })
      }
    }
    let fovCharge = this.Rules.find(x => x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11" && x.paybas == this.step1.controls['PAYTYP'].value)
    if (fovCharge) {
      this.IsFovChargeReadOnly = false;
    }
    else {
      this.IsFovChargeReadOnly = (fovCharge.enabled == "Y" ? false : true);
    }
    let codDodCharge = this.Rules.find(x => x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11" && x.paybas == this.step1.controls['PAYTYP'].value);
    if (codDodCharge) {
      this.IsCodDodChargeReadOnly = false;
    }
    else {
      this.IsCodDodChargeReadOnly = (codDodCharge.enabled == "Y" ? false : true);
    }
    let daccCharge = this.Rules.find(x => x.paybas == this.step1.controls['PAYTYP'].value && x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11")
    if (daccCharge) {
      this.IsDaccReadOnly = false;
    }
    else {
      this.IsDaccReadOnly = (daccCharge.enabled == "Y" ? false : true);
    }
    this.WhoIsParty = this.Rules.find(x => x.code == 'WHO_IS_PARTY' && x.paybas == this.step1.controls['PAYTYP'].value);
    this.AdvanceGivenTo = [{
      CodeId: 'Driver',
      CodeDesc: 'Driver'
    },
    {
      CodeId: 'Company',
      CodeDesc: 'Company'
    },
    {
      CodeId: 'BA',
      CodeDesc: 'BA'
    }
    ]

    this.AdvancePayMode = [{
      CodeId: 'CASH',
      CodeDesc: 'CASH'
    },
    {
      CodeId: 'BANK',
      CodeDesc: 'BANK'
    }
    ]
    let reqCheckDPHBillingRule = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      ContractId: this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId
    }
    this.ICnoteService.cnoteNewPost('services/CheckDPHBillingRule', reqCheckDPHBillingRule).subscribe({
      next(res: any) {
        if (res) {
          this.RuleDPHBilling = res.result[0].DPHBilling;
        }
      }
    })

    let reqDPHBilling = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      ContractId: this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId,
      TransMode: this.step1.controls['TRN'].value
    }
    this.ICnoteService.cnoteNewPost('services/CheckDPHBillingReadOnly', reqDPHBilling).subscribe({
      next(res: any) {
        if (res) {
          this.DPHBillingReadOnly = res.result[0].DPHType;
        }
      }
    })

    let reqDPHCharge = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      ContractId: this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId,
      TransMode: this.step1.controls['TRN'].value
    }
    this.ICnoteService.cnoteNewPost('services/GetDPHCharge', reqDPHCharge).subscribe({
      next(res: any) {
        if (res) {
          this.DPHCharge = res.result[0];
        }
      }
    })
    if (this.RuleDPHBilling == "Y" && this.DPHBillingReadOnly != 'Y' && this.DPHCharge != null && this.InvokeNewContract != "N") {
      this.DPHRateType = this.DPHCharge?.DPHRateType || '';
      this.DPHRate = this.DPHCharge?.DPHRate || 0;
      this.DPHAmount = this.DPHCharge?.DPHAmount || 0;
    }
    else if (this.InvokeNewContract != "N") {
      this.DPHRateType = "%";
      this.DPHRate = 0;
      this.DPHAmount = 0;
    }
    this.CalucateEdd()
  }
  /*COD/DOD CHARGE*/

  //end----->
  paymentDetail(event) {
    if (event == 'PaymentDetail') {
      this.invoke = true
      this.InvokeInvoice();
    }
    else {
      this.InvokeInvoice();
    }
  }
  //End
  //CodeChanged
  codeChanged() {
    // Check if Volumetric is truthy (not undefined, null, false, 0, etc.)
    if (this.step3.controls['F_COD'].value) {
      this.otherCharges = this.CnoteData.filter((x) => x.div == 'otherCharges' && x.Class != 'extraOtherCharge');
    }
    else {
      this.otherCharges = this.otherCharges.filter(x => x.Class != 'CodDodPortion')
    }
  }
  FreightDetail() {
    /*Freight Charges*/
    this.FreightRate = this.contractKeysInvoke?.FreightRate[0] || 0;
    this.FreightCharge = this.contractKeysInvoke?.FreightCharge[0] || 0;
    this.FreightRateType = this.contractKeysInvoke?.RateType[0] || '';
    this.RequestContractKeysDetail.ContractKeys.TRDays = this.contractKeysInvoke?.TRDays[0] || 0;
    this.DiscountRate = 0;
    this.DiscountRateType = "";
    this.DiscountAmount = 0;
    this.step3.controls['FreightRateType'].setValue(this.FreightRateType);
    this.step3.controls['FreightRate'].setValue(this.FreightRate ? this.FreightRate : 0);
    this.step3.controls['FreightCharge'].setValue(this.FreightCharge ? this.FreightCharge : 0);
    this.step3.controls['DiscountRate'].setValue(this.DiscountRate ? this.DiscountRate : 0);
    this.step3.controls['DiscountAmount'].setValue(this.DiscountAmount ? this.DiscountAmount : 0);
    /*End*/
  }
  //Disbled Type oF movment
  DisbleTypeOFmovent() {
    if (this.step1.controls['SVCTYP'].value == '1') {
      this.step1.controls['FTLTYP'].disable();
      this.step1.controls['FTLTYP'].setValue('');
    }
    else {
      this.step1.controls['FTLTYP'].enable();
    }
  }
  //Check The filered
  CNoteFieldChecked() {

    if (this.ServiceType == 'FTL') {
      const excludedValues = ['DKTNO', 'ContainerDetails', 'AppointmentBasedDelivery'];
      this.CnoteData = this.CnoteData.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.showOtherContainer = false;
      this.showOtherAppointment = false;
    }
    else if (this.ServiceType == 'LTL') {
      const excludedValues = ['DKTNO', 'PRQ', 'IsMarketVehicle', 'F_ODA', 'F_LOCAL', 'VEHICLE_NO', 'F_MDEL', 'F_MPKP', 'SRCDKT'];
      this.CnoteData = this.CnoteData.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.showOtherContainer = true;
      this.showOtherAppointment = true;
    }
    else if (this.ServiceType == 'FCL') {
      const excludedValues = ['F_LOCAL', 'VEHICLE_NO', 'F_MDEL', 'F_MPKP', 'SRCDKT', 'AppointmentBasedDelivery'];
      this.CnoteData = this.CnoteData.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.showOtherAppointment = false;
    }
  }
  //End
  Invoiceinit() {

    this.RequestContractKeysDetail.companyCode = parseInt(localStorage.getItem("companyCode"))
    this.RequestContractKeysDetail.ContractKeys.CompanyCode = parseInt(localStorage.getItem("companyCode")),
      this.RequestContractKeysDetail.ContractKeys.BasedOn1 = this.BasedOn1 ? this.BasedOn1 : '';
    this.RequestContractKeysDetail.ContractKeys.BaseCode1 = this.BaseCode1 ? this.BaseCode1 : '';
    this.RequestContractKeysDetail.ContractKeys.BasedOn2 = this.BasedOn2 ? this.BasedOn2 : '';
    this.RequestContractKeysDetail.ContractKeys.BaseCode2 = this.BaseCode2 ? this.BaseCode2 : '';
    this.RequestContractKeysDetail.ContractKeys.ChargedWeight = this.step3.controls['CHRGWT'].value ? this.step3.controls['CHRGWT'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.ContractID = this.step1.controls['PRQ_BILLINGPARTY'].value.ContractId;
    this.RequestContractKeysDetail.ContractKeys.DelLoc = this.step1.controls['DELLOC'].value.Value;
    this.RequestContractKeysDetail.ContractKeys.Depth = this.ContractDepth;
    this.RequestContractKeysDetail.ContractKeys.FromCity = this.step1.controls['FCITY'].value.Value,
      this.RequestContractKeysDetail.ContractKeys.FTLType = this.step1.controls['FTLTYP'].value;
    this.RequestContractKeysDetail.ContractKeys.NoOfPkgs = this.step3.controls['TotalChargedNoofPackages'].value ? this.step3.controls['TotalChargedNoofPackages'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.Quantity = this.step3.controls['TotalPartQuantity'].value ? this.step3.controls['TotalPartQuantity'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.OrgnLoc = localStorage.getItem("Branch");
    this.RequestContractKeysDetail.ContractKeys.PayBase = this.step1.controls['PAYTYP'].value ? this.step1.controls['PAYTYP'].value : "";
    this.RequestContractKeysDetail.ContractKeys.ServiceType = this.step1.controls['SVCTYP'].value ? this.step1.controls['SVCTYP'].value : "";
    this.RequestContractKeysDetail.ContractKeys.ToCity = this.step1.controls['TCITY'].value.Value;
    this.RequestContractKeysDetail.ContractKeys.TransMode = this.step1.controls['TRN'].value;
    this.RequestContractKeysDetail.ContractKeys.OrderID = "01";
    this.RequestContractKeysDetail.ContractKeys.InvAmt = this.step3.controls['TotalDeclaredValue'].value ? this.step3.controls['TotalDeclaredValue'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.DeliveryZone = this.DeliveryZone ? parseInt(this.DeliveryZone) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryPinCode = this.DestDeliveryPinCode ? parseInt(this.DestDeliveryPinCode) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryArea = this.DestDeliveryArea ? this.DestDeliveryArea : '';
    this.RequestContractKeysDetail.ContractKeys.DocketDate = this.step1.controls['DKTDT'].value; this.RequestContractKeysDetail.ContractKeys.FlagDeferment = this.IsDeferment;
    this.RequestContractKeysDetail.ContractKeys.TRDays = this.contractKeysInvoke?.TRDays[0] || 0;
  }
  CalucateEdd() {
    this.Invoiceinit();
    let reqbody = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      EDD_TRANSIT: this.Rules.find((x) => x.code == 'EDD_TRANSIT').defaultvalue,
      FLAG_CUTOFF: this.Rules.find((x) => x.code == 'FLAG_CUTOFF').defaultvalue,
      EDD_NDAYS: this.Rules.find((x) => x.code == 'EDD_NDAYS').defaultvalue,
      EDD_LOCAL: this.Rules.find((x) => x.code == 'EDD_LOCAL').defaultvalue,
      EDD_ADD_HDAYS: this.Rules.find((x) => x.code == 'EDD_ADD_HDAYS').defaultvalue,
      ContractKeys: this.RequestContractKeysDetail.ContractKeys
    }
    this.ICnoteService.cnoteNewPost('services/CalculatEdd', reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          let date = new Date(res.result.Date)
          this.step3.controls['EDD'].setValue(date);
          this.step3.controls['EEDD'].setValue(date);
          this.FlagCutoffApplied = res.result.FlagCutoffApplied;
          this.FlagHolidayApplied = res.result.FlagHolidayApplied
          this.FlagHolidayBooked = res.result.FlagHolidayBooked
        }
      }
    })
  }
  //end
  //GetDestination
  GetDestination() {
    if (this.step1.controls['DELLOC'].value.length > 3) {
      let reqbody = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        map_dloc_pin: this.Rules.find((x) => x.code == 'MAP_DLOC_PIN').defaultvalue,
        OriginLocation: localStorage.getItem("Branch"),
        loc_level: "234",
        searchText: this.step1.controls['DELLOC'].value
      }
      this.ICnoteService.cnoteNewPost('services/GetDestination', reqbody).subscribe({
        next: (res: any) => {
          if (res) {
            this.Destination = res.result;
            this.destionationNestedDate = res.result;
            this.getCityFilter();
          }
        }
      })
    }
  }
  toCityAutofill(event) {
    let toCity = {
      Value: event.option.value.LocCity,
      Name: event.option.value.LocCity,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['TCITY'].setValue(toCity);
    this.DeliveryZone = event.option.value.PincodeZoneId || "";
    this.DestDeliveryPinCode = event.option.value.pincode || "";
    this.DestDeliveryArea = event.option.value.Area || "";
    this.PincodeZoneLocation = event.option.value.PincodeZoneLocation || "";
  }
  GetDetailedBasedOnCStep1() {
    let reqbody = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      Origin: localStorage.getItem("Branch"),
      DocketNumber: this.step1.controls['DKTNO']?.value || ''
    }
    this.ICnoteService.cnoteNewPost('services/GetDetailedBasedOnCStep1', reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          //MArk that this is temapory res.Result[0]?.ORIGIN||"" bcz in this time Virtual login and Location is not available so i jst working using static location if the varitual login is done this condtion shold be changed
          this.step1.controls['ORGNLOC'].setValue(res.Result[0]?.ORIGIN || "");
          let FromCity = {
            Value: res.Result[0]?.FROMCITY || "",
            Name: res.Result[0]?.FROMCITY || "",
            LOCATIONS: "",
            CITY_CODE: "",
          }
          this.step1.controls['FCITY'].setValue(FromCity);
          this.step1.controls['PAYTYP'].setValue(res.Result[0]?.DEFAULTPAYBASE || "");
          if (this.EwayBill) {
            this.EwayBillDetailAutoFill();
          }
          // this.step1.controls['PROD'].setValue(res.Result[0]?.DEFAULTPRODUCT||"");
          // this.step1.controls['TRN'].setValue(res.Result[0]?.DEFAULTMODE||"");
        }
      }
    })
  }
  //End
  // //start
  // Validationchecked(Formcontrol,step) {
  //    const requiredStepNames = Formcontrol
  //   .filter(step => step.Validation === 'Required' && step.type!="toggle")
  //   .map(step => step.name);
  //   this.isLinear = this.areFieldsFilled(step, requiredStepNames);
  //   //;
  // }

  // areFieldsFilled(form: FormGroup, fields: string[]): boolean {

  //   for (const field of fields) {
  //     if (!form.get(field)?.value && !form.get(field)?.disabled) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }


  //  end
  Onsubmit() {
    if (this.IsDocketEdit == "Y") {

    }
    else if (this.IsQuickCompletion == "Y") {

    }
    else {
      this.DocketEntity.ContractId = this.step1.controls['PRQ_BILLINGPARTY']?.value.ContractId || "";
      this.DocketEntity.FromCity = this.step1.controls['FCITY']?.value.Value || '';
      this.DocketEntity.ToCity = this.step1.controls['TCITY']?.value.Value || '';
      this.DocketEntity.Destination = this.step1.controls['DELLOC']?.value.Value || '';
      this.DocketEntity.PrqNumber = this.step1.controls['PRQ']?.value.PRQNO || '';
      this.DocketEntity.DocketNumber = this.step1.controls['DKTNO']?.value || '';
      this.DocketEntity.DocketDate = this.step1.controls['DKTDT']?.value || new Date();
      this.DocketEntity.PackagingType = this.step1.controls['PKGS']?.value || '';
      this.DocketEntity.ProductType = this.step1.controls['PROD']?.value || '';
      this.DocketEntity.ServiceType = this.step1.controls['SVCTYP']?.value || '';
      this.DocketEntity.TransportMode = this.step1.controls['PROD']?.value || '';
      this.DocketEntity.FtlType = this.step1.controls['FTLTYP']?.value || '';
      this.DocketEntity.IsMarketVehicle = this.step1.controls['IsMarketVehicle']?.value || null;
      this.DocketEntity.VehicleNo = this.step1.controls['VEHICLE_NO']?.value || '';
      this.DocketEntity.IsOda = this.step1.controls['F_ODA']?.value || null;
      this.DocketEntity.IsLocalCNote = this.step1.controls['F_LOCAL']?.value || null;
      this.DocketEntity.Division = this.step1.controls['DIV']?.value || ''
      this.DocketEntity.SpecialInstructions = this.step1.controls['RMRK']?.value || ''
      this.DocketEntity.BusinessType = this.step1.controls['BUT']?.value || ''
      this.DocketEntity.IsMutidelivery = this.step1.controls['F_MDEL']?.value || null;
      this.DocketEntity.IsMutipickup = this.step1.controls['F_MPKP']?.value || null;
      this.DocketEntity.SourceCNote = this.step1.controls['SRCDKT']?.value || '';
      this.DocketEntity.ConsignorCode = this.step2.controls['CST_NM']?.value.Value || '';
      this.DocketEntity.ConsignorName = this.step2.controls['CST_NM']?.value.Name || '';
      this.DocketEntity.ConsignorCity = this.step2.controls['ConsignorCity']?.value.Value || '';
      this.DocketEntity.ConsignorPinCode = this.step2.controls['ConsignorPinCode']?.value.Value || this.step2.controls['ConsignorPinCode']?.value || '';
      this.DocketEntity.ConsignorTelephoneNo = this.step2.controls['CST_PHONE']?.value || '';
      this.DocketEntity.ConsignorMobileNo = this.step2.controls['CST_MOB']?.value || '';
      this.DocketEntity.IsConsignorFromMasterOrWalkin = this.step2.controls['IsConsignorFromMasterOrWalkin']?.value || null;
      this.DocketEntity.ConsigneeName = this.step2.controls['ConsigneeCST_NM']?.value.Name || '';
      this.DocketEntity.ConsigneeCity = this.step2.controls['ConsigneeCity']?.value.Value || '';
      this.DocketEntity.ConsigneeGstin = this.step2.controls['ConsigneeGSTINNO']?.value || '';
      this.DocketEntity.ConsigneeMobileNo = this.step2.controls['ConsigneeCST_MOB']?.value || '';
      this.DocketEntity.ConsigneeEmail = this.step2.controls['CST_EMAIL']?.value || '';
      this.DocketEntity.ConsigneeTinNumber = this.step2.controls['CST_TIN']?.value || '';
      this.DocketEntity.ConsigneeCstNumber = this.step2.controls['CST_CST']?.value || '';
      this.DocketEntity.ConsigneeTelephoneNo = this.step2.controls['ConsigneeCST_PHONE']?.value || '';
      this.DocketEntity.ConsigneePinCode = this.step2.controls['ConsigneePinCode']?.value.Value || this.step2.controls['ConsigneePinCode']?.value || '';
      this.DocketEntity.ConsigneeCity = this.step2.controls['ConsigneeCity']?.value.Value || this.step2.controls['ConsigneeCity']?.value || '';
      this.DocketEntity.ConsigneeAddress = this.step2.controls['ConsigneeCST_ADD']?.value || '';
      this.DocketEntity.RiskType = this.step2.controls['RSKTY']?.value || '';
      this.DocketEntity.CustomerRefNo = this.step2.controls['CTR_NO']?.value || '';
      this.DocketEntity.IsAppointmentBasedDelivery = this.step2.controls['IsAppointmentBasedDelivery']?.value || ''
      this.DocketEntity.AppointmentDate = this.step2.controls['AppointmentDate']?.value || ''
      this.DocketEntity.NameOfPerson = this.step2.controls['NameOfPerson']?.value;
      this.DocketEntity.AppointmentContactNumber = this.step2.controls['AppointmentContactNumber']?.value;
      this.DocketEntity.AppointmentRemarks = this.step2.controls['Remarks']?.value;
      this.DocketEntity.AppointmentFromTime = this.step2.controls['AppointmentFromTime']?.value;
      this.DocketEntity.AppointmentToTime = this.step2.controls['AppointmentToTime']?.value || ' '
      this.DocketEntity.ContainerNo1 = this.step2.controls['ContainerNo1']?.value || '';
      this.DocketEntity.ContainerNo2 = this.step2.controls['ContainerNo2']?.value || '';
      this.DocketEntity.ContainerSize1 = this.step2.controls['ContainerSize1']?.value || '';
      this.DocketEntity.ContainerSize2 = this.step2.controls['ContainerSize2']?.value || '';
      this.DocketEntity.ContainerField1 = this.step2.controls['FIELD1']?.value || "";
      this.DocketEntity.ContainerField2 = this.step2.controls['FIELD2']?.value || "";
      this.DocketEntity.ContainerField3 = this.step2.controls['FIELD3']?.value || "";
      this.DocketEntity.ContainerField4 = this.step2.controls['FIELD4']?.value || "";
      this.DocketEntity.ContainerField5 = this.step2.controls['FIELD5']?.value || "";
      this.DocketEntity.ContainerField6 = this.step2.controls['FIELD6']?.value || "";
      this.DocketEntity.ContainerField7 = this.step2.controls['FIELD7']?.value || "";
      this.DocketEntity.ContainerField8 = this.step2.controls['FIELD8']?.value || "";
      this.DocketEntity.ContainerField9 = this.step2.controls['FIELD9']?.value || "";
      this.DocketEntity.IsVolumetric = this.step3.controls['Volumetric']?.value || null;
      this.DocketEntity.CftTotal = this.step3.controls['CFT_TOT']?.value || 0;
      this.DocketEntity.VolRatio = this.step3.controls['CFT_RATIO']?.value || 0;
      this.DocketEntity.TotalChargedWeight = this.step3.controls['CHRGWT']?.value || 0;
      this.DocketEntity.TotalChargedNoofPackages = this.step3.controls['TotalChargedNoofPackages']?.value || 0;
      this.DocketEntity.TotalDeclaredValue = this.step3.controls['TotalDeclaredValue']?.value || 0;
      this.DocketEntity.TotalActualWeight = this.step3.value.invoiceArray.reduce((total, item) => total + item.ActualWeight, 0);
      this.DocketEntity.ChargedKM = this.step3.controls['ChargedKM']?.value || 0;
      this.DocketEntity.TotalPartQuantity = this.step3.controls['TotalPartQuantity']?.value || 0;
      this.DocketEntity.EddDate = this.step3.controls['EDD']?.value || new Date();
      let newInvoicesList: InvoiceEntity[] = [];

      this.step3.value.invoiceArray.forEach(z => {
        let newInvoice: InvoiceEntity = {
          EwbNumber: z.EWBNO,
          EWBDate: z.EWBDATE,
          InvoiceNo: z.INVNO,
          InvoiceDate: z.INVDT,
          Length: z.LENGTH,
          Height: z.HEIGHT,
          Breadth: z.BREADTH,
          DeclaredValue: z.DECLVAL,
          NoOfPackages: z.NO_PKGS,
          CubicWeight: z.CUB_WT,
          ActualWeight: z.ACT_WT,
          Product: z.Invoice_Product,
          HsnCode: z.HSN_CODE,
          PartNumber: '',
          PartDescription: '',
          PartQuantity: 0.0,
          TypeofPackage: '',
          ChargedWeight: 0,
          FreightRate: 0,
          RateType: '',
          FreightAmount: 0,
          EWBExpiredDate: z.EWBEXPIRED,
          Contents: ''
        };

        newInvoicesList.push(newInvoice);
      });

      this.DocketEntity.Invoices = newInvoicesList;


      this.DocketEntity.BcSerialType = this.step3.controls['BcSerialType']?.value || '';
      //  this.DocketEntity.BcSeriess.forEach(m=>{
      //   this.step3.value.barcodearray.forEach(o=>{
      //     m.BarCode=o.barcode
      //   })
      //  })
      let DocketOtherCharges: DocketChargesEntity[] = [];
      this.chargeList.forEach(h => {
        let newInvoice: DocketChargesEntity = {
          ChargeCode: h.chargecode,
          ChargeName: h.chargename,
          ChargeValue: h.chargevalue,
          Operator: h.operator,
          Enabled: h.enabled,
          ActiveFlag: h.activeflag,
          VarybyLoc: h.varybyloc
        };
        DocketOtherCharges.push(newInvoice);
      })
      this.DocketEntity.DocketOtherCharges = DocketOtherCharges;
      this.DocketEntity.FOVCalculated = this.step3.controls['FOVCalculated']?.value || 0;
      this.DocketEntity.FOVCharged = this.step3.controls['FOVCharged']?.value || 0;
      this.DocketEntity.FOVRate = this.step3.controls['FOVRate']?.value || 0;
      this.DocketEntity.FreightRateType = this.step3.controls['FreightRateType']?.value || '';
      this.DocketEntity.DiscountRate = this.step3.controls['DiscountRate']?.value || 0;
      this.DocketEntity.DiscountAmount = this.step3.controls['DiscountAmount']?.value || 0;
      this.DocketEntity.EeddDate = this.step3.controls['EEDD']?.value || '';
      this.DocketEntity.CODDODCharged = this.step3.controls['CODDODCharged']?.value || 0;
      this.DocketEntity.CODDODTobeCollected = this.step3.controls['CODDODTobeCollected']?.value || 0;
      this.DocketEntity.IsCodDod = this.step3.controls['F_COD']?.value || null;
      this.DocketEntity.BasedOn1 = this.BaseCode1 ? this.BaseCode1 : '';
      this.DocketEntity.BasedOn2 = this.BasedOn2 ? this.BasedOn2 : '';
      this.DocketEntity.UseFrom = this.UseFrom ? this.UseFrom : '';
      this.DocketEntity.Origin = 'MUMB';
      this.DocketEntity.UseTo = this.UseTo ? this.UseTo : '';
      this.DocketEntity.UseTransMode = this.UseTransMode ? this.UseTransMode : '';
      this.DocketEntity.UseRateType = this.UseRateType ? this.UseRateType : '';
      this.DocketEntity.ChargeWeightToHighestDecimal = this.ChargeWeightToHighestDecimal ? this.ChargeWeightToHighestDecimal : '';
      this.DocketEntity.ContractDepth = this.ContractDepth ? this.ContractDepth : '';
      this.DocketEntity.ProceedDuringEntry = this.ProceedDuringEntry ? this.ProceedDuringEntry : '';
      this.DocketEntity.BaseCode1 = this.BaseCode1 ? this.BaseCode1 : '';
      this.DocketEntity.BaseCode2 = this.BaseCode2 ? this.BaseCode2 : '';
      this.DocketEntity.FlagCutoffApplied = this.FlagCutoffApplied ? this.FlagCutoffApplied : '';
      this.DocketEntity.FlagHolidayApplied = this.FlagHolidayApplied ? this.FlagHolidayApplied : '';
      this.DocketEntity.FlagHolidayBooked = this.FlagHolidayBooked ? this.FlagHolidayBooked : '';
      this.DocketEntity.DeliveryZone = this.DeliveryZone ? this.DeliveryZone : '';
      this.DocketEntity.DestDeliveryPinCode = this.DestDeliveryPinCode ? this.DestDeliveryPinCode : '';
      this.DocketEntity.DestDeliveryArea = this.DestDeliveryArea ? this.DestDeliveryArea : '';
      this.DocketEntity.PincodeZoneLocation = this.PincodeZoneLocation ? this.PincodeZoneLocation : '';
      //GSTDETAILS
      let GstDetails = new DocketGstEntity();
      GstDetails.IsGSTExempted = false
      GstDetails.ExemptionCategory = ''
      GstDetails.GstPartyName = ''
      GstDetails.GstPartyCode = ''
      GstDetails.ServiceCodeDetails = ''
      GstDetails.ServiceCode = ''
      GstDetails.StateOfSupply = ''
      GstDetails.PlaceOfSupply = ''
      GstDetails.Gstin = ''
      GstDetails.Address = ''
      GstDetails.BilledAt = ''
      GstDetails.DocketSubTotal = 0.00
      GstDetails.ActualGSTRate = 0.00
      GstDetails.GSTRate = 0.00
      GstDetails.RcmApplicableActual = ''
      GstDetails.RcmApplicable = ''
      GstDetails.RcmApplicableText = ''
      GstDetails.GSTCharged = 0.00
      GstDetails.DocketTotal = 0.00
      GstDetails.RoundOffDifference = 0.00
      GstDetails.GSTRemark = ''
      GstDetails.EnableGSTRCMLogic = ''
      GstDetails.SacCode = ''
      GstDetails.SacCategory = ''
      GstDetails.VATRate = 0.00
      GstDetails.TaxControlType = ''
      this.DocketEntity.GstDetails = GstDetails;
      this.DocketEntity.EntryBy = 'Dhaval'
      this.DocketEntity.CompanyCode = parseInt(localStorage.getItem("companyCode"))
      this.DocketEntity.IsConsigneeFromMasterOrWalkin = this.step2.controls['IsConsigneeFromMasterOrWalkin']?.value || '';
      this.DocketEntity.ConsigneeCode = this.step2.controls['ConsigneeCST_NM']?.value.Value || ''
      // this.DocketEntity.EntryTypes = this.DocketEntity.EntryTypes;
      //End
      if (!this.DocketEntity.StateDocumentDetails) {
        this.DocketEntity.StateDocumentDetails = [];
      }
      let newDoc = new StateDocumentDetailEntity();
      newDoc.DocSrno = '';
      newDoc.DocumentName = '';
      newDoc.EnclosedDocumentNumber = '';
      newDoc.IsRequired = '';
      newDoc.IsStaxExmpt = '';
      newDoc.StateCode = '';
      newDoc.StateName = '';

      this.DocketEntity.StateDocumentDetails.push(newDoc);
      if (!this.DocketEntity.ViaCityDetails) {
        this.DocketEntity.ViaCityDetails = [];
      }
      let CityDetailEntity: ViaCityDetailEntity = new ViaCityDetailEntity();
      CityDetailEntity.Address = ''
      CityDetailEntity.ContactNumber = ''
      CityDetailEntity.ContactPerson = ''
      CityDetailEntity.ViaCity = ''

      this.DocketEntity.ViaCityDetails.push(CityDetailEntity);
      if (this.step3.value.BcSeries != null) {
        for (const item of this.step3.value.BcSeries) {
          if (!!item.From && !!item.To) {
            let from = 0, to = 0;
            let numlen: number;
            let arrfrom: string[], arrto: string[];
            let numstrfrom = '', numstrto = '', alfafrom = '', alfato = '', bcserialno = '';
            arrfrom = item.From.split('');
            arrto = item.To.split('');
            for (let j = 0; j < arrfrom.length; j++) {
              const charCode = arrfrom[j].charCodeAt(0);
              if (charCode > 47 && charCode < 58) {
                numstrfrom = numstrfrom + arrfrom[j];
                numstrto = numstrto + arrto[j];
              } else {
                alfafrom = alfafrom + arrfrom[j];
                alfato = alfato + arrto[j];
              }
            }
            numlen = numstrfrom.length;
            from = parseFloat(numstrfrom);
            to = parseFloat(numstrto);
            for (let num = from; num <= to; num++) {
              bcserialno = alfafrom + num.toString().split('.')[0].padStart(numlen, '0');
              this.DocketEntity.BcSeriess.push({
                BarCode: bcserialno
              });
            }
          }
        }
      }
      if (this.step3.value.barcodearray != null) {
        for (const item of this.step3.value.barcodearray) {
          if (!!item.BarCode) {
            this.DocketEntity.BcSeriess.push({
              BarCode: item.BarCode
            });
          }
        }
      }
      this.DocketEntity.CHRGDESC1 = this.step3.controls['CHRG_DESC1']?.value || '';
      this.DocketEntity.CHRGDESC2 = this.step3.controls['CHRG_DESC2']?.value || '';
      this.DocketEntity.CHRGDESC3 = this.step3.controls['CHRG_DESC3']?.value || '';
      this.DocketEntity.CHRGDESC4 = this.step3.controls['CHRG_DESC4']?.value || '';
      this.DocketEntity.DPHRateType = this.DPHRateType ? this.DPHRateType : '';
      this.DocketEntity.DPHRate = this.DPHRate ? this.DPHRate : 0;
      this.DocketEntity.DPHAmount = this.DPHAmount ? this.DPHAmount : 0;
      this.DocketEntity.PaymentType = this.step1.controls['PAYTYP'].value
      this.DocketEntity.IsDacc = this.IsDaccReadOnly ? this.IsDaccReadOnly : false;
      this.DocketEntity.DPHRateType = this.DPHRateType ? this.DPHRateType : '';
      this.DocketEntity.UseFrom = this.UseFrom ? this.UseFrom : '';
      this.DocketEntity.UseTo = this.UseTo ? this.UseTo : '';
      this.DocketEntity.UseTransMode = this.UseTransMode ? this.UseTransMode : '';
      this.DocketEntity.UseRateType = this.UseRateType ? this.UseRateType : '';
      this.DocketEntity.ChargeWeightToHighestDecimal = this.ChargeWeightToHighestDecimal ? this.ChargeWeightToHighestDecimal : '';
      this.DocketEntity.EnableReverseCalculation = this.CcmServicesData?.FlagEnableReverseCalculation || '';
      this.DocketEntity.ContainerId = "0"
      this.DocketEntity.ContainerNo = "0"
      this.DocketEntity.ContainerSealNo = ""
      this.DocketEntity.TAMNo = ""
      this.DocketEntity.QuotationNumber = ""
      this.DocketEntity.AgendaNumber = ""
      this.DocketEntity.VehicleNo = ""
      this.DocketEntity.TrailerNumber = ""
      this.DocketEntity.DriverName1 = ""
      this.DocketEntity.Direct = null
      this.DocketEntity.ManualThcNumber = ""
      this.DocketEntity.Temperature1 = 0
      this.DocketEntity.Temperature2 = 0
      this.DocketEntity.Temperature3 = 0
      this.DocketEntity.Temperature4 = 0
      this.DocketEntity.AverageTemperature = 0
      this.DocketEntity.LoadPlanNumber = ""
      this.DocketEntity.LoadType = ""
      this.DocketEntity.Industry = ""
      this.DocketEntity.IsRto = false
      this.DocketEntity.RtoDockNo = ""
      this.DocketEntity.IsPermitApplicable = null
      this.DocketEntity.IsDeferment = null
      this.DocketEntity.IsPod = null
      this.DocketEntity.WeightType = ""
      this.DocketEntity.PlPartner = ""
      this.DocketEntity.ConsignorAddressCode = ""
      this.DocketEntity.ConsignorAddress = this.step2.controls['CST_ADD']?.value;
      this.DocketEntity.ConsignorAddress = this.step2.controls['CST_ADD']?.value;
      this.DocketEntity.ConsignorGstin = this.step2.controls['GSTINNO']?.value;
      this.DocketEntity.ConsignorTinNumber = this.step2.controls['ConsignorTinNumber']?.value || '';
      this.DocketEntity.ConsignorCstNumber = this.step2.controls['ConsignorCstNumber']?.value || '';
      this.DocketEntity.ConsignorEmail = this.step2.controls['ConsignorEmail']?.value || '';
      this.DocketEntity.ConsignorEmail = this.step2.controls['ConsignorEmail']?.value || '';
      this.DocketEntity.PickupDelivery = this.step1.controls['PKPDL']?.value || '';
      this.DocketEntity.ConsigneeDeliveryAddress = ""
      this.DocketEntity.PolicyNo = ""
      this.DocketEntity.PolicyDate = ""
      this.DocketEntity.PolicyValidUpto = ""
      this.DocketEntity.InternalCovers = 0
      this.DocketEntity.ModvatCovers = 0
      this.DocketEntity.PrivateMark = ""
      this.DocketEntity.TpNumber = ""
      this.DocketEntity.CustomerRefrenceBatchNo = ""
      this.DocketEntity.CustomerRefrenceDeliveryNo = ""
      this.DocketEntity.CustomerRefrenceModelNumber = ""
      this.DocketEntity.CustomerRefrenceGpsNumber = ""
      this.DocketEntity.CustomerRefrenceChasisNumber = ""
      this.DocketEntity.PurchaseOrderNo = ""
      this.DocketEntity.CustomerRefrenceNo1 = ""
      this.DocketEntity.CustomerRefrenceNo2 = ""
      this.DocketEntity.CustomerRefrenceEnginNo = ""
      this.DocketEntity.PermitReceivedAt = ""
      this.DocketEntity.PermitNumber = ""
      this.DocketEntity.OctroiAmount = 0
      this.DocketEntity.PermitDate = '0001-01-01T00:00:00'
      this.DocketEntity.PermitReceivedDate = '0001-01-01T00:00:00'
      this.DocketEntity.ContainerType = this.step2.controls['CONTTYP']?.value || ''
      this.DocketEntity.StuffingDate = '0001-01-01T00:00:00'
      this.DocketEntity.StandardFreightRate = 0
      this.DocketEntity.WeightToConsider = this.WeightToConsider ? this.WeightToConsider : ''
      this.DocketEntity.MaxMeasureValue = this.MaxMeasureValue ? this.MaxMeasureValue : 0
      this.DocketEntity.MinInvoiceValue = this.MinInvoiceValue ? this.MinInvoiceValue : 0
      this.DocketEntity.MaxInvoiceValue = this.MaxInvoiceValue ? this.MaxInvoiceValue : 0
      this.DocketEntity.MinInvoiceValuePerKG = this.MinInvoiceValuePerKG ? this.MinInvoiceValuePerKG : 0
      this.DocketEntity.MaxInvoiceValuePerKG = this.MaxInvoiceValuePerKG ? this.MaxInvoiceValuePerKG : 0
      this.DocketEntity.DefaultChargeWeight = this.DefaultChargeWeight ? this.DefaultChargeWeight : 0
      this.DocketEntity.MinChargeWeight = this.MinChargeWeight ? this.MinChargeWeight : 0
      this.DocketEntity.MaxChargeWeight = this.MaxChargeWeight ? this.MaxChargeWeight : 0
      this.DocketEntity.VolMeasure = this.VolMeasure ? this.VolMeasure : ''
      this.DocketEntity.TotalChargedNoofPkgsQuickCnot = 0
      this.DocketEntity.BillingPartysCode = this.step1.controls['PRQ_BILLINGPARTY']?.value.Value || ''
      this.DocketEntity.BillingPartysName = this.step1.controls['PRQ_BILLINGPARTY']?.value.Name || ''
      console.log(this.DocketEntity);
      this.ICnoteService.cnoteNewPost('services/BookDocket', this.DocketEntity).subscribe({
        next: (res: any) => {
          SwalerrorMessage("success", "DocketNo:" + res.result[0].DocketNumber, "", true);
        }
      })
      //this.DocketEntity.BillingPartys=  0




    }



  }
}
