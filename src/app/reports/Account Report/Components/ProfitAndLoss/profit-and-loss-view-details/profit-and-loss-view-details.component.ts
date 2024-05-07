import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { finYear } from 'src/app/Utility/date/date-utils';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-profit-and-loss-view-details',
  templateUrl: './profit-and-loss-view-details.component.html'
})
export class ProfitAndLossViewDetailsComponent implements OnInit {
  HtmlTemplate: any;
  showView = false;
  FieldMapping: any;
  JsonData;
  RequestData: any;

  constructor(private route: ActivatedRoute, private accountReportService: AccountReportService,
    private storage: StorageService) {
    this.route.queryParams.subscribe(params => {
      // Access your query string parameters here
      this.RequestData = params['notes'];
      // Do whatever you want with the parameters
    });
  }

  async ngOnInit(): Promise<void> {
    const JsonData = JSON.parse(this.accountReportService.getData());
    const SingleData = JsonData.ProfitAndLossDetails.find(item => item.SubCategory == this.RequestData);

    const TotalAmountCurrentFinYear = SingleData.AccountDetails.reduce((a, b) => a + b.Credit, 0) - SingleData.AccountDetails.reduce((a, b) => a + b.Debit, 0);
    const TotalAmountLastFinYear = 0.00;
    const newdata = {
      "Notes": SingleData.Notes,
      "SubCategory": SingleData.SubCategory,
      "AccountName": "Total",
      "AmountCurrentFinYear": TotalAmountCurrentFinYear.toFixed(2),
      "AmountLastFinYear": TotalAmountLastFinYear.toFixed(2)
    };

    const result = SingleData.AccountDetails.map(item => ({
      Notes: '',
      SubCategory: '',
      AccountName: item.AccountName,
      AmountCurrentFinYear: (item.Credit - item.Debit).toFixed(2),
      AmountLastFinYear: TotalAmountLastFinYear.toFixed(2)
    }));

    const dataArray = [newdata, ...result];
    this.JsonData = {
      "CompanyIMG": JsonData.CompanyIMG,
      "finYear": finYear,
      "reportdate": "As on Date " + JsonData.EndDate,
      "EndDate": JsonData.EndDate,
      "Schedule": "Schedule III Compliant",
      "AccountDetails": dataArray
    }

    const filterCritera = {
      cID: this.storage.companyCode,
      vTYPE: "ProfitAndLossViewDetails",
    }
    const TemplateInfo = await this.accountReportService.GetTemplateForReports(filterCritera);
    this.FieldMapping = TemplateInfo.fMAP;
    this.HtmlTemplate = TemplateInfo.tHTML
    this.showView = true;


  }


}
