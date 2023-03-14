import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AutoCompleteCity, AutoCompleteCommon as AutoCompleteCommon, Cnote, ContractDetailList, Dropdown, prqVehicleReq, Radio, Rules } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { cnoteMetaData } from './Cnote';

@Component({
  selector: 'app-cnote-generation',
  templateUrl: './cnote-generation.component.html'

})
export class CNoteGenerationComponent implements OnInit {
  //intialization of varible 
  isDisabled = true;
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
  filteredCnoteBilling: Observable<AutoCompleteCommon[]>;
  pReqFilter: Observable<prqVehicleReq[]>;
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
  AppointmentDetails: Cnote[];
  isappointmentvisble: boolean;
  ContainerDetails: Cnote[];
  ContainerSize: Dropdown[];
  ContainerType: Dropdown[];
  ContainerCapacity: Dropdown[];
  autofillflag: boolean = false;
  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal, private dialog: MatDialog, private ICnoteService: CnoteService, @Inject(PLATFORM_ID) private platformId: Object, private datePipe: DatePipe) {
    this.GetActiveGeneralMasterCodeListByTenantId()

  }

  ngOnInit(): void {
    this.getDaterules();
    this.getContractDetail();


    //this.getBillingPartyAutoComplete();
  }

  // ngAfterViewChecked() {
  //   if (!this.billingPartyAutoCompleteLoaded) {
  //     this.getBillingPartyAutoComplete();
  //     this.billingPartyAutoCompleteLoaded = true;
  //   }
  // }
  //step-1 Formgrop 
  step1Formgrop(): UntypedFormGroup {
    const formControls = {};
    this.step1Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '1')
    if (this.step1Formcontrol.length > 0) {
      this.step1Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control(cnote.defaultvalue == 'TodayDate' ? new Date() : cnote.defaultvalue, validators);

      });
      return this.fb.group(formControls)
    }

  }

  //step-2 Formgrop 
  step2Formgrop(): UntypedFormGroup {
    const formControls = {};
    this.step2Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '2')
    this.Consignor = this.CnoteData.filter((x) => x.div == 'Consignor')
    this.Consignee = this.CnoteData.filter((x) => x.div == 'Consignee')
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
    // pending work beloe radio buttton
    this.AppointmentBasedDelivery = this.CnoteData.filter((x) => x.div == 'AppointmentBasedDelivery')
    this.AppointmentDetails = this.CnoteData.filter((x) => x.div == 'AppointmentDetails');
    const dropdowns = {
      'ContainerSize1': this.ContainerSize,
      'ContainerSize2': this.ContainerSize,
      'ContainerType': this.ContainerType,
      'ContainerCapacity': this.ContainerCapacity
    };

    this.ContainerDetails = this.CnoteData.filter((x) => x.div == 'ContainerDetails').map(item => {
      if (dropdowns.hasOwnProperty(item.name)) {
        item.dropdown = dropdowns[item.name];
      }
      return item;
    });


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

  //step-3 Formgrop 
  step3Formgrop(): UntypedFormGroup {

    const formControls = {};
    this.step3Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '3')
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
    this.InvoiceDetails = this.CnoteData.filter((x) => x.frmgrp == '3' && x.div == 'InvoiceDetails')
    if (this.InvoiceDetails.length > 0) {
      const array = {}
      this.InvoiceDetails.forEach(Idetail => {
        let validators = [];
        if (Idetail.validation === 'Required') {
          validators = [Validators.required];
        }

        array[Idetail.name] = this.fb.control('', validators);

      });
      formControls['invoiceArray'] = this.fb.array([
        this.fb.group(array)
      ])

    }
    return this.fb.group(formControls)
  }
  //start
  addField() {
    const array = {}
    const fields = this.step3.get('invoiceArray') as FormArray;
    if (this.InvoiceDetails.length > 0) {
      this.InvoiceDetails.forEach(cnote => {
        array[cnote.name] = this.fb.control('');

      });

    }
    fields.push(this.fb.group(array));
  }
  removeField(index: number) {
    const fields = this.step3.get('invoiceArray') as FormArray;
    if (fields.length > 1) {
      fields.removeAt(index);
    }
  }

  //end
  //Api Calling Method on Chaged(ACTION URL)
  callActionFunction(functionName: string, event: any) {
    switch (functionName) {
      case "apicall":
        this.apicall(event);
        break;
      case "billingPartyrules":
        this.getBillingPartyAutoComplete(event);
        break;
      case "billingPartyDisble":
        this.getBillingPartyAutoComplete('PRQ_BILLINGPARTY');
        break;
      case "FromCityaction":
        this.getFromCity();
        this.GetDetailedBasedOnContract();
        this.autofillCustomer();
        break;
      case "ToCityAction":
        this.getToCity();
        break;
      case "Destination":
        this.GetDestinationDataCompanyWise();
        break
      case "getVehicleNo":
        this.getVehicleNo();
        break;
      case "Prqdetail":
        this.prqVehicle()
        break;
      case "autoFill":
        this.autoFill(event);
        break;
      case "DocketValidation":
        this.DocketValidation();
        break;
      case "GetMultiPickupDeliveryDocket":
        this.GetMultiPickupDeliveryDocket(event)
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
        break
      case "IsConsigneeFromMasterOrWalkin":
        this.isLabelChanged('Consignee', event.checked);
        break;
      case "displayedAppointment":
        this.displayedAppointment();
        break;
      case "Volumetric":
        this.volumetricChanged();
        break;
      default:
        break;
    }

  }
  //for Testing Purpose
  apicall(event) {

    console.log(event);
    console.log(this.step1.value);
  }

  //Get all field and bind
  GetCnotecontrols() {

    this.ICnoteService.getCnoteBooking('cnotefields/', 10065).subscribe(
      {
        next: (res: any) => {
          if (res) {
            res.push(...this.detail);
            this.CnoteData = res.filter(obj => obj.useField === 'Y').sort((a, b) => a.Seq - b.Seq);
            localStorage.setItem('CnoteData', JSON.stringify(this.CnoteData));
            localStorage.setItem('version', this.version.toString());
            this.step1 = this.step1Formgrop();
            this.step2 = this.step2Formgrop();
            this.step3 = this.step3Formgrop();
            this.getRules();
          }

        },
        error:
          (error) => {
          },
      });
  }
  //Bind all rules
  getRules() {

    this.ICnoteService.getCnoteBooking('services/companyWiseRules/', 10065).subscribe({
      next: (res: any) => {
        if (res) {
          this.Rules = res[0];
          this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
          if (this.InvoiceLevalrule.defaultvalue != "Y") {
            this.step3Formcontrol = this.step3Formcontrol.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName !== 'INVOICE_LEVEL_CONTRACT_INVOKE');
          }
          let Rules = this.Rules.find((x) => x.code == 'MAP_DLOC_PIN')
          let mapcityRule = this.Rules.find((x) => x.code == `USE_MAPPED_LOCATION_INCITY`)
          if (Rules.defaultvalue == "A") {
            if (mapcityRule.defaultvalue === "Y") {
              this.step1.controls['DELLOC'].disable();
            }
          }
          else {
            if (mapcityRule.defaultvalue === "Y") {
              this.step1.controls['DELLOC'].disable();
            }

          }
          this.volumetricChanged();
          //this.getDaterules();
        }
      }
    })
  }
  //getDateRules

  getDaterules() {
    this.ICnoteService.getCnoteBooking('services/getRuleFordate/', 10065).subscribe({
      next: (res: any) => {
        let filterfordate = res.find((x) => x.Rule_Y_N == 'Y');
        this.minDate.setDate(this.minDate.getDate() - filterfordate.BackDate_Days);

      }
    })
  }

  //end
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
    this.getBillingPartyAutoComplete('PRQ_BILLINGPARTY')
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
    this.step1.controls['PAYTYP'].setValue(event.option.value.Paybas);
    //end

    //FTLTYP
    this.step1.controls['SVCTYP'].setValue(event.option.value.FTLValue);
    //end

    //Road
    this.step1.controls['TRN'].setValue(event.option.value.FTLValue);
    //end

    //Destination
    this.GetDestinationDataCompanyWise();
    //end

    //PKGS
    this.step1.controls['PKGS'].setValue(event.option.value.pkgsty)
    //end

    //PICKUPDELIVERY
    this.step1.controls['PKPDL'].setValue(event.option.value.pkp_dly);
    //end

    //PROD
    this.step1.controls['PROD'].setValue(event.option.value.prodcd);
    //end
    //ConsigneeCST_NM
    let ConsigneeCST_NM = {
      Name: event.option.value.CSGENM,
      Value: event.option.value.CSGECD,
    }
    this.step2.controls['ConsigneeCST_NM'].setValue(ConsigneeCST_NM);
    //end

    //ConsigneeCST_ADD
    this.step2.controls['ConsigneeCST_ADD'].setValue(event.option.value.CSGNADDR);
    //end
    //Consignor
    this.step2.controls['CST_NM'].setValue(billingParty)
    //
  }
  //GetAllContractCompanywise

  getContractDetail() {

    this.ICnoteService.getCnoteBooking('services/getContractDetail/', 10065).subscribe({
      next: (res: any) => {
        if (res) {
          this.contractDetail = res;
        }
      }
    })
  }

  //billing Party api
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

                let Consigner = res.find((x) => x.Value == this.step1.value.PRQ_BILLINGPARTY.Value);
                this.step2.controls['CST_NM'].setValue(Consigner);
                this.step2.controls['CST_ADD'].setValue(Consigner.CustAddress)
                this.step2.controls['CST_PHONE'].setValue(Consigner.TelephoneNo)
                this.step2.controls['GSTINNO'].setValue(Consigner.GSTINNumber)
                this.autofillflag = false;
              }
              this.getBillingPartyFilter(event);
              this.getFromCity();
              this.getToCity();
            }
          }
        })

      }
    }
  }

  getBillingPartyFilter(event) {
    let step = 'step' + this.CnoteData.find((x) => x.name == event).frmgrp;
    switch (step) {
      case 'step1':
        this.filteredCnoteBilling = this.step1.controls[
          event
        ].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) =>
            Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice()
          )
        );
        break;
      case 'step2':
        this.filteredCnoteBilling = this.step2.controls[
          event
        ].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) =>
            Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice()
          )
        );
        break;
      case 'step3':
        this.filteredCnoteBilling = this.step3.controls[
          event
        ].valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.Name)),
          map((Name) =>
            Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice()
          )
        );
        break;
    }

  }

  _bilingGropFilter(name: string): AutoCompleteCommon[] {
    const filterValue = name.toLowerCase();

    return this.cnoteAutoComplete.filter(
      (option) => option.Name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCnotegropFn(Cnotegrop: AutoCompleteCommon): string {
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Value + ":" + Cnotegrop.Name : "";
  }

  //End

  //FromCity

  getFromCity() {

    if (this.step1Formcontrol) {
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'FCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      let req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: this.step1.value.PRQ_BILLINGPARTY.ContractId,
        PaymentType: this.step1.value.PAYTYP
      }
      this.ICnoteService.cnotePost('services/getFromCity', req).subscribe({
        next: (res: any) => {

          this.Fcity = res;
          this.getCityFilter();
        }
      })
    }

  }
  //end

  //ToCity

  getToCity() {
    if (this.step1Formcontrol) {
      // let custCode = this.step1.value.PRQ_BILLINGPARTY == undefined ? "" : this.step1.value.PRQ_BILLINGPARTY.CodeId;
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'TCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      let req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: this.step1.value.PRQ_BILLINGPARTY.ContractId,
        PaymentType: this.step1.value.PAYTYP,
        FromCity: this.step1.value.FCITY == "" ? "" : this.step1.value.FCITY.Value

      }
      this.ICnoteService.cnotePost('services/getToCity', req).subscribe({
        next: (res: any) => {

          this.Tcity = res;
          this.getCityFilter();
        }
      })
    }
  }
  //End

  //Destination
  GetDestinationDataCompanyWise() {
    //let bLcode = this.step1Formcontrol.find((x) => x.name == 'DELLOC');
    //let rules = this.Rules.find((x) => x.code.toLowerCase() == bLcode.dbCodeName.toLowerCase());

    var req = {
      companyCode: 10065,
      City: this.step1.value.TCITY.Name
    }

    this.ICnoteService.cnotePost('services/GetMappedLocationFromCityName', req).subscribe({
      next: (res: any) => {
        this.Destination = res;
        let objDelivaryAuto = this.Destination[0];

        this.step1.controls['DELLOC'].setValue(objDelivaryAuto == undefined ? '' : objDelivaryAuto);
        this.getCityFilter()
        this.GetDetailedBasedOnLocations();


      }
    })
  }
  //end
  //prqVehicleReq
  prqVehicle() {
    if (this.step1.value.PRQ.length > 1) {
      let req = {
        companyCode: 10065,
        BranchCode: "MUMB",
        SearchText: this.step1.value.PRQ
      }
      this.ICnoteService.cnotePost('services/prqVehicleReq', req).subscribe({
        next: (res: any) => {
          this.prqVehicleReq = res;
          this.prqVehicleFilter();
        }
      })
    }
  }

  prqVehicleFilter() {
    this.pReqFilter = this.step1.controls[
      "PRQ"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.Name)),
      map((Name) =>
        Name ? this._PrqFilter(Name) : this.prqVehicleReq.slice()
      )
    );
  }

  _PrqFilter(prqVehicleReq: string): prqVehicleReq[] {
    const filterValue = prqVehicleReq.toLowerCase();

    return this.prqVehicleReq.filter(
      (option) => option.PRQNO.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayPRQNoFn(Cnotegrop: prqVehicleReq): string {

    return Cnotegrop && Cnotegrop.PRQNO ? Cnotegrop.PRQNO + ':' + Cnotegrop.VehicleNo : "";
  }
  //end
  //Vehino
  getVehicleNo() {
    if (this.step1.value.VEHICLE_NO.length > 1) {
      let req = {
        companyCode: 10065,
        SearchText: this.step1.value.VEHICLE_NO,
        VendorCode: "",
        VehicleType: "Toll",
        IsCheck: 0
      }
      this.ICnoteService.cnotePost('services/GetVehicle', req).subscribe(
        {
          next: (res: any) => {
            this.Vehicno = res;
            console.log(this.Vehicno);
            this.getCityFilter();
          }

        })
    }
  }
  //end
  //CityApi
  getCityFilter() {
    for (const element of this.CnoteData) {
      const { name } = element;
      let filteredOptions: Observable<AutoCompleteCity[]>;
      let autocomplete = '';

      switch (name) {
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
        case 'SRCDKT':
          if (this.Multipickup) {
            autocomplete = 'autoSRCDKT';
            filteredOptions = this.step1.controls.SRCDKT.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Multipickup) : this.Multipickup.slice())
            );
          }
          break

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
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Name : "";
  }
  //End
  //Docket Validation
  DocketValidation() {

    let req = {
      companyCode: 10065,
      DocType: 'DKT',
      DocNo: this.step1.value.DKTNO,
      LocCode: "MUMB"
    }
    try {
      this.ICnoteService.cnotePost('services/docketValidation', req).subscribe(
        {
          next: (res: any) => {
            if (res.issuccess) {
              this.docketallocate = res.result[0].Alloted_To;
            }
            else {
              this.docketallocate = 'Alloted To'
              SwalerrorMessage("error", res.originalError.info.message, "", true);
            }
          }
        }
      )
    }
    catch (err) {

    }
  }
  //End
  //GetMultiPickupDeliveryDocket 
  GetMultiPickupDeliveryDocket(event) {

    if (event.checked == true) {
      let req = {
        companyCode: 10065,
        DocType: "DKT",
        PayBas: this.step1.value.PAYTYP,
        BookingDate: this.datePipe.transform(this.step1.value.DKTDT, 'd MMM y').toUpperCase()
      }
      this.ICnoteService.cnotePost('services/GetMultiPickupDeliveryDocket', req).subscribe({
        next: (res: any) => {
          if (res.issuccess == true) {
            let Detail = res.result
            let multipickArray = []
            Detail.map(x => {
              let Multipickarray = {
                Name: x.DocketNumber,
                Value: x.DocketNumber
              } as AutoCompleteCity
              multipickArray.push(Multipickarray)
            });
            this.Multipickup = multipickArray;
            this.getCityFilter();
          }
        }
      })
    }
    else {
      this.Multipickup = [];
      this.getCityFilter();
    }
  }
  //End

  //GetDetailedBasedOnLocations
  GetDetailedBasedOnLocations() {

    let req = {
      companyCode: 10065,
      Destination: this.step1.controls['DELLOC'].value.Value,
      ContractId: this.step1.value.PRQ_BILLINGPARTY == undefined ? "" : this.step1.value.PRQ_BILLINGPARTY.ContractId,
      PayBas: this.step1.value.PAYTYP,
      PartyCode: "",
      Origin: "MUMB",
      DestDeliveryPinCode: this.step1.value.DELLOC == undefined ? "" : this.step1.value.DELLOC.pincode,
      FromCity: this.step1.value.FCITY.Value == undefined ? "" : this.step1.value.FCITY.Value,
      ToCity: this.step1.value.TCITY.Value == undefined ? "" : this.step1.value.TCITY.Value
    }
    this.ICnoteService.cnotePost('services/GetDetailedBasedOnLocations', req).subscribe(
      {
        next: (res: any) => {
          const ResDetailsBased = res.result[0];
          if (ResDetailsBased.Oda == "Y") {
            this.step1.controls['F_ODA'].setValue(ResDetailsBased.Oda == "Y" ? true : false);
            SwalerrorMessage("info", "Currently To City/Pincode Is Out of delivery are so ODA is marked.", "", true);
          }
          if (ResDetailsBased.LocalBooking == "Y") {
            this.step1.controls['F_LOCAL'].setValue(ResDetailsBased.LocalBooking == "Y" ? true : false);
            SwalerrorMessage("info", "Currently from city and to city are same so local booking marked.", "", true);
          }
        }
      })
  }
  //ends
  //ConsignorCity
  getConsignorCity() {

    if (this.step2.value.ConsignorCity.length > 2) {
      try {
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');
        let req = {
          searchText: this.step2.value.ConsignorCity,
          companyCode: 10065,
          MAP_DLOC_CITY: rules.defaultvalue

        }
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
  //end
  //getConsigneeCity
  getConsigneeCity() {

    if (this.step2.value.ConsigneeCity.length > 2) {
      try {
        let rules = this.Rules.find((x) => x.code == 'MAP_DLOC_CITY');
        let req = {
          searchText: this.step2.value.ConsigneeCity,
          companyCode: 10065,
          MAP_DLOC_CITY: rules.defaultvalue
        }
        this.ICnoteService.cnotePost('services/consigneeCity', req).subscribe({
          next: (res: any) => {
            this.ConsigneeCity = res.result;
            this.getCityFilter()
          }
        })
      }
      catch (err) {

      }
    }
  }
  //end
  //getpincode
  getPincodeDetail(event) {

    let control;
    let city
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
    if (control.length > 1) {
      try {
        let req = {
          searchText: control,
          companyCode: 10065,
          city: city.Value
        }
        this.ICnoteService.cnotePost('services/getPincode', req).subscribe({
          next: (res: any) => {
            if (res) {
              this.pinCodeDetail = res;
              this.getCityFilter();
            }
          }
        })
      }
      catch (err) {
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
    }
  }
  //end
  //isLabelChanged
  isLabelChanged(event, value) {
    const updateLabel = (labels, fromLabel, toLabel) => {
      return labels.map(item => {
        if (item.label === fromLabel) {
          item.label = toLabel;
        }
        return item;
      });
    };

    if (event === 'Consignor') {
      this.Consignor = value ? updateLabel(this.Consignor, 'Walk-In', 'From Master') : updateLabel(this.Consignor, 'From Master', 'Walk-In');
    } else if (event === 'Consignee') {
      this.Consignee = value ? updateLabel(this.Consignee, 'Walk-In', 'From Master') : updateLabel(this.Consignee, 'From Master', 'Walk-In');
    }
  }
  //
  //GetDetailedBasedOnContract
  GetDetailedBasedOnContract() {

    try {
      let req = {
        companyCode: 10065,
        DataType: 2,
        PAYBAS: this.step1.value.PAYTYP,
        CONTRACTID: this.step1.value.PRQ_BILLINGPARTY.ContractId
      }
      this.ICnoteService.cnotePost('services/GetDetailedBasedOnContract', req).subscribe({
        next: (res: any) => {
          const codeTypes = ['FTLTYP', 'PKPDL', 'SVCTYP', 'TRN'];
          this.step1Formcontrol.forEach(item => {
            if (codeTypes.includes(item.name)) {
              item.dropdown = res.result.filter(x => x.CodeType === item.name);
            }
          });
        }
      })
    }
    catch (err) {
      SwalerrorMessage("error", "Please  Try Again", "", true);
    }
  }
  //end
  //displayedAppointment
  displayedAppointment() {
    this.isappointmentvisble = this.step2.value.IsAppointmentBasedDelivery == 'Y' ? true : false;
  }
  //
  //GetActiveGeneralMasterCodeListByTenantId
  GetActiveGeneralMasterCodeListByTenantId() {
    let dropdown = ["CNTSIZE", "CONTTYP", "CONTCAP"]
    try {
      let req = {
        companyCode: 10065,
        ddArray: dropdown
      }
      this.ICnoteService.cnotePost('services/GetcommonActiveGeneralMasterCodeListByTenantId', req).subscribe({
        next: (res: any) => {
          this.ContainerSize = res.result.filter((x) => x.CodeType == 'CNTSIZE')
          this.ContainerType = res.result.filter((x) => x.CodeType == 'CONTTYP')
          this.ContainerCapacity = res.result.filter((x) => x.CodeType == 'CONTCAP')
          this.data = JSON.parse(localStorage.getItem('CnoteData'));
          if (!this.data) {
            this.GetCnotecontrols();
          }
          else {

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

    }
  }
  //end
  //autofillCustomer
  autofillCustomer() {
    //Consignor
    let Consignor = {
      Name: this.step1.value.PRQ_BILLINGPARTY.Name,
      Value: this.step1.value.PRQ_BILLINGPARTY.Value
    }
    this.step2.controls['CST_NM'].setValue(Consignor)
    //end

    //Consignor address
    this.step2.controls['CST_ADD'].setValue(this.step1.value.PRQ_BILLINGPARTY.CustAddress)
    //end
    //telephone
    this.step2.controls['CST_PHONE'].setValue(this.step1.value.PRQ_BILLINGPARTY.TelephoneNo)
    //end

    //GST
    this.step2.controls['GSTINNO'].setValue(this.step1.value.PRQ_BILLINGPARTY.GSTINNumber)
    //end
  }


  volumetricChanged() {
    debugger;
    if (this.step3.value.Volumetric) {
      this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
      if (this.InvoiceLevalrule.defaultvalue != "Y") {
        this.step3Formcontrol = this.CnoteData.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
        this.InvoiceDetails = this.CnoteData.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
      }
      else {
        this.step3Formcontrol = this.CnoteData.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
        this.InvoiceDetails = this.CnoteData.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '3');
      }
    }
    else {
      this.step3Formcontrol = this.step3Formcontrol.filter(x => x.Class != 'Volumetric')
      this.InvoiceDetails = this.InvoiceDetails.filter(x => x.Class != 'Volumetric');
    }
  }
  //end
}
