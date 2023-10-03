import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";
import { VendorControl } from "src/assets/FormControls/vendor-control";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { convertNumericalStringsToInteger } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { Subject, take, takeUntil } from "rxjs";
import { handleFileSelection } from "../vendor-utility";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";

@Component({
  selector: 'app-add-vendor-master',
  templateUrl: './add-vendor-master.component.html',
})
export class AddVendorMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  vendorTabledata: VendorMaster;
  vendorTableForm: UntypedFormGroup;
  otherDetailForm: UntypedFormGroup;
  vendorFormControls: VendorControl;
  jsonControlVendorArray: any;
  jsonControlOtherArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  data: any;
  vLocation: any;
  vLocationStatus: any;
  vendorCity: any;
  vendorCityStatus: any;
  vendorTypDetail: any;
  vendorTypeData: any;
  vendorPinCodeStatus: any;
  vendorPinCode: any;
  pincodeResponse: any;
  pincodeData: any;
  newVendorCode: string;
  tableData: any = [];
  tableLoad: boolean;
  isLoad: boolean;
  gstPincode: string;
  gstPincodeStatus: boolean;
  addFlag = true;
  columnHeader = {
    gstNumber: {
      Title: "GST Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    gstState: {
      Title: "GST State",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    gstAddress: {
      Title: "GST Address",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    gstPincode: {
      Title: "GST Pincode",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    gstCity: {
      Title: "GST City",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
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
      'gstNumber',
      'gstState',
      'gstAddress',
      'gstPincode',
      'gstCity',
    ]
  linkArray = [
  ];
  constructor(
    private route: Router, private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objPinCodeService: PinCodeService,
    private objState: StateService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vendorTabledata = this.route.getCurrentNavigation().extras.state.data;

      this.action = 'edit';
      this.isUpdate = true;
      this.isLoad = true;
      this.tableLoad = true;
      // setting data in table at update time
      this.vendorTabledata.otherdetails.forEach((item, index) => {
        item.id = index + 1;
        item.actions = ['Edit', 'Remove'];

        // Push the modified object into this.tableData
        this.tableData.push(item);
      });
      this.isLoad = false;
      this.tableLoad = false;
    } else {
      this.action = 'Add';
    }
    const activeTitle = this.action === 'edit' ? 'Edit Vendor' : 'Add Vendor';
    this.breadScrums = [
      {
        title: 'Vendor Master',
        items: ['Home'],
        active: activeTitle,
      },
    ];

    if (this.action !== 'edit') {
      this.vendorTabledata = new VendorMaster({});
    }
    this.initializeFormControl()
  }
  ngOnInit(): void {
    this.getDropDownData();
    this.getAllMastersData();
  }
  // Function to handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    const vehicleFormControls = new VendorControl(this.vendorTabledata, this.isUpdate);
    this.jsonControlVendorArray = vehicleFormControls.getVendorFormControls();
    this.vendorTableForm = formGroupBuilder(this.fb, [this.jsonControlVendorArray]);
    this.jsonControlOtherArray = vehicleFormControls.getVendorOtherInfoFormControls();
    this.otherDetailForm = formGroupBuilder(this.fb, [this.jsonControlOtherArray])
    const vendorPropertyMap = {
      'vendorType': { property: 'vendorType', statusProperty: 'vendorTypeStatus' },
      'vendorLocation': { property: 'vLocation', statusProperty: 'vLocationStatus' },
      'vendorPinCode': { property: 'vendorPinCode', statusProperty: 'vendorPinCodeStatus' },
    };
    const OtherDetails = {
      'gstPincode': { property: "gstPincode", statusProperty: 'gstPincodeStatus' }
    }
    this.jsonControlVendorArray.forEach(data => {
      const mapping = vendorPropertyMap[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlOtherArray.forEach(data => {
      const mapping = OtherDetails[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        vendorTypeDropdown,
      } = res;
      this.vendorTypeData = vendorTypeDropdown;
      if (this.isUpdate) {
        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vendorTabledata.vendorType);
        this.vendorTableForm.controls.vendorType.setValue(this.vendorTypDetail);
      }
      const filterParams = [
        [this.jsonControlVendorArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
      ];

      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.vendorTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }
  selectHandleFileSelection(data, allowedExtensions) {
    switch (data.field.name) {
      case 'panCardScan':
        allowedExtensions = ["jpeg", "png", "jpg"];
        break;
      case 'msmeScan':
        allowedExtensions = ["jpeg", "png", "jpg"];
        break;
      default:
        allowedExtensions = [];
        break;
    }
    handleFileSelection(data, data.field.name, allowedExtensions, this.vendorTableForm);
  }
  /*get All Master Data*/
  async getAllMastersData() {
    try {
      const reqBody = {
        "companyCode": this.companyCode,
        "collectionName": "location_detail",
        "filter": {}
      }
      const pincodeBody = {
        "companyCode": this.companyCode,
        "collectionName": "pincode_master",
        "filter": {}
      }
      const locationBranchResponse = await this.masterService.masterPost("generic/get", reqBody).toPromise();
      this.pincodeResponse = await this.masterService.masterPost("generic/get", pincodeBody).toPromise();
      const locationBranchList = locationBranchResponse.data.map((x) => { { return { name: x.locName, value: x.locCode } } })
      this.pincodeData = this.pincodeResponse.data
        .map((element) => ({
          name: element.PIN.toString(),
          value: element.PIN.toString(),
        }));
      // Handle the response from the server
      if (this.isUpdate) {
        this.vendorTableForm.controls["vendorLocationDropdown"].patchValue(locationBranchList.filter((element) =>
          this.vendorTabledata.vendorLocation.includes(element.name)
        ));
        const updatedData = this.pincodeData.find((x) => x.name == this.vendorTabledata.vendorPinCode);
        this.vendorTableForm.controls.vendorPinCode.setValue(updatedData);
      }
      this.filter.Filter(this.jsonControlVendorArray, this.vendorTableForm, locationBranchList, this.vLocation, this.vLocationStatus);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    }
  }
  //#region to call pincode
  getPincode() {
    this.objPinCodeService.validateAndFilterPincode(this.vendorTableForm, this.jsonControlVendorArray, 'vendorPinCode', this.vendorPinCodeStatus);
  }
  getGstPincode() {
    this.objPinCodeService.validateAndFilterPincode(this.otherDetailForm, this.jsonControlOtherArray, 'gstPincode', this.gstPincodeStatus);
  }
  //#endregion

  async save() {
    clearValidatorsAndValidate(this.otherDetailForm)
    clearValidatorsAndValidate(this.vendorTableForm)
    const formValue = this.vendorTableForm.value;
    const controlNames = [
      "vendorType",
      "vendorPinCode",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.vendorTableForm.controls[controlName].setValue(controlValue);
    });
    const vendorLocationDropdown1 = this.vendorTableForm.value.vendorLocationDropdown.map((item: any) => item.name);
    this.vendorTableForm.controls["vendorLocation"].setValue(vendorLocationDropdown1);
    this.vendorTableForm.removeControl('vendorLocationDropdown');
    this.vendorTableForm.removeControl('');
    Object.values(this.vendorTableForm.controls).forEach(control => control.setErrors(null));
    // Remove  field from the form controls
    let data = convertNumericalStringsToInteger(this.vendorTableForm.value)

    const newData = this.tableData.map(x => {
      const { actions, id, ...rest } = x;
      return rest;
    });
    this.vendorTableForm.value.otherdetails = newData;

    if (this.isUpdate) {
      let id = data._id;
      // Remove the "id" field from the form controls
      delete data._id;
      let req = {
        companyCode: this.companyCode,
        collectionName: "vendor_detail",
        filter: { _id: id },
        update: this.vendorTableForm.value
      };
      const res = await this.masterService.masterPut("generic/update", req).toPromise()
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
      }
    }
    else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "vendor_detail",
        filter: {},
      }
      const resVendor = await this.masterService.masterPost("generic/get", req).toPromise()
      if (resVendor) {
        // Generate srno for each object in the array
        const lastCode = resVendor.data[resVendor.data.length - 1];
        const lastVendorCode = lastCode ? parseInt(lastCode.vendorCode.substring(1)) : 0;
        // Function to generate a new route code
        function generateVendorCode(initialCode: number = 0) {
          const nextVendorCode = initialCode + 1;
          const vendorNumber = nextVendorCode.toString().padStart(4, '0');
          const vendorCode = `V${vendorNumber}`;
          return vendorCode;
        }
        this.newVendorCode = generateVendorCode(lastVendorCode);
        data.vendorCode = this.newVendorCode;
        data._id = this.newVendorCode;
        const newData = this.tableData.map(x => {
          const { actions, id, ...rest } = x;
          return rest;
        });

        data.otherdetails = newData;
        let req = {
          companyCode: this.companyCode,
          collectionName: "vendor_detail",
          data: data
        };
        const res = await this.masterService.masterPost("generic/create", req).toPromise()
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
        }
      }
    }
  }
  cancel() {
    this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
  }
  //#region to Set the vendor's city and state based on the provided PIN code
  async setStateCityData() {
    try {
      const fetchData = this.pincodeResponse.data.find(item =>
        item.PIN == this.vendorTableForm.controls.vendorPinCode.value.value);

      // Set the vendor's city
      this.vendorTableForm.controls.vendorCity.setValue(fetchData.CT);

      // Fetch and set the state name based on the state code
      const stateName = await this.objState.fetchStateByFilterId(fetchData.ST);
      this.vendorTableForm.controls.vendorState.setValue(stateName[0].STNM);

      // Fetch and set the vendor's country based on the state's country code
      this.masterService.getJsonFileDetails('countryList').subscribe((res) => {
        const country = res.find(x => x.Code === stateName[0]?.CNTR);
        const countryName = country?.Country || '';
        this.vendorTableForm.controls.vendorCountry.setValue(countryName);
      });
    } catch (error) {
      console.error('An error occurred while setting state and city data:', error);
    }
  }

  // Set the GST state based on the provided GST number
  async setState() {
    try {
      const gstNumber = this.otherDetailForm.value.gstNumber;
      const filterId = gstNumber.substring(0, 2);

      // Fetch and set the GST state name based on the state code
      const stateName = await this.objState.fetchStateByFilterId(filterId);
      this.otherDetailForm.controls.gstState.setValue(stateName[0].STNM);
    } catch (error) {
      console.error('An error occurred while setting the GST state:', error);
    }
  }

  // Set the GST city based on the provided GST pincode
  setGSTCity() {
    try {
      const fetchData = this.pincodeResponse.data.find(item =>
        item.PIN == this.otherDetailForm.controls.gstPincode.value.value);

      // Set the GST city
      this.otherDetailForm.controls.gstCity.setValue(fetchData.CT);
    } catch (error) {
      console.error('An error occurred while setting the GST city:', error);
    }
  }
  //#endregion

  protected _onDestroy = new Subject<void>();
  // function handles select All feature of all multiSelect fields of one form.
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlVendorArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlVendorArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vendorTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  //#region to check if a value already exists in vendor list
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.vendorTableForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "vendor_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const userlist = await this.masterService.masterPost("generic/get", req).toPromise();

      // Check if data exists for the given filter criteria
      if (userlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK"
        });

        // Reset the input field
        this.vendorTableForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }

  // Function to check if ERP Id already exists
  async CheckPANNo() {
    await this.checkValueExists("panNo", "PAN No");
  }
  async CheckVendorName() {
    await this.checkValueExists("vendorName", "Vendor Name");
  }
  async CheckCINnumber() {
    await this.checkValueExists("cinNumber", "CIN number");
  }
  async CheckmsmeNumber() {
    await this.checkValueExists("msmeNumber", "MSME Number");
  }
  //#endregion

  async addData() {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    const gstNumber = this.otherDetailForm.controls.gstNumber.value;
    if (tableData.length > 0) {
      // Check if the gstNumber already exists in tableData
      const isDuplicate = this.tableData.some((item) => item.gstNumber === gstNumber);

      if (isDuplicate) {
        this.otherDetailForm.controls['gstNumber'].setValue('');
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: 'GST Number already exists! Please try with another.',
          toast: true,
          icon: 'error',
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false
      }
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      gstNumber: this.otherDetailForm.value.gstNumber,
      gstState: this.otherDetailForm.value.gstState,
      gstAddress: this.otherDetailForm.value.gstAddress,
      gstPincode: this.otherDetailForm.value.gstPincode.value,
      gstCity: this.otherDetailForm.value.gstCity,
      // invoice: false,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    this.otherDetailForm.reset(); // Reset form values
    this.isLoad = false;
    this.tableLoad = false;
  }

  handleMenuItemClick(data) {
    this.fillTable(data);
  }
  fillTable(data: any) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      this.otherDetailForm.controls['gstNumber'].setValue(data.data?.gstNumber || "");
      this.otherDetailForm.controls['gstState'].setValue(data.data?.gstState || "");
      this.otherDetailForm.controls['gstAddress'].setValue(data.data?.gstAddress || "");
      const updatedData = this.pincodeData.find((x) => x.name == data.data.gstPincode);
      this.otherDetailForm.controls.gstPincode.setValue(updatedData);
      this.otherDetailForm.controls['gstCity'].setValue(data.data?.gstCity || "");
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  //#region to check Vendor emails
  onChangeEmail() {
    const input = this.vendorTableForm.value.emailId.trim();
    var emailAddresses = input.split(","); // Split the input string into an array of email addresses
    // Define the email validation regular expression
    var emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/;
    var validEmails = [];
    var invalidEmails = [];
    // Loop through each email address and validate it
    for (var i = 0; i < emailAddresses.length; i++) {
      var email = emailAddresses[i].trim(); // Remove any leading/trailing whitespace
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }
    if (invalidEmails.length > 0) {
      let EmailString = "";
      invalidEmails.forEach((x) => {
        EmailString = `${EmailString != ""
          ? EmailString + "<li style='margin:0px;'>" + x + "<li>"
          : "<li style='margin:0px;'>" + x + "<li>"
          }`;
      });
      Swal.fire({
        title: 'This Email is not valid. Please try with another!',
        toast: true,
        icon: 'error',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
      this.vendorTableForm.controls['emailId'].setValue(validEmails.join(','))
    }
  }
  //#endregion
}