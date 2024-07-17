import { Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
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
import { getNextLocation, setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { calculateBalanceAmount, calculateTotal, calculateTotalAdvances, getDriverDetail, getLoadingSheetDetail, updateTracking } from "./depart-common";
import { formatDate } from "src/app/Utility/date/date-utils";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { DepartureService } from "src/app/Utility/module/operation/departure/departure-service";
import { THCTrackingComponent } from "src/app/control-tower/thctracking/thctracking.component";
import { HawkeyeUtilityService } from "src/app/Utility/module/hawkeye/hawkeye-utility.service";
import { InvoiceModel } from "src/app/Models/dyanamic-form/dyanmic.form.model";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import moment from "moment";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";


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
  companyCode: number = 0;
  shipData: any;
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  };
  linkArray = [{ Row: "Shipments", Path: "Operation/LoadingSheetView" }];

  hyperlinkControls = {
    value: "manifest",
    functionName: "viewMenifest"
  }
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
  orgBranch: string = "";
  shipmentData: any;
  menifestTableData: any[];
  columnHeader = {
    leg: "Leg",
    hyperlink: "Manifest",
    shipments_lb: "Shipments",
    packages_lb: "Packages",
    weight_kg: "Weight Kg",
    volume_cft: "Volume CFT",
  };
  columnWidths = {
    'leg': 'min-width: 10%',
    'manifest': 'min-width:30%',
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
  listDocket = [];
  next: string;
  products: AutoComplete[];
  isSysCEVB: boolean = true;
  rules: any;
  isDisble: boolean = false;
  thcDetails: any;

  // DepartVehicleControls: DepartVehicleControl;
  //#endregion
  constructor(
    private Route: Router,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private thcService: ThcService,
    private _operationService: OperationService,
    private generalService: GeneralService,
    private departureService: DepartureService,
    private hawkeyeUtilityService: HawkeyeUtilityService,
    private storage: StorageService,
    private locationService: LocationService,
    private filter: FilterUtils,
    private controlPanel: ControlPanelService,
    private snackBarUtilityService: SnackBarUtilityService,
    private markerVehicleService:MarkerVehicleService
  ) {
    this.companyCode = this.storage.companyCode;
    this.orgBranch = this.storage.branch;
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {

      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
   
  }
  ngOnInit(): void {
    this.getRules().finally(() => {
      this.IntializeFormControl();
      this.autoBindData();
      this.fetchShipmentData();
      this.generalMaster();
      // this.autoBindData()
    });
  }
  
  async getRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: { D$in: ["THC"] },
      aCTIVE: true,
    };
    const res = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.rules = res;
      this.isSysCEVB = this.rules.find((x) => x.rULEID == "SYSCEWB" && x.aCTIVE)?.vAL == "Y";
    }
  }
  async generalMaster() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    const product = ["Road", "Express"];
    this.products = this.products.filter((x) => product.includes(x.name));
    setGeneralMasterData(this.jsonControlArray, this.products, "transMode");
    this.vehicleDetails();
  }
  async autoBindData() {
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
    const loadingLocationFormControl = this.loadingSheetTableForm.controls["LoadingLocation"];
    const loadingLocationValue = this.storage.branch || "";
    loadingLocationFormControl.setValue(loadingLocationValue);
    const route = this.tripData.RouteandSchedule.split(":")[1].split("-");
    const first = route[0];  // Accessing the first element
    const last = route[route.length - 1];
    try {
      const locData = await this.locationService.getLocations({
        locCode: { D$in: [last, first] },
      });
      const balAmtLoc = locData.find((x) => x.locCode == last)
      const adAmt = locData.find((x) => x.locCode == first)
      this.balanceTableForm.controls['balAmtAt'].setValue({ name: balAmtLoc?.locName || "", value: balAmtLoc?.locCode || "" });
      this.balanceTableForm.controls['advPdAt'].setValue({ name: adAmt?.locName, value: balAmtLoc?.locCode || "" });
      this.balanceTableForm.controls['fromCity'].setValue(balAmtLoc?.locCity||"");
      this.balanceTableForm.controls['toCity'].setValue(adAmt?.locCity||"");
    }
    catch (err) {
      this.balanceTableForm.controls['balAmtAt'].setValue({ name: first, value: first });
      this.balanceTableForm.controls['advPdAt'].setValue({ name: last, value: last });
    }

  }
  
  async vehicleDetails() {  
    try {
      const reqbody = {
        companyCode: this.companyCode,
        collectionName: "vehicle_status",
        filter: { vehNo: this.tripData.VehicleNo }
      };
      const reqVeh = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        filter: { vehicleNo: this.tripData.VehicleNo }
      };
      // Execute parallel API calls
      const [res, resVeh, thcDetails] = await Promise.all([
        firstValueFrom(this._operationService.operationMongoPost("generic/getOne", reqbody)),
        firstValueFrom(this._operationService.operationMongoPost("generic/getOne", reqVeh)),
        this.thcService.getThcDetailsByNo(this.tripData?.TripID || "")
      ]);
      const thcData = thcDetails?.data || "";
      this.thcDetails = thcDetails?.data || "";
      if (Object.keys(res.data).length > 0) {
        const { data } = res;
        this.departvehicleTableForm.controls["VendorType"].setValue(data?.vendorType || "");
        this.departvehicleTableForm.controls["Vendor"].setValue(data?.vendor || "");
        this.departvehicleTableForm.controls["Driver"].setValue(data?.driver || "");
        this.departvehicleTableForm.controls["DriverMob"].setValue(data?.dMobNo || "");
        this.departvehicleTableForm.controls["License"].setValue(data?.lcNo || "");
        this.loadingSheetTableForm.controls['vehicleType'].setValue(thcData?.vTYPNM || data?.vehType || "");
        this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(thcData?.vTYP || data?.vTYP || "");
        this.departvehicleTableForm.controls["Expiry"].setValue(data?.lcExpireDate);
        this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(thcData?.cAP?.vOL || data?.capacityVolCFT || 0);
        this.loadingSheetTableForm.controls['Capacity'].setValue(thcData?.cAP?.wT || data?.capacity || 0);
        this.loadingSheetTableForm.controls['LoadedKg'].setValue(thcDetails?.data?.lOADED?.wT || 0);
        this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(thcDetails?.data?.lOADED?.vOL || 0);

      }
      if (Object.keys(resVeh.data).length > 0) {
        const { data } = resVeh;
        this.loadingSheetTableForm.controls['vehicleType'].setValue(data?.vehicleType || "");
        this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(data?.vehicleTypeCode || "");
        this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(thcData?.cAP?.vOL || data?.cft || 0);
        this.loadingSheetTableForm.controls['Capacity'].setValue(thcData?.cAP?.wT || data?.capacity || 0);
        this.loadingSheetTableForm.controls['LoadedKg'].setValue(thcDetails?.data?.lOADED?.wT || data?.capacity || 0);
        this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(thcDetails?.data?.lOADED?.vOL || data?.cft || 0); // Assuming you meant cft here for consistency
        // THC Details handling

      }
      if (Object.keys(thcDetails.data).length > 0) {
        const { data: thcData } = thcDetails;
        if (thcData?.tMODE) {
          this.loadingSheetTableForm.controls['transMode'].setValue(`${thcData?.tMODE}`);
        }
        else {
          const products = this.products.find((x) => x.name == "Road");
          this.loadingSheetTableForm.controls['transMode'].setValue(products.value);
        }
        this.loadingSheetTableForm.controls['LoadaddedKg'].setValue(thcData?.lOADED.wT || 0);
        this.loadingSheetTableForm.controls['VolumeaddedCFT'].setValue(thcData?.lOADED.vOL || 0);
        this.loadingSheetTableForm.controls['WeightUtilization'].setValue(thcData?.uTI.wT || 0);
        this.loadingSheetTableForm.controls['VolumeUtilization'].setValue(thcData?.uTI.vOL || 0);
        // this.advanceTableForm.controls['OtherChrge'].setValue(thcData?.cHG.oAMT || 0);
        // this.advanceTableForm.controls['Loading'].setValue(thcData?.cHG.lOADING || 0);
        // this.advanceTableForm.controls['Unloading'].setValue(thcData?.cHG.uNLOADING || 0);
        // this.advanceTableForm.controls['Enroute'].setValue(thcData?.cHG.eNROUTE || 0);
        // this.advanceTableForm.controls['Misc'].setValue(thcData?.cHG.mISC || 0);
        // this.balanceTableForm.controls['PaidByCash'].setValue(thcData?.aDV.pCASH || 0);
        //this.balanceTableForm.controls['PaidbyBank'].setValue(thcData?.aDV.pBANK || 0);
        ///this.balanceTableForm.controls['PaidbyFuel'].setValue(thcData?.aDV.pFUEL || 0);
        this.balanceTableForm.controls['Advance'].setValue(thcData?.aDV.tOTAMT || 0);
        this.balanceTableForm.controls['BalanceAmt'].setValue(thcData?.bALAMT || 0);
        this.departvehicleTableForm.controls['engineNo'].setValue(thcData?.eNGNO ||"");
        this.departvehicleTableForm.controls['chasisNo'].setValue(thcData?.cHASNO ||"");
        this.departvehicleTableForm.controls['inExdt'].setValue(thcData?.iNSEXDT ||"");
        this.departvehicleTableForm.controls['fitdt'].setValue(thcData?.fITDT || "");
        this.departvehicleTableForm.controls['vehRegDate'].setValue(thcData?.vEHREGDT ||"");
        this.advanceTableForm.controls['otherAmount'].setValue(ConvertToNumber(thcData?.oTHAMT, 2));
        // this.balanceTableForm.controls['PaidbyCard'].setValue(thcData?.aDV.pCARD || 0);
        //this.balanceTableForm.controls['TotalAdv'].setValue(thcData?.aDV.tOTAMT || 0);
        // this.balanceTableForm.controls['BalanceAmt'].setValue(thcData?.bALAMT || 0);
        try {
          const locData = await this.locationService.getLocations({
            locCode: { D$in: [ thcData?.bLPAYAT, thcData?.aDPAYAT] },
          });
          const balAmtLoc = locData.find((x) => x.locCode == thcData?.bLPAYAT)
          const adAmt = locData.find((x) => x.locCode == thcData?.aDPAYAT)
          this.balanceTableForm.controls['balAmtAt'].setValue({ name: balAmtLoc?.locName || "", value: balAmtLoc?.locCode || "" });
          this.balanceTableForm.controls['advPdAt'].setValue({ name: adAmt?.locName||"", value: balAmtLoc?.locCode || "" });
        }
        catch (err) {
          this.balanceTableForm.controls['balAmtAt'].setValue({ name: thcData?.bLPAYAT || "", value: thcData?.bLPAYAT || "" });
          this.balanceTableForm.controls['advPdAt'].setValue({ name: thcData?.aDPAYAT || "", value: thcData?.aDPAYAT || "" });
        }
       
        const Expected = moment(this.tripData.ExpectedDate).format("DD MMM YY HH:MM");
        this.loadingSheetTableForm.controls['Expected'].setValue(Expected);
        if (thcData.cHG && thcData.cHG.length > 0) {
          this.getAutoFillCharges(thcData.cHG, thcData);
        }
        else {
          this.getCharges(thcData?.tMODENM || "Road");
        }

      }
      if (this.departvehicleTableForm.controls['VendorType'].value === "Market") {
        const resData = await this.markerVehicleService.GetVehicleData(this.tripData.VehicleNo);
        
        if (resData) {
          const setControlValue = (controlName: string, resValue: any) => {
            this.departvehicleTableForm.controls[controlName].setValue(
              !this.departvehicleTableForm.controls[controlName].value ? resValue : ''
            );
          };
      
          setControlValue('chasisNo', resData?.cHNO);
          setControlValue('engineNo', resData?.eNGNO);
          setControlValue('inExdt', resData?.iNCEXP);
          setControlValue('fitdt', resData?.fITDT);
        }
      }
      
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      // Handle error appropriately
    }
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
    const DepartureControls = new DepartureControl(this.isSysCEVB);
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
  /*below function is for the Advance && blance at*/
  async getLocation(event) {
    if (this.balanceTableForm.controls[event.field.name].value.length > 2) {
      const locData = await this.locationService.getLocations({
        locCode: { 'D$regex': `^${this.balanceTableForm.controls[event.field.name].value}`, 'D$options': 'i' },
      });
      const locationMapping = locData.map((x) => {
        return {
          name: x.locName,
          value: x.locCode,
          locData: x
        }
      })
      this.filter.Filter(
        this.balanceControlArray,
        this.balanceTableForm,
        locationMapping,
        event.field.name,
        false
      );
    }
  }
  /*End*/
  /**
 * Fetches shipment data from the API and updates the boxData and tableload properties.
 */
  async fetchShipmentData() {
    try {
      // Prepare request payload for manifest headers
      const headersRequest = {
        companyCode: this.companyCode,
        collectionName: "mf_headers_ltl",
        filter: { tHC: this.tripData.TripID, "D$or": [{ iSDEL: { "D$exists": false } }, { iSDEL: "" }], }
      };

      const headersResponse = await firstValueFrom(this._operationService.operationMongoPost("generic/get", headersRequest));

      if (headersResponse.data.length === 0) {
        return; // Early return if no data found
      }

      // Extract manifest numbers (MFNO) from response
      const manifestNumbers = headersResponse.data.map(header => header.mFNO);

      // Prepare request for manifest details
      const detailsRequest = {
        companyCode: this.companyCode,
        collectionName: "mf_details_ltl",
        filter: { mFNO: { "D$in": manifestNumbers }, "D$or": [{ iSDEL: { "D$exists": false } }, { iSDEL: "" }] }
      };

      const detailsResponse = await firstValueFrom(this._operationService.operationMongoPost("generic/get", detailsRequest));
      this.shipmentData = detailsResponse.data;

      // Process manifest table data
      this.menifestTableData = headersResponse.data.map(header => {
        const totalWeight = detailsResponse.data.reduce((total, detail) =>
          detail.mFNO === header.mFNO ? total + detail.lDWT : total, 0);
        const totalVolume = detailsResponse.data.reduce((total, detail) =>
          detail.mFNO === header.mFNO ? total + detail.lDVOL : total, 0);

        return {
          leg: header.leg || "",
          manifest: header.mFNO || '',
          shipments_lb: header.dKTS || "",
          packages_lb: header.pKGS || 0,
          weight_kg: totalWeight,
          volume_cft: totalVolume
        };
      });
      this.tableload = false;
    } catch (error) {
      // Handle error appropriately
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
    this.isDisble = true;
    this.loadingSheetTableForm.controls['vehicleType'].setValue(this.loadingSheetTableForm.controls['vehicleType']?.value.value || "");
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.loadingSheetTableForm.controls['vehicle']?.value.value || "");
    const loadingArray = [this.loadingSheetTableForm.getRawValue()];
    const departArray = [this.departvehicleTableForm.getRawValue()];
    const advancearray = [this.advanceTableForm.getRawValue()];
    const balanceArray = [this.balanceTableForm.getRawValue()];
    const departureArray = [this.departureTableForm.getRawValue()];

    const mergedArray = [
      ...loadingArray,
      ...departArray,
      ...advancearray,
      ...balanceArray,
      ...departureArray,
    ];
    const mergedData = this.mergeArrays(mergedArray);
    delete mergedData.vehicleTypecontrolHandler;
    mergedData['lsno'] = this.lsDetails?.lsno || '';
    mergedData['mfNo'] = this.lsDetails?.mfNo || '';
    this.addDepartData(mergedData);      
  }
  async addDepartData(departData) {
    let charges = []
    this.advanceControlArray.filter((x) => x.hasOwnProperty("id")).forEach(element => {
      let json = {
        cHGID: element.name,
        cHGNM: element.placeholder,
        aMT: (element?.additionalData.metaData === "-") ? -Math.abs(this.advanceTableForm.controls[element.name].value || 0) : (this.advanceTableForm.controls[element.name].value || 0),
        oPS: element?.additionalData.metaData || "",
        aCCD: element.additionalData.AccountDetails.aCCD,
        aCNM: element.additionalData.AccountDetails.aCNM,
      }
      charges.push(json);
    });
    departData['cHG'] = charges

    const next = getNextLocation(departData.Route.split(":")[1].split("-"), this.storage.branch);
    let tripID = await this.departureService.getFieldDepartureMapping(departData, this.shipmentData);
    
    this.askTracking(departData);    

    Swal.fire({
      icon: 'info',
      title: 'Departure',
      html: `Vehicle to ${next} is about to depart with THC no <a href="#" id="thcLink">${tripID}</a>.`,
      confirmButtonText: 'OK',      
    }).then((result) => {
      this.goBack('Departures');
    });
  
    // Setup event listener for the hyperlink
    const link = document.getElementById('thcLink');
    if (link) {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default action of the link
        this.getTHCViewPrint(event, tripID);
      });
    }
    
  }

  getTHCViewPrint(event: Event, tripId: string): void {
    const templateBody = {
      templateName: 'THC',
      PartyField:"",
      DocNo: tripId,
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1000,height=800');
  }

  async askTracking(departData) {
    //get trip details
    let filter = {
      tHC: departData.tripID
    }
    //Get Trip data
    let tripDet = await this.departureService.fetchData('thc_summary_ltl', filter);
    //if trip is updated && need ask if user need to track trip
    if (tripDet?.length > 0 && tripDet[0]?.oPSST == 1 && tripDet[0]?.oRGN === this.orgBranch) {
      await this.openVehicleTracking(tripDet);
    }    
  }

  async pushDeptCT(tripDet) {
    let filter = {
      vehicleNo: tripDet.vEHNO
    }
    let vehicleDet = await this.departureService.fetchData('vehicle_detail', filter);
    if (vehicleDet?.length > 0 && vehicleDet[0]?.isActive && vehicleDet[0]?.gpsDeviceEnabled && vehicleDet[0]?.gpsDeviceId != "") {
      const reqArrivalDeparture = {
        action: "TripArrivalDepartureUpdate",
        reqBody: {
          cid: this.companyCode,
          EventType: 'D',
          loc: this.storage.branch || "",
          tripId: tripDet.tHC
        }
      }
      this.hawkeyeUtilityService.pushToCTCommon(reqArrivalDeparture);
    }

  }
  async openVehicleTracking(tripDet) {
    let filter = {
      vehicleNo: tripDet[0].vEHNO
    }
    let vehicleDet = await this.departureService.fetchData('vehicle_detail', filter);
    if (vehicleDet?.length > 0 && vehicleDet[0]?.isActive && vehicleDet[0]?.gpsDeviceEnabled && vehicleDet[0]?.gpsDeviceId != "") {
      //ask for tracking
      Swal.fire({
        icon: "question",
        title: "Tracking",
        text: `Do you want vehicle tracking?`,
        confirmButtonText: "Yes, track it!",
        showConfirmButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const req = {
            action: "PushTrip",
            reqBody: {
              companyCode: this.companyCode,
              branch: this.storage.branch || "",
              tripId: tripDet[0]?.tHC,
              vehicleNo: vehicleDet[0]?.vehicleNo
            }
          };
          this.hawkeyeUtilityService.pushToCTCommon(req);
          this.goBack('Departures');

          // const dialogref = this.dialog.open(THCTrackingComponent, {
          //   width: "100vw",
          //   height: "100vw",
          //   maxWidth: "232vw",
          //   data: vehicleDet[0],
          // });
          // dialogref.afterClosed().subscribe((result) => {
          //   if(result && result!=""){
          //     if(result?.gpsDeviceEnabled ==true && result?.gpsDeviceId!=""){
          //       const req={
          //         companyCode: this.companyCode,
          //         branch:localstorage.getItem(StoreKeys.Branch) || "",
          //         tripId:"TH/DELB/2425/000046",
          //         vehicleNo:result.vehicleNo
          //       }
          //       this.departureService.pushTripToCT(req);
          //       this.goBack('Departures');
          //     }
          //     else{
          //       this.goBack('Departures');
          //     }
          //   }
          // });
        }
        else {
          this.goBack('Departures');
        }
      });
    }
    else {
      this.goBack('Departures');
    }
  }
  async getCharges(prod) {
    this.advanceControlArray = this.advanceControlArray.filter((x) => !x.hasOwnProperty('id'));
    const filter = { "pRNm": prod, aCTV: true, cHBTY: { D$in: ["Booking", "Both"] } }
    const productFilter = { "cHACAT": { "D$in": ['V', 'B'] }, "pRNM": prod, cHATY: "Charges", "cHAPP": { D$in: ["THC"] }, isActive: true }
    const result = await this.thcService.getChargesV2(filter, productFilter);
    if (result && result.length > 0) {

      const invoiceList = [];
      result.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
            id: index + 1,
            name: element.cHACD || '',
            label: `${element.sELCHA}(${element.aDD_DEDU})`,
            placeholder: element.sELCHA || '',
            type: 'text',
            value: '0.00',
            filterOptions: '',
            displaywith: '',
            generatecontrol: true,
            disable: false,
            Validations: [],
            additionalData: {
              showNameAndValue: false,
              metaData: element.aDD_DEDU,
              AccountDetails: {
                aCCD: element.aCCD || "",
                aCNM: element.aCNM || "",
              }
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const chargeControl = [...invoiceList, ...this.advanceControlArray]
      this.advanceControlArray = chargeControl.sort((a, b) => {
        // First, ensure "contAmt" always comes first
        if (a.name === "ContractAmt") return -1;
        if (b.name === "ContractAmt") return 1;
        if (a.additionalData && a.additionalData.metaData === '+') return -1;
        if (a.additionalData && a.additionalData.metaData === '-') return 1;

        return 0;
      });
      this.advanceTableForm = formGroupBuilder(this.fb, [chargeControl]);
    }
  }
  /*below code is for getting a Chages from Charge Master*/
  async getAutoFillCharges(charges, thcData) {

    if (charges && charges.length > 0) {
      const invoiceList = [];

      charges.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
            id: index + 1,
            name: element.cHGID || '',
            label: `${element.cHGNM}(${element.oPS})`,
            placeholder: element.cHGNM || '',
            type: 'text',
            value: `${Math.abs(element.aMT)}`,
            filterOptions: '',
            displaywith: '',
            generatecontrol: true,
            disable: true,
            Validations: [],
            additionalData: {
              showNameAndValue: false,
              AccountDetails: {
                aCCD: element.aCCD || "",
                aCNM: element.aCNM || "",
              }
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const chargeControl = [...invoiceList, ...this.advanceControlArray]
      this.advanceControlArray = chargeControl.sort((a, b) => {
        // First, ensure "contAmt" always comes first
        if (a.name === "ContractAmt") return -1;
        if (b.name === "ContractAmt") return 1;
        if (a.oPS && a.additionalData.oPS === '+') return -1;
        if (a.oPS && a.additionalData.oPS === '-') return 1;

        return 0;
      });
      // this.advanceControlArray = chargeControl;
      this.advanceTableForm = formGroupBuilder(this.fb, [chargeControl]);

      this.advanceTableForm.controls['ContractAmt'].setValue(thcData?.cONTAMT || 0);
      this.advanceTableForm.controls['TotalTripAmt'].setValue(thcData?.tOTAMT || 0);
    }
  }
  /*End*/
  calucatedCharges() {
    let total = 0;
    const dyanmicCal = this.advanceControlArray.filter((x) => x.hasOwnProperty("id"));
    const chargeMapping = dyanmicCal.map((x) => { return { name: x.name, operation: x.additionalData.metaData } });
    total = chargeMapping.reduce((acc, curr) => {
      const value = ConvertToNumber(this.advanceTableForm.controls[curr.name].value, 2);
      if (curr.operation === "+") {
        return acc + value;
      } else if (curr.operation === "-") {
        return acc - value;
      } else {
        return acc; // In case of an unknown operation
      }
    }, 0);
    this.advanceTableForm.controls['otherAmount'].setValue(ConvertToNumber(total, 2));
    const totalAmt = ConvertToNumber(total, 2) + ConvertToNumber(this.advanceTableForm.controls["ContractAmt"].value, 2);
    this.advanceTableForm.controls['TotalTripAmt'].setValue(totalAmt);
    this.onCalculateTotal();
    // Now set this calculated percentageValue to advAmt
  }
  updateTrip() {
    const next = getNextLocation(this.tripData.RouteandSchedule.split(":")[1].split("-"), this.orgBranch);
    this.next = next;
    Swal.fire({
      icon: "info",
      title: "Departure",
      text: "Vehicle to " + next + " is about to depart.",
      confirmButtonText: "OK",
    });

    let tripDetails = {
      status: "depart",
      nextUpComingLoc: next
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_detail",
      "filter": { _id: this.tripData.id },
      "update": {
        ...tripDetails,
      }
    }
    this._operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.docketStatus();
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
  goBack(tabIndex: string): void {
    this.Route.navigate(["/dashboard/Index"], {
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

    // Update loading sheet table form controls with loading sheet details
    if (lsDetail) {
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
    // Update departure vehicle form controls with driver details
    if (driverDetail && driverDetail[0]) {
      this.departvehicleTableForm.controls['Driver'].setValue(driverDetail[0].driverName || "");
      this.departvehicleTableForm.controls['DriverMob'].setValue(driverDetail[0].telno || "");
      this.departvehicleTableForm.controls['License'].setValue(driverDetail[0].licenseNo || "");
      let convertedDate = driverDetail[0].valdityDt || '';
      convertedDate = convertedDate ? formatDate(convertedDate, 'dd MMM yy') : '';
      this.departvehicleTableForm.controls['Expiry'].setValue(convertedDate);

    }
    // Rest of your code that depends on loadingSheetDetail
  }
  onCalculateTotal(): void {
    
    const thc=this.thcDetails
    if (this.thcDetails.oPSST == 1) {
      // Step 1: Calculate the individual charges and set TotalTripAmt in the advanceTableForm
      // Step 2: Calculate the total advances and set TotalAdv in the balanceTableForm
      calculateTotalAdvances(this.balanceTableForm);
      // Step 3: Calculate the balance amount as the difference between TotalAdv and TotalTripAmt,
      // and set it in the BalanceAmount control of the balanceTableForm
      const totalTripAmt = parseFloat(this.advanceTableForm.controls['TotalTripAmt'].value) || 0;
      calculateBalanceAmount(this.balanceTableForm, totalTripAmt);
    }
    else {
      const formControls = [
        'ContractAmt',
        'Advance',
        'advPdAt',
        'balAmtAt',
        'BalanceAmt',
        'VendorType',
        'Vendor',
        'Driver',
        'DriverMob',
        'License',
        'vehicleType',
        'Expiry',
        'CapacityVolumeCFT',
        'Capacity',
        'LoadedKg',
        'LoadedvolumeCFT',
        'chasisNo',
        'engineNo',
        'inExdt',
        'fitdt',
        'otherAmount',
        'vehRegDate'
      ];

      formControls.forEach(control => {
        this.advanceTableForm.controls[control]?.disable();
        this.balanceTableForm.controls[control]?.disable();
        this.departvehicleTableForm.controls[control]?.disable();
        this.loadingSheetTableForm.controls[control]?.disable();
      });
    }
  }
  async docketStatus() {

    for (const element of this.listDocket) {
      try {
        await updateTracking(this.companyCode, this._operationService, element, this.next);

      } catch (error) {
        console.error('Error updating docket status:', error);
      }
    }
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `Vehicle is departed`,
      showConfirmButton: true,
    })
    this.goBack('Departures');
  }

  // async docketStatus() {

  //    // Create an array of promises for updateTracking calls
  //    const updatePromises =  this.listDocket.map(async element => {
  //     await updateTracking(this.companyCode, this._operationService, element,this.next);
  // });

  // // Wait for all updateTracking promises to resolve
  // await Promise.all(updatePromises);

  // }
  viewMenifest(event) {
    const req = {
      DocNo: event.data?.manifest,
      templateName: "MF",
      PartyField: ""
    };
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}
