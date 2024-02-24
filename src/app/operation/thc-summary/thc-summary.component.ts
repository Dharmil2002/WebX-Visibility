import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { formatDate } from 'src/app/Utility/date/date-utils';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/service/storage.service';
import moment from 'moment';

@Component({
  selector: 'app-thc-summary',
  templateUrl: './thc-summary.component.html'
})
export class ThcSummaryComponent implements OnInit {
  //here the declare the flag
  tableLoad: boolean;
  filterColumn: boolean = true;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };

  //add dyamic controls for generic table
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  tableData: any[];
  TableStyle = "width:80%"
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = {
    createOn: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:125px",
    },
    docNo: {
      Title: "THC No",
      class: "matcolumncenter",
      Style: "min-width:210px",
      functionName: 'openExternalWindow',
      type: 'windowLink',
    },
    rUTNM: {
      Title: "Route",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    vEHNO: {
      Title: "Vehicle No",
      class: "matcolumncenter",
      Style: "max-width:130px",
    },
    loadedKg: {
      Title: "Loaded Kg",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    statusAction: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width:100px",
    }
  };
  allColumnFilter: any;
  //#endregion
  staticField = [
    "rUTNM",
    "vEHNO",
    "loadedKg",
    "statusAction",
    "createOn"
  ];
  // linkArray = [
  //   { Row: 'tripId', Path: 'Operation/thc-view'},
  // ]
  addAndEditPath: string;
  menuItemflag: boolean = true;
  menuItems = [{ label: "Update THC" }, { label: "Delivered" }, { label: "View" }];

  //here declare varible for the KPi
  boxData: { count: number; title: string; class: string; }[];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private thcService: ThcService,
    private storage: StorageService
  ) {
    this.getThcDetails();
    this.addAndEditPath = "Operation/thc-create";
    this.allColumnFilter = this.columnHeader;
  }



  //here the code which is get details of Thc Which is Display in Fron-end
  async getThcDetails() {
    const branch = this.storage.branch;

    const locData = await this.thcService.getLocationDetail(branch);
    console.log('locData', locData)
    const filter = {
      cID: this.storage.companyCode,
      D$or: [
        { fCT: locData.locCity },
        { tCT: locData.locCity },
      ],
      oPSST: { D$in: [1, 2] }
    };

    let thcList = await this.thcService.getThcDetail(filter);
    const thcDetail = thcList.data.map((item) => {
      const action = item.tCT.toLowerCase() === locData.locCity.toLowerCase();
      if (item.eNTDT) {
        item.createOn = moment(item.eNTDT).format('DD-MM-YY HH:mm');
        item.statusAction = item?.oPSSTNM
        item.loadedKg = item?.uTI?.wT
        item.actions = item.oPSST === 1 && action ? ["Update THC", "View"] : item.oPSST === 1 ? ["View"] : ["Delivered", "View"];
      }
      return item;
    });

    // Sort the PRQ list by pickupDate in descending order
    thcDetail.sort((a, b) => {
      const dateA: Date | any = new Date(a.eNTDT);
      const dateB: Date | any = new Date(b.eNTDT);
      return dateB - dateA; // Sort in descending order
    });

    this.tableData = thcDetail;

    this.tableLoad = false;
  }

  ngOnInit(): void {
  }
  async handleMenuItemClick(data) {
    const thcDetail = this.tableData.find((x) => x._id === data.data._id);
    if (data.label.label === "Update THC") {
      this.router.navigate([this.addAndEditPath], {
        state: {
          data: { data: thcDetail, isUpdate: true, viewType: 'update' },
        },
      });
    }
    if (data.label.label === "View") {
      this.router.navigate([this.addAndEditPath], {
        state: {
          data: { data: thcDetail, isView: true, viewType: 'view' },
        },
      });
      // const dialogref = this.dialog.open(ThcViewComponent, {
      //   width: "800px",
      //   height: "500px",
      //   data: data.data,
      // });
      // dialogref.afterClosed().subscribe((result) => {
      // });
    }

  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  // openExternalWindow() {
  //   const url = `${window.location.origin}/#/Operation/thc-view`;
  //   window.open(url,'','width=1000,height=800');
  // }
  openExternalWindow(data) {
    const templateBody = {
      DocNo: data.docNo,
      templateName: 'THC View-Print'
    }
    console.log('templateBody', templateBody)
    console.log('data', data)

    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1500,height=800');
  }
}
