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

}


export class Rules {
   code: string;
   description: string;
   defaultvalue: string;
}



export class AutoCompleteCommon {
   constructor(public CodeId: string, public CodeDesc: string) { }
}