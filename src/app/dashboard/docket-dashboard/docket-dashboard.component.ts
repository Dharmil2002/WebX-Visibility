import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { searchMetaData, searchbilling } from './dashboard-utlity';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { searchControls } from 'src/assets/FormControls/search';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from 'src/app/Masters/processUtility';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';

@Component({
  selector: 'app-docket-dashboard',
  templateUrl: './docket-dashboard.component.html'
})
export class DocketDashboardComponent implements OnInit {
  docket=false;
  search:string='';
  searchFlag:boolean;
  searchControls: searchControls;
  jsonControlPrqArray: FormControls[];
  breadscrums = [
    {
      title: "Network Logistics Management",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  docketForm: UntypedFormGroup;
  ewayBillDetail: any;
  searchData: any;
  searchLinks:any[];
  searchDocket:string;
  searchStatus:boolean;


  constructor(private router: Router,private masterService: MasterService, private filter: FilterUtils,private fb: UntypedFormBuilder) {
    this.docket=true
   }

  async ngOnInit(): Promise<void> {
    this.ewayBillDetail=localStorage.getItem("EwayBillDetail");
    this.initializeFormControl();
  }
  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.searchControls = new searchControls();
    // Get form controls for PRQ Entry section
    this.jsonControlPrqArray = this.searchControls.getControls();
    // Create the form group using the form builder and the form controls array
    this.docketForm = formGroupBuilder(this.fb, [this.jsonControlPrqArray]);
    this.bindDropDown();
  }
  docketBooking(event){
    const routeMap = {
      'FullTruckOperations': '/dashboard/Index',
      'EXIMTransportation':'/dashboard/Index',
      'ExpressMovement': '/dashboard/Index',
      'PlanningandDistribution': '/dashboard/Index',
      'CustomerContractsandBilling': '/dashboard/Index',
      'VendorContracts&Payments': '/dashboard/Index',
      'FinancialAccounts': '/dashboard/Index',
      'AdminPortal': '/dashboard/Index',
      'default': '/Masters/Docket/Ewaybill-Config'
    };

    const route = routeMap[event] || routeMap['default'];
    this.router.navigate([route]);
  }
  async searchUrl(){
   this.searchFlag=true;
   this.searchLinks=await searchMetaData(this.searchData,[this.search]);

  }
  async bindDropDown() {
    const locationPropertiesMapping = {
      searchDocket: { variable: 'searchDocket', status: 'searchStatus' },
    };
    processProperties.call(this, this.jsonControlPrqArray, locationPropertiesMapping);
    this.searchData=  await searchbilling(this.masterService);
    const searchDetail=this.searchData.map((x)=>{return {name:x.title,value:x.router}})
    if(this.searchData){
        this.filter.Filter(
          this.jsonControlPrqArray,
          this.docketForm,
          searchDetail,
          this.searchDocket,
          this.searchStatus
        ); // Filter the docket control array based on customer details
    }

  }
  navigate(event){
    this.router.navigateByUrl(event.eventArgs.option.value.value);
    event.preventDefault();
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
  save(){
    
  }

}
