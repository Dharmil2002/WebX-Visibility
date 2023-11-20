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
    // Update isSelected based on previousContractType
    // if (this.previousContractType) {
    //   // Iterate through tableData and update isSelected based on previousContractType
    //   this.tableData.forEach((item) => {
    //     item.isSelected = this.previousContractType.includes(item.typeName);
    //   });
    // }

  }



  ngOnInit() {

  }

  async selectCheckBox(event) {
    // Create a new array to store the selected contract types
    this.selectedContractType = event
      // .filter(item => item.isSelected)
      .map(item => item.typeName);
    console.log(event);
    this.objContractService.setContractType(this.selectedContractType);

    const newService = event.map((element, index) => ({
      _id: index + 1, // Increment index to start from 1
      service_id:  index + 1,
      service_name: element.typeName,
      active: element.isSelected
    }));
    console.log(newService);


    // const reqBody = {
    //   companyCode: this.companyCode,
    //   collectionName: "vndr_cnt_service",
    //   filter: {},
    //   // update: { ...data }
    // };


    // // Make the API call to update the contract
    // const res = await this.masterService.masterPut("generic/create", reqBody).toPromise();
  }
  async getServiceData() {
    const data = await PayBasisdetailFromApi(this.masterService, "VSTYP");
    // Filter the ContractTypeData based on the data from the API
    this.tableData = this.ContractType
      .filter((contractType) =>
        data.some((apiContractType) => apiContractType.name.includes(contractType.typeName))
      );
    this.tableLoad = false;

    // if (this.previousContractType) {
    //   // Iterate through tableData and update isSelected based on previousContractType
    //   this.tableData.forEach(item => {
    //     if (this.previousContractType.includes(item.typeName)) {
    //       item.isSelected = true;
    //     } else {
    //       item.isSelected = false;
    //     }
    //   });
    // }
    console.log(this.tableData);
  }
}