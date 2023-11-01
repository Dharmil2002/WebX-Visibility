export const GetHtmlTemplate = () => {
    return `
    <div class="form-horizontal THCViewPrint mr-5 ml-5">
    <div class="form" id="print" style="width: 100%; overflow-x: hidden; margin: 0px auto; border: 1px solid #D8DAD9;">
        <div class="form-body">
            <div class="row mt-5">
                <div class="col-md-4">
                    <div class="form-group">
                        <img src='/assets/images/globe.png' height="75"/>
                    </div>
                </div>
                <div class="col-md-4" style="border-left:4px solid #D8DAD9;">
                    <div class="form-group">
                        <div style="font-size: 20px;font-weight:bold;">Trip Hire Chalan </div>
                        <div style="color: #464855;font-size: 17px;">Original Copy</div>
                    </div>
                </div>
                <!-- <div class="col-md-4">
                         <div class="barcode">
                             <img src='/assets/images/barcode.png' height="75" />
                         </div>
                     </div> -->
            </div>
            <div id="PrintDiv" class="mr-4 ml-4 CommonViewPrint_table">
                <table id='tblPDF' style="width: 100%;">
                    <tr>
                        <td>
                            <div>
                                <table style="width: 80%; border: none; margin-right: 70px;">
                                    <tr>
                                        <td style="width: 33%; padding:10px">
                                            <div style="color:#8C001A;font-size: 16px;font-weight: bold;" class="mb-2">
                                                [tripId]</div>
                                        </td>
                                        <td
                                            style="font-size: 16px; text-align: right; width: 33%; padding-right: 15px;">
                                            <div>Created On</div>
                                        </td>
                                        <td style="font-size: 16px; font-weight:bold; text-align: left; width: 33%; padding-right: 15px;">
                                            <div style="white-space: nowrap;">[updateDate] </div>
                                        </td>
                                        <br />
                                        <td
                                            style="font-size: 16px; text-align: right; width: 33%; padding-right: 8px;">
                                            <div>Origin</div>
                                        </td>
                                        <td
                                            style="font-size: 16px; font-weight:bold; text-align: left; width: 33%; padding-right: 15px;">
                                            <div style="white-space: nowrap;">[origin] </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 33%; padding:10px">
                                            <div style="font-size: 16px;font-weight: bold;" class="mb-2">
                                                Manual ID :</div>
                                        </td>
                                        <td
                                            style="font-size: 16px; text-align: right; width: 33%; padding-right: 56px;">
                                            <div>Mode</div>
                                        </td>
                                        <td
                                            style="font-size: 16px; font-weight:bold; text-align: left; width: 33%; padding-left: 5px;">
                                            <div style="white-space: nowrap;">[transMode] </div>
                                        </td>
                                        <br />
                                        <td
                                            style="font-size: 16px; text-align: right; width: 33%; padding-right: 15px;">
                                            <div>Dest</div>
                                        </td>
                                        <td
                                            style="font-size: 16px; font-weight:bold; text-align: left; width: 33%; padding-right: 15px;">
                                            <div style="white-space: nowrap;">[dest] </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <br />
                            <div>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="background-color: gainsboro" width: auto;">
                                            <table style="font-size:16px; width: 100%;">
                                                <tr>
                                                    <td>
                                                        <span style="color: #464855;font-size: 16px;font-weight: bold;">
                                                            <span>Vehicle No.</span>
                                                        </span>
                                                        <br />
                                                        <span style="color: #8C001A;font-size: 16px;font-weight: bold;">
                                                            <span>[vehicle]</span>
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span>Type</span>
                                                        <span style="float:right">[vehicleType]</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span> Capacity</span>
                                                        <span style="float:right">[capacity] MT</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span>Engine No.</span>
                                                        <span style="float:right">[engineNo]</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span>Chassis No.</span>
                                                        <span style="float:right">[chassisNo]</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span>Insurance</span>
                                                        <span style="float:right">Valid: [insuranceExpiryDate] </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span>Fitness Insp.</span>
                                                        <span style="float:right">Valid: [fitnessValidityDate] </span>
                                                    </td>
                                                </tr>
                                                <tr style="background-color: #f2f2f2;">
                                                    <td>
                                                        <span> Utilization</span>
                                                        <span style="float:right;">[weightUtilization] %</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="border: none;" width="2%"></td>
                                        <td style="border: none;" width="59%">
                                            <table style="width: 90%; font-size: 16px;border: 2px solid gainsboro;"
                                                border="1">
                                                <div style="font-weight: bold; width: 150%; padding: 5px 10px;">
                                                    <span style="color: #464855;font-size: 16px;font-weight: bold;">
                                                        Fulfillment
                                                    </span><br />
                                                    <span style="color: #8C001A;font-size: 16x;font-weight: bold;">By
                                                        Vendor : [vendorName]</span>
                                                </div>
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style="border: 1px solid gainsboro; border-bottom: 1px solid #fff;">
                                                            <span>Contract Amount</span>
                                                            <span style="float:right">[contAmt] ₹
                                                            </span>
                                                            <br>
                                                        </td>
                                                        <td
                                                            style="border: 1px solid #fff; border-top: 1px solid gainsboro;">
                                                            <span>Advance Pay </span>
                                                            <span style="float:right">[advAmt] ₹

                                                            </span>
                                                            <br />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style="border-bottom: 1px solid #fff; border-right: 1px solid gainsboro;">
                                                            <span>Other Amt (+) </span>
                                                            <span style="float:right">[otherAmount] ₹</span>
                                                        </td>
                                                        <td
                                                            style="border: 1px solid #fff; border-top: 1px solid gainsboro;">
                                                            <span>at [origin] </span>
                                                            <span style="float:right">

                                                            </span>
                                                            <br />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="border-right: 1px solid gainsboro;">
                                                            <span>Deductions (-) </span>
                                                            <span style="float:right">[Deductions] ₹</span><br />
                                                        </td>
                                                        <td style="border: 1px solid white;">
                                                            <span> Balance Pay </span>
                                                            <span style="float:right">[balAmt] ₹</span><br />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: gainsboro;">
                                                            <span> Total Amount</span>
                                                            <span style="font-weight:bold;float:right"> [contAmt]
                                                                ₹</span><br />
                                                        </td>
                                                        <td
                                                            style="border: 1px solid #fff; border-top: 1px solid gainsboro;">
                                                            <span>at [origin]</span>
                                                            <span style="float:right">

                                                            </span>
                                                            <br />
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
                                                                style="font-size: 16px;font-weight: bold;">[driverName]</span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                style="font-size: 16px;margin-right: 25px;">Phone</span><span
                                                                style="font-size: 16px;">[driverMno]</span><br />
                                                            <span
                                                                style="font-size: 16px;margin-right: 12px;">Licence</span>
                                                            <span style="font-size: 16px;">[driverLno]</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style="font-size: 16px;">Driver 2</span><br />
                                                            <span
                                                                style="font-size: 16px;font-weight: bold;">[Driver2.Name]
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                style="font-size: 16px;margin-right: 25px;">Phone</span><span
                                                                style="font-size: 16px;">[Driver2.Phone] </span><br />
                                                            <span
                                                                style="font-size: 16px;margin-right: 12px;">Licence</span>
                                                            <span style="font-size: 16px;">[Driver2.Licence]</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <br />
                            <span style="font-size: 16px;color:#464855;font-weight: bold;">Movement Summary</span><br />
                            <span
                                style="font-size: 15px;color:#8C001A; text-transform: uppercase; font-weight: bold;">[route]</span>
                            <br /><br />

                            <table style="font-size: 16px; width: 100%;" border="0" cellpadding="0" cellspacing="0">
                                <tr style="color:#6b6f82; font-size: 15px;">
                                    <th>Location</th>
                                    <th>Departed</th>
                                    <th>ETA</th>
                                    <th>Manifest</th>
                                    <th>CEWB</th>
                                    <th>Utility</th>
                                    <th>CNs</th>
                                    <th>Pcs</th>
                                    <th>Wt-KG</th>
                                </tr>
                                <tr style="font-size:15px;">
                                    <td style="font-weight:bold; text-transform: uppercase;">[origin]</td>
                                    <td>
                                        <div style="color: red;">[Departed]</div>
                                    </td>
                                    <td>
                                        <div></div>
                                    </td>
                                    <td>
                                        <div>[Manifest]</div>
                                    </td>
                                    <td></td>
                                    <td>[Utility]</td>
                                    <td>[CNs]</td>
                                    <td>[noofPkts]</td>
                                    <td>[loadedKg]</td>
                                </tr>
                                <tr style="font-size:15px;">
                                    <td style="font-weight:bold; text-transform: uppercase;">[dest]</td>
                                    <td>
                                        <div></div>
                                    </td>
                                    <td>[ETA]</td>
                                    <td>
                                        <div></div>
                                    </td>
                                    <td></td>
                                    <td> </td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="border: none;">
                                    </td>
                                    <td style="font-size: 16px; background-color:#dcdada;">
                                        Load Summary
                                    </td>
                                    <td style="font-size: 15px; background-color: #dcdada;font-weight: bold;">[Utility]
                                    </td>
                                    <td style="font-size: 15px; background-color: #dcdada;font-weight: bold;">[CNs]
                                    </td>
                                    <td style="font-size: 15px; background-color:#dcdada;font-weight:bold;">[noofPkts]
                                    </td>
                                    <td style="font-size: 15px; background-color:#dcdada;font-weight:bold;">
                                        [loadedKg]</td>
                                </tr>
                            </table>
                            <br />
                            <br />

                            <table style="width: 100%;">
                                <tr>
                                    <td style="border: none;" width="50%">
                                        <table style="text-align: left; width: 100%;">
                                            <tr style="font-size: 16px">
                                                <td><span style="color:#8C001A;font-weight:bold">Document
                                                        History</span><br /></td>
                                                <td><span>Location</span><br /></td>
                                                <td><span>Updated by</span><br /></td>
                                            </tr>
                                            <tr style="font-size: 16px">
                                                <td><span>[updateDate]</span>
                                                </td>
                                                <td><span>[origin]</span></td>
                                                <td><span></span>[updateBy]</td>
                                            </tr>
                                            <tr style="font-size: 16px">
                                                <td><span> </span></td>
                                                <td><span> </span></td>
                                                <td><span> </span></td>
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
                                                    <span>Authorizer's Sign</span><br /><span></span>
                                                </td>
                                                <td style="padding-bottom: 65px;">
                                                    <span>Loader's Sign</span><br /><span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="3"></td>
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
    <!-- <div style="display: flex; justify-content: center; padding-bottom: 20px;">
         <button mat-raised-button color="primary" printSectionId="print" [useExistingCss]="true" ngxPrint>
             <i class="fas fa-print msr-2"></i>Print</button>
     </div> -->
</div>
     `;
};
export const FieldMapping = [
    {
        Key: "[contAmt]",
        Value: "contAmt",
    },
    {
        Key: "[Utility]",
        Value: "Utility",
    },
    {
        Key: "[Utility]",
        Value: "Utility",
    },
    {
        Key: "[Driver2.Licence]",
        Value: "Driver2.Licence",
    },
    {
        Key: "[Driver2.Name]",
        Value: "Driver2.Name",
    },
    {
        Key: "[Driver2.Phone]",
        Value: "Driver2.Phone",
    },
    {
        Key: "[CEWB]",
        Value: "CEWB",
    },
    {
        Key: "[Manifest]",
        Value: "Manifest",
    },
    {
        Key: "[tripId]",
        Value: "tripId",
    },
    {
        Key: "[Departed]",
        Value: "Departed",
    },
    {
        Key: "[updateDate]",
        Value: "updateDate",
    },
    {
        Key: "[updateDate]",
        Value: "updateDate",
    },
    {
        Key: "[origin]",
        Value: "origin",
    },
    {
        Key: "[transMode]",
        Value: "transMode",
    },
    {
        Key: "[dest]",
        Value: "dest",
    },
    {
        Key: "[dest]",
        Value: "dest",
    },
    {
        Key: "[vehicle]",
        Value: "vehicle",
    },
    {
        Key: "[noofPkts]",
        Value: "noofPkts",
    },
    {
        Key: "[noofPkts]",
        Value: "noofPkts",
    },
    {
        Key: "[vehicleType]",
        Value: "vehicleType",
    },
    {
        Key: "[capacity]",
        Value: "capacity",
    },
    {
        Key: "[engineNo]",
        Value: "engineNo",
    },
    {
        Key: "[chassisNo]",
        Value: "chassisNo",
    },
    {
        Key: "[insuranceExpiryDate]",
        Value: "insuranceExpiryDate",
    },
    {
        Key: "[fitnessValidityDate]",
        Value: "fitnessValidityDate",
    },
    {
        Key: "[weightUtilization]",
        Value: "weightUtilization",
    },
    {
        Key: "[vendorName]",
        Value: "vendorName",
    },
    {
        Key: "[contAmt]",
        Value: "contAmt",
    },
    {
        Key: "[advAmt]",
        Value: "advAmt",
    },
    {
        Key: "[otherAmount]",
        Value: "otherAmount",
    },
    {
        Key: "[origin]",
        Value: "origin",
    },
    {
        Key: "[origin]",
        Value: "origin",
    },
    {
        Key: "[origin]",
        Value: "origin",
    },
    {
        Key: "[origin]",
        Value: "origin",
    },
    {
        Key: "[Deductions]",
        Value: "Deductions",
    },
    {
        Key: "[balAmt]",
        Value: "balAmt",
    },
    {
        Key: "[Total Amount]",
        Value: "Total Amount",
    },
    {
        Key: "[at]",
        Value: "origin",
    },
    {
        Key: "[driverName]",
        Value: "driverName",
    },
    {
        Key: "[driverMno]",
        Value: "driverMno",
    },
    {
        Key: "[driverLno]",
        Value: "driverLno",
    },
    {
        Key: "[route]",
        Value: "route",
    },
    {
        Key: "[closingBranch]",
        Value: "closingBranch",
    },
    {
        Key: "[updateBy]",
        Value: "updateBy",
    },
    {
        Key: "[loadedKg]",
        Value: "loadedKg",
    },
    {
        Key: "[loadedKg]",
        Value: "loadedKg",
    },
    {
        Key: "[chargedWeight]",
        Value: "chargedWeight",
    },
    {
        Key: "[ETA]",
        Value: "ETA",
    },
    {
        Key: "[CNs]",
        Value: "CNs",
    },
    {
        Key: "[CNs]",
        Value: "CNs",
    },
    {
        Key: "[length]",
        Value: "length",
    },
    {
        Key: "[Updatedby]",
        Value: "Updatedby",
    },
];
