import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { convertNumericalStringsToInteger } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { BeneficiaryControl } from 'src/assets/FormControls/BeneficiaryMaster';
import Swal from 'sweetalert2';
import { handleFileSelection } from '../../vendor-master/vendor-utility';

@Component({
  selector: 'app-add-beneficiary-master',
  templateUrl: './add-beneficiary-master.component.html'
})
export class AddBeneficiaryMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  jsonHeaderControl: any
  jsonDetailControl: any
  beneficiaryHeaderForm: UntypedFormGroup
  beneficiaryDetailForm: UntypedFormGroup
  isUpdate: boolean = false;
  backPath: string;
  beneficiaryTabledata: any;
  action: string;
  isLoad: boolean;
  tableLoad: boolean;
  tableData: any = [];
  breadScrums: { title: string; items: string[]; active: string; }[];
  beneficiary: any;
  beneficiaryStatus: any;
  columnHeader = {
    accountCode: {
      Title: "Account Code",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    IFSCcode: {
      Title: "IFSC code",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    bankName: {
      Title: "Bank Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    branchName: {
      Title: "Branch Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    city: {
      Title: "City",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    UPIId: {
      Title: "UPI Id",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    uploadKYC: {
      Title: "Upload KYC",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    contactPerson: {
      Title: "Contact Person",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    mobileNo: {
      Title: "Mobile Number",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    emailId: {
      Title: "Email IDs",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
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
      'accountCode',
      'IFSCcode',
      'bankName',
      'branchName',
      'city',
      'UPIId',
      'uploadKYC',
      'contactPerson',
      'mobileNo',
      'emailId'
    ]
  linkArray = [
  ];
  toggleArray = []
  addFlag = true;
  newVendorCode: string;
  constructor(private route: Router, private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.beneficiaryTabledata = this.route.getCurrentNavigation().extras.state.data;
      // console.log(this.beneficiaryTabledata);

      this.action = 'edit';
      this.isUpdate = true;
      this.isLoad = true;
      this.tableLoad = true;
      // setting data in table at update time
      this.beneficiaryTabledata.otherdetails.forEach((item, index) => {
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
    const activeTitle = this.action === 'edit' ? 'Modify Beneficiary' : 'Add Beneficiary';
    this.breadScrums = [
      {
        title: activeTitle,
        items: ['Home'],
        active: activeTitle,
        //generatecontrol: true,
        //toggle: this.isUpdate ? this.vendorTabledata.isActive : false
      },
    ];
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.backPath = "/Masters/BeneficiaryMaster/BeneficiaryMasterList";
  }
  //#region to initialize form controls
  initializeFormControl() {
    const beneficiaryControls = new BeneficiaryControl();
    this.jsonHeaderControl = beneficiaryControls.getHeaderControl();
    this.beneficiaryHeaderForm = formGroupBuilder(this.fb, [this.jsonHeaderControl]);
    this.jsonDetailControl = beneficiaryControls.getDetailContol();
    this.beneficiaryDetailForm = formGroupBuilder(this.fb, [this.jsonDetailControl])
    this.jsonHeaderControl.forEach((data) => {
      if (data.name === "beneficiary") {
        // Set beneficiary -related variables
        this.beneficiary = data.name;
        this.beneficiaryStatus = data.additionalData.showNameAndValue;
      }
    });
    this.beneficiaryHeaderForm.controls["beneficiaryType"].setValue("Customer")
    if (this.isUpdate) {
      const location = this.beneficiaryTabledata.beneficiaryType.toLowerCase()
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue(`${location}_detail`);
      this.getBeneficiaryData();
    }

  }
  //#endregion
  //#region to save data
  async save() {
    clearValidatorsAndValidate(this.beneficiaryHeaderForm)
    clearValidatorsAndValidate(this.beneficiaryDetailForm)
    const newData = this.tableData.map(x => {
      const { actions, id, ...rest } = x;
      return rest;
    });
    const beneficiaryData = this.beneficiaryHeaderForm.value.beneficiary.value
    if (this.beneficiaryHeaderForm.value.beneficiaryType === 'customer_detail') {
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue('Customer');
    }
    if (this.beneficiaryHeaderForm.value.beneficiaryType === 'vendor_detail') {
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue('Vendor');
    }
    if (this.beneficiaryHeaderForm.value.beneficiaryType === 'driver_detail') {
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue('Driver');
    }
    if (this.beneficiaryHeaderForm.value.beneficiaryType === 'user_master') {
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue('Employee');
    }
    this.beneficiaryHeaderForm.controls['beneficiary'].setValue(beneficiaryData);
    this.beneficiaryHeaderForm.value.otherdetails = newData;
    // console.log(this.beneficiaryHeaderForm.value);
    let data = convertNumericalStringsToInteger(this.beneficiaryHeaderForm.value)
    if (this.isUpdate) {
      let id = data._id;
      data.otherdetails = newData;
      // Remove the "id" field from the form controls
      delete data._id;
      let req = {
        companyCode: this.companyCode,
        collectionName: "beneficiary_detail",
        filter: { _id: id },
        update: data
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
        this.route.navigateByUrl('/Masters/BeneficiaryMaster/BeneficiaryMasterList');
      }
    }
    else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "beneficiary_detail",
        filter: {},
      }
      const response = await this.masterService.masterPost("generic/get", req).toPromise()
      if (response) {
        // Generate srno for each object in the array
        const lastCode = response.data[response.data.length - 1];
        const last_id = lastCode ? parseInt(lastCode._id.substring(1)) : 0;
        // Function to generate a new route code
        function generateVendorCode(initialCode: number = 0) {
          const nextCode = initialCode + 1;
          const Number = nextCode.toString().padStart(4, '0');
          const Code = `B${Number}`;
          return Code;
        }
        this.newVendorCode = generateVendorCode(last_id);
        data._id = this.newVendorCode;
        // console.log(data);
        let req = {
          companyCode: this.companyCode,
          collectionName: "beneficiary_detail",
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
          this.route.navigateByUrl('/Masters/BeneficiaryMaster/BeneficiaryMasterList');
        }
      }
    }
  }
  //#endregion
  cancel() {
    this.route.navigateByUrl('/Masters/BeneficiaryMaster/BeneficiaryMasterList');
  }
  //#region to get beneficiary dropdown data based on beneficiarytype selection
  async getBeneficiaryData() {
    // Get the selected collection name from the form
    const collectionName = this.beneficiaryHeaderForm.controls.beneficiaryType.value;
    // Prepare the request object
    const request = {
      "companyCode": this.companyCode,
      "collectionName": collectionName,
      "filter": {}
    };

    // Make an asynchronous call to retrieve data from the master service
    const result = await this.masterService.masterPost("generic/get", request).toPromise();
    // Initialize an array to hold the dropdown data
    let dropdownData = [];

    // Use a switch statement to determine how to filter and map the data based on the collectionName
    switch (collectionName) {
      case 'user_master':
        dropdownData = this.filterDropdown(result.data, "isActive", "name", "userId");
        break;
      case 'driver_detail':
        dropdownData = this.filterDropdown(result.data, "activeFlag", "driverName", "manualDriverCode");
        break;
      case 'vendor_detail':
        dropdownData = this.filterDropdown(result.data, "isActive", "vendorName", "vendorCode");
        break;
      case 'customer_detail':
        dropdownData = this.filterDropdown(result.data, "activeFlag", "customerName", "customerCode");
        break;
    }
    if (this.isUpdate) {
      const data = dropdownData.find(
        x => x.customerName == this.beneficiaryTabledata.beneficiary.name
      )
      console.log(data);
      this.beneficiaryHeaderForm.controls['beneficiary'].setValue(data)
    }
    // Call the Filter function with the filtered dropdown data
    this.filter.Filter(
      this.jsonHeaderControl,
      this.beneficiaryHeaderForm,
      dropdownData,
      this.beneficiary,
      this.beneficiaryStatus
    );
  }

  // Helper function to filter and map data based on specific keys
  private filterDropdown(data, filterKey, nameKey, valueKey) {
    return data
      .filter((item) => item[filterKey]) // Filter based on the specified filterKey
      .map(e => ({
        name: e[nameKey], // Map the name to the specified nameKey
        value: e[valueKey] // Map the value to the specified valueKey
      }));
  }
  //#endregion
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
  //#region to add data to form
  async addData() {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    const accountCode = this.beneficiaryDetailForm.controls.accountCode.value;
    if (tableData.length > 0) {
      // Check if the gstNumber already exists in tableData
      const isDuplicate = this.tableData.some((item) => item.accountCode === accountCode);

      if (isDuplicate) {
        this.beneficiaryDetailForm.controls['accountCode'].setValue('');
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: 'Account Code already exists! Please try with another.',
          toast: true,
          icon: 'warning',
          title: 'Warning',
          showConfirmButton: true,
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
      accountCode: this.beneficiaryDetailForm.value.accountCode,
      IFSCcode: this.beneficiaryDetailForm.value.IFSCcode,
      bankName: this.beneficiaryDetailForm.value.bankName,
      branchName: this.beneficiaryDetailForm.value.branchName,
      city: this.beneficiaryDetailForm.value.city,
      UPIId: this.beneficiaryDetailForm.value.UPIId,
      uploadKYC: this.beneficiaryDetailForm.value.uploadKYC,
      contactPerson: this.beneficiaryDetailForm.value.contactPerson,
      mobileNo: this.beneficiaryDetailForm.value.mobileNo,
      emailId: this.beneficiaryDetailForm.value.emailId,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    this.beneficiaryDetailForm.reset(); // Reset form values
    this.isLoad = false;
    this.tableLoad = false;
  }
  //#endregion
  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    this.fillTable(data);
  }
  fillTable(data: any) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      this.beneficiaryDetailForm.controls['accountCode'].setValue(data.data?.accountCode || "");
      this.beneficiaryDetailForm.controls['IFSCcode'].setValue(data.data?.IFSCcode || "");
      this.beneficiaryDetailForm.controls['bankName'].setValue(data.data?.bankName || "");
      this.beneficiaryDetailForm.controls['branchName'].setValue(data.data?.branchName || "");
      this.beneficiaryDetailForm.controls['city'].setValue(data.data?.city || "");
      this.beneficiaryDetailForm.controls['UPIId'].setValue(data.data?.UPIId || "");
      this.beneficiaryDetailForm.controls['contactPerson'].setValue(data.data?.contactPerson || "");
      this.beneficiaryDetailForm.controls['mobileNo'].setValue(data.data?.mobileNo || "");
      this.beneficiaryDetailForm.controls['emailId'].setValue(data.data?.emailId || "");
      //this.beneficiaryDetailForm.controls['uploadKYC'].setValue(data.data?.uploadKYC || "");

      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  //#endregion
  //#region to upload Kyc image
  async uploadImage(event) {
    try {
      const field = event.field.name;
      const extensions = ["jpeg", "png", "jpg"];
      const fileList: FileList = event.eventArgs;
      const fileFormat = fileList[0].type.split('/')[1];

      // Check if the file format is valid
      if (!extensions.includes(fileFormat)) {
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a valid file format: ${extensions.join(', ')}`,
          showConfirmButton: true,
        });
        return; // Exit the function if the format is not valid
      }


      // Prepare the data for the HTTP request
      const formData = new FormData();
      formData.append('companyCode', this.companyCode);
      formData.append('docType', "Beneficiary");
      formData.append('docGroup', 'Master');
      formData.append('docNo', fileList[0].name);
      formData.append('file', fileList[0]);

      // Make the HTTP request
      const res = await this.masterService.masterPost("blob/upload", formData).toPromise();

      // Check if the request was successful
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Image uploaded successfully",
          showConfirmButton: true,
        });
      }
      //setting image file name in control
      this.beneficiaryDetailForm.controls['uploadKYC'].setValue(fileList[0].name);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  //#endregion
}