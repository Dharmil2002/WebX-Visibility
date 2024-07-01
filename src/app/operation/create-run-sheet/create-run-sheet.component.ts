import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RunSheetControl } from 'src/assets/FormControls/RunsheetGeneration';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import { RunSheetService } from 'src/app/Utility/module/operation/runsheet/runsheet.service';
import { VehicleStatusService } from 'src/app/Utility/module/operation/vehicleStatus/vehicle.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { VehicleTypeService } from 'src/app/Utility/module/masters/vehicle-type/vehicle-type-service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { StorageService } from 'src/app/core/service/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMarketVehicleComponent } from '../add-market-vehicle/add-market-vehicle.component';
import { LoadingSheetService } from 'src/app/Utility/module/operation/loadingSheet/loadingsheet-service';
import { VehicleService } from 'src/app/Utility/module/masters/vehicle-master/vehicle-master-service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import { SACInfo, VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { Observable, catchError, firstValueFrom, map, mergeMap, switchMap, throwError } from 'rxjs';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { getApiCompanyDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { CustomerBillStatus } from 'src/app/Models/docStatus';
import { OperationService } from 'src/app/core/service/operations/operation.service';

@Component({
  selector: 'app-create-run-sheet',
  templateUrl: './create-run-sheet.component.html'
})
export class CreateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/create-runsheet-data.json'
  RunSheetTableForm: UntypedFormGroup
  jsonControlArray: any;
  RunSheetTable: any;
  runsheetData: any;
  backPath: string;
  //declaring breadscrum
  orgBranch: string = "";
  breadscrums = [
    {
      title: "Create Run Sheet",
      items: ["Home"],
      active: "Create Run Sheet"
    }
  ]
  data: any;
  tableload = false;
  csv: any[];
  runSheetData: any;
  delType: AutoComplete[];
  addNewTitle: string = "Add Market";
  isMarket: boolean;
  MarketData: any;
  isDisplay: boolean;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(
    private Route: Router,
    private runSheetService: RunSheetService,
    private fb: UntypedFormBuilder,
    private vehStatus: VehicleStatusService,
    private filter: FilterUtils,
    private generalService: GeneralService,
    private vehicleTypeService: VehicleTypeService,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,
    private dialog: MatDialog,
    private loadingSheetService: LoadingSheetService,
    private vehicleService: VehicleService,
    private docketService: DocketService,
    private voucherServicesService: VoucherServicesService,
    private invoiceServiceService: InvoiceServiceService,
    private masterService: MasterService,
    private stateService: StateService,
    private customerService: CustomerService,
    private operationService: OperationService,
  ) {
    this.orgBranch = this.storage.branch;

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.RunSheetTable = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl()
  }
  toggleArray = []
  menuItems = []
  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ["checkBoxRequired"],
  };
  linkArray = []
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    documentId: {
      Title: "Document",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    sFX: {
      Title: "suffix",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    type: {
      Title: "Type",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    customer: {
      Title: "Customer",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    address: {
      Title: "Address",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    pincode: {
      Title: "Pin code",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    packages: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:95px",
    },
    weight: {
      Title: "Weight",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    volume: {
      Title: "Volume",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
  };
  branch = this.storage.branch;

  staticField = [
    "documentId",
    "sFX",
    "type",
    "customer",
    "address",
    "pincode",
    "packages",
    "weight",
    "volume"
  ];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  }
  ngOnInit(): void {
  }

  IntializeFormControl() {
    const RunSheetFormControl = new RunSheetControl();
    this.jsonControlArray = RunSheetFormControl.RunSheetFormControls();
    this.RunSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getShipment();
    this.generalMaster();
  }
  /*below function for docket list which displayed below the form group*/
  async getShipment() {
    const res = await this.runSheetService.shipmentFieldMapping(this.RunSheetTable?.columnData.dktList || "");
    this.csv = res;
    this.isDisplay = true;
    this.autoBindData();
    this.getVehicle();
  }
  /*End*/
  IsActiveFuntion(event) {
    this.runSheetData = event;
  }

  functionCallHandler($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  autoBindData() {
    this.RunSheetTableForm.controls['Cluster'].setValue(this.RunSheetTable?.columnData.Cluster);
  }
  async getVehicle() {
    const res = await this.vehStatus.getAvailableVehicles();
    const data = this.jsonControlArray.find((x) => x.name == "Vehicle")
    this.filter.Filter(
      this.jsonControlArray,
      this.RunSheetTableForm,
      res.map((x) => { return { name: x.vehNo, value: x.vehNo, type: x.vendorType } }),
      data.name,
      data.additionalData.showNameAndValue
    );
  }
  async getVehicleDetails() {

    const fieldName = ["CapacityKg", "CapVol", "Vendor"];
    this.RunSheetTableForm.controls['Vendor'].setValue("")
    this.RunSheetTableForm.controls['CapacityKg'].setValue(0)
    this.RunSheetTableForm.controls['CapVol'].setValue(0)
    if (this.RunSheetTableForm?.value.Vehicle.type != "Market") {
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = true;
        }
        if (x.name == "VehType") {
          x.type = "text"
          x.disable = true
        }
        return x;
      });
      const vehDetails = await this.vehStatus.getVehDetails(this.RunSheetTableForm?.value.Vehicle.value);
      this.RunSheetTableForm.controls['VehType'].setValue(vehDetails?.vehicleType || "")
      this.RunSheetTableForm.controls['CapVol'].setValue(vehDetails?.cft || "")
      this.RunSheetTableForm.controls['CapacityKg'].setValue(parseFloat(vehDetails?.capacity) * 1000 || 0)
      this.RunSheetTableForm.controls['Vendor'].setValue(vehDetails?.vendorName || "")
    }
    else {
      const res = await this.vehicleTypeService.getVehicleTypeList();
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = false;
        }
        if (x.name == "VehType") {
          x.type = "Staticdropdown",
            x.disable = false,
            x.value = vehicleType
        }
        return x;
      });

    }

    this.RunSheetTableForm.controls['VenType'].setValue(this.RunSheetTableForm?.value.Vehicle.type || "")
  }
  selectCheckBox(event) {
    this.getCapacity();
  }
  getCapacity() {
    this.RunSheetTableForm.controls['LoadKg'].setValue(0);
    this.RunSheetTableForm.controls['LoadVol'].setValue(0);
    this.RunSheetTableForm.controls['WeightUti'].setValue(0);
    this.RunSheetTableForm.controls['VolUti'].setValue(0);
    // Calculate the previously loaded values from the form
    let loadedKgInput = parseInt(this.RunSheetTableForm.value?.LoadKg || 0);
    let loadedCftInput = parseInt(this.RunSheetTableForm.value?.LoadVol || 0);
    // Initialize these variables to zero
    let loadAddedKg = 0;
    let volAddedCft = 0;
    const processedShipment = new Set();
    this.csv.forEach(element => {
      if (element?.isSelected) {
        // Check if the leg has been processed already
        if (!processedShipment.has(element?.documentId)) {
          const weightKg = parseInt(element?.weight) || 0;
          const volumeCFT = parseInt(element?.volume) || 0;
          loadAddedKg += isNaN(weightKg) ? 0 : weightKg;
          volAddedCft += isNaN(volumeCFT) ? 0 : volumeCFT;
          // Mark the leg as processed
          processedShipment.add(element?.documentId);
        }
      }
    });

    // Calculate the total loaded values, including previously loaded values
    loadedKgInput += loadAddedKg;
    loadedCftInput += volAddedCft;

    // Set NaN values to 0
    loadedKgInput = isNaN(loadedKgInput) ? 0 : loadedKgInput;
    loadedCftInput = isNaN(loadedCftInput) ? 0 : loadedCftInput;

    // Assuming `loadedKg` is another form control that holds the loaded weight in kilograms
    let loadedKg = parseFloat(`${loadedKgInput}`); // Get the loaded weight in kilograms
    // Convert loaded kilograms to tons (since 1 ton = 1000 kilograms)
    let loadedTons = loadedKg / 1000;

    // Now, calculate the percentage of the capacity that is loaded
    let capacityTons = parseFloat(this.RunSheetTableForm.controls['CapacityKg'].value); // Assuming this is actually the capacity in KG and needs conversion

    // Convert capacity from kilograms to tons if necessary
    capacityTons = capacityTons / 1000; // Convert to tons if the form actually holds kg instead of tons

    let percentage = (loadedTons * 100) / capacityTons;
    // Update the form controls with the calculated values
    this.RunSheetTableForm.controls['LoadKg'].setValue(isNaN(loadAddedKg) ? 0 : loadAddedKg);
    this.RunSheetTableForm.controls['LoadVol'].setValue(isNaN(volAddedCft) ? 0 : volAddedCft);
    this.RunSheetTableForm.controls['WeightUti'].setValue(isNaN(percentage) ? 0 : percentage.toFixed(2));
    const volumeUtilization = loadedCftInput * 100 / parseFloat(this.RunSheetTableForm.controls['CapVol'].value);
    this.RunSheetTableForm.controls['VolUti'].setValue(isNaN(volumeUtilization) ? 0 : volumeUtilization.toFixed(2));
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
      this.csv.forEach((loadingItem) => {
        this.csv = this.csv.map((tableItem) => {
          if (loadingItem.documentId === tableItem.documentId) {
            return { ...tableItem, isSelected: false };
          }
          return tableItem;
        });
      });


    }


  }
  async checkIsMarketVehicle() {
    const fieldName = ["CapacityKg", "CapVol", "Vendor", "VenType", "vendPan", "VehType"];
    if (typeof (this.RunSheetTableForm.controls['Vehicle'].value) == "string") {
      const res = await this.vehicleTypeService.getVehicleTypeList();
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.RunSheetTableForm.controls['VehType'].setValue("");
      this.RunSheetTableForm.controls['Vendor'].setValue("");
      this.RunSheetTableForm.controls['VenType'].setValue("");
      this.RunSheetTableForm.controls['vendPan'].setValue("");
      this.RunSheetTableForm.controls['driverNm'].setValue("");
      this.RunSheetTableForm.controls['driverMobile'].setValue("");
      this.RunSheetTableForm.controls['lsNo'].setValue("");
      this.RunSheetTableForm.controls['lcExpireDate'].setValue("");
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = false
        }
        if (fieldName.includes(x.name) && x.name == "VehType") {
          x.type = "Staticdropdown"
          x.value = vehicleType
          x.disable = false
        }
        return x;
      });
      this.RunSheetTableForm.controls['VenType'].setValue("Market");
    }



  }
  async GenerateRunsheet() {
    // Get Selected Dockets Details from the api
    const DocketNoList = this.csv.filter(x => x.isSelected).map(x => x.dKTNO);
    const filter = {
      dKTNO: {
        D$in: DocketNoList
      },
      pAYTYP: "P03",
      cID: this.storage.companyCode
    };
    const docketdetails = await this.docketService.getDocketListForBilling(filter);
    if (!this.csv.some((x) => x.isSelected)) {
      // If no item has isSelected set to true, return or perform any desired action.
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
      // this.ObjSnackBarUtility.ShowCommonSwal1('error', 'Please select atleast one Cluster to generate Runsheet!', false, false, false);
      return;
    }
    this.snackBarUtilityService.commonToast(async () => {
      const formData = this.RunSheetTableForm.getRawValue();
      if (formData.VenType == "Market") {
        try {
          if (this.isMarket && this.MarketData) {
            const reqBody = await this.loadingSheetService.requestVehicle(this.MarketData)
            await this.vehicleService.updateOrCreateVehicleStatus(reqBody);
          }
          else {
            await this.vehicleService.updateVehicleCap(formData, true);
          }
        } catch (e) {
        }
      }
      formData['deliveryTypeName'] = this.delType.find((x) => x.value == formData.deliveryType).name;
      const res = await this.runSheetService.drsFieldMapping(this.RunSheetTableForm.value, this.csv);
      const runSheetNo = await this.runSheetService.addRunSheet(res);
      const Response = [];
      if (docketdetails.length > 0) {
        const jsonData = docketdetails;
        // Do Customer Invoice Generation
        for (let i = 0; i < jsonData.length; i++) {
          const data = jsonData[i];
          const BillResult = await this.AutoCustomerInvoicing(data);
          const ResultObject = {
            BillNo: BillResult,
            Status: "Success"
          };
          Response.push(ResultObject);
        }
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Run Sheet generated Successfully ${runSheetNo}`,
          showConfirmButton: true,
        })
        this.goBack('Delivery')
      } else {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Run Sheet generated Successfully ${runSheetNo}`,
          showConfirmButton: true,
        })
        this.goBack('Delivery')
      }

    }, "Run Sheet generated Successfully")

  }
  async generalMaster() {
    this.delType = await this.generalService.getGeneralMasterData("RUNDELTYP");
    const delType = this.delType.find((x) => x.name == "Delivery");
    setGeneralMasterData(this.jsonControlArray, this.delType, "deliveryType");
    this.RunSheetTableForm.controls['deliveryType'].setValue(delType.value)
    this.RunSheetTableForm.controls['deliveryType'].disable();

  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  /*Add Market Vehicle */
  addMarket() {
    const dialogref = this.dialog.open(AddMarketVehicleComponent, {
      data: "ltl",
    });
    dialogref.afterClosed().subscribe((result) => {
      console.log(result)
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
  //#region bind Vehicle Data if it is market 
  autoBindMarketVehicleData(result) {
    if (result) {
      this.RunSheetTableForm.controls['Vehicle'].setValue({ name: result?.vehicelNo || "", value: result?.vehicelNo || "" });
      this.RunSheetTableForm.controls['VehType'].setValue(result.vehicleType.name);
      this.RunSheetTableForm.controls['VenType'].setValue("Market");
      this.RunSheetTableForm.controls['Vendor'].setValue(result?.vendor || "");
      this.RunSheetTableForm.controls['vendPan'].setValue(result?.venPan || "");
      this.RunSheetTableForm.controls['driverNm'].setValue(result?.driver || "");
      this.RunSheetTableForm.controls['driverMobile'].setValue(result?.dmobileNo || "");
      this.RunSheetTableForm.controls['lsNo'].setValue(result?.lcNo || "");
      this.RunSheetTableForm.controls['lcExpireDate'].setValue(result?.lcExpireDate || "");
      this.RunSheetTableForm.controls['CapVol'].setValue(result.vehicleSizeVol);
      const vehicleSizeKG = result.vehicleSize ? parseInt(result.vehicleSize) * 1000 : 0;
      this.RunSheetTableForm.controls['CapacityKg'].setValue(vehicleSizeKG);

    }
  }
  //#end region

  //#region Auto Customer Invoicing for Paid  GCN WT-930
  async AutoCustomerInvoicing(RequestData) {
    // STEP 1: Get the required data from the form
    const DocketNo = RequestData.docNo;
    const customerCode = RequestData?.bPARTY;
    const customerName = RequestData?.bPARTYNM;
    // STEP 2: Prepare the request body For For Approve GCN And Call the API
    const DocketStatusResult = this.invoiceServiceService.updateShipmentStatus(DocketNo, "LTL");
    if (DocketStatusResult) {
      // STEP 3: Prepare the request body For Customer Bill Generation And Call the API
      const custList = await this.customerService.customerFromFilter({ customerCode: customerCode }, false);
      const CustomerDetails = custList[0];
      const custGroup = await this.customerService.customerGroupFilter(CustomerDetails?.customerGroup);
      const tranDetail = await getApiCompanyDetail(this.masterService);
      const gstAppliedList = await this.stateService.checkGst(tranDetail?.data[0].gstNo, RequestData?.cSGN?.gST);
      const gstTypes = Object.fromEntries(
        Object.entries(gstAppliedList).filter(([key, value]) => value === true)
      )
      let jsonBillingList = [
        {
          _id: "",
          bILLNO: "",
          dKTNO: DocketNo,
          cID: this.storage.companyCode,
          oRGN: RequestData?.oRGN || "",
          dEST: RequestData?.dEST || "",
          dKTDT: RequestData?.dKTDT || new Date(),
          cHRGWT: RequestData?.cHRWT || 0.00,
          dKTAMT: RequestData?.fRTAMT || 0.00,
          dKTTOT: RequestData?.gROAMT || 0.00,
          sUBTOT: RequestData?.gROAMT || 0.00,
          gSTTOT: RequestData?.gSTCHAMT || 0.00,
          gSTRT: RequestData?.gSTRT || 0.00,
          tOTAMT: RequestData?.tOTAMT || 0.00,
          fCHRG: RequestData?.fRTRT || 0.00,
          sGST: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) / 2 : 0,
          sGSTRT: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData.gSTRT || 0) / 2 : 0,
          cGST: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) / 2 : 0,
          cGSTRT: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData.gSTRT || 0) / 2 : 0,
          uTGST: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) : 0,
          uTGSTRT: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData.gSTRT || 0) : 0,
          iGST: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) : 0,
          iGSTRT: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData.gSTRT || 0) : 0,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch || "",
          eNTBY: this.storage?.userName || "",
        }];
      const billData = {
        "_id": `${this.storage.companyCode}` || "",
        "cID": this.storage.companyCode,
        "companyCode": this.storage.companyCode,
        "dOCTYP": "Transaction",
        "dOCCD": "T",
        "bUSVRT": "LTL",
        "bILLNO": "",
        "bGNDT": new Date(),
        "bDUEDT": new Date(),
        "bLOC": this.storage.branch,
        "pAYBAS": RequestData?.pAYTYP,
        "tRNMODE": RequestData?.tRNMOD,
        "bSTS": CustomerBillStatus.Submitted,
        "bSTSNM": CustomerBillStatus[CustomerBillStatus.Submitted],
        "bSTSDT": new Date(),
        "eXMT": RequestData?.rCM == "Y" ? true : false,
        "eXMTRES": "",
        "gEN": {
          "lOC": RequestData?.oRGN || "",
          "cT": RequestData?.fCT || "",
          "sT": "",
          "gSTIN": "",
        },
        "sUB": {
          "lOC": this.storage.branch,
          "tO": customerName,
          "tOMOB": CustomerDetails?.customer_mobile || "",
          "dTM": RequestData?.dKTDT || new Date(),
          "dOC": ""
        },
        "cOL": {
          "lOC": "",
          "aMT": 0.00,
          "bALAMT": RequestData?.tOTAMT || 0.00,
        },
        "cUST": {
          "cD": customerCode,
          "nM": customerName,
          "tEL": CustomerDetails?.customer_mobile || "",
          "aDD": CustomerDetails?.RegisteredAddress || "",
          "eML": CustomerDetails?.Customer_Emails || "",
          "cT": CustomerDetails?.city || "",
          "sT": CustomerDetails?.state || "",
          "gSTIN": CustomerDetails?.GSTdetails ? CustomerDetails?.GSTdetails?.[0]?.gstNo : "",
          "cGCD": custGroup?.groupCode || "",
          "cGNM": custGroup?.groupName || "",
        },
        "gST": {
          "tYP": Object.keys(gstTypes).join() || "",
          "rATE": RequestData?.gSTRT || 0.00,
          "iGST": 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) : 0,
          "uTGST": 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) : 0,
          "cGST": 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) / 2 : 0,
          "sGST": 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(RequestData?.gSTCHAMT) / 2 : 0,
          "aMT": RequestData?.gSTCHAMT || 0.00,
        },
        "aPR": {
          "loc": this.storage.branch,
          "aDT": new Date(),
          "aBY": this.storage.userName,
        },
        "sUPDOC": "",
        "pRODID": RequestData?.tRNMOD || "",
        "dKTCNT": 1,
        "CURR": "INR",
        "dKTTOT": RequestData?.tOTAMT || 0.00,
        "gROSSAMT": RequestData?.tOTAMT || 0.00,
        "rOUNOFFAMT": 0.00,
        "aMT": RequestData?.tOTAMT || 0.00,
        "custDetails": jsonBillingList,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName,
      }
      const req = {
        companyCode: this.storage.companyCode,
        docType: "BILL",
        branch: this.storage.branch,
        finYear: financialYear,
        party: customerName.toUpperCase(),
        collectionName: "cust_bill_headers",
        data: billData
      };
      const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/create", req));
      if (res) {
        if (res.success) {
          const BillNo = res.data.ops[0].docNo;
          const Result = await firstValueFrom(this.AccountPostingForAutoBilling(billData, BillNo));
          console.log(Result);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
            showConfirmButton: false,
          });
        }
      }

    }
  }
  // Account Posting When  When Bill Has been Generated/ Finalized	
  AccountPostingForAutoBilling(billData, BillNo): Observable<any> {
    const TotalAmount = billData?.aMT || 0;
    const GstAmount = billData?.gST?.aMT || 0;
    debugger

    this.VoucherRequestModel.companyCode = this.storage.companyCode;
    this.VoucherRequestModel.docType = "VR";
    this.VoucherRequestModel.branch = this.storage.branch;
    this.VoucherRequestModel.finYear = financialYear;

    this.VoucherDataRequestModel.voucherNo = "";
    this.VoucherDataRequestModel.transCode = VoucherInstanceType.BillApproval;
    this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BillApproval];
    this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
    this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
    this.VoucherDataRequestModel.transDate = new Date();
    this.VoucherDataRequestModel.docType = "VR";
    this.VoucherDataRequestModel.branch = this.storage.branch;
    this.VoucherDataRequestModel.finYear = financialYear;

    this.VoucherDataRequestModel.accLocation = this.storage.branch;
    this.VoucherDataRequestModel.preperedFor = "Customer";
    this.VoucherDataRequestModel.partyCode = billData?.cUST?.cD || "";
    this.VoucherDataRequestModel.partyName = billData?.cUST?.nM || "";
    this.VoucherDataRequestModel.partyState = billData?.cUST?.sT || "";
    this.VoucherDataRequestModel.entryBy = this.storage.userName;
    this.VoucherDataRequestModel.entryDate = new Date();
    this.VoucherDataRequestModel.panNo = "";

    this.VoucherDataRequestModel.tdsSectionCode = "";
    this.VoucherDataRequestModel.tdsSectionName = "";
    this.VoucherDataRequestModel.tdsRate = 0;
    this.VoucherDataRequestModel.tdsAmount = 0;
    this.VoucherDataRequestModel.tdsAtlineitem = false;
    this.VoucherDataRequestModel.tcsSectionCode = "";
    this.VoucherDataRequestModel.tcsSectionName = "";
    this.VoucherDataRequestModel.tcsRate = 0;
    this.VoucherDataRequestModel.tcsAmount = 0;

    this.VoucherDataRequestModel.IGST = billData?.gST?.iGST || 0;
    this.VoucherDataRequestModel.SGST = billData?.gST?.sGST || 0;
    this.VoucherDataRequestModel.CGST = billData?.gST?.cGST || 0;
    this.VoucherDataRequestModel.UGST = billData?.gST?.uTGST || 0;
    this.VoucherDataRequestModel.GSTTotal = GstAmount;

    this.VoucherDataRequestModel.GrossAmount = TotalAmount || 0;
    this.VoucherDataRequestModel.netPayable = TotalAmount;
    this.VoucherDataRequestModel.roundOff = 0;
    this.VoucherDataRequestModel.voucherCanceled = false;
    this.VoucherDataRequestModel.transactionNumber = BillNo;
    this.VoucherDataRequestModel.paymentMode = "";
    this.VoucherDataRequestModel.refNo = "";
    this.VoucherDataRequestModel.accountName = "";
    this.VoucherDataRequestModel.accountCode = "";
    this.VoucherDataRequestModel.date = "";
    this.VoucherDataRequestModel.scanSupportingDocument = "";

    const VoucherlineitemList = this.GetVouchersLedgersForAutoBilling(billData, BillNo);

    this.VoucherRequestModel.details = VoucherlineitemList;
    this.VoucherRequestModel.data = this.VoucherDataRequestModel;
    this.VoucherRequestModel.debitAgainstDocumentList = [];
    return this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        const reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: new Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.BillApproval,
          transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
          voucherCode: VoucherType.JournalVoucher,
          voucherType: VoucherType[VoucherType.JournalVoucher],
          docType: "Voucher",
          partyType: "Customer",
          docNo: BillNo,
          partyCode: billData?.cUST?.cD || "",
          partyName: billData?.cUST?.nM || "",
          entryBy: this.storage.userName,
          entryDate: new Date(),
          debit: VoucherlineitemList.filter(item => item.credit === 0).map(item => ({
            accCode: item.accCode,
            accName: item.accName,
            accCategory: item.accCategory,
            amount: item.debit,
            narration: item.narration ?? ""
          })),
          credit: VoucherlineitemList.filter(item => item.debit === 0).map(item => ({
            accCode: item.accCode,
            accName: item.accName,
            accCategory: item.accCategory,
            amount: item.credit,
            narration: item.narration ?? ""
          })),
        };
        return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }
  GetVouchersLedgersForAutoBilling(billData, BillNo) {
    const TotalAmount = billData?.aMT;
    const GstAmount = billData?.gST?.aMT;
    const GstRate = billData?.gST?.rATE;
    const DocketAmount = parseFloat(billData?.dKTTOT) - parseFloat(billData?.gST?.aMT);

    const createVoucher = (accCode, accName, accCategory, debit, credit, sacInfo = "",) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BillApproval,
      transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacInfo ? SACInfo['996511'].sacCode : "",
      sacName: sacInfo ? SACInfo['996511'].sacName : "",
      debit,
      credit,
      GSTRate: sacInfo ? GstRate : 0,
      GSTAmount: sacInfo ? GstAmount : 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill freight is Generated :${BillNo}`,
    });

    const response = [
      createVoucher(ledgerInfo['AST001002'].LeadgerCode, ledgerInfo['AST001002'].LeadgerName, ledgerInfo['AST001002'].LeadgerCategory, TotalAmount, 0),
    ];
    let LeadgerDetails;
    switch (billData?.pRODID) {
      case "P1":
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
      case "P2":
        LeadgerDetails = ledgerInfo['INC001004'];
        break;
      case "P3":
        LeadgerDetails = ledgerInfo['INC001002'];
        break;
      case "P4":
        LeadgerDetails = ledgerInfo['INC001001'];
        break;
      default:
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
    }
    // Income Ledger
    if (LeadgerDetails) {
      response.push(createVoucher(LeadgerDetails.LeadgerCode, LeadgerDetails.LeadgerName, LeadgerDetails.LeadgerCategory, 0, DocketAmount));
    }

    const gstTypeMapping = {
      UGST: { accCode: ledgerInfo['LIA002002'].LeadgerCode, accName: ledgerInfo['LIA002002'].LeadgerName, accCategory: ledgerInfo['LIA002002'].LeadgerCategory, prop: "uGST" },
      cGST: { accCode: ledgerInfo['LIA002003'].LeadgerCode, accName: ledgerInfo['LIA002003'].LeadgerName, accCategory: ledgerInfo['LIA002003'].LeadgerCategory, prop: "cGST" },
      IGST: { accCode: ledgerInfo['LIA002004'].LeadgerCode, accName: ledgerInfo['LIA002004'].LeadgerName, accCategory: ledgerInfo['LIA002004'].LeadgerCategory, prop: "iGST" },
      SGST: { accCode: ledgerInfo['LIA002001'].LeadgerCode, accName: ledgerInfo['LIA002001'].LeadgerName, accCategory: ledgerInfo['LIA002001'].LeadgerCategory, prop: "sGST" },
    };

    const gstType = billData?.gST?.tYP;
    const GSTTypeList = [gstType]
    GSTTypeList.forEach(element => {
      if (gstType && gstTypeMapping[element]) {
        const { accCode, accName, accCategory, prop } = gstTypeMapping[element];
        if (billData?.gST?.[prop] > 0) {
          response.push(createVoucher(accCode, accName, accCategory, 0, billData?.gST?.[prop], '996511'));
        }
      }
    });
    return response;
  }
  //#endregion
}
