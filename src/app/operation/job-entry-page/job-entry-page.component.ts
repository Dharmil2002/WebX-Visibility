import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import { JobControl } from "src/assets/FormControls/job-entry";
import Swal from "sweetalert2";
import { addJobDetail } from "./job-entry-utility";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
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
    this.getCityList();
    this.getCustomerDetails();
    this.loadTempData();
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
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    let jeNo = `JE/${dynamicValue}/${financialYear}/${paddedNumber}`;
    this.jobEntryTableForm.controls['_id'].setValue(jeNo);
    this.jobEntryTableForm.controls['jobId'].setValue(jeNo);
    this.jobEntryTableForm.controls['billingParty'].setValue(this.jobEntryTableForm.controls['billingParty'].value.name);
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
        text: "Job Entry No: " + jeNo,
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