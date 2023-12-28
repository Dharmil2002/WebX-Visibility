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
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryModalComponent } from './beneficiary-modal/beneficiary-modal.component';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-beneficiary-master',
  templateUrl: './add-beneficiary-master.component.html'
})
export class AddBeneficiaryMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  jsonHeaderControl: any
  jsonDetailControl: any
  beneficiaryHeaderForm: UntypedFormGroup
  isUpdate: boolean = false;
  backPath: string;
  beneficiaryTabledata: any;
  action: string;
  tableLoad: boolean = true;
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
  imageData: any = {};
  urlList: any = {};
  isEditable: boolean;
  url: any;
  editableData: any;
  constructor(private route: Router, private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private dialog: MatDialog,
    private storage: StorageService,
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.beneficiaryTabledata = this.route.getCurrentNavigation().extras.state.data;
      // console.log(this.beneficiaryTabledata);   

      this.action = 'edit';
      this.isUpdate = true;
      // setting data in table at update time
      this.beneficiaryTabledata.otherdetails.forEach((item, index) => {
        item.id = index + 1;
        item.actions = ['Edit', 'Remove'];
        // Push the modified object into this.tableData
        this.tableData.push(item);
      });

      this.beneficiaryTabledata.otherdetails.forEach(item => {
        this.urlList[item.accountCode] = item.uploadKYC;
      });
      this.tableData = this.tableData.map(item => ({
        ...item, // Spread the existing properties
        uploadKYC: "Done" // Replace the uploadKYC property
      }));
    } else {
      this.action = 'Add';
    }
    const activeTitle = this.action === 'edit' ? 'Modify Beneficiary' : 'Add Beneficiary';
    this.breadScrums = [
      {
        title: activeTitle,
        items: ['Home'],
        active: activeTitle,
      },
    ];
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.backPath = "/Masters/BeneficiaryMaster/BeneficiaryMasterList";
  }
  //#region to initialize form controls
  initializeFormControl() {
    const beneficiaryControls = new BeneficiaryControl(this.beneficiaryTabledata, this.isEditable);
    this.jsonHeaderControl = beneficiaryControls.getHeaderControl();
    this.beneficiaryHeaderForm = formGroupBuilder(this.fb, [this.jsonHeaderControl]);
    this.jsonHeaderControl.forEach((data) => {
      if (data.name === "beneficiary") {
        // Set beneficiary -related variables
        this.beneficiary = data.name;
        this.beneficiaryStatus = data.additionalData.showNameAndValue;
      }
    });
    this.beneficiaryHeaderForm.controls["beneficiaryType"].setValue("Customer")
    if (this.isUpdate) {
      const location = this.beneficiaryTabledata.beneficiaryType.toLowerCase();
      const updatedValue = location === 'employee' ? 'user_master' : `${location}_detail`;
      this.beneficiaryHeaderForm.controls['beneficiaryType'].setValue(updatedValue);
      this.getBeneficiaryData();
    }
  }
  //#endregion
  //#region to save data
  async save() {
    if (this.tableData.length === 0) {
      Swal.fire({
        text: 'Please Fill Beneficiary Details',
        icon: "warning",
        title: 'Warning',
        showConfirmButton: true,
      });
      return false
    }
    clearValidatorsAndValidate(this.beneficiaryHeaderForm)
    this.tableData = this.tableData.map(item => ({
      ...item,
      uploadKYC: this.urlList[item.accountCode]
    }));
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
      let id = this.beneficiaryTabledata._id;
      data["mODDT"] = new Date();
      data['mODLOC'] = this.storage.branch;
      data['mODBY:'] = this.storage.userName;
      data.otherdetails = newData;
      // Remove the "id" field from the form controls
      delete data._id;
      let req = {
        companyCode: this.companyCode,
        collectionName: "beneficiary_detail",
        filter: { _id: id },
        update: data
      };
      const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
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
      const response = await firstValueFrom(this.masterService.masterPost("generic/get", req))
      if (response) {
        const sortedData = response.data.sort((a, b) => a._id.localeCompare(b._id));
        const lastCode = sortedData[sortedData.length - 1];
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
        data["eNTDT"] = new Date();
        data['eNTLOC'] = this.storage.branch;
        data['eNTBY:'] = this.storage.userName;

        let req = {
          companyCode: this.companyCode,
          collectionName: "beneficiary_detail",
          data: data
        };
        const res = await firstValueFrom(this.masterService.masterPost("generic/create", req))
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
    const result = await firstValueFrom(this.masterService.masterPost("generic/get", request));
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
        x => x.name === this.beneficiaryTabledata.beneficiary
      )
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

  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      this.url = this.urlList[data.data.accountCode]
      const beneficiaryDetails = this.tableData.find(x => x.id == data.data.id);
      this.addDetails(beneficiaryDetails)
    }
  }
  //#endregion 
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const EditableId = event?.id
    const request = {
      beneficiaryList: this.tableData,
      Details: event,
      url: this.url
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(BeneficiaryModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          accountCode: result.accountCode,
          IFSCcode: result.IFSCcode,
          bankName: result.bankName,
          branchName: result.branchName,
          city: result.city,
          UPIId: result.UPIId,
          uploadKYC: "Done",
          contactPerson: result.contactPerson,
          mobileNo: result.mobileNo,
          emailId: result.emailId,
          actions: ['Edit', 'Remove']
        }
        this.tableData.push(json);
        this.tableLoad = true
        this.urlList = {
          ...this.urlList,  // Initialize as an empty object if urlList is undefined
          [json.accountCode]: result.uploadKYC
        };
      }
      this.tableLoad = true;
    });
  }
  //#endregion
  //#region to check Duplicate Beneficiary
  async checkDuplicate() {
    try {
      // Create a request object to fetch data from "beneficiary_detail" collection
      const req = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "beneficiary_detail",
      };

      // Make the API call and await the response
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));;
      const newBeneficiary = this.beneficiaryHeaderForm.value.beneficiary.value;
      const isDuplicate = res.data.some((item) => item.beneficiary === newBeneficiary);
      if (isDuplicate) {
        // Show an error message using Swal
        Swal.fire({
          text: `Beneficiary : ${newBeneficiary} already exists! Please try with another.`,
          icon: 'warning',
          title: 'Warning',
          showConfirmButton: true,
        });
        this.beneficiaryHeaderForm.controls['beneficiary'].setValue('');
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error (e.g., show an error message to the user).
    }
  }

  //#endregion
}