import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { PrqEntryControls } from 'src/assets/FormControls/prq-entry';
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { processProperties } from 'src/app/Masters/processUtility';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from '../quick-booking/quick-utility';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { addPrqData, showConfirmationDialog, updatePrqStatus } from './prq-utitlity';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';

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
  breadScrums = [
    {
      title: "PRQ Entry",
      items: ["PRQ"],
      active: "PRQ Entry",
    },
  ];
  prqDetail: any;
  isConfirm: boolean;
  constructor(private fb: UntypedFormBuilder, private masterService: MasterService,
    private filter: FilterUtils, private router: Router) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.prqDetail = router.getCurrentNavigation().extras.state.data.columnData;
      if (this.prqDetail.Action === "Confirm") {
        const tabIndex = 6; // Adjust the tab index as needed
        showConfirmationDialog(this.prqDetail, masterService, this.goBack.bind(this), tabIndex);
      }
      else if(this.prqDetail.Action === "Assign Vehicle") {
        this.masterService.setassignVehicleDetail(this.prqDetail);
        this.router.navigate(['/Operation/AssignVehicle'], {
          state: {
            data: this.prqDetail,
  
          },
        });
      }
      else if(this.prqDetail.Action === "Create Docket"){
        this.router.navigate(['/Masters/Docket/EwayBillDocketBookingV2'], {
          state: {
            data: this.prqDetail,
  
          },
        });
      }
      else {
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
  }
  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.prqControls = new PrqEntryControls();
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
      transMode: { variable: 'transModeOn', status: 'transModeOnStatus' }
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
    window.history.back();
  }
  async save() {
    const tabcontrols = this.prqEntryTableForm;
    clearValidatorsAndValidate(tabcontrols);
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const dynamicNumber = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const raise = this.prqEntryTableForm.value.prqBranch;
    const prqNo = `PRQ/${raise}/${financialYear}/${dynamicNumber}`;
    this.prqEntryTableForm.controls['_id'].setValue(prqNo);
    this.prqEntryTableForm.controls['prqId'].setValue(prqNo);
    this.prqEntryTableForm.controls['billingParty'].setValue(this.prqEntryTableForm.controls['billingParty'].value?.name || "");
    this.prqEntryTableForm.controls['fromCity'].setValue(this.prqEntryTableForm.controls['fromCity'].value?.name || "");
    this.prqEntryTableForm.controls['toCity'].setValue(this.prqEntryTableForm.controls['toCity'].value?.name || "");
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
    // console.log(this.prqEntryTableForm.value);
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
