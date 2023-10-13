import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thc-view',
  templateUrl: './thc-view.component.html' 
})
export class THCViewComponent implements OnInit {
  breadscrums = [
    {
      title: "vehicle-loading",
      items: ["Loading-Sheet"],
      active: "vehicle-loading"
    }
  ];
  companylogo: string;
  imageUrl: string;
  LodeViewPrint = true
  constructor() {
    this.companylogo = localStorage.getItem("company_Logo"); // Get company logo from local storage
    this.imageUrl = "data:image/jpeg;base64, " + this.companylogo + ""; 
   }

  ngOnInit(): void {
    
  }
  HtmlTemplate = `
  <div class="form-horizontal mr-5 ml-5">
            <div class="form">
                <div class="form-body">
                    <div class="row mt-5">
                        <div class="col-md-4">
                            <div class="form-group">
                                <img src='/assets/images/globe.png' height="75" />
                            </div>
                        </div>
                        <div class="col-md-4" style="border-left:4px solid #D8DAD9;">
                            <div class="form-group">
                                <div style="font-size: 25px;font-weight:bold;">Trip Hire Chalan </div>
                                <div style="color: #464855;font-size: 15px;">Original Copy</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="barcode" style="padding-right: 5px">

                            </div>
                        </div>
                    </div>
                    <div id="PrintDiv" class="mr-4 ml-4 CommonViewPrint_table">
                        <table id='tblPDF' style="width: 100%;">
                            <tr>
                                <td>
                                    <div>
                                        <table style="width: 100%;">
                                            <tr>
                                                <td colspan="2">
                                                    <div style="color:#8C001A;font-size: 22px;font-weight: bold;"
                                                        class="mb-2">VH/MUMB/2324/000225</div>
                                                    <div style="font-weight: bold;color: #464855;font-size: 18px;">
                                                        Manual ID : 234324</div>
                                                </td>
                                                <td style="font-size: 16px;">
                                                    <span style="margin-right: 40px;">Created</span>
                                                    <span style="margin-right: 43px;font-weight:bold;">04 Oct 23</span>
                                                    <span style="margin-right: 45px;">Origin</span>
                                                    <span
                                                        style="font-weight: bold; text-transform: uppercase;">MUMBAi</span>
                                                    <br />

                                                    <span style="margin-right: 64px;">Mode</span>
                                                    <span style="margin-right: 93px;font-weight:bold;">Road</span>
                                                    <span style="margin-right: 51px;">Dest.</span>
                                                    <span style="font-weight:bold;">PUNE</span>
                                                    <br />
                                                </td>
                                        </table>
                                    </div>
                                    <br />
                                    <div>
                                        <table style="width: 100%;">
                                            <tr>
                                                <td style="background-color: gainsboro" width="29%">
                                                    <table style="font-size:16px; width: 100%;">
                                                        <tr>
                                                            <td>
                                                                <span
                                                                    style="color: #464855;font-size: 16px;font-weight: bold;">
                                                                    <span>Vehicle</span>
                                                                </span>
                                                                <br />
                                                                <span
                                                                    style="color: #8C001A;font-size: 20px;font-weight: bold;">
                                                                    <span>MH47AL0241</span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>Type</span>
                                                                <span style="float:right">Attached</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span> Capacity</span>
                                                                <span style="float:right">60.00</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>Engine No.</span>
                                                                <span style="float:right">123</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>Chassis No.</span>
                                                                <span style="float:right">123</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>Insurance</span>
                                                                <span style="float:right">Valid thru
                                                                    24 Aug 33</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>Fitness Insp.</span>
                                                                <span style="float:right">Valid thru
                                                                    24 Aug 55</span>
                                                            </td>
                                                        </tr>
                                                        <tr style="background-color: #f2f2f2;">
                                                            <td>
                                                                <span> Utilization</span>
                                                                <span style="float:right;">8 %
                                                                    <span>(18.00 MT)</span></span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="border: none;" width="2%"></td>
                                                <td style="border: none;" width="59%">
                                                    <table style="width: 100%; font-size: 16px;border: 2px solid gainsboro;" border="1">
                                                        <div
                                                            style="font-weight: bold; width: 150%; padding: 5px 10px;">
                                                            <span
                                                                style="color: #464855;font-size: 16px;font-weight: bold;">
                                                                Fulfillment
                                                            </span><br />
                                                            <span
                                                                style="color: #8C001A;font-size: 20px;font-weight: bold;">By
                                                                Vendor : V00042:AJ LOGISTICS</span>
                                                        </div>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="border: 1px solid gainsboro; border-bottom: 1px solid #fff;">
                                                                    <span>Contract Amount</span>
                                                                    <span style="float:right">30450.00</span>
                                                                    <br>
                                                                </td>
                                                                <td
                                                                    style="border: 1px solid #fff; border-top: 1px solid gainsboro;">
                                                                    <span>Advance Pay </span>
                                                                    <span style="float:right">
                                                                        5000.00
                                                                    </span>
                                                                    <br />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="border-bottom: 1px solid #fff; border-right: 1px solid gainsboro;">
                                                                    <span>Other Amt (+) </span>
                                                                    <span style="float:right">200.00</span>
                                                                </td>
                                                                <td>
                                                                    <span>
                                                                        <span
                                                                            style="margin-right: 10px;color: #6b6f82;font-size: 16px;">at</span>
                                                                        MUMB
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="border-right: 1px solid gainsboro;">
                                                                    <span>Deductions (-) </span>
                                                                    <span style="float:right">100.00</span><br />
                                                                </td>
                                                                <td style="border: 1px solid white;">
                                                                    <span> Balance Pay </span>
                                                                    <span style="float:right">25345.00</span><br />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="background-color: gainsboro;">
                                                                    <span> Total Amount</span>
                                                                    <span
                                                                        style="font-weight:bold;float:right">30345.00</span><br />
                                                                </td>
                                                                <td>
                                                                    <span><span
                                                                            style="margin-right: 10px;color: #6b6f82;font-size: 16px;">at</span>MUMB</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table style="width: 100%;" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <span style="font-size: 16px;">Driver 1</span><br />
                                                                    <span
                                                                        style="font-size: 16px;font-weight: bold;">Rajesh
                                                                        Singh</span>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        style="font-size: 16px;margin-right: 25px;">Phone</span><span
                                                                        style="font-size: 16px;">1234567890</span><br />
                                                                    <span
                                                                        style="font-size: 16px;margin-right: 12px;">Licence</span>
                                                                    <span style="font-size: 16px;">LNC1234567</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span style="font-size: 16px;">Driver 2</span><br />
                                                                    <span
                                                                        style="font-size: 16px;font-weight: bold;">Rajesh
                                                                        Singh</span>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        style="font-size: 16px;margin-right: 25px;">Phone</span><span
                                                                        style="font-size: 16px;">1234567890</span><br />
                                                                    <span
                                                                        style="font-size: 16px;margin-right: 12px;">Licence</span>
                                                                    <span style="font-size: 16px;">LNC1234567</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <br />
                                    <span style="font-size: 18px;color:#464855;font-weight: bold;">
                                        Movement Summary
                                    </span><br />
                                    <span style="font-size: 20px;color:#8C001A;font-weight: bold;">
                                        S0017:MUMB-PNQB
                                    </span>
                                    <br /><br />

                                    <table style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
                                        <tr style="color:#6b6f82;">
                                            <th>Location</th>
                                            <th>Arrived</th>
                                            <th>Departed</th>
                                            <th>Manifest</th>
                                            <th>CEWB</th>
                                            <th>Utility</th>
                                            <th>CNs</th>
                                            <th>Pcs</th>
                                            <th>Wt-KG</th>
                                        </tr>
                                        <tr style="font-size:16px;">
                                            <td style="font-weight:bold;">MUMB</td>
                                            <td>
                                                <div></div>
                                                <div style="color: red;"></div>
                                            </td>
                                            <td>
                                                <div>04 Oct 23 16:15</div>
                                                <div style="color: Green;">Early: 00:09</div>
                                            </td>
                                            <td>
                                                <div>MF/MUMB/2324/000242</div>
                                                <div style="color: darkgray;"> to PNQB</div>
                                            </td>
                                            <td></td>
                                            <td>-</td>
                                            <td>1</td>
                                            <td>12</td>
                                            <td>5000</td>
                                        </tr>
                                        <tr style="font-size:16px;">
                                            <td style="font-weight:bold;">PNQB</td>
                                            <td>
                                                <div>04 Oct 23 16:30</div>
                                                <div></div>
                                            </td>
                                            <td>
                                                <div></div>
                                                <div style="color: Green;"></div>
                                            </td>
                                            <td>
                                                <div></div>
                                                <div style="color: darkgray;"></div>
                                            </td>
                                            <td></td>
                                            <td>-</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" style="border: none;">
                                            </td>
                                            <td style="background-color:#dcdada;">
                                                Load Summary
                                            </td>
                                            <td style="background-color: #dcdada;font-weight: bold;">
                                                -
                                            </td>
                                            <td style="background-color: #dcdada;font-weight: bold;">
                                                1
                                            </td>
                                            <td style="background-color:#dcdada;font-weight:bold;">
                                                12
                                            </td>
                                            <td style="background-color:#dcdada;font-weight:bold;">
                                                5000
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                    <br />

                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="border: none;" width="50%">
                                                <table style="width: 100%;">
                                                    <tr style="font-size:16px;">
                                                        <td>
                                                            <span style="color:#8C001A;font-weight:bold">Document
                                                                History</span><br />
                                                        </td>
                                                        <td>
                                                            <span>Location</span><br />

                                                        </td>
                                                        <td>
                                                            <span>Updated by</span><br />

                                                        </td>
                                                    </tr>
                                                    <tr style="font-size:16px;">
                                                        <td>
                                                            <span>00:00 Oct 04</span>
                                                        </td>
                                                        <td>
                                                            <span>MUMB</span>
                                                        </td>
                                                        <td>
                                                            <span>AJEET:Ajeet Vishwakarma</span>
                                                        </td>
                                                    </tr>
                                                    <tr style="font-size:16px;">
                                                        <td>
                                                            <span>00:00 Oct 04</span>
                                                        </td>
                                                        <td>
                                                            <span>PNQB</span>
                                                        </td>
                                                        <td>
                                                            <span>AJEET:Ajeet Vishwakarma</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td style="background-color:gainsboro" width="50%">
                                                <table style="width: 100%;">
                                                    <tr style="font-weight: bold;">
                                                        <td style="padding-bottom: 65px;">
                                                            <span>Remarks</span><br />
                                                            <span></span>
                                                        </td>
                                                        <td style="padding-bottom: 65px;">
                                                            <span>Authorizer's Sign</span><br />
                                                            <span></span>
                                                        </td>
                                                        <td style="padding-bottom: 65px;">
                                                            <span>Loader's Sign</span><br />
                                                            <span></span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3">
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  `
  FieldMapping=[]
  JsonData=[]
}
