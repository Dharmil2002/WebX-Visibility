import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractTypeData } from '../../vendor-contract-list/VendorStaticData';
interface CurrentAccessListType {
  productAccess: string[];
  ServicesSelectionAccess: string[];
}
@Component({
  selector: 'app-vendor-contract-service-selection',
  templateUrl: './vendor-contract-service-selection.component.html'
})
export class VendorContractServiceSelectionComponent implements OnInit {

  //#region Form Configration Fields

  companyCode: any;
  CurrentAccessList: CurrentAccessListType;
  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;

  ServicesForm: UntypedFormGroup;
  jsonControlArrayServicesForm: any;

  CODDODForm: UntypedFormGroup;
  jsonControlArrayCODDODForm: any;

  VolumtericForm: UntypedFormGroup;
  jsonControlArrayVolumtericForm: any;

  DemurrageForm: UntypedFormGroup;
  jsonControlArrayDemurrageForm: any;

  InsuranceCarrierRiskForm: UntypedFormGroup;
  jsonControlArrayInsuranceCarrierRiskForm: any;

  CutOfftimeForm: UntypedFormGroup;
  jsonControlArrayCutOfftimeForm: any;

  YieldProtectionForm: UntypedFormGroup;
  jsonControlArrayYieldProtectionForm: any;

  FuelSurchargeForm: UntypedFormGroup;
  jsonControlArrayFuelSurchargeForm: any;

  //#endregion
  protected _onDestroy = new Subject<void>();

  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData = ContractTypeData

  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    type: {
      Title: "Type",
      class: "matcolumnleft",
    },
    typeName: {
      Title: "Type",
      class: "matcolumnleft",
      //Style: "max-width:300px",
    },
    mode: {
      Title: "Mode",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },

  };
  staticField = [
    "type",
    "typeName",
    "mode"
  ];
  selectedContractType: any[] = []; // Initialize as an empty array
  previousContractType: any;
  //#endregion


  constructor(private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    // Retrieving the array from session storage
    const storedData = sessionStorage.getItem('selectedContractType');

    if (storedData) {
      this.previousContractType = JSON.parse(storedData);
    
      // Iterate through tableData and update isSelected based on previousContractType
      this.tableData.forEach(item => {
        if (this.previousContractType.includes(item.typeName)) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
      });
    }
    
  }

  //#region to initialize form controls

  ngOnInit() {
  }


  selectCheckBox(event) {
    // console.log(event);
  
    // Create a new array to store the selected contract types
    this.selectedContractType = event
      .filter(item => item.isSelected)
      .map(item => item.typeName);
  
    console.log(this.selectedContractType);
  
    // Storing the array in session storage
    sessionStorage.setItem('selectedContractType', JSON.stringify(this.selectedContractType));
  }
  
}