import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";

@Component({
  selector: "app-product-services",
  templateUrl: "./product-services.component.html",
})
export class ProductServicesComponent implements OnInit {
  TableData = [
    {
      chargesName: "COD/DOD",
      chargesType: "Express,Rail",
      add: "+",
    },
    {
      chargesName: "DACC",
      chargesType: "Express",
      add: "+",
    },
    {
      chargesName: "ODA",
      chargesType: "Express",
      add: "+",
    },
    {
      chargesName: "Insurance",
      chargesType: "ALL",
      add: "+",
    },
    {
      chargesName: "Demurrage",
      chargesType: "Express,Rail,Air",
      add: "",
    },
  ];
  ProductId: any;
  ProductName: any;
  tableTab = false;
  ServicesNameList: any;
  ServicesTypeList: any;
  jsonControlArray: any[];
  customerTableForm: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  ServicesNameCode: string;
  ServicesNameStatus: any;
  ServicesTypeCode: string;
  ServicesTypeStatus: any;
  objectKeys = Object.keys;
  tableData: any;
  isTable: boolean;
  isTableEmt: boolean;
  ServicesTypeData: any[];
  ServicesNameData: any[];
  protected _onDestroy = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<ProductServicesComponent>
  ) {
    this.ProductId = data.element.ProductID;
    this.ProductName = data.element.ProductName;
  }
  ngOnInit(): void {
    this.GetTableData();
  }
  HendelFormFunction() {
    this.initializeFormControl();
    this.bindDropdown();
    this.ServicesNameDropdown();
    this.ServicesTypeDropdown();
  }
  initializeFormControl() {
    const customerFormControls = new ProductControls(true);
    this.jsonControlArray = customerFormControls.getServicesControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.customerTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "ServicesName") {
        // Set category-related variables
        this.ServicesNameCode = data.name;
        this.ServicesNameStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "multiServicesType") {
        // Set category-related variables
        this.ServicesTypeCode = data.name;
        this.ServicesTypeStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  async ServicesNameDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: { pRCD: this.ProductId },
      collectionName: "services",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      this.ServicesNameList = Res.data.map((x) => {
        return {
          name: x.sERNM,
          value: x.sERCD,
        };
      });
      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        this.ServicesNameList,
        this.ServicesNameCode,
        this.ServicesNameStatus
      );
    }
  }
  async ServicesTypeDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "products",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      this.ServicesTypeList = Res.data.map((x) => {
        return {
          name: x.product_name,
          value: x.product_id,
        };
      });
    }
    this.filter.Filter(
      this.jsonControlArray,
      this.customerTableForm,
      this.ServicesTypeList,
      this.ServicesTypeCode,
      this.ServicesTypeStatus
    );
  }
  async GetTableData() {
    this.isTable = false;
    this.isTableEmt = false;

    let req = {
      companyCode: this.companyCode,
      filter: { ProductId: this.ProductId },
      collectionName: "product_Services_detail",
    };

    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success) {
      if (Res.data.length > 0) {
        this.tableData = Res?.data.map((x, index) => {
          return {
            ...x,
            SrNo: index + 1,
          };
        });
        this.isTable = true;
      } else {
        this.tableData = [];
        this.isTableEmt = true;
      }
    }
  }
  async save() {
    const Body = {
      _id: `${this.companyCode}-${this.customerTableForm.value.ServicesCode}`,
      ProductName: this.ProductName,
      ProductId: this.ProductId,
      ServicesType: this.customerTableForm.value.ServicesType.map((x) => {
        return x.name;
      }).join(","),
      ServicesName: this.customerTableForm.value.ServicesName.name,
      ServicesCode: this.customerTableForm.value.ServicesCode,
      companyCode: this.companyCode,
      updatedDate: new Date(),
      updatedBy: localStorage.getItem("UserName"),
    };
    let req = {
      companyCode: this.companyCode,
      collectionName: "product_Services_detail",
      data: Body,
    };
    const res = await this.masterService
      .masterPost("generic/create", req)
      .toPromise();
    if (res?.success) {
      this.GetTableData();
      this.tableTab = !this.tableTab;
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
  close() {
    this.dialogRef.close();
  }
  cancel() {
    this.GetTableData();
    this.tableTab = !this.tableTab;
  }
  AddNew() {
    this.HendelFormFunction();
    this.tableTab = !this.tableTab;
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async handleServicesCode(event) {
    const req = {
      companyCode: this.companyCode,
      collectionName: "product_Services_detail",
      filter: { ServicesCode: this.customerTableForm.value.ServicesCode },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success && res.data.length != 0) {
      this.customerTableForm.controls.ServicesCode.setValue("");
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Services Code exist",
        showConfirmButton: true,
      });
    }
  }

  async handleServicesName() {
    const req = {
      companyCode: this.companyCode,
      collectionName: "product_Services_detail",
      filter: {
        ServicesName: this.customerTableForm.value.ServicesName.name,
        ProductId: this.ProductId,
      },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success && res.data.length != 0) {
      this.customerTableForm.controls.ServicesName.setValue("");
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Services Name exist",
        showConfirmButton: true,
      });
    }
  }
}
