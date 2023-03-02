import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AutoCompleteCity, AutoCompleteCommon as AutoCompleteCommon, AutocompleteField, Cnote, ContractDetailList, prqVehicleReq, Rules } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';

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
  CnoteData: Cnote[];
  Rules: Rules[];
  option: any;
  isOpen = false;
  version: number = 1;
  cnoteAutoComplete: AutoCompleteCommon[];
  Fcity: AutoCompleteCity[];
  Tcity: AutoCompleteCity[];
  Vehicno: AutoCompleteCity[];
  prqVehicleReq: prqVehicleReq[];
  Destination: AutoCompleteCity[];
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
  step1Formcontrol: Cnote[];
  step2Formcontrol: Cnote[];
  step3Formcontrol: Cnote[];
  data: any;
  BSTformarray: Cnote[];
  SerialScan: number = 1;
  barcodearray: Cnote[];
  minDate = new Date();

  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  contractDetail: ContractDetailList[];
  constructor(private fb: UntypedFormBuilder, private modalService: NgbModal, private dialog: MatDialog, private ICnoteService: CnoteService, @Inject(PLATFORM_ID) private platformId: Object) {
    //  this.CnoteData = CNOTEDATA;
    const storedVersion = parseInt(localStorage.getItem('version'), 10);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    if (storedVersion === this.version) {
      this.data = JSON.parse(localStorage.getItem('CnoteData'));
    }
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
        // if(cnote.disable=='true'){
        //   formControls[cnote.name].disable();
        // }
      });
      return this.fb.group(formControls)
    }

  }

  //step-2 Formgrop 
  step2Formgrop(): UntypedFormGroup {

    const formControls = {};
    this.step2Formcontrol = this.CnoteData.filter((x) => x.frmgrp == '2')
    if (this.step2Formcontrol.length > 0) {
      this.step2Formcontrol.forEach(cnote => {
        let validators = [];
        if (cnote.validation === 'Required') {
          validators = [Validators.required];
        }
        formControls[cnote.name] = this.fb.control('', validators);
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

    return this.fb.group(formControls)
  }

  //Api Calling Method on Chaged(ACTION URL)
  callActionFunction(functionName: string, event: any) {

    switch (functionName) {
      case "apicall":
        this.apicall(event);
        break;
      case "billingPartyrules":
        this.getBillingPartyAutoComplete();
        break;
      case "FromCityaction":
        this.getFromCity();
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
            this.CnoteData = res;
            this.CnoteData.sort((a, b) => (a.Seq - b.Seq));
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
      CodeId: event.option.value.PARTY_CODE,
      CodeDesc: event.option.value.PARTYNAME
    }
    this.step1.controls['PRQ_BILLINGPARTY'].setValue(billingParty);
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
  getBillingPartyAutoComplete() {
    if (this.step1.value.PRQ_BILLINGPARTY.length > 3) {
      if (this.step1Formcontrol) {
        let rulePartyType = this.Rules.find((x) => x.code == 'PARTY' && x.paybas == this.step1.value.PAYTYP);
        if (rulePartyType.defaultvalue == "D") {
          this.step1.controls['PRQ_BILLINGPARTY'].disable();
          this.getFromCity();
          this.getToCity();
        }
        else {
          this.step1.controls['PRQ_BILLINGPARTY'].enable();
          let bLcode = this.step1Formcontrol.find((x) => x.name == 'PRQ_BILLINGPARTY');
          let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
          var req = {
            companyCode: 10065,
            custLoc: "MUMB",
            custCat: this.step1.value.PAYTYP,
            partyType: rules.defaultvalue == 'Y' ? 'CP' : ""
          }
          this.ICnoteService.cnotePost('services/billingParty', req).subscribe({
            next: (res: any) => {
              if (res) {
                this.cnoteAutoComplete = res;
                this.getBillingPartyFilter();
                this.getFromCity();
                this.getToCity();
              }
            }
          })

        }
      }
    }
  }

  getBillingPartyFilter() {
    this.filteredCnoteBilling = this.step1.controls[
      "PRQ_BILLINGPARTY"
    ].valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.Name)),
      map((Name) =>
        Name ? this._bilingGropFilter(Name) : this.cnoteAutoComplete.slice()
      )
    );
  }

  _bilingGropFilter(name: string): AutoCompleteCommon[] {
    const filterValue = name.toLowerCase();

    return this.cnoteAutoComplete.filter(
      (option) => option.CodeDesc.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCnotegropFn(Cnotegrop: AutoCompleteCommon): string {
    return Cnotegrop && Cnotegrop.CodeId ? Cnotegrop.CodeId + ":" + Cnotegrop.CodeDesc : "";
  }
  //End

  //FromCity

  getFromCity() {

    if (this.step1Formcontrol) {
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'FCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      let custCode = this.step1.value.PRQ_BILLINGPARTY == undefined ? "" : this.step1.value.PRQ_BILLINGPARTY.CodeId;
      let ContractId = this.contractDetail.find((x) => x.CustCode == custCode);
      var req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: ContractId ? ContractId.ContractId : '',
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
      let custCode = this.step1.value.PRQ_BILLINGPARTY == undefined ? "" : this.step1.value.PRQ_BILLINGPARTY.CodeId;
      let ContractId = this.contractDetail.find((x) => x.CustCode == custCode);
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'TCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      var req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: ContractId ? ContractId.ContractId : '',
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

    return Cnotegrop && Cnotegrop.PRQNO ? Cnotegrop.PRQNO : "";
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

    this.CnoteData.forEach(element => {
      if (element.name == 'FCITY' && this.Fcity) {
        element.autocomplete = 'autoFCity',
          element.filteredOptions = this.step1.controls[
            "FCITY"
          ].valueChanges.pipe(
            startWith(""),
            map((value) => (typeof value === "string" ? value : value.Name)),
            map((Name) =>
              Name ? this._cityFilter(Name, this.Fcity) : this.Fcity.slice()
            )
          );
      }
      if (element.name == 'TCITY' && this.Tcity) {
        element.autocomplete = 'autoTCity',
          element.filteredOptions = this.step1.controls[
            "TCITY"
          ].valueChanges.pipe(
            startWith(""),
            map((value) => (typeof value === "string" ? value : value.Name)),
            map((Name) =>
              Name ? this._cityFilter(Name, this.Tcity) : this.Tcity.slice()
            )
          );
      }
      if (element.name == 'DELLOC' && this.Destination) {
        element.autocomplete = 'autoDestination',
          element.filteredOptions = this.step1.controls[
            "DELLOC"
          ].valueChanges.pipe(
            startWith(""),
            map((value) => (typeof value === "string" ? value : value.Name)),
            map((Name) =>
              Name ? this._cityFilter(Name, this.Destination) : this.Destination.slice()
            )
          );
      }
      if (element.name == 'VEHICLE_NO' && this.Vehicno) {
        element.autocomplete = 'vehicleAutoComplate',
          element.filteredOptions = this.step1.controls[
            "VEHICLE_NO"
          ].valueChanges.pipe(
            startWith(""),
            map((value) => (typeof value === "string" ? value : value.Name)),
            map((Name) =>
              Name ? this._cityFilter(Name, this.Vehicno) : this.Vehicno.slice()
            )
          );
      }
    });
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

}
