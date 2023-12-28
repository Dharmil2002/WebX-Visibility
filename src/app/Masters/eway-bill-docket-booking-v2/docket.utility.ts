import { FormGroup } from "@angular/forms";
import { WebxConvert } from "src/app/Utility/commonfunction";

export async function getPincode(companyCode, masterService) {
  const req = {
    companyCode: companyCode,
    collectionName: "pincode_detail",
    filter: {}
  };

  try {
    const res: any = await masterService.masterMongoPost("generic/get", req).toPromise();
    if (res && res.data) {
      const pincode = res.data
        .map((x) => ({ name: `${x.pincode}`, value: `${x.pincode}` }))
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
    dktNo: data?.docketNumber || '',
    vehNo: "",
    route: "",
    event: "Booked At" + " " + localStorage.getItem("Branch"),
    orgn: data?.orgLoc || '',
    loc: localStorage.getItem("Branch"),
    dest: data.destination.trim(),
    lsno: "",
    mfno: "",
    dlSt: "",
    dlTm: "",
    evnCd: "",
    upBy: localStorage.getItem("UserName"),
    upDt: new Date()
  }

  const req = {
    companyCode: companyCode,
    collectionName: "cnote_tracking",
    data: dockData
  };

  try {
    const res: any = await operationService.operationMongoPost("generic/create", req).toPromise();
    return res;
  } catch (error) {
    console.error("Error update a docket Status:", error);
    return null;
  }
}

export const columnHeader = {
  // srNo: {
  //   Title: "#",
  //   class: "matcolumncenter",
  //   Style: "max-width:4%",
  // },
  INVNO: {
    Title: "Invoice No.",
    class: "matcolumncenter",
    Style: "min-width:9%",
  },
  INVDT: {
    Title: "Invoice Date",
    class: "matcolumncenter",
    Style: "min-width:10%",
  },
  // LENGTH: {
  //   Title: "Len(CM)",
  //   class: "matcolumncenter",
  //   Style: "min-width:7%",
  // },
  // BREADTH: {
  //   Title: "B(CM)",
  //   class: "matcolumncenter",
  //   Style: "min-width:7%",
  // },
  // HEIGHT: {
  //   Title: "Ht(CM)",
  //   class: "matcolumncenter",
  //   Style: "min-width:7%",
  // },
  DECLVAL: {
    Title: "Declared Value",
    class: "matcolumncenter",
    Style: "min-width:10%",
  },
  NO_PKGS: {
    Title: "Pkgs",
    class: "matcolumncenter",
    Style: "min-width:7%",
  },
  CUB_WT: {
    Title: "Weight",
    class: "matcolumncenter",
    Style: "min-width:7%",
  },
  ACT_WT: {
    Title: "Actual Weight (KG)",
    class: "matcolumncenter",
    Style: "min-width:7%",
  },
  Invoice_Product: {
    Title: "Product",
    class: "matcolumncenter",
    Style: "min-width:7%",
  },
  HSN_CODE: {
    Title: "HSN Code",
    class: "matcolumncenter",
    Style: "min-width:7%",
  },
  actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:7%",
  }
};

export const staticField = ["srNo", "INVNO", "INVDT", "LENGTH", "BREADTH", "HEIGHT", "DECLVAL", "NO_PKGS", "CUB_WT", "ACT_WT", "Invoice_Product", "HSN_CODE"];

/**
 * Checks if all required fields in a given form group are filled.
 * @param formGroup The form group to be checked.
 * @returns A boolean indicating whether all required fields are filled (true) or not (false).
 */
export function checkRequiredFields(formGroup: FormGroup): boolean {
  let isValid = true;
  // Iterate through each control in the form group
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    // Check if the control has errors and is a required field
    if (control?.errors && control.errors.required) {
      // If the control is required and empty, set the validity to false
      isValid = isValid && !control.errors.required;
    }
  });
  return isValid;
}