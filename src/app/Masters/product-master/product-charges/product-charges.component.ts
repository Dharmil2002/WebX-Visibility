import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-product-charges",
  templateUrl: "./product-charges.component.html",
})
export class ProductChargesComponent implements OnInit {
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add New",
    iconName: "add",
  };
  chargesTypeTitle = "Product Charges";
  addTitle = "+ Add Product Charges";
  selectedValue = "Product";
  Tabletab = false;
  TableLoad = false;
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    SelectCharges: {
      Title: "Select Charges",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    Add_Deduct: {
      Title: "Add/Deduct",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    ChargesBehaviour: {
      Title: "Charges Behaviour",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    VariabilityType: {
      Title: "Variability",
      class: "matcolumncenter",
      Style: "min-width:20%",
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
  ChargesList: any;
  ChargesBehaviourList: any;

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };

  staticField = [
    "SrNo",
    "VariabilityType",
    "ChargesBehaviour",
    "Add_Deduct",
    "SelectCharges",
  ];
  tableData = [];
  ProductId: any;
  ProductName: any;
  jsonControlArray: any[];
  customerTableForm: any;
  SelectChargesCode: string;
  SelectChargesStatus: any;
  ChargesBehaviourCode: string;
  ChargesBehaviourStatus: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  ChargesData: any[] = [];
  UpdatedData: any;
  isUpdate: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<ProductChargesComponent>,
    private storage: StorageService
  ) {
    this.ProductId = data.element.ProductID;
    this.ProductName = data.element.ProductName;
  }

  ngOnInit(): void {
    this.GetTableData();
    // this.HendelFormFunction()
  }
  HendelFormFunction() {
    this.initializeFormControl();
    this.bindDropdown();
    this.ChargesBehaviourDropdown();
    this.ChargesListDropdown();
  }
  initializeFormControl() {
    const customerFormControls = new ProductControls();
    this.jsonControlArray = customerFormControls.getChargesControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    if (this.isUpdate) {
      // this.customerTableForm.controls.Add_Deduct.set
      this.customerTableForm.controls["Add_Deduct"].setValue(
        this.UpdatedData.Add_Deduct
      );
      this.customerTableForm.controls["Variability"].setValue(
        this.UpdatedData.Variability
      );
    }
  }
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "SelectCharges") {
        // Set category-related variables
        this.SelectChargesCode = data.name;
        this.SelectChargesStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "ChargesBehaviour") {
        // Set category-related variables
        this.ChargesBehaviourCode = data.name;
        this.ChargesBehaviourStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  async ChargesListDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "charges",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res.success && Res.data.length > 0) {
      this.ChargesList = Res.data.map((x) => {
        return {
          name: x.cHNM,
          value: x.cHCD,
        };
      });
      this.ChargesData = [];
      this.ChargesList.forEach((x) => {
        const FilterData = this.tableData.filter(
          (t) => t.SelectCharges == x.name
        );
        if (FilterData.length == 0) {
          this.ChargesData.push(x);
        }
      });

      if (this.isUpdate) {
        const element = this.ChargesList.find(
          (x) => x.name == this.UpdatedData.SelectCharges
        );
        this.ChargesData.push(element);
        this.customerTableForm.controls["SelectCharges"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        this.ChargesData,
        this.SelectChargesCode,
        this.SelectChargesStatus
      );
    }
  }
  async ChargesBehaviourDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "charge_behaviours",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res.success && Res.data.length > 0) {
      this.ChargesBehaviourList = Res.data.map((x) => {
        return {
          name: x.charge_type,
          value: x.charge_type_id,
        };
      });
      if (this.isUpdate) {
        const element = this.ChargesBehaviourList.find(
          (x) => x.name == this.UpdatedData.ChargesBehaviour
        );
        console.log("element", element);
        this.customerTableForm.controls["ChargesBehaviour"].setValue(element);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        this.ChargesBehaviourList,
        this.ChargesBehaviourCode,
        this.ChargesBehaviourStatus
      );
    }
  }

  async GetTableData() {
    this.TableLoad = false;
    let req = {
      companyCode: this.companyCode,
      filter: { ProductId: this.ProductId, ChargesType: this.selectedValue },
      collectionName: "product_charges_detail",
    };

    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    console.log("Res", Res);
    if (Res?.success) {
      this.tableData = Res?.data.map((x, index) => {
        return {
          ...x,
          SrNo: index + 1,
          VariabilityType: x.Variability == "Y" ? "Define variability" : "",
        };
      });
      this.TableLoad = true;
    } else {
      this.tableData = [];
      this.TableLoad = true;
    }
  }
  async save() {
    const Body = {
      sELCHA: this.customerTableForm.value.SelectCharges.name,
      cHABEH: this.customerTableForm.value.ChargesBehaviour.name,
      vAR: this.customerTableForm.value.Variability,
      aDD_DEDU: this.customerTableForm.value.Add_Deduct,
      cHATY: this.selectedValue,
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      eNTBY: this.storage.userName,
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName,
    };
    if (!this.isUpdate) {
      let Tablereq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "product_charges_detail",
      };

      const tableRes = await this.masterService
        .masterPost("generic/get", Tablereq)
        .toPromise();
      const length = tableRes.data.length;
      const index =
        length == 0
          ? 1
          : parseInt(tableRes.data[length - 1].ChargesCode.substring(3)) + 1;
      const padding = index < 9 ? "00" : index < 99 ? "0" : "";
      Body["ChargesCode"] = `CHA${padding}${index}`;
      Body[
        "_id"
      ] = `${this.companyCode}-${this.ProductId}-CHA${padding}${index}`;
      Body["companyCode"] = this.companyCode;
      Body["ProductName"] = this.ProductName;
      Body["ProductId"] = this.ProductId;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "product_charges_detail",
      filter: this.isUpdate
        ? { ChargesCode: this.UpdatedData.ChargesCode }
        : undefined,
      update: this.isUpdate ? Body : undefined,
      data: this.isUpdate ? undefined : Body,
    };

    const res = this.isUpdate
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );
    if (res?.success) {
      this.GetTableData();
      this.Tabletab = !this.Tabletab;
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: "!Product add Successful",
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Data not inserted",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }
  chargesSectionFunction() {
    if (this.selectedValue == "Product") {
      this.chargesTypeTitle = "Product Charges";
      this.addTitle = "+ Add Product Charges";
    } else {
      this.chargesTypeTitle = "Charge Selection";
      this.addTitle = "+ Add Charge Selection";
    }
    this.GetTableData();
    this.Tabletab = false;
  }
  close() {
    this.dialogRef.close({ isSuccess: false });
  }
  AddNew() {
    this.Tabletab = !this.Tabletab;
    this.HendelFormFunction();
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  EditFunction(event) {
    this.UpdatedData = event.data;
    this.isUpdate = true;
    this.Tabletab = !this.Tabletab;
    this.HendelFormFunction();
  }
}
