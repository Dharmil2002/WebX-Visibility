import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UpdateloadingRunControl } from '../../../assets/FormControls/UpdateRunsheet';
import Swal from 'sweetalert2';
import { RunSheetService } from 'src/app/Utility/module/operation/runsheet/runsheet.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { RunSheet } from 'src/app/Models/Run-sheet/run-sheet';
import { AdvanceControl, BalanceControl, DepartVehicleControl } from 'src/assets/FormControls/departVehicle';
import { calculateBalanceAmount, calculateTotalAdvances } from '../depart-vehicle/depart-vehicle/depart-common';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { FormControls } from 'src/app/core/models/FormControl/formcontrol';
import { debug } from 'console';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-run-sheet',
  templateUrl: './update-run-sheet.component.html'
})

export class UpdateRunSheetComponent implements OnInit {
  tableload = true;
  csv: any[];
  branch = "";
  data: [] | any;
  tripData: any;
  scanPackage: string;
  scanMessage: string = '';
  tabledata: any;
  isScan: boolean = true;
  backPath: string;
  containerWidth = '50%';
  updateSheetTableForm: UntypedFormGroup
  UpdaterunControlArray: any;
  selectAllRequired: boolean = true;
  centerAlignedData = ['packages', 'loaded', 'pending'];
  columnHeader = {
    shipment: {
      Title: "Shipments",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    packages: {
      Title: "Packages",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    loaded: {
      Title: "Loaded",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    pending: {
      Title: "Pending",
      class: "matcolumncenter",
      Style: "min-width:20%",
    }
  };
  staticField = [
    "shipment",
    "packages",
    "loaded",
    "pending"
  ];
  //declaring breadscrum
  breadscrums = [
    {
      title: "Update Run Sheet",
      items: ["Home"],
      active: "Update Run Sheet"
    }
  ]
  toggleArray = []
  menuItems = []
  linkArray = []
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  @ViewChild('scanPackageInput') scanPackageInput: ElementRef;
  loadingData: any;
  formdata: any;
  arrivalData: any;
  dialogRef: any;
  boxData: { count: number; title: string; class: string; }[];
  runsheetDetails: any;
  updateRunSheetData: any;
  Scan: any;
  packageList: any;
  menuItemflag: boolean = true;
  rules: any;
  metaData: { checkBoxRequired: boolean; noColumnSort: string[]; };
  advanceControlArray: FormControls[];
  balanceControlArray: FormControls[];
  advanceTableForm: UntypedFormGroup;
  balanceTableForm: UntypedFormGroup;
  departvehicleTableForm: UntypedFormGroup;
  departControlArray:FormControls[];
  DocCalledAs
  isSubmit: boolean;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private runSheetService: RunSheetService,
    private controlPanel: ControlPanelService,
    private storage: StorageService,
    private locationService: LocationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private navigationService: NavigationService,
    private thcService: ThcService,
    private definition: RunSheet,
    private filter: FilterUtils
  ) {
    this.metaData = {
      checkBoxRequired: true,
      noColumnSort: Object.keys(this.definition.columnHeader),
    }
    this.branch = this.storage.branch;
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
      if (this.Route.getCurrentNavigation()?.extras?.state.data.columnData.oPSST == 2) {
        this.navigationService.navigateTo("Operation/UpdateDelivery", this.tripData);
      }
    }

    this.IntializeFormControl()
    this.autoBindData();
  }
  autoBindData() {
    this.updateSheetTableForm.controls['Vehicle'].setValue(this.tripData?.columnData.vehicleNo || '')
    this.updateSheetTableForm.controls['Cluster'].setValue(this.tripData?.columnData.Cluster || '')
    this.updateSheetTableForm.controls['Runsheet'].setValue(this.tripData?.columnData.RunSheet || '')
    this.updateSheetTableForm.controls['LoadingLocation'].setValue(this.branch || '')
    this.updateSheetTableForm.controls['Startkm'].setValue(0)
    this.departvehicleTableForm.controls['VendorType'].setValue(this.tripData?.columnData?.vND?.tYPNM);
    this.departvehicleTableForm.controls['Vendor'].disable();
    this.departvehicleTableForm.controls['VendorType'].disable();
    this.departvehicleTableForm.controls['Vendor'].setValue(this.tripData?.columnData?.vND?.nM)
    this.departvehicleTableForm.controls['Driver'].setValue(this.tripData?.columnData?.dRV?.nM)
    this.departvehicleTableForm.controls['Driver'].disable();
    this.departvehicleTableForm.controls['DriverMob'].setValue(this.tripData?.columnData?.dRV?.mNO)
    this.departvehicleTableForm.controls['DriverMob'].disable();
    this.departvehicleTableForm.controls['License'].setValue(this.tripData?.columnData?.dRV?.lNO)
    this.departvehicleTableForm.controls['License'].disable();
    this.departvehicleTableForm.controls['Expiry'].setValue(this.tripData?.columnData?.dRV?.lEDT)
    this.departvehicleTableForm.controls['Expiry'].disable();
    // this.departvehicleTableForm.controls['chasisNo'].setValue('')
    // this.departvehicleTableForm.controls['engineNo'].setValue('')
    // this.departvehicleTableForm.controls['inExdt'].setValue('')
    // this.departvehicleTableForm.controls['fitdt'].setValue('')
    // this.departvehicleTableForm.controls['vehRegDate'].setValue('')
    this.getShipmentData();
  }
  async getShipmentData() {
    const res = await this.runSheetService.drsShipmentDetails(this.tripData.columnData.RunSheet);
    const dktNo = res?.map((x) => x.dKTNO);
    this.packageList = await this.runSheetService.drsShipmetPkgs({ cID: this.storage.companyCode, dKTNO: { "D$in": dktNo }, sFX: 0 });
    const shipmentData = await this.runSheetService.FieldMappingRunSheetdkts(res);
    this.csv = shipmentData;
    this.tableload = false;
    this.kpiData()
  }
  ngOnInit(): void {
    this.backPath = "/dashboard/Index";
  }
  async getRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: "Scanning",
      aCTIVE: true
    }
    const res = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.rules = res;
      this.checkDocketRules();
    }

  }
  checkDocketRules() {
    this.isScan = this.rules.find(x => x.rULEID == "SCAN" && x.aCTIVE)?.vAL == "Y" ? true : false;
  }
  kpiData() {
    let packages = 0;
    let shipingloaded = 0;
    this.csv.forEach((element, index) => {
      packages = element.packages + packages
      shipingloaded = element.loaded + shipingloaded;
    });
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });
    const selected = this.csv.filter((x) => x.isSelected);
    const pkgs = selected.length > 0 ? selected.reduce((x, y) => x + y.packages, 0) : 0;
    const shipData = [
      createShipDataObject(this.csv.length, "Shipments", "bg-c-Bottle-light"),
      createShipDataObject(packages, "Packages", "bg-c-Grape-light"),
      createShipDataObject(selected.length || 0, "Shipments Loaded", "bg-c-Daisy-light"),
      createShipDataObject(pkgs || 0, "Packages Loaded", "bg-c-Grape-light"),
    ];

    this.boxData = shipData;
  }
  IntializeFormControl() {

    const UpdaterunsheetFormControl = new UpdateloadingRunControl();
    this.UpdaterunControlArray = UpdaterunsheetFormControl.getupdaterunsheetFormControls();
    // Filter out the "Scan" control from the update list
    this.updateRunSheetData = this.UpdaterunControlArray.filter((x) => x.name != "Scan");
    const AdvanceControls = new AdvanceControl();
    this.advanceControlArray = AdvanceControls.getAdvanceFormControls();
    const BalanceControls = new BalanceControl();
    this.balanceControlArray = BalanceControls.getBalanceFormControls();
    const DepartVehicleControls = new DepartVehicleControl();
    this.departControlArray =
      DepartVehicleControls.getDepartVehicleFormControls();
    // Get only the "Scan" control
    this.Scan = this.UpdaterunControlArray.filter((x) => x.name == "Scan");
    this.updateSheetTableForm = formGroupBuilder(this.fb, [this.UpdaterunControlArray]);
    this.advanceTableForm = formGroupBuilder(this.fb, [
      this.advanceControlArray,
    ]);
    this.departvehicleTableForm = formGroupBuilder(this.fb, [
      this.departControlArray,
    ]);
    this.balanceTableForm = formGroupBuilder(this.fb, [
      this.balanceControlArray,
    ]);
    this.getRules();
    this.getCharges("Road");
  }
  IsActiveFuntion($event) {
    this.loadingData = $event
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

  async getCharges(prod) {
    this.advanceControlArray = this.advanceControlArray.filter((x) => !x.hasOwnProperty('id'));
    const filter = { "pRNm": prod, aCTV: true, cHBTY: { D$in: ["Delivery", "Both"] } }
    const productFilter = { "cHACAT": { "D$in": ['V', 'B'] }, "pRNM": prod, cHATY: "Charges", "cHAPP": { D$in: ["DRS"] }, isActive: true }
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
  async CompleteScan() {
    let packageChecked = false;
    const exists = this.csv.some(obj => obj.hasOwnProperty("loaded"));
    if (exists) {
      packageChecked = this.csv.some(obj => obj.packages === obj.loaded);
    }
    if (packageChecked) {
      await this.DepartDelivery();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "load Package",
        text: `Please load All  Your Package`,
        showConfirmButton: true,
      })
    }

  }
  updatePackage() {
    this.tableload = true;
    // Get the trimmed values of scan and leg
    if (this.scanPackage) {
      const scanValue = this.scanPackage;
      // Find the unload package based on scan and leg values
      const loading = this.runSheetService.handlePackageUpdate(scanValue, this.packageList, this.csv, this.cdr)
      if (loading) {
        const { status, ...options } = loading;
        if (!status) {
          this.scanMessage = options.text;
        }
        else {
          this.scanMessage = '';
          this.kpiData();
        }
      }
      this.cdr.detectChanges(); // Trigger change detection
      this.tableload = false;
      this.clearAndFocusOnScan();
    }
    else {
      this.scanMessage = `Please Enter Package No`;
      this.clearAndFocusOnScan();
      return;
    }
  }
  clearAndFocusOnScan() {
    this.scanPackage = '';
    this.scanPackageInput.nativeElement.focus();
  }
  async DepartDelivery() {
    if (!this.updateSheetTableForm.valid || !this.balanceTableForm.valid || !this.advanceTableForm.valid || !this.departvehicleTableForm.valid || this.isSubmit) {
      this.updateSheetTableForm.markAllAsTouched();
      this.balanceTableForm.markAllAsTouched();
      this.advanceTableForm.markAllAsTouched();
      this.departvehicleTableForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    let charges = [];

    this.balanceTableForm.controls['balAmtAt'].setValue(this.balanceTableForm.controls['balAmtAt'].value?.value || "");
    this.balanceTableForm.controls['advPdAt'].setValue(this.balanceTableForm.controls['advPdAt'].value?.value || "");
    let formData = { ...this.updateSheetTableForm.getRawValue(), ...this.balanceTableForm.getRawValue(), ...this.advanceTableForm.getRawValue(), ...this.departvehicleTableForm.getRawValue() }
    try {
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
    }
    catch (error) {
      if (!environment.production) {
        console.log(error)
      }
    }
    formData['cHG'] = charges
    this.snackBarUtilityService.commonToast(async () => {
      this.isSubmit = true;
      const res = await this.runSheetService.UpdateRunSheet(formData, this.csv, this.packageList, this.isScan);
      Swal.fire({
        icon: "success",
        title: "RunSheet Update Successfully",
        text: `RunSheet Update Successfully with ${this.updateSheetTableForm.value.Runsheet}`,
        showConfirmButton: true,
      })
      this.goBack('Delivery');
    }, "RunSheet Departure Successfully");


  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  /*below is the code for the non-scanning block*/
  OnLoading() {
    if (this.csv && this.csv.length > 0) {
      this.csv.forEach(element => {
        if (element.isSelected) {
          element.loaded = element.packages;
          element.pending = 0;
        }
        else {
          element.pending = element.packages;
          element.loaded = 0;
        }
      });
    }
    this.tableload = true;
    this.tableload = false;
    this.cdr?.detectChanges();
    this.kpiData();
  }
  /*End*/
  onCalculateTotal(): void {
    
    // Step 2: Calculate the total advances and set TotalAdv in the balanceTableForm
    calculateTotalAdvances(this.balanceTableForm);
    // Step 3: Calculate the balance amount as the difference between TotalAdv and TotalTripAmt,
    // and set it in the BalanceAmount control of the balanceTableForm
    const totalTripAmt = parseFloat(this.advanceTableForm.controls['TotalTripAmt'].value) || 0;
    calculateBalanceAmount(this.balanceTableForm, totalTripAmt);
  }
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
}
