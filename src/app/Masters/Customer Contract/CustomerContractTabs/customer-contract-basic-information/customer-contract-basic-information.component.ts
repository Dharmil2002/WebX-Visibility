
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ContractBasicInformationControl } from "src/assets/FormControls/CustomerContractControls/BasicInformation-control";

interface CurrentAccessListType {
  productAccess: string[];
}
@Component({
  selector: 'app-customer-contract-basic-information',
  templateUrl: './customer-contract-basic-information.component.html',
})
export class CustomerContractBasicInformationComponent implements OnInit {
  @Input() contractData: any;

  companyCode: number | null
  //#region Form Configration Fields
  ContractBasicInformationControls: ContractBasicInformationControl;
  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];

  //#region Array List
  CurrentAccessList: any
  //#endregion

  protected _onDestroy = new Subject<void>();

  //#endregion
  constructor(private fb: UntypedFormBuilder,
    public ObjcontractMethods: locationEntitySearch,
    private filter: FilterUtils,
    private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      productAccess: ['Customer', 'ContractID', 'ContractScan', 'ContractScanView', 'Product', 'PayBasis', 'AccountManager', 'PayBasis', 'ContractStartDate', 'Expirydate', 'Pendingdays', 'CustomerPONo', 'POValiditydate', 'ContractPOScan', 'ContractPOScanView', 'UpdateHistory']
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

    this.ContractBasicInformationControls = new ContractBasicInformationControl(data);
    this.jsonControlArrayProductsForm = this.ContractBasicInformationControls.getContractBasicInformationControlControls(this.CurrentAccessList.productAccess);
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);


  }
  //#endregion
  ngOnInit() {
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

