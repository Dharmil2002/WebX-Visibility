import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, catchError, firstValueFrom, forkJoin, take, takeUntil } from 'rxjs';
import { PayBasisdetailFromApi as GetGeneralmasterDetailsFromAPI } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { SetOpeningBalanceLedgerWise } from '../../../../../assets/FormControls/Finance/FA Masters/SetOpeningBalance/SetOpeningBalanceLedgerWise';
import { Router } from '@angular/router';
import { GetLedgerWiseOpeningBalanceList } from '../../Service/FAMastersAPIUtitlity';
import { EditOpeningBalanceLedgerWiseComponent } from '../../Modals/edit-opening-balance-ledger-wise/edit-opening-balance-ledger-wise.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UploadOpeningBalanceLedgerWiseComponent } from '../../Modals/upload-opening-balance-ledger-wise/upload-opening-balance-ledger-wise.component';
import { financialYear } from 'src/app/Utility/date/date-utils';

@Component({
  selector: 'app-set-opening-balance-ledger-wise',
  templateUrl: './set-opening-balance-ledger-wise.component.html',
})
export class SetOpeningBalanceLedgerWiseComponent implements OnInit {
  setOpeningBalanceFormControls: SetOpeningBalanceLedgerWise;
  jsonGeneralLedgerArray: any;
  breadScrums = [
    {
      title: "Set Ledger Wise Opening Balance",
      items: ["FA Masters"],
      active: "Set Ledger Wise Opening Balance",
    },
  ];
  setOpeningBalanceForm: UntypedFormGroup;
  branchName: any;
  branchStatus: any;
  categoryName: any;
  categoryStatus: any;
  accountName: any;
  accountStatus: any;

  ReportingBranches: string[] = [];
  protected _onDestroy = new Subject<void>();

  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  tableData: any[]
  AlltableData: any[]
  EventButton = {
    functionName: "Save",
    name: "Update",
    iconName: "save",
  };
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },

    aCCD: {
      Title: "Account Code",
      class: "matcolumnleft",
      Style: "min-width:20%",
    },
    aCNM: {
      Title: "Account Name",
      class: "matcolumncenter",
      Style: "min-width:17%",
    },
    cAMT: {
      Title: "Credit Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:9%",
    },
    dAMT: {
      Title: "Debit Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:9%",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:8%",
    }
  }
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  staticField = ['aCCD', 'aCNM', 'dAMT', 'cAMT',]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  menuItems = [
    { label: 'Modify' },
  ]

  filterRequest = {
    cID: this.companyCode,
    bRCD: this.storage.branch,
    mATCD: ''
  }
  ShowSubmitButton = false;
  uploadComponent = UploadOpeningBalanceLedgerWiseComponent;
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    private route: Router,
    private matDialog: MatDialog,
    public StorageService: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.initializeFormControl()
    this.getDropdownData();
  }
  //#region to initialize form control
  initializeFormControl() {

    // Retrieve and set details for the 'branch' control
    this.branchName = this.getControlDetails("branch")?.name;
    this.branchStatus = this.getControlDetails("branch")?.status;

    // Retrieve and set details for the 'category' control
    this.categoryName = this.getControlDetails("category")?.name;
    this.categoryStatus = this.getControlDetails("category")?.status;

    // Retrieve and set details for the 'aCCONTCD' control
    this.accountName = this.getControlDetails("aCCONTCD")?.name;
    this.accountStatus = this.getControlDetails("aCCONTCD")?.status;

    // Build the form using formGroupBuilder
    this.setOpeningBalanceForm = formGroupBuilder(this.fb, [this.jsonGeneralLedgerArray]);
  }
  // Function to retrieve control details by name
  getControlDetails = (name: string) => {

    this.setOpeningBalanceFormControls = new SetOpeningBalanceLedgerWise();
    this.jsonGeneralLedgerArray = this.setOpeningBalanceFormControls.SetOpeningBalanceLedgerWiseControlArray;

    // Find the control in jsonGeneralLedgerArray
    const control = this.jsonGeneralLedgerArray.find(data => data.name === name);

    // Return an object with control name and status (if found)
    return {
      name: control?.name,
      status: control?.additionalData.showNameAndValue,
    };
  };
  //#endregion
  //#region to get dropdown data
  async getDropdownData() {
    try {
      // Fetch data from various services
      const branchList = await this.locationService.locationFromApi();
      const categorylist = await GetGeneralmasterDetailsFromAPI(this.masterService, "MCT");

      // Apply filters for each dropdown
      this.filterDropdown(this.branchName, this.branchStatus, branchList);
      this.filterDropdown(this.categoryName, this.categoryStatus, categorylist);


      const loginBranch = branchList.find(x => x.name === this.storage.branch);
      this.setOpeningBalanceForm.controls["branch"].setValue(loginBranch);

    } catch (error) {
      console.error('An error occurred in getDropdownData:', error.message || error);
    }
  }

  async OnChangeDropDown(event) {
    if (this.setOpeningBalanceForm.valid) {
      const category = this.setOpeningBalanceForm.controls["category"].value;
      const branch = this.setOpeningBalanceForm.controls["branch"].value;
      this.filterRequest.mATCD = category.value
      this.filterRequest.bRCD = branch.name
      this.tableLoad = true;
      try {
        // Call the vendor bill service to get the data
        let data = await GetLedgerWiseOpeningBalanceList(this.masterService, this.filterRequest);
        data.forEach((element, i) => {
          element.isSelected = false;
          element.actions = ['Modify']
        });
        this.tableData = data;
        this.AlltableData = data;

        this.tableLoad = false;
        this.filterDropdown(this.accountName, this.accountStatus, data);
      } catch (error) {
        // Log the error to the console
        console.error('Error fetching vendor bill:', error);
      }
    }
  }

  // Function to filter and update dropdown data in the form
  filterDropdown(name: string, status: any, dataList: any[]) {
    this.filter.Filter(this.jsonGeneralLedgerArray, this.setOpeningBalanceForm, dataList, name, status);
  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonGeneralLedgerArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonGeneralLedgerArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.setOpeningBalanceForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });

    this.ReArrangeData(true)
  }
  toggleSelectSingle(event) {
    this.ReArrangeData(false)
  }
  ReArrangeData(event) {
    this.tableLoad = true;
    if (event) {
      this.tableData = this.AlltableData;
      this.tableLoad = false;
    } else {
      const accountData = this.setOpeningBalanceForm.controls["accountHandler"].value
      if (accountData == '' || accountData == null || accountData == undefined) {
        this.tableData = this.AlltableData;
      }
      else {
        const accountList = accountData.map(item => item._id)
        this.tableData = this.AlltableData.filter(item => accountList.includes(item._id));
      }
      this.tableLoad = false;
    }

  }
  //#region to handle actions
  async handleMenuItemClick(data) {
    const EditableId = data.data?._id
    const dialogRef = this.matDialog.open(EditOpeningBalanceLedgerWiseComponent, {
      data: data.data,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          const tableData = this.tableData.find(x => x._id === EditableId);
          const AlltableData = this.AlltableData.find(x => x._id === EditableId);
          if (tableData) {
            tableData.cAMT = result.CreditAmount;
            tableData.dAMT = result.DebitAmount;
            AlltableData.cAMT = result.CreditAmount;
            AlltableData.dAMT = result.DebitAmount;
          } else {
            // Handle the case where the object with the specified _id is not found
            console.log("Editable item not found!");
          }
        }
      }
    });
  }

  TableSelectionsChange(event) {
    const resultArray = event
      .filter(item => item.isSelected)
    if (resultArray.length > 0) {
      this.ShowSubmitButton = true;
    }
    else {
      this.ShowSubmitButton = false;
    }
  }

  Save() {
    const selectedItems = this.tableData.filter(item => item.isSelected);

    if (selectedItems.length > 0) {
      const updateRequests = selectedItems.map(element => {
        const updateData = {
          dAMT: element.dAMT,
          cAMT: element.cAMT,
        };

        const req = {
          companyCode: this.companyCode,
          filter: { _id: element._id },
          collectionName: `acc_opening_${financialYear}`,
          update: updateData
        };

        return this.masterService.masterPut("generic/update", req).pipe(
          catchError(error => {
            console.error("Error updating account:", error);
            return []; // Return empty array to continue with forkJoin
          })
        );
      });

      forkJoin(updateRequests).subscribe(
        (responses: any[]) => {
          responses.forEach((res, index) => {
            if (res) {
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: `Account Opening Updated Successfully`,
                showConfirmButton: true,
              });

              // Update isSelected property to false for the processed item
              selectedItems[index].isSelected = false;
              this.ShowSubmitButton = false;

            } else {
              console.error("Failed to update account:", res);
              // Handle failed update if necessary
            }
          });

        },
        error => {
          console.error("Error updating accounts:", error);
          // Handle error if necessary
        },
        () => {
          this.OnChangeDropDown(null);
        }
      );
    }
  }
  //#region to call upload function
  upload() {
    const dialogRef = this.matDialog.open(this.uploadComponent, {
      width: "800px",
      height: "500px",
      data: {
        filterRequest: this.filterRequest,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.OnChangeDropDown(null);
    });
  }

}