import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ContractNonFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/NonFreightMatrix-control";
import { GetGeneralMasterData, GetProductCharges } from "../../CustomerContractAPIUtitlity";
import Swal from "sweetalert2";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom, map, switchMap } from "rxjs";

@Component({
  selector: "app-customer-contract-non-freight-charges-popup",
  templateUrl: "./customer-contract-non-freight-charges-popup.component.html",
})
export class CustomerContractNonFreightChargesPopupComponent {
  SaveEventButton = {
    functionName: "Save",
    name: "Save",
    iconName: "save",
  };
  columnHeader = {
    fROM: {
      Title: "From",
      class: "matcolumnfirst",
      Style: "min-width:20%",
    },
    tO: {
      Title: "To",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    vHCNM: {
      Title: "Vehicle Capacity",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    rTYPE: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    rT: {
      Title: "Rate (₹)",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    mINV: {
      Title: "Min Value (₹)",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    mAXV: {
      Title: "Max Value (₹)",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "Updatecharges",
      iconName: "edit",
    },
  };
  staticField = ["fROM", "tO", "vHCNM", "rTYPE", "rT", "mINV", "mAXV"];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  addFlag = true;
  linkArray = [];
  menuItems = [];
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
  companyCode = 0;
  StateList: any;
  EventButton = {
    functionName: "Save",
    name: "Add New",
    iconName: "add",
  };
  rateTypeCode: any;
  rateTypeStatus: any;
  isUpdate: any = false;
  UpdateData: any;
  ChargesData: any;
  selectChargesCode: any;
  selectChargesStatus: any;
  ProductCharges: any[]
  constructor(
    private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService,
    public dialogRef: MatDialogRef<CustomerContractNonFreightChargesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.companyCode = this.storage.companyCode;
    this.ChargesData = data;
    this.GetChargeDetails(this.ChargesData.sCTCD);
  }


  async GetChargeDetails(ChargeCode) {
    const ProductCharges = await GetProductCharges(this.masterService, null, ChargeCode);
    if (ProductCharges.length > 0) {
      this.ProductCharges = ProductCharges[0]?.cRGVB;
    } else {
      this.ProductCharges = ["DL", "VCW"];
    }
    await this.initializeFormControl();
    await this.getAllMastersData();
    await this.getTableData();
  }
  async initializeFormControl() {
    this.ContractNonFreightMatrixControls = new ContractNonFreightMatrixControl(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArrayNonFreightMatrix = this.ContractNonFreightMatrixControls.getContractNonFreightMatrixControlControls();

    // Filters Arrays Based on ProductCharges Data for DL VCW
    if (this.ProductCharges.length == 1) {
      if (this.ProductCharges[0] == "DL") {
        delete this.columnHeader.vHCNM;
        this.staticField = ["fROM", "tO", "rTYPE", "rT", "mINV", "mAXV"];
        this.jsonControlArrayNonFreightMatrix = this.jsonControlArrayNonFreightMatrix.filter((x) => x.name != "capacity");
      } else if (this.ProductCharges[0] == "VCW") {
        delete this.columnHeader.fROM;
        delete this.columnHeader.tO;
        this.staticField = ["vHCNM", "rTYPE", "rT", "mINV", "mAXV"];
        this.jsonControlArrayNonFreightMatrix = this.jsonControlArrayNonFreightMatrix.filter((x) => x.name != "From" && x.name != "To");
      }
    }

    this.NonFreightMatrixForm = formGroupBuilder(this.fb, [this.jsonControlArrayNonFreightMatrix,]);

    await this.bindDropdown();
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
      this.StateList = await firstValueFrom(
        this.masterService.masterPost("generic/get", stateReqBody)
      );
      this.PinCodeList = await firstValueFrom(
        this.masterService.masterPost("generic/get", pincodeReqBody)
      );
      this.ObjcontractMethods.GetMergedData(
        this.PinCodeList,
        this.StateList,
        "ST",
        this.masterService,
        true,
        true
      ).then((data) => {
        this.PinCodeList.data = data;
      });

    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  async getTableData() {
    this.tableLoad = false;
    this.isLoad = true;
    let ChargesDatareq = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix_details",
      filter: { sCTCD: this.ChargesData.sCTCD, cONID: this.ChargesData.cONID },
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", ChargesDatareq)
    );
    if (res.success) {
      this.tableData = res.data;
      this.tableData.sort((a, b) => (a.cDID > b.cDID ? -1 : 1));
      this.tableLoad = true;
      this.isLoad = false;
    }
  }


  async bindDropdown() {
    this.jsonControlArrayNonFreightMatrix.forEach(async (data) => {
      if (data.name === "rateType") {
        // Set AcGroupCategory variables
        this.rateTypeCode = data.name;
        this.rateTypeStatus = data.additionalData.showNameAndValue;
        await this.getrateTypeDropdown();
      }
      if (data.name === "capacity") {
        await this.getCapacityData()
      }
    });
  }
  async getrateTypeDropdown() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_contract",
      filter: { docNo: this.ChargesData.cONID },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    const SelectedData = res.data[0].rTYP;
    const RatData = await GetGeneralMasterData(this.masterService, "RTTYP");
    const rateTypedata = SelectedData.map((x, index) => {
      return RatData.find((t) => t.value == x);
    });
    this.filter.Filter(
      this.jsonControlArrayNonFreightMatrix,
      this.NonFreightMatrixForm,
      rateTypedata,
      this.rateTypeCode,
      this.rateTypeStatus
    );
    if (this.isUpdate) {
      const element = rateTypedata.find((x) => x.name == this.UpdateData.rTYPE);
      this.NonFreightMatrixForm.controls["rateType"].setValue(element);
    }
  }


  validateCodDodRates() {
    const MaxValue = +this.NonFreightMatrixForm.value.MaxValue;
    const MinValue = +this.NonFreightMatrixForm.value.MinValue;
    if (MaxValue < MinValue && MaxValue && MinValue) {
      this.NonFreightMatrixForm.controls["MaxValue"].setValue("");
      this.NonFreightMatrixForm.controls["MinValue"].setValue("");
      Swal.fire({
        title: "Max charge must be greater than to Min charge.",
        toast: false,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    }
  }
  async Save() {
    // Create Filter Based on Product Charges
    const TableFilter = {
      cONID: this.ChargesData.cONID,
      nFCID: this.ChargesData.nFCID,
    }

    if (this.ProductCharges.length == 1) {
      if (this.ProductCharges[0] == "DL") {
        TableFilter["fROM"] = this.NonFreightMatrixForm.value.From.name;
        TableFilter["tO"] = this.NonFreightMatrixForm.value.To.name;
      } else if (this.ProductCharges[0] == "VCW") {
        TableFilter["vHCCD"] = this.NonFreightMatrixForm.value.capacity.value;
      }
    } else {
      TableFilter["fROM"] = this.NonFreightMatrixForm.value.From.name;
      TableFilter["tO"] = this.NonFreightMatrixForm.value.To.name;
      TableFilter["vHCCD"] = this.NonFreightMatrixForm.value.capacity.value;
    }

    let Tablereq = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix_details",
      filter: TableFilter,
    };
    const Tableres = await firstValueFrom(
      this.masterService.masterPost("generic/get", Tablereq)
    );
    if (Tableres.data.length > 0 && !this.isUpdate) {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "enter valid data",
        showConfirmButton: true,
      });
      return;
    }

    const body = {
      mAXV: this.NonFreightMatrixForm.value.MaxValue,
      mINV: this.NonFreightMatrixForm.value.MinValue,
      rT: this.NonFreightMatrixForm.value.Rate,
      rTYPE: this.NonFreightMatrixForm.value.rateType.name,
      rTYPCD: this.NonFreightMatrixForm.value.rateType.value,
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName,
    };

    if (this.ProductCharges.length == 1) {
      if (this.ProductCharges[0] == "DL") {
        body["fROM"] = this.NonFreightMatrixForm.value.From.name;
        body["fTYPE"] = this.NonFreightMatrixForm.value.From.value;
        body["tO"] = this.NonFreightMatrixForm.value.To.name;
        body["tTYPE"] = this.NonFreightMatrixForm.value.To.value;
      } else if (this.ProductCharges[0] == "VCW") {
        body["vHCCD"] = this.NonFreightMatrixForm.value.capacity.value;
        body["vHCNM"] = this.NonFreightMatrixForm.value.capacity.name;
      }
    } else {
      body["fROM"] = this.NonFreightMatrixForm.value.From.name;
      body["fTYPE"] = this.NonFreightMatrixForm.value.From.value;
      body["tO"] = this.NonFreightMatrixForm.value.To.name;
      body["tTYPE"] = this.NonFreightMatrixForm.value.To.value;
      body["vHCCD"] = this.NonFreightMatrixForm.value.capacity.value;
      body["vHCNM"] = this.NonFreightMatrixForm.value.capacity.name;
    }

    if (!this.isUpdate) {
      let datareq = {
        companyCode: this.storage.companyCode,
        collectionName: "cust_contract_non_freight_charge_matrix_details",
        filter: {},
      };

      const tableres = await firstValueFrom(
        this.masterService.masterPost("generic/get", datareq)
      );
      const length = tableres.data.length;
      const Index = length == 0 ? 1 : tableres.data[length - 1].cDID + 1;
      body["_id"] = `${this.companyCode}-${this.ChargesData.cONID}-${Index}`;
      body["cDID"] = Index;
      body["sCT"] = this.ChargesData.sCT;
      body["sCTCD"] = this.ChargesData.sCTCD;
      body["nFCID"] = this.ChargesData.nFCID;
      body["cONID"] = this.ChargesData.cONID;
      body["cID"] = this.companyCode;
      body["eNTDT"] = new Date();
      body["eNTLOC"] = this.storage.branch;
      body["eNTBY"] = this.storage.userName;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix_details",
      filter: this.isUpdate ? { _id: this.UpdateData._id } : undefined,
      update: this.isUpdate ? body : undefined,
      data: !this.isUpdate ? body : undefined,
    };

    const Service = this.isUpdate
      ? this.masterService.masterPut("generic/update", req)
      : this.masterService.masterPost("generic/create", req);
    const res = await firstValueFrom(Service);
    if (res.success) {
      this.isUpdate = false;
      this.getTableData();
      this.initializeFormControl();
      this.EventButton.name = "Add New";
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }
  Updatecharges(event) {
    this.isUpdate = true;
    this.UpdateData = event.data;
    this.EventButton.name = "Update";
    this.initializeFormControl();
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
  SetOptions(event) {
    let fieldName = event.field.name;
    const fieldsToSearch = ["PIN", "CT", "STNM", "ZN", "LOC"];
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
  async getCapacityData() {
    const vehicleData = await GetGeneralMasterData(
      this.masterService,
      "VEHSIZE"
    );
    const containerDataWithPrefix = vehicleData.map((item) => ({
      name: `${item.name}`,
      value: item.value,
    }));
    this.filter.Filter(
      this.jsonControlArrayNonFreightMatrix,
      this.NonFreightMatrixForm,
      containerDataWithPrefix,
      "capacity",
      false
    );
    if (this.isUpdate) {
      const FilterData = containerDataWithPrefix.find((x) => x.name == this.UpdateData.vHCNM);
      this.NonFreightMatrixForm.controls["capacity"].setValue(FilterData);
    }
  }
}
