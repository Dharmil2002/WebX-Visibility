
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ContractNonFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/NonFreightMatrix-control";
import { updatePending } from '../../../../operation/update-loading-sheet/loadingSheetshipment';

interface CurrentAccessListType {
  productAccess: string[];
}
const fieldsToSearch = ['PIN', 'CT', 'STNM', 'ZN'];
@Component({
  selector: 'app-customer-contract-non-freight-charges',
  templateUrl: './customer-contract-non-freight-charges.component.html',
})
export class CustomerContractNonFreightChargesComponent implements OnInit {
  @Input() contractData: any;
  showFiller = false;
  companyCode: number | null
  //#region Form Configration Fields
  ContractNonFreightMatrixControls: ContractNonFreightMatrixControl;
  NonFreightMatrixForm: UntypedFormGroup;
  jsonControlArrayNonFreightMatrix: any;

  NonFreightChargesForm: UntypedFormGroup;
  jsonControlArrayNonFreightCharges: any;
  AlljsonControlArrayNonFreightCharges: any;

  productsclassName = "col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2";
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";

  //#region Array List
  CurrentAccessList: any
  StateList: any;
  PinCodeList: any
  //#endregion

  isDrawerOpen: boolean = false;
  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  IsChargeMatrix: boolean = true
  tableData: any = [];
  chargestableData: any[];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]

  columnHeader = {
    From: {
      Title: "From",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    To: {
      Title: "To",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    Rate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MinValue: {
      Title: "Min Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MaxValue: {
      Title: "Max Value",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  ChargescolumnHeader = {
    selectCharges: {
      Title: "Select Charges",
      class: "matcolumnfirst",
    },
    ChargesBehaviour: {
      Title: "Select Behaviour",
      class: "matcolumncenter",
    },
    Charges: {
      Title: "Charges",
      class: "matcolumncenter",
      type: "iconorvalue",
      functionName: "addCharges",
      iconName: "add_circle_outline",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  staticField =
    [
      'From',
      'To',
      'rateType',
      'Rate',
      'MinValue',
      'MaxValue',
    ]
  ChargesstaticField =
    [
      'selectCharges',
      'ChargesBehaviour',
      //'Charges',
    ]

  //#endregion
  protected _onDestroy = new Subject<void>();

  //#endregion
  constructor(private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      productAccess: ['loadType', 'rateType', 'originRateOption', 'destinationRateOption', 'originRateOptionHandler', 'destinationRateOptionHandler']
    } as CurrentAccessListType;
  }
  //#endregion
  ngOnInit() {
    this.getAllMastersData();
  }
  /*get all Master Details*/
  async getAllMastersData() {
    try {
      const stateReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "state_master",
      };
      const pincodeReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      this.StateList = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
      this.PinCodeList = await this.masterService.masterPost('generic/get', pincodeReqBody).toPromise();
      this.PinCodeList.data = this.ObjcontractMethods.GetMergedData(this.PinCodeList, this.StateList, 'ST')
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    let data = {
      "Customer": changes.contractData?.currentValue?.customer ?? '',
      "ContractID": changes.contractData?.currentValue?.contractID ?? ''
    }
    this.initializeFormControl(data);
    let mydata = [{
      "id": 1,
      "selectCharges": "Document Charge",
      "ChargesBehaviour": "Fixed",
      "Charges": "200",
      actions: ['Edit', 'Remove']
    },
    {
      "id": 2,
      "selectCharges": "Multi-point delivery",
      "ChargesBehaviour": "Variable",
      "Charges": "Add",
      actions: ['Edit', 'Remove']
    }]
    this.chargestableData = mydata
  }
  initializeFormControl(data) {
    this.ContractNonFreightMatrixControls = new ContractNonFreightMatrixControl(data);
    this.jsonControlArrayNonFreightMatrix = this.ContractNonFreightMatrixControls.getContractNonFreightMatrixControlControls(this.CurrentAccessList.productAccess);
    this.NonFreightMatrixForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayNonFreightMatrix,
    ]);

    this.jsonControlArrayNonFreightCharges = this.ContractNonFreightMatrixControls.getContractNonFreightChargesControlControls(this.CurrentAccessList.productAccess);
    this.NonFreightChargesForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayNonFreightCharges,
    ]);
    this.AlljsonControlArrayNonFreightCharges = this.jsonControlArrayNonFreightCharges;
  }

  // Charges Section
  ChargesBehaviour(event) {
    console.log(this.NonFreightChargesForm.controls['ChargesBehaviour'].value)
    if (this.NonFreightChargesForm.controls['ChargesBehaviour'].value === "Fixed") {
      this.jsonControlArrayNonFreightCharges = this.AlljsonControlArrayNonFreightCharges;
      this.NonFreightChargesForm.get('Charges').setValidators(Validators.required);
      this.NonFreightChargesForm.updateValueAndValidity()
    } else {
      this.jsonControlArrayNonFreightCharges = this.AlljsonControlArrayNonFreightCharges.filter((x) => x.name != "Charges");
      this.NonFreightChargesForm.get('Charges').clearValidators();
      this.NonFreightChargesForm.get('Charges').updateValueAndValidity();

    }
  }

  async save(event) {
    this.tableLoad = false;
    this.isLoad = true;
    const tableData = this.chargestableData;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      selectCharges: this.NonFreightChargesForm.value.selectCharges,
      ChargesBehaviour: this.NonFreightChargesForm.value.ChargesBehaviour,
      Charges: this.NonFreightChargesForm.value.Charges == "" ? 'Add' : this.NonFreightChargesForm.value.Charges,
      actions: ['Edit', 'Remove']
    }

    this.chargestableData.push(json);
    Object.keys(this.NonFreightChargesForm.controls).forEach(key => {
      this.NonFreightChargesForm.get(key).clearValidators();
      this.NonFreightChargesForm.get(key).updateValueAndValidity();
    });

    this.NonFreightChargesForm.controls['selectCharges'].setValue('');
    this.NonFreightChargesForm.controls['ChargesBehaviour'].setValue('');
    this.NonFreightChargesForm.controls['Charges'].setValue('');
    // Remove all validation  

    this.isLoad = false;
    this.tableLoad = true;
    // Add the "required" validation rule
    Object.keys(this.NonFreightChargesForm.controls).forEach(key => {
      this.NonFreightChargesForm.get(key).setValidators(Validators.required);
    });

    this.NonFreightChargesForm.updateValueAndValidity();

  }

  // Drower And CLose Actions 
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
  addCharges(event) {
    this.IsChargeMatrix = false;
  }
  close() {
    this.IsChargeMatrix = true;
  }
  cancel(event) {
    this.isDrawerOpen = false
  }

  // Add Charges List
  async AddNewButtonEvent() {
    this.tableLoad = false;
    this.isLoad = true;
    const tableData = this.tableData;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      From: this.NonFreightMatrixForm.value.FromHandler?.name,
      To: this.NonFreightMatrixForm.value.ToHandler?.name,
      rateType: this.NonFreightMatrixForm.value.rateType,
      Rate: this.NonFreightMatrixForm.value.Rate,
      MinValue: this.NonFreightMatrixForm.value.MinValue,
      MaxValue: this.NonFreightMatrixForm.value.MaxValue,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    //this.NonFreightMatrixForm.reset();
    Object.keys(this.NonFreightMatrixForm.controls).forEach(key => {
      this.NonFreightMatrixForm.get(key).clearValidators();
      this.NonFreightMatrixForm.get(key).updateValueAndValidity();
    });

    this.NonFreightMatrixForm.controls['From'].setValue('');
    this.NonFreightMatrixForm.controls['To'].setValue('');
    this.NonFreightMatrixForm.controls['FromHandler'].setValue('');
    this.NonFreightMatrixForm.controls['ToHandler'].setValue('');
    this.NonFreightMatrixForm.controls['rateType'].setValue('');
    this.NonFreightMatrixForm.controls['Rate'].setValue('');
    this.NonFreightMatrixForm.controls['MinValue'].setValue('');
    this.NonFreightMatrixForm.controls['MaxValue'].setValue('');
    // Remove all validation  

    this.isLoad = false;
    this.tableLoad = true;
    // Add the "required" validation rule
    Object.keys(this.NonFreightMatrixForm.controls).forEach(key => {
      this.NonFreightMatrixForm.get(key).setValidators(Validators.required);
    });
  }
  handleMenuItemClick(data) {
    this.FillMatrixForAll(data);
  }

  FillMatrixForAll(data: any) {
    if (data.data.Charges) {
      if (data.label.label === 'Remove') {
        this.chargestableData = this.chargestableData.filter((x) => x.id !== data.data.id);
      }
      else {
        this.ChargesBehaviour('')
        this.NonFreightChargesForm.controls['selectCharges'].setValue(data.data?.selectCharges || "");
        this.NonFreightChargesForm.controls['ChargesBehaviour'].setValue(data.data?.ChargesBehaviour || "");
        this.NonFreightChargesForm.controls['Charges'].setValue(data.data?.Charges || "");
        this.chargestableData = this.chargestableData.filter((x) => x.id !== data.data.id);
        this.isDrawerOpen = true;
      }
    } else {
      if (data.label.label === 'Remove') {
        this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      }
      else {
        const FromHandler = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, data.data?.From, fieldsToSearch)[0]
        const ToHandler = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, data.data?.To, fieldsToSearch)[0]

        this.NonFreightMatrixForm.controls['From'].setValue(FromHandler.name);
        this.NonFreightMatrixForm.controls['To'].setValue(ToHandler.name)
        this.NonFreightMatrixForm.controls['FromHandler'].setValue(FromHandler);
        this.NonFreightMatrixForm.controls['ToHandler'].setValue(ToHandler)
        this.NonFreightMatrixForm.controls['rateType'].setValue(data.data?.rateType || "");
        this.NonFreightMatrixForm.controls['capacity'].setValue(data.data?.capacity || "");
        this.NonFreightMatrixForm.controls['Rate'].setValue(data.data?.Rate || "");
        this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      }
    }

  }
  //#region Set OriginRateOptions
  SetOptions(event) {
    let fieldName = event.field.name;

    const search = this.NonFreightMatrixForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      data = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, search, fieldsToSearch)
      this.filter.Filter(
        this.jsonControlArrayNonFreightMatrix,
        this.NonFreightMatrixForm,
        data,
        fieldName,
        true
      );
    }
  }
  setSelectedOptions(event) {
    let fieldName = event.field.name;
    // alert(fieldName)
  }
  //#region functionCallHandler
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
}


