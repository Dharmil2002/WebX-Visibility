import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';

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
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "EditFunction",
      iconName: "edit",
    },
  };
  staticField = [
    "AcGroupName",
    "AcGroupCategoryName",
    "BalanceSheetName",
    "AcLedger",
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any = [];
  constructor(private Route: Router, private masterService: MasterService) {}

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
