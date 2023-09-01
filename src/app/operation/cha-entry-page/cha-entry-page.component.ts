import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import Swal from "sweetalert2";
import { ChaEntryControl } from "src/assets/FormControls/cha-entry";
import { chaJobDetail, updateJobStatus } from "./cha-utility";

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
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  chaEntryControlArray: any;
  chaEntryTableForm: UntypedFormGroup;
  cityData: any;
  tableLoad = true;
  columnHeader =
    {
      "srNo": "Sr No.",
      "customerClearance": "Customer Clearance",
      "clearanceCharge": "Clearance Charge",
      "gstRate ": "GST Rate ",
      "gstAmount": "GST Amount",
      "totalAmount ": "Total Amount ",
      "actions": "Actions",
    }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "srNo": "Sr No.",
    "customerClearance": "Customer Clearance",
    "clearanceCharge": "Clearance Charge",
    "gstRate ": "GST Rate ",
    "gstAmount": "GST Amount",
    "totalAmount ": "Total Amount ",
    "actions": "Actions",
  }
  //#endregion 
  breadScrums = [
    {
      title: "CHA Entry",
      items: ["Home"],
      active: "CHA Entry",
    },
  ];
  jobDetail: any;
  displayedColumns1 = {
    srNo: {
      name: "Sl No",
      key: "index",
      Style: "",
      HeaderStyle: { 'min-width': '80px' },
      class: "matcolumncenter"
    },
    docName: {
      name: "Name of Document",
      key: "Dropdown",
      option: [
        { name: "Incoming Invoice", value: "Incoming Invoice" },
        { name: "Goods Movement", value: "Goods Movement" },
        { name: "CFS Charges", value: "CFS Charges" }
      ],
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
    },
    clrChrg: {
      name: "Clearance Charge (Rs)",
      key: "inputnumber",
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
      functions: {
        onChange: "calculateTotaAmount",
      },
    },
    gstRate: {
      name: "GST Rate",
      key: "inputnumber",
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
      functions: {
        onChange: "calculateTotaAmount",
      },
    },
    gstAmt: {
      name: "GST Amount (Rs)",
      key: "inputnumber",
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
      readonly: true
    },
    totalAmt: {
      name: "Total Amount (Rs)",
      key: "inputnumber",
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
      readonly: true
    },
    action: {
      name: "Action",
      key: "Action",
      Style: "",
      HeaderStyle: { 'text-align': 'center' },
    }
  };
  RakeEntry: boolean;
  constructor(private Route: Router, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) {
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
      else {
      }
      this.initializeFormControl();

    }
    else { this.initializeFormControl(); }
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
    processProperties.call(this, this.chaEntryControlArray, jobPropertiesMapping);
  }

  initializeFormControl() {
    this.chaEntryFormControls = new ChaEntryControl();
    // Get form controls for job Entry form section
    this.chaEntryControlArray = this.chaEntryFormControls.getChaEntryFormControls();
    // Build the form group using formGroupBuilder function
    this.chaEntryTableForm = formGroupBuilder(this.fb, [this.chaEntryControlArray]);
    this.autoBillData();
  }

  getCustomerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.chaEntryControlArray,
            this.chaEntryTableForm,
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
          this.chaEntryControlArray,
          this.chaEntryTableForm,
          cityList,
          this.fromCity,
          this.fromCityStatus
        );

        this.filter.Filter(
          this.chaEntryControlArray,
          this.chaEntryTableForm,
          cityList,
          this.toCity,
          this.toCityStatus
        );
      }
    });
  }
  autoBillData() {
    if (this.jobDetail) {
      this.chaEntryTableForm.controls['documentType'].setValue('jobNo')
      this.chaEntryTableForm.controls['jobType'].setValue(this.jobDetail.jobType === "Export" ? "E" : this.jobDetail.jobType === "Import" ? "I" : "");
      const billingParty = {
        name: this.jobDetail?.billingParty || "",
        value: this.jobDetail?.billingParty || ""
      }

      this.chaEntryTableForm.controls['billingParty'].setValue(billingParty);
      this.chaEntryTableForm.controls['jobNo'].setValue(this.jobDetail.jobNo);
      this.chaEntryTableForm.controls['transportedBy'].setValue(this.jobDetail?.transportedBy === "I" ? "Third Party" : this.jobDetail?.transportedBy === "E" ? "Own" : "");
    }

  }
  async save() {
    // Create a new array without the 'srNo' property
    let modifiedTableData = this.tableData.map(({ srNo, ...rest }) => rest);
    // Assign the modified array back to 'this.tableData'
    this.tableData = modifiedTableData;
    this.chaEntryTableForm.controls["billingParty"].setValue(this.chaEntryTableForm.value.billingParty.value);
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    let jeNo = `CHA${dynamicValue}${paddedNumber}`;
    this.chaEntryTableForm.controls["chaId"].setValue(jeNo);
    this.chaEntryTableForm.controls["_id"].setValue(jeNo);
    let docDetail = {
      containorDetail: this.tableData,
    };
    let jobDetail = {
      ...this.chaEntryTableForm.value,
      ...docDetail,
    };
    const res = await chaJobDetail(jobDetail, this.masterService);
    const resUpdate = await updateJobStatus(this.jobDetail, this.masterService)
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Generated SuccesFully",
        text: "CHA No: " + jeNo,
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

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  loadTempData() {
    this.tableData = [
      {
        srNo: 0, // Serial number
        docName: "",
        clrChrg: "0.00",
        gstRate: "0.00",
        gstAmt: "0.00",
        totalAmt: "0.00"
      }
    ]
  }
  // Add a new item to the table
  addItem() {
    const AddObj = {
      srNo: 0, // Serial number
      docName: "",
      clrChrg: "0.00",
      gstRate: "0.00",
      gstAmt: "0.00",
      totalAmt: "0.00"
    };
    this.tableData.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
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
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
  calculateTotaAmount(event) {
    let gstamount = parseFloat(event.row.clrChrg) * parseFloat(event.row.gstRate) / 100
    event.row.gstAmt = gstamount.toFixed(2);
    let total = parseFloat(event.row.clrChrg) + gstamount;
    event.row.totalAmt = total.toFixed(2);

  }

}
