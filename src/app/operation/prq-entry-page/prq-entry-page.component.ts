import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { PrqEntryControls } from 'src/assets/FormControls/prq-entry';
import { processProperties } from 'src/app/Masters/processUtility';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from '../quick-booking/quick-utility';
import { Router } from '@angular/router';
import { addPrqData, customerFromApi, locationFromApi, showConfirmationDialog } from './prq-utitlity';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { prqDetail } from 'src/app/core/models/operations/prq/prq';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import Swal from 'sweetalert2';
import { RetryAndDownloadService } from 'src/app/core/service/api-tracking-service/retry-and-download.service';
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';

@Component({
  selector: 'app-prq-entry-page',
  templateUrl: './prq-entry-page.component.html',
  providers: [FilterUtils],
})
export class PrqEntryPageComponent implements OnInit {
  prqControls: PrqEntryControls;
  prqEntryTableForm: UntypedFormGroup;
  jsonControlPrqArray: FormControls[];
  fromCity: string; //it's used in getCity() for the binding a fromCity
  fromCityStatus: boolean; //it's used in getCity() for binding fromCity
  toCity: string; //it's used in getCity() for binding ToCity
  toCityStatus: boolean; //it's used in getCity() for binding ToCity
  customer: string; //it's used in customerDetails() for binding billingParty
  billingPartyStatus: boolean; //it's used in customerDetails() for binding billingParty
  companyCode = parseInt(localStorage.getItem("companyCode"));
  fleetSize: string;
  fleetSizeStatus: boolean;
  ftlType: string;
  ftlTypeStatus: boolean;
  prqRaiseOn: string;
  prqRaiseOnStatus: boolean;
  transMode: string;
  transModeStatus: boolean;
  isUpdate: boolean;
  prqBranchCode: string;
  prqBranchStatus: boolean;
  pendingOperations = false;
  breadScrums = [
    {
      title: "PRQ Entry",
      items: ["PRQ"],
      active: "PRQ Entry",
    },
  ];
  prqDetail: prqDetail;
  isConfirm: boolean;
  locationDetail: any;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private failedApiService: FailedApiServiceService,
    private retryAndDownloadService: RetryAndDownloadService,
    private filter: FilterUtils, private router: Router) {
    this.prqDetail = new prqDetail({});
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.prqDetail = router.getCurrentNavigation().extras.state.data.columnData;

      if (this.prqDetail.Action === "Assign Vehicle") {
        this.masterService.setassignVehicleDetail(this.prqDetail);
        this.router.navigate(['/Operation/AssignVehicle'], {
          state: {
            data: this.prqDetail,

          },
        });
      }
      else if (this.prqDetail.Action === "Create Docket") {
        this.router.navigate(['/Masters/Docket/EwayBillDocketBookingV2'], {
          state: {
            data: this.prqDetail,

          },
        });
      }
      else {
        this.isUpdate = true;
        this.isConfirm = true
        this.initializeFormControl();
      }

    }
    else {
      this.isConfirm = true
      this.initializeFormControl();

    }
  }

  ngOnInit(): void {
    this.bindDropDown();
    this.getCity();
    this.getCustomerDetails();
    this.autoFill();
    this.bindDataFromDropdown();
  }


  autoFill() {

    if (this.isUpdate) {
      this.prqEntryTableForm.controls['transMode'].setValue(this.prqDetail.transMode);
      this.prqEntryTableForm.controls['vehicleSize'].setValue(this.prqDetail?.vehicleSize?.split("-")[0] ?? '');
      this.prqEntryTableForm.controls['fromCity'].setValue({ name: this.prqDetail.fromCity, value: this.prqDetail.fromCity });
      this.prqEntryTableForm.controls['toCity'].setValue({ name: this.prqDetail.toCity, value: this.prqDetail.toCity });
      this.prqEntryTableForm.controls['billingParty'].setValue({ name: this.prqDetail.billingParty, value: this.prqDetail.billingParty });
    }
    else {
      this.prqEntryTableForm.controls['transMode'].setValue("Road");
    }
  }
  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.prqControls = new PrqEntryControls(this.prqDetail, this.isUpdate);
    // Get form controls for PRQ Entry section
    this.jsonControlPrqArray = this.prqControls.getPrqEntryFieldControls();
    // Create the form group using the form builder and the form controls array
    this.prqEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlPrqArray]);
  }
  bindDropDown() {
    const locationPropertiesMapping = {
      billingParty: { variable: 'customer', status: 'billingPartyStatus' },
      fleetSize: { variable: 'fleetSize', status: 'fleetSizeStatus' },
      fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      toCity: { variable: 'toCity', status: 'toCityStatus' },
      ftlType: { variable: 'ftlType', status: 'ftlTypeStatus' },
      prqRaiseOn: { variable: 'prqRaiseOn', status: 'prqRaiseOnStatus' },
      transMode: { variable: 'transModeOn', status: 'transModeOnStatus' },
      prqBranch: { variable: 'prqBranchCode', status: 'prqBranchStatus' }
    };
    processProperties.call(this, this.jsonControlPrqArray, locationPropertiesMapping);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  // Customer details
  getCustomerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.jsonControlPrqArray,
            this.prqEntryTableForm,
            res,
            this.customer,
            this.billingPartyStatus
          ); // Filter the docket control array based on customer details
        }
      },
    });
  }
  async getCity() {
    try {
      const cityDetail = await getCity(this.companyCode, this.masterService);

      if (cityDetail) {
        this.filter.Filter(
          this.jsonControlPrqArray,
          this.prqEntryTableForm,
          cityDetail,
          this.fromCity,
          this.fromCityStatus
        ); // Filter the docket control array based on fromCity details

        this.filter.Filter(
          this.jsonControlPrqArray,
          this.prqEntryTableForm,
          cityDetail,
          this.toCity,
          this.toCityStatus
        ); // Filter the docket control array based on toCity details
      }
    } catch (error) {
      console.error("Error getting city details:", error);
    }
  }
  cancel() {
    this.goBack(6)
  }
  GetBranchChanges() {
    const locationDetail = this.locationDetail.filter((x) => x.city.toLowerCase() === this.prqEntryTableForm.value.fromCity.name.toLowerCase());
    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      locationDetail,
      this.prqBranchCode,
      this.prqBranchStatus
    );
  }
  async save() {
    const tabcontrols = this.prqEntryTableForm;
    clearValidatorsAndValidate(tabcontrols);
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const dynamicNumber = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const raise = this.prqEntryTableForm.value.prqBranch.value;
    this.prqEntryTableForm.controls['prqBranch'].setValue(this.prqEntryTableForm.controls['prqBranch'].value?.value || "");
    this.prqEntryTableForm.controls['billingParty'].setValue(this.prqEntryTableForm.controls['billingParty'].value?.name || "");
    this.prqEntryTableForm.controls['fromCity'].setValue(this.prqEntryTableForm.controls['fromCity'].value?.name || "");
    this.prqEntryTableForm.controls['toCity'].setValue(this.prqEntryTableForm.controls['toCity'].value?.name || "");
    if (!this.isUpdate) {
      const prqNo = `PRQ/${raise}/${financialYear}/${dynamicNumber}`;
      this.prqEntryTableForm.controls['_id'].setValue(prqNo);
      this.prqEntryTableForm.controls['prqId'].setValue(prqNo);
      const res = await addPrqData(this.prqEntryTableForm.value, this.masterService);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Generated Successfuly",
          text: `PRQ No: ${prqNo}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack(6)
          }
        });
      }
    }
    else {
      const tabIndex = 6; // Adjust the tab index as needed
      showConfirmationDialog(this.prqEntryTableForm.value, this.masterService, this.goBack.bind(this), tabIndex);
    }
    // console.log(this.prqEntryTableForm.value);
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
  async bindDataFromDropdown() {
    const resLoc = await locationFromApi(this.masterService);
    const resCust = await customerFromApi(this.masterService);
    this.locationDetail = resLoc;
    if (this.isUpdate) {
      const prqLoc = resLoc.find((x) => x.value.trim() === this.prqDetail.prqBranch);
      this.prqEntryTableForm.controls['prqBranch'].setValue(prqLoc);
    }

    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      resLoc,
      this.prqBranchCode,
      this.prqBranchStatus
    );
    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      resCust,
      this.customer,
      this.billingPartyStatus
    );
  }
  performOperation() {
    // Your operation code here
    this.pendingOperations = true;
  }
  // Listen for page reload attempts
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.dowloadData();
    // Your custom message
    const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';
    // Set the custom message
    $event.returnValue = confirmationMessage;

  }
  dowloadData() {
    const failedRequests = this.failedApiService.getFailedRequests();
    if (failedRequests.length > 0) {
      this.retryAndDownloadService.downloadFailedRequests();
    }

  }

}

