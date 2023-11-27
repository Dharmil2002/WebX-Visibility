import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractTypeData } from '../../vendor-contract-list/VendorStaticData';
import { VendorContractListingService } from 'src/app/core/service/vendor-contract-listing.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';

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
  //#endregion


  constructor(
    private sessionService: SessionService,
    private objContractService: VendorContractListingService,
    private masterService: MasterService
  ) {
    this.companyCode = this.sessionService.getCompanyCode();

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
    // Step 1: Update the selected contract types
    this.selectedContractType = event
      .filter(item => item.isSelected)
      .map(item => item.typeName);

    // Log the selected event for debugging
    //console.log("Selected Event:", event);

    // Step 2: Set the selected contract types using a service
    this.objContractService.setContractType(this.selectedContractType);

    // Step 3: Fetch existing data
    const existingData = await this.fetchExistingData();

    // Step 4: Identify items that need updating based on mismatches
    const itemsToUpdate = event
      .filter(newItem => {
        const existingItem = existingData.find(existingItem =>
          newItem.typeName === existingItem.service_name
        );

        // Check for a mismatch in selection status
        return existingItem && newItem.isSelected !== existingItem.active;
      });

    // Log the items that need updating for debugging
    //console.log("Items to Update:", itemsToUpdate);

    // Step 5: Prepare data for saving
    const saveData = itemsToUpdate.length > 0 ? itemsToUpdate : event.map(element => ({
      _id: element._id,
      service_id: element._id,
      service_name: element.typeName,
      active: element.isSelected
    }));

    // Log the data to be saved for debugging
    //console.log("Data to Save:", saveData);

    // Step 6: Determine if it's an update or a new save
    const isUpdate = itemsToUpdate.length > 0;

    // Step 7: Save the data
    this.save(saveData, isUpdate);
  }

  //#endregion
  //#region to get services from collection
  async getServiceData() {
    // Step 1: Fetch data from the API
    const data = await PayBasisdetailFromApi(this.masterService, "VSTYP");

    // Step 2: Filter the ContractTypeData based on the data from the API
    this.tableData = this.ContractType.map(contractType => {
      const matchingService = data.find(apiContractType =>
        apiContractType.name.toLowerCase().includes(contractType.typeName.toLowerCase())
      );

      return {
        ...contractType,
        _id: matchingService?.value || null  // Use null or a default value if matchingService is not found
      };
    });

    // Step 3: Fetch existing data
    const existingData = await this.fetchExistingData();

    // Step 4: Extract active service names from existing data
    this.selectedContractType = existingData
      .filter(item => item.active)
      .map(item => item.service_name);

    // Step 5: Set the active service names in the shared service
    this.objContractService.setContractType(this.selectedContractType);

    // Step 6: Store the previousContractType for comparison
    this.previousContractType = this.selectedContractType;

    // Step 7: Update isSelected property based on previousContractType
    if (this.previousContractType) {
      this.tableData.forEach(item => {
        item.isSelected = this.previousContractType.includes(item.typeName);
      });
    }

    // Step 8: Set tableLoad flag to indicate that table data loading is complete
    this.tableLoad = false;
  }
  //#endregion
  //#region to get existing data 
  async fetchExistingData() {
    // Fetch existing data for creating a new contract
    const request = {
      companyCode: this.companyCode,
      collectionName: "vndr_cnt_service",
      filter: {},
    };

    const response = await this.masterService.masterPost("generic/get", request).toPromise();
    return response.data;
  }
  //#endregion
  //#region to save service 
  async save(data, isUpdate) {
    // console.log(data, isUpdate);

    try {
      const collectionName = "vndr_cnt_service";
      if (!isUpdate) {
        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          data: data,
        };
        // console.log(createRequest);

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();
      } else {
        const Id = data[0]._id
        const flag = data[0].isSelected
        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          filter: { _id: Id },
          update: { active: flag }
        }
        // console.log(createRequest);

        const updateResponse = await this.masterService.masterPut("generic/update", createRequest).toPromise();
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }
  //#endregion
}