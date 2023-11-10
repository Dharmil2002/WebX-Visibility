import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractBasicInformationControl } from 'src/assets/FormControls/CustomerContractControls/BasicInformation-control';
import { customerFromApi, productdetailFromApi } from '../CustomerContractAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
interface CurrentAccessListType {
  productAccess: string[];
}
@Component({
  selector: 'app-add-new-customer-contract',
  templateUrl: './add-new-customer-contract.component.html',
})
export class AddNewCustomerContractComponent implements OnInit {

  companyCode: number | null
  //#region Form Configration Fields
  ContractBasicInformationControls: ContractBasicInformationControl;
  ContractForm: UntypedFormGroup;
  jsonControlArrayContractForm: any;
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "Add New Customer Contract",
      items: ["home"],
      active: "AddNewCustomerContract",
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
    private masterService: MasterService,
    private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      productAccess: ['Customer', 'ContractID', 'Product', 'PayBasis', 'ContractStartDate', 'Expirydate']
    } as CurrentAccessListType;

    this.initializeFormControl();
    this.BindDataFromAPI()
  }
  //#endregion
  initializeFormControl() {

    this.ContractBasicInformationControls = new ContractBasicInformationControl("");
    this.jsonControlArrayContractForm = this.ContractBasicInformationControls.getAddNewCustomerContractControlArrayControls();
    this.ContractForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayContractForm,
    ]);


  }
  async BindDataFromAPI() {
    const responseFromAPI = await customerFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArrayContractForm,
      this.ContractForm,
      responseFromAPI,
      "Customer",
      false
    );
    const productdetailFromAPI = await productdetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArrayContractForm,
      this.ContractForm,
      productdetailFromAPI,
      "Product",
      false
    );
    //const responseFromAPI = await customerFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArrayContractForm,
      this.ContractForm,
      [
        {
          value: "All",
          name: "All",
        },
        {
          value: "TBB",
          name: "TBB",
        },
        {
          value: "LTL",
          name: "LTL",
        },
        {
          value: "FTL",
          name: "FTL",
        },

      ],
      "PayBasis",
      false
    );
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
  onContractStartDateChanged(event) {
    console.log(event)
  }

}

