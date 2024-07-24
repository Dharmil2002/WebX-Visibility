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
  csvData = [];
  csvDataType = {};
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
    mRPNM: {
      Title: "Main Category",
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
    "mRPNM": 'Main Category',
    "bCATCD": 'Balance Category Code',
    "bCATNM": 'Balance Category Name',
    "gRPCD": "Group Code",
    "gRPNM": "Group Name",
    "cATCD": "Category Code",
    "cATNM": "Category Name",
    "aCCD": "Account Code",
    "aCNM": "Account Name",


  };

  FilterButton = {
    name: "Filter List",
    functionName: "FilterList",
  };
  staticField = [
    "Account",
    "gRPNM",
    "cATNM",
    "mRPNM",
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
      width: "500px",
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
      this.TableData = res.data
        .map((x, index) => {
          return {
            ...x,
            SrNo: index + 1,
            Account: x.aCCD + ' : ' + x.aCNM,
            AccountGroup: x.SubCategoryCode === "" && x.SubCategoryName === "" ? "" : x.SubCategoryCode + ' : ' + x.SubCategoryName,
          };
        })
        .sort((a, b) => a.Account.localeCompare(b.Account)); // Sort by Account in ascending order
      // Formate Data and Store in csv file
      this.csvData = this.TableData.map((x) => {
        return {
          "mRPNM": String(x.mRPNM),
          "bCATCD": `${x.bCATCD}`,
          "bCATNM": String(x.bCATNM),
          "gRPCD": String(x.gRPCD),
          "gRPNM": String(x.gRPNM),
          "cATCD": String(x.cATCD),
          "cATNM": String(x.cATNM),
          "aCCD": String(x.aCCD),
          "aCNM": String(x.aCNM),
        };
      });
      this.csvDataType = {
        "mRPNM": "string",
        "bCATCD": "string",
        "bCATNM": "string",
        "gRPCD": "string",
        "gRPNM": "string",
        "cATCD": "string",
        "cATNM": "string",
        "aCCD": "string",
        "aCNM": "string",
      };

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
