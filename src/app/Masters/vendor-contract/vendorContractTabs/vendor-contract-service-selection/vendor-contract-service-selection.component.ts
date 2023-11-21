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
    // selectAllorRenderedData : false,
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
    // Create a new array to store the selected contract types
    this.selectedContractType = event
      .map(item => item.typeName);
    console.log(event);
    this.objContractService.setContractType(this.selectedContractType);

    // Create a new array for saving
    const newService = event.map((element, index) => ({
      _id: index + 1, // Increment index to start from 1
      service_id: index + 1,
      service_name: element.typeName,
      active: element.isSelected
    }));

    this.save(newService);
  }
  //#endregion
  //#region to get services from collection
  async getServiceData() {
    // Step 1: Fetch data from the API
    const data = await PayBasisdetailFromApi(this.masterService, "VSTYP");

    // Step 2: Filter the ContractTypeData based on the data from the API
    this.tableData = this.ContractType
      .filter((contractType) =>
        data.some((apiContractType) => apiContractType.name.includes(contractType.typeName))
      );

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
  async save(data) {
    try {
      const collectionName = "vndr_cnt_service";
      const existingData = await this.fetchExistingData()
      // Find services in 'data' that are not in 'existingData'
      const newServices = data.filter(item => {
        return !existingData.some(existingItem => existingItem.service_name === item.service_name);
      });

      let updateServices = existingData.filter(item => {
        return !data.some(existingItem => existingItem.service_name === item.service_name);
      });

      let updateId = await this.fetchExistingData()

      updateId = updateId.filter(item => {
        return item.active === false
        //updateServices ? !updateServices.some(existingItem => existingItem.service_name === item.service_name) :

      });
      // console.log(updateId);
      updateServices = updateServices.length > 0 ? updateServices : updateId
      const Id = updateServices[0]._id
      updateServices.map(x => {
        delete x._id;
        x.active = !x.active; // Toggle the active flag
      })
      // console.log(updateServices, updateId);

      newServices.map(x => {
        x._id = existingData.length + 1, x.service_id = existingData.length + 1

      })

      if (existingData.length === 0) {
        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          data: data,
        };
        console.log(createRequest);

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();
      }
      if (newServices.length > 0) {
        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          data: newServices,
        };
        console.log(createRequest);

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();
      }
      if (updateServices) {
        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          filter: { _id: Id },
          update: updateServices[0]
        }
        console.log(createRequest);

        const updateResponse = await this.masterService.masterPut("generic/update", createRequest).toPromise();
        // console.log(updateResponse);

      }
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }
  //#endregion
}