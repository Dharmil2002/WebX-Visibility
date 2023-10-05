import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { CustomerGstControl } from 'src/assets/FormControls/customer-gst-control';
import { generateCustomerGstCode } from './customer-gst-utility';

@Component({
  selector: 'app-customer-gst-add',
  templateUrl: './customer-gst-add.component.html',
})
export class CustomerGstAddComponent implements OnInit {
  customerGstTableForm: UntypedFormGroup;
  jsonControlArray: any;
  customerGstFormControls: CustomerGstControl;
  breadScrums = [
    {
      title: "Customer GST Master",
      items: ["Master"],
      active: "Customer GST Master",
    },
  ];
  action: string;
  data: any;
  isUpdate: any;
  // Displayed columns configuration
  customerDisplayColumn = {
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
      functions: {
        'onChange': "checkGstNo" // Function to be called on change event
      }
    },
    state: {
      name: "State / UT name",
      key: "Dropdown",
      option: [],
      style: ""
    },
    city: {
      name: "City",
      key: "Dropdown",
      option: [],
      style: "",
    },
    location: {
      name: "Location",
      key: "Dropdown",
      option: [],
      style: "",
    },
    pincode: {
      name: "Pincode",
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
  newGstCode: string;
  cityData: any;
  stateData: any;
  pincodeData: any;
  locationData: any;
  customerName: any;
  customerNameStatus: any;
  customerNameValue: any;
  customerDetail: any;
  custName: any;
  transformedData: any[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  customerNoExists: any;
  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private masterService: MasterService,
    private filter: FilterUtils,
  ) {
    const navigationState = this.masterService.getCustomer();
    this.custName = navigationState.data;
    if (navigationState.additionalData && navigationState.additionalData[0] != null) {
      this.data = navigationState.additionalData[0];
      this.action = 'Edit';
      this.isUpdate = true;
      this.getCustomerGstDetails();
    }
    else {
      this.action = 'Add';
      this.loadTempData('');
    }
    this.breadScrums = [{
      title: "Customer GST Master",
      items: ["Home"],
      active: this.isUpdate ? "Edit Customer GST Master" : "Add Customer GST Master",
    }];
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.getAllMasterDetails();
    this.checkDetailsExist();
  }
  intializeFormControls() {
    this.customerGstFormControls = new CustomerGstControl(this.data, this.isUpdate);
    this.jsonControlArray = this.customerGstFormControls.getCustomerGstFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'customerName') {
        this.customerName = data.name;
        this.customerNameStatus = data.additionalData.showNameAndValue;
      }
    });
    this.customerGstTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.autoFillData();
  }
  autoFillData() {
    const custData = {
      name: this.custName,
      value: this.custName
    }
    this.customerGstTableForm.controls['customerName'].setValue(custData);
    this.customerGstTableForm.controls['customerName'].disable();
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getCustomerMasterDetail() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customer_detail",
      filter: {}
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    const customerNameList = res.data;
    let customerName = customerNameList
      .filter(element => element.customerName != null && element.customerName !== '')
      .map(element => {
        let customerNameValue = typeof element.customerName === 'object' ? element.customerName.name : element.customerName;
        return { name: String(customerNameValue), value: String(customerNameValue) };
      });
    this.filter.Filter(
      this.jsonControlArray,
      this.customerGstTableForm,
      customerName,
      this.customerName,
      this.customerNameStatus
    );
  }
  // Function to fetch all master details like states, cities, etc.
  async getAllMasterDetails() {
    const companyCode = parseInt(localStorage.getItem("companyCode"));
    const requests = [
      { collectionName: "state_detail", filter: {} },
      { collectionName: "city_detail", filter: {} },
      { collectionName: "location_detail", filter: {} },
      { collectionName: "pincode_detail", filter: {} },
    ];
    try {
      const responses = await Promise.all(
        requests.map((req) =>
          this.masterService.masterPost("generic/get", {
            companyCode,
            ...req,
          }).toPromise()
        )
      );
      const [stateRes, cityRes, locationRes, pincodeRes] = responses;
      const mapData = (data, keyName) =>
        data?.map((element) => ({ name: element[keyName], value: element[keyName] }));
      this.cityData = mapData(cityRes.data, "cityName");
      this.customerDisplayColumn.city.option = this.cityData;
      this.stateData = mapData(stateRes.data, "stateName");
      this.customerDisplayColumn.state.option = this.stateData;
      this.locationData = mapData(locationRes.data, "locName");
      this.customerDisplayColumn.location.option = this.locationData;
      this.pincodeData = mapData(pincodeRes.data, "pincode");
      this.customerDisplayColumn.pincode.option = this.pincodeData;
      this.tableView = true;
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching data:", error);
    }
  }
  // Check if Customer details already exist in the database
  async checkDetailsExist() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "customers_gst_details",
      "filter": {}
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    this.customerNoExists = res.data;
  }
  // Check if GST number already exists
  checkGstNo(event) {
    const exist = this.customerNoExists.find((x) => x.gstInNumber[0] === event.row.gstInNumber);
    if (exist) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        title: 'GST Number already exists! Please try with another',
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
      event.row.gstInNumber = "";
    }
  }
  cancel() {
    this.route.navigateByUrl('/Masters/CustomerGSTMaster/CustomerGSTMasterList');
  }
  // Helper function to check if an array of GSTINs contains valid GSTIN format
  isValidGstInNumber(gstInNumbers: any[]): boolean {
    const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]\dZ\d$/;
    return gstInNumbers.every((gstin) => gstin && gstin.match(gstinPattern));
  }
  // Function to get fields with duplicate data
  getFieldsWithDuplicates(newData) {
    const fieldCounts = {};
    const duplicateFields = [];
    newData.forEach((item) => {
      // Loop through the specific fields (location, pincode, gstInNumber, address)
      ['location', 'pincode', 'gstInNumber', 'address'].forEach((field) => {
        if (!(field in fieldCounts)) {
          fieldCounts[field] = new Set();
        }
        if (fieldCounts[field].has(item[field])) {
          duplicateFields.push(field);
        } else {
          fieldCounts[field].add(item[field]);
        }
      });
    });
    return [...new Set(duplicateFields)]; // Remove duplicate entries from duplicateFields
  }
  async save() {
    let incompleteData = false;
    this.tableData.forEach(data => {
      if (
        data.billingState.length === 0 ||
        data.gstInNumber === "" ||
        data.city.length === 0 ||
        data.state.length === 0 ||
        data.location.length === 0 ||
        data.pincode.toString().length === 0 ||
        data.address === ""
      ) {
        incompleteData = true;
        return;
      }
    });
    if (incompleteData) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all the required fields.",
        showConfirmButton: true,
      });
      return;
    }
    // Check for duplicates in Fields
    const duplicateFields = this.getFieldsWithDuplicates(this.tableData);
    if (duplicateFields.length > 0) {
      const uniqueDuplicateFields = [...new Set(duplicateFields)]; // Remove duplicates
      let errorMessage = `Duplicate data found for ${uniqueDuplicateFields.join(', ')}.`;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        showConfirmButton: true,
      });
      return;
    }
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
      collectionName: "customers_gst_details",
      filter: {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    if (res) {
      // Generate srno for each object in the array
      const lastGst = res.data.length;
      const newGstNumber = lastGst + 1;
      this.newGstCode = `GST${newGstNumber.toString().padStart(4, "0")}`;
      // Function to generate a new route code
      if (this.isUpdate) {
        this.newGstCode = this.data._id
      } else {
        this.newGstCode = generateCustomerGstCode(lastGst);
      }
      const transformedData = {
        gstCode: this.newGstCode,
        customerName: this.customerGstTableForm.controls['customerName'].value.name,
        _id: this.newGstCode,
        state: this.tableData.map((item) => item.state),
        billingState: this.tableData.map((item) => item.billingState),
        city: this.tableData.map((item) => item.city),
        gstInNumber: this.tableData.map((item) => item.gstInNumber),
        location: this.tableData.map((item) => item.location),
        pincode: this.tableData.map((item) => item.pincode),
        address: this.tableData.map((item) => item.address),
        entryBy: localStorage.getItem('Username'),
        entryDate: new Date().toISOString()
      };
      if (this.isUpdate) {
        let id = transformedData._id;
        // Remove the "id" field from the form controls
        delete transformedData._id;
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "customers_gst_details",
          filter: { _id: id },
          update: transformedData
        };
        const res = await this.masterService.masterPut("generic/update", req).toPromise()
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl('/Masters/CustomerGSTMaster/CustomerGSTMasterList');
        }
      } else {
        let req = {
          companyCode: parseInt(localStorage.getItem("companyCode")),
          collectionName: "customers_gst_details",
          data: transformedData
        };
        const res = await this.masterService.masterPost("generic/create", req).toPromise()
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl('/Masters/CustomerGSTMaster/CustomerGSTMasterList');
        }
      }
    }
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
      location: [],
      pincode: [],
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
          swalWithBootstrapButtons.fire("Deleted!", "Your Details", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Details", "info");
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
  getCustomerGstDetails() {
    // Function to transform array properties
    function transformArrayProperties(data) {
      const transformedData = [];
      const len = Math.max(
        data.state?.length,
        data.billingState?.length,
        data.city?.length,
        data.location?.length,
        data.pincode?.length,
        data.gstInNumber?.length,
        data.address?.length
      );
      for (let i = 0; i < len; i++) {
        transformedData.push({
          state: data.state[i],
          billingState: data.billingState[i],
          city: data.city[i],
          location: data.location[i],
          pincode: data.pincode[i],
          gstInNumber: data.gstInNumber[i],
          address: data.address[i],
        });
      }
      return transformedData;
    }
    if (this.data !== undefined) {
      this.transformedData = transformArrayProperties(this.data);
    }
    this.loadTempData(this.transformedData);
  }
}
