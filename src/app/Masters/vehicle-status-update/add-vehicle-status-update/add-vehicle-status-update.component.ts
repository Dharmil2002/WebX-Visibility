import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleStatus } from 'src/app/core/models/Masters/vehicle-status/vehicle-status';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { VehicleStatusControls } from 'src/assets/FormControls/vehicle-status';
import { addVehicleStatusData, getLocationDetail, getvehicleDetail } from '../vehicle-status-utility';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vehicle-status-update',
  templateUrl: './add-vehicle-status-update.component.html'
})
export class AddVehicleStatusUpdateComponent implements OnInit {
  jsonControlVehicleArray: any;
  vehicleStatusTableForm: UntypedFormGroup;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  breadScrums = [
    {
      title: "Add Vehicle details",
      items: ["Home"],
      active: "Vehicle Status",
    },
  ];
  location: any;
  locationStatus: any;
  vehicle: any;
  vehicleStatus: any;
  constructor(
    private route: Router,
    private fb: UntypedFormBuilder,
    private _operationService: OperationService,
    private filter: FilterUtils

  ) {

    this.initializeFormControl()
  }

  ngOnInit(): void {
    this.getLocationDetailFromApi();
    this.getVehicleDetailFromApi();
  }

  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    // Create vehicleFormControls instance to get form controls for different sections
    const vehicleFormControls = new VehicleStatusControls();
    this.jsonControlVehicleArray = vehicleFormControls.getFormControls();
    this.jsonControlVehicleArray.forEach(data => {
      if (data.name === 'currentLocation') {
        // Set State-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vehNo') {
        // Set State-related variables
        this.vehicle = data.name;
        this.vehicleStatus = data.additionalData.showNameAndValue;
      }

    });
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vehicleStatusTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleArray]);
  }

  /*Below function is call for bind the data in dropdown*/
  async getLocationDetailFromApi() {
    try {
      const locationData = await getLocationDetail(this.companyCode, this._operationService);

      // Handle locationData or do something with it
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleStatusTableForm,
        locationData,
        this.location,
        this.locationStatus)
    } catch (error) {
      // Handle any errors that may occur during the API call
      console.error("Error in someFunction:", error);
    }
  }
  async getVehicleDetailFromApi() {
    try {
      const vehicleData = await getvehicleDetail(this.companyCode, this._operationService);

      // Handle  or do something with it
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleStatusTableForm,
        vehicleData,
        this.vehicle,
        this.vehicleStatus)
    } catch (error) {
      // Handle any errors that may occur during the API call
      console.error("Error in someFunction:", error);
    }
  }
  async save() {

    this.vehicleStatusTableForm.controls['id'].setValue(this.vehicleStatusTableForm.value.vehNo.value);
    this.vehicleStatusTableForm.controls['currentLocation'].setValue(this.vehicleStatusTableForm.value.currentLocation.value);
    this.vehicleStatusTableForm.controls['vehNo'].setValue(this.vehicleStatusTableForm.value.vehNo.value);
    try {

      const vehicleData = await addVehicleStatusData(this.companyCode, this._operationService, this.vehicleStatusTableForm.value);
      if (vehicleData) {
        Swal.fire({
          icon: "success",
          title: "Vehicle Added successfully",
          text: "",
          showConfirmButton: true,
      });
      this.route.navigateByUrl('Masters/Vehicle/Status');
      }

    }
    catch (error) {
      // Handle any errors that may occur during the API call
      console.error("Error in save:", error);
    }

  }
  cancel() {
    window.history.back();
  }
}
