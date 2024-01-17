import { Component,OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import Swal from "sweetalert2";
import { ChaEntryControl } from "src/assets/FormControls/cha-entry";
import { ChaEntryModel } from "src/app/Models/Cha-entry/cha-entry";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { isEmptyForm } from "src/app/Utility/Form Utilities/filter-utils";
import { ChaService } from "src/app/Utility/module/operation/cha-entry/cha-entry-service";

@Component({
  selector: 'app-cha-entry-page',
  templateUrl: './cha-entry-page.component.html',
  providers: [FilterUtils],
})
export class ChaEntryPageComponent implements OnInit {
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
  tableData: any;
  toCityStatus: any;
  chaEntryFormControls: ChaEntryControl;
  isUpdate: boolean;
  backPath: string;
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  chaEntryControlArray: any;
  chaEntryTableForm: UntypedFormGroup;
  chaFormTableForm: UntypedFormGroup;
  cityData: any;
  chaTableData: any[];
  menuItemflag: boolean = true;
  tableLoad = true;
  //#endregion 
  breadScrums = [
    {
      title: "CHA Entry",
      items: ["Home"],
      active: "CHA Entry",
    },
  ];
  buttons = {
    functionName: 'addDocumentData',
    name: "Add Data",
    iconName: 'add'
  }
  jobDetail: any;
  RakeEntry: boolean;
  chaTableFormControl: FormControls[];
  docType: AutoComplete[];
  jobType: AutoComplete[];
  eximDoc: AutoComplete[];
  tableLoadIn: boolean;
  loadIn: boolean;
  tranBy: AutoComplete[];
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private chaService:ChaService,
    private generalService: GeneralService,
    private customerService: CustomerService,
    private model: ChaEntryModel
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      
      this.jobDetail = this.Route.getCurrentNavigation()?.extras?.state.data.columnData;
      if (this.jobDetail.Action == "Rake Entry") {
        this.Route.navigate(['/Operation/RakeEntry'], {
          state: {
            data: this.jobDetail,

          },
        });
        this.RakeEntry = true;

      }
      else if(this.jobDetail.Action=="Update"){
        this.Route.navigate(['/Operation/JobEntry'], {
          state: {
            data: this.jobDetail
          },
        });

      }
      this.initializeFormControl();
    }
    else { this.initializeFormControl(); }
    this.chaTableData = [];
  }

  ngOnInit(): void {
    this.bindDropdown();
    this.getGeneralmasterData();
    this.backPath = "/dashboard/Index?tab=Job";
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
    processProperties.call(this, this.chaEntryControlArray, jobPropertiesMapping);
  }

  initializeFormControl() {
    this.chaEntryFormControls = new ChaEntryControl();
    // Get form controls for job Entry form section
    this.chaEntryControlArray = this.chaEntryFormControls.getChaEntryFormControls();
    this.chaTableFormControl = this.chaEntryFormControls.getChaTableFormControls();
    // Build the form group using formGroupBuilder function
    this.chaEntryTableForm = formGroupBuilder(this.fb, [this.chaEntryControlArray]);
    this.chaFormTableForm = formGroupBuilder(this.fb, [this.chaTableFormControl]);
    this.autoBillData();
  }

  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(this.chaEntryTableForm, this.chaEntryControlArray, event.field.name, this.billingPartyStatus);
  }

  autoBillData() {
    if (this.jobDetail) {
      this.chaEntryTableForm.controls['documentType'].setValue('EDT01');
      this.chaEntryTableForm.controls['documentType'].disable();
      this.chaEntryTableForm.controls['jobType'].setValue(this.jobDetail.jTYP);
      this.chaEntryTableForm.controls['jobType'].disable();
      const billingParty = {
        name: this.jobDetail?.bPARTYNM || "",
        value: this.jobDetail?.bPARTY || ""
      }
      this.chaEntryTableForm.controls['billingParty'].setValue(billingParty);
      this.chaEntryTableForm.controls['jobNo'].setValue(this.jobDetail.jobNo);
      this.chaEntryTableForm.controls['transportedBy'].setValue(this.jobDetail?.tBY||"");
    }

  }
  async save() {
    
    let modifiedTableData = this.chaTableData;
    // Define a variable for the condition
    let condition = modifiedTableData.length <= 0 ? 'emptyTable' : 'nonEmptyTable';
    // Use switch for handling different cases
    switch (condition) {
      case 'emptyTable':
        if (isEmptyForm(this.chaFormTableForm)) {
          Swal.fire({
            icon: "warning",
            title: "Please add at least one document",
            showConfirmButton: true,
          });
          return;
        } else {
          const docData = this.eximDoc.find(x => x.value == this.chaFormTableForm.value.docName);
          let formData = this.chaFormTableForm.getRawValue();
          formData['docCode'] = docData.value;
          formData['docName'] = docData.name;
          modifiedTableData = [formData];
        }
        break;
      case 'nonEmptyTable':
        modifiedTableData = modifiedTableData.map(({ Action, ...rest }) => rest);
        break;
    }
    let formData = this.chaEntryTableForm.getRawValue();
    formData['jobTypeName']= this.jobType.find((x)=>x.value==formData.jobType)?.name || "";
    formData['documentTypeName']= this.docType.find((x)=>x.value==formData.documentType)?.name || "";
    let jobDetail = {
      ...formData,
      modifiedTableData
    };
   const res=await this.chaService.addChaEntry(jobDetail);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "CHA Generated",
          text: `CHA No: ${res.data}`,
          showConfirmButton: true,
        });
        this.goBack("Job");
      }
  }
  
  cancel() {
    this.goBack("Job")
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
    }
  }

  async getGeneralmasterData() {
    this.docType = await this.generalService.getGeneralMasterData("EXIMDOCTYPE");
    this.jobType = await this.generalService.getGeneralMasterData("JOBTYP");
    this.eximDoc = await this.generalService.getGeneralMasterData("EXIMDOC");
    this.tranBy = await this.generalService.getGeneralMasterData("TRANBY");
    setGeneralMasterData(this.chaEntryControlArray, this.docType, "documentType");
    setGeneralMasterData(this.chaEntryControlArray, this.tranBy, "transportedBy");
    setGeneralMasterData(this.chaEntryControlArray, this.jobType, "jobType");
    setGeneralMasterData(this.chaTableFormControl, this.eximDoc, "docName");
  }
  // Add a new item to the table
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  calculateTotalAmount() {
    // Helper function to parse the float and return 0 if it's NaN
    const parseOrZero = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };
    // Parse values safely
    let clrChrg = parseOrZero(this.chaFormTableForm.value.clrChrg);
    let gstRate = parseOrZero(this.chaFormTableForm.value.gstRate);
    // Calculate GST amount
    let gstAmount = clrChrg * gstRate / 100;
    this.chaFormTableForm.controls['gstAmt'].setValue(gstAmount.toFixed(2));
    // Calculate total amount
    let total = clrChrg + gstAmount;
    this.chaFormTableForm.controls['totalAmt'].setValue(total.toFixed(2));
  }

  /*below function call when the document Details added*/

  async addDocumentData() {
    const chaDetail = this.chaTableData;
    this.tableLoadIn = true;
    this.loadIn = true;
    const delayDuration = 1000;
    const docNM = this.eximDoc.find((x) => x.value == this.chaFormTableForm.value.docName)?.name || "";
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: chaDetail.length + 1,
      docName: docNM,
      clrChrg: parseFloat(this.chaFormTableForm.value?.clrChrg||0.00).toFixed(2),
      gstRate: parseFloat(this.chaFormTableForm.value?.gstRate||0.00).toFixed(2),
      gstAmt: parseFloat(this.chaFormTableForm.value?.gstAmt||0.00).toFixed(2),
      totalAmt: parseFloat(this.chaFormTableForm.value?.totalAmt||0.00).toFixed(2),
      docCode: this.chaFormTableForm.value.docName,
      actions: ["Edit", "Remove"],
    };
    this.chaTableData.push(json);
    this.chaFormTableForm.reset();
    this.tableLoadIn = false;
    this.loadIn = false;

  }
  handleMenuItemClick(data) {
    this.fillDocument(data);
  }
  fillDocument(data: any) {
    if (data.label.label === "Remove") {
      this.chaTableData = this.chaTableData.filter((x) => x.id !== data.data.id);
    } else {
      const atLeastOneValuePresent = Object.keys(this.chaFormTableForm.controls)
        .some(key => {
          const control = this.chaFormTableForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillDocumentDetails(data)
          }
        });
      }
      else {
        this.fillDocumentDetails(data)
      }
    }
  }
  /*AutoFiill Invoice data*/
  fillDocumentDetails(data) {
    // Define a mapping of form control names to their respective keys in the incoming data
    const formFields = {
      clrChrg: "clrChrg",
      gstRate: "gstRate",
      gstAmt: "gstAmt",
      totalAmt: "totalAmt"
    };
    this.chaFormTableForm.controls['docName'].setValue(data.data?.docCode || "");
    // Loop through the defined form fields and set their values from the incoming data
    Object.keys(formFields).forEach(field => {
      // Set form control value to the data property if available, otherwise set it to an empty string
      this.chaFormTableForm.controls[field].setValue(data.data?.[formFields[field]] || "");
    });
    // Filter the invoiceData to exclude the entry with the provided data ID
    this.chaTableData = this.chaTableData.filter(x => x.id !== data.data.id);
  }
  /*End*/
}
