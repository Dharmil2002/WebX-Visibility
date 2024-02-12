import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { CompanyGSTControl } from "src/assets/FormControls/CompanyGSTMaster";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-companygstmaster-list",
  templateUrl: "./companygstmaster-list.component.html",
})
export class CompanygstmasterListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  data: [] | any;
  tableload = false; // flag , indicates if data is still lodaing or not , used to show loading animation
  csv: any[];
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Company GST Master",
      items: ["Masters"],
      active: "Company GST Master",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [{ Row: "Action", Path: "Operation/CreateRunSheet" }];
  menuItems = [
    { label: "Create Run Sheet" },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [
    "activeFlag",
    "isActive",
    "isActiveFlag",
    "isMultiEmployeeRole",
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  // columnHeader = {
  //   "CompanyCode": "Company Code",
  //   "CompanyName": "Company Name",
  //   "BillingStateType": "ST/UT ",
  //   "GSTBillingStateName": "ST/UT Name",
  //   "BillingAddress": "Address",
  //   "GSTBillingCityName": "City",
  //   "BillingLocationCode": "Location",
  //   "GSTINNumber": "GSTIN Number"
  // }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  // headerForCsv = {
  //   "CompanyCode": "Company Code",
  //   "CompanyName": "Company Name",
  //   "BillingStateType": "ST/UT ",
  //   "GSTBillingStateName": "ST/UT Name",
  //   "BillingAddress": "Address",
  //   "GSTBillingCityName": "City",
  //   "BillingLocationCode": "Location",
  //   "GSTINNumber": "GSTIN Number"
  // }

  EventButton = {
    functionName: "AddNew",
    name: "Add Account",
    iconName: "add",
  };
  columnHeader = {
    CompanyCode: {
      Title: "Company Code",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    BillingStateType: {
      Title: "ST/UT",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    GSTBillingStateName: {
      Title: "ST/UT Name",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    address: {
      Title: "Address",
      class: "matcolumncenter",
      Style: "min-width:30%",
    },

    city: {
      Title: "City",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    GST: {
      Title: "GSTIN Number",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "EditFunction",
      iconName: "edit",
    },
  };

  staticField = [
    "CompanyCode",
    "BillingStateType",
    "GSTBillingStateName",
    "address",
    "city",
    "GST",
  ];
  //#endregion
  // IscheckBoxRequired: boolean;
  // advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  // viewComponent: any;
  boxData: { count: any; title: any; class: string }[];
  // declararing properties
  companyGstTableForm: UntypedFormGroup;
  TableData: any;

  constructor(
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCompanyGstDetails();
    this.intializeFormControl();
  }
  jsonControlArray: any;
  intializeFormControl() {
    this.jsonControlArray = [
      {
        name: "CompanyName",
        label: "Company Name",
        placeholder: "",
        type: "text",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
    ];
    this.companyGstTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getCompanyGstDetails() {
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "company_master",
      filter: { companyCode: parseInt(localStorage.getItem("companyCode")) },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

    if (res.success && res.data.length > 0) {
      const companyData = res.data[0];
      this.companyGstTableForm.controls["CompanyName"].setValue(
        companyData.beneficiary_Name
      );
      this.GetTableData();
    }
  }

  async GetTableData() {
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customers_gst_details",
      filter: { companyCode: parseInt(localStorage.getItem("companyCode")) },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length > 0) {
      this.TableData = res.data.map((x) => {
        return {
          CompanyCode: x.companyCode,
          BillingStateType: x.billingStateNM,
          GSTBillingStateName: x.stateNM,
          address: x.address,
          city: x.cityNM,
          GST: x.gstInNumber,
          ...x,
        };
      });

      this.tableload = true
    }
  }
  AddNew() {
    this.router.navigateByUrl("/Masters/CompanyGSTMaster/AddCompanyGSTMaster");
  }

  EditFunction(event){
    this.router.navigate(["/Masters/CompanyGSTMaster/AddCompanyGSTMaster"], { state: { data: event?.data } })
  }
}
