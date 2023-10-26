import { Component, OnInit } from "@angular/core";
import { AddProductComponent } from "../add-product/add-product.component";
import { ProductChargesComponent } from "../product-charges/product-charges.component";
import { ProductServicesComponent } from "../product-services/product-services.component";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
})
export class ListProductComponent implements OnInit {
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
  ) {
    // this.route.queryParams.subscribe((params) => {
      // const encryptedData = params["isCompany"]; // Retrieve the encrypted data from the URL
      // if (this.isCompany == undefined || this.isCompany == null) {
      //   console.log("encryptedData", encryptedData);
      //   if (encryptedData != undefined) {
      //     this.isCompany = encryptedData == "true" ? true : false;
      //     if (!this.isCompany) {
      //       delete this.columnHeader.Charges;
      //       delete this.columnHeader.Services;
      //     }
      //   } else {
      //     window.history.back();
      //   }
      // } else {
      //   window.location.reload();
      // }
    // });
  }
  ngOnInit() {
    this.getProductDetails();
    if (this.isCompany) {
      this.getProductNameList();
    }
  }

  async getProductNameList() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res.success && Res.data.length > 0) {
      this.productNameList = Res.data;
    }
  }

  async getProductDetails() {
    this.isTableLode = false;
    if (this.isCompany) {
      let req = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "product_detail",
      };

      const Res = await this.masterService
        .masterPost("generic/get", req)
        .toPromise();
      if (Res?.success) {
        this.tableData = Res?.data.map((x, index) => {
          return {
            ...x,
            SrNo: index + 1,
            Charges: "Charges",
            Services: "Services",
          };
        });
        this.isTableLode = true;
      } else {
        this.tableData = [];
        this.isTableLode = true;
      }
    } else {
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
            ProductName: x.product_name,
            ProductID: x.product_id,
            SrNo: index + 1,
            Charges: "Charges",
            Services: "Services",
          };
        });
        this.isTableLode = true;
      } else {
        this.tableData = [];
        this.isTableLode = true;
      }
    }
  }
  AddNew() {
    if (this.isCompany) {
      if (this.productNameList.length != this.tableData.length) {
        const dialogref = this.dialog.open(AddProductComponent, {
          width: "600px",
          height: "280px",
          data: { isCompany: this.isCompany },
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
      } else {
        Swal.fire({
          icon: "info",
          title: "info",
          text: "All Product add Successful",
          showConfirmButton: true,
        });
      }
    } else {
      const dialogref = this.dialog.open(AddProductComponent, {
        width: "600px",
        height: "280px",
        data: { isCompany: this.isCompany },
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
  }
  addCharges(event) {
    console.log("event", event);
    const dialogref = this.dialog.open(ProductChargesComponent, {
      width: "80%",
      height: "80%",
      data: { isCompany: this.isCompany, element: event },
    });
    dialogref.afterClosed().subscribe((result) => {
      // this.dialogClosed.emit(result);
    });
  }
  addServices(event) {
    const dialogref = this.dialog.open(ProductServicesComponent, {
      width: "70%",
      height: "80%",
      data: { isCompany: this.isCompany },
    });
    dialogref.afterClosed().subscribe((result) => {
      // this.dialogClosed.emit(result);
    });
  }

  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
}
