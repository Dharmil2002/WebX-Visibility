import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import Swal from "sweetalert2";
@Component({
  selector: "app-add-shard-charges",
  templateUrl: "./add-shard-charges.component.html",
})
export class AddShardChargesComponent implements OnInit {
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
    cHCD: {
      Title: "Charge ID",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    cHNM: {
      Title: "Charge Name",
      class: "matcolumncenter",
      Style: "min-width:40%",
    },
    cHTY: {
      Title: "Charge Type",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["SrNo", "cHCD", "cHNM","cHTY"];
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
    this.getChargeDetails();
    this.initializeFormControl();
  }
  async getChargeDetails() {
    this.isTableLode = false;

    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "charges",
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
        };
      });
      console.log("this.tableData", this.tableData);
      this.isTableLode = true;
    } else {
      this.tableData = [];
      this.isTableLode = true;
    }
  }
  initializeFormControl() {
    const customerFormControls = new ProductControls();
    this.jsonControlArray = customerFormControls.getShardChargesControlsArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  async save() {
    const length = this.tableData.length
    // const element = this.tableData[this.tableData.length - 1];
    const index = length == 0? 1 : parseInt(this.tableData[length-1].cHCD.substring(3))+ 1
    const ChargeCode = `CHA${index < 9 ? "00" : index > 9 && index < 99 ? "0" : ""}${index}`
    const Body = {
      _id: `${this.companyCode}-${ChargeCode}`,
      cHNM: this.customerTableForm.value.ChargeName,
      cHCD: ChargeCode,
      cHTY:this.customerTableForm.value.ChargesType,
      mODDT: new Date(),
      mODBY: localStorage.getItem("UserName"),
      cHBHV:this.customerTableForm.value.ChargesBehavior,
      aCTV: true,
    };
    const req = {
      companyCode: this.companyCode,
      collectionName: "charges",
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
      this.getChargeDetails();
    } else {
      Swal.fire({
        icon: "error",
        title: "Data not inserted",
        text: res.message,
        showConfirmButton: true,
      });
    }
    this.initializeFormControl();
  }
  
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async handleChargesName() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "charges",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res?.success && Res.data.length > 0) {
      const FilterData = this.tableData.filter(
        (x) =>
          x.cHNM.toLowerCase() ==
          this.customerTableForm.value.ChargeName.toLowerCase()
      );
      if (FilterData.length != 0) {
        this.customerTableForm.controls.ChargeName.setValue("");
        Swal.fire({
          icon: "info",
          title: "info",
          text: "Product name exist!",
          showConfirmButton: true,
        });
      } 
    }
  }
}
