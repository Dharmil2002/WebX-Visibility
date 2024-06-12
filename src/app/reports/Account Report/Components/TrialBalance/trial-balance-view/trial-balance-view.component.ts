import { Component, OnInit } from '@angular/core';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { formatAmount, timeString } from 'src/app/Utility/date/date-utils';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GetCSVDataBasedOnReportType, GetCSVHeadersBasedOnReportType, GetHTMLBasedOnReportType } from '../TrialBalanceUtitlity';
import { ExportService } from 'src/app/Utility/module/export.service';

@Component({
  selector: 'app-trial-balance-view',
  templateUrl: './trial-balance-view.component.html'
})
export class TrialBalanceViewComponent implements OnInit {
  HtmlTemplate: any;
  showView = true;
  FieldMapping: any;
  JsonData;
  RequestBody;
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private accountReportService: AccountReportService,
    private router: Router, private exportService: ExportService) {

  }

  ngOnInit(): void {

    this.JsonData = JSON.parse(this.accountReportService.getDataForTrialBalance("TrialBalanceData"))
    this.RequestBody = JSON.parse(this.accountReportService.getDataForTrialBalance("TrialBalanceRequest"))

    if (!this.JsonData) {
      this.router.navigate(["/Reports/AccountReport/TrialBalance"]);
    }

    this.JsonData.Data = this.JsonData.Data.map(item => {
      return {
        ...item,
        TransactionDebit: formatAmount(item.TransactionDebit),
        TransactionCredit: formatAmount(item.TransactionCredit),
        OpeningDebit: formatAmount(item.OpeningDebit),
        OpeningCredit: formatAmount(item.OpeningCredit),
        ClosingDebit: formatAmount(item.ClosingDebit),
        ClosingCredit: formatAmount(item.ClosingCredit),
        BalanceAmount: formatAmount(item.BalanceAmount),
      };
    });

    this.FieldMapping = [

      {
        Key: '[Logo]',
        Value: 'Logo',
      },
      {
        Key: '[Title]',
        Value: 'Title',
      },

      {
        Key: '[Data.MainCategory]',
        Value: 'Data.[#].MainCategory',
      },
      {
        Key: '[Data.BalanceCategoryName]',
        Value: 'Data.[#].BalanceCategoryName',
      },
      {
        Key: '[Data.GroupName]',
        Value: 'Data.[#].GroupName',
      },
      {
        Key: '[Data.Description]',
        Value: 'Data.[#].Description',
      },
      {
        Key: '[Data.Description]',
        Value: 'Data.[#].Description',
      },
      {
        Key: '[Data.TransactionCredit]',
        Value: 'Data.[#].TransactionCredit',
      },

      {
        Key: '[Data.TransactionDebit]',
        Value: 'Data.[#].TransactionDebit',
      },
      {
        Key: '[Data.ClosingCredit]',
        Value: 'Data.[#].ClosingCredit',
      },

      {
        Key: '[Data.ClosingDebit]',
        Value: 'Data.[#].ClosingDebit',
      },
      {
        Key: '[Data.OpeningCredit]',
        Value: 'Data.[#].OpeningCredit',
      },

      {
        Key: '[Data.OpeningDebit]',
        Value: 'Data.[#].OpeningDebit',
      },
      {
        Key: '[Data.BalanceAmount]',
        Value: 'Data.[#].BalanceAmount',
      },
    ];
    if (this.RequestBody) {
      switch (this.RequestBody.ReportType) {
        case "G":
          this.RenderHTMLData('G');
          break;
        case "L":
          this.FieldMapping.push({
            Key: '[Data.LocationWise]',
            Value: 'Data.[#].LocationWise',
          })
          this.RenderHTMLData('L');
          break;
        case "C":
          this.FieldMapping.push({
            Key: '[Data.PartyDetails]',
            Value: 'Data.[#].PartyDetails',
          })
          this.RenderHTMLData('C');
          break;
        case "V":
          this.FieldMapping.push({
            Key: '[Data.PartyDetails]',
            Value: 'Data.[#].PartyDetails',
          })
          this.RenderHTMLData('V');
          break;
        case "E":
          this.FieldMapping.push({
            Key: '[Data.EmployeeWise]',
            Value: 'Data.[#].EmployeeWise',
          });
          this.RenderHTMLData('E');
          break;
      }
    }
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
    const CSVHeader: any = GetCSVHeadersBasedOnReportType(this.RequestBody.ReportType)
    const Result: any = GetCSVDataBasedOnReportType(this.RequestBody.ReportType, this.JsonData);
    this.exportService.exportAsCSV(Result, `TrialBalance_Report-${timeString}`, CSVHeader);
  }


  RenderHTMLData(ReportType) {

    let HtmlTemplateBody: any = GetHTMLBasedOnReportType(ReportType)


    this.HtmlTemplate = `<div>
    <div id="print" style=" margin: 30px auto; box-sizing: border-box; padding: 10px; font-size: 12px;">
        <div style="display: flex;">
            <div
                style="width: 25%; display: flex; flex-direction: column; border: 1px solid black; justify-content: center;">
                <img src="[Logo]" style="width:100%;height:100%;" />
            </div>
            <div class="title" style="width: 75%; border: 1px solid black; ">
                <div
                    style="padding: 5px; font-weight: 700; border-bottom: 0px solid black; display: flex; justify-content: center;">
                    <span style="padding: 5px; font-weight: bold;font-size: 15px;"> [Title]</span>
                </div>
            </div>
        </div>
      ${HtmlTemplateBody}
       
    </div>

</div>`
  }

}
