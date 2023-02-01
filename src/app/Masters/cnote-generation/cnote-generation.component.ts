import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CNOTEDATA } from './Cnote';
@Component({
  selector: 'app-cnote-generation',
  templateUrl: './cnote-generation.component.html'
  
})
export class CNoteGenerationComponent implements OnInit {
 CnoteForm: UntypedFormGroup;
 CnoteData:any;
 option:any;
 PaymentType = [
  { value: 'PAID', label: 'PAID' },
  { value: 'TBB', label: 'TBB' },
  { value: 'TOPAY', label: 'TO PAY' },
  { value: 'FOC', label: 'FOC' }
];
City = [
  { value: 'Navsari', label: 'Navsari' },
  { value: 'Surat', label: 'Surat' },
  { value: 'Delhi', label: 'Delhi' },
];
  breadscrums = [
    {
      title: "CNoteGeneration",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ]
  constructor(private fb: UntypedFormBuilder) { 
    this.CnoteData=CNOTEDATA;
    this.CnoteForm = this.createCustomerForm();
  }

  ngOnInit(): void {
    this.CnoteData.sort((a,b) => (a.loadingSequance - b.loadingSequance));
  }

  createCustomerForm(): UntypedFormGroup {
    return this.fb.group({ 
      VehicleNo:[],
      SpecialInstration:[],
      PRQNO:[],
      SourceCNote:[],
      CnoteDate:[],
      PaymentType:[],
      City:[]
    });}

    callActionFunction(functionName: string,event:any) {
      switch (functionName) {
        case "apicall":
          this.apicall(event);
          break;
        // Add additional cases as needed
        default:
          break;
      }
      
    }
    apicall(event){
      console.log(event);
    }   
}
