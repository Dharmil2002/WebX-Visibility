import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consingment-summary',
  templateUrl: './consingment-summary.component.html'
})
export class ConsingmentSummaryComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note Summary Tracking ",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  DocData: any;
  TableData: any[] = [];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  isTableLode: boolean = false;
  constructor(
    private Route: Router,
    private masterService: MasterService
  ) { 
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.DocData= this.Route.getCurrentNavigation().extras?.state.data;
      console.log('this.DocData' ,this.DocData)
    }else{
      this.Route.navigateByUrl("Operation/ConsignmentFilter")
    }
  }

  ngOnInit(): void {
    this.getTableData()
  }

  async getTableData() {
    const Mode = localStorage.getItem("Mode");
    const req = {
      companyCode: this.CompanyCode,
      collectionName: Mode == "FTL" ? "docket_events" : "docket_events_ltl",
      filter: { dKTNO: this.DocData.DocNo },
    };

    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
      console.log('res' , res)
    if (res.success && res.data.length > 0) {
      this.TableData = res.data.map((x) => {
        return {
          ...x,
          Date: moment(x.eNTDT).format("DD/MM/YYYY"),
          Event: Mode == "FTL" ? x.oPSTS || "" : x.oPSSTS || "",
        };
      });
    } else {
      this.TableData = [];
      Swal.fire({
        icon: "info",
        title: "Docket Number Not Found",
        text: "The provided Docket Number does not exist.",
        showConfirmButton: true,
      });
    }
    this.isTableLode = true;
  }

}
