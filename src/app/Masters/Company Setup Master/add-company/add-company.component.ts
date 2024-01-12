import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CompanyControl } from 'src/assets/FormControls/CompanyControl';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { columnHeader, staticField } from '../company-utlity';
import { Router } from '@angular/router';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { log } from 'console';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html'
})
export class AddCompanyComponent implements OnInit {
  jsonControlCompanyArray: any;
  jsonControlGSTArray: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  jsonControlFinancialArray:any;
  CompanyFormControls: CompanyControl;
  GSTTableForm: UntypedFormGroup;
  FinancialTableForm:UntypedFormGroup;
  AddCompanyFormsValue: UntypedFormGroup;
  tableLode: boolean = true;
  GstTableEdit: boolean = false;
  GstTableEditData: any;
  action: any;
  EditGstTable: any;
  isGstUpdate: boolean;
  gstPinCodeStatus: boolean;
  gstPinCode: string;
  pinCodeResData: any;
  pinCodeData: any;
  companyTable: any;
  slectGstState: any;
  PinCode: any;
  PinCodeStatus: any;
  tableData: any = [];
  isUpdate = false;
  submit = 'Save';
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  menuItemflag = true;
  columnHeader = columnHeader;
  staticField=staticField;
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  breadscrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any; }[];
  companyIndex: any;
  companyStatus: any;
  Company: any;
  tenantDet: any;
  tenant: any;


  constructor(private fb: UntypedFormBuilder,
     private Route: Router,
     private objPinCodeService: PinCodeService,
     private masterService: MasterService,
     private objState: StateService,
     private filter: FilterUtils,
     private storage: StorageService) {
      if (this.Route.getCurrentNavigation()?.extras?.state != null) {
        this.companyTable = Route.getCurrentNavigation().extras.state.data;
        this.isUpdate = true;

        this.submit = 'Modify';
        this.action = "edit";
      }else {
        this.action = "Add";
      }
      if (this.action === "edit") {
        this.isUpdate = true;
        this.tableData = this.companyTable.GSTdetails.map((x, index) => {
          return {
            ...x,
            actions: ["Edit", "Remove"],
            Srno: index + 1,
          };
        });
        this.breadscrums = [
          {
            title: "Modify Company Setup",
            items: ["Masters"],
            active: "Modify Company Setup",
            generatecontrol: true,
            toggle: this.companyTable.activeFlag
          },
        ];
      }
      else {
        this.breadscrums = [
          {
            title: "Add Company",
            items: ["Masters"],
            active: "Add Company",
            generatecontrol: true,
            toggle: false
          },
        ];
      }
      this.initializeFormControl();
      this.initializeGSTFormControl();
     }

  ngOnInit(): void {
    this.getPinCode();
    this.bindGSTDropdown();
    this.bindDropdown();
    this.getTenantsDetails();
  }

  bindGSTDropdown() {
    this.jsonControlGSTArray.forEach((data) => {
      if (data.name === "gstPinCode") {
        // Set category-related variables
        this.gstPinCode = data.name;
        this.gstPinCodeStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  initializeFormControl() {
    const CompanyFormControls = new CompanyControl(this.EditGstTable,
      this.isGstUpdate);
    this.jsonControlCompanyArray = CompanyFormControls.getFormControlsC();
    this.jsonControlGSTArray = CompanyFormControls.getGSTFormControl();
    this.jsonControlFinancialArray = CompanyFormControls.getFinancialFormControl();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.AddCompanyFormsValue = formGroupBuilder(this.fb, [
      this.jsonControlCompanyArray,
    ]);
    this.FinancialTableForm = formGroupBuilder(this.fb, [
      this.jsonControlFinancialArray,
    ]);
    this.GSTTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGSTArray,
    ]);
  }

  initializeGSTFormControl() {
      const GSTFormControls = new CompanyControl(
        this.EditGstTable,
        this.isGstUpdate
      );
    // this.jsonControlCustomerArray = customerFormControls.getFormControls();
    this.jsonControlGSTArray = GSTFormControls.getGSTFormControl();

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.GSTTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGSTArray,
    ]);
  }

  async handleMenuItemClick(data) {
    this.tableLode = false;
    if (data.label.label == "Edit") {
      this.GstTableEdit = true;
      this.GstTableEditData = data.data;
      const index = this.tableData.indexOf(data.data);
      if (index > -1) {
        this.tableData.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.addRemoveGSTValue(data.data, 'edit');
      const delayDuration = 1000;
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(delayDuration);
    } else {
      const index = this.tableData.indexOf(data.data);
      if (index > -1) {
        this.tableData.splice(index, 1); // 2nd parameter means remove one item only
      }
      const delayDuration = 1000;
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(delayDuration);
    }
    this.tableLode = true;
  }

  async AddRowData() {
    this.tableLode = false;
    const Index = this.GstTableEdit ? this.GstTableEditData.Srno :
      this.tableData.length == 0 ? 1 : this.tableData.slice(-1)[0].Srno + 1;
    const Body = {
      Srno: parseInt(Index),
      gstAddres: this.GSTTableForm.value.gstAddres,
      gstCity: this.GSTTableForm.value.gstCity,
      gstNo: this.GSTTableForm.value.gstNo,
      gstPinCode: this.GSTTableForm.value.gstPinCode.name,
      gstState: this.GSTTableForm.value.gstState,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(Body);
    // Create a promise that resolves after the specified delay
    const delayDuration = 1000;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayDuration);
    await this.addRemoveGSTValue(null, 'add');
    this.tableLode = true;
  }

  addRemoveGSTValue(data, type) {
    if (type == 'edit') {
      const GstPin = this.pinCodeResData.find((x) => x.PIN == data?.gstPinCode);
      var SElectValue = {
        name: `${GstPin?.PIN}`,
        value: GstPin?.PIN,
      };
    }
    this.GSTTableForm.controls["gstNo"].setValue(
      this.GstTableEdit ? data?.gstNo : ""
    );
    this.GSTTableForm.controls["gstState"].setValue(
      this.GstTableEdit ? data?.gstState : ""
    );
    this.GSTTableForm.controls["gstAddres"].setValue(
      this.GstTableEdit ? data?.gstAddres : ""
    );
    this.GSTTableForm.controls["gstCity"].setValue(
      this.GstTableEdit ? data?.gstCity : ""
    );
    this.GSTTableForm.controls["gstPinCode"].setValue(
      this.GstTableEdit ? SElectValue : ""
    );

    if (!this.GstTableEdit) {
      this.initializeGSTFormControl();
    }
  }

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.AddCompanyFormsValue.controls['activeFlag'].setValue(event);
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

  bindDropdown() {
    this.jsonControlFinancialArray.forEach((data) => {
      if (data.name === "PinCode") {
        // Set category-related variables
        this.PinCode = data.name;
        this.PinCodeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlCompanyArray.forEach((data) => {
      if (data.name === "company") {
        // Set category-related variables
        this.Company = data.name;
        this.companyStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  async getTenantsDetails() {
    // Prepare the request
    try {
    let req = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "collectionName": "tenants_detail",
        "filter": {}
    }
    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req))
        const data = res.data
      const tenantDet = data.map((element) => ({
        name: element.cOMCODE,
        value: element.cOMNM,
      }));
      this.tenantDet = tenantDet;
      this.filter.Filter(
        this.jsonControlCompanyArray,
        this.AddCompanyFormsValue,
        tenantDet,
        this.Company,
        this.companyStatus
      );
    }catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }

  onSelecttTenants() {
    const selectedTenant = this.AddCompanyFormsValue.value.company;
    if (selectedTenant && selectedTenant.value) {
      // Assuming 'company_Name' is the name of the form control
      this.AddCompanyFormsValue.patchValue({
        company_Name: selectedTenant.value
      });
    } else {
      // Handle the case where the selected tenant or its value is not available
      console.warn("Selected tenant or its value not available");
    }
  }

  async onSelectPinCode() {
    try {
      const fetchData = this.pinCodeResData.find(
        (x) => x.PIN == this.FinancialTableForm.value.PinCode.name
      );
      this.FinancialTableForm.controls.city.setValue(fetchData.CT);
      const request = {
        companyCode: this.companyCode,
        collectionName: "state_master",
        filter: { ST: fetchData.ST },
      };
      const res: any = await firstValueFrom(this.masterService.masterPost("generic/get", request));
      if (res && res.success) {
        this.FinancialTableForm.controls.state.setValue(res.data[0].STNM);
      }
    } catch (error) {
      console.error("Error fetching pin code details:", error);
      // Handle errors here
    }
  }

  async getGSTPinCodeDropdown() {
    if (this.GSTTableForm.controls["gstPinCode"].value != "") {
      const stateName = this.GSTTableForm.value.gstState;
      const stateDataByName = await this.objState.fetchStateByFilterId(
        stateName,
        "STNM"
      ); // for filter by STNM
      this.objPinCodeService.validateAndFilterPincode(
        this.GSTTableForm,
        stateDataByName[0].ST,
        this.jsonControlGSTArray,
        this.gstPinCode,
        this.gstPinCodeStatus
      );
    }
  }

  async getPinCode() {
    try {
      let req = {
        companyCode: this.companyCode,
        collectionName: "pincode_master",
        filter: {},
      };
      const res: any = await firstValueFrom(this.masterService.masterPost("generic/get", req));
      if (res && res.success) {
        this.pinCodeResData = res.data;
        this.pinCodeData = res.data.map((x) => {
          return {
            name: `${x.PIN}`,
            value: parseInt(x.PIN),
          };
        });
        this.getPinCodeDropdown();
        this.getGSTPinCodeDropdown();
      }
    } catch (error) {
      console.error("Error fetching pin codes:", error);
      // Handle errors here
    }
  }

  getPinCodeDropdown() {
    if (this.isUpdate) {
      const SelectPincode = this.pinCodeData.find(
        (x) => x.name == this.companyTable.PinCode
      );
      this.FinancialTableForm.controls["PinCode"].setValue(SelectPincode);
    }
    const pincodeValue = this.FinancialTableForm.controls["PinCode"].value;
    // Check if pincodeValue is a valid number and has at least 3 characters
    if (!isNaN(pincodeValue) && pincodeValue.length >= 3) {
      // Find an exact pincode match in the pincodeDet array
      const exactPincodeMatch = this.pinCodeData.find(
        (element) => element.name === pincodeValue
      );

      if (!exactPincodeMatch) {
        // Filter pincodeDet for partial matches
        const filteredPincodeDet = this.pinCodeData.filter((element) =>
          element.name.includes(pincodeValue)
        );

        if (filteredPincodeDet.length === 0) {
          // Show a popup indicating no data found for the given pincode
          Swal.fire({
            icon: "info",
            title: "No Data Found",
            text: `No data found for pincode ${pincodeValue}`,
            showConfirmButton: true,
          });
        } else {
          this.filter.Filter(
            this.jsonControlFinancialArray,
            this.FinancialTableForm,
            filteredPincodeDet,
            this.PinCode,
            this.PinCodeStatus
          );
        }
      }
    }
  }

  async onSelectGSTPinCode() {
    try {
      const fetchData = this.pinCodeResData.find(
        (x) => x.PIN == this.GSTTableForm.value.gstPinCode.name
      );
      this.GSTTableForm.controls.gstCity.setValue(fetchData.CT);
      const request = {
        companyCode: this.companyCode,
        collectionName: "address_detail",
        filter: { pincode: this.GSTTableForm.value.gstPinCode.name },
      };
      const res: any = await firstValueFrom(this.masterService.masterPost("generic/get", request));
      if (res && res.success) {
        if (res.data.length > 0) {
          this.GSTTableForm.controls.gstAddress.setValue(res.data[0].address);
        } else {
          Swal.fire({
            title: "Address does not exist! Please add manually",
            toast: true,
            icon: "error",
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching GST pin code details:", error);
      // Handle errors here
    }
  }

  async ValidGSTNumber() {
    var isGST = false
    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (element.gstNo == this.GSTTableForm.value.gstNo) {
        isGST = true
        this.GSTTableForm.controls["gstNo"].setValue("")
        Swal.fire({
          title: `GST No. already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK"
        })
      }
    }
    if (this.GSTTableForm.value.gstNo != "") {
      this.setGSTState()
    }
  }

  async setGSTState() {
    try {
      const gstNumber = this.GSTTableForm.value.gstNo;
      const filterId = gstNumber.substring(0, 2);
      const request = {
        companyCode: this.companyCode,
        collectionName: "state_master",
        filter: { ST: parseInt(filterId) },
      };

      const res: any = await firstValueFrom(this.masterService.masterPost("generic/get", request));

      if (res && res.success && res.data.length > 0) {
        this.slectGstState = res.data[0];
        this.GSTTableForm.controls.gstState.setValue(this.slectGstState.STNM);
      }
    } catch (error) {
      console.error("Error fetching GST state details:", error);
      // Handle errors here
    }
  }

  async save() {
    const Body = {
      _id:"",
      cTNM: this.AddCompanyFormsValue.value.company.name,
      cNM: this.AddCompanyFormsValue.value.company_Name,
      iSSYS: this.AddCompanyFormsValue.value.activeFlag,
      cPAN: this.FinancialTableForm.value.pan_N0,
      cTAN: this.FinancialTableForm.value.tan_N0,
      cCIN: this.FinancialTableForm.value.cin_N0,
      cADRES: this.FinancialTableForm.value.address,
      cPNC: this.FinancialTableForm.value.PinCode.value,
      cCN: this.FinancialTableForm.value.city,
      cSN: this.FinancialTableForm.value.state,
      eNTDT: new Date(),
      eNTLOC:  this.storage.branch,
      eNTBY: localStorage.getItem("UserName"),
      mODDT:  new Date(),
      mODLOC: this.storage.branch,
      GSTdetails: this.tableData.map((x) => {
        return {
          cGSTADD: x.gstAddres,
          cGSTCY: x.gstCity,
          cGSTN: x.gstNo,
          cGSTPNC: x.gstPinCode,
          cGSTSTE: x.gstState,
        };
      }),
    };
    console.log("Body", Body);
    try {
      if (this.isUpdate) {
        delete Body._id;
        delete Body.cTNM;
        let req = {
          companyCode: this.companyCode,
          collectionName: "company_detail",
          filter: { _id: this.companyTable._id },
          update: Body,
        };
        // API FOR UPDATE
        const res: any = await firstValueFrom(this.masterService.masterPut("generic/update", req));
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
        }
      } else {
        let req = {
          companyCode: this.companyCode,
          collectionName: "company_detail",
          data: Body,
        };
        const res: any = await firstValueFrom(this.masterService.masterPost("generic/create", req));

        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      console.error("Error saving company details:", error);
      // Handle errors here
    }
  }

  cancel() {
    window.history.back();
  }

}
