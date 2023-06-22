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
import { LoadingSheetViewComponent } from '../loading-sheet-view/loading-sheet-view.component';
import { transform } from './loadingSheetCommon';

@Component({
  selector: 'app-create-loading-sheet',
  templateUrl: './create-loading-sheet.component.html'
})
export class CreateLoadingSheetComponent implements OnInit {
  departureJsonUrl = '../../../assets/data/departureDetails.json'
  loadingJsonUrl = '../../../assets/data/vehicleType.json'
  loadingSheetJsonUrl = '../../../assets/data/shipmentDetails.json'
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
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
  height='100vw';
  width='100vw';
  maxWidth:'232vw'
  menuItems = [
    { label: 'Shipment', componentDetails: LoadingSheetViewComponent},
    // Add more menu items as needed
  ];
  //declaring breadscrum
  breadscrums = [
    {
      title: "Create-Loading-Sheet",
      items: ["Loading-Sheet"],
      active: "Loading-Sheet"
    }
  ]
  linkArray = [
    { Row: 'Shipment', Path: '' }
  ]
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
  legWiseData: any;
  //#endregion


  constructor(private Route: Router, private CnoteService: CnoteService, private dialog: MatDialog, private http: HttpClient, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    // if (data) {
    //   this.tripData = data
    // }
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data?.columnData || this.Route.getCurrentNavigation()?.extras?.state.data;
      this.shippingData = this.Route.getCurrentNavigation()?.extras?.state.shipping;
      if(this.tripData){
      if(this.tripData.Action=="Vehicle Loading"){
        this.Route.navigate(['Operation/VehicleLoading'], {
          state: {
            data: this.tripData,
          },
        });
      } 
      if(this.tripData.Action=="DEPART VEHICLE"){
        this.Route.navigate(['Operation/DepartVehicle'], {
          state: {
            data: this.tripData,
          },
        });
      }
    }
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
        this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleTypeDetails)
        this.vehicleTypeDataAutofill()
      } else {
        let vehicleDropValue={
          name:this.getloadingFormData?.vehicleType.name,
          value:this.getloadingFormData?.vehicleType.value
        }
        this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleDropValue)
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
    this.http.get(this.jsonUrl).subscribe(res => {
      let filterData:any[]= []
      let packagesData:any[]=[]
      let combinedData:any[]=[]
      if (!this.isShipmentUpdate) {
        this.shipmentData = res;
        filterData = this.shipmentData.shippingData.filter(
          (x) => x.routes.trim() === this.tripData.RouteandSchedule.trim()
        );
        
        let routeData = transform(this.tripData.RouteandSchedule, this.orgBranch)
        let CurrectLeg = routeData.split("-").splice(1);

        this.legWiseData = this.shipmentData.shippingData.filter((x) => {
          return x.Origin.trim() === this.orgBranch && x.routes.trim() === this.tripData.RouteandSchedule.trim() && CurrectLeg.includes(x.Destination);
        });
        packagesData = this.shipmentData.packagesData.filter((x) =>
          filterData.some((shipment) => shipment.Shipment === x.Shipment)
        );
        
         combinedData = filterData.map((filterItem) => {
          const packageItem = packagesData.find(
            (packageItem) => packageItem.Shipment === filterItem.Shipment
          );
        
          return {
            ...filterItem,
            ...packageItem
          };
        });
        
        this.extraData = filterData;

      }
      else {
        filterData = this.shippingData
        this.getDepartueDetail(this.shippingData[0].route)
        this.extraData = filterData;

      }
      const groupedData = {};

      // Group shipments by route
      combinedData.forEach(shipment => {
        const { Leg, Packages, KgWeight, CftVolume } = shipment;

        if (!groupedData[Leg]) {
          // If the route doesn't exist in groupedData, initialize it
          groupedData[Leg] = {
            Shipment: 0,
            lag: Leg,
            Packages: 0,
            WeightKg: 0,
            VolumeCFT: 0,
          };
        }

        // Increment the count of shipments and update the packages and weight
        groupedData[Leg].Shipment++;
        groupedData[Leg].Packages += Packages;
        groupedData[Leg].WeightKg += KgWeight;
        groupedData[Leg].VolumeCFT += CftVolume;
      });

      // Convert the grouped data to an array
      let groupedShipments = Object.values(groupedData);

      this.csv = groupedShipments
      this.tableload = false;
    })
  }
  vehicleTypeDataAutofill() {
    //let routeRlocation = getArrayAfterMatch(ruteHlocation, this.orgBranch);
    if(!this.loadingSheetTableForm.controls['tripID'].value){
    const randomNumber = "TH/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
    this.loadingSheetTableForm.controls['tripID'].setValue(randomNumber);
    }
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
    if(!this.loadingSheetTableForm.value.vehicle){
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    }
    else{
    if (this.loadingData) {
      let unmatchedRecords = this.loadingData.filter((record) => {
        return this.legWiseData.some((item) => item.Leg !== record.lag);
      });
      // Check if BcSerialType is "E"
      // If it is "E", set displaybarcode to true
      // Open a modal using the content parameter passed to the function
     
     if(unmatchedRecords.length<=0){
      const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> = this.dialog.open(LodingSheetGenerateSuccessComponent, {
        width: '100%', // Set the desired width
        data: this.loadingData // Pass the data object
      });

      dialogRef.afterClosed().subscribe(result => {
        let lsData= [this.tripData]
        lsData.forEach((x)=>{
        x.VehicleNo=this.loadingSheetTableForm.value.vehicle,
        x.TripID=this.loadingSheetTableForm.value.tripID,
        x.loadingSheetNo=result[0].LoadingSheet,
        x.Action="Vehicle Loading"
       })
       this.CnoteService.setLsData(lsData);
       this.goBack(2);
        // Handle the result after the dialog is closed
      });
    }else{
      SwalerrorMessage("error", "Please Select Only For Your Leg", "", true);
    }
    }
    else {
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
    }
  }
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}
