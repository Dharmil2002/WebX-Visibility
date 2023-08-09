import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { loadingControl } from "src/assets/FormControls/loadingSheet";
import { LodingSheetGenerateSuccessComponent } from "../../loding-sheet-generate-success/loding-sheet-generate-success.component";
import {
  AdvanceControl,
  BalanceControl,
  DepartVehicleControl,
  DepartureControl,
} from "src/assets/FormControls/departVehicle";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { getVehicleDetailFromApi } from "../../create-loading-sheet/loadingSheetCommon";
import { calculateBalanceAmount, calculateTotal, calculateTotalAdvances, getDriverDetail, getLoadingSheetDetail, updateTracking } from "./depart-common";
import { formatDate } from "src/app/Utility/date/date-utils";
import { constants } from "http2";

@Component({
  selector: "app-depart-vehicle",
  templateUrl: "./depart-vehicle.component.html",
})
export class DepartVehicleComponent implements OnInit {
  loadingJsonUrl = "../../../assets/data/vehicleType.json";
  vendorDetailsUrl = "../../../assets/data/vendorDetails.json";
  shipingDetailsUrl = "../../../assets/data/arrival-dashboard-data.json";
  jsonUrl = "../../../assets/data/departVehicleLoadDetails.json";
  data: [] | any;
  tableload = true;
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; //name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  shipData: any;
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  };
  linkArray = [{ Row: "Shipments", Path: "Operation/LoadingSheetView" }];
  //declaring breadscrum
  breadscrums = [
    {
      title: "Depart Vehicle",
      items: ["Home"],
      active: "Depart Vehicle",
    },
  ];
  menuItems = [];
  toggleArray = [];
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
  menifestTableData: any[];
  columnHeader = {
    leg: "Leg",
    manifest: "Manifest",
    shipments_lb: "Shipments L/B",
    packages_lb: "Packages L/B",
    weight_kg: "Weight Kg",
    volume_cft: "Volume CFT",
  };
  centerAlignedData = ["packages_lb", "weight_kg", "volume_cft"];
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    leg: "Leg",
    manifest: "Manifest",
    shipments_lb: "Shipments L/B",
    packages_lb: "Packages L/B",
    weight_kg: "Weight Kg",
    volume_cft: "Volume CFT",
  };

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  loadingData: any;
  vendordetails: any;
  advancebalance: any;
  CEWBflag: boolean;
  setVehicleType: any[];
  lsDetails: any;
  vehicleDetail: any;
  listDocket=[];
  next: string;
  // DepartVehicleControls: DepartVehicleControl;
  //#endregion
  constructor(
    private Route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private _operationService: OperationService
  ) {
    // if (data) {
    //   this.tripData = data
    // }
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {

      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl();
    this.autoBindData();
    this.fetchShipmentData();
    this.vehicleDetails();
    this.getTripDetail();
    // this.autoBindData()
  }

  autoBindData() {

    // Map of control names to their corresponding data keys
    const loadingSheetFormControlsMap = {
      Route: "RouteandSchedule",
      tripID: "TripID",
      Expected: "Expected",
    };

    // Loop through the control mappings and update form values
    Object.entries(loadingSheetFormControlsMap).forEach(([controlName, dataKey]) => {
      const formControl = this.loadingSheetTableForm.controls[controlName];
      const value = this.tripData?.[dataKey] || "";
      formControl.setValue(value);
    });

    // Set value for the "vehicle" control
    const vehicleNo = {
      name: this.tripData.VehicleNo,
      value: this.tripData.VehicleNo,
    };
    this.loadingSheetTableForm.controls["vehicle"].setValue(vehicleNo);

    // Set value for the "LoadingLocation" control
    const loadingLocationFormControl = this.loadingSheetTableForm.controls["LoadingLocation"];
    const loadingLocationValue = localStorage.getItem("Branch") || "";
    loadingLocationFormControl.setValue(loadingLocationValue);
  }

  vehicleDetails() {
    const reqbody = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "vehicle_detail",
    };
    this._operationService.operationPost("common/getall", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          this.vehicleDetail = res.data.find(
            (x) => x.vehicleNo === this.tripData.VehicleNo
          );
          this.departvehicleTableForm.controls["VendorType"].setValue(
            this.vehicleDetail?.vendorType || ""
          );
          this.departvehicleTableForm.controls["Vendor"].setValue(
            this.vehicleDetail?.vendorName || ""
          );
          this.getDriverDetails();
          this.fetchLoadingSheetDetailFromApi();
          this.loadVehicleDetails();
        }
      },
    });
  }
  getDriverDetails() {
    const reqbody = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "driver_detail",
    };
    this._operationService.operationPost("common/getall", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          const driverDetails = res.data.find(
            (x) => x.vehicleNo === this.tripData.VehicleNo
          );
          this.departvehicleTableForm.controls["Driver"].setValue(
            driverDetails?.driverName || ""
          );
          this.departvehicleTableForm.controls["DriverMob"].setValue(
            driverDetails?.telno || ""
          );
          this.departvehicleTableForm.controls["License"].setValue(
            driverDetails?.licenseNo || ""
          );
          this.departvehicleTableForm.controls["Expiry"].setValue(
            driverDetails?.valdityDt || ""
          );
        }
      },
    });
  }

  IntializeFormControl() {
    const loadingControlFormControls = new loadingControl();
    this.jsonControlArray =
      loadingControlFormControls.getMarkArrivalsertFormControls();
    const DepartVehicleControls = new DepartVehicleControl();
    this.departControlArray =
      DepartVehicleControls.getDepartVehicleFormControls();
    const AdvanceControls = new AdvanceControl();
    this.advanceControlArray = AdvanceControls.getAdvanceFormControls();
    const BalanceControls = new BalanceControl();
    this.balanceControlArray = BalanceControls.getBalanceFormControls();
    const DepartureControls = new DepartureControl();
    this.departureControlArray = DepartureControls.getDepartureFormControls();
    this.loadingSheetTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    this.departvehicleTableForm = formGroupBuilder(this.fb, [
      this.departControlArray,
    ]);
    this.advanceTableForm = formGroupBuilder(this.fb, [
      this.advanceControlArray,
    ]);
    this.balanceTableForm = formGroupBuilder(this.fb, [
      this.balanceControlArray,
    ]);
    this.departureTableForm = formGroupBuilder(this.fb, [
      this.departureControlArray,
    ]);
  }
  ngOnInit(): void { }

  functionCallHandler($event) {
    // console.log("fn handler called", $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

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
    this.loadingData = $event;
  }
  /**
 * Fetches shipment data from the API and updates the boxData and tableload properties.
 */
  fetchShipmentData() {
    // Prepare request payload
    let req = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
    };

    // Send request and handle response
    this._operationService.operationPost("common/getall", req).subscribe({
      next: async (res: any) => {
        // Update shipmentData property with the received data
        this.shipmentData = res.data;
        this.getShipingDetails()
      },
    });
  }
  getShipingDetails() {
    const reqbody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "menifest_detail",
    };
    this._operationService.operationPost("common/getall", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
             
          // Filter menifestDetails based on mfNo and unloading=0
          const filteredMenifestDetails = res.data.filter((manifest) => {
            const matchedShipment = this.shipmentData.find((item) => item.mfNo === manifest.mfNo);
               this.listDocket.push(matchedShipment.docketNumber);
            // Check if there's a matching shipment and unloading is 0
            return matchedShipment && matchedShipment.unloading === 0 && manifest.tripId === this.tripData.TripID
          });
          let menifestList: any = [];
          filteredMenifestDetails.forEach((element) => {
            let json = {
              leg: element.leg,
              manifest: element.mfNo,
              shipments_lb: element.totDkt,
              packages_lb: element.totPkg,
              weight_kg: parseFloat(element?.WeightKg || 0),
              volume_cft: parseFloat(element?.tot_cft || 0),
            };
            menifestList.push(json);
            this.menifestTableData = menifestList;
            this.tableload = false;
            this.docketDetails();

          });
        }
      },
    });

  }
  docketDetails() {
    const reqbody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "loadingSheet_detail",
    };
    this._operationService.operationPost("common/getall", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          this.lsDetails = res.data.find(
            (lsDetails) => lsDetails.tripId === this.tripData.TripID
          );
          // this.vehicleTypeDropdown();

        }
      },
    });
  }
  async loadVehicleDetails() {
    try {
      const vehicleData = await getVehicleDetailFromApi(this.companyCode, this._operationService, this.loadingSheetTableForm.value.vehicle.value);
      this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleData.vehicleType);
      this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(vehicleData.cft);
      this.loadingSheetTableForm.controls['CapacityKg'].setValue(vehicleData.capacity);
    } catch (error) {
    }
  }



  loadingSheetGenerate() {
    //Check if BcSerialType is "E"
    // If it is "E", set displaybarcode to true
    //Open a modal using the content parameter passed to the function
    const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> =
      this.dialog.open(LodingSheetGenerateSuccessComponent, {
        width: "100%", // Set the desired width
        data: this.loadingData, // Pass the data object
      });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
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
          totalVolume: shipment.Volume,
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

    this.loadingSheetTableForm.controls['vehicleType'].setValue(this.loadingSheetTableForm.controls['vehicleType'].value.value);
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.loadingSheetTableForm.controls['vehicle'].value.value);
    const loadingArray = [this.loadingSheetTableForm.value];
    const departArray = [this.departvehicleTableForm.value];
    const advancearray = [this.advanceTableForm.value];
    const balanceArray = [this.balanceTableForm.value];
    const departureArray = [this.departureTableForm.value];

    const mergedArray = [
      ...loadingArray,
      ...departArray,
      ...advancearray,
      ...balanceArray,
      ...departureArray,
    ];
    const mergedData = this.mergeArrays(mergedArray);
    delete mergedData.vehicleTypecontrolHandler;
    mergedData['tripId'] = this.tripData.TripID;
    mergedData['id'] = this.tripData.TripID;
    mergedData['lsno'] = this.lsDetails?.lsno||'';
    mergedData['mfNo'] = this.lsDetails?.mfNo||'';
    this.addDepartData(mergedData);
     this.docketStatus();
  }


  addDepartData(departData) {

    const reqbody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "trip_transaction_history",
      "data": departData
    }
    this._operationService.operationPost('common/create', reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          this.updateTrip();
        }

      }
    })
  }
  updateTrip() {
    const next = getNextLocation(this.tripData.RouteandSchedule.split(":")[1].split("-"), this.orgBranch);
    this.next=next;
    Swal.fire({
      icon: "info",
      title: "Trip Departure",
      text: "Your trip from " + next + " is about to depart.",
      confirmButtonText: "OK",
    });

    let tripDetails = {
      status: "depart",
      nextUpComingLoc: next
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "trip_detail",
      "id": this.tripData.id,
      "updates": {
        ...tripDetails,
      }
    }
    this._operationService.operationPut("common/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Vehicle depart Successfully`,//
            showConfirmButton: true,
          })
          this.goBack(3);
        }
      }
    })
  }
  GenerateCEWB() {
    this.CEWBflag = true;
    const randomNumber =
      "CEW/" +
      this.orgBranch +
      "/" +
      2223 +
      "/" +
      Math.floor(Math.random() * 100000);
    this.departureTableForm.controls["Cewb"].setValue(randomNumber);
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(["/dashboard/GlobeDashboardPage"], {
      queryParams: { tab: tabIndex },
    });
  }
  mergeArrays(data: any[]): any {
    const mergedData = {};

    for (const item of data) {
      Object.assign(mergedData, item);
    }

    return mergedData;
  }
  /**
   * Fetches loading sheet details from the API and updates the form fields.
   */
  async fetchLoadingSheetDetailFromApi() {

    // Fetch loading sheet details
    const loadingSheetDetail = await getLoadingSheetDetail(
      this.companyCode,
      this.tripData.TripID,
      this.tripData.VehicleNo,
      this._operationService
    );
    // Fetch driver details
    const driverDetail = await getDriverDetail(
      this.companyCode,
      this.tripData.VehicleNo,
      this._operationService
    );
    const lsDetail = loadingSheetDetail.length > 1
    ? loadingSheetDetail[loadingSheetDetail.length - 1]
    : (loadingSheetDetail[0] || null);
    // Update departure vehicle form controls with driver details
    if(driverDetail[0]){
    this.departvehicleTableForm.controls['Driver'].setValue(driverDetail[0].driverName || "");
    this.departvehicleTableForm.controls['DriverMob'].setValue(driverDetail[0].telno || "");
    this.departvehicleTableForm.controls['License'].setValue(driverDetail[0].licenseNo || "");
    let convertedDate = driverDetail[0].valdityDt || '';
    convertedDate = convertedDate ? formatDate(convertedDate, 'dd/MM/yyyy') : '';
    this.departvehicleTableForm.controls['Expiry'].setValue(convertedDate);

  }
    // Update loading sheet table form controls with loading sheet details
    if(lsDetail){
    this.loadingSheetTableForm.controls["Capacity"].setValue(
      lsDetail?.capacity || 0
    );
    this.loadingSheetTableForm.controls["CapacityVolumeCFT"].setValue(
      lsDetail?.capacityVolumeCFT || 0
    );
    this.loadingSheetTableForm.controls["LoadaddedKg"].setValue(
      lsDetail?.loadAddedKg || 0
    );
    this.loadingSheetTableForm.controls["LoadedKg"].setValue(
      lsDetail?.loadedKg || 0
    );
    this.loadingSheetTableForm.controls["LoadedvolumeCFT"].setValue(
      lsDetail?.loadedVolumeCft || 0
    );
    this.loadingSheetTableForm.controls["VolumeaddedCFT"].setValue(
      lsDetail?.volumeAddedCFT || 0
    );
    this.loadingSheetTableForm.controls["VolumeUtilization"].setValue(
      lsDetail?.volumeUtilization || 0
    );
    this.loadingSheetTableForm.controls["WeightUtilization"].setValue(
      lsDetail?.WeightUtilization || 0
    );
    }
    // Rest of your code that depends on loadingSheetDetail
  }

  onCalculateTotal(): void {
    // Step 1: Calculate the individual charges and set TotalTripAmt in the advanceTableForm
    calculateTotal(this.advanceTableForm);

    // Step 2: Calculate the total advances and set TotalAdv in the balanceTableForm
    calculateTotalAdvances(this.balanceTableForm);

    // Step 3: Calculate the balance amount as the difference between TotalAdv and TotalTripAmt,
    // and set it in the BalanceAmount control of the balanceTableForm
    const totalTripAmt = parseFloat(this.advanceTableForm.controls['TotalTripAmt'].value) || 0;
    calculateBalanceAmount(this.balanceTableForm, totalTripAmt);
  }
  async getTripDetail() {
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "trip_transaction_history",
      query: {
        id: this.tripData.TripID,
      }
    }
    const resTrip = await this._operationService.operationPost("common/getOne", reqBody).toPromise();
    if (resTrip) {
      const tripDetail = resTrip.data.db.data.trip_transaction_history[0];
      const advanceControls = this.advanceTableForm.controls;
      const balanceControls = this.balanceTableForm.controls;
      const departureControls = this.departureTableForm.controls;

      if (tripDetail) {
        const fieldsToUpdate = [
          'ContractAmt', 'OtherChrge', 'Loading', 'Unloading', 'Enroute',
          'Misc', 'TotalTripAmt', 'PaidByCash', 'PaidbyBank', 'PaidbyFuel',
          'PaidbyCard', 'TotalAdv', 'BalanceAmt'
        ];

        fieldsToUpdate.forEach(field => {
          if (tripDetail.hasOwnProperty(field)) {
            const fieldValue = tripDetail[field] !== null ? tripDetail[field] : '';
            if (advanceControls[field]) {
              advanceControls[field].setValue(fieldValue !== '' ? fieldValue : 0);
            }
            if (balanceControls[field]) {
              balanceControls[field].setValue(fieldValue !== '' ? fieldValue : 0);
            }
            if (departureControls[field]) {
              departureControls[field].setValue(fieldValue !== '' ? fieldValue : '');
            }
          }
        });

      
      }
    }


  }
  docketStatus() {
   this.listDocket.forEach(async element => {
    await updateTracking(this.companyCode,this._operationService,element,this.next)
   });
  }
}
