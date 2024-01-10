import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import Swal from 'sweetalert2';
import { getDocketDetailsFromApi, kpiData } from '../../../stocks/stockCommon';
import { Router } from '@angular/router';

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

  linkArray = [];

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
    Actions: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:90px",
      type: "Link",
      functionName: "validateLocation"
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
  constructor(private operationService: OperationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getDocketDetails();
  }
  //#region to get docket details
  async getDocketDetails() {
    try {
      this.tableload = true;
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
        ...x, Actions: "Delivery MR Generation"
      }));

      // Set tableload to false to indicate that the table loading is complete
      this.tableload = false;
    } catch (error) {
      // Handle error by displaying an error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Oops! Something went wrong                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           . Please try again later.",
        showConfirmButton: true,
      });
    }
  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  // #region to validate if the current branch matches the Consignment Note destination
  validateLocation(event) {

    // Extract the destination location from the event data
    const location = event.data.orgdest;

    // Extract the branch information from the destination location
    // and remove any leading or trailing whitespaces
    const result = location.split(":")[1].trim();

    // Check if the branch is defined and matches the extracted destination
    if (this.branch && this.branch.trim() === result) {

      // If the branches match, navigate to the DeliveryMrGeneration page
      this.router.navigate(["/dashboard/DeliveryMrGeneration"], {
        state: {
          data: event
        },
      });
    } else {
      // If the branches don't match, display an informative message using SweetAlert
      Swal.fire({
        icon: "info",
        title: "Current Branch doesn't match with Consignment Note destination",
        showConfirmButton: true,
      });

      // Return from the function to prevent further execution
      return;
    }
  }
  //#endregion
}