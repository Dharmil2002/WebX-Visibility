
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ContractFreightMatrixControl } from "src/assets/FormControls/CustomerContractControls/FreightMatrix-control";

interface CurrentAccessListType {
  productAccess: string[];
}
const fieldsToSearch = ['PIN', 'CT', 'STNM', 'ZN'];
@Component({
  selector: 'app-customer-contract-freight-matrix',
  templateUrl: './customer-contract-freight-matrix.component.html',
})
export class CustomerContractFreightMatrixComponent implements OnInit {
  @Input() contractData: any;
  EventButton = {
    functionName: 'AddNewButtonEvent',
    name: "Add New",
    iconName: 'add'
  }
  companyCode: number | null
  //#region Form Configration Fields
  ContractFreightMatrixControls: ContractFreightMatrixControl;
  FreightMatrixForm: UntypedFormGroup;
  jsonControlArrayFreightMatrix: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";

  //#region Array List
  CurrentAccessList: any
  StateList: any;
  PinCodeList: any
  //#endregion

  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  tableData: any = [];
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
    capacity: {
      Title: "Min Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    Rate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
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
      'capacity',
      'Rate'
    ]

  //#endregion
  protected _onDestroy = new Subject<void>();

  //#endregion
  constructor(private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      productAccess: ['loadType', 'rateType', 'originRateOption', 'destinationRateOption', 'originRateOptionHandler', 'destinationRateOptionHandler']
    } as CurrentAccessListType;
  }
  ngOnChanges(changes: SimpleChanges) {
    let data = {
      "Customer": changes.contractData?.currentValue?.customer ?? '',
      "ContractID": changes.contractData?.currentValue?.contractID ?? ''
    }
    this.initializeFormControl(data);
  }

  //#endregion
  initializeFormControl(data) {

    this.ContractFreightMatrixControls = new ContractFreightMatrixControl(data);
    this.jsonControlArrayFreightMatrix = this.ContractFreightMatrixControls.getContractFreightMatrixControlControls(this.CurrentAccessList.productAccess);
    this.FreightMatrixForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayFreightMatrix,
    ]);


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

  //#region Set OriginRateOptions
  SetOptions(event) {
    let fieldName = event.field.name;

    const search = this.FreightMatrixForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      data = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, search, fieldsToSearch)
      this.filter.Filter(
        this.jsonControlArrayFreightMatrix,
        this.FreightMatrixForm,
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
  async AddNewButtonEvent(event) {
    this.tableLoad = false;
    this.isLoad = true;
    const tableData = this.tableData;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    debugger
    const json = {
      id: tableData.length + 1,
      From: this.FreightMatrixForm.value.FromHandler?.name,
      To: this.FreightMatrixForm.value.ToHandler?.name,
      rateType: this.FreightMatrixForm.value.rateType,
      capacity: this.FreightMatrixForm.value.capacity,
      Rate: this.FreightMatrixForm.value.Rate,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    //this.FreightMatrixForm.reset();
    Object.keys(this.FreightMatrixForm.controls).forEach(key => {
      this.FreightMatrixForm.get(key).clearValidators();
      this.FreightMatrixForm.get(key).updateValueAndValidity();
    });

    this.FreightMatrixForm.controls['From'].setValue('');
    this.FreightMatrixForm.controls['To'].setValue('');
    this.FreightMatrixForm.controls['FromHandler'].setValue('');
    this.FreightMatrixForm.controls['ToHandler'].setValue('');
    this.FreightMatrixForm.controls['rateType'].setValue('');
    this.FreightMatrixForm.controls['capacity'].setValue('');
    this.FreightMatrixForm.controls['Rate'].setValue('');
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = true;
    // Add the "required" validation rule
    Object.keys(this.FreightMatrixForm.controls).forEach(key => {
      this.FreightMatrixForm.get(key).setValidators(Validators.required);
    });
  }
  handleMenuItemClick(data) {
    this.fillContainer(data);
  }

  fillContainer(data: any) {
    console.log(data)
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      const FromHandler = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, data.data?.From, fieldsToSearch)[0]
      const ToHandler = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, data.data?.To, fieldsToSearch)[0]

      this.FreightMatrixForm.controls['From'].setValue(FromHandler.name);
      this.FreightMatrixForm.controls['To'].setValue(ToHandler.name)
      this.FreightMatrixForm.controls['FromHandler'].setValue(FromHandler);
      this.FreightMatrixForm.controls['ToHandler'].setValue(ToHandler)
      this.FreightMatrixForm.controls['rateType'].setValue(data.data?.rateType || "");
      this.FreightMatrixForm.controls['capacity'].setValue(data.data?.capacity || "");
      this.FreightMatrixForm.controls['Rate'].setValue(data.data?.Rate || "");
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

}

