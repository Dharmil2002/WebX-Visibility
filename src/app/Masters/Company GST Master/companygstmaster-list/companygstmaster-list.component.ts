import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CompanyGSTControl } from 'src/assets/FormControls/CompanyGSTMaster';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-companygstmaster-list',
  templateUrl: './companygstmaster-list.component.html'
})
export class CompanygstmasterListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Company GST Master",
      items: ["Masters"],
      active: "Company GST Master"
    }
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }
  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'Action', Path: 'Operation/CreateRunSheet' }
  ]
  menuItems = [
    { label: 'Create Run Sheet' },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [
    'activeFlag',
    'isActive',
    'isActiveFlag',
    'isMultiEmployeeRole'
  ]
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table > 

  columnHeader = {
    "CompanyCode": "Company Code",
    "CompanyName": "Company Name",
    "BillingStateType": "ST/UT ",
    "GSTBillingStateName": "ST/UT Name",
    "BillingAddress": "Address",
    "GSTBillingCityName": "City",
    "BillingLocationCode": "Location",
    "GSTINNumber": "GSTIN Number"
  }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "CompanyCode": "Company Code",
    "CompanyName": "Company Name",
    "BillingStateType": "ST/UT ",
    "GSTBillingStateName": "ST/UT Name",
    "BillingAddress": "Address",
    "GSTBillingCityName": "City",
    "BillingLocationCode": "Location",
    "GSTINNumber": "GSTIN Number"
  }
  //#endregion
  // IscheckBoxRequired: boolean;
  // advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  // viewComponent: any;
  boxData: { count: any; title: any; class: string; }[];
  // declararing properties
  CompanyGSTTableForm: UntypedFormGroup;

  constructor(private masterService: MasterService, private fb: UntypedFormBuilder,) {
    super();
  }

  ngOnInit(): void {
    this.getCompanyGstDetails();
    this.intializeFormControl();
  }
  jsonControlArray: any;
  intializeFormControl() {
    const companyGstFormControls = new CompanyGSTControl();
    this.jsonControlArray = companyGstFormControls.getCompanyGSTFormControls();
    this.CompanyGSTTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  functionCaller($event) {

    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  getCompanyGstDetails() {
    // Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('companyJsonUrl').subscribe(res => {
      this.data = res;
      // Assign the companyCode to each item in lst_CompanyGSTDetailDetails
      this.data.lst_CompanyGSTDetailDetails.forEach(item => {
        item.CompanyCode = this.data.lst_CompanyGSTHeaderDetails[0].COMPANYCODE;
        item.CompanyName = this.data.lst_CompanyGSTHeaderDetails[0].COMPANY_NAME;
      });
      this.csv = this.data.lst_CompanyGSTDetailDetails
      this.CompanyGSTTableForm.controls.CompanyName.setValue(this.data.lst_CompanyGSTHeaderDetails[0].COMPANY_NAME)
      this.tableload = false;
    }
    );
  }
}
