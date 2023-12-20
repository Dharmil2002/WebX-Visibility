import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractTypeData } from '../../vendor-contract-list/VendorStaticData';
import { VendorContractListingService } from 'src/app/core/service/vendor-contract-listing.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';

@Component({
  selector: 'app-vendor-contract-service-selection',
  templateUrl: './vendor-contract-service-selection.component.html'
})
export class VendorContractServiceSelectionComponent implements OnInit {
  companyCode: any;
  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad = true;
  isTableLoad: boolean = true;
  // tableData = ContractTypeData
  tableData: any[];
  ContractType = ContractTypeData
  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]

  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ["checkBoxRequired"],
  };
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    type: {
      Title: "Type",
      class: "matcolumnleft",
      Style: "max-width:120px",
    },
    typeName: {
      Title: "Type",
      class: "matcolumnleft",
      //Style: "max-width:300px",
    },
    mode: {
      Title: "Mode",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },

  };
  staticField = [
    "type",
    "typeName",
    "mode"
  ];
  selectedContractType: any[] = []; // Initialize as an empty array
  previousContractType: any;
  contractDetails: any;
  //#endregion


  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private sessionService: SessionService,
    private objContractService: VendorContractListingService,
    private masterService: MasterService
  ) {
    this.companyCode = this.sessionService.getCompanyCode();
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.contractDetails = JSON.parse(decryptedData)
      // console.log(this.CurrentContractDetails.cNID);      
    });
    // Retrieving the array from session storage
    this.objContractService.getContractType().subscribe((contractTypes) => {
      this.previousContractType = contractTypes;
    });
    this.getServiceData()
  }

  ngOnInit() {

  }

  //#region to call function on change of service selection
  async selectCheckBox(event) {

    //  Update the selected contract types
    this.selectedContractType = event
      .filter(item => item.isSelected)
      .map(item => item.typeName);

    this.objContractService.setContractType(this.selectedContractType);
    this.save(this.selectedContractType);
  }
  //#endregion
  //#region to get services from collection
  async getServiceData() {

    // Step 1: Fetch data from the API
    const data = await PayBasisdetailFromApi(this.masterService, "VSTYP");

    // Map ContractType and find matching service in data
    this.tableData = this.ContractType.map(contractType => {
      const matchingService = data.find(apiContractType =>
        apiContractType.name.toLowerCase().includes(contractType.typeName.toLowerCase())
      );

      return {
        ...contractType,
        _id: matchingService?.value || null
      };
    });

    // Update isSelected property based on previousContractType
    this.tableData = this.tableData.map(contractType => ({

      ...contractType,
      isSelected: this.previousContractType ? this.previousContractType.includes(contractType.typeName) : false
    }));
    // Step 8: Set tableLoad flag to indicate that table data loading is complete
    this.tableLoad = false;
  }
  //#endregion

  //#region to save service 
  async save(data) {

    const updateData = {
      sERVSELEC: data
    };

    // Prepare request body using object destructuring
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "vendor_contract",
      filter: { _id: this.contractDetails._id },
      update: { ...updateData }
    };

    // Make the API call to update the contract
    const res = await this.masterService.masterPut("generic/update", reqBody).toPromise();
  }
  //#endregion
}