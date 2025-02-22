import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { formatDate } from 'src/app/Utility/date/date-utils';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/service/storage.service';
import moment from 'moment';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { getFinancialYear } from 'src/app/Utility/datetime/datetime';

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
    docNo: {
      Title: "THC No",
      class: "matcolumncenter",
      Style: "min-width:210px",
      functionName: 'openExternalWindow',
      type: 'windowLink',
      sticky: true
    },
    rUTNM: {
      Title: "Route",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    dEST: {
      Title: "Destination",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    vEHNO: {
      Title: "Vehicle No",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    loadedKg: {
      Title: "Loaded Kg",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    statusAction: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    createOn: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:140px",
      datatype: "datetime",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width:80px; width:80px",
      stickyEnd: true
    }
  };
  allColumnFilter: any;
  //#endregion
  staticField = [
    "rUTNM",
    "dEST",
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
  menuItems = [{ label: "Update THC" }, { label: "Delivered" }, { label: "View" }, { label: "Cancel THC" }];

  //here declare varible for the KPi
  boxData: { count: number; title: string; class: string; }[];
  rules: any[] = [];
  connectedLoc: boolean = false;
  location: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private thcService: ThcService,
    private storage: StorageService,
    private controlPanel: ControlPanelService,
    private objGeneralService: GeneralService,
    private invoiceService: InvoiceServiceService,
    private voucherServicesService: VoucherServicesService,
  ) {

    this.getThcDetails();
    this.addAndEditPath = "Operation/thc-create";
    this.allColumnFilter = this.columnHeader;
  }

  async getRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: { "D$in": ["CNOTE"] },
      aCTIVE: true
    }
    const res = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.rules = res;
    }
  }

  //here the code which is get details of Thc Which is Display in Fron-end
  async getThcDetails() {
    try {
      await this.getRules();
      this.connectedLoc = this.rules.find(x => x.rULEID == "CONLOC" && x.aCTIVE)?.vAL == "Y";
    }
    catch (err) {
      console.log(err);
    }
    const branch = this.storage.branch;
    const locData = await this.thcService.getLocationDetail(branch);
    this.location = locData;
    let filter = {
      cID: this.storage.companyCode,
      D$or: [
        { fCT: locData.locCity },
        { tCT: locData.locCity },
        { vIA: { "D$in": [locData.locCity] } }
      ],
      oPSST: { D$in: [1, 3, 2] }
    };
    if (this.connectedLoc) {
      filter.D$or.push({ tCT: { "D$in": locData?.mappedCity || [] } });
    }
    let thcList = await this.thcService.getThcDetail(filter);
    const thcDetail = thcList.data.map((item) => {
      const dest = item.tCT?.toLowerCase() === locData.locCity?.toLowerCase();
      let action = item.tCT?.toLowerCase() === locData.locCity?.toLowerCase() ||
        (Array.isArray(item.vIA) && item.vIA.some(v => v.toLowerCase() === locData.locCity?.toLowerCase()));
      if (!action) {
        if (locData && locData.mappedCity && locData.mappedCity.includes(item.tCT) && this.connectedLoc) {
          action = true;
        }
      }
      if (item.eNTDT) {
        item.createOn = item.eNTDT;
        item.statusAction = item?.oPSSTNM
        item.loadedKg = item?.uTI?.wT
        item.actions = item.oPSST === 1 && action ? ["Update THC", "View", "Cancel THC"] : (dest && item.oPSST !== 2) ? ["Update THC", "View"] : item.oPSST === 1  ? ["View","Cancel THC"] : ["Delivered", "View"];
      }
      return item;
    });
    // Sort the PRQ list by pickupDate in descending order
    this.tableData = thcDetail.reverse();
    this.tableLoad = false;
  }

  ngOnInit(): void {
  }
  async handleMenuItemClick(data) {
    const thcDetail = this.tableData.find((x) => x._id === data.data._id);
    const locs = this.storage.branch;
    if (thcDetail.oPSST == 1) {
      if (thcDetail.cLOC == locs || thcDetail.dEST == locs) {
        if (data.label.label === "Cancel THC") {
          const rejectionData = await this.objGeneralService.getGeneralMasterData("THCCAN");
          const options = rejectionData.map(item => `<option value="${item.name}">${item.name}</option>`).join('');
          Swal.fire({
            title: 'Reason For Cancel?',
            html: `<select id="swal-select1" class="swal2-select">${options}</select>`,
            focusConfirm: false,
            showCancelButton: true,
            width: "auto",
            cancelButtonText: 'Cancel', // Optional: Customize the cancel button text
            preConfirm: () => {
              return (document.getElementById('swal-select1') as HTMLInputElement).value;
            }
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Handle the input value if the user clicks the confirm button
              const filter = {
                docNo: thcDetail.docNo
              }
              const status = {
                cNL: true,
                cNLDT: new Date(),
                cNBY: this.storage.userName,
                oPSSTNM: "Cancelled",
                oPSST: "9",
                cNRES: result.value//required cancel reason in popup
              }
              const res = await this.thcService.updateTHC(filter, status);
              thcDetail.reason = result.value;
              this.thcService.updateDocket(thcDetail);
              this.thcService.updateVehicle({status:"Available"},{vehNo:thcDetail.vEHNO});
              if (res) {
                // Reverse the accounting entry for the THC
                if (thcDetail?.vNO) {
                  this.voucherServicesService.VoucherReverseAccountingEntry(thcDetail?.vNO, getFinancialYear(thcDetail.eNTDT),
                    thcDetail.docNo, "When THC No: " + thcDetail.docNo + " Is Cancelled"
                  ).then((res) => {
                    if (res) {
                      if (res.success) {
                        const filter = {
                          docNo: thcDetail.docNo,
                          cID: this.storage.companyCode
                        }
                        const VoucherNoList = {
                          vNO: [thcDetail?.vNO, res.data.ops[0].vNO]
                        }
                        this.thcService.updateTHC(filter, VoucherNoList);
                        SwalerrorMessage("success", "Voucher Reverse Accounting Entry Done Successfully And THC has been Cancelled", "Voucher No: " + res.data.ops[0].vNO, true)
                        this.getThcDetails();
                      } else {
                        SwalerrorMessage("error", res.message, "", true)
                      }
                    }
                    else {
                      SwalerrorMessage("error", "Error in Voucher Reverse Accounting Entry", "", true)
                    }
                  }).catch((error) => {
                    SwalerrorMessage("error", error.message, "", true)
                  });
                } else {
                  SwalerrorMessage("success", "Success", "The THC has been successfully Cancelled.", true)
                  this.getThcDetails();
                }

              }
              // Your code to handle the input value
            } else if (result.isDismissed) {
              this.getThcDetails();
            }
          });
        }
      }
    }
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
      templateName: "THC",
      PartyField: "",
    }

    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1500,height=800');
  }
}
