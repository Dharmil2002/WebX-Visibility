import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { loadingControl } from "src/assets/FormControls/loadingSheet";
import { Router } from "@angular/router";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { LodingSheetGenerateSuccessComponent } from "../loding-sheet-generate-success/loding-sheet-generate-success.component";
import { LoadingSheetViewComponent } from "../loading-sheet-view/loading-sheet-view.component";
import { getVehicleDetailFromApi, updateTracking } from "./loadingSheetCommon";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { setFormControlValue } from "src/app/Utility/commonFunction/setFormValue/setFormValue";
import { getLoadingSheetDetail } from "../depart-vehicle/depart-vehicle/depart-common";
import Swal from "sweetalert2";
import { runningNumber } from "src/app/Utility/date/date-utils";
import { aggregateData, setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { firstValueFrom } from "rxjs";
import { LoadingSheetService } from "src/app/Utility/module/operation/loadingSheet/loadingsheet-service";
import { StorageService } from "src/app/core/service/storage.service";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";

@Component({
  selector: "app-create-loading-sheet",
  templateUrl: "./create-loading-sheet.component.html",
})
/* Business logic separation is pending in this code. 
Currently, all flows are working together without proper separation.
 The separation will be implemented by Dhaval Patel.
  So, no need to worry about it for now.*/
export class CreateLoadingSheetComponent implements OnInit {
  tableload = true;
  addAndEditPath: string;
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; // Name of the CSV file, when data is downloaded. You can also use a function to generate filenames based on dateTime.
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  height = "100vw";
  width = "100vw";
  maxWidth: "232vw";
  menuItems = [
    { label: "count", componentDetails: LoadingSheetViewComponent },
    // Add more menu items as needed
  ];
  // Declaring breadcrumbs
  breadscrums = [
    {
      title: "Create-Loading-Sheet",
      items: ["Loading-Sheet"],
      active: "Loading-Sheet",
    },
  ];
  linkArray = [{ Row: "count", Path: "" }];
  toggleArray = [];
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
  tableData: any[];
  columnHeader = {
    checkBoxRequired: "",
    leg: "Leg",
    count: "Shipments",
    packages: "Packages",
    weightKg: "Weight Kg",
    volumeCFT: "Volume CFT",
  };
  centerAlignedData = ["leg", "packages", "weightKg", "volumeCFT"];
  // Declaring CSV file's header as key and value pair
  headerForCsv = {
    RouteandSchedule: "Leg",
    Shipments: "Shipments",
    Packages: "Packages",
    WeightKg: "Weight Kg",
    VolumeCFT: "Volume CFT",
  };

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };

  isSubmit: boolean = false;
  loadingData: any;
  shippingData: any;
  listDepartueDetail: any;
  getloadingFormData: any;
  legWiseData: any;
  updatedShipment: any[] = [];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  packagesScan: any;
  vehicleNoControlName: any;
  vehicleControlStatus: any;
  loadingSheetNo: any;
  docketApiRes: any;
  cnoteDetails: any;
  userName = localStorage.getItem("Username");
  lsDetails: any;
  NoDocket: boolean;
  departFlag: boolean = false;
  alldocket: any;
  isUpdate: boolean = false;
  vehicleSize:AutoComplete[];
  products:AutoComplete[];
  constructor(
    private Route: Router,
    private _cnoteService: CnoteService,
    private _operationService: OperationService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private storage: StorageService,
    private generalService: GeneralService,
    private loadingSheetService: LoadingSheetService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      // Retrieve tripData and shippingData from the navigation state
      this.tripData =
        this.Route.getCurrentNavigation()?.extras?.state.data?.columnData ||
        this.Route.getCurrentNavigation()?.extras?.state.data;
      this.shippingData =
        this.Route.getCurrentNavigation()?.extras?.state.shipping;

      // Check if tripData meets the condition for navigation
      const routeMap = {
        "Depart Vehicle": "Operation/DepartVehicle",
        "Vehicle Loading": "Operation/VehicleLoading",
      };

      const route = routeMap[this.tripData.Action];

      if (route) {
        this.navigationService.navigateTo(route, this.tripData);
      }
      if (this.tripData.Action == "Update Trip") {
        this.isUpdate = true;
      }

    }

    // Initialize form controls
    this.IntializeFormControl();
    this.generalMaster();
    // Auto-bind data
  
  }
  async generalMaster() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    const product=["Road","Express"];
    this.products = this.products.filter((x) => product.includes(x.name));  
    setGeneralMasterData(this.jsonControlArray,this.products, "transMode");
    const products=this.products.find((x)=>x.name=="Road");
    this.loadingSheetTableForm.controls['transMode'].setValue(products.value);
    this.autoBindData();
  }

  async autoBindData() {
    // Set the value of 'vehicle' form control with tripData's VehicleNo or getloadingFormData's vehicle or an empty string
    //setFormControlValue(this.loadingSheetTableForm.controls['vehicle'], this.tripData?.VehicleNo, this.getloadingFormData?.vehicle, '');

    // Set the value of 'Route' form control with tripData's RouteandSchedule or getloadingFormData's Route or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["Route"],
      this.tripData?.RouteandSchedule,
      this.getloadingFormData?.Route,
      ""
    );

    // Set the value of 'tripID' form control with tripData's TripID or getloadingFormData's TripID or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["tripID"],
      this.tripData?.TripID,
      this.getloadingFormData?.TripID,
      ""
    );
    setFormControlValue(
      this.loadingSheetTableForm.controls["vehicle"],
      { name: this.tripData?.VehicleNo, value: this.tripData?.VehicleNo },
      ""
    );
    setFormControlValue(
      this.loadingSheetTableForm.controls["tripID"],
      this.tripData?.TripID,
      this.getloadingFormData?.TripID,
      ""
    );
    // Set the value of 'Expected' form control with tripData's Expected or getloadingFormData's Expected or an empty string
    setFormControlValue(
      this.loadingSheetTableForm.controls["Expected"],
      this.tripData?.Expected,
      this.getloadingFormData?.Expected,
      ""
    );

    // Set the value of 'LoadingLocation' form control with the value retrieved from localStorage for 'Branch'
    setFormControlValue(
      this.loadingSheetTableForm.controls["LoadingLocation"],
      localStorage.getItem("Branch"),
      ""
    );

    if (this.tripData.Action.replace(" ", "") === 'UpdateTrip') {
      //this.loadingSheetTableForm.controls['VehicleNo'].setValue(this.tripData.VehicleNo);
      this.loadVehicleDetails();
      this.getshipmentData();
      const lsDetail =
        await getLoadingSheetDetail(
          this.companyCode,
          this.tripData.TripID,
          this.tripData.VehicleNo,
          this._operationService
        );
      this.lsDetails = lsDetail[lsDetail.length - 1];
      this.departFlag = true;
      this.getCapacity();
      if (!this.tripData.VehicleNo) {
        this.GetVehicleDropDown();
      }
    } else {

      this.GetVehicleDropDown();
      this.getshipmentData();
    }
  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new loadingControl();

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlArray =
      loadingControlFormControls.getMarkArrivalsertFormControls();

    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.jsonControlArray.forEach((data) => {
      if (data.name === "vehicleTypecontrolHandler") {
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "vehicle") {
        this.vehicleNoControlName = data.name;
        this.vehicleControlStatus = data.additionalData.showNameAndValue;
      }
    });

    // Build the form group using the form controls obtained
    this.loadingSheetTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }

  ngOnInit(): void { }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  IsActiveFuntion($event) {

    // Assign the value of $event to the loadingData property
    this.loadingData = $event;
    if (!this.loadingSheetTableForm.value.vehicle.value) {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
      this.tableData.forEach((x) => {
        x.isSelected = false
      })
      return;
    } else {
      this.getCapacity();
    }
  }

  // Function to retrieve shipment data
  async getshipmentData() {

    if (!this.isShipmentUpdate) {
      let routeDetail =
        this.tripData?.RouteandSchedule.split(":")[1].split("-");
      routeDetail = routeDetail.map((str) =>
        String.prototype.replace.call(str, " ", "")
      );
      // Update route details if shipment is not being updated
    }
    const [orgn, ...nextLocs] = this.tripData?.RouteandSchedule.split(":")[1].split("-");
   
    const res = await this.loadingSheetService.getDocketsForLoadingSheet(nextLocs);
    if (res.data.length > 0) 
    {
      this.shipmentData = res.data.map((x) => {
        x.pKGS = parseInt(x.pKGS || 0);
        x.aCTWT = parseFloat(x.aCTWT || 0);
        x.cHRWT = parseFloat(x.cHRWT || 0);
        x.cFTTOT = parseFloat(x.cFTTOT || 0);
        x.dktCount = 1;
        x.curLoc = x.cLOC;
        x.orgLoc = x.oRGN;
        x.destLoc = x.dEST;
        return x;
      }).filter(f => nextLocs.includes(f.destLoc));
    }

    const gropuColumns = ['curLoc', 'destLoc'];
    const aggregationRules = [
      { outputField: 'count', inputField: 'dktCount', operation: 'sum' },
      { outputField: 'packages', inputField: 'pKGS', operation: 'sum' },
      { outputField: 'weightKg', inputField: 'aCTWT', operation: 'sum' },
      { outputField: 'volumeCFT', inputField: 'cFTTOT', operation: 'sum' },
    ];
    const fixedColumn = [
      { field: 'leg', calculate: item => { return `${item.curLoc}-${item.destLoc}` } }
    ];

    if(this.shipmentData && this.shipmentData.length > 0) {
      let aggData = aggregateData(this.shipmentData, gropuColumns, aggregationRules, fixedColumn, true);
      let dockets = [];
      aggData = aggData.map((l: any) => {
        let docs = this.shipmentData.filter(f => f.curLoc == l.curLoc && f.destLoc == l.destLoc);
        //l.Dockets = docs;
        dockets.push(...docs);
        return l;
      });
   

      //Here i user cnoteDetails varible to used in updateDocketDetails() method
      this._cnoteService.setShipingData(dockets);
      this.alldocket = dockets;
      this.cnoteDetails = dockets;
      const groupedShipments = aggData;
      if (groupedShipments.length > 0) {
        this.tableload = false;
      } else {
        this.departFlag = true;
      }
      groupedShipments.forEach(item => {
        if (item['items'] && Array.isArray(item['items'])) {
          item['items'].forEach(subItem => {
            subItem.isSelected = true;
          });
        }
      });
      this.tableData = groupedShipments
    }
  }
  ngOnDestroy(): void {
    this._cnoteService.setShipingData([]);
    // Perform cleanup, unsubscribe from observables, etc.
  }
  async loadingSheetGenerate() {
    const shipment = this.tableData.filter((x) => x.isSelected);
    if (shipment.length == 0) {
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
      return false;
    }
    const lsForm = this.loadingSheetTableForm.value;
    if (this.isUpdate && this.tripData.TripID) {
      const tripData = await this.loadingSheetService.updatetripFieldMapping(lsForm, shipment);
      const lsDetails = await this.loadingSheetService.updateLoadingSheet(tripData);
      this.tableData.forEach((ls) => {
        const matchingDetail = lsDetails.data.find((x) => x.leg === ls.leg);
        // Check if a matching detail was found
        if (matchingDetail) {
          // If found, update the LoadingSheet and Action for the current ls
          ls.LoadingSheet = matchingDetail.lSNO;
          ls.Action = "Print";
        }
      });
    }
    else {
      let lsData=lsForm
      lsData['transMode'] = this.products.find((x) => x.value == lsForm.transMode)?.value ?? '';
      lsData['transModeName'] = this.products.find((x) => x.name == "Road")?.name ?? '';
      const tripData = await this.loadingSheetService.tripFieldMapping(lsData, shipment);
      const lsDetails = await this.loadingSheetService.createLoadingSheet(tripData);
      this.tableData.forEach((ls) => {
        const matchingDetail = lsDetails.data.find((x) => x.leg === ls.leg);
        // Check if a matching detail was found
        if (matchingDetail) {
          // If found, update the LoadingSheet and Action for the current ls
          ls.LoadingSheet = matchingDetail.lSNO;
          ls.Action = "Print";
        }
      });

    }
    const data = this.tableData.filter((x) => x.LoadingSheet != "")
    const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> =
      this.dialog.open(LodingSheetGenerateSuccessComponent, {
        width: "100%", // Set the desired width
        data: this.tableData.filter((x) => x.hasOwnProperty('LoadingSheet')), // Pass the data object
      });

    dialogRef.afterClosed().subscribe((result) => {
      this.goBack('Departures');
      // Handle the result after the dialog is closed
    });
    // this.isSubmit = true;
    // const loadedData = this.tableData.filter((x) => x.isSelected)
    // this.loadingData = loadedData;
    // if (!this.loadingSheetTableForm.value.vehicle) {
    //   SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    // } else {
    //   if (loadedData) {
    //     loadedData.forEach(obj => {
    //       let randomNumber = "LS/" + this.orgBranch + "/" + runningNumber();
    //       obj.LoadingSheet = randomNumber;
    //       obj.Action = "Print";
    //     });
    //     this.addTripData();

    //   } else {
    //     SwalerrorMessage("error", "Please Select Any one Record", "", true);
    //   }
    // }
  }

  updateLoadingData(event) {
    if (event) {
      let totalPackages = 0, totalWeightKg = 0, totalVolumeCFT = 0;
      // Calculate totals in a single iteration
      event.forEach(item => {
        totalPackages += item.pKGS;
        totalWeightKg += item.aCTWT;
        totalVolumeCFT += item.cFTTOT;
      });
      this.tableData.forEach(row => {
        if (row.leg.trim() === event[0].leg.trim()) {
          row.count = event.length;
          row.weightKg = totalWeightKg;
          row.volumeCFT = totalVolumeCFT;
          row.packages = totalPackages;

          // Update isSelected based on event data
          row.items.forEach(detail => {
            detail.isSelected = event.some(e => e.dKTNO === detail.dKTNO);
          });
        }
      });
    }
    this.getCapacity();
  }


  // get vehicleNo
  GetVehicleDropDown() {
    const vehRequest = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { status: "Available", currentLocation: this.storage.branch }
    };

    // Fetch data from the JSON endpoint
    this._operationService
      .operationMongoPost("generic/get", vehRequest)
      .subscribe((res) => {
        if (res) {

          let vehicleDetails = res.data.map((x) => {
            return { name: x.vehNo, value: x.vehNo };
          });

          this.filter.Filter(
            this.jsonControlArray,
            this.loadingSheetTableForm,
            vehicleDetails,
            this.vehicleNoControlName,
            this.vehicleControlStatus
          );
        }
      });
  }

  //Add tripData
  async addTripData() {
    if (this.loadingSheetTableForm.controls["tripID"].value === 'System Generated' || !this.loadingSheetTableForm.controls["tripID"].value) {
      const randomNumber =
        "TH/" +
        this.orgBranch +
        "/" +
        runningNumber();

      this.loadingSheetTableForm.controls["tripID"].setValue(randomNumber);
      // Generate and set a random tripID if not already set
    }
    let tripDetails = {
      startTime: new Date(),
      vehicleNo: this.loadingSheetTableForm.value.vehicle.value,
      tripId: this.loadingSheetTableForm.value.tripID,
      status: "Vehicle Loading",
      updateBy: this.userName,
      updateDate: new Date().toISOString()
    };
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "trip_detail",
      filter: { _id: this.tripData.id },
      update: {
        ...tripDetails,
      },
    };
    try {
      // Await the API call's response before proceeding
      const res = await this._operationService.operationMongoPut("generic/update", reqBody).toPromise();
      if (res) {
        // If response is successful, call the next function
        await this.getDetailsByLeg();
      }
    } catch (error) {
      // Handle any errors that might occur during the API call
      console.error('Error occurred during the API call:', error);
    }
  }
  async getDetailsByLeg() {
    for (const leg of this.loadingData) {
      const [org_loc, destination] = leg.leg.split("-").map(part => part.trim());

      const matchingShipments = this.cnoteDetails.filter(
        shipment =>
          shipment.orgLoc === org_loc &&
          shipment.destination.split(":")[1].trim() === destination
      );

      await this.addLsDetails(leg);

      if (matchingShipments.length > 0) {
        const updatePromises = matchingShipments.map(matchingShipment =>
          this.updateDocketDetails(matchingShipment.docketNumber, leg.LoadingSheet)
        );
        await Promise.all(updatePromises);
      }
    }
    this.isSubmit = false;
    // Add your message here
    const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> =
      this.dialog.open(LodingSheetGenerateSuccessComponent, {
        width: "100%", // Set the desired width
        data: this.loadingData, // Pass the data object
      });

    dialogRef.afterClosed().subscribe((result) => {
      this.goBack('Departures');
      // Handle the result after the dialog is closed
    });
  }

  async updateDocketDetails(docket, lsNo) {
    let loadingSheetData = {
      lsNo: lsNo
    };
    const trackingDocket = {
      lsNo: lsNo,
      tripId: this.loadingSheetTableForm.value.tripID,
      vehNo: this.loadingSheetTableForm.controls["vehicle"].value?.value || "",
      route: this.tripData?.RouteandSchedule || "",
      dktNo: docket
    };

    try {
      await Promise.all([
        await updateTracking(this.companyCode, this._operationService, trackingDocket),
        await this.updateOperationService(docket, loadingSheetData)
      ]);
    } catch (error) {
      console.error('Error occurred during the API call:', error);
    }
  }
  async addLsDetails(leg) {
    const lsDetails = {
      _id: leg.LoadingSheet,
      lsno: leg.LoadingSheet,
      leg: leg.leg,
      vehno: this.loadingSheetTableForm.value.vehicle.value,
      tripId: this.loadingSheetTableForm.value?.tripID,
      location: this.orgBranch,
      pacakges: leg.packages,
      weightKg: leg.weightKg,
      volumeCFT: leg.volumeCFT,
      entryBy: this.userName,
      loadedKg: parseFloat(this.loadingSheetTableForm.value.LoadedKg),
      loadedVolumeCft: parseFloat(this.loadingSheetTableForm.value.LoadedvolumeCFT),
      loadAddedKg: parseFloat(this.loadingSheetTableForm.value.LoadaddedKg),
      WeightUtilization: parseFloat(this.loadingSheetTableForm.value.WeightUtilization),
      volumeUtilization: parseFloat(this.loadingSheetTableForm.value.VolumeUtilization),
      capacity: this.loadingSheetTableForm.value?.Capacity || 0,
      capacityVolumeCFT: this.loadingSheetTableForm.value?.CapacityVolumeCFT || 0,
      volumeAddedCFT: this.loadingSheetTableForm.value?.VolumeaddedCFT || 0,
      entryDate: new Date().toISOString()
    };
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "loadingSheet_detail",
      data: lsDetails,
    };
    try {
      const res = await this._operationService.operationMongoPost("generic/create", reqBody).toPromise();
      if (res) {
        // Perform any necessary actions after the API call
      }
    } catch (error) {
      console.error('Error occurred during the API call:', error);
    }
  }
  updateVehicleStatus() {

    const vehicleDetails = {
      status: "In-Transit",
      tripId: this.loadingSheetTableForm.value?.tripID,
      route: this.tripData?.RouteandSchedule
    };
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { _id: this.loadingSheetTableForm.value.vehicle.value },
      update: {
        ...vehicleDetails,
      },
    };
    this._operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {

        }
      },
    });
  }
  async loadVehicleDetails() {
    try {
      const vehicleData = await getVehicleDetailFromApi(this.companyCode, this._operationService, this.loadingSheetTableForm.value.vehicle.value);
      this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleData.vehicleType);
      this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(vehicleData.vehicleTypeCode);
      this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(vehicleData.cft);
      this.loadingSheetTableForm.controls['Capacity'].setValue(vehicleData.capacity);
    } catch (error) {
    }
  }
  goBack(tabIndex: string): void {
    this.navigationService.navigateTotab(
      tabIndex,
      "/dashboard/Index"
    );
  }

  getCapacity() {
    // Check if this.loadingData is empty
    // Set all values to 0
    this.loadingSheetTableForm.controls['LoadedKg'].setValue(0);
    this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(0);
    this.loadingSheetTableForm.controls['LoadaddedKg'].setValue(0);
    this.loadingSheetTableForm.controls['VolumeaddedCFT'].setValue(0);
    this.loadingSheetTableForm.controls['WeightUtilization'].setValue(0);
    this.loadingSheetTableForm.controls['VolumeUtilization'].setValue(0);
    if (this.lsDetails) {
      this.loadingSheetTableForm.controls['LoadedKg'].setValue(this.lsDetails?.loadedKg || 0);
      this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(this.lsDetails?.loadedVolumeCft || 0);
    }
    // Calculate the previously loaded values from the form
    let loadedKgInput = parseInt(this.loadingSheetTableForm.value?.LoadedKg || 0);
    let loadedCftInput = parseInt(this.loadingSheetTableForm.value?.LoadedvolumeCFT || 0);

    // Initialize these variables to zero
    let loadAddedKg = 0;
    let volAddedCft = 0;

    const processedLegs = new Set();

    this.tableData.forEach(element => {
      if (element?.isSelected) {
        // Check if the leg has been processed already
        if (!processedLegs.has(element?.leg)) {
          const weightKg = parseInt(element?.weightKg) || 0;
          const volumeCFT = parseInt(element?.volumeCFT) || 0;

          loadAddedKg += isNaN(weightKg) ? 0 : weightKg;
          volAddedCft += isNaN(volumeCFT) ? 0 : volumeCFT;

          // Mark the leg as processed
          processedLegs.add(element?.leg);
        }
      }
    });

    // Calculate the total loaded values, including previously loaded values
    loadedKgInput += loadAddedKg;
    loadedCftInput += volAddedCft;

    // Set NaN values to 0
    loadedKgInput = isNaN(loadedKgInput) ? 0 : loadedKgInput;
    loadedCftInput = isNaN(loadedCftInput) ? 0 : loadedCftInput;

    let capacityTons = parseFloat(this.loadingSheetTableForm.controls['Capacity'].value); // Get the capacity value in tons
    let loadedTons = loadedKgInput / 1000;
    let percentage = (loadedTons * 100) / capacityTons;
    // Update the form controls with the calculated values
    this.loadingSheetTableForm.controls['LoadaddedKg'].setValue(isNaN(loadAddedKg) ? 0 : loadAddedKg);
    this.loadingSheetTableForm.controls['VolumeaddedCFT'].setValue(isNaN(volAddedCft) ? 0 : volAddedCft);
    this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(isNaN(loadedCftInput) ? 0 : loadedCftInput);
    this.loadingSheetTableForm.controls['LoadedKg'].setValue(isNaN(loadedKgInput) ? 0 : loadedKgInput);
    this.loadingSheetTableForm.controls['WeightUtilization'].setValue(isNaN(percentage) ? 0 : percentage.toFixed(2));
    const volumeUtilization = loadedCftInput * 100 / parseFloat(this.loadingSheetTableForm.controls['CapacityVolumeCFT'].value);
    this.loadingSheetTableForm.controls['VolumeUtilization'].setValue(isNaN(volumeUtilization) ? 0 : volumeUtilization.toFixed(2));
    if (percentage > 100 || volumeUtilization > 100) {
      let errorMessage = "Capacity has been exceeded.";

      if (volumeUtilization > 100) {
        errorMessage = "Cubic feet volume is greater than vehicle volume.";
      }

      Swal.fire({
        icon: "error",
        title: "Capacity Exceeded",
        text: errorMessage,
        showConfirmButton: true,
      });
      this.loadingData.forEach((loadingItem) => {
        this.tableData = this.tableData.map((tableItem) => {
          if (loadingItem.leg === tableItem.leg) {
            return { ...tableItem, isSelected: false };
          }
          return tableItem;
        });
      });


    }


  }
  async departVehicle() {
    const vehicleValue = this.loadingSheetTableForm.controls["vehicle"].value.value;
    if (vehicleValue) {
      try {
        if (this.isUpdate) {
          const lsForm = this.loadingSheetTableForm.value;
          await this.loadingSheetService.departUpdate(lsForm);
        }
        else {
          const lsForm = this.loadingSheetTableForm.value;
          const departField = await this.loadingSheetService.departVehicle(lsForm);
          await this.loadingSheetService.depart(departField);
        }
        Swal.fire({
          icon: "info",
          title: "Departure",
          text: "Vehicle is ready to depart",
          showConfirmButton: true,
        });

        this.goBack('Departures');
      } catch (error) {
        console.error('Error occurred during the API call:', error);
      }
    } else {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    }
  }
  async updateOperationService(docket, loadingSheetData) {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "docket",
      filter: {
        docketNumber: docket,
      },
      update: {
        ...loadingSheetData
      }
    };

    try {
      const res = await this._operationService.operationMongoPut("generic/update", reqBody).toPromise();
      if (res) {
        await this.updateVehicleStatus();
      }
    } catch (error) {
      console.error('Error occurred during the API call:', error);
    }
  }


}
