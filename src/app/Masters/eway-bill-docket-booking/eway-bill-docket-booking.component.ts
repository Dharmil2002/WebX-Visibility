import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, map, startWith } from "rxjs";
import { ResultchargeList } from "src/app/core/Json/OtherCharges";
import {
  AutoCompleteCity,
  AutoCompleteCommon,
  Cnote,
  Dropdown,
  prqVehicleReq,
  Radio,
  RequestContractKeys,
} from "src/app/core/models/Cnote";
import { DocketEntity, DocketGstEntity, InvoiceEntity, StateDocumentDetailEntity, ViaCityDetailEntity } from "src/app/core/models/docketModel";
import { DocketMongoDetails, InvoiceArray } from "src/app/core/models/Docketmongos";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { jsonDataServiceService } from "src/app/core/service/Utility/json-data-service.service";
import { roundNumber, WebxConvert } from "src/app/Utility/commonfunction";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
import Swal from "sweetalert2";
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
  DocketEntity = new DocketEntity();
  DocketMongoDetails = new DocketMongoDetails();
  pReqFilter: Observable<prqVehicleReq[]>;
  docketallocate = 'Alloted To';
  breadscrums = [
    {
      title: "EwayBillDocket",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ];
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
  isLinear = true;
  ContainerDetails: Cnote[];
  ContainerSize: Dropdown[];
  ContainerType: Dropdown[];
  ContainerCapacity: Dropdown[];
  prqVehicleReq: prqVehicleReq[];
  Rules: any;
  InvoiceLevalrule: any;
  ServiceType: any;
  mapcityRule: any;
  Fcity: any;
  Tcity: any;
  cnoteAutoComplete: any;
  autofillflag: boolean;
  isappointmentvisble: boolean;
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
  Vehicno: AutoCompleteCity[];
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
  summaryDetail: any;
  EwayBillDetailSummary: any;
  isMultiple: boolean = false;
  IsDocketEdit: string;
  IsQuickCompletion: string;
  PincodeZoneLocation: any;
  DPHRateType: any;
  DPHAmount: any;
  DPHRate: any;
  IsDaccReadOnly: any;
  CcmServicesData: any;
  AppointmentDetails: Cnote[];
  DocketField: any;
  gDockNo: any;
  constructor(
    private ICnoteService: CnoteService,
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private Route: Router,
    private cdr: ChangeDetectorRef,
    private IjsonDataServiceService:jsonDataServiceService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.EwayBillDetail =
        this.Route.getCurrentNavigation()?.extras?.state.Ewddata;
      this.EwayBill = true;
      this.contractDetail =
        this.Route.getCurrentNavigation()?.extras?.state.contractDetail;
      this.ServiceType =
        this.Route.getCurrentNavigation()?.extras?.state.ServiceType;
      this.showOtherContainer = true;
      this.showOtherAppointment = true;
    }
    this.GetActiveGeneralMasterCodeListByTenantId();
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
      case "Prqdetail":
        this.prqVehicle();
        break;
      case "autoFill":
        this.autoFill(event);
        break
      case "getVehicleNo":
        this.getVehicleNo();
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
      case "EWbChanged":
        this.EWbChanged();
        break;
      case "DocketValidation":
        this.DocketValidation();
        break;
      case "displayedAppointment":
        this.displayedAppointment();
        break;
      default:
        break;
    }
  }

  getRules() {
    this.ICnoteService.getNewCnoteBooking(
      "services/companyWiseRules/",
      parseInt(localStorage.getItem("companyCode"))
    ).subscribe({
      next: (res: any) => {
        if (res) {
          // Set the Rules variable to the first element of the response array
          this.Rules = res[0];
          this.step2Formcontrol = this.step2Formcontrol
            .map((item) => {
              if (item.name === "RSKTY") {
                item.dropdown = [
                  {
                    CodeId: "C",
                    CodeDesc: "Carrier's Risk",
                  },
                  {
                    CodeId: "O",
                    CodeDesc: "Owner's Risk",
                  },
                ];
              }
              return item;
            });
          if (this.ServiceType) {
            this.CNoteFieldChecked()
          }
          this.step2Formcontrol = this.step2Formcontrol.filter(
            (x) => x.div != "InvoiceSummary" && x.Class != "EWBDetails"
          );
          this.summaryDetail = this.EwayBillField.filter(
            (x) => x.div == "InvoiceSummary"
          );
          this.EwayBillDetailSummary = this.EwayBillField.filter(
            (x) => x.Class == "EWBDetails"
          );
          this.InvoiceDetails = this.EwayBillField.filter((x) => x.div == "InvoiceDetails" && x.Class != 'multiple')
          this.ContractData = this.contractDetail?.CONTRACT || '';
          if (this.EwayBill) {
            this.step2.controls["PAYTYP"].setValue(
              this.EwayBillDetail[0][1].Consignor.Contract_Type
            );
            const codeTypes = ["FTLTYP", "PKPDL", "SVCTYP", "TRN"];

            // Iterate over each form control in step1Formcontrol
            this.step1Formcontrol.forEach((item) => {
              // If the form control's name is in codeTypes array, update its dropdown property with relevant data from response
              if (codeTypes.includes(item.name)) {
                item.dropdown = this.contractDetail.MASTER.filter(
                  (x) => x.CodeType === item.name
                );
              }
            });

            if (this.ContractData) {
              this.ContractId = this.ContractData.CONTRACTID;
              this.step2.controls["TRN"].setValue(
                this.ContractData.DEFAULTPRODUCTSET
              );
              this.step2.controls["PKGS"].setValue(
                this.ContractData.Defaultmodeset
              );
              //this.step2.controls['CODDODCharged'].setValue(this.ContractData?.CODDODCharged || "");
              //this.step2.controls['CODDODTobeCollected'].setValue(this.ContractData?.CODDODCharged || "");
              //this.step2.controls['F_COD'].setValue(this.ContractData.FlagCODDODEnable == "Y" ? true : false);
              this.step2.controls["F_VOL"].setValue(
                this.ContractData.FlagVolumetric == "Y" ? true : false
              );
              this.IsDeferment =
                this.ContractData.FlagDeferment == "Y" ? true : false;
              // this.GetContractInvokeDependent();
              this.step2.controls["SVCTYP"].setValue(this.ServiceType);
              this.EwayBillDetailAutoFill();

              // this.codeChanged();
            }
            this.removeField(0);
          }
          this.step2.controls["RSKTY"].setValue("C");

        }
      },
    });
  }
  DocketBooking() {
    let reqbody = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
    };
    this.ICnoteService.cnoteNewPost(
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
    this.DocketField = this.EwayBillField.filter((x) => x.div == "DocketField");
    this.Consignor = this.EwayBillField.filter((x) => x.div == "Consignor");
    // get all form controls belonging to Consignee section
    this.Consignee = this.EwayBillField.filter((x) => x.div == "Consignee");
    // get all form controls belonging to Appointment Based Delivery section
    this.AppointmentBasedDelivery = this.EwayBillField.filter((x) => x.div == 'AppointmentBasedDelivery')
    // get all form controls belonging to Appointment Details section
    this.AppointmentDetails = this.EwayBillField.filter((x) => x.div == 'AppointmentDetails');
    // define dropdown options for certain form controls in Container Details section

    // Filter the form data to get only the controls for step 1
    // Loop through the step 1 form controls and add them to the form group
    if (this.step1Formcontrol.length > 0) {
      this.step1Formcontrol.forEach((cnote) => {
        let validators = []; // Initialize an empty array to hold validators for this control
        if (cnote.Validation === "Required") {
          // If the control is required, add a required validator
          validators = [Validators.required];
        }
        this.containorDropdown()
        // Add the control to the form group, using its default value (or the current date if it is a 'TodayDate' control) and any validators
        formControls[cnote.name] = this.fb.control(
          cnote.defaultvalue == "TodayDate" ? new Date() : cnote.defaultvalue,
          validators
        );
        if (!cnote.enable) {
          formControls[cnote.name].disable();
        }
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
        if (!cnote.enable) {
          formControls[cnote.name].disable();
        }
      });

      // Get all the invoice details from CnoteData
      this.InvoiceDetails = this.EwayBillField.filter(
        (x) => x.frmgrp == "2" && x.div == "InvoiceDetails"
      );

      // Loop through each invoice detail and create form controls with appropriate validators
      if (this.InvoiceDetails.length > 0) {
        const array = {};
        this.InvoiceDetails.forEach((Idetail) => {
          let validators = [];
          if (Idetail.Validation === "Required") {
            validators = [Validators.required];
          }
          array[Idetail.name] = this.fb.control(
            Idetail.defaultvalue == "TodayDate"
              ? new Date().toISOString().slice(0, 10)
              : Idetail.defaultvalue,
            validators
          );
        });

        // Add the array of invoice details form controls to the form group
        formControls["invoiceArray"] = this.fb.array([this.fb.group(array)]);
      }
      this.step2Formcontrol = this.EwayBillField.filter(
        (x) => x.frmgrp == "2" && x.div != "InvoiceDetails"
      );
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

      this.ICnoteService.cnoteNewPost(
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
        this.ICnoteService.cnoteNewPost(
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
        this.ICnoteService.cnoteNewPost("services/billingParty", req).subscribe({
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
        this.ICnoteService.cnoteNewPost("services/ConsignorCity", req).subscribe({
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
        this.ICnoteService.cnoteNewPost("services/getPincode", req).subscribe({
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
        this.ICnoteService.cnoteNewPost("services/consigneeCity", req).subscribe({
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
        case "Destination":
          if (this.Destination) {
            autocomplete = "autoDestination";
            filteredOptions = this.step2.controls.Destination.valueChanges.pipe(
              startWith(""),
              map((value) => (typeof value === "string" ? value : value.Name)),
              map((Name) =>
                Name
                  ? this._cityFilter(Name, this.Destination)
                  : this.Destination.slice()
              )
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
  ngOnInit(): void {
    setTimeout(() => {
      this.getRules();

    }, 4000);
    
  }

  //GetDestination
  GetDestination() {
    if (this.step2.controls["Destination"].value.length > 3) {
      let reqbody = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        map_dloc_pin: this.Rules.find((x) => x.code == "MAP_DLOC_PIN")
          .defaultvalue,
        OriginLocation: localStorage.getItem("Branch"),
        loc_level: "234",
        searchText: this.step2.controls["Destination"].value,
      };
      this.ICnoteService.cnoteNewPost(
        "services/GetDestination",
        reqbody
      ).subscribe({
        next: (res: any) => {
          if (res) {
            this.Destination = res.result;
            this.destionationNestedDate = res.result;
            this.getCityFilter();
          }
        },
      });
    }
  }
  //start invoiceArray
  addField() {
    const array = {};
    const fields = this.step2.get("invoiceArray") as FormArray;

    // Iterate through the InvoiceDetails array and create a form control for each item
    if (this.InvoiceDetails.length > 0) {
      this.InvoiceDetails.forEach((Idetail) => {
        array[Idetail.name] = this.fb.control(
          Idetail.defaultvalue == "TodayDate"
            ? new Date().toISOString().slice(0, 10)
            : Idetail.defaultvalue
        );
      });
    }

    // Add the form group to the form array
    fields.push(this.fb.group(array));
  }

  removeField(index: number) {
    const fields = this.step2.get("invoiceArray") as FormArray;

    // Only remove the form group if there are more than one
    if (fields.length > 1) {
      fields.removeAt(index);
    }
  }
  //end

  volumetricChanged() {
    // Check if Volumetric is truthy (not undefined, null, false, 0, etc.)
    if (this.step2.controls["F_VOL"].value) {
      // Find the Invoice Level rule with code 'INVOICE_LEVEL_CONTRACT_INVOKE'
      this.InvoiceLevalrule = this.Rules.find(
        (x) => x.code == "INVOICE_LEVEL_CONTRACT_INVOKE"
      );
      if (this.InvoiceLevalrule.defaultvalue != "Y") {
        // If the rule's default value is not 'Y', filter the step2Formcontrol and InvoiceDetails arrays
        this.step2Formcontrol = this.EwayBillField.filter(
          (x) =>
            x.div != "InvoiceDetails" && x.div != "InvoiceSummary" && x.Class != "EWBDetails" &&
            x.dbCodeName != "INVOICE_LEVEL_CONTRACT_INVOKE" &&
            x.frmgrp == "2"
        );
        this.summaryDetail = this.EwayBillField.filter(
          (x) => x.div == "InvoiceSummary"
        );
        this.InvoiceDetails = this.EwayBillField.filter(
          (x) =>
            x.div == "InvoiceDetails" &&
            x.dbCodeName != "INVOICE_LEVEL_CONTRACT_INVOKE" &&
            x.frmgrp == "2" && x.Class != 'multiple'
        );
        if (this.step2.value.IsMultipleEWB) {
          this.InvoiceDetails = this.EwayBillField.filter(
            (x) =>
              x.div == "InvoiceDetails" &&
              x.dbCodeName != "INVOICE_LEVEL_CONTRACT_INVOKE" &&
              x.frmgrp == "2"
          );
        }
      } else {
        // If the rule's default value is 'Y', filter the step2Formcontrol and InvoiceDetails arrays
        this.step2Formcontrol = this.EwayBillField.filter(
          (x) =>
            x.div != "InvoiceDetails" && x.div != "InvoiceSummary" && x.Class != "EWBDetails" &&
            x.dbCodeName == "INVOICE_LEVEL_CONTRACT_INVOKE" &&
            x.frmgrp == "2"
        );
        this.summaryDetail = this.EwayBillField.filter(
          (x) => x.div == "InvoiceSummary"
        );
        this.InvoiceDetails = this.EwayBillField.filter(
          (x) =>
            x.div == "InvoiceDetails" &&
            x.dbCodeName == "INVOICE_LEVEL_CONTRACT_INVOKE" &&
            x.frmgrp == "2" && x.Class != 'multiple'
        );
        if (this.step2.value.IsMultipleEWB) {
          this.InvoiceDetails = this.EwayBillField.filter(
            (x) =>
              x.div == "InvoiceDetails" &&
              x.dbCodeName != "INVOICE_LEVEL_CONTRACT_INVOKE" &&
              x.frmgrp == "2"
          );
        }
      }
    } else {
      // If Volumetric is falsy, remove all elements from step2Formcontrol and InvoiceDetails that have a Class of 'Volumetric'
      this.step2Formcontrol = this.step2Formcontrol.filter(
        (x) => x.Class != "Volumetric"
      );
      this.summaryDetail = this.summaryDetail.filter(
        (x) => x.Class != "Volumetric"
      );
      console.log(this.step2Formcontrol);
      this.InvoiceDetails = this.InvoiceDetails.filter(
        (x) => x.Class != "Volumetric"
      );
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
      contractid: this.step1.controls["billingParty"].value?.ContractId || "",
      ServiceType: this.step2.controls["SVCTYP"].value,
      TransMode: this.step2.controls["TRN"].value,
    };

    // Call API to get invoice configuration
    this.ICnoteService.cnoteNewPost(
      "services/GetInvoiceConfigurationBasedOnTransMode",
      req
    ).subscribe({
      next: (res: any) => {
        // Update form controls with received invoice details
        let invoiceDetail = res.result;
        this.InvoiceDetails = this.EwayBillField.filter(
          (x) => x.frmgrp == "2" && x.div == "InvoiceDetails" && x.Class != 'multiple'
        ).map((item) => {
          if (item.Class === "Volumetric") {
            item.label = invoiceDetail[0].VolRatio
              ? item.label + "(" + invoiceDetail[0].VolMeasure + ")"
              : item.label.replace(/\(.+?\)/g, "");
          }
          return item;
        });
        this.InvoiceDetails = this.EwayBillField.filter(
          (x) => x.Class != "Volumetric" && x.div == "InvoiceDetails" && x.Class != 'multiple'
        );
        this.step2.controls["CFT_RATIO"].setValue(invoiceDetail[0].VolRatio);
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
        this.GetContractInvokeDependent();
        this.volumetricChanged();
      },
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
    if (this.step2.controls["F_VOL"].value) {
      // Get package dimensions and calculate volume
      let length = parseInt(event.controls.LENGTH?.value || 0);
      let breadth = parseInt(event.controls.BREADTH?.value || 0);
      let height = parseInt(event.controls.HEIGHT?.value || 0);
      let noOfPackages = parseInt(event.controls.NO_PKGS.value || 0);
      let volume = 0;

      cftVolume =
        length *
        breadth *
        height *
        WebxConvert.objectToDecimal(
          this.step2.controls["CFT_RATIO"]?.value,
          0
        ) *
        WebxConvert.objectToDecimal(noOfPackages, 0);

      // Calculate volume based on selected unit of measure
      switch (this.VolMeasure) {
        case "INCHES":
          volume =
            (length *
              breadth *
              height *
              WebxConvert.objectToDecimal(
                this.step2.controls["CFT_RATIO"]?.value || 0,
                0
              )) /
            1728;
          break;
        case "CM":
          volume =
            (length *
              breadth *
              height *
              WebxConvert.objectToDecimal(
                this.step2.controls["CFT_RATIO"]?.value || 0,
                0
              )) /
            27000;
          break;
        case "FEET":
          volume =
            length *
            breadth *
            height *
            WebxConvert.objectToDecimal(
              this.step2.controls["CFT_RATIO"]?.value || 0,
              0
            );
          break;
      }

      volume = parseFloat(
        roundNumber(volume * WebxConvert.objectToDecimal(noOfPackages, 0), 2)
      );

      // Update form control values
      event.controls.CUB_WT.setValue(volume);
      event.controls.cft.setValue(cftVolume);
      event.controls.CUB_WT.updateValueAndValidity();
    } else {
    }
    this.CalculateRowLevelChargeWeight(event, true);
  }

  ///CalculateRowLevelChargeWeight()
  CalculateRowLevelChargeWeight(event, FlagCalculateInvoiceTotal) {
    let cubinWeight = parseFloat(event.controls.CUB_WT?.value || 0);
    let ActualWeight = parseFloat(event.controls.ACT_WT?.value || 0);
    switch (this.WeightToConsider) {
      case "A":
        event.controls.ChargedWeight.setValue(ActualWeight);
        break;
      case "V":
        event.controls.ChargedWeight.setValue(ActualWeight);
        break;
      default:
        event.controls.ChargedWeight.setValue(
          cubinWeight > ActualWeight ? cubinWeight : ActualWeight
        );
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
      TotalChargedNoofPackages =
        TotalChargedNoofPackages + parseFloat(x.NO_PKGS || 0);
      TotalChargedWeight =
        TotalChargedWeight + parseFloat(x.ChargedWeight || 0);
      TotalDeclaredValue = TotalDeclaredValue + parseFloat(x.DECLVAL || 0);
      if (x.CUB_WT > 0) {
        CftTotal = CftTotal + parseFloat(x.cft);
      }
      if (x.PARTQUANTITY) {
        TotalPartQuantity = TotalPartQuantity + x.PARTQUANTITY;
      }
    });

    this.step2.controls["TotalChargedNoofPackages"].setValue(
      TotalChargedNoofPackages.toFixed(2)
    );
    this.step2.controls["CHRGWT"].setValue(TotalChargedWeight.toFixed(2));
    this.step2.controls["TotalDeclaredValue"].setValue(
      TotalDeclaredValue.toFixed(2)
    );
    this.step2.controls["CFT_TOT"].setValue(CftTotal.toFixed(2));
    this.step2.controls["TotalPartQuantity"].setValue(TotalPartQuantity);
    //TotalPartQuantity calucation parts are pending
  }
  //End

  //E-wayBillDetail
  EwayBillDetailAutoFill() {
    let fromcity = {
      Name: this.EwayBillDetail[0][1].Consignor.city || "",
      Value: this.EwayBillDetail[0][1].Consignor.city || "",
    };
    let billingparty = {
      Name: this.EwayBillDetail[0][1].Consignor.CUSTNM || "",
      Value: this.EwayBillDetail[0][1].Consignor.CUSTCD || "",
      ContractId: this.EwayBillDetail[0][1].Consignor.ContractId || "",
    };
    let ConsignorPinCode = {
      Name: this.EwayBillDetail[0][1].Consignor.city || "",
      Value: this.EwayBillDetail[0][1].Consignor.pincode || "",
    };
    this.step1.controls["FromCity"].setValue(fromcity);
    this.step1.controls["ConsignorMobNo"].setValue(
      this.EwayBillDetail[0][1].Consignor.MOBILENO || ""
    );
    this.step1.controls["ConsignorTelNo"].setValue(
      this.EwayBillDetail[0][1].Consignor.telno || ""
    );
    this.step1.controls["ConsignorCity"].setValue(fromcity);
    this.step1.controls["ConsignorName"].setValue(billingparty);
    this.step1.controls["billingParty"].setValue(billingparty);
    //this.step2.controls['CST_ADD'].setValue(this.EwayBillDetail[1].FromMaster.CustAddress || '');
    this.step1.controls["ConsignorPincode"].setValue(ConsignorPinCode);
    this.step1.controls["ConsignorGSTINNO"].setValue(
      this.EwayBillDetail[0][0].data?.fromGstin || ""
    );
    this.step1.controls["ConsignorAddress"].setValue(
      this.EwayBillDetail[0][1].Consignor.CustAddress || ""
    );
    let Tocity = {
      Name: this.EwayBillDetail[0][0].data?.toPlace || "",
      Value: this.EwayBillDetail[0][0].data?.toPlace || "",
    };
    let Consignee = {
      Name: this.EwayBillDetail[1].Consginee?.CUSTNM || "",
      Value: this.EwayBillDetail[1].Consginee?.CUSTCD || "",
    };
    let Pincode = {
      Name: this.EwayBillDetail[0][0].data?.toPlace || "",
      Value: this.EwayBillDetail[0][0].data?.toPincode || "",
    };
    this.step1.controls["ToCity"].setValue(Tocity);
    this.step1.controls["ConsigneeCity"].setValue(Tocity);
    this.step1.controls["ConsigneeName"].setValue(Consignee);
    this.step1.controls["ConsigneePincode"].setValue(Pincode);
    this.step1.controls["ConsigneeGSTINNO"].setValue(
      this.EwayBillDetail[0][0].data?.toGstin || ""
    );
    this.step2.controls["TotalDeclaredValue"].setValue(
      this.EwayBillDetail[0][0]?.data.totalValue || 0
    );

    this.step1.controls["ConsigneeMobNo"].setValue(
      this.EwayBillDetail[1].Consginee.MOBILENO || ""
    );
    this.step1.controls["ConsigneeTelNo"].setValue(
      this.EwayBillDetail[1].Consginee.telno || ""
    );
    this.step1.controls["ConsigneeAddress"].setValue(
      this.EwayBillDetail[1].Consginee.CustAddress || ""
    );
    // this.step2.controls['Destination'].setValue(Pincode);
    this.step2.controls['EWBNO'].setValue(this.EwayBillDetail[0][0].data?.ewbNo || "")
    this.step2.controls['EWBDATE'].setValue(new Date(this.EwayBillDetail[0][0].data?.ewayBillDate) || new Date())
    this.step2.controls['EWBEXPIRED'].setValue(new Date(this.EwayBillDetail[0][0].data?.validUpto) || new Date())
    this.EwayBillDetail[0][0].data.itemList.forEach((x) => {
      const Ewayjson = this.fb.group({
        EWBDATE: [new Date(this.EwayBillDetail[0][0].data?.ewayBillDate).toISOString().slice(0, 10)],
        EWBEXPIRED: [new Date(this.EwayBillDetail[0][0].data?.docDate).toISOString().slice(0, 10)],
        Invoice_Product: [x.productDesc],
        NO_PKGS: [x.quantity],
        DECLVAL: [x.taxableAmount],
        HSN_CODE: [x.hsnCode],
        INVDT: [
          new Date(this.EwayBillDetail[0][0].data?.validUpto)
            .toISOString()
            .slice(0, 10),
        ],
        INVNO: [this.EwayBillDetail[0][0].data?.docNo],
        LENGTH: [0],
        BREADTH: [0],
        HEIGHT: [0],
        ACT_WT: [0],
        CUB_WT: [0],
        cft: [0],
        EWBNO: [this.EwayBillDetail[0][0].data?.ewbNo],
        ChargedWeight: [0],
      });
      (this.step2.get("invoiceArray") as FormArray).push(Ewayjson);
      this.InvoiceCubicWeightCalculation(Ewayjson);

    });
    let noofpkg = 0;
    this.step2.value.invoiceArray.forEach((d) => {
      noofpkg = noofpkg + parseFloat(d.NO_PKGS || 0);
    });
    this.step2.controls["TotalChargedNoofPackages"].setValue(noofpkg);
    this.GetDestinationDataCompanyWise();
    this.GetInvoiceConfigurationBasedOnTransMode();
    this.GetLocationDetail();
    //let setSVCTYPE = this.step1Formcontrol.find((x) => x.name == 'SVCTYP').dropdown;
    //this.step1.controls['SVCTYP'].setValue(setSVCTYPE.find((x) => x.CodeDesc == this.ServiceType).CodeId);
  }
  GetLocationDetail() {
    let req = {
      companyCode: parseInt(localStorage.getItem('companyCode')),
      locName: this.EwayBillDetail[0][1].Consignor.city
    }
    this.ICnoteService.cnoteNewPost("services/GetLocationDetails", req).subscribe({
      next: (res: any) => {
        if (res) {
          this.step2.controls["OrgLoc"].setValue(
            res.result[0].Value + ':' + res.result[0].Name
          );
        }
        else {
          SwalerrorMessage("error", "Location is Not Available in Masters", "", true);
        }
      }
    })

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
        City:
          this.step1.controls["ToCity"].value?.City_code == 0
            ? this.step1.controls["ToCity"].value.Value
            : this.step1.controls["ToCity"].value.City_code ||
            this.step1.controls["ToCity"].value.Value,
      };

      // Call the API to get the mapped location from city name
      this.ICnoteService.cnoteNewPost(
        "services/GetMappedLocationFromCityName",
        req
      ).subscribe({
        next: (res: any) => {
          // Set the Destination property to the response
          this.Destination = res;
          // Get the first destination auto object
          let objDelivaryAuto = this.Destination[0];
          // Set the DELLOC form control value to the destination auto object
          this.step2.controls["Destination"].setValue(
            objDelivaryAuto == undefined ? "" : objDelivaryAuto
          );
          // Get city filter
          this.getCityFilter();
          // Get detailed based on locations
        },
      });
    } else {
      this.GetDestination();
    }
    //this.GetDetailedBasedOnLocations();
  }

  //GetContractInvokeDependent
  GetContractInvokeDependent() {
    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ServiceType: this.step2.controls["SVCTYP"].value,
        ContractID: this.step1.controls["billingParty"].value?.ContractId || "",
        ChargeType: "BKG",
        PayBase: this.step2.controls["PAYTYP"].value,
      };
      this.ICnoteService.cnoteNewPost(
        "services/GetContractInvokeDependent",
        req
      ).subscribe({
        next: (res: any) => {
          if (res) {
            this.BasedOn1 = res.result[0]?.BasedOn1 || "";
            this.BasedOn2 = res.result[0]?.BasedOn2 || "";
            this.UseFrom = res.result[0]?.UseFrom || "";
            this.UseTo = res.result[0]?.UseTo || "";
            this.UseTransMode = res.result[0]?.UseTransMode || "";
            this.UseRateType = res.result[0]?.UseRateType || "";
            this.ChargeWeightToHighestDecimal =
              res.result[0]?.ChargeWeightToHighestDecimal || "";
            this.ContractDepth = res.result[0]?.ContractDepth || "";
            this.ProceedDuringEntry = res.result[0]?.ProceedDuringEntry || "";
            this.SetBaseCodeValues();
          }
        },
      });
    } catch (err) {
      SwalerrorMessage(
        "error",
        "Something is Wrong Please Try again Later",
        "",
        true
      );
    }
  }
  SetBaseCodeValues() {
    switch (this.BasedOn1) {
      case "SVCTYP":
        this.BaseCode1 = this.step1.controls["SVCTYP"].value;
        break;
      case "BUT":
        this.BaseCode1 = this.step1.controls["BUT"].value;
        break;
      case "NONE":
        this.BaseCode1 = "NONE";
        break;
    }
    switch (this.BasedOn2) {
      case "PROD":
        this.BaseCode2 = this.step1.controls["PROD"].value;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.controls["PKGS"].value;
        break;
      case "PKGS":
        this.BaseCode2 = this.step1.controls["PKGS"].value;
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
      EDD_TRANSIT: this.Rules.find((x) => x.code == "EDD_TRANSIT").defaultvalue,
      FLAG_CUTOFF: this.Rules.find((x) => x.code == "FLAG_CUTOFF").defaultvalue,
      EDD_NDAYS: this.Rules.find((x) => x.code == "EDD_NDAYS").defaultvalue,
      EDD_LOCAL: this.Rules.find((x) => x.code == "EDD_LOCAL").defaultvalue,
      EDD_ADD_HDAYS: this.Rules.find((x) => x.code == "EDD_ADD_HDAYS")
        .defaultvalue,
      ContractKeys: this.RequestContractKeysDetail.ContractKeys,
    };
    this.ICnoteService.cnoteNewPost("services/CalculatEdd", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          let date = new Date(res.result.Date);
          this.step2.controls["EDD"].setValue(date);
          // this.step2.controls['EEDD'].setValue(date);
          this.FlagCutoffApplied = res.result.FlagCutoffApplied;
          this.FlagHolidayApplied = res.result.FlagHolidayApplied;
          this.FlagHolidayBooked = res.result.FlagHolidayBooked;
        }
      },
    });
  }
  Invoiceinit() {
    this.RequestContractKeysDetail.companyCode = parseInt(
      localStorage.getItem("companyCode")
    );
    (this.RequestContractKeysDetail.ContractKeys.CompanyCode = parseInt(
      localStorage.getItem("companyCode")
    )),
      (this.RequestContractKeysDetail.ContractKeys.BasedOn1 = this.BasedOn1
        ? this.BasedOn1
        : "");
    this.RequestContractKeysDetail.ContractKeys.BaseCode1 = this.BaseCode1
      ? this.BaseCode1
      : "";
    this.RequestContractKeysDetail.ContractKeys.BasedOn2 = this.BasedOn2
      ? this.BasedOn2
      : "";
    this.RequestContractKeysDetail.ContractKeys.BaseCode2 = this.BaseCode2
      ? this.BaseCode2
      : "";
    this.RequestContractKeysDetail.ContractKeys.ChargedWeight = this.step2
      .controls["CHRGWT"].value
      ? this.step2.controls["CHRGWT"].value
      : "0.00";
    this.RequestContractKeysDetail.ContractKeys.ContractID =
      this.step1.controls["billingParty"].value.ContractId;
    this.RequestContractKeysDetail.ContractKeys.DelLoc =
      this.step2.controls["Destination"].value.Value;
    this.RequestContractKeysDetail.ContractKeys.Depth = this.ContractDepth;
    (this.RequestContractKeysDetail.ContractKeys.FromCity =
      this.step1.controls["FromCity"].value.Value),
      (this.RequestContractKeysDetail.ContractKeys.FTLType =
        this.step1.controls["FTLTYP"]?.value || "");
    this.RequestContractKeysDetail.ContractKeys.NoOfPkgs = this.step2.controls[
      "TotalChargedNoofPackages"
    ].value
      ? this.step2.controls["TotalChargedNoofPackages"].value
      : "0.00";
    this.RequestContractKeysDetail.ContractKeys.Quantity = 0.0;
    this.RequestContractKeysDetail.ContractKeys.OrgnLoc =
      localStorage.getItem("Branch");
    this.RequestContractKeysDetail.ContractKeys.PayBase = this.step2.controls[
      "PAYTYP"
    ].value
      ? this.step2.controls["PAYTYP"].value
      : "";
    this.RequestContractKeysDetail.ContractKeys.ServiceType = this.step2
      .controls["SVCTYP"].value
      ? this.step2.controls["SVCTYP"].value
      : "";
    this.RequestContractKeysDetail.ContractKeys.ToCity =
      this.step1.controls["ToCity"].value.Value;
    this.RequestContractKeysDetail.ContractKeys.TransMode =
      this.step2.controls["TRN"].value;
    this.RequestContractKeysDetail.ContractKeys.OrderID = "01";
    this.RequestContractKeysDetail.ContractKeys.InvAmt = this.step2.controls[
      "TotalDeclaredValue"
    ].value
      ? this.step2.controls["TotalDeclaredValue"].value
      : "0.00";
    this.RequestContractKeysDetail.ContractKeys.DeliveryZone = this.DeliveryZone
      ? parseInt(this.DeliveryZone)
      : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryPinCode = this
      .DestDeliveryPinCode
      ? parseInt(this.DestDeliveryPinCode)
      : 0;
    this.RequestContractKeysDetail.ContractKeys.DestDeliveryArea = this
      .DestDeliveryArea
      ? this.DestDeliveryArea
      : "";
    this.RequestContractKeysDetail.ContractKeys.DocketDate =
      this.step1.controls["cnoteDate"].value;
    this.RequestContractKeysDetail.ContractKeys.FlagDeferment =
      this.IsDeferment;
    this.RequestContractKeysDetail.ContractKeys.TRDays =
      this.contractKeysInvoke?.TRDays[0] || 0;
  }
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
  EWbChanged() {
    if (this.step2.value.IsMultipleEWB) {
      this.EwayBillDetailSummary = this.EwayBillDetailSummary.filter((x) => x.div != 'EWB');
      this.InvoiceDetails = this.EwayBillField.filter((x) => x.Class == 'multiple' || x.div == 'InvoiceDetails');
      this.isMultiple = true;
    }
    else {
      this.EwayBillDetailSummary = this.EwayBillField.filter(
        (x) => x.Class == "EWBDetails"
      );
      this.InvoiceDetails = this.EwayBillField.filter((x) => x.div == "InvoiceDetails" && x.Class != 'multiple');
      this.isMultiple = false;
    }
  }
  CNoteFieldChecked() {
    let ServiceType = this.step2Formcontrol.filter((x) => x.name == 'SVCTYP')[0].dropdown.filter((x) => x.CodeId == this.ServiceType)[0].CodeDesc
    if (ServiceType == 'FTL') {
      const excludedValues = ['DKTNO', 'ContainerDetails', 'AppointmentBasedDelivery'];
      this.EwayBillField = this.EwayBillField.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.showOtherContainer = false;
      this.showOtherAppointment = false;
    }
    else if (ServiceType == 'LTL') {
      const excludedValues = ['DKTNO', 'PRQ', 'IsMarketVehicle', 'F_ODA', 'F_LOCAL', 'VEHICLE_NO', 'F_MDEL', 'F_MPKP', 'SRCDKT'];
      this.EwayBillField = this.EwayBillField.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.containorDropdown();
      this.showOtherContainer = true;
      this.showOtherAppointment = true;
    }
    else if (ServiceType == 'FCL') {
      const excludedValues = ['F_LOCAL', 'VEHICLE_NO', 'F_MDEL', 'F_MPKP', 'SRCDKT', 'AppointmentBasedDelivery'];
      this.EwayBillField = this.EwayBillField.filter((x) => !excludedValues.includes(x.name) && !excludedValues.includes(x.div));
      this.showOtherAppointment = false;
    }
  }
  //displayedAppointment
  displayedAppointment() {
    this.isappointmentvisble = this.step1.controls['IsAppointmentBasedDelivery'].value == 'Y' ? true : false;
    if (this.isappointmentvisble) {
      this.AppointmentDetails.forEach((x) => {
        this.step1.controls[x.name].setValidators(Validators.required)
        this.step1.controls[x.name].updateValueAndValidity()
      })
    }
    else {
      this.AppointmentDetails.forEach((x) => {
        this.step1.controls[x.name].clearValidators()
        this.step1.controls[x.name].updateValueAndValidity()
      })
    }
  }
  // Function to retrieve PRQ vehicle request
  prqVehicle() {
    // Check if PRQ value length is greater than 1
    if (this.step2.controls['PRQ'].value.length > 1) {
      // Define request parameters
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        BranchCode: localStorage.getItem("Branch"),
        SearchText: this.step2.controls['PRQ'].value
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
    this.pReqFilter = this.step2.controls["PRQ"].valueChanges.pipe(
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


  autoFill(event) {
    //VehicleAutoFill
    let VehicleNo = {
      Value: event.option.value.VehicleNo,
      Name: event.option.value.VehicleNo,
      Division: ""
    }
    this.step2.controls['VEHICLE_NO'].setValue(VehicleNo);
    //end
    //Billing PartyAuto
    let billingParty = {
      Value: event.option.value.PARTY_CODE,
      Name: event.option.value.PARTYNAME
    }
    this.step1.controls['billingParty'].setValue(billingParty);
    this.autofillflag = true
    //this.getBillingPartyAutoComplete('PRQ_BILLINGPARTY')
    //end
    //consginer
    let consginer = {
      Value: event.option.value.CSGNCD,
      Name: event.option.value.CSGNNM
    }
    this.step1.controls['ConsignorName'].setValue(consginer);
    //
    //address
    this.step1.controls['ConsignorAddress'].setValue(event.option.value.CSGNADDR);
    //end
    //telephone
    this.step1.controls['ConsignorTelNo'].setValue(event.option.value.CSGNTeleNo);
    //end
    //FromCity
    let FromCity = {
      Value: event.option.value.FROMCITY,
      Name: event.option.value.FROMCITY,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['FromCity'].setValue(FromCity);
    //end
    //ToCity
    let toCity = {
      Value: event.option.value.TOCITY,
      Name: event.option.value.TOCITY,
      LOCATIONS: "",
      CITY_CODE: "",
    }
    this.step1.controls['ToCity'].setValue(toCity);
    //end
    //Paybas
    this.step2.controls['PAYTYP'].setValue(event.option.value.Paybas == null ? this.step1.controls['PAYTYP'].value : event.option.value.Paybas);
    //end

    //FTLTYP
    this.step2.controls['SVCTYP'].setValue(event.option.value.FTLValue == null ? this.step1.controls['SVCTYP'].value : event.option.value.FTLValue);
    //end

    //Road
    this.step2.controls['TRN'].setValue(event.option.value.TransModeValue == null ? this.step1.controls['TRN'].value : event.option.value.TransModeValue);
    //end

    //Destination
    this.GetDestinationDataCompanyWise();
    //end

    //PKGS
    this.step2.controls['PKGS'].setValue(event.option.value.pkgsty == null ? this.step1.controls['PKGS'].value : event.option.value.pkgsty)
    //end

    //PICKUPDELIVERY
    // this.step2.controls['PKPDL'].setValue(event.option.value.pkp_dly == null ? this.step1.controls['PKPDL'].value : event.option.value.pkp_dly);
    //end

    //PROD
    // this.step2.controls['PROD'].setValue(event.option.value.prodcd == null ? this.step1.controls['PROD'].value : event.option.value.prodcd);
    //end
    //ConsigneeCST_NM
    let ConsigneeCST_NM = {
      Name: event.option.value.CSGENM,
      Value: event.option.value.CSGECD,
    }
    this.step1.controls['ConsigneeName'].setValue(ConsigneeCST_NM);
    //end

    //ConsigneeCST_ADD
    this.step1.controls['ConsigneeAddress'].setValue(event.option.value.CSGEADDR);
    //end
    //ConsigneeCST_PHONE
    this.step1.controls['ConsigneeTelNo'].setValue(event.option.value.CSGETeleNo);
    //end

    //step 3 
    const invoiceArray = this.step2.value.invoiceArray.map(x => ({
      ...x,
      ACT_WT: event.option.value.ATUWT || x.ACT_WT,
      NO_PKGS: event.option.value.PKGSNO || x.NO_PKGS
    }));
    this.step2.get('invoiceArray').setValue(invoiceArray);
    this.cdr.detectChanges();
    this.CalculateInvoiceTotal();
    //

    //call api GetPrqInvoiceList
    this.GetPrqInvoiceList();
    //end

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

  //GetPrqInvoiceList
  GetPrqInvoiceList() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      PrqNumber: this.step2.controls['PRQ'].value.PRQNO
    }

    this.ICnoteService.cnoteNewPost('services/GetPrqInvoiceList', req).subscribe(
      {
        next: (res: any) => {
          let prqinvoiceDetail = res.result;
          this.step2.get('invoiceArray').setValue(
            this.step2.value.invoiceArray.map(x => ({ ...x, INVDT: prqinvoiceDetail[0].InvoiceDate ? new Date(prqinvoiceDetail[0].InvoiceDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) }))
          );
          this.step2.controls['CHRGWT'].setValue(prqinvoiceDetail[0].ChargedWeight);
        }
      })
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
            // If not present, get Cnote controls
            this.DocketBooking();
         
        },
        error:(err)=>{
          this.DocketBooking();
        }
      })
    }
    catch (err) {
      // Handle error
    }
  }

    Onsubmit() {
      if (this.IsDocketEdit == "Y") {
  
      }
      else if (this.IsQuickCompletion == "Y") {
  
      }
      else {
        this.DocketEntity.ContractId = this.step1.controls['billingParty']?.value.ContractId || "";
        this.DocketEntity.FromCity = this.step1.controls['FromCity']?.value.Value || '';
        this.DocketEntity.ToCity = this.step1.controls['ToCity']?.value.Value || '';
        this.DocketEntity.Destination = this.step1.controls['Destination']?.value.Value || '';
        this.DocketEntity.PrqNumber = this.step1.controls['PRQ']?.value.PRQNO || '';
        this.DocketEntity.DocketNumber = this.step1.controls['DKTNO']?.value || '';
        this.DocketEntity.DocketDate = this.step1.controls['cnoteDate']?.value || new Date();
        this.DocketEntity.PackagingType = this.step2.controls['PKGS']?.value || '';
        this.DocketEntity.ProductType = this.step2.controls['TRN']?.value || '';
        this.DocketEntity.ServiceType = this.step2.controls['SVCTYP']?.value || '';
        this.DocketEntity.TransportMode = this.step2.controls['TRN']?.value || '';
        this.DocketEntity.FtlType = this.step2.controls['FTLTYP']?.value || '';
        this.DocketEntity.IsMarketVehicle = this.step1.controls['IsMarketVehicle']?.value || null;
        this.DocketEntity.VehicleNo = this.step1.controls['VEHICLE_NO']?.value || '';
        this.DocketEntity.IsOda = this.step2.controls['ODA']?.value || null;
        this.DocketEntity.IsLocalCNote = this.step2.controls['Local']?.value || null;
        this.DocketEntity.Division = this.step2.controls['DIV']?.value || ''
        this.DocketEntity.SpecialInstructions = this.step2.controls['RMRK']?.value || ''
        this.DocketEntity.BusinessType = this.step2.controls['BUT']?.value || ''
        this.DocketEntity.IsMutidelivery = this.step1.controls['F_MDEL']?.value || null;
        this.DocketEntity.IsMutipickup = this.step1.controls['F_MPKP']?.value || null;
        this.DocketEntity.SourceCNote = this.step1.controls['SRCDKT']?.value || '';
        this.DocketEntity.ConsignorCode = this.step1.controls['ConsignorName']?.value.Value || '';
        this.DocketEntity.ConsignorName = this.step1.controls['ConsignorName']?.value.Name || '';
        this.DocketEntity.ConsignorCity = this.step1.controls['ConsignorCity']?.value.Value || '';
        this.DocketEntity.ConsignorPinCode = this.step1.controls['ConsignorPinCode']?.value.Value || '';
        this.DocketEntity.ConsignorTelephoneNo = this.step1.controls['ConsignorTelNo']?.value || '';
        this.DocketEntity.ConsignorMobileNo = this.step1.controls['ConsignorMobNo']?.value || '';
        this.DocketEntity.IsConsignorFromMasterOrWalkin = this.step1.controls['IsConsignorFromMasterOrWalkin']?.value || null;
        this.DocketEntity.ConsigneeName = this.step1.controls['ConsigneeName']?.value.Name || '';
        this.DocketEntity.ConsigneeCity = this.step1.controls['ConsigneeCity']?.value.Value || '';
        this.DocketEntity.ConsigneeGstin = this.step1.controls['ConsigneeGSTINNO']?.value || '';
        this.DocketEntity.ConsigneeMobileNo = this.step1.controls['ConsigneeMobNo']?.value || '';
        this.DocketEntity.ConsigneeEmail = this.step1.controls['CST_EMAIL']?.value || '';
        this.DocketEntity.ConsigneeTinNumber = this.step1.controls['CST_TIN']?.value || '';
        this.DocketEntity.ConsigneeCstNumber = this.step1.controls['CST_CST']?.value || '';
        this.DocketEntity.ConsigneeTelephoneNo = this.step1.controls['ConsigneeTelNo']?.value || '';
        this.DocketEntity.ConsigneePinCode = this.step1.controls['ConsigneePinCode']?.value.Value || '';
        this.DocketEntity.ConsigneeCity = this.step1.controls['ConsigneeCity']?.value.Value || '';
        this.DocketEntity.ConsigneeAddress = this.step1.controls['ConsigneeAddress']?.value || '';
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
        this.DocketEntity.IsVolumetric = this.step2.controls['F_VOL']?.value || null;
        this.DocketEntity.CftTotal = this.step2.controls['CFT_TOT']?.value || 0;
        this.DocketEntity.VolRatio = this.step2.controls['CFT_RATIO']?.value || 0;
        this.DocketEntity.TotalChargedWeight = this.step2.controls['CHRGWT']?.value || 0;
        this.DocketEntity.TotalChargedNoofPackages = this.step2.controls['TotalChargedNoofPackages']?.value || 0;
        this.DocketEntity.TotalDeclaredValue = this.step2.controls['TotalDeclaredValue']?.value || 0;
        this.DocketEntity.TotalActualWeight = this.step2.value.invoiceArray.reduce((total, item) => total + item.ActualWeight, 0);
        this.DocketEntity.ChargedKM = this.step2.controls['ChargedKM']?.value || 0;
        this.DocketEntity.TotalPartQuantity = this.step2.controls['TotalPartQuantity']?.value || 0;
        this.DocketEntity.EddDate = this.step2.controls['EDD']?.value || new Date();
        let newInvoicesList: InvoiceEntity[] = [];
  
        this.step2.value.invoiceArray.forEach(z => {
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
        this.DocketEntity.DocketOtherCharges = ResultchargeList;
        this.DocketEntity.FOVCalculated = this.step2.controls['FOVCalculated']?.value || 0;
        this.DocketEntity.FOVCharged = this.step2.controls['FOVCharged']?.value || 0;
        this.DocketEntity.FOVRate = this.step2.controls['FOVRate']?.value || 0;
        this.DocketEntity.FreightRateType = this.step2.controls['FreightRateType']?.value || '';
        this.DocketEntity.DiscountRate = this.step2.controls['DiscountRate']?.value || 0;
        this.DocketEntity.DiscountAmount = this.step2.controls['DiscountAmount']?.value || 0;
        this.DocketEntity.EeddDate = this.step2.controls['EEDD']?.value || '';
        this.DocketEntity.CODDODCharged = this.step2.controls['CODDODCharged']?.value || 0;
        this.DocketEntity.CODDODTobeCollected = this.step2.controls['CODDODTobeCollected']?.value || 0;
        this.DocketEntity.IsCodDod = this.step2.controls['F_COD']?.value || null;
        this.DocketEntity.BasedOn1 = this.BaseCode1 ? this.BaseCode1 : '';
        this.DocketEntity.BasedOn2 = this.BasedOn2 ? this.BasedOn2 : '';
        this.DocketEntity.UseFrom = this.UseFrom ? this.UseFrom : '';
        this.DocketEntity.Origin = this.step2.controls['OrgLoc']?.value.split(':')[0]||'MUMB';
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
        this.DocketEntity.EntryBy = localStorage.getItem('Username');
        this.DocketEntity.CompanyCode = parseInt(localStorage.getItem("companyCode"))
        this.DocketEntity.IsConsigneeFromMasterOrWalkin = this.step2.controls['IsConsigneeFromMasterOrWalkin']?.value || '';
        this.DocketEntity.ConsigneeCode = '8888'//this.step1.controls['ConsigneeName']?.value.Value || ''
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
        if (this.step2.value.BcSeries != null) {
          for (const item of this.step2.value.BcSeries) {
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
        if (this.step2.value.barcodearray != null) {
          for (const item of this.step2.value.barcodearray) {
            if (!!item.BarCode) {
              this.DocketEntity.BcSeriess.push({
                BarCode: item.BarCode
              });
            }
          }
        }
        this.DocketEntity.CHRGDESC1 = this.step2.controls['CHRG_DESC1']?.value || '';
        this.DocketEntity.CHRGDESC2 = this.step2.controls['CHRG_DESC2']?.value || '';
        this.DocketEntity.CHRGDESC3 = this.step2.controls['CHRG_DESC3']?.value || '';
        this.DocketEntity.CHRGDESC4 = this.step2.controls['CHRG_DESC4']?.value || '';
        this.DocketEntity.DPHRateType = this.DPHRateType ? this.DPHRateType : '';
        this.DocketEntity.DPHRate = this.DPHRate ? this.DPHRate : 0;
        this.DocketEntity.DPHAmount = this.DPHAmount ? this.DPHAmount : 0;
        this.DocketEntity.PaymentType = this.step2.controls['PAYTYP'].value
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
        this.DocketEntity.ConsignorAddress = this.step2.controls['ConsignorAddress']?.value;
        this.DocketEntity.ConsignorGstin = this.step2.controls['ConsignorGSTINNO']?.value;
        this.DocketEntity.ConsignorTinNumber = this.step1.controls['ConsignorTinNumber']?.value || '';
        this.DocketEntity.ConsignorCstNumber = this.step1.controls['ConsignorCstNumber']?.value || '';
        this.DocketEntity.ConsignorEmail = this.step1.controls['ConsignorEmail']?.value || '';
        this.DocketEntity.ConsignorEmail = this.step1.controls['ConsignorEmail']?.value || '';
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
        this.ICnoteService.cnoteNewPost('services/BookDocket', this.DocketEntity).subscribe({
          next: (res: any) => {
            this.gDockNo= res.result[0].DocketNumber
            Swal.fire({
              icon:"success",
              title:"DocketNo:" + res.result[0].DocketNumber,
              html: "",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'DocketDetails',  
              cancelButtonText: 'Done'
            }).then((result)=>{
             if(result.value){
               this.ExportJson();
             }
             
            })
          }
        })
  
  
      }
  
  
    }
  




  containorDropdown(){
    const dropdowns = {
      'ContainerSize1': this.ContainerSize,
      'ContainerSize2': this.ContainerSize,
      'ContainerType': this.ContainerType,
      'ContainerCapacity': this.ContainerCapacity
    };
    // get all form controls belonging to Container Details section
    // and add dropdown options to applicable controls
    this.ContainerDetails = this.EwayBillField.filter((x) => x.div == 'ContainerDetails').map(item => {
      if (dropdowns.hasOwnProperty(item.name)) {
        item.dropdown = dropdowns[item.name];
      }
      return item;
    });
  }
  ExportJson(){
  let ewayBillJsonDetail={
     "DocketNumber": this.gDockNo,
     "DocketDate":this.DocketEntity.DocketDate,
     "Billing Party":this.DocketEntity.BillingPartys,
     "From City":this.DocketEntity.FromCity,
     "To City":this.DocketEntity.ToCity,
     "Consignor Name":this.DocketEntity.ConsignorName,
     "Consignor GSTIN No":this.DocketEntity.ConsignorGstin,
     "Consignor City":this.DocketEntity.ConsignorCity,
     "Consignor PinCode":this.DocketEntity.ConsignorPinCode,
     "Consignor TelephoneNo":this.DocketEntity.ConsigneeTelephoneNo,
     "Consignor MobileNo":this.DocketEntity.ConsignorMobileNo,
     "Consignor Address":this.DocketEntity.ConsignorAddress,
     "Consignee Name":this.DocketEntity.ConsigneeName,
     "Consignee GSTIN No":this.DocketEntity.ConsigneeGstin,
     "Consignee City":this.DocketEntity.ConsigneeCity,
     "Consignee PinCode":this.DocketEntity.ConsigneePinCode,
     "Consignee TelephoneNo":this.DocketEntity.ConsigneeTelephoneNo,
     "Consignee MobileNo":this.DocketEntity.ConsigneeMobileNo,
     "Consignee Address":this.DocketEntity.ConsigneeAddress,
     "Booking Branch":this.DocketEntity.Origin,
     "Destination":this.DocketEntity.Destination,
     "Payment Type":this.DocketEntity.PaymentType,
     "Service Type":this.DocketEntity.ServiceType,
     "Local":this.DocketEntity.IsLocalCNote,
     "Oda":this.DocketEntity.IsOda,
     "RiskType":this.DocketEntity.RiskType,
     "Packaging Type":this.DocketEntity.PackagingType,
     "Product":this.DocketField.prod,
     "PRQNO":this.DocketEntity.PrqNumber,
     "Is Market Vehicle":this.DocketEntity.IsMarketVehicle,
     "Vehicle No":this.DocketEntity.VehicleNo,
     "Source Cnote":this.DocketEntity.SourceCNote,
     "CFT Ration":this.DocketEntity.VolRatio,
     "CFT Total":this.DocketEntity.CftTotal,
     "Charged Weight":this.DocketEntity.TotalChargedWeight,
     "EDD":this.DocketEntity.EddDate,
     "Volumetic":this.DocketEntity.IsVolumetric,
     "Total Declared Value":this.DocketEntity.TotalDeclaredValue,
     "Charged No of Pkg":this.DocketEntity.TotalChargedNoofPackages,
     "Total Part Quantity":this.DocketEntity.TotalPartQuantity,
     "Invoice Details":  this.DocketEntity.Invoices

  }
 //this.IjsonDataServiceService.exportData(ewayBillJsonDetail); 
  }
}
