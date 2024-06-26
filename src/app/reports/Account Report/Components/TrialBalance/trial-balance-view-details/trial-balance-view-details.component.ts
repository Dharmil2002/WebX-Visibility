import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { formatAmount, timeString } from 'src/app/Utility/date/date-utils';
import { ExportService } from 'src/app/Utility/module/export.service';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-trial-balance-view-details',
  templateUrl: './trial-balance-view-details.component.html'
})
export class TrialBalanceViewDetailsComponent implements OnInit {
  HtmlTemplate: any;
  showView = false;
  FieldMapping: any;
  JsonData;
  ParamRequest: any;
  voucherNo = false;
  templateBody = {
    DocNo: "",
    templateName: "VR",
    PartyField: ""
  };
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private route: ActivatedRoute,
    private exportService: ExportService, private router: Router,
    private Storage: StorageService,
    private accountReportService: AccountReportService) {
    this.route.queryParams.subscribe(params => {
      this.voucherNo = params['voucher'];
      // Access your query string parameters here
      this.ParamRequest = params['notes'];
      // Do whatever you want with the parameters
    });
  }

  async ngOnInit() {

    if (!this.ParamRequest) {
      this.router.navigate(["/Reports/AccountReport/TrialBalanceview"]);
    }
    if (this.voucherNo) {
      const templateBody = {
        DocNo: this.voucherNo,
        templateName: "VR",
        PartyField: ""
      };
      window.close();
      const url = `${window.location.origin
        }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
      window.open(url, "", "width=1000,height=800");
    }
    const RequestData = JSON.parse(this.accountReportService.getDataForTrialBalance("TrialBalanceRequest"));

    RequestData["AccountCode"] = this.ParamRequest.split(":")[0];

    const MatchFilter = {
      'D$match': {
        'aCCCD': RequestData.AccountCode,
        'lOC': {
          'D$in': RequestData.branch
        },
        'vDT': {
          'D$gte': RequestData.startdate,
          'D$lte': RequestData.enddate
        }
      }
    }
    // switch (RequestData.ReportType) {
    //   case "C":
    //     MatchFilter['D$match']['cUST'] = {
    //       'D$in': RequestData.branch
    //     }
    //     break;
    // }
    const Result = await this.accountReportService.GetTrialBalanceDetailsStatement(RequestData, MatchFilter);

    this.JsonData = {
      "Data": Result
    }
    if (Result) {
      this.JsonData.Data = this.JsonData.Data.map(item => {
        return {
          ...item,
          cR: formatAmount(item.cR),
          dR: formatAmount(item.dR),
        };
      });
      this.RenderHTMLData();
    }
  }
  async RenderHTMLData() {
    const filterCritera = {
      cID: this.Storage.companyCode,
      vTYPE: "VoucherViewReport",
    }
    const TemplateInfo = await this.accountReportService.GetTemplateForReports(filterCritera);
    this.FieldMapping = TemplateInfo.fMAP;
    this.HtmlTemplate = TemplateInfo.tHTML
    this.showView = true

  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  Download() {
    const CSVHeader: any = {
      VoucherDate: "Voucher Date",
      TransactionType: "Transaction Type",
      VoucherNo: "Voucher No",
      PartyName: "Party Name",
      AccountName: "Account Name",
      DebitAmount: "Debit Amount",
      CreditAmount: "Credit Amount",
      Narration: "Narration",
      Branch: "Branch"
    }
    this.exportService.exportAsCSV(this.JsonData.Data, `TrialBalance_Report_Details-${timeString}`, CSVHeader);
  }

}
