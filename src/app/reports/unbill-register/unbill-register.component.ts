import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { billRegControl } from 'src/assets/FormControls/Reports/Unbill-Register/unbill-register';

@Component({
  selector: 'app-unbill-register',
  templateUrl: './unbill-register.component.html'
})
export class UnbillRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "UnBilled Register Report ",
      items: ["Home"],
      active: "UnBilled Register Report ",
    },
  ];
  unbillRegisTableForm: UntypedFormGroup
  jsonunBillRegisFormArray: any
  unBillFormControls: billRegControl
  protected _onDestroy = new Subject<void>();
  locName: any;
  locStatus: any;
  loading = true // Loading indicator
  data: any;
  formTitle: string;
  csvFileName: string;
  ReportingBranches: string[] = [];
  columns = [];
  paging: any;
  sorting: any;
  columnMenu: any;
  searching: any;
  theme: "MATERIAL"
  custName: any;
  custnameStatus: any;
  payName: string;
  payStatus: boolean;

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private reportService: ReportService,
    private customerService: CustomerService,
    public snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private storage: StorageService,
    private generalService: GeneralService,
    private nav: NavDataService,
    private masterService: MasterService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()
    this.unbillRegisTableForm.controls["start"].setValue(lastweek);
    this.unbillRegisTableForm.controls["end"].setValue(now);
    this.getDropDownList()
    this.csvFileName = "UnBilled_Register_Report";
    this.getPaymentType();
  }

  //#region initializeFormControl
  initializeFormControl() {
    this.unBillFormControls = new billRegControl();
    this.jsonunBillRegisFormArray = this.unBillFormControls.billRegControlArray;
    this.locName = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "loc"
    )?.name;
    this.locStatus = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "loc"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "CUST"
    )?.name;
    this.custnameStatus = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "CUST"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "payType"
    )?.name;
    this.payStatus = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "payType"
    )?.additionalData.showNameAndValue;
    this.unbillRegisTableForm = formGroupBuilder(this.fb, [this.jsonunBillRegisFormArray]);
  }
  //#endregion

  //#region getPaymentType()
  async getPaymentType() {
    try {
      const generalData = await this.generalService.getGeneralMasterData("PAYTYP");
      const paytype = generalData.map((element) => ({
        name: String(element.name),
        value: String(element.value),
      }));
      this.filter.Filter(
        this.jsonunBillRegisFormArray,
        this.unbillRegisTableForm,
        paytype,
        this.payName,
        this.payStatus
      );
    } catch (error) {
      console.error('Error fetching walkin_customers details:', error);
    }
  }
  //#endregion

  //#region getCustomer()
  async getCustomer() {
    try {
      const cValue = this.unbillRegisTableForm.controls['CUST'].value;
      // Check if cValue is provided and has at least 3 characters
      if (cValue.length >= 3) {
        const filter = { D$or: [{ customerName: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }, { customerCode: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }] };
        const mastersRes = await this.customerService.customerFromFilter(filter, true)
        if (mastersRes.length > 0) {
          this.filter.Filter(
            this.jsonunBillRegisFormArray,
            this.unbillRegisTableForm,
            mastersRes,
            this.custName,
            this.custnameStatus)
        }
        else {
          const WalkFilter = { cUSTNM: { 'D$regex': `^${cValue}`, 'D$options': 'i' } };
          // Prepare the request object
          const req = {
            companyCode: this.storage.companyCode,
            collectionName: "walkin_customers",
            filter: WalkFilter,
          };
          // Make the API call using firstValueFrom for the first emitted value
          const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
          // Extract customer data from the response
          const cust = res.data.map((element) => ({
            name: String(element.cUSTNM),
            value: String(element.cUSTCD)
          }));
          // Filter customer data for partial matches
          if (cust.length === 0) {
            console.log(`No data found for Customer ${cValue}`);
          } else {
            this.filter.Filter(
              this.jsonunBillRegisFormArray,
              this.unbillRegisTableForm,
              cust,
              this.custName,
              this.custnameStatus
            );
          }
        }
      }
    } catch (error) {
      console.error('Error fetching walkin_customers details:', error);
    }
  }
  //#endregion

  //#region toggleSelectAll
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonunBillRegisFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonunBillRegisFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.unbillRegisTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  //#region getDropDownList
  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    this.filter.Filter(
      this.jsonunBillRegisFormArray,
      this.unbillRegisTableForm,
      locationList,
      this.locName,
      this.locStatus
    );
    const loginBranch = locationList.find(x => x.value === this.storage.branch);
    const mode = this.storage.mode;
    this.unbillRegisTableForm.controls["loc"].setValue(loginBranch);
    this.unbillRegisTableForm.controls["loadType"].setValue(mode);
    this.unbillRegisTableForm.get('Individual').setValue("Y");
  }
  //#endregion

  //#region getunbillRegisterReportDetail
  async getunbillRegisterReportDetail(data) {
    let matchQuery = {
      'D$and': [
        { dKTDT: { D$gte: data.startValue } }, // Convert start date to ISO format
        { dKTDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
        ...(data.individual == "Y" ? [{ oRGN: { D$in: data.loc } }] : [{}]),
        ...(data.payBasis ? [{ pAYTYP: { D$eq: data.payBasis } }] : [{}]), // Pay basis condition
        ...(data.cust ? [{ bPARTY: { D$eq: data.cust } }] : [{}]), // Pay basis condition
      ],
      cNL: {
        'D$in': [false, null]
      }
    };
    const reportName = data.loadtype === 'FTL' ? 'UnBilledRegisterReport' : 'UnBilledRegisterReportLTL';
    if(data.loadtype =="All"){
    const report=['UnBilledRegisterReport','UnBilledRegisterReportLTL']
    let allRes=[];
    let grid=[];
      for(let r of report){
        const res = await this.reportService.fetchReportData(r, matchQuery);
        grid=res.data.grid;
        if(res.data&& res.data.data.length>0){
        allRes.push(...res.data.data);
        }
      }
       return{
        data:allRes,
        grid:grid
       }
    }
    const res = await this.reportService.fetchReportData(reportName, matchQuery);
    return {
      data: res.data.data,
      grid: res.data.grid
    };
  }
  //#endregion

  //#region save
  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.unbillRegisTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.unbillRegisTableForm.value.loc.name);
        this.ReportingBranches.push(this.unbillRegisTableForm.value.loc?.value || "");
      } else {
        this.ReportingBranches.push(this.unbillRegisTableForm.value.loc?.value || "");
      }
      const startDate = new Date(this.unbillRegisTableForm.controls.start.value);
      const endDate = new Date(this.unbillRegisTableForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const cust = this.unbillRegisTableForm.value.CUST.value;
      const loc = this.ReportingBranches;
      const individual = this.unbillRegisTableForm.value.Individual;
      const payBasis = this.unbillRegisTableForm.value.payType.value;
      const loadtype = this.unbillRegisTableForm.value.loadType;
      const reqBody = {
        startValue, endValue, loc, individual, loadtype, payBasis, cust
      }
      const result = await this.getunbillRegisterReportDetail(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;
      // Prepare the state data to include all necessary properties
      const stateData = {
        data: result,
        formTitle: 'UnBilled Register Report',
        csvFileName: this.csvFileName
      };
      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
      // Convert the state data to a JSON string and encode it
      const stateString = encodeURIComponent(JSON.stringify(stateData));
      this.nav.setData(stateData);
      // Create the new URL with the state data as a query parameter
      const url = `/#/Reports/generic-report-view`;
      // Open the URL in a new tab
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  //#endregion

  //#region functionCallHandler
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

}
