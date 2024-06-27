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
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private runSheetService: RunSheetService,
    private controlPanel: ControlPanelService,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private navigationService: NavigationService,
    private definition: RunSheet
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
    this.updateSheetTableForm.controls['Departuretime'].setValue('')
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
   const selected= this.csv.filter((x)=>x.isSelected);
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
    // Get only the "Scan" control
    this.Scan = this.UpdaterunControlArray.filter((x) => x.name == "Scan");
    this.updateSheetTableForm = formGroupBuilder(this.fb, [this.UpdaterunControlArray]);
    this.getRules();
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
    this.snackBarUtilityService.commonToast(async () => {
      const res = await this.runSheetService.UpdateRunSheet(this.updateSheetTableForm.value, this.csv, this.packageList,this.isScan);
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
        else{
          element.pending = element.packages;
          element.loaded = 0;
        }
      });
    }
    this.tableload=true;
    this.tableload=false;
    this.cdr?.detectChanges();
    this.kpiData();
  }
  /*End*/
}
