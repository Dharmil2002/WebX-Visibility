import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

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
      class: "matcolumnleft",
      Style: "min-width:15%",
      sticky: true,      
    },
    Accountnumber: {
      Title: "Account Number",
      class: "matcolumnleft",
      Style: "min-width:15%",
      sticky: true,  
    },
    IFSCcode: {
      Title: "IFSC Code",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    SWIFTcode: {
      Title: "SWIFT code",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "EditFunction",
      iconName: "edit",
      stickyEnd: true,
    },
  };
  staticField = [
    "Bankname",
    "Accountnumber",
    "IFSCcode",
    "SWIFTcode",
  ];
  CompanyCode = 0;
  TableData: any = [];
  constructor(private Route: Router, private masterService: MasterService, private storage: StorageService) {
    this.CompanyCode = this.storage.companyCode;
  }

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
