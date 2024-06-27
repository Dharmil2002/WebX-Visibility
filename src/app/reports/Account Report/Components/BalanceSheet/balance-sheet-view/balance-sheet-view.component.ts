import { Component, OnInit } from '@angular/core';
import { exportAsExcelFileV2 } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { GetLastFinYearEndDate, timeString } from 'src/app/Utility/date/date-utils';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-balance-sheet-view',
  templateUrl: './balance-sheet-view.component.html'
})
export class BalanceSheetViewComponent implements OnInit {
  HtmlTemplate: any;
  showView = false;
  FieldMapping: any;
  JsonData;
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private accountReportService: AccountReportService, private storage: StorageService) {

  }

  async ngOnInit(): Promise<void> {

    this.JsonData = JSON.parse(this.accountReportService.getDataForTrialBalance("BalanceSheet"));
    this.JsonData.BalanceSheetDetails.map((item) => {
      if (item.SubCategory === "Total") {
        item["FontWeight"] = "bold";
      }
      const currentAmount = Number(item.TotalAmountCurrentFinYear);
      if (!isNaN(currentAmount)) {
        item.TotalAmountCurrentFinYear = currentAmount.toLocaleString('en-US');
      }
    });
    const filterCritera = {
      cID: this.storage.companyCode,
      vTYPE: "BalanceSheetView",
    }
    const TemplateInfo = await this.accountReportService.GetTemplateForReports(filterCritera);
    this.FieldMapping = TemplateInfo.fMAP;
    this.HtmlTemplate = TemplateInfo.tHTML

    this.showView = true;
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
    const CSVHeader = {
      "MainCategory": "Particulars",
      "SubCategory": "Description",
      "Notes": "Note No",
      "TotalAmountCurrentFinYear": "Amount As on " + this.JsonData.EndDate,
      "TotalAmountLastFinYear": "Amount As on " + GetLastFinYearEndDate(this.JsonData.EndDate)
    }

    const Result = this.JsonData.BalanceSheetDetails.map((item) => {
      return {
        "MainCategory": item["MainCategory"],
        "SubCategory": item["SubCategory"],
        "Notes": item["Notes"],
        "TotalAmountCurrentFinYear": item["TotalAmountCurrentFinYear"] ? item["TotalAmountCurrentFinYear"] : 0,
        "TotalAmountLastFinYear": item["TotalAmountLastFinYear"] ? item["TotalAmountLastFinYear"] : 0,
      }
    });
    let NewArrayData = [];
    const TotalAmountLastFinYear = 0.00;
    this.JsonData.BalanceSheetDetails.forEach(element => {
      if (element.AccountDetails !== "") {
        if (element.AccountDetails !== undefined) {
          const AmountCurrentFinYear = element.AccountDetails.reduce((a, b) => a + b.Credit, 0) - element.AccountDetails.reduce((a, b) => a + b.Debit, 0);

          const newdata = {
            "Notes": element.Notes,
            "SubCategory": element.SubCategory,
            "AccountName": "Total",
            "AmountCurrentFinYear": AmountCurrentFinYear.toFixed(2),
            "AmountLastFinYear": TotalAmountLastFinYear.toFixed(2)
          };

          const result = element.AccountDetails.map(item => ({
            Notes: '',
            SubCategory: '',
            AccountName: item.AccountName,
            AmountCurrentFinYear: (item.Credit - item.Debit).toFixed(2),
            AmountLastFinYear: TotalAmountLastFinYear,

          }));

          NewArrayData.push(newdata, ...result);
        }
      }
    });


    const CSVHeader2 = {
      "Notes": "Note No",
      "SubCategory": "Particular",
      "AccountName": "Descriptions",
      "AmountCurrentFinYear": "Amount As on " + this.JsonData.EndDate,
      "AmountLastFinYear": "Amount As on " + GetLastFinYearEndDate(this.JsonData.EndDate)

    }
    const mappedJsonResult = NewArrayData.map((item) => {
      return {
        "Notes": item["Notes"],
        "SubCategory": item["SubCategory"],
        "AccountName": item["AccountName"],
        "AmountCurrentFinYear": item["AmountCurrentFinYear"] ? item["AmountCurrentFinYear"] : 0,
        "AmountLastFinYear": item["AmountLastFinYear"] ? item["AmountLastFinYear"] : 0,
      }
    }
    );


    exportAsExcelFileV2(Result, `BalanceSheet_Report-${timeString}`, CSVHeader, 'Balance Sheet Result',
      mappedJsonResult, CSVHeader2, 'Balance Sheet - Notes');
  }

}
