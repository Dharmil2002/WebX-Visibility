import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { PrqEntryControls } from 'src/assets/FormControls/prq-entry';
import { processProperties } from 'src/app/Masters/processUtility';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from '../quick-booking/quick-utility';
import { Router } from '@angular/router';
import { addPrqData, containerFromApi, customerFromApi, locationFromApi, updatePrqStatus } from './prq-utitlity';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { prqDetail } from 'src/app/core/models/operations/prq/prq';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import Swal from 'sweetalert2';
import { getPrqDetailFromApi } from 'src/app/dashboard/tabs/prq-summary-page/prq-summary-utitlity';
import { MatDialog } from '@angular/material/dialog';
import { PrqListComponent } from './prq-list/prq-list.component';
import { setControlValue } from 'src/app/Utility/Form Utilities/setform';

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
  typeContainerCode: string;
  typeContainerStatus: boolean;
  containerSizeCode: string;
  containerSizeStatus: boolean;
  allPrqDetail: any;
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
  customerList: any;

  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils, private router: Router,
    public dialog: MatDialog
  ) {
    this.prqDetail = new prqDetail({});
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.prqDetail = router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.initializeFormControl();
    }
    else {
      this.initializeFormControl();

    }
  }

  ngOnInit(): void {
    this.bindDropDown();
    this.getCity();
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
      this.prqEntryTableForm.controls['containerSize'].setValue({ name: this.prqDetail.containerSize, value: this.prqDetail.containerSize });
      this.prqEntryTableForm.controls['typeContainer'].setValue({ name: this.prqDetail.typeContainer, value: this.prqDetail.typeContainer });
      this.prqEntryTableForm.controls['payType'].setValue(this.prqDetail.payType);
    }
    else {
      this.prqEntryTableForm.controls['transMode'].setValue("Road");
      this.prqEntryTableForm.controls['payType'].setValue("TBB");
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
      prqBranch: { variable: 'prqBranchCode', status: 'prqBranchStatus' },
      typeContainer: { variable: 'typeContainerCode', status: 'typeContainerStatus' },
      containerSize: { variable: 'containerSizeCode', status: 'containerSizeStatus' }
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
      this.disableSize("Road")
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
    this.prqEntryTableForm.controls['typeContainer'].enable();
    this.prqEntryTableForm.controls['containerSize'].enable();
    this.prqEntryTableForm.controls['vehicleSize'].enable();
    this.prqEntryTableForm.controls['prqBranch'].setValue(this.prqEntryTableForm.controls['prqBranch'].value?.value || "");
    this.prqEntryTableForm.controls['billingParty'].setValue(this.prqEntryTableForm.controls['billingParty'].value?.name || "");
    this.prqEntryTableForm.controls['fromCity'].setValue(this.prqEntryTableForm.controls['fromCity'].value?.name || "");
    this.prqEntryTableForm.controls['toCity'].setValue(this.prqEntryTableForm.controls['toCity'].value?.name || "");
    this.prqEntryTableForm.controls['typeContainer'].setValue(this.prqEntryTableForm.controls['typeContainer'].value?.name || "");
    this.prqEntryTableForm.controls['containerSize'].setValue(this.prqEntryTableForm.controls['containerSize'].value?.name || "");
    const controlNames = ["transMode", "payType", "vehicleSize"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.prqEntryTableForm.value[controlName])) {
        this.prqEntryTableForm.controls[controlName].setValue("");
      }
    });
    if (!this.isUpdate) {
      const thisYear = new Date().getFullYear();
      const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
      const location = localStorage.getItem("Branch"); // Replace with your dynamic value
      const blParty = this.prqEntryTableForm.controls['billingParty'].value.toUpperCase();
      const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
      const paddedNumber = dynamicNumber.toString().padStart(7, "0");
      let prqNo = `${location.substring(0, 3)}${blParty.substring(0, 3)}${financialYear}${paddedNumber}`;
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
      const prqNo = this.prqEntryTableForm.controls['prqId'].value.value;
      this.prqEntryTableForm.controls['_id'].setValue(prqNo);
      const res = await updatePrqStatus(this.prqEntryTableForm.value, this.masterService)
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `PRQ No: ${this.prqEntryTableForm.controls['prqId'].value}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack(6)
          }
        });
      }
      // const tabIndex = 6; // Adjust the tab index as needed
      // showConfirmationDialog(this.prqEntryTableForm.value, this.masterService, this.goBack.bind(this), tabIndex);
    }
    // console.log(this.prqEntryTableForm.value);
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
  async bindDataFromDropdown() {
    const resLoc = await locationFromApi(this.masterService);
    const resCust = await customerFromApi(this.masterService);
    this.customerList = resCust;
    const resContainer = await containerFromApi(this.masterService);
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

    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      resContainer,
      this.containerSizeCode,
      this.containerSizeStatus
    );

    this.filter.Filter(
      this.jsonControlPrqArray,
      this.prqEntryTableForm,
      resContainer,
      this.typeContainerCode,
      this.typeContainerStatus
    );
    this.allPrqDetail = await getPrqDetailFromApi(this.masterService);
  }

  bilingChanged() {
    const billingParty = this.prqEntryTableForm.controls['billingParty'].value?.name || "";
    let prqDetail = this.allPrqDetail.filter((x) => x.billingParty.toLowerCase() === billingParty.toLowerCase()).slice(0, 5);;
    if (prqDetail.length > 0) {
      this.prqView(prqDetail);
      // Swal.fire({
      //   icon: "info",
      //   title: "Previous Billing Party Details",
      //   text: "You can now select the previous details of the billing party.",
      //   showCancelButton: true,
      //   confirmButtonText: "Yes",
      //   showConfirmButton: true,
      //   cancelButtonText: "No"
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // Add your event code for "OK" here
      //     // This code will run when the user clicks "OK"
      //     this.prqView(prqDetail)
      //   }
      // });

    }
  }
  prqView(prqDetail) {
    const dialogref = this.dialog.open(PrqListComponent, {
      width: "100vw",
      height: "100vw",
      maxWidth: "232vw",
      data: prqDetail,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.autoFillPqrDetail(result[0]);
    });
  }
  autoFillPqrDetail(result) {
    if (result) {
      setControlValue(this.prqEntryTableForm.get('transMode'), result.transMode);
      setControlValue(this.prqEntryTableForm.get('vehicleSize'), result?.vehicleSize?.split("-")[0] ?? '');
      setControlValue(this.prqEntryTableForm.get('fromCity'), { name: result.fromCity, value: result.fromCity });
      setControlValue(this.prqEntryTableForm.get('toCity'), { name: result.toCity, value: result.toCity });
      const billingParty = this.customerList.find((x) => x.name.toLowerCase() === result.billingParty.toLowerCase());
      setControlValue(this.prqEntryTableForm.get('billingParty'), billingParty);
      setControlValue(this.prqEntryTableForm.get('contactNo'), result.contactNo);
      setControlValue(this.prqEntryTableForm.get('prqBranch'), { name: result.prqBranch, value: result.prqBranch });
      setControlValue(this.prqEntryTableForm.get('containerSize'), { name: result.containerSize, value: result.containerSize });
      setControlValue(this.prqEntryTableForm.get('typeContainer'), { name: result.typeContainer, value: result.typeContainer });
      setControlValue(this.prqEntryTableForm.get('pAddress'), result?.pAddress);
    }
  }

  disableSize(event) {
    
    if (typeof(event)==="object" && event.eventArgs.value == "Rail") {
      this.prqEntryTableForm.controls['typeContainer'].enable();
      this.prqEntryTableForm.controls['containerSize'].enable();
      this.prqEntryTableForm.controls['vehicleSize'].disable();
    }
    else {

      this.prqEntryTableForm.controls['typeContainer'].disable();
      this.prqEntryTableForm.controls['containerSize'].disable();
      this.prqEntryTableForm.controls['vehicleSize'].enable();
    }

  }
}

