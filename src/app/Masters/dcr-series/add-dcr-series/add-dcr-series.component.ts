import { Component, Input, OnInit } from "@angular/core";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import Swal from "sweetalert2";
import { AddDcrSeriesControl } from "src/assets/FormControls/add-dcr-series";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { processProperties } from "../../processUtility";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-dcr-series",
  templateUrl: "./add-dcr-series.component.html",
})
export class AddDcrSeriesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @Input() data: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  // Breadcrumbs
  breadScrums = [
    {
      title: "Add DCR Series",
      items: ["Document Control"],
      active: "Add DCR Series",
    },
  ];

  // Table data
  tableData: any = [];

  tableLoad: boolean;
  addDcrFormControl: AddDcrSeriesControl;
  jsonControlArray: any;
  addDcrTableForm: UntypedFormGroup;
  allotTo: string;
  allotToStatus: boolean;
  allocateTo: string;
  allocateToStatus: boolean;
  businessTypeStatus: boolean;
  businessType: string;

  isUpdate = false;

  businessTypeList: any;
  userList: any;
  locationList: any;
  isLoad: boolean = false;
  vendorList: any;
  customerList: any;
  dcrDetail: any;
  backPath: string;
  constructor(
    public objSnackBarUtility: SnackBarUtilityService,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private router: Router
  ) {
    super();
    this.initializeFormControl();
  }

  ngOnInit() {
    this.bindDropdown();
    this.getAllMastersData();
    this.backPath="/Operation/DCRManagement"
  }

  //#region to get all dropdown data
  async getAllMastersData() {
    try {
      // this.addDcrTableForm.controls.allocateTo.setValue("");
      this.dcrDetail = await this.masterService
        .masterPost("generic/get", {
          companyCode: this.companyCode,
          filter: {},
          collectionName: "dcr",
        })
        .toPromise();
      // console.log(this.dcrDetail)
      this.businessTypeList = await this.masterService
        .getJsonFileDetails("businessTypeList")
        .toPromise();

      this.filter.Filter(
        this.jsonControlArray,
        this.addDcrTableForm,
        this.businessTypeList,
        this.businessType,
        this.businessTypeStatus
      );
    } catch (error) {
      // Handle errors, e.g., show an error message or log the error
      console.error("Error in getAllMastersData:", error);
    }
  }
  //#endregion
  // Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  //#region to Save data
  async saveData() {
    // console.log(this.addDcrTableForm.value);
    const bookCodereq = {
      companyCode: this.companyCode,
      collectionName: "dcr",
      filter: {},
    };
    const bookCoderes = await firstValueFrom(
      this.masterService.masterPost("generic/get", bookCodereq)
    );
    const bookCoderesLength = parseInt(bookCoderes.data.length);

    const dcrBodyData = {
      // _id: this.addDcrTableForm.value.bookCode + "-" + (bookCoderesLength + 1),
      // _id: `${cID}-${tYP}-${bOOK}`,
      _id:(this.companyCode) + "-" + (this.addDcrTableForm.value.documentType) + "-" + (this.addDcrTableForm.value.bookCode),
      cID: this.companyCode,
      tYP: this.addDcrTableForm.value.documentType,
      bOOK: this.addDcrTableForm.value.bookCode,
      fROM: this.addDcrTableForm.value.seriesFrom,
      tO: this.addDcrTableForm.value.seriesTo,
      pAGES: this.addDcrTableForm.value.totalLeaf,
      eNTBY: localStorage.getItem("UserName"),
      eNTDT: new Date(),
      eNTLOC: localStorage.getItem("Branch"),
    };

    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "dcr",
      data: dcrBodyData,
    };
    this.masterService.masterPost("generic/create", req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.router.navigateByUrl(
            "/Operation/DCRManagement"
          );
        }
      },
    });
  }
  //#endregion
  async allocate() {
    this.router.navigateByUrl("/Masters/AddDCR/DCRAllocation");
  }
  //#region  to check unique book code
  async isBookCodeUnique(): Promise<boolean> {
    const bookCode = this.addDcrTableForm.value.bookCode;
    const foundItem = this.dcrDetail.data.find((x) => x.bookCode === bookCode);

    // Check if any other item in the tableData has the same bookCode
    const isUnique = this.tableData.some((item) => item.bookCode === bookCode);
    if (isUnique || foundItem) {
      this.addDcrTableForm.controls["bookCode"].setValue("");
      // Show an error message using Swal (SweetAlert)
      Swal.fire({
        title: "error",
        text: "Book Code already exists! Please try with another.",
        icon: "error",
        showConfirmButton: true,
      });
      this.tableLoad = false;
      this.isLoad = false;
      return false;
    }
  }
  //#endregion
  //#region to Initialize form control
  initializeFormControl() {
    this.addDcrFormControl = new AddDcrSeriesControl();
    this.jsonControlArray = this.addDcrFormControl.getAddDcrFormControls();
    this.addDcrTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    // this.addDcrTableForm.controls["documentType"].setValue("dkt");
  }
  //#endregion
  //#region to set series to.
  getSeriesTo() {
    // Get the 'seriesFrom' and 'totalLeaf' values from the form control
    const { seriesFrom, totalLeaf } = this.addDcrTableForm.value;
    const match = seriesFrom.match(/([a-zA-Z]+)(\d+)/);

    const extractedLetters = match[1]; // Will store the letters part, e.g., "AAA"
    const extractedNumber = match[2]; // Will store the number part as a string, e.g., "0001"

    // Calculate the result by parsing 'seriesFrom' and 'totalLeaf' to numbers
    const seriesFromNumber = parseInt(extractedNumber, 10);
    const totalLeafNumber = parseInt(totalLeaf, 10);

    const resultNumber = seriesFromNumber + totalLeafNumber;

    // Format the result with leading zeros to match the length of 'extractedNumber'
    const formattedResult =
      extractedLetters +
      resultNumber.toString().padStart(extractedNumber.length, "0");

    // Set the formatted value in the 'seriesTo' form control
    this.addDcrTableForm.controls.seriesTo.setValue(formattedResult);
  }
  //#endregion

  //#region to bind dropdown
  bindDropdown() {
    const dcrPropertiesMapping = {
      businessType: { variable: "businessType", status: "businessTypeStatus" },
    };
    processProperties.call(this, this.jsonControlArray, dcrPropertiesMapping);
  }
  //#endregion
  //#region to set or remove data in table
  // handleMenuItemClick(data) {
  //   this.fillTable(data);
  // }
  // fillTable(data: any) {
  //   if (data.label.label === "Remove") {
  //     this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
  //   } else {
  //     // console.log(data);

  //     this.addDcrTableForm.controls["documentType"].setValue(
  //       data.data?.documentType || ""
  //     );
  //     const businessTypeData = this.businessTypeList.find(
  //       (x) => x.value == data.data.businessType
  //     );
  //     this.addDcrTableForm.controls.businessType.setValue(businessTypeData);
  //     this.addDcrTableForm.controls["bookCode"].setValue(
  //       data.data?.bookCode || ""
  //     );
  //     this.addDcrTableForm.controls["seriesTo"].setValue(
  //       data.data?.seriesTo || ""
  //     );
  //     this.addDcrTableForm.controls["seriesFrom"].setValue(
  //       data.data?.seriesFrom || ""
  //     );
  //     this.addDcrTableForm.controls["totalLeaf"].setValue(
  //       data.data?.totalLeaf || ""
  //     );
  //     const updatedAllotTo = this.locationList.find(
  //       (x) => x.value == data.data.allotTo
  //     );
  //     this.addDcrTableForm.controls.allotTo.setValue(updatedAllotTo);
  //     const updatedAllocateTo = this.userList.find(
  //       (x) => x.value == data.data.allocateTo
  //     );
  //     this.addDcrTableForm.controls.allocateTo.setValue(updatedAllocateTo);
  //     this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
  //   }
  // }
  //#endregion
  //#region to set pattern from json
  async getPattern() {
    try {
      const documentType = this.addDcrTableForm.value.documentType;
      const req = {
        companyCode: this.companyCode,
        collectionName: "dcr_rules",
        filter: {},
      };
      const regexPattern = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );
      // console.log(regexPattern);

      const matchingPattern = regexPattern.data.find(
        (pattern) =>
          pattern.cID === this.companyCode && pattern.dOCID === documentType
      );

      if (!matchingPattern || !matchingPattern.rEQ) {
        console.log("No matching patterns found.");
        return;
      }
      const controlName = "seriesFrom"; // Change this to match your control's name
      const control = this.addDcrTableForm.get(controlName);

      if (control) {
        const customValidations = [
          Validators.required, // Add the required validator with its default error message
          Validators.pattern(matchingPattern.rRGXPTRN), // Add the pattern validator with its default error message
        ];

        // Set custom error messages for required and pattern validations
        control.setValidators(customValidations);

        control.updateValueAndValidity(); // Update the control's validity

        // console.log(control);
      } else {
        console.log("Control not found.");
      }
    } catch (error) {
      console.error("Error while fetching regex patterns:", error);
    }
  }
  //#endregion
  //#region of logic To check series number from  table
  getCodesBetween = (
    startCode: string,
    endCode: string,
    maxIterations: number = 10000
  ): { count: number; list: string[] } => {
    const codeList: string[] = [];
    let currentCode = startCode;
    let iterations = 0;

    while (currentCode !== endCode && iterations < maxIterations) {
      codeList.push(currentCode);
      currentCode = this.nextKeyCode(currentCode);
      iterations++;
    }

    if (iterations === maxIterations) {
      console.log(
        "Max iterations reached. Consider adjusting the increment logic."
      );
    }

    // Include the endCode in the list
    codeList.push(endCode);

    return {
      count: codeList.length,
      list: codeList,
    };
  };
  nextKeyCode = (keyCode: string): string => {
    const ASCIIValues = [...keyCode].map((char) => char.charCodeAt(0));

    const isAllZed = ASCIIValues.every((value) => value === 90);
    const isAllNine = ASCIIValues.every((value) => value === 57);
    const stringLength = ASCIIValues.length;

    if (isAllZed) {
      return keyCode;
    }

    if (isAllNine) {
      ASCIIValues[stringLength - 1] = 47;
      ASCIIValues[0] = 65;

      for (let i = 1; i < stringLength - 1; i++) {
        ASCIIValues[i] = 48;
      }
    }

    for (let i = stringLength; i > 0; i--) {
      if (i - stringLength === 0) {
        ASCIIValues[i - 1] += 1;
      }

      if (ASCIIValues[i - 1] === 58) {
        ASCIIValues[i - 1] = 48;

        if (i - 2 === -1) {
          break;
        }

        ASCIIValues[i - 2] += 1;
      } else if (ASCIIValues[i - 1] === 91) {
        ASCIIValues[i - 1] = 65;

        if (i - 2 === -1) {
          break;
        }

        ASCIIValues[i - 2] += 1;
      } else {
        break;
      }
    }
    keyCode = String.fromCharCode(...ASCIIValues);
    return keyCode;
  };
  //#endregion
  //#region to validate Series From number
  checkValidation() {
    const startingSeriesNo = this.addDcrTableForm.controls.seriesFrom.value;

    // Use some() to check if the startingSeriesNo exists in any range
    const exists = this.dcrDetail.data.some((element) => {
      const result = this.getCodesBetween(element.seriesFrom, element.seriesTo);
      return result.list.includes(startingSeriesNo);
    });

    if (exists) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: `This Series No: ${startingSeriesNo} already exists. Please enter another SeriesFrom number.`,
        showConfirmButton: true,
      });

      this.addDcrTableForm.controls.seriesFrom.setValue("");
    }

    return !exists; // Return whether the series number is valid
  }
  //#endregion
}
