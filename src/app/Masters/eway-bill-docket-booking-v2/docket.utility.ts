import { WebxConvert } from "src/app/Utility/commonfunction";

export async function getPincode(companyCode, masterService) {
  const req = {
    companyCode: companyCode,
    collectionName: "pincode_detail",
    filter: {}
  };

  try {
    const res: any = await masterService.masterMongoPost("generic/get",req).toPromise();
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
  // Initialize accumulators for totals
  let totalChargedNoofPackages = 0;
  let totalChargedWeight = 0;
  let totalDeclaredValue = 0;
  let totalActualValue = 0;
  let totalPartQuantity = 0;
  let cftVolume = 0;

  // Loop through the tableData array
  tableData.forEach((x) => {
    // Calculate the cubic feet volume based on dimensions
    const length = x.LENGTH || 0;
    const breadth = x.BREADTH || 0;
    const height = x.HEIGHT || 0;
    const cftRatio = WebxConvert.objectToDecimal(contractForm.controls['cft_ratio']?.value, 0);
    const noPkgs = WebxConvert.objectToDecimal(parseInt(x.NO_PKGS || 0), 0);
    cftVolume = length * breadth * height * cftRatio * noPkgs;

    // Update total charged values
    totalChargedNoofPackages += parseInt(x.NO_PKGS || 0);
    totalChargedWeight += parseFloat(x.ChargedWeight || 0);
    totalDeclaredValue += parseFloat(x.DECLVAL || 0);
    totalActualValue += parseFloat(x.ACT_WT || 0);

    // Update total part quantity if available
    if (x.PARTQUANTITY) {
      totalPartQuantity += x.PARTQUANTITY;
    }
  });

  contractForm.controls["totalChargedNoOfpkg"].setValue(totalChargedNoofPackages);
  contractForm.controls["totalDeclaredValue"].setValue(totalDeclaredValue.toFixed(2));
  contractForm.controls["cft_tot"].setValue(cftVolume);
  contractForm.controls["totalPartQuantity"].setValue(0);
  contractForm.controls["actualwt"].setValue(totalActualValue);
  //TotalPartQuantity calculation parts are pending
}
//Add Docket tracking docket Details

export async function addTracking(companyCode, operationService, data) {
  const dockData = {
    _id:data?.docketNumber,
    dktNo:data?.docketNumber||'',
    vehNo:"",
    route:"",
    event:"Booked At"+" "+localStorage.getItem("Branch"),
    orgn:data?.orgLoc||'',
    loc:localStorage.getItem("Branch"),
    dest:data.destination.split(":")[1].trim(),
    lsno:"",
    mfno:"",
    dlSt:"",
	  dlTm:"",
    evnCd:"",
    upBy:localStorage.getItem("UserName"),
    upDt:new Date().toUTCString()
  }

  const req = {
    companyCode: companyCode,
    collectionName: "cnote_tracking",
    data:dockData
  };

  try {
    const res: any = await operationService.operationMongoPost("generic/create", req).toPromise();
     return res;
  } catch (error) {
    console.error("Error update a docket Status:", error);
    return null;
  }
}

