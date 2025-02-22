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
import { LoadingSheetService } from "src/app/Utility/module/operation/loadingSheet/loadingsheet-service";
import { StorageService } from "src/app/core/service/storage.service";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { VehicleTypeService } from "src/app/Utility/module/masters/vehicle-type/vehicle-type-service";
import { AddMarketVehicleComponent } from "../add-market-vehicle/add-market-vehicle.component";
import { VehicleService } from "src/app/Utility/module/masters/vehicle-master/vehicle-master-service";
import moment from "moment";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { firstValueFrom } from "rxjs";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { DocCalledAsModel } from "src/app/shared/constants/docCalledAs";

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
  isDisplay = false;
  addAndEditPath: string;
  uploadComponent: any;
  loadingSheetData: any;
  NavData: any;
  isMarket: boolean = false;
  csvFileName: string; // Name of the CSV file, when data is downloaded. You can also use a function to generate filenames based on dateTime.
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  containerWidth = '1024px';
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
      title: "Create Loading Sheet",
      items: ["Departure"],
      active: "Create Loading Sheet",
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
  orgBranch: string = "";
  shipmentData: any;
  tableData: any[];
  headerGroup = [{
    Name: "LegGroup",
    Title: "",
    class: "matcolumncenter",
    ColSpan: 2,
    sticky: true
  }, {
    Name: "LoadedGroup",
    Title: "Loaded",
    class: "matcolumncenter",
    ColSpan: 4
  }, {
    Name: "TotalGroup",
    Title: "Total",
    class: "matcolumncenter",
    ColSpan: 4
  }
  ];
  addNewTitle: string = "Add Market";
  columnHeader = {};
  staticField = ["leg", "packages", "weightKg", "volumeCFT", "tCount", "tPackages", "tWeightKg", "tVolumeCFT"];
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
  isDisbled: boolean = false;
  loadingData: any;
  shippingData: any;
  listDepartueDetail: any;
  getloadingFormData: any;
  legWiseData: any;
  updatedShipment: any[] = [];
  companyCode = 0;
  packagesScan: any;
  vehicleNoControlName: any;
  vehicleControlStatus: any;
  loadingSheetNo: any;
  docketApiRes: any;
  cnoteDetails: any;
  userName = "";
  lsDetails: any;
  NoDocket: boolean;
  departFlag: boolean = false;
  alldocket: any;
  isUpdate: boolean = false;
  vehicleSize: AutoComplete[];
  products: AutoComplete[];
  vehicleDetails: any;
  MarketData: any;
  vehicleTypeList: any;
  DocCalledAs: DocCalledAsModel;

  constructor(
    private Route: Router,
    private _operationService: OperationService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private storage: StorageService,
    private generalService: GeneralService,
    private loadingSheetService: LoadingSheetService,
    private vehicleTypeService: VehicleTypeService,
    private thcService:ThcService,
    private vehicleService: VehicleService,
    private marketVehicleSericve: MarkerVehicleService,
    private controlPanelService: ControlPanelService,
    public snackBarUtilityService: SnackBarUtilityService
  ) {
    this.companyCode = this.storage.companyCode;
    this.orgBranch = this.storage.branch;
    this.userName = this.storage.userName;
    this.DocCalledAs = this.controlPanelService.DocCalledAs;
    this.headerForCsv = {
      RouteandSchedule: "Leg",
      Shipments: `${this.DocCalledAs.Docket}s`,
      Packages: "Packages",
      WeightKg: "Weight Kg",
      VolumeCFT: "Volume CFT",
    };

    this.columnHeader = {
      checkBoxRequired: {
        Title: "",
        class: "matcolumncenter",
        Style: "max-width:20px; max-width:20px",
        sticky: true,
      },
      leg: {
        Title: "Leg",
        class: "matcolumnleft",
        Style: "min-width:100px",
        sticky: true,
      },
      count: {
        Title: `${this.DocCalledAs.Docket}s`,
        class: "matcolumnright",
        Style: "max-width:50px; min-width:50px"
      },

      packages: {
        Title: "Packages",
        class: "matcolumnright",
        Style: "max-width:50px; min-width:50px",
        datatype: 'number',
        decimalPlaces: 0
      },

      weightKg: {
        Title: "Weight (KG)",
        class: "matcolumnright",
        Style: "max-width:80px; min-width:80px",
        datatype: 'number',
        decimalPlaces: 0
      },

      volumeCFT: {
        Title: "Volume (CFT)",
        class: "matcolumnright",
        Style: "max-width:80px; min-width:80px",
        datatype: 'number',
        decimalPlaces: 0
      },

      // tCount: {
      //   Title: "Shipment",
      //   class: "matcolumnright",
      //   Style: "max-width:50px; min-width:50px"
      // },
      // tPackages: {
      //   Title: "Packages",
      //   class: "matcolumnright",
      //   Style: "max-width:50px; min-width:50px",
      //   datatype: 'number',
      //   decimalPlaces: 0
      // },
      // tWeightKg: {
      //   Title: "Weight (KG)",
      //   class: "matcolumnright",
      //   Style: "max-width:80px; min-width:80px",
      //   datatype: 'number',
      //   decimalPlaces: 0
      // },
      // tVolumeCFT: {
      //   Title: "Volume (CFT)",
      //   class: "matcolumnright",
      //   Style: "max-width:80px; min-width:80px",
      //   datatype: 'number',
      //   decimalPlaces: 0
      // }
    };

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.isDisplay = true;
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
        this.isDisplay = false;
        this.isUpdate = true;
      }

    }
  }
  
  ngOnInit(): void { 
    // Initialize form controls
    this.IntializeFormControl();
    this.generalMaster();
    // Auto-bind data
    this.checkIsMarketVehicle(false);
  }

  async generalMaster() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    const product = ["Road", "Express"];
    this.products = this.products.filter((x) => product.includes(x.name));
    setGeneralMasterData(this.jsonControlArray, this.products, "transMode");
    const products = this.products.find((x) => x.name == "Road");
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
      moment(this.tripData?.Expected).format("DD MMM YY HH:MM"),
      moment(this.getloadingFormData?.Expected).format("DD MMM YY HH:MM"),
      ""
    );

    // Set the value of 'LoadingLocation' form control with the value retrieved from localStorage for 'Branch'
    setFormControlValue(
      this.loadingSheetTableForm.controls["LoadingLocation"],
      this.storage.branch,
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
      this.getThcDetails();
      this.getCapacity();
      if (!this.tripData.VehicleNo) {
        this.GetVehicleDropDown();
      }
    } else {

      this.GetVehicleDropDown();
      this.getshipmentData();
    }
  }
  async getThcDetails() {
    if(this.isUpdate){
      const res = await this.thcService.getThcDetailsByNo(this.tripData?.TripID || "")
      if (Object.keys(res.data).length > 0) {
        this.loadingSheetTableForm.controls['vehicleType'].setValue(res.data?.vTYP||"");
      // this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(res.data?.vTYP);
        this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(res.data?.cAP?.vOL||0);
        this.loadingSheetTableForm.controls['Capacity'].setValue(res.data?.cAP?.wT||"");
        const fieldName=['vehicle','Capacity','CapacityVolumeCFT','vehicleType'];
        this.jsonControlArray = this.jsonControlArray.map((x) => {
          if (fieldName.includes(x.name)) {
            x.disable = true
          }
          return x;
        });
        //this.loadingSheetTableForm.controls['vehicle'].disable();
        //this.loadingSheetTableForm.controls['Capacity'].disable();
        //this.loadingSheetTableForm.controls['CapacityVolumeCFT'].disable();
        //this.loadingSheetTableForm.controls['vehicleType'].disable();
      }
    }
  }
  /*below function is for the inatalize a forGroup*/
  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new loadingControl();

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlArray = loadingControlFormControls.getMarkArrivalsertFormControls();

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
  /*End*/
 
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
  /*when we check on checkbox that time that function would be called*/
  IsActiveFuntion($event) {
    // Assign the value of $event to the loadingData property
    this.loadingData = $event;
    if (!this.loadingSheetTableForm.value.vehicle) {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
      this.tableData.forEach((x) => {
        x.isSelected = false
      })
      return;
    } else {
      this.getCapacity();
    }
  }
  /*End*/
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

    let routeLocations = this.tripData?.RouteandSchedule.split(":")[1].split("-");
    const removeItemsBeforeX = (arr, x) => { const idx = arr.indexOf(x); return arr.slice(idx >= 0 ? idx : arr.length); };

    const [orgn, ...nextLocs] = removeItemsBeforeX(routeLocations, this.storage.branch);

    const res = await this.loadingSheetService.getDocketsForLoadingSheet(nextLocs);
    if (res.data.length > 0) {
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
      })
      //.filter(f => nextLocs.includes(f.destLoc));
    }

    const gropuColumns = ['curLoc', 'destLoc'];
    const aggregationRules = [
      { outputField: 'count', inputField: 'dktCount', operation: 'sum' },
      { outputField: 'packages', inputField: 'pKGS', operation: 'sum' },
      { outputField: 'weightKg', inputField: 'aCTWT', operation: 'sum' },
      { outputField: 'volumeCFT', inputField: 'cFTTOT', operation: 'sum' },
      { outputField: 'tCount', inputField: 'dktCount', operation: 'sum' },
      { outputField: 'tPackages', inputField: 'pKGS', operation: 'sum' },
      { outputField: 'tWeightKg', inputField: 'aCTWT', operation: 'sum' },
      { outputField: 'tVolumeCFT', inputField: 'cFTTOT', operation: 'sum' },
    ];
    const fixedColumn = [
      { field: 'leg', calculate: item => { return `${item.curLoc}-${item.destLoc}` } },
      { field: 'routeLocs', calculate: item => { return [orgn, ...nextLocs] } },
      { field: 'items', calculate: item => { return [] } },
      { field: 'selectedDkts', calculate: item => { return [] } },
    ];

    let legs = nextLocs.map(x => {
      return {
        leg: `${orgn}-${x}`,
        routeLocs: [orgn, ...nextLocs],
        count: 0,
        packages: 0,
        weightKg: 0,
        volumeCFT: 0,
        tCount: 0,
        tPackages: 0,
        tWeightKg: 0,
        tVolumeCFT: 0,
        items: [],
        selectedDkts: []
      }
    });

    if (this.shipmentData && this.shipmentData.length > 0) {
      let aggData = aggregateData(this.shipmentData, gropuColumns, aggregationRules, fixedColumn, true);

      let dockets = [];
      aggData = aggData.map((l: any) => {
        let docs = this.shipmentData.filter(f => f.curLoc == l.curLoc && f.destLoc == l.destLoc);
        //l.Dockets = docs;
        dockets.push(...docs);
        return l;
      });



      //Here i user cnoteDetails varible to used in updateDocketDetails() method
      //this._cnoteService.setShipingData(dockets);
      this.alldocket = dockets;
      this.cnoteDetails = dockets;
      const groupedShipments = aggData;

      groupedShipments.forEach(item => {
        if (item['items'] && Array.isArray(item['items'])) {
          item['items'].forEach(subItem => {
            subItem.isSelected = true;
          });
        }
      });

      let selectedDockets = groupedShipments.map((x) => x['items']?.filter((y) => y.isSelected = true).map((z) => z.dKTNO)).flat()
      groupedShipments.forEach(item => {
        item['selectedDkts'] = selectedDockets;
      });

      const tableData = legs.map((x) => {
        return groupedShipments.find((y) => y['leg'] == x.leg) || x;
      });

      if (tableData.length > 0) {
        this.tableload = false;
      } else {
        this.departFlag = true;
      }
      this.tableData = tableData
    }
    else {
      this.tableData = legs;
      this.tableload = false;
    }
  }
  ngOnDestroy(): void {
    //this._cnoteService.setShipingData([]);
    // Perform cleanup, unsubscribe from observables, etc.
  }
  isMarketVehicle() {
    this.loadingSheetTableForm.controls['vendorType'].setValue("Market");
  }
  async loadingSheetGenerate() {
    const formData=this.loadingSheetTableForm;
    const shipment = this.tableData.filter((x) => x.isSelected);
    if (shipment.length == 0) {
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
      return false;
    }
    if (shipment.filter((x) => x.count > 0).length < 1) {
      SwalerrorMessage("error", "There are no shipments in your leg", "", true);
      return;
    }
    this.isDisbled = true;
    try {
      this.snackBarUtilityService.commonToast(async () => {
        const lsForm = this.loadingSheetTableForm.getRawValue();
        if (lsForm.vendorType == "Market" || !this.isUpdate) {
          try {
            if (this.isMarket && this.MarketData) {
          //    const reqBody = await this.loadingSheetService.requestVehicle(this.MarketData)
            //  await this.vehicleService.updateOrCreateVehicleStatus(reqBody);
            }
            else {
              await this.vehicleService.updateVehicleCap(this.loadingSheetTableForm.value);
            }
          } catch (e) {
          }
        }
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
          let lsData = lsForm
          lsData['transMode'] = this.products.find((x) => x.value == lsForm.transMode)?.value ?? '';
          lsData['transModeName'] = this.products.find((x) => x.name == "Road")?.name ?? '';
          if (lsData.vendorType == 'Market') {
            const vehicleTypeList=this.vehicleTypeList
            const vehicleData = this.vehicleTypeList?.find(x => 
              x.value == lsData['vehicleType'] || x.name == lsData['vehicleType'] || x.value==lsData['vehicleTypeCode']
            ) ?? { name: "", value: "" };
            lsData['vehicleType'] = vehicleData?.name ||""
            lsData['vehicleTypeCode'] =  vehicleData.value || "";
          }
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
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 1000);
        const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> =
          this.dialog.open(LodingSheetGenerateSuccessComponent, {
            width: "100%", // Set the desired width
            data: this.tableData.filter((x) => x.hasOwnProperty('LoadingSheet')), // Pass the data object
          });

        dialogRef.afterClosed().subscribe((result) => {
          this.goBack('Departures');
          // Handle the result after the dialog is closed
        });
      }, "Loading Sheet Processing")
    }
    catch (err) {
      this.snackBarUtilityService.ShowCommonSwal("error", err);
    }
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
      let selectedDockets = this.tableData.filter(x => x.leg != event[0].leg.trim())
        .map((x) => x['items']?.filter((y) => y.isSelected == true).map((z) => z.dKTNO)).flat();

      let newSelected = event.filter((y) => y.isSelected = true).map((z) => z.dKTNO);
      selectedDockets = [... new Set([...selectedDockets, ...newSelected])];

      this.tableData.forEach(row => {
        if (row.leg.trim() === event[0].leg.trim()) {
          const e = event.filter(f => f.isSelected == true);
          row.items = e;
          row.count = e.length
          row.weightKg = e.reduce((acc, cur) => acc + cur.aCTWT, 0);
          row.volumeCFT = e.reduce((acc, cur) => acc + cur.cFTTOT, 0);
          row.packages = e.reduce((acc, cur) => acc + cur.pKGS, 0);;
        }
        row.selectedDkts = selectedDockets;
      });
    }
    this.getCapacity();
  }

  async checkIsMarketVehicle(vehicleData) {
    const fieldName = ["vehicleType", "Capacity", "CapacityVolumeCFT"];
    const res = await this.vehicleTypeService.getVehicleTypeList();
    if (typeof (this.loadingSheetTableForm.controls['vehicle'].value) == "string" || vehicleData == undefined) {
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = false
        }
        if (fieldName.includes(x.name) && x.name == "vehicleType") {
          x.type = "Staticdropdown"
          x.value = vehicleType
          x.disable = false

        }
        return x;
      });
      this.vehicleTypeList=vehicleType;
    }
    else{
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.vehicleTypeList=vehicleType;
    }


  }
  checkVehicle() {
    const fieldName = ["vehicleType", "Capacity", "CapacityVolumeCFT"];
    const vehicleType = this.jsonControlArray.find((x) => x.name == "vehicleType");
    if (vehicleType.type == "Staticdropdown"
      || this.loadingSheetTableForm.controls['vehicle'].value != ""
      || this.loadingSheetTableForm.controls['vehicleType'].value != ""
    ) {
      this.jsonControlArray.forEach((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = true;  // Disable the control if fieldName includes x.name

          if (x.name === "vehicleType") {
            x.type = "text";
            x.value = "";  // Set value to empty string if name is "vehicleType"
          } else {
            x.value = 0;  // Set value to 0 for all other names
          }
        }
      });
      fieldName.forEach((x) => {
        this.loadingSheetTableForm.controls[x].setValue("");
      })
      this.filter.Filter(
        this.jsonControlArray,
        this.loadingSheetTableForm,
        this.vehicleDetails,
        this.vehicleNoControlName,
        this.vehicleControlStatus
      );
    }

  }
  // get vehicleNo
  async GetVehicleDropDown() {
    const vehRequest = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: {
        D$or: [
          { vendorTypeCode: { D$in: [1, "1"] }, currentLocation: this.storage.branch },
          { vendorTypeCode: { D$nin: [1, "1"] } },
        ]
        //status: "Available", 
      }
    };

    // Fetch data from the JSON endpoint
    const res = await firstValueFrom(this._operationService.operationMongoPost("generic/get", vehRequest));
    if (res) {
      let vehicleDetails = res.data.map((x) => {
        return {
          name: x.status == 'Available' ? x.vehNo : `${x.vehNo} | In Transit [${x.tripId}] `,
          value: x.vehNo,
          status: x.status,
          vendorType: x.vendorTypeCode
        };
      }).sort((a, b) => {
        const sc = a.status.localeCompare(b.status);
        if (sc !== 0) { return sc; }
        return a.value.localeCompare(b.value);
      });

      this.vehicleDetails = vehicleDetails;
      this.filter.Filter(
        this.jsonControlArray,
        this.loadingSheetTableForm,
        vehicleDetails,
        this.vehicleNoControlName,
        this.vehicleControlStatus
      );
    }
  }
  
  async loadVehicleDetails() {
    try {
      this.checkVehicle();
      const vehControl = this.loadingSheetTableForm.controls["vehicle"];
      if (!this.isUpdate && vehControl.value.status != "Available") {
        vehControl.setValue("");
        return;
      }
      if(vehControl.value.vendorType == 4) { 
        const vehicleData = await this.marketVehicleSericve.GetVehicleData(this.loadingSheetTableForm.value.vehicle.value);
        if (vehicleData) {
          this.isMarket = true;
          this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleData.vEHTYP);
          this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(vehicleData.vEHTYPCD);
          this.loadingSheetTableForm.controls['vendorType'].setValue("Market");
          this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(vehicleData?.vOLCP||0);
          this.loadingSheetTableForm.controls['Capacity'].setValue(vehicleData?.wTCAP||0);
        }
        else {
          this.checkIsMarketVehicle(vehicleData);
        }
      }
      else {
        const vehicleData = await getVehicleDetailFromApi(this.companyCode, this._operationService, this.loadingSheetTableForm.value.vehicle.value);
        if (vehicleData) {
          this.isMarket = false;
          this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleData.vehicleType);
          this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(vehicleData.vehicleTypeCode);
          this.loadingSheetTableForm.controls['vendorType'].setValue(vehicleData?.vendorType || "Market");
          this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(vehicleData?.cft||0);
          this.loadingSheetTableForm.controls['Capacity'].setValue(vehicleData?.capacity||0);
        }
        else {
          this.checkIsMarketVehicle(vehicleData);
        }
      }
      
    } catch (error) {
    }
  }
  goBack(tabIndex: string): void {
    setTimeout(()=>{
      this.navigationService.navigateTotab(
        tabIndex,
        "/dashboard/Index"
      );
    },500)
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
        this.snackBarUtilityService.commonToast(async () => {
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
        }, "Vehicle is ready to depart");
        this.goBack('Departures');
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error);
        //console.error('Error occurred during the API call:', error);
      }
    } else {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    }
  }
  
  //#region addMarket vehicle
  addMarket() {
    const dialogref = this.dialog.open(AddMarketVehicleComponent, {
      data: "ltl",
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result) {
        this.isMarket = true;
        this.MarketData = result;
        this.autoBindMarketVehicleData(result);
      }
      else {
        this.isMarket = false;
        this.MarketData = null;
      }
    });
  }
  //#endregion
  //#region bind Vehicle Data if it is market 
  autoBindMarketVehicleData(result) {
    if (result) {
      this.loadingSheetTableForm.controls['vehicle'].setValue({ name: result?.vehicelNo || "", value: result?.vehicelNo || "" });
      this.loadingSheetTableForm.controls['vehicleType'].setValue(result.vehicleType.name);
      this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(result.vehicleType.value);
      this.loadingSheetTableForm.controls['vendorType'].setValue("Market");
      this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(result.vehicleSizeVol);
      this.loadingSheetTableForm.controls['Capacity'].setValue(result.vehicleSize);
    }
  }
  //#end region
}
