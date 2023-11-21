import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/add-contract-profile';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-contract-basic-information',
  templateUrl: './vendor-contract-basic-information.component.html'
})
export class VendorContractBasicInformationComponent implements OnInit {
  @Input() contractData: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;
  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";
  VendorBasicInformationControls: AddContractProfile;
  contractBranchCode: any;
  contractBranchCodeStatus: any;
  imageData: any = {};

  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };


  linkArray = [];
  menuItems = [];

  toggleArray = [
  ];
  addFlag = true
  tableLoad = true
  vendorName: any;
  vendorStatus: any;
  vendorList: any;
  constructor(private fb: UntypedFormBuilder,
    private objImageHandling: ImageHandling,
    private objVendorService: VendorService,
    private dialog: MatDialog,
    private route: Router,
    private masterService: MasterService,

  ) {

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    let newData = changes.contractData.currentValue;

    // Parse start date
    newData.cNSDT = this.isValidDateFormat(newData.cNSDT) ? this.parseAndFormatDate(newData.cNSDT) : newData.cNSDT;

    // // Parse end date
    newData.eNDDT = this.isValidDateFormat(newData.eNDDT) ? this.parseAndFormatDate(newData.eNDDT) : newData.eNDDT;

    // Initialize form controls with updated data
    this.initializeFormControl(newData);

    // Set manager based on vendor ID
    this.setManager(newData.vNID);
  }
  //#region to format date
  parseAndFormatDate(dateString: string): string {
    // Extract day, month, and year from the input date string
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a Date object using the correct order: month-day-year
    const parsedDate = new Date(year, month - 1, day);

    // Get the ISO string representation in UTC format
    return parsedDate.toISOString();
  }

  isValidDateFormat(dateString) {
    // Define a regular expression for the "DD-MM-YYYY" format
    const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;

    // Check if the date string matches the pattern
    return dateFormatRegex.test(dateString);
  }
  //#endregion
  //#region to initialize form control
  initializeFormControl(newData) {
    // Create the 'VendorBasicInformationControls' using 'AddContractProfile' with 'data'
    this.VendorBasicInformationControls = new AddContractProfile(newData);

    // Get the array of form controls from 'VendorBasicInformationControls'
    this.jsonControlArrayProductsForm = this.VendorBasicInformationControls.getAddContractProfileArrayControls();

    // Create the 'ProductsForm' using 'formGroupBuilder' with 'jsonControlArrayProductsForm'
    this.ProductsForm = formGroupBuilder(this.fb, [this.jsonControlArrayProductsForm]);
  }
  //#endregion  
  //#region functionCallHandler
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  //#endregion
  //#region to save contract details
  async save() {
    // Clone the form value to avoid modifying the original form data
    const data = { ...this.ProductsForm.value };

    // Remove unnecessary properties
    delete data.vendor;
    delete data.CNID;

    // Get the file using objImageHandling and set it in the corresponding control name
    const file = this.objImageHandling.getFileByKey('cNSCN', this.imageData);
    data.cNSCN = file;
    data.pNDYS = parseInt(this.ProductsForm.value.pNDYS)
    // data.UPDT=new Date(this.ProductsForm.value.UPDT)
    // Prepare request body using object destructuring
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "vendor_contract",
      filter: { _id: this.contractData._id },
      update: { ...data }
    };

    try {
      // Make the API call to update the contract
      const res = await this.masterService.masterPut("generic/update", reqBody).toPromise();

      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: 'Contract Updated Successfully',
          showConfirmButton: true,
        });

        // Navigate to the vendor contract list page
        this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }
  //#endregion
  //#region  to call cancel  
  cancel() {
    this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
  }
  //#endregion
  //#region to upload Contract Scan
  async onFileSelected(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "cNSCN", this.ProductsForm, this.imageData, "VendorContract", 'Master', this.jsonControlArrayProductsForm, allowedFormats);
  }
  //#endregion
  //#region to get the selected vendor code from the 'ProductsForm' value
  async setManager(vendorcode) {
    // Fetch the vendor details for the selected vendor code using 'objVendorService'
    const manager = await this.objVendorService.getVendorDetail({ vendorCode: vendorcode });

    // Set the 'vendorManager' form control's value to the manager's value from the retrieved data
    this.ProductsForm.controls['vNMGR'].setValue(manager[0].vendorManager);
  }
  //#endregion
  //#region to preview image
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
  //#region to set pending Days
  setDays() {
    const startDate = new Date(this.ProductsForm.value.eNDDT);
    const endDate = new Date(this.ProductsForm.value.cNSDT);

    // Calculate the difference in milliseconds
    const timeDifference = Math.abs(startDate.getTime() - endDate.getTime());

    // Calculate the number of days
    const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    this.ProductsForm.controls.pNDYS.setValue(numberOfDays)
  }
  //#endregion
}