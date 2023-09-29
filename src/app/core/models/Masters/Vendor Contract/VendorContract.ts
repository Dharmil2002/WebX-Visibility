export class VendorContract {
  VendorCode: string
  VendorType: string
  VendorTypeCode: string
  VendorName: string
  TripType: string
  IsContractCriteria: boolean
  MovementBy: string;
  ContractTypes: string;
  ContrcatTypesDesc: string;
  ContractCode: string;
  constructor() {
    {
      this.VendorCode = '';
      this.VendorType = '';
      this.VendorName = '';
      this.TripType = ''
      this.MovementBy = '';
      this.ContractTypes = '';
      this.ContrcatTypesDesc = '';
      this.ContractCode = '';
      this.IsContractCriteria = false;
    }
  }
}

export class AddContractProfileModel {
  ContractCode: string;
  VendorCode: string;
  VendorName: string;
  VendorType: string;
  VendorTypeCode: string;
  ContractSigningLocation: string;
  ContractDate: string;
  ValidUntil: string
  EffectiveDateFrom: string;
  VendorRepresentative: string;
  VendorDesignation: string;
  VendorWitness: string;
  VendorAddress: string;
  City: string;
  Pincode: string;
  VendorCategory: string;
  CompanyEmployeeName: string;
  EmployeeDesignation: string;
  CompanyWitness: string;
  ContractCategory: string;
  TDSApplicable: boolean;
  TDSRate: number;
  SecurityDepositCheque: string;
  SecurityDepositDate: string;
  SecurityDepositAmount: number;
  PaymentInterval: string;
  PaymentBasis: string;
  PaymentLocation: string;
  MonthlyPhoneCharges: number;
  ContractAmountCalculateUndeliveryCNote: boolean;
  ContractTypes: string;
  ContractTypeDesc: string;
  DocUrl:string


  constructor(addContractProfile?: AddContractProfileModel) {
    if (addContractProfile) {
      this.ContractCode = addContractProfile.ContractCode ?? '';
      this.VendorCode = addContractProfile.VendorCode ?? '';
      this.VendorName = addContractProfile.VendorName ?? '';
      this.ContractSigningLocation = addContractProfile.ContractSigningLocation ?? '';
      this.ContractDate = addContractProfile.ContractDate ?? '';
      this.ValidUntil = addContractProfile.ValidUntil ?? '';
      this.EffectiveDateFrom = addContractProfile.EffectiveDateFrom ?? '';
      this.VendorRepresentative = addContractProfile.VendorRepresentative ?? '';
      this.VendorDesignation = addContractProfile.VendorDesignation ?? '';
      this.VendorWitness = addContractProfile.VendorWitness ?? '';
      this.VendorAddress = addContractProfile.VendorAddress ?? '';
      this.City = addContractProfile.City ?? '';
      this.Pincode = addContractProfile.Pincode ?? '';
      this.VendorCategory = addContractProfile.VendorCategory ?? '';
      this.CompanyEmployeeName = addContractProfile.CompanyEmployeeName ?? '';
      this.EmployeeDesignation = addContractProfile.EmployeeDesignation ?? '';
      this.CompanyWitness = addContractProfile.CompanyWitness ?? '';
      this.ContractCategory = addContractProfile.ContractCategory ?? '';
      this.TDSApplicable = addContractProfile.TDSApplicable ?? false;
      this.TDSRate = addContractProfile.TDSRate ?? 0.0;
      this.SecurityDepositCheque = addContractProfile.SecurityDepositCheque ?? '';
      this.SecurityDepositDate = addContractProfile.SecurityDepositDate ?? '';
      this.SecurityDepositAmount = addContractProfile.SecurityDepositAmount ?? 0.0;
      this.PaymentInterval = addContractProfile.PaymentInterval ?? '';
      this.PaymentBasis = addContractProfile.PaymentBasis ?? '';
      this.PaymentLocation = addContractProfile.PaymentLocation ?? '';
      this.MonthlyPhoneCharges = addContractProfile.MonthlyPhoneCharges ?? 0.0;
      this.ContractTypes = addContractProfile.ContractTypes ?? ''
      this.ContractTypeDesc = addContractProfile.ContractTypeDesc ?? ''
      this.ContractAmountCalculateUndeliveryCNote = addContractProfile.ContractAmountCalculateUndeliveryCNote ?? false;
      this.VendorType = addContractProfile.VendorType ?? '';
      this.DocUrl=addContractProfile.DocUrl??''
    } else {
      this.ContractCode = '';
      this.VendorCode = '';
      this.VendorName = '';
      this.ContractSigningLocation = '';
      this.ContractDate = '';
      this.ValidUntil = '';
      this.EffectiveDateFrom = '';
      this.VendorRepresentative = '';
      this.VendorDesignation = '';
      this.VendorWitness = '';
      this.VendorAddress = '';
      this.City = '';
      this.Pincode = '';
      this.VendorCategory = '';
      this.CompanyEmployeeName = '';
      this.EmployeeDesignation = '';
      this.CompanyWitness = '';
      this.ContractCategory = '';
      this.TDSApplicable = false;
      this.TDSRate = 0.0;
      this.SecurityDepositCheque = '';
      this.SecurityDepositDate = '';
      this.SecurityDepositAmount = 0.0;
      this.PaymentInterval = '';
      this.PaymentBasis = '';
      this.PaymentLocation = '';
      this.MonthlyPhoneCharges = 0.0;
      this.ContractAmountCalculateUndeliveryCNote = false;
      this.ContractTypes = '';
      this.ContractTypeDesc = '';
      this.VendorType = '';
      this.DocUrl='';
    }
  }

}
export class ChargesDetails {
  CompanyCode: number
  VendorCode: string
  ContractCode: string
  EntryBy: string
  ActionType:string
  ListVendorContractStandardCharges: ListVendorContractStandardCharge[]
}

export class ListVendorContractStandardCharge {
  ChargeCode: string
  ChargeName: string
  Rate: number
  RateType: string
  RateTypeDescription: string
  FTLType: string
  FTLTypeDescription: string
}

/// City Based Details


export class ListVendorContractCityBasedDetails {
  id: number
  companyCode: number
  vendorCode: string
  contractCode: string
  from: string
  to: string
  transMode: string
  ftlType: string
  minimumCharge: number
  maximumCharge: number
  rateType: number
  chargeRate: number
  tripType: string
  vehicleNumber: string
  contractFor: string
  contractForDescription: string
  documentType: string
  matrixType:string
  matrixDescription:string;
  totalRecords: number
  entryBy: string
  entryDate: string
  updateBy: any
  updateDate: any
  constructor() {
    {
      this.id = 0;
      this.entryBy = localStorage.getItem("UserName");
    }
  }
}


export class VendorContractCityBasedRequestModel {
  ActionType: string
  CompanyCode: string
  ListVendorContractCityBasedCharges: ListVendorContractCityBasedDetailsModelCharges[];
  constructor() {
    {
      this.ActionType = 'CITY';
      this.CompanyCode = localStorage.getItem("CompanyCode");
    }
  }

}
export class ListVendorContractCityBasedDetailsModelCharges {
  ID: number;
  VendorCode: string
  ContractCode: string
  From: string
  To: string
  TransMode: string
  FTLType: string
  MinCharge: number
  MaxCharge: number
  RateType: number
  ChargeRate: number
  TripType: string
  VehicleNumber: string
  DocumentType: string
  EntryBy: string
  MatrixType:string
  MatrixDescription:string
}

export class SuccessFailResponse {
  isSuccess: boolean;
  message: string;
}

export class ListVendorContractDistanceBasedDetails {
  CompanyCode:number;
  ID:number;
  VendorCode:string;
  ContractCode:string;
  FTLType:string ;
  FTLTypeDescription:string;
  VehicleNumber:string
  MinimumAmountCommitted: string;
  MaximumAmountCommitted: string;
  CommittedKm: string;
  ChargePerAddKm: string;
  TripType: string;
  TripTypeDescription:string;
  DocumentType:string;
  EntryBy:string;
  TransMode: string;
  TransModeDescription: string;
}
export class VendorContractSummary
{
  
}