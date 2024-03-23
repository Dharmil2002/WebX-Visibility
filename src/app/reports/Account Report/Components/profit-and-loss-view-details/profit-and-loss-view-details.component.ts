import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { finYear } from 'src/app/Utility/date/date-utils';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';

@Component({
  selector: 'app-profit-and-loss-view-details',
  templateUrl: './profit-and-loss-view-details.component.html'
})
export class ProfitAndLossViewDetailsComponent implements OnInit {
  HtmlTemplate: any;
  showView = true;
  FieldMapping: any;
  JsonData;
  RequestData: any;

  constructor(private route: ActivatedRoute, private accountReportService: AccountReportService) {
    this.route.queryParams.subscribe(params => {
      // Access your query string parameters here
      this.RequestData = params['notes'];
      // Do whatever you want with the parameters
    });
  }

  ngOnInit(): void {
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

    this.FieldMapping = [

      {
        Key: '[finYear]',
        Value: 'finYear',
      },
      {
        Key: '[reportdate]',
        Value: 'reportdate',
      },
      {
        Key: '[EndDate]',
        Value: 'EndDate',
      },
      {
        Key: '[CompanyIMG]',
        Value: 'CompanyIMG',
      },
      {
        Key: '[Schedule]',
        Value: 'Schedule',
      },


      {
        Key: '[AccountDetails.Notes]',
        Value: 'AccountDetails.[#].Notes',
      },
      {
        Key: '[AccountDetails.SubCategory]',
        Value: 'AccountDetails.[#].SubCategory',
      },
      {
        Key: '[AccountDetails.AccountName]',
        Value: 'AccountDetails.[#].AccountName',
      },
      {
        Key: '[AccountDetails.AmountCurrentFinYear]',
        Value: 'AccountDetails.[#].AmountCurrentFinYear',
      },
      {
        Key: '[AccountDetails.AmountLastFinYear]',
        Value: 'AccountDetails.[#].AmountLastFinYear',
      },

    ];
    this.HtmlTemplate = `<div>
    <div id="print" style="width: 900px; margin: 30px auto; box-sizing: border-box; padding: 10px; font-size: 12px;">
        <div style="display: flex;">
         <div
                style="width: 25%; display: flex; flex-direction: column; border: 1px solid black; justify-content: space-between;">
                <img src="[CompanyIMG]" style="width:100%;height:100%;" />
            </div>
            <div class="title" style="width: 75%; border: 1px solid black; ">
                <div style="padding: 5px; font-weight: 700; border-bottom: 1px solid black; display: flex; justify-content: space-between;">
    <span style="padding: 5px; font-weight: bold;font-size: 15px;">Profit and Loss Statement</span>
    <span style="padding: 5px; font-weight: bold;font-size: 15px;">Financial Year [finYear]</span>
</div>
  <div style="padding: 5px; font-weight: 700; border-bottom: 0px solid black; display: flex; justify-content: space-between;">
    <span style="padding: 5px; font-weight: bold;font-size: 15px;"> [reportdate]</span>
    <span style="padding: 5px; font-weight: bold;font-size: 15px;">   [Schedule]</span>
</div>

                
            </div>
           
        </div>
        
        <div style="margin: 10px 0px;">
            <table style="width: 100%;">
                <tr>
                    <td class="px-1"
                        style="font-weight: bold; width: 20%;font-size: 14px; text-align: center; border: 1px solid black;">
                        Note No</td>
                    <td class="px-1"
                        style="font-weight: bold;  width:20%; font-size: 14px; text-align: center; border: 1px solid black;">
                        Particular</td>
                    <td class="px-1"
                        style="font-weight: bold;  width: 20%; font-size: 14px; text-align: center; border: 1px solid black;">
                        Descriptions</td>
                    <td class="px-1"
                        style="font-weight: bold;  width: 20%; font-size: 14px; text-align: center; border: 1px solid black;">
                      Amount As on [EndDate]</td>
                    <td class="px-1"
                        style="font-weight: bold;   width: 20%;font-size: 14px; text-align: center; border: 1px solid black;">
                        Amount As on 31 Mar 23
                    </td>
                   
                </tr>
                <tr data-row="AccountDetails">
                    <td class="px-1" style="border: 1px solid black;">[AccountDetails.Notes]</td>
                    <td class="px-1" style="border: 1px solid black;">[AccountDetails.SubCategory]</td>
                     <td class="px-1" style="border: 1px solid black;">[AccountDetails.AccountName]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: right;">[AccountDetails.AmountCurrentFinYear]</td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[AccountDetails.AmountLastFinYear]</td>
                </tr>
            </table>
        </div>
    </div>

</div>`

  }


}
