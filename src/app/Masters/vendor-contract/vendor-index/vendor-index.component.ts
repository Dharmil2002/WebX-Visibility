import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { VendorContractListingService } from 'src/app/core/service/vendor-contract-listing.service';

@Component({
  selector: 'app-vendor-index',
  templateUrl: './vendor-index.component.html'
})
export class VendorIndexComponent implements OnInit {
  breadscrums: { title: string; items: string[]; active: string; }[];
  folders = [
    "Basic Information",
    "Services Selection",
  ];
  selectedFolders = [];
  CurrentContractDetails: any;
  selectedFolder: string;
  selectedContractType: any;
  backPath: string;

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,
    private contractService: VendorContractListingService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
      this.breadscrums = [
        {
          title: "Vendor Contract / " + this.CurrentContractDetails.vNID + ":" + this.CurrentContractDetails.vNNM,
          items: ["Home"],
          active: "Vendor Contract",
        },
      ];
      console.log(this.CurrentContractDetails);
      this.selectedContractType = this.CurrentContractDetails?.sERVSELEC;
      //   Set the selected contract types using a service
      this.contractService.setContractType(this.selectedContractType);

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
    this.backPath = "/Masters/VendorContract/VendorContractList";
  }

  processData(contractTypes: any[]) {
    this.selectedFolders = this.folders.concat(contractTypes)
  }
}