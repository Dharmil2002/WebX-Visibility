import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
} from "@angular/forms";
// import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { customerControl } from "src/assets/FormControls/customer-master";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Router } from "@angular/router";
import { customerModel } from "src/app/core/models/Masters/customerMaster";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { columnHeader, staticField } from "./customer-utlity";

@Component({
  selector: "app-customer-master-add",
  templateUrl: "./customer-master-add.component.html",
})
export class CustomerMasterAddComponent implements OnInit {
  customerTableForm: UntypedFormGroup;
  GSTcustomerTableForm: UntypedFormGroup;

  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  //#region Variable declaration
  error: string;
  isUpdate = false;
  action: any;
  groupCodeData: any;
  customerGroup: any;
  customerGroupStatus: any;
  ownership: any;
  ownershipStatus: any;
  location: any;
  locationStatus: any;
  nonOda: any;
  noOdaStatus: any;
  controlling: any;
  controllingStatus: any;
  pay: any;
  payStatus: any;
  serviceOpt: any;
  serviceOptStatus: any;
  serviceOpted: any;
  serviceOptedFor: any;
  payBasis: any;
  ownerShip: any;
  locationData: any;
  customerTable: any;
  customerFormControls: customerControl;
  jsonControlCustomerArray: any;
  jsonControlBillKycArray: any;
  accordionData: any;
  breadScrums: { title: string; items: string[]; active: string }[];
  groupCode: any;
  groupCodedet: any;
  payBasisData: any;
  payBasisDet: any;
  nonOdaDet: any;
  controllingDet: any;
  locationDet: any;
  ownerShipDet: any;
  ownershipData: any;
  locData: any;
  cityLocDet: any;
  pincodeDet: any;
  cityBill: string;
  cityBillStatus: boolean;
  pincodeBill: string;
  pincodeBillStatus: boolean;
  pincodeData: string;
  pincodeDataStatus: boolean;
  cityData: string;
  protected _onDestroy = new Subject<void>();
  cityDataStatus: boolean;
  stateData: any;
  stateLoc: any;
  stateLocStatus: any;
  allJson: any;
  CustomerCategoryStatus: any;
  CustomerCategory: any;
  tableData: any = [];
  PinCode: any;
  PinCodeStatus: any;
  pinCodeData: any;
  pinCodeResData: any;
  jsonControlGSTArray: any;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  menuItemflag = true;
  columnHeader = columnHeader;
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = staticField;
  tableLode: boolean = true;
  gstPinCodeStatus: boolean;
  gstPinCode: string;
  GstTableEdit: boolean = false;
  GstTableEditData: any;
  isGstForm: boolean = true;
  SelectFile: any;
  selectedFiles: any;
  MSMEScanName: any;
  EditGstTable: any;
  isGstUpdate: boolean;
  slectGstState: any;
  // DriverTableForm: any;
  //#endregion

  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objPinCodeService: PinCodeService,
    private objState: StateService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.customerTable = Route.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.tableData = this.customerTable.GSTdetails.map((x, index) => {
        return {
          ...x,
          actions: ["Edit", "Remove"],
          Srno: index + 1,
        };
      });
      this.breadScrums = [
        {
          title: "Customer Master",
          items: ["Masters"],
          active: "Edit Customer",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Customer Master",
          items: ["Masters"],
          active: "Add Customer",
        },
      ];
      this.customerTable = new customerModel({});
    }
    this.initializeFormControl();
    this.initializeGSTFormControl();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    const customerFormControls = new customerControl(
      this.customerTable,
      this.isUpdate
    );
    this.jsonControlCustomerArray = customerFormControls.getFormControls();
    this.jsonControlGSTArray = customerFormControls.getGSTFormControl();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, [
      this.jsonControlCustomerArray,
    ]);

    this.GSTcustomerTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGSTArray,
    ]);
  }
  initializeGSTFormControl() {
    const customerFormControls = new customerControl(
      this.EditGstTable,
      this.isGstUpdate
    );
    // this.jsonControlCustomerArray = customerFormControls.getFormControls();
    this.jsonControlGSTArray = customerFormControls.getGSTFormControl();

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.GSTcustomerTableForm = formGroupBuilder(this.fb, [
      this.jsonControlGSTArray,
    ]);
  }
  //#endregion

  ngOnInit(): void {
    // this.getCustomerDetails()
    this.bindDropdown();
    this.bindGSTDropdown();
    this.getCustomerGroupDropdown();
    this.getcustomerLocationDropdown();
    this.getCustomerCategoryDropdown();
    this.getPinCode();
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

  bindDropdown() {
    this.jsonControlCustomerArray.forEach((data) => {
      if (data.name === "customerGroup") {
        // Set location-related variables
        this.customerGroup = data.name;
        this.customerGroupStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "CustomerCategory") {
        // Set category-related variables
        this.CustomerCategory = data.name;
        this.CustomerCategoryStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "CustomerLocations") {
        // Set category-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "PinCode") {
        // Set category-related variables
        this.PinCode = data.name;
        this.PinCodeStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  getPinCode() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "pincode_master",
      filter: {},
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res) => {
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
      },
      error: (err) => {},
    });
  }
  // ******************************************************/Get ALL Dropdown/**********************************************
  getCustomerGroupDropdown() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "customerGroup_detail",
      filter: {},
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          const dropdownData = res.data.map((x) => {
            return {
              name: x.groupName,
              value: x.groupCode,
            };
          });
          if (this.isUpdate) {
            res.data.forEach((x) => {
              if (x.groupName == this.customerTable.customerGroup) {
                this.customerTableForm.controls["customerGroup"].setValue({
                  name: x.groupName,
                  value: x.groupCode,
                });
              }
            });
          }
          this.filter.Filter(
            this.jsonControlCustomerArray,
            this.customerTableForm,
            dropdownData,
            this.customerGroup,
            this.customerGroupStatus
          );
        }
      },
    });
  }
  getCustomerCategoryDropdown() {
    const dropdownData = [
      {
        name: "Urgent",
        value: "Urgent",
      },
      {
        name: "High",
        value: "High",
      },
      {
        name: "Medium",
        value: "Medium",
      },
      {
        name: "Low",
        value: "Low",
      },
    ];
    if (this.isUpdate) {
      dropdownData.forEach((x) => {
        if (x.name == this.customerTable.CustomerCategory) {
          this.customerTableForm.controls["CustomerCategory"].setValue(x);
        }
      });
    }
    this.filter.Filter(
      this.jsonControlCustomerArray,
      this.customerTableForm,
      dropdownData,
      this.CustomerCategory,
      this.CustomerCategoryStatus
    );
  }
  getPinCodeDropdown() {
    if (this.isUpdate) {
      const SelectPincode = this.pinCodeData.find(
        (x) => x.name == this.customerTable.PinCode
      );
      this.customerTableForm.controls["PinCode"].setValue(SelectPincode);
    }
    const pincodeValue = this.customerTableForm.controls["PinCode"].value;
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
            this.jsonControlCustomerArray,
            this.customerTableForm,
            filteredPincodeDet,
            this.PinCode,
            this.PinCodeStatus
          );
        }
      }
    }
  }

  async getGSTPinCodeDropdown() {
    if (this.GSTcustomerTableForm.controls["gstPinCode"].value != "") {
      const stateName = this.GSTcustomerTableForm.value.gstState;
      const stateDataByName = await this.objState.fetchStateByFilterId(
        stateName,
        "STNM"
      ); // for filter by STNM
      this.objPinCodeService.validateAndFilterPincode(
        this.GSTcustomerTableForm,
        stateDataByName[0].ST,
        this.jsonControlGSTArray,
        this.gstPinCode,
        this.gstPinCodeStatus
      );
    }
  }

  getcustomerLocationDropdown() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "location_detail",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          const dropdownData = res.data.map((x) => {
            return {
              name: x.locName,
              value: x.locCode,
            };
          });

          if (this.isUpdate) {
            res.data.forEach((x) => {
              if (x.locName == this.customerTable.CustomerLocations) {
                this.customerTableForm.controls["CustomerLocations"].setValue({
                  name: x.locName,
                  value: x.locCode,
                });
              }
            });
          }

          this.filter.Filter(
            this.jsonControlCustomerArray,
            this.customerTableForm,
            dropdownData,
            this.location,
            this.locationStatus
          );
        }
      },
    });
  }

  selectedFileMSMEScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        const MSMEScanName = file.name;
        this.selectedFiles = true;
        this.customerTableForm.controls["MSMEscan"].setValue(MSMEScanName);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }

  selectedFilePanCardScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        const PANcardName = file.name;
        this.selectedFiles = true;
        this.customerTableForm.controls["uplodPANcard"].setValue(PANcardName);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }
  // ------------------------------------------------------#endregion😃----------------------------------------------

  // ******************************************************/All Control Function/**********************************************
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  cancel() {
    this.Route.navigateByUrl("/Masters/CustomerMaster/CustomerMasterList");
  }

  async setGSTState() {
    const gstNumber = this.GSTcustomerTableForm.value.gstNo;
    const filterId = gstNumber.substring(0, 2);
    const request = {
      companyCode: this.companyCode,
      collectionName: "state_master",
      filter: { ST: parseInt(filterId) },
    };
    this.masterService.masterPost("generic/get", request).subscribe({
      next: (res) => {
        if (res && res.success && res.data.length > 0) {
          this.slectGstState = res.data[0];
          this.GSTcustomerTableForm.controls.gstState.setValue(
            this.slectGstState.STNM
          );
        }
      },
    });
  }

  onSelectPinCode() {
    const fetchData = this.pinCodeResData.find(
      (x) => x.PIN == this.customerTableForm.value.PinCode.name
    );
    this.customerTableForm.controls.city.setValue(fetchData.CT);
    const request = {
      companyCode: this.companyCode,
      collectionName: "state_master",
      filter: { ST: fetchData.ST },
    };

    // Fetch pincode data
    this.masterService.masterPost("generic/get", request).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.customerTableForm.controls.state.setValue(res.data[0].STNM);
          this.masterService
            .getJsonFileDetails("countryList")
            .subscribe((countryListres) => {
              const countryName = countryListres.find(
                (x) => x.Code == res.data[0].CNTR
              );
              this.customerTableForm.controls["Country"].setValue(
                countryName.Country
              );
            });
        }
      },
    });
  }
  onSelectGSTPinCode() {
    const fetchData = this.pinCodeResData.find(
      (x) => x.PIN == this.GSTcustomerTableForm.value.gstPinCode.name
    );
    this.GSTcustomerTableForm.controls.gstCity.setValue(fetchData.CT);
    const request = {
      companyCode: this.companyCode,
      collectionName: "address_detail",
      filter: { pincode: this.GSTcustomerTableForm.value.gstPinCode.name },
    };

    this.masterService.masterPost("generic/get", request).subscribe({
      next: (res) => {
        if (res && res.success) {
          if (res.data.length > 0) {
            this.GSTcustomerTableForm.controls.gstAddres.setValue(
              res.data[0].address
            );
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
      },
    });
  }

  onChangeCustomerName() {
    let req = {
      companyCode: this.companyCode,
      filter: { customerName: this.customerTableForm.value.customerName },
      collectionName: "customer_detail",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.data.length > 0) {
            if (
              !this.isUpdate &&
              this.customerTableForm.value.customerName !=
                this.customerTable.customerName
            ) {
              Swal.fire({
                title: "CustomerName Already exist! Please try with another",
                toast: true,
                icon: "error",
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "OK",
              });
              this.customerTableForm.controls["customerName"].setErrors({
                customerExist: true,
              });
              this.customerTableForm.controls["customerName"].setValue("");
            }
          }
        }
      },
      error: (err) => {},
    });
  }

  onChangeEmail() {
    const input = this.customerTableForm.value.Customer_Emails.trim();
    var emailAddresses = input.split(","); // Split the input string into an array of email addresses
    // Define the email validation regular expression
    var emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/;

    var validEmails = [];
    var invalidEmails = [];

    // Loop through each email address and validate it
    for (var i = 0; i < emailAddresses.length; i++) {
      var email = emailAddresses[i].trim(); // Remove any leading/trailing whitespace
      const FilterEmail = validEmails.filter((x) => x == email);
      if (emailRegex.test(email) && FilterEmail.length == 0) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }
    if (invalidEmails.length > 0) {
      let EmailString = "";
      invalidEmails.forEach((x) => {
        EmailString = `${
          EmailString != ""
            ? EmailString + "<li style='margin:0px;'>" + x + "<li>"
            : "<li style='margin:0px;'>" + x + "<li>"
        }`;
      });
      Swal.fire({
        title: `<b style="color: rgb(0, 141, 141);">This Emails is not valid:</b><ul style="margin-left: 10px;color: gray; list-style: disc;">${EmailString}</ul> <b style="color: red;">! Please try with another</b>`,
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      }).then(() => {
        this.customerTableForm.controls["Customer_Emails"].setValue(
          validEmails.join(",")
        );
      });
    }
  }

  onChangeERPcode() {
    let req = {
      companyCode: this.companyCode,
      filter: { ERPcode: this.customerTableForm.value.ERPcode },
      collectionName: "customer_detail",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.data.length > 0) {
            if (
              !this.isUpdate &&
              this.customerTableForm.value.ERPcode != this.customerTable.ERPcode
            ) {
              Swal.fire({
                title: "ERP code Already exist! Please try with another",
                toast: true,
                icon: "error",
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "OK",
              });
              this.customerTableForm.controls["ERPcode"].setErrors({
                customerExist: true,
              });
              this.customerTableForm.controls["ERPcode"].setValue("");
            }
          }
        }
      },
      error: (err) => {},
    });
  }

  async ValidGSTNumber(){
    var isGST = false
    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if(element.gstNo == this.GSTcustomerTableForm.value.gstNo){
        isGST = true
        this.GSTcustomerTableForm.controls["gstNo"].setValue("")
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
    if(this.GSTcustomerTableForm.value.gstNo != ""){
      this.setGSTState()
    }
  }
  // ------------------------------------------------------#endregion😃----------------------------------------------

  // ******************************************************/Save Edit Remove And Set Function/**********************************************
  async save() {
    const Body = {
      ...this.customerTableForm.value,
      CustomerCategory: this.customerTableForm.value.CustomerCategory.name,
      CustomerLocations: this.customerTableForm.value.CustomerLocations.name,
      PinCode: this.customerTableForm.value.PinCode.name,
      customerGroup: this.customerTableForm.value.customerGroup.name,
      activeFlag: this.customerTableForm.value.activeFlag ? "Y" : "N",
      BlackListed: this.customerTableForm.value.BlackListed ? "Y" : "N",
      MSMEregistered: this.customerTableForm.value.MSMEregistered ? "Y" : "N",
      isPANregistration: this.customerTableForm.value.isPANregistration
        ? "Y"
        : "N",
      _id: `${
        this.customerTableForm.value.customerGroup.value
      }-${this.customerTableForm.value.customerName.substring(
        0,
        4
      )}-${Math.floor(Math.random() * (5000 - 1 + 1) + 1)}`,
      customerCode: this.isUpdate
        ? this.customerTable.customerCode
        : `${this.customerTableForm.value.customerName
            .trim()
            .split(" ")
            .join("")}${Math.floor(Math.random() * (100 - 1 + 1) + 1)}`,
      companyCode: localStorage.getItem("companyCode"),
      updatedDate: new Date(),
      updatedBy: localStorage.getItem("UserName"),
      GSTdetails: this.tableData.map((x) => {
        return {
          gstAddres: x.gstAddres,
          gstCity: x.gstCity,
          gstNo: x.gstNo,
          gstPinCode: x.gstPinCode,
          gstState: x.gstState,
        };
      }),
    };

    if (this.isUpdate) {
      delete Body._id;
      delete Body.customerCode;
      let req = {
        companyCode: this.companyCode,
        collectionName: "customer_detail",
        filter: { _id: this.customerTable._id },
        update: Body,
      };
      //API FOR UPDATE
      this.masterService.masterPut("generic/update", req).subscribe({
        next: (res) => {
          this.Route.navigateByUrl(
            "/Masters/CustomerMaster/CustomerMasterList"
          );
          if (res.success) {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
          //
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "customer_detail",
        data: Body,
      };
      await this.masterService.masterPost("generic/create", req).subscribe({
        next: (res) => {
          if (res.success) {
            this.Route.navigateByUrl(
              "/Masters/CustomerMaster/CustomerMasterList"
            );
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
        },
        error: (err) => {
          console.log("err", err);
        },
      });
    }
  }

  // ValidAndAddEditData() {
  //   Swal.fire({
  //     title: `<h5> are you sure you want to ${
  //       this.GstTableEdit ? "edit" : "add"
  //     } data ? </h5>`,
  //     toast: true,
  //     icon: "success",
  //     showCloseButton: false,
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     confirmButtonText: "SUBMIT",
  //   }).then((res) => {
  //     if (res.isConfirmed) {
  //       this.AddRowData();
  //     }
  //   });
  // }

  async AddRowData() {
    this.tableLode = false;
    const Index =this.GstTableEdit?this.GstTableEditData.Srno:
        this.tableData.length == 0 ? 1 : this.tableData.slice(-1)[0].Srno + 1;
      const Body = {
        Srno: parseInt(Index),
        gstAddres: this.GSTcustomerTableForm.value.gstAddres,
        gstCity: this.GSTcustomerTableForm.value.gstCity,
        gstNo: this.GSTcustomerTableForm.value.gstNo,
        gstPinCode: this.GSTcustomerTableForm.value.gstPinCode.name,
        gstState: this.GSTcustomerTableForm.value.gstState,
        actions: ["Edit", "Remove"],
      };
      this.tableData.push(Body);
    // Create a promise that resolves after the specified delay
    const delayDuration = 1000;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayDuration);
    await this.addRemoveGSTValue(null , 'add');
    this.tableLode = true;
  }

  addRemoveGSTValue(data , type) {
    if (type == 'edit') {
      const GstPin = this.pinCodeResData.find((x) => x.PIN == data?.gstPinCode);
      var SElectValue = {
        name: `${GstPin?.PIN}`,
        value: GstPin?.PIN,
      };
    }
    this.GSTcustomerTableForm.controls["gstNo"].setValue(
      this.GstTableEdit ? data?.gstNo : ""
    );
    this.GSTcustomerTableForm.controls["gstState"].setValue(
      this.GstTableEdit ? data?.gstState : ""
    );
    this.GSTcustomerTableForm.controls["gstAddres"].setValue(
      this.GstTableEdit ? data?.gstAddres : ""
    );
    this.GSTcustomerTableForm.controls["gstCity"].setValue(
      this.GstTableEdit ? data?.gstCity : ""
    );
    this.GSTcustomerTableForm.controls["gstPinCode"].setValue(
      this.GstTableEdit ? SElectValue : ""
    );

    if (!this.GstTableEdit) {
      this.initializeGSTFormControl();
    }
  }

  async handleMenuItemClick(data) {
    this.tableLode = false;
    if (data.label.label == "Edit") {
      this.GstTableEdit=true;
      this.GstTableEditData = data.data;
      const index = this.tableData.indexOf(data.data);
      if (index > -1) {
        this.tableData.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.addRemoveGSTValue(data.data , 'edit');
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

  //#endregion

   //#region to check if a value already exists in vendor list
   async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      const fieldValue = this.customerTableForm.controls[fieldName].value;

      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "customer_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const customerList = await this.masterService.masterPost("generic/get", req).toPromise();

      // Check if data exists for the given filter criteria
      if (customerList.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          title: `${errorMessage} already exists! Please try with another !`,
          toast: true,
          icon: "error",
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "OK"
        });

        // Reset the input field
        this.customerTableForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }

  // Function to check if ERP Id already exists
  async CheckPANNo() {
    await this.checkValueExists("PANnumber", "PAN No");
  }
  async CheckCINnumber() {
    await this.checkValueExists("CINnumber", "CIN number");
  }
  async CheckmsmeNumber() {
    await this.checkValueExists("MSMENumber", "MSME Number");
  }
  //#endregion
}
