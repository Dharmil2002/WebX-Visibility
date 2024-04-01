import { Component, OnInit } from '@angular/core';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { timeString } from 'src/app/Utility/date/date-utils';
import { map } from 'rxjs/operators';
import { exportAsExcelFile, exportAsExcelFileV2 } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trial-balance-view',
  templateUrl: './trial-balance-view.component.html'
})
export class TrialBalanceViewComponent implements OnInit {
  HtmlTemplate: any;
  showView = true;
  FieldMapping: any;
  JsonData;
  EventButton = {
    functionName: "Download",
    name: "Download",
    iconName: "download",
  };
  constructor(private accountReportService: AccountReportService, private router: Router,) {

  }

  ngOnInit(): void {

    this.JsonData = JSON.parse(this.accountReportService.getDataForTrialBalance("TrialBalanceData"))
    if (!this.JsonData) {
      this.router.navigate(["/Reports/AccountReport/TrialBalance"]);
    }
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
        Key: '[Data.Debit]',
        Value: 'Data.[#].Debit',
      },

      {
        Key: '[Data.Credit]',
        Value: 'Data.[#].Credit',
      },


    ];
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

        <div style="margin: 10px 0px;">
            <table style="width: 100%;">
                <tr>
                    <td class="px-1"
                        style="font-weight: bold; font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>

                    <td colspan="2" class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Opening
                    </td>
                    <td colspan="2" class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Transaction

                    </td>
                    <td colspan="2" class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Closing

                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                </tr>
                <tr>
                    <td class="px-1"
                        style="font-weight: bold; ;font-size: 14px; text-align: center; border: 1px solid black;">
                        Main Category</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                        Balance Category</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: left; border: 1px solid black;">
                        Account Group Name</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: left; border: 1px solid black;">
                        Description Wise</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Debit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Credit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Debit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Credit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Debit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Credit
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Balance Amount
                    </td>

                </tr>
                <tr data-row="Data">
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: center;">
                        [Data.MainCategory]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.BalanceCategoryName]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.Debit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.Credit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">0
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">0
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">0
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">0
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">0
                    </td>
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
      "MainCategory": "Main Category",
      "BalanceCategoryName": "Balance Category",
      "GroupName": "Account Group Name",
      "Description": "Description Wise",
      "OpeningDebit": "Opening	Debit",
      "OpeningCredit": "Opening	Credit",
      "TransactionDebit": "Transaction	Debit",
      "TransactionCredit": "Transaction	Credit",
      "ClosingDebit": "Closing	Debit",
      "ClosingCredit": "Closing	Credit",
      "BalanceAmount": "Balance Amount",
    }

    const Result = this.JsonData.Data.map((item) => {
      return {
        "MainCategory": item["MainCategory"],
        "BalanceCategoryName": item["BalanceCategoryName"],
        "GroupName": item["GroupName"],
        "Description": item["Description"],
        "OpeningDebit": item["Debit"],
        "OpeningCredit": item["Credit"],
        "TransactionDebit": 0,
        "TransactionCredit": 0,
        "ClosingDebit": 0,
        "ClosingCredit": 0,
        "BalanceAmount": 0,
      }
    });

    exportAsExcelFile(Result, `TrialBalance_Report-${timeString}`, CSVHeader);
  }

}
