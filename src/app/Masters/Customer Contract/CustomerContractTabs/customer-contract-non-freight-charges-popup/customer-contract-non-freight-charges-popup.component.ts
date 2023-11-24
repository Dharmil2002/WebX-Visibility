import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ContractNonFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/NonFreightMatrix-control";

@Component({
  selector: "app-customer-contract-non-freight-charges-popup",
  templateUrl: "./customer-contract-non-freight-charges-popup.component.html",
})
export class CustomerContractNonFreightChargesPopupComponent implements OnInit {
  columnHeader = {
    From: {
      Title: "From",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    To: {
      Title: "To",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    Rate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MinValue: {
      Title: "Min Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MaxValue: {
      Title: "Max Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  staticField = ["From", "To", "rateType", "Rate", "MinValue", "MaxValue"];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  addFlag = true;
  linkArray = [];
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  ContractNonFreightMatrixControls: ContractNonFreightMatrixControl;
  jsonControlArrayNonFreightCharges: any;
  CurrentAccessList: any;
  NonFreightChargesForm: any;
  AlljsonControlArrayNonFreightCharges: any;
  jsonControlArrayNonFreightMatrix: any;
  NonFreightMatrixForm: any;
  tableLoad = true;
  isLoad = false;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  tableData = [
    {
      From: "From",
      To: "To",
      rateType: "Rate Type",
      Rate: "Rate",
      MinValue: "Min Value",
      MaxValue: "Max Value",
      actions: ['Edit', 'Remove']
    },
    {
      From: "From",
      To: "To",
      rateType: "Rate Type",
      Rate: "Rate",
      MinValue: "Min Value",
      MaxValue: "Max Value",
      actions: ['Edit', 'Remove']
    },
    {
      From: "From",
      To: "To",
      rateType: "Rate Type",
      Rate: "Rate",
      MinValue: "Min Value",
      MaxValue: "Max Value",
      actions: ['Edit', 'Remove']
    },
    {
      From: "From",
      To: "To",
      rateType: "Rate Type",
      Rate: "Rate",
      MinValue: "Min Value",
      MaxValue: "Max Value",
      actions: ['Edit', 'Remove']
    },
    {
      From: "From",
      To: "To",
      rateType: "Rate Type",
      Rate: "Rate",
      MinValue: "Min Value",
      MaxValue: "Max Value",
      actions: ['Edit', 'Remove']
    },
  ];
  PinCodeList: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  StateList: any;
  EventButton = {
    functionName: "AddNewButtonEvent",
    name: "Add New",
    iconName: "add",
  };
  constructor(
    private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    public dialogRef: MatDialogRef<CustomerContractNonFreightChargesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
    this.getAllMastersData()
  }

  initializeFormControl() {
    this.ContractNonFreightMatrixControls =
      new ContractNonFreightMatrixControl();
    this.jsonControlArrayNonFreightMatrix =
      this.ContractNonFreightMatrixControls.getContractNonFreightMatrixControlControls();
    this.NonFreightMatrixForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayNonFreightMatrix,
    ]);
    // this.AlljsonControlArrayNonFreightCharges = this.jsonControlArrayNonFreightCharges;
  }
  close(){
    this.dialogRef.close()
  }
  async getAllMastersData() {
    try {
      const stateReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "state_master",
      };
      const pincodeReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      this.StateList = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
      this.PinCodeList = await this.masterService.masterPost('generic/get', pincodeReqBody).toPromise();
      this.PinCodeList.data = this.ObjcontractMethods.GetMergedData(this.PinCodeList, this.StateList, 'ST')
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  handleMenuItemClick(data) {
    // this.FillMatrixForAll(data);
    console.log('data' ,data)
  }
  SetOptions(event) {
    let fieldName = event.field.name;
    const fieldsToSearch = ["PIN", "CT", "STNM", "ZN"];
    const search = this.NonFreightMatrixForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      data = this.ObjcontractMethods.GetGenericMappedAria(
        this.PinCodeList.data,
        search,
        fieldsToSearch
      );
      this.filter.Filter(
        this.jsonControlArrayNonFreightMatrix,
        this.NonFreightMatrixForm,
        data,
        fieldName,
        true
      );
    }
  }
}
