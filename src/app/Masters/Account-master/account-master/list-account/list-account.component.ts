import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html'
})
export class ListAccountComponent implements OnInit {
  breadScrums = [
    {
      title: "Account Master",
      items: ["Home"],
      active: "Account",
    },
  ];
  isTableLode = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add Account",
    iconName: "add",
  };
  columnHeader = {
    AcGroupName: {
      Title: "Account Group Name",
      class: "matcolumncenter",
      Style: "min-width:15%",
      sticky: true
    },
    AcGroupCategoryName: {
      Title: "Account Category",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    BalanceSheetName: {
      Title: "Balance Sheet Name",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    AcLedger: {
      Title: "Account Name",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    EditAction: {
      type: "iconClick",
      Title: "",
      class: "matcolumncenter",
      Style: "min-width:80px; max-width:80px;",
      functionName: "EditFunction",
      iconName: "edit",
      stickyEnd: true
    },
  };
  staticField = [
    "AcGroupName",
    "AcGroupCategoryName",
    "BalanceSheetName",
    "AcLedger",
  ];
  CompanyCode = 0;
  TableData: any = [];
  constructor(private Route: Router, private masterService: MasterService, private storage: StorageService) {
    this.CompanyCode = this.storage.companyCode;
  }

  async ngOnInit() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "accountdetail",
      filter: {},
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise();
    if(res.success){
      this.TableData = res.data
    }
    this.isTableLode = true
  }

  AddNew(){
    this.Route.navigateByUrl("/Masters/AccountMaster/AddAccount");
  }
  EditFunction(event){
    this.Route.navigate(["/Masters/AccountMaster/AddAccount"], { state: { data: event?.data } });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
