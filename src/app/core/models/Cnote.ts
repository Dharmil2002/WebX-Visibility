import { Observable } from "rxjs";

export interface Cnote {
   Seq: number;
   label: string;
   name: string;
   type: string;
   dropdown: any;
   ActionFunction: string;
   validation: string;
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
