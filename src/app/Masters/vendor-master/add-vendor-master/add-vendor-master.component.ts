import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";
import { VendorControl } from "src/assets/FormControls/vendor-control";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { MatDialog } from "@angular/material/dialog";
import { PayBasisdetailFromApi } from "../../Customer Contract/CustomerContractAPIUtitlity";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { TdsMasterService } from "src/app/Utility/module/masters/tds-master/tds-master-Service";
import { StorageService } from "src/app/core/service/storage.service";
@Component({
  selector: "app-add-vendor-master",
  templateUrl: "./add-vendor-master.component.html",
})
export class AddVendorMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  vendorTabledata: VendorMaster;
  vendorTableForm: UntypedFormGroup;
  MSMETableForm: UntypedFormGroup;
  otherDetailForm: UntypedFormGroup;
  vendorBankDetailForm: UntypedFormGroup;
  lowTDSTableForm: UntypedFormGroup;
  HighTDSTableForm: UntypedFormGroup;
  vendorFormControls: VendorControl;
  jsonControlVendorArray: any;
  jsonControlMSMEArray: any;
  jsonControlOtherArray: any;
  jsonControlVendorBankArray: any;
  jsonControllowTDSTableArray: any;
  jsonControlHighTDSableArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  data: any;
  backPath: string;
  vLocation: any;
  vLocationStatus: any;
  vendorCity: any;
  isSubmit: boolean = false;
  vendorCityStatus: any;
  vendorTypDetail: any;
  vendorTypeData: any;
  vendorPinCodeStatus: any;
  vendorPinCode: any;
  pincodeResponse: any;
  pincodeData: any;
  newVendorCode: string;
  tableData: any = [];
  tableLoad: boolean;
  isLoad: boolean;
  gstPincode: string;
  gstPincodeStatus: boolean;
  addFlag = true;
  isCalledFirstTime = false;
  //#region Section Wise Configration
  DisplayBankregisteredSection = false;
  DisplayMSMERegisteredSection = false;
  DisplayGSTSection = false;
  DisplayisLowRateApplicable = false;
  DisplayisHighTDSRateApplicable = false;
  //#endregion
  columnHeader = {
    gstNumber: {
      Title: "GST Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    gstState: {
      Title: "GST State",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    gstAddress: {
      Title: "GST Address",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    gstPincode: {
      Title: "GST Pincode",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    gstCity: {
      Title: "GST City",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  menuItemflag = true;
  staticField = [
    "gstNumber",
    "gstState",
    "gstAddress",
    "gstPincode",
    "gstCity",
  ];
  linkArray = [];
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: boolean;
    toggle: any;
  }[];
  imageData: any = {};
  msmeTypeStatus: boolean;
  msmeType: string;
  msmeTypeData: any;
  tdsSection: string;
  tdsSectionStatus: boolean;
  Citys: string;
  CitysStatus: boolean;
  allJsonControlHighTDSableArray: any;
  constructor(
    private route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objPinCodeService: PinCodeService,
    private objState: StateService,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    private locationService: LocationService,
    private storage: StorageService,
    private tdsMasterService: TdsMasterService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vendorTabledata =
        this.route.getCurrentNavigation().extras.state.data;
      this.action = "edit";
      this.isUpdate = true;
      this.imageData = {
        msmeScan: this.vendorTabledata.msmeScan === "" ? null : this.vendorTabledata.msmeScan,
        panCardScan:this.vendorTabledata.panCardScan === "" ? null : this.vendorTabledata.panCardScan,
        uPRC:this.vendorTabledata.uPRC === "" ? null : this.vendorTabledata.uPRC,
        uTDSD:this.vendorTabledata.uTDSD === "" ? null : this.vendorTabledata.uTDSD,
        uCC: this.vendorTabledata.uCC === "" ? null : this.vendorTabledata.uCC,
        uploadKYC: this.vendorTabledata.uploadKYC === "" ? null : this.vendorTabledata.uploadKYC,
      };
      this.isLoad = true;
      this.tableLoad = true;
      // setting data in table at update time
      if (this.vendorTabledata.otherdetails) {
        this.vendorTabledata.otherdetails.forEach((item, index) => {
          item.id = index + 1;
          item.actions = ["Edit", "Remove"];

          // Push the modified object into this.tableData
          this.tableData.push(item);
        });
      }
      this.isLoad = false;
      this.tableLoad = false;
    } else {
      this.action = "Add";
    }
    const activeTitle = this.action === "edit" ? "Modify Vendor" : "Add Vendor";
    this.breadScrums = [
      {
        title: activeTitle,
        items: ["Home"],
        active: activeTitle,
        generatecontrol: true,
        toggle: this.isUpdate ? this.vendorTabledata.isActive : false,
      },
    ];

    if (this.action !== "edit") {
      this.vendorTabledata = new VendorMaster({});
    }
    this.initializeFormControl();
  }
  ngOnInit(): void {
    this.getDropDownData();
    this.getDetailsTds();
    //this.getAllMastersData();
    this.backPath = "/Masters/VendorMaster/VendorMasterList";
  }
  // Function to handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  checkedUpdate() {
    this.DisplayMSMERegisteredSection = this.vendorTabledata.msmeRegistered;
    this.DisplayBankregisteredSection = this.vendorTabledata.isBankregistered;
    this.DisplayGSTSection = this.vendorTabledata.isGSTregistered;
    this.DisplayisLowRateApplicable = this.vendorTabledata.isLowRateApplicable;
    this.DisplayisHighTDSRateApplicable = this.vendorTabledata.hTDSRA;
  }
  initializeFormControl() {
    const vehicleFormControls = new VendorControl(
      this.vendorTabledata,
      this.isUpdate
    );
    this.jsonControlVendorArray = vehicleFormControls.getVendorFormControls();
    this.vendorTableForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorArray,
    ]);

    this.jsonControlMSMEArray = vehicleFormControls.getMSMEFormControls();
    this.MSMETableForm = formGroupBuilder(this.fb, [this.jsonControlMSMEArray]);

    this.jsonControllowTDSTableArray = vehicleFormControls.getlowTDSControls();
    this.lowTDSTableForm = formGroupBuilder(this.fb, [
      this.jsonControllowTDSTableArray,
    ]);

    this.jsonControlHighTDSableArray = vehicleFormControls.gethighTDSControls();
    this.allJsonControlHighTDSableArray = this.jsonControlHighTDSableArray;
    this.HighTDSTableForm = formGroupBuilder(this.fb, [
      this.jsonControlHighTDSableArray,
    ]);

    this.jsonControlOtherArray =
      vehicleFormControls.getVendorOtherInfoFormControls();
    this.otherDetailForm = formGroupBuilder(this.fb, [
      this.jsonControlOtherArray,
    ]);

    this.jsonControlVendorBankArray =
      vehicleFormControls.getVendorBankDetailsControls();
    this.vendorBankDetailForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBankArray,
    ]);

    const vendorPropertyMap = {
      vendorType: {
        property: "vendorType",
        statusProperty: "vendorTypeStatus",
      },
      vendorLocation: {
        property: "vLocation",
        statusProperty: "vLocationStatus",
      },
      vendorPinCode: {
        property: "vendorPinCode",
        statusProperty: "vendorPinCodeStatus",
      },
    };
    const MSMEDetails = {
      msmeType: { property: "msmeType", statusProperty: "msmeTypeStatus" },
    };
    const lowTDSDetails = {
      tdsSection: {
        property: "tdsSection",
        statusProperty: "tdsSectionStatus",
      },
    };
    const cityDetails = {
      city: { property: "Citys", statusProperty: "CitysStatus" },
    };
    const OtherDetails = {
      gstPincode: {
        property: "gstPincode",
        statusProperty: "gstPincodeStatus",
      },
    };
    this.jsonControlVendorArray.forEach((data) => {
      const mapping = vendorPropertyMap[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlMSMEArray.forEach((data) => {
      const mapping = MSMEDetails[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlOtherArray.forEach((data) => {
      const mapping = OtherDetails[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlVendorBankArray.forEach((data) => {
      const mapping = cityDetails[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControllowTDSTableArray.forEach((data) => {
      const mapping = lowTDSDetails[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
    this.toggleTDSExempted();
    if (this.isUpdate) {
      this.checkedUpdate();
    }
  }
  async getDropDownData() {
    this.vendorTypeData = await PayBasisdetailFromApi(
      this.masterService,
      "VENDTYPE"
    );
    this.msmeTypeData = await PayBasisdetailFromApi(
      this.masterService,
      "MSMETYP"
    );
    if (this.isUpdate) {
      const vendType = this.vendorTabledata.vendorType;
      const MSMEType = this.msmeTypeData.msmeType;
      if (vendType) {
        let foundObject = this.vendorTypeData.find(
          (x) =>
            x.name.toLowerCase() === vendType.toLowerCase() ||
            x.value.toLowerCase() === vendType.toLowerCase()
        );
        if (foundObject) {
          this.vendorTableForm.controls.vendorType.setValue(foundObject);
        }
        const vendorLoc = this.vendorTabledata.vendorLocation.map((x) => {
          return { name: x, value: x };
        });
        this.vendorTableForm.controls["vendorLocationDropdown"].patchValue(
          vendorLoc
        );
        this.filter.Filter(
          this.jsonControlVendorArray,
          this.vendorTableForm,
          vendorLoc,
          this.vLocation,
          this.vLocationStatus
        );
        const pincode = this.vendorTabledata.vendorPinCode
          ? {
              name: this.vendorTabledata.vendorPinCode,
              value: this.vendorTabledata.vendorPinCode,
            }
          : "";
        this.vendorTableForm.controls.vendorPinCode.setValue(pincode);
      }
      if (MSMEType) {
        let foundObject = this.msmeTypeData.find(
          (x) =>
            x.name.toLowerCase() === MSMEType.toLowerCase() ||
            x.value.toLowerCase() === MSMEType.toLowerCase()
        );
        if (foundObject) {
          this.MSMETableForm.controls.msmeType.setValue(foundObject);
        }
      }
      this.filter.Filter(
        this.jsonControlVendorArray,
        this.vendorTableForm,
        this.vendorTypeData,
        this.vendorType,
        this.vendorTypeStatus
      );
      this.filter.Filter(
        this.jsonControlMSMEArray,
        this.MSMETableForm,
        this.msmeTypeData,
        this.msmeType,
        this.msmeTypeStatus
      );
      // For setting image data, assuming you have imageData defined
      if (this.imageData) {
        Object.keys(this.imageData).forEach((controlName) => {
          const url = this.imageData[controlName];
          if (url !== null) {
            const fileName = this.objImageHandling.extractFileName(url);

            // Assign filename to MSMETableForm if the controlName exists
            if (this.MSMETableForm.controls[controlName]) {
              this.MSMETableForm.controls[controlName].setValue(fileName);
            }

            // Assign filename to vendorTableForm if the controlName exists
            if (this.vendorTableForm.controls[controlName]) {
              this.vendorTableForm.controls[controlName].setValue(fileName);
            }

            // Assign filename to lowTDSTableForm if the controlName exists
            if (this.lowTDSTableForm.controls[controlName]) {
              this.lowTDSTableForm.controls[controlName].setValue(fileName);
            }

            // Assign filename to HighTDSTableForm if the controlName exists
            if (this.HighTDSTableForm.controls[controlName]) {
              this.HighTDSTableForm.controls[controlName].setValue(fileName);
            }

            // Assign filename to vendorBankDetailForm if the controlName exists
            if (this.vendorBankDetailForm.controls[controlName]) {
              this.vendorBankDetailForm.controls[controlName].setValue(
                fileName
              );
            }

            const controlArrays = [
              this.jsonControlVendorArray,
              this.jsonControlMSMEArray,
              this.jsonControllowTDSTableArray,
              this.jsonControlHighTDSableArray,
              this.jsonControlVendorBankArray,
            ];

            controlArrays.forEach((controlArray) => {
              const control = controlArray.find((x) => x.name === controlName);
              if (control) {
                control.additionalData.isFileSelected = false;
              }
            });
          }
        });
      }
    }
    this.filter.Filter(
      this.jsonControlVendorArray,
      this.vendorTableForm,
      this.vendorTypeData,
      this.vendorType,
      this.vendorTypeStatus
    );
    this.filter.Filter(
      this.jsonControlMSMEArray,
      this.MSMETableForm,
      this.msmeTypeData,
      this.msmeType,
      this.msmeTypeStatus
    );
  }
  /*  Below the function for the Getting a Location */
  async getVendorLocation() {
    let vendLocation =
      this.vendorTableForm.value.vendorLocationDropdown.length > 0
        ? this.vendorTableForm.value.vendorLocationDropdown.map((x) => x.value)
        : "";
    let destinationMapping = await this.locationService.locationFromApi({
      locCode: {
        D$regex: `^${this.vendorTableForm.controls.vendorLocation.value}`,
        D$options: "i",
      },
    });
    if (vendLocation) {
      destinationMapping = destinationMapping.filter(
        (x) => !vendLocation.includes(x.value)
      );
      destinationMapping.push(
        ...this.vendorTableForm.value.vendorLocationDropdown
      );
    }
    this.filter.Filter(
      this.jsonControlVendorArray,
      this.vendorTableForm,
      destinationMapping,
      this.vLocation,
      this.vLocationStatus
    );
  }
  /*End*/
  OnChangeServiceSelections(event) {
    const fieldName = typeof event === "string" ? event : event.field.name;
    const checked = typeof event === "string" ? event : event.eventArgs.checked;
    const eventRateData = {
      eventArgs: {
        value: this.vendorTableForm.value.rateTypecontrolHandler,
      },
    };
    switch (fieldName) {
      case "msmeRegistered":
        this.DisplayMSMERegisteredSection = checked;
        break;
      case "isBankregistered":
        this.DisplayBankregisteredSection = checked;
        break;
      case "isGSTregistered":
        this.DisplayGSTSection = checked;
        break;
      case "isLowRateApplicable":
        this.DisplayisLowRateApplicable = checked;
        break;
      case "hTDSRA":
        this.DisplayisHighTDSRateApplicable = checked;
        break;
      default:
        break;
    }
    this.isCalledFirstTime = true;
  }
  async save() {
    if (this.otherDetailForm.valid) {
      Swal.fire({
        icon: "warning",
        title: "Pending Data",
        text: "There is pending data for the GST. Are you sure you want to continue?",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.saveVendorDetails();
        } else {
          return false;
        }
      });
    } else {
      await this.saveVendorDetails();
    }
  }
  async saveVendorDetails() {
    this.isSubmit = true;
    clearValidatorsAndValidate(this.otherDetailForm);
    clearValidatorsAndValidate(this.vendorTableForm);
    clearValidatorsAndValidate(this.MSMETableForm);
    clearValidatorsAndValidate(this.lowTDSTableForm);
    clearValidatorsAndValidate(this.HighTDSTableForm);
    clearValidatorsAndValidate(this.vendorBankDetailForm);

    const vendorLocationDropdown1 =
      this.vendorTableForm.value.vendorLocationDropdown.map(
        (item: any) => item.value
      );
    this.vendorTableForm.controls["vendorLocation"].setValue(
      vendorLocationDropdown1
    );
    this.vendorTableForm.removeControl("vendorLocationDropdown");
    this.vendorTableForm.removeControl("");
    Object.values(this.vendorTableForm.controls).forEach((control) =>
      control.setErrors(null)
    );
    this.vendorTableForm.value.otherdetails =
      this.tableData.length > 0
        ? this.tableData.map(({ actions, id, ...rest }) => rest)
        : [];

    this.vendorTableForm.controls["vendorTypeName"].setValue(
      this.vendorTableForm.value.vendorType.name
    );
    this.vendorTableForm.controls["vendorType"].setValue(
      this.vendorTableForm.value.vendorType.value
    );
    this.vendorTableForm.controls["vendorPinCode"].setValue(
      this.vendorTableForm.value.vendorPinCode.value
    );
    let body = {};
    if (this.vendorTableForm.valid) {
      body = { ...body, ...this.vendorTableForm.value };
    }
    if (this.vendorTableForm.controls["msmeRegistered"].value) {
      body["msmeTypeName"] = this.MSMETableForm.value.msmeType.name;
      this.MSMETableForm.controls["msmeType"].setValue(
        this.MSMETableForm.value.msmeType.value
      );
      body = { ...body, ...this.MSMETableForm.value };
    }
    if (this.vendorTableForm.controls["isBankregistered"].value) {
      this.vendorBankDetailForm.controls["city"].setValue(
        this.vendorBankDetailForm.value.city.value
      );
      body = { ...body, ...this.vendorBankDetailForm.value };
    }

    if (this.vendorTableForm.controls["isLowRateApplicable"].value) {
      body["tdsSectionName"] = this.lowTDSTableForm.value.tdsSection.name;
      this.lowTDSTableForm.controls["tdsSection"].setValue(
        this.lowTDSTableForm.value.tdsSection.value
      );
      body = { ...body, ...this.lowTDSTableForm.value };
    }

    if (this.vendorTableForm.controls["hTDSRA"].value) {
      body = { ...body, ...this.HighTDSTableForm.value };
    }
    let data = body;

    const imageControlNames = [
      "msmeScan",
      "panCardScan",
      "uPRC",
      "uTDSD",
      "uCC",
      "uploadKYC",
    ];
    imageControlNames.forEach((controlName) => {
      const file = this.objImageHandling.getFileByKey(
        controlName,
        this.imageData
      );
      // Set the URL in the corresponding control name
      data[controlName] = file ? file : "";
    });
    if (this.isUpdate) {
      let vendorCode = data["vendorCode"];
      delete data["_id"];
      data["mODDT"] = new Date();
      data["mODBY"] = this.vendorTableForm.value.eNTBY;
      delete data["eNTBY"];
      delete data["eNTLOC"];
      delete data["eNTDT"];
      data["mODLOC"] = localStorage.getItem("Branch");
      let req = {
        companyCode: this.companyCode,
        collectionName: "vendor_detail",
        filter: { vendorCode: vendorCode },
        update: data,
      };

      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/VendorMaster/VendorMasterList");
      }
    } else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "vendor_detail",
        filter: {},
        sorting: { vendorCode: -1 },
      };
      const Vendor = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", req)
      );
      const resVendor = Vendor?.data;
      const lastVendorCode = resVendor.vendorCode || "V00000";
      this.newVendorCode = nextKeyCode(lastVendorCode);

      if (this.newVendorCode) {
        data["vendorCode"] = this.newVendorCode;
        data["_id"] = `${this.companyCode}-${this.newVendorCode}`;
        data["eNTDT"] = new Date();
        data["eNTLOC"] = localStorage.getItem("Branch");
        const newData = this.tableData.map((x) => {
          const { actions, id, ...rest } = x;
          return rest;
        });

        data["otherdetails"] = newData;
        let req = {
          companyCode: this.companyCode,
          collectionName: "vendor_detail",
          data: data,
        };
        const res = await firstValueFrom(
          this.masterService.masterPost("generic/create", req)
        );
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl("/Masters/VendorMaster/VendorMasterList");
        }
      }
    }
  }
  cancel() {
    this.route.navigateByUrl("/Masters/VendorMaster/VendorMasterList");
  }
  async getGstPincode() {
    const stateName = this.otherDetailForm.value.gstState;
    const stateDataByName = await this.objState.fetchStateByFilterId(
      stateName,
      "STNM"
    ); // for filter by STNM
    this.objPinCodeService.getPincodes(
      this.otherDetailForm,
      this.jsonControlOtherArray,
      "gstPincode",
      this.gstPincodeStatus,
      "",
      stateDataByName[0].ST
    );
  }
  //#region to Set the vendor's city and state based on the provided PIN code
  async setStateCityData() {
    const { allData } = this.vendorTableForm.controls.vendorPinCode.value;
    try {
      // Set the vendor's city
      this.vendorTableForm.controls.vendorCity.setValue(allData.CT);
      allData.ST = parseInt(allData.ST);
      const stateName = await this.objState.fetchStateByFilterId(
        allData.ST,
        "ST"
      );
      this.vendorTableForm.controls.vendorState.setValue(stateName[0].STNM);

      // Fetch and set the vendor's country based on the state's country code
      this.masterService.getJsonFileDetails("countryList").subscribe((res) => {
        const country = res.find((x) => x.Code === stateName[0]?.CNTR);
        const countryName = country?.Country || "";
        this.vendorTableForm.controls.vendorCountry.setValue(countryName);
      });
    } catch (error) {
      console.error(
        "An error occurred while setting state and city data:",
        error
      );
    }
  }

  getPincode() {
    this.objPinCodeService.getPincodes(
      this.vendorTableForm,
      this.jsonControlVendorArray,
      "vendorPinCode",
      this.vendorPinCodeStatus
    );
  }
  // Set the GST state based on the provided GST number
  async setState() {
    try {
      const gstNumber = this.otherDetailForm.value.gstNumber;
      let filterId = gstNumber.substring(0, 2);
      filterId = parseInt(filterId);
      // Fetch and set the GST state name based on the state code
      const stateName = await this.objState.fetchStateByFilterId(
        filterId,
        "ST"
      );
      this.otherDetailForm.controls.gstState.setValue(stateName[0].STNM);
    } catch (error) {
      console.error("An error occurred while setting the GST state:", error);
    }
  }
  //get Tds Details
  async getDetailsTds() {
    const data = await this.tdsMasterService.getTdsDetails(
      { companyCode: this.storage.companyCode },
      true
    );
    this.filter.Filter(
      this.jsonControllowTDSTableArray,
      this.lowTDSTableForm,
      data,
      this.tdsSection,
      this.tdsSectionStatus
    );
  }
  //End
  //get City Details
  async getCityDetails() {
    const vendor = this.vendorBankDetailForm.controls["city"].value;
    const regexPattern = `^${vendor}`;
    if (regexPattern.length <= 2) return;
    const cityDetails = await this.objPinCodeService.getCityDetails({
      CT: { D$regex: regexPattern, D$options: "i" },
    });
    this.filter.Filter(
      this.jsonControlVendorBankArray,
      this.vendorBankDetailForm,
      cityDetails,
      this.Citys,
      this.CitysStatus
    );
  }

  //End
  // Set the GST city based on the provided GST pincode
  setGSTCity() {
    try {
      const { allData } = this.otherDetailForm.controls.gstPincode.value;

      // Set the GST city
      this.otherDetailForm.controls.gstCity.setValue(allData.CT);
    } catch (error) {
      console.error("An error occurred while setting the GST city:", error);
    }
  }
  //#endregion

  protected _onDestroy = new Subject<void>();
  // function handles select All feature of all multiSelect fields of one form.
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlVendorArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlVendorArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vendorTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  //#region to check if a value already exists in vendor list
  async checkValueExists(fieldName, errorMessage,formGroup) {
    try {
      // Get the field value from the form controls
      const fieldValue = formGroup.controls[fieldName].value;
      const filterUppercase = { [fieldName]: fieldValue.toUpperCase() };
      const filterLowercase = { [fieldName]: fieldValue.toLowerCase() };
      // Create a request object with the filter criteria
      const req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "vendor_detail",
        filter: { ...filterUppercase, ...filterLowercase },
      };
      // Send the request to fetch user data
      const userlist = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );
      // Check if data exists for the given filter criteria
      if (userlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: `${errorMessage} already exists! Please try with another !`,
          icon: "error",
          title: "error",
          showConfirmButton: true,
        });
        // Reset the input field
        formGroup.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(
        `An error occurred while fetching ${fieldName} details:`,
        error
      );
    }
  }

  // Function to check if ERP Id already exists
  async CheckPANNo() {
    await this.checkValueExists("panNo", "PAN No",this.vendorTableForm);
  }
  async CheckVendorName() {
    await this.checkValueExists("vendorName", "Vendor Name",this.vendorTableForm);
  }
  async CheckCINnumber() {
    await this.checkValueExists("cinNumber", "CIN number",this.vendorTableForm);
  }
  //#endregion

  async addData() {
    if (this.otherDetailForm.valid) {
      this.tableLoad = true;
      this.isLoad = true;
      const tableData = this.tableData;
      const gstNumber = this.otherDetailForm.controls.gstNumber.value;
      if (tableData.length > 0) {
        // Check if the gstNumber already exists in tableData
        const isDuplicate = this.tableData.some(
          (item) => item.gstNumber === gstNumber
        );

        if (isDuplicate) {
          this.otherDetailForm.controls["gstNumber"].setValue("");
          // Show an error message using Swal (SweetAlert)
          Swal.fire({
            text: "GST Number already exists! Please try with another.",
            icon: "error",
            title: "error",
            showConfirmButton: true,
          });
          this.tableLoad = false;
          this.isLoad = false;
          return false;
        }
      }
      const delayDuration = 1000;
      // Create a promise that resolves after the specified delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // Use async/await to introduce the delay
      await delay(delayDuration);
      const json = {
        id: tableData.length + 1,
        gstNumber: this.otherDetailForm.value.gstNumber,
        gstState: this.otherDetailForm.value.gstState,
        gstAddress: this.otherDetailForm.value.gstAddress,
        gstPincode: this.otherDetailForm.value.gstPincode.value,
        gstCity: this.otherDetailForm.value.gstCity,
        // invoice: false,
        actions: ["Edit", "Remove"],
      };
      this.tableData.push(json);
      this.otherDetailForm.reset(); // Reset form values
      this.isLoad = false;
      this.tableLoad = false;
    } else {
      Swal.fire({
        text: "Please Fill Vendor Other Details",
        icon: "warning",
        title: "Warning",
        showConfirmButton: true,
      });
      return false;
    }
  }

  handleMenuItemClick(data) {
    this.fillTable(data);
  }

  fillTable(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    } else {
      this.otherDetailForm.controls["gstNumber"].setValue(
        data.data?.gstNumber || ""
      );
      this.otherDetailForm.controls["gstState"].setValue(
        data.data?.gstState || ""
      );
      this.otherDetailForm.controls["gstAddress"].setValue(
        data.data?.gstAddress || ""
      );
      this.otherDetailForm.controls.gstPincode.setValue({
        name: data.data.gstPincode,
        value: data.data.gstPincode,
      });
      this.otherDetailForm.controls["gstCity"].setValue(
        data.data?.gstCity || ""
      );
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

  //#region to check Vendor emails
  onChangeEmail() {
    const input = this.vendorTableForm.value.emailId.trim();
    var emailAddresses = input.split(","); // Split the input string into an array of email addresses
    // Define the email validation regular expression
    var emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/;
    var validEmails = [];
    var invalidEmails = [];
    // Loop through each email address and validate it
    for (var i = 0; i < emailAddresses.length; i++) {
      var email = emailAddresses[i].trim(); // Remove any leading/trailing whitespace
      if (emailRegex.test(email)) {
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
        text: "This Email is not valid. Please try with another!",
        icon: "error",
        title: "error",
        showConfirmButton: true,
      });
      this.vendorTableForm.controls["emailId"].setValue(validEmails.join(","));
    }
  }
  //#endregion
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.vendorTableForm.controls["isActive"].setValue(event);
  }
  //#region toggle hide and show
  toggleTDSExempted() {
    const TDSExemptedValue = this.HighTDSTableForm.value.isTDSDeclaration;
    if (TDSExemptedValue) {
      this.jsonControlHighTDSableArray = this.allJsonControlHighTDSableArray;
    } else {
      this.jsonControlHighTDSableArray =
        this.allJsonControlHighTDSableArray.filter((x) => x.name != "uTDSD");
    }
  }
  //#endregion

  //#region to handle image selection
  async selectPanCardScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "panCardScan",
      this.vendorTableForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControlVendorArray,
      allowedFormats
    );
  }
  async selectMsmeScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "msmeScan",
      this.MSMETableForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControlMSMEArray,
      allowedFormats
    );
  }
  async selectLowRateCerti(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "uPRC",
      this.lowTDSTableForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControllowTDSTableArray,
      allowedFormats
    );
  }
  async selectTDSDeclaration(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "uTDSD",
      this.HighTDSTableForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControlHighTDSableArray,
      allowedFormats
    );
  }
  async selectcancelledCeque(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "uCC",
      this.vendorBankDetailForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControlVendorBankArray,
      allowedFormats
    );
  }
  async selectKYC(data) {
    const allowedFormats = ["jpeg", "png", "jpg", "pdf"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(
      data.eventArgs,
      "uploadKYC",
      this.vendorBankDetailForm,
      this.imageData,
      "Vendor",
      "Master",
      this.jsonControlVendorBankArray,
      allowedFormats
    );
  }
  //#endregion

  //#region to preview image
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(
      control.imageName,
      this.imageData
    );
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: "30%",
      height: "50%",
    });
  }
  //#endregion
}
