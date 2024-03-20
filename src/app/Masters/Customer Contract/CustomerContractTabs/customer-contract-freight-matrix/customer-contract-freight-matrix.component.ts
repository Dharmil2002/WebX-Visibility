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
} from "@angular/forms";
import { Subject, firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import Swal from "sweetalert2";
import { ContractFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/FreightMatrix-control";
import { Router } from "@angular/router";
import { PayBasisdetailFromApi } from "../../CustomerContractAPIUtitlity";
import { StorageService } from "src/app/core/service/storage.service";
import { ContainerService } from "src/app/Utility/module/masters/container/container.service";
import { MatDialog } from "@angular/material/dialog";
import { FreightChargeUploadComponent } from "./freight-charge-upload/freight-charge-upload.component";
import moment from "moment";
import { formatDate } from "src/app/Utility/date/date-utils";

interface CurrentAccessListType {
  productAccess: string[];
}
const fieldsToSearch = ["PIN", "CT", "STNM", "ZN"];
@Component({
  selector: "app-customer-contract-freight-matrix",
  templateUrl: "./customer-contract-freight-matrix.component.html",
})
export class CustomerContractFreightMatrixComponent implements OnInit {
  @Input() contractData: any;
  EventButton = {
    functionName: "AddNewButtonEvent",
    name: "Add New",
    iconName: "add",
  };
  SaveEventButton = {
    functionName: "Save",
    name: "Save",
    iconName: "save",
  };
  companyCode: number | null;
  //#region Form Configration Fields
  ContractFreightMatrixControls: ContractFreightMatrixControl;
  FreightMatrixForm: UntypedFormGroup;
  jsonControlArrayFreightMatrix: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";

  //#region Array List
  CurrentAccessList: any;
  StateList: any;
  PinCodeList: any;
  //#endregion

  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = false;
  tableData: any = [];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];

  columnHeader = {
    fROM: {
      Title: "From",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    tO: {
      Title: "To",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    rTYP: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    cAP: {
      Title: "Capacity",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    rT: {
      Title: "Rate (₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    vFDT: {
      Title: "From Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    vEDT: {
      Title: "To Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "EditFunction",
      iconName: "edit",
    },
  };
  staticField = ["fROM", "tO", "rTYP", "cAP", "rT", "vFDT", "vEDT"];

  //#endregion
  protected _onDestroy = new Subject<void>();
  custcontractList: any;
  data: any;
  FreightMatrixData: any;
  initializeFormControlData: { MinDate: Date; MaxDate: Date };
  ServiceSelectiondata: any;
  rateTypeCode: any;
  rateTypeStatus: any;
  isUpdate = false;
  UpdateData: any;
  capacityCode: any;
  capacityStatus: any;
  uploadComponent = FreightChargeUploadComponent;
  //#endregion
  constructor(
    private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private Route: Router,
    private filter: FilterUtils,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionService,
    private storage: StorageService,
    private objContainerService: ContainerService,
    private dialog: MatDialog
  ) {
    // Retrieve the stored value from session storage
    // const storedData = sessionStorage.getItem("ServiceSelectiondata");

    // // Check if the storedData is not null or undefined
    // if (storedData) {
    //   this.data = JSON.parse(storedData);
    // }

    this.companyCode = this.sessionService.getCompanyCode();
    this.CurrentAccessList = {
      productAccess: [
        "loadType",
        "rateType",
        "originRateOption",
        "destinationRateOption",
        "originRateOptionHandler",
        "destinationRateOptionHandler",
      ],
    } as CurrentAccessListType;
  }
  async ngOnChanges(changes: SimpleChanges) {
    const MinDate = changes.contractData?.currentValue?.cSTARTDT ?? "";
    const MinDateObj = MinDate ? moment(MinDate, 'DD-MM-YYYY').toDate() : null;

    // Similarly for MaxDate
    const MaxDate = changes.contractData?.currentValue?.cENDDT ?? "";
    const MaxDateObj = MaxDate ? moment(MaxDate, 'DD-MM-YYYY').toDate() : null;

    this.initializeFormControlData = {
      MinDate: MinDateObj,
      MaxDate: MaxDateObj
    };
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "cust_contract",
      filter: { docNo: this.contractData.cONID },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    this.ServiceSelectiondata = {
      loadType: res.data[0].lTYP,
      rateTypecontrolHandler: res.data[0].rTYP,
    };
    if (this.ServiceSelectiondata.loadType == "LT-0002") {
      delete this.columnHeader.cAP;
    }
    this.initializeFormControl();
    this.getTableData();
  }

  async getTableData() {
    this.isLoad = true;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "cust_contract_freight_charge_matrix",
      filter: {
        cONID: this.contractData.cONID,
        lTYPE: this.ServiceSelectiondata.loadType,
      },
    };

    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );

    if (res.success) {
      this.tableData = res.data;
      this.tableData.sort((a, b) => (a.fCID > b.fCID ? -1 : 1));
      this.tableData = this.tableData.map((x, index) => {
        return {
          ...x, // Spread the original item to retain other fields
          vFDT: formatDate(x.vFDT || '', "dd-MM-yyyy"),
          vEDT: formatDate(x.vEDT || '', "dd-MM-yyyy"),
        };
      })
      this.tableLoad = true;
      this.isLoad = false;
    }
  }

  //#endregion
  initializeFormControl() {
    this.ContractFreightMatrixControls = new ContractFreightMatrixControl(
      this.UpdateData,
      this.isUpdate
    );
    this.jsonControlArrayFreightMatrix =
      this.ContractFreightMatrixControls.getContractFreightMatrixControlControls(
        this.CurrentAccessList.productAccess
      );
    // Update Form Values
    this.jsonControlArrayFreightMatrix.forEach(item => {
      if (item.name === 'ValidFromDate' || item.name === 'ValidToDate') {
        item.additionalData.minDate = this.initializeFormControlData.MinDate
        item.additionalData.maxDate = this.initializeFormControlData.MaxDate
      }
    });
    if (this.ServiceSelectiondata.loadType == "LT-0002") {
      this.jsonControlArrayFreightMatrix =
        this.jsonControlArrayFreightMatrix.filter((x) => x.name !== "capacity");
    }
    this.FreightMatrixForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayFreightMatrix,
    ]);
    this.bindDropdown();
  }
  async bindDropdown() {
    this.jsonControlArrayFreightMatrix.forEach((data) => {
      if (data.name === "rateType") {
        // Set AcGroupCategory variables
        this.rateTypeCode = data.name;
        this.rateTypeStatus = data.additionalData.showNameAndValue;
        this.getRatType();
      }
      if (data.name === "capacity") {
        this.capacityCode = data.name;
        this.capacityStatus = data.additionalData.showNameAndValue;
        this.getCapacityData();
      }
    });
  }

  async getRatType() {
    const RatData = await PayBasisdetailFromApi(this.masterService, "RTTYP");
    const rateTypedata = this.ServiceSelectiondata.rateTypecontrolHandler.map(
      (x, index) => {
        return RatData.find((t) => t.value == x);
      }
    );
    this.filter.Filter(
      this.jsonControlArrayFreightMatrix,
      this.FreightMatrixForm,
      rateTypedata,
      this.rateTypeCode,
      this.rateTypeStatus
    );
    if (this.isUpdate) {
      const rateTypeFilterData = rateTypedata.find(
        (x) => x.name == this.UpdateData.rTYP
      );
      this.FreightMatrixForm.controls["rateType"].setValue(rateTypeFilterData);
    }
  }

  async getCapacityData() {
    const containerData = await this.objContainerService.getContainerList();
    const vehicleData = await PayBasisdetailFromApi(
      this.masterService,
      "VEHSIZE"
    );
    const containerDataWithPrefix = vehicleData.map((item) => ({
      name: `Veh- ${item.name}`,
      value: item.value,
    }));
    const data = [...containerDataWithPrefix, ...containerData];
    this.filter.Filter(
      this.jsonControlArrayFreightMatrix,
      this.FreightMatrixForm,
      data,
      this.capacityCode,
      this.capacityStatus
    );
    if (this.isUpdate) {
      const FilterData = data.find((x) => x.name == this.UpdateData.cAP);
      this.FreightMatrixForm.controls["capacity"].setValue(FilterData);
    }
  }
  //#endregion
  ngOnInit() {
    this.getAllMastersData();
  }
  /*get all Master Details*/
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

  //#region Set OriginRateOptions
  SetOptions(event) {

    let fieldName = event.field.name;
    const search = this.FreightMatrixForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      data = this.ObjcontractMethods.GetGenericMappedAria(
        this.PinCodeList.data,
        search,
        fieldsToSearch
      );
      this.filter.Filter(
        this.jsonControlArrayFreightMatrix,
        this.FreightMatrixForm,
        data,
        fieldName,
        true
      );
    }
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
  async AddNewButtonEvent(event) {
    const isUpdate = this.isUpdate;
    const formData = this.FreightMatrixForm.value;

    const filterCondition = (item) => {
      const startDate = moment(item.vFDT, "DD-MM-YYYY");
      const endDate = moment(item.vEDT, "DD-MM-YYYY");
      const formDataStartDate = moment(formData.ValidFromDate, "DD-MM-YYYY");
      const formDataEndDate = moment(formData.ValidToDate, "DD-MM-YYYY");
      const commonConditions =
        item.fROM == formData.From.name && item.tO == formData.To.name &&
        (startDate <= formDataEndDate && endDate >= formDataStartDate) ||
        (endDate >= formDataStartDate && startDate <= formDataEndDate);


      if (this.ServiceSelectiondata.loadType == "LT-0002") {
        return isUpdate
          ? commonConditions && item._id != this.UpdateData._id
          : commonConditions;
      } else {

        return isUpdate
          ? commonConditions &&
          item.cAP == formData.capacity.name &&
          item._id != this.UpdateData._id
          : commonConditions && item.cAP == formData.capacity.name;
      }
    };
    const filterData = this.tableData.filter(filterCondition);
    if (filterData.length !== 0) {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Enter Valid Freight Charges With Unique Date Range",
        showConfirmButton: true,
      });
    } else {
      this.save();
    }
  }

  async save() {
    this.tableLoad = false;
    this.isLoad = true;
    const json = {
      fROM: this.FreightMatrixForm.value.From.name,
      fTYPE: this.FreightMatrixForm.value.From.value,
      tO: this.FreightMatrixForm.value.To.name,
      tTYPE: this.FreightMatrixForm.value.To.value,
      rTYP: this.FreightMatrixForm.value.rateType.name,
      rTYPCD: this.FreightMatrixForm.value.rateType.value,
      cAP:
        this.ServiceSelectiondata.loadType != "LT-0002"
          ? `${this.FreightMatrixForm.value.capacity.name}`
          : 0,
      cAPCD:
        this.ServiceSelectiondata.loadType != "LT-0002"
          ? this.FreightMatrixForm.value.capacity.value
          : "",
      rT: +this.FreightMatrixForm.value.Rate,
      vFDT: this.FreightMatrixForm.value.ValidFromDate,
      vEDT: this.FreightMatrixForm.value.ValidToDate,
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName,
    };
    if (!this.isUpdate) {
      let datareq = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "cust_contract_freight_charge_matrix",
        filter: {},
      };
      const tableres = await firstValueFrom(
        this.masterService.masterPost("generic/get", datareq)
      );
      const length = tableres.data.length;
      const Index = length == 0 ? 1 : tableres.data[length - 1].fCID + 1;
      json["cONID"] = this.contractData.cONID;
      json["lTYPE"] = this.ServiceSelectiondata.loadType;
      json["cID"] = this.companyCode;
      json["_id"] = `${this.companyCode}-${this.contractData.cONID}-${Index}`;
      json["fCID"] = Index;
      json["eNTDT"] = new Date();
      json["eNTLOC"] = this.storage.branch;
      json["eNTBY"] = this.storage.userName;
    }

    const req = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_freight_charge_matrix",
      filter: this.isUpdate ? { fCID: this.UpdateData.fCID } : undefined,
      update: this.isUpdate ? json : undefined,
      data: !this.isUpdate ? json : undefined,
    };

    const Service = this.isUpdate
      ? this.masterService.masterPut("generic/update", req)
      : this.masterService.masterPost("generic/create", req);
    const res = await firstValueFrom(Service);

    if (res.success) {
      this.isUpdate = false;
      this.UpdateData = undefined;
      this.getTableData();
      this.initializeFormControl();
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }
  handleMenuItemClick(data) {
    this.fillContainer(data);
  }

  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      const FromHandler = this.ObjcontractMethods.GetGenericMappedAria(
        this.PinCodeList.data,
        data.data?.From,
        fieldsToSearch
      )[0];
      const ToHandler = this.ObjcontractMethods.GetGenericMappedAria(
        this.PinCodeList.data,
        data.data?.To,
        fieldsToSearch
      )[0];

      this.FreightMatrixForm.controls["From"].setValue(FromHandler.name);
      this.FreightMatrixForm.controls["To"].setValue(ToHandler.name);
      this.FreightMatrixForm.controls["FromHandler"].setValue(FromHandler);
      this.FreightMatrixForm.controls["ToHandler"].setValue(ToHandler);
      this.FreightMatrixForm.controls["rateType"].setValue(
        data.data?.rateType || ""
      );
      this.FreightMatrixForm.controls["capacity"].setValue(
        data.data?.capacity || ""
      );
      this.FreightMatrixForm.controls["Rate"].setValue(data.data?.Rate || "");
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

  Save() {
    // this.FreightMatrixData = this.tableData
    const genretedid = this.companyCode + "-" + this.contractData.cONID;
    const companyCode = this.companyCode;
    const cONID = this.contractData.cONID;
    let FreightMatrixdetails = this.tableData.map((x, index) => {
      return {
        _id: genretedid + "-" + index,
        companyCode: companyCode,
        cONID: cONID,
        From: x.From,
        To: x.To,
        rateType: x.rateType,
        Rate: x.Rate,
      };
    });
    const tableData = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_freight_charge_matrix",
      data: FreightMatrixdetails,
    };

    // delete contractDetails._id;

    this.masterService.masterPost("generic/create", tableData).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl(
            "/Masters/CustomerContract/CustomerContractList"
          );
        }
        this.EventButton.name = "Add New";
      },
    });
  }

  EditFunction(event) {
    this.isUpdate = true;
    this.UpdateData = event.data;
    this.EventButton.name = "Update";
    this.initializeFormControl();
  }
  //#region to call upload function
  upload() {
    const dialogRef = this.dialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTableData();
    });
  }
  //#endregion
}