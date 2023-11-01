import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-contract-basic-information',
  templateUrl: './vendor-contract-basic-information.component.html' 
})
export class VendorContractBasicInformationComponent implements OnInit {
  @Input() contractData: any;

  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  constructor() { }

  ngOnInit(): void {
  }

}
