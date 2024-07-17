import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import moment from 'moment';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { SalesRegisterService } from 'src/app/Utility/module/reports/sales-register';
import { salesRegisterControl } from 'src/assets/FormControls/Reports/sales-register/sales-register-advance';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
@Component({
  selector: 'app-sales-register-advanced',
  templateUrl: './sales-register-advanced.component.html'
})
export class SalesRegisterAdvancedComponent implements OnInit {

  breadScrums = [
    {
      title: "Sales Register Advanced Report",
      items: ["Home"],
      active: "Sales Register Advanced Report",
    },
  ];
  salesregisterTableForm: UntypedFormGroup
  cnoteBillMRFormControls: salesRegisterControl
  jsonsalesregisterFormArray: any
  originName: any;
  originStatus: any;
  desName: any;
  protected _onDestroy = new Subject<void>();
  jsoncnoteBillMRFormArray: any;
  desStatus: any;
  payName: any;
  payStatus: any;
  bookingName: any;
  bookingStatus: any;
  cnoteName: any;
  cnoteStatus: any;
  custName: any;
  custStatus: any;
  tranName: any;
  tranStatus: any;
  billAtName: any;
  billAtStatus: any;
  chargesKeys: any[];
  formTitle = "Sales Register Advance Data"
  csvFileName: string; // name of the csv file, when data is downloaded  

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private generalService: GeneralService,
    private customerService: CustomerService,
    private salesRegisterService: SalesRegisterService,
    public snackBarUtilityService: SnackBarUtilityService,
    private nav: NavDataService
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.salesregisterTableForm.controls["start"].setValue(lastweek);
    this.salesregisterTableForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = `Sales_Register_Report-${moment().format("YYYYMMDD-HHmmss")}`;
  }

  initializeFormControl() {
    this.cnoteBillMRFormControls = new salesRegisterControl();
    this.jsonsalesregisterFormArray = this.cnoteBillMRFormControls.salesRegisterControlArray;
    this.originName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "origin"
    )?.name;
    this.originStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "origin"
    )?.additionalData.showNameAndValue;
    this.desName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "destination"
    )?.name;
    this.desStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "destination"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.name;
    this.payStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.additionalData.showNameAndValue;
    this.bookingName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "bookType"
    )?.name;
    this.bookingStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "bookType"
    )?.additionalData.showNameAndValue;
    this.cnoteName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cnote"
    )?.name;
    this.cnoteStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cnote"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cust"
    )?.name;
    this.custStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cust"
    )?.additionalData.showNameAndValue;
    this.tranName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "tranmode"
    )?.name;
    this.tranStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "tranmode"
    )?.additionalData.showNameAndValue;
    this.billAtName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "billAt"
    )?.name;
    this.billAtStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "billAt"
    )?.additionalData.showNameAndValue;
    this.salesregisterTableForm = formGroupBuilder(this.fb, [this.jsonsalesregisterFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonsalesregisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonsalesregisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.salesregisterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const paymentType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "PAYTYP" }, "codeDesc", "codeId");
    const booking: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "DELTYP" }, "codeDesc", "codeId");
    // const cnote = await getShipment(this.operationService, false);
    // const shipmentDetail = cnote.map((x) => {
    //   return { value: x.docketNumber, name: x.docketNumber };
    // });
    const customer = await this.customerService.customerFromApi();
    const tranmode: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "tran_mode" }, "codeDesc", "codeId");
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.originName,
      this.originStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.desName,
      this.desStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      booking,
      this.bookingName,
      this.bookingStatus
    );
    // this.filter.Filter(
    //   this.jsonsalesregisterFormArray,
    //   this.salesregisterTableForm,
    //   shipmentDetail,
    //   this.cnoteName,
    //   this.cnoteStatus
    // );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      customer,
      this.custName,
      this.custStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      tranmode,
      this.tranName,
      this.tranStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.billAtName,
      this.billAtStatus
    );
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const startValue = new Date(this.salesregisterTableForm.controls.start.value);
        const endValue = new Date(this.salesregisterTableForm.controls.end.value);

        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();

        const loct = Array.isArray(this.salesregisterTableForm.value.fromlocHandler)
          ? this.salesregisterTableForm.value.fromlocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const toloc = Array.isArray(this.salesregisterTableForm.value.tolocHandler)
          ? this.salesregisterTableForm.value.tolocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const payment = Array.isArray(this.salesregisterTableForm.value.payTypeHandler)
          ? this.salesregisterTableForm.value.payTypeHandler.map(x => { return { payCD: x.value, payNm: x.name }; })
          : [];
        const bookingtype = Array.isArray(this.salesregisterTableForm.value.bookTypeHandler)
          ? this.salesregisterTableForm.value.bookTypeHandler.map(x => { return { bkCD: x.value, bkNm: x.name }; })
          : [];
        const cnote = this.salesregisterTableForm.value.cnote
        const customer = Array.isArray(this.salesregisterTableForm.value.custHandler)
          ? this.salesregisterTableForm.value.custHandler.map(x => { return { custCD: x.value, custNm: x.name }; })
          : [];
        const mode = Array.isArray(this.salesregisterTableForm.value.transitHandler)
          ? this.salesregisterTableForm.value.transitHandler.map(x => { return { mdCD: x.value, mdNm: x.name }; })
          : [];
        const flowType = this.salesregisterTableForm.value.flowType;
        const status = this.salesregisterTableForm.value.status;

        const data = await this.salesRegisterService.getsalesRegisterReportDetail(startDate, endDate, loct, toloc, payment, bookingtype, cnote, customer, mode, flowType, status);
        const transformedHeader = this.addChargesToColumns(data.data, data.grid.columns);
        const newdata = this.setCharges(data.data);

        if (data.data.length === 0) {
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
        let result = {
          data: [],
          grid: {
            columns: [],
            sorting: {},
            searching: {},
            paging: {}
          }
        };
        result.grid.columns = transformedHeader;
        result.grid.sorting = data.grid.sorting;
        result.grid.searching = data.grid.searching;
        result.grid.paging = data.grid.paging;
        result.data = newdata;

        // Prepare the state data to include all necessary properties
        const stateData = {
          data: result,
          formTitle: this.formTitle,
          csvFileName: this.csvFileName
        };
        // Convert the state data to a JSON string and encode it        
        this.nav.setData(stateData);
        // Create the new URL with the state data as a query parameter
        const url = `/#/Reports/generic-report-view`;
        // Open the URL in a new tab
        window.open(url, '_blank');
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Sales Register Advance Generating Please Wait..!");
  }
  // function to set charges
  setCharges(data) {
    const existingCharges = new Set();

    data.forEach((item) => {
      if (item.cHGLST && Array.isArray(item.cHGLST) && item.cHGLST.length > 0) {
        item.cHGLST.forEach((charge) => {
          if (!existingCharges.has(charge.cHGNM)) {
            item[charge.cHGNM] = charge.aMT;
            existingCharges.add(charge.cHGNM);
          }
        });
      }
    });

    return data;
  }
  // function to set charges
  addChargesToColumns(data, columns) {

    const existingCharges = new Set();

    // Add predefined columns if they don't already exist
    data.forEach((item) => {
      if (item.cHGLST && Array.isArray(item.cHGLST) && item.cHGLST.length > 0) {
        item.cHGLST.forEach((charge) => {
          if (!existingCharges.has(charge.cHGNM)) {
            columns.push({
              header: charge.cHGNM,
              field: charge.cHGNM,
              width: 200
            });
            existingCharges.add(charge.cHGNM);
          }
        });
      }
    });

    return columns;
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