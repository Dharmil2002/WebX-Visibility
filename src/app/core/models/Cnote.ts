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
   filteredOptions: Observable<AutoCompleteCity[]>;
}


export class Rules {
   code: string;
   description: string;
   defaultvalue: string;
   paybas: string;
}

export class AutocompleteField {
   formControlName: string;
   autocomplete: string;
   filteredOptions: Observable<string[]>;
 }

export class AutoCompleteCommon {
   constructor(public CodeId: string, public CodeDesc: string) { }
}
export class AutoCompleteCity{
  constructor(public Value:string,
   public Name:string,
   public LOCATIONS:string,
   public CITY_CODE:string,
   public codedesc:string,
   public PincodeZoneId: string,
   public Area: string,
   public PincodeZoneLocation: string,
   public LocCity: string,
   public pincode: string,
   public loccode: string){

  }
  
}

 export class ContractDetailList {
       ContractId: string;
       CustCode: string;
       Contract_Stdate: Date;
       Contract_Eddate: Date;
       custcat: string;
       Contract_Type: string;
   }
