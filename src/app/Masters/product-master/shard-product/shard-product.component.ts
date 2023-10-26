import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import Swal from "sweetalert2";

@Component({
  selector: "app-shard-product",
  templateUrl: "./shard-product.component.html",
})
export class ShardProductComponent implements OnInit {
  breadScrums = [
    {
      title: "Product List",
      items: ["Home"],
      active: "Product Master",
    },
  ];
  linkArray = [];
  menuItems = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    ProductID: {
      Title: "Product ID",
      class: "matcolumncenter",
      Style: "min-width:40%",
    },
    ProductName: {
      Title: "Product Name",
      class: "matcolumncenter",
      Style: "min-width:40%",
    },
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["SrNo", "ProductID", "ProductName"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  productNameList: any = [];
  tableData: any;
  isTableLode = false;
  isCompany: any = true;
  ProductControls: ProductControls;
  jsonControlArray: FormControls[];
  customerTableForm: any;
  ProductNameCode: string;
  ProductNameStatus: any;
  ProductNameData: any[];
  constructor(
    public dialog: MatDialog,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils
  ) {}
  ngOnInit() {
    this.getProductDetails();
    this.initializeFormControl();
  }
  async getProductDetails() {
    this.isTableLode = false;

    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    console.log("Res", Res);
    if (Res?.success) {
      this.tableData = Res?.data.map((x, index) => {
        return {
          ...x,
          ProductName: x.product_name,
          ProductID: x.product_id,
          SrNo: index + 1,
        };
      });
      this.isTableLode = true;
    } else {
      this.tableData = [];
      this.isTableLode = true;
    }
  }
  async save() {
    const element = this.tableData[this.tableData.length-1];
    const Body = {
      product_name: this.customerTableForm.value.ProductName,
      product_id: this.customerTableForm.value.ProductID,
      _id: parseInt(element._id) + 1,
      updatedDate: new Date(),
      updatedBy: localStorage.getItem("UserName"),
      active: true,
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
      Swal.fire({
        icon: "success",
        title: "Data inserted Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getProductDetails();
    } else {
      Swal.fire({
        icon: "error",
        title: "Data not inserted",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }
  initializeFormControl() {
    const customerFormControls = new ProductControls();
    this.jsonControlArray = customerFormControls.getProductControlsArray(false);
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  async getShardProduct() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success) {
      this.tableData = Res?.data;
      this.customerTableForm.controls.ProductID.setValue(
        `${parseInt(this.tableData[this.tableData.length - 1]._id) + 1}`
      );
    }
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
      "P" + this.customerTableForm.value.ProductName.value
    );
  }

  async handleProductName() {
    const element = this.tableData[this.tableData.length-1];
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      const FilterData = Res.data.filter(
        (x) =>
          x.product_name.toLowerCase() ==
          this.customerTableForm.value.ProductName.toLowerCase()
      );
      if (FilterData.length != 0) {
        this.customerTableForm.controls.ProductName.setValue("");
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Product name exist!",
          showConfirmButton: true,
        });
      }else{
        this.customerTableForm.controls.ProductID.setValue(`${
          parseInt(element._id) + 1
        }-${this.customerTableForm.value.ProductName.toUpperCase().substring(
          0,
          3
        )}`);
      }
    }
  }
}
