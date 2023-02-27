import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AutoCompleteCity, AutoCompleteCommon as AutoCompleteCommon, AutocompleteField, Cnote, ContractDetailList, Rules } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  filteredCity: Observable<AutoCompleteCity[]>;
  filteredCnoteBilling: Observable<AutoCompleteCommon[]>;
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
    }
    this.getContractDetail();
  }

  ngOnInit(): void {

  }

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
        formControls[cnote.name] = this.fb.control(cnote.defaultvalue, validators);
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
   // debugger;
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
    //debugger;
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
          this.getBillingPartyAutoComplete();
        }
      }
    })
  }
  getContractDetail() {
    //debugger;
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

    if (this.step1Formcontrol) {
      let rulePartyType = this.Rules.find((x) => x.code == 'PARTY' && x.paybas == this.step1.value.PAYTYP);
      if (rulePartyType.defaultvalue == "D") {
        this.step1.controls['PRQ_BILLINGPARTY'].disable();
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
            }
          }
        })

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
    return Cnotegrop && Cnotegrop.CodeId ? Cnotegrop.CodeDesc : "";
  }
  //End

  //FromCity
  getFromCity() {
    //debugger;
    if (this.step1Formcontrol) {
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'FCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      let custCode = this.step1.value.PRQ_BILLINGPARTY == "" ? "" : this.step1.value.PRQ_BILLINGPARTY.CodeId;
      let ContractId = this.contractDetail.find((x) => x.CustCode == custCode);
      var req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: ContractId.ContractId,
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
    //debugger;
    if (this.step1Formcontrol) {
      let custCode = this.step1.value.PRQ_BILLINGPARTY == "" ? "" : this.step1.value.PRQ_BILLINGPARTY.CodeId;
      let ContractId = this.contractDetail.find((x) => x.CustCode == custCode);
      let bLcode = this.step1Formcontrol.find((x) => x.name == 'TCITY');
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      var req = {
        companyCode: 10065,
        map_dloc_city: rules.defaultvalue,
        DocketMode: "Yes",
        ContractParty: ContractId.ContractId,
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
  //CityApi
  getCityFilter() {

    this.CnoteData.forEach(element => {
      if (element.name == 'FCITY' || element.name == 'TCITY') {
        if (element.name == 'FCITY') {
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
        else if (element.name == 'TCITY') {
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
