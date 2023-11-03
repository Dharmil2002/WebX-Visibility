import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
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

  folders = [
    "Express Route based",
    "Long Haul full truck- route based",
    "Long Haul lane based",
    "Trip Lane Based (Location - Area)",
    "Last mile delivery",
    "Business Associate"
  ];
  selectedContractType: string;
  constructor(private fb: UntypedFormBuilder,
    private objImageHandling: ImageHandling,


  ) {

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    const data = changes.contractData?.currentValue
    this.initializeFormControl(data);
  }
  initializeFormControl(data) {
    this.VendorBasicInformationControls = new AddContractProfile(data);
    this.jsonControlArrayProductsForm = this.VendorBasicInformationControls.getAddContractProfileArrayControls();
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);


  }
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

  }
  cancel() {

  }
  //#region to upload Contract Scan
  async onFileSelected(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "contractScan", this.ProductsForm, this.imageData, "VendorContract", 'Master', this.jsonControlArrayProductsForm);
  }
  //#endregion


}