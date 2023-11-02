export const GetHtmlTemplate = () => {
  return `
  <div *ngIf="showView" id="print" style="width: 100%; margin: 0px auto;">
  <div style="width: 100%; margin: 30px 0px; box-sizing: border-box; border: 2px solid gainsboro;">
    <div style="font-weight: bolder; font-size: 1.5rem; border-bottom: 2px solid gainsboro; padding: 10px;">
      Indent
    </div>
    <div style="width: 100%; margin-top: 20px; margin-bottom: 20px; padding: 5px 10px;">
      <table style="width: 100%;" class="font-size-12">
        <tr style="width: 100%;">
          <td style="width: 50%;">
            <div style="width: 50%; display: flex; flex-direction: column; justify-content: space-between;">
              <img src='/assets/images/globe.png' width="100%" />
            </div>
          </td>
          <td style="width: 50%;">
            <p class="m-0 p-3" style="font-weight: bold; font-size: 18px; text-align: right;">
              ABCD111-SURAT
            </p>
          </td>
        </tr>
        <tr style="width: 100%;">
          <td colspan="2">
            <p class="m-0 p-0"
              style="text-transform: uppercase; font-weight: bold; font-size: 18px; text-align: center;">
              Indent View
            </p>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px; border-top: 1px solid gainsboro;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Type</td>
                <td class="px-1" style="width: 50%;">Ad-hoc</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Payment Basis</td>
                <td class="px-1" style="width: 50%;">TBB</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Indent Id</td>
                <td class="px-1" style="width: 50%;">PRQ/12345/2324/00004</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Origin Location</td>
                <td class="px-1" style="width: 50%;">12345 - MUMBAI</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Billing Party</td>
                <td class="px-1" style="width: 50%;">C0030004 - ACCENT
                  INDUSTRIES LTD</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Placement
                  Date & Time</td>
                <td class="px-1" style="width: 50%;">28 Oct 2023 10:18</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Mode </td>
                <td class="px-1" style="width: 50%;">EXPRESS</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Temperature</td>
                <td class="px-1" style="width: 50%;">35 deg</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Service Type</td>
                <td class="px-1" style="width: 50%;">FTL </td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">FTL Type</td>
                <td class="px-1" style="width: 50%;">3 Ton</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">From City</td>
                <td class="px-1" style="width: 50%;">MUMBAI</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">To City</td>
                <td class="px-1" style="width: 50%;">NEW
                  DELHI</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Origin Smart Hub</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Destination
                  Smart Hub</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td colspan="2" class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 100%; font-weight: bolder;">Via City Address Contact
                  Person Contact Number</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">SDD & SDT</td>
                <td class="px-1" style="width: 50%;">27 Oct 2023 10:18 </td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">SDA & STA</td>
                <td class="px-1" style="width: 50%;">27 Oct 2023 10:18</td>
              </tr>
            </table>
          </td>
        </tr>
        ${Customer_detiles()}
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" colspan="2"
            style="width: 100%; border-top: 1px solid gainsboro; border-bottom: 1px solid gainsboro;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1"
                  style="text-transform: uppercase; width: 100%; font-size: 18px; font-weight: bolder; text-align: center;">
                  Special Instruction</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Said to Contain</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Remarks</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Reference
                  /PO/STO/SO
                </td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Business Type</td>
                <td class="px-1" style="width: 50%;">Express-Cargo</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Reference</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Reference/GP No
                </td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Delivery No.</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Purchase Group</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">No. of packages</td>
                <td class="px-1" style="width: 50%;">1</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Pick Up Location</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Contact Email</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Contact Number</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Expected Pick up date</td>
                <td class="px-1" style="width: 50%;">27 Oct 2023</td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Expected Pick up Time</td>
                <td class="px-1" style="width: 50%;"> 10:18 AM </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Payment Details</td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;"></td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Freight Charges</td>
                <td class="px-1" style="width: 50%;">60000.00
                </td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;">Freight
                  Rate</td>
                <td class="px-1" style="width: 50%;">60000.00 Flat(In RS)</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr style="width: 100%; height: 40px;">
          <td class="p-0" style="width: 55%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;"></td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
          <td class="p-0" style="width: 45%;">
            <table style="width: 100%;">
              <tr style="width: 100%;">
                <td class="px-1" style="width: 50%; font-weight: bolder;"></td>
                <td class="px-1" style="width: 50%;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%;">
          <td colspan="2" class="p-0" style="width: 100%;">
            <table border="1" style="width: 100%;">
              <tr data-row="TableData" style="width: 100%; border: 1px solid gainsboro; height: 25px;">
                <td class="px-2" style="width: 35%; border-right: 1px solid gainsboro;">
                  [TableData.title1]
                </td>
                <td class="px-2" style="width: 15%; border-right: 1px solid gainsboro;">0.00 (+)
                </td>
                <td class="px-2" style="width: 35%; border-right: 1px solid gainsboro;">
                  [TableData.title2]
                </td>
                <td class="px-2" style="width: 15%;">0.00 (+)</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%;">
          <td colspan="2" class="p-0" style="width: 100%; font-size: 16px;">
            <table style="width: 100%; margin-top: 20px;">
              <tr style="width: 100%;  height: 25px;">
                <td class="px-2" style="width: 23%; font-weight: bolder;">Total Amount </td>
                <td class="px-2" style="width: 11%;">0.00</td>
                <td class="px-2" style="width: 23%; font-weight: bolder;">
                  Advance Amount
                </td>
                <td class="px-2" style="width: 10%;">
                  00.0
                </td>
                <td class="px-2" style="width: 23%; font-weight: bolder;">
                  Balance Amount
                </td>
                <td class="px-2" style="width: 10%;">
                  00.0
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
    `;
};

export const FieldMapping = [
  {
    Key: "[TableData.title1]",
    Value: "TableData.[#].title1",
  },
  {
    Key: "[TableData.title2]",
    Value: "TableData.[#].title2",
  },
];

export const TableData = [
  {
    title1: "Other Charges",
    title2: "Green tax",
  },
  {
    title1: "Drop Charges",
    title2: "Document Charges",
  },
  {
    title1: "Warehouse Charges",
    title2: "Deduction ",
  },
  {
    title1: "Unloading Charges ",
    title2: "Holiday Service Charges",
  },
  {
    title1: "FOV Charges ",
    title2: "COD/DOD Charges ",
  },
  {
    title1: "Appointment Charges ",
    title2: "ODA Charges ",
  },
  {
    title1: "FuelSurcharge Charges",
    title2: "Loading Charges",
  },
];


const Consignee_Consignor = ()=>{
    return `
    <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%; border-top: 1px solid gainsboro; border-bottom: 1px solid gainsboro;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1"
                                            style="text-transform: uppercase; width: 100%; font-size: 18px; font-weight: bolder; text-align: center;">
                                            Consignor Details</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%; border-top: 1px solid gainsboro; border-bottom: 1px solid gainsboro;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1"
                                            style="text-transform: uppercase; width: 100%; font-size: 18px; font-weight: bolder; text-align: center;">
                                            Consignee Details</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Code</td>
                                        <td class="px-1" style="width: 50%;">Adil Pirwani</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Code</td>
                                        <td class="px-1" style="width: 50%;">Adil Pirwani</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Site Code</td>
                                        <td class="px-1" style="width: 50%;"></td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Site Code</td>
                                        <td class="px-1" style="width: 50%;"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Address</td>
                                        <td class="px-1" style="width: 50%;">WebXpress</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Address</td>
                                        <td class="px-1" style="width: 50%;">WebXpress</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">City</td>
                                        <td class="px-1" style="width: 50%;">Surat</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">City</td>
                                        <td class="px-1" style="width: 50%;">Surat</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Pin Code</td>
                                        <td class="px-1" style="width: 50%;">454545</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Pin Code</td>
                                        <td class="px-1" style="width: 50%;">454545</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Telephone</td>
                                        <td class="px-1" style="width: 50%;"></td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Telephone</td>
                                        <td class="px-1" style="width: 50%;"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">E-Mail</td>
                                        <td class="px-1" style="width: 50%;">dsdsa@gmail.com </td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">E-Mail
                                        </td>
                                        <td class="px-1" style="width: 50%;">dsdsa@gmail.com </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="width: 100%; height: 40px;">
                            <td class="p-0" style="width: 55%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Actual Weight of
                                            Consignment
                                        </td>
                                        <td class="px-1" style="width: 50%;">1.00</td>
                                    </tr>
                                </table>
                            </td>
                            <td class="p-0" style="width: 45%;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%;">
                                        <td class="px-1" style="width: 50%; font-weight: bolder;">Actual Weight
                                            of
                                            Consignment
                                        </td>
                                        <td class="px-1" style="width: 50%;">0.00</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
    `
}


const Customer_detiles = ()=>{
    return `<tr style="width: 100%; height: 40px;">
    <td class="p-0" colspan="2" style="width: 100%; border-top: 1px solid gainsboro; border-bottom: 1px solid gainsboro;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1"
            style="text-transform: uppercase; width: 100%; font-size: 18px; font-weight: bolder; text-align: center;">
            Customer Details</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr style="width: 100%; height: 40px;">
    <td class="p-0" style="width: 55%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Customer Code</td>
          <td class="px-1" style="width: 50%;">Adil Pirwani</td>
        </tr>
      </table>
    </td>
    <td class="p-0" style="width: 45%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Site Code</td>
          <td class="px-1" style="width: 50%;"></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr style="width: 100%; height: 40px;">
    <td class="p-0" style="width: 55%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Address</td>
          <td class="px-1" style="width: 50%;">WebXpress</td>
        </tr>
      </table>
    </td>
    <td class="p-0" style="width: 45%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">City</td>
          <td class="px-1" style="width: 50%;">Surat</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr style="width: 100%; height: 40px;">
    <td class="p-0" style="width: 55%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Pin Code</td>
          <td class="px-1" style="width: 50%;">454545</td>
        </tr>
      </table>
    </td>
    <td class="p-0" style="width: 45%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Telephone</td>
          <td class="px-1" style="width: 50%;"></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr style="width: 100%; height: 40px;">
    <td class="p-0" style="width: 55%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">E-Mail</td>
          <td class="px-1" style="width: 50%;">dsdsa@gmail.com</td>
        </tr>
      </table>
    </td>
    <td class="p-0" style="width: 45%;">
      <table style="width: 100%;">
        <tr style="width: 100%;">
          <td class="px-1" style="width: 50%; font-weight: bolder;">Actual Weight of Consignment</td>
          <td class="px-1" style="width: 50%;">1.00</td>
        </tr>
      </table>
    </td>
  </tr>
`
}
