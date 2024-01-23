import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import { ProductShardControls } from "src/assets/FormControls/ProductShardControls";
import Swal from "sweetalert2";

@Component({
  selector: "app-shard-product-charges",
  templateUrl: "./shard-product-charges.component.html",
})
export class ShardProductChargesComponent implements OnInit {
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
  chargesTypeTitle = "Shard Product Charges";
  addTitle = "+ Add Shard Product Charges";
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
    ChargesType: {
      Title: "Charges Type",
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

  staticField = ["SrNo", "SelectCharges", "ChargesType"];
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
  TableForm: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<ShardProductChargesComponent>,
    private storage: StorageService
  ) {
    this.ProductId = data.element.ProductID;
    this.ProductName = data.element.ProductName;
  }

  ngOnInit(): void {
    this.GetTableData();
  }
  HendelFormFunction() {
    this.initializeFormControl();
  }
  initializeFormControl() {
    const customerFormControls = new ProductShardControls();
    this.jsonControlArray =
      customerFormControls.getShardProductChargesControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.TableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    if (this.isUpdate) {
      this.TableForm.controls["ChargesName"].setValue(this.UpdatedData.cHNM);
      this.TableForm.controls["ChargesType"].setValue(this.UpdatedData.cHTY);
      this.TableForm.controls["ChargesID"].setValue(this.UpdatedData.cHCD);
      this.TableForm.controls["ChargesBooktype"].setValue(this.UpdatedData.cHBTY);
    }
  }
  async GetTableData() {
    this.TableLoad = false;
    let req = {
      companyCode: this.companyCode,
      filter: { pRCD: this.ProductId },
      collectionName: "charges",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success) {
      this.tableData = Res?.data.map((x, index) => {
        return {
          ...x,
          SrNo: index + 1,
          SelectCharges: x.cHNM,
          ChargesType: x.cHTY,
        };
      });
      this.TableLoad = true;
    } else {
      this.tableData = [];
      this.TableLoad = true;
    }
  }
  async save() {
    console.log('this.TableForm.value.ChargesBooktype' ,this.TableForm.value.ChargesBooktype)
    const Body = {
      cHNM: this.TableForm.value.ChargesName,
      cHTY: this.TableForm.value.ChargesType,
      cHBTY: this.TableForm.value.ChargesBooktype,
      mODDT: new Date(),
      mODBY: localStorage.getItem("UserName"),
      aCTV: true,
    };

    if (!this.isUpdate) {

      let Tablereq = {
        companyCode: this.companyCode,
        collectionName: "charges",
        filter: {},
        sorting: { cHCD: -1 },
      };
      const resVendor = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", Tablereq)
      );
      const LastCode = resVendor.data?.cHCD || "CHA0000";
      const ChargeCode = nextKeyCode(LastCode);
      Body["_id"] = ChargeCode;
      Body["cHCD"] = ChargeCode;
      Body["pRNm"] = this.ProductName;
      Body["pRCD"] = this.ProductId;
    }

    const req = {
      companyCode: this.companyCode,
      collectionName: "charges",
      filter: this.isUpdate ? { cHCD: this.UpdatedData.cHCD } : undefined,
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
      Swal.fire({
        icon: "success",
        title: "Data inserted Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.GetTableData();
      this.Tabletab = !this.Tabletab;
    } else {
      Swal.fire({
        icon: "error",
        title: "Data not inserted",
        text: res.message,
        showConfirmButton: true,
      });
    }
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

  handleChargesName() {
    const filterCondition = this.isUpdate
      ? (x) =>
          x.SelectCharges.toLowerCase() == this.TableForm.value.ChargesName.toLowerCase() &&
          x.cHCD != this.UpdatedData.cHCD
      : (x) => x.SelectCharges.toLowerCase() == this.TableForm.value.ChargesName.toLowerCase();

    const filterData = this.tableData.filter(filterCondition);
    if (filterData.length !=0) {
      this.TableForm.controls["ChargesName"].setValue("");
      Swal.fire({
        icon: "info",
        title: "Data exists!",
        text: "Charges name already exists",
        showConfirmButton: true,
      });
    }
  }
  Cancel(){
    this.UpdatedData = "";
    this.isUpdate = false;
    this.Tabletab = !this.Tabletab;
  }
}
