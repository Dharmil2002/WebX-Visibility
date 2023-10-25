import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';

@Component({
  selector: 'app-customer-contract-tabs-index',
  templateUrl: './customer-contract-tabs-index.component.html',
})
export class CustomerContractTabsIndexComponent implements AfterViewInit {
  breadscrums = [
    {
      title: "Customer Contract",
      items: ["Home"],
      active: "Customer Contract",
    },
  ];
  CurrentContractDetails: any;
  selectedTabIndex = 0;
  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
    });
    this.selectFolder('Contract Summary')
  }
  folders = [
    "Contract Summary",
    "Services Selection",
    "Freight Charge Matrix",
    "Non Freight Charges",
    "ODA Matrix",
    "Fuel Price Hike Matrix"
  ];
  selectedFolder: string | undefined;
  ngOnInit(): void {
  }
  selectFolder(folder: string) {
    this.selectedFolder = folder;
    // Add logic to handle folder selection
  }

  ngAfterViewInit(): void {
    //this.basicInfo;

  }
}