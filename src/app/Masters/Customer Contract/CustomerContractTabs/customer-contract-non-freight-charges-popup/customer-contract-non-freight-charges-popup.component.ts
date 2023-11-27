import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ContractNonFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/NonFreightMatrix-control";
import { PayBasisdetailFromApi } from "../../CustomerContractAPIUtitlity";

@Component({
  selector: "app-customer-contract-non-freight-charges-popup",
  templateUrl: "./customer-contract-non-freight-charges-popup.component.html",
})
export class CustomerContractNonFreightChargesPopupComponent implements OnInit {
  columnHeader = {
    from: {
      Title: "From",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    to: {
      Title: "To",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    rate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    minValue: {
      Title: "Min Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    maxValue: {
      Title: "Max Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "FillMatrixForAll",
      iconName: "edit",
    },
  };
  staticField = ["from", "to", "rateType", "rate", "minValue", "maxValue"];
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
  tableLoad = false;
  isLoad = true;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  tableData: any;
  PinCodeList: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  StateList: any;
  EventButton = {
    functionName: "AddNewButtonEvent",
    name: "Add New",
    iconName: "add",
  };
  rateTypeCode: any;
  rateTypeStatus: any;
  isUpdate: any = false;
  UpdateData: any;
  ChargesData: any;
  constructor(
    private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    public dialogRef: MatDialogRef<CustomerContractNonFreightChargesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ChargesData = data;
    this.getTableData();
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.getAllMastersData();
  }

  async getTableData() {
    this.tableLoad = false;
    this.isLoad = true;
    let ChargesDatareq = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix",
      filter: { nFCID: this.ChargesData.nFCID },
    };
    const res = await this.masterService
      .masterPost("generic/get", ChargesDatareq)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const nfcData = res.data[0].nFC;
      console.log("nfcData", nfcData);
      this.tableData = nfcData;
      this.tableLoad = true;
      this.isLoad = false;
    }
  }

  initializeFormControl() {
    this.ContractNonFreightMatrixControls =
      new ContractNonFreightMatrixControl();
    this.jsonControlArrayNonFreightMatrix =
      this.ContractNonFreightMatrixControls.getContractNonFreightMatrixControlControls();
    this.NonFreightMatrixForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayNonFreightMatrix,
    ]);
    this.bindDropdown();
  }
  bindDropdown() {
    this.jsonControlArrayNonFreightMatrix.forEach((data) => {
      if (data.name === "rateType") {
        // Set AcGroupCategory variables
        this.rateTypeCode = data.name;
        this.rateTypeStatus = data.additionalData.showNameAndValue;
        this.getrateTypeDropdown();
      }
    });
  }
  async getrateTypeDropdown() {
    const AcGroupdata = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayNonFreightMatrix,
      this.NonFreightMatrixForm,
      AcGroupdata,
      this.rateTypeCode,
      this.rateTypeStatus
    );
    // if (this.isUpdate) {
    //   const element = AcGroupdata.find(
    //     (x) => x.name == this.UpdateData.AcGroupCategoryName
    //   );
    //   this.NonFreightMatrixForm.controls["rateType"].setValue(element);
    // }
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
      this.StateList = await this.masterService
        .masterPost("generic/get", stateReqBody)
        .toPromise();
      this.PinCodeList = await this.masterService
        .masterPost("generic/get", pincodeReqBody)
        .toPromise();
      this.PinCodeList.data = this.ObjcontractMethods.GetMergedData(
        this.PinCodeList,
        this.StateList,
        "ST"
      );
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  async save() {
    console.log("ChargesData", this.ChargesData);
    let ChargesDatareq = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix",
      filter: { nFCID: this.ChargesData.nFCID },
    };
    const res = await this.masterService
      .masterPost("generic/get", ChargesDatareq)
      .toPromise();
    if (res.success && res.data.length > 0) {
      const nfcData = res.data[0].nFC;
      const index =
        nfcData.length == 0 ? 1 : nfcData[nfcData.length - 1].id + 1;
      const Body = {
        id: index,
        from: this.NonFreightMatrixForm.value.From.name,
        fromType: this.NonFreightMatrixForm.value.From.value,
        to: this.NonFreightMatrixForm.value.To.name,
        toType: this.NonFreightMatrixForm.value.To.name,
        maxValue: this.NonFreightMatrixForm.value.MaxValue,
        minValue: this.NonFreightMatrixForm.value.MinValue,
        rate: this.NonFreightMatrixForm.value.Rate,
        rateType: this.NonFreightMatrixForm.value.rateType.name,
      };
      nfcData.push(Body);
      this.saveUpdateData(nfcData);
    } else {
    }
  }
  async saveUpdateData(data) {
    console.log("data", data);
    const Updatebody = {
      nFC: data,
    };
    const Updatereq = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix",
      filter: { nFCID: this.ChargesData.nFCID },
      update: Updatebody,
    };

    const Updateres = await this.masterService
      .masterPut("generic/update", Updatereq)
      .toPromise();
    console.log("Updateres", Updateres);
  }
  close() {
    this.dialogRef.close();
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
    console.log("data", data);
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
