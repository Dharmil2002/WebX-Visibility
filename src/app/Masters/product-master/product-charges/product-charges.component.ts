import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProductControls } from "src/assets/FormControls/ProductControls";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
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
  selectedValue = "Charges";
  Tabletab = false;
  isSubmit: boolean = false
  TableLoad = false;
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    sELCHA: {
      Title: "Select Charges",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    aDD_DEDU: {
      Title: "Add/Deduct",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    cHACAT: {
      Title: "Charges Cat.",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    cHABEH: {
      Title: "Charges Behaviour",
      class: "matcolumncenter",
      Style: "min-width:15%",
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
    "cHABEH",
    "aDD_DEDU",
    "sELCHA",
    "cHACAT",
  ];
  tableData = [];
  ProductId: any;
  ProductName: any;
  jsonControlArray: any[];
  AlljsonControlArray: any[];
  customerTableForm: any;
  SelectChargesCode: string;
  SelectChargesStatus: any;
  ChargesBehaviourCode: string;
  ChargesBehaviourStatus: any;
  companyCode = 0;
  ChargesData: any[] = [];
  UpdatedData: any;
  isUpdate: boolean = false;
  protected _onDestroy = new Subject<void>();
  LedgerStatus: any;
  LedgerCode: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<ProductChargesComponent>,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,

  ) {
    this.companyCode = this.storage.companyCode;
    this.ProductId = data.element.ProductID;
    this.ProductName = data.element.ProductName;
  }

  ngOnInit(): void {
    this.GetTableData();
  }
  HendelFormFunction() {
    this.initializeFormControl();
    this.bindDropdown();
    this.getChargeApplicable();
    this.SetVariability();
  }
  initializeFormControl() {
    const customerFormControls = new ProductControls(this.isUpdate);
    this.jsonControlArray = customerFormControls.getChargesControlsArray(
      this.isUpdate
    );
    this.AlljsonControlArray = this.jsonControlArray;
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.customerTableForm.controls["Add_Deduct"].setValue(
      "+"
    );
    this.customerTableForm.controls["Variability"].setValue(
      "N"
    );
    if (this.isUpdate) {

      // this.customerTableForm.controls.Add_Deduct.set
      this.customerTableForm.controls["Add_Deduct"].setValue(
        this.UpdatedData.aDD_DEDU
      );
      this.customerTableForm.controls["Variability"].setValue(
        this.UpdatedData.vAR
      );
      this.customerTableForm.controls["ChargesCode"].setValue(
        this.UpdatedData.cHACD
      );
      this.customerTableForm.controls["cAPTION"].setValue(
        this.UpdatedData.cAPTION
      );
      this.customerTableForm.controls["isActive"].setValue(
        this.UpdatedData.isActive
      );
      this.customerTableForm.controls["iSChargeMandatory"].setValue(
        this.UpdatedData.iSREQ
      );
      if (this.UpdatedData.vAR == "N") {
        this.jsonControlArray = this.jsonControlArray.filter(
          (x) => x.name !== "VariabilityOn" && x.name !== "VariabilityOnHandler"
        );
      }
    } else {
      this.jsonControlArray = this.jsonControlArray.filter(
        (x) => x.name !== "VariabilityOn" && x.name !== "VariabilityOnHandler"
      );
    }
  }
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "SelectCharges") {
        // Set category-related variables
        this.SelectChargesCode = data.name;
        this.SelectChargesStatus = data.additionalData.showNameAndValue;
        this.ChargesListDropdown();
      }
      if (data.name === "ChargesBehaviour") {
        // Set category-related variables
        this.ChargesBehaviourCode = data.name;
        this.ChargesBehaviourStatus = data.additionalData.showNameAndValue;
        this.ChargesBehaviourDropdown();
      }
      if (data.name === "Ledger") {
        // Set category-related variables
        this.LedgerCode = data.name;
        this.LedgerStatus = data.additionalData.showNameAndValue;
        this.getLedger();
      }
    });
  }
  async ChargesListDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: { pRNm: this.ProductName },
      collectionName: "charges",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (Res.success && Res.data.length > 0) {
      this.ChargesList = Res.data.map((x) => {
        return {
          ...x,
          name: x.cHNM,
          value: x.cHCD,
        };
      });

      if (this.isUpdate) {
        const element = this.ChargesList.find(
          (x) => x.value == this.UpdatedData.cHACD
        );
        console.log(this.UpdatedData.cHACD);
        console.log("element", element);
        this.ChargesData.push(element);
        this.customerTableForm.controls["SelectCharges"].setValue(element);
      }

      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        this.ChargesList,
        this.SelectChargesCode,
        this.SelectChargesStatus
      );
    }
  }
  async ChargesBehaviourDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: {
        active: true
      },
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
          (x) => x.name == this.UpdatedData.cHABEH
        );
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
  async getLedger() {
    let req = {
      companyCode: this.companyCode,
      filter: { iSSYS: true },
      collectionName: "account_detail",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();

    if (Res.success && Res.data.length > 0) {
      const LedgerData = Res.data.map((x) => {
        return {
          ...x,
          name: x.aCNM,
          value: x.aCCD,
        };
      });

      if (this.isUpdate) {
        const element = LedgerData.find(
          (x) => x.value == this.UpdatedData.aCCD
        );
        // this.ChargesData.push(element);
        this.customerTableForm.controls["Ledger"].setValue(element);
      }

      this.filter.Filter(
        this.jsonControlArray,
        this.customerTableForm,
        LedgerData,
        this.LedgerCode,
        this.LedgerStatus
      );
    }
  }

  async GetTableData() {
    this.TableLoad = false;
    let req = {
      companyCode: this.companyCode,
      filter: { pRCD: this.ProductId, cHATY: this.selectedValue },
      collectionName: "product_charges_detail",
    };

    const Res = await firstValueFrom(this.masterService
      .masterPost("generic/get", req));

    if (Res?.success) {
      this.tableData = Res?.data.map((x, index) => {
        return {
          ...x,
          SrNo: index + 1,
          VariabilityType: x.vAR == "Y" ? "Define variability" : "",
        };
      });
      this.TableLoad = true;
    } else {
      this.tableData = [];
      this.TableLoad = true;
    }
  }

  async save() {
    if (!this.customerTableForm.valid) {
      this.customerTableForm.markAllAsTouched()
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    else {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          this.isSubmit = true;
          const Body = {
            sELCHA: this.customerTableForm.value.SelectCharges.name,
            cHACAT: this.customerTableForm.value.SelectCharges.cHTY,
            aCCD: this.customerTableForm.value.Ledger?.value || "",
            aCNM: this.customerTableForm.value.Ledger?.name || "",
            cHABEH: this.customerTableForm.value.ChargesBehaviour.name,
            vAR: this.customerTableForm.value.Variability,
            aDD_DEDU: this.customerTableForm.value.Add_Deduct,
            cHAPP: this.customerTableForm.value.chargeApplicableHandler.map(
              (x) => x.value
            ),
            cRGVB: this.customerTableForm.value.Variability == "Y" ? this.customerTableForm.value.VariabilityOnHandler.map(
              (x) => x.value
            ) : [],
            cAPTION: this.customerTableForm.value.cAPTION,
            iSREQ: this.customerTableForm.value.iSChargeMandatory,
            isActive: this.customerTableForm.value.isActive,
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName,
            mODDT: new Date(),
            mODLOC: this.storage.branch,
            mODBY: this.storage.userName,
          };

          if (!this.isUpdate) {
            Body["cHACD"] = this.customerTableForm.value.ChargesCode;
            Body[
              "_id"
            ] = `${this.companyCode}-${this.ProductId}-${this.selectedValue}-${this.customerTableForm.value.ChargesCode}`;
            Body["cID"] = this.companyCode;
            Body["pRNM"] = this.ProductName;
            Body["pRCD"] = this.ProductId;
            Body["cHATY"] = this.selectedValue;
          }
          const req = {
            companyCode: this.companyCode,
            collectionName: "product_charges_detail",
            filter: this.isUpdate ? { cHACD: this.customerTableForm.value.ChargesCode, cHATY: this.selectedValue } : undefined,
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
              text: "Charges add Successful",
              showConfirmButton: true,
            });
            this.isSubmit = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Data not inserted",
              text: res.message,
              showConfirmButton: true,
            });
          }
        }
        catch (error) {
          console.error("Error fetching data:", error);
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
          this.isSubmit = false;
        }
      }, "Product Charges Adding....");
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
    console.log('functionName', functionName)
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

  Cancel() {
    this.UpdatedData = "";
    this.isUpdate = false;
    this.Tabletab = !this.Tabletab;
  }

  async handleSelectCharges() {
    if (this.isUpdate) {
      this.customerTableForm.controls["ChargesCode"].setValue(
        this.customerTableForm.value.SelectCharges.value
      );
      if (
        this.customerTableForm.value.SelectCharges.value ==
        this.UpdatedData.cHACD
      ) {
        return;
      }
    }

    const req = {
      companyCode: this.companyCode,
      collectionName: "product_charges_detail",
      filter: {
        cHACD: this.customerTableForm.value.SelectCharges.value,
        cHATY: this.selectedValue,
        pRCD: this.ProductId,
      },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success && res.data.length != 0) {
      this.customerTableForm.controls.SelectCharges.setValue("");
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Please Select Other Charges These Charges Already Used",
        showConfirmButton: true,
      });
    } else {
      this.customerTableForm.controls["ChargesCode"].setValue(
        this.customerTableForm.value.SelectCharges.value
      );
    }
  }
  //#region to get and set Charge Applicable list
  getChargeApplicable() {
    const chargeApplicablelist = [
      { name: "ON GCN", value: "GCN" },
      { name: "On THC Generation", value: "THC" },
      { name: "ON Delivery MR", value: "DeliveryMR" },
    ];

    if (this.isUpdate && this.UpdatedData?.cHAPP) {
      const updatedValue = this.UpdatedData.cHAPP;

      // Assuming updatedValue is an array
      const selectedChargeApplicables = chargeApplicablelist.filter((x) =>
        updatedValue.includes(x.value)
      );
      this.customerTableForm.controls["chargeApplicableHandler"].patchValue(
        selectedChargeApplicables
      );
    }

    this.filter.Filter(
      this.jsonControlArray,
      this.customerTableForm,
      chargeApplicablelist,
      "chargeApplicable",
      false
    );
  }
  //#endregion
  //#region handles select All feature of all multiSelect fields of one form.
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
  //#endregion

  OnChangeVariability(event) {
    if (event.eventArgs.value == "Y") {
      // Display VariabilityOn field
      this.jsonControlArray = this.AlljsonControlArray;
      this.SetVariability()
    }
    else {
      // Hide VariabilityOn field
      this.jsonControlArray = this.jsonControlArray.filter(
        (x) => x.name !== "VariabilityOn" && x.name !== "VariabilityOnHandler"
      );
    }
  }
  //#region to get and set Charge Applicable list
  SetVariability() {
    const Variabilitylist = [
      { name: "Delivery Location Wise", value: "DL" },
      { name: "Vehicle Capacity Wise", value: "VCW" },
    ];

    if (this.isUpdate && this.UpdatedData?.cRGVB) {
      const updatedValue = this.UpdatedData.cRGVB;
      const selectedChargeApplicables = Variabilitylist.filter((x) =>
        updatedValue.includes(x.value)
      );
      this.customerTableForm.controls["VariabilityOnHandler"].patchValue(
        selectedChargeApplicables
      );
    }

    this.filter.Filter(
      this.jsonControlArray,
      this.customerTableForm,
      Variabilitylist,
      "VariabilityOn",
      false
    );
  }
}