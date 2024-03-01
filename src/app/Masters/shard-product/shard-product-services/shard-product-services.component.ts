import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ProductControls } from 'src/assets/FormControls/ProductControls';
import Swal from 'sweetalert2';
import { ProductServicesComponent } from '../../product-master/product-services/product-services.component';
import { ProductShardControls } from 'src/assets/FormControls/ProductShardControls';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';

@Component({
  selector: 'app-shard-product-services',
  templateUrl: './shard-product-services.component.html'
})
export class ShardProductServicesComponent implements OnInit {
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    sERCD: {
      Title: "Service Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    sERNM: {
      Title: "Service Name",
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

  staticField = ["SrNo", "sERNM", "sERCD"]
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
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
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  protected _onDestroy = new Subject<void>();
  UpdateData: any;
  isUpdate: boolean = false;
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
  }
  initializeFormControl() {
    const customerFormControls = new ProductShardControls();
    this.jsonControlArray = customerFormControls.getShardProductServicesControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    if (this.isUpdate) {
      this.customerTableForm.controls["ServicesName"].setValue(this.UpdateData.sERNM);
      this.customerTableForm.controls["ServicesID"].setValue(this.UpdateData.sERCD);
    }
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
  async GetTableData() {
    this.isTable = false;
    this.isTableEmt = false;

    let req = {
      companyCode: this.companyCode,
      filter: { pRCD: this.ProductId },
      collectionName: "services",
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
        this.tableData = []
        this.isTable = true;
      }
    }
  }
  async save() {
    const Body = {
      sERNM: this.customerTableForm.value.ServicesName,
      mODDT: new Date(),
      mODBY: localStorage.getItem("UserName"),
    };
    if (!this.isUpdate) {
      let Tablereq = {
        companyCode: this.companyCode,
        collectionName: "services",
        filter: {},
        sorting: { sERCD: -1 },
      };
      const resVendor = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", Tablereq)
      );
      const LastCode = resVendor.data?.sERCD || "SER0000";
      const code = nextKeyCode(LastCode);
      Body["_id"] = code;
      Body["pRNM"] = this.ProductName;
      Body["pRCD"] = this.ProductId;
      Body["sERCD"] = code;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "services",
      filter: this.isUpdate ? { sERCD: this.UpdateData.sERCD } : undefined,
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
      this.tableTab = !this.tableTab;
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
    this.isUpdate = false;
    this.UpdateData = ""
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
  EditFunction(event) {
    this.isUpdate = true;
    this.UpdateData = event.data
    this.HendelFormFunction();
    this.tableTab = !this.tableTab;
  }
}
