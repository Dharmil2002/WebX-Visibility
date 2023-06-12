import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { loadingControl } from 'src/assets/FormControls/loadingSheet';
import { Router } from '@angular/router';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { LodingSheetGenerateSuccessComponent } from '../loding-sheet-generate-success/loding-sheet-generate-success.component';
@Component({
  selector: 'app-create-loading-sheet',
  templateUrl: './create-loading-sheet.component.html'
})
export class CreateLoadingSheetComponent implements OnInit {
  departureJsonUrl = '../../../assets/data/departureDetails.json'
  loadingJsonUrl = '../../../assets/data/vehicleType.json'
  loadingSheetJsonUrl = '../../../assets/data/shipmentDetails.json'
  tableload = true;
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  dynamicControls = {
    add: false,
    edit: false,
    csv: true
  }
  linkArray = [
    { Row: 'Shipment', Path: 'Operation/LoadingSheetView' }
  ]
  //declaring breadscrum
  breadscrums = [
    {
      title: "Create-Loading-Sheet",
      items: ["Loading-Sheet"],
      active: "Loading-Sheet"
    }
  ]
  menuItems = []
  toggleArray = []
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;
  isShipmentUpdate: boolean = false;
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tripData: any;
  extraData: any;
  vehicleType: any;
  vehicleTypeStatus: any;
  orgBranch: string = localStorage.getItem("Branch");
  shipmentData: any;
  csv: any[];
  columnHeader = {
    "checkBoxRequired": "",
    "lag": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "RouteandSchedule": "Leg",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  loadingData: any;
  shippingData: any;
  listDepartueDetail: any;
  getloadingFormData: any;
  //#endregion


  constructor(private Route: Router, private CnoteService: CnoteService, private dialog: MatDialog, private http: HttpClient, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    // if (data) {
    //   this.tripData = data
    // }
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data?.columnData || this.Route.getCurrentNavigation()?.extras?.state.data;
      this.shippingData = this.Route.getCurrentNavigation()?.extras?.state.shipping;
      if (this.shippingData) {
        this.getloadingFormData = this.CnoteService.getData();
        this.isShipmentUpdate = true;
      }
    }
    this.IntializeFormControl()
    this.autoBindData()
  }
  autoBindData() {
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.tripData?.VehicleNo || this.getloadingFormData?.vehicle || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.tripData?.RouteandSchedule || this.getloadingFormData?.Route || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.tripData?.TripID || this.getloadingFormData?.TripID || '')
    this.loadingSheetTableForm.controls['Expected'].setValue(this.tripData?.Expected || this.getloadingFormData?.Expected || '')
    this.loadingSheetTableForm.controls['LoadingLocation'].setValue(localStorage.getItem('Branch') || '')
    this.vehicleTypeDropdown();
  }
  IntializeFormControl() {
    const loadingControlFormControls = new loadingControl();
    this.jsonControlArray = loadingControlFormControls.getMarkArrivalsertFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'vehicleTypecontrolHandler') {
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
    })
    this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  ngOnInit(): void {
   
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);

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
  IsActiveFuntion($event) {
    this.loadingData = $event
  }
  vehicleTypeDropdown() {

    this.http.get(this.loadingJsonUrl).subscribe(res => {
      this.loadingSheetData = res;
      let vehicleType = [];
      if (this.loadingSheetData) {
        this.loadingSheetData.data[0].forEach(element => {
          let json = {
            name: element.Type_Name,
            value: element.Type_Code,
          }
          vehicleType.push(json);
        });
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.loadingSheetTableForm,
        vehicleType,
        this.vehicleType,
        this.vehicleTypeStatus
      );
      let vehicleTypeDetails = vehicleType.find((x) => x.name.trim() == this.tripData?.VehicleType.trim() || '')
      if (vehicleTypeDetails) {
        console.log('2');
        this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleTypeDetails)
        this.vehicleTypeDataAutofill()
      } else {
        console.log('1');
        let vehicleDropValue={
          name:this.getloadingFormData?.vehicleType.name,
          value:this.getloadingFormData?.vehicleType.value
        }
        this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleDropValue)
        console.log("VehicleType"+JSON.stringify(this.loadingSheetTableForm.value.vehicleType));
        this.vehicleTypeDataAutofill();
      }
    });
    this.getshipmentData()
  }
  getDepartueDetail(route) {
    this.http.get(this.departureJsonUrl).subscribe(res => {
      this.listDepartueDetail = res;
      this.tripData = this.listDepartueDetail.data.find((x) => x.RouteandSchedule == route);
      if (!this.getloadingFormData) {
        this.autoBindData()
      }

    })
  }
  getshipmentData() {
    if (!this.isShipmentUpdate) {
      let routeDetail = this.tripData?.RouteandSchedule.split(":")[1].split("-");
      routeDetail = routeDetail.map(str => String.prototype.replace.call(str, ' ', ''));
    }
    this.http.get(this.loadingSheetJsonUrl).subscribe(res => {
      let filterData = []
      if (!this.isShipmentUpdate) {
        this.shipmentData = res;
        filterData = this.shipmentData.NestedSingmentData.filter((x) => x.route.trim() == this.tripData.RouteandSchedule.trim());
        this.extraData = filterData;

      }
      else {
        filterData = this.shippingData
        this.getDepartueDetail(this.shippingData[0].route)
        this.extraData = filterData;

      }
      const groupedData = {};

      // Group shipments by route
      filterData.forEach(shipment => {
        const { leg, Packages, Weight, Volume } = shipment;

        if (!groupedData[leg]) {
          // If the route doesn't exist in groupedData, initialize it
          groupedData[leg] = {
            Shipment: 0,
            lag: leg,
            Packages: 0,
            WeightKg: 0,
            VolumeCFT: 0,
          };
        }

        // Increment the count of shipments and update the packages and weight
        groupedData[leg].Shipment++;
        groupedData[leg].Packages += Packages;
        groupedData[leg].WeightKg += Weight;
        groupedData[leg].VolumeCFT += Volume;
      });

      // Convert the grouped data to an array
      let groupedShipments = Object.values(groupedData);

      this.csv = groupedShipments
      this.tableload = false;
    })
  }
  vehicleTypeDataAutofill() {
    console.log("VehicleType 1"+this.loadingSheetTableForm.value);
    //let routeRlocation = getArrayAfterMatch(ruteHlocation, this.orgBranch);
    let loadingSheetDetails = this.loadingSheetData.data[0].find((x) => x.Type_Code == this.loadingSheetTableForm.value?.vehicleType.value || '')
    if (loadingSheetDetails) {
      this.loadingSheetTableForm.controls['CapacityKg'].setValue(loadingSheetDetails?.CapacityKg || '')
      this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(loadingSheetDetails?.CapacityVolumeCFT || '')
      this.loadingSheetTableForm.controls['LoadaddedKg'].setValue(loadingSheetDetails?.LoadaddedKg || '')
      this.loadingSheetTableForm.controls['LoadedKg'].setValue(loadingSheetDetails?.LoadedKg || '')
      this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(loadingSheetDetails?.LoadedvolumeCFT || '')
      this.loadingSheetTableForm.controls['VolumeaddedCFT'].setValue(loadingSheetDetails?.VolumeaddedCFT || '')
      this.loadingSheetTableForm.controls['VolumeUtilization'].setValue(loadingSheetDetails?.VolumeUtilization || '')
      this.loadingSheetTableForm.controls['WeightUtilization'].setValue(loadingSheetDetails?.WeightUtilization || '')
      this.CnoteService.setData(this.loadingSheetTableForm.value)
    }
  }
  loadingSheetGenerate() {
    if (this.loadingData) {
      // Check if BcSerialType is "E"
      // If it is "E", set displaybarcode to true
      // Open a modal using the content parameter passed to the function


      const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> = this.dialog.open(LodingSheetGenerateSuccessComponent, {
        width: '100%', // Set the desired width
        data: this.loadingData // Pass the data object
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        // Handle the result after the dialog is closed
      });
    }
    else {
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
    }
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}
