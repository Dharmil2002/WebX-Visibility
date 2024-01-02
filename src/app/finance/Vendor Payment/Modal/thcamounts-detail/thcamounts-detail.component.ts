import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { THCAmountsControl } from "src/assets/FormControls/Finance/VendorPayment/tHCAmountsControls";
import { GetLocationDetailFromApi } from "../../VendorPaymentAPIUtitlity";
import { FilterUtils } from "src/app/Utility/dropdownFilter";

@Component({
  selector: "app-thcamounts-detail",
  templateUrl: "./thcamounts-detail.component.html",
})
export class THCAmountsDetailComponent implements OnInit {
  THCAmountsLESSArray: any;
  THCAmountsLESSForm: UntypedFormGroup;

  THCAmountsADDArray: any;
  THCAmountsADDForm: UntypedFormGroup;

  THCAmountsArray: any;
  THCAmountsForm: UntypedFormGroup;
  BillPaymentData;
  THCData;
  Type: any;
  isLessForm = false;
  companyCode: any = localStorage.getItem("companyCode");
  isAddForm: boolean = false;
  UpdateAmount: any;
  ChargesData: any;
  THCsummary: any = [];
  THCAmountsDetailsArray: any[];
  THCAmountsDetailsForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private dialog: MatDialog,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    public dialogRef: MatDialogRef<THCAmountsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any
  ) { }

  ngOnInit() {
    console.log("objResult", this.objResult);
    this.BillPaymentData = this.objResult?.BillPaymentData;
    this.THCData = this.objResult?.THCData;
    this.Type = this.objResult?.Type;
    this.getTHCsummary();
  }
  async getTHCsummary() {
    const req = {
      companyCode: this.companyCode,
      collectionName: "thc_summary",
      filter: {
        docNo: this.THCData.THC,
      },
    };

    // Make a request to the server to get charges
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      this.THCsummary = res.data[0];
      console.log("this.THCsummary", this.THCsummary);
      this.initializeFormControl();
    }
  }
  initializeFormControl() {
    const thcAmountsFormControls = new THCAmountsControl(this.Type, this.THCData);
    this.THCAmountsADDArray = thcAmountsFormControls.getTHCAmountsADDControls();
    this.THCAmountsArray = thcAmountsFormControls.getTHCAmountsControls();
    this.THCAmountsDetailsArray = thcAmountsFormControls.getTHCAmountsDetailsControls();
    this.THCAmountsForm = formGroupBuilder(this.fb, [this.THCAmountsArray]);
    this.THCAmountsDetailsForm = formGroupBuilder(this.fb, [this.THCAmountsDetailsArray]);
    this.SetLocationData();
    this.initializeAddLess();
  }

  async SetLocationData() {
    const AllLocationsList = await GetLocationDetailFromApi(this.masterService);
    this.filter.Filter(
      this.THCAmountsArray,
      this.THCAmountsForm,
      AllLocationsList,
      "BalanceLocation",
      false
    );
    this.filter.Filter(
      this.THCAmountsArray,
      this.THCAmountsForm,
      AllLocationsList,
      "AdvanceLocation",
      false
    );

    this.THCAmountsForm.controls.BalanceLocation.setValue(
      AllLocationsList.find(
        (item) => item.name == this.THCsummary.bLPAYAT
      )
    );
    this.THCAmountsForm.controls.AdvanceLocation.setValue(
      AllLocationsList.find(
        (item) => item.name == this.THCsummary.aDPAYAT
      )
    );
  }
  // Initialize the form and state variables for add and less charges
  async initializeAddLess() {
    this.isLessForm = false;
    this.isAddForm = false;

    // Fetch charges with the specified operator "+" (add charges)
    const addCharges = await this.getChargesByOperator("+");

    // Fetch charges with the specified operator "-" (less charges)
    const lessCharges = await this.getChargesByOperator("-");

    // Modify the array for add charges by inserting the fetched charges at the appropriate position
    const modifiedAddCharges = [
      ...this.THCAmountsADDArray.slice(0, 1),
      ...addCharges,
      ...this.THCAmountsADDArray.slice(1),
    ];

    // Update the add and less charge arrays with copies of the modified arrays
    this.THCAmountsADDArray = modifiedAddCharges.map((x) => ({ ...x }));
    this.THCAmountsLESSArray = lessCharges.map((x) => ({ ...x }));

    // Build form groups for add and less charges
    this.THCAmountsADDForm = formGroupBuilder(this.fb, [
      this.THCAmountsADDArray,
    ]);
    this.THCAmountsLESSForm = formGroupBuilder(this.fb, [
      this.THCAmountsLESSArray,
    ]);
    if (Array.isArray(this.THCsummary.cRGLST)) {
      this.THCsummary.cRGLST.forEach((x) => {
        if (x.cRGTYP == "+") {
          this.THCAmountsADDForm.controls[x.cRGNM]?.setValue(x.cRGAMT);
        } else {
          this.THCAmountsLESSForm.controls[x.cRGNM]?.setValue(x.cRGAMT);
        }
      });
    }
    this.isAddForm = true;
    this.isLessForm = lessCharges.length > 0;
    this.OnChangePlusAmounts("");
  }

  // Fetch charges based on the specified operator (+ or -)
  async getChargesByOperator(operator) {
    // Helper function to filter and map charges based on the specified operator
    const filterCharges = (charges, operator) =>
      charges
        .filter((x) => x.cHBHV === operator)
        .map((x) => ({
          name: x.cHNM.replaceAll(/\s/g, ""),
          label: x.cHNM,
          placeholder: x.cHNM,
          type: "number",
          value: 0.0,
          generatecontrol: true,
          disable: false,
          Validations: [
            {
              name: "pattern",
              message:
                "Please Enter only positive numbers with up to two decimal places",
              pattern: "^\\d+(\\.\\d{1,2})?$",
            },
          ],
          functions: {
            onChange: "OnChangePlusAmounts",
          },
        }));

    // Request parameters to fetch charges from the server
    const req = {
      companyCode: this.companyCode,
      collectionName: "charges",
      filter: {
        cHTY: 'V'
      },
    };

    // Make a request to the server to get charges
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    console.log("res", res);
    // Check if the request was successful and data is available
    if (res.success && res.data.length > 0) {
      this.ChargesData = res.data;
      // Filter and map charges based on the specified operator
      return filterCharges(res.data, operator);
    }
    // Return an empty array if no charges are found
    return [];
  }

  OnChangePlusAmounts(event) {
    this.THCAmountsADDForm.get("ContractAmount").setValue(
      this.THCData?.THCamount
    );
    let AddTHCTotal = 0;
    let LessAmount = 0;
    this.THCAmountsADDArray.forEach((item) => {
      if (item.name != "THCTotal") {
        const value = parseFloat(this.THCAmountsADDForm.get(item.name).value);
        AddTHCTotal += isNaN(value) ? 0 : value;
      }
    });

    this.THCAmountsLESSArray.forEach((x) => {
      LessAmount += isNaN(+this.THCAmountsLESSForm.value[x.name])
        ? 0
        : +this.THCAmountsLESSForm.value[x.name];
    });
    const THCTotal = AddTHCTotal - LessAmount;
    console.log("THCTotal", THCTotal);
    this.THCAmountsADDForm.get("THCTotal").setValue(THCTotal.toFixed(2));
    this.THCAmountsForm.get("Advance").setValue(
      (+this.THCData?.Advance).toFixed(2)
    );
    this.THCAmountsForm.get("Balance").setValue(
      (THCTotal - +this.THCData?.Advance).toFixed(2)
    );
  }
  OnChangeAdvanceAmount(event) {
    let THCTotal = this.THCAmountsADDForm.get("THCTotal").value;
    const advance = parseFloat(this.THCAmountsForm.get("Advance").value) || 0;
    const balance = THCTotal - advance;

    if (balance < 0) {
      // Display an error message or handle the negative balance scenario
      this.THCAmountsForm.get("Advance").setValue(this.THCData?.Advance);
      this.snackBarUtilityService.ShowCommonSwal(
        "error",
        "Advance Payment cannot be more than Balance...!"
      );

      // You can throw an error if needed: throw new Error("Balance cannot be negative.");
    } else {
      this.THCAmountsForm.get("Balance").setValue(balance.toFixed(2));
    }
  }

  OnChangeBalanceAmount(event) {
    // this.THCAmountsForm.get("Balance").setValue(THCTotal - this.THCData?.Advance);
  }

  Close(): void {
    this.dialogRef.close();
  }
  async submit() {
    const Charges = [];
    this.ChargesData.forEach((x) => {
      const FieldName = x.cHNM.replaceAll(/\s/g, "");
      const Amount = parseInt(
        x.cHBHV == "+"
          ? this.THCAmountsADDForm.value[FieldName]
          : this.THCAmountsLESSForm.value[FieldName]
      );
      Charges.push({
        cRGCD: x.cHCD,
        cRGNM: x.cHNM,
        cRGTYP: x.cHBHV,
        cRGAMT: Amount,
      });
    });
    const commonBody = {
      cRGLST: Charges,
      aDVPENAMT: this.THCAmountsForm.value.Advance,
      bALAMT: this.THCAmountsForm.value.Balance,
      bLPAYAT: this.THCAmountsForm.value.BalanceLocation.name,
      aDPAYAT: this.THCAmountsForm.value.AdvanceLocation.name,
    };
    console.log("commonBody", commonBody);
    const req = {
      companyCode: this.companyCode,
      collectionName: "thc_summary",
      filter: { docNo: this.THCData.THC },
      update: commonBody,
    };

    const res = await firstValueFrom(
      this.masterService.masterPut("generic/update", req)
    );
    console.log("res", res);
    if (res.success) {
      this.dialogRef.close({ success: res.success });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  functionCallHandler($event: any): void {
    const functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("Failed");
    }
  }
}
