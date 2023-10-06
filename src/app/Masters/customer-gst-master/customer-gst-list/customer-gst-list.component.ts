import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomerGstControl } from "src/assets/FormControls/customer-gst-control";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-gst-list',
  templateUrl: './customer-gst-list.component.html',
})
export class CustomerGstListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  csvFileName: string;
  customerGstTableForm: UntypedFormGroup;
  customerGstFormControls: CustomerGstControl;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader =
    {
      "srNo": "Sr No.",
      "customerName": "Customer Name",
      "billingState": "ST/UT",
      "state": "ST/UT State",
      "city": "City",
      "location": "Location",
      "pincode": "Pincode",
      "address": "Address",
      "gstInNumber": "GSTIN Number",
    }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "srNo": "Sr No.",
    "customerName": "Customer Name",
    "billingState": "ST/UT",
    "state": "ST/UT State",
    "city": "City",
    "location": "Location",
    "pincode": "Pincode",
    "address": "Address",
    "gstInNumber": "GSTIN Number",
  }
  //#endregion 
  datePipe: DatePipe = new DatePipe("en-US");
  breadScrums = [
    {
      title: "Customer GST Master",
      items: ["Master"],
      active: "Customer GST Master",
    }
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: true
  }
  toggleArray = ["isActive"];
  linkArray = [];
  addAndEditPath: string;
  viewComponent: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  jsonControlArray: any;
  isUpdate: boolean;
  customerName: any;
  customerNameStatus: any;
  allCustomerList: any[];
  filterCsv: any[];
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private router: Router) {
    this.addAndEditPath = "/Masters/CustomerGSTMaster/AddCustomerGSTMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getCustomerGSTDetails();
    this.intializeFormControls();
    this.getCustomerMasterDetail();
    this.csvFileName = "Customer GST Details"  //setting csv file Name so file will be saved as per this name
  }
  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
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
  async getCustomerGSTDetails() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "customers_gst_details",
      filter: {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    if (res) {
      this.tableLoad = false;
      const transformedData = [];
      res.data.forEach(item => {
        for (let i = 0; i < item.state.length; i++) {
          transformedData.push({
            customerName: item.customerName,
            state: item.state[i],
            billingState: item.billingState[i],
            city: item.city[i],
            location: item.hasOwnProperty("location") ? item.location[i] : [""],
            pincode: item.hasOwnProperty("pincode") ? item.pincode[i] : [""],
            gstInNumber: item.gstInNumber[i],
            address: item.address[i]
          });
        }
      }); // Generate srno for each object in the array 
      this.csv = transformedData.map((obj, index) => { obj['srNo'] = index + 1; return obj; });
      this.allCustomerList = res.data;
    }
  }
  filterCustomerDetails() {
    let customerList = []
    let customerName = this.customerGstTableForm.controls['customerName'].value;
    if (typeof (customerName) === "string") {
      this.filterCsv = this.allCustomerList
      this.dynamicControls = {
        add: false,
        edit: true,
        csv: true
      }
    }
    else {
      this.dynamicControls = {
        add: true,
        edit: true,
        csv: true
      }
      customerList = this.allCustomerList.filter((x) => x.customerName.trim() === customerName.name.trim())
    }
    this.masterService.setValueCustomerGst({ data: customerName.name, additionalData: customerList })
  }
}

