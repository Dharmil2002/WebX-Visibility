export async function getPincode(companyCode, masterService) {
    const req = {
      companyCode: companyCode,
      type: "masters",
      collection: "pincode_detail",
    };
  
    try {
      const res: any = await masterService.masterPost("common/getall", req).toPromise();
      if (res && res.data) {
        const pincode = res.data
          .map((x) => ({ name: x.pincode, value: x.pincode }))
          .filter((x) => x.name !== undefined && x.value !== undefined);
        return pincode;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching pincode:", error);
      return null;
    }
  }
// invoiceUtils.ts

export function calculateInvoiceTotalCommon(tableData, contractForm) {
    let totalChargedNoofPackages = 0;
    let totalChargedWeight = 0;
    let totalDeclaredValue = 0;
    let totalActualValue = 0;
    let cftTotal = 0;
    let totalPartQuantity = 0;
  
    tableData.forEach((x) => {
      totalChargedNoofPackages =
        totalChargedNoofPackages + parseInt(x.NO_PKGS || 0);
      totalChargedWeight = totalChargedWeight + parseFloat(x.ChargedWeight || 0);
      totalDeclaredValue = totalDeclaredValue + parseFloat(x.DECLVAL || 0);
      totalActualValue = totalActualValue + parseFloat(x.ACT_WT || 0);
      if (x.PARTQUANTITY) {
        totalPartQuantity = totalPartQuantity + x.PARTQUANTITY;
      }
    });
  
    contractForm.controls["totalChargedNoOfpkg"].setValue(totalChargedNoofPackages);
    contractForm.controls["chrgwt"].setValue(totalChargedWeight.toFixed(2));
    contractForm.controls["totalDeclaredValue"].setValue(totalDeclaredValue.toFixed(2));
    contractForm.controls["cft_tot"].setValue(cftTotal);
    contractForm.controls["totalPartQuantity"].setValue(0);
    contractForm.controls["actualwt"].setValue(totalActualValue);
    //TotalPartQuantity calculation parts are pending
  }
    