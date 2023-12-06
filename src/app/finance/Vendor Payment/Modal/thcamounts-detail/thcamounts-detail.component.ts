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

@Component({
  selector: "app-thcamounts-detail",
  templateUrl: "./thcamounts-detail.component.html",
})
export class THCAmountsDetailComponent implements OnInit {
  THCAmountsLESSArray: any = [];
  THCAmountsLESSForm: UntypedFormGroup;

  THCAmountsADDArray: any = [];
  THCAmountsADDForm: UntypedFormGroup;

  THCAmountsArray: any;
  THCAmountsForm: UntypedFormGroup;
  PaymentData;
  THCData;
  Type: any;
  isLessForm = false;
  companyCode: any = localStorage.getItem("companyCode");
  isAddForm: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private dialog: MatDialog,
    public snackBarUtilityService: SnackBarUtilityService,
    public dialogRef: MatDialogRef<THCAmountsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any
  ) {}

  ngOnInit() {
    this.PaymentData = this.objResult?.PaymentData;
    this.THCData = this.objResult?.THCData;
    this.Type = this.objResult?.Type;

    console.log(this.THCData);

    this.initializeFormControl();
  }
  initializeFormControl() {
    const thcAmountsFormControls = new THCAmountsControl(this.Type);
    this.THCAmountsADDArray = thcAmountsFormControls.getTHCAmountsADDControls();
    // this.THCAmountsADDForm = formGroupBuilder(this.fb, [this.THCAmountsADDArray]);

    // this.THCAmountsLESSArray = thcAmountsFormControls.getTHCAmountsLESSControls();
    // this.THCAmountsLESSForm = formGroupBuilder(this.fb, [this.THCAmountsLESSArray]);

    this.THCAmountsArray = thcAmountsFormControls.getTHCAmountsControls();
    this.THCAmountsForm = formGroupBuilder(this.fb, [this.THCAmountsArray]);

    this.THCAmountsForm.get("Balancelocation").setValue(
      this.THCData?.OthersData?.balAmtAt
    );
    this.THCAmountsForm.get("AdvanceLocation").setValue(
      this.THCData?.OthersData?.advPdAt
    );
    this.initializeAddLess();
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

    // Set flags indicating whether add and less charges exist
    this.isAddForm = true;
    this.isLessForm = lessCharges.length > 0;

    // Trigger the onChange event for plus amounts
    this.OnChangePlusAmounts("");
  }

  // Fetch charges based on the specified operator (+ or -)
  async getChargesByOperator(operator) {
    // Helper function to filter and map charges based on the specified operator
    const filterCharges = (charges, operator) =>
      charges
        .filter((x) => x.Add_Deduct === operator)
        .map((x) => ({
          name: x.SelectCharges.trim(),
          label: x.SelectCharges,
          placeholder: x.SelectCharges,
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
      collectionName: "product_charges_detail",
      filter: {
        ProductName: this.THCData.OthersData.transMode,
        ChargesType: "Charges",
      },
    };

    // Make a request to the server to get charges
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );

    // Check if the request was successful and data is available
    if (res.success && res.data.length > 0) {
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
    this.THCAmountsADDForm.get("THCTotal").setValue(THCTotal.toFixed(2));
    this.THCAmountsForm.get("Advance").setValue(
      this.THCData?.Advance.toFixed(2)
    );
    this.THCAmountsForm.get("Balance").setValue(
      (THCTotal - this.THCData?.Advance).toFixed(2)
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
  submit() {
    const body = {
      THCAmountsForm: this.THCAmountsForm.value,
      THCAmountsLESSForm: this.THCAmountsLESSForm.value,
      THCAmountsADDForm: this.THCAmountsADDForm.value,
      THCData: this.THCData,
    };
    this.dialogRef.close({ data: body });
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
