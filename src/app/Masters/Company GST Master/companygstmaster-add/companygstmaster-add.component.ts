import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DatePipe } from '@angular/common';
import { CompanyGSTControl } from 'src/assets/FormControls/CompanyGSTMaster';
@Component({
  selector: 'app-companygstmaster-add',
  templateUrl: './companygstmaster-add.component.html'
})
export class CompanygstmasterAddComponent implements OnInit {

  companyGstTableForm: UntypedFormGroup;
  jsonControlArray: any;
  customerGstFormControls: CompanyGSTControl;
  breadScrums = [
    {
      title: "Company GST Master",
      items: ["Master"],
      active: "Company GST Master",
    },
  ];
  controlLoc: any;
  controlLocStatus: any;
  locationData: any[];
  action: string;
  data: any;
  isUpdate: any;
  updateState: any;
  lastGeneratedGstCode: string = "GST0000";
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "",
    },
    billingState: {
      name: "Billing State / UT",
      key: "Dropdown",
      option: [
        { value: "ST", name: "State" },
        { value: "UT", name: "Union Territory" }
      ],
      style: "",
    },
    gstInNumber: {
      name: "Provisional / GSTIN Number",
      key: "inputString",
      style: "",
    },
    state: {
      name: "State / UT name",
      key: "Dropdown",
      option: [],
      style: "",
      functions: {
        onOptionSelect: "getCityMasterDetails"
      }
    },
    city: {
      name: "City",
      key: "Dropdown",
      option: [],
      style: "",
    },
    address: {
      name: "Address",
      key: "inputString",
      style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    },
  };
  // Table data
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true
  };
  tableView: boolean;
  filteredData: any;
  newGstCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  cityData: any;
  stateData: any;
  customerName: any;
  customerNameStatus: any;
  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private masterService: MasterService,
    private filter: FilterUtils,
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state;

    if (navigationState != null) {
      this.data = navigationState.data;
      this.action = 'Edit';
      this.isUpdate = true;
      this.getCompanyGstDetails();
    } else {
      this.action = 'Add';
      this.loadTempData('');
    }

    this.breadScrums = [{
      title: "Company GST Master",
      items: ["Home"],
      active: this.isUpdate ? "Edit Company GST Master" : "Add Company GST Master",
    }];
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.getStateMasterDetails();
    this.getCompanyMasterDetail();
  }
  intializeFormControls() {
    this.customerGstFormControls = new CompanyGSTControl();
    this.jsonControlArray = this.customerGstFormControls.getCompanyGSTFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'customerName') {
        this.customerName = data.name;
        this.customerNameStatus = data.additionalData.showNameAndValue;
      }
    });
    this.companyGstTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  getCompanyMasterDetail() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "customer_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const customerNameList = res.data;
        let customerName = customerNameList
          .filter(element => element.customerName != null && element.customerName !== '')
          .map(element => {
            let customerNameValue = typeof element.customerName === 'object' ? element.customerName.name : element.customerName;
            return { name: String(customerNameValue), value: String(customerNameValue) };
          });
        this.filter.Filter(
          this.jsonControlArray,
          this.companyGstTableForm,
          customerName,
          this.customerName,
          this.customerNameStatus
        );
        const custData = customerName.find((x) => x.name.trim() === this.data.customerName.trim());

        this.companyGstTableForm.controls['customerName'].setValue(custData);
      }
    });
  }
  getCityMasterDetails(event) {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "city_detail"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          const stateBaseCity = res.data.filter((x) => x.state.trim() === event.row.state.trim());
          if (stateBaseCity) {
            // Generate srno for each object in the array
            const cityData = stateBaseCity.map(element => ({
              name: element.cityName,
              value: element.cityName,
            }));
            this.cityData = cityData;
            this.displayedColumns1.city.option = this.cityData;

          }
        }
        else {
          this.displayedColumns1.city.option = [];
        }
      }
    })
  }
  getStateMasterDetails() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "state_detail"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const stateData = res.data.map(element => ({
            name: element.stateName,
            value: element.stateName,
          }));
          this.stateData = stateData;
          this.displayedColumns1.state.option = this.stateData;
          this.tableView = true;
        }
      }
    })
  }
  cancel() {
    window.history.back();
  }
  // Helper function to check if an array of GSTINs contains valid GSTIN format
  isValidGstInNumber(gstInNumbers: any[]): boolean {
    const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
    return gstInNumbers.every((gstin) => gstin && gstin.match(gstinPattern));
  }
  save() {
    // Perform validation for gstInNumber
    const gstInNumberValues = this.tableData.map((item) => item.gstInNumber);
    if (!this.isValidGstInNumber(gstInNumberValues)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid GST Number format.",
        showConfirmButton: true,
      });
      return;
    }
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "customers_gst_details"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const lastGst = res.data.length;
          const newGstNumber = lastGst + 1;
          this.newGstCode = `GST${newGstNumber.toString().padStart(4, "0")}`;
          // Function to generate a new route code

          if (this.isUpdate) {
            this.newGstCode = this.data.id
          } else {
            // this.newGstCode = generateCompanyGstCode(lastGst);
            // Update the lastGeneratedGstCode with the newly generated code for the next entry
            this.lastGeneratedGstCode = this.newGstCode;
          }

          const transformedData = {
            gstCode: this.newGstCode,
            isActive: this.companyGstTableForm.value.isActive,
            customerName: this.companyGstTableForm.value.customerName.name,
            id: this.newGstCode,
            state: this.tableData.map((item) => item.state),
            billingState: this.tableData.map((item) => item.billingState),
            city: this.tableData.map((item) => item.city),
            gstInNumber: this.tableData.map((item) => item.gstInNumber),
            address: this.tableData.map((item) => item.address),
            entryBy: localStorage.getItem('Username'),
            entryDate: new Date().toISOString()
          };

          if (this.isUpdate) {
            let id = transformedData.id;
            // Remove the "id" field from the form controls
            delete transformedData.id;
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              type: "masters",
              collection: "customers_gst_details",
              id: id,
              updates: transformedData
            };
            this.masterService.masterPut('common/update', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.route.navigateByUrl('/Masters/CompanyGSTMaster/CompanyGSTMasterList');
                }
              }
            });
          } else {
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              type: "masters",
              collection: "customers_gst_details",
              data: transformedData
            };
            console.log(req);
            this.masterService.masterPost('common/create', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  window.location.reload();
                }
              }
            });
          }
        }
      }
    })
  }
  // Load temporary data
  loadTempData(det) {
    this.tableData = det ? det : [];
    if (this.tableData.length === 0) {
      this.addItem();
    }
  }

  // Add a new item to the table
  addItem() {
    const AddObj = {
      state: [],
      billingState: [],
      city: [],
      srNo: 0,
      gstInNumber: "",
      address: "",
    };
    this.tableData.splice(0, 0, AddObj);
  }
  // Delete a row from the table
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
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var request = {
            companyCode: localStorage.getItem("CompanyCode"),
            id: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", request);
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
  getCompanyGstDetails() {
    // Function to transform array properties
    function transformArrayProperties(data) {
      const transformedData = [];
      const len = Math.max(
        data.state.length,
        data.billingState.length,
        data.city.length,
        data.gstInNumber.length,
        data.address.length
      );

      for (let i = 0; i < len; i++) {
        transformedData.push({
          state: data.state[i],
          billingState: data.billingState[i],
          city: data.city[i],
          gstInNumber: data.gstInNumber[i],
          address: data.address[i],
        });
      }
      return transformedData;
    }
    const transformedData = transformArrayProperties(this.data);
    this.loadTempData(transformedData);
  }
}
