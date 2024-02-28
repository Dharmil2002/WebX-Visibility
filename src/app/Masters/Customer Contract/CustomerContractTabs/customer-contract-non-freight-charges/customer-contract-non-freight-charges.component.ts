import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ContractNonFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/NonFreightMatrix-control";
import { updatePending } from "../../../../operation/update-loading-sheet/loadingSheetshipment";
import { MatDialog } from "@angular/material/dialog";
import { CustomerContractNonFreightChargesPopupComponent } from "../customer-contract-non-freight-charges-popup/customer-contract-non-freight-charges-popup.component";
import Swal from "sweetalert2";
import { PayBasisdetailFromApi } from "../../CustomerContractAPIUtitlity";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-customer-contract-non-freight-charges",
  templateUrl: "./customer-contract-non-freight-charges.component.html",
})
export class CustomerContractNonFreightChargesComponent implements OnInit {
  @Input() contractData: any;
  showFiller = false;
  companyCode: number | null;
  //#region Form Configration Fields
  ContractNonFreightMatrixControls: any;
  NonFreightChargesForm: UntypedFormGroup;
  jsonControlArrayNonFreightCharges: any;
  AlljsonControlArrayNonFreightCharges: any;

  //#region Array List
  CurrentAccessList: any;
  StateList: any;
  PinCodeList: any;
  //#endregion

  isDrawerOpen: boolean = false;
  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  tableData: any = [];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "Save",
    name: "Add New",
    iconName: "add",
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];

  ChargescolumnHeader = {
    selectCharges: {
      Title: "Select Charges",
      class: "matcolumnfirst",
    },
    ChargesBehaviour: {
      Title: "Select Behaviour",
      class: "matcolumncenter",
    },
    Charges: {
      Title: "Charges",
      class: "matcolumncenter",
      type: "iconorvalue",
      functionName: "addCharges",
      iconName: "add_circle_outline",
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

  ChargesstaticField = [
    "selectCharges",
    "ChargesBehaviour",
    //'Charges',
  ];

  chargestableData = [];

  //#endregion
  protected _onDestroy = new Subject<void>();
  data: { Customer: any; ContractID: any };
  ContractID: any;
  isUpdate = false;
  UpdateData: any;
  selectChargesCode: any;
  selectChargesStatus: any;

  //#endregion
  constructor(
    private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    public dialog: MatDialog,
    private storage: StorageService,
    private sessionService: SessionService
  ) {
    this.companyCode = this.sessionService.getCompanyCode();
  }
  //#endregion
  ngOnInit() {
    this.ContractID = this.contractData.cONID;
    this.initializeFormControl();
    this.getTableData();
  }
  /*get all Master Details*/
  async getTableData() {
    this.tableLoad = false;
    this.isLoad = true;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "cust_contract_non_freight_charge_matrix",
      filter: { cONID: this.ContractID },
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );

    if (res.success) {
      this.tableData = res.data.map((x) => {
        return {
          ...x,
          selectCharges: x.sCT,
          ChargesBehaviour: x.cBT,
          Charges: x.cBT == "Variable" ? "Add" : x.nFC,
        };
      });
      this.tableData.sort((a, b) => (a.nFCID > b.nFCID ? -1 : 1));
      this.tableLoad = true;
      this.isLoad = false;
    }
  }

  initializeFormControl() {
    this.ContractNonFreightMatrixControls = new ContractNonFreightMatrixControl(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArrayNonFreightCharges =
      this.ContractNonFreightMatrixControls.getContractNonFreightChargesControlControls();
    this.NonFreightChargesForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayNonFreightCharges,
    ]);
    this.AlljsonControlArrayNonFreightCharges =
      this.jsonControlArrayNonFreightCharges;
    this.bindDropdown();
  }
  bindDropdown() {
    this.jsonControlArrayNonFreightCharges.forEach((data) => {
      if (data.name === "selectCharges") {
        // Set AcGroupCategory variables
        this.selectChargesCode = data.name;
        this.selectChargesStatus = data.additionalData.showNameAndValue;
        this.getselectChargesDropdown();
      }
    });
  }
  async getselectChargesDropdown() {
    const AcGroupdata = await PayBasisdetailFromApi(this.masterService, "SCH");
    console.log('AcGroupdata' ,AcGroupdata)
    this.filter.Filter(
      this.jsonControlArrayNonFreightCharges,
      this.NonFreightChargesForm,
      AcGroupdata,
      this.selectChargesCode,
      this.selectChargesStatus
    );
  }
  checkSelectCharges() {
    if (this.isUpdate) {
      const filterData = this.tableData.filter(
        (x) =>
          x.selectCharges ==
            this.NonFreightChargesForm.value.selectCharges.name &&
          x._id != this.UpdateData._id
      );
      if (filterData.length != 0) {
        this.NonFreightChargesForm.controls["selectCharges"].setValue("");
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Please, Select a different charges",
          showConfirmButton: true,
        });
      }
    } else {
      const filterData = this.tableData.filter(
        (x) =>
          x.selectCharges == this.NonFreightChargesForm.value.selectCharges.name
      );
      if (filterData.length != 0) {
        this.NonFreightChargesForm.controls["selectCharges"].setValue("");
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Please, Select a different charges",
          showConfirmButton: true,
        });
      }
    }
  }

  // Charges Section
  ChargesBehaviour(event) {
    if (
      this.NonFreightChargesForm.controls["ChargesBehaviour"].value === "Fixed"
    ) {
      this.jsonControlArrayNonFreightCharges =
        this.AlljsonControlArrayNonFreightCharges;
      this.NonFreightChargesForm.get("Charges").setValidators(
        Validators.required
      );
      this.NonFreightChargesForm.updateValueAndValidity();
    } else {
      this.jsonControlArrayNonFreightCharges =
        this.AlljsonControlArrayNonFreightCharges.filter(
          (x) => x.name != "Charges"
        );
      this.NonFreightChargesForm.get("Charges").clearValidators();
      this.NonFreightChargesForm.get("Charges").updateValueAndValidity();
    }
  }

  async Save() {
    const body = {
      sCT: this.NonFreightChargesForm.value.selectCharges.name,
      cBT: this.NonFreightChargesForm.value.ChargesBehaviour,
      nFC:
        this.NonFreightChargesForm.value.ChargesBehaviour == "Fixed"
          ? this.NonFreightChargesForm.value.Charges
          : [],
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName,
    };
    if (!this.isUpdate) {
      let datareq = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "cust_contract_non_freight_charge_matrix",
        filter: {},
      };
      const tableres = await firstValueFrom(
        this.masterService.masterPost("generic/get", datareq)
      );
      const length = tableres.data.length;
      const Index = length == 0 ? 1 : tableres.data[length - 1].nFCID + 1;
      body["cONID"] = this.ContractID;
      body["_id"] = `${this.companyCode}-${this.contractData.cONID}-${Index}`;
      body["nFCID"] = Index;
      body["cID"] = this.companyCode;
      body["eNTDT"] = new Date();
      body["eNTLOC"] = this.storage.branch;
      body["eNTBY"] = this.storage.userName;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_non_freight_charge_matrix",
      filter: this.isUpdate ? { nFCID: this.UpdateData.nFCID } : undefined,
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

  addCharges(event) {
    const dialogRef = this.dialog.open(
      CustomerContractNonFreightChargesPopupComponent,
      {
        data: event.data,
        width: "90%",
        height: "90%",
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      this.getTableData();
      this.initializeFormControl();
    });
  }
  cancel() {
    this.initializeFormControl();
  }

  async FillMatrixForAll(data: any) {
    const AcGroupdata = await PayBasisdetailFromApi(this.masterService, "SCH");
    const element = AcGroupdata.find((x) => x.name == data.data?.selectCharges);
    this.NonFreightChargesForm.controls["selectCharges"].setValue(
      element || ""
    );
    this.NonFreightChargesForm.controls["ChargesBehaviour"].setValue(
      data.data?.ChargesBehaviour || ""
    );
    this.NonFreightChargesForm.controls["Charges"].setValue(
      data.data?.ChargesBehaviour == "Variable" ? "" : data.data?.Charges || ""
    );
    this.chargestableData = this.chargestableData.filter(
      (x) => x.id !== data.data.id
    );
    this.ChargesBehaviour("");
    this.EventButton.name = "Update";
    this.isUpdate = true;
    this.UpdateData = data.data;
  }
  //#region functionCallHandler
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
}
