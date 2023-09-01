import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import { JobControl } from "src/assets/FormControls/job-entry";
import Swal from "sweetalert2";
import { addJobDetail, getNextNumber, getVendorDetails } from "./job-entry-utility";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { customerFromApi } from "../prq-entry-page/prq-utitlity";
import { getCity } from "../quick-booking/quick-utility";
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
  tableData: any;
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  jobFormControls: JobControl;
  isUpdate: boolean;
  jsonControlArray: any;
  jobEntryTableForm: UntypedFormGroup;
  cityData: any;
  vendorNameCode: string;
  vendorNameStatus: boolean;
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  displayedColumns1 = {
    srNo: {
      name: "#",
      key: "index",
      style: "",
    },
    contNo: {
      name: "Container No",
      key: "inputString",
      style: "",
    },
    cnoteNo: {
      name: "Cnote No",
      key: "inputString",
      style: ""
    },
    noOfpkg: {
      name: "No of Pkts",
      key: "inputnumber",
      style: ""
    },
    LoadedWeight: {
      name: "Loaded Weight",
      key: "inputnumber",
      style: ""
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    }
  };
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
    this.getDropDownDetail();
    this.loadTempData();
  }

  bindDropdown() {
    const jobPropertiesMapping = {
      billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
      fleetSize: { variable: 'fleetSize', status: 'fleetSizeStatus' },
      jobLocation: { variable: 'jobLocation', status: 'jobLocationStatus' },
      transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
      fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      vendorName: { variable: 'vendorNameCode', status: 'vendorNameStatus' },
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

  async getDropDownDetail() {
    // Fetch city details, customer list, and vendor details concurrently
    const [cityDetail, resCust, vendorList] = await Promise.all([
      getCity(this.companyCode, this.masterService),
      customerFromApi(this.masterService),
      getVendorDetails(this.masterService)
    ]);

    // Define a helper function to filter the docket control array
    const filterDocketControlArray = (details, statusProperty, filterProperty) => {
      this.filter.Filter(
        this.jsonControlArray,
        this.jobEntryTableForm,
        details,
        filterProperty,
        statusProperty
      );
    };

    // Use the helper function to filter based on different details
    filterDocketControlArray(resCust, this.billingPartyStatus, this.billingParty);
    filterDocketControlArray(cityDetail, this.fromCityStatus, this.fromCity);
    filterDocketControlArray(cityDetail, this.toCityStatus, this.toCity);
    filterDocketControlArray(vendorList, this.vendorNameStatus, this.vendorNameCode);
  }

  // Load temporary data
  loadTempData() {
    this.tableData = [
      {
        srNo: 0, // Serial number
        contNo: "",
        cnoteNo: "",
        noOfpkg: "",
        LoadedWeight: ""
      }
    ]
  }
  // Add a new item to the table
  addItem() {
    const AddObj = {
      srNo: 0, // Serial number
      contNo: "",
      cnoteNo: "",
      noOfpkg: "",
      LoadedWeight: ""
    };
    this.tableData.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
  }

  async save() {
    const tabcontrols = this.jobEntryTableForm;
    clearValidatorsAndValidate(tabcontrols);
    // Create a new array without the 'srNo' property
    let modifiedTableData = this.tableData.map(({ srNo, ...rest }) => rest);
    // Assign the modified array back to 'this.tableData'
    this.tableData = modifiedTableData;
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const location = localStorage.getItem("Branch"); // Replace with your dynamic value
    //  const dynamicNumber = Math.floor(jobIndex * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = getNextNumber();
    const blParty = this.jobEntryTableForm.controls['billingParty'].value?.name || "";
    const jobType = this.jobEntryTableForm.controls['jobType'].value == "I" ? "IM" : "EX";
    //  let jeNo = `JE/${dynamicValue}/${financialYear}/${paddedNumber}`;
    let jeNo = `${location.substring(0, 3)}${blParty.substring(0, 3)}${jobType}${financialYear}${paddedNumber}`;
    this.jobEntryTableForm.controls['_id'].setValue(jeNo.toUpperCase());
    this.jobEntryTableForm.controls['jobId'].setValue(jeNo.toUpperCase());
    this.jobEntryTableForm.controls['billingParty'].setValue(this.jobEntryTableForm.controls['billingParty'].value.name);
    this.jobEntryTableForm.controls['vendorName'].setValue(this.jobEntryTableForm.controls['vendorName'].value.name);
    this.jobEntryTableForm.controls['fromCity'].setValue(this.jobEntryTableForm.controls['fromCity'].value.value);
    this.jobEntryTableForm.controls['toCity'].setValue(this.jobEntryTableForm.controls['toCity'].value.value);
    let containorDetail = {
      containorDetail: this.tableData,
    };
    let jobDetail = {
      ...this.jobEntryTableForm.value,
      ...containorDetail,
    };
    const res = await addJobDetail(jobDetail, this.masterService);

    if (res) {
      Swal.fire({
        icon: "success",
        title: "Generated Successfuly",
        text: "Job Entry No: " + jeNo.toUpperCase(),
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.goBack(7)
        }
      });
    }
  }

  cancel() {
    window.history.back();
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
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

  async delete(event) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        // color: "#03a9f3",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var Request = {
            CompanyCode: localStorage.getItem("CompanyCode"),
            ID: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", Request);
            //return this.VendorContractService.updateMileStoneRequest(Request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
          event.callback(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your item is safe :)",
            "error"
          );
          event.callback(false);
        }
      });

    return true;
  }

}