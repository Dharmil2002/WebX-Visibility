import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleTypeControl } from "src/assets/FormControls/vehicle-type-control";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleTypeMaster } from "src/app/core/models/Masters/vehicle-type-master/vehicle-type-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { convertNumericalStringsToInteger } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { calculateVolume } from "../../vehicle-master/vehicle-utility";
@Component({
  selector: 'app-add-vehicletype-master',
  templateUrl: './add-vehicletype-master.component.html',
})
export class AddVehicletypeMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  vehicleTypeTableData: VehicleTypeMaster;
  vehicleTypeTableForm: UntypedFormGroup;
  vehicleTypeControl: VehicleTypeControl;
  jsonControlVehicleTypeArray: any;
  vehicleCategory: any;
  vehicleCategoryStatus: any;
  data: any;
  updateVehicleTypeCategory: any;
  vehicleTypeCategory: any;
  newVehicleTypeCode: any;
  ngOnInit(): void {
    //this.getVehicleTypeCategoryList();
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
    private filter: FilterUtils,
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state;
    if (navigationState != null) {
      this.action = 'edit';
      this.data = navigationState.data;
      console.log(this.data);

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
        title: 'Vehicle Type Master',
        items: ['Home'],
        active: this.isUpdate ? 'Edit Vehicle Type' : 'Add Vehicle Type',
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
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "state_detail",
      "filter": {}
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    const vehicleTypeExists = res.data.some((res) => res.vehicleTypeName === this.vehicleTypeTableForm.value.vehicleTypeName);
    if (vehicleTypeExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        title: 'Vehicle Type Name exists! Please try with another',
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
      this.vehicleTypeTableForm.controls["vehicleTypeName"].reset();
    }

    error: (err: any) => {
      // Handle error if required
      console.error(err);
    }

  }
  async save() {
    this.vehicleTypeTableForm.controls["isActive"].setValue(this.vehicleTypeTableForm.value.isActive);
    // Remove field from the form controls
    this.vehicleTypeTableForm.removeControl("companyCode");
    this.vehicleTypeTableForm.removeControl("updateBy");
    this.vehicleTypeTableForm.removeControl("isUpdate");
    let data = convertNumericalStringsToInteger(this.vehicleTypeTableForm.value)

    let req = {
      "companyCode": this.companyCode,
      "collectionName": "vehicleType_detail",
      "filter": {}
    }
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    if (res) {
      // Generate srno for each object in the array
      const lastUsedVehicleTypeCode = res.data[res.data.length - 1];
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
        let req = {
          companyCode: this.companyCode,
          collectionName: "vehicleType_detail",
          filter: { _id: id },
          update: data
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
          this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
        }
      }
      else {
        const data = this.vehicleTypeTableForm.value;
        const id = { _id: this.vehicleTypeTableForm.controls["vehicleTypeCode"].value };
        const mergedObject = { ...data, ...id };
        let req = {
          companyCode: this.companyCode,
          collectionName: "vehicleType_detail",
          data: mergedObject
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
          this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
        }
      }
    }
  }
}