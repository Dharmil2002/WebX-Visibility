import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import { SessionService } from 'src/app/core/service/session.service';
import { ContractBasicInformationControl } from 'src/assets/FormControls/CustomerContractControls/BasicInformation-control';
import { GetContractBasedOnCustomerAndProductListFromApi, PayBasisdetailFromApi, customerFromApi, productdetailFromApi } from '../CustomerContractAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { CustomerContractDataRequestModel, CustomerContractRequestModel } from '../../../Models/CustomerContract/customerContract';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { CustomerContractService } from 'src/app/core/service/customerContract/customerContract-services.service';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
interface CurrentAccessListType {
  productAccess: string[];
}
@Component({
  selector: 'app-add-new-customer-contract',
  templateUrl: './add-new-customer-contract.component.html',
})
export class AddNewCustomerContractComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  customerContractRequestModel = new CustomerContractRequestModel();

  customerContractDataRequestModel = new CustomerContractDataRequestModel();

  companyCode: number | null
  //#region Form Configration Fields
  ContractBasicInformationControls: ContractBasicInformationControl;
  ContractForm: UntypedFormGroup;
  jsonControlArrayContractForm: any;
  backPath: string;
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
    private router: Router,
    private navigationService: NavigationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private masterService: MasterService,
    private customerContractService: CustomerContractService,
    private sessionService: SessionService) {
    super();
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
    const PayBasisdetailFromAPI = await PayBasisdetailFromApi(this.masterService, "PAYTYP")
    this.filter.Filter(
      this.jsonControlArrayContractForm,
      this.ContractForm,
      PayBasisdetailFromAPI,
      "PayBasis",
      false
    );

  }
  //#endregion
  ngOnInit() {
    this.backPath = "/Masters/CustomerContract/CustomerContractList";
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
    const startDate = this.ContractForm.get('ContractStartDate')?.value;
    const endDate = this.ContractForm.get('Expirydate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      Swal.fire({
        title: 'Contract End date must be greater than or equal to start date.',
        toast: false,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
    }
  }
  async save() {
    const IsValidContract = await this.CheckItsvalidContract();
    if (IsValidContract) {
      this.snackBarUtilityService.commonToast(async () => {
        try {

          this.customerContractRequestModel.companyCode = this.companyCode;
          this.customerContractRequestModel.docType = "CON";
          this.customerContractRequestModel.branch = localStorage.getItem("CurrentBranchCode");
          this.customerContractRequestModel.finYear = financialYear


          this.customerContractDataRequestModel.companyCode = this.companyCode;
          this.customerContractDataRequestModel.contractID = "";
          this.customerContractDataRequestModel.docType = "CON";
          this.customerContractDataRequestModel.branch = localStorage.getItem("CurrentBranchCode");
          this.customerContractDataRequestModel.finYear = financialYear
          this.customerContractDataRequestModel.customerId = this.ContractForm.value?.Customer?.value
          this.customerContractDataRequestModel.customerName = this.ContractForm.value?.Customer?.name
          this.customerContractDataRequestModel.productId = this.ContractForm.value?.Product?.value
          this.customerContractDataRequestModel.productName = this.ContractForm.value?.Product?.name
          this.customerContractDataRequestModel.payBasis = this.ContractForm.value?.PayBasis?.value
          this.customerContractDataRequestModel.ContractStartDate = this.ContractForm.value?.ContractStartDate
          this.customerContractDataRequestModel.Expirydate = this.ContractForm.value?.Expirydate
          this.customerContractDataRequestModel.entryDate = new Date().toString()

          this.customerContractRequestModel.data = this.customerContractDataRequestModel;

          this.customerContractService
            .ContractPost("contract/addNewContract", this.customerContractRequestModel)
            .subscribe({
              next: (res: any) => {
                Swal.fire({
                  icon: "success",
                  title: "Contract Created Successfully",
                  text: "Contract Id: " + res?.data?.ops[0].cONID,
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.hideLoading();
                    setTimeout(() => {
                      Swal.close();
                    }, 2000);
                    this.router.navigate(['/Masters/CustomerContract/CustomerContractList']);
                  }
                });
              },
              error: (err: any) => {
                this.snackBarUtilityService.ShowCommonSwal("error", err);
                Swal.hideLoading();
                setTimeout(() => {
                  Swal.close();
                }, 2000);
              },
            });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 2000);
        }
      }, "Contract Generating..!");
    } else {
      Swal.fire({
        title: 'Already Contract Exists Between This Date Ranges',
        toast: false,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
    }
  }
  cancel() {
    this.router.navigateByUrl('/Masters/CustomerContract/CustomerContractList');
  }
  async CheckItsvalidContract() {
    const customerId = this.ContractForm.value?.Customer?.value;
    const productId = this.ContractForm.value?.Product?.value;
    const ExistingContracts = await GetContractBasedOnCustomerAndProductListFromApi(this.masterService, customerId, productId);
    console.log(ExistingContracts);

    const startDate = new Date(this.ContractForm.value?.ContractStartDate);
    const endDate = new Date(this.ContractForm.value?.Expirydate);

    // Assume the contract is valid by default
    let isValidContract = false;

    // Perform your comparison logic with the predefined JSON data
    for (const item of ExistingContracts) {
      const jsonStartDate = new Date(item.cSTARTDT);
      const jsonEndDate = new Date(item.cENDDT);

      if (startDate && endDate && (startDate > jsonEndDate || endDate < jsonStartDate)) {
        // If the contract dates overlap with any existing contract, set isValidContract to false
        isValidContract = true;
        break; // No need to continue checking, as the contract is already invalid
      }
    }
    return isValidContract;
  }

}

