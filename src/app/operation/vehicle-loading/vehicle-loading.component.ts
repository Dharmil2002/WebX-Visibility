import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { vehicleLoadingControl } from '../../../assets/FormControls/vehicleloading';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleUpdateUploadComponent } from '../vehicle-update-upload/vehicle-update-upload.component';
import { ViewPrintComponent } from '../view-print/view-print.component';
@Component({
  selector: 'app-vehicle-loading',
  templateUrl: './vehicle-loading.component.html'
})
export class VehicleLoadingComponent implements OnInit {
  vehicleLoadingTableForm: UntypedFormGroup;
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
  tripData: any;
  jsonControlArray: any;
  orgBranch: string = localStorage.getItem("Branch");
  //declaring breadscrum
  breadscrums = [
    {
      title: "vehicle-loading",
      items: ["Loading-Sheet"],
      active: "vehicle-loading"
    }
  ]
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  columnHeader = {
    "LoadingSheet": "Loading Sheet",
    "Manifest": "Manifest",
    "Leg": "Leg",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "ShipmentsLoaded": "ShipmentsLoaded",
    "PackagesLoaded": "PackagesLoaded",
    "Pending": "Pending",
    "Action": "Action",
    "printPending": "Print",
  };
  centerAlignedData = ['Shipments', 'Packages', 'ShipmentsLoaded', 'PackagesLoaded', 'Pending'];

  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "LoadingSheet": "Loading Sheet",
    "Manifest": "Manifest",
    "Leg": "Leg",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "ShipmentsLoaded": "ShipmentsLoaded",
    "PackagesLoaded": "PackagesLoaded",
    "Pending": "Pending",
  }
  toggleArray = []
  linkArray = [
    { Row: 'Action', Path: '' },
    { Row: 'printPending', Path: '' },
  ]
  menuItems = [
    { label: 'Load Vehicle', componentDetails: VehicleUpdateUploadComponent, function: "GeneralMultipleView" },
    { label: 'printPending', componentDetails: ViewPrintComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  csv: any;
  data: Object;
  tableload: boolean = true;
  constructor(private Route: Router, private CnoteService: CnoteService, private http: HttpClient, private fb: UntypedFormBuilder) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
      console.log(this.tripData);
    }
    this.IntializeFormControl();
  }
  IntializeFormControl() {
    const vehicleLoadingControls = new vehicleLoadingControl();
    this.jsonControlArray = vehicleLoadingControls.getvehiceLoadingFormControls();
    this.vehicleLoadingTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  ngOnInit(): void {
    this.autofillvehicleData()
  }
  autofillvehicleData() {
    this.vehicleLoadingTableForm.controls['Vehicle'].setValue(this.tripData?.VehicleNo || '');
    this.vehicleLoadingTableForm.controls['Route'].setValue(this.tripData?.RouteandSchedule || '')
    this.vehicleLoadingTableForm.controls['TripID'].setValue(this.tripData?.TripID || '')
    this.vehicleLoadingTableForm.controls['LoadingLocation'].setValue(this.orgBranch || '')
    this.getLoadingSheetData();
  }
  getLoadingSheetData() {

    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let loadingSheetData = this.CnoteService.getVehicleLoadingSheetData(); // Call the function to get the actual data

      // Rest of the code...
      let dataLoading: any[] = []
      if (loadingSheetData) {
        loadingSheetData.forEach((element: any) => { // Specify the type of 'element' as 'any'
          let json = {
            LoadingSheet: element?.LoadingSheet || '',
            Manifest: '',
            Leg: element?.lag || '',
            Shipments: element?.Shipment || '',
            Packages: element?.Packages || '',
            ShipmentsLoaded: 0,
            PackagesLoaded: 0,
            Pending: element?.Shipment || '',
            Action: 'Load Vehicle',
            printPending: 'print'
          };
          dataLoading.push(json);
        });
      }
      this.tableload = false;
      this.csv = dataLoading;
      this.CnoteService.setvehicelodingData(this.tripData)
    })
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
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}
