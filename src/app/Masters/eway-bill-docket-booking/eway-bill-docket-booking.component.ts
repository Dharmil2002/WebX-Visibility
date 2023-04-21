import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, map, startWith } from "rxjs";
import {
  AutoCompleteCity,
  AutoCompleteCommon,
  RequestContractKeys,
} from "src/app/core/models/Cnote";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { roundNumber, WebxConvert } from "src/app/Utility/commonfunction";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
@Component({
  selector: "app-eway-bill-docket-booking",
  templateUrl: "./eway-bill-docket-booking.component.html",
})
export class EwayBillDocketBookingComponent implements OnInit {
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  RequestContractKeysDetail = new RequestContractKeys();
  EwayBillField: any;
  step1Formcontrol: any;
  step1: FormGroup;
  step2: FormGroup;
  step2Formcontrol: any;
  breadscrums = [
    {
      title: "EwayBillDocket",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ];
  Rules: any;
  InvoiceLevalrule: any;
  ServiceType: any;
  mapcityRule: any;
  Fcity: any;
  Tcity: any;
  cnoteAutoComplete: any;
  autofillflag: boolean;
  filteredCnoteBilling: Observable<any>;
  Consignor: any;
  Consignee: any;
  ConsignorCity: any;
  pinCodeDetail: any;
  ConsigneeCity: any;
  Destination: any;
  destionationNestedDate: any;
  InvoiceDetails: any;
  WeightToConsider: any;
  MaxMeasureValue: any;
  MinInvoiceValue: any;
  MaxInvoiceValue: any;
  MinInvoiceValuePerKG: any;
  MaxInvoiceValuePerKG: any;
  DefaultChargeWeight: any;
  MinChargeWeight: any;
  MaxChargeWeight: any;
  VolMeasure: any;
  EwayBillDetail: any;
  EwayBill: boolean;
  showOtherContainer: boolean;
  showOtherAppointment: boolean;
  contractDetail: any;
  ContractData: any;
  ContractId: any;
  FlagCutoffApplied: any;
  FlagHolidayApplied: any;
  FlagHolidayBooked: any;
  BasedOn1: any;
  BaseCode1: any;
  BasedOn2: any;
  BaseCode2: any;
  ContractDepth: string;
  DeliveryZone: any;
  DestDeliveryPinCode: any;
  DestDeliveryArea: any;
  contractKeysInvoke: any;
  IsDeferment: boolean;
  UseFrom: any;
  UseTo: any;
  UseTransMode: any;
  UseRateType: any;
  ChargeWeightToHighestDecimal: any;
  ProceedDuringEntry: any;
  constructor(
    private ICnoteService: CnoteService,
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private Route: Router
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.EwayBillDetail = this.Route.getCurrentNavigation()?.extras?.state.Ewddata;
      this.EwayBill = true;
      this.contractDetail = this.Route.getCurrentNavigation()?.extras?.state.contractDetail;
      this.ServiceType = this.Route.getCurrentNavigation()?.extras?.state.ServiceType;
      this.showOtherContainer = true;
      this.showOtherAppointment = true;
    }
    this.DocketBooking();

  }

  // Call the appropriate function based on the given function name
  callActionFunction(functionName: string, event: any) {
    switch (functionName) {
      case "GetCity":
        this.getFromCity();
        break;
      case "ToCity":
        this.getToCity();
        break;
      case "ConsigneeCity":
        this.getConsigneeCity();
        break;
      case "ConsignorCity":
        this.getConsignorCity();
        break;
      case "ConsignorPincode":
        this.getPincodeDetail("ConsignorPincode");
        break;
      case "Volumetric":
        this.volumetricChanged();
        break;
      case "ConsigneePinCode":
        this.getPincodeDetail("ConsigneePincode");
        break;
      case "billingPartyrules":
        this.getBillingPartyAutoComplete(event);
        break;
      case "GetDestination":
        this.GetDestination();
        break;
      case "ServiceDetails":
        this.GetInvoiceConfigurationBasedOnTransMode();
        break;
      case "InvoiceCubicWeightCalculation":
        this.InvoiceCubicWeightCalculation(event);
        break;
      case "CalculateRowLevelChargeWeight":
        this.InvoiceCubicWeightCalculation(event);
        break;
      default:
        break;
    }
  }

  getRules() {
    this.ICnoteService.getCnoteBooking(
      "services/companyWiseRules/",
      parseInt(localStorage.getItem("companyCode"))
    ).subscribe({
      next: (res: any) => {
        if (res) {
          // Set the Rules variable to the first element of the response array
          this.Rules = res[0];
          if (this.EwayBill) {
            this.step2.controls['PAYTYP'].setValue(this.EwayBillDetail[0][1].Consignor.Contract_Type);
            const codeTypes = ['FTLTYP', 'PKPDL', 'SVCTYP', 'TRN'];

            // Iterate over each form control in step1Formcontrol
            this.step1Formcontrol.forEach(item => {
              // If the form control's name is in codeTypes array, update its dropdown property with relevant data from response
              if (codeTypes.includes(item.name)) {
                item.dropdown = this.contractDetail.MASTER.filter(x => x.CodeType === item.name);
              }
            });
            this.ContractData = this.contractDetail.CONTRACT;
            if (this.ContractData) {
              this.ContractId = this.ContractData.CONTRACTID;
              this.step2.controls['TRN'].setValue(this.ContractData.DEFAULTPRODUCTSET);
              this.step2.controls['PKGS'].setValue(this.ContractData.Defaultmodeset);
              //this.step3.controls['CODDODCharged'].setValue(this.ContractData?.CODDODCharged || "");
              //this.step3.controls['CODDODTobeCollected'].setValue(this.ContractData?.CODDODCharged || "");
              //this.step3.controls['F_COD'].setValue(this.ContractData.FlagCODDODEnable == "Y" ? true : false);
              this.step2.controls['F_VOL'].setValue(this.ContractData.FlagVolumetric == "Y" ? true : false)
              this.IsDeferment = this.ContractData.FlagDeferment == "Y" ? true : false;
              // this.GetContractInvokeDependent();
              this.step2.controls['SVCTYP'].setValue(this.ServiceType);
              this.volumetricChanged();
              this.EwayBillDetailAutoFill()
              this.step2Formcontrol=this.step2Formcontrol.filter((x) => x.name == 'RSKTY').map(item => {
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
              // this.codeChanged();

            }
            this.removeField(0);
          }
          this.volumetricChanged();
          this.step2.controls['RSKTY'].setValue("C");
          // // Get the Invoice Level Contract Invoke rule and check if its default value is "Y"
          // this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
          // if (this.InvoiceLevalrule.defaultvalue != "Y") {
          //   // If the default value of the Invoice Level Contract Invoke rule is not "Y",
          //   // filter out the step3Formcontrol items with div "InvoiceDetails" or dbCodeName "INVOICE_LEVEL_CONTRACT_INVOKE"
          // }
          // if (!this.ServiceType) { this.step1.controls['F_ODA'].disable(); }

          // // Get the MAP_DLOC_PIN rule and USE_MAPPED_LOCATION_INCITY rule
          // let Rules = this.Rules.find((x) => x.code == 'MAP_DLOC_PIN')
          // let mapcityRule = this.Rules.find((x) => x.code == `USE_MAPPED_LOCATION_INCITY`)
          // this.mapcityRule = mapcityRule.defaultvalue
          // if (Rules.defaultvalue == "A") {
          //   if (mapcityRule.defaultvalue === "Y") {
          //     // If the default value of MAP_DLOC_PIN is "A" and USE_MAPPED_LOCATION_INCITY is "Y",
          //     // disable the DELLOC control in step1
          //     this.step1.controls['DELLOC'].disable();
          //   }
          // }
          // else {
          //   if (mapcityRule.defaultvalue === "Y") {
          //     // If the default value of MAP_DLOC_PIN is not "A" and USE_MAPPED_LOCATION_INCITY is "Y",
          //     // disable the DELLOC control in step1
          //     this.step1.controls['DELLOC'].disable();
          //   }

          //   let ALLOWDEFAULTINVNODECLVAL = this.Rules.find(x => x.code == 'ALLOW_DEFAULT_INVNO_DECLVAL');
          //   if (ALLOWDEFAULTINVNODECLVAL.defaultvalue == 'Y') {

          //   }
          //DKT_TAX_CONTROL_TYPE rule
          //end
          // }
        }
      },
    });
  }
  DocketBooking() {
    let reqbody = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
    };
    this.ICnoteService.cnotePost(
      "cnotefields/GetdocketFieldUsingEwayBill",
      reqbody
    ).subscribe({
      next: (res: any) => {
        if (res) {
          this.EwayBillField = res;
          this.step1 = this.step1Formgrop();
          this.step2 = this.step2Formgrop();
        }
      },
    });
  }
  step1Formgrop(): UntypedFormGroup {
    const formControls = {}; // Initialize an empty object to hold form controls
    this.step1Formcontrol = this.EwayBillField.filter((x) => x.frmgrp == "1");
    this.Consignor = this.EwayBillField.filter((x) => x.div == "Consignor");
    // get all form controls belonging to Consignee section
    this.Consignee = this.EwayBillField.filter((x) => x.div == "Consignee");
    // Filter the form data to get only the controls for step 1
    // Loop through the step 1 form controls and add them to the form group
    if (this.step1Formcontrol.length > 0) {
      this.step1Formcontrol.forEach((cnote) => {
        let validators = []; // Initialize an empty array to hold validators for this control
        if (cnote.Validation === "Required") {
          // If the control is required, add a required validator
          validators = [Validators.required];
        }

        // Add the control to the form group, using its default value (or the current date if it is a 'TodayDate' control) and any validators
        formControls[cnote.name] = this.fb.control(
          cnote.defaultvalue == "TodayDate" ? new Date() : cnote.defaultvalue,
          validators
        );
      });
      // Create and return the FormGroup, using the form controls we just created
      return this.fb.group(formControls);
    }
  }

  step2Formgrop(): UntypedFormGroup {
    this.step1Formcontrol = this.EwayBillField.filter(
      (x) => x.frmgrp == "1" && x.div != "Consignor" && x.div != "Consignee"
    );
    const formControls = {}; // Initialize an empty object to hold form controls
    this.step2Formcontrol = this.EwayBillField.filter((x) => x.frmgrp == "2"); // Filter the form data to get only the controls for step 1
    // Loop through the step 1 form controls and add them to the form group
    if (this.step2Formcontrol.length > 0) {
      this.step2Formcontrol.forEach((cnote) => {
        let validators = []; // Initialize an empty array to hold validators for this control
        if (cnote.Validation === "Required") {
          // If the control is required, add a required validator
          validators = [Validators.required];
        }

        // Add the control to the form group, using its default value (or the current date if it is a 'TodayDate' control) and any validators
        formControls[cnote.name] = this.fb.control(
          cnote.defaultvalue == "TodayDate" ? new Date() : cnote.defaultvalue,
          validators
        );
      });

      // Get all the invoice details from CnoteData
      this.InvoiceDetails = this.EwayBillField.filter((x) => x.frmgrp == '2' && x.div == 'InvoiceDetails')

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
      this.step2Formcontrol = this.EwayBillField.filter((x) => x.frmgrp == "2" && x.div != 'InvoiceDetails');
      // Create and return the FormGroup, using the form controls we just created
      return this.fb.group(formControls);
    }
  }

  getFromCity() {
    // find FCITY control
    const cityFormControl = this.step1Formcontrol.find(
      (control) => control.name === "FromCity"
    );
    // find matching rule based on FCITY control's dbCodeName
    const matchingRule = this.Rules.find(
      (rule) => rule.code === cityFormControl.dbCodeName
    );
    if (this.step1.controls["FromCity"].value.length > 2) {
      const request = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ruleValue: matchingRule.defaultvalue,
        searchText: this.step1.controls["FromCity"].value,
        docketMode: "Yes",
        ContractParty: "",
        PaymentType: "P02",
      };

      this.ICnoteService.cnotePost(
        "services/GetFromCityDetails",
        request
      ).subscribe({
        next: (response: any) => {
          this.Fcity = response.result;
          this.getCityFilter();
        },
      });
    }
  }

  getToCity() {
    if (this.step1Formcontrol) {
      // Get the TCITY control from step1Formcontrol and find the corresponding rule
      let bLcode = this.step1Formcontrol.find((x) => x.name == "ToCity");
      let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
      if (this.step1.controls["ToCity"].value.length > 2) {
        // Build the request object with necessary data
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ruleValue: rules.defaultvalue,
          searchText: this.step1.controls["ToCity"].value,
          docketMode: "Yes",
          ContractParty: "",
          PaymentType: "p02",
          FromCity:
            this.step1.controls["FromCity"].value == ""
              ? ""
              : this.step1.controls["FromCity"].value.Value,
        };

        // Call the API to get the list of destination cities
        this.ICnoteService.cnotePost(
          "services/GetToCityDetails",
          req
        ).subscribe({
          next: (res: any) => {
            // Save the response to the Tcity property and update the city filter
            this.Tcity = res.result;
            this.getCityFilter();
          },
        });
      }
    }
  }

  getBillingPartyAutoComplete(event) {
    let step = "step" + this.EwayBillField.find((x) => x.name == event).frmgrp;
    let control;
    switch (step) {
      case "step1":
        control =
          this.step1.get(event).value.Value == undefined
            ? this.step1.get(event).value
            : this.step1.get(event).value.Name == null
              ? ""
              : this.step1.get(event).value.Name;
        break;
      case "step2":
        control = this.step2.get(event).value;
        break;
    }

    let rulePartyType = this.Rules.find(
      (x) => x.code == "PARTY" && x.paybas == "P02"
    );
    if (rulePartyType.defaultvalue == "D") {
      this.step1.controls["billingParty"].disable();
    } else {
      this.step1.controls["billingParty"].enable();
      if (control.length > 3) {
        let bLcode = this.EwayBillField.find((x) => x.name == event);
        let rules = this.Rules.find((x) => x.code == bLcode.dbCodeName);
        let Defalutvalue = this.Rules.find((x) => x.code == "CUST_HRCHY");
        let CustomerType =
          event == "billingParty" ? "CP" : event == "CST_NM" ? "CN" : "CE";
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          LocCode: localStorage.getItem("Branch"),
          searchText: control,
          CustHierarchy: Defalutvalue.defaultvalue,
          PayBase: "p02",
          BookingDate: this.datePipe
            .transform(this.step1.controls["cnoteDate"].value, "d MMM y")
            .toUpperCase(),
          CustomerType: rules.defaultvalue == "Y" ? CustomerType : "",
          ContractParty:
            event == "billingParty"
              ? "BillingParty"
              : event == "Consignor"
                ? "Consignor"
                : "Consignee",
        };
        this.ICnoteService.cnotePost("services/billingParty", req).subscribe({
          next: (res: any) => {
            if (res) {
              this.cnoteAutoComplete = res;
              if (this.autofillflag == true) {
                // TODO: Implement autofill
                this.autofillflag = false;
              } else {
                this.getFromCity();
                this.getToCity();
              }
              this.getBillingPartyFilter(event);
            }
          },
        });
      }
    }
  }

  // Fetches the Consignor City based on the entered search text
  getConsignorCity() {
    if (this.step1.controls["ConsignorCity"].value.length > 2) {
      try {
        // Fetches the rules for MAP_DLOC_CITY
        let rules = this.Rules.find((x) => x.code == "MAP_DLOC_CITY");

        // Creates the request object to be sent to the API endpoint
        let req = {
          searchText: this.step1.controls["ConsignorCity"].value,
          companyCode: parseInt(localStorage.getItem("companyCode")),
          MAP_DLOC_CITY: rules.defaultvalue,
        };

        // Makes the API call to fetch the Consignor City
        this.ICnoteService.cnotePost("services/ConsignorCity", req).subscribe({
          next: (res: any) => {
            if (res) {
              this.ConsignorCity = res;
              this.getCityFilter();
            } else {
              SwalerrorMessage("error", "No Data Found", "", true);
            }
          },
        });
      } catch (err) {
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
    }
  }

  getPincodeDetail(event) {
    // Initialize the control and city variables
    let control;
    let city;

    // Switch case to handle the different scenarios
    switch (event) {
      case "ConsignorPincode":
        control = this.step1.get(event).value;
        city = this.step1.get("ConsignorCity").value;
        break;
      case "ConsigneePincode":
        control = this.step1.get(event).value;
        city = this.step1.get("ConsigneeCity").value;
        break;
    }

    // If the user has provided a valid input
    if (control.length > 1) {
      try {
        // Prepare the request object
        let req = {
          searchText: control,
          companyCode: parseInt(localStorage.getItem("companyCode")),
          city: city.Value,
        };

        // Make a POST request to fetch the details
        this.ICnoteService.cnotePost("services/getPincode", req).subscribe({
          next: (res: any) => {
            // If the response is not empty
            if (res) {
              this.pinCodeDetail = res;
              this.getCityFilter();
            }
          },
        });
      } catch (err) {
        // Handle errors gracefully
        SwalerrorMessage("error", "Please  Try Again", "", true);
      }
    }
  }
  /**
   * Gets the list of Consignee cities based on the search text entered by the user.
   * Uses the API endpoint 'services/consigneeCity'.
   */
  getConsigneeCity() {
    if (this.step1.controls["ConsigneeCity"].value.length > 2) {
      // Check if the search text entered by the user is at least 3 characters long.
      try {
        // Find the rule with code 'MAP_DLOC_CITY' in the 'Rules' array and get its default value.
        let rules = this.Rules.find((x) => x.code == "MAP_DLOC_CITY");

        // Prepare the request object.
        let req = {
          searchText: this.step1.controls["ConsigneeCity"].value, // The search text entered by the user.
          companyCode: parseInt(localStorage.getItem("companyCode")), // The company code.
          MAP_DLOC_CITY: rules.defaultvalue, // The default value of the 'MAP_DLOC_CITY' rule.
        };

        // Make a POST request to the 'services/consigneeCity' API endpoint with the request object.
        this.ICnoteService.cnotePost("services/consigneeCity", req).subscribe({
          next: (res: any) => {
            // Update the 'ConsigneeCity' array with the result returned by the API.
            this.ConsigneeCity = res.result;
            this.getCityFilter();
          },
        });
      } catch (err) {
        // Handle errors here.
      }
    }
  }

  getCityFilter() {
    // Loop through the CnoteData array to set up autocomplete options for each form field
    for (const element of this.EwayBillField) {
      const { name } = element;
      let filteredOptions: Observable<AutoCompleteCity[]>;
      let autocomplete = "";

      switch (name) {
        // Set up autocomplete options for the FCITY form field
        case "FromCity":
          if (this.Fcity) {
            autocomplete = "autoFCity";
            filteredOptions = this.step1.controls.FromCity.valueChanges.pipe(
              startWith(""),
              map((value) => (typeof value === "string" ? value : value.Name)),
              map((Name) =>
                Name ? this._cityFilter(Name, this.Fcity) : this.Fcity.slice()
              )
            );
          }
          break;
        // Set up autocomplete options for the TCITY form field
        case "ToCity":
          if (this.Tcity) {
            autocomplete = "autoTCity";
            filteredOptions = this.step1.controls.ToCity.valueChanges.pipe(
              startWith(""),
              map((value) => (typeof value === "string" ? value : value.Name)),
              map((Name) =>
                Name ? this._cityFilter(Name, this.Tcity) : this.Tcity.slice()
              )
            );
          }
        case "ConsignorCity":
          if (this.ConsignorCity) {
            autocomplete = "ConsignorCityAutoComplate";
            filteredOptions =
              this.step1.controls.ConsignorCity.valueChanges.pipe(
                startWith(""),
                map((value) =>
                  typeof value === "string" ? value : value.Name
                ),
                map((Name) =>
                  Name
                    ? this._cityFilter(Name, this.ConsignorCity)
                    : this.ConsignorCity.slice()
                )
              );
          }
          break;
        // Set up autocomplete options for the ConsignorPinCode form field
        case "ConsignorPincode":
          if (this.pinCodeDetail) {
            autocomplete = "ConsignorCityAutoComplate";
            filteredOptions =
              this.step1.controls.ConsignorPincode.valueChanges.pipe(
                startWith(""),
                map((value) =>
                  typeof value === "string" ? value : value.Name
                ),
                map((Name) =>
                  Name
                    ? this._cityFilter(Name, this.pinCodeDetail)
                    : this.pinCodeDetail.slice()
                )
              );
          }
          break;

        // Set up autocomplete options for the DELLOC form field
        case 'Destination':
          if (this.Destination) {
            autocomplete = 'autoDestination';
            filteredOptions = this.step2.controls.Destination.valueChanges.pipe(
              startWith(''),
              map((value) => (typeof value === 'string' ? value : value.Name)),
              map((Name) => Name ? this._cityFilter(Name, this.Destination) : this.Destination.slice())
            );
          }
          break;

        // Set up autocomplete options for the ConsigneePinCode form field
        case "ConsigneePincode":
          if (this.pinCodeDetail) {
            autocomplete = "ConsignorCityAutoComplate";
            filteredOptions =
              this.step1.controls.ConsigneePincode.valueChanges.pipe(
                startWith(""),
                map((value) =>
                  typeof value === "string" ? value : value.Name
                ),
                map((Name) =>
                  Name
                    ? this._cityFilter(Name, this.pinCodeDetail)
                    : this.pinCodeDetail.slice()
                )
              );
          }
          break;
        // Set up autocomplete options for the ConsigneeCity form field
        case "ConsigneeCity":
          if (this.ConsigneeCity) {
            autocomplete = "ConsigneeCityAutoComplate";
            filteredOptions =
              this.step1.controls.ConsigneeCity.valueChanges.pipe(
                startWith(""),
                map((value) =>
                  typeof value === "string" ? value : value.Name
                ),
                map((Name) =>
                  Name
                    ? this._cityFilter(Name, this.ConsigneeCity)
                    : this.ConsigneeCity.slice()
                )
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
  // Filter function for billing party autocomplete
  getBillingPartyFilter(event) {
    // Determine which step the billing party control is in
    let step = "step" + this.EwayBillField.find((x) => x.name == event).frmgrp;

    // Set filteredCnoteBilling based on which step the control is in
    switch (step) {
      case "step1":
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
    return Cnotegrop && Cnotegrop.Value
      ? Cnotegrop.Value + ":" + Cnotegrop.Name
      : "";
  }
  displayCitygropFn(Cnotegrop: AutoCompleteCity): string {
    return Cnotegrop && Cnotegrop.Value ? Cnotegrop.Value : "";
  }
  ngOnInit(): void { this.getRules() }
  //GetDestination
  GetDestination() {
    if (this.step2.controls['Destination'].value.length > 3) {
      let reqbody = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        map_dloc_pin: this.Rules.find((x) => x.code == 'MAP_DLOC_PIN').defaultvalue,
        OriginLocation: localStorage.getItem("Branch"),
        loc_level: "234",
        searchText: this.step2.controls['Destination'].value
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
  //start invoiceArray
  addField() {
    const array = {};
    const fields = this.step2.get('invoiceArray') as FormArray;

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
    const fields = this.step2.get('invoiceArray') as FormArray;

    // Only remove the form group if there are more than one
    if (fields.length > 1) {
      fields.removeAt(index);
    }
  }
  //end

  volumetricChanged() {
  console.log(this.step2.controls['F_VOL'].value);
    // Check if Volumetric is truthy (not undefined, null, false, 0, etc.)
    if (this.step2.controls['F_VOL'].value) {
      // Find the Invoice Level rule with code 'INVOICE_LEVEL_CONTRACT_INVOKE'
      this.InvoiceLevalrule = this.Rules.find((x) => x.code == 'INVOICE_LEVEL_CONTRACT_INVOKE');
      if (this.InvoiceLevalrule.defaultvalue != "Y") {
        // If the rule's default value is not 'Y', filter the step3Formcontrol and InvoiceDetails arrays
        this.step2Formcontrol = this.EwayBillField.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '2');
        this.InvoiceDetails = this.EwayBillField.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName != 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '2');
      }
      else {
        // If the rule's default value is 'Y', filter the step3Formcontrol and InvoiceDetails arrays
        this.step2Formcontrol = this.EwayBillField.filter((x) => x.div != 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '2');
        this.InvoiceDetails = this.EwayBillField.filter((x) => x.div == 'InvoiceDetails' && x.dbCodeName == 'INVOICE_LEVEL_CONTRACT_INVOKE' && x.frmgrp == '2');
      }
    }
    else {
      // If Volumetric is falsy, remove all elements from step3Formcontrol and InvoiceDetails that have a Class of 'Volumetric'
      this.step2Formcontrol = this.step2Formcontrol.filter(x => x.Class != 'Volumetric')
      this.InvoiceDetails = this.InvoiceDetails.filter(x => x.Class != 'Volumetric');
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
      contractid: this.step1.controls['billingParty'].value?.ContractId || "",
      ServiceType: this.step2.controls['SVCTYP'].value,
      TransMode: this.step2.controls['TRN'].value
    };

    // Call API to get invoice configuration
    this.ICnoteService.cnotePost('services/GetInvoiceConfigurationBasedOnTransMode', req).subscribe({
      next: (res: any) => {
        // Update form controls with received invoice details
        let invoiceDetail = res.result;
        this.InvoiceDetails = this.EwayBillField.filter((x) => x.frmgrp == '2' && x.div == 'InvoiceDetails').map(item => {
          if (item.Class === 'Volumetric') {
            item.label = invoiceDetail[0].VolRatio ? item.label + '(' + invoiceDetail[0].VolMeasure + ')' : item.label.replace(/\(.+?\)/g, '');
          }
          return item;
        });
        this.InvoiceDetails = this.EwayBillField.filter((x) => x.Class != 'Volumetric' && x.div == 'InvoiceDetails')
        this.step2.controls['CFT_RATIO'].setValue(invoiceDetail[0].VolRatio);
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
        this.GetContractInvokeDependent()

      }
    });

  }

  // INVOICE SECTION START 
  /**
   * Calculates invoice cubic weight.
   * @param {any} event - The event object.
   * @returns void
   */
  InvoiceCubicWeightCalculation(event) {
    let cftVolume = 0;
    if (this.step2.controls['F_VOL'].value) {
      // Get package dimensions and calculate volume
      let length = parseInt(event.controls.LENGTH?.value || 0);
      let breadth = parseInt(event.controls.BREADTH?.value || 0);
      let height = parseInt(event.controls.HEIGHT?.value || 0);
      let noOfPackages = parseInt(event.controls.NO_PKGS.value || 0);
      let volume = 0;

      cftVolume = length * breadth * height * WebxConvert.objectToDecimal(this.step2.controls['CFT_RATIO']?.value, 0) * WebxConvert.objectToDecimal(noOfPackages, 0);

      // Calculate volume based on selected unit of measure
      switch (this.VolMeasure) {
        case "INCHES":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step2.controls['CFT_RATIO']?.value || 0, 0) / 1728;
          break
        case "CM":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step2.controls['CFT_RATIO']?.value || 0, 0) / 27000;
          break;
        case "FEET":
          volume = length * breadth * height * WebxConvert.objectToDecimal(this.step2.controls['CFT_RATIO']?.value || 0, 0);
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
    this.step2.value.invoiceArray.forEach((x) => {
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

    this.step2.controls['TotalChargedNoofPackages'].setValue(TotalChargedNoofPackages.toFixed(2));
    this.step2.controls['CHRGWT'].setValue(TotalChargedWeight.toFixed(2));
    this.step2.controls['TotalDeclaredValue'].setValue(TotalDeclaredValue.toFixed(2));
    this.step2.controls['CFT_TOT'].setValue(CftTotal.toFixed(2));
    this.step2.controls['TotalPartQuantity'].setValue(TotalPartQuantity);
    //TotalPartQuantity calucation parts are pending 
  }
  //End

  //E-wayBillDetail
  EwayBillDetailAutoFill() {
    let fromcity = {
      Name: this.EwayBillDetail[0][1].Consignor.city || '',
      Value: this.EwayBillDetail[0][1].Consignor.city || '',
    }
    let billingparty = {
      Name: this.EwayBillDetail[0][1].Consignor.CUSTCD || '',
      Value: this.EwayBillDetail[0][1].Consignor.CUSTNM || '',
      ContractId:this.EwayBillDetail[0][1].Consignor.ContractId || ''
    }
    let ConsignorPinCode = {
      Name: this.EwayBillDetail[0][1].Consignor.city || '',
      Value: this.EwayBillDetail[0][1].Consignor.pincode || '',
    }
    this.step1.controls['FromCity'].setValue(fromcity);
    this.step1.controls['ConsignorMobNo'].setValue(this.EwayBillDetail[0][1].Consignor.MOBILENO || '');
    this.step1.controls['ConsignorTelNo'].setValue(this.EwayBillDetail[0][1].Consignor.telno || '');
    this.step1.controls['ConsignorCity'].setValue(fromcity);
    this.step1.controls['ConsignorName'].setValue(billingparty);
    this.step1.controls['billingParty'].setValue(billingparty);
    //this.step2.controls['CST_ADD'].setValue(this.EwayBillDetail[1].FromMaster.CustAddress || '');
    this.step1.controls['ConsignorPincode'].setValue(ConsignorPinCode);
    this.step1.controls['ConsignorGSTINNO'].setValue(this.EwayBillDetail[0][0].data?.fromGstin || '');
    let Tocity = {
      Name: this.EwayBillDetail[0][0].data?.toPlace || '',
      Value: this.EwayBillDetail[0][0].data?.toPlace || '',
    }
    let Consignee = {
      Name: this.EwayBillDetail[0][0].data?.toTrdName || '',
      Value: this.EwayBillDetail[0][0].data?.toTrdName || '',
    }
    let Pincode = {
      Name: this.EwayBillDetail[0][0].data?.toPlace || '',
      Value: this.EwayBillDetail[0][0].data?.toPincode || '',
    }
    this.step1.controls['ToCity'].setValue(Tocity);
    this.step1.controls['ConsigneeCity'].setValue(Tocity);
    this.step1.controls['ConsigneeName'].setValue(Consignee);
    this.step1.controls['ConsigneePincode'].setValue(Pincode);
    this.step1.controls['ConsigneeGSTINNO'].setValue(this.EwayBillDetail[0][0].data?.toGstin || '');
    this.step2.controls['TotalDeclaredValue'].setValue(this.EwayBillDetail[0][0]?.data.totalValue || 0)
    this.step2.controls['OrgLoc'].setValue(this.EwayBillDetail[0][1].Consignor.city);
    this.step1.controls['ConsigneeTelNo'].setValue(this.EwayBillDetail[1].Consginee.MOBILENO || '');
    this.step1.controls['ConsigneeMobNo'].setValue(this.EwayBillDetail[1].Consginee.telno || '');
    // this.step2.controls['Destination'].setValue(Pincode);

    this.EwayBillDetail[0][0].data.itemList.forEach(x => {
      const Ewayjson = this.fb.group({
        EWBDATE: [new Date(this.EwayBillDetail[0][0].data?.ewayBillDate).toISOString().slice(0, 10)],
        EWBEXPIRED: [new Date(this.EwayBillDetail[0][0].data?.docDate).toISOString().slice(0, 10)],
        Invoice_Product: [x.productDesc],
        NO_PKGS: [x.quantity],
        DECLVAL: [x.taxableAmount],
        HSN_CODE: [x.hsnCode],
        INVDT: [new Date(this.EwayBillDetail[0][0].data?.validUpto).toISOString().slice(0, 10)],
        INVNO: [x.docNo],
        LENGTH: [0],
        BREADTH: [0],
        HEIGHT: [0],
        ACT_WT: [0],
        CUB_WT: [0],
        EWBNO: [this.EwayBillDetail[0][0].data?.ewbNo],
        cft:[0],
        ChargedWeight:[0]
      });
      this.InvoiceCubicWeightCalculation(Ewayjson);
      (this.step2.get('invoiceArray') as FormArray).push(Ewayjson);
    });
    let noofpkg = 0
    this.step2.value.invoiceArray.forEach((d) => {
      noofpkg = noofpkg +  parseFloat(d.NO_PKGS || 0)  
    })
    this.step2.controls['TotalChargedNoofPackages'].setValue(noofpkg);
    this.GetDestinationDataCompanyWise();
    this.GetInvoiceConfigurationBasedOnTransMode();
    this.volumetricChanged();
    //let setSVCTYPE = this.step1Formcontrol.find((x) => x.name == 'SVCTYP').dropdown;
    //this.step1.controls['SVCTYP'].setValue(setSVCTYPE.find((x) => x.CodeDesc == this.ServiceType).CodeId);
  }
  //DestionationMapping
  GetDestinationDataCompanyWise() {
    if (this.mapcityRule == "Y" || this.EwayBill) {
      // Find the BL code from the step1 form control
      //let bLcode = this.step1Formcontrol.find((x) => x.name == 'DELLOC');
      // Find the rules for the BL code
      //let rules = this.Rules.find((x) => x.code.toLowerCase() == bLcode.dbCodeName.toLowerCase());

      // Create a request object with company code and city name
      var req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        City: this.step1.controls['ToCity'].value?.City_code == 0 ? this.step1.controls['ToCity'].value.Value : this.step1.controls['ToCity'].value.City_code || this.step1.controls['ToCity'].value.Value
      }

      // Call the API to get the mapped location from city name
      this.ICnoteService.cnotePost('services/GetMappedLocationFromCityName', req).subscribe({
        next: (res: any) => {
          // Set the Destination property to the response
          this.Destination = res;
          // Get the first destination auto object
          let objDelivaryAuto = this.Destination[0];
          // Set the DELLOC form control value to the destination auto object
          this.step2.controls['Destination'].setValue(objDelivaryAuto == undefined ? '' : objDelivaryAuto);
          // Get city filter
          this.getCityFilter();
          // Get detailed based on locations

        }
      })
    }
    else {
      this.GetDestination();
    }
    //this.GetDetailedBasedOnLocations();
  }

    //GetContractInvokeDependent
    GetContractInvokeDependent() {
      try {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          ServiceType: this.step2.controls['SVCTYP'].value,
          ContractID: this.step1.controls['billingParty'].value?.ContractId || "",
          ChargeType: "BKG",
          PayBase: this.step2.controls['PAYTYP'].value,
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
    this.ICnoteService.cnotePost('services/CalculatEdd', reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          let date = new Date(res.result.Date)
          this.step2.controls['EDD'].setValue(date);
         // this.step3.controls['EEDD'].setValue(date);
          this.FlagCutoffApplied = res.result.FlagCutoffApplied;
          this.FlagHolidayApplied = res.result.FlagHolidayApplied
          this.FlagHolidayBooked = res.result.FlagHolidayBooked
        }
      }
    })
  }
  Invoiceinit() {
    this.RequestContractKeysDetail.companyCode = parseInt(localStorage.getItem("companyCode"))
    this.RequestContractKeysDetail.ContractKeys.CompanyCode = parseInt(localStorage.getItem("companyCode")),
   this.RequestContractKeysDetail.ContractKeys.BasedOn1 = this.BasedOn1 ? this.BasedOn1 : '';
    this.RequestContractKeysDetail.ContractKeys.BaseCode1 = this.BaseCode1 ? this.BaseCode1 : '';
    this.RequestContractKeysDetail.ContractKeys.BasedOn2 = this.BasedOn2 ? this.BasedOn2 : '';
    this.RequestContractKeysDetail.ContractKeys.BaseCode2 = this.BaseCode2 ? this.BaseCode2 : '';
    this.RequestContractKeysDetail.ContractKeys.ChargedWeight = this.step2.controls['CHRGWT'].value ? this.step2.controls['CHRGWT'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.ContractID = this.step1.controls['billingParty'].value.ContractId;
    this.RequestContractKeysDetail.ContractKeys.DelLoc = this.step2.controls['Destination'].value.Value;
    this.RequestContractKeysDetail.ContractKeys.Depth = this.ContractDepth;
    this.RequestContractKeysDetail.ContractKeys.FromCity = this.step1.controls['FromCity'].value.Value,
      this.RequestContractKeysDetail.ContractKeys.FTLType = this.step1.controls['FTLTYP']?.value||'';
    this.RequestContractKeysDetail.ContractKeys.NoOfPkgs = this.step2.controls['TotalChargedNoofPackages'].value ? this.step2.controls['TotalChargedNoofPackages'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.Quantity = 0.00;
    this.RequestContractKeysDetail.ContractKeys.OrgnLoc = localStorage.getItem("Branch");
    this.RequestContractKeysDetail.ContractKeys.PayBase = this.step2.controls['PAYTYP'].value ? this.step2.controls['PAYTYP'].value : "";
    this.RequestContractKeysDetail.ContractKeys.ServiceType = this.step2.controls['SVCTYP'].value ? this.step2.controls['SVCTYP'].value : "";
    this.RequestContractKeysDetail.ContractKeys.ToCity = this.step1.controls['ToCity'].value.Value;
    this.RequestContractKeysDetail.ContractKeys.TransMode = this.step2.controls['TRN'].value;
    this.RequestContractKeysDetail.ContractKeys.OrderID = "01";
    this.RequestContractKeysDetail.ContractKeys.InvAmt = this.step2.controls['TotalDeclaredValue'].value ? this.step2.controls['TotalDeclaredValue'].value : '0.00';
    this.RequestContractKeysDetail.ContractKeys.DeliveryZone = this.DeliveryZone ? parseInt(this.DeliveryZone) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryPinCode = this.DestDeliveryPinCode ? parseInt(this.DestDeliveryPinCode) : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryArea = this.DestDeliveryArea ? this.DestDeliveryArea : '';
    this.RequestContractKeysDetail.ContractKeys.DocketDate = this.step1.controls['cnoteDate'].value; 
    this.RequestContractKeysDetail.ContractKeys.FlagDeferment = this.IsDeferment;
    this.RequestContractKeysDetail.ContractKeys.TRDays = this.contractKeysInvoke?.TRDays[0] || 0;
  }
}
