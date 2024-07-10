import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { UserMasterService } from "src/app/Utility/module/masters/user-master/user-master-service";

@Component({
  selector: "app-view-tracking-popup",
  templateUrl: "./view-tracking-popup.component.html",
})
export class ViewTrackingPopupComponent implements OnInit {
  isTableLode = false;
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add TDS",
    iconName: "add",
  };
  csvHeader = {
    Date: "Date",
    AdditionalDetails: "Additional Details",
    Event: "Event",
    Location: "Current Location",
    DocNo: "Document Number",
    eNTDT: "Entry Date",
    eNTBY: "User"
  };
  columnHeader = {
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    AdditionalDetails: {
      Title: "Additional Details",
      class: "matcolumnleft",
      Style: "min-width:25%",
      datatype: "string"
    },

    Event: {
      Title: "Event",
      class: "matcolumnleft",
      Style: "min-width:15%",
      datatype: "string"
    },
    Location: {
      Title: "Current Location",
      class: "matcolumnleft",
      Style: "min-width:7%",
      datatype: "string"
    },
    DocNo: {
      Title: "Document Number",
      class: "matcolumnleft",
      Style: "min-width:15%",
      type: "Link",
      functionName: "ViewPrintFunction",
    },
    eNTDT: {
      Title: "Entry Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    eNTBY: {
      Title: "User",
      class: "matcolumnleft",
      Style: "min-width:5%",
      datatype: "string"
    },
  };
  staticField = [
    "Date",
    "AdditionalDetails",
    "eNTBY",
    "eNTDT",
    "Event",
    "Location"
  ];
  CompanyCode = 0;
  TableData: any;
  FormTitle: any
  constructor(
    private storage: StorageService,
    private operatioinService: OperationService,
    private userMasterService: UserMasterService,
    public dialogRef: MatDialogRef<ViewTrackingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.CompanyCode = this.storage.companyCode;    
    this.FormTitle = this.data.DokNo?this.data.DokNo:'C-Not Tracking List'    
  }

  ngOnInit(): void {
    this.getEvents();
  }

  async getEvents(): Promise<void> {      
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: this.storage.mode == "FTL" ? "docket_events" : "docket_events_ltl",
        filters: [{
          D$match: {
            D$and: [
              {
                cID: this.storage.companyCode
              },
              {
                dKTNO: this.data.DokNo
              }
            ]
          }
        },        
        {
          D$lookup: {
              from: "location_detail",
              localField: "eNTLOC",
              foreignField: "locCode",
              as: "elc"
          }
        },
        {
          D$unwind: {
            path: "$elc",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          D$lookup: {
              from: "location_detail",
              localField: "lOC",
              foreignField: "locCode",
              as: "lc"
          }
        },
        {
          D$unwind: {
            path: "$lc",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          D$addFields: {
            locCode: { D$ifNull: [ "$lOC", "$eNTLOC"] },
            locName: { D$ifNull: [ "$lc.locName",  "$elc.locName"] },
            lc: null
          }
        }
      ]}

      var res = await firstValueFrom(this.operatioinService.operationPost("generic/query", req));
      let userIds = [];
      if(res && res.data) {
        let evnData = res.data;
        userIds = [ ...userIds,  ...evnData.map(m => m.eNTBY), ...evnData.map(m => m.mODBY) ];
        userIds = [...new Set(userIds)];

        const getUser = await this.userMasterService.getUserName({ companyCode: this.storage.companyCode, userId: { "D$in": userIds } });
        if (getUser && getUser.data && getUser.data.length > 0) {
          evnData.forEach(x => {
            x.eNTBY = `${x.eNTBY}:${getUser.data.find(z => z.userId == x.eNTBY)?.name || "" }`;
          })
        }

        const sortByDate = (a, b) => {
          return new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime();
        };

        this.TableData = evnData.map((x) => {
            return {
                ...x,
                Date: moment(x.eVNDT).format("DD MMM YY HH:mm"),
                eNTDT: moment(x.eNTDT).format("DD MMM YY HH:mm"),
                Location: `${x.locCode}:${x.locName}`,
                DocNo: x.dOCNO || x.dKTNO,
                AdditionalDetails: x.oPSSTS || x.oPSTS,
                Event: x.eVNDES,
              };
            })
            .sort(sortByDate);
        this.isTableLode = true;
      }
  }

  ViewPrintFunction(event) {
    let templateName = "THC";
    switch (event.data.dOCTY) {
      case "CN":
        templateName = "DKT";
        break;
      case "LS":
        templateName = "LS";
        break;
      case "MF":
        templateName = "MF";
        break;
      case "TH":
        templateName = "THC";
        break;
      case "DE":
        templateName = "DE";
        break;
      case "DMR":
          templateName = "DMR";
          break;
      case "DRS":
        templateName = "drs";
        break;
    }
    const templateBody = {
      DocNo: event.data.dOCNO,
      templateName: templateName,
      PartyField: "",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1500,height=800");
  }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
