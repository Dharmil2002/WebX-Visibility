import { Component, OnInit } from '@angular/core';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { exportAsExcelFileV2, } from '../../../../Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { timeString } from 'src/app/Utility/date/date-utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profit-and-loss-view',
  templateUrl: './profit-and-loss-view.component.html'
})
export class ProfitAndLossViewComponent implements OnInit {
  HtmlTemplate: any;
  showView = true;
  FieldMapping: any;
  JsonData;
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private accountReportService: AccountReportService,) {

  }

  ngOnInit(): void {

    this.JsonData = JSON.parse(this.accountReportService.getData())
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
        Key: '[ProfitAndLossDetails.MainCategory]',
        Value: 'ProfitAndLossDetails.[#].MainCategory',
      },
      {
        Key: '[ProfitAndLossDetails.SubCategory]',
        Value: 'ProfitAndLossDetails.[#].SubCategory',
      },
      {
        Key: '[ProfitAndLossDetails.SubCategory]',
        Value: 'ProfitAndLossDetails.[#].SubCategory',
      },
      {
        Key: '[ProfitAndLossDetails.TotalAmountCurrentFinYear]',
        Value: 'ProfitAndLossDetails.[#].TotalAmountCurrentFinYear',
      },
      {
        Key: '[ProfitAndLossDetails.TotalAmountLastFinYear]',
        Value: 'ProfitAndLossDetails.[#].TotalAmountLastFinYear',
      },

      {
        Key: '[ProfitAndLossDetails.Notes]',
        Value: 'ProfitAndLossDetails.[#].Notes',
      },
      {
        Key: '[ProfitAndLossDetails.LastYearAmount]',
        Value: 'ProfitAndLossDetails.[#].LastYearAmount',
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
                        Particulars</td>
                    <td class="px-1"
                        style="font-weight: bold;  width:20%; font-size: 14px; text-align: center; border: 1px solid black;">
                        Description</td>
                    <td class="px-1"
                        style="font-weight: bold;  width: 20%; font-size: 14px; text-align: center; border: 1px solid black;">
                        Note No</td>
                    <td class="px-1"
                        style="font-weight: bold;  width: 20%; font-size: 14px; text-align: center; border: 1px solid black;">
                        Amount As on [EndDate]</td>
                    <td class="px-1"
                        style="font-weight: bold;   width: 20%;font-size: 14px; text-align: center; border: 1px solid black;">
                        Amount As on 31 Mar 23
                    </td>
                   
                </tr>
                <tr data-row="ProfitAndLossDetails">
                    <td class="px-1" style="border: 1px solid black;text-align: center;">[ProfitAndLossDetails.MainCategory]</td>
                    <td class="px-1" style="border: 1px solid black;">[ProfitAndLossDetails.SubCategory]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: center;"> 
                     <a href="/#/Reports/AccountReport/ProfitAndLossviewdetails?notes=[ProfitAndLossDetails.SubCategory]"  target="_blank">[ProfitAndLossDetails.Notes] </a>
                     </td>
                    <td class="px-1" style="border: 1px solid black;text-align: right;">[ProfitAndLossDetails.TotalAmountCurrentFinYear]</td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[ProfitAndLossDetails.TotalAmountLastFinYear]</td>
                </tr>
            </table>
        </div>
    </div>

</div>`
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
      "TotalAmountLastFinYear": "Amount As on 31 Mar 23"
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
      "AmountLastFinYear": "Amount As on 31 Mar 23"

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
