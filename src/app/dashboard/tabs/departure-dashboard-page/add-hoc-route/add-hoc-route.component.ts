import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { AddHocControls } from 'src/assets/FormControls/add-hoc-controls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hoc-route',
  templateUrl: './add-hoc-route.component.html'
})
export class AddHocRouteComponent implements OnInit {
  addHocForm: UntypedFormGroup;
  jsonAddHocControl: FormControls[];
  products: any[];
  className = "col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2";
  constructor(
    private fb: UntypedFormBuilder,
    private generalService: GeneralService,
    private storage: StorageService,
    private filter: FilterUtils,
    private locationService: LocationService,
    private routeLocation: RouteLocationService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
  ) { }

  ngOnInit(): void {
    this.IntializeFormControl();
  }
  IntializeFormControl() {
    const addHocForm = new AddHocControls();
    this.jsonAddHocControl = addHocForm.addHoc;
    this.addHocForm = formGroupBuilder(this.fb, [this.jsonAddHocControl]);
    this.getDropDownDetails();
  }
  async getDropDownDetails() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.jsonAddHocControl, this.products, "routeMode");
  }
  /*below is the function form handler which is used when any event fire on any form*/
  async functionCallHandler($event) {
    const field = $event.field; //what is use of this variable
    const functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  /*End*/
  // function handles select All feature of all multiSelect fields of one form.
  protected _onDestroy = new Subject<void>();
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonAddHocControl.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonAddHocControl[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.addHocForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
  /*  Below the function for the Getting a Location */
  async getLocation() {
    let connectLoc =
      this.addHocForm.value.connectLocationDropdown.length > 0
        ? this.addHocForm.value.connectLocationDropdown.map((x) => x.value)
        : "";
    if (this.addHocForm.controls.connectLoc.value.length>=3) {
      let destinationMapping = await this.locationService.locationFromApi({
        locCode: {
          D$regex: `^${this.addHocForm.controls.connectLoc.value}`,
          D$options: "i",
        },
      });
      if (connectLoc) {
        destinationMapping = destinationMapping.filter(
          (x) => !connectLoc.includes(x.value)
        );
        destinationMapping.push(
          ...this.addHocForm.value.connectLocationDropdown
        );
      }
      this.filter.Filter(
        this.jsonAddHocControl,
        this.addHocForm,
        destinationMapping,
        'connectLoc',
        false
      );
    }
  }
  /*End*/
  /*start*/
  connectLocations() {
    // Get the new locations from the dropdown
    let newLocations = this.addHocForm.value.connectLocationDropdown.map((x) => x.value);
    // Create a set from new locations to ensure uniqueness and maintain their order
    let uniqueNewLocations = new Set(newLocations);
    // Get the current value of the route
    let currentRoute = this.addHocForm.controls.route.value || "";
    // Split the current route into an array, remove empty entries if route was initially empty
    let currentRouteParts = currentRoute.split('-').filter(part => part);
    // Filter the current route parts to include only those that are still selected in the dropdown
    let filteredRouteParts = currentRouteParts.filter(part => uniqueNewLocations.has(part));
    // Combine the filtered existing parts with the new locations. Create a set to remove duplicates if any.
    let combinedLocations = new Set([...filteredRouteParts, ...newLocations]);
    // Convert the set back to a string with hyphens and update the route control
    this.addHocForm.controls.route.patchValue(Array.from(combinedLocations).join("-"));
  }
  /*End*/
  async save(){
    const controls = this.addHocForm.getRawValue();
    const route = await this.routeLocation.getRouteOne({companyCode:this.storage.companyCode,routeName:controls.route});
    if(route){
      Swal.fire({
        title: 'Route already exist',
        text: 'Route already exist',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return false;
    }
    const res=await this.routeLocation.addRouteLocation(controls);
    if(res){
      Swal.fire({
        title:'Success',
        html: `
          <table border="1">
            <tr>
              <th>Route Category</th>
              <th>Controlling Branch</th>
              <th>Schedule Departure Time</th>
              <th>Route Type</th>
              <th>Schedule Type</th>
            </tr>
            <tr>
              <td>${res.routeCat}</td>
              <td>${res.contBranch}</td>
              <td>${res.scheduleTime}</td>
              <td>${res.routeType}</td>
              <td>${res.ScheduleType}</td>
            </tr>
          </table>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'ok'
      });
      
    }
   
     
  }
  cancel(){
    this.dialogRef.close();
  }
}
