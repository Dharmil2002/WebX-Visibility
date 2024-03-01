import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/service/storage.service';
import { DocketStatus } from 'src/app/Models/docStatus';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-mr-generation-list',
  templateUrl: './delivery-mr-generation-list.component.html'
})
export class DeliveryMrGenerationListComponent implements OnInit {
  tableData: [] | any;
  tableload = true; // flag , indicates if data is still loading or not , used to show loading animation
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
      Style: "min-width:150px",
    },
    paymentType: {
      Title: "Pay Type",
      class: "matcolumnleft",
      Style: "min-width:130px",
    },
    contractParty: {
      Title: "Contract Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    orgdest: {
      Title: "Org-Dest",
      class: "matcolumnleft",
      Style: "min-width:130px",
    },
    noofPackages: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "min-width:70px",
    },
    actualWeight: {
      Title: "Actual Weight",
      class: "matcolumncenter",
      Style: "min-width:145px",
    },
    chargedWeight: {
      Title: "Charged Weight",
      class: "matcolumncenter",
      Style: "min-width:155px",
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
  constructor(
    private docketService: DocketService,
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getDocketDetails();
  }
  //#region to get docket details
  async getDocketDetails() {
    try {
      // Define query parameters for docket service
      const queryParameters = {
        cID: this.storage.companyCode,
        cLOC: this.storage.branch,
        sTS: { 'D$in': [DocketStatus.In_Delivery_Stock] }
      };

      // Fetch docket list based on the query parameters
      const data = await this.docketService.getDocketList(queryParameters);

      // Fetch mapping details for the docket data
      const modifiedData = await this.docketService.getMappingDocketDetails(data);

      // Fetch key performance indicators (KPI) data
      this.boxData = await this.docketService.kpiData(data);

      // Reverse the modified data and map it with additional actions
      this.tableData = modifiedData
        .reverse()
        .map(item => {

          // Extract the destination location from the event data
          const location = item.orgdest.split(":")[1].trim();
          let actions = '';

          // Check if the branch matches the specified branch
          if (this.storage.branch && this.storage.branch.trim() === location) {
            // Assign the action only if the condition is met

            actions = item.status === 'Del_Mr_Generated' ? '' : 'Delivery MR';
          }

          // Return the modified object
          return {
            ...item,
            Actions: actions
          };
        });

      // Set table load to false, indicating completion
      this.tableload = false;
    } catch (error) {
      this.tableData = [];
      this.tableload = false;
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

    // // Extract the destination location from the event data
    // const location = event.data.orgdest;

    // // Extract the branch information from the destination location
    // // and remove any leading or trailing whitespaces
    // const result = location.split(":")[1].trim();

    // // Check if the branch is defined and matches the extracted destination
    // if (this.branch && this.branch.trim() === result) {

    // If the branches match, navigate to the DeliveryMrGeneration page
    this.router.navigate(["/dashboard/DeliveryMrGeneration"], {
      state: {
        data: event
      },
    });
    // } else {
    //   // If the branches don't match, display an informative message using SweetAlert
    //   Swal.fire({
    //     icon: "info",
    //     title: "Current Branch doesn't match with Consignment Note destination",
    //     showConfirmButton: true,
    //   });

    //   // Return from the function to prevent further execution
    //   return;
    // }
  }
  //#endregion
}