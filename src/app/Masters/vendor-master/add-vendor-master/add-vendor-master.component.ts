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
  vendorFormControls: VendorControl;
  jsonControlVendorArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  data: any;
  vLocation: any;
  vLocationStatus: any;
  vendorCity: any;
  vendorCityStatus: any;
  tdsSection: any;
  tdsSectionStatus: any;
  tdsType: any;
  tdsTypeStatus: any;
  lspName: any;
  lspNameStatus: any;
  vendorTypDetail: any;
  vendorTypeData: any;
  tdsSectionData: any;
  tdsTypeData: any;
  lspNameData: any;
  tdsSectionDetail: any;
  tdsTypeDetail: any;
  lspNameDetail: any;
  SelectFile: File;
  imageName: string;
  selectedFiles: boolean;
  vendorPinCodeStatus: any;
  vendorPinCode: any;
  pincodeResponse: any;
  pincodeData: any;
  newVendorCode: string;


  constructor(
    private route: Router, private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vendorTabledata = this.route.getCurrentNavigation().extras.state.data;
      console.log(this.vendorTabledata);
      
      this.action = 'edit';
      this.isUpdate = true;
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

    const vendorPropertyMap = {
      'vendorType': { property: 'vendorType', statusProperty: 'vendorTypeStatus' },
      'vendorLocation': { property: 'vLocation', statusProperty: 'vLocationStatus' },
      'vendorPinCode': { property: 'vendorPinCode', statusProperty: 'vendorPinCodeStatus' },
    };

    this.jsonControlVendorArray.forEach(data => {
      const mapping = vendorPropertyMap[data.name];
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
  getPincode() {
    const pincodeValue = this.vendorTableForm.controls['vendorPinCode'].value
    // Check if pincodeValue is a valid number and has at least 3 characters
    if (!isNaN(pincodeValue) && pincodeValue.length >= 3) {
      // Find an exact pincode match in the pincodeDet array
      const exactPincodeMatch = this.pincodeData.find(element => element.name === pincodeValue);

      if (!exactPincodeMatch) {
        // Filter pincodeDet for partial matches
        const filteredPincodeDet = this.pincodeData.filter(element =>
          element.name.includes(pincodeValue)
        );

        if (filteredPincodeDet.length === 0) {
          // Show a popup indicating no data found for the given pincode
          Swal.fire({
            icon: "info",
            title: "No Data Found",
            text: `No data found for pincode ${pincodeValue}`,
            showConfirmButton: true,
          });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            this.jsonControlVendorArray,
            this.vendorTableForm,
            filteredPincodeDet,
            this.vendorPinCode,
            this.vendorPinCodeStatus
          );
        }
      }
    }
  }
  async save() {
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
      console.log(req);
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
        let req = {
          companyCode: this.companyCode,
          collectionName: "vendor_detail",
          data: data
        };
        console.log(req);
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
  //#region to set city,state,country
  async setStateCityData() {
    const fetchData = this.pincodeResponse.data.find(item =>
      item.PIN == this.vendorTableForm.controls.vendorPinCode.value.value)
    this.vendorTableForm.controls.vendorCity.setValue(fetchData.city)
    const request = {
      "companyCode": this.companyCode,
      "collectionName": "state_master",
      "filter": { ST: fetchData.ST }
    };

    // Fetch pincode data
    const state = await this.masterService.masterPost('generic/get', request).toPromise();
    this.vendorTableForm.controls.vendorState.setValue(state.data[0].STNM)
    this.vendorTableForm.controls.vendorCity.setValue(fetchData.CT);
    this.masterService.getJsonFileDetails("countryList").subscribe((res) => {
      const countryName = res.find(x => x.Code == state.data[0].CNTR)
      this.vendorTableForm.controls["vendorCountry"].setValue(countryName.Country);
    })
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
}