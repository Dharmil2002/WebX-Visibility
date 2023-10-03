import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';

@Component({
  selector: 'app-docket-list',
  templateUrl: './docket-list.component.html'
})
export class DocketListComponent implements OnInit {
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
      Style: "max-width:150px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumnleft",
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
    }
  };
  //#endregion
  staticField = [
    "billingParty",
    "vehicleNo",
    "docketNumber",
    "fromCity",
    "toCity",
    "transMode",
    "actualWeight"
  ];
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  tableData: any;
  tableLoad: boolean;
  addAndEditPath='Operation/ConsignmentEntry';
  menuItems = [{label:"Edit Docket"},{label:"Edit Docket"}];
  constructor(private operationService: OperationService) {
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
      x.actions=x.status
      return x; // Make sure to return x to update the original object in the 'tableData' array.
    });
    //this.tableData = [];
    this.tableLoad = false;
  }

}
