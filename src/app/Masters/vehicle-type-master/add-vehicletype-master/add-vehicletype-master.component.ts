import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleTypeControl } from "src/assets/FormControls/vehicle-type-control";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleTypeMaster } from "src/app/core/models/Masters/vehicle-type-master/vehicle-type-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
@Component({
  selector: 'app-add-vehicletype-master',
  templateUrl: './add-vehicletype-master.component.html',
})
export class AddVehicletypeMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  vehicleTypeTableData: VehicleTypeMaster;
  vehicleTypeTableForm: UntypedFormGroup;
  vehicleTypeControl: VehicleTypeControl;
  backPath: string;
  jsonControlVehicleTypeArray: any;
  vehicleCategory: any;
  vehicleCategoryStatus: any;
  data: any;
  updateVehicleTypeCategory: any;
  vehicleTypeCategory: any;
  submit = 'Save';
  newVehicleTypeCode: any;
  ngOnInit(): void {
    //this.getVehicleTypeCategoryList();
    this.backPath = "/Masters/VehicleTypeMaster/VehicleTypeMasterList";
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
  constructor(
    private masterService: MasterService,
    public ObjSnackBarUtility: SnackBarUtilityService,
    private route: Router,
    private fb: UntypedFormBuilder,
    private storage: StorageService,
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state;
    if (navigationState != null) {
      this.action = 'edit';
      this.submit = 'Modify';
      this.data = navigationState.data;

      this.isUpdate = true;
      this.vehicleTypeTableData = this.data;
      this.vehicleCategory = this.vehicleTypeTableData.vehicleTypeCategory;
    } else {
      this.action = 'Add';
      this.vehicleTypeTableData = new VehicleTypeMaster({});
    }
    this.isUpdate = this.action === 'edit';
    this.breadScrums = [
      {
        generatecontrol: true,
        toggle: this.data && this.data.isActive ? this.data.isActive : "",
        title: this.isUpdate ? 'Modify Vehicle Type' : 'Add Vehicle Type',
        items: ['Home'],
        active: this.isUpdate ? 'Modify Vehicle Type' : 'Add Vehicle Type',
      },
    ];
    this.initializeFormControl();
  }
  initializeFormControl() {
    // Create VehicleFormControls instance to get form controls for different sections
    const vehicleTypeTableData = new VehicleTypeControl(this.vehicleTypeTableData, this.isUpdate);
    this.jsonControlVehicleTypeArray = vehicleTypeTableData.getVehicleTypeFormControls();
    this.jsonControlVehicleTypeArray.forEach(data => {
    });
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vehicleTypeTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleTypeArray]);
    this.vehicleTypeTableForm.controls["vehicleCategory"].setValue("HCV")
    this.vehicleTypeTableForm.controls["fuelType"].setValue("Petrol")
    this.vehicleTypeTableForm.controls["oem"].setValue("Tata")
  }
  //#endregion

  cancel() {
    this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
  }
  async checkVehicleTypeExist() {
    const res = await this.getVehicleTypeList();
    const vehicleTypeNameToCheck = this.vehicleTypeTableForm.value.vehicleTypeName.toLowerCase();
    const vehicleTypeExists = res.some((item) => item.vehicleTypeName.toLowerCase() === vehicleTypeNameToCheck
    );
    if (vehicleTypeExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        showConfirmButton: true,
        text: `Vehicle Type Name: ${this.vehicleTypeTableForm.value.vehicleTypeName} already exists! Please try with another`,
      });
      this.vehicleTypeTableForm.controls["vehicleTypeName"].reset();
    }

    error: (err: any) => {
      // Handle error if required
      console.error(err);
    }

  }
  async save() {
    let data = this.vehicleTypeTableForm.value
    const sortedData = await this.getVehicleTypeList();
    if (sortedData) {
      const lastUsedVehicleTypeCode = sortedData[sortedData.length - 1];
      const lastVehicleTypeCode = lastUsedVehicleTypeCode ? parseInt(lastUsedVehicleTypeCode.vehicleTypeCode.substring(3)) : 0;
      // Function to generate a new route code
      function generateVehicleCode(initialCode: number = 0) {
        const nextVehicleTypeCode = initialCode + 1;
        const vehicleTypeNumber = nextVehicleTypeCode.toString().padStart(4, '0');
        const vehicleTypeCode = `VT${vehicleTypeNumber}`;
        return vehicleTypeCode;
      }
      if (this.isUpdate) {
        this.newVehicleTypeCode = this.vehicleTypeTableData._id
      } else {
        this.newVehicleTypeCode = generateVehicleCode(lastVehicleTypeCode);
      }
      //generate unique vehicleTypeCode
      this.vehicleTypeTableForm.controls["vehicleTypeCode"].setValue(this.newVehicleTypeCode);
      if (this.isUpdate) {
        let id = this.vehicleTypeTableForm.value._id;
        // Remove the "_id" field from the form controls
        this.vehicleTypeTableForm.removeControl("_id");
        data["mODDT"] = new Date();
        data['mODLOC'] = this.storage.branch;
        data['mODBY:'] = this.storage.userName;
        let req = {
          companyCode: this.companyCode,
          collectionName: "vehicleType_detail",
          filter: { _id: id },
          update: data
        };
        const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
        }
      }
      else {
        const id = { _id: this.vehicleTypeTableForm.controls["vehicleTypeCode"].value };
        data["eNTDT"] = new Date();
        data['eNTLOC'] = this.storage.branch;
        data['eNTBY:'] = this.storage.userName;
        data.vehicleTypeCode = id._id;
        const mergedObject = { ...data, ...id };
        let req = {
          companyCode: this.companyCode,
          collectionName: "vehicleType_detail",
          data: mergedObject
        };
        const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
        }
      }
    }
  }
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.vehicleTypeTableForm.controls['isActive'].setValue(event);
    // console.log("Toggle value :", event);
  }
  async getVehicleTypeList() {
    try {
      let req = {
        "companyCode": this.companyCode,
        "collectionName": "vehicleType_detail",
        "filter": {}
      };
      const response = await firstValueFrom(this.masterService.masterPost("generic/get", req));

      return response ? response.data.sort((a, b) => a._id.localeCompare(b._id)) : [];
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
}