import { Observable } from "rxjs";

export class Cnote {
   Seq: number;
   label: string;
   name: string;
   type: string;
   dropdown: any;
   ActionFunction: string;
   Validation: string;
   frmgrp: string;
   display: boolean;
   enable: boolean;
   defaultvalue: any;
   dbCodeName:any;
   autocomplete:string;
   Search:string;
   div:string;
   useField:string;
   Class:string;
   filteredOptions: Observable<AutoCompleteCity[]>;
}


export class Rules {
   code: string;
   description: string;
   defaultvalue: string;
   paybas: string;
   enabled:string;
}
export class Dropdown{
   CodeId:string;
   CodeDesc:string;
}
export class AutocompleteField {
   formControlName: string;
   autocomplete: string;
   filteredOptions: Observable<string[]>;
 }

export class AutoCompleteCommon {
   constructor(public Value: string, public Name: string) { }
}
export class AutoCompleteCity{
  constructor(
   public Value:string,
   public Name:string,
   public LOCATIONS:string,
   public CITY_CODE:string,
   public codedesc:string,
   public PincodeZoneId: string,
   public Area: string,
   public PincodeZoneLocation: string,
   public LocCity: string,
   public pincode: string,
   public loccode: string)
   {

  }
  
}

export interface multiPickUp {
   PL_PARTNER?: any;
   DocketNumber: string;
}
export interface Radio{
   label:string;
   value:string;
   name:string;
}
   export interface prqVehicleReq {
       CompanyCode: number;
       PRQVehicleRequestNo: string;
       BranchCode: string;
       PRQNO: string;
       VehicleNo: string;
       SmartHubLocationCode: string;
       Driver1Code: number;
       Driver2Code: number;
       Driver1Name: string;
       Driver2Name: string;
       PARTY_CODE: string;
       PARTYNAME: string;
       CSGNADDRCD: string;
       CSGNADDR: string;
       CSGEADDRCD: string;
       CSGEADDR: string;
       PKGSNO: number;
       ATUWT: number;
       TEMPERATURE: string;
       FROMCITY: string;
       TOCITY: string;
       Destcd: string;
       CSGECD: string;
       CSGENM: string;
       TransModeValue: string;
       TransModeName: string;
       FTLName: string;
       FTLValue: string;
       PoNo: string;
       PkgQty: string;
       TotalWeight_Kgs: string;
       DeclaredValue: string;
       EmailIDS: string;
       MobileNo: string;
       CSGNTeleNo: string;
       CSGNEmail: string;
       CSGETeleNo: string;
       CSGEEmail: string;
       CSGNCD: string;
       CSGNNM: string;
       Paybas: string;
       FromPincode: string;
       DestDeliveryPinCode: string;
       DeliveryArea: string;
       ToPincode: number;
       service_class: string;
       pkp_dly: string;
       FTLType: string;
       FTLTypeValue: string;
       pkgsty: string;
       prodcd: string;
       Freight: number;
       ContractId: string;
   }




 export class ContractDetailList {
       ContractId: string;
       CustCode: string;
       Contract_Stdate: Date;
       Contract_Eddate: Date;
       custcat: string;
       Contract_Type: string;
   }
   export class DocketChargeRequest {
      CHANNEL_TYPE_ID: string;
      PAY_BASIS: string;
      CUSTOMER_ID: string;
      BOOKING_DATE: string;
      BOOKING_TIME: string;
      SERVICE: string;
      BOOKING_TYPE: string;
      CHARGE_WEIGHT: number;
      NO_OF_PIECES: number;
      FOD_AMOUNT: number;
      COD_AMOUNT: number;
      CONSIGNER_GSTNUMBER: string;
      CONSIGNEE_GSTNUMBER: string;
      INSURED: string;
      INSURED_BY: string;
      BRNCH_OFF: string;
      INV_VALUE: number;
      DEST_PINCODE: string;
      APP_BOOKING: string;
      SBU: string;
      DEST_BRANCH: string;
      DOCUMENT_CODE: string;
      VAS_PROD_CODE: string;
      RATE_CUST_CODE: string;
      DACC: string;
      CONSGMNT_STATUS: string;
  }
  export class RequestContractKeys {
   companyCode: number
   ContractKeys: ContractKeys
   constructor() {
      this.ContractKeys = new ContractKeys();
    }
 }
 
 export class ContractKeys {
   CompanyCode: number
   BasedOn1: string
   BaseCode1: string
   BasedOn2: string
   BaseCode2: string
   ChargedWeight: string
   ContractID: string
   DelLoc: string
   Depth: string
   FromCity: string
   FTLType: string
   NoOfPkgs: string
   Quantity: number
   OrgnLoc: string
   PayBase: string
   ServiceType: string
   ToCity: string
   TransMode: string
   OrderID: string
   InvAmt: string
   DeliveryZone: number
   DestDeliveryPinCode: number
   DestDeliveryArea: string
   DocketDate: string
   TRDays: number
   FlagDeferment:boolean
 }
 export class DocketOtherChargesCriteria {
   ChargeRule: string;
   ChargeType: string;
   CompanyCode: number;
   BasedOn1: string;
   BaseCode1: string;
   BasedOn2: string;
   BaseCode2: string;
   ContractID: string;
   FromCity: string;
   ToCity: string;
   FromPincode: string;
   ToPincode: string;
   OrgnLoc: string;
   DelLoc: string;
   PayBase: string;
   ServiceType: string;
   FTLType: string;
   TransMode: string;
   ProdType: string;
   PackType: string;
   FlagMultiPickUp: string;
   FlagMultiDelivery: string;
   RiskType: string;
   ChargedWeight: number;
   NoOfPkgs: number;
   DeclaredValue: number;
   FreightCharge: number;
   DocketDate: string;
   InvokeFor: string;
   FuelRateMethod: string;
   Distance: number;
   AvgSpeed: number;
   AbsoluteRate: number;
   ThresHold: number;
   FreightChargePercentage: number;
   FromCityFuelPrice: number;
   ToCityFuelPrice: number;
   ContractedFuelRate: number;
   DestDeliveryPinCode: string;
   DocketNo: string;
   IsDocketEdit: string;
   InvokeNewContract: string;
   ChargedKM: number;
   IsAppointmentBasedDelivery: string;
   IsMallBasedDelivery: string;
   IsCSDBasedDelivery: string;
   Depth: string;
   Quantity: number;
}
export class FOVCharge {
   CompanyCode: number;
   FlagFOV: string;
   ContractId: string;
   ChargeRule: string;
   BaseCode: string;
   RiskType: string;
   FOVRateType: string;
   DeclareValue: number;
   FOVCharged: number;
   FOVRate: number;
}
export class FuelCharge {
   ContractID: string;
   TransMode: string;
   FuelRateType: string;
   FuelRate: number;
   MinFuleCharge: number;
   MaxFuelCharge: number;
   RevisionRate: number;
   FuelRateMethod: string;
   AbsoluteRate: number;
   ThresHold: number;
   FreightChargePercentage: number;
   Distance: number;
   AvgSpeed: number;
   FromCityFuelPrice: number;
   ToCityFuelPrice: number;
}
export class DocketCharges {
   ChargeCode: string;
   ChargeName: string;
   ChargeValue: number;
   Operator: string;
   Enabled: string;
   ActiveFlag: string;
   VarybyLoc: string;
}
export class Employee {  
   photo: string;  
   name: string;  
   email: string;  
   address: string;  
   dob: string;  
   gender: string;  
}  