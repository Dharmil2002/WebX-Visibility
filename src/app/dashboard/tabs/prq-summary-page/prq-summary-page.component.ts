import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrqService } from '../../../Utility/module/operation/prq/prq.service';
import { PrqSummaryModel } from 'src/app/Models/prq-model/prqsummary.model';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prq-summary-page',
  templateUrl: './prq-summary-page.component.html'
})
export class PrqSummaryPageComponent implements OnInit {
  summaryCountData: any;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  filterColumn: boolean = true;
  allColumnFilter: any;
  FormTitle = 'Prq List'
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  isLoad: boolean = false;
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  menuItemflag: boolean = true;
  addAndEditPath: string;
  tableData: any[];
  linkArray = [{ Row: "Action", Path: "Operation/PRQEntry" }];
  boxData: { count: number; title: string; class: string; }[];
  allPrq: any;
  constructor(
    private router: Router,
    private prqService: PrqService,
    private definition: PrqSummaryModel
  ) {
    this.addAndEditPath = "Operation/PRQEntry";
    this.allColumnFilter = this.definition.columnHeader
  }

  ngOnInit(): void {
    this.getPrqDetails();
  }
  async getPrqDetails() {

    let data = await this.prqService.getPrqDetailFromApi();

    this.tableData = data.tableData;
    this.allPrq = data.allPrqDetail;
    this.getPrqKpiCount();
    this.tableLoad = false;
  }
  async handleMenuItemClick(data) {
    if (data.label.label === "Assign Vehicle") {
      this.prqService.setassignVehicleDetail(data.data);
    }
    if (data.label) {
      if (data.label.route) {
        const inputDate = moment(data.data.pickUpDate, "DD-MM-YY HH:mm", true);

        // Use current date and time for 'today'
        const today = moment();
        // Check if 'inputDate' is before today (ignoring time)
        if (inputDate.isBefore(today, "day")) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "This Pick-Up DateTime is for a past date and hence not allowed.",
          });
          return null;
        }
        else {
          this.router.navigate([data.label.route], {
            state: {
              data: data.data
            },
          });
        }
      }else {
        const { tabIndex, status } = data.label;
        await this.prqService.showConfirmationDialog(data.data, this.goBack.bind(this), tabIndex, status);
        this.tableLoad = true;
        this.getPrqDetails();
      }
    }
  }

  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }

  //Kpi count
  getPrqKpiCount() {
    const createShipDataObject = (
      count: number,
      title: string,
      className: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
    const prqAssign = this.allPrq.filter((x) => x.sTS == "2");
    const notPrqAssign = this.allPrq.filter((x) => x.sTS == "1");
    const rejectAssign = this.allPrq.filter((x) => x.sTS == "5");
    const shipData = [
      createShipDataObject(this.allPrq.length, "PRQ Count", "bg-c-Bottle-light"),
      createShipDataObject(prqAssign.length, "PRQ Assigned", "bg-c-Grape-light"),
      createShipDataObject(notPrqAssign.length, "PRQ Not Assigned", "bg-c-Daisy-light"),
      createShipDataObject(rejectAssign.length, "PRQ Rejected", "bg-c-Grape-light"),
    ];
    this.boxData = shipData
  }

  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }

  OpenPrq(data) {
    console.log('data', data)
    const prqNo = data.prqNo
    const templateBody = {
      DocNo: prqNo,
      templateName: 'PRQ View-Print'
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}
