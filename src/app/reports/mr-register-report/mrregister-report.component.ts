import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { GetGeneralMasterData } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ExportService } from 'src/app/Utility/module/export.service';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MrRegisterService } from 'src/app/Utility/module/reports/mr-register.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { MRRegister } from 'src/assets/FormControls/Reports/MR-Register/mr-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mrregister-report',
  templateUrl: './mrregister-report.component.html'
})
export class MRRegisterReportComponent implements OnInit {
  MRRegisterFormControls: MRRegister;
  jsonControlArray: any;
  breadScrums = [
    {
      title: "MR Register Report",
      items: ["Report"],
      active: "MR Register Report",
    },
  ];
  mRRegisterForm: UntypedFormGroup;
  CSVHeader = {
    MRNo: "MR No.",
    MRDate: "MR Date",
    MRTime: "MR Time",
    MRType: "MR Type",
    MRLocation: "MR Location",
    Party: "Party",
    MRAmount: "MR Amount",
    TDS: "TDS",
    GSTAmount: "GST Amount",
    FreightRebate: "Freight Rebate",
    CLAIM: "CLAIM",
    OtherDeduction: "Other Deduction",
    NetMRCloseAmt: "Net MR Close Amt",
    MRCloseDate: "MR Close Date",
    MRCloseBy: "MR Close By",
    PayMode: "Pay Mode",
    ChequeNo: "Cheque No",
    ChequeDate: "Cheque Date",
    ChequeAmount: "Cheque Amount",
    CancelledBy: "Cancelled By",
    CancelledOn: "Cancelled On",
    CancelledReasion: "Cancelled Reasion",
    GatePassNo: "Gate Pass No",
    GCNNo: "GCN No",
    BillNo: "Bill No",
    Origin: "Origin",
    Destination: "Destination",
    BasicFreight: "Basic Freight",
    SubTotal: "Sub. Total",
    DocketTotal: "Docket Total",
    ActualWeight: "Actual Weight",
    ChargedWeight: "Charged Weight",
    NoPkg: "No Pkg",
    GodownNoName: "Godown No/Name",
    DeliveryDateandTime: "Delivery Date and Time",
    PrivateMarka: "Private Marka",
    VehicleNo: "Vehicle No.",
    Status: "Status As Deliver/Undelivered",
    SaidToContains: "Said to contains",
    Receiver: "Receiver",
    ReceiverNo: "Receiver No.",
    Remark: "Remark",
    FreightDeduction: "Freight Deduction",
    ClaimDeduction: "Claim Deduction",
    OtherAmount: "Other Amount",
    ServiceCharges: "Service Charges",
    Discount: "Discount",
    SpecialCharges: "Special Charges",
    UnloadingCharges: "Unloading Charges",
    Damurrage: "Damurrage",
    DetentionCharge: "Detention charge",
    OtherCharges: "Other Charges",
    DDCharges: "DD Charges"
  }
  protected _onDestroy = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private exportService: ExportService,
    private snackBarUtilityService: SnackBarUtilityService,
    private mrRegisterService: MrRegisterService,
    private storage: StorageService,

  ) { }

  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.mRRegisterForm.controls["start"].setValue(lastweek);
    this.mRRegisterForm.controls["end"].setValue(now);
    this.getDropdownData();
  }
  //#region to initialize form control
  initializeFormControl() {
    const controls = new MRRegister();
    this.jsonControlArray = controls.mrRegisterControlArray;

    // Build the form using formGroupBuilder
    this.mRRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  //#endregion
  //#region to get dropdown data
  async getDropdownData() {
    const divisionList = await GetGeneralMasterData(this.masterService, 'DIVIS');
    const customerList = await this.customerService.customerFromApi();
    const locationList = await this.locationService.locationFromApi();

    this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, divisionList, "division", false);
    this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, customerList, "customer", false);
    this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, locationList, "branch", false);

    const loginBranch = locationList.find(x => x.name === this.storage.branch);
    this.mRRegisterForm.controls["branch"].setValue(loginBranch);
  }
  //#endregion
  //#region to call function handler
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
  //#endregion
  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.mRRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
  //#region to export csv file
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const startValue = new Date(this.mRRegisterForm.controls.start.value);
        const endValue = new Date(this.mRRegisterForm.controls.end.value);

        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();

        const customerList = Array.isArray(this.mRRegisterForm.value.custnmcdHandler)
          ? this.mRRegisterForm.value.custnmcdHandler.map(x => x.name)
          : [];

        const branch = this.mRRegisterForm.value.branch.name;
        const division = this.mRRegisterForm.value.division;

        const MRNOs = this.mRRegisterForm.value.MRNO;

        // Check if a comma is present in docNo      
        let docNoArray;

        if (Array.isArray(MRNOs) && MRNOs.length === 0) {
          docNoArray = [];
        } else {
          docNoArray = MRNOs.includes(',')
            ? MRNOs.split(',')
            : [MRNOs.trim()];
        }

        const Cnotenos = this.mRRegisterForm.value.Cnote;

        // Check if a comma is present in docNo      
        let CnotenosArray;

        if (Array.isArray(Cnotenos) && Cnotenos.length === 0) {
          CnotenosArray = [];
        } else {
          CnotenosArray = Cnotenos.includes(',')
            ? Cnotenos.split(',')
            : [Cnotenos.trim()];
        }

        const request = { startDate, endDate, customerList, branch };
        const optionalRequest = { docNoArray, CnotenosArray }
        // console.log(requestbody);


        const data = await this.mrRegisterService.getMrRegisterData(request, optionalRequest);

        // Swal.hideLoading();

        if (!data || (Array.isArray(data) && data.length === 0)) {

          Swal.fire({
            icon: "error",
            title: "No Records Found",
            text: "Cannot Download CSV",
            showConfirmButton: true,
          });

          return;
        }

        setTimeout(() => {
          Swal.close();
        }, 1000);

        // Export the record to Excel
        // this.exportService.exportAsCSV(data, `MR Register-${moment().format("YYYYMMDD-HHmmss")}`, this.CSVHeader);

      } catch (error) {
        console.log(error);
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "MR Register Report Generating Please Wait..!");
  }
  //#endregion
}