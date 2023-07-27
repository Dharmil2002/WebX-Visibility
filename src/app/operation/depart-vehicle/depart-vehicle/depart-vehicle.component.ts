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
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";

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
  // DepartVehicleControls: DepartVehicleControl;
  //#endregion
  constructor(
    private Route: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private CnoteService: CnoteService,
    private _operationService: OperationService
  ) {
    // if (data) {
    //   this.tripData = data
    // }
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
  
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl();
    this.getDepartDetails();
    this.getShipingDetails();
    // this.autoBindData()
  }
  getDepartDetails() {
    this.http.get(this.vendorDetailsUrl).subscribe((res) => {
      this.data = res;
      this.vendordetails = this.data["data"].filter(
        (x) => x.vehicleNo == this.tripData?.VehicleNo
      );
      //   let tableArray = this.data['shipments'];
      // this.advancebalance = this.data['advancebalance'];
      this.autoBindData();
      // const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      // this.csv = newArray;
      //this.tableload = false;
    });
  }

  autoBindData() {
    const loadingSheetFormControlsMap = {
      Route: "RouteandSchedule",
      tripID: "TripID",
      Expected: "Expected",
    };

    const departVehicleFormControlsMap = {
      VendorType: "VendorType",
      Vendor: "Vendor",
      Driver: "Driver",
      DriverMob: "DriverMobile",
      License: "LicenseNo",
      Expiry: "Expirydate",
    };

    Object.entries(loadingSheetFormControlsMap).forEach(
      ([controlName, dataKey]) => {
        const formControl = this.loadingSheetTableForm.controls[controlName];
        const value = this.tripData?.[dataKey] || "";
        formControl.setValue(value);
      }
    );
    const vehicleNo = {
      name: this.tripData.VehicleNo,
      value: this.tripData.VehicleNo,
    };
    this.loadingSheetTableForm.controls["vehicle"].setValue(vehicleNo);

    Object.entries(departVehicleFormControlsMap).forEach(
      ([controlName, dataKey]) => {
        const formControl = this.departvehicleTableForm.controls[controlName];
        const value = this.vendordetails[0]?.[dataKey] || "";
        formControl.setValue(value);
      }
    );

    // Set value for LoadingLocation separately
    const loadingLocationFormControl =
      this.loadingSheetTableForm.controls["LoadingLocation"];
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
    this.jsonControlArray.forEach((data) => {
      if (data.name === "vehicleTypecontrolHandler") {
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
    });
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
  ngOnInit(): void {}
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
  getShipingDetails() {
    const reqbody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "menifest_detail",
    };
    this._operationService.operationPost("common/getall", reqbody).subscribe({
      next: (res: any) => {
        if (res) {
          const menifestDetails = res.data.filter(
            (mfDetail) => mfDetail.tripId === this.tripData.TripID
          );
          let menifestList: any = [];
          menifestDetails.forEach((element) => {
            let json = {
              leg: element.leg,
              manifest: element.mfNo,
              shipments_lb: element.totDkt,
              packages_lb: element.totPkg,
              weight_kg: element.weight_kg,
              volume_cft: element.tot_cft,
            };
            menifestList.push(json);
            this.menifestTableData = menifestList;
            this.tableload = false;
            this.docketDetails();
            this.vehicleDetails();
          });
        }
      },
    });
    // let MeniFestDetails =this.CnoteService.getMeniFestDetails();
    // let menifestList:any=[]
    // MeniFestDetails.forEach(element => {
    //   let json={
    //       leg:element.Leg,
    //       manifest: element.MFNumber,
    //       shipments_lb: element.ShipmentsLoadedBooked,
    //       packages_lb:element.PackagesLoadedBooked,
    //       weight_kg:element.WeightKg,
    //       volume_cft:element.VolumeCFT
    //   }
    //   menifestList.push(json);
    //   this.csv=menifestList;
    //   this.tableload=false;
    // });
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
          this.vehicleTypeDropdown();
        }
      },
    });
  }
  vehicleTypeDropdown() {
    this.http.get(this.loadingJsonUrl).subscribe((res) => {
      this.loadingSheetData = res;
      let vehicleType: any[] = [];
      if (this.lsDetails) {
        let json = {
          name: this.lsDetails.vehType,
          value: this.lsDetails.vehType,
        };
        vehicleType.push(json);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.loadingSheetTableForm,
        vehicleType,
        this.vehicleType,
        this.vehicleTypeStatus
      );
      let vehicleTypeDetails = this.loadingSheetData.data[0].filter(
        (x) => x.Type_Name === this.lsDetails.vehType
      );
      this.setVehicleType = vehicleType.filter(
        (x) => x.value === this.lsDetails.vehType
      );
      this.autofillVehicleData(vehicleTypeDetails);
    });
    // this.getshipmentData()
  }
  autofillVehicleData(vehicleTypeDetails) {

    if (vehicleTypeDetails) {
      this.loadingSheetTableForm.controls["vehicleType"].setValue(
        this.setVehicleType[0]
      );
      this.loadingSheetTableForm.controls["CapacityKg"].setValue(
        vehicleTypeDetails[0]?.CapacityKg || ""
      );
      this.loadingSheetTableForm.controls["CapacityVolumeCFT"].setValue(
        vehicleTypeDetails[0]?.CapacityVolumeCFT || ""
      );
      this.loadingSheetTableForm.controls["LoadedKg"].setValue(
        vehicleTypeDetails[0]?.LoadedKg || ""
      );
      this.loadingSheetTableForm.controls["LoadedvolumeCFT"].setValue(
        vehicleTypeDetails[0]?.LoadedvolumeCFT || ""
      );
      this.loadingSheetTableForm.controls["LoadaddedKg"].setValue(
        vehicleTypeDetails[0]?.LoadaddedKg || ""
      );
      this.loadingSheetTableForm.controls["VolumeaddedCFT"].setValue(
        vehicleTypeDetails[0]?.VolumeaddedCFT || ""
      );
      this.loadingSheetTableForm.controls["WeightUtilization"].setValue(
        vehicleTypeDetails[0]?.WeightUtilization || ""
      );
      this.loadingSheetTableForm.controls["VolumeUtilization"].setValue(
        vehicleTypeDetails[0]?.VolumeUtilization || ""
      );

      this.CnoteService.setData(this.loadingSheetTableForm.value);
    }
  }

  // getshipmentData() {
  //   let routeDetail = this.tripData?.RouteandSchedule.split(":")[1].split("-");
  //   routeDetail = routeDetail.map(str => String.prototype.replace.call(str, ' ', ''));
  //   this.http.get(this.loadingSheetJsonUrl).subscribe(res => {
  //     this.shipmentData = res;
  //     this.csv = this.shipmentData.shipmentData.filter((x) => x.RouteandSchedule == this.tripData.RouteandSchedule);
  //     this.tableload = false;
  //   })
  // }
  loadingSheetDetails() {
    let loadingSheetDetails = this.loadingSheetData.data[0].find(
      (x) =>
        x.Type_Code == this.loadingSheetTableForm.value?.vehicleType.value || ""
    );
    this.loadingSheetTableForm.controls["CapacityKg"].setValue(
      loadingSheetDetails?.CapacityKg || ""
    );
    this.loadingSheetTableForm.controls["CapacityVolumeCFT"].setValue(
      loadingSheetDetails?.CapacityVolumeCFT || ""
    );
    this.loadingSheetTableForm.controls["LoadaddedKg"].setValue(
      loadingSheetDetails?.LoadaddedKg || ""
    );
    this.loadingSheetTableForm.controls["LoadedKg"].setValue(
      loadingSheetDetails?.LoadedKg || ""
    );
    this.loadingSheetTableForm.controls["LoadedvolumeCFT"].setValue(
      loadingSheetDetails?.LoadedvolumeCFT || ""
    );
    this.loadingSheetTableForm.controls["VolumeaddedCFT"].setValue(
      loadingSheetDetails?.VolumeaddedCFT || ""
    );
    this.loadingSheetTableForm.controls["VolumeUtilization"].setValue(
      loadingSheetDetails?.VolumeUtilization || ""
    );
    this.loadingSheetTableForm.controls["WeightUtilization"].setValue(
      loadingSheetDetails?.WeightUtilization || ""
    );
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
    mergedData['tripId']=this.tripData.TripID;
    mergedData['id']=this.tripData.TripID;
    mergedData['lsno']= this.lsDetails.lsno;
    mergedData['mfNo']= this.lsDetails.mfNo;
    this.addDepartData(mergedData);
  }

  addDepartData(departData) {
    const reqbody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "trip_transaction_history",
      "data": departData
    }  
    this._operationService.operationPost('common/create',reqbody).subscribe({next:(res:any)=>{
      if(res){
        this.updateTrip();
      }
      
    }})
  }
  updateTrip() {
    const next = getNextLocation(this.tripData.RouteandSchedule.split(":")[1].split("-"),this.orgBranch);
    let tripDetails = {
      status:"depart",
      nextUpComingLoc:next
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "trip_detail",
      "id":this.tripData.id,
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
}
