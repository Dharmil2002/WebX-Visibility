import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractTypeData } from '../../vendor-contract-list/VendorStaticData';
import { VendorContractListingService } from 'src/app/core/service/vendor-contract-listing.service';

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
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData = ContractTypeData

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


  constructor(private sessionService: SessionService, private objContractService: VendorContractListingService) {
    this.companyCode = this.sessionService.getCompanyCode()
    // Retrieving the array from session storage
    this.objContractService.getContractType().subscribe((contractTypes) => {
      this.previousContractType = contractTypes;
    });

    if (this.previousContractType) {
      // Iterate through tableData and update isSelected based on previousContractType
      this.tableData.forEach(item => {
        if (this.previousContractType.includes(item.typeName)) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
      });
    }
  }


  ngOnInit() {
  }

  selectCheckBox(event) {
    // Create a new array to store the selected contract types
    this.selectedContractType = event
      .filter(item => item.isSelected)
      .map(item => item.typeName);
    // console.log(this.selectedContractType);
    this.objContractService.setContractType(this.selectedContractType);
  }
}