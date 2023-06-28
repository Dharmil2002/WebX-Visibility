import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { disPatchControl } from './dispatch';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dispatch-vehicle',
  templateUrl: './dispatch-vehicle.component.html'
})
export class DispatchVehicleComponent implements OnInit {
  jsonUrl = '../../../assets/data/loadingSheet.json'
  dropDownJsonUrl = '../../../assets/data/dropDown.json'
  data: any;
  csv: any;
  protected _onDestroy = new Subject<void>();
  showSaveAndCancelButton: boolean = true;
  jsonControlArray: FormControls[];
  disPatchTableForm: UntypedFormGroup;
  tableload = true;
  breadscrums = [
    {
      title: "Dispatch",
      items: ["loadingSheet"],
      active: "loadingSheet"
    }
  ]
  dispatchControls: disPatchControl;
  companyCode: any;
  addWeight: string;
  weightStatus: any;
  vehicle: string;
  vehicleStatus: any;
  jsonControlParent: FormControls[];
  jsonControlchild: FormControls[];
  disPatchdata: any;
  vehicledata: any;
  constructor(private http: HttpClient, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    this.InitializeFormControl();
  }

  ngOnInit(): void {
    this.getDispatch();
    this.getWeightDetails();
  }
  //#region  to initialize form Control
  InitializeFormControl() {
    /**
  * this function sets validation for different fields, dynamically.
  */

    this.dispatchControls = new disPatchControl();

    this.jsonControlArray = this.dispatchControls.getFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'AddWeightHandler') {
        // Set location-related variables
        this.addWeight = data.name;
        this.weightStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vehiclelistcontrolHandler') {
        this.vehicle = data.name;
        this.vehicleStatus = data.additionalData.showNameAndValue;
      }



    });
    this.jsonControlParent = this.jsonControlArray.filter((x) => x.additionalData?.isVehicle != 'true');
    this.jsonControlchild = this.jsonControlArray.filter((x) => x.additionalData?.isVehicle == 'true');
    this.disPatchTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

  }
  getWeightDetails() {
    this.http.get(this.dropDownJsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data.Weight;

      this.filter.Filter(
        this.jsonControlArray,
        this.disPatchTableForm,
        tableArray,
        this.addWeight,
        this.weightStatus,
      );
      // this.csv = tableArray;
      // console.log(this.csv);

    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }
  AddCostData(event) {
    if (event.eventArgs.value.length > 0) {
      this.disPatchTableForm.controls['FreightCost'].setValue(event.eventArgs.value.length * 100)

    }
    else {
      this.disPatchTableForm.controls['FreightCost'].setValue(0)
    }

  }
  getDispatch() {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.vehicledata = res;
      let tableArray = this.vehicledata.loadingdata;
      let vehicleList = [];
      tableArray.forEach(element => {
        let dropdownList = {
          name: element.VehicleList,
          value: element.VehicleList
        }
        vehicleList.push(dropdownList)

      });

      this.filter.Filter(
        this.jsonControlArray,
        this.disPatchTableForm,
        vehicleList,
        this.vehicle,
        this.vehicleStatus,
      );
      // this.csv = tableArray;
      // console.log(this.csv);

    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }



  }

  //#region this function listen to the values emitted by 'add-form-webxpress'
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  getVehicleData() {
    let vehicleData = this.vehicledata.loadingdata.find((x) => x.VehicleList == this.disPatchTableForm.value.vehicle.value);
    this.disPatchTableForm.controls['FreightCost'].setValue('')
    this.disPatchTableForm.controls['Status'].setValue(vehicleData?.Status || '');
    this.disPatchTableForm.controls['ScheduleArrival'].setValue(vehicleData?.ScheduleArrivalTime || '');
    this.disPatchTableForm.controls['ScheduleDeparture'].setValue(vehicleData?.ScheduleDepartureTime || '')
    this.disPatchTableForm.controls['VehicleCapacity'].setValue(vehicleData?.VehicleCapacity || '')
    this.disPatchTableForm.controls['LoadedCapacity'].setValue(vehicleData?.LoadedCapacity || '')
    this.disPatchTableForm.controls['FreeSpaceAvailable'].setValue(vehicleData?.FreeSpaceAvailable || '')
    this.disPatchTableForm.controls['ActualArrival'].setValue(vehicleData?.ActualArrivalTime || '')
    this.disPatchTableForm.controls['ActualDeparture'].setValue(vehicleData?.ActualDepartureTime || '')
    this.disPatchTableForm.controls['VendorName'].setValue(vehicleData?.VendorName || '')
    this.disPatchTableForm.controls['DriverName'].setValue(vehicleData?.DriverName || '')
    this.disPatchTableForm.controls['DriverMb'].setValue(vehicleData?.DriverMb || '')

  }
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;


    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.disPatchTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
      this.disPatchTableForm.controls['FreightCost'].setValue(this.disPatchTableForm.value.AddWeight.length * 100)
  }

}
