export class VendorBillEntry {
  companyCode: number;
  docType?: string;
  branch?: string;
  finYear?: string;
  data: {
    // companyCode: number;
    cID: number;
    docNo?: string;
    bDT?: Date;
    lOC?: string;
    sT?: string;
    gSTIN?: string;
    vND: {
      cD?: string;
      nM?: string;
      pAN?: string;
      aDD?: string;
      mOB?: string;
      eML?: string;
      gSTREG?: boolean;
      sT?: string;
      gSTIN?: string;
    };
    tHCAMT?: number;
    aDVAMT?: number;
    bALAMT?: number;
    rOUNOFFAMT?: number;
    bALPBAMT?: number;
    bSTAT?: number;
    bSTATNM?: string;
    tDS?: {
      eXMT?: boolean;
      sEC?: string;
      sECD?: string;
      rATE?: number;
      aMT?: number;
    };
    gST?: {
      sAC?: string;
      sACNM?: string;
      tYP?: string;
      rATE?: number;
      iGRT?: number;
      cGRT?: number;
      uGRT?: number;
      sGRT?: number;
      iGST?: number;
      uGST?: number;
      cGST?: number;
      sGST?: number;
      aMT?: number;
    };
    // cNL?: boolean;
    // cNLDT?: Date;
    // cNBY?: string;
    // cNRES?: string;
    eNTDT?: Date;
    eNTLOC?: string;
    eNTBY?: string;
    // mODDT?: Date;
    // mODLOC?: string;
    // mODBY?: string;
  };
  BillDetails?: Vendbilldetails[];
}
export class Vendbilldetails {
  _id: string;
  cID: number;
  bILLNO?: string;
  tRIPNO?: string;
  tTYP?: string;
  aDVAMT?: number;
  pENDBALAMT?: number;
  bALAMT?: number;
  tHCAMT?: number;
  eNTDT?: Date;
  eNTLOC?: string;
  eNTBY?: string;
  mODDT?: string;
  mODLOC?: string;
  mODBY?: string;
}

export class Vendbillpayment {
  _id: string;
  cID: number;
  bILLNO?: string;
  vUCHNO?: string;
  lOC?: string;
  dTM?: Date;
  bILLAMT?: number;
  pAYAMT?: number;
  pENDBALAMT?: number;
  aMT?: number;
  mOD?: string;
  bANK?: string;
  tRNO?: string;
  tDT?: Date;
  // bY?: string;
  eNTDT?: Date;
  eNTLOC?: string;
  eNTBY?: string;
  mODDT?: string;
  mODLOC?: string;
  mODBY?: string;
}

// Example usage
const vendorBillEntry: VendorBillEntry = {
  companyCode: 123,
  docType: "VendBill",
  branch: "Mumbai",
  finYear: "2024",
  data: {
    // companyCode: 123,
    cID: 10065,
    docNo: "VB/2024/MUMB/000001",
    bDT: new Date("2023-12-06T12:30:00.000Z"),
    lOC: "LocationXYZ",
    sT: "StateABC",
    gSTIN: "GSTIN123",
    vND: {
      cD: "VendorCode123",
      nM: "VendorNameXYZ",
      pAN: "PAN123",
      aDD: "VendorAddressXYZ",
      mOB: "9876543210",
      eML: "vendor@example.com",
      gSTREG: true,
      sT: "StateXYZ",
      gSTIN: "GSTIN456",
    },
    tHCAMT: 100.50,
    aDVAMT: 50.25,
    bALAMT: 200.75,
    rOUNOFFAMT: 0.25,
    bALPBAMT: 150.50,
    bSTAT: 1,
    bSTATNM: "Generated",
    tDS: {
      eXMT: false,
      sEC: "TDS001",
      sECD: "TDSDescription",
      rATE: 2.50,
      aMT: 5.00,
    },
    gST: {
      sAC: "SAC001",
      sACNM: "SACDescription",
      tYP: "SGST",
      rATE: 5.00,
      iGRT: 0.00,
      cGRT: 2.50,
      sGRT: 2.50,
      iGST: 0.00,
      cGST: 25.25,
      sGST: 25.25,
      aMT: 50.50,
    },
    // cNL: false,
    //  cNLDT: new Date("2023-01-25T04:05:29.012Z"),
    // cNBY: "CreatedByXYZ",
    // cNRES: "ReasonXYZ",
    eNTDT: new Date("2023-10-20T04:05:29.012Z"),
    eNTLOC: "DELB",
    eNTBY: "Dhaval",
    // mODDT: new Date("2023-10-20T04:05:29.012Z"),
    // mODLOC: "MUMB",
    // mODBY: "Dhaval",
  },
};

// Example usage of validating a JSON object against the model
const validateVendorBillEntry = (data: VendorBillEntry): void => {
  // Your validation logic here
  // Example: Check if required fields are present
  if (!data.companyCode || !data.data.cID) {
    throw new Error("Invalid data format");
  }
};

// Validate the example entry
validateVendorBillEntry(vendorBillEntry);


export class GenerateVendorBill {
  companyCode: number;
  VocuherNo: string;
  paymentMode: string;
  refNo: string;
  accountName: string;
  date: Date;
  paymentAmount: number;
  branch: string;
  user: string;
  BillList?: BillList[];
}

export class BillList {
  billNo: string;
  // TotalTHCAmount: number;
  // AdvancePayedAmount: number;
  // billAmount: number;
  PaymentAmount: number;
  // PendingAmount: number;
  ispartial: boolean;

}
