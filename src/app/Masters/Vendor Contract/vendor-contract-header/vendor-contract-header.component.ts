import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { VendorContract } from 'src/app/core/models/Masters/Vendor Contract/VendorContract';
@Component({
  selector: 'app-vendor-contract-header',
  templateUrl: './vendor-contract-header.component.html',
})
export class VendorContractHeaderComponent {
  @Input() formItem!: any
  @Input() data!:any
  VendorDetails: VendorContract;
  constructor(private router: Router)
  {

  }
  GotoListing()
  {
    this.router.navigate(['/Masters/VendorContract/VendorContractList']);
  }

}
