import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DriverService } from 'src/app/Utility/module/masters/driver-master/drivers.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { VehicleStatusService } from 'src/app/Utility/module/operation/vehicleStatus/vehicle.service';
import { DriverStatusRegisterService } from 'src/app/Utility/module/reports/driver-status-report-service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { driverstatusRegister } from 'src/assets/FormControls/Reports/driverStatus-Register/driverstatus-register';

@Component({
  selector: 'app-driver-status-register',
  templateUrl: './driver-status-register.component.html'
})
export class DriverStatusRegisterComponent implements OnInit {

  breadScrums = [
    {
      title: "Driver Status Register Report",
      items: ["Report"],
      active: "Driver Status Register Report",
    },
  ];
  driverstatusRegisterForm: UntypedFormGroup;
  driverStatusjsonControlArray: any;
  protected _onDestroy = new Subject<void>();
  driverstatusFormControls: driverstatusRegister
  driLocNM: any;
  drivLocStatus: any;
  jsonControlArray: any;
  vehNoNM: any;
  vehNoStatus: any;
  driverNmStatus: any;
  driverNm: any;
  vehicleDet: any;
  driverDet: any;
  loading = true
  columns = [];
  paging: any;
  sorting: any;
  searching: any;
  csvFileName: string;
  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private driverService: DriverService,
    private filter: FilterUtils,
    private vehStatus: VehicleStatusService,
    private storage: StorageService,
    private masterService: MasterService,
    private reportService: ReportService,
    public snackBarUtilityService: SnackBarUtilityService,
    private nav: NavDataService,
    private driverStatusRegisterService: DriverStatusRegisterService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.driverstatusFormControls = new driverstatusRegister();
    this.driverStatusjsonControlArray = this.driverstatusFormControls.driverstatusRegisterControlArray;
    this.driLocNM = this.driverStatusjsonControlArray.find(
      (data) => data.name === "drivLoc"
    )?.name;
    this.drivLocStatus = this.driverStatusjsonControlArray.find(
      (data) => data.name === "drivLoc"
    )?.additionalData.showNameAndValue;
    this.vehNoNM = this.driverStatusjsonControlArray.find(
      (data) => data.name === "vehNo"
    )?.name;
    this.vehNoStatus = this.driverStatusjsonControlArray.find(
      (data) => data.name === "vehNo"
    )?.additionalData.showNameAndValue;
    this.driverNm = this.driverStatusjsonControlArray.find(
      (data) => data.name === "driverNm"
    )?.name;
    this.driverNmStatus = this.driverStatusjsonControlArray.find(
      (data) => data.name === "driverNm"
    )?.additionalData.showNameAndValue;
    this.driverstatusRegisterForm = formGroupBuilder(this.fb, [this.driverStatusjsonControlArray]);
  }

  ngOnInit(): void {
    this.getDropdownData();
    this.csvFileName = "Driver_Status_Register_Report";
  }

  async getDropdownData() {
    // Location
    const locationList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.driverStatusjsonControlArray,
      this.driverstatusRegisterForm,
      locationList,
      this.driLocNM,
      this.drivLocStatus
    );
    // Vehicle
    let vehicleReq = {
      companyCode: this.storage.companyCode,
      filter: {},
      collectionName: "vehicle_detail",
    };
    const vehicleRes = await firstValueFrom(this.masterService
      .masterPost("generic/get", vehicleReq));
    const vehicleDet = vehicleRes.data.map((element) => ({
      name: element.vehicleNo,
      value: element.vehicleNo,
    }));
    this.vehicleDet = vehicleDet;
    this.filter.Filter(
      this.driverStatusjsonControlArray,
      this.driverstatusRegisterForm,
      vehicleDet,
      this.vehNoNM,
      this.vehNoStatus
    );
    // Driver
    const DriverList = await this.driverService.getDriverDetail();
    const driverDet = DriverList.map((element) => ({
      name: element.driverName,
      value: element.manualDriverCode,
    }));
    this.driverDet = driverDet;
    this.filter.Filter(
      this.driverStatusjsonControlArray,
      this.driverstatusRegisterForm,
      driverDet,
      this.driverNm,
      this.driverNmStatus
    );
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.driverStatusjsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.driverStatusjsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.driverstatusRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  // async getdriverstatusReportDetail(data) {
  //   let statusArray = [];
  //   if (data.status === "1") {
  //     statusArray = [{ 'activeFlag': { 'D$eq': true } }];
  //   } else if (data.status === "2") {
  //     statusArray = [{ 'activeFlag': { 'D$eq': false } }];
  //   } else if (data.status === "3") {
  //     statusArray = [{ '$vehicleStat.status': { 'D$eq': "In Transit" } }];
  //   } else if (data.status === "4") {
  //     statusArray = [{ '$vehicleStat.status': { 'D$eq': "Available" } }];
  //   }

  //   let matchQuery = {
  //     D$or: [
  //       ...(data.driverNm.length > 0 ? [{ 'driverName': { 'D$in': data.driverNm } }] : []),
  //       ...(data.vehicle.length > 0 ? [{ 'vehicleNo': { 'D$in': data.vehicle } }] : []),
  //       ...statusArray,
  //       ...(data.driverLoc.length > 0 ? [{ 'vehicleDet.controllBranch': { 'D$in': data.driverLoc } }] : []),
  //     ]
  //   };
  //   const res = await this.reportService.fetchReportData("DriverStatusRegister", matchQuery);
  //   console.log("res", res);
  //   const details = res.data.data.map((item) => ({
  //     ...item,
  //     registrationDt: item.registrationDt ? moment(item.registrationDt).format("DD MMM YY HH:MM") : "",
  //     birthDt: item.birthDt ? moment(item.birthDt).format("DD MMM YY HH:MM") : "",
  //     licenseValidate: item.licenseValidate ? moment(item.licenseValidate).format("DD MMM YY HH:MM") : "",
  //     lasterUpdateDt: item.lasterUpdateDt ? moment(item.lasterUpdateDt).format("DD MMM YY HH:MM") : "",
  //   }));

  //   return {
  //     data: details,
  //     grid: res.data.grid
  //   };
  // }

  async save() {

    this.loading = true;
    try {
      const driverNm = Array.isArray(this.driverstatusRegisterForm.value.driverNMHandler)
        ? this.driverstatusRegisterForm.value.driverNMHandler.map(x => x.name)
        : [];
      const vehicle = Array.isArray(this.driverstatusRegisterForm.value.vehNoHandler)
        ? this.driverstatusRegisterForm.value.vehNoHandler.map(x => x.name)
        : [];
      const status = Array.isArray(this.driverstatusRegisterForm.value.sts) ? "" : this.driverstatusRegisterForm.value.sts;
      const driverLoc = Array.isArray(this.driverstatusRegisterForm.value.driverLocHandler)
        ? this.driverstatusRegisterForm.value.driverLocHandler.map(x => x.name)
        : [];

      const reqBody = {
        driverNm, vehicle, status, driverLoc
      };
      const result = await this.driverStatusRegisterService.getdriverRegisterReportDetail(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      // Prepare the state data to include all necessary properties
      const stateData = {
        data: result,
        formTitle: 'Driver Status Register Report',
        csvFileName: this.csvFileName
      };
      // Convert the state data to a JSON string and encode it
      const stateString = encodeURIComponent(JSON.stringify(stateData));
      this.nav.setData(stateData);

      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
      // Create the new URL with the state data as a query parameter
      const url = `/#/Reports/generic-report-view`;
      // Open the URL in a new tab
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
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
