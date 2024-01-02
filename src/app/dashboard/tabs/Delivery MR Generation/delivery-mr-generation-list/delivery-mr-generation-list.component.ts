import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import Swal from 'sweetalert2';
import { getDocketDetailsFromApi, kpiData } from '../../../stocks/stockCommon';

@Component({
  selector: 'app-delivery-mr-generation-list',
  templateUrl: './delivery-mr-generation-list.component.html'
})
export class DeliveryMrGenerationListComponent implements OnInit {
  tableData: [] | any;
  tableload = true; // flag , indicates if data is still loading or not , used to show loading animation
  drillDownPath: string;
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = false;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
 
  linkArray = [{ Row: "Action", Path: "Masters/Docket/EwayBillDocketBookingV2" }];

  toggleArray = [];
 
  columnHeader = {
    no: {
      Title: "Cnote",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    date: {
      Title: "Date of Cnote",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    paymentType: {
      Title: "Pay Type",
      class: "matcolumnleft",
      Style: "max-width:70px",
    },
    contractParty: {
      Title: "Contract Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    orgdest: {
      Title: "Org-Dest",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    noofPackages: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    actualWeight: {
      Title: "Act Wt",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    chargedWeight: {
      Title: "Chg Wt",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  branch = localStorage.getItem("Branch");

  staticField = [
    "no",
    "date",
    "paymentType",
    "contractParty",
    "orgdest",
    "noofPackages",
    "actualWeight",
    "chargedWeight",
    "status"
  ];
  boxData: any[];
  constructor(private operationService: OperationService) { }

  ngOnInit(): void {
    this.getDocketDetails();
  }
  async getDocketDetails() {
    try {
      // Send request and await response
      const modifiedData = await getDocketDetailsFromApi(
        this.companyCode,
        this.branch,
        this.operationService
      );

      // Generate KPI data based on the modified data
      this.boxData = kpiData(modifiedData);

      // Update tableData property with the modified data
      this.tableData = modifiedData.map(x => ({
        ...x, Action: "Delivery MR Generation"
      }));

      console.log(modifiedData);
      // Set tableload to false to indicate that the table loading is complete
      this.tableload = false;
    } catch (error) {
      // Handle error by displaying an error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Oops! Something went wrong. Please try again later.",
        showConfirmButton: true,
      });
    }
  }
}
