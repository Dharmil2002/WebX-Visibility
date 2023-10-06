import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';

@Component({
  selector: 'app-docket-list',
  templateUrl: './docket-list.component.html'
})
export class DocketListComponent implements OnInit {
    /*Below is for the table displaye data */
    tableData: any;
    tableLoad: boolean;
   /* column header is for the changes css or title in the table*/
  columnHeader = {
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "max-width:300px",
    },
    vehicleNo: {
      Title: "Vehicle No",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    docketNumber: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "max-width:250px",
    },
    ftCity: {
      Title: "From-To City",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    transMode: {
      Title: "Trans Mode",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    actualWeight: {
      Title: "Actual Weight",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    }
  };
  //#endregion

  /*which field you displayed in a table Must Declare here*/
  staticField = [
    "billingParty",
    "vehicleNo",
    "docketNumber",
    "ftCity",
    "transMode",
    "actualWeight"
  ];

  /*.......End................*/
  /* here the varible declare for menu Item option Both is required */
  menuItems=[{label:"Edit Docket"}]
  menuItemflag: boolean = true;
  TableStyle = "width:85%"
  /*.......End................*/
  /*Here the Controls which Is Hide search or add Button in table*/
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  /*.......End................*/

  addAndEditPath='Operation/ConsignmentEntry';
  // menuItems = [{label:"Edit Docket"},{label:"View"}];

  constructor(
    private operationService: OperationService,
    private router: Router
    ) {
    this.getShipmentDetail();
  }

  ngOnInit(): void {
  }

  async getShipmentDetail() {

    const shipmentList = await getShipment(this.operationService, false);
    this.tableData = shipmentList.map((x) => {
      const actualWeights = [x].map((item) => {
        return item ? calculateTotalField(item.invoiceDetails, 'actualWeight') : 0;
      });
      // Sum all the calculated actualWeights
      const totalActualWeight = actualWeights.reduce((acc, weight) => acc + weight, 0);
      x.actualWeight = totalActualWeight,
      x.ftCity=`${x.fromCity}-${x.toCity}`,
      x.actions=x.status=="0"?["Edit Docket"]:""
      return x; // Make sure to return x to update the original object in the 'tableData' array.
    });
    //this.tableData = [];
    this.tableLoad = false;
  }

  async handleMenuItemClick(data) {
    if (data.label.label === "Edit Docket") {
      this.router.navigate(['/Operation/ConsignmentEntry'], {
        state: {
          data: data.data

        },
      });
    }
  }
}
