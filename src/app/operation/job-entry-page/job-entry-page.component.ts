import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import { JobControl } from "src/assets/FormControls/job-entry";
import Swal from "sweetalert2";
@Component({
  selector: 'app-job-entry-page',
  templateUrl: './job-entry-page.component.html',
  providers: [FilterUtils],
})
export class JobEntryPageComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  billingParty: any;
  billingPartyStatus: any;
  fleetSize: any;
  fleetSizeStatus: any;
  jobLocation: any;
  jobLocationStatus: any;
  transportMode: any;
  transportModeStatus: any;
  fromCity: any;
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  jobFormControls: JobControl;
  isUpdate: boolean;
  jsonControlArray: any;
  jobEntryTableForm: UntypedFormGroup;
  cityData: any;
  breadScrums = [
    {
      title: "Job Entry",
      items: ["Home"],
      active: "Job Entry",
    },
  ];

  constructor(private router: Router, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.bindDropdown();
    this.getCityList();
    this.getCustomerDetails();
  }

  bindDropdown() {
    const jobPropertiesMapping = {
      billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
      fleetSize: { variable: 'fleetSize', status: 'fleetSizeStatus' },
      jobLocation: { variable: 'jobLocation', status: 'jobLocationStatus' },
      transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
      fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      toCity: { variable: 'toCity', status: 'toCityStatus' }
    };
    processProperties.call(this, this.jsonControlArray, jobPropertiesMapping);
  }

  initializeFormControl() {
    this.jobFormControls = new JobControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.jobFormControls.getJobFormControls();
    // Build the form group using formGroupBuilder function
    this.jobEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  getCustomerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.jsonControlArray,
            this.jobEntryTableForm,
            res,
            this.billingParty,
            this.billingPartyStatus
          ); // Filter the docket control array based on customer details
        }
      },
    });
  }

  getCityList() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "city_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const cityList = res.data.map(element => ({
          name: element.cityName,
          value: element.id
        }));
        this.filter.Filter(
          this.jsonControlArray,
          this.jobEntryTableForm,
          cityList,
          this.fromCity,
          this.fromCityStatus
        );

        this.filter.Filter(
          this.jsonControlArray,
          this.jobEntryTableForm,
          cityList,
          this.toCity,
          this.toCityStatus
        );
      }
    });
  }
  save() {
   
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    let jeNo = `JE/${dynamicValue}/${financialYear}/${paddedNumber}`;
  
    Swal.fire({
      icon: "success",
      title: "Generated Successfuly",
      text: "Job Entry No: " + jeNo,
      showConfirmButton: true,
    }).then((result)=>{
      if(result.isConfirmed){
        this.router.navigate(['/Operation/CHAEntry']);
      }
    });
  }

  cancel() {
    window.history.back();
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