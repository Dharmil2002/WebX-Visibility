import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AccountMasterControls } from "src/assets/FormControls/AccountMasterControls";
import { AccountListFilterComponent } from "../account-list-filter/account-list-filter.component";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-account-master",
  templateUrl: "./account-master.component.html",
})
export class AccountMasterComponent implements OnInit {
  breadScrums = [
    {
      title: "Account Master List",
      items: ["Home"],
      active: "Account Master",
    },
  ];
  linkArray = [];
  menuItems = [];
  csvFileName: string;
  EventButton = {
    functionName: 'AddFunction',
    name: "Add New",
    iconName: 'add'
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  columnHeader = {
    Account: {
      Title: "Account",
      class: "matcolumnleft",
      Style: "min-width:25%",
      sticky: true
    },
    gRPNM: {
      Title: "Account Group",
      class: "matcolumnleft",
      Style: "min-width:25%",
    },
    cATNM: {
      Title: "Account Category",
      class: "matcolumnleft",
      Style: "min-width:25%",
    },
    EditAction: {
      type: 'iconClick',
      Title: "Action",
      class: "matcolumnleft button-primary",
      Style: "min-width:6%",
      functionName: 'EditFunction',
      iconName: 'edit',
      stickyEnd: true
    }
  };

  headerForCsv = {
    "aCCD": 'Account Code',
    "mRPNM": 'Main Category',
    "gRPCD": 'Group Code',
    "aCNM": 'Account Description',
    "cATNM": 'Account Category',
    "pARTNM": 'Party Selection',
    "bCATNM": 'Balance Sheet Category',
    "bSSCH": 'BS Schedule',
    "iSTRUEPST": 'Activeflag'
  };

  FilterButton = {
    name: "Filter List",
    functionName: "FilterList",
  };
  staticField = [
    "Account",
    "gRPNM",
    "cATNM",
  ];
  TableData: any;
  isTableLode = false;
  CompanyCode = 0;
  FilterData: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private storageService: StorageService,
    public dialog: MatDialog
  ) {
    this.CompanyCode = this.storageService.companyCode;
  }

  ngOnInit(): void {
    this.GetTableData({});
    this.csvFileName = "Account Details";
  }

  FilterList(event) {
    const dialogRef = this.dialog.open(AccountListFilterComponent, {
      width: "800px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        this.FilterData = result.data;
        this.GetTableData(this.FilterData);
      }
    });
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async GetTableData(filterQuery) {
    ;
    this.isTableLode = false;
    this.TableData = []
    const Body = {
      companyCode: this.CompanyCode,
      collectionName: "account_detail",
      filter: filterQuery,
    };
    ;
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    if (res.success && res.data.length > 0) {
      this.TableData = res.data.map((x, index) => {
        return {
          ...x,
          SrNo: index + 1,
          Account: x.aCCD + ' : ' + x.aCNM,
          AccountGroup: x.SubCategoryCode == "" && x.SubCategoryName == "" ? "" : x.SubCategoryCode + ' : ' + x.SubCategoryName,
        };
      });
    }
    this.isTableLode = true;
  }

  EditFunction(event) {
    this.Route.navigate(["/Masters/AccountMaster/AddAccountMaster"], { state: { data: event?.data } });
  }

  AddFunction(event) {
    this.Route.navigate(["/Masters/AccountMaster/AddAccountMaster"]);
  }

}
