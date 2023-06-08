import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { loadingControl } from 'src/assets/FormControls/loadingSheet';
import { LodingSheetGenerateSuccessComponent } from '../../loding-sheet-generate-success/loding-sheet-generate-success.component';
import { AdvanceControl, BalanceControl, DepartVehicleControl, DepartureControl } from 'src/assets/FormControls/departVehicle';

@Component({
  selector: 'app-depart-vehicle',
  templateUrl: './depart-vehicle.component.html'
})
export class DepartVehicleComponent implements OnInit {
  loadingJsonUrl = '../../../assets/data/vehicleType.json'
  loadingSheetJsonUrl = '../../../assets/data/shipmentDetails.json'
  jsonUrl = '../../../assets/data/departVehicleLoadDetails.json'
  data: [] | any;
  tableload = false;
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; //name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  linkArray = [
    { Row: 'Shipments', Path: 'Operation/LoadingSheetView' }
  ]
  //declaring breadscrum
  breadscrums = [
    {
      title: "Depart Vehicle",
      items: ["Home"],
      active: "Depart Vehicle"
    }
  ]
  menuItems = []
  toggleArray = []
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;
  loadingSheetTableForm: UntypedFormGroup;
  departvehicleTableForm: UntypedFormGroup;
  advanceTableForm: UntypedFormGroup;
  balanceTableForm: UntypedFormGroup;
  departureTableForm: UntypedFormGroup;
  jsonControlArray: any;
  departControlArray: any;
  advanceControlArray: any;
  balanceControlArray: any;
  departureControlArray: any;
  tripData: any;
  vehicleType: any;
  vehicleTypeStatus: any;
  orgBranch: string = localStorage.getItem("Branch");
  shipmentData: any;
  csv: any[];
  columnHeader = {
    "leg": "Leg",
    "manifest": "Manifest",
    "shipments_lb": "Shipments L/B",
    "packages_lb": "Packages L/B",
    "weight_kg": "Weight Kg",
    "volume_cft": "Volume CFT"
  }
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "leg": "Leg",
    "manifest": "Manifest",
    "shipments_lb": "Shipments L/B",
    "packages_lb": "Packages L/B",
    "weight_kg": "Weight Kg",
    "volume_cft": "Volume CFT"
  }

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  loadingData: any;
  vendordetails: any;
  advancebalance: any;
  // DepartVehicleControls: DepartVehicleControl;
  //#endregion
  constructor(private Route: Router, private dialog: MatDialog, 
    private http: HttpClient, private fb: UntypedFormBuilder, 
    private filter: FilterUtils) 
    {
    // if (data) {
    //   this.tripData = data
    // }
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['shipments'];
      this.vendordetails = this.data['vendordetails'];
      this.advancebalance = this.data['advancebalance'];
      this.autoBindData();
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      this.tableload = false;
    });
    this.IntializeFormControl()
    // this.autoBindData()
  }
  autoBindData() {
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.tripData?.VehicleNo || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.tripData?.RouteandSchedule || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.tripData?.TripID || '')
    this.loadingSheetTableForm.controls['Expected'].setValue(this.tripData?.Expected || '')
    this.loadingSheetTableForm.controls['LoadingLocation'].setValue(localStorage.getItem('Branch') || '')
    this.departvehicleTableForm.controls['VendorType'].setValue(this.vendordetails[0].VendorType)
    this.departvehicleTableForm.controls['Vendor'].setValue(this.vendordetails[0].Vendor)
    this.departvehicleTableForm.controls['Driver'].setValue(this.vendordetails[0].Driver)
    this.departvehicleTableForm.controls['DriverMob'].setValue(this.vendordetails[0].DriverMobile)
    this.departvehicleTableForm.controls['License'].setValue(this.vendordetails[0].LicenseNo)
    this.departvehicleTableForm.controls['Expiry'].setValue(this.vendordetails[0].Expirydate)
    this.advanceTableForm.controls['ContractAmt'].setValue(this.advancebalance[0].ContractAmount)
    this.advanceTableForm.controls['TotalTripAmt'].setValue(this.advancebalance[0].TotalTripAmount)
    this.advanceTableForm.controls['Loading'].setValue(this.advancebalance[0].Othercharges.Loading)
    this.advanceTableForm.controls['Unloading'].setValue(this.advancebalance[0].Othercharges.Unloading)
    this.advanceTableForm.controls['Enroute'].setValue(this.advancebalance[0].Othercharges.Enroute)
    this.advanceTableForm.controls['Misc'].setValue(this.advancebalance[0].Othercharges.Misc)
    this.balanceTableForm.controls['TotalAdv'].setValue(this.advancebalance[0].TotalAdvance)
    this.balanceTableForm.controls['BalanceAmt'].setValue(this.advancebalance[0].BalanceAmount)
    this.balanceTableForm.controls['PaidByCash'].setValue(this.advancebalance[0].AdvancePaid.PaidbyCash)
    this.balanceTableForm.controls['PaidbyBank'].setValue(this.advancebalance[0].AdvancePaid.PaidbyBank)
    this.balanceTableForm.controls['PaidbyFuel'].setValue(this.advancebalance[0].AdvancePaid.PaidbyFuel)
    this.balanceTableForm.controls['PaidbyCard'].setValue(this.advancebalance[0].AdvancePaid.PaidbyCard)
  }
  IntializeFormControl() {
    const loadingControlFormControls = new loadingControl();
    this.jsonControlArray = loadingControlFormControls.getMarkArrivalsertFormControls();
    const DepartVehicleControls = new DepartVehicleControl();
    this.departControlArray = DepartVehicleControls.getDepartVehicleFormControls();
    const AdvanceControls = new AdvanceControl();
    this.advanceControlArray = AdvanceControls.getAdvanceFormControls();
    const BalanceControls = new BalanceControl();
    this.balanceControlArray = BalanceControls.getBalanceFormControls();
    const DepartureControls = new DepartureControl();
    this.departureControlArray = DepartureControls.getDepartureFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'vehicleTypecontrolHandler') {
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
    })
    this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
    this.departvehicleTableForm = formGroupBuilder(this.fb, [this.departControlArray])
    this.advanceTableForm = formGroupBuilder(this.fb, [this.advanceControlArray])
    this.balanceTableForm = formGroupBuilder(this.fb, [this.balanceControlArray])
    this.departureTableForm = formGroupBuilder(this.fb, [this.departureControlArray])
  }
  ngOnInit(): void {
    this.vehicleTypeDropdown();
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
      //let tableArray = this.data['data'];
      //.this.csv = tableArray;
      // console.log(this.csv);
      //this.tableload = false;

    });
    // this.getshipmentData()
  }
  
  getshipmentData() {
    let routeDetail = this.tripData?.RouteandSchedule.split(":")[1].split("-");
    routeDetail = routeDetail.map(str => String.prototype.replace.call(str, ' ', ''));
    this.http.get(this.loadingSheetJsonUrl).subscribe(res => {
      this.shipmentData = res;
      this.csv = this.shipmentData.shipmentData.filter((x) => x.RouteandSchedule == this.tripData.RouteandSchedule);
      this.tableload = false;
    })
  }
  loadingSheetDetails() {
    let loadingSheetDetails = this.loadingSheetData.data[0].find((x) => x.Type_Code == this.loadingSheetTableForm.value?.vehicleType.value || '')
    this.loadingSheetTableForm.controls['CapacityKg'].setValue(loadingSheetDetails?.CapacityKg || '')
    this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(loadingSheetDetails?.CapacityVolumeCFT || '')
    this.loadingSheetTableForm.controls['LoadaddedKg'].setValue(loadingSheetDetails?.LoadaddedKg || '')
    this.loadingSheetTableForm.controls['LoadedKg'].setValue(loadingSheetDetails?.LoadedKg || '')
    this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(loadingSheetDetails?.LoadedvolumeCFT || '')
    this.loadingSheetTableForm.controls['VolumeaddedCFT'].setValue(loadingSheetDetails?.VolumeaddedCFT || '')
    this.loadingSheetTableForm.controls['VolumeUtilization'].setValue(loadingSheetDetails?.VolumeUtilization || '')
    this.loadingSheetTableForm.controls['WeightUtilization'].setValue(loadingSheetDetails?.WeightUtilization || '')
  }
  loadingSheetGenerate() {
    //Check if BcSerialType is "E"
    // If it is "E", set displaybarcode to true
    //Open a modal using the content parameter passed to the function
    const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> = this.dialog.open(LodingSheetGenerateSuccessComponent, {
      width: '100%', // Set the desired width
      data: this.loadingData // Pass the data object
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle the result after the dialog is closed
    });
  }
  groupShipmentsByDestination(data) {
    const groupedShipments = {};
    for (const shipment of data) {
      const destination = shipment.Destination;
      if (!groupedShipments[destination]) {
        groupedShipments[destination] = {
          shipmentCount: 1,
          packageCount: shipment.Packages,
          totalWeight: shipment.Weight,
          totalVolume: shipment.Volume
        };
      } else {
        groupedShipments[destination].shipmentCount++;
        groupedShipments[destination].packageCount += shipment.Packages;
        groupedShipments[destination].totalWeight += shipment.Weight;
        groupedShipments[destination].totalVolume += shipment.Volume;
      }
    }
    return groupedShipments;
  }
  Close() {
    window.history.back();
  } 

}

