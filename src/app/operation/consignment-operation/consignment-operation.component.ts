import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-consignment-operation",
  templateUrl: "./consignment-operation.component.html",
})
export class ConsignmentOperationComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note Operation Tracking ",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  isTableLode = false;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  // EventButton = {
  //   functionName:'AddNew',
  //   name: "Add TDS",
  //   iconName:'add'
  // }
  columnHeader = {
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Activity: {
      Title: "Activity",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    eVNID: {
      Title: "Document Number",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Event: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:30%",
    },
    CumulativeDays: {
      Title: "Cumulative Days",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
  };
  staticField = ["Date", "Activity", "eVNID", "Event", "CumulativeDays"];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any = [];
  DocData: any;
  constructor(private Route: Router, private masterService: MasterService) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.DocData = this.Route.getCurrentNavigation().extras?.state.data;
    } else {
      this.Route.navigateByUrl("Operation/ConsignmentFilter");
    }
  }

  ngOnInit(): void {
    this.getTableData();
  }

  async getTableData() {
    console.log("this.DocData", this.DocData);
    const Mode = localStorage.getItem("Mode");
    const req = {
      companyCode: this.CompanyCode,
      collectionName: Mode == "FTL" ? "docket_events" : "docket_events_ltl",
      filter: { dKTNO: this.DocData.DocNo },
    };

    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if (res.success && res.data.length > 0) {
      this.TableData = res.data.map((x) => {
        return {
          ...x,
          Date: moment(x.eNTDT).format("DD/MM/YYYY"),
          Event: Mode == "FTL" ? x.oPSTS || "" : x.oPSSTS || "",
        };
      });
    } else {
      this.isTableLode = true;
      this.TableData = [];
      Swal.fire({
        icon: "info",
        title: "Docket Number Not Found",
        text: "The provided Docket Number does not exist.",
        showConfirmButton: true,
      });
    }
  }

  functionCallHandler(event) {}
}
