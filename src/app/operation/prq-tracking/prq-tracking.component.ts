import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { firstValueFrom } from 'rxjs';
import { PrqService } from 'src/app/Utility/module/operation/prq/prq.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-prq-tracking',
  templateUrl: './prq-tracking.component.html'
})
export class PrqTrackingComponent implements OnInit {

  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  linkArray = []
  csv: any[];
  menuItemflag: boolean = false;
  QueryData: any;
  backPath: string;
  csvFileName: string;

  //#region Breadcrumb Data
  breadScrums = [
    {
      title: "PRQ Tracking",
      items: ["Home"],
      active: "PRQ Tracking",
    },
  ];
  //#endregion

  //#region Table Data
  dynamicControls = {
    add: false,
    edit: false,
    csv: true
  }
  //#endregion

  //#region Column Header
  columnHeader = {
    srNo: {
      Title: "Sr. No",
      class: "matcolumnleft",
      Style: "max-width:150px",
      sticky: true,
    },
    pRQNO: {
      Title: "Document No",
      class: "matcolumnleft",
      Style: "min-width:18%",
      type: "windowLink",
      functionName: "OpenPrq",
      sticky: true,
    },
    eNTDT: {
      Title: "Document Date",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    bRCD: {
      Title: "Origin",
      class: "matcolumnleft",
      Style: "max-width:150px",
      // datatype: "datetime",
    },
    fCITY: {
      Title: "From",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    tCITY: {
      Title: "To",
      class: "matcolumnleft",
      Style: "max-width:150px",
      // datatype: "datetime",
    },
    cNC: {
      Title: "Cancelled",
      class: "matcolumnleft",
      Style: "max-width:150px",
      // datatype: "datetime",
    }
  };
  //#endregion

  //#region Toggle Array
  staticField = [
    "srNo",
    "eNTDT",
    "bRCD",
    "fCITY",
    "tCITY",
    "cNC",
  ];
  //#endregion

  //#region Constructor
  constructor(
    private Route: Router,
    private storage: StorageService,
    private masterService: MasterService,
  ) {
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.QueryData = this.Route.getCurrentNavigation().extras?.state.data;

      if (this.QueryData.Docket) {
        const Query = {
          D$match: {
            pRQNO: {D$in:this.QueryData.Docket},
          },
        };
        this.getprqTrackingData(Query);
      } else if (this.QueryData.start && this.QueryData.end) {
        const Query = {
          D$match: {
            D$and: [
              {
                eNTDT: {
                  D$gte: this.QueryData.start,
                },
              },
              {
                eNTDT: {
                  D$lte: this.QueryData.end,
                },
              },
            ],
          },
        };
        this.getprqTrackingData(Query);
      } else {
        this.Route.navigate(["Operation/ConsignmentQuery"]);
      }
    } else {
      this.Route.navigateByUrl("Operation/ConsignmentQuery");
    }
  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.csvFileName = "PRQ Tracking";
    this.backPath = "/Operation/ConsignmentQuery";
  }
  //#endregion

  //#region Function Call Handler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  //#region getprqTrackingData
  async getprqTrackingData(Query) {
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: "prq_summary",
      filters: [Query],
    };
    const res = await firstValueFrom(
      this.masterService.masterMongoPost("generic/query", reqBody)
    );
    this.csv = res.data.map((x) => {
      return {
        ...x,
        srNo: res.data.indexOf(x) + 1,
        cNC: x.sTS === 5 ? "Yes" : "No"
      };
    });
    this.tableLoad = false;
  }

  //#endregion

  //#region OpenPrq
  OpenPrq(res) {
    const prqNo = res.data.pRQNO;
    const templateBody = {
      DocNo: prqNo,
      partyCode: "",
      templateName: "PRQ",
      PartyField:"",
    };
    const url = `${
      window.location.origin
    }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1000,height=800");
  }
  //#endregion

}
