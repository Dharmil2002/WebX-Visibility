import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import Swal from "sweetalert2";
import { AddProductComponent } from "../../product-master/add-product/add-product.component";
import { ProductShardControls } from "src/assets/FormControls/ProductShardControls";
import { firstValueFrom } from "rxjs";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";

@Component({
  selector: "app-shard-product-add",
  templateUrl: "./shard-product-add.component.html",
})
export class ShardProductAddComponent implements OnInit {
  ProductControls: ProductControls;
  productNameList: any;
  jsonControlArray: FormControls[];
  customerTableForm: any;
  ProductNameCode: string;
  ProductNameStatus: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any[];
  ProductNameData: any[];
  isCompany: boolean;
  isUpdate = false;
  UpdateData: any;

  ProductShardTableForm: any;
  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    const ProductShardFormControls = new ProductShardControls();
    this.jsonControlArray =
      ProductShardFormControls.getShardProductControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.ProductShardTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }

  async save() {
    let Tablereq = {
      companyCode: this.companyCode,
      collectionName: "products",
      filter: {},
      sorting: { product_id: -1 },
    };
    const resVendor = await firstValueFrom(
      this.masterService.masterPost("generic/findLastOne", Tablereq)
    );
    const LastCode = resVendor.data?.product_id || "PR0000";
    const code = nextKeyCode(LastCode);
    const Body = {
      _id: code,
      product_name: this.ProductShardTableForm.value.ProductName,
      product_id: code,
      updatedDate: new Date(),
      updatedBy: localStorage.getItem("UserName"),
    };
    const req = {
      companyCode: this.companyCode,
      collectionName: "products",
      data: Body,
    };
    const res = await this.masterService
      .masterPost("generic/create", req)
      .toPromise();
    if (res?.success) {
      this.dialogRef.close({ isSuccess: true });
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
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async handleProductName() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      const filterCondition = this.isUpdate
        ? (x) =>
            x.product_name.toLowerCase() ==
              this.ProductShardTableForm.value.ProductName.toLowerCase() &&
            x._id != this.UpdateData._id
        : (x) =>
            x.product_name.toLowerCase() ==
            this.ProductShardTableForm.value.ProductName.toLowerCase();

      const filterData = Res.data.filter(filterCondition);

      if (filterData.length != 0) {
        this.ProductShardTableForm.controls["ProductName"].setValue("");
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Product name exist!",
          showConfirmButton: true,
        });
      }
    }
  }

  cancel() {
    this.dialogRef.close({ isSuccess: false });
  }
}
