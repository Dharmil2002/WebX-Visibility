export const GetHtmlTemplate = (array) => {
  return `
      <diev class="westerncarriers"
     style="width: 100%; margin: 0px auto; box-sizing: border-box; font-size: 12px;">
     ${array.map((x) => {
       return `
        <div style="display:flex; flex-direction: column; height: 100%">
  <div style="display: flex;">
    <div class="title" style="width: 75%; border: 1px solid gainsboro;">
      <div class="title_header" style="text-align: center; border:1px solid gainsboro; border-bottom: 2px solid gainsboro;">
        <h1 style="font-weight: 700;">WESTERN CARRIERS(INDIA)LIMITED</h1>
      </div>
      <div style="padding: 5px; font-weight: 500;">
        67/28, STRAND ROAD, KOLKATA-700006, PHONE NO:2259 5634/5635/0897, FAX: (033) 2259 4979
        R.O: 206, CENTRAL PLAZA ,2/6, SARAT BOSE ROAD, KOLKATA-700020,PH: (033)2485 8519/20 FAX: (033) 2485
        8525
      </div>
      <div style="display: flex;">
        <div
          style="border-top: 1px solid gainsboro; padding: 5px; width: 45%; box-sizing: border-box; display: flex;  border-right: 1px solid gainsboro;">
          <p class="m-0 p-0" style=" font-weight: bold;">Email: </p>
          <p class="m-0 p-0 px-1">[Customer_Emails]</p>
        </div>
        <div
          style="border-top: 1px solid gainsboro; padding: 5px; width: 25%; box-sizing: border-box; display: flex;  border-right: 1px solid gainsboro;">
          <p class="m-0 p-0" style=" font-weight: bold;">CIN: </p>
          <p class="m-0 p-0 px-1">[CINnumber]</p>
        </div>
        <div style="border-top: 1px solid gainsboro; padding: 5px; width: 30%; box-sizing: border-box; display: flex;">
          <p class="m-0 p-0" style=" font-weight: bold;">PAN NO: </p>
          <p class="m-0 p-0 px-1">[PANnumber]</p>
        </div>
      </div>
    </div>
    <div style="width: 25%; display: flex; flex-direction: column; justify-content: space-between;">
      <img src='/assets/images/globe.png' width="100%" />
      <div
        style="width: calc(100% - 10px); margin-left: 10px; font-weight: bolder; padding: 5px 0px; border: 2px solid gainsboro; text-align: center;">
        ${x}
      </div>
    </div>
  </div>
  <div style="margin: 10px 0px;">
    <table border="1" style="width: 100%;" class="font-size-12">
      <tr style="width: 100%;">
        <td rowspan="2" style="width: 30%; border: 1px solid black;">
          <p class="m-0 p-0" style="font-weight: bold; font-size: 14px; text-align: center;">
            ADDRESS OF DELIVERY OFFICE
          </p>
        </td>
        <td rowspan="5" class=" m-0 p-0" style="border: 1px solid black;width: 15%;">
          <div>
            <table style="width: 100%;">
              <tr style="width: 100%; ">
                <td class="px-1">BOOKING OFFICE</td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </table>
          </div>
        </td>
        <td class="borde-1" style="width: 25%; border: 1px solid black;">
          <p class="m-0 p-0" style="font-weight: bold; text-align: center;">
            CONSIGNEMENT NOTE
          </p>
        </td>
        <td class="borde-1" style="width: 30%; border: 1px solid black;">
          <div style="display: flex; padding: 0px 5px;">
            <p class="m-0 p-0" style="font-weight: bold;">Invoice No: </p>
            <p class="m-0 p-0 px-1">[invoiceNo]</p>
          </div>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td rowspan="4" class="borde-1" style="width: 25%; border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1"
                style="font-weight: bold; border-bottom: 1px solid black;border-right: 1px solid black;width: 30%;">
                NO.
              </td>
              <td class="px-1" style="width: 70%; border-bottom: 1px solid black;">[docketNumber]</td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1"
                style="font-weight: bold; border-bottom: 1px solid black;border-right: 1px solid black;width: 30%;">
                DATE
              </td>
              <td class="px-1" style="width: 70%; border-bottom: 1px solid black;">[docketDate]</td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1"
                style="font-weight: bold; border-bottom: 1px solid black;border-right: 1px solid black;width: 30%;">
                FROM
              </td>
              <td class="px-1" style="width: 70%; border-bottom: 1px solid black;">[fromCity]</td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="font-weight: bold; border-right: 1px solid black;width: 30%;">
                TO
              </td>
              <td class="px-1" style="width: 70%;">[toCity]</td>
            </tr>
          </table>
        </td>
        <td class="borde-1" style="width: 30%; border: 1px solid black;">
          <div style="display: flex; padding: 0px 5px;">
            <p class="m-0 p-0" style="font-weight: bold;">GST No: </p>
            <p class="m-0 p-0 px-1">[gstNo]</p>
          </div>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td class="borde-1 px-1" style="border: 1px solid black; font-weight: bold; width: 30%;">[deliveryAddress]</td>
        <td class="borde-1" style="border: 1px solid black; width: 30%;">
          <p class="m-0 p-0 px-2" style="font-weight: bold; text-align: right;">GST PAYABLE</p>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td class="borde-1" style="width: 30%; border: 1px solid black;"></td>
        <td rowspan="3" class="borde-1 width-40" style="border: 1px solid black;width: 30%;">
          <table style="width: 100%;">
            <tr style="width: 100%; ">
              <td class="px-1">CONSIGNOR</td>
              <td class="px-1">
                <div style="width: 60px; height: 30px; border: 1px solid rgb(192, 192, 192); border-radius: 5px;">
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1">CONSIGNEE</td>
              <td class="px-1">
                <div style="width: 60px; height: 30px; border: 1px solid rgb(192, 192, 192); border-radius: 5px;">
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1">TRANSPORTER</td>
              <td class="px-1">
                <div style="width: 60px; height: 30px; border: 1px solid rgb(192, 192, 192); border-radius: 5px;">
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td class="borde-1" style="width: 30%;border: 1px solid black;"></td>
      </tr>
      <tr style="width: 100%;">
        <td colspan="3" class="borde-1" style="height: 70px;border: 1px solid black; ">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="height: 25px; width: 40%;">
                <div style="display: flex;">
                  <p style="font-weight: bold;">Consignor's Name:</p>
                  <p class="mx-2">[consignorName]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="border-top: 1px solid black; height: 20px;  width: 40%;">
                <div style="display: flex;">
                  <p style="font-weight: bold;">Consignor's Address:</p>
                  <p class="mx-2">[ccontactNumber]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="height: 30px; font-weight: bold; width: 40%;">
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td colspan="3" rowspan="3" class="borde-1 " style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="height: 25px; ">
                <div style="display: flex;">
                  <p style="font-weight: bold;">Consignee's Name:</p>
                  <p class="mx-2">[consigneeName]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="border-top: 1px solid black; height: 25px;  width: 40%;">
                <div style="display: flex;">
                  <p style="font-weight: bold;">Consignee's Address:</p>
                  <p class="mx-2">[cncontactNumber]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="height: 25px; font-weight: bold; width: 40%;">

              </td>
            </tr>
          </table>
        </td>
        <td class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="width: 40%; border-right: 1px solid black; text-align: left;">
                CONTAINER No.</td>
              <td class="px-1" style="width: 60%;" rowspan="2">[containerDetail.containerNumber]</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="width: 40%; border-right: 1px solid black; text-align: left;">
                SEAL No.</td>
              <td class="px-1" style="width: 60%;" rowspan="2"></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="width: 40%; border-right: 1px solid black; text-align: left;">
                DOP No.</td>
              <td class="px-1" style="width: 60%;" rowspan="2"></td>
            </tr>
          </table>
        </td>
      </tr>

      <tr style="width: 100%;">
        <td class="borde-1 width-50" style="width: 15%;border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="width: 35%; border-right: 1px solid black; text-align: center;">
                Packages</td>
              <td class="px-1" style="width: 65%;" rowspan="2">
                <p style="text-align: center; margin-bottom: 30%;">Description (Said to contain)</p>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td style="border-top: 1px solid black; border-right: 1px solid black;"></td>
            </tr>
          </table>
        </td>
        <td colspan="2" class="borde-1 width-50" style="width: 15%;border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td colspan="3" class="px-1"
                style="width: 50%; border-bottom: 1px solid black; border-right: 1px solid black; text-align: center; font-weight: bold;">
                Declared Weight (SWA)</td>
              <td class="px-1" style="width: 20%; border-right: 1px solid black;" rowspan="2">
                <p style="text-align: center; margin-bottom: 50%;">Rate</p>
              </td>
              <td class="px-1" style="border-bottom: 1px solid black;">Amount</td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style=" border-right: 1px solid black; width: 20%; text-align: center;">Net (KG)
              </td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%; text-align: center;">
                Gross (KG)</td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%; text-align: center;">
                Charged (KG)</td>
              <td class="px-1" style=" width: 20%;"></td>
            </tr>
          </table>
        </td>
        <td class="borde-1 width-50" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="width: 50%; border-bottom: 1px solid black; border-right: 1px solid black;">
                EWAY BILL No.</td>
              <td class="px-1" style="width: 50%; border-bottom: 1px solid black;">[ewayBillNo]</td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1"></td>
            </tr>
          </table>
        </td>
      </tr>

      <tr style="width: 100%;">
        <td class="borde-1 width-100" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style=" border-right: 1px solid rgb(20, 20, 20); width: 35%;">
                [invoiceDetails.noofPkts]</td>
              <td class="px-1" style="width: 65%;">[invoiceDetails.materialName]</td>
            </tr>
          </table>
        </td>
        <td colspan="2" class="borde-1 width-100" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;">
                [invoiceDetails.actualWeight]</td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;">[grossAmount]</td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;">
                [invoiceDetails.chargedWeight]</td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;">[freight_rate] ₹
              </td>
              <td class="px-1" style=" width: 20%;">[totalAmount] ₹</td>
            </tr>
          </table>
        </td>
        <td class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style="border-bottom: 1px solid black; height: 30px; width: 100%;">
                <div style="display: flex;">
                  <p class="px-1">MR No. Date:</p>
                  <p>[docketDate]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="border-bottom: 1px solid black; height: 30px; width: 100%;">
                <div style="display: flex;">
                  <p class="px-1">Bill No. & Date:</p>
                  <p>[docketDate]</p>
                </div>
              </td>
            </tr>
            <tr style="width: 100%;">
              <td class="px-1" style="height: 40px; width: 100%;">
                <div style="display: flex;">
                  <p class="px-1">Instructions:</p>
                  <p></p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr style="width: 100%;">
        <td class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style=" border-right: 1px solid black; width: 35%;"></td>
              <td class="px-1" style="width: 65%;"></td>
            </tr>
          </table>
        </td>
        <td colspan="2" class="borde-1" style="border: 1px solid black;">
          <table style="width: 100%;">
            <tr style="width: 100%;">
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;"></td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;"></td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%;"></td>
              <td class="px-1" style=" border-right: 1px solid black; width: 20%; font-weight: bold;">
                Total</td>
              <td class="px-1" style=" width: 20%;">[totalAmount] ₹</td>
            </tr>
          </table>
        </td>
        <td rowspan="4" class="borde-1 px-1" style="border: 1px solid black;">
          <p style="font-weight: bold; margin-bottom: 50%;">
            PVT. Mark
          </p>
        </td>
      </tr>

      <tr style="width: 100%;">
        <td colspan="3" class="borde-1" style="border-right: none; border: 1px solid black;">
          <div style="display: flex;">
            <p class="px-1">DECLARED VALUES Rs.</p>
            <p class="px-1"></p>
          </div>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td colspan="3" class="borde-1" style="border-right: none; border: 1px solid black;">
          <div style="display: flex;">
            <p class="px-1">TRUCK/TRAILER No.</p>
            <p class="px-1">[vehicleNo]</p>
          </div>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td colspan="3" class="borde-1" style="border-right: none; border: 1px solid black;">
          <div style="display: flex;" class="px-1">
            N.B. I/We have carefully read the conditions of the company stipulated on the consignor's copy which are
            binding on me/us and here by declare that the particulars furnished are correct and correspond to the
            entries our Books of Accounts. It is further noted that the above firm is not common carriers, but
            carriers governed by the conditions of carriage set forth on Consignee's copy.
          </div>
        </td>
      </tr>
    </table>
  </div>
  <div style="display: flex; justify-content: space-between; margin-top: 10px; margin-bottom: 60px;">
    <p style="font-weight: bold;">Signature of Consignor or his Agent</p>
    <p style="font-weight: bold;">For WESTERN CARRIERS (INDIA) LIMITED</p>
  </div>
</div>
        `;
     })}
   </div>
      `;
};

export const FieldMapping = [
  {
    Key: "[Customer_Emails]",
    Value: "Customer_Emails",
  },
  {
    Key: "[CINnumber]",
    Value: "CINnumber",
  },
  {
    Key: "[PANnumber]",
    Value: "PANnumber",
  },
  {
    Key: "[invoiceNo]",
    Value: "invoiceNo",
  },
  {
    Key: "[docketNumber]",
    Value: "docketNumber",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[fromCity]",
    Value: "fromCity",
  },
  {
    Key: "[toCity]",
    Value: "toCity",
  },
  {
    Key: "[gstNo]",
    Value: "gstNo",
  },
  {
    Key: "[deliveryAddress]",
    Value: "deliveryAddress",
  },
  {
    Key: "[consignorName]",
    Value: "consignorName",
  },
  {
    Key: "[ccontactNumber]",
    Value: "ccontactNumber",
  },
  {
    Key: "[consigneeName]",
    Value: "consigneeName",
  },
  {
    Key: "[cncontactNumber]",
    Value: "cncontactNumber",
  },
  {
    Key: "[containerDetail.containerNumber]",
    Value: "containerDetail.containerNumber",
  },
  {
    Key: "[ewayBillNo]",
    Value: "ewayBillNo",
  },
  {
    Key: "[invoiceDetails.noofPkts]",
    Value: "invoiceDetails.noofPkts",
  },
  {
    Key: "[invoiceDetails.materialName]",
    Value: "invoiceDetails.materialName",
  },
  {
    Key: "[invoiceDetails.actualWeight]",
    Value: "invoiceDetails.actualWeight",
  },
  {
    Key: "[grossAmount]",
    Value: "grossAmount",
  },
  {
    Key: "[invoiceDetails.chargedWeight]",
    Value: "invoiceDetails.chargedWeight",
  },
  {
    Key: "[freight_rate]",
    Value: "freight_rate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[vehicleNo]",
    Value: "vehicleNo",
  },

  {
    Key: "[Customer_Emails]",
    Value: "Customer_Emails",
  },
  {
    Key: "[CINnumber]",
    Value: "CINnumber",
  },
  {
    Key: "[PANnumber]",
    Value: "PANnumber",
  },
  {
    Key: "[invoiceNo]",
    Value: "invoiceNo",
  },
  {
    Key: "[docketNumber]",
    Value: "docketNumber",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[fromCity]",
    Value: "fromCity",
  },
  {
    Key: "[toCity]",
    Value: "toCity",
  },
  {
    Key: "[gstNo]",
    Value: "gstNo",
  },
  {
    Key: "[deliveryAddress]",
    Value: "deliveryAddress",
  },
  {
    Key: "[consignorName]",
    Value: "consignorName",
  },
  {
    Key: "[ccontactNumber]",
    Value: "ccontactNumber",
  },
  {
    Key: "[consigneeName]",
    Value: "consigneeName",
  },
  {
    Key: "[cncontactNumber]",
    Value: "cncontactNumber",
  },
  {
    Key: "[containerDetail.containerNumber]",
    Value: "containerDetail.containerNumber",
  },
  {
    Key: "[ewayBillNo]",
    Value: "ewayBillNo",
  },
  {
    Key: "[invoiceDetails.noofPkts]",
    Value: "invoiceDetails.noofPkts",
  },
  {
    Key: "[invoiceDetails.materialName]",
    Value: "invoiceDetails.materialName",
  },
  {
    Key: "[invoiceDetails.actualWeight]",
    Value: "invoiceDetails.actualWeight",
  },
  {
    Key: "[grossAmount]",
    Value: "grossAmount",
  },
  {
    Key: "[invoiceDetails.chargedWeight]",
    Value: "invoiceDetails.chargedWeight",
  },
  {
    Key: "[freight_rate]",
    Value: "freight_rate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[vehicleNo]",
    Value: "vehicleNo",
  },

  {
    Key: "[Customer_Emails]",
    Value: "Customer_Emails",
  },
  {
    Key: "[CINnumber]",
    Value: "CINnumber",
  },
  {
    Key: "[PANnumber]",
    Value: "PANnumber",
  },
  {
    Key: "[invoiceNo]",
    Value: "invoiceNo",
  },
  {
    Key: "[docketNumber]",
    Value: "docketNumber",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[fromCity]",
    Value: "fromCity",
  },
  {
    Key: "[toCity]",
    Value: "toCity",
  },
  {
    Key: "[gstNo]",
    Value: "gstNo",
  },
  {
    Key: "[deliveryAddress]",
    Value: "deliveryAddress",
  },
  {
    Key: "[consignorName]",
    Value: "consignorName",
  },
  {
    Key: "[ccontactNumber]",
    Value: "ccontactNumber",
  },
  {
    Key: "[consigneeName]",
    Value: "consigneeName",
  },
  {
    Key: "[cncontactNumber]",
    Value: "cncontactNumber",
  },
  {
    Key: "[containerDetail.containerNumber]",
    Value: "containerDetail.containerNumber",
  },
  {
    Key: "[ewayBillNo]",
    Value: "ewayBillNo",
  },
  {
    Key: "[invoiceDetails.noofPkts]",
    Value: "invoiceDetails.noofPkts",
  },
  {
    Key: "[invoiceDetails.materialName]",
    Value: "invoiceDetails.materialName",
  },
  {
    Key: "[invoiceDetails.actualWeight]",
    Value: "invoiceDetails.actualWeight",
  },
  {
    Key: "[grossAmount]",
    Value: "grossAmount",
  },
  {
    Key: "[invoiceDetails.chargedWeight]",
    Value: "invoiceDetails.chargedWeight",
  },
  {
    Key: "[freight_rate]",
    Value: "freight_rate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[vehicleNo]",
    Value: "vehicleNo",
  },

  {
    Key: "[Customer_Emails]",
    Value: "Customer_Emails",
  },
  {
    Key: "[CINnumber]",
    Value: "CINnumber",
  },
  {
    Key: "[PANnumber]",
    Value: "PANnumber",
  },
  {
    Key: "[invoiceNo]",
    Value: "invoiceNo",
  },
  {
    Key: "[docketNumber]",
    Value: "docketNumber",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[fromCity]",
    Value: "fromCity",
  },
  {
    Key: "[toCity]",
    Value: "toCity",
  },
  {
    Key: "[gstNo]",
    Value: "gstNo",
  },
  {
    Key: "[deliveryAddress]",
    Value: "deliveryAddress",
  },
  {
    Key: "[consignorName]",
    Value: "consignorName",
  },
  {
    Key: "[ccontactNumber]",
    Value: "ccontactNumber",
  },
  {
    Key: "[consigneeName]",
    Value: "consigneeName",
  },
  {
    Key: "[cncontactNumber]",
    Value: "cncontactNumber",
  },
  {
    Key: "[containerDetail.containerNumber]",
    Value: "containerDetail.containerNumber",
  },
  {
    Key: "[ewayBillNo]",
    Value: "ewayBillNo",
  },
  {
    Key: "[invoiceDetails.noofPkts]",
    Value: "invoiceDetails.noofPkts",
  },
  {
    Key: "[invoiceDetails.materialName]",
    Value: "invoiceDetails.materialName",
  },
  {
    Key: "[invoiceDetails.actualWeight]",
    Value: "invoiceDetails.actualWeight",
  },
  {
    Key: "[grossAmount]",
    Value: "grossAmount",
  },
  {
    Key: "[invoiceDetails.chargedWeight]",
    Value: "invoiceDetails.chargedWeight",
  },
  {
    Key: "[freight_rate]",
    Value: "freight_rate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[vehicleNo]",
    Value: "vehicleNo",
  },

  {
    Key: "[Customer_Emails]",
    Value: "Customer_Emails",
  },
  {
    Key: "[CINnumber]",
    Value: "CINnumber",
  },
  {
    Key: "[PANnumber]",
    Value: "PANnumber",
  },
  {
    Key: "[invoiceNo]",
    Value: "invoiceNo",
  },
  {
    Key: "[docketNumber]",
    Value: "docketNumber",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[fromCity]",
    Value: "fromCity",
  },
  {
    Key: "[toCity]",
    Value: "toCity",
  },
  {
    Key: "[gstNo]",
    Value: "gstNo",
  },
  {
    Key: "[deliveryAddress]",
    Value: "deliveryAddress",
  },
  {
    Key: "[consignorName]",
    Value: "consignorName",
  },
  {
    Key: "[ccontactNumber]",
    Value: "ccontactNumber",
  },
  {
    Key: "[consigneeName]",
    Value: "consigneeName",
  },
  {
    Key: "[cncontactNumber]",
    Value: "cncontactNumber",
  },
  {
    Key: "[containerDetail.containerNumber]",
    Value: "containerDetail.containerNumber",
  },
  {
    Key: "[ewayBillNo]",
    Value: "ewayBillNo",
  },
  {
    Key: "[invoiceDetails.noofPkts]",
    Value: "invoiceDetails.noofPkts",
  },
  {
    Key: "[invoiceDetails.materialName]",
    Value: "invoiceDetails.materialName",
  },
  {
    Key: "[invoiceDetails.actualWeight]",
    Value: "invoiceDetails.actualWeight",
  },
  {
    Key: "[grossAmount]",
    Value: "grossAmount",
  },
  {
    Key: "[invoiceDetails.chargedWeight]",
    Value: "invoiceDetails.chargedWeight",
  },
  {
    Key: "[freight_rate]",
    Value: "freight_rate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[docketDate]",
    Value: "docketDate",
  },
  {
    Key: "[totalAmount]",
    Value: "totalAmount",
  },
  {
    Key: "[vehicleNo]",
    Value: "vehicleNo",
  },
];
