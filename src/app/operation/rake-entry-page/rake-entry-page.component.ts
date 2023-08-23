import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { processProperties } from "src/app/Masters/processUtility";
import { RakeEntryControl } from "src/assets/FormControls/rake-entry";
@Component({
  selector: 'app-rake-entry-page',
  templateUrl: './rake-entry-page.component.html',
  // providers: [FilterUtils],
})
export class RakeEntryPageComponent implements OnInit {
  jsonControlArray: any;
  rakeEntryFormControl: RakeEntryControl;
  rakeEntryTableForm: any;
  tableData: any = [];
  tableLoad = false;
  tableData1: any = [];
  type: any;
  show = false;
  apiShow = false;

  breadScrums = [
      {
          title: "Rake Entry Master",
          items: ["Home"],
          active: "Rake Entry Master",
      },
  ];

  ngOnInit(): void {
  }

  constructor(private fb: UntypedFormBuilder) {
      this.initializeFormControl();
  }

  cnWiseDisplayedColumns = {
      srNo: {
          name: "checkBox",
          key: "index",
          style: "",
      },
      cnNo: {
          name: "CN No",
          key: "input",
          readonly: true,
          style: "",
      },
      cnDate: {
          name: "CN Date",
          key: "input",
          option: [],
          style: ""
      },
      noOfPkts: {
          name: "No Of Pkts",
          key: "input",
          style: "min-width:100px;",
          Headerstyle: { 'min-width': '10px' },
      },
      weight: {
          name: "Weight",
          key: "input",
          style: "",
      },
      fromCity: {
          name: "From City",
          key: "input",
          style: "",
      },
      toCity: {
          name: "To City",
          key: "input",
          style: "",
      },
      billingParty: {
          name: "Billing Party",
          key: "input",
          style: "",
      }
  };

  jobWiseDisplayedColumns = {
      srNo: {
          name: "checkBox",
          key: "index",
          style: "",
      },
      jobNo: {
          name: "Job No",
          key: "input",
          readonly: true,
          style: "",
      },
      jobDate: {
          name: "Job Date",
          key: "input",
          option: [],
          style: ""
      },
      noOfPkts: {
          name: "No Of Pkts",
          key: "input",
          style: "min-width:100px;",
          Headerstyle: { 'min-width': '10px' },
      },
      weight: {
          name: "Weight",
          key: "input",
          style: "",
      },
      fromCity: {
          name: "From City",
          key: "input",
          style: "",
      },
      toCity: {
          name: "To City",
          key: "input",
          style: "",
      },
      billingParty: {
          name: "Billing Party",
          key: "input",
          style: "",
      }
  };

  bindDropdown() {
      const jobPropertiesMapping = {
          transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
          billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
          vendorType: { variable: 'vendorType', status: 'vendorTypeStatus' },
          via: { variable: 'via', status: 'viaStatus' },
          vendorNameAndCode: { variable: 'vendorNameAndCode', status: 'vendorNameAndCodeStatus' },
          advancedLocation: { variable: 'advancedLocation', status: 'advancedLocationStatus' },
          balanceLocation: { variable: 'balanceLocation', status: 'balanceLocationStatus' },
          fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
          toCity: { variable: 'toCity', status: 'toCityStatus' }
      };
      processProperties.call(this, this.jsonControlArray, jobPropertiesMapping);
  }

  initializeFormControl() {
      // Create cityLocationFormControl instance to get form controls for different sections
      this.rakeEntryFormControl = new RakeEntryControl();
      // Get form controls for city Location Details section
      this.jsonControlArray = this.rakeEntryFormControl.getRakeEntryFormControls();

      // Build the form group using formGroupBuilder function and the values of jsonControlArray
      this.rakeEntryTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
      this.show = false;
      this.loadTempData('');
  }

  // Load temporary data
  loadTempData(det) {
      this.type = this.rakeEntryTableForm.value.documentType;
      if (this.type == "C") {
          this.tableData = det || [];
          if (this.tableData.length === 0) {
              this.addCNWise();
          }
      }
      else {
          this.tableData1 = det || [];
          if (this.tableData1.length === 0) {
              this.addJobWise();
          }
      }
  }

  addCNWise() { }
  addJobWise() { }


  //Checked Dropdown Option - Cn Wise / Job Wise
  display($event) {
      debugger
      const generateControl = $event?.eventArgs.value || $event;
      console.log(generateControl);
      
      if (generateControl === 'CN') {
          this.show = true;
      }
      if (generateControl === 'JOB') {
          this.show = false;
      }
      this.loadTempData('');
  }

  functionCallHandler($event) {
      // console.log("fn handler called" , $event);
      let field = $event.field;                   // the actual formControl instance
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