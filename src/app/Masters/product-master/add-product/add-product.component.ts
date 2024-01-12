import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, UntypedFormBuilder, Validators } from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from "@angular/material-moment-adapter";
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import { FormControls } from "src/app/core/models/FormControl/formcontrol";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" }, // set the locale
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AddProductComponent implements OnInit {
  ProductControls: ProductControls;
  productNameList: any;
  jsonControlArray: FormControls[];
  customerTableForm: any;
  ProductNameCode: string;
  ProductNameStatus: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any[];
  ProductNameData: any[];
  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data", data);
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.bindDropdown();
    this.getList();
    this.GetTableData();
  }

  async getList() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success) {
    }
  }

  initializeFormControl() {
    const customerFormControls = new ProductControls();
    this.jsonControlArray = customerFormControls.getProductControlsArray(true);
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "ProductName") {
        // Set category-related variables
        this.ProductNameCode = data.name;
        this.ProductNameStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  async getProductNameDropdown() {
    this.ProductNameData = [];
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      this.productNameList = Res.data.map((x) => {
        return {
          name: x.product_name,
          value: x.product_id,
        };
      });
      this.productNameList.forEach((x) => {
        const FilterData = this.tableData.filter(
          (t) => t.ProductName == x.name
        );
        if (FilterData.length == 0) {
          this.ProductNameData.push(x);
        }
      });
      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        this.ProductNameData,
        this.ProductNameCode,
        this.ProductNameStatus
      );
    }
  }
  async GetTableData() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "product_detail",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success) {
      this.tableData = Res?.data;
      this.getProductNameDropdown();
    }
  }

  

  async save() {
    let req;
    const Body = {
      _id:`${this.companyCode}-${this.customerTableForm.value.ProductID}`,
      ProductName: this.customerTableForm.value.ProductName.name,
      ProductID: this.customerTableForm.value.ProductID,
      companyCode: this.companyCode,
      updatedDate: new Date(),
      updatedBy: localStorage.getItem("UserName"),
    };
    req = {
      companyCode: this.companyCode,
      collectionName: "product_detail",
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

  handleProductId() {
    this.customerTableForm.controls.ProductID.setValue(
      this.customerTableForm.value.ProductName.value
    );
  }

  // async handleProductName() {
  //   let req = {
  //     companyCode: this.companyCode,
  //     filter: {},
  //     collectionName: "products",
  //   };
  //   const Res = await this.masterService
  //     .masterPost("generic/get", req)
  //     .toPromise();
  //   if (Res?.success && Res.data.length > 0) {
  //     const FilterData = Res.data.filter(
  //       (x) =>
  //         x.product_name.toLowerCase() ==
  //         this.customerTableForm.value.ProductName.toLowerCase()
  //     );
  //     if (FilterData.length != 0) {
  //       this.customerTableForm.controls.ProductName.setValue("");
  //       Swal.fire({
  //         icon: "info",
  //         title: "info",
  //         text: "Product name exist!",
  //         showConfirmButton: true,
  //       });
  //     }
  //   }
  // }
}
