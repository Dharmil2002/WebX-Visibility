import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { GetGeneralMasterData } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MrRegisterService } from 'src/app/Utility/module/reports/mr-register.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { MRRegister } from 'src/assets/FormControls/Reports/MR-Register/mr-register';
import Swal from 'sweetalert2';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { SalesRegisterService } from 'src/app/Utility/module/reports/sales-register';

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
  protected _onDestroy = new Subject<void>();

  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private snackBarUtilityService: SnackBarUtilityService,
    private mrRegisterService: MrRegisterService,
    private storage: StorageService,
    private MCountrService: ModuleCounterService,
    private salesRegister: SalesRegisterService,
    private nav: NavDataService

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
    // const divisionList = await GetGeneralMasterData(this.masterService, 'DIVIS');
    const customerList = await this.customerService.customerFromApi();
    const locationList = await this.locationService.locationFromApi();

    // this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, divisionList, "division", false);
    this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, customerList, "customer", false);
    this.filter.Filter(this.jsonControlArray, this.mRRegisterForm, locationList, "branch", false);

    const loginBranch = locationList.find(x => x.value === this.storage.branch);
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
  //#region to report data file
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

        const branch = this.mRRegisterForm.value.branch.value;
        // const division = this.mRRegisterForm.value.division;

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

        const transformedHeader = this.salesRegister.addChargesToColumns(data.data, data.grid.columns);
        const newdata = this.salesRegister.setCharges(data.data);
        result.grid.columns = transformedHeader;
        result.grid.sorting = data.grid.sorting;
        result.grid.searching = data.grid.searching;
        result.grid.paging = data.grid.paging;

        // Push the module counter data to the server
        this.MCountrService.PushModuleCounter();
        const total = this.getSum(data.data); //getting total of charges        
        const lastRowTTL = this.matchKeysAndSetValues(transformedHeader, total);

        // Add the last row to newdata
        newdata.push(lastRowTTL);

        // Update the result.data
        result.data = newdata;

        // Prepare the state data to include all necessary properties
        const stateData = {
          data: result,
          formTitle: "MR Register Data",
          csvFileName: `MR Register-${moment().format("YYYYMMDD-HHmmss")}`
        };
        // Convert the state data to a JSON string and encode it        
        this.nav.setData(stateData);
        // Create the new URL with the state data as a query parameter
        const url = `/#/Reports/generic-report-view`;
        // Open the URL in a new tab
        window.open(url, '_blank');

        setTimeout(() => {
          Swal.close();
        }, 1000);
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
  //#region to set key and toal in last row
  setcharges(data: any[]): string[] {
    const chargeKeys: Set<string> = new Set();

    data.forEach(item => {
      if (item.cHGLST) {
        item.cHGLST.forEach((charge: any) => {
          chargeKeys.add(charge.cHGNM);
        });
      }
    });

    return Array.from(chargeKeys);
  }
  getSum(data: any[]): { [key: string]: number } {
    let chargesKeys = this.setcharges(data);
    const keys = ['dLVRMRAMT', 'tDSAmt', 'gSTAMT', 'cLLCTAMT', 'fRTAMT', 'sBTTL', 'dTTL', 'aCTWT', 'cHRGWT', 'nOPkg'];
    keys.push(...chargesKeys);

    const total = data.reduce((accumulator, item) => {
      keys.forEach(key => {
        const totalKey = key;
        accumulator[totalKey] = (accumulator[totalKey] || 0) + (item[totalKey] ? parseFloat(item[totalKey]) : 0);
      });
      return accumulator;
    }, {});

    return total;
  }
  // matching key and setting its value
  matchKeysAndSetValues(keysMap, valuesMap) {
    const matchedValues = {};

    keysMap.forEach(keyObj => {
      const key = keyObj.field;

      if (key === 'docNo') {
        matchedValues[key] = "Total";
      } else {
        const value = valuesMap[key];
        matchedValues[key] = value !== undefined ? value : "";
      }
    });

    return matchedValues;
  }
  //#endregion
}