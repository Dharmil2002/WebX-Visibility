import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleTypeControl } from "src/assets/FormControls/vehicle-type-control";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from "src/app/Utility/utility.service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleTypeMaster } from "src/app/core/models/Masters/vehicle-type-master/vehicle-type-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-vehicletype-master',
  templateUrl: './add-vehicletype-master.component.html',
})
export class AddVehicletypeMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  action: string;
  isUpdate = false;
  vehicleTypeTableData: VehicleTypeMaster;
  vehicleTypeTableForm: UntypedFormGroup;
  vehicleTypeControl: VehicleTypeControl;
  jsonControlVehicleTypeArray: any;
  jsonControlCapacityInfoArray: any;
  accordionData: any;
  vehicleCategory: any;
  vehicleCategoryStatus: any;
  data: any;
  updateVehicleTypeCategory: any;
  vehicleTypeCategory: any;
  ngOnInit(): void {
    this.getVehicleTypeCategoryList();
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
  constructor(private service: utilityService, private masterService: MasterService,
    public ObjSnackBarUtility: SnackBarUtilityService,
    private route: Router, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.vehicleTypeTableData = this.data;
      this.vehicleCategory = this.vehicleTypeTableData.vehicleTypeCategory;
      this.breadScrums = [
        {
          title: "Vehicle Type Details",
          items: ["Home"],
          active: "Edit Vehicle Type",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Vehicle Type Master",
          items: ["Home"],
          active: "Vehicle Type Details",
        },
      ];
      this.vehicleTypeTableData = new VehicleTypeMaster({});
    }
    this.initializeFormControl()
  }
  initializeFormControl() {
    // Create VehicleFormControls instance to get form controls for different sections
    const vehicleTypeTableData = new VehicleTypeControl(this.vehicleTypeTableData, this.isUpdate);
    this.jsonControlVehicleTypeArray = vehicleTypeTableData.getVehicleTypeFormControls();
    this.jsonControlVehicleTypeArray.forEach(data => {
      if (data.name === 'vehicleTypeCategory') {
        this.vehicleCategory = data.name;
        this.vehicleCategoryStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlCapacityInfoArray = vehicleTypeTableData.getCapacityInfoFormControl();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Vehicle Type Details": this.jsonControlVehicleTypeArray,
      "Capacity Information in Ton": this.jsonControlCapacityInfoArray
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vehicleTypeTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
    this.vehicleTypeTableForm.controls["vehicleSize"].setValue(
      this.vehicleTypeTableData.vehicleSize
    )
  }
  getVehicleTypeCategoryList() {
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.vehicleTypeCategory = res;
      let tableArray = this.vehicleTypeCategory.vehicleTypeCategory;
      let vehicleTypeCategory = [];
      tableArray.forEach(element => {
        let dropdownList = {
          name: element.codeDesc,
          value: element.codeId
        }
        vehicleTypeCategory.push(dropdownList)
      });
      if (this.isUpdate) {
        this.updateVehicleTypeCategory = vehicleTypeCategory.find((x) => x.name == this.vehicleTypeTableData.vehicleTypeCategory);
        this.vehicleTypeTableForm.controls.vehicleTypeCategory.setValue(this.updateVehicleTypeCategory);
      }

      this.filter.Filter(
        this.jsonControlVehicleTypeArray,
        this.vehicleTypeTableForm,
        vehicleTypeCategory,
        this.vehicleCategory,
        this.vehicleCategoryStatus,
      );
    });
  }
  //#region to calculate capacity based on Gross Vehicle Weight and unload weight and send validation msg if condition not matched
  calCapacity() {
    if (
      parseFloat(this.vehicleTypeTableForm.value.grossVehicleWeight) <
      parseFloat(this.vehicleTypeTableForm.value.unladenWeight)
    ) {
      this.ObjSnackBarUtility.showNotification(
        "snackbar-danger",
        "Gross Vehicle Weight must be greater than Unladen Weight !",
        "bottom",
        "center"
      );
      this.vehicleTypeTableForm.get("capacity").setValue(0);
    } else {
      this.vehicleTypeTableForm.get("capacity").setValue(
        parseFloat(this.vehicleTypeTableForm.value.grossVehicleWeight) -
        parseFloat(this.vehicleTypeTableForm.value.unladenWeight)
      );
    }
  }
  //#endregion
  getData(): void {
    var cal =
      parseFloat(this.vehicleTypeTableForm.value.length) *
      parseFloat(this.vehicleTypeTableForm.value.height) *
      parseFloat(this.vehicleTypeTableForm.value.width);
    this.vehicleTypeTableForm.controls["capacityDiscount"].setValue(cal.toFixed(2));
  }
  cancel() {
    window.history.back();
  }
  save() {
    this.vehicleTypeTableForm.controls["vehicleTypeCategory"].setValue(this.vehicleTypeTableForm.value.vehicleTypeCategory.value);
    this.vehicleTypeTableForm.controls["isActive"].setValue(this.vehicleTypeTableForm.value.isActive == true ? "Y" : "N");
    this.route.navigateByUrl('/Masters/VehicleTypeMaster/VehicleTypeMasterList');
    this.service.exportData(this.vehicleTypeTableForm.value);
    if (this.action === 'edit') {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Data Updated successfully!!!`,
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Data Downloaded successfully!!!`,
        showConfirmButton: true,
      });
    }
  }
}
