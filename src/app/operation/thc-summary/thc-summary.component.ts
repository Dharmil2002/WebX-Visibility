import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { formatDate } from 'src/app/Utility/date/date-utils';
import { MatDialog } from '@angular/material/dialog';

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
      Title: "Create On",
      class: "matcolumncenter",
      Style: "max-width:250px",
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
      Style: "max-width:100px",
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
    private thcService: ThcService
  ) {
    this.getThcDetails();
    this.addAndEditPath = "Operation/thc-create";
    this.allColumnFilter = this.columnHeader;
  }



  //here the code which is get details of Thc Which is Display in Fron-end
  async getThcDetails() {
    const thcList = await this.thcService.getThcDetail();
    const branch = localStorage.getItem("Branch");
    const thcDetail = thcList.data.filter((x) => x.cLOC == branch || x.dEST.toLowerCase() === branch.toLowerCase())
      .map((item) => {
        const action = item.dEST.toLowerCase() === branch.toLowerCase();
        if (item.eNTDT) {
          item.createOn = formatDate(item.eNTDT, 'dd-MM-yy HH:mm');
          item.statusAction = item?.oPSSTNM
          item.loadedKg = item?.uTI?.wT
          item.actions = item.oPSST === 1 && action ? ["Update THC", "View"] : item.oPSST === 1 ? ["View"] : ["Delivered", "View"];
        }
        return item;
      });
    // Sort the PRQ list by pickupDate in descending order
    const sortedData = thcDetail.sort((a, b) => {
      const dateA: Date | any = new Date(a.eNTDT);
      const dateB: Date | any = new Date(b.eNTDT);

      // Compare the date objects
      return dateB - dateA; // Sort in descending order
    });

    this.tableData = sortedData;

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
