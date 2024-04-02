import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DriverControls } from "src/assets/FormControls/DriverMaster";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { DriverMaster } from "src/app/core/models/Masters/Driver";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { MatDialog } from "@angular/material/dialog";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-add-driver-master",
  templateUrl: "./add-driver-master.component.html",
})
export class AddDriverMasterComponent implements OnInit {
  driverFormControls: DriverControls;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  DriverTableForm: UntypedFormGroup;
  DriverTable: DriverMaster;
  //#region Variable declaration
  isUpdate = false;
  action: any;
  updateCountry: any;
  jsonControlDriverArray: any;
  location: any;
  backPath: string;
  locationStatus: any;
  category: any;
  categoryStatus: any;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
  vehicleDet: any;
  imageName: string;
  routeLocation: any;
  categoryDet: any;
  LocationList: any;
  locData: any;
  pincodeStatus: any;
  tableLoad: boolean;
  newDriverId: string;
  vehicleNo: any;
  vehicleNoStatus: any;
  pincodeData: any;
  vehicleData: any;
  countryList: any;
  countryCode: any;
  countryCodeStatus: any;
  newDriverCode: any;
  submit = 'Save';
  imageData: any = {};
  allData: { locationData: any; pincodeData: any; vehicleData: any; driverData: any; };
  pincode: any;
  pincodeDet: any;

  //#endregion

  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    private objPinCodeService: PinCodeService

  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;

      this.isUpdate = true;
      this.imageData = {
        'DOBProofScan': this.DriverTable.DOBProofScan,
        'addressProofScan': this.DriverTable.addressProofScan,
        'licenseScan': this.DriverTable.licenseScan,
        'driverPhoto': this.DriverTable.driverPhoto
      }
      this.submit = 'Modify';
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Driver",
          items: ["Masters"],
          active: "Modify Driver",
          generatecontrol: true,
          toggle: this.DriverTable.activeFlag
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Driver",
          items: ["Masters"],
          active: "Add Driver",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.DriverTable = new DriverMaster({});
    }
    this.initializeFormControl();
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.driverFormControls = new DriverControls(
      this.DriverTable,
      this.isUpdate
    );
    // Get form controls for Driver Details section
    this.jsonControlDriverArray = this.driverFormControls.getFormControlsD();
    this.jsonControlDriverArray.forEach((data) => {
      if (data.name === "vehicleNo") {
        // Set category-related variables
        this.vehicleNo = data.name;
        this.vehicleNoStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "pincode") {
        // Set pincode-related variables
        this.pincode = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.DriverTableForm = formGroupBuilder(this.fb, [
      this.jsonControlDriverArray,
    ]);
  }
  //#endregion

  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getAllMastersData();
    this.backPath = "/Masters/DriverMaster/DriverMasterList";
  }

  //#region
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections
      let locationReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "location_detail",
      };
      let pincodeReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      let vehicleReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "vehicle_detail",
      };
      let driverReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "driver_detail",
      };
      const locationRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", locationReq));
      const pincodeRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", pincodeReq));
      const vehicleRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", vehicleReq));
      const driverRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", driverReq));

      const mergedData = {
        locationData: locationRes?.data,
        pincodeData: pincodeRes?.data,
        vehicleData: vehicleRes?.data,
        driverData: driverRes?.data
      };
      this.allData = mergedData;

      const vehicleDet = mergedData.vehicleData.map((element) => ({
        name: element.vehicleNo,
        value: element.vehicleNo,
      }));
      const pincodeDet = mergedData.pincodeData.map((element) => ({
        name: element.PIN.toString(),
        value: element.PIN.toString(),
      }));

      this.vehicleDet = vehicleDet;
      this.pincodeDet = pincodeDet;

      this.filter.Filter(
        this.jsonControlDriverArray,
        this.DriverTableForm,
        vehicleDet,
        this.vehicleNo,
        this.vehicleNoStatus
      );
      this.tableLoad = true;
      this.autofillDropdown();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }
  //#endregion

  //#region
  bindDropdown() {
    const propertyMappings = {
      country: { property: "countryCode", statusProperty: "countryCodeStatus" },
    };

    this.jsonControlDriverArray.forEach((data) => {
      const mapping = propertyMappings[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
  }
  //#endregion

  //#region
  autofillDropdown() {
    if (this.isUpdate) {
      this.pincodeData = this.pincodeDet.find(
        (x) => x.name == this.DriverTable.pincode
      );
      this.DriverTableForm.controls.pincode.setValue(this.pincodeData);

      this.vehicleData = this.vehicleDet.find(
        (x) => x.name == this.DriverTable.vehicleNo
      );
      this.DriverTableForm.controls.vehicleNo.setValue(this.vehicleData);

      // For setting image data, assuming you have imageData defined
      Object.keys(this.imageData).forEach((controlName) => {
        const url = this.imageData[controlName];
        const fileName = this.objImageHandling.extractFileName(url);
        // Set the form control value using the control name
        this.DriverTableForm.controls[controlName].setValue(fileName);

        //setting isFileSelected to true
        const control = this.jsonControlDriverArray.find(x => x.name === controlName);
        control.additionalData.isFileSelected = false
      });
    }
  }
  //#endregion

  //#region
  async getDropDownData() {
    try {
      const res: any = await firstValueFrom(this.masterService.getJsonFileDetails("dropDownUrl"));
      this.countryList = res.countryList;

      if (this.isUpdate) {
        this.updateCountry = this.findDropdownItemByName(
          this.countryList,
          this.DriverTable.country
        );
        this.DriverTableForm.controls.country.setValue(this.updateCountry);
      }
      const filterParams = [
        [
          this.jsonControlDriverArray,
          this.countryList,
          this.countryCode,
          this.countryCodeStatus,
        ],
      ];
      filterParams.forEach(
        ([jsonControlArray, dropdownData, formControl, statusControl]) => {
          this.filter.Filter(
            jsonControlArray,
            this.DriverTableForm,
            dropdownData,
            formControl,
            statusControl
          );
        }
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching dropdown data:", error);
    }
  }
  //#endregion

  //#region
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.name === name);
  }
  //#endregion

  //#region save
  async save() {
    const commonBody = {
      manualDriverCode: this.DriverTableForm.value.manualDriverCode,
      driverName: this.DriverTableForm.value.driverName,
      licenseNo: this.DriverTableForm.value.licenseNo,
      valdityDt: this.DriverTableForm.value.valdityDt,
      country: this.DriverTableForm.value.country.name,
      countryCD: this.DriverTableForm.value.country.value,
      telno: this.DriverTableForm.value.telno,
      address: this.DriverTableForm.value.address,
      pincode: this.DriverTableForm.value.pincode.value,
      city: this.DriverTableForm.value.city,
      addressProofDocNo: this.DriverTableForm.value.addressProofDocNo,
      vehicleNo: this.DriverTableForm.value.vehicleNo.value,
      dDob: this.DriverTableForm.value.dDob,
      DOBProofDocNo: this.DriverTableForm.value.DOBProofDocNo,
      activeFlag: this.DriverTableForm.value.activeFlag,
      _id: this.DriverTableForm.value.manualDriverCode,
      cID: localStorage.getItem("companyCode"),
      eNTBY: localStorage.getItem("UserName"),
      eNTDT: new Date(),
      eNTLOC: localStorage.getItem("Branch"),
      mODDT: new Date(),
      mODBY: localStorage.getItem("UserName"),
      mODLOC: localStorage.getItem("Branch"),
    }

    // Define an array of control names
    const imageControlNames = ['driverPhoto', 'licenseScan', 'addressProofScan', 'DOBProofScan'];

    imageControlNames.forEach(controlName => {
      const file = this.objImageHandling.getFileByKey(controlName, this.imageData);
      commonBody[controlName] = file;
    });

    let req = {
      companyCode: this.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };
    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", req));
    if (res) {
      // Generate srno for each object in the array
      const sortedData = res.data.sort((a, b) => a._id.localeCompare(b._id));
      const lastUsedDriverCode = sortedData[sortedData.length - 1];
      const lastDriverCode = lastUsedDriverCode
        ? parseInt(lastUsedDriverCode.manualDriverCode.substring(3))
        : 0;

      const generateDriverCode = (initialCode: number = 0) => {
        const nextDriverCode = initialCode + 1;
        return `DR${nextDriverCode.toString().padStart(4, "0")}`;
      };

      this.newDriverCode = this.isUpdate ? this.DriverTable._id : generateDriverCode(lastDriverCode);
      //generate unique manualDriverCode
      commonBody.manualDriverCode = this.newDriverCode

      if (this.isUpdate) {
        let id = this.DriverTableForm.value._id;
        delete commonBody._id;
        delete commonBody.eNTDT
        delete commonBody.eNTBY
        delete commonBody.eNTLOC
        this.DriverTableForm.removeControl("_id");
        let req = {
          companyCode: this.companyCode,
          collectionName: "driver_detail",
          filter: { _id: id },
          update: commonBody,
        };
        const res = await firstValueFrom(this.masterService
          .masterPut("generic/update", req));
        if (res) {
          //if vehicle is assign to driver then need to update vehcile status
          if(commonBody?.vehicleNo && commonBody?.vehicleNo!=""){
            await this.updateStatusByVehicleNo(commonBody);
          }
          else{
            await this.updateStatusByDriver(commonBody);
          }
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
        }
      } else {
        delete commonBody.mODBY
        delete commonBody.mODDT
        delete commonBody.mODLOC
        this.DriverTableForm.removeControl("_id");
        commonBody["_id"] = this.newDriverCode
        let req = {
          companyCode: this.companyCode,
          collectionName: "driver_detail",
          data: commonBody,
        };
        const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
        if (res) {
          
          if(commonBody?.vehicleNo && commonBody?.vehicleNo!=""){
            await this.updateStatusByVehicleNo(commonBody);
          }
          else{
            await this.updateStatusByDriver(commonBody);
          }
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
        }
      }
    }
  }
  //#endregion

  cancel() {
    this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
  }
  async updateStatusByVehicleNo(data: any) {


    /*Remove from old vehicle*/
    let reqD = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { driverCD: data.manualDriverCode },
    };
    //get Vehicle status
    let vehStatsD = await firstValueFrom(
      this.masterService.masterPost("generic/get", reqD)
    );
    let vehSD=vehStatsD?.data[0]
    const isExistsD= vehSD != null && vehSD?.vehNo;

      if(isExistsD){
        vehSD={
          ...vehSD,
          updateDate:new Date(),
          updateBy: data?.mODBY || data?.eNTBY,
          dMobNo:"",
          driver:"",
          driverCD: "",
          lcExpireDate:"",
          driverPan:"",
          lcNo:""
        };
        let reqU = {
          companyCode: this.companyCode,
          collectionName: "vehicle_status",
          filter: { 
            driverCD: data.manualDriverCode },
          update: vehSD,
        };
        
        const res = await firstValueFrom(
          this.masterService.masterMongoPut("generic/update", reqU)
        );
      }
    let req = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { vehNo: data.vehicleNo },
    };
    //get Vehicle status
    let vehStats = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    let vehS=vehStats?.data[0]
    const isExists = vehS != null && vehS?.vehNo;
    //only update if exists it will be store in vehicle Status
    if (isExists) {
      vehS={
        ...vehS,
        updateDate:new Date(),
        updateBy: data?.mODBY || data?.eNTBY,
        dMobNo:data.telno,
        driver:data.driverName,
        driverCD: data.manualDriverCode,
        lcExpireDate:data.valdityDt,
        driverPan:"",
        lcNo:data.licenseNo
      }
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_status",
        filter: { 
          vehNo: data.vehicleNo },
        update: vehS,
      };
      
      const res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
    }
  }
  async updateStatusByDriver(data: any) {
    let req = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { driverCD: data.manualDriverCode },
    };
    //get Vehicle status
    let vehStats = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    let vehS=vehStats?.data[0]
    const isExists = vehS != null && vehS?.vehNo;
    //only update if exists
    if (isExists) {
      if(data?.vehicleNo && data?.vehicleNo!=''){
        vehS={
          ...vehS,
          updateDate:new Date(),
          updateBy: data?.mODBY || data?.eNTBY,
          dMobNo:data.telno,
          driver:data.driverName,
          driverCD: data.manualDriverCode,
          lcExpireDate:data.valdityDt,
          driverPan:"",
          lcNo:data.licenseNo
        }
      }
      else{
        vehS={
          ...vehS,
          updateDate:new Date(),
          updateBy: data?.mODBY || data?.eNTBY,
          dMobNo:"",
          driver:"",
          driverCD: "",
          lcExpireDate:"",
          driverPan:"",
          lcNo:""
        }
      }
      
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_status",
        filter: { 
          driverCD: data.manualDriverCode },
        update: vehS,
      };
      
      const res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
    }
  }

  setStateCityData() {
    const fetchData = this.allData.pincodeData.find((item) =>
      item.PIN == this.DriverTableForm.controls.pincode.value.value
    );
    this.DriverTableForm.controls.city.setValue(fetchData.CT);
  }

  //#region to set pin code
  getPincodeData() {
    this.objPinCodeService.validateAndFilterPincode(this.DriverTableForm, "", this.jsonControlDriverArray, 'pincode', this.pincodeStatus);
  }
  //#endregion

  //#region
  async checkDriverNameExist() {
    const FilterFunction = (x) => {
      if (this.isUpdate) {
        return x._id != this.DriverTable._id && x.driverName.toUpperCase() === this.DriverTableForm.value.driverName.toUpperCase()
      } else {
        return x.driverName.toUpperCase() === this.DriverTableForm.value.driverName.toUpperCase()
      }
    }
    const drivernameExists = this.allData.driverData.some((x) => FilterFunction(x));
    if (drivernameExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        text: "Driver Name already exists! Please try with another",
        title: 'Error',
        icon: "error",
        showConfirmButton: true,
      });
      this.DriverTableForm.controls["driverName"].reset();
    }
  }
  //#endregion

  //#region
  async checkLicenseNumberExist() {
    const licenseNo = this.DriverTableForm.value.licenseNo
    try {
      const request = {
        companyCode: this.companyCode,
        collectionName: 'driver_detail',
        filter: { "licenseNo": licenseNo },
      };
      const res = await this.masterService.masterPost('generic/get', request).toPromise();
      if (res.data.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `This ${licenseNo} Number already added! Please try with another!`,
          showConfirmButton: true,
        });
        this.DriverTableForm.controls['licenseNo'].setValue('');
        return;
      }
    } catch (error) {
      console.error('An error occurred while checking for unique vehicles:', error);
    }
  }
  //#endregion

  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.DriverTableForm.controls['activeFlag'].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#region to preview image
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion

  //#region Driver Photo
  async selectFileDriverPhoto(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "driverPhoto", this.DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region License Scan
  async selectedFileLicenseScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "licenseScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region DOB proof scan
  async selectedFileDOBProofScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "DOBProofScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region Address Proof Scan
  async selectedFileAddressProofScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "addressProofScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion
}