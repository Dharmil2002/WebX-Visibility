import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { AdviceGenerationControl } from 'src/assets/FormControls/Finance/AdviceGeneration/advicegenerationcontrol';
import Swal from 'sweetalert2';
import { GetLocationDetailFromApi, GetBankDetailFromApi, GetAccountDetailFromApi } from '../../credit-debit-voucher/debitvoucherAPIUtitlity';
import { AdviceGeneration } from "src/app/Models/Finance/Advice";
import { AdviceAcknowledgeControl } from '../../../../assets/FormControls/Finance/AdviceAcknowledge/adviceacknowledgecontrol';
import { MatDialog } from '@angular/material/dialog';
import { AdviceAcknowledgeFiltersComponent } from '../Models/advice-acknowledge-filters/advice-acknowledge-filters.component';
@Component({
  selector: 'app-advice-acknowledge',
  templateUrl: './advice-acknowledge.component.html',
})
export class AdviceAcknowledgeComponent implements OnInit {
  tableData: any;
  breadScrums = [
    {
      title: "Advice Acknowledge",
      items: ["Home"],
      active: "Advice Acknowledge",
    },
  ];

  RequestData = {
    StartDate: new Date(),
    EndDate: new Date()
  }
  linkArray = [];
  menuItems = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Vendor: {
      Title: "Created on ⟨Date⟩",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    THCamount: {
      Title: "Advice No",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    AdvancePending: {
      Title: "Advice Branch",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    AdvancePendings: {
      Title: "Raised on Branch ",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    BalanceUnbilled: {
      Title: "Amount ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    Status: {
      Title: "Status ",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
  };
  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["SrNo", "Vendor", "THCamount"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  isTableLode = true;
  constructor(private matDialog: MatDialog, private router: Router, private masterService: MasterService,) {
    this.RequestData.StartDate.setDate(new Date().getDate() - 30);
  }

  ngOnInit(): void {
    this.GetTHCData()
  }
  async GetTHCData() {
    // const GetTHCData = await GetTHCListFromApi(this.masterService, this.RequestData)
    this.tableData = []
  }

  AdvancePendingFunction(event) {
    // Check if TotaladvAmt is greater than 0
    const isTotaladvAmtValid = event?.data?.AdvancePending > 0;

    if (isTotaladvAmtValid) {
      this.router.navigate(['/Finance/VendorPayment/AdvancePayment'], {
        state: {
          data: {
            ...event.data,
            StartDate: this.RequestData.StartDate,
            EndDate: this.RequestData.EndDate,
          }
        },
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Data Does Not exist for Advance Payment on current branch",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }

  }

  BalanceUnbilledFunction(event) {
    // Check if TotaladvAmt is greater than 0
    const isTotaladvAmtValid = event?.data?.BalanceUnbilled > 0;
    // Check if there is any entry with balAmtAt equal to "Branch"
    if (isTotaladvAmtValid) {
      this.router.navigate(['/Finance/VendorPayment/BalancePayment'], {
        state: {
          data: {
            ...event.data,
            StartDate: this.RequestData.StartDate,
            EndDate: this.RequestData.EndDate,
          },
          Type: "Add",
        },
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Data Does Not exist for Balance Payment on current branch",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }

    //BalanceUnbilled



  }

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
  filterFunction() {
    const dialogRef = this.matDialog.open(AdviceAcknowledgeFiltersComponent, {
      data: { DefaultData: this.RequestData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.RequestData.StartDate = result.StartDate;
        this.RequestData.EndDate = result.EndDate;
        this.GetTHCData()
      }
    });
  }
}
