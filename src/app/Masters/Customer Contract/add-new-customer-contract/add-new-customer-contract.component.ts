import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
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

  displayedColumns = [
    { Key: "cUSTNM", title: "Customer", width: "180", className: "matcolumnfirst", show: true },
    { Key: "cONID", title: "Contract Id", width: "180", className: "matcolumncenter", show: true },
    { Key: "pNM", title: "Product", width: "70", className: "matcolumncenter", show: true },
    { Key: "pBAS", title: "PayBasis", width: "70", className: "matcolumncenter", show: true },
    { Key: "cSTARTDT", title: "Start Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "cENDDT", title: "End Date", width: "100", className: "matcolumncenter", show: true },
    { Key: "expiringin", title: "Expiring In", width: "150", className: "matcolumncenter", show: true },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  boxData: { count: number; title: string; class: string; }[];
  tableData: any;
  public ModeldataSource = new MatTableDataSource<any>();
  error;
  remarks;
  geoJsonData = '';
  isTouchUIActivated = false;
  isTblLoading = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) Tablefilter: ElementRef;

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
    this.columnKeys.push('status')
    this.columnKeys.push('actions')

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
  async GeneralFieldChangedForTableData(event) {
    const customerId = this.ContractForm.value?.Customer?.value;
    const productId = this.ContractForm.value?.Product?.value;
    const payBasis = ""//this.ContractForm.value?.PayBasis?.name

    if (customerId) {
      this.tableData = await GetContractBasedOnCustomerAndProductListFromApi(this.masterService, customerId, productId, payBasis);

      this.tableData.forEach((item: any) => {
        const startDate: Date = new Date(item.cSTARTDT);
        const endDate: Date = new Date(item.cENDDT);

        item.cSTARTDT = moment(startDate).format('DD-MM-YYYY');
        item.cENDDT = moment(endDate).format('DD-MM-YYYY');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeDiff: number = endDate.getTime() - startDate.getTime();
        const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (endDate.toDateString() === today.toDateString()) {
          item.expiringin = `Expiring Today`;
        }
        else if (endDate < today) {
          const ExpiredDiff: number = today.getTime() - endDate.getTime();
          const ExpireddaysDiff: number = Math.floor(ExpiredDiff / (1000 * 60 * 60 * 24));
          item.status = "Expired";
          item.expiringin = `Expired ${ExpireddaysDiff} Days Ago`;
        }
        else {
          item.expiringin = `${daysDiff} Days Left`;
        }
      });

      this.ModeldataSource = new MatTableDataSource(
        this.tableData
      );
      this.ModeldataSource.paginator = this.paginator;
      this.ModeldataSource.sort = this.sort;

      this.subs.sink = fromEvent(
        this.Tablefilter.nativeElement,
        "keyup"
      ).subscribe(() => {
        if (!this.ModeldataSource) {
          return;
        }
        this.ModeldataSource.filter = this.Tablefilter.nativeElement.value;
      });

    }
  }
  async Copy(row) {
    const startDate = this.ContractForm.get('ContractStartDate')?.value;
    const endDate = this.ContractForm.get('Expirydate')?.value;
    if (!startDate && !endDate) {
      Swal.fire({
        title: 'Please Select Start Date and End Date',
        toast: false,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });
      return
    } else {
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
            this.customerContractDataRequestModel.branch = row.branch;
            this.customerContractDataRequestModel.finYear = row.finYear;
            this.customerContractDataRequestModel.customerId = row.cUSTID;
            this.customerContractDataRequestModel.customerName = row.cUSTNM;
            this.customerContractDataRequestModel.productId = row.pID;
            this.customerContractDataRequestModel.productName = row.pNM;
            this.customerContractDataRequestModel.payBasis = row.pBAS;
            this.customerContractDataRequestModel.ContractStartDate = this.ContractForm.value?.ContractStartDate
            this.customerContractDataRequestModel.Expirydate = this.ContractForm.value?.Expirydate
            this.customerContractDataRequestModel.entryDate = new Date().toString()
            this.customerContractDataRequestModel.entryBy = localStorage.getItem("UserName")
            this.customerContractDataRequestModel.updateDate = ""
            this.customerContractDataRequestModel.updateBy = ""

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
        }, "Copy Contract Started..!");
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
          this.customerContractDataRequestModel.payBasis = this.ContractForm.value?.PayBasis?.name
          this.customerContractDataRequestModel.ContractStartDate = this.ContractForm.value?.ContractStartDate
          this.customerContractDataRequestModel.Expirydate = this.ContractForm.value?.Expirydate
          this.customerContractDataRequestModel.entryDate = new Date().toString()
          this.customerContractDataRequestModel.entryBy = localStorage.getItem("UserName")
          this.customerContractDataRequestModel.entryLocation = localStorage.getItem("CurrentBranchCode")
          this.customerContractDataRequestModel.updateDate = ""
          this.customerContractDataRequestModel.updateBy = ""
          this.customerContractDataRequestModel.updateLocation = ""

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

    const startDate = stripTimeFromDate(new Date(this.ContractForm.value?.ContractStartDate));
    const endDate = stripTimeFromDate(new Date(this.ContractForm.value?.Expirydate));

    // Assume the contract is valid by default
    let isValidContract = true;

    // Perform your comparison logic with the predefined JSON data
    for (const item of ExistingContracts) {
      const jsonStartDate = stripTimeFromDate(new Date(item.cSTARTDT));
      const jsonEndDate = stripTimeFromDate(new Date(item.cENDDT));

      if ((startDate <= jsonEndDate && endDate >= jsonStartDate) ||
        (endDate >= jsonStartDate && startDate <= jsonEndDate)) {
        // If the contract dates overlap with any existing contract, set isValidContract to false
        isValidContract = false;
        break; // No need to continue checking, as the contract is already invalid
      }
    }
    return isValidContract;

  }

}
function stripTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
