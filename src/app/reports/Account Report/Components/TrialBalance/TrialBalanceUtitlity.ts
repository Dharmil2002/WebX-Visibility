
export function GetCSVHeadersBasedOnReportType(ReportType) {
    switch (ReportType) {
        case "G":
            return {
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
        case "L":
            return {
                "LocationWise": "Location",
                "MainCategory": "Main Category",
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
        case "C":
            return {
                "PartyDetails": "Customer",
                "MainCategory": "Main Category",
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
        case "V":
            return {
                "PartyDetails": "Vendor",
                "MainCategory": "Main Category",
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
        case "E":
            return {
                "EmployeeWise": "Employee",
                "MainCategory": "Main Category",
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
    }
}


export function GetCSVDataBasedOnReportType(ReportType, JsonData) {
    switch (ReportType) {
        case "G":
            return GetCSVDataForGroupWise(JsonData)
        case "L":
            return GetCSVDataForLocationWise(JsonData)
        case "C":
            return GetCSVDataForCustomerWise(JsonData)
        case "V":
            return GetCSVDataForVendorWise(JsonData)
        case "E":
            return GetCSVDataForEmployeeWise(JsonData)

    }
}
function GetCSVDataForEmployeeWise(JsonData) {
    const Result = JsonData.Data.map((item) => {
        return {
            "EmployeeWise": item["EmployeeWise"],
            "MainCategory": item["MainCategory"],
            "GroupName": item["GroupName"],
            "Description": item["Description"],
            "OpeningDebit": item["OpeningDebit"],
            "OpeningCredit": item["OpeningCredit"],
            "TransactionDebit": item["TransactionDebit"],
            "TransactionCredit": item["TransactionCredit"],
            "ClosingDebit": item["ClosingDebit"],
            "ClosingCredit": item["ClosingCredit"],
            "BalanceAmount": item["BalanceAmount"],
        }
    });
    return Result
}
function GetCSVDataForCustomerWise(JsonData) {
    const Result = JsonData.Data.map((item) => {
        return {
            "PartyDetails": item["PartyDetails"],
            "MainCategory": item["MainCategory"],
            "GroupName": item["GroupName"],
            "Description": item["Description"],
            "OpeningDebit": item["OpeningDebit"],
            "OpeningCredit": item["OpeningCredit"],
            "TransactionDebit": item["TransactionDebit"],
            "TransactionCredit": item["TransactionCredit"],
            "ClosingDebit": item["ClosingDebit"],
            "ClosingCredit": item["ClosingCredit"],
            "BalanceAmount": item["BalanceAmount"],
        }
    });
    return Result
}
function GetCSVDataForVendorWise(JsonData) {
    const Result = JsonData.Data.map((item) => {
        return {
            "PartyDetails": item["PartyDetails"],
            "MainCategory": item["MainCategory"],
            "GroupName": item["GroupName"],
            "Description": item["Description"],
            "OpeningDebit": item["OpeningDebit"],
            "OpeningCredit": item["OpeningCredit"],
            "TransactionDebit": item["TransactionDebit"],
            "TransactionCredit": item["TransactionCredit"],
            "ClosingDebit": item["ClosingDebit"],
            "ClosingCredit": item["ClosingCredit"],
            "BalanceAmount": item["BalanceAmount"],
        }
    });
    return Result
}
function GetCSVDataForGroupWise(JsonData) {
    const Result = JsonData.Data.map((item) => {
        return {
            "MainCategory": item["MainCategory"],
            "BalanceCategoryName": item["BalanceCategoryName"],
            "GroupName": item["GroupName"],
            "Description": item["Description"],
            "OpeningDebit": item["OpeningDebit"],
            "OpeningCredit": item["OpeningCredit"],
            "TransactionDebit": item["TransactionDebit"],
            "TransactionCredit": item["TransactionCredit"],
            "ClosingDebit": item["ClosingDebit"],
            "ClosingCredit": item["ClosingCredit"],
            "BalanceAmount": item["BalanceAmount"],
        }
    });
    return Result
}
function GetCSVDataForLocationWise(JsonData) {
    const Result = JsonData.Data.map((item) => {
        return {
            "LocationWise": item["LocationWise"],
            "MainCategory": item["MainCategory"],
            "GroupName": item["GroupName"],
            "Description": item["Description"],
            "OpeningDebit": item["OpeningDebit"],
            "OpeningCredit": item["OpeningCredit"],
            "TransactionDebit": item["TransactionDebit"],
            "TransactionCredit": item["TransactionCredit"],
            "ClosingDebit": item["ClosingDebit"],
            "ClosingCredit": item["ClosingCredit"],
            "BalanceAmount": item["BalanceAmount"],
        }
    });
    return Result
}

export function GetHTMLBasedOnReportType(ReportType) {
    let HtmlTemplateBody = "";
    switch (ReportType) {
        case "G":
            HtmlTemplateBody = ` <div style="margin: 10px 0px;">
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
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: left;">
                        [Data.MainCategory]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.BalanceCategoryName]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.BalanceAmount]
                    </td>
                </tr>
            </table>
        </div>`
            break;
        case "L":
            HtmlTemplateBody = ` <div style="margin: 10px 0px;">
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
                        Location</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                        Main Category</td>
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
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: left;">
                        [Data.LocationWise]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.MainCategory]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.BalanceAmount]
                    </td>
                </tr>
            </table>
        </div>`
            break;
        case "C":
            HtmlTemplateBody = ` <div style="margin: 10px 0px;">
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
                        Customer</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                        Main Category</td>
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
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: left;">
                        [Data.PartyDetails]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.MainCategory]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                     <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.BalanceAmount]
                    </td>
                </tr>
            </table>
        </div>`
            break;
        case "V":
            HtmlTemplateBody = ` <div style="margin: 10px 0px;">
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
                        Vendor</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                        Main Category</td>
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
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: left;">
                        [Data.PartyDetails]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.MainCategory]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.BalanceAmount]
                    </td>
                </tr>
            </table>
        </div>`
            break;
        case "E":
            HtmlTemplateBody = ` <div style="margin: 10px 0px;">
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
                        Employee</td>
                    <td class="px-1"
                        style="font-weight: bold;   font-size: 14px; text-align: left; border: 1px solid black;">
                        Main Category</td>
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
                    <td class="px-1" style="border: 1px solid black;font-weight: bold;text-align: left;">
                        [Data.EmployeeWise]</td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.MainCategory]</td>
                   
                    <td class="px-1" style="border: 1px solid black;text-align: left;">[Data.GroupName]
                    </td>
                    <td class="px-1" style="border: 1px solid black;text-align: left;">
                        <a href="/#/Reports/AccountReport/TrialBalanceviewdetails?notes=[Data.Description]"
                            target="_blank">[Data.Description] </a>
                    </td>
                     <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.OpeningCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.TransactionCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingDebit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.ClosingCredit]
                    </td>
                    <td class="px-1" style="border: 1px solid black; text-align: right;">[Data.BalanceAmount]
                    </td>
                </tr>
            </table>
        </div>`
            break;
    }
    return HtmlTemplateBody;

}
