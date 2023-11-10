import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/add-contract-profile';

@Component({
  selector: 'app-vendor-contract-basic-information',
  templateUrl: './vendor-contract-basic-information.component.html'
})
export class VendorContractBasicInformationComponent implements OnInit {
  @Input() contractData: any;

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
    private filter: FilterUtils,
    private dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
    this.getVendorList();
  }
  ngOnChanges(changes: SimpleChanges) {
    const data = changes.contractData?.currentValue
    this.initializeFormControl(data);
  }
  //#region to initialize form control
  initializeFormControl(data) {
    // Create the 'VendorBasicInformationControls' using 'AddContractProfile' with 'data'
    this.VendorBasicInformationControls = new AddContractProfile(data);

    // Get the array of form controls from 'VendorBasicInformationControls'
    this.jsonControlArrayProductsForm = this.VendorBasicInformationControls.getAddContractProfileArrayControls();

    // Create the 'ProductsForm' using 'formGroupBuilder' with 'jsonControlArrayProductsForm'
    this.ProductsForm = formGroupBuilder(this.fb, [this.jsonControlArrayProductsForm]);

    // Iterate through the form control array to find the 'vendor' control and set related properties
    this.jsonControlArrayProductsForm.forEach(data => {
      if (data.name === 'vendor') {
        this.vendorName = data.name; // Store the name of the 'vendor' control
        this.vendorStatus = data.additionalData.showNameAndValue; // Store the showNameAndValue property
      }
    });
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
  save() {
   console.log(this.ProductsForm.value);
  }
  cancel() {

  }
  //#region to upload Contract Scan
  async onFileSelected(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "contractScan", this.ProductsForm, this.imageData, "VendorContract", 'Master', this.jsonControlArrayProductsForm);
  }
  //#endregion
  //#region to get vendor List
  async getVendorList() {
    // Fetch the vendor list using the 'objVendorService' service
    this.vendorList = await this.objVendorService.getVendorDetail('');

    // Filter the vendor list based on the 'isActive' property
    const vendor = this.vendorList
      .filter((item) => item.isActive) // Filter based on the isActive property
      .map(e => ({
        name: e.vendorName, // Map the name to the specified nameKey
        value: e.vendorCode // Map the value to the specified valueKey
      }));

    // Call the 'Filter' function with the filtered 'vendor' array and other parameters
    this.filter.Filter(this.jsonControlArrayProductsForm, this.ProductsForm, vendor, this.vendorName, this.vendorStatus);
  }
  //#endregion
  //#region to get the selected vendor code from the 'ProductsForm' value
  async setManager() {
    const vendorcode = this.ProductsForm.value.vendor.value;

    // Fetch the vendor details for the selected vendor code using 'objVendorService'
    const manager = await this.objVendorService.getVendorDetail({ vendorCode: vendorcode });

    // Set the 'vendorManager' form control's value to the manager's value from the retrieved data
    this.ProductsForm.controls['vendorManager'].setValue(manager[0].vendorManager);
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
}