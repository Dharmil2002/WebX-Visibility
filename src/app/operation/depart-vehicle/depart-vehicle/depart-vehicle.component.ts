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
  orgBranch: string = localStorage.getItem("Branch");
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
  products:AutoComplete[];
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
    private storage:StorageService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {

      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl();
    this.autoBindData();
    this.fetchShipmentData();
    this.generalMaster();
    // this.autoBindData()
  }
  async generalMaster() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    const product=["Road","Express"];
    this.products = this.products.filter((x) => product.includes(x.name));  
    setGeneralMasterData(this.jsonControlArray,this.products, "transMode");
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
    const loadingLocationValue = localStorage.getItem("Branch") || "";
    loadingLocationFormControl.setValue(loadingLocationValue);


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
      if (res) {
        const { data } = res;
        this.departvehicleTableForm.controls["VendorType"].setValue(data?.vendorType || "");
        this.departvehicleTableForm.controls["Vendor"].setValue(data?.vendor || "");
        this.departvehicleTableForm.controls["Driver"].setValue(data?.driver || "");
        this.departvehicleTableForm.controls["DriverMob"].setValue(data?.dMobNo || "");
        this.departvehicleTableForm.controls["License"].setValue(data?.lcNo || "");
        this.departvehicleTableForm.controls["Expiry"].setValue(formatDocketDate(data?.lcExpireDate));
      }
      if (resVeh) {
        const { data } = resVeh;
        this.loadingSheetTableForm.controls['vehicleType'].setValue(data?.vehicleType || "");
        this.loadingSheetTableForm.controls['vehicleTypeCode'].setValue(data?.vehicleTypeCode || "");
        this.loadingSheetTableForm.controls['CapacityVolumeCFT'].setValue(data?.cft || 0);
        this.loadingSheetTableForm.controls['Capacity'].setValue(data?.capacity || 0);
        this.loadingSheetTableForm.controls['LoadedKg'].setValue(data?.capacity || 0);
        this.loadingSheetTableForm.controls['LoadedvolumeCFT'].setValue(data?.cft || 0); // Assuming you meant cft here for consistency
        // THC Details handling
        if (thcDetails) {

          const { data: thcData } = thcDetails;
          if(thcData?.tMODE){
          this.loadingSheetTableForm.controls['transMode'].setValue(`${thcData?.tMODE}`);
          }
          else{
            const products=this.products.find((x)=>x.name=="Road");
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
          this.balanceTableForm.controls['PaidByCash'].setValue(thcData?.aDV.pCASH || 0);
          this.balanceTableForm.controls['PaidbyBank'].setValue(thcData?.aDV.pBANK || 0);
          this.balanceTableForm.controls['PaidbyFuel'].setValue(thcData?.aDV.pFUEL || 0);
          this.balanceTableForm.controls['Advance'].setValue(thcData?.aDV.tOTAMT || 0);
          this.balanceTableForm.controls['PaidbyCard'].setValue(thcData?.aDV.pCARD || 0);
          this.balanceTableForm.controls['TotalAdv'].setValue(thcData?.aDV.tOTAMT || 0);
          this.balanceTableForm.controls['BalanceAmt'].setValue(thcData?.bALAMT || 0);
          if(thcData.cHG && thcData.cHG.length>0){
            this.getAutoFillCharges(thcData.cHG,thcData);
          }
          else{
            this.getCharges(thcData?.tMODENM||"Road");
          }
          
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

    this.loadingSheetTableForm.controls['vehicleType'].setValue(this.loadingSheetTableForm.controls['vehicleType']?.value.value || "");
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.loadingSheetTableForm.controls['vehicle']?.value.value || "");
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
      }
      charges.push(json);
    });
    departData['cHG'] = charges
    await this.departureService.getFieldDepartureMapping(departData, this.shipmentData);
    this.askTracking(departData);
    //this.goBack('Departures');
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
    else {
      this.goBack('Departures');
    }
  }
  
  async pushDeptCT(tripDet){
    let filter= {
      vehicleNo:tripDet.vEHNO 
    }
    let vehicleDet=await this.departureService.fetchData('vehicle_detail',filter);
    if(vehicleDet?.length>0 && vehicleDet[0]?.isActive && vehicleDet[0]?.gpsDeviceEnabled && vehicleDet[0]?.gpsDeviceId!="" ){
      const reqArrivalDeparture={
        action:"TripArrivalDepartureUpdate",
        reqBody:{
          cid:this.companyCode,
          EventType:'D',
          loc:localStorage.getItem("Branch") || "",
          tripId:tripDet.tHC
        }
      }
      this.hawkeyeUtilityService.pushToCTCommon(reqArrivalDeparture);
    }

  }
  async openVehicleTracking(tripDet){
    let filter= {
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
              branch: localStorage.getItem("Branch") || "",
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
          //         branch:localStorage.getItem("Branch") || "",
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
    const result = await this.thcService.getCharges({ "cHACAT": { "D$in": ['V', 'B'] }, "pRNM": prod },);
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
              metaData: element.aDD_DEDU
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const chargeControl = [...invoiceList, ...this.advanceControlArray]
      this.advanceControlArray = chargeControl;
      this.advanceTableForm = formGroupBuilder(this.fb, [chargeControl]);
    }
  }
  /*below code is for getting a Chages from Charge Master*/
  async getAutoFillCharges(charges,thcData) {

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
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const chargeControl = [...invoiceList, ...this.advanceControlArray]
      this.advanceControlArray = chargeControl;
      this.advanceTableForm= formGroupBuilder(this.fb, [chargeControl]);
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
    const totalAmt = ConvertToNumber(total, 2) + ConvertToNumber(this.advanceTableForm.controls["ContractAmt"].value, 2);
    this.advanceTableForm.controls['TotalTripAmt'].setValue(totalAmt);
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
      convertedDate = convertedDate ? formatDate(convertedDate, 'dd/MM/yyyy') : '';
      this.departvehicleTableForm.controls['Expiry'].setValue(convertedDate);

    }
    // Rest of your code that depends on loadingSheetDetail
  }

  onCalculateTotal(): void {
    // Step 1: Calculate the individual charges and set TotalTripAmt in the advanceTableForm
    // Step 2: Calculate the total advances and set TotalAdv in the balanceTableForm
    calculateTotalAdvances(this.balanceTableForm);

    // Step 3: Calculate the balance amount as the difference between TotalAdv and TotalTripAmt,
    // and set it in the BalanceAmount control of the balanceTableForm
    const totalTripAmt = parseFloat(this.advanceTableForm.controls['TotalTripAmt'].value) || 0;
    calculateBalanceAmount(this.balanceTableForm, totalTripAmt);
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
      templateName: "Manifest View-Print",
      DocNo: event.data?.manifest,
    };
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}
