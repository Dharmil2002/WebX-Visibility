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
import { GetLocationDetailFromApi, GetBankDetailFromApi, GetAccountDetailFromApi } from '../../Debit Voucher/debitvoucherAPIUtitlity';
import { AdviceGeneration } from "src/app/Models/Finance/Advice";
import { AdviceAcknowledgeControl } from '../../../../assets/FormControls/Finance/AdviceAcknowledge/adviceacknowledgecontrol';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from "src/app/Utility/date/date-utils";

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
  menuItemflag = true;
  menuItems = [
    { label: 'Modify' },
    { label: 'Acknowledge' },
    { label: 'View' },
  ]

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
    eNTDT: {
      Title: "Created on ⟨Date⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    docNo: {
      Title: "Advice No",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    rBRANCH: {
      Title: "Advice Branch",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    eNTLOC: {
      Title: "Raised on Branch ",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    aMT: {
      Title: "Amount ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    sTNM: {
      Title: "Status ",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:10%",
    }
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
  staticField = ["SrNo", "docNo", "eNTDT", "rBRANCH", "eNTLOC", "aMT", "sTNM"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  isTableLode = true;
  constructor(private matDialog: MatDialog,
    public StorageService: StorageService, private router: Router, private masterService: MasterService,) {
    this.RequestData.StartDate.setDate(new Date().getDate() - 30);
  }

  ngOnInit(): void {
    this.GetAdviceData()
  }
  async GetAdviceData() {
    const RequestBody = {
      "companyCode": localStorage.getItem('companyCode'),
      "collectionName": "advice_details",
      "filter": {
        "D$and": [
          {
            "eNTDT": {
              "D$gte": this.RequestData.StartDate
            }
          },
          {
            "eNTDT": {
              "D$lte": this.RequestData.EndDate
            }
          }
        ]
      }
    }

    try {
      const APIResult: any = await firstValueFrom(this.masterService.masterMongoPost("generic/get", RequestBody));
      if (APIResult.data) {
        const result = APIResult.data.sort((a, b) => {
          const aValue = a.docNo;
          const bValue = b.docNo;

          return bValue.localeCompare(aValue);
        });

        this.tableData = result.map((x, index) => ({
          SrNo: index + 1,
          docNo: x.docNo,
          eNTDT: formatDate(x.eNTDT, "dd MMM yyyy HH:mm:ss"),
          rBRANCH: x.rBRANCH,
          eNTLOC: x.eNTLOC,
          aMT: x.aMT,
          sTNM: x.sTNM,
          actions: this.GetactionsArray(x.sTCD, x.rBRANCH),
          OthersData: x
        })) ?? null;
      }

    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
  }

  GetactionsArray(sTCD, rBRANCH) {
    if (sTCD == 1 && rBRANCH == this.StorageService.branch) {
      return ['Acknowledge', 'View'];
    } else if (sTCD == 1 && rBRANCH != this.StorageService.branch) {
      return ['Modify', 'View'];
    } else {
      return ['View'];
    }
  }
  //#region to handle actions
  async handleMenuItemClick(data) {
    let RequestData = data.data?.OthersData;

    switch (data.label.label) {
      case 'Acknowledge':
        this.router.navigate(["/Finance/FundTransfer/AdviceGeneration"], {
          state: { data: RequestData, Type: "Acknowledge", },
        });
        break;
      case 'Modify':
        this.router.navigate(["/Finance/FundTransfer/AdviceGeneration"], {
          state: { data: RequestData, Type: "Modify", },
        });
        break;
      case 'View':
        this.router.navigate(["/Finance/FundTransfer/AdviceGeneration"], {
          state: { data: RequestData, Type: "View", },
        });
        break;
    }
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
        this.GetAdviceData()
      }
    });
  }
}
