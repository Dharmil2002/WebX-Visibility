import { Component, Input, OnInit } from '@angular/core';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { AddDcrSeriesControl } from 'src/assets/FormControls/add-dcr-series';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { processProperties } from '../../processUtility';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-dcr-series',
  templateUrl: './add-dcr-series.component.html'
})
export class AddDcrSeriesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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

  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };

  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "",
    },
    documentType: {
      name: "Document Type",
      key: "Dropdown",
      option: [],
      style: "",
    },
    bookCode: {
      name: "Book Code",
      key: "inputString",
      style: "",
    },
    seriesFrom: {
      name: "Series From",
      key: "input",
      style: "",
      functions: {
        'onChange': "getSeriesFrom" // Function to be called on change event
      }
    },
    seriesTo: {
      name: "Series To",
      key: "input",
      style: "",
      functions: {
        'onChange': "getSeriesFrom" // Function to be called on change event
      }
    },
    totalLeaf: {
      name: "Total Leaf",
      key: "input",
      style: "",
      readonly: true,
    },
    allotTo: {
      name: "Allot To",
      key: "Dropdown",
      option: [],
      style: "",
    },
    allocateTo: {
      name: "Allocate To",
      key: "Dropdown",
      option: [],
      style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    },
    allotType: {
      name: "",
      key: "",
      style: "",
    },
  };
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
  columnHeader = {
    documentType: {
      Title: "DocumentType",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    businessType: {
      Title: 'BusinessType',
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    bookCode: {
      Title: "BookCode",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    allotTo: {
      Title: "AllotTo",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    allocateTo: {
      Title: "AllocateTo",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    seriesFrom: {
      Title: "SeriesFrom",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    totalLeaf: {
      Title: "TotalLeaf",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    seriesTo: {
      Title: "SeriesTo",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  isUpdate = false
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  menuItemflag = true;
  staticField =
    [
      "documentType",
      "businessType",
      "bookCode",
      "allotTo",
      "allocateTo",
      "seriesFrom",
      "seriesTo",
      "totalLeaf"
    ]
  linkArray = [
  ];
  businessTypeList: any;
  userList: any;
  locationList: any;
  isLoad: boolean = false;
  vendorList: any;
  customerList: any;
  dcrDetail: any;
  constructor(
    public objSnackBarUtility: SnackBarUtilityService,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private router: Router,
  ) {
    super();
    this.initializeFormControl();
  }

  ngOnInit() {
    this.bindDropdown();
    this.getAllMastersData();
  }

  //#region to get all dropdown data
  async getAllMastersData() {
    try {
      this.addDcrTableForm.controls.allocateTo.setValue("");
      this.dcrDetail = await this.masterService.masterPost('generic/get', {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "dcr"
      }).toPromise();

      const fetchDataPromises = [
        this.masterService.masterPost('generic/get', {
          companyCode: this.companyCode,
          filter: {},
          collectionName: "location_detail"
        }).toPromise(),
        this.masterService.masterPost('generic/get', {
          companyCode: this.companyCode,
          filter: {},
          collectionName: "user_master"
        }).toPromise(),
        this.masterService.masterPost('generic/get', {
          companyCode: this.companyCode,
          filter: {},
          collectionName: "vendor_detail"
        }).toPromise(),
        this.masterService.masterPost('generic/get', {
          companyCode: this.companyCode,
          filter: {},
          collectionName: "customer_detail"
        }).toPromise()
      ];

      const [
        locationData,
        userData,
        vendorRes,
        customerRes
      ] = await Promise.all(fetchDataPromises);

      const mergedData = {
        locationData: locationData?.data,
        userData: userData?.data,
        vendorData: vendorRes?.data,
        customerData: customerRes?.data
      };

      this.locationList = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode,
      }));

      const allotToLocation = this.addDcrTableForm.controls['allotTo'].value;

      this.vendorList = mergedData.vendorData
        .filter(element =>
          element.isActive &&
          element.vendorLocation.some(location => location === allotToLocation.value)
        )
        .map(element => ({
          name: element.vendorName,
          value: element.vendorCode,
          type: "B"
        }));

      this.userList = mergedData.userData
        .filter(element =>
          element.isActive &&
          element.multiLocation.some(location => location === allotToLocation.value)
        )
        .map(element => ({
          name: element.name,
          value: element.userId,
          type: "E"
        }));

      this.customerList = mergedData.customerData
        .filter(element =>
          element.activeFlag &&
          Array.isArray(element.customerLocations) &&
          element.customerLocations.some(location => location === allotToLocation.value)
        )
        .map(element => ({
          name: element.customerName,
          value: element.customerCode,
          type: "C"
        }));

      this.businessTypeList = await this.masterService.getJsonFileDetails("businessTypeList").toPromise();

      const allData = [
        // { name: '---Location---', value: '', type: 'L' },
        // ...locdet,
        { name: '---Employee---', value: '', type: 'E' },
        ...this.userList,
        { name: '---BA---', value: '', type: 'B' },
        ...this.vendorList,
        { name: '---Customer---', value: '', type: 'C' },
        ...this.customerList,
      ];

      this.filter.Filter(this.jsonControlArray, this.addDcrTableForm, this.businessTypeList, this.businessType, this.businessTypeStatus);
      this.filter.Filter(this.jsonControlArray, this.addDcrTableForm, allData, this.allocateTo, this.allocateToStatus);
      this.filter.Filter(this.jsonControlArray, this.addDcrTableForm, this.locationList, this.allotTo, this.allotToStatus);

    } catch (error) {
      // Handle errors, e.g., show an error message or log the error
      console.error("Error in getAllMastersData:", error);
    }
  }
  //#endregion
  // Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  //#region to Save data
  async saveData() {
    clearValidatorsAndValidate(this.addDcrTableForm);
    // console.log(this.tableData);
    this.tableData.forEach(tableItem => {
      tableItem.status = 'Unused';
      tableItem.action = 'Allocated';
      tableItem.usedLeaves = 0;
      tableItem.entryBy = localStorage.getItem("UserName");
      tableItem.entryDate = new Date().toISOString();

    });
    // Now, add the 'id' property to each object in the 'tableData' array
    this.tableData = this.tableData.map(item => {
      return { ...item, _id: item.bookCode };
    });
    const dcrData = this.tableData.map(x => {
      const { actions, id, ...rest } = x;
      return rest;
    });
    // console.log(dcrData);
    // Continue with the rest of the code (e.g., exporting data)
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "dcr",
      data: dcrData
    };
    this.masterService.masterPost('generic/create', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.router.navigateByUrl('/Masters/DocumentControlRegister/TrackDCR');

        }
      }
    });
  }
  //#endregion
  cancel() {
    this.router.navigateByUrl('/Masters/DocumentControlRegister/TrackDCR');
  }
  //#region  to check unique book code
  async isBookCodeUnique(): Promise<boolean> {
    const bookCode = this.addDcrTableForm.value.bookCode;
    const foundItem = this.dcrDetail.data.find(x => x.bookCode === bookCode);

    // Check if any other item in the tableData has the same bookCode
    const isUnique = this.tableData.some((item) => item.bookCode === bookCode)
    if (isUnique || foundItem) {
      this.addDcrTableForm.controls['bookCode'].setValue('');
      // Show an error message using Swal (SweetAlert)
      Swal.fire({
        title: 'error',
        text: 'Book Code already exists! Please try with another.',
        icon: 'error',
        showConfirmButton: true,
      });
      this.tableLoad = false;
      this.isLoad = false;
      return false
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

    const extractedLetters = match[1];  // Will store the letters part, e.g., "AAA"
    const extractedNumber = match[2];   // Will store the number part as a string, e.g., "0001"

    // Calculate the result by parsing 'seriesFrom' and 'totalLeaf' to numbers
    const seriesFromNumber = parseInt(extractedNumber, 10);
    const totalLeafNumber = parseInt(totalLeaf, 10);

    const resultNumber = seriesFromNumber + totalLeafNumber;

    // Format the result with leading zeros to match the length of 'extractedNumber'
    const formattedResult = extractedLetters + resultNumber.toString().padStart(extractedNumber.length, '0');

    // Set the formatted value in the 'seriesTo' form control
    this.addDcrTableForm.controls.seriesTo.setValue(formattedResult);
  }
  //#endregion
  //#region to add data in table
  async addData() {
    try {
      // Set loading flags to indicate data is being processed
      this.tableLoad = true;
      this.isLoad = true;
      const tableData = this.tableData;
      const delayDuration = 1000;

      // Simulate a delay using async/await to mimic a loading state
      await new Promise((resolve) => setTimeout(resolve, delayDuration));

      // Create a new data entry using the form values
      const json = {
        id: tableData.length + 1,
        documentType: this.addDcrTableForm.value.documentType,
        businessType: this.addDcrTableForm.value.businessType?.value || '',
        bookCode: this.addDcrTableForm.value.bookCode,
        seriesFrom: this.addDcrTableForm.value.seriesFrom,
        // : startingSeriesNo,
        totalLeaf: this.addDcrTableForm.value.totalLeaf,
        seriesTo: this.addDcrTableForm.value.seriesTo,
        //seriesTo: endingSeriesNo,
        allotTo: this.addDcrTableForm.value.allotTo?.value || '',
        allocateTo: this.addDcrTableForm.value.allocateTo?.value || '',
        type: this.addDcrTableForm.value.allocateTo?.type || '',
        actions: ['Edit', 'Remove'],
      };

      // Add the new data entry to the table
      this.tableData.push(json);

      // Reset the form to clear input values
      this.addDcrTableForm.reset();
    } catch (error) {
      // Handle any potential errors, e.g., log them
      console.error(error);
    } finally {
      // Ensure that the loading flags are reset regardless of the outcome
      this.tableLoad = false;
    }
  }
  //#endregion
  //#region to bind dropdown
  bindDropdown() {
    const dcrPropertiesMapping = {
      businessType: { variable: "businessType", status: "businessTypeStatus" },
      allotTo: { variable: "allotTo", status: "allotToStatus" },
      allocateTo: { variable: "allocateTo", status: "allocateToStatus" },
    };
    processProperties.call(
      this,
      this.jsonControlArray,
      dcrPropertiesMapping
    );
  }
  //#endregion
  //#region to set or remove data in table
  handleMenuItemClick(data) {
    this.fillTable(data);
  }
  fillTable(data: any) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      // console.log(data);

      this.addDcrTableForm.controls['documentType'].setValue(data.data?.documentType || "");
      const businessTypeData = this.businessTypeList.find((x) => x.value == data.data.businessType)
      this.addDcrTableForm.controls.businessType.setValue(businessTypeData);
      this.addDcrTableForm.controls['bookCode'].setValue(data.data?.bookCode || "");
      this.addDcrTableForm.controls['seriesTo'].setValue(data.data?.seriesTo || "");
      this.addDcrTableForm.controls['seriesFrom'].setValue(data.data?.seriesFrom || "");
      this.addDcrTableForm.controls['totalLeaf'].setValue(data.data?.totalLeaf || "");
      const updatedAllotTo = this.locationList.find((x) => x.value == data.data.allotTo);
      this.addDcrTableForm.controls.allotTo.setValue(updatedAllotTo);
      const updatedAllocateTo = this.userList.find((x) => x.value == data.data.allocateTo);
      this.addDcrTableForm.controls.allocateTo.setValue(updatedAllocateTo);
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
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
      const regexPattern = await firstValueFrom(this.masterService.masterPost("generic/get", req));
      // console.log(regexPattern);

      const matchingPattern = regexPattern.data.find(pattern => pattern.cID === this.companyCode && pattern.dOCID === documentType);

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
      console.log("Max iterations reached. Consider adjusting the increment logic.");
    }

    // Include the endCode in the list
    codeList.push(endCode);

    return {
      count: codeList.length,
      list: codeList,
    };
  }
  nextKeyCode = (keyCode: string): string => {
    const ASCIIValues = [...keyCode].map(char => char.charCodeAt(0));

    const isAllZed = ASCIIValues.every(value => value === 90);
    const isAllNine = ASCIIValues.every(value => value === 57);
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
  }
  //#endregion
  //#region to validate Series From number
  checkValidation() {
    const startingSeriesNo = this.addDcrTableForm.controls.seriesFrom.value;

    // Use some() to check if the startingSeriesNo exists in any range
    const exists = this.dcrDetail.data.some(element => {
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