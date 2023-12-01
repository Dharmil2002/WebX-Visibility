import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html'
})
export class ListBankComponent implements OnInit {
  breadScrums = [
    {
      title: "Bank Account Master",
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
    name: "Add Bank",
    iconName: "add",
  };
  columnHeader = {
    Bankname: {
      Title: "Bank Name",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    Accountnumber: {
      Title: "Account Number",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    IFSCcode: {
      Title: "IFSC Code",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    SWIFTcode: {
      Title: "SWIFT code",
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
    "Bankname",
    "Accountnumber",
    "IFSCcode",
    "SWIFTcode",
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any = [];
  constructor(private Route: Router, private masterService: MasterService) {}

  async ngOnInit() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "Bank_detail",
      filter: {},
    };
    const res = await firstValueFrom (this.masterService
      .masterPost("generic/get", req));
    if(res.success){
      this.TableData = res.data
      this.isTableLode = true
    }
  }

  AddNew(){
    this.Route.navigateByUrl("/Masters/AccountMaster/AddBankAccount");
  }
  EditFunction(event){
    this.Route.navigate(["/Masters/AccountMaster/AddBankAccount"], { state: { data: event?.data } });
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
