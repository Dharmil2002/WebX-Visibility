import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { ProductChargesComponent } from "../../product-master/product-charges/product-charges.component";
import { ProductServicesComponent } from "../../product-master/product-services/product-services.component";
import { ShardProductAddComponent } from "../shard-product-add/shard-product-add.component";
import { ShardProductChargesComponent } from "../shard-product-charges/shard-product-charges.component";
import { ShardProductServicesComponent } from "../shard-product-services/shard-product-services.component";
// import { AddShardProductComponent } from '../add-shard-product/add-shard-product.component';

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
})
export class ProductListComponent implements OnInit {
  breadScrums = [
    {
      title: "Shard Product List",
      items: ["Home"],
      active: "Shard Product Master",
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
      Style: "min-width:10%",
    },
    ProductID: {
      Title: "Product ID",
      class: "matcolumncenter",
      Style: "min-width:25%",
    },
    ProductName: {
      Title: "Product Name",
      class: "matcolumncenter",
      Style: "min-width:25%",
    },
    Charges: {
      Title: "Charges",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "iconClick",
      functionName: "addCharges",
      iconName: "library_add",
    },
    Services: {
      Title: "Services",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "iconClick",
      functionName: "addServices",
      iconName: "add_box",
    },
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add New",
    iconName: "add",
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
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.getProductDetails();
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
    if (Res?.success) {
      this.tableData = Res?.data.map((x, index) => {
        return {
          ProductName: x.product_name,
          ProductID: x.product_id,
          SrNo: index + 1,
          Charges: "Charges",
          Services: "Services",
        };
      });
      this.isTableLode = true;
    }
  }
  AddNew() {
    const dialogref = this.dialog.open(ShardProductAddComponent, {
      width: "600px",
      height: "300px",
      disableClose:true,
      data: {},
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result?.isSuccess) {
        this.getProductDetails();
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "!Product add Successful",
          showConfirmButton: true,
        });
      }
    });
  }
  addCharges(event) {
    const dialogref = this.dialog.open(ShardProductChargesComponent, {
      width: "80%",
      height: "80%",
      data: { element: event },
    });
    dialogref.afterClosed().subscribe((result) => {});
  }
  addServices(event) {
    const dialogref = this.dialog.open(ShardProductServicesComponent, {
      width: "70%",
      height: "80%",
      data: { element: event },
    });
    dialogref.afterClosed().subscribe((result) => {});
  }
  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
}
