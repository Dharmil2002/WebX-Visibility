import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';

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

  constructor(private route: ActivatedRoute, private router: Router, private accountReportService: AccountReportService) {
    this.route.queryParams.subscribe(params => {
      // Access your query string parameters here
      this.ParamRequest = params['notes'];
      // Do whatever you want with the parameters
    });
  }

  async ngOnInit() {

    if (!this.ParamRequest) {
      this.router.navigate(["/Reports/AccountReport/TrialBalanceview"]);
    }
    const RequestData = JSON.parse(this.accountReportService.getDataForTrialBalance("TrialBalanceRequest"));

    RequestData["AccountCode"] = this.ParamRequest.split(":")[0];
    const Result = await this.accountReportService.GetTrialBalanceDetailsStatement(RequestData);
    this.JsonData = {
      "Data": Result
    }
    if (Result) {
      this.RenderHTMLData();
    }
  }
  RenderHTMLData() {
    this.showView = true
    this.FieldMapping = [

      {
        Key: '[Data.VoucherDate]',
        Value: 'Data.[#].VoucherDate',
      },
      {
        Key: '[Data.TransactionType]',
        Value: 'Data.[#].TransactionType',
      },
      {
        Key: '[Data.VoucherNo]',
        Value: 'Data.[#].VoucherNo',
      },
      {
        Key: '[Data.PartyName]',
        Value: 'Data.[#].PartyName',
      },
      {
        Key: '[Data.Branch]',
        Value: 'Data.[#].Branch',
      },
      {
        Key: '[Data.CreditAmount]',
        Value: 'Data.[#].CreditAmount',
      },

      {
        Key: '[Data.DebitAmount]',
        Value: 'Data.[#].DebitAmount',
      },
      {
        Key: '[Data.Narration]',
        Value: 'Data.[#].Narration',
      },
      {
        Key: '[Data.AccountName]',
        Value: 'Data.[#].AccountName',
      },



    ];
    this.HtmlTemplate = `<div>
    <div id="print" style=" margin: 30px auto; box-sizing: border-box; padding: 10px; font-size: 12px;">

        <div style="margin: 10px 0px;">
            <table style="width: 100%;">
                <tr>
                    <td colspan="3" class="px-1"
                        style="font-weight: bold; font-size: 14px; text-align: center; border: 1px solid black;">
                        Voucher
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>

                    <td colspan="2" class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Amount
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                    </td>
                </tr>
                <tr>
                    <td class="px-1"
                        style="font-weight: bold; ;font-size: 14px; text-align: center; border: 1px solid black;">
                        VR.Date</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                       Trans Type</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: left; border: 1px solid black;">
                       VR.Number</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: left; border: 1px solid black;">
                        Party</td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: left; border: 1px solid black;">
                        Particular</td>
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
                        Narration
                    </td>
                    <td class="px-1"
                        style="font-weight: bold;  font-size: 14px; text-align: center; border: 1px solid black;">
                        Location
                    </td>

                </tr>
                <tr data-row="Data">
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: center;">
                        [Data.VoucherDate]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.TransactionType]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.VoucherNo]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: left;">[Data.PartyName]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: left;">[Data.AccountName]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.DebitAmount]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.CreditAmount]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: left;">[Data.Narration]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: left;">[Data.Branch]
                    </td>
                    
                </tr>
            </table>
        </div>
    </div>

</div>`

  }
}
