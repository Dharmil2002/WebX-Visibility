import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-tds",
  templateUrl: "./list-tds.component.html",
})
export class ListTdsComponent implements OnInit {
  breadScrums = [
    {
      title: "TDS Master",
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
    functionName:'AddNew',
    name: "Add TDS",
    iconName:'add'
  }
  columnHeader = {
    TDScode: {
      Title: "TDS code",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    TDSsection: {
      Title: "TDS section",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    PaymentType: {
      Title: "Payment Type",
      class: "matcolumnleft",
      Style: "min-width:30%",
    },
    RateForHUF: {
      Title: "Rate For HUF",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Thresholdlimit: {
      Title: "Threshold Limit",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    RateForOthers: {
      Title: "Rate For Others",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    isActive: {
      type: "Activetoggle",
      Title: "Active",
      class: "matcolumncenter",
      Style: "min-width:10%",
      functionName: "ActiveFunction",
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
    "TDScode",
    "TDSsection",
    "PaymentType",
    "RateForHUF",
    "Thresholdlimit",
    "RateForOthers"
  ];
  CompanyCode = parseInt(localStorage.getItem('companyCode'))
  TableData: any;
  constructor(
    private Route: Router,
    private masterService: MasterService,
  ) {}

  ngOnInit(): void {
    this.getTableData()
  }

  async getTableData(){
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "tds_detail",
      filter: {},
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise();
    if(res.success){
      this.TableData = res.data
      this.isTableLode = true
    }
  }

  AddNew(){
    this.Route.navigateByUrl("/Masters/AccountMaster/AddTds");
  }
  EditFunction(event){
    this.Route.navigate(["/Masters/AccountMaster/AddTds"], { state: { data: event?.data } });
  }

  async ActiveFunction(event){
    const Body = {
      isActive:event.data.isActive
    }
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "tds_detail",
      filter: { TDScode: event.data.TDScode },
      update: Body,
    };
    const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
    if(res.success){
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
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
