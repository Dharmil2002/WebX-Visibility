import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';

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
    "Express Route based",
    "Long Haul full truck- route based",
    "Long Haul lane based",
    "Trip Lane Based (Location - Area)",
    "Last mile delivery",
    "Business Associate"         
  ];
  CurrentContractDetails: any;
  selectedFolder: string;
  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,) {
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)
    });
    this.selectFolder('Basic Information')
  }

  selectFolder(folder: string) {
    this.selectedFolder = folder;
    // Add logic to handle folder selection
  }
  ngOnInit(): void {
  }

}