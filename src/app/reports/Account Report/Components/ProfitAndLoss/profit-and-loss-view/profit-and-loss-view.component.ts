import { Component, OnInit } from '@angular/core';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { exportAsExcelFileV2, } from '../../../../../Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { GetLastFinYearEndDate, timeString } from 'src/app/Utility/date/date-utils';
import { map } from 'rxjs/operators';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-profit-and-loss-view',
  templateUrl: './profit-and-loss-view.component.html'
})
export class ProfitAndLossViewComponent implements OnInit {
  HtmlTemplate: any;
  showView = false;
  FieldMapping: any;
  JsonData;
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private accountReportService: AccountReportService,
    private storage: StorageService
  ) {

  }

  async ngOnInit(): Promise<void> {

    this.JsonData = JSON.parse(this.accountReportService.getData())
    this.JsonData.ProfitAndLossDetails.map((item) => {
      if (item.SubCategory === "Total") {
        item["FontWeight"] = "bold";
      }
      if (item.SubCategory) {
        item["SubCategoryLink"] = encodeURIComponent(item.SubCategory);
      }
      const currentAmount = Number(item.TotalAmountCurrentFinYear);
      if (!isNaN(currentAmount)) {
        item.TotalAmountCurrentFinYear = currentAmount.toLocaleString('en-US');
      }
    });
    const filterCritera = {
      cID: this.storage.companyCode,
      vTYPE: "ProfitAndLossView",
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
      "TotalAmountLastFinYear": "Amount As on " + GetLastFinYearEndDate(this.JsonData.EndDate),
    }

    const Result = this.JsonData.ProfitAndLossDetails.map((item) => {
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
    this.JsonData.ProfitAndLossDetails.forEach(element => {
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
      "AmountLastFinYear": "Amount As on " + GetLastFinYearEndDate(this.JsonData.EndDate),

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

    exportAsExcelFileV2(Result, `Profit&Loss_Report-${timeString}`, CSVHeader, 'Profit & Loss Result',
      mappedJsonResult, CSVHeader2, 'Profit & Loss - Notes');
  }

}
