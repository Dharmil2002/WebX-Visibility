import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { GetTHCListFromApi } from '../VendorPaymentAPIUtitlity';
import { VendorBillService } from '../../Vendor Bills/vendor-bill.service';
import { firstValueFrom } from 'rxjs';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { ThcPaymentFilterComponent } from '../Modal/thc-payment-filter/thc-payment-filter.component';

@Component({
  selector: 'app-tds-payments',
  templateUrl: './tds-payments.component.html',
})
export class TdsPaymentsComponent implements OnInit {
  tableData: any;
  menuItems = [];
  linkArray = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  breadScrums = [
    {
      title: "TDS Payments",
      items: ["Home"],
      active: "TDS Payments",
    },
  ];

  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    vendorCode: {
      Title: "Vendor",
      class: "matcolumncenter",
      Style: "min-width:30%",
    },
    invoiceCount: {
      Title: "Invoice Count",
      class: "matcolumncenter",
      Style: "min-width:10%",
      type: "Link",
      functionName: "TdsPendingFunction"
    },
    totalBALAMT: {
      Title: "Vendor Invoice Amount",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    totalTDSAMT: {
      Title: "TDS Amount",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
  };

  staticField = ["SrNo", "vendorCode", "totalBALAMT", "totalTDSAMT"];

  companyCode = 0;
  RequestData = {
    vendorList: [

    ],
    vendorListWithKeys: [],
    StartDate: new Date(),
    EndDate: new Date()
  }
  filterRequest = {
    companyCode: 0,
    vendorNames: [],
    StatusNames: [],
    StatusCode: [1, 2, 4, 5, 6, 7],
    startdate: new Date(),
    enddate: new Date()
  }
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  DataResponseHeader: any;
  isTableLode = true;
  constructor(private matDialog: MatDialog, private router: Router,
    private masterService: MasterService, private storageService: StorageService,
    private objVendorBillService: VendorBillService,) {
    this.filterRequest.companyCode = this.storageService.companyCode;
    this.companyCode = this.storageService.companyCode;
    this.filterRequest.startdate.setDate(new Date().getDate() - 30);
  }

  ngOnInit(): void {
    this.GetTHCData()
  }

  async GetTHCData() {
    const { financialYearStartDate, financialYearEndDate } = this.getFinancialYearDates();
    const BodyDataHeader = {
      companyCode: this.storageService.companyCode,
      collectionName: "vend_bill_summary",
      filter: {
        "D$expr": {
          "D$and": [
            // Check if bALAMT is greater than 0
            { "D$gt": ["$tDS.aMT", 0] },
            // Cancel Flag Check 
            {
              "D$or": [
                { "D$eq": ["$tDSPAID", false] },
                { "D$eq": [{ "D$ifNull": ["$tDSPAID", false] }, false] }
              ]
            },
            // Check if bDT is greater than financialYearStartDate
            // { "D$gt": ["$bDT", financialYearStartDate] },
            // // Check if bDT is less than financialYearEndDate
            // { "D$lt": ["$bDT", financialYearEndDate] }
          ] // Remove undefined elements from the array
        }
      }
    };
    this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));

    const groupedData = this.DataResponseHeader.data.reduce((acc, item) => {
      const vendorCode = item.vND.cD;
      if (!acc[vendorCode]) {
        acc[vendorCode] = {
          vendorCode: vendorCode + ':' + item.vND.nM,
          vendorCd: vendorCode,
          vendPanno: item.vND.pAN,
          totalBALAMT: 0,
          totalTDSAMT: 0,
          invoiceCount: 0
        };
      }
      acc[vendorCode].totalBALAMT += item.bALAMT;
      acc[vendorCode].totalTDSAMT += item.tDS.aMT;
      acc[vendorCode].invoiceCount += 1;

      return acc;
    }, {});

    const result = Object.values(groupedData);

    // Assuming the type of obj is any, you can cast it to the appropriate type
    const dataWithSrno = result.map((obj: any, index: number) => {
      return {
        ...obj,
        SrNo: index + 1
      };
    });
    this.tableData = dataWithSrno;
  }

  // Function to calculate financial year start and end dates
  getFinancialYearDates() {
    const today = new Date();
    const year = today.getFullYear();
    let financialYearStartDate;
    let financialYearEndDate;

    if (today.getMonth() >= 3) { // April (3) to December (11)
      financialYearStartDate = new Date(Date.UTC(year, 3, 1)).toISOString(); // April 1st of the current year
      financialYearEndDate = new Date(Date.UTC(year + 1, 2, 31, 23, 59, 59)).toISOString(); // March 31st of the next year
    } else { // January (0) to March (2)
      financialYearStartDate = new Date(Date.UTC(year - 1, 3, 1)).toISOString(); // April 1st of the previous year
      financialYearEndDate = new Date(Date.UTC(year, 2, 31, 23, 59, 59)).toISOString(); // March 31st of the current year
    }

    return { financialYearStartDate, financialYearEndDate };
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


  TdsPendingFunction(event) {
    // Check if TotaladvAmt is greater than 0
    const isTotaladvAmtValid = event?.data?.AdvancePending > 0;
    this.router.navigate(['/Finance/VendorPayment/Vendor-TdsPayment'], {
      state: {
        data: {
          ...event.data,
        }
      },
    });

    // if (isTotaladvAmtValid) {
    //   this.router.navigate(['/Finance/VendorPayment/Vendor-TdsPayment'], {
    //     state: {
    //       data: {
    //         ...event.data,
    //         StartDate: this.RequestData.StartDate,
    //         EndDate: this.RequestData.EndDate,
    //       }
    //     },
    //   });
    // } else {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Data Does Not exist for Advance Payment on current branch",
    //     showConfirmButton: true,
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       Swal.close();
    //     }
    //   });
    // }

  }

  filterFunction() {
    const dialogRef = this.matDialog.open(ThcPaymentFilterComponent, {
      data: { DefaultData: this.RequestData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.RequestData.StartDate = result.StartDate;
        this.RequestData.EndDate = result.EndDate;
        this.RequestData.vendorList = result.vendorNamesupport.map(item => item.value)
        this.RequestData.vendorListWithKeys = result.vendorNamesupport.map(item => { return item.value + ":" + item.name });
        //this.GetTHCData()
      }
    });
  }

}
