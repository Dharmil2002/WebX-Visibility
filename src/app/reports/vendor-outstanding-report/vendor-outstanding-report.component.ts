import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { VendorWiseOutService } from 'src/app/Utility/module/reports/vendor-wise-outstanding';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
// import { vendOutControl } from 'src/assets/FormControls/Vendor-Outstanding-report/vendor-outstanding-report';
import Swal from 'sweetalert2';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { vendOutControl } from 'src/assets/FormControls/Reports/Vendor-Outstanding-report/vendor-outstanding-report';
import moment from 'moment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ExportService } from 'src/app/Utility/module/export.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';

@Component({
  selector: 'app-vendor-outstanding-report',
  templateUrl: './vendor-outstanding-report.component.html'
})
export class VendorOutstandingReportComponent implements OnInit {

  breadScrums = [
    {
      title: "Vendor Wise Outstanding Report ",
      items: ["Home"],
      active: "Vendor Wise Outstanding Report ",
    },
  ];
  VendWiseOutTableForm: UntypedFormGroup
  jsonVendWiseOutFormArray: any
  vendoutFormControl: vendOutControl
  protected _onDestroy = new Subject<void>();
  locName: any;
  locStatus: any;
  vendorName: any;
  vendorStatus: any;
  allData: {
    venNameData: any;
    // venTypeData: any;
  };
  vendorDetailList: any;
  venNameDet: any;
  venTypeDet: any;
  vendTypeDetail: any;
  vendorTypeName: any;
  vendorTypeStatus: any;

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService,
    private vendorWiseOutService: VendorWiseOutService,
    private generalService: GeneralService,
    public snackBarUtilityService: SnackBarUtilityService,
    private exportService: ExportService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl()
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.VendWiseOutTableForm.controls["start"].setValue(lastweek);
    this.VendWiseOutTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  initializeFormControl() {
    this.vendoutFormControl = new vendOutControl();
    this.jsonVendWiseOutFormArray = this.vendoutFormControl.VendOutControlArray;
    this.locName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "loc"
    )?.name;
    this.locStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "loc"
    )?.additionalData.showNameAndValue;
    this.vendorName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vennmcd"
    )?.name;
    this.vendorStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vennmcd"
    )?.additionalData.showNameAndValue;
    this.vendorTypeName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vendtype"
    )?.name;
    this.vendorTypeStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vendtype"
    )?.additionalData.showNameAndValue;
    this.VendWiseOutTableForm = formGroupBuilder(this.fb, [this.jsonVendWiseOutFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonVendWiseOutFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonVendWiseOutFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.VendWiseOutTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  CSVHeader = {
    "vendor": "Vendor",
    "loc": "Location",
    "openingBal": "Opening Balance",
    "totalBill": "Total Bill",
    "debitNoteAmt": "Debit Note Amount",
    "totalBillAmt": "Total Bill Amount From 01 Apr 2023 To 11 Dec 2023",
    "paidAmt": "Paid Amount From 01 Apr 2023 To 11 Dec 2023",
    "finalized": "Finalized",
    "unFinalized": "Un-Finalized",
    "0-30": "0-30",
    "31-60": "31-60",
    "61-90": "61-90",
    "91-120": "91-120",
    "121-150": "121-150",
    "151-180": "151-180",
    ">180": ">180",
    "totalPayable": "Total Payable",
    "onAccountAmt": "On Account Amt",
    "manualVoucher": "Manual Voucher",
    "jVAmt": "JV Amount",
    "paidAdvanceAmount": "Paid Advance Amount",
    "ledgerBalance": "Ledger Balance",
    "msme": "MSME Registered",
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList(true);
    const aggregationPipeline = [
      {
        D$group: {
          _id: {
            vendorcode: "$vND.cD",
            name: "$vND.nM",
          },
        },
      },
      {
        D$project: {
          _id: 0,
          vendorcode: "$_id.vendorcode",
          name: "$_id.name",
        },
      },
    ]
    // const vendorType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "VENDTYPE" }, "codeDesc", "codeId");
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    let venQuery = {
      "companyCode": this.storage.companyCode,
      "filters": aggregationPipeline,
      "collectionName": "vend_bill_summary"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    const vendorSummary = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", venQuery));
    const mapData = vendorSummary.data.map((x) => {
      return {
        value: x.vendorcode,
        name: x.name
      }
    }
    )
    const venNameDet = venNameRes.data
      .map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
      }));
    const filter = [...mapData, ...venNameDet]
    this.vendorDetailList = filter;
    this.venNameDet = filter;
    this.filter.Filter(
      this.jsonVendWiseOutFormArray,
      this.VendWiseOutTableForm,
      filter,
      this.vendorName,
      this.vendorStatus
    );
    // this.filter.Filter(
    //   this.jsonVendWiseOutFormArray,
    //   this.VendWiseOutTableForm,
    //   vendorType,
    //   this.vendorTypeName,
    //   this.vendorTypeStatus
    // );
    this.filter.Filter(
      this.jsonVendWiseOutFormArray,
      this.VendWiseOutTableForm,
      locationList,
      this.locName,
      this.locStatus
    );
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const reportbasis = Array.isArray(this.VendWiseOutTableForm.value.rptbasis) ? '' : this.VendWiseOutTableForm.value.rptbasis;
        const startDate = new Date(this.VendWiseOutTableForm.controls.start.value);
        const endDate = new Date(this.VendWiseOutTableForm.controls.end.value);
        const ASonDateValue = new Date(this.VendWiseOutTableForm.controls?.asondate.value);

        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();
        const asonDate = moment(ASonDateValue).endOf('day').toDate();

        const formattedStartDate = startValue.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedEndDate = endValue.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

        this.CSVHeader = {
          ...this.CSVHeader,
          "totalBillAmt": `Total Bill Amount From ${formattedStartDate} To ${formattedEndDate}`,
          "paidAmt": `Paid Amount From ${formattedStartDate} To ${formattedEndDate}`,
        };
        const locData = Array.isArray(this.VendWiseOutTableForm.value.locHandler)
          ? this.VendWiseOutTableForm.value.locHandler.map(x => { return { locCode: x.value, locName: x.name }; })
          : [];
        const vendData = Array.isArray(this.VendWiseOutTableForm.value.vendnmcdHandler)
          ? this.VendWiseOutTableForm.value.vendnmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
          : [];
        const msme = this.VendWiseOutTableForm.value?.msmeRegistered || false;
        const data = await this.vendorWiseOutService.getvendorWiseOutReportDetail(msme, asonDate, startValue, endValue, locData, vendData, reportbasis);

        if (data.length === 0) {
          if (data) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        // Push the module counter data to the server
        this.MCountrService.PushModuleCounter();
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        // Assuming exportAsExcelFile is a function that exports data to Excel
        this.exportService.exportAsCSV(data, `Vendor_Wise_Outstanding_Report-${timeString}`, this.CSVHeader);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Vendor Outstanding Report Generating Please Wait..!");
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

}
