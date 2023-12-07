import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: "app-list-group",
  templateUrl: "./list-group.component.html",
})
export class ListGroupComponent implements OnInit {
  breadScrums = [
    {
      title: "Account Group Master",
      items: ["Home"],
      active: "Account",
    },
  ];
  isTableLode = false;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add Account Group",
    iconName: "add",
  };
  columnHeader = {
    
    Groupcode: {
      Title: "Group Code",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    GroupName: {
      Title: "Group Name",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    AcGroupCatName: {
      Title: "Account Group Cat.",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    BalanceSheetName: {
      Title: "Balance Sheet",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:20%",
      functionName: "EditFunction",
      iconName: "edit",
    },
  };
  staticField = [
    "Groupcode",
    "AcGroupCatName",
    "BalanceSheetName",
    "GroupName",
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any ;
  constructor(private Route: Router, private masterService: MasterService) {}

  ngOnInit(): void {
    this.getTableData()
  }
  async getTableData(){
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "Acgroup_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    if(res.success){
      this.TableData = res.data
      this.isTableLode = true
    }
  }
  AddNew(){
    this.Route.navigateByUrl("/Masters/AccountMaster/AddAccountGroup");
  }
  EditFunction(event){
    this.Route.navigate(["/Masters/AccountMaster/AddAccountGroup"], { state: { data: event?.data } });
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
