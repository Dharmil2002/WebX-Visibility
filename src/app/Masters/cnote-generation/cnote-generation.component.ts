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
@Component({
  selector: 'app-cnote-generation',
  templateUrl: './cnote-generation.component.html'

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

  //End
  constructor(private fb: UntypedFormBuilder, private cdr: ChangeDetectorRef, private modalService: NgbModal, private dialog: MatDialog, private ICnoteService: CnoteService, @Inject(PLATFORM_ID) private platformId: Object, private datePipe: DatePipe) {
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
        if (cnote.validation === 'Required') { // If the control is required, add a required validator
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
        if (cnote.validation === 'Required') {
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
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }

        formControls[cnote.name] = this.fb.control(cnote.defaultvalue, validators);

        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
    }

    // Get all the invoice details from CnoteData
    this.InvoiceDetails = this.CnoteData.filter((x) => x.frmgrp == '3' && x.div == 'InvoiceDetails')

    // Loop through each invoice detail and create form controls with appropriate validators
    if (this.InvoiceDetails.length > 0) {
      const array = {}
      this.InvoiceDetails.forEach(Idetail => {
        let validators = [];
        if (Idetail.validation === 'Required') {
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
        if (BcSeries.validation === 'Required') {
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
        if (cnote.validation === 'Required') {
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
        this.toCityAutofill();
        break;
      default:
        break;
    }
  }



  //ConsignorAutoFill
  ConsignorAutoFill() {
    //set the value of GSTINNO control to the GSTINNumber of CST_NM control if it is not null, otherwise set it to empty string
    this.step2.controls['GSTINNO'].setValue(this.step2.value.CST_NM.GSTINNumber == null ? '' : this.step2.value.CST_NM.GSTINNumber);
    //set the value of CST_ADD control to the CustAddress of CST_NM control
    this.step2.controls['CST_ADD'].setValue(this.step2.value.CST_NM.CustAddress);
    //set the value of CST_PHONE control to the TelephoneNo of CST_NM control
    this.step2.controls['CST_PHONE'].setValue(this.step2.value.CST_NM.TelephoneNo);
    //set the value of CST_MOB control to the phoneno of CST_NM control
    this.step2.controls['CST_MOB'].setValue(this.step2.value.CST_NM.phoneno);
  }
  //end


  // ConsigneeAutoFill function to auto-fill Consignee details
  ConsigneeAutoFill() {
    // Set ConsigneeGSTINNO control value to GSTIN number if it exists, otherwise set it to empty string
    this.step2.controls['ConsigneeGSTINNO'].setValue(this.step2.value.ConsigneeCST_NM.GSTINNumber == null ? '' : this.step2.value.CST_NM.GSTINNumber);

    // Set ConsigneeCST_ADD control value to Consignee address
    this.step2.controls['ConsigneeCST_ADD'].setValue(this.step2.value.ConsigneeCST_NM.CustAddress);

    // Set ConsigneeCST_PHONE control value to Consignee telephone number
    this.step2.controls['ConsigneeCST_PHONE'].setValue(this.step2.value.ConsigneeCST_NM.TelephoneNo);

    // Set ConsigneeCST_MOB control value to Consignee mobile number
    this.step2.controls['ConsigneeCST_MOB'].setValue(this.step2.value.ConsigneeCST_NM.phoneno);
  }
  // End of ConsigneeAutoFill function


  // Get all fields and bind
  GetCnotecontrols() {
    this.ICnoteService.getCnoteBooking('cnotefields/', 10065).subscribe({
      next: (res: any) => {
        if (res) {
          // Push the details array into the response array and filter based on useField property, sort by Seq property
          res.push(...this.detail);
          this.CnoteData = res.filter(obj => obj.useField === 'Y').sort((a, b) => a.Seq - b.Seq);
          // Store the CnoteData array and version number in local storage
          localStorage.setItem('CnoteData', JSON.stringify(this.CnoteData));
          localStorage.setItem('version', this.version.toString());
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
    this.ICnoteService.getCnoteBooking('services/companyWiseRules/', 10065).subscribe({
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


  // This function fetches the date rules from the backend and sets the minimum date for the date picker based on the rule.
  getDaterules() {
    this.ICnoteService.getCnoteBooking('services/getRuleFordate/', 10065).subscribe({
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
    this.step1.controls['PAYTYP'].setValue(event.option.value.Paybas == null ? this.step1.value.PAYTYP : event.option.value.Paybas);
    //end

    //FTLTYP
    this.step1.controls['SVCTYP'].setValue(event.option.value.FTLValue == null ? this.step1.value.SVCTYP : event.option.value.FTLValue);
    //end

    //Road
    this.step1.controls['TRN'].setValue(event.option.value.TransModeValue == null ? this.step1.value.TRN : event.option.value.TransModeValue);
    //end

    //Destination
    this.GetDestinationDataCompanyWise();
    //end

    //PKGS
    this.step1.controls['PKGS'].setValue(event.option.value.pkgsty == null ? this.step1.value.PKGS : event.option.value.pkgsty)
    //end

    //PICKUPDELIVERY
    this.step1.controls['PKPDL'].setValue(event.option.value.pkp_dly == null ? this.step1.value.PKPDL : event.option.value.pkp_dly);
    //end

    //PROD
    this.step1.controls['PROD'].setValue(event.option.value.prodcd == null ? this.step1.value.PROD : event.option.value.prodcd);
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
    this.CalculateInvoiceTotal(0);
    //

    //call api GetPrqInvoiceList
    this.GetPrqInvoiceList();
    //end

  }


  /**
   * Fetches contract details from API and sets it in component variable.
   */
  getContractDetail() {
    this.ICnoteService.getCnoteBooking('services/getContractDetail/', 10065).subscribe({
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

    let rulePartyType = this.Rules.find((x) => x.code == 'PARTY' && x.paybas == this.step1.value.PAYTYP);
    if (rulePartyType.defaultvalue == "D") {
      this.step1.controls['PRQ_BILLINGPARTY'].disable();
      this.getFromCity();
      this.getToCity();
    }
    else {
      this.step1.controls['PRQ_BILLINGPARTY'].enable();
      if (control.length > 3) {
        let bLcode = this.CnoteData.find((x) => x.name == event);
        let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
        let Defalutvalue = this.Rules.find((x) => x.code == 'CUST_HRCHY');
        let CustomerType = event == 'PRQ_BILLINGPARTY' ? 'CP' : event == 'CST_NM' ? 'CN' : 'CE';
        let req = {
          companyCode: 10065,
          LocCode: "MUMB",
          searchText: control,
          CustHierarchy: Defalutvalue.defaultvalue,
          PayBase: this.step1.value.PAYTYP,
          BookingDate: this.datePipe.transform(this.step1.value.DKTDT, 'd MMM y').toUpperCase(),
          CustomerType: rules.defaultvalue == 'Y' ? CustomerType : "",
          ContractParty: event == 'PRQ_BILLINGPARTY' ? 'BillingParty' : event == 'Consignor' ? 'Consignor' : 'Consignee'
        }
        this.ICnoteService.cnotePost('services/billingParty', req).subscribe({
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

      const request = {
        companyCode: 10065,
        map_dloc_city: matchingRule.defaultvalue,
        DocketMode: "Yes",
        ContractParty: this.step1.value.PRQ_BILLINGPARTY?.ContractId || "",
        PaymentType: this.step1.value.PAYTYP
      };

      this.ICnoteService.cnotePost('services/getFromCity', request).subscribe({
        next: (response: any) => {
          this.Fcity = response;
          this.getCityFilter();
        }
      });
    }


  }
  //end



  // Get the list of destination cities based on the selected values
  getToCity() {
    if (this.step1Formcontrol) {
      // Get the TCITY control from step1Formcontrol and find the corresponding rule
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'TCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);

      // Build the request object with necessary data
      let req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: this.step1.value.PRQ_BILLINGPARTY?.ContractId || "",
        PaymentType: this.step1.value.PAYTYP,
        FromCity: this.step1.value.FCITY == "" ? "" : this.step1.value.FCITY.Value
      }

      // Call the API to get the list of destination cities
      this.ICnoteService.cnotePost('services/getToCity', req).subscribe({
        next: (res: any) => {
          // Save the response to the Tcity property and update the city filter
          this.Tcity = res;
          this.getCityFilter();
        }
      })
    }
  }



  // Get Destination data company wise
  GetDestinationDataCompanyWise() {
    if (this.mapcityRule == "Y") {
      // Find the BL code from the step1 form control
      //let bLcode = this.step1Formcontrol.find((x) => x.name == 'DELLOC');
      // Find the rules for the BL code
      //let rules = this.Rules.find((x) => x.code.toLowerCase() == bLcode.dbCodeName.toLowerCase());

      // Create a request object with company code and city name
      var req = {
        companyCode: 10065,
        City: this.step1.value.TCITY.Name
      }

      // Call the API to get the mapped location from city name
      this.ICnoteService.cnotePost('services/GetMappedLocationFromCityName', req).subscribe({
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
    if (this.step1.value.PRQ.length > 1) {
      // Define request parameters
      let req = {
        companyCode: 10065,
        BranchCode: "MUMB",
        SearchText: this.step1.value.PRQ
      };
      // Send POST request to retrieve PRQ vehicle request
      this.ICnoteService.cnotePost('services/prqVehicleReq', req).subscribe({
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
    if (this.step1.value.VEHICLE_NO.length > 1) {
      // Create a request object with required parameters
      let req = {
        companyCode: 10065,
        SearchText: this.step1.value.VEHICLE_NO,
        VendorCode: "",
        VehicleType: "Toll",
        IsCheck: 0
      };
      // Call cnotePost method from ICnoteService with endpoint 'services/GetVehicle' and request object
      this.ICnoteService.cnotePost('services/GetVehicle', req).subscribe(
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
      companyCode: 10065,
      DocType: 'DKT',
      DocNo: this.step1.value.DKTNO,
      LocCode: "MUMB"
    }

    try {
      // Call the docketValidation service and subscribe to the response
      this.ICnoteService.cnotePost('services/docketValidation', req).subscribe({
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
        companyCode: 10065,
        DocType: "DKT",
        PayBas: this.step1.value.PAYTYP,
        BookingDate: this.datePipe.transform(this.step1.value.DKTDT, 'd MMM y').toUpperCase()
      }

      // Send the request to the server to get the list of dockets
      this.ICnoteService.cnotePost('services/GetMultiPickupDeliveryDocket', req).subscribe({
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
      this.getCityFilter();
    }
  }



  //GetDetailedBasedOnLocations
  GetDetailedBasedOnLocations() {
    // Prepare the request payload
    const req = {
      companyCode: 10065,
      Destination: this.step1.controls['DELLOC'].value.Value,
      ContractId: this.step1.value.PRQ_BILLINGPARTY == undefined ? "" : this.step1.value.PRQ_BILLINGPARTY.ContractId,
      PayBas: this.step1.value.PAYTYP,
      PartyCode: "",
      Origin: "MUMB",
      DestDeliveryPinCode: this.step1.value.DELLOC == undefined ? "" : this.step1.value.DELLOC.pincode,
      FromCity: this.step1.value.FCITY.Value == undefined ? "" : this.step1.value.FCITY.Value,
      ToCity: this.step1.value.TCITY.Value == undefined ? "" : this.step1.value.TCITY.Value
    };

    // Call the API
    this.ICnoteService.cnotePost('services/GetDetailedBasedOnLocations', req).subscribe({
      next: (res: any) => {
        // Get the details from the response
        const ResDetailsBased = res.result[0];

        // Set the F_ODA flag if the destination is out of delivery area
        if (ResDetailsBased.Oda == "Y") {
          this.step1.controls['F_ODA'].setValue(ResDetailsBased.Oda == "Y" ? true : false);
          SwalerrorMessage("info", "Currently To City/Pincode Is Out of delivery are so ODA is marked.", "", true);
        }

        // Set the F_LOCAL flag if the from city and to city are the same
        if (ResDetailsBased.LocalBooking == "Y") {
          this.step1.controls['F_LOCAL'].setValue(ResDetailsBased.LocalBooking == "Y" ? true : false);
          SwalerrorMessage("info", "Currently from city and to city are same so local booking marked.", "", true);
        }
      }
    });
  }

  //ends


  // Fetches the Consignor City based on the entered search text
  getConsignorCity() {
    if (this.step2.value.ConsignorCity.length > 2) {
      try {
        // Fetches the rules for MAP_DLOC_CITY
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');

        // Creates the request object to be sent to the API endpoint
        let req = {
          searchText: this.step2.value.ConsignorCity,
          companyCode: 10065,
          MAP_DLOC_CITY: rules.defaultvalue
        }

        // Makes the API call to fetch the Consignor City
        this.ICnoteService.cnotePost('services/ConsignorCity', req).subscribe({
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
    if (this.step2.value.ConsigneeCity.length > 2) { // Check if the search text entered by the user is at least 3 characters long.
      try {
        // Find the rule with code 'MAP_DLOC_CITY' in the 'Rules' array and get its default value.
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');

        // Prepare the request object.
        let req = {
          searchText: this.step2.value.ConsigneeCity, // The search text entered by the user.
          companyCode: 10065, // The company code.
          MAP_DLOC_CITY: rules.defaultvalue // The default value of the 'MAP_DLOC_CITY' rule.
        }

        // Make a POST request to the 'services/consigneeCity' API endpoint with the request object.
        this.ICnoteService.cnotePost('services/consigneeCity', req).subscribe({
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
          companyCode: 10065,
          city: city.Value
        }

        // Make a POST request to fetch the details
        this.ICnoteService.cnotePost('services/getPincode', req).subscribe({
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
            item.ActionFunction = value ? 'ConsignorChanged' : '',
            item.Search = value ? 'billingPartyrules' : ''
        }
        return item;
      });

    }
  }

  GetDetailedBasedOnContract() {
    try {
      let req = {
        companyCode: 10065,
        DataType: 2,
        PAYBAS: this.step1.value.PAYTYP,
        CONTRACTID: this.step1.value.PRQ_BILLINGPARTY?.ContractId || ""
      }
      this.ICnoteService.cnotePost('services/GetDetailedBasedOnContract', req).subscribe({
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
    this.isappointmentvisble = this.step2.value.IsAppointmentBasedDelivery == 'Y' ? true : false;
  }


  GetActiveGeneralMasterCodeListByTenantId() {
    // Dropdown values to fetch
    let dropdown = ["CNTSIZE", "CONTTYP", "CONTCAP"]

    try {
      let req = {
        companyCode: 10065,
        ddArray: dropdown
      }

      // Fetch dropdown values using API
      this.ICnoteService.cnotePost('services/GetcommonActiveGeneralMasterCodeListByTenantId', req).subscribe({
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
    if (this.step1.value.PAYTYP == "P02" || !this.step2.value.CST_NM) {
      // Fill Consignor name and value from PRQ_BILLINGPARTY.Name and PRQ_BILLINGPARTY.Value respectively
      let Consignor = {
        Name: this.step1.value.PRQ_BILLINGPARTY.Name,
        Value: this.step1.value.PRQ_BILLINGPARTY.Value
      }
      this.step2.controls['CST_NM'].setValue(Consignor)

      // Fill Consignor address from PRQ_BILLINGPARTY.CustAddress
      this.step2.controls['CST_ADD'].setValue(this.step1.value.PRQ_BILLINGPARTY.CustAddress)

      // Fill telephone number from PRQ_BILLINGPARTY.TelephoneNo
      this.step2.controls['CST_PHONE'].setValue(this.step1.value.PRQ_BILLINGPARTY.TelephoneNo)

      // Fill GSTIN number from PRQ_BILLINGPARTY.GSTINNumber
      this.step2.controls['GSTINNO'].setValue(this.step1.value.PRQ_BILLINGPARTY.GSTINNumber)
    }
    else {
      this.step2.controls['CST_NM'].setValue("")

      // Fill Consignor address from PRQ_BILLINGPARTY.CustAddress
      this.step2.controls['CST_ADD'].setValue("")

      // Fill telephone number from PRQ_BILLINGPARTY.TelephoneNo
      this.step2.controls['CST_PHONE'].setValue("")

      // Fill GSTIN number from PRQ_BILLINGPARTY.GSTINNumber
      this.step2.controls['GSTINNO'].setValue("")
    }
  }


  volumetricChanged() {
    // Check if Volumetric is truthy (not undefined, null, false, 0, etc.)
    if (this.step3.value.Volumetric) {
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
    if (this.step3.value.BcSerialType == "E") {
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
    if (this.step3.value.Volumetric) {
      // Get package dimensions and calculate volume
      let length = parseInt(event.controls.LENGTH?.value || 0);
      let breadth = parseInt(event.controls.BREADTH?.value || 0);
      let height = parseInt(event.controls.HEIGHT?.value || 0);
      let noOfPackages = parseInt(event.controls.NO_PKGS.value || 0);
      let volume = 0;

      cftVolume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.value?.CFT_RATIO, 0) * WebxConvert.objectToDecimal(noOfPackages, 0);

      // Calculate volume based on selected unit of measure
      switch (this.VolMeasure) {
        case "INCHES":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.value?.CFT_RATIO, 0) / 1728;
          break;
        case "CM":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.value?.CFT_RATIO, 0) / 27000;
          break;
        case "FEET":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step3.value?.CFT_RATIO, 0);
          break;
      }

      volume = parseFloat(roundNumber(volume * WebxConvert.objectToDecimal(noOfPackages, 0), 2));

      // Update form control values
      event.controls.CUB_WT.setValue(volume);
      event.controls.CUB_WT.updateValueAndValidity();

    }
    else {

    }
    this.CalculateRowLevelChargeWeight(event, true, cftVolume)
  }

  ///CalculateRowLevelChargeWeight() 
  CalculateRowLevelChargeWeight(event, FlagCalculateInvoiceTotal, cftVolume) {
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
      this.CalculateInvoiceTotal(cftVolume);
    }
    if (ActualWeight) {
      this.InvokeInvoice();
    }

  }
  //End

  //CalculateInvoiceTotal
  CalculateInvoiceTotal(cftVolume) {
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
        CftTotal = CftTotal + parseFloat(cftVolume)
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

    this.step3.value;
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
      companyCode: 10065,
      contractid: this.step1.value.PRQ_BILLINGPARTY?.ContractId || "",
      ServiceType: this.step1.value.SVCTYP,
      TransMode: this.step1.value.TRN
    };

    // Call API to get invoice configuration
    this.ICnoteService.cnotePost('services/GetInvoiceConfigurationBasedOnTransMode', req).subscribe({
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
      companyCode: 10065,
      PrqNumber: this.step1.value.PRQ.PRQNO
    }

    this.ICnoteService.cnotePost('services/GetPrqInvoiceList', req).subscribe(
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
      companyCode: 10065,
      FROM_SRNO: event.controls.From?.value || 0,
      TO_SRNO: event.controls.To?.value || 0,
      Location: 'MUMB'
    }
    this.ICnoteService.cnotePost('services/ValidateBcSeriesRow', req).subscribe({
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
    this.step1.controls['DIV'].setValue(this.step1.value.VEHICLE_NO.Division);
  }
  //end

  //GetCcmServices
  GetCcmServices() {
    try {
      let req = {
        CompanyCode: 10065,
        contractid: this.step1.value.PRQ_BILLINGPARTY?.ContractId || ''
      }
      this.ICnoteService.cnotePost('services/billingParty', req).subscribe({
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
      companyCode: 10065,
      InvoiceNumber: event.value.INVNO,
      DocketNo: this.step1.value.DKTNO,
      FinYear: 2023
    }
    this.ICnoteService.cnotePost('services/ValidateInvoiceNo', req).subscribe({
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
      IsInvoiceNoMandatory: this.step3Formcontrol.find((x) => x.name = 'INVNO').validation,
      IsInvoiceDateMandatory: this.step3Formcontrol.find((x) => x.name = 'INVDT').validation,
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
      companyCode: 10065,
      PayBase: this.step1.value.PAYTYP
    }
    this.ICnoteService.cnotePost('services/GetConsignorConsigneeRules', req).subscribe({
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
        companyCode: 10065,
        ServiceType: this.step1.value.SVCTYP,
        ContractID: this.step1.value.PRQ_BILLINGPARTY?.ContractId || "",
        ChargeType: "BKG",
        PayBase: this.step1.value.PAYTYP,
      }
      this.ICnoteService.cnotePost("services/GetContractInvokeDependent", req).subscribe({
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
        this.BaseCode1 = this.step1.value.SVCTYP;
        break;
      case "BUT":
        this.BaseCode1 = this.step1.value.BUT;
        break;
      case "NONE":
        this.BaseCode1 = "NONE";
        break;
    }
    switch (this.BasedOn2) {
      case "PROD":
        this.BaseCode2 = this.step1.value.PROD;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.value.PKGS;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.value.PKGS;
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
    let WHO_IS_PARTY = this.Rules.find(x => x.code == 'WHO_IS_PARTY' && x.paybas == this.step1.value.PAYTYP);
    this.rowBillingParty = true;
    switch (WHO_IS_PARTY.defaultvalue) {
      case "1":
        if (!WebxConvert.IsObjectNullOrEmpty(this.step1.value.PRQ_BILLINGPARTY)) {
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
        if (!WebxConvert.IsStringNullOrEmpty(this.step1.value.PRQ_BILLINGPARTY)) {
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
    this.BillingPartyChange(this.step1.value.BillingPartys_3)
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
      companyCode: 10065,
      contractid: this.step1.value.PRQ_BILLINGPARTY.ContractId,
      FromCity: this.step1.value.FCITY.Value,
      ToCity: this.step1.value.TCITY.Value,
      Origin: "mumb",
      Destination: this.step1.controls['DELLOC'].value.Value,
      TransMode: this.step1.value.TRN
    }
    this.ICnoteService.cnotePost('services/GetDistanceFromContract', req).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.Distance = res.result[0];
        }
      }

    })
    let FoundContract = "";
    let MinFreightBase = "";
    let MinFreightType = "";
    let MinFreightBaseRate = "";
    let FreightCharge = 0;
    let ruleContractType = this.Rules.find((x) => x.code == this.step1.value.PAYTYP + 'CONTRACT' && x.paybas == this.step1.value.PAYTYP);;
    let ruleProceed = this.Rules.find((x) => x.code == this.step1.value.PAYTYP + 'PROCEED' && x.paybas == this.step1.value.PAYTYP);
    this.Invoiceinit()
    if (ruleContractType.defaultvalue == "C") {
      if (this.RequestContractKeysDetail.ContractKeys.ContractID != this.RequestContractKeysDetail.ContractKeys.PayBase + "8888" && this.RequestContractKeysDetail.ContractKeys.ContractID) {
        this.ICnoteService.cnotePost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
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
          this.ICnoteService.cnotePost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
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
        this.ICnoteService.cnotePost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
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

      this.ICnoteService.cnotePost('services/InvokeFreight', this.RequestContractKeysDetail).subscribe({
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
    if (this.BrimApiRule == "Y" && this.step1.value.PAYTYP) {
      this.DocketChargeRequest.CHANNEL_TYPE_ID = "5";
      this.DocketChargeRequest.PAY_BASIS = "PAID";
      this.DocketChargeRequest.CUSTOMER_ID = "";
      this.DocketChargeRequest.BOOKING_DATE = this.step1.value.DKTDT;
      this.DocketChargeRequest.BOOKING_TIME = this.step1.value.DKTDT;
      this.DocketChargeRequest.SERVICE = "EXPRESS";
      this.DocketChargeRequest.BOOKING_TYPE = "FORWARD";
      this.DocketChargeRequest.CHARGE_WEIGHT = this.step3.value.CHRGWT;
      this.DocketChargeRequest.NO_OF_PIECES = this.step3.value.NO_PKGS;
      this.DocketChargeRequest.FOD_AMOUNT = 0;
      this.DocketChargeRequest.COD_AMOUNT = 0;
      this.DocketChargeRequest.CONSIGNER_GSTNUMBER = this.step2.value.GSTINNO;
      this.DocketChargeRequest.CONSIGNEE_GSTNUMBER = this.step2.value.ConsigneeGSTINNO;
      this.DocketChargeRequest.INSURED = this.step2.value.RSKTY == "C" ? "Y" : this.step2.value.RSKTY == "0" ? "Y" : "N";
      this.DocketChargeRequest.INSURED_BY = this.step2.value.RSKTY == "C" ? "Carrier" : this.step2.value.RSKTY == "0" ? "Owner" : "";
      this.DocketChargeRequest.BRNCH_OFF = "LKO";
      this.DocketChargeRequest.INV_VALUE = this.step3.value.DECLVAL;
      this.DocketChargeRequest.DEST_PINCODE = "500002";
      this.DocketChargeRequest.APP_BOOKING = "NON APP";
      this.DocketChargeRequest.SBU = "LTL";
      this.DocketChargeRequest.DEST_BRANCH = "HYD";
      this.DocketChargeRequest.DOCUMENT_CODE = "2";
      this.DocketChargeRequest.VAS_PROD_CODE = 1 == 1 ? "COD" : 1 == 1 ? "FOD" : " ";
      this.DocketChargeRequest.CONSGMNT_STATUS = "BOOKED";
      let PayBaseText = this.step1Formcontrol.find((x) => x.name == 'PAYTYP').dropdown.find((x) => x.CodeId == this.step1.value.PAYTYP).CodeDesc;
      if (PayBaseText == "PAID" || PayBaseText == "TOPAY") {
        this.DocketChargeRequest.RATE_CUST_CODE = "";
      }
      else {
        this.DocketChargeRequest.RATE_CUST_CODE = "";
      }
      //BHIMAPI IS PENDING 
    }
    if (this.BrimApiRule == "N" || this.step1.value.PAYTYP) {
      let req = {
        companyCode: 10065,
        contractid: this.step1.value.PRQ_BILLINGPARTY?.ContractId,
        transmode: this.step1.value.TRN,
        dockdt: this.step1.value.DKTDT,
        ContractKeys: this.RequestContractKeysDetail.ContractKeys
      }
      this.ICnoteService.cnotePost('services/GetFuelCharge', req).subscribe({
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
        companyCode: 10065,
        contractid: this.step1.value.PRQ_BILLINGPARTY?.ContractId,
        basedon: this.Rules.find(x => x.code == 'CHRG_RULE').defaultvalue,
        basecode: this.BaseCode1,
        DeclareValue: this.step3.value.TotalDeclaredValue,
        RiskType: this.step2.value.RSKTY,
        ServiceType: this.step1.value.SVCTYP
      }

      this.ICnoteService.cnotePost('services/GetFOVCharge', reqFOVChargeCriteria).subscribe({
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
        companyCode: 10065,
        CODCriteria: "<root><ContractID>" + this.step1.value.PRQ_BILLINGPARTY.ContractId + "</ContractID><InvoiceAmount>" + this.step3.value.TotalDeclaredValue + "</InvoiceAmount></root>"
      }
      this.ICnoteService.cnotePost('services/GetCodeDodCharges', reqCod).subscribe({
        next: (res: any) => {
          if (res) {
            this.codCharges = res.result[0];
          }
        }
      })
      let reqDacc = {
        companyCode: 10065,
        DACCCriteria: "<root><ContractID>" + this.step1.value.PRQ_BILLINGPARTY.ContractId + "</ContractID><InvoiceAmount>" + this.step3.value.TotalDeclaredValue + "</InvoiceAmount></root>",
        DACCCharged: 0,
        DACCRateType: ""
      }
      this.ICnoteService.cnotePost('services/GetDaccCharges', reqDacc).subscribe({
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
          companyCode: 10065,
          chargerule: formattedChargeRule,
          paybas: this.step1.value.PAYTYP,
          basedon: this.Rules.find(x => x.code == 'CHRG_RULE').defaultvalue,
          basecode: this.BaseCode1
        }
        this.ICnoteService.cnotePost('services/GetDocketchargeList', reqDocketchargeList).subscribe({
          next: (res: any) => {
            this.chargeList = res.ResultchargeList;
          }
        })
        let reqchargeValues = {
          companyCode: 10065,
          ContractKeys: this.RequestContractKeysDetail.ContractKeys
        }

        this.ICnoteService.cnotePost('services/GetDocketchargeValues', reqchargeValues).subscribe({
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
                  validation: "",
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
              //   if (cnote.validation === 'Required') {
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
          companyCode: 10065,
          ddArray: dropdown
        }
        this.ICnoteService.cnotePost('services/GetcommonActiveGeneralMasterCodeListByTenantId', reqratetype).subscribe({
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
    let fovCharge = this.Rules.find(x => x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11" && x.paybas == this.step1.value.PAYTYP)
    if (fovCharge) {
      this.IsFovChargeReadOnly = false;
    }
    else {
      this.IsFovChargeReadOnly = (fovCharge.enabled == "Y" ? false : true);
    }
    let codDodCharge = this.Rules.find(x => x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11" && x.paybas == this.step1.value.PAYTYP);
    if (codDodCharge) {
      this.IsCodDodChargeReadOnly = false;
    }
    else {
      this.IsCodDodChargeReadOnly = (codDodCharge.enabled == "Y" ? false : true);
    }
    let daccCharge = this.Rules.find(x => x.paybas == this.step1.value.PAYTYP && x.code == this.BaseCode1 + "," + this.BaseCode1 + "," + "SCHG11")
    if (daccCharge) {
      this.IsDaccReadOnly = false;
    }
    else {
      this.IsDaccReadOnly = (daccCharge.enabled == "Y" ? false : true);
    }
    this.WhoIsParty = this.Rules.find(x => x.code == 'WHO_IS_PARTY' && x.paybas == this.step1.value.PAYTYP);
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
      companyCode: 10065,
      ContractId: this.step1.value.PRQ_BILLINGPARTY.ContractId
    }
    this.ICnoteService.cnotePost('services/CheckDPHBillingRule', reqCheckDPHBillingRule).subscribe({
      next(res: any) {
        if (res) {
          this.RuleDPHBilling = res.result[0].DPHBilling;
        }
      }
    })

    let reqDPHBilling = {
      companyCode: 10065,
      ContractId: this.step1.value.PRQ_BILLINGPARTY.ContractId,
      TransMode: this.step1.value.TRN
    }
    this.ICnoteService.cnotePost('services/CheckDPHBillingReadOnly', reqDPHBilling).subscribe({
      next(res: any) {
        if (res) {
          this.DPHBillingReadOnly = res.result[0].DPHType;
        }
      }
    })

    let reqDPHCharge = {
      companyCode: 10065,
      ContractId: this.step1.value.PRQ_BILLINGPARTY.ContractId,
      TransMode: this.step1.value.TRN
    }
    this.ICnoteService.cnotePost('services/GetDPHCharge', reqDPHCharge).subscribe({
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
    if (this.step3.value.F_COD) {
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
    if (this.step1.value.SVCTYP == '1') {
      this.step1.controls['FTLTYP'].disable();
      this.step1.controls['FTLTYP'].setValue('');
    }
    else {
      this.step1.controls['FTLTYP'].enable();
    }
  }
  Invoiceinit() {
    this.RequestContractKeysDetail.companyCode = 10065
    this.RequestContractKeysDetail.ContractKeys.CompanyCode = 10065,
      this.RequestContractKeysDetail.ContractKeys.BasedOn1 = this.BasedOn1?this.BasedOn1:'';
    this.RequestContractKeysDetail.ContractKeys.BaseCode1 = this.BaseCode1?this.BaseCode1:'';
    this.RequestContractKeysDetail.ContractKeys.BasedOn2 = this.BasedOn2?this.BasedOn2:'';
    this.RequestContractKeysDetail.ContractKeys.BaseCode2 = this.BaseCode2?this.BaseCode2:'';
    this.RequestContractKeysDetail.ContractKeys.ChargedWeight = this.step3.value.CHRGWT ? this.step3.value.CHRGWT : '0.00';
    this.RequestContractKeysDetail.ContractKeys.ContractID = this.step1.value.PRQ_BILLINGPARTY.ContractId;
    this.RequestContractKeysDetail.ContractKeys.DelLoc = this.step1.controls['DELLOC'].value.Value;
    this.RequestContractKeysDetail.ContractKeys.Depth = this.ContractDepth;
    this.RequestContractKeysDetail.ContractKeys.FromCity = this.step1.value.FCITY.Value,
      this.RequestContractKeysDetail.ContractKeys.FTLType = this.step1.controls['FTLTYP'].value;
    this.RequestContractKeysDetail.ContractKeys.NoOfPkgs = this.step3.value.TotalChargedNoofPackages ? this.step3.value.TotalChargedNoofPackages : '0.00';
    this.RequestContractKeysDetail.ContractKeys.Quantity = this.step3.value.TotalPartQuantity ? this.step3.value.TotalPartQuantity : '0.00';
    this.RequestContractKeysDetail.ContractKeys.OrgnLoc = "MUMB";
    this.RequestContractKeysDetail.ContractKeys.PayBase = this.step1.value.PAYTYP ? this.step1.value.PAYTYP : "";
    this.RequestContractKeysDetail.ContractKeys.ServiceType = this.step1.value.SVCTYP ? this.step1.value.SVCTYP : "";
    this.RequestContractKeysDetail.ContractKeys.ToCity = this.step1.value.TCITY.Value;
    this.RequestContractKeysDetail.ContractKeys.TransMode = this.step1.value.TRN;
    this.RequestContractKeysDetail.ContractKeys.OrderID = "01";
    this.RequestContractKeysDetail.ContractKeys.InvAmt = this.step3.value.TotalDeclaredValue ? this.step3.value.TotalDeclaredValue : '0.00';
    this.RequestContractKeysDetail.ContractKeys.DeliveryZone = this.DeliveryZone ? parseInt(this.DeliveryZone) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryPinCode = this.DestDeliveryPinCode ? parseInt(this.DestDeliveryPinCode) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryArea = this.DestDeliveryArea ? this.DestDeliveryArea : '';
    this.RequestContractKeysDetail.ContractKeys.DocketDate = this.step1.value.DKTDT; this.RequestContractKeysDetail.ContractKeys.FlagDeferment = this.IsDeferment;
  }
  CalucateEdd() {
    this.Invoiceinit();
    let reqbody = {
      companyCode: 10065,
      EDD_TRANSIT: this.Rules.find((x) => x.code == 'EDD_TRANSIT').defaultvalue,
      FLAG_CUTOFF: this.Rules.find((x) => x.code == 'FLAG_CUTOFF').defaultvalue,
      EDD_NDAYS: this.Rules.find((x) => x.code == 'EDD_NDAYS').defaultvalue,
      EDD_LOCAL: this.Rules.find((x) => x.code == 'EDD_LOCAL').defaultvalue,
      EDD_ADD_HDAYS: this.Rules.find((x) => x.code == 'EDD_ADD_HDAYS').defaultvalue,
      ContractKeys: this.RequestContractKeysDetail.ContractKeys
    }
    this.ICnoteService.cnotePost('services/CalculatEdd', reqbody).subscribe({
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
    if (this.step1.value.DELLOC.length > 3) {
      let reqbody = {
        companyCode: 10065,
        map_dloc_pin: this.Rules.find((x) => x.code == 'MAP_DLOC_PIN').defaultvalue,
        OriginLocation: "MUMB",
        loc_level: "234",
        searchText: this.step1.value.DELLOC
      }
      this.ICnoteService.cnotePost('services/GetDestination', reqbody).subscribe({
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
  toCityAutofill() {
    let toCity = {
      Value: this.destionationNestedDate[0].LocCity,
      Name: this.destionationNestedDate[0].LocCity,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['TCITY'].setValue(toCity);
    this.DeliveryZone = this.destionationNestedDate[0]?.PincodeZoneId || "";
    this.DestDeliveryPinCode = this.destionationNestedDate[0]?.PinCode || "";
    this.DestDeliveryArea = this.destionationNestedDate[0]?.Area || "";
    this.PincodeZoneLocation = this.destionationNestedDate[0]?.PincodeZoneLocation || "";
  }
  GetDetailedBasedOnCStep1() {
    let reqbody = {
      companyCode: 10065,
      Origin: "MUMB",
      DocketNumber: this.step1.value.DKTNO
    }
    this.ICnoteService.cnotePost('services/GetDetailedBasedOnCStep1', reqbody).subscribe({
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
          // this.step1.controls['PROD'].setValue(res.Result[0]?.DEFAULTPRODUCT||"");
          // this.step1.controls['TRN'].setValue(res.Result[0]?.DEFAULTMODE||"");
        }
      }
    })
  }
  //End
}
