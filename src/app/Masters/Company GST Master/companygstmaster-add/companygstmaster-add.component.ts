import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { DatePipe } from "@angular/common";
import { CompanyGSTControl } from "src/assets/FormControls/CompanyGSTMaster";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-companygstmaster-add",
  templateUrl: "./companygstmaster-add.component.html",
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
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  tableView: boolean;
  filteredData: any;
  newGstCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  cityData: any;
  stateData: any;
  customerName: any;
  customerNameStatus: any;
  billingState: any;
  billingStateStatus: any;
  state: any;
  stateStatus: any;
  city: any;
  cityStatus: any;
  stateState: any;
  cityState: any;
  billingCode: any;
  stateCode: any;
  cityCode: any;
  UpdateData: any;
  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private masterService: MasterService,
    private filter: FilterUtils
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state;

    if (navigationState != null) {
      this.UpdateData = navigationState.data;
      this.action = "Edit";
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }

    this.breadScrums = [
      {
        title: "Company GST Master",
        items: ["Home"],
        active: this.isUpdate
          ? "Edit Company GST Master"
          : "Add Company GST Master",
      },
    ];
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.getCompanyMasterDetail();
  }
  intializeFormControls() {
    this.customerGstFormControls = new CompanyGSTControl(
      this.isUpdate,
      this.UpdateData
    );
    this.jsonControlArray =
      this.customerGstFormControls.getCompanyGSTFormControls();
    this.companyGstTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    this.bindDropdown();
  }

  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === "billingState") {
        this.billingCode = data.name;
        this.billingStateStatus = data.additionalData.showNameAndValue;
        this.getbillingDetails();
      }
      if (data.name === "state") {
        this.stateCode = data.name;
        this.stateStatus = data.additionalData.showNameAndValue;
        this.getStateMasterDetails();
      }
      if (data.name === "city") {
        this.cityCode = data.name;
        this.cityStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  getbillingDetails() {
    const data = [
      { value: "ST", name: "State" },
      { value: "UT", name: "Union Territory" },
    ];
    if(this.isUpdate){
      const SelectData = data.find(x => x.name == this.UpdateData.billingStateNM)
      this.companyGstTableForm.controls["billingState"].setValue(SelectData);
    }
    this.filter.Filter(
      this.jsonControlArray,
      this.companyGstTableForm,
      data,
      this.billingCode,
      this.billingStateStatus
    );
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  // get
  async getCompanyMasterDetail() {
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "company_master",
      filter: { companyCode: parseInt(localStorage.getItem("companyCode")) },
    };

    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body));

    if (res.success && res.data.length > 0) {
      const companyData = res.data[0];
      this.companyGstTableForm.controls["CompanyName"].setValue(
        companyData.beneficiary_Name
      );
    }
  }
  async getCityMasterDetails() {
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "city_detail",
      filter: { state: this.companyGstTableForm.value.state.name },
    };

    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body));

    if (res.success) {
      const cityData = res.data.map((element) => ({
        name: element.cityName,
        value: element.cityName,
      }));

      if(this.isUpdate){
        const SelectData = cityData.find(x => x.name == this.UpdateData.cityNM)
        this.companyGstTableForm.controls["city"].setValue(SelectData);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.companyGstTableForm,
        cityData,
        this.cityCode,
        this.cityStatus
      );
    }
  }
  async getStateMasterDetails() {
    this.companyGstTableForm.controls["city"].setValue("");
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "state_detail",
      filter: {},
    };

    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body)) 
    if (res.success) {
      const stateData = res.data.map((element) => ({
        name: element.stateName,
        value: element.stateName,
      }));

      if(this.isUpdate){
        const SelectData = stateData.find(x => x.name == this.UpdateData.stateNM)
        this.companyGstTableForm.controls["state"].setValue(SelectData);
        this.getCityMasterDetails()
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.companyGstTableForm,
        stateData,
        this.stateCode,
        this.stateStatus
      );
    }
  }
  async ValidGSTNumber(){
    const Body = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customers_gst_details",
      filter: {companyCode: parseInt(localStorage.getItem("companyCode")) ,gstInNumber:this.companyGstTableForm.value.gstInNumber},
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body)) 
    if(res.success && res.data.length > 0){
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Please enter another GST number",
        showConfirmButton: true,
      });
      this.companyGstTableForm.controls["gstInNumber"].setValue("");
    }
  }
  cancel() {
    this.route.navigateByUrl("/Masters/CompanyGSTMaster/CompanyGSTMasterList");
  }
  // Helper function to check if an array of GSTINs contains valid GSTIN format
  isValidGstInNumber(gstInNumbers: any[]): boolean {
    const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
    return gstInNumbers.every((gstin) => gstin && gstin.match(gstinPattern));
  }
  async save() {
    const Body = {
      gstCode: this.companyGstTableForm.value.gstInNumber,
      stateNM: this.companyGstTableForm.value.state.name,
      stateCD: this.companyGstTableForm.value.state.value,
      billingStateNM: this.companyGstTableForm.value.billingState.name,
      cityNM: this.companyGstTableForm.value.city.name,
      cityCD: this.companyGstTableForm.value.city.value,
      gstInNumber: this.companyGstTableForm.value.gstInNumber,
      address: this.companyGstTableForm.value.address,
      isActive: this.companyGstTableForm.value.isActive,
    };
    if (!this.isUpdate) {
      Body["_id"] = `${localStorage.getItem("companyCode")}-${
        this.companyGstTableForm.value.gstInNumber
      }`;
      Body["CompanyName"] = this.companyGstTableForm.value.CompanyName;
      Body["entryBy"] = localStorage.getItem("Username");
      Body["entryDate"] = new Date().toISOString();
      Body["companyCode"] = parseInt(localStorage.getItem("companyCode"));
    }

    const req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "customers_gst_details",
      data: this.isUpdate ? undefined : Body,
      filter: this.isUpdate
        ? { Bankcode: this.UpdateData.Bankcode }
        : undefined,
      update: this.isUpdate ? Body : undefined,
    };

    const res = this.isUpdate
      ? await firstValueFrom(
          this.masterService.masterPut("generic/update", req)
        )
      : await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );

    if (res.success) {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.route.navigateByUrl(
        "/Masters/CompanyGSTMaster/CompanyGSTMasterList"
      );
    }
  }
  // Load temporary data
  // loadTempData(det) {
  //   this.tableData = det ? det : [];
  //   if (this.tableData.length === 0) {
  //     this.addItem();
  //   }
  // }

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
}
