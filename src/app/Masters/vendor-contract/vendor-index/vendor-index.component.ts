import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { VendorContractListingService } from 'src/app/core/service/vendor-contract-listing.service';

@Component({
  selector: 'app-vendor-index',
  templateUrl: './vendor-index.component.html'
})
export class VendorIndexComponent implements OnInit {
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Vendor Contract",
    },
  ];
  folders = [
    "Basic Information",
    "Services Selection",
  ];
  selectedFolders = [];
  CurrentContractDetails: any;
  selectedFolder: string;
  selectedContractType: any;

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,
    private contractService: VendorContractListingService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
    });
    this.selectFolder('Basic Information')
  }

  selectFolder(folder: string) {
    this.selectedFolder = folder;
  }
  ngOnInit() {
    this.contractService.getContractType().subscribe((contractTypes) => {
      this.processData(contractTypes);
    });
  }

  processData(contractTypes: any[]) {
    // Process the data after receiving it in the subscription
    const selectedContractTypeData = contractTypes.map(item => item.replace('Transportation- ', ''));
    this.selectedFolders = this.folders.concat(selectedContractTypeData)
  }
}