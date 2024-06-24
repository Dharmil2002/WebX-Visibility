import { Component, OnInit } from '@angular/core';
import { manualvoucharDetail } from './manual-voucher-utility';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VoucherControlControl } from 'src/assets/FormControls/Finance/VoucherEntry/Vouchercontrol';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/service/storage.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType } from 'src/app/Models/Finance/Finance';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import Swal from 'sweetalert2';
import { getFinancialYear } from 'src/app/Utility/datetime/datetime';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { ManualVoucherFilterComponent } from './manual-voucher-filter/manual-voucher-filter/manual-voucher-filter.component';

@Component({
  selector: 'app-manual-voucher',
  templateUrl: './manual-voucher.component.html'
})
export class ManualVoucherComponent implements OnInit {
  tableLoad: boolean = true;
  tableData: any;
  addAndEditPath: string;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  TableStyle = "width:100%"
  columnHeader = {
    vNO: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "max-width:200px",
      type: "Link",
      functionName: "VoucherNoFunction",
    },
    vTYPNM: {
      Title: "Voucher Type",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    tTDT: {
      Title: "Voucher  Date",
      class: "matcolumncenter",
      Style: "max-width: 200px",
      datatype: 'datetime'
    },
    nNETP: {
      Title: "Amount(₹)",
      class: "matcolumncenter",
      Style: "max-width: 150px",
    },
    eNTBY: {
      Title: "Created By",
      class: "matcolumncenter",
      Style: "max-width: 150px",
    },
    eNTDT: {
      Title: "Created on",
      class: "matcolumncenter",
      Style: "max-width: 200px",
      datatype: 'datetime'
    },
    vCAN: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:7%",
      stickyEnd: true
    },
  };
  menuItemflag = true;
  menuItems = [
    { label: 'Modify' },
    { label: 'Delete' },
  ]
  FilterButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };
  filterRequest = {
    companyCode:0,
    voucherNo: [],
    vouchertype:'',
    startdate: new Date(),
    enddate: new Date()
  }
  staticField = [
    // "vNO",
    "vTYPNM",
    "tTDT",
    "nNETP",
    "eNTBY",
    "eNTDT",
    "vCAN",
  ];

  linkArray = [

  ]
  VoucherControl: VoucherControlControl;
  AllTableData = [];
  VoucherSummaryForm: UntypedFormGroup;
  jsonControlVoucherSummaryArray: any;
  DataResponseHeader: any;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  DeatisData = []
  constructor(
    private matDialog: MatDialog,
    public StorageService: StorageService,
    private masterService: MasterService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private voucherServicesService: VoucherServicesService,
  ) {
    this.filterRequest.companyCode = this.StorageService.companyCode;
    this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  ngOnInit(): void {
    this.getVoucherList();
    this.initializeFormControl()
  }
  initializeFormControl() {
    this.VoucherControl = new VoucherControlControl("");
    this.jsonControlVoucherSummaryArray =
      this.VoucherControl.getVoucherArrayControls();
    this.VoucherSummaryForm = formGroupBuilder(this.fb, [
      this.jsonControlVoucherSummaryArray,
    ]);

  }
  async getVoucherList() {
    const detail = await manualvoucharDetail(this.masterService);
    this.AllTableData = detail.map((x) => {
      return {
        ...x, vCAN: "Generated",
        actions: ["Modify", "Delete"]
      };
    });

    this.tableData = this.AllTableData;
    this.tableLoad = false;

    const uniqueTYP = new Set(this.AllTableData.map(item => item.vTYPNM));

    // Convert Set to array if needed
    const uniqueTYPArray = Array.from(uniqueTYP);
    console.log(uniqueTYPArray)

    const voucherTypelist: any[] = uniqueTYPArray.map(item => ({
      name: item,
      value: item
    }));

    this.filter.Filter(
      this.jsonControlVoucherSummaryArray,
      this.VoucherSummaryForm,
      voucherTypelist,
      "VoucherType",
      false
    );
  }
  filterFunction() {
    debugger
    const dialogRef = this.matDialog.open(ManualVoucherFilterComponent, {
      data: { DefaultData: this.filterRequest },
      width: "60%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      debugger
      if (result != undefined) {
        // this.filterRequest.StatusNames = result.statussupport.map(item => item.name)
        // this.filterRequest.StatusCode = result.statussupport.map(item => +item.value)
         this.filterRequest.voucherNo = result.VoucherNo,
         this.filterRequest.vouchertype = result.VoucherType,
        this.filterRequest.startdate = result.StartDate,
          this.filterRequest.enddate = result.EndDate,
          this.getFilterVoucherList()
      }
    });
  }
  async getFilterVoucherList() {
    debugger
    this.tableData = this.AllTableData.filter(item => {
      const itemDate = new Date(item.eNTDT);
      itemDate.setHours(0, 0, 0, 0);
      const startDate = new Date(this.filterRequest.startdate);
      const endDate = new Date(this.filterRequest.enddate);

      return (item.docNo == this.filterRequest.voucherNo) || (item.vTYPNM == this.filterRequest.vouchertype) ||
             (itemDate >= startDate && itemDate <= endDate);
    });
  }
  VoucherTypeFieldChanged(event) {
    const selectedField = event?.eventArgs.option.value.value
    this.tableLoad = true;
    this.tableData = this.AllTableData.filter(item => item.vTYPNM == selectedField)
    this.tableLoad = false;



    switch (selectedField) {
      case "DebitVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
        break;
      // case "VendorBillPayment":
      //   this.addAndEditPath = "Finance/VendorPayment/VendorBillPayment";
      //   break;
      case "JournalVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/JournalVoucher";
        break;
      case "ContraVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/ContraVoucher";
        break;
      // case "Delivery MR Voucher":
      //   this.addAndEditPath = "dashboard/Index";
      //   break;
      default:
        this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
        break;

    }

  }
  async handleMenuItemClick(data) {
    debugger
    const voucherDetail = this.tableData.find((x) => x._id === data.data._id);
    const locs = this.StorageService.branch;
    if (data.label.label === "Delete") {
      //const rejectionData = await this.objGeneralService.getGeneralMasterData("THCCAN");
      //const options = rejectionData.map(item => `<option value="${item.name}">${item.name}</option>`).join('');

      Swal.fire({
        title: 'Reason For Cancel?',
        html: `<input type="text" id="swal-input1" class="swal2-input" placeholder="Additional comments">`,
        focusConfirm: false,
        showCancelButton: true,
        width: "auto",
        cancelButtonText: 'Cancel', // Optional: Customize the cancel button text
        preConfirm: () => {
          return (document.getElementById('swal-input1') as HTMLInputElement).value;
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (voucherDetail.docNo) {
            // Reverse the accounting entry for the THC
            if (voucherDetail.docNo) {
              this.voucherServicesService.VoucherReverseAccountingEntry(voucherDetail?.vNO, getFinancialYear(voucherDetail.eNTDT),
              voucherDetail.docNo, "When : " + voucherDetail.docNo + "  Is Cancelled"
              ).then((res) => {
                if (res) {
                  if (res.success) {
                    const filter = {
                      docNo: voucherDetail.docNo,
                      cID: this.StorageService.companyCode
                    }
                    const VoucherNoList = {
                      vNO: [voucherDetail?.vNO, res.data.ops[0].vNO]
                    }
                   // this.thcService.updateTHC(filter, VoucherNoList);
                    SwalerrorMessage("success", "Voucher Reverse Accounting Entry Done Successfully And THC has been Cancelled", "Voucher No: " + res.data.ops[0].vNO, true)
                    this.getVoucherList();
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
              this.getVoucherList();
            }

          }
          // Your code to handle the input value
        } else if (result.isDismissed) {
          this.getVoucherList();
        }
      });
    }
   
    if (data.label.label === "Modify") {
      this.router.navigate(['Finance/DebitVoucher'], {
        state: {
          data: data.data
        },
      });
    }
  }
  VoucherNoFunction(event) {
    const templateBody = {
      DocNo: event.data.vNO,
      templateName: "VR",
      PartyField:""
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1000,height=800");
  }
}
